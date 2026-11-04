"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Snake carousel (reference: Jesper Landberg). Landscape cards bend like one wavy ribbon in perspective.
// Page scroll moves the ribbon; small arrows at the screen edges and a tap on a card also move it.
const cards = Array.from({ length: 7 }, (_, i) => ({ id: i, title: `[Work ${String(i + 1).padStart(2, "0")}]` }));
const STRIPS = 16;

export default function SnakeCarousel() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState({ w: 900, h: 560 });
  const [active, setActive] = useState(0);
  const n = cards.length;

  // Card size follows the screen: wider share on phones.
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const w = Math.round(Math.min(vw < 768 ? vw * 0.74 : vw * 0.56, 980));
      setSize({ w, h: Math.round(w * 0.6) });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const layout = useCallback((p: number) => {
    const { w } = size;
    const gap = w * 0.05;
    const sw = w / STRIPS;
    const L = w * 0.42; // length of one wave bend
    const A = w * 0.15; // depth of the wave
    const z = (x: number) => A * (Math.cos(x / L) - 1) - (x * x) / (w * 6);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < STRIPS; j++) {
        const el = strips.current[i * STRIPS + j];
        if (!el) continue;
        const x = (i - p) * (w + gap) - w / 2 + (j + 0.5) * sw;
        const zz = z(x);
        const ang = Math.atan2(z(x + 1) - z(x - 1), 2) * (180 / Math.PI);
        el.style.transform = `translate3d(${x - sw / 2}px,0,${zz}px) rotateY(${-ang}deg)`;
        el.style.opacity = Math.abs(x) > window.innerWidth * 1.1 ? "0" : "1";
      }
    }
  }, [size, n]);

  // Scroll range while the stage is stuck in the middle of the screen.
  const bounds = (s: HTMLElement) => {
    const top = s.getBoundingClientRect().top + window.scrollY;
    const pad = 64;
    const sh = stage.current?.offsetHeight ?? 0;
    const off = (window.innerHeight - sh) / 2;
    const start = top + pad - off;
    // The page may end before the stage unsticks (only the footer is below), so cap at the real bottom.
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return { start, run: Math.max(1, Math.min(s.offsetHeight - pad - sh, maxScroll - start)) };
  };

  // Scroll position inside the section -> ribbon position (0 .. n-1).
  const progress = useCallback(() => {
    const s = section.current;
    if (!s) return 0;
    const { start, run } = bounds(s);
    const t = Math.min(1, Math.max(0, (window.scrollY - start) / run));
    return t * (n - 1);
  }, [n]);

  useEffect(() => {
    let raf = 0;
    let cur = progress();
    const tick = () => {
      const target = progress();
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      layout(cur);
      setActive((a) => (Math.round(cur) !== a ? Math.round(cur) : a));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layout, progress]);

  const go = (i: number) => {
    const s = section.current;
    if (!s) return;
    const k = Math.max(0, Math.min(n - 1, i));
    const { start, run } = bounds(s);
    window.scrollTo({ top: start + (k / (n - 1)) * run, behavior: "smooth" });
  };

  const stageH = Math.round(size.h * 1.3);

  return (
    <section ref={section} aria-label="Selected work" className="relative bg-[#0B0B0C] pt-16" style={{ height: `calc(${n} * 55svh + 100svh)` }}>
      <div ref={stage} className="sticky overflow-hidden" style={{ top: `calc((100svh - ${stageH}px) / 2)`, height: stageH }}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: `${size.w * 1.6}px` }}>
          <div className="relative" style={{ width: 0, height: size.h, transformStyle: "preserve-3d" }}>
            {cards.map((c, i) =>
              Array.from({ length: STRIPS }, (_, j) => (
                <div key={`${i}-${j}`} ref={(el) => { strips.current[i * STRIPS + j] = el; }}
                  onClick={() => go(i)}
                  className="absolute top-0 left-0 overflow-hidden cursor-pointer will-change-transform"
                  style={{ width: size.w / STRIPS + 4, height: size.h, backfaceVisibility: "hidden", outline: "1px solid transparent" }}>
                  <div className="absolute top-0 h-full" style={{ width: size.w, left: -j * (size.w / STRIPS) }}>
                    <div className="h-full w-full border border-[rgba(242,237,230,0.22)]"
                      style={{ background: `linear-gradient(135deg, #1c1b1a ${i * 6}%, #2a2724 60%, #141312)`, borderRadius: j === 0 ? "10px 0 0 10px" : j === STRIPS - 1 ? "0 10px 10px 0" : 0 }}>
                      <div className="absolute inset-0 flex items-center justify-center font-display text-[#9B948B]" style={{ fontSize: size.w * 0.05 }}>{c.title}</div>
                      <div className="absolute left-[4%] bottom-[6%] font-body uppercase tracking-[0.24em] text-[#F2EDE6]" style={{ fontSize: Math.max(11, size.w * 0.016) }}>Project {String(i + 1).padStart(2, "0")}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button onClick={() => go(active - 1)} aria-label="Previous" disabled={active === 0}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center border border-[rgba(242,237,230,0.6)] text-[#F2EDE6] text-sm hover:text-[#C9A962] hover:border-[#C9A962] disabled:opacity-25 transition-colors">←</button>
        <button onClick={() => go(active + 1)} aria-label="Next" disabled={active === n - 1}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center border border-[rgba(242,237,230,0.6)] text-[#F2EDE6] text-sm hover:text-[#C9A962] hover:border-[#C9A962] disabled:opacity-25 transition-colors">→</button>
      </div>
    </section>
  );
}
