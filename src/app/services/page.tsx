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
import { ACCENT, ButtonLink, Card, JsonLd, cx } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";
import { ArrowRightIcon, CheckIcon, Icon } from "@/components/icons";
import { SERVICES, SERVICE_GROUPS, getService } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, schemaGraph } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  // 48 chars.
  title: "Services — Web, App, AI & Marketing | Aivorraa",
  description:
    "Nine services Aivorraa delivers: web and app development, UI/UX, AI automation, SEO and ads, marketing, branding, video and interior design.",
  path: "services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([{ name: "Services", path: "services" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Services", path: "/services" }]} />
        <PageHeader
          eyebrow="Service universe"
          title="Everything Aivorraa delivers today"
          lede="Nine services, grouped by what they are for. Each has its own page with deliverables, exclusions, process, pricing model and FAQs — because a one-line service list tells you nothing about whether it fits."
        >
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
              Start Your Project
            </ButtonLink>
            <ButtonLink href="/portfolio" variant="outline" size="lg">
              View work
            </ButtonLink>
          </div>
        </PageHeader>
      </Container>

      {SERVICE_GROUPS.map((group, groupIndex) => (
        <Section
          key={group.label}
          tone={groupIndex % 2 === 1 ? "surface" : "plain"}
        >
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow={`0${groupIndex + 1} — ${group.label}`}
                title={group.blurb}
              />
            </Reveal>
            <Reveal as="ul" mode="group" className="mt-12 grid gap-4 lg:grid-cols-2">
              {group.slugs.map((slug, cardIndex) => {
                const service = getService(slug);
                if (!service) return null;
                const accent = ACCENT[service.accent];
                return (
                  <Card
                    as="li"
                    key={slug}
                    style={staggerStyle(cardIndex)}
                    className="group h-full"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cx(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                          accent.bg,
                          accent.text,
                        )}
                      >
                        <Icon name={service.icon} className="h-6 w-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-ink text-xl font-normal">
                          <Link
                            href={`/${slug}`}
                            className="link-draw"
                          >
                            {service.name}
                          </Link>
                        </h3>
                        <p className="text-ink-500 mt-2.5 text-[0.9375rem] leading-relaxed">
                          {service.lede}
                        </p>

                        {/* Three representative deliverables, so the hub is
                            genuinely useful rather than a link list. */}
                        <ul className="mt-5 grid gap-2">
                          {service.deliverables.included
                            .slice(0, 3)
                            .map((item) => (
                              <li
                                key={item.title}
                                className="flex items-start gap-2.5"
                              >
                                <span className="text-lime-600 mt-0.5 shrink-0">
                                  <CheckIcon
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                  />
                                </span>
                                <span className="text-ink-600 text-sm">
                                  {item.title}
                                </span>
                              </li>
                            ))}
                        </ul>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-ink-400 text-xs">
                            {service.pricing.model}
                          </span>
                          <Link
                            href={`/${slug}`}
                            className="link-draw text-ink inline-flex items-center gap-1.5 text-sm font-medium"
                          >
                            Full details
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Reveal>
          </Container>
        </Section>
      ))}

      {/*
        PRD §4 and §6 — the eleven-vertical umbrella architecture is
        deliberately not presented as a service menu. This section explains the
        scope honestly instead of shipping "Coming Soon" pages, which lose trust
        and read to Google as an unfocused site.
      */}
      <Section>
        <Container>
          <Reveal className="border-line rounded-card mx-auto max-w-3xl border border-dashed p-8 sm:p-10">
            <h2 className="font-display text-ink text-2xl font-normal">
              Why only {SERVICES.length} services?
            </h2>
            <p className="text-ink-500 mt-4 leading-relaxed">
              Aivorraa is building toward a broader multi-sector group.
              Interior design is now part of the offer; project management
              consultancy and construction are part of the longer plan. They
              are not listed here because publishing a service page before the
              qualifications, licensing, insurance and contracting model are
              confirmed would mean claiming capability that cannot yet be
              evidenced.
            </p>
            <p className="text-ink-500 mt-4 leading-relaxed">
              Each becomes a full page when it is operational and has a
              completed project to reference. Until then, a few pages with
              genuine depth are worth more than sixty shallow ones — to you when
              you are deciding, and to Google when it is assessing whether this
              site knows what it is talking about.
            </p>
            <div className="mt-7">
              <ButtonLink href="/about" variant="outline" withArrow>
                How Aivorraa works
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
