import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { TechSection } from "@/lib/tech-sections";

type Props = {
  section: TechSection;
};

export function TechDetailLayout({ section }: Props) {
  return (
    <>
      <section className="min-h-dvh px-6 py-14 md:px-10 md:py-20">
        <article className="mx-auto max-w-content">
          <p className="text-center font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            <Link
              href="/tech"
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              ARLIX · Tech
            </Link>
          </p>

          <h1 className="tech-section-title mt-6 text-center font-serif font-semibold leading-[1.05] tracking-[0.01em] text-[var(--color-text)]">
            {section.detailTitle}
          </h1>

          <p className="tech-section-body mx-auto mt-8 max-w-[56ch] font-sans text-[15px] font-normal leading-relaxed text-[var(--color-text-muted)]">
            {section.detailIntro}
          </p>

          <div className="tech-section-body mx-auto mt-10 max-w-[56ch] space-y-8">
            {section.detailBlocks.map((block) => (
              <div key={block.heading}>
                <h2 className="font-sans text-[14px] font-medium leading-relaxed text-[var(--color-text)]">
                  {block.heading}
                </h2>
                <p className="mt-2 font-sans text-[14px] leading-relaxed text-[var(--color-text-muted)]">
                  {block.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-6">
            <a
              href="mailto:hello@arlix.art?subject=ARLIX%20Tech%20-%20Contact"
              className="glass-pill"
            >
              Contact
            </a>
            <Link
              href="/tech"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
            >
              ← All services
            </Link>
          </div>
        </article>
      </section>
      <SiteFooter />
    </>
  );
}
