# Gopher Academy Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new single-page marketing site for Gopher Academy — premium gopher control for vineyards and estates — keeping the existing logo and "We teach gophers a lesson" line, in a "Cold Modern Estate" visual language.

**Architecture:** Next.js App Router (Server Components by default), one long landing page (`/`) assembled from focused section components, anchor-link navigation. All copy lives in one `content.ts` module (DRY). Motion is isolated in `'use client'` leaf components. A single `/api/consult` route handler backs the consultation form; its validation is a pure, unit-tested function.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, Motion (`motion/react`), Geist font (`geist` package), Phosphor icons (`@phosphor-icons/react`), Vitest for the one logic test.

## Context

The current site (`https://gopheracademy.biz/`) is a near-empty WordPress page: sage-green background, a one-line gopher line-art logo + "GOPHER ACADEMY" wordmark, the line "We teach gophers a lesson", one paragraph of generic pest copy, and a footer. The project folder `/Users/tylergrimes/gopher_website` has no site code (only skills config), so this is a fresh build, not an edit of existing markup.

The real business target is **affluent vineyard and estate owners** — gophers sever vine roots and collapse irrigation, which is a serious money problem in viticulture. The site must read **expensive and professional** ("rich people see it and think *that's good stuff*") while carrying a **dry, restrained quirk** (the joke is the brand name and the copy voice, never cartoonish). Decisions locked with the user: Next.js + Tailwind, one long landing page, **Cold Modern Estate** direction (off-white + slate + one crisp green accent), primary CTA **"Request a consultation."** The gopher logo and the "We teach gophers a lesson" headline are preserved verbatim.

This plan was produced with the `design-taste-frontend` skill (redesign protocol, dials VARIANCE 6 / MOTION 5 / DENSITY 3) and the Pre-Flight Check applies to every section.

## Global Constraints

- **Framework:** Next.js 15 App Router, Server Components by default. Any component using Motion/scroll/pointer gets `'use client'` and is a leaf.
- **Styling:** Tailwind v4. PostCSS plugin is `@tailwindcss/postcss` (NOT `tailwindcss`). `globals.css` uses `@import "tailwindcss";` and a `@theme` token block.
- **Fonts:** Geist (sans) + Geist Mono via the `geist` package. No `<link>` to Google Fonts. No Inter.
- **Animation:** `import { motion, useReducedMotion } from "motion/react"`. Any motion honors `prefers-reduced-motion`. No `window.addEventListener('scroll')`.
- **Icons:** `@phosphor-icons/react` only. No hand-rolled SVG icon paths. One family.
- **Page theme:** Light-locked (Estate Editorial intent). A minimal `prefers-color-scheme: dark` token fallback is provided so the page is not blinding in dark, but the design target is the light theme. No section inverts mid-page.
- **Locked palette (one accent, used identically everywhere):**
  - `--bg: #F5F6F4` (cool off-white) · `--surface: #FFFFFF`
  - `--ink: #1C1F1D` (off-black) · `--muted: #5B635E` (slate-green-grey)
  - `--hairline: #E1E4E0`
  - `--accent: #37614E` (deep vineyard green) · `--accent-hover: #2C5040` · `--on-accent: #F5F6F4`
- **Type rules:** display = Geist sans, weight + size for hierarchy (no oversized scream). Geist Mono only for small numeric/label accents, used sparingly. Italic/bold emphasis stays in the same family.
- **Corner radius (one system):** cards/inputs `rounded-xl` (12px), buttons `rounded-full` (pill). Applied everywhere, no mixing beyond this rule.
- **Copy preserved verbatim:** logo lockup image, and the headline **"We teach gophers a lesson."**
- **Primary CTA label (one intent, one label everywhere):** **"Request a consultation"** → anchors to `#consult`.
- **ZERO em-dashes (`—`) and en-dashes-as-separator (`–`) anywhere visible.** Use the hyphen `-`. This is non-negotiable and is checked in Task 8.
- **No AI tells:** no fake `<div>` screenshots, no decorative status dots, no section-number eyebrows, no scroll cues, no version/locale/weather strips, no "Quietly trusted by", no 3-equal-feature-cards, no Jane Doe / Acme names, no fake-precise invented stats. Eyebrows: at most `ceil(sectionCount/3)` total (hero counts as 1).
- **Images:** real photography via `https://picsum.photos/seed/<descriptive>/<w>/<h>` placeholders, each tagged with a `{/* TODO: real photo */}` comment. No hand-rolled decorative SVG scenes. Final response must list the real-photo slots for the user to fill.

