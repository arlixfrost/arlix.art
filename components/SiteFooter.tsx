"use client";

import Link from "next/link";
import { useI18n } from "@/components/LocaleProvider";

// Site footer: the same on every page (home, Art, Tech, Contact).
export function SiteFooter({ className = "" }: { className?: string }) {
  const { locale, t, href } = useI18n();
  const copy = locale === "en" ? "© Arlix 2026" : t("footer.copyright");
  const note = locale === "en" ? "All films on this site are created with AI." : t("footer.aiNote");
  return (
    <footer className={`bg-[#0B0B0C] border-t border-[rgba(242,237,230,0.12)] px-6 text-center font-body text-[#9B948B] ${className}`}>
      <div className="text-[12px] tracking-[0.24em] uppercase">{copy}</div>
      <div className="mt-2 text-[12px] tracking-[0.04em]">{note}</div>
      <div className="mt-2 text-[12px] tracking-[0.04em]"><Link href={href("/privacy/")} className="hover:text-[#F2EDE6] transition-colors">{t("privacy.link")}</Link></div>
    </footer>
  );
}
