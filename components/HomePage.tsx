import Link from "next/link";
import Showreel from "@/components/Showreel";
import SnakeCarousel from "@/components/SnakeCarousel";
import FoxLogo from "@/components/FoxLogo";

// Home page. Desktop is the same in every variant. On phones:
// - "now":  showreel strip, then logo, tagline, buttons (what is live now)
// - "soft": showreel strip with soft top and bottom edges, logo overlaps its lower edge
// - "top":  logo and tagline above the showreel, buttons under it
type Variant = "now" | "soft" | "top";

const btn = "frame-btn !min-w-0 !w-[104px] !h-9 !text-[10px]";
const btnNow = "frame-btn !min-w-0 !w-[132px] !h-11 !text-[11px]";

export default function HomePage({ variant = "now" }: { variant?: Variant }) {
  const small = variant !== "now";
  const logo = <FoxLogo src="/arlix-logo-white.png" className={small ? "w-[150px] h-auto" : "w-[200px] h-auto"} />;
  const tagline = <p className={`font-display italic text-[#F2EDE6] ${small ? "text-[15px]" : "text-[17px]"}`}>Full-cycle AI &amp; hybrid production</p>;
  const buttons = (
    <div className={`flex font-body ${small ? "gap-2.5" : "gap-3"}`}>
      <Link href="/art" className={small ? btn : btnNow}>Art</Link>
      <Link href="/tech" className={small ? btn : btnNow}>Tech</Link>
    </div>
  );
  return (
    <main className={small ? "flex flex-col min-h-[calc(100svh-58px)] md:block md:min-h-0" : undefined}>
      <h1 className="sr-only">Arlix</h1>
      {variant === "top" && (
        <div className="md:hidden flex flex-col items-center text-center px-6 pt-[66px] gap-2">
          {logo}
          {tagline}
        </div>
      )}
      <Showreel className={`${variant === "top" ? "mt-3.5" : "mt-14"} aspect-video w-full md:mt-0 md:aspect-auto md:h-[100svh]`}>
        {variant === "soft" && (
          <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_bottom,#0B0B0C_0%,rgba(11,11,12,0)_22%,rgba(11,11,12,0)_55%,#0B0B0C_100%)]" />
        )}
        <div className="hidden md:flex h-full flex-col items-center justify-center text-center px-6">
          <FoxLogo src="/arlix-logo-white.png" className="w-[min(56vw,470px)] h-auto" />
          <p className="mt-6 font-display italic text-2xl text-[#F2EDE6]">Full-cycle AI &amp; hybrid production</p>
          <div className="mt-12 flex gap-5 font-body">
            <Link href="/art" className="frame-btn">Art</Link>
            <Link href="/tech" className="frame-btn">Tech</Link>
          </div>
        </div>
      </Showreel>
      {small && <div className="flex-[0.6] md:hidden" />}
      {variant === "top" ? (
        <div className="md:hidden flex justify-center pt-3.5">{buttons}</div>
      ) : (
        <div className={`md:hidden relative z-10 flex flex-col items-center text-center px-6 ${variant === "soft" ? "pt-1" : "pt-[18px]"}`}>
          {logo}
          <div className="mt-2">{tagline}</div>
          <div className={small ? "mt-3.5" : "mt-4"}>{buttons}</div>
        </div>
      )}
      {small && <div className="flex-1 md:hidden" />}
      <SnakeCarousel />
      {small && <div className="flex-[0.6] md:hidden" />}
    </main>
  );
}
