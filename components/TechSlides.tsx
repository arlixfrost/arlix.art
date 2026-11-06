"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ph } from "@/components/Ph";
import { WorkVideo } from "@/components/ArtSlides";

type Item = { id: string; title: string; menu?: string; text?: string; price?: string; video?: { src: string; poster: string; title: string } };

// Individual consultations and Training for small business are merged into one block.
const items: Item[] = [
  { id: "cv-linkedin", title: "CV / LinkedIn + Career", menu: "CV adaptation" },
  { id: "web-design", title: "Web Design" },
  { id: "assistants-agents", title: "Assistants / Agents", menu: "AI Agents", video: { src: "/tech/buildpilot.mp4", poster: "/tech/buildpilot.jpg", title: "Build Pilot · AI construction assistant" } },
  {
    id: "content-factory",
    title: "Content Factory",
    menu: "Content\nFactory",
    text: "Your brand's visuals, handled every month: 30 to 60 pieces of content, carousels, short reels and UGC-style videos, all in one consistent look.",
    price: "From €1,500 / month",
  },
  { id: "consultations-training", title: "Individual Consultations & Small Business Training", menu: "Consultations\n& Training" },
  { id: "royalty-free-music", title: "Royalty Free music", menu: "Royalty Free\nMusic" },
];

