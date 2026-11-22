"use client";
import { useEffect } from "react";

// Keeps the phone screen on while any video on the page is playing (muted videos do not do this on their own).
// The lock is released when every video is paused or the tab is hidden, and taken again when the tab comes back.
type Sentinel = { release: () => Promise<void>; released?: boolean };
type WakeNav = Navigator & { wakeLock?: { request: (t: "screen") => Promise<Sentinel> } };

export function WakeLock() {
  useEffect(() => {
    const nav = navigator as WakeNav;
    if (!nav.wakeLock) return;
    let lock: Sentinel | null = null;
    let asking = false;
    const anyPlaying = () => Array.from(document.querySelectorAll("video")).some((v) => !v.paused && !v.ended);
    const update = async () => {
      const want = anyPlaying() && document.visibilityState === "visible";
      if (want && (!lock || lock.released) && !asking) {
        asking = true;
        try { lock = await nav.wakeLock!.request("screen"); } catch { lock = null; }
        asking = false;
      } else if (!want && lock && !lock.released) {
        const l = lock; lock = null; l.release().catch(() => {});
      }
    };
    const onMedia = () => { void update(); };
    document.addEventListener("play", onMedia, true);
    document.addEventListener("playing", onMedia, true);
    document.addEventListener("pause", onMedia, true);
    document.addEventListener("ended", onMedia, true);
    document.addEventListener("visibilitychange", onMedia);
    void update();
    return () => {
      document.removeEventListener("play", onMedia, true);
      document.removeEventListener("playing", onMedia, true);
      document.removeEventListener("pause", onMedia, true);
      document.removeEventListener("ended", onMedia, true);
      document.removeEventListener("visibilitychange", onMedia);
      if (lock && !lock.released) lock.release().catch(() => {});
    };
  }, []);
  return null;
}
