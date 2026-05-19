import Link from "next/link";

type Props = {
  title: string;
  paragraphs: string[];
  href: string;
  isLast?: boolean;
};

export function TechEditorialSection({
  title,
  paragraphs,
  href,
  isLast = false,
}: Props) {
  const body = paragraphs.join(" ");

  return (
    <article
      className={
        isLast
          ? ""
          : "border-b border-[color-mix(in_srgb,var(--color-text-muted)_18%,transparent)] pb-14 md:pb-20"
      }
    >
      <h2 className="tech-section-title text-center font-serif font-semibold leading-[1.05] tracking-[0.01em] text-[var(--color-text)]">
        {title}
      </h2>
      <p className="tech-section-body mx-auto mt-8 max-w-[56ch] font-sans text-[15px] font-normal leading-relaxed text-[var(--color-text-muted)]">
        {body}
      </p>
      <div className="mt-10 flex justify-center">
        <Link href={href} className="glass-pill">
          Learn More
        </Link>
      </div>
    </article>
  );
}
