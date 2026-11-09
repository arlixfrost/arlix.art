// Phones: open the video in the phone's own full screen player (no frame, no browser bars).
// iPhone Safari only allows full screen on the <video> element itself, through webkitEnterFullscreen,
// and only inside a tap; other phones use the standard Fullscreen API on the video.
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitSupportsFullscreen?: boolean };

export function isPhone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches && Math.min(window.innerWidth, window.innerHeight) < 820;
}

/** Returns true when the phone's own full screen player was opened. Must be called inside a tap. */
export function phoneFullscreen(el: HTMLVideoElement | null, withSound = true): boolean {
  if (!el || !isPhone()) return false;
  const v = el as IOSVideo;
  try {
    if (withSound) v.muted = false;
    v.play().catch(() => {});
    if (typeof v.webkitEnterFullscreen === "function") { v.webkitEnterFullscreen(); return true; }
    if (typeof v.requestFullscreen === "function") { v.requestFullscreen().catch(() => {}); return true; }
  } catch { /* fall back to the in-page player */ }
  return false;
}
