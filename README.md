# Aivorraa Website

Production website for Aivorraa — built to the PRD v3.0 specification (19 September 2026).

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · server-rendered, statically generated.

---

## Why this stack

PRD §20 recommends Next.js with TypeScript on Hostinger, and PRD §2 Finding 1 is the reason: **only the homepage of the old site was indexed by Google.** A client-rendered SPA ships an empty HTML shell, which Google indexes more slowly and less reliably — so server rendering was not optional here.

Every page in this build is prerendered to complete static HTML at build time. There is no runtime rendering cost, and a crawler gets the full content on the first request without executing JavaScript.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values you have
npm run dev                   # http://localhost:3000
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Runs the SEO guard, then builds. **Fails the build on a PRD violation.** |
| `npm start` | Serves the production build |
| `npm run check:seo` | Title/description limits, service completeness, prohibited schema |
| `npm run check:responsive` | Real-browser check: 12 pages × 7 widths, overflow, H1s, labels |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | Everything above except the browser check |

`check:responsive` needs the production server running and uses your installed Chrome
(no Chromium download). Run it in a second terminal:

```bash
npm run build && npm start
npm run check:responsive          # or BASE_URL=https://www.aivorraa.com npm run check:responsive
```

---

## ⚠ Before this goes live

### 1. Fill in the business facts — the single highest-value edit

Open **`src/lib/site-config.ts`**. Everything the PRD §29 lists as "facts blocking specific pages" is a `null` in that file, and anything null is **omitted from the page and from the structured data** rather than guessed at.

| Field | Why it matters |
|---|---|
| `SITE.legalName` | Organization schema `legalName`, the footer, the about page |
| `ORGANISATION.foundingDate` | Organization schema `foundingDate` — a real entity signal |
| `CONTACT.phone` / `whatsapp` | Until set, no phone or WhatsApp link renders anywhere |
| `CONTACT.address` | **Gates LocalBusiness schema entirely**, and decides whether Tier 2 local keywords are viable at all (PRD §17) |
| `ORGANISATION.gstin` | Footer company details |

Filling one field publishes it everywhere it belongs at once — page copy, footer, Organization, LocalBusiness and Person schema. That is the whole point of the file.

### 2. Verify the LinkedIn company page, then enable it

`SOCIAL_PROFILES` in the same file has LinkedIn at `verified: false`. Only verified profiles reach the `sameAs` array, because PRD §16.1 is explicit that pointing at a profile that does not exist *weakens* the entity signal. The X/Twitter entry is deliberately absent for that reason and should not be re-added.

### 3. Wire up email delivery and test it end to end

Set `RESEND_API_KEY`, `LEAD_INBOX` and `LEAD_FROM`. Until a key is present, the enquiry form **logs the submission server-side and tells the visitor delivery could not be confirmed**, showing the direct email address. It never pretends to have sent something it did not.

PRD §19 requires end-to-end testing: submit the real form, confirm arrival, and check spam placement. Configure SPF, DKIM and DMARC on the sending domain or mail will land in spam.

### 4. Get the legal pages reviewed

`/privacy-policy/` and `/terms/` describe the data flows this codebase actually implements. **Neither has been reviewed by a lawyer.** PRD §24 requires legal review for applicable jurisdictions, and PRD §29 lists it as open. Have a qualified practitioner review both, and confirm the governing jurisdiction, before go-live.

If you later add anything that sets a cookie or processes personal data — a chat widget, heatmaps, a CRM, a remarketing pixel — update the privacy policy **in the same change**. An inaccurate policy is worse than a thin one.

### 5. Decide on the unverified showcase figures

`CLAIMS` in `site-config.ts` holds three switches, all **off**:

- `showRatingStars` — the five-star badge from the design. PRD §29 asks whether it reflects real reviews. Off until it does.
- `showcaseMetrics` — the design's `99%`, `450+` and `2.5M+`. With this off, the hero visual shows capability labels and the site's own published Lighthouse target instead of invented numbers.
- `trustStrip` / `testimonials` — empty. PRD §14: "omit entirely if unverified", "no fabricated endorsements".

Turn one on only when the number behind it is documented and approved. Note that **`AggregateRating` and `Review` schema are never emitted regardless** — PRD §16 prohibits them without real attributable on-page reviews, and `npm run check:seo` fails the build if either appears anywhere in the codebase.

### 6. Add case studies as permissions land

`src/content/portfolio.ts` holds the ten candidate client names from PRD §17 as a work queue, all `published: false`. **None of them render, appear in the sitemap, or leak a client name into the HTML.** `/portfolio/` currently explains the publication standard instead of showing a logo wall.

To publish one: obtain written permission, confirm Aivorraa's exact role, fill in the brief/approach/deliverables, add outcomes **only where documented with a stated source**, then set `permissionOnFile: true` and `published: true`. The portfolio page switches to the filterable grid automatically.

### 7. Run PRD §22 Phase 0

