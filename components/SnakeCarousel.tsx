"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Snake carousel (reference: Jesper Landberg). Landscape cards bend like one wavy ribbon in perspective.
// Each card is ONE continuous curved surface drawn on the graphics card (WebGL): no slicing, so no vertical seams.
// The ribbon moves only when the visitor acts: page scroll while it is on screen, the arrows, or a sideways drag.
// The card in the centre works as a menu item: its label shows the Art section, a tap opens that section.
// A tap on a side card only brings it to the centre.
type Card = { title: string; href?: string; image?: string };
const CARDS: Card[] = [
  { title: "Food & Restaurants", href: "/art/#food-restaurants", image: "/home/work-01.jpg" },
  { title: "Food & Restaurants", href: "/art/#food-restaurants", image: "/home/work-02.jpg" },
  { title: "[Work 03]" },
  { title: "[Work 04]" },
  { title: "[Work 05]" },
  { title: "[Work 06]" },
  { title: "[Work 07]" },
];
const SEG = 96; // segments across one card: the curve stays perfectly smooth
const RADIUS = 10; // rounded corners, px

// Ribbon shape, the same one as before: one S-wave every 1.6 card widths, slight fall-off to the sides.
function geom(w: number) {
  const gap = w * 0.05;
  const L = (w * 1.6) / (2 * Math.PI);
  const A = w * 0.12;
  const P = w * 1.4; // perspective distance
  const z = (x: number) => A * Math.sin(x / L) - (x * x) / (w * 5);
  return { gap, L, A, P, z };
}

const VS = `
attribute vec2 a_uv;
uniform float u_x0, u_w, u_h, u_A, u_L, u_P;
uniform vec2 u_view;
varying vec2 v_uv;
varying float v_scale;
void main(){
  float x = u_x0 + a_uv.x * u_w;
  float z = u_A * sin(x / u_L) - (x * x) / (u_w * 5.0);
  float y = (a_uv.y - 0.5) * u_h;
  float wdiv = (u_P - z) / u_P;
  v_uv = a_uv;
  v_scale = 1.0 / wdiv;
  gl_Position = vec4(x / (u_view.x * 0.5), -y / (u_view.y * 0.5), 0.0, wdiv);
}`;

