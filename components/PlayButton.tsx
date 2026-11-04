"use client";
import { useEffect, useState } from "react";

// Round play button in the centre of a video. It appears whenever the video has stayed paused
// for a moment (autoplay blocked, e.g. iPhone Low Power Mode, or paused by the viewer), so there
// is always a way to start the film. A short delay keeps it from flashing while autoplay starts.
export function PlayButton({ video, label = "Play", className = "" }: { video: React.RefObject<HTMLVideoElement | null>; label?: string; className?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = video.current; if (!el) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      clearTimeout(t);
      if (el.paused && el.getAttribute("src")) t = setTimeout(() => setShow(el.paused), 700);
      else setShow(false);
    };
    update();
    el.addEventListener("play", update);
    el.addEventListener("playing", update);
    el.addEventListener("pause", update);
    el.addEventListener("loadstart", update);
    return () => {
      clearTimeout(t);
      el.removeEventListener("play", update);
      el.removeEventListener("playing", update);
      el.removeEventListener("pause", update);
      el.removeEventListener("loadstart", update);
    };
  }, [video]);

  if (!show) return null;
  const start = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = video.current; if (!el) return;
    el.play().catch(() => { el.muted = true; el.play().catch(() => {}); });
  };
  return (
    <button type="button" onClick={start} aria-label={label}
      className={`absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/55 border border-white/30 text-[#F2EDE6] flex items-center justify-center backdrop-blur-sm hover:border-[#C9A962] hover:text-[#C9A962] transition-colors ${className}`}>
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
    </button>
  );
}
