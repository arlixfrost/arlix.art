import type { Metadata } from "next";
import ArtSlides from "@/components/ArtSlides";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMeta(locale as Locale, "/art/", "meta.artTitle", "meta.artDescription");
}

export default function Art() {
  return <ArtSlides />;
}
