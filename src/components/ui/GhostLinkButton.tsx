import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function GhostLinkButton({ href, children, className = "" }: Props) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center",
        "border border-[color-mix(in_srgb,var(--color-text-muted)_40%,transparent)]",
        "px-9 py-3 font-sans text-[13px] font-medium uppercase tracking-[0.28em]",
        "text-[var(--color-text)] opacity-90",
        "transition-[opacity,transform,letter-spacing,border-color,color] duration-300 ease-out",
        "hover:scale-[1.03] hover:tracking-[0.34em] hover:opacity-100",
        "hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
