"use client";
import { useEffect, useRef, useState } from "react";

// Contact form. Letters go to start@arlix.art through FormSubmit (the site itself is static and cannot send mail).
const ENDPOINT = "https://formsubmit.co/ajax/start@arlix.art";

const GROUPS: { title: string; items: string[] }[] = [
  { title: "Art", items: ["Brand & Fashion Films", "Hybrid", "Food & Restaurants", "AI Models & UGC", "Cartoons & AI Pets"] },
  { title: "Tech", items: ["AI Consulting & Training", "Web Design", "Monthly Content", "AI Agents", "Royalty Free Music"] },
  { title: "", items: ["Something else"] },
];

const field =
  "w-full bg-transparent border border-[rgba(242,237,230,0.22)] px-4 py-3 text-[16px] text-[#F2EDE6] placeholder:text-[#7D766E] focus:outline-none focus:border-[#C9A962] transition-colors";
const lab = "block text-[13px] tracking-[0.16em] uppercase text-[#9B948B] mb-2";

function Check({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`shrink-0 h-[18px] w-[18px] border flex items-center justify-center ${on ? "border-[#C9A962] bg-[rgba(201,169,98,0.15)]" : "border-[rgba(242,237,230,0.35)]"}`}>
      {on ? <span className="h-[8px] w-[8px] bg-[#C9A962]" /> : null}
    </span>
  );
}

export default function ContactForm() {
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [nda, setNda] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("_honey")) return;
    setState("sending");
    const body = {
      Name: f.get("name"),
      Email: f.get("email"),
      Company: f.get("company") || "",
      "Website or Instagram": f.get("site") || "",
      Interested: picked.join(", "),
      Message: f.get("message"),
      "Mutual NDA before the brief": nda ? "Yes" : "No",
      _replyto: f.get("email"),
      _subject: `New inquiry from ${f.get("name")}`,
      _template: "table",
    };
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-[rgba(201,169,98,0.7)] px-6 py-8 max-w-2xl">
        <p className="font-display text-[28px] md:text-[34px] leading-[1.15] m-0">Thank you.</p>
        <p className="mt-3 mb-0 text-[16px] md:text-[18px] leading-[1.55] text-[#E4DED5]">Your inquiry is on its way. Replies within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-2xl">
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label className={lab} htmlFor="cf-name">Name *</label>
        <input id="cf-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label className={lab} htmlFor="cf-email">Email *</label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label className={lab} htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" autoComplete="organization" className={field} />
      </div>
      <div>
        <label className={lab} htmlFor="cf-site">Website or Instagram (optional)</label>
        <input id="cf-site" name="site" className={field} />
      </div>

      <div ref={boxRef} className="relative">
        <span className={lab} id="cf-int">What are you interested in? (select multiple)</span>
        <button type="button" aria-labelledby="cf-int" aria-expanded={open} onClick={() => setOpen((o) => !o)}
          className={`${field} flex items-center justify-between gap-3 text-left`}>
          <span className={picked.length ? "text-[#F2EDE6]" : "text-[#7D766E]"}>{picked.length ? picked.join(", ") : "Select"}</span>
          <span aria-hidden="true" className={`text-[#C9A962] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </button>
        {open ? (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-[#0B0B0C] border border-[rgba(201,169,98,0.55)] max-h-[60vh] overflow-y-auto py-2">
            {GROUPS.map((g, i) => (
              <div key={i} className={i ? "mt-2 pt-2 border-t border-[rgba(242,237,230,0.1)]" : ""}>
                {g.title ? <div className="px-4 pt-1 pb-1 text-[12px] tracking-[0.24em] uppercase text-[#C9A962]">{g.title}</div> : null}
                {g.items.map((it) => (
                  <button type="button" key={it} onClick={() => toggle(it)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[16px] text-[#E4DED5] hover:text-[#F2EDE6]">
                    <Check on={picked.includes(it)} />
                    {it}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <label className={lab} htmlFor="cf-msg">Message *</label>
        <textarea id="cf-msg" name="message" required rows={6} className={`${field} resize-y`} />
      </div>

      <button type="button" onClick={() => setNda((v) => !v)} className="flex items-center gap-3 text-left text-[15px] md:text-[16px] text-[#E4DED5]">
        <Check on={nda} />
        I would like to sign a mutual NDA before sharing the brief
      </button>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
        <button type="submit" disabled={state === "sending"} className="frame-btn disabled:opacity-60">
          {state === "sending" ? "Sending" : "Send inquiry"}
        </button>
        <span className="text-[14px] text-[#9B948B]">Replies within 24 hours.</span>
      </div>
      {state === "error" ? (
        <p className="m-0 text-[15px] text-[#E4DED5]">The message did not go through. Please write to <a className="underline decoration-[#C9A962] underline-offset-4" href="mailto:start@arlix.art">start@arlix.art</a>.</p>
      ) : null}
    </form>
  );
}
