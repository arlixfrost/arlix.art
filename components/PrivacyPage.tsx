"use client";

import { useI18n } from "@/components/LocaleProvider";
import { getMessages } from "@/lib/i18n";
import ProtectedEmail from "@/components/ProtectedEmail";

type Block = { h: string; p: string };

// Privacy Policy: general wording, no names, address or tax number anywhere.
export default function PrivacyPage() {
  const { locale, t } = useI18n();
  const blocks = ((getMessages(locale).privacy as { blocks?: Block[] })?.blocks ?? []) as Block[];
  return (
    <main className="art-theme min-h-screen">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 pt-12 md:pt-20 pb-20 md:pb-24">
        <h1 className="font-display font-normal text-[40px] md:text-[56px] leading-[1.05]">{t("privacy.h1")}</h1>
        <div className="gold-rule mt-5 mb-10 md:mb-14" />
        <div className="max-w-3xl">
          {blocks.map((b, i) => (
            <section key={i} className="py-7 md:py-8 border-t border-[rgba(242,237,230,0.1)] first:border-t-0 first:pt-0">
              <h2 className="font-display font-normal text-[26px] md:text-[32px] leading-[1.1] mb-4">{b.h}</h2>
              <p className="m-0 text-[16px] md:text-[18px] leading-[1.55] text-[#E4DED5]">{b.p.includes("{email}") ? (<>{b.p.split("{email}")[0]}<ProtectedEmail className="underline decoration-[#C9A962] underline-offset-4" />{b.p.split("{email}")[1]}</>) : b.p}</p>
            </section>
          ))}
          <p className="mt-10 text-[14px] leading-[1.5] text-[#9B948B]">{t("privacy.updated")}</p>
        </div>
      </div>
    </main>
  );
}