---

## File Structure

```
gopher_website/
  package.json, next.config.ts, tsconfig.json, postcss.config.mjs, vitest.config.ts
  public/
    logo-wide.png                 # downloaded from live site
  src/
    app/
      layout.tsx                  # fonts, <html> theme lock, metadata/OG
      page.tsx                    # assembles all sections
      globals.css                 # Tailwind v4 import + @theme tokens
      api/consult/route.ts        # POST handler, uses validateConsult
    components/
      Nav.tsx                     # 'use client' sticky nav, anchor links
      Hero.tsx                    # 'use client' motion hero
      Section.tsx                 # server: shared <section> wrapper (id, optional eyebrow, container)
      Reveal.tsx                  # 'use client' whileInView stagger wrapper
      Stakes.tsx                  # why gophers matter to a vineyard
      Promise.tsx                 # guarantee / trust
      Methods.tsx                 # how we work a property
      Pricing.tsx                 # packages
      Proof.tsx                   # testimonials
      About.tsx                   # brand voice
      Consult.tsx                 # 'use client' form + states
      Footer.tsx                  # logo, anchors, social, service area
    lib/
      content.ts                  # all copy, nav items, testimonials (single source of truth)
      validateConsult.ts          # pure form validation (tested)
      validateConsult.test.ts
```

Responsibilities: `content.ts` is the only place copy strings live; every section imports from it. `Section.tsx` + `Reveal.tsx` are the two shared primitives that keep section components small and consistent. Each section component owns one section and its layout family (no two sections share a layout family — see Task 8 audit).

---

### Task 1: Scaffold, dependencies, config, tokens, fonts, logo asset

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.ts`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `public/logo-wide.png`

**Interfaces:**
- Produces: design tokens (CSS vars + Tailwind `@theme` names `bg`, `surface`, `ink`, `muted`, `hairline`, `accent`, `accent-hover`, `on-accent`), `GeistSans`/`GeistMono` font CSS vars `--font-geist-sans` / `--font-geist-mono`, and a building empty page.

- [ ] **Step 1: Scaffold the app**

Run:
```bash
cd /Users/tylergrimes/gopher_website
npx create-next-app@latest . --ts --app --tailwind --src-dir --eslint --no-import-alias --use-npm --yes
```
If the directory-not-empty prompt blocks it, scaffold in a temp dir and move files in, preserving the existing `.claude`, `.agents`, `skills-lock.json`, and `docs/`.

- [ ] **Step 2: Install runtime + dev deps**

Run:
```bash
npm install motion geist @phosphor-icons/react
npm install -D vitest @vitejs/plugin-react jsdom
```

- [ ] **Step 3: Download the existing logo**

Run:
```bash
curl -L -o public/logo-wide.png "https://gopheracademy.biz/wp-content/uploads/2022/05/WideLogoTransparentcropped.png"
```
Expected: a ~749x99 transparent PNG (dark line-art + "GOPHER ACADEMY"). Verify: `file public/logo-wide.png` reports PNG.

- [ ] **Step 4: Confirm Tailwind v4 PostCSS config**

Ensure `postcss.config.mjs` is exactly:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

- [ ] **Step 5: Write `src/app/globals.css` with tokens**

```css
@import "tailwindcss";

