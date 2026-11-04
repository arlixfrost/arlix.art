import { Ph, Pricing, ContactCta } from "@/components/Ph";

const items = [
  "CV / LinkedIn + Career",
  "Web Design",
  "Assistants / Agents",
  "Content factory",
  "Individual consultations",
  "Training for small business",
  "Royalty Free music",
];

export default function Tech() {
  return (
    <main>
      <section className="px-6 pt-20 pb-12 max-w-3xl">
        <div className="label mb-3">Tech</div>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6">[Tech headline]</h1>
        <Ph className="h-28">[Intro: what Arlix Tech offers, 2 to 4 lines]</Ph>
      </section>

      <section className="px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <article key={t} className="border border-white/15 p-5 flex flex-col gap-3 hover:border-white/40">
              <div className="label">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="text-xl">{t}</h2>
              <Ph className="h-24">[Description]</Ph>
              <Ph className="h-10">[Price from / CTA]</Ph>
            </article>
          ))}
        </div>
      </section>

      <Pricing />
      <ContactCta />
    </main>
  );
}
