export type TechSection = {
  slug: string;
  title: string;
  paragraphs: string[];
  detailTitle: string;
  detailIntro: string;
  detailBlocks: { heading: string; body: string }[];
};

export const techSections: TechSection[] = [
  {
    slug: "cv-linkedin",
    title: "CV & LinkedIn AI Optimization",
    paragraphs: [
      "Your CV may be filtered by AI long before a human recruiter sees it. I work with you to adapt your CV and LinkedIn for how hiring systems and recruiters actually read profiles today. Your voice stays intact.",
    ],
    detailTitle: "CV & LinkedIn AI Optimization",
    detailIntro:
      "A structured process to align your professional story with how hiring systems and recruiters actually read profiles today.",
    detailBlocks: [
      {
        heading: "The problem",
        body: "Most applications never reach a person. ATS and AI screening filter on structure, keywords, and signal clarity long before your experience is considered.",
      },
      {
        heading: "How I work with you",
        body: "I rebuild your CV and LinkedIn for clarity, hierarchy, and relevance. You stay in the loop at every step. Every edit serves readability for both machines and humans, while keeping your voice intact.",
      },
      {
        heading: "Deliverables",
        body: "Restructured CV, LinkedIn narrative alignment, keyword strategy where appropriate, and a concise guide for future updates you can maintain yourself.",
      },
      {
        heading: "Visual cases",
        body: "Before-and-after structure studies and profile direction samples will be presented here as the case archive grows.",
      },
    ],
  },
  {
    slug: "career-adaptation",
    title: "Private Career AI Adaptation",
    paragraphs: [
      "You built a career. You know your field. But the tools are changing faster than most people expected. I work with you one-to-one in private practical sessions. No theory, no wasted time. Together we take only what you need and integrate it into your real daily routine.",
    ],
    detailTitle: "Private Career AI Adaptation",
    detailIntro:
      "One-to-one sessions for professionals who need practical integration. Not theory, not generic courses.",
    detailBlocks: [
      {
        heading: "Who this is for",
        body: "Established professionals navigating a shift in how work is done (executives, founders, specialists, and creatives who need tools that respect their time).",
      },
      {
        heading: "How I work with you",
        body: "Short private sessions focused on one workflow at a time. Together we implement, test, and refine inside your real tools until the habit holds.",
      },
      {
        heading: "Workflow",
        body: "Assessment. Priority mapping. Guided implementation. Follow-up. No slides. No fluff. Only what changes your week.",
      },
      {
        heading: "Examples",
        body: "Session notes, workflow maps, and anonymized case outlines will be added here as reference material.",
      },
    ],
  },
  {
    slug: "assistants",
    title: "AI Assistants & Agents",
    paragraphs: [
      "Custom AI assistants and agents built around your real workflows, repetitive tasks and private automation.",
    ],
    detailTitle: "AI Assistants & Agents",
    detailIntro:
      "Bespoke assistants shaped around how you work. Not templates from a product catalog.",
    detailBlocks: [
      {
        heading: "Scope",
        body: "Personal productivity, research pipelines, client communication drafts, internal ops, and quiet automation that removes friction without adding noise.",
      },
      {
        heading: "Approach",
        body: "I define boundaries, tone, and triggers with you first. Then I build small, reliable systems you can trust. Reviewed and adjusted together as we go.",
      },
      {
        heading: "Workflow examples",
        body: "Morning briefings, document prep, meeting follow-ups, inbox triage patterns, and task-specific agents for recurring professional work.",
      },
      {
        heading: "Automation cases",
        body: "Case studies and workflow diagrams will be published here as projects complete.",
      },
    ],
  },
  {
    slug: "web-design",
    title: "Modern Web Design",
    paragraphs: [
      "Modern websites for businesses, freelancers and professionals who want a clear, serious and visually strong online presence.",
    ],
    detailTitle: "Modern Web Design",
    detailIntro:
      "Editorial, restrained web presence for brands and individuals who care how they are perceived online.",
    detailBlocks: [
      {
        heading: "Direction",
        body: "Typography-led layouts, calm motion, and intentional pacing. The site should feel considered. Not assembled from a template.",
      },
      {
        heading: "Structure",
        body: "Clear information hierarchy, fast performance, and mobile-first clarity without sacrificing desktop presence.",
      },
      {
        heading: "Visual language",
        body: "Warm or cool palettes chosen to match the brand. Photography, type, and spacing do the work. Not decorative UI noise.",
      },
      {
        heading: "Portfolio presentation",
        body: "Selected site directions and structural references will appear here as the portfolio expands.",
      },
    ],
  },
];

export function getTechSection(slug: string): TechSection | undefined {
  return techSections.find((s) => s.slug === slug);
}
