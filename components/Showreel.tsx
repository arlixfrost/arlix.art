"use client";
import { useEffect, useRef, useState } from "react";

export default function Showreel({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

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
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative h-full">{children}</div>
      <button
        onClick={toggle}
        className="absolute bottom-5 right-5 z-20 rounded-full border border-white/40 bg-black/50 px-4 py-2 text-xs tracking-wide hover:bg-black/70"
        aria-label={muted ? "Unmute showreel" : "Mute showreel"}
      >
        {muted ? "🔇 Sound off · tap to unmute" : "🔊 Sound on · tap to mute"}
      </button>
    </div>
  );
}
