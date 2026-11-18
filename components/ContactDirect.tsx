"use client";

import { useEffect, useState } from "react";
import ProtectedEmail from "@/components/ProtectedEmail";

// Direct contact under the form: the site email and a WhatsApp button (messages only, no call button).
// The number and the address are put together in the browser, so they never sit as plain text in the page code.
const WA = ["46", "722", "068", "880"];
const WA_TEXT =
  "Hello, Arlix!\nMy name is ___ from ___ (company or brand).\nI am interested in: a film / visuals / a website / AI agents / consulting / other (please specify): ___";

export default function ContactDirect() {
  const [wa, setWa] = useState("");
  useEffect(() => setWa("https://wa.me/" + WA.join("") + "?text=" + encodeURIComponent(WA_TEXT)), []);
  return (
    <div className="mt-14 md:mt-16 pt-10 border-t border-[rgba(242,237,230,0.1)] flex flex-wrap items-center gap-x-8 gap-y-5">
      <a href={wa || undefined} target="_blank" rel="noopener" className="frame-btn" aria-label="WhatsApp">WhatsApp</a>
      <ProtectedEmail className="text-[16px] md:text-[17px] text-[#E4DED5] underline decoration-[#C9A962] underline-offset-4" />
    </div>
  );
}
