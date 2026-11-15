// Site footer: the same on every page (home, Art, Tech, Contact).
export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`bg-[#0B0B0C] border-t border-[rgba(242,237,230,0.12)] px-6 text-center font-body text-[#9B948B] ${className}`}>
      <div className="text-[12px] tracking-[0.24em] uppercase">© Arlix 2026</div>
      <div className="mt-2 text-[12px] tracking-[0.04em]">All films on this site are created with AI.</div>
    </footer>
  );
}