Phase 0 is independent of this build and worth roughly a day. It addresses the finding that only one page was visible to Google, and every other recommendation depends on it:

- [ ] Verify the domain in Google Search Console
- [ ] Submit `https://www.aivorraa.com/sitemap.xml`
- [ ] Use URL Inspection to request indexing for each service page individually
- [ ] Confirm `robots.txt` blocks nothing and no page carries `noindex`
- [ ] Create the Google Business Profile with the exact legal name and address
- [ ] Create or verify the LinkedIn company page and link the website
- [ ] Record the baseline first: indexed page count, position for "aivorraa" in incognito, mobile PageSpeed score, organic sessions over the last 30 days

Record the baseline **before** launching. Without it, no improvement can be proven (PRD §23).

---

## How the codebase is organised

```
src/
  app/
    layout.tsx              Root layout. Emits Organization schema on EVERY page.
    page.tsx                Homepage — PRD §14 content blueprint
    (services)/[service]/   ONE template, eight flat URLs (/web-development/ …)
    services/               Hub linking all eight
    about/ contact/         Highest priority: they carry the entity signals
    portfolio/[slug]/       Only approved case studies are generated
    insights/[slug]/        Articles
    privacy-policy/ terms/  Legal (pending review)
    not-found.tsx           Branded 404, the only noindexed page
    sitemap.ts robots.ts    Generated from the same content modules as the pages
    og.png/ logo.png/       Brand images generated at build time
    actions/lead.ts         Enquiry form server action
  content/
    services.digital.ts     4 services
    services.growth.ts      4 services
    services.ts             Combines them — the single source of truth
    services.nav.ts         Lightweight copy for CLIENT components (see below)
    portfolio.ts            Permission-gated case studies
    insights.ts             Articles
  lib/
    site-config.ts          ★ Business facts. Null = not published.
    schema.ts               Structured data. Cannot emit AggregateRating.
    seo.ts                  buildMetadata — one builder for every page
  components/
    layout/                 Header (mega-menu), Footer
    sections/               Hero visual, shared sections, LeadForm
    ui/                     Buttons, cards, chips, accents
scripts/
  check-seo.mjs             Wired into the build
  check-responsive.mjs      Real-browser responsive + a11y check
```

### Things that will bite you if you don't know them

**Adding a service is a single edit with wide reach.** Add it to `services.digital.ts` or `services.growth.ts` and it appears automatically in the mega-menu, the services hub, the homepage grid, the footer, the sitemap and `Service` structured data. You must also add it to `services.nav.ts` — the build will tell you if you forget. Do not add one without a completed project to reference (PRD §6).

**`services.nav.ts` duplicates data on purpose.** The header, the enquiry form's dropdown and the portfolio filters are client components, and importing `content/services.ts` into any of them bundled the entire catalogue — every FAQ answer, roughly 62KB of prose — into the browser. `check:seo` fails the build if the two ever disagree, so the duplication cannot silently rot.

**`trailingSlash: true` changes how redirects match.** Next normalises the path *before* evaluating redirect rules, so a rule with `source: "/about-us"` never fires. Both sides of every rule in `next.config.ts` carry a trailing slash, which is what makes `/about-us/ → /about/` a single 301 hop.

**Brand images are routes with real file extensions** (`/og.png`, `/logo.png`, `/icon.png`), not Next's `opengraph-image` convention. With `trailingSlash: true` the convention's extensionless paths 308-redirect before serving, and a social crawler or schema consumer should get a 200 on the first request.

**A `"use server"` file may only export async functions.** Exporting a plain object from the action module throws at request time — and the build does not catch it, so the symptom is a form that renders perfectly and silently does nothing. Non-function exports live in `src/lib/lead-form-state.ts`.

**Passing `className` to `Button` does not resolve Tailwind conflicts.** `cx` concatenates; it does not merge. `hidden` passed to a component whose base includes `inline-flex` loses. Wrap the component instead — there is a note in `components/ui/index.tsx`.

---

## Deploying to Hostinger

PRD §20, verified 19 September 2026: Hostinger supports Node.js applications on **Business and Cloud plans**. A lower shared plan requires an upgrade before this route is viable — confirm the current plan first (PRD §29, open decision 3).

Three deployment routes: GitHub integration with automatic builds on push, uploading a zipped project, or the Hostinger Connector linking your IDE directly.

```bash
npm ci
npm run build
npm start        # serves on PORT, default 3000
```

Set the environment variables from `.env.example` in the hosting panel, never in the repository.

### Pre-launch verification (PRD §22 Phase 4)

```bash
npm run verify              # SEO guard, types, lint, build
npm start
npm run check:responsive    # in a second terminal
```

Then confirm by hand:

- [ ] Every URL in the redirect map resolves or 301s correctly
- [ ] Every page has a unique title and description — `check:seo` covers this
- [ ] Every page has exactly one H1 — `check:responsive` covers this
- [ ] All schema validates in Google's [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Sitemap generates and includes every page
- [ ] No `noindex` on any production page except `/404`
- [ ] PageSpeed Insights **mobile** score ≥ 90, measured against the production URL — a local Lighthouse score on a fast machine is misleading
- [ ] Forms deliver to the correct inbox, tested end to end
- [ ] Branded 404 page exists
- [ ] No placeholder text, broken links, unapproved claims or unlicensed imagery

