import Link from "next/link";
import Showreel from "@/components/Showreel";
import SnakeCarousel from "@/components/SnakeCarousel";
import FoxLogo from "@/components/FoxLogo";

export default function Home() {
  return (
    <main>
      <Showreel className="h-[100svh] w-full">
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="sr-only">Arlix</h1>
          {/* Fox logo: the fox replaces the letter L, cut from the original; the tail sways. */}
          <FoxLogo src="/arlix-logo-white.png" className="w-[min(56vw,470px)] h-auto" />
          <p className="mt-6 font-display italic text-xl md:text-2xl text-[#F2EDE6]">Full-cycle AI &amp; hybrid production</p>
          <div className="mt-12 flex gap-5 font-body">
            <Link href="/art" className="frame-btn">Art</Link>
            <Link href="/tech" className="frame-btn">Tech</Link>
          </div>
        </div>
      </Showreel>
      <SnakeCarousel />
    </main>
  );
}
