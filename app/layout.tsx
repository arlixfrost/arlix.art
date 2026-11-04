import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Link from "next/link";

const display = Bodoni_Moda({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const body = Jost({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Arlix",
  description: "Full-cycle AI & hybrid production",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <Nav />
        {children}
        <footer className="bg-[#0B0B0C] mt-16 border-t border-[rgba(242,237,230,0.18)] px-6 sm:px-8 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom))] min-h-[40svh] flex flex-col justify-between gap-12 font-body text-[#F2EDE6]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <Link href="/" className="font-display text-4xl sm:text-5xl tracking-[0.24em]">ARLIX</Link>
            <nav className="flex gap-8 text-[15px] sm:text-lg">
              <Link href="/art" className="hover:text-[#C9A962]">Art</Link>
              <Link href="/tech" className="hover:text-[#C9A962]">Tech</Link>
              <Link href="/contact" className="hover:text-[#C9A962]">Contact</Link>
            </nav>
          </div>
          <div className="gold-rule" />
          <span className="text-[12px] tracking-[0.24em] uppercase text-[#9B948B]">© 2026 Arlix</span>
        </footer>
      </body>
    </html>
  );
}
