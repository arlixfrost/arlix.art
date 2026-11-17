import type { Metadata } from "next";
import "../fonts.css";
import "../globals.css";
import { AppShell } from "@/components/AppShell";
import { localeMeta } from "@/lib/meta";

export const metadata: Metadata = localeMeta("en", "/", "meta.title", "meta.description");

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <AppShell locale="en">{children}</AppShell>;
}
