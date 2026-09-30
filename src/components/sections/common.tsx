import Link from "next/link";

import type { Faq, Service } from "@/content/types";
import { SERVICES } from "@/content/services";
import {
  ACCENT,
  ButtonLink,
  Card,
  Container,
  Section,
  SectionHeading,
  cx,
} from "@/components/ui";
import { ArrowRightIcon, CheckIcon, Icon, MinusIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site-config";
import { Reveal } from "@/components/motion/Reveal";
import { MonogramVideo } from "@/components/brand/MonogramVideo";
import { staggerStyle } from "@/components/motion/stagger";

/* -------------------------------------------------------------------------- */
/* Breadcrumbs                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Visible breadcrumb trail. The matching BreadcrumbList schema is emitted by
 * each page via breadcrumbSchema() — PRD §16 requires it on every page except
 * the homepage.
 */
export function Breadcrumbs({
  trail,
}: {
  trail: Array<{ name: string; path: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="pt-10 sm:pt-12">
      <ol className="text-ink-400 flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
        </li>
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-ink-200">
                /
              </span>
              {isLast ? (
                <span className="text-ink-600 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-ink transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Page header                                                                */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="pt-10 pb-4 sm:pt-14">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="rise rise-1 text-brand-700 mb-4 text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        {/* PRD §15 — exactly one H1 per page, supplied here. */}
        <h1 className="rise rise-2 text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem]">
          {title}
        </h1>
        {lede ? (
          <p className="rise rise-3 text-ink-500 mt-6 text-lg leading-relaxed sm:text-xl">
            {lede}
          </p>
        ) : null}
        {children ? <div className="rise rise-4 mt-8">{children}</div> : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Service grid                                                               */
/* -------------------------------------------------------------------------- */

export function ServiceGrid({
  services = SERVICES,
  className,
}: {
  services?: Service[];
  className?: string;
}) {
  return (
    <ul
      className={cx(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {services.map((service, i) => {
        const accent = ACCENT[service.accent];
        return (
          <li key={service.slug} style={staggerStyle(i)}>
            <Link
              href={`/${service.slug}`}
              className="lift spot-edge card-sweep sd-enter-soft group bg-surface border-line shadow-card hover:border-line-strong flex h-full flex-col rounded-card border p-6"
            >
              {/*
                The icon tile inverts on hover — its pastel wash fills with the
                brand and the glyph goes to paper. A colour inversion on a small
                solid shape reads instantly and costs nothing in legibility,
                which is the opposite of a large translucent wash over the copy.
              */}
              <span
                className={cx(
                  "group-hover:bg-brand-600 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-[transform,background-color,color] duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-ink",
                  accent.bg,
                  accent.text,
                )}
              >
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display text-ink group-hover:text-brand-700 text-lg font-semibold transition-colors">
                {service.nav}
              </h3>
              <p className="text-ink-500 mt-2.5 flex-1 text-sm leading-relaxed">
                {service.summary}
              </p>
              {/* The rule under "Explore" draws out from the left on hover. */}
              <span className="text-brand-700 mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold">
                <span className="card-underline relative">Explore</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Process                                                                    */
/* -------------------------------------------------------------------------- */

export function ProcessSteps({
  steps,
}: {
  steps: Array<{ title: string; body: string }>;
}) {
  return (
    <ol className="timeline-rail grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li
          key={step.title}
          style={staggerStyle(i)}
          className="lift spot-edge card-sweep sd-enter-soft bg-surface border-line rounded-card relative border p-6"
        >
          <span
            aria-hidden="true"
            className="font-display text-brand-100 absolute top-4 right-5 text-4xl font-bold"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-ink relative text-base font-semibold">
            {step.title}
          </h3>
          <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Deliverables                                                               */
/* -------------------------------------------------------------------------- */

export function DeliverablesList({
  included,
  excluded,
}: {
  included: Array<{ title: string; body: string }>;
  excluded: string[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
      <Reveal as="ul" mode="group" className="grid gap-4 sm:grid-cols-2">
        {included.map((item, i) => (
          <li
            key={item.title}
            style={staggerStyle(i)}
            className="lift spot-edge card-sweep sd-enter-soft bg-surface border-line rounded-card border p-5"
          >
            <div className="flex items-start gap-3">
              <span className="bg-lime-100 text-lime-600 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-display text-ink text-[0.9375rem] font-semibold">
                  {item.title}
                </h3>
                <p className="text-ink-500 mt-1.5 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </Reveal>

      {/* PRD §15.3 — deliverables AND exclusions. Stating what is not included
          is what prevents scope disputes later, so it is given equal weight. */}
      <Reveal className="bg-ink-50 border-line rounded-card h-fit border p-6">
        <h3 className="font-display text-ink text-base font-semibold">
          Not included
        </h3>
        <p className="text-ink-400 mt-1.5 text-sm">
          Stated up front rather than discovered mid-project.
        </p>
        <ul className="mt-4 grid gap-3">
          {excluded.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="text-ink-400 mt-0.5 shrink-0">
                <MinusIcon className="h-4 w-4" />
              </span>
              <span className="text-ink-500 text-sm leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Native <details>/<summary> accordion.
 *
 * Deliberately not a React state component: it is keyboard accessible and
 * screen-reader correct with no JavaScript at all, which keeps the page inside
 * the PRD §21 budget of <= 200KB compressed JS. The matching FAQPage schema is
 * emitted by the page (PRD §16).
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Reveal as="ul" mode="group" className="grid gap-3">
        {faqs.map((faq, i) => (
          <li key={faq.q} style={staggerStyle(i)}>
            <details className="spot group bg-surface border-line rounded-card border open:shadow-card transition-shadow">
              <summary className="marker:content-none flex cursor-pointer list-none items-start justify-between gap-4 p-5 sm:p-6">
                <h3 className="font-display text-ink text-base font-semibold sm:text-[1.0625rem]">
                  {faq.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="border-line text-ink-400 group-open:bg-signal group-open:border-transparent relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors group-open:text-page"
                >
                  <span className="absolute h-[1.5px] w-3 rounded bg-current" />
                  <span className="absolute h-3 w-[1.5px] rounded bg-current transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="text-ink-500 px-5 pb-5 text-[0.9375rem] leading-relaxed sm:px-6 sm:pb-6">
                {faq.a}
              </p>
            </details>
          </li>
        ))}
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Related services                                                           */
/* -------------------------------------------------------------------------- */

export function RelatedServices({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {services.map((service, i) => {
        const accent = ACCENT[service.accent];
        return (
          <li key={service.slug} style={staggerStyle(i)}>
            <Link
              href={`/${service.slug}`}
              className="lift spot-edge card-sweep group bg-surface border-line rounded-card hover:border-line-strong flex h-full items-start gap-3.5 border p-5"
            >
              <span
                className={cx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  accent.bg,
                  accent.text,
                )}
              >
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="font-display text-ink group-hover:text-brand-700 block font-semibold transition-colors">
                  {service.nav}
                </span>
                <span className="text-ink-400 mt-1 block text-sm leading-snug">
                  {service.summary}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing CTA                                                                */
/* -------------------------------------------------------------------------- */

/** PRD §14 — "Tell us what you're building", with verified contact options. */
export function CtaSection({
  title = "Tell Aivorraa what you're building",
  lede = "Describe the project in a couple of lines. You will get a straight answer on approach, rough range and timeline — including when the honest recommendation is to fix what you already have.",
  primaryLabel = "Start a project",
}: {
  title?: string;
  lede?: string;
  primaryLabel?: string;
}) {
  return (
    <Section>
      <Container>
        <div className="sd-settle scope-dark bg-panel border-line rounded-card cta-grid relative overflow-hidden border px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute -top-28 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(var(--glow-rgb),0.18),transparent)]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 left-1/2 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(var(--accent-rgb),0.2),transparent)]"
          />
          {/* The monogram draws itself behind the closing line, once, when
              the panel scrolls into view. */}
          <MonogramVideo className="cta-mono" />
          <Reveal className="relative mx-auto max-w-2xl">
            <h2 className="text-[2rem] text-ink sm:text-[2.75rem]">
              {title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/65">{lede}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/contact"
                variant="primary"
                size="lg"
                withArrow
                className="shine"
              >
                {primaryLabel}
              </ButtonLink>
              <ButtonLink
                href={`mailto:${CONTACT.email}`}
                variant="ghostLight"
                size="lg"
              >
                {CONTACT.email}
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink/55">
              {CONTACT.hours} &middot; {CONTACT.serviceArea}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* Re-exported for convenience in page files. */
export { Card, Container, Section, SectionHeading };
