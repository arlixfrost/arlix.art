# arlix.art (MVP)

Next.js (App Router) site for **arlix.art** with design tokens v1, three primary routes, and a hero placeholder until real MP4/JPEG assets ship.

## Routes

- `/` — entry hero (ARLIX + ART / TECH)
- `/art` — Art section shell
- `/tech` — Tech section shell
- `/privacy`, `/terms` — legal placeholders (linked from footer + cookie banner)

## Assets

Add to `public/` when ready:

- `hero.mp4` — vertical loop (muted cinematic autoplay on the entry page)
- `hero-poster.jpg` — JPEG poster (then update `HERO_POSTER` in `src/components/home/HomeHero.tsx`)

Until `hero.mp4` exists, the hero falls back to the static poster automatically.

Current placeholder poster: `public/hero-poster.svg`.

## Tokens

CSS variables live in `src/app/globals.css`:

- `--color-bg`, `--color-bg-elevated`
- `--color-text`, `--color-text-muted`
- `--color-accent`, `--color-accent-hover`

## Fonts (MVP)

Google Fonts via `next/font`: **Cormorant Garamond** + **Inter** (`src/app/layout.tsx`).

## Commands

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Breakpoints

Tailwind `md` starts at **769px** to match the spec (mobile ≤768px).
