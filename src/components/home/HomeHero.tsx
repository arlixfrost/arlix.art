"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HeroNav } from "@/components/home/HeroNav";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Placeholder poster (SVG). Replace with `/hero-poster.jpg` when ready. */
const HERO_POSTER = "/hero-poster.svg";
const HERO_VIDEO = "/hero.mp4";

const logoClass =
  "font-serif font-semibold text-[var(--color-text)] text-[2rem] md:text-[4rem]";

function configureVideoForIos(el: HTMLVideoElement) {
  el.muted = true;
  el.defaultMuted = true;
  el.volume = 0;
  el.playsInline = true;
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "true");
  el.setAttribute("x5-playsinline", "true");
}

export function HomeHero() {
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [decodeError, setDecodeError] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  /** Show video unless user explicitly prefers reduced motion (not while hook is still null). */
  const useVideo = reducedMotion !== true && !decodeError;

  const attemptPlay = useCallback(async () => {
    const el = videoRef.current;
    if (!el || !useVideo) return;

    configureVideoForIos(el);

    try {
      await el.play();
      setNeedsTap(false);
    } catch {
      // iOS often rejects the first play() — do not treat as fatal
      setNeedsTap(true);
    }
  }, [useVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !useVideo) return;

    configureVideoForIos(el);

    const events = ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"] as const;
    events.forEach((name) => el.addEventListener(name, attemptPlay));

    void attemptPlay();

    const onVisible = () => {
      if (document.visibilityState === "visible") void attemptPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    const onFirstTouch = () => {
      void attemptPlay();
    };
    document.addEventListener("touchstart", onFirstTouch, { once: true, passive: true });

    return () => {
      events.forEach((name) => el.removeEventListener(name, attemptPlay));
      document.removeEventListener("visibilitychange", onVisible);
      document.removeEventListener("touchstart", onFirstTouch);
    };
  }, [useVideo, attemptPlay]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--color-bg)]">
      {/* Mobile only: ambient blurred backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 md:hidden" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_POSTER}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-[44px] brightness-[0.42]"
        />
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-bg)_42%,transparent)]" />
        <div className="vignette-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 grid min-h-dvh grid-cols-1 grid-rows-1 md:grid-cols-[1fr_2fr]">
        <div className="pointer-events-none relative z-20 col-start-1 row-start-1 min-h-dvh md:grid md:place-items-center md:bg-[var(--color-bg)] md:border-r md:border-[color-mix(in_srgb,var(--color-text-muted)_28%,transparent)]">
          <div className="flex min-h-dvh w-full flex-col md:hidden">
            <header className="pointer-events-auto flex justify-center px-6 pt-10">
              <Link
                href="/"
                className={`${logoClass} drop-shadow-[0_2px_28px_rgba(0,0,0,0.45)]`}
                style={{ letterSpacing: "0.15em", paddingLeft: "0.15em" }}
              >
                ARLIX
              </Link>
            </header>
            <div className="flex-1" />
            <HeroNav className="pointer-events-auto drop-shadow-[0_2px_28px_rgba(0,0,0,0.45)]" />
          </div>

          <div className="pointer-events-auto hidden flex-col items-center gap-5 px-10 md:flex">
            <Link
              href="/"
              className={logoClass}
              style={{ letterSpacing: "0.15em", paddingLeft: "0.15em" }}
            >
              ARLIX
            </Link>
            <HeroNav className="!px-0 !pb-0" />
          </div>
        </div>

        <div className="relative z-0 col-start-1 row-start-1 md:col-start-2 md:row-start-1">
          <div className="relative min-h-dvh w-full md:h-full md:min-h-dvh">
            {useVideo ? (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={HERO_VIDEO}
                  autoPlay
                  playsInline
                  muted
                  defaultMuted
                  loop
                  preload="auto"
                  poster={HERO_POSTER}
                  disablePictureInPicture
                  controls={false}
                  onError={() => setDecodeError(true)}
                />
                {needsTap ? (
                  <button
                    type="button"
                    className="absolute inset-0 z-10 cursor-default bg-transparent"
                    aria-label="Play hero video"
                    onClick={() => void attemptPlay()}
                  />
                ) : null}
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={HERO_POSTER}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            )}
            <div
              className="pointer-events-none absolute inset-0 vignette-overlay md:opacity-60"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </main>
  );
}
