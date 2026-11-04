export function Ph({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`ph flex items-center justify-center text-center p-4 ${className}`}>{children}</div>;
}

export function Pricing({ id = "pricing" }: { id?: string }) {
  return (
    <section id={id} className="px-6 py-16 border-t border-white/10 scroll-mt-28">
      <div className="label mb-3">Section</div>
      <h2 className="text-2xl mb-6">Pricing</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {["Package 1", "Package 2", "Package 3"].map((p) => (
          <Ph key={p} className="h-48 flex-col gap-2">
            <span>[{p}: name]</span>
            <span>[Price]</span>
            <span>[What is included]</span>
          </Ph>
        ))}
      </div>
      <Ph className="mt-4 h-14">[Pricing note: custom quotes, terms]</Ph>
    </section>
  );
}

export function ContactCta() {
  return (
    <section className="px-6 py-16 border-t border-white/10 text-center">
      <Ph className="h-12 mb-6 max-w-xl mx-auto">[CTA line: invite to start a project]</Ph>
      <a href="/contact" className="inline-block border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black">
        Contact
      </a>
    </section>
  );
}
