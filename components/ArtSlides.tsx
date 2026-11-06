"use client";
import { useEffect, useRef, useState } from "react";
import { PlayButton } from "@/components/PlayButton";
import Link from "next/link";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ph } from "@/components/Ph";
import { HybridCarousel } from "@/components/HybridCarousel";
import { VideoScrubber } from "@/components/VideoScrubber";
import { SoundToggle, ExpandButton } from "@/components/SoundToggle";
import { soloAudio } from "@/components/audio";

type Video = { src: string; poster: string; title: string };
type Section = {
  menu?: string;
  id: string;
  title: string;
  work: string;
  video?: Video;
  videos?: Video[];
  note?: string;
  text?: string;
  hybrid?: boolean;
  portrait?: boolean;
};

// Order: Brand → Hybrid → Food & Restaurants → Animation → Commercials → AI Models & UGC → Social (Artworks hidden)
const sections: Section[] = [
  {
    id: "brand-fashion-films",
    title: "Brand & Fashion Films",
    menu: "Brand &\nFashion Films",
    work: "Film",
    video: { src: "/art/brand-fashion-films.mp4", poster: "/art/brand-fashion-films.jpg", title: "Hervé Léger · origin film" },
  },
  {
    id: "hybrid",
    title: "Hybrid",
    work: "Hybrid work",
    hybrid: true,
    portrait: true,
    video: { src: "/art/hybrid/le-plongeoir.mp4", poster: "/art/hybrid/le-plongeoir.jpg", title: "Le Plongeoir · Nice · hybrid film" },
    note: "Film + process carousel (10 slides, Instagram order)",
  },
  { id: "food-restaurants", title: "Food & Restaurants", menu: "Food & Resto", work: "Food / restaurant piece" },
  { id: "animation", title: "Animation", menu: "Cartoons", work: "Animation" },
  {
    id: "commercials",
    title: "Commercials",
    work: "Commercial",
    portrait: true,
    videos: [
      { src: "/art/commercials/lingerie-model.mp4", poster: "/art/commercials/lingerie-model.jpg", title: "Lingerie · model + cat · Polish brand spec" },
      { src: "/art/commercials/lingerie-mannequin.mp4", poster: "/art/commercials/lingerie-mannequin.jpg", title: "Lingerie · mannequin · Polish brand spec" },
    ],
  },
  {
    id: "ai-models-ugc",
    title: "AI Models & UGC",
    menu: "AI Models",
    work: "AI model / UGC piece",
    portrait: true,
    text: "One face, made for your brand only. We create one or several AI models that become the face of your brand and appear nowhere else. A real model you book for a luxury watch campaign may turn up next month advertising a plumbing store. Yours never will. Same face in every campaign, no booking calendars, no usage rights to renew, ready for any market.",
  },
  {
    id: "social-content",
    title: "Social Content",
    menu: "Social",
    work: "Social piece",
    portrait: true,
    video: { src: "/art/social/paris-red-suit.mp4", poster: "/art/social/paris-red-suit.jpg", title: "Paris · red suit · social" },
  },
];

const ep1: Video = { src: "/art/amber-city/ep1-oskar.mp4", poster: "/art/amber-city/ep1-oskar.jpg", title: "Amber City · Ep 1 — Oskar" };
const taormina: Video = { src: "/art/artworks/taormina.mp4", poster: "/art/artworks/taormina.jpg", title: "Taormina · Sicily · WIP" };

