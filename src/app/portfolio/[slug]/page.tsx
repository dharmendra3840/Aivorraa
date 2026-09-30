import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { Card, JsonLd } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { PUBLISHED_CASE_STUDIES, getCaseStudy } from "@/content/portfolio";
import { getService } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, schemaGraph } from "@/lib/schema";

/**
 * PRD §13 — /portfolio/[slug]/ individual case study.
 *
 * Only APPROVED case studies are generated (PUBLISHED_CASE_STUDIES filters on
 * both `published` and `permissionOnFile`). With `dynamicParams = false`, a
 * draft or unapproved entry is not reachable by guessing its URL — it 404s.
 * That is the enforcement mechanism for PRD §17's permission requirement.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return buildMetadata({
    title: `${study.title} | Aivorraa`.slice(0, 60),
    description: study.brief.slice(0, 155),
    path: `portfolio/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([
            { name: "Portfolio", path: "portfolio" },
            { name: study.title, path: `portfolio/${study.slug}` },
          ]),
        )}
      />

      <Container>
        <Breadcrumbs
          trail={[
            { name: "Portfolio", path: "/portfolio" },
            { name: study.title, path: `/portfolio/${study.slug}` },
          ]}
        />
        <PageHeader
          eyebrow={`${study.industry} · ${study.year}`}
          title={study.title}
          lede={study.brief}
        />
      </Container>

      <Section className="pt-8">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
            <div>
              {/* PRD §17 — Aivorraa's exact role, scope and constraints. */}
              <SectionHeading eyebrow="Role" title="What Aivorraa did" />
              <p className="text-ink-600 mt-6 text-lg leading-relaxed">
                {study.role}
              </p>

              <h2 className="font-display text-ink mt-12 text-2xl font-semibold">
                Approach
              </h2>
              <ol className="mt-6 grid gap-4">
                {study.approach.map((step, i) => (
                  <li
                    key={step}
                    className="bg-surface border-line rounded-card flex gap-4 border p-5"
                  >
                    <span className="bg-ink-50 text-ink-500 font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-ink-600 text-[0.9375rem] leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              <h2 className="font-display text-ink mt-12 text-2xl font-semibold">
                Deliverables
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {study.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="bg-lime-100 text-lime-600 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="text-ink-600 text-[0.9375rem]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/*
                PRD §17 — outcomes only where documented and approved, with
                timeframe AND source stated. The source is rendered alongside
                every figure, so no number appears without its provenance.
              */}
              {study.outcomes.length > 0 ? (
                <>
                  <h2 className="font-display text-ink mt-12 text-2xl font-semibold">
                    Outcomes
                  </h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {study.outcomes.map((outcome) => (
                      <Card as="li" key={outcome.label}>
                        <p className="font-display text-brand-700 text-3xl font-bold">
                          {outcome.metric}
                        </p>
                        <p className="text-ink-600 mt-1.5 text-sm font-medium">
                          {outcome.label}
                        </p>
                        <p className="text-ink-400 mt-2 text-xs">
                          Source: {outcome.source}
                        </p>
                      </Card>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            <Card className="h-fit">
              <h2 className="font-display text-ink text-base font-semibold">
                Project details
              </h2>
              <dl className="mt-5 grid gap-4 text-sm">
                {study.client ? (
                  <div>
                    <dt className="text-ink-400 text-xs font-semibold tracking-[0.12em] uppercase">
                      Client
                    </dt>
                    <dd className="text-ink-600 mt-1">{study.client}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-ink-400 text-xs font-semibold tracking-[0.12em] uppercase">
                    Industry
                  </dt>
                  <dd className="text-ink-600 mt-1">{study.industry}</dd>
                </div>
                {study.location ? (
                  <div>
                    <dt className="text-ink-400 text-xs font-semibold tracking-[0.12em] uppercase">
                      Location
                    </dt>
                    <dd className="text-ink-600 mt-1">{study.location}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-ink-400 text-xs font-semibold tracking-[0.12em] uppercase">
                    Year
                  </dt>
                  <dd className="text-ink-600 mt-1">{study.year}</dd>
                </div>
                <div>
                  <dt className="text-ink-400 text-xs font-semibold tracking-[0.12em] uppercase">
                    Services
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {study.categories.map((slug) => {
                      const service = getService(slug);
                      return (
                        <Link
                          key={slug}
                          href={`/${slug}`}
                          className="border-line text-ink-500 hover:border-ink-300 hover:text-ink rounded-pill border px-2.5 py-1 text-xs font-medium transition"
                        >
                          {service?.nav ?? slug}
                        </Link>
                      );
                    })}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </Container>
      </Section>

      <CtaSection title="Start a project like this" />
    </>
  );
}
