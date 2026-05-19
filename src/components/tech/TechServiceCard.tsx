import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function TechServiceCard({ icon: Icon, title, description }: Props) {
  return (
    <article className="w-full min-w-0 rounded-2xl border border-[color-mix(in_srgb,var(--color-text-muted)_28%,transparent)] bg-[var(--color-bg-elevated)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6 md:p-8">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)] text-[var(--color-accent)]">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="font-sans text-[15px] font-medium uppercase tracking-[0.12em] text-[var(--color-text)]">
        {title}
      </h2>
      <p className="mt-4 font-sans text-[15px] font-normal leading-[1.65] text-[var(--color-text-muted)]">
        {description}
      </p>
    </article>
  );
}
