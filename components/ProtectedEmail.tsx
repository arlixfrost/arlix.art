"use client";

import { useEffect, useState } from "react";

// The address is put together in the browser only, so it never sits as plain text in the page code
// that address-harvesting bots read. Visitors see a normal, clickable address.
const USER = ["sta", "rt"];
const HOST = ["arl", "ix", ".", "art"];
export const emailAddress = () => USER.join("") + String.fromCharCode(64) + HOST.join("");

export default function ProtectedEmail({ className }: { className?: string }) {
  const [addr, setAddr] = useState("");
  useEffect(() => setAddr(emailAddress()), []);
  if (!addr) return <span className={className} aria-hidden="true">&nbsp;</span>;
  return <a className={className} href={"mai" + "lto:" + addr}>{addr}</a>;
}
