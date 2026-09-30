import type { CaseStudy } from "./types";

/**
 * PRD §17 — Case studies are the priority content, and every one requires
 * WRITTEN CLIENT PERMISSION plus confirmation of Aivorraa's exact role before
 * publication. PRD §14 additionally prohibits fabricated endorsements and
 * unapproved outcome claims.
 *
 * The ten names below are the candidate references listed in the PRD as
 * "requiring verification". They are recorded here as a work queue with
 * `published: false` and `permissionOnFile: false`, so NONE of them render on
 * the site, appear in the sitemap or leak a client name into the HTML.
 *
 * To publish one:
 *   1. Obtain written permission to name the client and use their assets.
 *   2. Confirm Aivorraa's exact role, scope and constraints.
 *   3. Fill in brief / approach / deliverables, and outcomes ONLY where
 *      documented, each with a stated timeframe and source.
 *   4. Set permissionOnFile: true and published: true.
 *
 * PRD §17: "Four well-documented case studies at launch are worth more than
 * ten logos with no detail."
 */
const CANDIDATE_NAMES = [
  "EMEP Consultancy Services",
  "BookMyYatra",
  "ComplyHub Consultants",
  "Khari Baoli Traders",
  "Dream Trip Vacation",
  "AdverzoAi",
  "Eventhium",
  "JV Cinemas",
  "Techatalyst",
  "Kickin Industries",
];

/** Internal work queue. Never rendered — see PORTFOLIO below. */
export const CASE_STUDY_QUEUE = CANDIDATE_NAMES.map((name) => ({
  name,
  permissionOnFile: false,
  roleConfirmed: false,
}));

export const PORTFOLIO: CaseStudy[] = [
  // Intentionally empty at launch. Add entries only once the checklist above
  // is complete for that client.
];

/** Only fully approved entries are ever exposed to the site or the sitemap. */
export const PUBLISHED_CASE_STUDIES = PORTFOLIO.filter(
  (c) => c.published && c.permissionOnFile,
);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return PUBLISHED_CASE_STUDIES.find((c) => c.slug === slug);
}

/** Filter facets for the portfolio page, derived from published work only. */
export function getPortfolioFacets() {
  const categories = new Set<string>();
  const industries = new Set<string>();
  for (const c of PUBLISHED_CASE_STUDIES) {
    c.categories.forEach((x) => categories.add(x));
    industries.add(c.industry);
  }
  return {
    categories: [...categories].sort(),
    industries: [...industries].sort(),
  };
}
