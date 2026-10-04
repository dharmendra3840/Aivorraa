import Link from "next/link";
import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  PageHeader,
  Section,
} from "@/components/sections/common";
import { ButtonLink, Card, JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRightIcon, Icon } from "@/components/icons";
import { INDUSTRIES } from "@/content/industries";
import { getService } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, schemaGraph } from "@/lib/schema";

/** PRD §13 — /industries/ is a low-priority route but a useful entry path. */
export const metadata: Metadata = buildMetadata({
  // 49 chars.
  title: "Industries Aivorraa Works With | Digital Agency",
  description:
    "Startups and SMEs, retail and e-commerce, professional services and operations-heavy businesses — the problems Aivorraa is built to solve.",
  path: "industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([{ name: "Industries", path: "industries" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Industries", path: "/industries" }]} />
        <PageHeader
          eyebrow="Industries"
          title="Four kinds of business, four different problems"
          lede="Aivorraa groups clients by the problem rather than the sector, because the problem is what you recognise when you read it. Each one maps to a different starting point."
        />
      </Container>

      <Section className="pt-8">
        <Container>
          <div className="grid gap-5">
            {INDUSTRIES.map((industry, i) => (
              <Reveal key={industry.slug}>
              <Card as="article">
                <div id={industry.slug} className="grid gap-6 lg:grid-cols-[auto_1fr_16rem] lg:gap-10">
                  <span className="bg-ink-50 text-ink-600 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                    <Icon name={industry.icon} className="h-6 w-6" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-ink-400 text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-display text-ink mt-1.5 text-2xl font-normal">
                      {industry.name}
                    </h2>
                    <p className="text-ink-700 mt-3 text-lg leading-relaxed font-medium">
                      {industry.problem}
                    </p>
                    <p className="text-ink-500 mt-3.5 leading-relaxed">
                      {industry.body}
                    </p>
                  </div>

                  <div className="border-line lg:border-l lg:pl-8">
                    <p className="text-ink-400 text-xs">
                      Usually starts with
                    </p>
                    <ul className="mt-3.5 grid gap-2">
                      {industry.services.map((slug) => {
                        const service = getService(slug);
                        if (!service) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/${slug}`}
                              className="group text-ink-600 hover:text-ink inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                            >
                              {service.nav}
                              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Card>
              </Reveal>
            ))}
          </div>

          <Reveal className="border-line rounded-card mt-8 border border-dashed p-8 text-center">
            <h2 className="font-display text-ink text-xl font-normal">
              Not one of these?
            </h2>
            <p className="text-ink-500 mx-auto mt-3 max-w-xl leading-relaxed">
              These four cover most of what Aivorraa is asked for, but the
              method does not change with the sector. Describe the problem and
              you will get an honest answer about whether this is the right
              place to solve it.
            </p>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/contact" variant="outline" withArrow>
                Describe your problem
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
