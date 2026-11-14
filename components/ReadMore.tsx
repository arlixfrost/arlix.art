"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Long text of a section: "Read more" opens it over the whole screen under the header.
// Each chapter sits in its own thin gold frame, the chapter heading is underlined with a short gold line.
// Phone: frames stack one under another; a gold arrow at the bottom keeps showing until the reader reaches the end.

export type Chapter = { h: string; ps: string[] };
// chapters: reading order (phone shows them one under another in this order);
// columns: which chapters stand in which column on a wide screen (indexes into chapters).
export type More = { chapters: Chapter[]; columns: number[][] };

// [text] marks a phrase in bold; {text|url} marks a link.
function rich(t: string) {
  const parts = t.split(/(\[[^\]]+\]|\{[^}]+\})/g);
  return parts.map((p, i) => {
    if (p.startsWith("[")) return <strong key={i} className="font-medium text-[#F2EDE6]">{p.slice(1, -1)}</strong>;
    if (p.startsWith("{")) {
      const [label, url] = p.slice(1, -1).split("|");
      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#F2EDE6] underline underline-offset-4 decoration-[#C9A962] hover:text-[#C9A962]">{label}</a>;
    }
    return p;
  });
}

function Frame({ c }: { c: Chapter }) {
  return (
    <div className="border border-[#C9A962]/35 px-6 py-7 md:px-10 md:pt-10 md:pb-11 h-full">
      <h3 className="font-display font-normal text-[24px] md:text-[30px] leading-[1.2] text-[#F2EDE6] m-0">{c.h}</h3>
      <div className="w-12 h-px bg-[#C9A962] mt-4 mb-6 md:mt-5 md:mb-7" />
      {c.ps.map((p, i) => (
        <p key={i} className="m-0 mb-5 last:mb-0 text-[16px] md:text-[17px] leading-[1.7] font-normal text-[#F2EDE6]/80">{rich(p)}</p>
      ))}
    </div>
  );
}

export function ReadMore({ title, more }: { title: string; more: More }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const el = box.current;
    const check = () => { if (el) setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8); };
    el?.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const t = setTimeout(check, 50);
    return () => { window.removeEventListener("keydown", onKey); el?.removeEventListener("scroll", check); window.removeEventListener("resize", check); clearTimeout(t); };
  }, [open]);

  const down = () => { const el = box.current; if (el) el.scrollBy({ top: el.clientHeight * 0.8, behavior: "smooth" }); };
  // One frame per column on a wide screen when every column holds one chapter; otherwise each column stacks its frames.
  const cols = more.columns.length;

  return (
    <>
      <button onClick={() => setOpen(true)} className="rm-btn mt-6 inline-flex items-center gap-3 py-2 border-b border-[#C9A962]/70 font-body text-[12px] md:text-[13px] font-medium uppercase tracking-[0.22em] text-[#C9A962] hover:text-[#F2EDE6] transition-colors">
        Read more
        <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true"><path d="M0 5h20M16 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div role="dialog" aria-modal="true" aria-label={title} data-readmore
          className="fixed inset-x-0 bottom-0 top-14 sm:top-[72px] z-[60] bg-[#121110] text-[#F2EDE6] font-body">
          <div ref={box} className="h-full overflow-y-auto overscroll-contain">
            <div className="relative px-5 pt-8 pb-28 md:px-24 md:pt-16 md:pb-24 max-w-[1440px] mx-auto">
              <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 md:right-10 md:top-8 h-11 w-11 flex items-center justify-center text-[#F2EDE6] hover:text-[#C9A962]">
                <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3l14 14M17 3L3 17" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <div className="font-display font-normal text-[34px] md:text-[48px] leading-[1.06] pr-12 mb-8 md:mb-14">{title}</div>
              <div className="rm-stack flex-col gap-5">
                {more.chapters.map((c) => <Frame key={c.h} c={c} />)}
              </div>
              <div className={`rm-cols gap-10 ${cols === 3 ? "grid-cols-3 items-stretch" : "grid-cols-2 items-start"}`}>
                {more.columns.map((col, i) => (
                  <div key={i} className="flex flex-col gap-10">
                    {col.map((k) => <div key={k} className={col.length === 1 ? "flex-1" : ""}><Frame c={more.chapters[k]} /></div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {!atEnd && (
            <button onClick={down} aria-label="Scroll down" className="readmore-arrow absolute h-12 w-12 rounded-full border border-[#C9A962] bg-[#121110]/85 text-[#C9A962] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v13M3 10l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
            </button>
          )}
        </div>, document.body)}
    </>
  );
}
