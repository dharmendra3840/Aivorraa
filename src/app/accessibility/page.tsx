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
 * Accessibility statement.
 *
 * Standard practice for any site that states a WCAG conformance target, and
 * required outright in some markets (the EU Accessibility Act, from 2025).
 *
 * IT MUST STAY TRUE. Every measure listed below exists in this codebase and is
 * checked by the scripts in /scripts (check-responsive.mjs covers headings,
 * names, labels, alt text and overflow; the contrast sweep and the motion
 * checks were run against every page when this was written). The statement
 * deliberately says "aims to conform" rather than "conforms": conformance is
 * a claim that should rest on an independent audit, which has not been done.
 * If a feature is added that cannot meet a criterion, it goes in "Known
 * limitations" -- not silently left out.
 */
export const metadata: Metadata = buildMetadata({
  // 34 chars.
  title: "Accessibility Statement | Aivorraa",
  description:
    "How Aivorraa builds this website to be usable by everyone: the WCAG 2.2 AA target, the measures in place, known limitations and how to report a problem.",
  path: "accessibility",
});

const LAST_REVIEWED = "25 September 2026";

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([{ name: "Accessibility", path: "accessibility" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Accessibility", path: "/accessibility" }]} />
        <PageHeader
          eyebrow={`Last reviewed ${LAST_REVIEWED}`}
          title="Accessibility Statement"
          lede={`${SITE.name} wants ${SITE.domain} to be usable by everyone, including people who use screen readers, keyboards, magnification or reduced-motion settings.`}
        />
      </Container>

      <Section className="pt-6">
        <Container>
          <div className="prose-aivorraa mx-auto max-w-3xl">
            <h2>The standard this site aims for</h2>
            <p>
              This site aims to conform to the Web Content Accessibility
              Guidelines (WCAG) 2.2 at level AA. That is a target it is built
              and tested against, not a certified result: no independent audit
              has been carried out yet.
            </p>

            <h2>What is in place</h2>
            <ul>
              <li>
                <strong>Keyboard access.</strong> Every link, menu and form
                control can be reached and used with a keyboard, with a clearly
                visible focus outline. A &ldquo;Skip to content&rdquo; link is
                the first thing on every page.
              </li>
              <li>
                <strong>Structure.</strong> Each page has one main heading and a
                logical heading order, landmark regions, and descriptive link
                and button names, so screen-reader users can navigate by
                structure.
              </li>
              <li>
                <strong>Contrast.</strong> Text is checked against WCAG AA
                contrast ratios (4.5:1 for body text) on every page, including
                where it sits over decorative imagery.
              </li>
              <li>
                <strong>Motion you control.</strong> Every page respects your
                device&apos;s &ldquo;reduce motion&rdquo; setting. Independently
                of that, a <em>Pause motion</em> button on the homepage and in
                the footer of every page stops all looping animation, and the
                choice is remembered.
              </li>
              <li>
                <strong>Content never depends on animation.</strong> Sections
                fade in as you scroll, but nothing is hidden when JavaScript is
                disabled, and with &ldquo;reduce motion&rdquo; set everything is
                shown at once. If the page&apos;s scripts fail to load, the
                content is revealed automatically after a few seconds.
              </li>
              <li>
                <strong>Forms.</strong> Every field has a visible label, required
                fields are marked, and errors are described in text rather than
                by colour alone.
              </li>
              <li>
                <strong>Images.</strong> Meaningful images have text
                alternatives; purely decorative artwork is hidden from assistive
                technology so it does not add noise.
              </li>
              <li>
                <strong>Zoom and reflow.</strong> Pages can be zoomed to 200% in
                the browser, and reflow to a single column at 320px wide (the
                equivalent of 400% zoom), without horizontal scrolling or loss
                of content.
              </li>
            </ul>

            <h2>Known limitations</h2>
            <ul>
              <li>
                Some decorative elements &mdash; the looping background video
                and the moving dot pattern on the homepage, the automation run
                log, and the large name in the footer &mdash; are there for
                visual interest and are hidden from screen readers. Everything
                they depict is also described in the page text.
              </li>
              <li>
                The navigation at the top of the page inverts its colour against
                whatever scrolls beneath it. Where it crosses a mid-tone part of
                a photograph, its contrast can briefly drop. If your device is
                set to increase contrast, a solid header bar is used instead.
              </li>
              <li>
                The page-change transition briefly covers the screen (about one
                second). It is skipped entirely when &ldquo;reduce motion&rdquo;
                is set on your device.
              </li>
            </ul>

            <h2>Report a problem</h2>
            <p>
              If anything on this site is hard to use, or you need information
              in a different format, email{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the
              page address and a short description. {SITE.name} aims to reply
              within five working days and to fix confirmed issues as a
              priority.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
