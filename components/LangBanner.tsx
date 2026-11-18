"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";

// Auto-translation notice for DE and IT only. Wording lives in banner.notice so it is easy to change.
// After OK (or Escape) it is not shown again for that language.
const storageKey = (locale: string) => `arlix-lang-notice:${locale}`;

export function LangBanner() {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (locale === "en") {
      setOpen(false);
      return;
    }
    try {
      setOpen(!localStorage.getItem(storageKey(locale)));
    } catch {
      setOpen(true);
    }
  }, [locale]);

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey(locale), "1");
    } catch { /* storage may be blocked */ }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, locale]);

  if (locale === "en" || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-describedby="lang-notice-text"
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
    >
      <div className="flex aspect-square w-[min(88vw,26rem)] flex-col items-center justify-center gap-8 px-8 py-8 bg-black/55 border border-white/20 backdrop-blur-sm font-body text-[#C9C3BA]">
        <p id="lang-notice-text" className="m-0 whitespace-pre-line text-center text-[16px] sm:text-[17px] leading-[1.55]">
          {t("banner.notice")}
        </p>
        <button
          ref={okRef}
          type="button"
          onClick={dismiss}
          className="frame-btn !min-w-[8rem]"
        >
          OK
        </button>
      </div>
    </div>
  );
}
