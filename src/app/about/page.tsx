import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  PageHeader,
  Section,
  SectionHeading,
  ServiceGrid,
} from "@/components/sections/common";
import { ButtonLink, Card, JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";
import { Icon } from "@/components/icons";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  localBusinessSchema,
  personSchema,
  schemaGraph,
} from "@/lib/schema";
import {
  CONTACT,
  ORGANISATION,
  SITE,
  VERIFIED_PROFILES,
} from "@/lib/site-config";

/**
 * PRD §13 — /about/ is one of the two HIGHEST-priority pages on the site, "not
 * because of traffic potential" but because it carries the entity signals from
 * PRD §3.
 *
 * PRD §3.5 — "An About page that states the entity plainly: legal name,
 * founding year, location, what the company does. Google extracts entity data
 * from this."
 *
 * Every entity fact below is rendered from site-config and only when verified.
 * The legal name, founding year and address are currently null (PRD §29), so
 * they are omitted rather than guessed. Filling them in site-config publishes
 * them here AND in Organization / LocalBusiness / Person schema at once — which
 * is the single highest-value edit available on this site.
 */
export const metadata: Metadata = buildMetadata({
  // 47 chars.
  title: "About Aivorraa — Digital Agency in Delhi NCR",
  description:
    "Aivorraa is a full-stack digital agency building websites, apps and AI automation for growing businesses. Founded by Aditya Gupta. Serving Delhi NCR.",
  path: "about",
});

const PRINCIPLES = [
  {
    icon: "search" as const,
    title: "Diagnose before prescribing",
    body: "Aivorraa audits what exists — the site, its URLs, its index coverage, its metadata — before recommending anything. A rebuild is sometimes the right answer and often is not, and you are entitled to hear which.",
  },
  {
    icon: "shield" as const,
    title: "Publish only what is verifiable",
    body: "No invented statistics, no fabricated reviews, no unsupported superlatives, and no structured data describing something that is not genuinely on the page. If a claim cannot be evidenced, it does not ship.",
  },
  {
    icon: "layers" as const,
    title: "Build systems, not one-offs",
    body: "Design tokens, component systems and documented content structures, so the twentieth page still looks like the first and the next change does not require a specialist.",
  },
  {
    icon: "bolt" as const,
    title: "Hand over completely",
    body: "Domain, hosting, analytics and Search Console live in accounts the client owns — never a contractor's personal login. Source, files and documentation transfer on completion.",
  },
];

