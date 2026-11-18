import type { Metadata } from "next";
import PrivacyPage from "@/components/PrivacyPage";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMeta(locale as Locale, "/privacy/", "meta.privacyTitle", "meta.privacyDescription");
}

export default function Privacy() {
  return <PrivacyPage />;
}
