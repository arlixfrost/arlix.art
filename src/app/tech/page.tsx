import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Briefcase, Globe, Users } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TechServiceCard } from "@/components/tech/TechServiceCard";

export const metadata: Metadata = {
  title: "Tech",
};

const services = [
  {
    icon: Bot,
    title: "AI Agents & Custom Assistants",
    description:
      "I build custom AI agents and assistants around how you actually work. Automated workflows, smart business tools, personal assistants that fit your life. Nothing generic, nothing off the shelf.",
  },
  {
    icon: Globe,
    title: "Website Creation",
    description:
      "Modern, well-designed websites for businesses that want to look credible and professional online. Clean, fast, built to impress.",
  },
  {
    icon: Briefcase,
    title: "Resume & LinkedIn",
    description:
      "Your experience is real. The problem is the algorithm never sees it. I rewrite and restructure your resume so it passes AI screening and reaches a human, not a rejection folder.",
  },
  {
    icon: Users,
    title: "AI Onboarding",
    description:
      "You've built a career. You know your field. But the tools are changing faster than anyone expected. I work with you 1:1, practical sessions designed for people with no time to waste. We learn and apply only what you actually need, built into your daily routine. No theory, no fluff.",
  },
] as const;

export default function TechPage() {
  return (
    <>
      <section className="min-h-dvh px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-content">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            ARLIX · Tech
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.4rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[0.01em] text-[var(--color-text)]">
            Practical AI, built for you
          </h1>
          <p className="mt-8 max-w-[62ch] font-sans text-[15px] font-normal leading-relaxed text-[var(--color-text-muted)]">
            Tailored AI for individuals and businesses with real goals. Built around your
            needs, handled individually.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
            {services.map((service) => (
              <TechServiceCard key={service.title} {...service} />
            ))}
          </div>

          <div className="mt-14 border-t border-[color-mix(in_srgb,var(--color-text-muted)_22%,transparent)] pt-10 md:mt-16 md:pt-12">
            <a
              href="mailto:hello@arlix.art?subject=ARLIX%20Tech%20-%20Contact"
              className="glass-pill"
            >
              Contact
            </a>
          </div>

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
