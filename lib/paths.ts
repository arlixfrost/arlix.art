import { defaultLocale, type Locale } from "./i18n";

/** Pathname without a locale prefix, hash preserved. */
export function stripLocale(pathname: string): string {
  const i = pathname.indexOf("#");
  const hash = i >= 0 ? pathname.slice(i) : "";
  const path = i >= 0 ? pathname.slice(0, i) : pathname;
  const stripped = path.replace(/^\/(de|it)(?=\/|$)/, "") || "/";
  return stripped + hash;
}

export function detectLocale(pathname: string): Locale {
  const path = pathname.split("#")[0];
  const m = path.match(/^\/(de|it)(?=\/|$)/);
  return (m?.[1] as Locale) || defaultLocale;
}

/** Prefix an unprefixed path for a locale. Keeps hashes. English stays at the root. */
export function localizePath(locale: Locale, path: string): string {
  const i = path.indexOf("#");
  const hash = i >= 0 ? path.slice(i) : "";
  let p = stripLocale(i >= 0 ? path.slice(0, i) : path);
  if (!p.startsWith("/")) p = "/" + p;
  if (locale === defaultLocale) return p + hash;
  if (p === "/") return `/${locale}/` + hash;
  return `/${locale}${p}` + hash;
}

export function switchLocale(pathname: string, next: Locale): string {
  return localizePath(next, stripLocale(pathname));
}
