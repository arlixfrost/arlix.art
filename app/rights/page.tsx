import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rights & Compliance | Arlix",
  description: "NDA, rights to the finished work, licensed AI tools, music and AI labelling.",
};

const blocks: { title: string; lines: string[] }[] = [
  { title: "NDA", lines: ["A mutual NDA can be signed before the brief is discussed."] },
  {
    title: "Your rights",
    lines: [
      "All rights to the finished work pass to you after the final payment.",
      "Showing the work in a portfolio is agreed with you separately.",
    ],
  },
  {
    title: "Licensed tools",
    lines: [
      "All production runs on paid plans with commercial licences.",
      "Seedance, Seedream, Google Veo, Nano Banana, GPT Image, Midjourney, Higgsfield, Magnific, Recraft, Topaz, HeyGen, Suno, ElevenLabs, Claude, Grok, and many, many more, depending on the project.",
      "Tool names show the software used in production, not a partnership or endorsement.",
    ],
  },
  { title: "Music", lines: ["Original music or tracks licensed for commercial use."] },
  { title: "AI labelling", lines: ["AI content is labelled in line with the EU AI Act, agreed for each project."] },
];

export default function Rights() {
  return (
    <main className="art-theme min-h-screen">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 pt-12 md:pt-20 pb-20 md:pb-24">
        <h1 className="font-display font-normal text-[40px] md:text-[56px] leading-[1.05]">Rights &amp; Compliance</h1>
        <div className="gold-rule mt-5 mb-10 md:mb-14" />
        <div className="max-w-3xl">
          {blocks.map((b) => (
            <section key={b.title} className="py-7 md:py-8 border-t border-[rgba(242,237,230,0.1)] first:border-t-0 first:pt-0">
              <h2 className="font-display font-normal text-[26px] md:text-[32px] leading-[1.1] mb-4">{b.title}</h2>
              {b.lines.map((l) => (
                <p key={l} className="m-0 mt-2 first:mt-0 text-[16px] md:text-[18px] leading-[1.55] text-[#E4DED5]">{l}</p>
              ))}
            </section>
          ))}
          <p className="mt-10 text-[14px] leading-[1.5] text-[#9B948B]">A production studio, not a law firm: legal advice comes from your own counsel.</p>
        </div>
      </div>
    </main>
  );
}
