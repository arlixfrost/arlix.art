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
  const home = path === "/";
  const overlay = home || path.startsWith("/art") || path.startsWith("/tech");
  return (
    <header className={`${home ? "fixed bg-gradient-to-b from-black/45 to-transparent" : overlay ? "fixed bg-[#121110]/85 backdrop-blur" : "sticky bg-[#121110]/90 backdrop-blur border-b border-white/10"} top-0 inset-x-0 z-50 font-body text-[#F2EDE6]`}>
      <div className="flex items-center justify-between px-8 h-[72px]">
        <Link href="/" className="font-display text-2xl tracking-[0.32em] font-medium">ARLIX</Link>
        <nav className="flex items-center gap-8 text-lg font-normal">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? "border-b border-[#C9A962] pb-0.5" : "text-[#F2EDE6]/75 hover:text-[#C9A962]"}>
              {l.label}
            </Link>
          ))}
          <div className="flex border border-[#4A4540] rounded-full overflow-hidden text-[13px] tracking-[0.08em]" title="Language stub, no translation yet">
            {(["EN", "DE"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-4 py-2 rounded-full ${lang === l ? "bg-[#F2EDE6] text-[#121110]" : "text-[#B5ADA3]"}`}>
                {l}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
