"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// The home-page ribbon, sized for a section of the Art page: the same S-curve in perspective, drawn on the
// graphics card with every card as ONE curved surface (no slices, no seams). Cards keep their own shape:
// vertical works stand upright, a horizontal work lies wide. It moves only when the visitor acts: arrows or
// a sideways drag. A tap on the centre card opens that work; a tap on a side card brings it to the centre.
export type ReelItem = { poster: string; title: string; horizontal?: boolean };

const SEG = 96;
const RADIUS = 10;

const VS = `
attribute vec2 a_uv;
uniform float u_x0, u_w, u_h, u_A, u_L, u_P, u_base, u_fall;
uniform vec2 u_view;
varying vec2 v_uv;
varying float v_scale;
void main(){
  float x = u_x0 + a_uv.x * u_w;
  float z = u_A * sin(x / u_L) - (x * x) / u_fall;
  float y = (a_uv.y - 0.5) * u_h;
  float wdiv = (u_P - z) / u_P;
  v_uv = a_uv;
  v_scale = 1.0 / wdiv;
  gl_Position = vec4(x / (u_view.x * 0.5), -y / (u_view.y * 0.5), 0.0, wdiv);
}`;

const FS = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_size;
uniform vec2 u_texSize;
uniform float u_r;
varying vec2 v_uv;
varying float v_scale;
void main(){
  float s = max(u_size.x / u_texSize.x, u_size.y / u_texSize.y);
  vec2 span = u_size / (u_texSize * s);
  vec2 tuv = (v_uv - 0.5) * span + 0.5;
  vec4 col = texture2D(u_tex, tuv);
  vec2 p = v_uv * u_size;
  vec2 q = abs(p - u_size * 0.5) - (u_size * 0.5 - vec2(u_r));
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - u_r;
  float aa = 1.0 / max(v_scale, 0.5);
  float alpha = 1.0 - smoothstep(-aa, aa, d);
  float border = 1.0 - smoothstep(0.0, aa, abs(d + 0.5) - 0.5);
  col.rgb = mix(col.rgb, vec3(0.949, 0.929, 0.902), border * 0.22);
  gl_FragColor = vec4(col.rgb * alpha, alpha);
}`;

// Curve shape scaled from the card height, same proportions as the home ribbon.
function geom(h: number) {
  const base = h * 0.95;
  return { base, gap: base * 0.1, L: (base * 1.6) / (2 * Math.PI), A: base * 0.12, P: base * 1.4 };
}

export default function CurvedReel({ items, onOpen, className = "", heightCss = "calc(var(--ph) * 0.42)" }: {
  items: ReelItem[]; onOpen: (i: number) => void; className?: string; heightCss?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const n = items.length;
  const [webgl, setWebgl] = useState(true);
  const mid = Math.floor((items.length - 1) / 2);
  const [active, setActive] = useState(mid);
  const [fb, setFb] = useState(0);
  const target = useRef(Math.floor((items.length - 1) / 2));
  const cur = useRef(Math.floor((items.length - 1) / 2));
  const dirty = useRef(true);
  const visible = useRef(true);
  const dims = useRef({ W: 0, H: 0, h: 0, widths: [] as number[], centres: [] as number[] });

  const layout = useCallback(() => {
    const s = stage.current; if (!s) return;
    const W = s.clientWidth, H = s.clientHeight;
    const h = H * 0.86;
    const g = geom(h);
    const widths = items.map((it) => (it.horizontal ? h * 16 / 9 : h * 9 / 16));
    const centres: number[] = [];
    let x = 0;
    widths.forEach((w, i) => { if (i > 0) x += widths[i - 1] / 2 + g.gap + w / 2; centres.push(x); });
    dims.current = { W, H, h, widths, centres };
    dirty.current = true;
  }, [items]);

  useEffect(() => {
    layout();
    const s = stage.current; if (!s) return;
    const ro = new ResizeObserver(layout); ro.observe(s);
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; if (e.isIntersecting) dirty.current = true; });
    io.observe(s);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [layout]);

  const pos = (c: number) => {
    const { centres } = dims.current; if (!centres.length) return 0;
    const i = Math.max(0, Math.min(n - 1, Math.floor(c))); const j = Math.min(n - 1, i + 1); const f = Math.max(0, Math.min(1, c - i));
    return centres[i] + (centres[j] - centres[i]) * f;
  };
  const go = (i: number) => { target.current = Math.max(0, Math.min(n - 1, i)); };

  useEffect(() => {
    const cv = canvas.current; if (!cv) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, antialias: true, alpha: true }) as WebGLRenderingContext | null;
    if (!gl) { setWebgl(false); return; }
    const sh = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setWebgl(false); return; }
    gl.useProgram(prog);
    const verts: number[] = []; for (let k = 0; k <= SEG; k++) { const u = k / SEG; verts.push(u, 0, u, 1); }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const aUv = gl.getAttribLocation(prog, "a_uv"); gl.enableVertexAttribArray(aUv); gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    const U = (k: string) => gl.getUniformLocation(prog, k);
    const u = { x0: U("u_x0"), w: U("u_w"), h: U("u_h"), A: U("u_A"), L: U("u_L"), P: U("u_P"), base: U("u_base"), fall: U("u_fall"), view: U("u_view"), size: U("u_size"), texSize: U("u_texSize"), r: U("u_r") };
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const texs = items.map((it) => {
      const t = gl.createTexture()!; const e = { tex: t, w: 9, h: 16 };
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 19, 18, 255]));
      const img = new Image(); img.decoding = "async";
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        e.w = img.naturalWidth; e.h = img.naturalHeight; dirty.current = true;
      };
      img.src = it.poster;
      return e;
    });
    let raf = 0; let last = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible.current) return;
      const t = target.current;
      cur.current += (t - cur.current) * 0.14; if (Math.abs(t - cur.current) < 0.0005) cur.current = t;
      const a = Math.round(cur.current); setActive((x) => (x !== a ? a : x));
      const W = cv.clientWidth, H = cv.clientHeight; if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = `${cur.current}|${W}|${H}`;
      if (key === last && !dirty.current) return;
      last = key; dirty.current = false;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      const { h, widths, centres } = dims.current; if (!widths.length) return;
      const g = geom(h); const p = pos(cur.current);
      gl.uniform1f(u.h, h); gl.uniform1f(u.A, g.A); gl.uniform1f(u.L, g.L); gl.uniform1f(u.P, g.P); gl.uniform1f(u.base, g.base); gl.uniform1f(u.fall, Math.max(W, g.base * 5) * 2.2);
      gl.uniform2f(u.view, W, H); gl.uniform1f(u.r, RADIUS);
      const order = items.map((_, i) => i).sort((i, j) => Math.abs(j - cur.current) - Math.abs(i - cur.current));
      for (const i of order) {
        const x0 = centres[i] - p - widths[i] / 2;
        if (x0 > W || x0 + widths[i] < -W) continue;
        gl.uniform1f(u.x0, x0); gl.uniform1f(u.w, widths[i]); gl.uniform2f(u.size, widths[i], h);
        gl.bindTexture(gl.TEXTURE_2D, texs[i].tex); gl.uniform2f(u.texSize, texs[i].w, texs[i].h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (SEG + 1) * 2);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); texs.forEach((t) => gl.deleteTexture(t.tex)); gl.deleteBuffer(buf); gl.deleteProgram(prog); };
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fallback without WebGL: whole flat cards, same controls.
  useEffect(() => {
    if (webgl) return;
    let raf = 0;
    const tick = () => { const t = target.current; cur.current += (t - cur.current) * 0.14; if (Math.abs(t - cur.current) < 0.0005) cur.current = t; setFb(cur.current); setActive(Math.round(cur.current)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [webgl]);

  const cardAt = (px: number, py: number) => {
    const { h, widths, centres } = dims.current; const g = geom(h); const p = pos(cur.current);
    let best = -1, bs = -Infinity;
    for (let i = 0; i < n; i++) {
      const x0 = centres[i] - p - widths[i] / 2;
      for (let k = 0; k < 32; k++) {
        const xa = x0 + (k / 32) * widths[i], xb = x0 + ((k + 1) / 32) * widths[i];
        const fall = Math.max(dims.current.W, g.base * 5) * 2.2; const z = (x: number) => g.A * Math.sin(x / g.L) - (x * x) / fall;
        const sa = g.P / (g.P - z(xa)), sb = g.P / (g.P - z(xb));
        if (px < Math.min(xa * sa, xb * sb) || px > Math.max(xa * sa, xb * sb)) continue;
        const s = (sa + sb) / 2;
        if (Math.abs(py) <= (h / 2) * s && s > bs) { best = i; bs = s; }
      }
    }
    return best;
  };

  const drag = useRef<{ x: number; y: number; start: number; moved: boolean; id: number } | null>(null);
  const local = (e: React.PointerEvent) => { const r = stage.current!.getBoundingClientRect(); return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 }; };
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, start: target.current, moved: false, id: e.pointerId }; };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - d.y)) { d.moved = true; try { (e.target as Element).setPointerCapture(e.pointerId); } catch {} }
    if (d.moved) { const step = dims.current.h * 0.62; target.current = Math.max(-0.3, Math.min(n - 1 + 0.3, d.start - dx / step)); }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null; if (!d || d.id !== e.pointerId) return;
    if (d.moved) { go(Math.round(target.current)); return; }
    const p = local(e); const i = webgl ? cardAt(p.x, p.y) : Math.round(cur.current);
    if (i < 0) return;
    if (i === Math.round(cur.current)) onOpen(i); else go(i);
  };

  const arrow = "absolute top-1/2 -translate-y-1/2 z-30 h-9 w-9 flex items-center justify-center bg-black/50 border border-[rgba(242,237,230,0.6)] text-[#F2EDE6] text-sm hover:text-[#C9A962] hover:border-[#C9A962] disabled:opacity-0 disabled:pointer-events-none transition";
  return (
    <div ref={stage} className={`relative w-full overflow-hidden select-none ${className}`} style={{ height: heightCss }}>
      {webgl ? (
        <canvas ref={canvas} aria-label="Works" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }}
          className="absolute inset-0 h-full w-full" style={{ touchAction: "pan-y", cursor: "pointer" }} />
      ) : (
        <div className="absolute inset-0" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} style={{ touchAction: "pan-y" }}>
          {items.map((it, i) => {
            const { h, widths, centres } = dims.current; if (!widths.length) return null;
            const x = centres[i] - pos(fb);
            return <img key={i} src={it.poster} alt="" draggable={false} className="absolute left-1/2 top-1/2 rounded-[10px] border border-[rgba(242,237,230,0.22)] object-cover"
              style={{ width: widths[i], height: h, transform: `translate(${x - widths[i] / 2}px, ${-h / 2}px)` }} />;
          })}
        </div>
      )}
      <button onClick={() => onOpen(active)} aria-label={`Play ${items[active]?.title ?? ""}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-black/55 border border-white/30 text-[#F2EDE6] text-xs flex items-center justify-center backdrop-blur-sm hover:border-[#C9A962] hover:text-[#C9A962] transition-colors">▶</button>
      {n > 1 && <>
        <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous" className={`${arrow} left-1`}>←</button>
        <button onClick={() => go(active + 1)} disabled={active === n - 1} aria-label="Next" className={`${arrow} right-1`}>→</button>
      </>}
    </div>
  );
}
