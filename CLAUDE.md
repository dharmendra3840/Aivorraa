# Working in this repository

Production website for Aivorraa, built to the PRD v3.0 specification. Read `README.md` first — it covers the stack, the scripts and the pre-launch blockers. This file covers the rules that are easy to violate by accident.

## The governing constraint

The old site had **only its homepage indexed by Google** (PRD §2, Finding 1), and Google treated "Aivorraa" as a misspelling of the established "Aivora" brands (PRD §3). Everything in this codebase is shaped by those two facts. Before changing anything that touches URLs, metadata, structured data or internal linking, understand that the entity signal is the point.

## Hard rules — do not violate these

1. **Never publish an unverified fact.** `src/lib/site-config.ts` holds the business facts, and `null` means "not confirmed, so not published". Do not hardcode a legal name, address, phone number, founding year or GSTIN anywhere else, and do not invent one to fill a layout. Components read from that file and render nothing when a value is null. That is intentional.

2. **Never emit `AggregateRating` or `Review` schema.** PRD §16 prohibits it without real, attributable reviews on the page. `src/lib/schema.ts` has no function capable of producing either, and `npm run check:seo` fails the build if the string appears anywhere in shipped code. Do not add one "temporarily".

3. **Never add a service page for a deferred vertical.** Interiors, PMC, Construction, Realty, Ventures and Labs stay off the website until qualifications, licensing, insurance, contracting model and geography are confirmed (PRD §6, §10, §11, §24). A service only ships with a completed project behind it.

4. **Never publish a case study without permission.** `src/content/portfolio.ts` gates on both `published` and `permissionOnFile`. Unapproved entries do not render, are not in the sitemap, and are not reachable by guessing a URL (`dynamicParams = false`).

5. **Never change or remove a live URL without a 301.** PRD §13. Add the mapping to `LEGACY_REDIRECTS` in `next.config.ts`, with a trailing slash on both sides.

6. **Never introduce an unsupported superlative.** "Best in Delhi NCR" was retired (PRD §5) and the SEO guard fails the build if it reappears. Same for the leaked `complyhubindia` admin email, the `interior designer near me` keyword and the nonexistent `x.com/aivorraa` profile.

## Conventions

- **Titles ≤ 60 characters, descriptions ≤ 155, exactly one H1 per page.** Enforced by `npm run check:seo` and `npm run check:responsive`.
- **Every page's metadata comes from `buildMetadata()`** in `src/lib/seo.ts`. Do not hand-roll a `Metadata` object; the builder handles canonicals, robots directives, OG and Twitter tags consistently.
- **Every page except the homepage emits `BreadcrumbList`.** Service pages also emit `Service` and `FAQPage`; articles emit `Article`; `/about/` emits `Person`.
- **Write "Aivorraa" by name rather than "we"** in body copy (PRD §3.7) so the brand name co-occurs with service terms. This is an entity-signal decision, not a style preference.
- **Service pages follow the PRD §15 template exactly**: H1 → who this is for → what you get (with exclusions) → how it works → selected work → pricing model → FAQs → related services. Minimum 800 words; the guard warns below that.
- **State exclusions, not just deliverables.** Every service lists what is *not* included. This is what prevents scope disputes, and removing it would be a regression.
- **No guarantees in copy.** No guaranteed rankings, lead volume, timelines for competitive keywords, or app store approval (PRD §23).

## Before you commit

```bash
npm run verify              # SEO guard, typecheck, lint, build
npm start                   # then, in a second terminal:
npm run check:responsive
```

Both scripts are fast and both catch real regressions. `check:responsive` drives a real browser because horizontal overflow cannot be verified by eye — `body` has `overflow-x: hidden`, which hides the scrollbar while the offending element is still there.

## Traps that have already caught someone

- **`"use server"` modules may only export async functions.** Exporting a constant throws at request time and the build does not catch it — the symptom is a form that renders perfectly and silently does nothing. Non-function exports go in `src/lib/lead-form-state.ts`.
- **`trailingSlash: true` normalises the path before redirects match.** A rule with `source: "/about-us"` never fires. Both sides need the slash.
- **Importing `content/services.ts` into a client component** bundles the entire service catalogue (~62KB of prose) into the browser and blows the PRD §21 JS budget. Client components use `content/services.nav.ts`. The build fails if the two drift apart.
- **`cx` concatenates, it does not merge Tailwind classes.** Passing `hidden` to a component whose base includes `inline-flex` does nothing. Wrap the component instead.
- **Avoid `\u` escape sequences in file-writing tool arguments.** They can be interpreted before reaching disk and silently write raw control bytes into source. `src/app/actions/lead.ts` uses an explicit character scan rather than a regex control-character class for this reason.
- **Satori (`next/og`) needs an explicit `display` on any element with more than one child**, and reads only inline styles — Tailwind classes do nothing in `src/components/og/BrandCard.tsx`.

## Motion

Read `src/app/motion.css` before adding an animation — the header comment states the three rules it follows and why each exists.

The one that matters most: **never ship an element that starts at `opacity: 0` outside the `html.js` gate.** Use `<Reveal>` or the `.rise` classes, both of which are gated. PRD §2 Finding 4 records an animation library breaking the live site's header this way, and Finding 1 is that only the homepage was indexed — content that needs JavaScript to become visible is the wrong risk on this site.

Also:
- Animate only `transform` and `opacity`. Anything touching width, height, top or margin causes layout and shows up in CLS and INP.
- Add a `prefers-reduced-motion` off-switch in the block at the bottom of motion.css.
- Decoration positioned off-canvas widens the document. Clip it at its container and re-run `npm run check:responsive`.
- `staggerStyle` is in `components/motion/stagger.ts`, NOT in `Reveal.tsx` — every export of a `"use client"` module is a client reference, and server components call it directly.

## When adding a service

1. Add the full entry to `src/content/services.digital.ts` or `services.growth.ts`.
2. Add the matching lightweight entry to `src/content/services.nav.ts`, including it in a `NAV_GROUPS` group.
3. Run `npm run check:seo` — it verifies the two agree, the title and description fit, there are 3–5 FAQs, 2–3 related links that resolve, and roughly 800+ words.

It then appears automatically in the mega-menu, the services hub, the homepage grid, the footer, the sitemap and `Service` structured data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
