import type { Metadata } from "next";
import RightsPage from "@/components/RightsPage";
import { localeMeta } from "@/lib/meta";

export const metadata: Metadata = localeMeta("en", "/rights/", "meta.rightsTitle", "meta.rightsDescription");

export default function Rights() {
  return <RightsPage />;
}
