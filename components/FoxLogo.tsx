"use client";
import { useEffect, useRef } from "react";

// Hero logo with a swaying tail. The fox is the original pixels, never redrawn.
// The logo is split once into two layers:
//   - still layer: letters, the fox body and the letter I (they never move)
//   - tail layer: only the tail pixels
// Each frame the tail layer is rotated around the base of the tail (more towards the tip,
// following a smooth weight field) and painted OVER the still layer. Nothing is ever copied
// from the still layer, so the letter I can never be duplicated, and nothing cuts the tail.
// The weight file (arlix-logo-tail.png) carries the weight in red and the tail map in green.
const W = 1400, H = 585; // logo image size
const PAD = 24; // empty rows under the logo, so the tail tip never hits the bottom edge when it swings down
const CH = H + PAD; // canvas height
const X0 = 600, X1 = 1000; // only this strip of the logo contains the fox
const PX = 751.76, PY = 403.45; // pivot: base of the tail
// Swing is asymmetric: the tip goes down 6 degrees and up 4.5.
const AMP_DOWN = (6 * Math.PI) / 180;
const AMP_UP = (4.5 * Math.PI) / 180;
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
      const sw = X1 - X0, n = sw * CH;
      const src = ctx.getImageData(X0, 0, sw, CH).data;
      const m = document.createElement("canvas");
      m.width = sw; m.height = CH;
      const mctx = m.getContext("2d")!;
      mctx.drawImage(mask, 0, 0);
      const md = mctx.getImageData(0, 0, sw, CH).data;

      // Premultiplied layers (0..1), so painting the tail over the still layer has clean edges.
      const tail = new Float32Array(n * 4), still = new Float32Array(n * 4);
      const w = new Float32Array(n);
      const dst: number[] = [];
      for (let i = 0; i < n; i++) {
        const k = i * 4, al = src[k + 3] / 255, moving = md[k + 1] > 127;
        const L = moving ? tail : still;
        L[k] = (src[k] / 255) * al; L[k + 1] = (src[k + 1] / 255) * al; L[k + 2] = (src[k + 2] / 255) * al; L[k + 3] = al;
        w[i] = md[k] / 255;
        if (w[i] > 0) dst.push(i); // pixels the tail can reach
      }
      const out = ctx.createImageData(sw, CH);
      const o = out.data;
      // Start from the untouched logo: pixels the tail can never reach stay exactly as they are.
      o.set(src);

      const t0 = performance.now();
      const tick = (now: number) => {
        if (!canvas.offsetParent) { raf = requestAnimationFrame(tick); return; }
        const s0 = Math.sin(((now - t0) / PERIOD) * 2 * Math.PI);
        const a = s0 * (s0 > 0 ? AMP_DOWN : AMP_UP);
        for (let q = 0; q < dst.length; q++) {
          const i = dst[q], k = i * 4, x = i % sw, y = (i - x) / sw;
          // Where in the tail layer this pixel comes from (rotate back by its weight).
          const th = -a * w[i], c = Math.cos(th), sn = Math.sin(th);
          const dx = x + X0 - PX, dy = y - PY;
          const fx = PX + dx * c - dy * sn - X0, fy = PY + dx * sn + dy * c;
          const x0 = Math.floor(fx), y0 = Math.floor(fy);
          let tr = 0, tg = 0, tb = 0, ta = 0;
          if (x0 >= 0 && y0 >= 0 && x0 < sw - 1 && y0 < CH - 1) {
            const ax = fx - x0, ay = fy - y0;
            const w00 = (1 - ax) * (1 - ay), w10 = ax * (1 - ay), w01 = (1 - ax) * ay, w11 = ax * ay;
            const k00 = (y0 * sw + x0) * 4, k10 = k00 + 4, k01 = k00 + sw * 4, k11 = k01 + 4;
            tr = tail[k00] * w00 + tail[k10] * w10 + tail[k01] * w01 + tail[k11] * w11;
            tg = tail[k00 + 1] * w00 + tail[k10 + 1] * w10 + tail[k01 + 1] * w01 + tail[k11 + 1] * w11;
            tb = tail[k00 + 2] * w00 + tail[k10 + 2] * w10 + tail[k01 + 2] * w01 + tail[k11 + 2] * w11;
            ta = tail[k00 + 3] * w00 + tail[k10 + 3] * w10 + tail[k01 + 3] * w01 + tail[k11 + 3] * w11;
          }
          // Tail over the still layer.
          const r = tr + still[k] * (1 - ta), g = tg + still[k + 1] * (1 - ta), b = tb + still[k + 2] * (1 - ta);
          const al = ta + still[k + 3] * (1 - ta);
          if (al > 0) { o[k] = (r / al) * 255; o[k + 1] = (g / al) * 255; o[k + 2] = (b / al) * 255; o[k + 3] = al * 255; }
          else { o[k] = o[k + 1] = o[k + 2] = o[k + 3] = 0; }
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
