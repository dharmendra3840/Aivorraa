import Link from "next/link";

import type { Faq, Service } from "@/content/types";
import { SERVICES } from "@/content/services";
import { SERVICE_MEDIA } from "@/content/media";
import {
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
  cx,
} from "@/components/ui";
import { ArrowRightIcon, CheckIcon, MinusIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site-config";
import { Reveal } from "@/components/motion/Reveal";
import { splitWords } from "@/components/motion/SplitWords";
import { staggerStyle } from "@/components/motion/stagger";
import { Photo } from "@/components/media/Photo";

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
    <nav aria-label="Breadcrumb" className="pt-8 sm:pt-10">
      <ol className="text-ink-400 flex flex-wrap items-center gap-2 text-[0.8125rem]">
        <li>
          <Link href="/" className="link-draw hover:text-ink transition-colors">
            Home
          </Link>
        </li>
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-ink-300">
                /
              </span>
              {isLast ? (
                <span className="text-ink" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="link-draw hover:text-ink transition-colors"
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

/**
 * The top of every inner page, in the reference's arrangement: a very large
 * light headline that rises word by word on load, and the lede as a small
 * column to the right.
 */
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
    <div className="pt-14 pb-6 sm:pt-20 lg:pt-24">
      {eyebrow ? (
        <Eyebrow className="rise rise-1">{eyebrow}</Eyebrow>
      ) : null}
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-20">
        {/* PRD §15 — exactly one H1 per page, supplied here. */}
        <h1 className="split-load max-w-5xl text-[2.6rem] sm:text-[3.6rem] lg:text-[4.5rem]">
          {splitWords(title)}
        </h1>
        {lede || children ? (
          <div className="rise rise-3 flex flex-col gap-7 lg:pb-3">
            {lede ? (
              <p className="text-ink-500 max-w-md text-[1.0625rem] leading-relaxed">
                {lede}
              </p>
            ) : null}
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Service grid                                                               */
/* -------------------------------------------------------------------------- */

/** Every service as an image card -- the reference's work-grid treatment. */
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
        "grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {services.map((service, i) => (
        <li key={service.slug} className="sd-enter-soft" style={staggerStyle(i)}>
          <Link href={`/${service.slug}`} className="img-zoom group block" data-cursor-text="View">
            <Photo
              id={SERVICE_MEDIA[service.slug] ?? "svc-web"}
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
              className="rounded-card aspect-[4/5]"
              alt=""
            />
            <span className="mt-5 flex items-baseline justify-between gap-4">
              <span className="text-[1.375rem] font-light tracking-[-0.03em]">
                <span className="link-draw">{service.nav}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-ink-400 font-mono text-xs"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>
            <span className="text-ink-500 mt-2 block text-sm leading-relaxed">
              {service.summary}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Process                                                                    */
/* -------------------------------------------------------------------------- */

/** Numbered stages as ruled rows that brighten as they pass (motion §5). */
export function ProcessSteps({
  steps,
}: {
  steps: Array<{ title: string; body: string }>;
}) {
  return (
    <ol className="border-line border-t">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="lit-row border-line grid gap-3 border-b py-8 sm:grid-cols-[6rem_1fr_1.4fr] sm:gap-10 sm:py-10"
        >
          <span
            aria-hidden="true"
            className="lit-num font-mono text-sm"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-2xl font-light tracking-[-0.03em] sm:text-[1.75rem]">
            {step.title}
          </h3>
          <p className="text-ink-500 max-w-xl leading-relaxed">{step.body}</p>
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
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
      <Reveal as="ul" mode="group" className="grid gap-x-10 sm:grid-cols-2">
        {included.map((item, i) => (
          <li
            key={item.title}
            style={staggerStyle(i)}
            className="border-line border-t py-6"
          >
            <div className="flex items-start gap-3.5">
              <span className="bg-lime-400 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#0f0f0f]">
                <CheckIcon className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-[1.0625rem]">{item.title}</h3>
                <p className="text-ink-500 mt-2 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </Reveal>

      {/* PRD §15.3 — deliverables AND exclusions. Stating what is not included
          is what prevents scope disputes later, so it is given equal weight. */}
      <Reveal className="bg-surface rounded-card h-fit p-7 sm:p-8">
        <h3 className="text-xl">Not included</h3>
        <p className="text-ink-500 mt-1.5 text-sm">
          Stated up front rather than discovered mid-project.
        </p>
        <ul className="mt-5 grid gap-3">
          {excluded.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="text-ink-400 mt-0.5 shrink-0">
                <MinusIcon className="h-4 w-4" />
              </span>
              <span className="text-ink-600 text-sm leading-relaxed">
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
 * Native <details>/<summary> accordion: keyboard accessible and screen-reader
 * correct with no JavaScript (PRD §21 budget). The matching FAQPage schema is
 * emitted by the page (PRD §16).
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Reveal as="ul" mode="group" className="border-line border-t">
        {faqs.map((faq, i) => (
          <li key={faq.q} style={staggerStyle(i)} className="border-line border-b">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 marker:content-none sm:py-7">
                <h3 className="text-lg sm:text-xl">{faq.q}</h3>
                <span
                  aria-hidden="true"
                  className="border-line-strong group-open:bg-ink group-open:text-page relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="text-ink-500 max-w-3xl pb-7 text-[0.9375rem] leading-relaxed">
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
    <ul className="grid gap-5 sm:grid-cols-3">
      {services.map((service, i) => (
        <li key={service.slug} className="sd-enter-soft" style={staggerStyle(i)}>
          <Link href={`/${service.slug}`} className="img-zoom group block" data-cursor-text="View">
            <Photo
              id={SERVICE_MEDIA[service.slug] ?? "svc-web"}
              sizes="(min-width: 640px) 32vw, 100vw"
              className="rounded-card aspect-[16/10]"
              alt=""
            />
            <span className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xl font-light tracking-[-0.03em]">
                <span className="link-draw">{service.nav}</span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
            <span className="text-ink-500 mt-1.5 block text-sm leading-snug">
              {service.summary}
            </span>
          </Link>
        </li>
      ))}
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
    <Section className="!pb-0">
      <Container>
        <div className="border-line grid gap-12 border-t pt-16 sm:pt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20">
          <Reveal>
            <Eyebrow>Next step</Eyebrow>
            <h2 className="text-[2.6rem] sm:text-[3.8rem] lg:text-[5rem]">
              {splitWords(title)}
            </h2>
          </Reveal>
          <Reveal delay={150} className="lg:pb-3">
            <p className="text-ink-500 max-w-md leading-relaxed">{lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
                {primaryLabel}
              </ButtonLink>
              <ButtonLink href={`mailto:${CONTACT.email}`} variant="link">
                {CONTACT.email}
              </ButtonLink>
            </div>
            <p className="text-ink-400 mt-6 text-sm">
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
