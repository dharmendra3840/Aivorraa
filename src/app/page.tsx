import Link from "next/link";
import type { Metadata } from "next";

import {
  AutomationsBento,
  FounderSection,
  PricingSection,
  HomeHero,
  IndustryCards,
  JournalSection,
  ProcessSection,
  ServicesShowcase,
  WhySection,
  WorkGrid,
  WorkflowStage,
} from "@/components/home/HomeSections";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";
import {
  CtaSection,
  Container,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { ButtonLink, Card, Eyebrow, JsonLd } from "@/components/ui";
import { INDUSTRIES } from "@/content/industries";
import { PUBLISHED_ARTICLES } from "@/content/insights";
import { PUBLISHED_CASE_STUDIES } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";
import { localBusinessSchema, schemaGraph, websiteSchema } from "@/lib/schema";
import { CLAIMS } from "@/lib/site-config";

/**
 * PRD §15 — the homepage title already set in Rank Math is good and stays.
 * 52 characters.
 */
export const metadata: Metadata = buildMetadata({
  title: "Aivorraa — Digital Agency | Web Dev, AI & Growth",
  description:
    "Aivorraa is a full-stack digital agency building websites, apps and AI automation for growing businesses. Delhi NCR and remote across India.",
  path: "/",
});

/*
  The stack strip, set as large light wordmarks. These are the tools Aivorraa
  builds with -- not client logos. There are no published clients to show yet
  (PRD §14, §17), and a row of borrowed logos would claim relationships that
  do not exist.
*/
const STACK_MARKS = [
  "Shopify",
  "WooCommerce",
  "React",
  "Node.js",
  "n8n",
  "Make",
  "Next.js",
  "WordPress",
  "Google Ads",
  "GA4",
  "Figma",
];

const HOW_WE_WORK = [
  {
    title: "Discover",
    body: "What the business needs, who it serves, and what is currently in the way. Existing site, URLs and search visibility are audited before anything is proposed.",
  },
  {
    title: "Define",
    body: "Scope, sitemap, content outline, technical approach and redirect map, signed off in writing. This is the document the project is measured against.",
  },
  {
    title: "Design",
    body: "Wireframes first, then responsive high-fidelity screens. Consolidated feedback in one list per round, with a defined number of revisions.",
  },
  {
    title: "Build",
    body: "Templates, components, forms and integrations, with a staging URL from the first week so progress is visible rather than described.",
  },
  {
    title: "Review",
    body: "Functional, responsive, SEO, accessibility and performance checks against a written pre-launch checklist — not a quick look before go-live.",
  },
  {
    title: "Launch & Support",
    body: "Production setup, analytics, redirects and go-live, then a defect-fix window and an optional maintenance plan with a defined response time.",
  },
];

/**
 * PRD §14 — "Why Aivorraa" pillars. These are commitments about how Aivorraa
 * works, which are within its control to keep. None of them is a claim about
 * past results, client counts or outcomes, because those require
 * verification (§14, §23).
 */
const PILLARS = [
  {
    title: "We find the real problem first",
    body: "Every engagement starts with an audit and a recorded baseline. If the real problem is that your pages are not indexed, you will hear that before anyone proposes a redesign.",
  },
  {
    title: "Built to grow with you",
    body: "Interfaces are built as component systems against shared tokens, so the site still looks like itself after your team has added twenty pages to it.",
  },
  {
    title: "Straight answers, in writing",
    body: "Scope, price, timeline and what is not included are agreed in writing before work starts. No surprises on the invoice, and no promises nobody can keep.",
  },
  {
    title: "Everything stays in your name",
    body: "Domain, hosting, analytics and Search Console are set up in your name. Code, files and documentation transfer to you. You are never locked out of your own site.",
  },
];

/*
  The stats panels. Outcome figures (systems built, accuracy rates) have no
  documented source, and this is the section that promises "Nothing published
  that isn't true". These four are commitments: each is a fact about how
  Aivorraa works that a client can hold it to on day one.
*/
const STATS: Array<{ value: number | string; suffix?: string; label: string }> = [
  { value: 9, label: "Services, one accountable team" },
  { value: 6, label: "Delivery stages, each signed off" },
  { value: "24/7", label: "Automations that never clock out" },
  { value: 100, suffix: "%", label: "Accounts set up in your name" },
];

export default function HomePage() {
  const hasWork = PUBLISHED_CASE_STUDIES.length > 0;
  const articles = PUBLISHED_ARTICLES.slice(0, 3);

  return (
    <>
      {/* PRD §16 — WebSite on the homepage enables the sitelinks search box.
          Organization is emitted by the root layout on every page.
          LocalBusiness appears only once a verified address exists. */}
      <JsonLd json={schemaGraph(websiteSchema(), localBusinessSchema())} />

      <HomeHero />

      <AutomationsBento />

      {/* ----------------------------------------------------------------- */}
      {/* Stack strip                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section aria-labelledby="stack-heading" className="pt-24 pb-10 sm:pt-32">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="stack-heading" className="eyebrow">
              <span aria-hidden="true" className="bg-brand-500 inline-block h-px w-6" />
              Built with the tools your business already runs
            </h2>
            {/* WCAG 2.2.2 -- beside the looping motion it controls (the
                marquee below and the reel after it). */}
            <MotionToggle />
          </div>
          {/*
            PRD §14 / §16 — the star rating renders only once
            CLAIMS.showRatingStars is true, which needs real, attributable
            reviews. AggregateRating schema is never emitted regardless.
          */}
          {CLAIMS.showRatingStars ? (
            <p className="text-ink-600 mt-3 flex items-center gap-2 text-sm">
              <span role="img" aria-label="Five star rated">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </span>
              {CLAIMS.ratingLabel}
            </p>
          ) : null}
        </Container>
        <div
          className="marquee mt-10"
          style={{ "--marquee-gap": "4.5rem" } as React.CSSProperties}
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="marquee__track"
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {STACK_MARKS.map((mark) => (
                <li
                  key={mark}
                  className="text-ink-400 shrink-0 text-[2rem] tracking-[-0.04em] whitespace-nowrap sm:text-[2.75rem]"
                >
                  {mark}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Trust strip — PRD §14: "Omit entirely if unverified."             */}
      {/* ----------------------------------------------------------------- */}
      {CLAIMS.trustStrip.length > 0 ? (
        <Container>
          <ul className="border-line grid grid-cols-2 gap-6 border-y py-8 sm:grid-cols-4">
            {CLAIMS.trustStrip.map((stat) => (
              <li key={stat.label}>
                <p className="text-4xl">{stat.value}</p>
                <p className="text-ink-500 mt-1 text-sm">{stat.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <WorkflowStage />

      {/* ----------------------------------------------------------------- */}
      {/* Work — PRD §17: permission required before publishing             */}
      {/* ----------------------------------------------------------------- */}
      {hasWork ? (
        <Section>
          <Container>
            <SectionHeading
              eyebrow="Selected work"
              title="Recent projects"
              lede="Each case study states Aivorraa's exact role and scope, with outcomes shown only where they are documented and approved."
            />
            <Reveal as="ul" mode="group" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PUBLISHED_CASE_STUDIES.slice(0, 3).map((study, i) => (
                <Card as="li" key={study.slug} style={staggerStyle(i)}>
                  <p className="text-ink-500 text-xs">
                    {study.industry} &middot; {study.year}
                  </p>
                  <h3 className="mt-3 text-xl">
                    <Link href={`/portfolio/${study.slug}`} className="link-draw">
                      {study.title}
                    </Link>
                  </h3>
                  <p className="text-ink-500 mt-2.5 text-sm">{study.brief}</p>
                </Card>
              ))}
            </Reveal>
            <div className="mt-10">
              <ButtonLink href="/portfolio" variant="link">
                See how work is documented
              </ButtonLink>
            </div>
          </Container>
        </Section>
      ) : (
        <WorkGrid />
      )}

      <WhySection stats={STATS} pillars={PILLARS} />

      {/* The founder and the price ranges: hidden until the client's real
          material is in content/proof.ts. */}
      <FounderSection />
      <PricingSection />

      <ServicesShowcase />

      <ProcessSection
        eyebrow="How Aivorraa works"
        title="Six stages, and you know what happens in each"
        lede="Every project runs on the same six stages, each with a named output and your sign-off — because the projects that go wrong are the ones where nobody agreed what happens when, or who approves what."
        steps={HOW_WE_WORK}
      />

      <IndustryCards industries={INDUSTRIES} />

      {/* ----------------------------------------------------------------- */}
      {/* Testimonials — PRD §14: client-approved quotes only               */}
      {/* ----------------------------------------------------------------- */}
      {CLAIMS.testimonials.length > 0 ? (
        <Section>
          <Container>
            <Eyebrow>Client words</Eyebrow>
            <SectionHeading title="What clients have approved us to publish" />
            <Reveal as="ul" mode="group" className="mt-12 grid gap-4 lg:grid-cols-3">
              {CLAIMS.testimonials.map((t, i) => (
                <Card as="li" key={t.name} style={staggerStyle(i)}>
                  <blockquote className="text-xl leading-snug">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="mt-6 text-sm">{t.name}</p>
                  <p className="text-ink-500 text-sm">
                    {t.title}, {t.company}
                  </p>
                </Card>
              ))}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {articles.length > 0 ? <JournalSection articles={articles} /> : null}

      <CtaSection />
    </>
  );
}
