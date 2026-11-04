import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

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
        <footer className="bg-[#0B0B0C] mt-1 md:mt-16 border-t border-[rgba(242,237,230,0.12)] px-6 pt-4 md:pt-10 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-center font-body text-[12px] tracking-[0.24em] uppercase text-[#9B948B]">
          © Arlix 2026
        </footer>
      </body>
    </html>
  );
}
