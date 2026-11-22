import en from "@/messages/en.json";
import de from "@/messages/de.json";
import it from "@/messages/it.json";
import fr from "@/messages/fr.json";
import pl from "@/messages/pl.json";

export const locales = ["en", "de", "it", "fr", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  de: de as Record<string, unknown>,
  it: it as Record<string, unknown>,
  fr: fr as Record<string, unknown>,
  pl: pl as Record<string, unknown>,
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

function lookup(dict: Record<string, unknown>, key: string): unknown {
  let cur: unknown = dict;
  for (const part of key.split(".")) {
    if (cur === null || typeof cur !== "object" || !(part in (cur as object))) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

export function getMessages(locale: Locale): Record<string, unknown> {
  return dictionaries[locale] ?? dictionaries.en;
}

/** Only replaces {name} tokens that are present in vars, so {Le Plongeoir|url} stays intact. */
export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const found = lookup(getMessages(locale), key);
  const enFound = lookup(dictionaries.en, key);
  let s = typeof found === "string" ? found : typeof enFound === "string" ? enFound : key;
  if (vars) {
    s = s.replace(/\{(\w+)\}/g, (match, name: string) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
    );
  }
  return s;
}

export type TFn = (key: string, vars?: Record<string, string | number>) => string;