const slides = [
  { id: "intro", label: "Intro" },
  ...items.map((s) => ({ id: s.id, label: s.menu ?? s.title })),
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

// Mirror of Art: the menu is on the right, so pages pivot around the right edge and turn the other way.
const ENTER = { yPercent: -20, scale: 1.3, rotate: -7, opacity: 0.5 };
const CENTER = { yPercent: 0, scale: 1, rotate: 0, opacity: 1 };
const LEAVE = { yPercent: 20, scale: 1.3, rotate: 7, opacity: 0.5 };

export default function TechSlides() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = root.current;
    if (!scroller) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      scroller.querySelectorAll<HTMLElement>("[data-snap-item]").forEach((section, i) => {
        const inner = section.querySelector<HTMLElement>("[data-snap-inner]");
        if (!inner) return;
        ScrollTrigger.create({ trigger: section, scroller, start: "top center", end: "bottom center", onToggle: (self) => self.isActive && setActive(i) });
        if (reduce) return;
        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: {
            trigger: section, scroller, start: "top bottom", end: "bottom top", scrub: true,
            onLeave: () => gsap.set(inner, { clearProps: "transform,opacity" }),
            onLeaveBack: () => gsap.set(inner, { clearProps: "transform,opacity" }),
          },
        });
        if (i === 0) tl.fromTo(inner, CENTER, { ...LEAVE, duration: 1 }, 1);
        else tl.fromTo(inner, ENTER, { ...CENTER, duration: 1 }).to(inner, { ...LEAVE, duration: 1 });
      });
      ScrollTrigger.create({ scroller, start: 0, end: "max", onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`; } });
    }, scroller);
    return () => ctx.revert();
  }, []);

  const go = (i: number) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (el && root.current) root.current.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(Math.min(active + 1, slides.length - 1)); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(Math.max(active - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const slide = "relative h-[100svh] w-full snap-start snap-always overflow-hidden bg-[#0B0B0C]";
  const inner = "h-full w-full will-change-transform origin-right";
  const pad = "pl-6 sm:pl-16 lg:pl-24 pr-16 sm:pr-24";

  return (
    <div className="fixed inset-0 art-theme">
      {/* Mirror of the Art menu: large vertical labels on the RIGHT, open section and its two neighbours only. */}
      <nav aria-label="Sections" className="fixed right-3 sm:right-5 top-14 sm:top-[72px] bottom-4 z-40 flex flex-row-reverse items-center gap-2 sm:gap-3 w-12 pointer-events-none">
        <div className="relative self-stretch my-6 w-px bg-[#3A3632] shrink-0">
          <div ref={bar} className="absolute inset-0 bg-[#C9A962] origin-top" style={{ transform: "scaleY(0)" }} />
        </div>
        <ol className="flex flex-col items-center gap-7 max-h-full overflow-visible shrink-0 pointer-events-auto px-1">
          {slides.map((s, i) => {
            const on = i === active;
            if (Math.abs(i - active) > 1) return null;
            return (
              <li key={s.id} className="flex">
                <button onClick={() => go(i)} aria-label={s.label.replace("\n", " ")} aria-current={on ? "true" : undefined}
                  className={`relative font-body uppercase whitespace-nowrap flex flex-row-reverse leading-[1.25] tracking-[0.18em] transition-colors duration-300 ${on ? "text-[#F2EDE6] text-[16px] border-l border-[#C9A962] pl-1.5" : "text-[#8A837A] text-[13px] hover:text-[#C9A962]"}`}>
                  {/* Each line is its own vertical column, so Safari never clips the second line. */}
                  {s.label.split("\n").map((line, k) => <span key={k} className="block [writing-mode:vertical-rl]">{line}</span>)}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={root} className="relative h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        <section data-snap-item data-index={0} id="intro" className={slide}>
          <div data-snap-inner className={inner}>
            <div className={`h-full flex flex-col justify-center ${pad} pt-[72px] max-w-5xl`}>
              <div className="label mb-4">Tech</div>
              <h1 className="font-display font-normal text-4xl md:text-6xl leading-[1.05] mb-5">[Tech headline]</h1>
              <div className="gold-rule mb-6" />
              <Ph className="h-24 max-w-xl">[Intro: what Arlix Tech offers, 2 to 4 lines]</Ph>
              <div className="label mt-8">Scroll ↓</div>
            </div>
          </div>
        </section>

        {items.map((s, i) => (
          <section key={s.id} data-snap-item data-index={i + 1} id={s.id} className={slide}>
            <div data-snap-inner className={inner}>
              <div className={s.video ? `h-full grid gap-4 md:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] content-center ${pad} pt-[72px]` : `h-full flex flex-col justify-center ${pad} pt-[72px] max-w-4xl`}>
                <div className="flex flex-col justify-center min-w-0">
                <div className="label mb-4">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</div>
                <h2 className="font-display font-normal text-4xl md:text-6xl leading-[1.05] mb-5">{s.title}</h2>
                <div className="gold-rule mb-6" />
                {s.text ? (
                  <p className="text-lg md:text-xl leading-relaxed text-[#CFC8BE] max-w-2xl">{s.text}</p>
                ) : (
                  <Ph className="h-24 max-w-xl">[Description]</Ph>
                )}
                {s.price ? (
                  <p className="mt-8 text-xl md:text-2xl text-[#C9A962] font-normal">{s.price}</p>
                ) : (
                  <Ph className="h-12 max-w-xs mt-6">[Price from]</Ph>
                )}
                <Link href="/contact" className="frame-btn mt-10 self-start">Contact</Link>
                </div>
                {s.video ? (
                  <div className="min-w-0 flex items-center">
                    <WorkVideo v={s.video} active={active === i + 1} near={Math.abs(active - (i + 1)) <= 1} />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ))}

        <section data-snap-item data-index={items.length + 1} id="pricing" className={slide}>
          <div data-snap-inner className={inner}>
            <div className={`h-full flex flex-col justify-center ${pad} pt-[72px]`}>
              <div className="label mb-4">Pricing</div>
              <h2 className="font-display font-normal text-3xl md:text-5xl mb-8">Pricing</h2>
              <div className="grid gap-4 md:grid-cols-3 max-w-5xl">
                {["Package 1", "Package 2", "Package 3"].map((p) => (
                  <Ph key={p} className="h-44 flex-col gap-2"><span>[{p}: name]</span><span>[Price]</span><span>[What is included]</span></Ph>
                ))}
              </div>
              <Ph className="mt-4 h-12 max-w-5xl">[Pricing note: custom quotes, terms]</Ph>
            </div>
          </div>
        </section>

        <section data-snap-item data-index={items.length + 2} id="contact" className={slide}>
          <div data-snap-inner className={inner}>
            <div className={`h-full flex flex-col items-center justify-center text-center ${pad}`}>
              <div className="label mb-4">Contact</div>
              <h2 className="font-display font-normal text-3xl md:text-5xl mb-6">Start a project</h2>
              <Ph className="h-12 mb-8 w-full max-w-xl">[CTA line: invite to start a project]</Ph>
              <Link href="/contact" className="frame-btn">Contact</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
