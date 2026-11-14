import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Nav from "@/components/Nav";

// Fonts are stored in the site (public/fonts, app/fonts.css): the build never downloads them from Google.

export const metadata: Metadata = {
  title: "Arlix",
  description: "Full-cycle AI & hybrid production",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/bodoni-moda-8.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/jost-3.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
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
