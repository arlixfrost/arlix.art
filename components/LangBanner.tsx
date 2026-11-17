"use client";

import { useI18n } from "@/components/LocaleProvider";

// Auto-translation notice, DE and IT only. Wording lives in messages/*.json (banner.notice) so it is easy to change.
export function LangBanner() {
  const { locale, t } = useI18n();
  if (locale === "en") return null;
  return (
    <div className="fixed top-14 sm:top-[72px] inset-x-0 z-[45] flex justify-center px-3 pt-2 pointer-events-none">
      <p className="pointer-events-auto m-0 max-w-[min(92vw,28rem)] px-3.5 py-1.5 rounded-full bg-black/55 border border-white/20 backdrop-blur-sm font-body text-[11px] sm:text-[12px] leading-snug text-[#C9C3BA] text-center">
        {t("banner.notice")}
      </p>
    </div>
  );
}
