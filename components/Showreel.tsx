"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoScrubber } from "@/components/VideoScrubber";

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
    if (src && el) { el.currentTime = src.currentTime; el.muted = muted; el.play().catch(() => {}); src.pause(); }
    return () => {
      window.removeEventListener("keydown", onKey); document.body.style.overflow = prev;
      const s2 = ref.current; if (s2) { if (el) s2.currentTime = el.currentTime; s2.play().catch(() => {}); }
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
      <button
        onClick={toggle}
        className="frame-btn absolute bottom-3 right-3 md:bottom-6 md:right-6 z-20 !min-w-0 !h-8 md:!h-11 !px-3 md:!px-5 !text-[10px] md:!text-[11px] !tracking-[0.22em]"
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
      >
        {muted ? "Sound on" : "Sound off"}
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Showreel" onClick={() => setOpen(false)} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative aspect-video bg-black border border-white/15 rounded-xl overflow-hidden shadow-2xl" style={{ width: "min(90vw, calc(90vh * 16 / 9))" }}>
            <video ref={lb} src="/showreel-1.mp4" poster="/showreel-poster.jpg" loop playsInline autoPlay muted={muted} className="absolute inset-0 h-full w-full object-contain" />
            <button onClick={toggleLb} className="frame-btn absolute right-3 bottom-3 !min-w-0 !h-9 !px-3 !text-[10px] !tracking-[0.2em]">{muted ? "Sound on" : "Mute"}</button>
            <VideoScrubber video={lb} />
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/60 text-white text-xl leading-none border border-white/20 hover:bg-black/80">×</button>
          </div>
        </div>, document.body)}
    </div>
  );
}
