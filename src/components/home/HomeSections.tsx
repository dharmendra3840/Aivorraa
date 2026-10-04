import Link from "next/link";
import type { CSSProperties } from "react";

import type { Article, Industry, Service } from "@/content/types";
import { SERVICES, getService } from "@/content/services";
import {
  INDUSTRY_MEDIA,
  JOURNAL_COVERS,
  SERVICE_MEDIA,
  type MediaKey,
} from "@/content/media";
import {
  ButtonLink,
  Chip,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { Photo } from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { splitWords } from "@/components/motion/SplitWords";
import { staggerStyle } from "@/components/motion/stagger";
import { SITE } from "@/lib/site-config";

/* ========================================================================== */
/* Hero                                                                       */
/* ========================================================================== */

/**
 * The reference's opening: a very large light headline, left-aligned, with
 * the proposition as a small column to the right; then two tall photographs
 * that open the page like a portfolio.
 *
 * PRD §5 — the H1 keeps its words exactly, and is the page's only H1. It
 * rises word by word on load (pure CSS, `.split-load`).
 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-12 sm:pt-16 lg:pt-24">
      <Container>
        {/*
          Two columns from lg up: the copy on the left, a tall photograph on
          the right, so the first screen is balanced rather than a headline
          beside an empty half. Below lg it stacks, photo after the copy.
        */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch lg:gap-16">
          <div className="flex flex-col">
            <Eyebrow className="rise rise-1">
              Digital agency &middot; Delhi NCR &amp; across India
            </Eyebrow>

            <h1
              id="hero-heading"
              className="split-load text-[3rem] leading-[0.98] sm:text-[4.4rem] lg:text-[4.6rem] xl:text-[5.4rem]"
            >
              {splitWords(
                <>
                  {SITE.heroHeadline[0]}{" "}
                  <span className="text-signature">{SITE.heroHeadline[1]}</span>{" "}
                  {SITE.heroHeadline[2]}
                </>,
              )}
            </h1>

            {/* PRD §5 — the H1 is paired with the one proposition, verbatim. */}
            <p className="rise rise-3 text-ink-500 mt-10 max-w-lg text-[1.0625rem] leading-relaxed lg:mt-auto lg:pt-12">
              {SITE.proposition} Sites that load fast and get found, apps people
              keep using, and automation that takes repetitive work off your
              team.
            </p>
            <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
                Start a project
              </ButtonLink>
              <ButtonLink href="/services" variant="link">
                See our services
              </ButtonLink>
            </div>
          </div>

          <div className="rise rise-5 relative">
            <Photo
              id="form-teal"
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="rounded-card aspect-[4/5] h-full lg:aspect-auto lg:min-h-[34rem]"
              priority
              reveal={false}
              alt=""
            />
            {/* A caption card on the photo: what Aivorraa does, not a claim. */}
            <div className="bg-page/90 rounded-card absolute right-4 bottom-4 left-4 p-5 backdrop-blur-md sm:right-auto sm:max-w-xs">
              <p className="eyebrow">
                <span aria-hidden="true" className="bg-lime-400 inline-block h-2 w-2 rounded-full" />
                One team, nine services
              </p>
              <p className="text-ink-600 mt-2 text-sm leading-relaxed">
                Websites, apps, AI automation, SEO, marketing, brand, video and
                interiors &mdash; scoped in writing, built in your name.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:mt-28">
          <HeroTile
            href="/web-development"
            media="hero-desk"
            title="Websites & apps"
            tags={["Web Development", "UI/UX", "Apps"]}
          />
          <HeroTile
            href="/ai-automation"
            media="hero-form"
            title="AI automation"
            tags={["n8n", "Make", "AI agents"]}
          />
        </div>
      </Container>
    </section>
  );
}

