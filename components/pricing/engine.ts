// Pricing engine for arlix.art/pricing.
// Hybrid of two reference calculators, converted to euros with nothing added on top (decided 17.11.2026):
//  - work stages in minutes and the multipliers come from Olga Nikitina's calculator ($40 an hour, 1 USD = 0.89 EUR);
//  - mood board, format adaptation and track licence come from the lisyeasy calculator (1 EUR = 91.03 RUB).
// Benchmark: AI25 Studio prices minus 30 to 50 percent. Advertising and outdoor usage are left out for now.

export type Kind = "video" | "image";
export type Choice<T extends string> = T;

export type Inputs = {
  kind: Kind;
  // shared
  refs: "yes" | "no";
  creative: "none" | "light" | "full" | "variants";
  charCount: number;
  scene: "simple" | "medium" | "complex";
  usage: "personal" | "site";
  sources: "no" | "yes";
  brand: "no" | "flexible" | "yes";
  urgency: "normal" | "h48" | "express";
  extraRevisions: number;
  moodboard: boolean;
  // image
  imgCount: number;
  formats: number;
  // video
  duration: number;
  scenes: number;
  hasScript: "yes" | "no";
  music: "none" | "library" | "synth";
  voice: "none" | "mix" | "create";
  sfx: boolean;
  lipsync: boolean;
  subs: "none" | "simple" | "styled" | "translate";
};

export const DEFAULTS: Inputs = {
  kind: "video",
  refs: "yes", creative: "light", charCount: 1, scene: "simple", usage: "site", sources: "no", brand: "no",
  urgency: "normal", extraRevisions: 0, moodboard: false,
  imgCount: 5, formats: 0,
  duration: 15, scenes: 5, hasScript: "yes", music: "library", voice: "none", sfx: false, lipsync: false, subs: "none",
};

export const PRESETS: { id: string; label: string; note: string; inputs: Inputs }[] = [
  {
    id: "reel", label: "Social reel", note: "15 seconds",
    inputs: { ...DEFAULTS, kind: "video", duration: 15, scenes: 5, charCount: 1, scene: "simple", hasScript: "no", refs: "yes", creative: "light", music: "library" },
  },
  {
    id: "film", label: "Brand film", note: "from 90 seconds",
    inputs: { ...DEFAULTS, kind: "video", duration: 90, scenes: 15, charCount: 2, scene: "medium", hasScript: "no", refs: "no", creative: "light", moodboard: true, music: "library", sfx: true },
  },
  {
    id: "photos", label: "Photo series", note: "10 realistic images",
    inputs: { ...DEFAULTS, kind: "image", imgCount: 10, charCount: 1, scene: "medium", refs: "yes", creative: "light", moodboard: false },
  },
];

const EUR_PER_MIN = (40 * 0.89) / 60; // Olga's hourly rate in euros, per minute
const RUB = 91.03;
const MOODBOARD = 30000 / RUB; // lisyeasy default rate for concept and mood board
const ADAPT = 1000 / RUB; // per extra format file
const TRACK = 8000 / RUB; // track licence

type Line = { label: string; mn: number; avg: number; mx: number };

