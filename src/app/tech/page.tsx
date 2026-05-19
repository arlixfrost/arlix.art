import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TechEditorialSection } from "@/components/tech/TechEditorialSection";
import { techSections } from "@/lib/tech-sections";

export const metadata: Metadata = {
  title: "Tech",
};

export default function TechPage() {
  return (
    <>
      <section className="min-h-dvh px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-content">
          <p className="text-center font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            ARLIX · Tech
          </p>
          <div className="mt-14 space-y-14 md:mt-20 md:space-y-20">
            {techSections.map((section, index) => (
              <TechEditorialSection
                key={section.slug}
                title={section.title}
                paragraphs={section.paragraphs}
                href={`/tech/${section.slug}`}
                isLast={index === techSections.length - 1}
              />
            ))}
          </div>

          <div className="mt-20 flex justify-center md:mt-32">
            <a
              href="mailto:hello@arlix.art?subject=ARLIX%20Tech%20-%20Contact"
              className="glass-pill"
            >
              Contact
            </a>
          </div>
          <p className="mt-10 text-center">
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
