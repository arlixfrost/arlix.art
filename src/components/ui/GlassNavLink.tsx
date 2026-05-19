import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function GlassNavLink({ href, children, className = "" }: Props) {
  return (
    <Link href={href} className={`glass-pill ${className}`}>
      {children}
    </Link>
  );
}