export function estimate(i: Inputs) {
  const lines: Line[] = [];
  const add = (label: string, mn: number, avg: number, mx: number) => lines.push({ label, mn: mn * EUR_PER_MIN, avg: avg * EUR_PER_MIN, mx: mx * EUR_PER_MIN });
  const fixed = (label: string, eur: number) => lines.push({ label, mn: eur, avg: eur, mx: eur });

  if (i.kind === "image") {
    add("Brief and research of the task", 5, 10, 15);
    i.refs === "yes" ? add("Review of your references", 15, 25, 35) : add("Reference search and selection", 30, 60, 90);
    if (i.moodboard) fixed("Concept and mood board", MOODBOARD);
    add("First image: style and generation", 25, 40, 60);
    if (i.imgCount > 1) {
      const k = (n: number) => (n <= 2 ? 0.75 : n <= 9 ? 0.55 : 0.35);
      let a = 0, b = 0, c = 0;
      for (let n = 1; n < i.imgCount; n++) { a += 25 * k(n); b += 40 * k(n); c += 60 * k(n); }
      add(`Further images in the same style (${i.imgCount - 1})`, a, b, c);
    }
    add("Retouching and upscaling", 5, 10, 15);
    add("File delivery", 10, 15, 20);
    add("Two rounds of revisions", 40, 60, 80);
    if (i.charCount > 0) {
      add("Character creation", 30, 50, 70);
      if (i.charCount > 1) add(`Character styling (${i.charCount})`, 20 * i.charCount, 40 * i.charCount, 60 * i.charCount);
    }
    if (i.scene === "medium") add("Scene with a setting", 15, 30, 45);
    if (i.scene === "complex") add("Detailed scene", 30, 60, 90);
    if (i.formats > 0) fixed(`Extra formats (${i.formats} files)`, ADAPT * i.formats);
    if (i.extraRevisions > 0) add(`Extra revisions (${i.extraRevisions})`, 20 * i.extraRevisions, 30 * i.extraRevisions, 40 * i.extraRevisions);
  } else {
    const s = i.scene === "medium" ? 1.2 : i.scene === "complex" ? 1.4 : 1;
    const n = i.scenes;
    const r = Math.ceil(i.duration / 15);
    add("Brief and review of materials", 20, 30, 40);
    i.refs === "yes" ? add("Review of your references", 15, 25, 35) : add("Reference search and selection", 30, 60, 90);
    if (i.moodboard) fixed("Concept and mood board", MOODBOARD);
    if (i.hasScript === "no") add("Script", 40, 60, 150);
    add("Story logic of the film", 20, 40, 60);
    if (i.charCount > 0) add(`Characters (${i.charCount})`, 30 * i.charCount, 50 * i.charCount, 70 * i.charCount);
    add(`Storyboard (${n} scenes)`, 10 * n * s, 15 * n * s, 20 * n * s);
    add(`Key frames (${n} scenes)`, 25 * n * s, 40 * n * s, 60 * n * s);
    add("Key frame retouching", 10 * n * s, 15 * n * s, 20 * n * s);
    add("Key frame upscaling", 5 * n * s, 10 * n * s, 15 * n * s);
    add(`Video generation (${n} scenes)`, 15 * n * s, 30 * n * s, 60 * n * s);
    add("Video upscaling", 5 * n * s, 10 * n * s, 15 * n * s);
    add("Editing and rhythm", 15 * r, 25 * r, 40 * r);
    add("Transitions and effects", 10 * r, 20 * r, 30 * r);
    add("Colour grading", 10 * r, 20 * r, 30 * r);
    add("Final upscale to 2K or 4K", 40, 60, 90);
    add("File delivery", 10, 15, 20);
    add("Two rounds of revisions", 0, 0, 0);
    if (i.extraRevisions > 0) add(`Extra revisions (${i.extraRevisions})`, 30 * i.extraRevisions, 60 * i.extraRevisions, 90 * i.extraRevisions);
    if (i.music === "library") { add("Music: track selection", 20, 30, 60); fixed("Track licence", TRACK); }
    if (i.music === "synth") add("Music: original track", 40, 60, 80);
    if (i.voice === "mix") add("Voice-over: your recording mixed in", 10, 20, 30);
    if (i.voice === "create") add("Voice-over: created from scratch", 40, 80, 120);
    if (i.sfx) add("Sound design and effects", 20, 40, 80);
    if (i.lipsync) add("Lip sync", 20, 40, 60);
    if (i.subs === "simple") add("Subtitles: simple", 20, 30, 40);
    if (i.subs === "styled") add("Subtitles: styled", 40, 60, 80);
    if (i.subs === "translate") add("Subtitles with translation", 60, 90, 120);
  }

  const x =
    ({ none: 1, light: 1.2, full: 2, variants: 1.4 }[i.creative] ?? 1) *
    ({ personal: 1, site: 1.2 }[i.usage] ?? 1) *
    ({ no: 1, flexible: 1.05, yes: 1.1 }[i.brand] ?? 1) *
    (i.sources === "yes" ? 1.3 : 1) *
    ({ normal: 1, h48: 1.5, express: 2 }[i.urgency] ?? 1);

  const sum = (k: "mn" | "avg" | "mx") => lines.reduce((t, l) => t + l[k], 0) * x;
  const round = (v: number) => Math.round(v / 10) * 10;
  return { min: round(sum("mn")), max: round(sum("mx")), avg: round(sum("avg")), items: lines.map((l) => l.label) };
}

export const eur = (v: number, locale: "en" | "de" | "it" = "en") => {
  if (locale === "en") return "€" + v.toLocaleString("en-GB");
  // de-DE and it-IT both use a dot as the thousands separator. it-IT may skip grouping under 10.000, so format it by hand.
  const grouped = Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return grouped + " €";
};