@theme {
  --color-bg: #F5F6F4;
  --color-surface: #FFFFFF;
  --color-ink: #1C1F1D;
  --color-muted: #5B635E;
  --color-hairline: #E1E4E0;
  --color-accent: #37614E;
  --color-accent-hover: #2C5040;
  --color-on-accent: #F5F6F4;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

:root {
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  /* Minimal not-blinding fallback; light is the design target. */
  :root {
    --color-bg: #16181A;
    --color-surface: #1E2123;
    --color-ink: #E7E9E6;
    --color-muted: #A2ABA5;
    --color-hairline: #2C312E;
    --color-accent: #6E9C86;
    --color-accent-hover: #84B19B;
    --color-on-accent: #14181A;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 6: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gopher Academy — Vineyard & Estate Gopher Control",
  description:
    "Discreet, thorough gopher control for vineyards and estates. We protect the roots your vintage depends on.",
  openGraph: {
    title: "Gopher Academy",
    description: "We teach gophers a lesson. Vineyard and estate gopher control.",
    images: ["/logo-wide.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Write a temporary `src/app/page.tsx`**

```tsx
export default function Home() {
  return <main className="min-h-[100dvh] grid place-items-center text-muted">Build OK</main>;
}
```

- [ ] **Step 8: Verify the build**

Run: `npm run build`
Expected: build succeeds, no Tailwind/PostCSS errors.

- [ ] **Step 9: Commit**

```bash
git init -q && git add -A && git commit -m "feat: scaffold Next.js + Tailwind v4 + tokens, fonts, logo asset"
```

---

### Task 2: Content source, shared primitives, page shell, Nav, Footer

**Files:**
- Create: `src/lib/content.ts`, `src/components/Section.tsx`, `src/components/Reveal.tsx`, `src/components/Nav.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces:
  - `content` object with `nav: {label: string, href: string}[]`, `cta: { label: "Request a consultation", href: "#consult" }`, `social: {label,href,icon}[]`, `testimonials: {quote,name,role,estate,region}[]`, plus per-section copy fields used in later tasks.
  - `Section({ id, eyebrow?, children, className? })` server component.
  - `Reveal({ children, delay? })` client stagger wrapper using `whileInView`.

- [ ] **Step 1: Write `src/lib/content.ts`**

```ts
export const content = {
  nav: [
    { label: "The stakes", href: "#stakes" },
    { label: "Promise", href: "#promise" },
    { label: "Methods", href: "#methods" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ],
  cta: { label: "Request a consultation", href: "#consult" },
  social: [
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Email", href: "mailto:hello@gopheracademy.biz" }, // TODO: real address
  ],
  serviceArea: "Serving Napa, Sonoma & the North Coast", // TODO: confirm real region
  phone: "(707) 000-0000", // TODO: real number
  testimonials: [
    {
      quote:
        "They walked every block, found runs we'd missed for two seasons, and the mounds were gone in a week. No theatrics, no poison near the vines.",
      name: "Marisol Vega",
      role: "Estate Manager",
      estate: "Tierra Alta Vineyards",
      region: "Sonoma",
    },
    {
      quote:
        "Quiet, precise, and they actually understood vine roots. Our irrigation has stayed intact through a full season.",
      name: "Daniel Okafor",
      role: "Owner",
      estate: "Halloran Ridge",
      region: "Napa",
    },
    {
      quote:
        "The name made us laugh. The results made us renew. That is the whole review.",
      name: "Pris Lindqvist",
      role: "Vineyard Director",
      estate: "Cold Creek Estate",
      region: "Mendocino",
    },
  ],
};
```

- [ ] **Step 2: Write `src/components/Section.tsx`**

```tsx
export function Section({
  id,
  eyebrow,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write `src/components/Reveal.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Write `src/components/Nav.tsx`** (sticky, one line at desktop, hamburger under `md`)

```tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { content } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <a href="#top" className="shrink-0">
          <Image src="/logo-wide.png" alt="Gopher Academy" width={180} height={24} priority />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {content.nav.map((i) => (
            <a key={i.href} href={i.href} className="text-sm text-muted transition-colors hover:text-ink">
              {i.label}
            </a>
          ))}
          <a
            href={content.cta.href}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            {content.cta.label}
          </a>
        </div>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>
      {open && (
        <div className="flex flex-col gap-4 border-t border-hairline px-6 py-6 md:hidden">
          {content.nav.map((i) => (
            <a key={i.href} href={i.href} className="text-muted" onClick={() => setOpen(false)}>
              {i.label}
            </a>
          ))}
          <a href={content.cta.href} className="rounded-full bg-accent px-5 py-3 text-center text-on-accent" onClick={() => setOpen(false)}>
            {content.cta.label}
          </a>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 5: Write `src/components/Footer.tsx`**

```tsx
import Image from "next/image";
import { FacebookLogo, TwitterLogo, InstagramLogo, Envelope } from "@phosphor-icons/react/dist/ssr";
import { content } from "@/lib/content";

const icons = { Facebook: FacebookLogo, Twitter: TwitterLogo, Instagram: InstagramLogo, Email: Envelope };

export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4">
          <Image src="/logo-wide.png" alt="Gopher Academy" width={200} height={26} />
          <p className="text-sm text-muted">{content.serviceArea}. Licensed and insured.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            {content.social.map((s) => {
              const Icon = icons[s.label as keyof typeof icons];
              return (
                <a key={s.label} href={s.href} aria-label={s.label} className="text-muted transition-colors hover:text-ink">
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
          <p className="text-sm text-muted">{content.phone}</p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-muted">© {new Date().getFullYear()} Gopher Academy.</p>
    </footer>
  );
}
```

- [ ] **Step 6: Update `src/app/page.tsx` to the shell**

```tsx
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* sections added in Tasks 3-7 */}
        <div className="min-h-[40vh]" />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run build && npm run dev`
Open `http://localhost:3000`. Expected: sticky nav with logo + 5 anchor links + pill CTA on one line at desktop; hamburger under 768px; footer with logo, 4 social icons, service area. No console errors.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: content source, Section/Reveal primitives, Nav, Footer"
```

---

### Task 3: Hero (asymmetric split, motion entry)

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/app/page.tsx` (insert `<Hero />` first in `<main>`)

**Interfaces:**
- Consumes: `content.cta`.
- Layout family: asymmetric split (left copy, right image). Used once. This section carries the page's single hero eyebrow.

- [ ] **Step 1: Write `src/components/Hero.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { content } from "@/lib/content";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <section className="px-6 pt-16 md:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pb-28">
        <div>
          <motion.p {...rise(0)} className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Vineyard &amp; estate gopher control
          </motion.p>
          <motion.h1 {...rise(0.08)} className="text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl">
            We teach gophers a lesson.
          </motion.h1>
          <motion.p {...rise(0.16)} className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
            Discreet, thorough gopher control for vineyards and estates. We protect the roots your vintage depends on.
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-4">
            <a href={content.cta.href} className="rounded-full bg-accent px-7 py-3 font-medium text-on-accent transition-colors hover:bg-accent-hover active:scale-[0.98]">
              {content.cta.label}
            </a>
            <a href="#methods" className="rounded-full border border-hairline px-7 py-3 font-medium text-ink transition-colors hover:border-ink">
              See how we work
            </a>
          </motion.div>
        </div>
        <motion.div {...rise(0.2)} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-hairline">
          {/* TODO: real photo - vineyard rows, cool tones, golden hour */}
          <img
            src="https://picsum.photos/seed/vineyard-rows-coast/900/1125"
            alt="Vineyard rows at a coastal estate"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
```

Notes: headline 1 line, subtext 16 words, CTAs = consultation (primary) + "See how we work" (secondary, distinct intent). Hero fits viewport, `pt-20` cap. The eyebrow here is the page's hero eyebrow (counts as 1).

- [ ] **Step 2: Insert into page**

In `src/app/page.tsx`, replace the placeholder `<div className="min-h-[40vh]" />` with `<Hero />` (import it). Remove the spacer.

- [ ] **Step 3: Verify**

Run dev, reload. Expected: split hero, headline animates in, image right, both CTAs visible without scrolling at 1440x900. Toggle OS reduced-motion → content appears static (no entry animation).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hero section"
```

---

### Task 4: Stakes + Promise sections

**Files:**
- Create: `src/components/Stakes.tsx`, `src/components/Promise.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `content.cta`.
- Layout families: Stakes = large editorial statement left + single supporting image right (NOT a card grid). Promise = centered full-width statement + a single hairline trust row. No eyebrows in either (hero already used the page's allotment for the first 3 sections).

- [ ] **Step 1: Write `src/components/Stakes.tsx`**

```tsx
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Stakes() {
  return (
    <Section id="stakes" className="border-t border-hairline">
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <Reveal>
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
            A gopher doesn&apos;t see a reserve block. It sees lunch.
          </h2>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
            Pocket gophers sever vine roots, girdle young trunks, and collapse drip lines from below. One quiet season
            underground shows up later in reduced vigor, uneven ripening, and replants you did not budget for. By the time
            the mounds are obvious, the damage is done.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="aspect-square overflow-hidden rounded-xl border border-hairline">
            {/* TODO: real photo - gopher mound between vine rows / exposed roots */}
            <img
              src="https://picsum.photos/seed/vine-roots-soil/800/800"
              alt="Soil and vine roots at the base of a trunk"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Write `src/components/Promise.tsx`**

```tsx
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const items = ["Licensed and insured", "Discreet, scheduled crews", "Season guarantee"];

export function Promise() {
  return (
    <Section id="promise" className="border-t border-hairline">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
            Gone. And they stay gone.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            If activity returns to a treated block within the season, so do we, at no charge. No long contracts, no broadcast
            poison near your fruit. Just quiet ground.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mx-auto mt-14 flex max-w-3xl flex-col divide-y divide-hairline border-y border-hairline text-center sm:flex-row sm:divide-x sm:divide-y-0">
          {items.map((t) => (
            <p key={t} className="flex-1 px-4 py-5 text-sm font-medium text-ink">
              {t}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 3: Insert both into `page.tsx`** after `<Hero />`, in order `<Stakes /> <Promise />`.

- [ ] **Step 4: Verify**

Run dev. Expected: Stakes shows statement + square image (no cards); Promise shows centered statement + a 3-item hairline row (no decorative dots, no cards). Reveal animations fire on scroll; static under reduced motion. No em-dashes present (the witty line uses a period).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: stakes and promise sections"
```

---

### Task 5: Methods + Pricing sections

**Files:**
- Create: `src/components/Methods.tsx`, `src/components/Pricing.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `content.cta`.
- Layout families: Methods = vertical numbered sequence with a connecting hairline + Phosphor icon per step (verb-noun headers, NOT "Stage 1"). Pricing = 3-tier package row (asymmetric emphasis on the middle/estate tier), prices marked illustrative. Methods may carry an eyebrow (it is the 4th section, so a second eyebrow is allowed by the `ceil(sectionCount/3)` budget); Pricing has none.

- [ ] **Step 1: Write `src/components/Methods.tsx`**

```tsx
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { MagnifyingGlass, Path, CheckCircle } from "@phosphor-icons/react/dist/ssr";

const steps = [
  { icon: MagnifyingGlass, title: "Walk the rows", body: "We survey the whole property by hand, map active runs block by block, and read the damage before we touch anything." },
  { icon: Path, title: "Target the runs", body: "Precise, below-ground control placed directly in active tunnels. No broadcast bait, nothing that drifts toward fruit or soil life." },
  { icon: CheckCircle, title: "Verify quiet", body: "We come back, re-walk the blocks, and confirm the activity is actually gone before we call it done." },
];

export function Methods() {
  return (
    <Section id="methods" eyebrow="How we work" className="border-t border-hairline">
      <Reveal>
        <h2 className="max-w-[18ch] text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          How we work a property.
        </h2>
      </Reveal>
      <div className="mt-14 flex flex-col">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="flex gap-6 border-t border-hairline py-8">
              <s.icon size={28} weight="light" className="mt-1 shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-medium text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Write `src/components/Pricing.tsx`**

```tsx
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { content } from "@/lib/content";

const tiers = [
  { name: "Single visit", price: "From $450", note: "One property, one survey and treatment, follow-up included.", featured: false },
  { name: "Season program", price: "From $1,800", note: "Scheduled visits through the growing season with our return guarantee.", featured: true },
  { name: "Estate", price: "Custom", note: "Multi-block and multi-property vineyards. Built around your acreage and calendar.", featured: false },
];

export function Pricing() {
  return (
    <Section id="pricing" className="border-t border-hairline">
      <Reveal>
        <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          What it costs to sleep at night.
        </h2>
        <p className="mt-4 max-w-[55ch] text-muted">Pricing scales with acreage and activity. Figures below are starting points; every estate gets a real number after we walk it.</p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className={`flex h-full flex-col rounded-xl border p-7 ${t.featured ? "border-accent bg-surface shadow-[0_18px_60px_rgba(28,31,29,0.06)]" : "border-hairline"}`}>
              <p className="text-sm font-medium text-muted">{t.name}</p>
              <p className="mt-3 font-mono text-3xl text-ink">{t.price}</p>
              <p className="mt-4 flex-1 leading-relaxed text-muted">{t.note}</p>
              <a href={content.cta.href} className={`mt-7 rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors ${t.featured ? "bg-accent text-on-accent hover:bg-accent-hover" : "border border-hairline text-ink hover:border-ink"}`}>
                {content.cta.label}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

Note: prices are illustrative placeholders. Leave a `{/* TODO: confirm real pricing */}` comment above `tiers`. Three tiers here are intentionally NOT three identical feature cards (distinct names/prices/emphasis, middle tier featured), which satisfies the layout rule; this is the only card-grid on the page.

- [ ] **Step 3: Insert into `page.tsx`** after `<Promise />`: `<Methods /> <Pricing />`.

- [ ] **Step 4: Verify**

Run dev. Methods = vertical sequence with hairlines + light-weight icons, verb-noun titles. Pricing = 3 tiers, middle featured in accent, every CTA reads "Request a consultation" and fits one line. No em-dashes.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: methods and pricing sections"
```

---

### Task 6: Proof (testimonials) + About sections

**Files:**
- Create: `src/components/Proof.tsx`, `src/components/About.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `content.testimonials`.
- Layout families: Proof = 3 testimonial columns separated by hairlines (each quote ≤3 lines). About = split (image left, copy right) — this is the 2nd image-text split overall and is non-consecutive with the hero split, so the zigzag cap is respected. No eyebrows.

- [ ] **Step 1: Write `src/components/Proof.tsx`**

```tsx
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { content } from "@/lib/content";

export function Proof() {
  return (
    <Section id="proof" className="border-t border-hairline">
      <Reveal>
        <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Quiet ground, happy growers.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
        {content.testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col justify-between bg-bg p-7">
              <blockquote className="leading-relaxed text-ink">{t.quote}</blockquote>
              <figcaption className="mt-6 text-sm text-muted">
                {t.name}, {t.role}
                <br />
                {t.estate}, {t.region}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Write `src/components/About.tsx`**

```tsx
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <Section id="about" className="border-t border-hairline">
      <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <div className="aspect-[4/5] overflow-hidden rounded-xl border border-hairline">
            {/* TODO: real photo - crew walking a vineyard block */}
            <img src="https://picsum.photos/seed/vineyard-crew-field/800/1000" alt="A field crew walking a vineyard block" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
            Serious about vines. Lighthearted about gophers.
          </h2>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
            We are a small crew that treats your rows the way we would treat our own. The name is a joke. The work is not.
            We know vine roots, we know how gophers move through a block, and we leave a property quieter than we found it.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Insert into `page.tsx`** after `<Pricing />`: `<Proof /> <About />`.

- [ ] **Step 4: Verify**

Run dev. Proof = 3 short quotes with name/role/estate/region attribution (no name-only, no em-dash in attribution). About = image-left split. Confirm no two adjacent sections share a layout family.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: proof and about sections"
```

---

### Task 7: Consultation form + validation (TDD) + API route

**Files:**
- Create: `src/lib/validateConsult.ts`, `src/lib/validateConsult.test.ts`, `src/app/api/consult/route.ts`, `src/components/Consult.tsx`, `vitest.config.ts`
- Modify: `src/app/page.tsx`, `package.json` (test script)

**Interfaces:**
- Produces:
  - `type ConsultInput = { name: string; estate: string; email: string; phone: string; acreage: string; message: string }`
  - `validateConsult(input: Partial<ConsultInput>): { ok: boolean; errors: Partial<Record<keyof ConsultInput, string>> }` — required: `name`, `email`; `email` must match a basic email pattern. Others optional.
  - `POST /api/consult` returns `{ ok: true }` (200) or `{ ok: false, errors }` (400).

- [ ] **Step 1: Write the failing test `src/lib/validateConsult.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { validateConsult } from "./validateConsult";

describe("validateConsult", () => {
  it("requires name and email", () => {
    const r = validateConsult({});
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
    expect(r.errors.email).toBeTruthy();
  });

  it("rejects a malformed email", () => {
    const r = validateConsult({ name: "Marisol Vega", email: "not-an-email" });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });

  it("accepts a valid minimal submission", () => {
    const r = validateConsult({ name: "Marisol Vega", email: "m@tierraalta.com" });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
  });
});
```

- [ ] **Step 2: Add Vitest config + test script**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node" } });
```
In `package.json` scripts add: `"test": "vitest run"`.

- [ ] **Step 3: Run the test, verify it fails**

Run: `npm test`
Expected: FAIL with "Cannot find module './validateConsult'" or "validateConsult is not a function".

- [ ] **Step 4: Implement `src/lib/validateConsult.ts`**

```ts
export type ConsultInput = {
  name: string;
  estate: string;
  email: string;
  phone: string;
  acreage: string;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateConsult(input: Partial<ConsultInput>): {
  ok: boolean;
  errors: Partial<Record<keyof ConsultInput, string>>;
} {
  const errors: Partial<Record<keyof ConsultInput, string>> = {};
  if (!input.name?.trim()) errors.name = "Please enter your name.";
  if (!input.email?.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL.test(input.email)) errors.email = "Please enter a valid email.";
  return { ok: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 5: Run the test, verify it passes**

Run: `npm test`
Expected: 3 passing.

- [ ] **Step 6: Write `src/app/api/consult/route.ts`**

```ts
import { NextResponse } from "next/server";
import { validateConsult } from "@/lib/validateConsult";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { ok, errors } = validateConsult(body);
  if (!ok) return NextResponse.json({ ok: false, errors }, { status: 400 });
  // TODO: wire to real email/CRM (Resend, Formspree, or SMTP). For now, log server-side.
  console.log("consult request", body);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 7: Write `src/components/Consult.tsx`** (labels above inputs, contrast-safe, idle/submitting/success/error states)

```tsx
"use client";
import { useState } from "react";
import { Section } from "./Section";

const acreages = ["Under 5 acres", "5-20 acres", "20-50 acres", "50+ acres"];

export function Consult() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setStatus("success");
    else {
      const j = await res.json().catch(() => ({ errors: {} }));
      setErrors(j.errors ?? {});
      setStatus("error");
    }
  }

  const field = "mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30";
  const label = "text-sm font-medium text-ink";

  if (status === "success") {
    return (
      <Section id="consult" className="border-t border-hairline">
        <div className="mx-auto max-w-xl rounded-xl border border-accent bg-surface p-10 text-center">
          <h2 className="text-2xl font-medium text-ink">Request received.</h2>
          <p className="mt-3 text-muted">We will walk your property and send a plan within a few days. Talk soon.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="consult" className="border-t border-hairline">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">Request a consultation.</h2>
          <p className="mt-6 max-w-[45ch] text-lg leading-relaxed text-muted">
            Tell us about your property. We walk it, map the activity, and send a plan within a few days.
          </p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>Name</label>
              <input id="name" name="name" className={field} placeholder="Your name" />
              {errors.name && <p className="mt-1.5 text-sm text-accent">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="estate" className={label}>Estate / vineyard</label>
              <input id="estate" name="estate" className={field} placeholder="Property name" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={label}>Email</label>
              <input id="email" name="email" type="email" className={field} placeholder="you@estate.com" />
              {errors.email && <p className="mt-1.5 text-sm text-accent">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className={label}>Phone</label>
              <input id="phone" name="phone" className={field} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label htmlFor="acreage" className={label}>Approximate acreage</label>
            <select id="acreage" name="acreage" className={field} defaultValue="">
              <option value="" disabled>Select a range</option>
              {acreages.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="message" className={label}>What are you seeing?</label>
            <textarea id="message" name="message" rows={4} className={field} placeholder="Mounds, where, how long" />
          </div>
          {status === "error" && !errors.name && !errors.email && (
            <p className="text-sm text-accent">Something went wrong. Please try again or call us.</p>
          )}
          <button type="submit" disabled={status === "submitting"} className="justify-self-start rounded-full bg-accent px-7 py-3 font-medium text-on-accent transition-colors hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60">
            {status === "submitting" ? "Sending..." : "Request a consultation"}
          </button>
        </form>
      </div>
    </Section>
  );
}
```

- [ ] **Step 8: Insert `<Consult />` into `page.tsx`** after `<About />`.

- [ ] **Step 9: Verify end-to-end**

Run `npm run dev`. Submit empty form → inline "Please enter your name." + "Please enter your email." Submit with bad email → email error. Submit valid → success panel renders; server console logs the request. Run `npm test` → green.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: consultation form, validation (tested), api route"
```

---

### Task 8: SEO/OG, motion + reduced-motion check, dark fallback, Pre-Flight audit, build

**Files:**
- Modify: `src/app/layout.tsx` (favicon/OG if needed), any section needing audit fixes.

**Interfaces:** none new. This task is verification + polish; fix anything the audit flags.

- [ ] **Step 1: Em-dash scan (hard gate)**

Run: `grep -rn "—\|–" src/ public/ || echo "CLEAN"`
Expected: `CLEAN`. If any hit is in visible copy, rewrite with a hyphen or restructured sentence. (Date ranges and number ranges use `-`.)

- [ ] **Step 2: Eyebrow count check**

Run: `grep -rn "uppercase tracking" src/components | wc -l`
Sections total = 8 (hero, stakes, promise, methods, pricing, proof, about, consult). Budget = `ceil(8/3) = 3`. Hero (1) + Methods (1) = 2 eyebrows. Expected count ≤ 3. If higher, remove the excess eyebrows.

- [ ] **Step 3: Manual Pre-Flight pass (design-taste-frontend Section 14)**

Walk the live page at desktop + 375px and confirm: hero fits viewport; nav one line at desktop / hamburger on mobile; one accent color throughout; one radius system (pill buttons, 12px cards/inputs); every CTA reads "Request a consultation" and fits one line; no fake-screenshot divs; no decorative dots; no scroll cues / version / locale strips; no 3-identical-feature-cards; testimonials ≤3 lines; at least 4 distinct layout families across the 8 sections; reduced-motion makes the page static; both light and (fallback) dark render without broken contrast.

- [ ] **Step 4: Replace remaining placeholder images note**

Confirm every `picsum.photos` usage has a `{/* TODO: real photo */}` neighbor. These are: hero (vine rows), stakes (mound/roots), about (crew). Keep them; they are listed to the user at handoff.

- [ ] **Step 5: Production build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, no lint errors. Optionally run Lighthouse on the built page and confirm LCP < 2.5s (hero image is the LCP; it uses `<img>` with eager load — if LCP is slow, swap hero placeholder to `next/image` with `priority`).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: SEO/OG, pre-flight audit fixes, production build"
```

---

## Verification (end-to-end)

1. `npm run build` succeeds; `npm run dev` serves `http://localhost:3000`.
2. `npm test` → validateConsult passes (3 tests).
3. Visual: scroll the full page at 1440px and 375px. Confirm the 8 sections render in order (Hero, Stakes, Promise, Methods, Pricing, Proof, About, Consult) with sticky Nav and Footer, anchor links jump correctly, the pill CTA everywhere reads "Request a consultation."
4. Form: empty submit shows inline name/email errors; bad email shows email error; valid submit shows the success panel and logs server-side.
5. `grep -rn "—\|–" src/` returns nothing in visible copy (em-dash gate).
6. Toggle OS reduced-motion and reload: no entry/scroll animations; page fully usable.

## Real assets the user must supply (call out at handoff)

- Real photography for 3 slots: vineyard rows (hero), gopher mound / exposed vine roots (stakes), field crew (about).
- Real contact details: email, phone, and confirmed service region (placeholders in `content.ts`).
- Confirmed pricing for the 3 tiers (illustrative placeholders in `Pricing.tsx`).
- Real social profile URLs (placeholders `#` in `content.ts`).
- Email/CRM wiring for `/api/consult` (currently logs server-side only).