// Muted autoplay driven by section visibility. iOS Safari only autoplays when the element is
// muted + playsInline, and React does not emit the `muted` attribute in static HTML, so we set
// the property imperatively before calling play().
// - auto=true: plays muted while its section is active, pauses when the section is left.
// - auto=false: stays paused until the user taps the play button (or opens the lightbox).
// A round play button appears on any video that stays paused, so autoplay blocked by the phone never leaves a frozen frame.
function WorkVideo({ v, className = "", aspect = "video", active = false, auto = true, near = true }: { v: Video; className?: string; aspect?: "video" | "portrait"; active?: boolean; auto?: boolean; near?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Load the file only once its section is on screen or next to it; until then the first frame (poster) shows.
  const [load, setLoad] = useState(near);
  useEffect(() => { if (near) setLoad(true); }, [near]);
  const [muted, setMuted] = useState(true);
  const activeRef = useRef(active);
  activeRef.current = active;

  const safePlay = (el: HTMLVideoElement) => {
    el.play().catch(() => {
      // Unmuted playback was blocked (no user gesture): fall back to muted.
      el.muted = true; setMuted(true);
      el.play().catch(() => {});
    });
  };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.muted = true; el.defaultMuted = true;
  }, []);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (active && auto) safePlay(el);
    else if (!active) el.pause();
  }, [active, auto]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const sync = () => setMuted(el.muted);
    el.addEventListener("volumechange", sync);
    return () => el.removeEventListener("volumechange", sync);
  }, []);
  const toggle = () => {
    const el = ref.current; if (!el) return;
    el.muted = !el.muted; setMuted(el.muted);
    if (!el.muted) soloAudio(el);
    if (el.paused) safePlay(el);
  };
  const [open, setOpen] = useState(false);
  const lb = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const src = ref.current; const el = lb.current;
    if (src && el) { el.currentTime = 0; el.muted = muted; soloAudio(el); el.play().catch(() => {}); src.pause(); }
    return () => {
      window.removeEventListener("keydown", onKey); document.body.style.overflow = prev;
      // Resume inline playback only if the section is still on screen.
      const s2 = ref.current; if (s2) { s2.muted = true; setMuted(true); if (activeRef.current) s2.play().catch(() => {}); }
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleLb = () => { const el = lb.current; if (!el) return; el.muted = !el.muted; setMuted(el.muted); if (!el.muted) soloAudio(el); };
  const box = aspect === "portrait" ? "aspect-[9/16]" : "aspect-video";
  const lbW = aspect === "portrait" ? "min(90vw, calc(90vh * 9 / 16))" : "min(90vw, calc(90vh * 16 / 9))";
  return (
    <div className={`relative bg-black overflow-hidden ${box} w-full ${className}`}>
      <video ref={ref} src={load ? v.src : undefined} poster={load ? v.poster : undefined} muted loop playsInline preload={load ? "auto" : "none"} onClick={() => setOpen(true)} className="absolute inset-0 h-full w-full object-contain cursor-zoom-in" aria-label={`${v.title} (click to enlarge)`} />
      <PlayButton video={ref} label={`Play ${v.title}`} />
      <SoundToggle muted={muted} onClick={(e) => { e.stopPropagation(); toggle(); }} className="right-2 bottom-2" />
      <ExpandButton onClick={(e) => { e.stopPropagation(); setOpen(true); }} className="right-11 bottom-2" />
      <VideoScrubber video={ref} />
      {open && typeof document !== "undefined" && createPortal(
        <div role="dialog" aria-modal="true" aria-label={v.title} onClick={() => setOpen(false)} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className={`relative ${box} bg-black border border-white/15 rounded-xl overflow-hidden shadow-2xl`} style={{ width: lbW }}>
            <video ref={lb} src={v.src} poster={v.poster} loop playsInline autoPlay muted={muted} className="absolute inset-0 h-full w-full object-contain" />
            <SoundToggle muted={muted} onClick={toggleLb} className="right-2 bottom-2" />
            <VideoScrubber video={lb} pillClassName="!right-11" />
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/60 text-white text-xl leading-none border border-white/20 hover:bg-black/80">×</button>
          </div>
        </div>, document.body)}
    </div>
  );
}

