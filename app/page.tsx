import Link from "next/link";
import Showreel from "@/components/Showreel";
import SnakeCarousel from "@/components/SnakeCarousel";

export default function Home() {
  return (
    <main>
      <Showreel className="h-[100svh] w-full">
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="sr-only">Arlix</h1>
          {/* Fox logo: the fox replaces the letter L. Transparent PNG, cut from the original. */}
          <img src="/arlix-logo.png" alt="Arlix" width={1400} height={585} className="w-[min(86vw,720px)] h-auto select-none" draggable={false} />
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
