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
        <footer className="border-t border-white/10 px-6 py-8 mt-24 flex flex-wrap justify-between gap-4 label">
          <span>© 2026 Arlix</span>
        </footer>
      </body>
    </html>
  );
}
