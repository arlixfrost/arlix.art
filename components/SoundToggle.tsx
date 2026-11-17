"use client";
import { useI18n } from "@/components/LocaleProvider";

// Small round speaker icon that replaces the "Sound on / Mute" text buttons.
// Muted: speaker with a cross. Sound on: speaker with sound waves.
export function SoundToggle({ muted, onClick, className = "" }: { muted: boolean; onClick: (e: React.MouseEvent) => void; className?: string }) {
  const { locale, t } = useI18n();
  const soundLabel = muted
    ? (locale === "en" ? "Turn sound on" : t("common.turnSoundOn"))
    : (locale === "en" ? "Turn sound off" : t("common.turnSoundOff"));
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={soundLabel}
      className={`absolute z-20 h-8 w-8 rounded-full bg-black/55 border border-white/30 text-[#F2EDE6] flex items-center justify-center backdrop-blur-sm hover:border-[#C9A962] hover:text-[#C9A962] transition-colors ${className}`}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {muted ? (
          <>
            <path d="M16 9.5l5 5" />
            <path d="M21 9.5l-5 5" />
          </>
        ) : (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" />
            <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        )}
      </svg>
    </button>
  );
}

// Small round "full screen" icon (four corners), same style as the sound icon.
export function ExpandButton({ onClick, className = "" }: { onClick: (e: React.MouseEvent) => void; className?: string }) {
  const { locale, t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={locale === "en" ? "Watch full screen" : t("common.watchFullScreen")}
      className={`absolute z-20 h-8 w-8 rounded-full bg-black/55 border border-white/30 text-[#F2EDE6] flex items-center justify-center backdrop-blur-sm hover:border-[#C9A962] hover:text-[#C9A962] transition-colors ${className}`}
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M4 15v5h5" /><path d="M20 15v5h-5" />
      </svg>
    </button>
  );
}