export default function AboutPage() {
  const hasEntityFacts =
    SITE.legalName !== null ||
    ORGANISATION.foundingDate !== null ||
    CONTACT.address !== null;

  return (
    <>
      {/* PRD §16 — Person (the founder entity, linked to the organisation by
          @id), BreadcrumbList, and LocalBusiness only once an address is
          verified. Organization itself is emitted site-wide by the root
          layout, so it is not repeated here. */}
      <JsonLd
        json={schemaGraph(
          personSchema(),
          localBusinessSchema(),
          breadcrumbSchema([{ name: "About", path: "about" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "About", path: "/about" }]} />
        <PageHeader
          eyebrow="About"
          title="Aivorraa builds the digital side of growing businesses"
          lede={`${SITE.proposition} Founded by ${ORGANISATION.founder}, working with clients across ${CONTACT.serviceArea}.`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
              Start a conversation
            </ButtonLink>
            <ButtonLink href="/services" variant="outline" size="lg">
              See all services
            </ButtonLink>
          </div>
        </PageHeader>
      </Container>

      {/* ----------------------------------------------------------------- */}
      {/* The entity, stated plainly (PRD §3.5)                             */}
      {/* ----------------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Who Aivorraa is"
                title="A digital agency, stated plainly"
              />
              <div className="prose-aivorraa mt-7 max-w-none">
                <p>
                  Aivorraa is a digital agency operating under the brand
                  Aivorraa&trade;, founded by {ORGANISATION.founder}. It builds
                  websites and web applications, designs interfaces, develops
                  Android and iOS apps, automates business workflows, and runs
                  search and marketing programmes for growing businesses.
                </p>
                <p>
                  The work is organised around eight services rather than a
                  broad menu. Aivorraa is building toward a wider multi-sector
                  group — interiors, project management consultancy and
                  construction are part of the longer plan — but a service only
                  reaches this website once it is operational, properly
                  qualified, and has a completed project behind it. Publishing a
                  capability before then would be claiming something that cannot
                  be evidenced.
                </p>
                <p>
                  Most clients arrive with one of two problems. Either they
                  cannot be found — their pages are not indexed, their brand
                  name returns somebody else&apos;s company, and their own
                  social profile outranks their website — or they can be found
                  and the site does not convert the attention into enquiries.
                  Both are diagnosable, and the diagnosis comes before the
                  proposal.
                </p>
                <p>
                  Aivorraa works with startups and SMEs, retail and e-commerce
                  businesses, professional services firms, and
                  operations-heavy businesses that have outgrown running on
                  spreadsheets. Engagements range from a single scoped build to
                  an ongoing retainer, and every one starts with a written scope
                  listing deliverables, exclusions, revision limits and payment
                  terms.
                </p>
              </div>
            </div>

            {/* Entity facts panel. Only verified values are rendered. */}
            <div className="lg:pt-20">
              <Card className="rise rise-5">
                <h2 className="font-display text-ink text-base font-normal">
                  Company details
                </h2>
                <dl className="mt-5 grid gap-4 text-sm">
                  <Fact label="Brand">Aivorraa&trade;</Fact>
                  {SITE.legalName ? (
                    <Fact label="Registered name">{SITE.legalName}</Fact>
                  ) : null}
                  <Fact label="Founder">
                    {ORGANISATION.founder}, {ORGANISATION.founderRole}
                  </Fact>
                  {ORGANISATION.foundingDate ? (
                    <Fact label="Founded">{ORGANISATION.foundingDate}</Fact>
                  ) : null}
                  {CONTACT.address ? (
                    <Fact label="Registered address">
                      {CONTACT.address.street}, {CONTACT.address.locality},{" "}
                      {CONTACT.address.region} {CONTACT.address.postalCode},{" "}
                      {CONTACT.address.country}
                    </Fact>
                  ) : null}
                  {ORGANISATION.gstin ? (
                    <Fact label="GSTIN">{ORGANISATION.gstin}</Fact>
                  ) : null}
                  <Fact label="Areas served">{CONTACT.serviceArea}</Fact>
                  <Fact label="Website">{SITE.domain}</Fact>
                  <Fact label="Email">
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-brand-700 hover:underline"
                    >
                      {CONTACT.email}
                    </a>
                  </Fact>
                  {CONTACT.phone ? (
                    <Fact label="Phone">
                      <a
                        href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                        className="text-brand-700 hover:underline"
                      >
                        {CONTACT.phone}
                      </a>
                    </Fact>
                  ) : null}
                  {VERIFIED_PROFILES.length > 0 ? (
                    <Fact label="Profiles">
                      <span className="grid gap-1">
                        {VERIFIED_PROFILES.map((p) => (
                          <a
                            key={p.key}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-700 hover:underline"
                          >
                            {p.label}
                          </a>
                        ))}
                      </span>
                    </Fact>
                  ) : null}
                </dl>

                {!hasEntityFacts ? (
                  <p className="border-line text-ink-400 mt-6 border-t pt-5 text-xs leading-relaxed">
                    Registered entity details are published here as soon as they
                    are confirmed.
                  </p>
                ) : null}
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* How Aivorraa works                                                */}
      {/* ----------------------------------------------------------------- */}
      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Principles"
            title="Four things that do not change per project"
            lede="These are commitments about method rather than claims about results, which means they are Aivorraa's to keep."
          />
          <Reveal as="ul" mode="group" className="mt-12 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle, i) => (
              <Card
                as="li"
                key={principle.title}
                style={staggerStyle(i)}
                className="h-full"
              >
                <span className="bg-brand-50 text-brand-700 mb-4 flex h-11 w-11 items-center justify-center rounded-2xl">
                  <Icon name={principle.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-ink text-[1.0625rem] font-normal">
                  {principle.title}
                </h3>
                <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
                  {principle.body}
                </p>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What Aivorraa delivers"
            lede="Eight services, each with its own scoped page."
          />
          <div className="mt-12">
            <ServiceGrid />
          </div>
        </Container>
      </Section>

      <CtaSection title="Work with Aivorraa" />
    </>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-ink-400 text-xs">
        {label}
      </dt>
      <dd className="text-ink-600 mt-1">{children}</dd>
    </div>
  );
}
