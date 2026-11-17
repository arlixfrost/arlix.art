import type { Metadata } from "next";
import { t, type Locale } from "./i18n";

const BASE = "https://www.arlix.art";

function abs(locale: Locale, path: string): string {
  let p = path.startsWith("/") ? path : "/" + path;
  if (p !== "/" && !p.endsWith("/")) p += "/";
  if (locale === "en") return BASE + p;
  return BASE + (p === "/" ? `/${locale}/` : `/${locale}${p}`);
}

export function localeMeta(locale: Locale, path: string, titleKey: string, descKey: string): Metadata {
  const title = t(locale, titleKey);
  const description = t(locale, descKey);
  return {
    title,
    description,
    alternates: {
      canonical: abs(locale, path),
      languages: {
        en: abs("en", path),
        de: abs("de", path),
        it: abs("it", path),
        "x-default": abs("en", path),
      },
    },
  };
}
