"use client";
import { useEffect, useState, type RefObject } from "react";

const fmt = (t: number) => {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// Pause/Play pill + a seek bar that is shown ONLY while the video is paused.
// Does not touch muted state, so muted-autoplay rules stay with the parent.
export function VideoScrubber({ video, className = "", pillClassName = "" }: { video: RefObject<HTMLVideoElement | null>; className?: string; pillClassName?: string }) {
  const [paused, setPaused] = useState(true);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const el = video.current; if (!el) return;
    const sync = () => { setPaused(el.paused); setT(el.currentTime); if (isFinite(el.duration)) setD(el.duration); };
    const evs = ["play", "pause", "timeupdate", "loadedmetadata", "durationchange", "seeked"] as const;
    evs.forEach((e) => el.addEventListener(e, sync));
    const onPlay = () => setHasPlayed(true);
    el.addEventListener("play", onPlay);
    sync();
    return () => { evs.forEach((e) => el.removeEventListener(e, sync)); el.removeEventListener("play", onPlay); };
  }, [video]);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = video.current; if (!el) return;
    if (el.paused) el.play().catch(() => { el.muted = true; el.play().catch(() => {}); });
    else el.pause();
  };
  const seek = (v: number) => { const el = video.current; if (el) { el.currentTime = v; setT(v); } };

  return (
    <>
      <button type="button" onClick={togglePlay} aria-label={paused ? "Play" : "Pause"}
        className={`absolute left-3 top-3 z-10 h-8 w-8 rounded-full bg-black/55 border border-white/30 text-white text-[11px] leading-none flex items-center justify-center backdrop-blur-sm ${pillClassName}`}>{paused ? "▶" : "❚❚"}</button>
      {paused && hasPlayed && d > 0 && (
        <div onClick={stop} onPointerDown={stop} onKeyDown={stop}
          className={`absolute inset-x-3 bottom-14 z-10 flex items-center gap-2 rounded-full bg-black/55 border border-white/20 px-2.5 py-1.5 backdrop-blur-sm text-white text-[10px] tabular-nums ${className}`}>
          <span className="hidden sm:inline">{fmt(t)}</span>
          <input type="range" min={0} max={d} step={0.05} value={Math.min(t, d)} aria-label="Seek"
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="video-scrub min-w-0 flex-1 h-1 cursor-pointer accent-white" />
          <span className="hidden sm:inline">{fmt(d)}</span>
        </div>
      )}
    </>
  );
}
