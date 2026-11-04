"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoScrubber } from "@/components/VideoScrubber";
import { SoundToggle } from "@/components/SoundToggle";

export default function Showreel({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  // Tap on the showreel opens it in a framed lightbox, clean (no logo or text), with sound control.
  const [open, setOpen] = useState(false);
  const lb = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const src = ref.current; const el = lb.current;
    if (src && el) { el.currentTime = 0; el.muted = muted; el.play().catch(() => {}); src.pause(); }
    return () => {
      window.removeEventListener("keydown", onKey); document.body.style.overflow = prev;
      const s2 = ref.current; if (s2) { s2.play().catch(() => {}); }
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleLb = () => { const el = lb.current; if (!el) return; el.muted = !el.muted; setMuted(el.muted); if (ref.current) ref.current.muted = el.muted; };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-contain"
        src="/showreel-1.mp4"
        poster="/showreel-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div onClick={() => setOpen(true)} role="button" aria-label="Open showreel" className="absolute inset-0 bg-black/35 cursor-zoom-in" />
      <div className="relative h-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{children}</div>
      <SoundToggle muted={muted} onClick={toggle} className="bottom-2 right-2 md:bottom-6 md:right-6" />
      {/* Small round "full screen" icon next to the sound icon, so it is clear the film opens bigger. */}
      <button type="button" onClick={() => setOpen(true)} aria-label="Watch full screen"
        className="absolute z-20 bottom-2 right-11 md:bottom-6 md:right-[3.75rem] h-8 w-8 rounded-full bg-black/55 border border-white/30 text-[#F2EDE6] flex items-center justify-center backdrop-blur-sm hover:border-[#C9A962] hover:text-[#C9A962] transition-colors">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M4 15v5h5" /><path d="M20 15v5h-5" />
        </svg>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Showreel" onClick={() => setOpen(false)} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative aspect-video bg-black border border-white/15 rounded-xl overflow-hidden shadow-2xl" style={{ width: "min(90vw, calc(90vh * 16 / 9))" }}>
            <video ref={lb} src="/showreel-1.mp4" poster="/showreel-poster.jpg" loop playsInline autoPlay muted={muted} className="absolute inset-0 h-full w-full object-contain" />
            <SoundToggle muted={muted} onClick={toggleLb} className="right-2 bottom-2" />
            <VideoScrubber video={lb} pillClassName="!right-11" />
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/60 text-white text-xl leading-none border border-white/20 hover:bg-black/80">×</button>
          </div>
        </div>, document.body)}
    </div>
  );
}
