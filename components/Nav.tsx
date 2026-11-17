"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

// Data-driven language list: add { id: "ru", label: "RU" } here (and in lib/i18n.ts) for later languages.
const LANGS: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "de", label: "DE" },
  { id: "it", label: "IT" },
];

function LangSwitch({ rawPath, current }: { rawPath: string; current: Locale }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const label = LANGS.find((l) => l.id === current)?.label ?? "EN";

  useEffect(() => { setOpen(false); }, [rawPath]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const focusItem = (index: number) => {
    const items = root.current?.querySelectorAll<HTMLElement>("[role=menuitem]");
    items?.[(index + (items.length || 1)) % items.length]?.focus();
  };

  return (
    <div ref={root} className="relative shrink-0">
      {/* Invisible sizer: same box as the live EN/DE pill at every breakpoint, so nav items do not move. */}
      <div className="flex border border-[#4A4540] rounded-full overflow-hidden text-[11px] sm:text-[13px] tracking-[0.08em] invisible pointer-events-none" aria-hidden="true">
        <span className="px-2.5 max-[419px]:px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">EN</span>
        <span className="px-2.5 max-[419px]:px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">DE</span>
      </div>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusItem(0));
          }
        }}
        className="absolute inset-0 flex items-center justify-center gap-1 border border-[#4A4540] rounded-full text-[11px] sm:text-[13px] tracking-[0.08em] bg-[#F2EDE6] text-[#0B0B0C]"
      >
        {label}
        <svg aria-hidden="true" width="8" height="8" viewBox="0 0 8 8" className="shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1.5 2.75 4 5.25 6.5 2.75" />
        </svg>
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute top-full right-0 z-[60] mt-1 min-w-full border border-[#4A4540] bg-[#0B0B0C] text-[11px] sm:text-[13px] tracking-[0.08em]"
          onKeyDown={(e) => {
            const items = Array.from(root.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
            const i = items.indexOf(document.activeElement as HTMLElement);
            if (e.key === "ArrowDown") { e.preventDefault(); focusItem(i + 1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); focusItem(i <= 0 ? items.length - 1 : i - 1); }
            else if (e.key === "Home") { e.preventDefault(); focusItem(0); }
            else if (e.key === "End") { e.preventDefault(); focusItem(items.length - 1); }
            else if (e.key === "Tab") { setOpen(false); }
          }}
        >
          {LANGS.map((l) => (
            <li key={l.id} role="none">
              <Link
                role="menuitem"
                href={switchLocale(rawPath, l.id)}
                hrefLang={l.id}
                aria-current={l.id === current ? "true" : undefined}
                className={`block px-2.5 max-[419px]:px-2 sm:px-4 py-1.5 sm:py-2 ${l.id === current ? "bg-[#F2EDE6] text-[#0B0B0C]" : "text-[#B5ADA3]"}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

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
          <LangSwitch rawPath={rawPath} current={current} />
        </nav>
      </div>
    </header>
  );
}
