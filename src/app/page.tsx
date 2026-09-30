import Link from "next/link";
import type { Metadata } from "next";

import { HeroDashboard } from "@/components/sections/HeroDashboard";
import { HeroField } from "@/components/sections/HeroField";
import { MonogramVideo } from "@/components/brand/MonogramVideo";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { PinnedProcess } from "@/components/sections/PinnedProcess";
import { WorkflowOS } from "@/components/sections/WorkflowOS";
import { Blueprints } from "@/components/sections/Blueprints";
import { HorizontalServices } from "@/components/sections/HorizontalServices";
import { IndustryPanels } from "@/components/sections/IndustryPanels";
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";
import {
  CtaSection,
  Container,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { ButtonLink, Card, JsonLd } from "@/components/ui";
import { ArrowRightIcon, Icon, SparkIcon } from "@/components/icons";
import { INDUSTRIES } from "@/content/industries";
import { PUBLISHED_ARTICLES } from "@/content/insights";
import { PUBLISHED_CASE_STUDIES } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";
import { localBusinessSchema, schemaGraph, websiteSchema } from "@/lib/schema";
import { CLAIMS, SITE } from "@/lib/site-config";

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
  The stack strip under the hero, set as monochrome wordmarks. These are the
  tools Aivorraa builds with (the same list the old hero marquee carried) --
  not client logos. The theme brief asked for "Trusted by" plus brand logos;
  there are no published clients to show yet (PRD §14, §17), and a row of
  borrowed logos would claim relationships that do not exist.
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
    scene: "discover" as const,
    body: "What the business needs, who it serves, and what is currently in the way. Existing site, URLs and search visibility are audited before anything is proposed.",
  },
  {
    title: "Define",
    scene: "define" as const,
    body: "Scope, sitemap, content outline, technical approach and redirect map, signed off in writing. This is the document the project is measured against.",
  },
  {
    title: "Design",
    scene: "design" as const,
    body: "Wireframes first, then responsive high-fidelity screens. Consolidated feedback in one list per round, with a defined number of revisions.",
  },
  {
    title: "Build",
    scene: "build" as const,
    body: "Templates, components, forms and integrations, with a staging URL from the first week so progress is visible rather than described.",
  },
  {
    title: "Review",
    scene: "review" as const,
    body: "Functional, responsive, SEO, accessibility and performance checks against a written pre-launch checklist — not a quick look before go-live.",
  },
  {
    title: "Launch & Support",
    scene: "launch" as const,
    body: "Production setup, analytics, redirects and go-live, then a defect-fix window and an optional maintenance plan with a defined response time.",
  },
];

/**
 * PRD §14 — "Why Aivorraa" proposed pillars. These are commitments about how
 * Aivorraa works, which are within its control to keep. None of them is a claim
 * about past results, client counts or outcomes, because those require
 * verification (§14, §23).
 */
const PILLARS = [
  {
    icon: "search" as const,
    title: "The diagnosis comes first",
    body: "Every engagement starts with an audit and a recorded baseline. If the real problem is that your pages are not indexed, you will hear that before anyone proposes a redesign.",
  },
  {
    icon: "layers" as const,
    title: "Design led, system built",
    body: "Interfaces are built as component systems against shared tokens, so the site still looks like itself after your team has added twenty pages to it.",
  },
  {
    icon: "shield" as const,
    title: "Nothing published that isn't true",
    body: "No invented statistics, no fabricated reviews, no schema describing something that does not exist on the page. Claims are approved before they ship.",
  },
  {
    icon: "bolt" as const,
    title: "Handover, not lock-in",
    body: "Domain, hosting, analytics and Search Console are set up in your name. Code, files and documentation transfer to you. You are never locked out of your own site.",
  },
];

