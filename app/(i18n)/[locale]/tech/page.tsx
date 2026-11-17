import type { Metadata } from "next";
import TechSlides from "@/components/TechSlides";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMeta(locale as Locale, "/tech/", "meta.title", "meta.description");
}

export default function Tech() {
  return <TechSlides />;
}
