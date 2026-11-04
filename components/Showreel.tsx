"use client";
import { useEffect, useRef, useState } from "react";

// Hero showreel: muted, softly blurred and darkened background so the logo reads on any frame.
// "Watch showreel" opens the same film sharp, full screen, with sound.
export default function Showreel({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const v = full.current;
    ref.current?.pause();
    if (v) { v.currentTime = 0; v.muted = false; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      ref.current?.play().catch(() => {});
    };
  }, [open]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-contain scale-[1.04] [filter:blur(3px)]"
        src="/showreel-1.mp4"
        poster="/showreel-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative h-full">{children}</div>
      <button
        onClick={() => setOpen(true)}
        className="frame-btn absolute bottom-6 right-6 z-20 !min-w-0 !h-11 !px-5 !text-[11px] !tracking-[0.24em]"
      >
        Watch showreel
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" role="dialog" aria-label="Showreel">
          <video ref={full} className="h-full w-full object-contain" src="/showreel-1.mp4" controls playsInline autoPlay />
          <button
            onClick={() => setOpen(false)}
            className="frame-btn absolute top-4 right-4 z-10 !min-w-0 !h-10 !px-4 !text-[11px] !tracking-[0.24em]"
            aria-label="Close showreel"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
