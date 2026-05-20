export type TechSection = {
  slug: string;
  title: string;
  paragraphs: string[];
  detailTitle: string;
  detailIntro: string;
  detailBlocks: { heading?: string; body: string }[];
  bookCallSubject?: string;
};

export const techSections: TechSection[] = [
  {
    slug: "cv-linkedin",
    title: "CV & LinkedIn AI Optimization",
    paragraphs: [
      "Right now, everyone is optimizing everything. Recruiters too. If your CV does not pass AI and ATS filters, it will not reach a live recruiter. I optimize CV and LinkedIn for how hiring works today.",
    ],
    detailTitle: "CV & LinkedIn AI Optimization",
    detailIntro:
      "Right now, everyone is optimizing everything. Recruiters too.",
    detailBlocks: [
      {
        body: "Recruiters hand to AI the work they do not like doing themselves. Filtering out candidates who are not a fit. The first pass often runs through AI and ATS. If your CV does not pass that filter, it will not reach a live recruiter.",
      },
      {
        heading: "On the call",
        body: "On the call, we go through your position and your field. I optimize your CV and LinkedIn for current requirements and ATS filters. Then we look at which AI skills recruiters in your field most often search for, for your position and your field. We make your CV as attractive and appealing as possible for them. You may already use some AI tools, but not know how to name them correctly on your CV. I explain that. I tell you how long it will take you to learn these skills and bring them into your daily work.",
      },
      {
        heading: "Option 1",
        body: "CV and LinkedIn optimization only, built around the skills you already have.",
      },
      {
        heading: "Option 2",
        body: "A short training plan on AI tools, individual to you, to use them in today's work and in daily life.",
      },
    ],
    bookCallSubject: "ARLIX - CV & LinkedIn - Book a Call",
  },
  {
    slug: "career-adaptation",
    title: "Private Career AI Adaptation",
    paragraphs: [
      "You built a career. You know your field. But the tools are changing faster than most people expected. I work with you one-to-one in private practical sessions. No theory, no wasted time. Together we take only what you need and integrate it into your real daily routine.",
    ],
    detailTitle: "Private Career AI Adaptation",
    detailIntro:
      "I'm a millennial myself, and I clearly remember when the internet first appeared.",
    detailBlocks: [
      {
        body: "I remember the phone line, the crackling modem sounds, and how suspicious people were of all of it. Back then, the internet felt like something for geeks, hackers and outsiders.",
      },
      {
        body: "And then it completely changed our lives.",
      },
      {
        body: "People started building businesses online, meeting online, working remotely and maintaining friendships across countries through digital systems.",
      },
      {
        body: "I spent many years working in hotel & real estate projects, and I remember how everything depended on personal connections, expos, flights and face to face meetings. We literally flew across the world and pushed through jungles just to inspect a property and negotiate with developers. And long ago, most of that stopped being necessary because huge parts of those processes moved online.",
      },
      {
        body: "Right now we are standing at the exact same point with AI. This is even bigger than the invention of electricity. So hiding by candlelight is no longer an option…",
      },
      {
        body: "Just two years ago, most people thought AI was just another toy people would play with and forget about. Now it's obvious that AI has become part of everyday work, hiring systems, business operations and daily routines. And the longer someone postpones learning these tools, the harder they become to understand.",
      },
      {
        body: "I completely understand the fear, resistance and frustration because I went through it myself. But at some point, I stopped looking at AI as a threat and started seeing it as a way to delegate the kind of work I never enjoyed doing in the first place. Routine. Repetitive processes. Organizational chaos. Endless operational clutter.",
      },
      {
        body: "AI gives me control over my time, workflows, daily routines and, of course, privacy. Honestly, I'm far less concerned about some distant server overseas than about an overly talkative secretary who knows all my business. Many systems can also be configured locally, without anything leaving your own computer or laptop.",
      },
      {
        body: "I'm also strongly against endless group courses, public Zoom calls and huge amounts of unnecessary information. These groups usually gather completely different kinds of people together. From Gen Z TikTok creators to seventy year old housewives trying to write a book with ChatGPT.",
      },
      {
        body: "And when you already have your own life, work, family and constant communication around you, the last thing you need is yet another noisy online community and endless networking.",
      },
      {
        body: "My goal is not to overwhelm you with technology, but to integrate AI smoothly into your career, daily life and workflows.",
      },
      {
        body: "You already have experience. AI is simply the next tool.",
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