const slides = [
  { id: "intro", label: "Intro" },
  ...sections.map((s) => ({ id: s.id, label: s.menu ?? s.title })),
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

const ENTER = { yPercent: -20, scale: 1.3, rotate: 7, opacity: 0.5 };
const CENTER = { yPercent: 0, scale: 1, rotate: 0, opacity: 1 };
const LEAVE = { yPercent: 20, scale: 1.3, rotate: -7, opacity: 0.5 };

export default function ArtSlides() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const introVid = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [introMuted, setIntroMuted] = useState(true);
  // Tap on the intro film opens it in the same framed lightbox as the other works.
  const [introOpen, setIntroOpen] = useState(false);
  const introLb = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!introOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIntroOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const src = introVid.current; const el = introLb.current;
    if (src && el) { el.currentTime = 0; el.muted = introMuted; soloAudio(el); el.play().catch(() => {}); src.pause(); }
    return () => {
      window.removeEventListener("keydown", onKey); document.body.style.overflow = prev;
      const s2 = introVid.current; if (s2) { s2.muted = true; setIntroMuted(true); s2.play().catch(() => {}); }
    };
  }, [introOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleIntroLb = () => { const el = introLb.current; if (!el) return; el.muted = !el.muted; setIntroMuted(el.muted); if (!el.muted) soloAudio(el); };

  useEffect(() => {
    const scroller = root.current;
    if (!scroller) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      scroller.querySelectorAll<HTMLElement>("[data-snap-item]").forEach((section, i) => {
        const inner = section.querySelector<HTMLElement>("[data-snap-inner]");
        if (!inner) return;

        ScrollTrigger.create({
          trigger: section, scroller, start: "top center", end: "bottom center",
          onToggle: (self) => self.isActive && setActive(i),
        });

        if (reduce) return;
        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: {
            trigger: section, scroller, start: i === 0 ? "top top" : "top bottom", end: "bottom top", scrub: true,
            onLeave: () => gsap.set(inner, { clearProps: "transform,opacity" }),
            onLeaveBack: () => gsap.set(inner, { clearProps: "transform,opacity" }),
          },
        });
        if (i === 0) tl.fromTo(inner, CENTER, { ...LEAVE, duration: 1 });
        else tl.fromTo(inner, window.innerWidth < 768 ? { ...ENTER, yPercent: 0 } : ENTER, { ...CENTER, duration: 1 }).to(inner, { ...LEAVE, duration: 1 });
      });

      ScrollTrigger.create({
        scroller, start: 0, end: "max",
        onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`; },
      });
    }, scroller);

    return () => ctx.revert();
  }, []);

  const go = (i: number) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (el && root.current) root.current.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  // A link like /art/#food-restaurants (the home carousel) opens straight on that section.
  useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = slides.findIndex((s) => s.id === id);
      const el = root.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
      if (i > 0 && el && root.current) { root.current.scrollTo({ top: el.offsetTop, behavior: "auto" }); setActive(i); }
    };
    const t = setTimeout(jump, 0);
    window.addEventListener("hashchange", jump);
    return () => { clearTimeout(t); window.removeEventListener("hashchange", jump); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(Math.min(active + 1, slides.length - 1)); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(Math.max(active - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Intro reel: muted autoplay while slide 0 is active, paused otherwise.
  useEffect(() => {
    const el = introVid.current; if (!el) return;
    if (introMuted) el.muted = true;
    el.defaultMuted = true;
    if (active === 0) el.play().catch(() => { el.muted = true; setIntroMuted(true); el.play().catch(() => {}); });
    else el.pause();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleIntroSound = () => {
    const el = introVid.current;
    if (!el) return;
    el.muted = !el.muted;
    setIntroMuted(el.muted);
    if (!el.muted) soloAudio(el);
    if (el.paused) el.play().catch(() => {});
  };
  // When another video takes the sound, this icon shows muted again.
  useEffect(() => {
    const el = introVid.current; if (!el) return;
    const sync = () => setIntroMuted(el.muted);
    el.addEventListener("volumechange", sync);
    return () => el.removeEventListener("volumechange", sync);
  }, []);

  const slide = "relative h-[100svh] w-full snap-start snap-always overflow-hidden bg-[#0B0B0C]";
  const inner = "h-full w-full will-change-transform origin-center";

  return (
    <div className="fixed inset-0 art-theme">
      {/* Approved menu: large vertical labels, only the open section and its two neighbours are shown. */}
      <nav aria-label="Sections" className="fixed left-3 sm:left-5 top-14 sm:top-[72px] bottom-4 z-40 flex items-center gap-2 sm:gap-3 w-12 pointer-events-none">
        <div className="relative self-stretch my-6 w-px bg-[#3A3632] shrink-0">
          <div ref={bar} className="absolute inset-0 bg-[#C9A962] origin-top" style={{ transform: "scaleY(0)" }} />
        </div>
        <ol className="flex flex-col items-center gap-7 max-h-full overflow-visible shrink-0 pointer-events-auto">
          {slides.map((s, i) => {
            const on = i === active;
            if (Math.abs(i - active) > 1) return null;
            return (
              <li key={s.id} className="flex">
                <button onClick={() => go(i)} aria-label={s.label.replace("\n", " ")} aria-current={on ? "true" : undefined}
                  className={`relative font-body uppercase whitespace-nowrap flex flex-row-reverse leading-[1.2] rotate-180 tracking-[0.18em] transition-colors duration-300 ${on ? "text-[#F2EDE6] text-[16px] border-r border-[#C9A962] pr-1.5" : "text-[#8A837A] text-[13px] hover:text-[#C9A962]"}`}>
                  {/* Each line is its own vertical column, so Safari never clips the second line. */}
                  {s.label.split("\n").map((line, k) => <span key={k} className="block [writing-mode:vertical-rl]">{line}</span>)}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={root} className="relative h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {/* Slide 0: Art headline — Taormina stand-in for showreel; Safari needs muted start + sound icon */}
        <section data-snap-item data-index={0} id="intro" className={`${slide} max-md:!h-auto`}>
          {/* Phone: heading above the film, description under it. Desktop: film fills the screen, text over it. */}
          <div data-snap-inner className={`${inner} relative flex flex-col pt-14 md:block md:pt-0`}>
            <div className="relative bg-black md:absolute md:inset-0 md:flex md:items-center md:justify-center">
              <div className="relative w-full aspect-video md:max-w-[calc(100svh*16/9)]">
                <video
                  ref={introVid}
                  src={taormina.src}
                  poster={taormina.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-label={taormina.title}
                />
                <div onClick={() => setIntroOpen(true)} role="button" aria-label={`${taormina.title} (click to enlarge)`} className="md:hidden absolute inset-0 bg-black/35 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_55%)] cursor-zoom-in" />
                {/* Phone: the headline stays on the film itself, bottom left. */}
                <div className="md:hidden absolute left-16 right-28 bottom-3 pointer-events-none">
                  <div className="label mb-1">Art</div>
                  <h1 className="font-display font-normal text-2xl leading-[1.05] mb-2">[Art headline]</h1>
                  <div className="gold-rule" />
                </div>
                {/* Sound, full-screen and pause icons always sit on the film itself. */}
                <SoundToggle muted={introMuted} onClick={toggleIntroSound} className="right-2 bottom-2" />
                <ExpandButton onClick={() => setIntroOpen(true)} className="right-11 bottom-2" />
                <VideoScrubber video={introVid} />
                <PlayButton video={introVid} label={`Play ${taormina.title}`} />
              </div>
            </div>
            <div className="md:hidden pl-16 pr-6 pt-4 pb-10">
              <Ph className="h-16 max-w-xl">[Short intro / description: 1 to 2 lines]</Ph>
              <div className="label mt-5">Scroll ↓</div>
            </div>
            <div onClick={() => setIntroOpen(true)} role="button" aria-label={`${taormina.title} (click to enlarge)`} className="hidden md:block absolute inset-0 z-0 bg-black/35 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_55%)] cursor-zoom-in" />
            <div className="hidden md:flex relative h-full flex-col justify-end pb-24 pl-[4.5rem] lg:pl-24 pr-6 max-w-4xl pointer-events-none">
              <div className="label mb-3">Art</div>
              <div className="font-display font-normal text-6xl leading-[1.05] mb-4">[Art headline]</div>
              <div className="gold-rule mb-5" />
              <Ph className="h-20 max-w-xl">[Short intro / description: 1 to 2 lines]</Ph>
              <div className="label mt-8">Scroll ↓</div>
            </div>
          </div>
        </section>
        {introOpen && typeof document !== "undefined" && createPortal(
          <div role="dialog" aria-modal="true" aria-label={taormina.title} onClick={() => setIntroOpen(false)} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="relative aspect-video bg-black border border-white/15 rounded-xl overflow-hidden shadow-2xl" style={{ width: "min(90vw, calc(90vh * 16 / 9))" }}>
              <video ref={introLb} src={taormina.src} poster={taormina.poster} loop playsInline autoPlay muted={introMuted} className="absolute inset-0 h-full w-full object-contain" />
              <SoundToggle muted={introMuted} onClick={toggleIntroLb} className="right-2 bottom-2" />
              <VideoScrubber video={introLb} pillClassName="!right-11" />
              <button onClick={() => setIntroOpen(false)} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/60 text-white text-xl leading-none border border-white/20 hover:bg-black/80">×</button>
            </div>
          </div>, document.body)}

        {sections.map((s, i) => {
          const animation = s.id === "animation";
          const aspect: "video" | "portrait" = s.portrait || s.hybrid ? "portrait" : "video";
          const on = active === i + 1;
          const near = Math.abs(active - (i + 1)) <= 1;
          return (
            <section key={s.id} data-snap-item data-index={i + 1} id={s.id} className={slide}>
              <div data-snap-inner className={inner}>
                {/* Desktop: 1/3 text | 2/3 media. Phone: heading above the media, description under it. */}
                <div className="h-full w-full grid grid-rows-[auto_auto_1fr] content-start md:content-stretch md:grid-rows-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] [&>*:nth-child(2)]:order-2 md:[&>*:nth-child(2)]:order-none gap-4 md:gap-8 pl-16 sm:pl-[4.5rem] pr-4 md:pr-6 pt-20 pb-6 md:pb-8">
                  <div className="contents md:flex md:flex-col md:justify-center min-w-0">
                    <div className="order-1 md:order-none">
                      <h2 className="font-display font-normal text-3xl md:text-5xl leading-[1.05] mb-3 md:mb-5">{s.title}</h2>
                      <div className="gold-rule md:mb-3" />
                    </div>
                    <div className="order-3 md:order-none min-w-0">
                    {s.text ? (
                      <p className="mt-2 text-[13px] md:text-base leading-relaxed text-[#CFC8BE] max-w-xl">{s.text}</p>
                    ) : (
                      <Ph className="h-16 md:h-28 mt-2">{animation ? "[Description: Amber City animated series, 2 to 3 lines]" : "[Description: what this service is, 2 to 3 lines]"}</Ph>
                    )}
                    {s.note ? <p className="label mt-3 opacity-70">{s.note}</p> : null}
                    </div>
                  </div>
                  {animation ? (
                    <div className="flex flex-col justify-center gap-3 min-h-0 min-w-0">
                      <WorkVideo v={ep1} active={on} near={near} />
                      <div className="grid grid-cols-4 gap-2 md:gap-3 shrink-0">
                        {[0, 1, 2, 3].map((j) => (
                          <Ph key={j} className="aspect-video w-full">{""}</Ph>
                        ))}
                      </div>
                    </div>
                  ) : s.hybrid && s.video ? (
                    // Film sets the height; carousel matches it (4:5 box, wider). See .hybrid-media in globals.css.
                    <div className="hybrid-media min-h-0 min-w-0 h-[var(--ph)] md:h-auto">
                      <WorkVideo v={s.video} aspect="portrait" active={on} near={near} className="hybrid-film" />
                      <HybridCarousel active={on} className="hybrid-carousel" />
                    </div>
                  ) : s.videos ? (
                    <div className="min-h-0 min-w-0 flex items-center justify-center gap-3">
                      {/* Several videos: only the first autoplays, the rest wait for a tap */}
                      {s.videos.map((v, k) => (
                        <WorkVideo key={v.src} v={v} aspect={aspect} active={on} near={near} auto={k === 0} className="h-[var(--ph)] !w-[calc(var(--ph)*9/16)]" />
                      ))}
                    </div>
                  ) : s.video ? (
                    <div className="min-h-0 min-w-0 flex items-center justify-center">
                      <WorkVideo v={s.video} aspect={aspect} active={on} near={near} className={aspect === "portrait" ? "h-[var(--ph)] !w-[calc(var(--ph)*9/16)]" : undefined} />
                    </div>
                  ) : (
                    <div className="min-h-0 min-w-0 flex items-center justify-center">
                      <Ph className={aspect === "portrait" ? "aspect-[9/16] h-[var(--ph)] w-auto" : "aspect-video w-full"}>
                        <span>[{s.work}: final cut ~40s]</span>
                      </Ph>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        <section data-snap-item data-index={sections.length + 1} id="pricing" className={slide}>
          <div data-snap-inner className={inner}>
            <div className="h-full flex flex-col justify-center pl-16 sm:pl-[4.5rem] lg:pl-24 pr-6 pt-16">
              <div className="label mb-3">Pricing</div>
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

        <section data-snap-item data-index={sections.length + 2} id="contact" className={slide}>
          <div data-snap-inner className={inner}>
            <div className="h-full flex flex-col items-center justify-center text-center pl-16 sm:pl-[4.5rem] lg:pl-24 pr-6">
              <div className="label mb-3">Contact</div>
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
