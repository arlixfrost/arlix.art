import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://www.arlix.art";
const PAGES = ["/", "/art/", "/tech/", "/pricing/", "/rights/", "/contact/", "/privacy/"];
const url = (l: string, p: string) => (l === "en" ? BASE + p : BASE + (p === "/" ? `/${l}/` : `/${l}${p}`));

// Map of all pages for search engines, each with its German and Italian versions.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((p) =>
    ["en", "de", "it", "fr", "pl"].map((l) => ({
      url: url(l, p),
      alternates: { languages: { en: url("en", p), de: url("de", p), it: url("it", p), fr: url("fr", p), pl: url("pl", p) } },
    })),
  );
}
