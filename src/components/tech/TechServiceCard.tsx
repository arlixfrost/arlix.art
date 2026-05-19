import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function TechServiceCard({ icon: Icon, title, description }: Props) {
  return (
    <article className="tech-card p-5 sm:p-6 md:p-8">
      <div className="tech-card__icon-wrap mb-5 flex h-11 w-11 items-center justify-center">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="font-sans text-[15px] font-medium uppercase tracking-[0.12em] text-[var(--tech-text)]">
        {title}
      </h2>
      <p className="mt-4 font-sans text-[15px] font-normal leading-[1.65] text-[var(--tech-text-muted)]">
        {description}
      </p>
    </article>
  );
}
