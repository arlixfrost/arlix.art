import type { Metadata } from "next";
import PricingCalc from "@/components/pricing/PricingCalc";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMeta(locale as Locale, "/pricing/", "meta.pricingTitle", "meta.pricingDescription");
}

export default function Pricing() {
  return <PricingCalc />;
}
