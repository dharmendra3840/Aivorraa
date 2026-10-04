import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  DeliverablesList,
  FaqList,
  PageHeader,
  ProcessSteps,
  RelatedServices,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { ACCENT, ButtonLink, Card, Chip, JsonLd, cx } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";
import { ArrowRightIcon, Icon } from "@/components/icons";
import { Photo } from "@/components/media/Photo";
import { SERVICE_MEDIA } from "@/content/media";
import {
  SERVICES,
  SERVICE_SLUGS,
  getRelatedServices,
  getService,
} from "@/content/services";
import { PUBLISHED_CASE_STUDIES } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqSchema,
  schemaGraph,
  serviceSchema,
} from "@/lib/schema";

/**
 * The eight launch service pages (PRD §6, §13).
 *
 * One template, eight flat top-level URLs — /web-development/, /ui-ux-design/
 * and so on — exactly as the PRD's URL map specifies, so existing crawl history
 * is preserved.
 *
 * `dynamicParams = false` means only the eight generated slugs resolve; any
 * other path falls through to the static routes (/about, /contact, …) or 404s.
 * This is what stops a deferred vertical being reachable by guessing a URL.
 *
 * Page structure follows the PRD §15 service page template exactly:
 *   H1 → who this is for → what you get → how it works → selected work →
 *   pricing model → FAQs → related services. Minimum 800 words per page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

type Params = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.title,
    description: service.description,
    path: service.slug,
  });
}

export default async function ServicePage({ params }: Params) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.slug);
  const accent = ACCENT[service.accent];

  // PRD §15.5 — selected work, linking to two or three case studies. Only
  // approved case studies exist, so this section adapts rather than showing
  // placeholder logos (PRD §17).
  const work = PUBLISHED_CASE_STUDIES.filter((c) =>
    c.categories.includes(service.slug),
  ).slice(0, 3);

  return (
    <>
      {/* PRD §16 — Service + FAQPage + BreadcrumbList on every service page.
          No Service schema exists for deferred verticals because they are not
          in SERVICES and therefore cannot be rendered. */}
      <JsonLd
        json={schemaGraph(
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: "Services", path: "services" },
            { name: service.nav, path: service.slug },
          ]),
        )}
      />

      <Container>
        <Breadcrumbs
          trail={[
            { name: "Services", path: "/services" },
            { name: service.nav, path: `/${service.slug}` },
          ]}
        />

        <PageHeader
          eyebrow={service.name}
          title={service.h1}
          lede={service.lede}
        >
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
              Get a quote
            </ButtonLink>
            <ButtonLink href="#faqs" variant="link">
              Read the FAQs
            </ButtonLink>
          </div>
        </PageHeader>

        {/* The reference's project-page opening: one large photograph, with
            the at-a-glance panel beside it. The photo is illustrative. */}
        <div className="mt-12 grid items-stretch gap-5 lg:mt-16 lg:grid-cols-[1.7fr_1fr]">
          <Photo
            id={SERVICE_MEDIA[service.slug] ?? "svc-web"}
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="rounded-card aspect-[16/10] lg:aspect-auto lg:min-h-[30rem]"
            priority
            reveal={false}
          />

          {/* Keyword and at-a-glance panel */}
          <Card className="rise rise-5">
            <span
              className={cx(
                "bg-page mb-6 flex h-11 w-11 items-center justify-center rounded-full",
                accent.text,
              )}
            >
              <Icon name={service.icon} className="h-5 w-5" />
            </span>
            <h2 className="text-2xl">At a glance</h2>
            <dl className="mt-4 grid gap-3.5 text-sm">
              <div>
                <dt className="text-ink-400 text-xs">
                  Pricing model
                </dt>
                <dd className="text-ink-600 mt-1">{service.pricing.model}</dd>
              </div>
              <div>
                <dt className="text-ink-400 text-xs">
                  Deliverables
                </dt>
                <dd className="text-ink-600 mt-1">
                  {service.deliverables.included.length} scoped items, with
                  exclusions stated
                </dd>
              </div>
              <div>
                <dt className="text-ink-400 text-xs">
                  Also covers
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {service.secondaryKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="bg-page text-ink-600 rounded-[0.3rem] px-2 py-1 text-[0.6875rem] font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </Container>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Who this is for — framed as the client's problem (PRD §15.2)   */}
      {/* ----------------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Fit"
              title={service.who.heading}
              lede={service.who.intro}
            />
            <Reveal as="ul" mode="group" className="grid gap-3">
              {service.who.items.map((item, i) => (
                <li
                  key={item}
                  style={staggerStyle(i)}
                  className="bg-surface border-line rounded-card flex items-start gap-3.5 border p-5"
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      "mt-2 h-2 w-2 shrink-0 rounded-full",
                      accent.dot,
                    )}
                  />
                  <p className="text-ink-600 text-[0.9375rem] leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* 3. What you get (PRD §15.3)                                       */}
      {/* ----------------------------------------------------------------- */}
      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Scope"
            title={service.deliverables.heading}
            lede={service.deliverables.intro}
          />
          <div className="mt-12">
            <DeliverablesList
              included={service.deliverables.included}
              excluded={service.deliverables.excluded}
            />
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* 4. How it works (PRD §15.4)                                       */}
      {/* ----------------------------------------------------------------- */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            lede="Each stage has a defined output and an approval point, so you always know what is being decided and by whom."
          />
          <div className="mt-12">
            <ProcessSteps steps={service.process} />
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Selected work (PRD §15.5)                                      */}
      {/* ----------------------------------------------------------------- */}
      <Section tone="surface">
        <Container>
          {work.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Selected work"
                title={`${service.nav} projects`}
                lede="Each case study states Aivorraa's exact role and scope, with outcomes shown only where documented and approved."
              />
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {work.map((study) => (
                  <Card as="li" key={study.slug}>
                    <p className="text-ink-400 text-xs">
                      {study.industry} &middot; {study.year}
                    </p>
                    <h3 className="font-display text-ink mt-3 text-lg font-normal">
                      <Link
                        href={`/portfolio/${study.slug}`}
                        className="link-draw"
                      >
                        {study.title}
                      </Link>
                    </h3>
                    <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
                      {study.brief}
                    </p>
                  </Card>
                ))}
              </ul>
            </>
          ) : (
            <div className="border-line rounded-card border border-dashed p-8 text-center sm:p-12">
              <SectionHeading
                align="center"
                eyebrow="Selected work"
                title="Case studies are published once permission is in place"
                lede="Aivorraa secures written client permission and confirms its exact role on a project before publishing it. A logo grid with no detail is not evidence, so this section stays empty until a complete case study is approved."
              />
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/contact" variant="outline" withArrow>
                  Ask about relevant work
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* 6. Pricing model (PRD §15.6)                                      */}
      {/* ----------------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading eyebrow="Investment" title="How this is priced" />
            <Reveal>
              <Chip className="mb-6">{service.pricing.model}</Chip>
              <p className="text-ink-600 text-lg leading-relaxed">
                {service.pricing.body}
              </p>
              {service.pricing.note ? (
                <p className="border-line text-ink-500 mt-6 border-l-2 pl-5 text-[0.9375rem] leading-relaxed">
                  {service.pricing.note}
                </p>
              ) : null}
              <div className="mt-8">
                <ButtonLink
                  href="/contact"
                  variant="primary"
                  withArrow
                >
                  Request a scoped quote
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* 7. FAQs (PRD §15.7)                                               */}
      {/* ----------------------------------------------------------------- */}
      <Section id="faqs" tone="surface">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Questions"
            title="Frequently asked"
          />
          <div className="mt-12">
            <FaqList faqs={service.faqs} />
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* 8. Related services (PRD §15.8)                                   */}
      {/* ----------------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Keep reading"
              title="Related services"
              lede="Most projects combine two or three of these."
            />
            <Link
              href="/services"
              className="link-draw text-ink inline-flex items-center gap-1.5 text-sm font-medium"
            >
              All {SERVICES.length} services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <RelatedServices services={related} />
        </Container>
      </Section>

      <CtaSection
        title={`Start a ${service.nav.toLowerCase()} project`}
        primaryLabel="Get a quote"
      />
    </>
  );
}
