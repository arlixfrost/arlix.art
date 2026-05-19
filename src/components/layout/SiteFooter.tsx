import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--color-text-muted)_22%,transparent)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-6 py-6 text-[11px] text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between">
        <p className="font-sans uppercase tracking-[0.16em]">© {new Date().getFullYear()} ARLIX</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-sans uppercase tracking-[0.16em]">
          <Link className="hover:text-[var(--color-accent)]" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-[var(--color-accent)]" href="/terms">
            Terms
          </Link>
          <a className="hover:text-[var(--color-accent)]" href="mailto:hello@arlix.art">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
