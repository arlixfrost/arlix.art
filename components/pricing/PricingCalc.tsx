"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PRESETS, choices, estimate, eur, type Inputs } from "./engine";
import { useI18n } from "@/components/LocaleProvider";

// arlix.art/pricing: questions on the left, a live estimate on the right (on phones it follows under the questions,
// with a small total bar pinned to the bottom). Studio rates stay hidden: the visitor sees what is included and a price range.

type Opt<T extends string> = [T, string];

function Seg<T extends string>({ value, options, onChange }: { value: T; options: Opt<T>[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, label]) => (
        <button key={v} type="button" onClick={() => onChange(v)} aria-pressed={value === v}
          className={`min-h-11 px-4 py-2 border text-[14px] md:text-[15px] tracking-[0.04em] transition-colors ${value === v ? "border-[#C9A962] text-[#F2EDE6] bg-[rgba(201,169,98,0.08)]" : "border-[rgba(242,237,230,0.22)] text-[#B5ADA3] hover:border-[#C9A962] hover:text-[#F2EDE6]"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Step({ value, onChange, min = 0, step = 1, unit, less, more }: { value: number; onChange: (v: number) => void; min?: number; step?: number; unit?: string; less: string; more: string }) {
  const btn = "h-11 w-11 border border-[rgba(242,237,230,0.22)] text-[#F2EDE6] text-xl leading-none hover:border-[#C9A962] hover:text-[#C9A962] transition-colors";
  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label={less} className={btn} onClick={() => onChange(Math.max(min, value - step))}>−</button>
      <span className="min-w-[3.5rem] text-center font-display text-[26px] leading-none">{value}{unit ? <span className="font-body text-[14px] text-[#9B948B] ml-1">{unit}</span> : null}</span>
      <button type="button" aria-label={more} className={btn} onClick={() => onChange(value + step)}>+</button>
    </div>
  );
}

function Q({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="py-6 border-t border-[rgba(242,237,230,0.1)] first:border-t-0">
      <div className="text-[16px] md:text-[17px] text-[#F2EDE6] font-normal mb-1">{label}</div>
      {hint ? <p className="text-[14px] leading-[1.5] text-[#ADA59B] mb-4 max-w-xl">{hint}</p> : <div className="mb-3" />}
      {children}
    </div>
  );
}

function Group({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="font-display text-[#C9A962] text-[20px]">{String(n).padStart(2, "0")}</span>
        <h2 className="font-display font-normal text-[26px] md:text-[32px] leading-[1.1]">{title}</h2>
      </div>
      <div className="gold-rule mb-2" />
      {children}
    </section>
  );
}

const NOTICE = "Please note that all prices shown here are estimates only. Every project is individual, and the final price is always agreed with you personally.";
const TERMS = [
  "Two rounds of revisions are included.",
  "50% prepayment, the balance on delivery.",
];

export default function PricingCalc() {
  const { locale, t, href } = useI18n();
  const tx = (key: string, en: string) => (locale === "en" ? en : t(key));
  const [i, setI] = useState<Inputs>(PRESETS[0].inputs);
  const [preset, setPreset] = useState<string | null>(PRESETS[0].id);
  const [copied, setCopied] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => { setPreset(null); setI((p) => ({ ...p, [k]: v })); };
  const r = useMemo(() => estimate(i), [i]);
  const picked = useMemo(() => choices(i, locale === "en" ? undefined : t), [i, locale, t]);
  const video = i.kind === "video";
  const toWord = tx("pricing.to", "to");
  const range = `${eur(r.min, locale)} ${toWord} ${eur(r.max, locale)}`;
  const notice = tx("pricing.notice", NOTICE);
  const terms = locale === "en" ? TERMS : [t("pricing.term0"), t("pricing.term1")];
  const less = tx("pricing.less", "Less");
  const more = tx("pricing.more", "More");
  const sec = tx("pricing.sec", "sec");

  const copy = async () => {
    const text = [
      tx("pricing.copyTitle", "Arlix: project estimate"), "",
      tx("pricing.copyPrice", "Estimated price: {range}").replace("{range}", range),
      notice, "",
      tx("pricing.copyChoices", "Your choices:"),
      ...picked.map((line) => `- ${line}`), "", ...terms, "", "arlix.art",
    ].join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard not allowed */ }
  };

  return (
    <main className="art-theme pricing-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 pt-12 md:pt-20 pb-28 md:pb-24">
        <header className="max-w-3xl">
          <h1 className="font-display font-normal text-[40px] md:text-[56px] leading-[1.05]">{tx("pricing.h1", "Pricing")}</h1>
          <div className="gold-rule mt-5 mb-6" />
          <p className="text-[16px] md:text-[18px] leading-[1.55] text-[#E4DED5] max-w-2xl">
            {tx("pricing.intro", "Here you can get an approximate idea of what your project may cost.")}
          </p>
          <div className="mt-6 border border-[rgba(201,169,98,0.7)] px-5 py-4 md:px-6 md:py-5 max-w-2xl">
            <p className="m-0 text-[16px] md:text-[17px] leading-[1.55] text-[#F2EDE6]">{notice}</p>
          </div>
        </header>

        <div className="no-print mt-10 md:mt-14">
          <div className="label mb-4">{tx("pricing.quickStart", "Quick start")}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {PRESETS.map((p) => (
              <button key={p.id} type="button" onClick={() => { setPreset(p.id); setI(p.inputs); }}
                className={`text-left px-5 py-4 border transition-colors ${preset === p.id ? "border-[#C9A962] bg-[rgba(201,169,98,0.08)]" : "border-[rgba(242,237,230,0.22)] hover:border-[#C9A962]"}`}>
                <div className="font-display text-[22px] leading-[1.1] text-[#F2EDE6]">{locale === "en" ? p.label : t(`pricing.preset.${p.id}.label`)}</div>
                <div className="text-[13px] tracking-[0.12em] uppercase text-[#9B948B] mt-1">{locale === "en" ? p.note : t(`pricing.preset.${p.id}.note`)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
          <div className="pricing-questions min-w-0">
            <Group n={1} title={tx("pricing.group.format", "Format")}>
              <Q label={tx("pricing.q.kind", "What do you need?")}>
                <Seg value={i.kind} onChange={(v) => set("kind", v)} options={[["video", tx("pricing.opt.video", "Video")], ["image", tx("pricing.opt.image", "Images")]]} />
              </Q>
            </Group>

            <Group n={2} title={tx("pricing.group.basics", "The basics")}>
              {video ? (
                <>
                  <Q label={tx("pricing.q.duration", "Length of the film")} hint={tx("pricing.hint.duration", "One number is enough. Stories run about 15 seconds, reels about 30, a brand film 90 to 120.")}>
                    <Step value={i.duration} min={5} step={5} unit={sec} less={less} more={more} onChange={(v) => set("duration", v)} />
                  </Q>
                  <Q label={tx("pricing.q.scenes", "Number of scenes")} hint={tx("pricing.hint.scenes", "A scene is one separate moment: another place, another shot, another action. Up to 10 seconds is about 3 to 5 scenes, 30 seconds about 10 to 15.")}>
                    <Step value={i.scenes} min={1} less={less} more={more} onChange={(v) => set("scenes", v)} />
                  </Q>
                  <Q label={tx("pricing.q.hasScript", "Do you have a script?")} hint={tx("pricing.hint.hasScript", "A script says what happens in every scene, in what order, with what text. A general idea or a mood is not yet a script.")}>
                    <Seg value={i.hasScript} onChange={(v) => set("hasScript", v)} options={[["yes", tx("pricing.opt.scriptYes", "Yes, I have one")], ["no", tx("pricing.opt.scriptNo", "No, write it for me")]]} />
                  </Q>
                </>
              ) : (
                <>
                  <Q label={tx("pricing.q.imgCount", "How many images?")} hint={tx("pricing.hint.imgCount", "The more images in one style, the less each next one costs. A new style or a new character starts a new series.")}>
                    <Step value={i.imgCount} min={1} less={less} more={more} onChange={(v) => set("imgCount", v)} />
                  </Q>
                  <Q label={tx("pricing.q.formats", "Extra formats")} hint={tx("pricing.hint.formats", "Each image adapted to another size (story, banner, print) counts as one file.")}>
                    <Step value={i.formats} min={0} less={less} more={more} onChange={(v) => set("formats", v)} />
                  </Q>
                </>
              )}
              <Q label={tx("pricing.q.refs", "Do you have references?")} hint={tx("pricing.hint.refs", "Examples of what you like: links, images, a film in the right mood. Words like “modern” or “bright” without examples are not references.")}>
                <Seg value={i.refs} onChange={(v) => set("refs", v)} options={[["yes", tx("pricing.opt.refsYes", "Yes, I will send them")], ["no", tx("pricing.opt.refsNo", "No, find them for me")]]} />
              </Q>
              <Q label={tx("pricing.q.moodboard", "Concept and mood board")} hint={tx("pricing.hint.moodboard", "The idea, the visual direction and the logic of the series, put together before production starts.")}>
                <Seg value={i.moodboard ? "yes" : "no"} onChange={(v) => set("moodboard", v === "yes")} options={[["no", tx("pricing.opt.notNeeded", "Not needed")], ["yes", tx("pricing.opt.yesPlease", "Yes, please")]]} />
              </Q>
            </Group>

            <Group n={3} title={tx("pricing.group.details", "Details")}>
              <Q label={tx("pricing.q.characters", "Characters")} hint={tx("pricing.hint.characters", "People, animals or mascots in the frame. One character in different poses is still one character. No living characters: set 0.")}>
                <Step value={i.charCount} min={0} less={less} more={more} onChange={(v) => set("charCount", v)} />
              </Q>
              <Q label={tx("pricing.q.scene", "Scene complexity")} hint={tx("pricing.hint.scene", "Simple: a person or a product, the background does not matter. Medium: a person in a place. Detailed: streets, crowds, rich interiors, movement.")}>
                <Seg value={i.scene} onChange={(v) => set("scene", v)} options={[["simple", tx("pricing.opt.simple", "Simple")], ["medium", tx("pricing.opt.medium", "Medium")], ["complex", tx("pricing.opt.detailed", "Detailed")]]} />
              </Q>
              <Q label={tx("pricing.q.creative", "Creative input")} hint={tx("pricing.hint.creative", "How much is invented for you. Your references only, your references refined, a full creative concept, or two to three directions to choose from.")}>
                <Seg value={i.creative} onChange={(v) => set("creative", v)} options={[["none", tx("pricing.opt.refsOnly", "Your references")], ["light", tx("pricing.opt.refined", "Refined")], ["full", tx("pricing.opt.fullConcept", "Full concept")], ["variants", tx("pricing.opt.directions", "Directions to choose")]]} />
              </Q>
            </Group>

            {video ? (
              <Group n={4} title={tx("pricing.group.sound", "Sound")}>
                <Q label={tx("pricing.q.music", "Music")}>
                  <Seg value={i.music} onChange={(v) => set("music", v)} options={[["none", tx("pricing.opt.noMusic", "No music")], ["library", tx("pricing.opt.licensedTrack", "Licensed track")], ["synth", tx("pricing.opt.originalTrack", "Original track")]]} />
                </Q>
                <Q label={tx("pricing.q.voice", "Voice-over")}>
                  <Seg value={i.voice} onChange={(v) => set("voice", v)} options={[["none", tx("pricing.opt.none", "None")], ["mix", tx("pricing.opt.haveRecording", "I have a recording")], ["create", tx("pricing.opt.createIt", "Create it")]]} />
                </Q>
                <Q label={tx("pricing.q.lipsync", "Lip sync")} hint={tx("pricing.hint.lipsync", "The character’s lips move with the voice. Needed when someone speaks on camera.")}>
                  <Seg value={i.lipsync ? "yes" : "no"} onChange={(v) => set("lipsync", v === "yes")} options={[["no", tx("pricing.opt.no", "No")], ["yes", tx("pricing.opt.yes", "Yes")]]} />
                </Q>
                <Q label={tx("pricing.q.sfx", "Sound design")} hint={tx("pricing.hint.sfx", "Steps, clicks, the sound of the street: the details that make a film feel alive.")}>
                  <Seg value={i.sfx ? "yes" : "no"} onChange={(v) => set("sfx", v === "yes")} options={[["no", tx("pricing.opt.no", "No")], ["yes", tx("pricing.opt.yes", "Yes")]]} />
                </Q>
                <Q label={tx("pricing.q.subs", "Subtitles")}>
                  <Seg value={i.subs} onChange={(v) => set("subs", v)} options={[["none", tx("pricing.opt.none", "None")], ["simple", tx("pricing.opt.simple", "Simple")], ["styled", tx("pricing.opt.styled", "Styled")], ["translate", tx("pricing.opt.withTranslation", "With translation")]]} />
                </Q>
              </Group>
            ) : null}

            <Group n={video ? 5 : 4} title={tx("pricing.group.rights", "Rights and timing")}>
              <Q label={tx("pricing.q.usage", "Where will it be used?")}>
                <Seg value={i.usage} onChange={(v) => set("usage", v)} options={[["personal", tx("pricing.opt.personal", "Personal or portfolio")], ["site", tx("pricing.opt.brandSite", "Brand social media and website")]]} />
              </Q>
              <Q label={tx("pricing.q.brand", "Brand guidelines")} hint={tx("pricing.hint.brand", "Do the colours, fonts and style have to follow a brand book exactly?")}>
                <Seg value={i.brand} onChange={(v) => set("brand", v)} options={[["no", tx("pricing.opt.noBrandBook", "No brand book")], ["flexible", tx("pricing.opt.loosely", "Loosely")], ["yes", tx("pricing.opt.exactly", "Exactly")]]} />
              </Q>
              <Q label={tx("pricing.q.sources", "Source files")} hint={tx("pricing.hint.sources", "Layered files your own designer can change later. Not needed if you only use the finished files.")}>
                <Seg value={i.sources} onChange={(v) => set("sources", v)} options={[["no", tx("pricing.opt.notNeeded", "Not needed")], ["yes", tx("pricing.opt.yes", "Yes")]]} />
              </Q>
              <Q label={tx("pricing.q.timing", "Timing")}>
                <Seg value={i.urgency} onChange={(v) => set("urgency", v)} options={[["normal", tx("pricing.opt.standard", "Standard")], ["h48", tx("pricing.opt.h48", "Within 48 hours")], ["express", tx("pricing.opt.h24", "Within 24 hours")]]} />
              </Q>
              <Q label={tx("pricing.q.revisions", "Extra rounds of revisions")} hint={tx("pricing.hint.revisions", "Two rounds are included. Each extra round is added here.")}>
                <Step value={i.extraRevisions} min={0} less={less} more={more} onChange={(v) => set("extraRevisions", v)} />
              </Q>
            </Group>
          </div>

          {/* Live estimate: sticky on wide screens, under the questions on phones. */}
          <aside id="estimate" className="estimate-card lg:sticky lg:top-[104px] border border-[rgba(201,169,98,0.55)] p-6 md:p-8 min-w-0">
            <div className="print-only font-display text-[22px] mb-4">Arlix · arlix.art</div>
            <div className="label">{tx("pricing.estimatedPrice", "Estimated price")}</div>
            <div className="font-display text-[36px] md:text-[44px] leading-[1.05] mt-3">{eur(r.min, locale)}<span className="text-[#9B948B]"> {toWord} </span>{eur(r.max, locale)}</div>
            <p className="text-[14px] leading-[1.5] text-[#ADA59B] mt-3 mb-0">{notice}</p>
            <div className="gold-rule my-6" />
            <div className="label mb-3">{tx("pricing.yourChoices", "Your choices")}</div>
            <ul className="m-0 p-0 list-none flex flex-col gap-2 text-[15px] leading-[1.45] text-[#E4DED5]">
              {picked.map((line) => (
                <li key={line} className="relative pl-5">
                  <span aria-hidden="true" className="absolute left-0 top-[0.6em] h-[5px] w-[5px] rounded-full bg-[#C9A962]" />{line}
                </li>
              ))}
            </ul>
            <div className="gold-rule my-6" />
            <ul className="m-0 p-0 list-none flex flex-col gap-1.5 text-[13px] leading-[1.5] text-[#9B948B]">
              {terms.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <div className="no-print mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={copy} className="frame-btn !min-w-0 flex-1">{copied ? tx("pricing.copied", "Copied") : tx("pricing.copyEstimate", "Copy estimate")}</button>
              <button type="button" onClick={() => window.print()} className="frame-btn !min-w-0 flex-1">{tx("pricing.downloadPdf", "Download PDF")}</button>
            </div>
            <Link href={href("/contact")} className="no-print frame-btn w-full mt-3 !border-[#C9A962] !text-[#C9A962]">{tx("pricing.startProject", "Start a project")}</Link>
          </aside>
        </div>

        <section className="no-print mt-16 md:mt-24 border-t border-[rgba(242,237,230,0.12)] pt-10 md:pt-14 grid grid-cols-1 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-6 md:gap-16 items-center">
          <div>
            <h2 className="font-display font-normal text-[30px] md:text-[40px] leading-[1.1]">{tx("pricing.monthlyTitle", "Monthly content support")}</h2>
            <div className="gold-rule mt-4 mb-5" />
            <p className="text-[16px] md:text-[18px] leading-[1.55] text-[#E4DED5] max-w-2xl">{tx("pricing.monthlyBody", "Carousels, short reels and UGC for your brand every month, in one consistent style.")}</p>
          </div>
          <div className="md:text-right">
            <div className="font-display text-[34px] md:text-[44px] leading-[1.05]">{locale === "en" ? "from €2,000" : `${t("pricing.from")} ${eur(2000, locale)}`}</div>
            <div className="text-[14px] tracking-[0.12em] uppercase text-[#9B948B] mt-1">{tx("pricing.perMonth", "per month")}</div>
          </div>
        </section>
      </div>

      {/* Phones: the price stays in sight while answering; a tap jumps to the full estimate. */}
      <a href="#estimate" className="no-print lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-[#0B0B0C] border-t border-[rgba(201,169,98,0.6)]">
        <span className="label !text-[11px]">{tx("pricing.estimated", "Estimated")}</span>
        <span className="font-display text-[22px] leading-none text-[#F2EDE6]">{range}</span>
      </a>
    </main>
  );
}
