import type { Metadata } from "next";
import RightsPage from "@/components/RightsPage";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMeta(locale as Locale, "/rights/", "meta.rightsTitle", "meta.rightsDescription");
}

export default function Rights() {
  return <RightsPage />;
}
