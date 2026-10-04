import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { LeadForm } from "@/components/sections/LeadForm";
import { Card, JsonLd } from "@/components/ui";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/icons";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  localBusinessSchema,
  schemaGraph,
} from "@/lib/schema";
import { CONTACT, SOCIAL_PROFILES } from "@/lib/site-config";

/**
 * PRD §13 — /contact/ is one of the two HIGHEST-priority pages, because it
 * carries entity signals (name, address, phone) rather than for traffic.
 *
 * PRD §19 — every published channel must be verified and tested. Phone and
 * WhatsApp are rendered only when site-config holds a verified number (§29),
 * so an untested channel cannot appear here.
 */
export const metadata: Metadata = buildMetadata({
  // 41 chars.
  title: "Contact Aivorraa — Start Your Project",
  description:
    "Tell Aivorraa what you are building and get a straight answer on approach, rough range and timeline. Email, WhatsApp or send a project brief.",
  path: "contact",
});

const EXPECTATIONS = [
  {
    title: "A reply within one working day",
    body: "Usually sooner. If your enquiry is outside what Aivorraa delivers, you will be told that plainly rather than pulled into a call.",
  },
  {
    title: "A short discovery conversation",
    body: "Twenty to thirty minutes on what you need, what exists already and what is in the way. No deck, no pitch.",
  },
  {
    title: "A written scope, then a quote",
    body: "Deliverables, exclusions, revision limits, third-party costs, milestones and payment terms in writing before anything is committed.",
  },
];

export default function ContactPage() {
  const instagram = SOCIAL_PROFILES.find((p) => p.key === "instagram");

  return (
    <>
      {/* PRD §16 — Organization is emitted site-wide by the root layout.
          LocalBusiness appears here only once a verified address exists. */}
      <JsonLd
        json={schemaGraph(
          localBusinessSchema(),
          breadcrumbSchema([{ name: "Contact", path: "contact" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
        <PageHeader
          eyebrow="Contact"
          title="Tell Aivorraa what you're building"
          lede="A couple of lines is enough to start. The more specific you are about the problem, the more useful the first reply will be."
        />
      </Container>

      <Section className="pt-8 sm:pt-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
            <div>
              <LeadForm />
            </div>

            <div className="grid gap-4 self-start">
              <Card>
                <h2 className="font-display text-ink text-base font-normal">
                  Direct channels
                </h2>
                <ul className="mt-4 grid gap-3.5 text-sm">
                  <li>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-ink-600 hover:text-ink inline-flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <MailIcon className="text-ink-400 h-4 w-4 shrink-0" />
                      {CONTACT.email}
                    </a>
                  </li>

                  {/* §29 — rendered only once a verified business number exists. */}
                  {CONTACT.phone ? (
                    <li>
                      <a
                        href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                        className="text-ink-600 hover:text-ink font-medium transition-colors"
                      >
                        {CONTACT.phone}
                      </a>
                    </li>
                  ) : null}

                  {CONTACT.whatsapp ? (
                    <li>
                      <a
                        href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
                          "Hi Aivorraa, I'd like to discuss a project.",
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-600 hover:text-ink inline-flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <WhatsAppIcon className="text-ink-400 h-4 w-4 shrink-0" />
                        WhatsApp
                      </a>
                    </li>
                  ) : null}

                  {instagram?.verified && instagram.url ? (
                    <li>
                      <a
                        href={instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-600 hover:text-ink inline-flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <InstagramIcon className="text-ink-400 h-4 w-4 shrink-0" />
                        @aivorraa.official
                      </a>
                    </li>
                  ) : null}
                </ul>

                <dl className="border-line mt-6 grid gap-3 border-t pt-5 text-sm">
                  <div>
                    <dt className="text-ink-400 text-xs">
                      Hours
                    </dt>
                    <dd className="text-ink-600 mt-1">{CONTACT.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-400 text-xs">
                      Areas served
                    </dt>
                    <dd className="text-ink-600 mt-1">{CONTACT.serviceArea}</dd>
                  </div>
                  {CONTACT.address ? (
                    <div>
                      <dt className="text-ink-400 text-xs">
                        Office
                      </dt>
                      <dd className="text-ink-600 mt-1">
                        {CONTACT.address.street}
                        <br />
                        {CONTACT.address.locality}, {CONTACT.address.region}{" "}
                        {CONTACT.address.postalCode}
                        <br />
                        {CONTACT.address.country}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </Card>

              <Card>
                <h2 className="font-display text-ink text-base font-normal">
                  What happens next
                </h2>
                <ol className="mt-4 grid gap-4">
                  {EXPECTATIONS.map((item, i) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="bg-ink-50 text-ink-500 font-display flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-normal">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-ink text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-ink-500 mt-1 text-sm leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Before you write"
            title="Three things that make the first reply more useful"
            lede="None of these are required — but if you already know them, including them saves a round trip."
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                title: "The problem, not the solution",
                body: "“Enquiries dropped after we changed the site” is more useful than “we need a redesign”, because it points at a cause.",
              },
              {
                title: "What already exists",
                body: "A current site, brand files, content, analytics access — anything that exists changes both the approach and the cost.",
              },
              {
                title: "Your actual constraint",
                body: "Budget, a launch date, a board meeting. Knowing the real constraint means the proposal is built around it rather than ignoring it.",
              },
            ].map((item) => (
              <Card as="li" key={item.title} className="h-full">
                <h3 className="font-display text-ink text-[0.9375rem] font-normal">
                  {item.title}
                </h3>
                <p className="text-ink-500 mt-2 text-sm leading-relaxed">
                  {item.body}
                </p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