// What the client picked, in plain words: the estimate shows only these, never the studio's work stages.
export function choices(i: Inputs, t?: (key: string, vars?: Record<string, string | number>) => string): string[] {
  if (t) return localizedChoices(i, t);
  const out: string[] = [];
  const creative = { none: "Based on your references", light: "Your references, refined", full: "Full creative concept", variants: "Two to three directions to choose from" }[i.creative];
  const scene = { simple: "Simple scenes", medium: "Scenes with a setting", complex: "Detailed scenes" }[i.scene];
  if (i.kind === "video") {
    out.push(`AI film, ${i.duration} seconds`, `${i.scenes} scene${i.scenes > 1 ? "s" : ""}`);
    if (i.hasScript === "no") out.push("Script written for you");
  } else {
    out.push(`${i.imgCount} realistic AI image${i.imgCount > 1 ? "s" : ""}`);
    if (i.formats > 0) out.push(`${i.formats} extra format${i.formats > 1 ? "s" : ""}`);
  }
  out.push(i.refs === "no" ? "References found for you" : "Your references");
  if (i.moodboard) out.push("Concept and mood board");
  if (i.charCount > 0) out.push(`${i.charCount} character${i.charCount > 1 ? "s" : ""}`);
  out.push(scene, creative);
  if (i.kind === "video") {
    if (i.music === "library") out.push("Licensed music track");
    if (i.music === "synth") out.push("Original music track");
    if (i.voice === "mix") out.push("Your voice-over recording mixed in");
    if (i.voice === "create") out.push("Voice-over created for you");
    if (i.lipsync) out.push("Lip sync");
    if (i.sfx) out.push("Sound design");
    if (i.subs === "simple") out.push("Simple subtitles");
    if (i.subs === "styled") out.push("Styled subtitles");
    if (i.subs === "translate") out.push("Subtitles with translation");
  }
  out.push(i.usage === "personal" ? "Personal or portfolio use" : "Brand social media and website");
  if (i.brand === "flexible") out.push("Loosely following your brand book");
  if (i.brand === "yes") out.push("Exactly following your brand book");
  if (i.sources === "yes") out.push("Source files");
  out.push({ normal: "Standard timing", h48: "Within 48 hours", express: "Within 24 hours" }[i.urgency]);
  if (i.extraRevisions > 0) out.push(`${i.extraRevisions} extra round${i.extraRevisions > 1 ? "s" : ""} of revisions`);
  return out;
}

function localizedChoices(i: Inputs, t: (key: string, vars?: Record<string, string | number>) => string): string[] {
  const out: string[] = [];
  const oneMany = (n: number, one: string, many: string) => t(n === 1 ? one : many, { n });
  if (i.kind === "video") {
    out.push(t("pricing.choice.film", { n: i.duration }));
    out.push(oneMany(i.scenes, "pricing.choice.sceneOne", "pricing.choice.sceneMany"));
    if (i.hasScript === "no") out.push(t("pricing.choice.scriptWritten"));
  } else {
    out.push(oneMany(i.imgCount, "pricing.choice.imageOne", "pricing.choice.imageMany"));
    if (i.formats > 0) out.push(oneMany(i.formats, "pricing.choice.formatOne", "pricing.choice.formatMany"));
  }
  out.push(i.refs === "no" ? t("pricing.choice.refsFound") : t("pricing.choice.yourRefs"));
  if (i.moodboard) out.push(t("pricing.choice.moodboard"));
  if (i.charCount > 0) out.push(oneMany(i.charCount, "pricing.choice.charOne", "pricing.choice.charMany"));
  out.push(t(`pricing.choice.scene.${i.scene}`));
  out.push(t(`pricing.choice.creative.${i.creative}`));
  if (i.kind === "video") {
    if (i.music === "library") out.push(t("pricing.choice.licensedMusic"));
    if (i.music === "synth") out.push(t("pricing.choice.originalMusic"));
    if (i.voice === "mix") out.push(t("pricing.choice.voiceMix"));
    if (i.voice === "create") out.push(t("pricing.choice.voiceCreate"));
    if (i.lipsync) out.push(t("pricing.choice.lipsync"));
    if (i.sfx) out.push(t("pricing.choice.sfx"));
    if (i.subs === "simple") out.push(t("pricing.choice.subsSimple"));
    if (i.subs === "styled") out.push(t("pricing.choice.subsStyled"));
    if (i.subs === "translate") out.push(t("pricing.choice.subsTranslate"));
  }
  out.push(i.usage === "personal" ? t("pricing.choice.usePersonal") : t("pricing.choice.useBrand"));
  if (i.brand === "flexible") out.push(t("pricing.choice.brandFlexible"));
  if (i.brand === "yes") out.push(t("pricing.choice.brandExact"));
  if (i.sources === "yes") out.push(t("pricing.choice.sources"));
  out.push(t({ normal: "pricing.choice.timingNormal", h48: "pricing.choice.timing48", express: "pricing.choice.timing24" }[i.urgency]));
  if (i.extraRevisions > 0) out.push(oneMany(i.extraRevisions, "pricing.choice.revOne", "pricing.choice.revMany"));
  return out;
}
