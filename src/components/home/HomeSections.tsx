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
import { AutomationDemo } from "./AutomationDemo";
import { Photo } from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { splitWords } from "@/components/motion/SplitWords";
import { staggerStyle } from "@/components/motion/stagger";
import { SITE } from "@/lib/site-config";
import { FOUNDER, PRICES, TEAM } from "@/content/proof";

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
    <>
      {/*
        The opening: the headline and proposition on the left, and on the
        right the product itself -- a live automation answering a customer
        while the systems behind it update (AutomationDemo). The 3D world
        runs underneath.
      */}
      <section
        aria-labelledby="hero-heading"
        className="world-window scope-dark -mt-[4.5rem] flex min-h-[100svh] flex-col justify-center pt-32 pb-16 sm:pb-20"
      >
        <span className="world-scrim" aria-hidden="true" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <Eyebrow className="rise rise-1">
                AI automation studio &middot; Delhi NCR &amp; across India
              </Eyebrow>

              {/* PRD §5 — the H1 keeps its words; exactly one H1 per page. */}
              <h1
                id="hero-heading"
                className="split-load text-[2.9rem] leading-[1.02] sm:text-[4rem] lg:text-[4.4rem] xl:text-[5rem]"
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
              <p className="rise rise-3 text-ink-600 mt-7 max-w-xl text-[1.0625rem] leading-relaxed">
                {SITE.proposition} The enquiries, bookings and follow-ups your
                team answers by hand every day can run on their own — on
                WhatsApp, your website and the tools you already use.
              </p>
              <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
                  Start a project
                </ButtonLink>
                <ButtonLink href="/ai-automation" variant="link">
                  See what we automate
                </ButtonLink>
              </div>
            </div>

            <div className="rise rise-5">
              <AutomationDemo />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ========================================================================== */
/* What Aivorraa automates -- a bento of concrete jobs                        */
/* ========================================================================== */

/*
  Specific jobs, described by what they do -- not by outcomes, which need a
  documented source. Each points at the service page that delivers it.
*/
const AUTOMATIONS: Array<{
  title: string;
  before: string;
  after: string;
  tools: string[];
  href: string;
  size: "wide" | "tall" | "base";
}> = [
  {
    title: "Every enquiry answered, any hour",
    before: "Messages on WhatsApp, Instagram and the website wait until someone is free.",
    after: "An assistant replies in your tone, answers the routine questions and hands the rest to a person with the context attached.",
    tools: ["WhatsApp", "Instagram", "Website chat"],
    href: "/ai-automation",
    size: "wide",
  },
  {
    title: "Leads that never go cold",
    before: "Form fills sit in an inbox.",
    after: "Every lead lands in your CRM, gets qualified and a follow-up goes out on its own.",
    tools: ["Forms", "CRM"],
    href: "/ai-automation",
    size: "tall",
  },
  {
    title: "Bookings and reminders",
    before: "Slots arranged over calls and texts.",
    after: "Customers book themselves; reminders and reschedules go out automatically.",
    tools: ["Calendar", "WhatsApp"],
    href: "/ai-automation",
    size: "base",
  },
  {
    title: "Orders, stock and invoices",
    before: "The same order typed into three systems.",
    after: "One order updates the store, the stock sheet and the invoice together.",
    tools: ["Shopify", "WooCommerce", "Sheets"],
    href: "/ai-automation",
    size: "base",
  },
  {
    title: "Reports that write themselves",
    before: "Monday mornings spent copying numbers from Ads and Analytics.",
    after: "A dashboard that stays current, and a plain-English summary in your inbox.",
    tools: ["GA4", "Google Ads", "Sheets"],
    href: "/seo-ads",
    size: "base",
  },
  {
    title: "The site and app it all runs on",
    before: "A website that looks fine and does nothing.",
    after: "Fast pages that rank, capture the enquiry and feed it straight into the automations above.",
    tools: ["Next.js", "WordPress", "Apps"],
    href: "/web-development",
    size: "wide",
  },
];

