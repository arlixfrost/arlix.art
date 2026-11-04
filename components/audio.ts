// Only one video on the page may play sound at a time.
// soloAudio(el): mute every other <video>; their sound icons follow through the "volumechange" event.
export function soloAudio(el: HTMLVideoElement | null) {
  if (typeof document === "undefined") return;
  document.querySelectorAll("video").forEach((v) => { if (v !== el && !v.muted) v.muted = true; });
}
