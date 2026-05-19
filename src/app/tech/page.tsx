import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Briefcase, Globe, Users } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TechServiceCard } from "@/components/tech/TechServiceCard";
import "./tech.css";

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
    <div className="tech-page min-h-dvh">
      <section className="px-5 py-12 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto w-full min-w-0 max-w-content">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tech-text-muted)]">
            ARLIX · Tech
          </p>

          <div className="tech-page__scroll-head mt-6">
            <h1 className="tech-page__headline font-serif text-[clamp(1.75rem,3.8vw,3.25rem)] font-semibold leading-none text-[var(--tech-text)]">
              Practical AI, built for you
            </h1>
          </div>

          <div className="tech-page__scroll-head mt-6">
            <p className="tech-page__subline">
              Tailored AI for individuals and businesses with real goals. Built around your
              needs, handled individually.
            </p>
          </div>

          <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 md:gap-6">
            {services.map((service) => (
              <TechServiceCard key={service.title} {...service} />
            ))}
          </div>

          <div className="mt-14 border-t border-[var(--tech-border)] pt-10 sm:mt-16 sm:pt-12">
            <a
              href="mailto:hello@arlix.art?subject=ARLIX%20Tech%20-%20Contact"
              className="tech-contact-btn"
            >
              Contact
            </a>
          </div>

          <p className="mt-10 sm:mt-12">
            <Link
              href="/"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tech-accent)] transition-colors hover:text-[var(--tech-accent-hover)]"
            >
              ← Entry
            </Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
