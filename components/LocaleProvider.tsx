"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { defaultLocale, t as translate, type Locale, type TFn } from "@/lib/i18n";
import { localizePath } from "@/lib/paths";

type Ctx = {
  locale: Locale;
  t: TFn;
  href: (path: string) => string;
};

const LocaleContext = createContext<Ctx>({
  locale: defaultLocale,
  t: (key, vars) => translate(defaultLocale, key, vars),
  href: (path) => path,
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      locale,
      t: (key, vars) => translate(locale, key, vars),
      href: (path) => localizePath(locale, path),
    }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): Ctx {
  return useContext(LocaleContext);
}