export function AutomationsBento() {
  return (
    <Section>
      <Container>
        <SectionHeading
          layout="split"
          eyebrow="What we automate"
          title={
            <>
              The work your team repeats every day,{" "}
              <span className="text-signature">done on its own</span>
            </>
          }
          lede="Six jobs Aivorraa builds most often for growing businesses. Each one is scoped to your tools, quoted on its own, and stays yours to run."
        />
        <ul className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {AUTOMATIONS.map((job, i) => (
            <li
              key={job.title}
              className={
                "sd-enter-soft " +
                (job.size === "wide" ? "lg:col-span-2" : job.size === "tall" ? "lg:row-span-2" : "")
              }
              style={staggerStyle(i)}
            >
              <Link
                href={job.href}
                className="group spatial spatial-tilt flex h-full flex-col p-6 sm:p-7"
                data-cursor-text="Explore"
              >
                <span aria-hidden="true" className="depth-1 text-brand-700 font-mono text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="depth-2 mt-5 block text-[1.6rem] leading-[1.1] tracking-[-0.02em] sm:text-[1.85rem]">
                  {job.title}
                </span>
                <span className="depth-1 mt-auto grid gap-3 pt-8 text-sm leading-relaxed">
                  <span className="text-ink-500 block">
                    <span className="text-ink-400 mr-2 text-[0.6875rem] tracking-[0.08em] uppercase">Now</span>
                    {job.before}
                  </span>
                  <span className="text-ink block">
                    <span className="text-brand-700 mr-2 text-[0.6875rem] tracking-[0.08em] uppercase">After</span>
                    {job.after}
                  </span>
                </span>
                <span className="depth-1 mt-5 flex flex-wrap gap-1.5">
                  {job.tools.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

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
              What working with Aivorraa{" "}
              <span className="text-signature">actually feels like</span>
            </>
          }
          lede="A straight diagnosis before any proposal, a scope you can hold us to, a system built to grow, and every account in your name at the end."
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
              i === 1 ? "scope-dark spatial spatial-tilt bg-panel" : i === 3 ? "spatial spatial-tilt bg-lime-400 text-[#070b0a]" : "spatial spatial-tilt";
            return (
              <li
                key={stat.label}
                style={staggerStyle(i)}
                className={`relative flex min-h-[17rem] flex-col justify-between overflow-hidden p-7 lg:min-h-[21rem] ${tone}`}
              >
                {i === 1 ? <span className="dot-field" aria-hidden="true" /> : null}
                <p className="depth-1 relative max-w-[16ch] text-[1.0625rem] leading-snug">
                  {stat.label}
                </p>
                <p className="depth-3 relative text-[4rem] leading-none tracking-[-0.06em] sm:text-[4.75rem]">
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

        {/* The reference's values list: ruled rows, the commitment on the
            left and what it means on the right. */}
        <Reveal as="ul" mode="group" className="border-line mt-16 border-t lg:mt-24">
          {pillars.map((pillar, i) => (
            <li
              key={pillar.title}
              style={staggerStyle(i)}
              className="border-line grid gap-3 border-b py-7 sm:grid-cols-[3rem_1fr_1.3fr] sm:gap-8 sm:py-9"
            >
              <span aria-hidden="true" className="text-brand-700 font-mono text-xs sm:pt-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl sm:text-[1.75rem]">{pillar.title}</h3>
              <p className="text-ink-500 max-w-xl leading-relaxed sm:pt-1">{pillar.body}</p>
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
            <Eyebrow>Services</Eyebrow>
            <h2
              id="services-heading"
              className="text-[2.35rem] sm:text-[3rem] lg:text-[3.6rem]"
            >
              {splitWords(
                <>
                  Automation first —{" "}
                  <span className="text-signature">and everything it runs on.</span>
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
                    <span className="block text-[1.85rem] leading-tight tracking-[-0.04em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-[2.6rem]">
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
          lede="Three systems Aivorraa builds often, shown as examples. Client projects appear here as each client approves its case study."
          action={
            <ButtonLink href="/portfolio" variant="link" className="text-sm">
              How case studies are published
            </ButtonLink>
          }
        />

        {/*
          The reference's "standout works": one screen per build, the title
          set large in the middle with the photograph floating beside it, and
          the before/after where the reference puts its figures. Each item
          rises in and dims out as it passes (motion.css, .work-item).
        */}
        <ol className="mt-10 lg:mt-16">
          {BLUEPRINTS.map((bp, i) => (
            <li
              key={bp.title}
              className="work-item border-line grid min-h-[78svh] items-center gap-10 border-t py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
            >
              <div className="relative">
                <p className="eyebrow mb-6">
                  <span aria-hidden="true" className="bg-brand-500 inline-block h-px w-6" />
                  Example build {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="work-title relative z-[1] max-w-[14ch] text-[2.4rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4.4rem]">
                  {bp.title}
                </h3>
                <div className="work-photo mt-8 w-full max-w-md lg:absolute lg:top-1/2 lg:right-0 lg:mt-0 lg:w-[46%] lg:-translate-y-1/2">
                  <Photo
                    id={bp.media}
                    sizes="(min-width: 1024px) 26vw, 100vw"
                    className="rounded-card aspect-[4/3]"
                    still
                  />
                </div>
              </div>

              <div className="lg:pt-24">
                <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
                  {bp.stack.map((tool) => (
                    <li key={tool}>
                      <Chip>{tool}</Chip>
                    </li>
                  ))}
                </ul>
                <dl className="mt-8 grid gap-6 text-[0.9375rem]">
                  <div>
                    <dt className="eyebrow">Before</dt>
                    <dd className="text-ink-500 mt-2 leading-relaxed">{bp.before}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">
                      <span aria-hidden="true" className="bg-brand-500 inline-block h-px w-6" />
                      After
                    </dt>
                    <dd className="text-ink mt-2 text-lg leading-snug">{bp.after}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
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
    // A window onto the world: night in both themes, the stars behind it.
    <section className="world-window scope-dark relative overflow-clip py-20 sm:py-28 lg:py-36">
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
          className="spatial mt-10 overflow-x-auto p-6 font-mono text-[0.75rem] leading-7 sm:p-8"
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
    </section>
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
                  <h3 className="text-[1.85rem] tracking-[-0.04em] sm:text-[2.4rem]">
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

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20">
          {industries.map((industry, i) => (
            <li
              key={industry.slug}
              className="spatial spatial-tilt p-3 pb-7 [&>*:not(.media)]:px-3 sm:[&>*:not(.media)]:px-4"
            >
              <Photo
                id={INDUSTRY_MEDIA[industry.slug] ?? "ind-startup"}
                sizes="(min-width: 640px) 48vw, 100vw"
                className="aspect-[16/11] rounded-[1.1rem]"
              />
              <div className="mt-6 flex items-baseline gap-4">
                <span aria-hidden="true" className="text-ink-400 font-mono text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[1.6rem] tracking-[-0.035em]">
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
          <Link href={`/insights/${article.slug}`} className="group spatial spatial-tilt block h-full p-3" data-cursor-text="Read">
            <span
              className="relative block aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-cover bg-center [image-rendering:pixelated]"
              style={{ backgroundImage: `url(${JOURNAL_COVERS[i % JOURNAL_COVERS.length]})` }}
              aria-hidden="true"
            >
              <span className="absolute bottom-4 left-4 rounded-full bg-[#070b0a]/70 px-2.5 py-1 text-[0.6875rem] font-medium text-white backdrop-blur-md">
                {article.readingMinutes} min read
              </span>
            </span>
            <span className="depth-2 block px-2 pb-2">
              <span className="mt-5 block text-[1.5rem] leading-tight tracking-[-0.035em]">
                <span className="link-draw">{article.title}</span>
              </span>
              <span className="text-ink-500 mt-3 block text-sm leading-relaxed">
                {article.description}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ========================================================================== */
/* The founder -- shown once content/proof.ts has the real material           */
/* ========================================================================== */

export function FounderSection() {
  if (!FOUNDER) return null;
  const f = FOUNDER;
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="spatial spatial-tilt p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- client-supplied photo */}
            <img
              src={f.photo}
              alt={`${f.name}, ${f.role}`}
              width={1200}
              height={1500}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[1.1rem] object-cover"
            />
          </div>
          <Reveal>
            <Eyebrow>The founder</Eyebrow>
            {f.quote ? (
              <p className="text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem]">
                &ldquo;{f.quote}&rdquo;
              </p>
            ) : null}
            <div className="text-ink-500 mt-8 grid max-w-xl gap-4 leading-relaxed">
              {f.story.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <p className="mt-8">
              <span className="text-ink block text-lg">{f.name}</span>
              <span className="text-ink-500 block text-sm">{f.role}</span>
            </p>
          </Reveal>
        </div>
        {TEAM ? (
          <figure className="spatial mt-16 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- client-supplied photo */}
            <img
              src={TEAM.photo}
              alt={TEAM.caption}
              width={2000}
              height={1000}
              loading="lazy"
              className="aspect-[2/1] w-full rounded-[1.1rem] object-cover"
            />
            <figcaption className="text-ink-500 px-2 pt-3 pb-1 text-sm">{TEAM.caption}</figcaption>
          </figure>
        ) : null}
      </Container>
    </Section>
  );
}

/* ========================================================================== */
/* Where projects start -- shown once real price ranges are in proof.ts       */
/* ========================================================================== */

export function PricingSection() {
  if (PRICES.length === 0) return null;
  return (
    <Section>
      <Container>
        <SectionHeading
          layout="split"
          eyebrow="Pricing"
          title={
            <>
              Where projects <span className="text-signature">start</span>
            </>
          }
          lede="Real starting points, so you can tell in a minute whether a conversation is worth having. Every project is then quoted in writing against an agreed scope."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {PRICES.map((price, i) => {
            const service = getService(price.service);
            return (
              <li key={price.service} className="sd-enter-soft" style={staggerStyle(i)}>
                <div className="spatial spatial-tilt flex h-full flex-col p-7">
                  <span className="depth-1 eyebrow">{service?.nav ?? price.service}</span>
                  <span className="depth-3 mt-6 block">
                    <span className="text-ink-500 mr-2 text-sm">from</span>
                    <span className="text-[2.6rem] leading-none tracking-[-0.03em]">{price.from}</span>
                  </span>
                  <span className="depth-1 text-ink-600 mt-5 block text-sm leading-relaxed">{price.includes}</span>
                  {price.typical ? (
                    <span className="depth-1 text-ink-500 mt-2 block text-sm">{price.typical}</span>
                  ) : null}
                  {service ? (
                    <span className="mt-auto pt-6">
                      <ButtonLink href={`/${service.slug}`} variant="link">
                        What is included
                      </ButtonLink>
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
