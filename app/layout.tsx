import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Nav from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";

// Fonts are stored in the site (public/fonts, app/fonts.css): the build never downloads them from Google.

export const metadata: Metadata = {
  title: "Arlix",
  description: "Full-cycle AI & hybrid production",
};

// GitHub Pages lets a browser keep a page for up to 10 minutes. This check asks the server which version is live
// (version.txt is never cached) and, if the browser holds an older one, loads the fresh page once.
const fresh = `(function(){try{var b=${JSON.stringify(process.env.NEXT_PUBLIC_BUILD || "dev")};var u=new URL(location.href);if(u.searchParams.has("v")){u.searchParams.delete("v");history.replaceState(history.state,"",u.pathname+u.search+u.hash);}fetch("/version.txt?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.text():null}).then(function(v){v=v&&v.trim();if(!v||v===b||v.length>64)return;var k="arlix-v";if(sessionStorage.getItem(k)===v)return;sessionStorage.setItem(k,v);location.replace(location.pathname+"?v="+v.slice(0,8)+location.hash);}).catch(function(){});}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/bodoni-moda-8.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/jost-3.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: fresh }} />
      </head>
      <body className="min-h-screen">
        <Nav />
        {children}
        <SiteFooter className="layout-footer mt-1 md:mt-16 pt-4 md:pt-10 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-[calc(2.5rem+env(safe-area-inset-bottom))]" />
      </body>
    </html>
  );
}
