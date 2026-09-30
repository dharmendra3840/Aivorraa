import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  PageHeader,
  Section,
} from "@/components/sections/common";
import { JsonLd } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, schemaGraph } from "@/lib/schema";
import { CONTACT, SITE } from "@/lib/site-config";

/**
 * PRD §13 — /terms/ is a REQUIRED route.
 *
 * ⚠ BEFORE LAUNCH: these are website terms of use. They deliberately do NOT
 * attempt to be the client services agreement — PRD §26 lists fees, payment,
 * scope, third-party costs, support, ownership and change control as items to
 * define in the proposal or contract, which is where they belong. Publishing
 * commercial terms here that contradict a signed agreement creates a conflict.
 *
 * This text has NOT been reviewed by a lawyer (PRD §24, §29). Have a qualified
 * practitioner review it, and confirm the governing jurisdiction, before
 * go-live.
 */
export const metadata: Metadata = buildMetadata({
  // 41 chars.
  title: "Terms of Service | Aivorraa",
  description:
    "The terms that apply to using the Aivorraa website, including content ownership, acceptable use, and how project engagements are actually governed.",
  path: "terms",
});

const LAST_UPDATED = "21 September 2026";

export default function TermsPage() {
  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([{ name: "Terms of Service", path: "terms" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Terms of Service", path: "/terms" }]} />
        <PageHeader
          eyebrow={`Last updated ${LAST_UPDATED}`}
          title="Terms of Service"
          lede={`These terms apply to your use of ${SITE.domain}. Project work is governed by a separate written agreement, not by this page.`}
        />
      </Container>

      <Section className="pt-6">
        <Container>
          <div className="prose-aivorraa mx-auto max-w-3xl">
            <h2>What these terms cover</h2>
            <p>
              These terms govern your use of the {SITE.domain} website. By
              browsing the site or submitting an enquiry, you accept them.
            </p>
            <p>
              They do <strong>not</strong> govern project work. Any engagement
              with {SITE.name} is governed by a separate written proposal,
              scope document and agreement covering fees, payment terms,
              deliverables, revision limits, third-party costs, support,
              intellectual property and change control. Where anything on this
              website differs from a signed agreement, the signed agreement
              prevails.
            </p>

            <h2>Information on this site</h2>
            <p>
              The service descriptions, process outlines and indicative ranges
              published here are provided to help you assess fit. They are
              informational and are not an offer capable of acceptance, and they
              do not constitute a quotation. A quotation is issued in writing
              after a discovery conversation and is specific to your
              requirements.
            </p>
            <p>
              Timelines mentioned on this site are planning ranges rather than
              commitments. Actual dates depend on scope sign-off, access,
              content availability, approvals and payment terms, and are agreed
              in the project documentation.
            </p>
            <p>
              Articles published in the insights section are general information
              rather than professional advice for your specific situation.
              Technology, platform pricing and search behaviour change, and an
              article accurate on the day it was published may not remain so.
            </p>

            <h2>No guaranteed outcomes</h2>
            <p>
              {SITE.name} does not guarantee search engine rankings for
              competitive terms, a volume of enquiries or leads, revenue
              outcomes, follower growth, or approval of an application by a
              third-party platform such as an app store. These depend on
              factors outside {SITE.name}&apos;s control, including market
              conditions, competitor activity and the policies of third parties.
              What is committed to is the work itself, defined in the project
              scope.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The content, design, code, text and graphics of this website are
              owned by {SITE.name} or used with permission, and are protected by
              applicable intellectual property law. You may view, download and
              print pages for your own reference. You may not republish,
              reproduce commercially, resell or systematically extract the
              content without written permission.
            </p>
            <p>
              Third-party names, logos and trade marks appearing on this site
              remain the property of their respective owners and are used only
              to identify the relevant technology or platform.
            </p>

            <h2>Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Submit false, misleading or impersonating information through
                any form on this site
              </li>
              <li>
                Use the enquiry form to send unsolicited advertising or bulk
                messages
              </li>
              <li>
                Attempt to gain unauthorised access to the site, its servers or
                any connected system
              </li>
              <li>
                Introduce malicious code, or attempt to disrupt or overload the
                site
              </li>
              <li>
                Scrape or harvest the site by automated means in a way that
                burdens the service
              </li>
            </ul>
            <p>
              {SITE.name} may restrict access where these terms are breached.
            </p>

            <h2>Links to other sites</h2>
            <p>
              This site may link to third-party websites. Those sites are not
              controlled by {SITE.name}, and it takes no responsibility for
              their content, availability or privacy practices. A link is not an
              endorsement.
            </p>

            <h2>Availability</h2>
            <p>
              {SITE.name} aims to keep this website available and accurate but
              does not guarantee uninterrupted availability. The site may be
              unavailable during maintenance or because of circumstances outside
              its control, and content may be changed or removed at any time.
            </p>

            <h2>Liability</h2>
            <p>
              To the extent permitted by law, {SITE.name} is not liable for
              indirect or consequential loss, loss of profit, loss of business
              or loss of data arising from your use of this website or from
              reliance on information published on it. Nothing in these terms
              excludes liability that cannot lawfully be excluded.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              These terms may be updated. The &ldquo;last updated&rdquo; date at
              the top will change when they are, and the version in force is the
              one published here at the time you use the site.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of India, and the courts of
              India have jurisdiction over any dispute arising from them.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms should go to{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