const FS = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_size;     // card size, px
uniform vec2 u_texSize;  // picture size, px
uniform float u_r;
varying vec2 v_uv;
varying float v_scale;
void main(){
  // Cover the card with the picture, centred, like object-fit: cover.
  float s = max(u_size.x / u_texSize.x, u_size.y / u_texSize.y);
  vec2 span = u_size / (u_texSize * s);
  vec2 tuv = (v_uv - 0.5) * span + 0.5;
  vec4 col = texture2D(u_tex, tuv);
  // Rounded corners with a soft one-pixel edge, and the thin light border.
  vec2 p = v_uv * u_size;
  vec2 q = abs(p - u_size * 0.5) - (u_size * 0.5 - vec2(u_r));
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - u_r;
  float aa = 1.0 / max(v_scale, 0.5);
  float alpha = 1.0 - smoothstep(-aa, aa, d);
  float border = 1.0 - smoothstep(0.0, aa, abs(d + 0.5) - 0.5);
  col.rgb = mix(col.rgb, vec3(0.949, 0.929, 0.902), border * 0.22);
  gl_FragColor = vec4(col.rgb * alpha, alpha);
}`;

// Grey placeholder for cards without a picture yet (title in the middle, project number in the corner).
function placeholder(i: number, title: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1200; c.height = 720;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 1200, 720);
  grad.addColorStop(Math.min(0.5, i * 0.06), "#1c1b1a");
  grad.addColorStop(0.6, "#2a2724");
  grad.addColorStop(1, "#141312");
  g.fillStyle = grad; g.fillRect(0, 0, 1200, 720);
  g.fillStyle = "#9B948B"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "60px 'Bodoni Moda', Georgia, serif";
  g.fillText(title, 600, 360);
  g.fillStyle = "#F2EDE6"; g.textAlign = "left"; g.textBaseline = "alphabetic";
  g.font = "22px Jost, Helvetica, sans-serif";
  const label = `PROJECT ${String(i + 1).padStart(2, "0")}`.split("").join(String.fromCharCode(8202));
  g.fillText(label, 48, 676);
  return c;
}

export default function SnakeCarousel() {
  const router = useRouter();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 900, h: 560, vw: 1200 });
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [webgl, setWebgl] = useState(true);
  const [fallbackPos, setFallbackPos] = useState(0);
  const n = CARDS.length;
  const cur = useRef(0);
  const offset = useRef(0);
  const dirty = useRef(true);
  const visible = useRef(true);
  // Screen height is read once per real resize (width change), so the phone's address bar
  // showing or hiding never moves the ribbon on its own.
  const vh = useRef(800);
  const sizeRef = useRef(size);
  useEffect(() => { sizeRef.current = size; dirty.current = true; }, [size]);

  useEffect(() => {
    let lastW = 0;
    const onResize = () => {
      const vw = window.innerWidth;
      if (vw === lastW) return;
      lastW = vw;
      vh.current = window.innerHeight;
      const w = Math.round(Math.min(vw < 768 ? vw * 0.52 : vw * 0.39, 680));
      setSize({ w, h: Math.round(w * 0.6), vw });
      dirty.current = true;
    };
    onResize();
    setCanHover(window.matchMedia("(hover: hover)").matches);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollPos = useCallback(() => {
    const s = section.current;
    if (!s) return 0;
    const r = s.getBoundingClientRect();
    const H = vh.current;
    const t = Math.min(1, Math.max(0, (H - r.top) / (H + r.height)));
    return t * (n - 1);
  }, [n]);
  const target = useCallback(() => Math.min(n - 1, Math.max(0, scrollPos() + offset.current)), [n, scrollPos]);

  const go = useCallback((i: number) => {
    const k = Math.max(0, Math.min(n - 1, i));
    offset.current = k - scrollPos();
  }, [n, scrollPos]);

  const stageH = Math.round(size.h * (size.w < 300 ? 1.3 : 1.6)); // tighter on phones

  // Pause all work while the carousel is off screen.
  useEffect(() => {
    const s = section.current;
    if (!s) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; if (e.isIntersecting) dirty.current = true; });
    io.observe(s);
    return () => io.disconnect();
  }, []);

  // WebGL renderer: one canvas, one curved mesh per card.
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const gl = (cv.getContext("webgl", { premultipliedAlpha: true, antialias: true, alpha: true }) ||
      cv.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) { setWebgl(false); return; }

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setWebgl(false); return; }
    gl.useProgram(prog);

    // Strip of SEG segments, two rows of vertices (top and bottom edge).
    const verts: number[] = [];
    for (let k = 0; k <= SEG; k++) { const u = k / SEG; verts.push(u, 0, u, 1); }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const aUv = gl.getAttribLocation(prog, "a_uv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    const U = (name: string) => gl.getUniformLocation(prog, name);
    const u = { x0: U("u_x0"), w: U("u_w"), h: U("u_h"), A: U("u_A"), L: U("u_L"), P: U("u_P"), view: U("u_view"), size: U("u_size"), texSize: U("u_texSize"), r: U("u_r") };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    const texs = CARDS.map((c, i) => {
      const t = gl.createTexture()!;
      const entry = { tex: t, w: 1200, h: 720 };
      const upload = (src: TexImageSource, w: number, h: number) => {
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        entry.w = w; entry.h = h; dirty.current = true;
      };
      const ph = placeholder(i, c.title);
      upload(ph, ph.width, ph.height);
      if (c.image) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => upload(img, img.naturalWidth, img.naturalHeight);
        img.src = c.image;
      }
      if (document.fonts) document.fonts.ready.then(() => { if (!c.image) { const p2 = placeholder(i, c.title); upload(p2, p2.width, p2.height); } });
      return entry;
    });

    let raf = 0;
    let drawnFor = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible.current) return;
      const t = target();
      cur.current += (t - cur.current) * 0.14;
      if (Math.abs(t - cur.current) < 0.0005) cur.current = t;
      const a = Math.round(cur.current);
      setActive((x) => (x !== a ? a : x));

      const W = cv.clientWidth, H = cv.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = `${cur.current}|${W}|${H}|${dpr}`;
      if (key === drawnFor && !dirty.current) return; // still page costs nothing
      drawnFor = key; dirty.current = false;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      }
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const cw = sizeRef.current.w, ch = sizeRef.current.h;
      const g = geom(cw);
      gl.uniform1f(u.w, cw); gl.uniform1f(u.h, ch); gl.uniform1f(u.A, g.A); gl.uniform1f(u.L, g.L); gl.uniform1f(u.P, g.P);
      gl.uniform2f(u.view, W, H); gl.uniform2f(u.size, cw, ch); gl.uniform1f(u.r, RADIUS);
      // Far cards first, so nearer ones sit on top where they overlap.
      const order = CARDS.map((_, i) => i).sort((i, j) => Math.abs(j - cur.current) - Math.abs(i - cur.current));
      for (const i of order) {
        const x0 = (i - cur.current) * (cw + g.gap) - cw / 2;
        if (x0 > W || x0 + cw < -W) continue;
        gl.uniform1f(u.x0, x0);
        gl.bindTexture(gl.TEXTURE_2D, texs[i].tex);
        gl.uniform2f(u.texSize, texs[i].w, texs[i].h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (SEG + 1) * 2);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); texs.forEach((t) => gl.deleteTexture(t.tex)); gl.deleteBuffer(buf); gl.deleteProgram(prog); };
  }, [target]);

  // Fallback without WebGL: whole flat cards (never sliced), moved by the same controls.
  useEffect(() => {
    if (webgl) return;
    let raf = 0;
    const tick = () => {
      const t = target();
      cur.current += (t - cur.current) * 0.14;
      if (Math.abs(t - cur.current) < 0.0005) cur.current = t;
      setFallbackPos((p) => (p !== cur.current ? cur.current : p));
      const a = Math.round(cur.current);
      setActive((x) => (x !== a ? a : x));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [webgl, target]);

  // Which card is under a point of the stage (screen space, relative to the stage centre).
  const cardAt = (px: number, py: number) => {
    const { w, h } = sizeRef.current;
    const g = geom(w);
    let best = -1, bestScale = -Infinity;
    for (let i = 0; i < n; i++) {
      const x0 = (i - cur.current) * (w + g.gap) - w / 2;
      for (let k = 0; k < 48; k++) {
        const xa = x0 + (k / 48) * w, xb = x0 + ((k + 1) / 48) * w;
        const sa = g.P / (g.P - g.z(xa)), sb = g.P / (g.P - g.z(xb));
        const lo = Math.min(xa * sa, xb * sb), hi = Math.max(xa * sa, xb * sb);
        if (px < lo || px > hi) continue;
        const s = (sa + sb) / 2;
        if (Math.abs(py) <= (h / 2) * s && s > bestScale) { best = i; bestScale = s; }
      }
    }
    return best;
  };

  // Pointer: a sideways drag moves the ribbon; a short tap selects or opens a card.
  const drag = useRef<{ x: number; y: number; start: number; moved: boolean; id: number } | null>(null);
  const local = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, start: offset.current, moved: false, id: e.pointerId };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d && d.id === e.pointerId) {
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - d.y)) {
        d.moved = true;
        try { (e.target as Element).setPointerCapture(e.pointerId); } catch {}
      }
      if (d.moved) {
        const step = sizeRef.current.w * 1.05;
        const want = d.start - dx / step;
        const base = scrollPos();
        offset.current = Math.max(-base - 0.3, Math.min(n - 1 - base + 0.3, want));
      }
    }
    if (canHover) {
      const p = local(e);
      const i = cardAt(p.x, p.y);
      setHover(i >= 0 && i === Math.round(cur.current));
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    if (d.moved) { go(Math.round(target())); return; } // settle on the nearest card
    const p = local(e);
    const i = cardAt(p.x, p.y);
    if (i < 0) return;
    if (i === Math.round(cur.current) && CARDS[i].href) router.push(CARDS[i].href!);
    else go(i);
  };

  const centre = CARDS[active];
  const showLabel = !!centre?.href && (!canHover || hover);

  return (
    <section ref={section} aria-label="Selected work" className="relative bg-[#0B0B0C] pt-2 pb-1 md:pt-16 md:pb-16">
      <div ref={stage} className="relative overflow-hidden select-none" style={{ height: stageH }}>
        {webgl ? (
          <canvas ref={canvas} aria-hidden="true"
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }}
            onPointerLeave={() => setHover(false)}
            className="absolute inset-0 h-full w-full"
            style={{ touchAction: "pan-y", cursor: hover ? "pointer" : "grab" }} />
        ) : (
          <div className="absolute inset-0" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} style={{ touchAction: "pan-y" }}>
            {CARDS.map((c, i) => {
              const x = (i - fallbackPos) * (size.w * 1.05);
              if (Math.abs(x) > size.vw) return null;
              return (
                <div key={i} className="absolute left-1/2 top-1/2 overflow-hidden rounded-[10px] border border-[rgba(242,237,230,0.22)] bg-[#1c1b1a]"
                  style={{ width: size.w, height: size.h, transform: `translate(${x - size.w / 2}px, ${-size.h / 2}px)` }}>
                  {c.image
                    ? <img src={c.image} alt="" className="h-full w-full object-cover" draggable={false} />
                    : <div className="flex h-full items-center justify-center font-display text-[#9B948B]" style={{ fontSize: size.w * 0.05 }}>{c.title}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Label on the centre card: always visible on phones, on hover with a mouse. */}
        {centre?.href && (
          <a href={centre.href} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onClick={(e) => { e.preventDefault(); router.push(centre.href!); }}
            className="absolute z-10 font-body uppercase tracking-[0.2em] text-[#F2EDE6] transition-opacity duration-300 whitespace-nowrap bg-[rgba(11,11,12,0.55)] backdrop-blur-sm px-2.5 py-1.5 rounded-[4px]"
            style={{
              // Placed on the curved card itself: the point is projected the same way the card is drawn.
              ...(() => {
                const g = geom(size.w);
                const pad = Math.max(14, size.w * 0.045);
                const xs = -size.w / 2 + pad;
                const sc = g.P / (g.P - g.z(xs));
                const yb = size.h / 2 - Math.max(30, size.h * 0.12);
                return { left: `calc(50% + ${xs * sc}px)`, top: `calc(50% + ${yb * sc}px)`, fontSize: Math.max(11, size.w * 0.018) * sc };
              })(),
              opacity: showLabel ? 1 : 0,
              pointerEvents: showLabel ? "auto" : "none",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}>
            {centre.title} <span aria-hidden="true">→</span>
          </a>
        )}

        <button onClick={() => go(active - 1)} aria-label="Previous" disabled={active === 0}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center border border-[rgba(242,237,230,0.6)] text-[#F2EDE6] text-sm hover:text-[#C9A962] hover:border-[#C9A962] disabled:opacity-25 transition-colors">←</button>
        <button onClick={() => go(active + 1)} aria-label="Next" disabled={active === n - 1}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center border border-[rgba(242,237,230,0.6)] text-[#F2EDE6] text-sm hover:text-[#C9A962] hover:border-[#C9A962] disabled:opacity-25 transition-colors">→</button>
      </div>
    </section>
  );
}
