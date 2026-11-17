"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ph } from "@/components/Ph";
import { WorkVideo } from "@/components/ArtSlides";
import { SiteFooter } from "./SiteFooter";
import { ReadMore, type More } from "@/components/ReadMore";

type Box = { h: string; p: string; big?: boolean };
type Item = { id: string; title: string; menu?: string; text?: string; price?: string; video?: { src: string; poster: string; title: string }; short?: string[]; boxes?: Box[]; three?: boolean };

// [text] = phrase set slightly bolder and lighter, as in Art.
function rich(t: string) {
  return t.split(/(\[[^\]]+\])/g).map((part, i) => part.startsWith("[") ? <strong key={i} className="font-medium text-[#F2EDE6]">{part.slice(1, -1)}</strong> : part);
}

// Individual consultations and Training for small business are merged into one block.
const items: Item[] = [
  {
    id: "consultations-training",
    title: "AI Consulting & Training",
    menu: "AI Consulting\n& Training",
    short: [
      "One-to-one or in a small group, online or in person.",
      "Everything starts with your real business problems: the most urgent are solved first.",
      "Knowledge you can use right away.",
      "CV and LinkedIn adaptation to ATS filters.",
    ],
    boxes: [
      { h: "Where to start with AI?", p: "The starting point is the urgent needs of your business, not theory. You have [years of experience] in your field, and AI is simply the [next tool] to make your days easier. The best things to hand over to it are the ones you never enjoyed: routine, repetition and organisational chaos." },
      { h: "What happens on the first call?", p: "On the first call, you talk through what really slows your business down and what it needs at the moment. From this comes a short list of [AI tools] chosen for what you do: the ones to learn and start using now. You can put this into practice while the session is still going, or as soon as it ends." },
      { h: "How do the lessons work?", p: "Every lesson is [individual] and starts with your [most urgent needs]: lots of images for social media, simple automations or an agent for incoming requests. It is designed so that you can use it immediately to make your life and work easier. Lessons are online or in person, and AI agents can be set up right on your computer, so your data stays with you." },
      { h: "Looking for a new job, but no replies?", p: "Perhaps your CV is simply invisible. Recruiters use [ATS filters] – programs that scan CVs for keywords. If your CV has not been adapted, it does not get through them, and a real HR person never sees it. Without adaptation to [modern standards], it has no chance of reaching a human." },
    ],
  },
  {
    id: "web-design",
    title: "Web Design",
    menu: "Web Design",
    short: [
      "Modern [multilingual] website, ready in 1 week.",
      "You manage it yourself: no programmer needed.",
      "Made without templates, with no monthly fees.",
      "Not suitable for online payments.",
    ],
    boxes: [
      { h: "What does the website include?", p: "You get a website designed from scratch and fully set up. It comes with [modern graphics] and motion design to 2026 standards. The site can also be interactive or even game-like, so it catches your customers' attention and keeps them interested. After the launch, a [short lesson] / manual shows how to edit it on your own." },
      { h: "Full control without waiting?", p: "You are in [full control] of your website. Prices, special offers, new products, a seasonal menu, sales: you change them all [yourself], in just a few minutes. No more long waits for an IT specialist to make your edits. Your changes appear on the site quickly, even late at night or at weekends." },
      { h: "Will it stand out from competitors?", p: "Your website is built entirely for you, with no [templates], so it looks nothing like your competitors' sites. It is based on an analysis of your [brand style]: not only colours, but also fonts, the logo, images and the tone of your texts. This way, it matches your brand's image on social media and in outdoor advertising." },
      { h: "What happens after the handover?", p: "From then on, each page and file belongs to you. There are no extra [monthly fees] and no developer's salary to pay. All you need is a subscription to Claude / ChatGPT / Grok / Gemini, which helps you update the website whenever you want." },
    ],
  },
  {
    id: "content-factory",
    title: "Monthly Content",
    menu: "Monthly\nContent",
    short: [
      "Bright, eye-catching content planned a month ahead.",
      "Carousels, videos and infographics in one brand style.",
      "Hybrid: your live photos and videos plus AI content.",
    ],
    boxes: [
      { h: "Why post every day?", p: "Growing a brand means posting every day. That is how [algorithms] work today, unfortunately. But you have a business to run, not hours to spend filming and editing. No more [headache] of closing your venue for a photo or video shoot, or of filming videos yourself." },
      { h: "How does the hybrid work?", p: "The strongest mix for Instagram is real content together with AI content: then both your live videos and the AI content get promoted. Filming a video is easy. Making it stand out is the hard part: professional [editing] with infographics, and carousels in one style, so people recognise your [brand] at a glance." },
      { h: "What do you get each month?", p: "You get carousels, edited videos or any other format you need. You choose: content made from your own photos and videos, or made entirely for you. Everything is made quickly and cleanly to modern standards, in one [brand style]. An [audience analysis] comes with every month." },
      { h: "How is the month planned?", p: "The plan is made at the start of each month, around your calendar and together with your [SMM manager], if you have one. The amount of content is agreed in advance: 30 to 60 items. Publishing, posting and communication with your audience stay on your side or with your SMM manager. What you get is the audience analysis, AI content and the editing of your videos." },
    ],
  },
  {
    id: "assistants-agents",
    title: "Assistants / Agents",
    menu: "Assistants /\nAgents",
    short: [
      "A personal assistant for your email and calendar.",
      "A content machine for your social media and blog.",
      "A creative agent for photos, videos and cartoons.",
      "A 24/7 team that works for you.",
    ],
    boxes: [
      { h: "A personal assistant for your email and calendar.", p: "Your personal assistant sorts your [email], keeps your calendar in order and reminds you about every deadline. It takes care of the routine tasks that fill your day, so you can plan your time calmly. It works [24/7] and never misses a thing." },
      { h: "A content machine for your social media and blog.", p: "The content machine keeps your [social media] and blog running. It builds the content plan, prepares posts with both photos and videos, all in one [brand style]. Your posts are ready even in the weeks when you have no time to think about them." },
      { h: "A creative agent for photos, videos and cartoons.", p: "The creative agent works as a scriptwriter and director. It writes the [scripts], then creates photos, videos and even [cartoons] for your brand. Every idea starts from your business, so the result looks like yours, not like stock images. You get material for social media, your website or an advertising campaign." },
      { h: "A 24/7 team that works for you.", p: "And any agent your business might need, so routine work no longer eats up your time. You describe the problem, and a ready solution is built for you." },
    ],
  },
  {
    id: "royalty-free-music",
    title: "Royalty Free Music",
    menu: "Royalty Free\nMusic",
    short: [
      "Playlists for your business: restaurants, hotels, spas.",
      "Professional sound design and music for videos and ads.",
      "Jingles and a sound brand for your business.",
      "Full commercial rights for everything you receive.",
    ],
    boxes: [
      { h: "Playlists for your business: restaurants, hotels, spas.", p: "Perhaps you have noticed that some restaurants play music that sounds familiar, yet Shazam cannot find it. Most probably, it was made with AI, and this is how businesses save on [music licences]. The music is written in your style, maybe even with [your own lyrics]. Nowadays, this kind of magic is easy." },
      { h: "Professional sound design and music for videos and ads.", p: "Unlicensed tracks, or tracks from the Instagram library, are a risk for ads: Instagram will most probably block your ad or post it with no sound. High-quality [sound design] and editing to the beat make up the lion's share of a video's success. The music is written for your video or chosen from professional libraries, always [licensed for commercial use]." },
      { h: "Full commercial rights for everything you receive.", p: "Every finished video, playlist or jingle is cleared for commercial use. Music written with AI for your business comes with [full commercial rights]. Music from a professional library comes with a [licence certificate], so if a platform or an ad network ever asks, you can show that the music is cleared for use." },
      { h: "Jingles and a sound brand for your business.", p: "A jingle is a short, memorable melody for your business. A [sound brand] is your recognisable sound across videos, ads and your place, so people know it is you." },
    ],
  },
];

