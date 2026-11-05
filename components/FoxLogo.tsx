"use client";
import { useEffect, useRef } from "react";

// Hero logo with a gently swaying tail. The fox is the original pixels, never redrawn:
// each frame rotates only the tail pixels around the base of the tail, weighted by a mask
// (0 = body and letters stay still, 1 = tail moves fully), so there is no break at the joint.
const W = 1400, H = 585; // logo image size
const PAD = 24; // empty rows under the logo, so the tail tip never hits the bottom edge when it swings down
const CH = H + PAD; // canvas height
const X0 = 600, X1 = 1000; // only this strip of the logo contains the fox
const PX = 751.76, PY = 403.45; // pivot: base of the tail
// Swing is asymmetric: the tip goes down 6 degrees and up 4.5 (checked: it never reaches the letter I).
const AMP_DOWN = (6 * Math.PI) / 180;
const AMP_UP = (4.5 * Math.PI) / 180;
const LETTER_I_X = 900; // everything still (mask 0) right of this x is the letter I
const PERIOD = 2600; // ms

export default function FoxLogo({ className = "", src: logoSrc = "/arlix-logo.png" }: { className?: string; src?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let raf = 0;
    let stop = false;
    const logo = new Image();
    const mask = new Image();
    logo.src = logoSrc;
    mask.src = "/arlix-logo-tail.png";
    Promise.all([logo.decode(), mask.decode()]).then(() => {
      if (stop) return;
      ctx.drawImage(logo, 0, 0);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const sw = X1 - X0;
      const src = ctx.getImageData(X0, 0, sw, CH);
      const m = document.createElement("canvas");
      m.width = sw; m.height = H;
      const mctx = m.getContext("2d")!;
      mctx.drawImage(mask, 0, 0);
      const md = mctx.getImageData(0, 0, sw, H).data;
      const w = new Float32Array(sw * CH);
      for (let i = 0; i < sw * H; i++) w[i] = md[i * 4] / 255;
      // The empty rows below take the weight of the last logo row, so the tail can swing into them.
      for (let y = H; y < CH; y++) for (let x = 0; x < sw; x++) w[y * sw + x] = w[(H - 1) * sw + x];
      const out = ctx.createImageData(sw, CH);
      const s0 = src.data, o = out.data;
      o.set(s0);
      // Sampling copy without the letter I: the moving tail must never pick up and duplicate a piece of the I.
      const s = new Uint8ClampedArray(s0);
      for (let y = 0; y < CH; y++) for (let x = LETTER_I_X - X0; x < sw; x++) { const i = y * sw + x; if (w[i] === 0) s[i * 4 + 3] = 0; }
      // Only tail pixels move: list them once, then each frame touches just those.
      const idx: number[] = [];
      for (let i = 0; i < w.length; i++) if (w[i] > 0) idx.push(i);
      const t0 = performance.now();
      const tick = (now: number) => {
        if (!canvas.offsetParent) { raf = requestAnimationFrame(tick); return; }
        const sw0 = Math.sin(((now - t0) / PERIOD) * 2 * Math.PI);
        const a = sw0 * (sw0 > 0 ? AMP_DOWN : AMP_UP);
        for (let n = 0; n < idx.length; n++) {
          const i = idx[n], k = i * 4, x = i % sw, y = (i - x) / sw;
          const th = -a * w[i], c = Math.cos(th), sn = Math.sin(th);
          const dx = x + X0 - PX, dy = y - PY;
          const fx = PX + dx * c - dy * sn - X0, fy = PY + dx * sn + dy * c;
          const x0 = Math.floor(fx), y0 = Math.floor(fy);
          if (x0 < 0 || y0 < 0 || x0 >= sw - 1 || y0 >= CH - 1) { o[k] = o[k + 1] = o[k + 2] = o[k + 3] = 0; continue; }
          const ax = fx - x0, ay = fy - y0;
          const k00 = (y0 * sw + x0) * 4, k10 = k00 + 4, k01 = k00 + sw * 4, k11 = k01 + 4;
          for (let ch = 0; ch < 4; ch++) {
            o[k + ch] = (s[k00 + ch] * (1 - ax) + s[k10 + ch] * ax) * (1 - ay) + (s[k01 + ch] * (1 - ax) + s[k11 + ch] * ax) * ay;
          }
        }
        ctx.putImageData(out, X0, 0);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }).catch(() => {});
    return () => { stop = true; cancelAnimationFrame(raf); };
  }, [logoSrc]);

  // The box keeps the logo's own proportions, so the layout around it is unchanged;
  // the extra empty rows hang below the box without pushing anything down.
  return (
    <div className={`relative aspect-[1400/585] ${className}`}>
      <canvas ref={ref} width={W} height={CH} role="img" aria-label="Arlix" className="absolute left-0 top-0 w-full h-auto pointer-events-none" />
    </div>
  );
}
