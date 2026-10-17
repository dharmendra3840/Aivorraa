/**
 * The material that makes the site specific: the founder, and price ranges.
 * (Projects live in portfolio.ts, testimonials in site-config CLAIMS.)
 *
 * EVERY SECTION FED FROM HERE STAYS HIDDEN UNTIL IT IS FILLED IN. Nothing on
 * the site shows a placeholder, a stock face or an invented number. Fill a
 * block with the client's real material and its section appears.
 *
 * Photos go in /public/media/people/ (JPG or WebP, at least 1200px on the
 * long edge).
 */

export interface Founder {
  name: string;
  role: string;
  /** e.g. "/media/people/founder.jpg" */
  photo: string;
  /** Two to four short paragraphs, in the founder's own words. */
  story: string[];
  /** One line the founder would put on a wall. Optional. */
  quote?: string;
}

/** Fill in to show the founder section on the homepage and About page. */
export const FOUNDER: Founder | null = null;

export interface Team {
  /** Group or candid photo of the team at work. */
  photo: string;
  caption: string;
}

/** Optional: a team photo shown beside the founder. */
export const TEAM: Team | null = null;

export interface PriceRange {
  /** Must match a service slug, e.g. "ai-automation". */
  service: string;
  /** e.g. "₹40,000" -- the real starting price. */
  from: string;
  /** What that starting price buys, in one line. */
  includes: string;
  /** e.g. "Most projects: ₹60,000 – ₹1.5 lakh". Optional. */
  typical?: string;
}

/**
 * Fill in to show "Where projects start" on the homepage and each service
 * page. Published prices must be ones Aivorraa will honour.
 */
export const PRICES: PriceRange[] = [];