/*
  The "Why Aivorraa" stats band. The theme brief's figures (50+ systems built,
  10+ industries, 99% accuracy) are outcome claims with no documented source,
  and this is the section that promises "Nothing published that isn't true".
  These four are commitments: each is a fact about how Aivorraa works that a
  client can hold it to on day one.
*/
const STATS: Array<{ value: number | string; suffix?: string; label: string }> = [
  { value: 8, label: "Services, one accountable team" },
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
          Organization is NOT repeated here: the root layout already emits it on
          every page, and two nodes sharing one @id is an untidy graph.
          LocalBusiness appears only once a verified address exists. */}
      <JsonLd json={schemaGraph(websiteSchema(), localBusinessSchema())} />

      {/* ----------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ----------------------------------------------------------------- */}
      {/*
        Centred copy over a neural floor (HeroField, canvas), with the command
        dashboard floating beneath it. The canvas is decorative and never the
        LCP element -- the H1 is. Without JavaScript a CSS grid floor stands in.
      */}
      <section id="hero" aria-labelledby="hero-heading" className="hero2">
        <HeroField className="hero-canvas" />
        <div className="hero-floor-fallback" aria-hidden="true" />
        <div className="hero-horizon" aria-hidden="true" />
        {/* The monogram drawing itself behind the headline, like a hologram
            over the floor. Starts after the page's load event so the 197KB
            video never competes with the fonts the H1 is waiting on. */}
        <MonogramVideo className="hero-mono" trigger="load" />

        <Container>
          <div className="hero-copy hero-exit">
            <p className="hero-badge rise rise-1">
              <span className="hero-badge-orb" aria-hidden="true">
                <SparkIcon className="h-3.5 w-3.5" />
              </span>
              Digital agency &middot; Delhi NCR &amp; across India
            </p>

            {/* PRD §5 — keep the existing H1 words; exactly one H1 per page.
                The theme's gradient lands on the one verb that carries the
                AI positioning. */}
            <h1
              id="hero-heading"
              className="rise rise-2 mt-7 text-[2.55rem] leading-[1.05] font-semibold tracking-[-0.04em] sm:text-[3.5rem] lg:text-[4.1rem] xl:text-[4.6rem]"
            >
              {SITE.heroHeadline[0]}{" "}
              <span className="text-signature">
                {SITE.heroHeadline[1]}
              </span>
              <br className="hidden sm:block" /> {SITE.heroHeadline[2]}
            </h1>

            {/* PRD §5 — the H1 is paired with the one proposition, verbatim. */}
            <p className="rise rise-3 text-ink-500 mx-auto mt-7 max-w-2xl text-lg leading-relaxed sm:text-xl">
              {SITE.proposition} Sites that load fast and get found, apps
              people keep using, and automation that takes repetitive work off
              your team.
            </p>

            <div className="rise rise-4 mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/contact"
                variant="primary"
                size="lg"
                withArrow
                className="shine"
              >
                Start a project
              </ButtonLink>
              <ButtonLink href="/services" variant="outline" size="lg">
                See our services
              </ButtonLink>
            </div>
          </div>

          <div className="rise rise-5">
            <HeroDashboard />
          </div>

          {/* WCAG 2.2.2 -- right beside the motion it controls. */}
          <div className="mt-8 flex justify-center">
            <MotionToggle />
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Stack strip                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section aria-labelledby="stack-heading" className="pt-16 pb-4 sm:pt-20">
        <Container>
          <h2
            id="stack-heading"
            className="text-ink-500 text-center font-sans text-sm font-medium tracking-normal"
          >
            Built with the tools your business already runs
          </h2>
          {/*
            PRD §14 / §16 — the star rating renders only once
            CLAIMS.showRatingStars is true, which needs real, attributable
            reviews. AggregateRating schema is never emitted regardless.
          */}
          {CLAIMS.showRatingStars ? (
            <p className="text-ink-600 mt-3 flex items-center justify-center gap-2 text-sm">
              <span
                className="text-brand-500"
                role="img"
                aria-label="Five star rated"
              >
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </span>
              {CLAIMS.ratingLabel}
            </p>
          ) : null}
          <div className="marquee mt-8">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="marquee__track gap-12"
                aria-hidden={copy === 1 ? "true" : undefined}
              >
                {STACK_MARKS.map((mark) => (
                  <li key={mark} className="stack-mark shrink-0">
                    {mark}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Trust strip — PRD §14: "Omit entirely if unverified."             */}
      {/* ----------------------------------------------------------------- */}
      {CLAIMS.trustStrip.length > 0 ? (
        <Container>
          <ul className="border-line grid grid-cols-2 gap-6 border-y py-8 sm:grid-cols-4">
            {CLAIMS.trustStrip.map((stat) => (
              <li key={stat.label} className="text-center">
                <p className="font-display text-ink text-3xl font-bold">
                  {stat.value}
                </p>
                <p className="text-ink-400 mt-1 text-sm">{stat.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {/* ----------------------------------------------------------------- */}
      {/* Service universe — horizontal scroll stage                        */}
      {/* ----------------------------------------------------------------- */}
      <HorizontalServices />

      {/* ----------------------------------------------------------------- */}
      {/* AI workflow — the pipeline console                                */}
      {/* ----------------------------------------------------------------- */}
      <WorkflowOS />

      {/* ----------------------------------------------------------------- */}
      {/* Work — PRD §17: permission required before publishing             */}
      {/* ----------------------------------------------------------------- */}
      {/*
        Approved case studies take this slot once they exist. Until then it
        carries the system blueprints: example builds, labelled as such, with
        no client names and no outcome figures.
      */}
      {hasWork ? (
        <>
        <Section tone="surface">
          <Container>
            <Reveal>
            <SectionHeading
              eyebrow="Selected work"
              title={hasWork ? "Recent projects" : "Case studies, published properly"}
              lede={
                hasWork
                  ? "Each case study states Aivorraa's exact role and scope, with outcomes shown only where they are documented and approved."
                  : "Aivorraa is securing written client permission and confirming its exact role on each project before publishing it. Logos without detail are not evidence, so nothing appears here until the case study is complete and approved."
              }
            />
            </Reveal>
            {hasWork ? (
              <Reveal as="ul" mode="group" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PUBLISHED_CASE_STUDIES.slice(0, 3).map((study) => (
                  <Card as="li" key={study.slug}>
                    <p className="text-ink-400 text-xs font-semibold tracking-[0.14em] uppercase">
                      {study.industry} &middot; {study.year}
                    </p>
                    <h3 className="font-display text-ink mt-3 text-lg font-semibold">
                      <Link href={`/portfolio/${study.slug}`}>{study.title}</Link>
                    </h3>
                    <p className="text-ink-500 mt-2.5 text-sm">{study.brief}</p>
                  </Card>
                ))}
              </Reveal>
            ) : (
              <Reveal className="mt-10">
                <ButtonLink href="/portfolio" variant="outline" withArrow>
                  See how work is documented
                </ButtonLink>
              </Reveal>
            )}
          </Container>
        </Section>
        </>
      ) : (
        <Blueprints />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Why Aivorraa                                                      */}
      {/* ----------------------------------------------------------------- */}
      <Section>
        <Container>
          <Reveal
            as="ul"
            className="glass rounded-card mb-16 grid grid-cols-2 overflow-hidden md:mb-20 md:grid-cols-4"
          >
            {STATS.map((stat) => (
              <li key={stat.label} className="stat">
                <p className="stat-num text-ink">
                  {typeof stat.value === "number" ? (
                    <>
                      {/* The counter is painted by CSS, which assistive tech
                          reads inconsistently; the real number is here. */}
                      <span className="sr-only">
                        {stat.value}
                        {stat.suffix}
                      </span>
                      <span
                        aria-hidden="true"
                        className="count-up"
                        style={
                          {
                            "--count": stat.value,
                            "--count-to": stat.value,
                          } as React.CSSProperties
                        }
                      />
                      {stat.suffix ? (
                        <span aria-hidden="true">{stat.suffix}</span>
                      ) : null}
                    </>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="stat-label">{stat.label}</p>
              </li>
            ))}
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
            <SectionHeading
              eyebrow="Why Aivorraa"
              title="Commitments, not superlatives"
              lede="No superlatives and no claims about being the leading anything. What follows is how the work is actually run — each point is something within Aivorraa's control to keep."
            />
            </Reveal>
            <Reveal as="ul" mode="group" className="grid gap-4 sm:grid-cols-2">
              {PILLARS.map((pillar, i) => (
                /*
                  No `ghost-num` here. Card's base carries `spot`, and both
                  draw with ::before -- one element has one ::before, so they
                  merged (the same collision found on the process cards). The
                  index is a real element in the corner instead.
                */
                <Card
                  as="li"
                  key={pillar.title}
                  className="lift spot-edge sd-enter-soft relative h-full"
                  style={staggerStyle(i)}
                >
                  <span
                    aria-hidden="true"
                    className="text-ink-400 absolute top-6 right-6 font-mono text-[0.6875rem] tracking-[0.12em]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="bg-brand-500/12 text-brand-700 mb-4 flex h-11 w-11 items-center justify-center rounded-2xl shadow-[0_0_24px_-8px_rgba(var(--glow-rgb),0.39)]">
                    <Icon name={pillar.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-ink text-[1.0625rem] font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </Card>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* How we work — pinned scroll stage                                 */}
      {/* ----------------------------------------------------------------- */}
      <PinnedProcess
        eyebrow="How Aivorraa works"
        title="Six stages, and you know what happens in each"
        lede="Nothing here is unusual. It is written down because the projects that go wrong are almost always the ones where nobody agreed what happens when, or who approves what."
        steps={HOW_WE_WORK}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Industry pathways                                                 */}
      {/* ----------------------------------------------------------------- */}
      <Section tone="surface">
        <Container>
          <Reveal>
          <SectionHeading
            eyebrow="Who it's for"
            title="Four kinds of business this work fits"
            lede="Framed as the problem rather than the sector, because the problem is what you actually recognise."
          />
          </Reveal>
          <Reveal className="mt-14">
            <IndustryPanels industries={INDUSTRIES} />
          </Reveal>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* Testimonials — PRD §14: client-approved quotes only               */}
      {/* ----------------------------------------------------------------- */}
      {CLAIMS.testimonials.length > 0 ? (
        <Section>
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Client words"
                title="What clients have approved us to publish"
              />
            </Reveal>
            <Reveal as="ul" mode="group" className="mt-12 grid gap-4 lg:grid-cols-3">
              {CLAIMS.testimonials.map((t, i) => (
                <Card as="li" key={t.name} className="lift" style={staggerStyle(i)}>
                  <blockquote className="text-ink-600 text-[0.9375rem] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="text-ink mt-5 text-sm font-semibold">
                    {t.name}
                  </p>
                  <p className="text-ink-400 text-sm">
                    {t.title}, {t.company}
                  </p>
                </Card>
              ))}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ----------------------------------------------------------------- */}
      {/* Insights                                                          */}
      {/* ----------------------------------------------------------------- */}
      {articles.length > 0 ? (
        <Section>
          <Container>
            <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Insights"
                title="Answers to what people actually search"
                lede="Two articles a month, each answering a question a prospective client would genuinely type into Google."
              />
              <ButtonLink href="/insights" variant="outline" withArrow>
                All insights
              </ButtonLink>
            </Reveal>
            <Reveal as="ul" mode="group" className="grid gap-4 lg:grid-cols-3">
              {articles.map((article, i) => (
                <Card
                  as="li"
                  key={article.slug}
                  className="lift spot-edge sd-enter-soft h-full"
                  style={staggerStyle(i)}
                >
                  <p className="text-ink-400 text-xs font-semibold tracking-[0.14em] uppercase">
                    {article.readingMinutes} min read
                  </p>
                  <h3 className="font-display text-ink mt-3 text-[1.0625rem] leading-snug font-semibold">
                    <Link
                      href={`/insights/${article.slug}`}
                      className="hover:text-brand-700 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
                    {article.description}
                  </p>
                  <span className="text-brand-700 mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                    Read
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Card>
              ))}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <CtaSection />
    </>
  );
}
