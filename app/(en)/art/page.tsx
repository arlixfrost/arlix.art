import type { Metadata } from "next";
import ArtSlides from "@/components/ArtSlides";
import { localeMeta } from "@/lib/meta";

export const metadata: Metadata = localeMeta("en", "/art/", "meta.artTitle", "meta.artDescription");

export default function Art() { return <ArtSlides />; }
