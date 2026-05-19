import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Art",
};

export default function ArtPage() {
  return (
    <>
      <section className="min-h-dvh px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-content">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            ARLIX · Art
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.4rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[0.01em] text-[var(--color-text)]">
            Visual branding and content production
          </h1>
          <p className="mt-8 max-w-[62ch] font-sans text-[15px] font-normal leading-relaxed text-[var(--color-text-muted)]">
            MVP shell: a full-screen muted showreel, project navigation, and floating
            case cards will replace this placeholder copy.
          </p>
          <ul className="mt-10 max-w-[62ch] space-y-3 font-sans text-[14px] leading-relaxed text-[var(--color-text-muted)]">
            <li>Brand Visual Identity</li>
            <li>Content Production</li>
            <li>AI Visual Production</li>
            <li>Creative Direction</li>
          </ul>
          <p className="mt-10">
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
