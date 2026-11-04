import Link from "next/link";
import Showreel from "@/components/Showreel";
import SnakeCarousel from "@/components/SnakeCarousel";
import FoxLogo from "@/components/FoxLogo";

// Phone: the horizontal showreel is a full-width 16:9 strip under the header, and the logo,
// tagline and buttons sit right under it, so the whole page fits about one iPhone screen.
// Desktop: full-screen showreel with the logo, tagline and buttons over it.
export default function Home() {
  return (
    <main>
      <h1 className="sr-only">Arlix</h1>
      <Showreel className="mt-14 aspect-video w-full md:mt-0 md:aspect-auto md:h-[100svh]">
        <div className="hidden md:flex h-full flex-col items-center justify-center text-center px-6">
          {/* Fox logo: the fox replaces the letter L, cut from the original; the tail sways. */}
          <FoxLogo src="/arlix-logo-white.png" className="w-[min(56vw,470px)] h-auto" />
          <p className="mt-6 font-display italic text-2xl text-[#F2EDE6]">Full-cycle AI &amp; hybrid production</p>
          <div className="mt-12 flex gap-5 font-body">
            <Link href="/art" className="frame-btn">Art</Link>
            <Link href="/tech" className="frame-btn">Tech</Link>
          </div>
        </div>
      </Showreel>
      <div className="md:hidden flex flex-col items-center text-center px-6 pt-[18px]">
        <FoxLogo src="/arlix-logo-white.png" className="w-[200px] h-auto" />
        <p className="mt-2 font-display italic text-[17px] text-[#F2EDE6]">Full-cycle AI &amp; hybrid production</p>
        <div className="mt-4 flex gap-3 font-body">
          <Link href="/art" className="frame-btn !min-w-0 !w-[132px] !h-11 !text-[11px]">Art</Link>
          <Link href="/tech" className="frame-btn !min-w-0 !w-[132px] !h-11 !text-[11px]">Tech</Link>
        </div>
      </div>
      <SnakeCarousel />
    </main>
  );
}
