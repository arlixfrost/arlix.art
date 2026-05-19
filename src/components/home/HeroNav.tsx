import { GlassNavLink } from "@/components/ui/GlassNavLink";

type Props = {
  className?: string;
};

export function HeroNav({ className = "" }: Props) {
  return (
    <nav
      className={`flex justify-center px-6 pb-10 md:px-10 md:pb-14 ${className}`}
      aria-label="Primary"
    >
      <div className="hero-nav-pair">
        <GlassNavLink href="/art">ART</GlassNavLink>
        <span className="hero-nav-pair__divider" aria-hidden />
        <GlassNavLink href="/tech">TECH</GlassNavLink>
      </div>
    </nav>
  );
}
