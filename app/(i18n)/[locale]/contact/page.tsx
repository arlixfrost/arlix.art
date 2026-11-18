import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactDirect from "@/components/ContactDirect";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMeta(locale as Locale, "/contact/", "meta.contactTitle", "meta.contactDescription");
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (isLocale(locale) ? locale : "en") as Locale;
  return (
    <main className="art-theme min-h-screen">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 pt-12 md:pt-20 pb-20 md:pb-24">
        <h1 className="font-display font-normal text-[40px] md:text-[56px] leading-[1.05]">{t(loc, "contact.h1")}</h1>
        <div className="gold-rule mt-5 mb-10 md:mb-14" />
        <ContactForm />
        <ContactDirect />
      </div>
    </main>
  );
}
