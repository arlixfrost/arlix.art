"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/art", label: "Art" },
  { href: "/tech", label: "Tech" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const path = usePathname();
  const [lang, setLang] = useState<"EN" | "DE">("EN");
  const overlay = path === "/" || path.startsWith("/art");
  return (
    <header className={`${overlay ? "fixed glass-bar" : "sticky bg-[#0b0b0c]/90 backdrop-blur border-b border-white/10"} top-0 inset-x-0 z-50`}>
      <div className="flex items-center justify-between px-6 h-14">
        <Link href="/" className="font-semibold tracking-[0.3em] text-sm">ARLIX</Link>
        <nav className="flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? "text-white underline underline-offset-4" : "text-white/70 hover:text-white"}>
              {l.label}
            </Link>
          ))}
          <div className="flex border border-white/25 rounded-full overflow-hidden text-[11px]" title="Language stub, no translation yet">
            {(["EN", "DE"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 ${lang === l ? "bg-white text-black" : "text-white/70"}`}>
                {l}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
