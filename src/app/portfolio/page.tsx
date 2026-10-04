import Link from "next/link";
import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { ButtonLink, Card, JsonLd } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { PUBLISHED_CASE_STUDIES } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, schemaGraph } from "@/lib/schema";
import { PortfolioFilters } from "./PortfolioFilters";

/**
 * PRD §13 — /portfolio/ is a high-priority route with filterable case studies.
 *
 * PRD §17 — every case study requires written client permission and confirmed
 * role before publication. PUBLISHED_CASE_STUDIES is therefore empty at launch
 * and this page renders an honest explanation of the standard instead of a
 * logo wall. That is a deliberate choice: "four well-documented case studies at
 * launch are worth more than ten logos with no detail."
 *
 * Adding an approved entry to src/content/portfolio.ts switches this page to
 * the filterable grid automatically — no code change needed here.
 */
export const metadata: Metadata = buildMetadata({
  // 48 chars.
  title: "Our Work — Web, App & Brand Projects | Aivorraa",
  description:
    "Case studies of Aivorraa's web, app, automation and brand work — each stating the exact role, scope and documented outcomes. Filter by service.",
  path: "portfolio",
});

/** PRD §17 — what a complete, publishable case study must contain. */
const CASE_STUDY_STANDARD = [
  "Title, client name where permitted, industry, location, year and service category",
  "The brief and the problem, in the client's terms",
  "Aivorraa's exact role, scope and constraints — including what Aivorraa did not do",
  "Approach and the deliverables actually handed over",
  "Timeline and measurable outcomes, only where documented and approved, with the timeframe and source stated",
  "Screenshots, photography, renders and logos, used with written permission",
];

export default function PortfolioPage() {
  const hasWork = PUBLISHED_CASE_STUDIES.length > 0;

  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([{ name: "Portfolio", path: "portfolio" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Portfolio", path: "/portfolio" }]} />
        <PageHeader
          eyebrow="Work"
          title={hasWork ? "Selected work" : "Work, documented properly"}
          lede={
            hasWork
              ? "Each case study states Aivorraa's exact role and scope. Outcomes appear only where they are documented and the client has approved them, with the timeframe and source named."
              : "There is no logo wall on this page, and that is deliberate. A case study is published here only once the client has given written permission and Aivorraa's exact role on the project is confirmed."
          }
        />
      </Container>

      {hasWork ? (
        <Section className="pt-8">
          <Container>
            <PortfolioFilters caseStudies={PUBLISHED_CASE_STUDIES} />
          </Container>
        </Section>
      ) : (
        <>
          <Section className="pt-8">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <div>
                  <SectionHeading
                    eyebrow="The standard"
                    title="What gets published here"
                    lede="Anything less than this is a logo, not evidence — and a logo tells you nothing about whether Aivorraa can solve your problem."
                  />
                  <ul className="mt-8 grid gap-3">
                    {CASE_STUDY_STANDARD.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="bg-lime-100 text-lime-600 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                        <span className="text-ink-600 text-[0.9375rem] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="h-fit lg:mt-16">
                  <h2 className="font-display text-ink text-lg font-normal">
                    In the meantime
                  </h2>
                  <p className="text-ink-500 mt-3 leading-relaxed">
                    Aivorraa can walk you through relevant work directly,
                    including projects that cannot be published publicly. If you
                    describe what you are building, you will be shown the
                    closest comparable work and told plainly what Aivorraa&apos;s
                    role on it was.
                  </p>
                  <p className="text-ink-500 mt-4 leading-relaxed">
                    You can also read how each service is actually scoped —
                    deliverables, exclusions, process and pricing model are
                    written out on every service page, which is usually more
                    useful than a screenshot.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink href="/contact" variant="primary" withArrow>
                      Ask about relevant work
                    </ButtonLink>
                    <ButtonLink href="/services" variant="outline">
                      Read the service pages
                    </ButtonLink>
                  </div>
                </Card>
              </div>
            </Container>
          </Section>

          <Section tone="surface">
            <Container>
              <SectionHeading
                align="center"
                eyebrow="Why it matters"
                title="Published claims have to be true"
                lede="Unverified client logos, borrowed screenshots and outcome figures with no source are common in this industry. They are also a legal exposure and, increasingly, a search liability. Aivorraa applies the same standard to its own site that it applies to client sites — which is the only way that standard means anything."
              />
              <div className="mt-8 flex justify-center">
                <Link
                  href="/about"
                  className="link-line text-ink text-sm font-medium"
                >
                  How Aivorraa works
                </Link>
              </div>
            </Container>
          </Section>
        </>
      )}

      <CtaSection />
    </>
  );
}
