// Phones get lighter copies (same 1080 frame, more efficient compression) of the heaviest films; computers keep the originals.
import { useEffect, useState } from "react";
import { isPhone } from "./fullscreen";

const LIGHT = new Set([
  "/art/artworks/taormina.mp4",
  "/art/brand-fashion-films.mp4",
  "/art/hybrid/le-plongeoir-web.mp4",
  "/art/food/cherry-v2-web.mp4",
  "/art/commercials/lingerie-model-web.mp4",
  "/art/social/paris-red-suit-web.mp4",
  "/art/ai-models/keira-fashion-web.mp4",
]);

export function pickSrc(src: string, phone: boolean): string {
  return phone && LIGHT.has(src) ? src.replace(/\.mp4$/, "-m.mp4") : src;
}

/** If a phone cannot play the light copy, it falls back to the original file. */
export function fallbackToOriginal(e: React.SyntheticEvent<HTMLVideoElement>) {
  const el = e.currentTarget;
  if (el.currentSrc.endsWith("-m.mp4") || el.src.endsWith("-m.mp4")) {
    const orig = el.src.replace(/-m\.mp4$/, ".mp4");
    el.src = orig; el.load(); el.play().catch(() => {});
  }
}

/** null until known, so no film starts downloading before we know which copy to take. */
export function usePhone(): boolean | null {
  const [p, setP] = useState<boolean | null>(null);
  useEffect(() => { setP(isPhone()); }, []);
  return p;
}
