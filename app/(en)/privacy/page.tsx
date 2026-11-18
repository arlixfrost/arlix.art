import type { Metadata } from "next";
import PrivacyPage from "@/components/PrivacyPage";
import { localeMeta } from "@/lib/meta";

export const metadata: Metadata = localeMeta("en", "/privacy/", "meta.privacyTitle", "meta.privacyDescription");

export default function Privacy() {
  return <PrivacyPage />;
}
