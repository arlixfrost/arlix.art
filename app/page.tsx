import Link from "next/link";
import Showreel from "@/components/Showreel";

export default function Home() {
  return (
    <main>
      <Showreel className="h-[100svh] w-full">
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="text-6xl md:text-8xl font-semibold tracking-[0.25em] pl-[0.25em]">ARLIX</h1>
          <p className="mt-4 text-sm md:text-base text-white/80 tracking-wide">Full-cycle AI &amp; hybrid production</p>
          <div className="mt-10 flex gap-4">
            <Link href="/art" className="glass-pill">Art</Link>
            <Link href="/tech" className="glass-pill">Tech</Link>
          </div>
        </div>
      </Showreel>
    </main>
  );
}
