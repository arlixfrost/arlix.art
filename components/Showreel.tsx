"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoScrubber } from "@/components/VideoScrubber";
import { SoundToggle } from "@/components/SoundToggle";
import { soloAudio } from "@/components/audio";
import { PlayButton } from "@/components/PlayButton";
import { phoneFullscreen } from "@/components/fullscreen";
import { useI18n } from "@/components/LocaleProvider";

export default function Showreel({ className = "", children, fade }: { className?: string; children?: React.ReactNode; fade?: React.ReactNode }) {
  const { locale, t } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // Upright phone: full screen plays a turned copy of the film in the phone's own player,
  // so it fills the whole screen exactly as it runs on the page, over the browser bars.
  const turned = useRef<HTMLVideoElement>(null);
  const openFull = () => {
    const upright = typeof window !== "undefined" && window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
    const t = turned.current; const v = ref.current;
    if (upright && t && v) {
      try { t.currentTime = v.currentTime; } catch { /* starts from the beginning */ }
      if (phoneFullscreen(t)) { soloAudio(t); v.pause(); return; }
    }
    if (!phoneFullscreen(ref.current)) setOpen(true);
  };
  useEffect(() => {
    const t = turned.current; if (!t) return;
    if (window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches) { try { t.load(); } catch { /* loads on tap instead */ } }
    const done = () => { t.pause(); t.muted = true; const v = ref.current; if (v) { v.muted = true; setMuted(true); v.play().catch(() => {}); } };
    t.addEventListener("webkitendfullscreen", done);
    const onFs = () => { if (!document.fullscreenElement) done(); };
    t.addEventListener("fullscreenchange", onFs);
    return () => { t.removeEventListener("webkitendfullscreen", done); t.removeEventListener("fullscreenchange", onFs); };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  // Tap on the showreel opens it in a framed lightbox, clean (no logo or text), with sound control.
  const [open, setOpen] = useState(false);
  const lb = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const src = ref.current; const el = lb.current;
    if (src && el) { el.currentTime = 0; el.muted = false; setMuted(false); soloAudio(el); el.play().catch(() => { el.muted = true; setMuted(true); el.play().catch(() => {}); }); src.pause(); }
    return () => {
      window.removeEventListener("keydown", onKey); document.body.style.overflow = prev;
      const s2 = ref.current; if (s2) { s2.muted = true; setMuted(true); s2.play().catch(() => {}); }
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleLb = () => { const el = lb.current; if (!el) return; el.muted = !el.muted; setMuted(el.muted); if (!el.muted) soloAudio(el); };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) soloAudio(v);
    if (v.paused) v.play().catch(() => {});
  };
  // When another video takes the sound, this icon shows muted again.
  useEffect(() => {
    const v = ref.current; if (!v) return;
    const sync = () => setMuted(v.muted);
    v.addEventListener("volumechange", sync);
    return () => v.removeEventListener("volumechange", sync);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* Stage: the film with its logo, buttons and icons. On an upright phone the whole stage is turned on its side. */}
      <div className="reel-stage absolute inset-0">
      <video
        ref={ref}
        className="reel-video absolute inset-0 h-full w-full object-cover"
        src="/showreel-1-web.mp4"
        poster="/showreel-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {fade}
      <div onClick={openFull} role="button" aria-label={locale === "en" ? "Open showreel" : t("common.openShowreel")} className="absolute inset-0 bg-black/35 cursor-zoom-in" />
      <PlayButton video={ref} label={locale === "en" ? "Play showreel" : t("common.playShowreel")} />
      <SoundToggle muted={muted} onClick={toggle} className="bottom-2 right-2 md:bottom-6 md:right-6" />
      {/* Small round "full screen" icon next to the sound icon, so it is clear the film opens bigger. */}
      <button type="button" onClick={openFull} aria-label={locale === "en" ? "Watch full screen" : t("common.watchFullScreen")}
        className="absolute z-20 bottom-2 right-11 md:bottom-6 md:right-[3.75rem] h-8 w-8 rounded-full bg-black/55 border border-white/30 text-[#F2EDE6] flex items-center justify-center backdrop-blur-sm hover:border-[#C9A962] hover:text-[#C9A962] transition-colors">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M4 15v5h5" /><path d="M20 15v5h-5" />
        </svg>
      </button>
      </div>
      {/* Turned copy of the film, only for full screen on an upright phone; never shown on the page. */}
      <video ref={turned} src="/showreel-1-portrait.mp4" playsInline loop muted preload="none" aria-hidden="true" tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0" />
      {/* Logo, tagline and buttons stay upright even when the film is turned on its side. */}
      <div className="relative h-full pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{children}</div>
      {open && typeof document !== "undefined" && createPortal(
        <div role="dialog" aria-modal="true" aria-label={locale === "en" ? "Showreel" : t("common.showreel")} onClick={() => setOpen(false)} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 max-md:bg-black backdrop-blur-sm p-4 max-md:p-0">
          <div onClick={(e) => e.stopPropagation()} className="relative aspect-video bg-black border border-white/15 rounded-xl overflow-hidden shadow-2xl max-md:border-0 max-md:rounded-none max-md:shadow-none" style={{ width: "min(90vw, calc(90svh * 16 / 9))" }}>
            <video ref={lb} src="/showreel-1-web.mp4" poster="/showreel-poster.jpg" loop playsInline autoPlay muted={muted} className="absolute inset-0 h-full w-full object-contain" />
            <SoundToggle muted={muted} onClick={toggleLb} className="right-2 bottom-2" />
            <VideoScrubber video={lb} pillClassName="!right-11" />
            <button onClick={() => setOpen(false)} aria-label={locale === "en" ? "Close" : t("common.close")} className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/60 text-white text-xl leading-none border border-white/20 hover:bg-black/80">×</button>
          </div>
        </div>, document.body)}
    </div>
  );
}
