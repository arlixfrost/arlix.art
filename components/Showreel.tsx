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
        className="frame-btn absolute bottom-6 right-6 z-20 !min-w-0 !h-11 !px-5 !text-[11px] !tracking-[0.24em]"
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
      >
        {muted ? "Sound on" : "Sound off"}
      </button>
    </div>
  );
}
