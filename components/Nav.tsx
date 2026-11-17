"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";
import { detectLocale, stripLocale, switchLocale } from "@/lib/paths";

const linkDefs: { href: string; labelKey: string; fallback: string; wide?: boolean }[] = [
  { href: "/art", labelKey: "nav.art", fallback: "Art" },
  { href: "/tech", labelKey: "nav.tech", fallback: "Tech" },
  { href: "/pricing", labelKey: "nav.pricing", fallback: "Pricing" },
  { href: "/rights", labelKey: "nav.rights", fallback: "Rights", wide: true },
  { href: "/contact", labelKey: "nav.contact", fallback: "Contact" },
];

export default function Nav() {
  const rawPath = usePathname();
  const path = stripLocale(rawPath.replace(/\/$/, "") || "/");
  const { locale, t, href } = useI18n();
  const home = ["/", "/gold"].includes(path || "/");
  const overlay = home || path.startsWith("/art") || path.startsWith("/tech");
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!home) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);
  const showLogo = !home || pastHero;
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    setHidden(false);
    const phone = () => window.matchMedia("(pointer: coarse)").matches && Math.min(window.innerWidth, window.innerHeight) < 820;
    const last = new WeakMap<EventTarget, number>();
    const onScroll = (e: Event) => {
      if (!phone()) { setHidden(false); return; }
      const t = e.target;
      const el = t === document || t === window ? document.scrollingElement : (t as HTMLElement);
      if (!el || !(el instanceof HTMLElement)) return;
      if (el.closest("[role=dialog]")) return;
      const y = el.scrollTop; const prev = last.get(el) ?? 0; last.set(el, y);
      if (y < 24) setHidden(false);
      else if (y > prev + 4) setHidden(true);
      else if (y < prev - 4) setHidden(false);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
  }, [rawPath]);

  const current = (detectLocale(rawPath) || locale) as Locale;
  const codes: { id: Locale; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "de", label: "DE" },
    { id: "it", label: "IT" },
  ];

  return (
    <header className={`${home ? "fixed bg-gradient-to-b from-black/45 to-transparent" : overlay ? "fixed hdr-fade" : "sticky hdr-fade"} top-0 inset-x-0 z-50 font-body text-[#F2EDE6] transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="flex items-center justify-between gap-3 px-4 sm:px-8 h-14 sm:h-[72px]">
        <Link href={href("/")} aria-label="Arlix" className={`shrink-0 flex items-center transition-opacity duration-500 ${showLogo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <img src="/arlix-logo-white.png" alt="Arlix" width={1400} height={585} className="h-9 sm:h-[46px] w-auto select-none" draggable={false} />
        </Link>
        <nav className="flex items-center gap-4 max-[419px]:gap-3 sm:gap-8 text-[15px] max-[419px]:text-[14px] sm:text-lg font-normal">
          {linkDefs.map((l) => (
            <Link key={l.href} href={href(l.href)} className={`${l.wide ? "max-sm:hidden " : ""}${path.startsWith(l.href) ? "border-b border-[#C9A962] pb-0.5" : "text-[#F2EDE6]/75 hover:text-[#C9A962]"}`}>
              {locale === "en" ? l.fallback : t(l.labelKey)}
            </Link>
          ))}
          <div className="flex border border-[#4A4540] rounded-full overflow-hidden text-[11px] sm:text-[13px] tracking-[0.08em] shrink-0">
            {codes.map((l) => (
              <Link
                key={l.id}
                href={switchLocale(rawPath, l.id)}
                hrefLang={l.id}
                className={`px-2.5 max-[419px]:px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${current === l.id ? "bg-[#F2EDE6] text-[#0B0B0C]" : "text-[#B5ADA3]"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