function HeroTile({
  href,
  media,
  title,
  tags,
  priority = false,
}: {
  href: string;
  media: MediaKey;
  title: string;
  tags: string[];
  priority?: boolean;
}) {
  return (
    <Link href={href} className="img-zoom group block" data-cursor-text="View">
      <Photo
        id={media}
        sizes="(min-width: 640px) 48vw, 100vw"
        className="rounded-card aspect-[4/5] lg:aspect-[5/6]"
        priority={priority}
        reveal={!priority}
      />
      <span className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-lg">
          <span className="link-draw">{title}</span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </span>
      </span>
    </Link>
  );
}

/* ========================================================================== */
/* Why Aivorraa -- stats as the reference's panel row, then the commitments   */
/* ========================================================================== */

type Stat = { value: number | string; suffix?: string; label: string };
type Pillar = { title: string; body: string };

export function WhySection({ stats, pillars }: { stats: Stat[]; pillars: Pillar[] }) {
  return (
    <Section>
      <Container>
        <SectionHeading
          layout="split"
          eyebrow="Why Aivorraa"
          title={
            <>
              Commitments, <span className="text-signature">not superlatives</span>
            </>
          }
          lede="No superlatives and no claims about being the leading anything. What follows is how the work is actually run — each point is something within Aivorraa's control to keep."
        />

        {/* Four panels: grey, charcoal with the dot field, grey, lime -- the
            reference's row, carrying commitments rather than outcome claims. */}
        <Reveal
          as="ul"
          mode="group"
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {stats.map((stat, i) => {
            const tone =
              i === 1 ? "scope-dark bg-panel" : i === 3 ? "bg-lime-400 text-[#0f0f0f]" : "bg-surface";
            return (
              <li
                key={stat.label}
                style={staggerStyle(i)}
                className={`rounded-card relative flex min-h-[17rem] flex-col justify-between overflow-hidden p-7 lg:min-h-[21rem] ${tone}`}
              >
                {i === 1 ? <span className="dot-field" aria-hidden="true" /> : null}
                <p className="relative max-w-[16ch] text-[1.0625rem] leading-snug">
                  {stat.label}
                </p>
                <p className="relative text-[4rem] leading-none font-light tracking-[-0.06em] sm:text-[4.75rem]">
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
                        style={{ "--to": stat.value } as CSSProperties}
                      />
                      {stat.suffix ? <span aria-hidden="true">{stat.suffix}</span> : null}
                    </>
                  ) : (
                    stat.value
                  )}
                </p>
              </li>
            );
          })}
        </Reveal>

        <Reveal
          as="ul"
          mode="group"
          className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4"
        >
          {pillars.map((pillar, i) => (
            <li key={pillar.title} style={staggerStyle(i)} className="border-line border-t pt-6">
              <span aria-hidden="true" className="text-ink-400 font-mono text-xs">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl">{pillar.title}</h3>
              <p className="text-ink-500 mt-3 text-sm leading-relaxed">{pillar.body}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/* ========================================================================== */
/* Services showcase -- sticky preview + large rows                           */
/* ========================================================================== */

/**
 * Every service as a large row; a sticky photograph beside them swaps to
 * whichever row is hovered or focused (pure CSS :has(), motion.css §101).
 */
export function ServicesShowcase({ services = SERVICES }: { services?: Service[] }) {
  return (
    <section aria-labelledby="services-heading" className="svc-showcase py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-4xl">
            <Eyebrow>Nine services, one team</Eyebrow>
            <h2
              id="services-heading"
              className="text-[2.35rem] sm:text-[3rem] lg:text-[3.6rem]"
            >
              {splitWords(
                <>
                  Nine services. <span className="text-signature">One team</span>{" "}
                  accountable for all of them.
                </>,
              )}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <ButtonLink href="/services" variant="link">
              All services
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="hidden lg:block">
            <div
              className="svc-preview rounded-card sticky top-24 aspect-[4/5] overflow-hidden"
              aria-hidden="true"
            >
              {services.map((s, i) => (
                <Photo
                  key={s.slug}
                  id={SERVICE_MEDIA[s.slug] ?? "svc-web"}
                  sizes="38vw"
                  still
                  reveal={false}
                  alt=""
                  className={`preview-${i}`}
                />
              ))}
            </div>
          </div>

          <ol className="border-line border-t">
            {services.map((service, i) => (
              <li key={service.slug} className="border-line border-b">
                <Link
                  href={`/${service.slug}`}
                  data-i={i}
                  data-cursor-text="Explore"
                  className="group grid grid-cols-[2.75rem_1fr_auto] items-start gap-x-4 py-6 sm:grid-cols-[4rem_1fr_auto] sm:py-8"
                >
                  <span
                    aria-hidden="true"
                    className="text-ink-400 group-hover:text-ink pt-2.5 font-mono text-xs transition-colors"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[1.85rem] leading-tight font-light tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-[2.6rem]">
                      {service.nav}
                    </span>
                    <span className="text-ink-500 mt-2 block max-w-lg text-sm leading-relaxed">
                      {service.summary}
                    </span>
                  </span>
                  <span className="border-line-strong group-hover:bg-lime-400 group-hover:text-[#0f0f0f] mt-2 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-transparent">
                    <ArrowRightIcon className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ========================================================================== */
/* Example builds -- the reference's work grid                                */
/* ========================================================================== */

/**
 * PRD §17 — approved case studies take this slot once they exist. Until then
 * it carries example builds, labelled as such, with no client names and no
 * outcome figures. The photographs are illustrative, not client work.
 */
const BLUEPRINTS: Array<{
  title: string;
  before: string;
  after: string;
  stack: string[];
  media: MediaKey;
}> = [
  {
    title: "E-commerce AI support system",
    before: "Manual customer handling across chat, email and Instagram DMs.",
    after: "AI chatbot + automated order workflow + CRM integration.",
    stack: ["AI chatbot", "n8n", "CRM"],
    media: "bp-ecom",
  },
  {
    title: "Lead capture to CRM pipeline",
    before: "Enquiries sit in an inbox until someone finds time to reply.",
    after: "Form → AI qualification → CRM deal → instant WhatsApp follow-up.",
    stack: ["Forms", "Make", "CRM", "WhatsApp"],
    media: "bp-crm",
  },
  {
    title: "Automated growth reporting",
    before: "Weekly reports assembled by hand from Ads and Analytics.",
    after: "Scheduled GA4 + Ads pull → live dashboard → plain-English summary.",
    stack: ["GA4", "Google Ads", "LLM"],
    media: "bp-report",
  },
];

export function WorkGrid() {
  return (
    <Section>
      <Container>
        <SectionHeading
          layout="split"
          eyebrow="System blueprints"
          title={
            <>
              What these systems look like{" "}
              <span className="text-signature">in practice</span>
            </>
          }
          lede="Example builds, not client case studies. Aivorraa publishes a case study only with the client's written permission — these show the before and after each engagement is designed to deliver."
          action={
            <ButtonLink href="/portfolio" variant="link" className="text-sm">
              How case studies are published
            </ButtonLink>
          }
        />

        <ul className="mt-14 grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:mt-20">
          {BLUEPRINTS.map((bp, i) => (
            <li key={bp.title} className={i === 2 ? "sm:col-span-2" : undefined}>
              <Photo
                id={bp.media}
                sizes={i === 2 ? "100vw" : "(min-width: 640px) 48vw, 100vw"}
                className={
                  i === 2
                    ? "rounded-card aspect-[4/3] sm:aspect-[21/9]"
                    : "rounded-card aspect-[4/3]"
                }
              />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[1.375rem]">{bp.title}</h3>
                <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
                  <li>
                    <span className="bg-lime-400 inline-flex items-center rounded-[0.3rem] px-2 py-1 text-[0.6875rem] font-medium text-[#0f0f0f]">
                      Example build
                    </span>
                  </li>
                  {bp.stack.map((tool) => (
                    <li key={tool}>
                      <Chip>{tool}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-ink-400 text-xs">Before</dt>
                  <dd className="text-ink-600 mt-1 leading-relaxed">{bp.before}</dd>
                </div>
                <div>
                  <dt className="text-ink-400 text-xs">After</dt>
                  <dd className="text-ink mt-1 leading-relaxed">{bp.after}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ========================================================================== */
/* AI workflow -- a charcoal stage                                            */
/* ========================================================================== */

const NODES: Array<{ title: string; body: string; log: [string, string] }> = [
  {
    title: "Customer request",
    body: "A message lands on WhatsApp, a web form, email or live chat — any hour of the day.",
    log: ["request.received", 'channel=whatsapp  "Any slots on Friday?"'],
  },
  {
    title: "AI agent",
    body: "An LLM agent reads it, works out what the customer wants and replies in your tone.",
    log: ["agent.classify", "intent=booking  reply=sent"],
  },
  {
    title: "Data processing",
    body: "Details are extracted, checked against your records and enriched before anything acts on them.",
    log: ["data.enrich", "customer=returning  records=matched"],
  },
  {
    title: "Business action",
    body: "The workflow does the work: creates the CRM deal, books the slot, raises the invoice.",
    log: ["action.execute", "crm.deal=created  calendar=booked"],
  },
  {
    title: "Growth result",
    body: "Every step is logged, so response time and conversion are measured rather than guessed.",
    log: ["result.logged", "pipeline=updated  status=ok"],
  },
];

export function WorkflowStage() {
  return (
    <Section tone="ink" className="relative overflow-clip">
      <span className="dot-field opacity-40" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading
          layout="split"
          eyebrow="AI workflow"
          title={
            <>
              From customer request to{" "}
              <span className="text-signature">business result</span>
            </>
          }
          lede="What an Aivorraa automation actually does, step by step — built in n8n or Make, with a language model only where it earns its place."
        />

        {/* The rail fills with lime as the stage scrolls through. */}
        <div className="wf-rail mt-16 lg:mt-24" aria-hidden="true">
          <span className="wf-rail-fill" />
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-5">
          {NODES.map((node, i) => (
            <li
              key={node.title}
              className="lit-row border-line border-b py-8 sm:border-r sm:px-6 sm:first:pl-0 lg:border-b-0 lg:py-10 lg:last:border-r-0"
            >
              <span className="lit-num font-mono text-xs" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-xl">{node.title}</h3>
              <p className="text-ink-500 mt-3 text-sm leading-relaxed">{node.body}</p>
            </li>
          ))}
        </ol>

        {/* A run log of the same five steps. Decorative: the steps above are
            the content; this is the same story in the machine's words. */}
        <div
          className="bg-surface rounded-card mt-10 overflow-x-auto p-6 font-mono text-[0.75rem] leading-7 sm:p-8"
          aria-hidden="true"
        >
          {NODES.map(({ log }) => (
            <p key={log[0]} className="lit-row flex gap-4 whitespace-nowrap">
              <span className="text-lime-400">&gt;</span>
              <span className="text-ink w-36 shrink-0">{log[0]}</span>
              <span className="text-ink-500">{log[1]}</span>
            </p>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ========================================================================== */
/* Process -- sticky intro + lit rows                                         */
/* ========================================================================== */

export function ProcessSection({
  eyebrow,
  title,
  lede,
  steps,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  steps: Array<{ title: string; body: string }>;
}) {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="text-[2.35rem] sm:text-[3rem] lg:text-[3.6rem]">
                {splitWords(title)}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-ink-500 mt-6 max-w-md leading-relaxed">{lede}</p>
              <p className="text-ink-500 mt-4 max-w-md text-sm leading-relaxed">
                Every stage has a named output and an approval point, so you
                always know what is being decided and by whom.
              </p>
              <div className="mt-8">
                <ButtonLink href="/contact" variant="link">
                  Start at stage one
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <ol className="border-line border-t">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="lit-row border-line grid grid-cols-[3.5rem_1fr] gap-x-4 border-b py-9 sm:grid-cols-[5rem_1fr] sm:py-12"
              >
                <span aria-hidden="true" className="lit-num pt-2 font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1.85rem] font-light tracking-[-0.04em] sm:text-[2.4rem]">
                    {step.title}
                  </h3>
                  <p className="text-ink-500 mt-4 max-w-xl leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ========================================================================== */
/* Industries -- image cards                                                  */
/* ========================================================================== */

export function IndustryCards({ industries }: { industries: Industry[] }) {
  return (
    <Section>
      <Container>
        <SectionHeading
          layout="split"
          eyebrow="Who it's for"
          title={
            <>
              Four kinds of business <span className="text-signature">this work fits</span>
            </>
          }
          lede="Framed as the problem rather than the sector, because the problem is what you actually recognise."
        />

        <ul className="mt-14 grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:mt-20">
          {industries.map((industry, i) => (
            <li key={industry.slug}>
              <Photo
                id={INDUSTRY_MEDIA[industry.slug] ?? "ind-startup"}
                sizes="(min-width: 640px) 48vw, 100vw"
                className="rounded-card aspect-[16/11]"
              />
              <div className="mt-6 flex items-baseline gap-4">
                <span aria-hidden="true" className="text-ink-400 font-mono text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[1.6rem] font-light tracking-[-0.035em]">
                  {industry.name}
                </h3>
              </div>
              <p className="text-ink mt-4 text-lg leading-snug">{industry.problem}</p>
              <p className="text-ink-500 mt-3 text-sm leading-relaxed">{industry.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {industry.services.map((slug) => {
                  const service = getService(slug);
                  if (!service) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className="border-line-strong text-ink-600 hover:bg-ink hover:text-page hover:border-ink inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs transition-colors"
                      >
                        {service.nav}
                        <ArrowRightIcon className="h-3 w-3" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ========================================================================== */
/* Insights -- the reference's journal, with pixel covers                     */
/* ========================================================================== */

export function JournalSection({ articles }: { articles: Article[] }) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Insights"
          title={
            <>
              Answers to what people <span className="text-signature">actually search</span>
            </>
          }
          lede="Two articles a month, each answering a question a prospective client would genuinely type into Google."
          action={
            <ButtonLink href="/insights" variant="link">
              All insights
            </ButtonLink>
          }
        />
        <JournalGrid articles={articles} />
      </Container>
    </Section>
  );
}

/** Shared with /insights: pixel cover, reading-time tag, light title. */
export function JournalGrid({ articles }: { articles: Article[] }) {
  return (
    <ul className="mt-14 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
      {articles.map((article, i) => (
        <li key={article.slug} className="sd-enter-soft" style={staggerStyle(i)}>
          <Link href={`/insights/${article.slug}`} className="group block" data-cursor-text="Read">
            <span
              className="rounded-card relative block aspect-[4/5] overflow-hidden bg-cover bg-center [image-rendering:pixelated]"
              style={{ backgroundImage: `url(${JOURNAL_COVERS[i % JOURNAL_COVERS.length]})` }}
              aria-hidden="true"
            >
              <span className="absolute bottom-4 left-4 rounded-[0.3rem] bg-[#0f0f0f]/75 px-2 py-1 text-[0.6875rem] font-medium text-white backdrop-blur-sm">
                {article.readingMinutes} min read
              </span>
            </span>
            <span className="mt-5 block text-[1.5rem] leading-tight font-light tracking-[-0.035em]">
              <span className="link-draw">{article.title}</span>
            </span>
            <span className="text-ink-500 mt-3 block text-sm leading-relaxed">
              {article.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