const slides = [
  ...items.map((s) => ({ id: s.id, label: s.menu ?? s.title })),
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
    // No zoom-and-tilt on a phone turned sideways: sections there can be taller than the screen, and the tilt would leave headings scaled and turned.
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

        {items.map((s, i) => s.boxes ? (
          <section key={s.id} data-snap-item data-index={i} id={s.id} className={slide}>
            <div data-snap-inner className={inner}>
              {/* Same layout as Art: heading and points in the left third; in place of a film, four framed texts.
                  Phone: the frames move into Read more. */}
              <div className="sec-grid art-grid h-full w-full grid grid-rows-[auto_auto_1fr] content-start md:content-stretch md:grid-rows-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 md:gap-8 pr-[5.5rem] md:pr-28 pl-4 md:pl-6 pt-20 pb-6 md:pb-8">
                <div className="sec-text flex flex-col md:justify-center md:order-2 md:col-start-2 md:row-start-1 md:pl-2 min-w-0">
                  <div className="sec-head">
                    <h2 className="font-display font-normal text-3xl md:text-5xl leading-[1.05] mb-3 md:mb-5">{s.title}</h2>
                    <div className="gold-rule md:mb-3" />
                  </div>
                  <div className="sec-body min-w-0">
                    <div className="mt-3 md:mt-6 pl-4 md:pl-0 max-w-xl">
                      <ul className="short-list short-flow m-0 p-0 list-none flex flex-col gap-4 md:gap-[78px] text-[15px] leading-[1.55] font-normal text-[#E4DED5] md:text-[18px]">
                        {s.short!.map((t) => (
                          <li key={t} className="relative pl-5 [text-wrap:pretty]">
                            <span aria-hidden="true" className="absolute left-0 top-[0.65em] h-[5px] w-[5px] rounded-full bg-[#C9A962]" />
                            {rich(t)}
                          </li>
                        ))}
                      </ul>
                      <div className="tech-more">
                        <ReadMore title={s.title} more={{ columns: [[0, 2], [1, 3]], chapters: s.boxes.map((b) => ({ h: b.h, ps: [b.p] })) } as More} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`tech-boxes min-w-0 grid ${s.three ? "grid-cols-3 grid-rows-2" : "grid-cols-2"} gap-5 content-center md:order-1 md:col-start-1 md:row-start-1`}>
                  {s.boxes.map((b, k) => (
                    <div key={b.h} className={`${s.three && k < 2 ? "row-span-2 " : ""}border border-[#C9A962]/35 px-7 py-7`}>
                      <h3 className="font-display font-normal text-[26px] leading-[1.2] text-[#F2EDE6] m-0">{b.h}</h3>
                      <div className="w-12 h-px bg-[#C9A962] mt-4 mb-5" />
                      {b.big ? <p className="box-big m-0 font-display text-[26px] leading-[1.3] font-normal text-[#F2EDE6]">{rich(b.p)}</p> : <p className="m-0 text-[18px] leading-[1.55] font-normal text-[#E4DED5]">{rich(b.p)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section key={s.id} data-snap-item data-index={i} id={s.id} className={slide}>
            <div data-snap-inner className={inner}>
              <div className={s.video ? `sec-grid h-full grid gap-4 md:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] content-center ${pad} pt-[72px]` : `sec-grid h-full flex flex-col justify-center ${pad} pt-[72px] max-w-6xl`}>
                <div className="flex flex-col justify-center min-w-0">
                <div className="label mb-4">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</div>
                <h2 className="font-display font-normal text-4xl md:text-6xl leading-[1.05] mb-5 md:whitespace-pre-line">{s.title}</h2>
                <div className="gold-rule mb-6" />
                {s.text ? (
                  <p className="text-lg md:text-xl leading-relaxed text-[#CFC8BE] max-w-2xl">{s.text}</p>
                ) : (
                  <Ph className="h-24 max-w-xl">[Description]</Ph>
                )}
                </div>
                {s.video ? (
                  <div className="min-w-0 flex items-center">
                    <WorkVideo v={s.video} active={active === i} near={Math.abs(active - i) <= 1} />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ))}


        <section data-snap-item data-index={items.length} id="contact" className={slide}>
          <div data-snap-inner className={inner}>
            <div className="h-full flex flex-col">
            <div className={`flex-1 flex flex-col items-center justify-center text-center ${pad}`}>
              <div className="label mb-4">Contact</div>
              <h2 className="font-display font-normal text-3xl md:text-5xl mb-6">Start a project</h2>
              <Ph className="h-12 mb-8 w-full max-w-xl">[CTA line: invite to start a project]</Ph>
              <Link href="/contact" className="frame-btn">Contact</Link>
            </div>
            <SiteFooter className="shrink-0 mt-8 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
