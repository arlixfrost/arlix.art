"use client";
import { useEffect, useRef, useState } from "react";
import { PlayButton } from "@/components/PlayButton";

type Slide =
  | { n: number; kind: "photo" | "product" | "hook" | "cta"; src: string; label: string }
  | { n: number; kind: "film"; src: string; poster: string; label: string };

const slides: Slide[] = [
  { n: 1, kind: "hook", src: "/art/hybrid/carousel/01-hook-nodrones.jpg", label: "NO DRONES. NO CREW. JUST IPHONE PHOTOS." },
  { n: 2, kind: "photo", src: "/art/hybrid/carousel/02-photo-table.jpg", label: "PHOTO" },
  { n: 3, kind: "film", src: "/art/hybrid/carousel/03-ai-table.mp4", poster: "/art/hybrid/carousel/03-ai-table.jpg", label: "AI FILM" },
  { n: 4, kind: "photo", src: "/art/hybrid/carousel/04-photo-plongeoir.jpg", label: "PHOTO" },
  { n: 5, kind: "film", src: "/art/hybrid/carousel/05-ai-dive.mp4", poster: "/art/hybrid/carousel/05-ai-dive.jpg", label: "AI FILM" },
  { n: 6, kind: "product", src: "/art/hybrid/carousel/06-product-jacquemus.jpg", label: "PRODUCT PHOTO" },
  { n: 7, kind: "film", src: "/art/hybrid/carousel/07-same-product-walk.mp4", poster: "/art/hybrid/carousel/07-same-product-walk.jpg", label: "SAME PRODUCT IN MY FILM" },
  { n: 8, kind: "photo", src: "/art/hybrid/carousel/08-photo-plate.jpg", label: "PHOTO" },
  { n: 9, kind: "film", src: "/art/hybrid/carousel/09-ai-plate.mp4", poster: "/art/hybrid/carousel/09-ai-plate.jpg", label: "AI FILM" },
  { n: 10, kind: "cta", src: "/art/hybrid/carousel/10-cta-offer.jpg", label: "NO CREW. NO CASTING. NO SHOOTING DAY. DM TO ORDER" },
];

export function HybridCarousel({ className = "", active = true }: { className?: string; active?: boolean }) {
  const [i, setI] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const s = slides[i];

  // Restart a film slide when it is shown.
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.currentTime = 0;
  }, [i]);

  // Film slides play muted only while the section is active (iOS needs the muted property set before play()).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true; el.defaultMuted = true;
    if (active) el.play().catch(() => {});
    else el.pause();
  }, [i, active]);

  const prev = () => setI((x) => (x - 1 + slides.length) % slides.length);
  const next = () => setI((x) => (x + 1) % slides.length);

  return (
    <div className={`relative bg-black overflow-hidden aspect-[4/5] ${className}`}>
      {s.kind === "film" ? (
        <video
          key={s.src}
          ref={videoRef}
          src={s.src}
          poster={s.poster}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain"
          aria-label={`Slide ${s.n} · ${s.label}`}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.src} alt={`Slide ${s.n} · ${s.label}`} className="absolute inset-0 h-full w-full object-contain" />
      )}
      {s.kind === "film" && <PlayButton key={s.src} video={videoRef} label={`Play slide ${s.n}`} />}
      <button type="button" onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 border border-white/20 text-white">‹</button>
      <button type="button" onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 border border-white/20 text-white">›</button>
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
        {slides.map((sl, idx) => (
          <button key={sl.n} type="button" aria-label={`Go to slide ${sl.n}`} onClick={() => setI(idx)}
            className={`h-1.5 w-1.5 rounded-full ${idx === i ? "bg-white" : "bg-white/35"}`} />
        ))}
      </div>
    </div>
  );
}
