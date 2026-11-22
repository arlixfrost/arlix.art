import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../fonts.css";
import "../../globals.css";
import { AppShell } from "@/components/AppShell";
import { isLocale, type Locale } from "@/lib/i18n";
import { localeMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "it" }, { locale: "fr" }, { locale: "pl" }];
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  return localeMeta(locale as Locale, "/", "meta.title", "meta.description");
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <AppShell locale={locale}>{children}</AppShell>;
}
