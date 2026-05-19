import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <>
      <section className="min-h-dvh px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-content">
          <h1 className="font-serif text-[clamp(2rem,3.5vw,2.75rem)] font-semibold text-[var(--color-text)]">
            Terms
          </h1>
          <p className="mt-6 max-w-[70ch] font-sans text-[14px] leading-relaxed text-[var(--color-text-muted)]">
            Placeholder terms page. Replace with final legal copy before launch.
          </p>
          <p className="mt-8">
            <Link
              href="/"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
            >
              ← Entry
            </Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
