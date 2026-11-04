import Link from "next/link";
import Showreel from "@/components/Showreel";

export default function Home() {
  return (
    <main>
      <Showreel className="h-[100svh] w-full">
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="font-display font-medium text-7xl md:text-9xl tracking-[0.08em] pl-[0.08em] leading-none">ARLIX</h1>
          <div className="gold-rule mt-8" />
          <p className="mt-6 font-display italic text-xl md:text-2xl text-[#F2EDE6]">Full-cycle AI &amp; hybrid production</p>
          <div className="mt-12 flex gap-5 font-body">
            <Link href="/art" className="frame-btn">Art</Link>
            <Link href="/tech" className="frame-btn">Tech</Link>
          </div>
        </div>
      </Showreel>
    </main>
  );
}
