"use client";
import { useEffect, useRef } from "react";

// Hero logo with a gently swaying tail. The fox is the original pixels, never redrawn:
// each frame rotates only the tail pixels around the base of the tail, weighted by a mask
// (0 = body and letters stay still, 1 = tail moves fully), so there is no break at the joint.
const W = 1400, H = 585;
const X0 = 600, X1 = 1000; // only this strip of the logo contains the fox
const PX = 751.76, PY = 403.45; // pivot: base of the tail
const AMP = (3 * Math.PI) / 180; // 3 degrees each way
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
      const src = ctx.getImageData(X0, 0, sw, H);
      const m = document.createElement("canvas");
      m.width = sw; m.height = H;
      const mctx = m.getContext("2d")!;
      mctx.drawImage(mask, 0, 0);
      const md = mctx.getImageData(0, 0, sw, H).data;
      const w = new Float32Array(sw * H);
      for (let i = 0; i < w.length; i++) w[i] = md[i * 4] / 255;
      const out = ctx.createImageData(sw, H);
      const s = src.data, o = out.data;
      const t0 = performance.now();
      const tick = (now: number) => {
        if (!canvas.offsetParent) { raf = requestAnimationFrame(tick); return; }
        const a = AMP * Math.sin(((now - t0) / PERIOD) * 2 * Math.PI);
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < sw; x++) {
            const i = y * sw + x, k = i * 4;
            const wt = w[i];
            if (wt === 0) { o[k] = s[k]; o[k + 1] = s[k + 1]; o[k + 2] = s[k + 2]; o[k + 3] = s[k + 3]; continue; }
            const th = -a * wt, c = Math.cos(th), sn = Math.sin(th);
            const dx = x + X0 - PX, dy = y - PY;
            const fx = PX + dx * c - dy * sn - X0, fy = PY + dx * sn + dy * c;
            const x0 = Math.floor(fx), y0 = Math.floor(fy);
            if (x0 < 0 || y0 < 0 || x0 >= sw - 1 || y0 >= H - 1) { o[k] = o[k + 1] = o[k + 2] = o[k + 3] = 0; continue; }
            const ax = fx - x0, ay = fy - y0;
            const k00 = (y0 * sw + x0) * 4, k10 = k00 + 4, k01 = k00 + sw * 4, k11 = k01 + 4;
            for (let ch = 0; ch < 4; ch++) {
              o[k + ch] = (s[k00 + ch] * (1 - ax) + s[k10 + ch] * ax) * (1 - ay) + (s[k01 + ch] * (1 - ax) + s[k11 + ch] * ax) * ay;
            }
          }
        }
        ctx.putImageData(out, X0, 0);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }).catch(() => {});
    return () => { stop = true; cancelAnimationFrame(raf); };
  }, [logoSrc]);

  return <canvas ref={ref} width={W} height={H} role="img" aria-label="Arlix" className={className} />;
}