**Take a full backup — files and database together — before any production change.** A files-only backup restores nothing useful (PRD §22, the rollback rule).

### Performance budget (PRD §21)

Measured on this build, gzipped:

| Metric | Budget | Current |
|---|---|---|
| JavaScript | ≤ 200 KB | ~178 KB |
| Total page weight | ≤ 1200 KB | ~269 KB |
| CSS | — | ~10 KB |
| Fonts | — | ~59 KB (4 files, self-hosted) |

The headroom is deliberate and easy to lose. The most common way to lose it is importing a content module into a client component — see the `services.nav.ts` note above.

---

## What is deliberately not here

Interior Design, PMC, Construction, Realty, Ventures and Labs. PRD §6 defers all six until qualifications, licensing, insurance, contracting model and geography are confirmed, and each has at least one completed project to reference. They are absent rather than shown as "Coming Soon", because a visitor clicking through to an empty page loses trust and Google reads a site claiming eleven unrelated verticals as unfocused rather than capable.

The eleven-vertical umbrella architecture is retained as internal brand planning. `/services/` explains the narrower scope honestly instead of hiding it.

Also absent: `/pricing/` and `/careers/`. PRD §13 requires each to become a real page with real content or be removed from navigation. There is no approved pricing and no confirmed open role, so both are removed — a live link to a missing page is a negative signal and a visitor dead end. Re-add them to `components/layout/Footer.tsx` only alongside a real page.

---

## Motion

The motion system lives in **`src/app/motion.css`** plus two small client components in `src/components/motion/`. Together they cost about **0.4 KB of JavaScript and 1.8 KB of CSS** — the effects are CSS-driven, and JavaScript only writes custom properties.

| Effect | Where |
|---|---|
| Cursor spotlight, device tilt | Hero — `HeroPointer` writes `--mx`, `--my`, `--tilt-x`, `--tilt-y` |
| Drifting grid, scan sweep, aurora, watermark | Hero atmosphere layers |
| Staggered entrance | Hero and every `PageHeader` (`.rise` + `.rise-1…7`) |
| Scroll reveals, staggered children | `<Reveal>` / `<Reveal mode="group">` |
| 3D orbit rings | `HeroVisual` |
| Hover lift, button shine, icon scale | `.lift`, `.shine` |
| Headline shimmer, dial draw-in, pulsing dot | `.shimmer`, `.dial-arc`, `.pulse-dot` |

### Three rules it follows

**1. Nothing starts invisible without JavaScript.** Every reveal is gated behind `html.js`, a class set by a blocking inline script in the root layout. If that script never runs, the hiding rules never apply and the page renders fully visible.

This is the important one. PRD §2 Finding 4 records the live site's AOS animation setting the header to `opacity: 0` and breaking it, and Finding 1 is that only the homepage was indexed. Verified with JavaScript disabled: 1,257 words visible, zero hidden text blocks.

**2. Only `transform` and `opacity` animate.** Both composite on the GPU and neither triggers layout, so motion contributes nothing to CLS and stays inside the §21 INP budget.

**3. Everything has a reduced-motion off-switch.** Under `prefers-reduced-motion: reduce`, verified: zero running animations, all content visible.

### Adding motion to a new section

```tsx
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";

<Reveal><SectionHeading … /></Reveal>

<Reveal as="ul" mode="group" className="grid gap-4">
  {items.map((item, i) => (
    <Card as="li" key={item.id} style={staggerStyle(i)} className="lift">…</Card>
  ))}
</Reveal>
```

`staggerStyle` is in its own module because every export of a `"use client"` file is a client reference, and server components call it directly while mapping children.

### Watch out for

- **Off-canvas decoration widens the document.** The aurora blobs sit at `right: -8rem` and the outer orbit ring can reach past the viewport; `.hero-stage` has `overflow: hidden` to clip them. `body { overflow-x: hidden }` hides the scrollbar but does **not** stop the document growing — `npm run check:responsive` is what catches this.
- **`will-change` is used sparingly.** It promotes an element to its own layer and costs memory; it is on the two continuously-animating elements only.

---

## Design

The visual system is taken from the approved UI design: light airy surface with a soft cyan wash, near-black type, electric blue accent, lime primary action, large soft pills and generous whitespace.

Note that this **supersedes** the dark/cinematic purple-and-gold direction recorded in PRD §18 from v2.0. `src/app/globals.css` is the single source of truth for tokens; it is light-only by design, with `color-scheme: light` declared so browsers do not re-theme form controls.

The hero product visual is built entirely from markup, CSS and inline SVG rather than a bitmap — no extra request, no layout shift, sharp on every display. Same for the icon set and the generated brand images.
