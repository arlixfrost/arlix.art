import type { Metadata } from "next";
import TechSlides from "@/components/TechSlides";
import { localeMeta } from "@/lib/meta";

export const metadata: Metadata = localeMeta("en", "/tech/", "meta.techTitle", "meta.techDescription");

export default function Tech() { return <TechSlides />; }
