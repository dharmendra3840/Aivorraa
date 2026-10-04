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
 * PRD §13 — /privacy-policy/ is a REQUIRED route.
 * PRD §24 — "Publish accurate privacy, terms and cookie disclosures based on
 * actual data flows; obtain legal review for applicable jurisdictions."
 *
 * ⚠ BEFORE LAUNCH: this text describes the data flows this codebase actually
 * implements — the enquiry form (name, email, phone, company, service, budget,
 * timeline, location, message) delivered by email, plus analytics only if
 * configured. It has NOT been reviewed by a lawyer. PRD §29 lists legal review
 * and the registered entity details as open items. Have a qualified
 * practitioner review this against DPDP Act 2023 obligations, and fill in the
 * legal entity name and address in site-config, before go-live.
 *
 * If you add a tool that sets cookies or processes personal data — a chat
 * widget, heatmaps, a CRM, remarketing pixels — this page must be updated in
 * the same change. An inaccurate policy is worse than a thin one.
 */
export const metadata: Metadata = buildMetadata({
  // 38 chars.
  title: "Privacy Policy | Aivorraa",
  description:
    "How Aivorraa collects, uses, stores and deletes the information you provide through this website, and how to request access or deletion.",
  path: "privacy-policy",
});

const LAST_UPDATED = "27 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([
            { name: "Privacy Policy", path: "privacy-policy" },
          ]),
        )}
      />

      <Container>
        <Breadcrumbs
          trail={[{ name: "Privacy Policy", path: "/privacy-policy" }]}
        />
        <PageHeader
          eyebrow={`Last updated ${LAST_UPDATED}`}
          title="Privacy Policy"
          lede={`This policy explains what information ${SITE.name} collects through ${SITE.domain}, why it is collected, how long it is kept and how to have it removed.`}
        />
      </Container>

      <Section className="pt-6">
        <Container>
          <div className="prose-aivorraa mx-auto max-w-3xl">
            <h2>Who this policy covers</h2>
            <p>
              This policy applies to {SITE.domain} and to enquiries made through
              it. {SITE.name} is the data fiduciary for the information
              described below and decides how it is used.
            </p>

            <h2>What is collected, and why</h2>
            <h3>Information you provide in the enquiry form</h3>
            <p>
              When you submit the enquiry form, the following is collected:
              your name, email address, and the description of your project.
              Optionally, if you choose to provide them: phone number, company
              name, the service you are interested in, an indicative budget
              range, a timeline and a location.
            </p>
            <p>
              This is used for one purpose: to respond to your enquiry and, if
              it progresses, to scope and quote the work. It is not sold, rented
              or shared for anyone else&apos;s marketing. You will not be added
              to a mailing list as a result of submitting an enquiry.
            </p>
            <p>
              The form also records the time of submission and the IP address of
              the connection it came from. This is used solely to rate-limit
              submissions and block automated spam, and it is not used to
              profile you.
            </p>

            <h3>Information collected automatically</h3>
            <p>
              The web server records standard request logs, which may include IP
              address, browser user agent, the page requested and the time. These
              are used to operate the site securely and diagnose faults.
            </p>
            <p>
              This site currently runs no analytics, heatmaps or tracking of any
              kind. Should that change, this policy will be updated to say
              exactly what is collected and by whom <em>before</em> it starts.
            </p>

            <h3>Cookies and local storage</h3>
            <p>
              This site sets no advertising or tracking cookies, and runs no
              analytics. The only things it stores in your browser are two
              functional preferences: if you choose &ldquo;Pause motion&rdquo;
              or the dark theme, that choice is remembered on your device so
              it still applies on your next visit. Neither is ever sent
              anywhere. It
              does not use remarketing pixels or cross-site tracking. If
              analytics or any third-party tool that sets cookies is added, this
              section and a cookie notice will be updated to describe it before
              that tool is deployed.
            </p>

            <h2>Who your information is shared with</h2>
            <p>
              Information you submit is shared only with service providers who
              process it on {SITE.name}&apos;s behalf in order to deliver it:
            </p>
            <ul>
              <li>
                The email delivery provider that transmits your enquiry to the{" "}
                {SITE.name} inbox
              </li>
              <li>
                The hosting provider that operates the servers this site runs on
              </li>
            </ul>
            <p>
              Information may also be disclosed where required by law, or to
              protect against fraud or a security threat. It is not otherwise
              disclosed to third parties.
            </p>

            <h2>How long it is kept</h2>
            <p>
              Enquiry correspondence is retained while there is an active
              conversation and for a reasonable period afterwards for business
              records — ordinarily up to twenty-four months from last contact —
              after which it is deleted unless a contract requires it to be kept
              for longer. Spam-prevention records are short-lived and expire
              automatically. Server logs are retained for a limited operational
              period by the hosting provider.
            </p>

            <h2>Files you send</h2>
            <p>
              Where a project brief or file is shared with {SITE.name}, it is
              stored privately and never published or made publicly accessible.
              Access is limited to the people working on your enquiry. You can
              ask for a file to be deleted at any time.
            </p>

            <h2>Your rights</h2>
            <p>
              Under the Digital Personal Data Protection Act, 2023, you can, at
              any time:
            </p>
            <ul>
              <li>Ask what information about you is held, and how it is used</li>
              <li>Ask for it to be corrected, completed or updated</li>
              <li>Ask for it to be erased</li>
              <li>
                Withdraw consent for any future contact &mdash; as easily as it
                was given
              </li>
              <li>
                Nominate someone to exercise these rights on your behalf in the
                event of your death or incapacity
              </li>
              <li>Raise a grievance about how it has been handled</li>
            </ul>
            <p>
              To exercise any of these, email{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Requests
              are acknowledged and actioned within a reasonable period, and you
              will not be charged for making one.
            </p>
            <p>
              If you are not satisfied with how a grievance has been resolved,
              you may complain to the Data Protection Board of India, which
              the Act establishes for that purpose.
            </p>

            <h2>Security</h2>
            <p>
              This site is served over HTTPS. Form input is validated and
              sanitised on the server, submissions are rate-limited, access to
              systems holding enquiry data is restricted to the people who need
              it, and credentials are stored outside the site&apos;s source
              code. No system is perfectly secure, and {SITE.name} does not
              claim otherwise — but if a breach affecting your information
              occurs, you will be told.
            </p>

            <h2>Children</h2>
            <p>
              This site offers business services and is not directed at
              children. {SITE.name} does not knowingly collect information from
              anyone under 18.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              When this policy changes, the &ldquo;last updated&rdquo; date at
              the top changes with it. Where a change materially affects how
              information already collected is used, notice will be given to
              those affected.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy, or about information held about you,
              should go to{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
