import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Arlix · Wireframe",
  description: "Full-cycle AI & hybrid production",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Nav />
        {children}
        <footer className="border-t border-white/10 px-6 py-8 mt-24 flex flex-wrap justify-between gap-4 label">
          <span>Arlix · [Footer: socials, legal, copyright]</span>
          <span>Wireframe preview, not final design</span>
        </footer>
      </body>
    </html>
  );
}
