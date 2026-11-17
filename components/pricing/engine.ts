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
    id: "film", label: "Brand film", note: "90 seconds",
    inputs: { ...DEFAULTS, kind: "video", duration: 90, scenes: 25, charCount: 2, scene: "medium", hasScript: "no", refs: "no", creative: "full", moodboard: true, music: "library", sfx: true },
  },
  {
    id: "photos", label: "Photo series", note: "10 images",
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

export const eur = (v: number) => "€" + v.toLocaleString("en-GB");
