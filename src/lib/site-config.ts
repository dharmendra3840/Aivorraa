/**
 * AIVORRAA — single source of truth for business facts.
 *
 * PRD §29 "Facts blocking specific pages" lists details that must NOT be
 * published until the owner confirms them. This file encodes that rule in the
 * type system: anything unconfirmed is `null`, and every component, footer line
 * and schema block reads from here and renders nothing when the value is null.
 *
 * To go live with a fact: replace the `null` with the verified value. The
 * address, phone, legal name and foundingDate will then flow automatically into
 * the footer, the contact page, Organization schema and (once `address` exists)
 * LocalBusiness schema.
 *
 * DO NOT hardcode any of these values anywhere else in the codebase.
 */

export const SITE = {
  name: "Aivorraa",
  legalName: null as string | null, // §29 — registered legal entity name required
  domain: "aivorraa.com",
  url: "https://www.aivorraa.com",
  // PRD §5 — the one proposition, stated identically everywhere.
  proposition:
    "Aivorraa is a full-stack digital agency building websites, apps and AI automation for growing businesses.",
  // PRD §5 — keep the existing H1, it is strong and already designed in.
  heroHeadline: ["We Build, Market &", "Automate", "Your Digital Future"],
  locale: "en_IN",
  language: "en-IN",
} as const;

/**
 * Contact channels. `null` = not yet verified, so it will not be rendered.
 * PRD §19 requires every published channel to be a verified, tested inbox.
 */
export const CONTACT = {
  // PRD §15 — replaces the unrelated admin address that was leaking into the
  // twitter:data1 meta tag on the old build.
  email: "hello@aivorraa.com",
  // §29 — a verified business phone number is required before publishing.
  phone: null as string | null,
  // E.164, digits only, for the wa.me link. Requires `phone` to be verified too.
  whatsapp: null as string | null,
  /**
   * §29 — whether a physical office address can be published. This single flag
   * also decides whether Tier 2 local keywords are viable and whether
   * LocalBusiness schema may be emitted (PRD §16).
   */
  address: null as {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  } | null,
  // Used only for copy like "serving X" — safe to state without a full address.
  serviceArea: "Delhi NCR & remote across India",
  hours: "Mon–Sat, 10:00–19:00 IST",
} as const;

/**
 * PRD §16 — `sameAs` profiles for Organization schema.
 *
 * Rules encoded here:
 *  - The X/Twitter entry is REMOVED. x.com/aivorraa does not exist and pointing
 *    at a nonexistent profile actively weakens the entity signal.
 *  - LinkedIn and YouTube stay `verified: false` until the profile is confirmed
 *    live. Only `verified: true` entries are emitted into schema.
 */
export const SOCIAL_PROFILES = [
  {
    key: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/aivorraa.official/",
    verified: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/aivorraa/",
    verified: false, // §16.2 — verify the company page is live before listing
  },
  {
    key: "youtube",
    label: "YouTube",
    url: null,
    verified: false,
  },
] as const;

export const VERIFIED_PROFILES = SOCIAL_PROFILES.filter(
  (p): p is (typeof SOCIAL_PROFILES)[number] & { url: string } =>
    p.verified && typeof p.url === "string",
);

/**
 * PRD §29 — founder entity for Person schema on /about.
 * `foundingDate` feeds Organization schema and must be the real founding year.
 */
export const ORGANISATION = {
  founder: "Aditya Gupta",
  founderRole: "Founder",
  foundingDate: null as string | null, // §29 — ISO year, e.g. "2023"
  gstin: null as string | null,
} as const;

/**
 * PRD §14 + §16 — the trust strip and the five-star hero graphic.
 *
 * "Only verified years, clients, projects, ratings or measurable outcomes.
 *  Omit entirely if unverified."
 *
 * The attached UI design shows a five-star badge and the figures 99%, 450+ and
 * 2.5M+. None of these are verified in the PRD, and §29 lists "whether the
 * five-star hero graphic reflects real reviews" as an open question.
 *
 * So: `showRatingStars` is OFF and the showcase figures are OFF by default.
 * Flip a flag to true only once the underlying number is documented and
 * approved. Note that even with `showRatingStars: true`, AggregateRating schema
 * is never emitted anywhere in this codebase — PRD §16 prohibits it without
 * real, attributable, on-page reviews.
 */
export const CLAIMS = {
  showRatingStars: false,
  // The rating line shown beside the stars. Same rule: real, attributable
  // reviews only, and never emitted as AggregateRating schema.
  ratingLabel: "4.9/5 client satisfaction",
  /*
    Four outcome figures from an earlier theme brief. NOT RENDERED anywhere
    in the current design (the hero dashboard that carried them was removed
    in the redesign), and OFF besides: none of them is documented, and the
    homepage publishes "No invented statistics". Kept so the owner can see
    what was proposed; wire them into a page only once each number has a
    source you would show a client.
  */
  showcaseMetrics: {
    enabled: false,
    agentsActive: "32+",
    automationSuccess: "99%",
    workflowsRunning: "450+",
    businessGrowth: "+87%",
  },
  // PRD §14 trust strip — add entries only with a documented source.
  trustStrip: [] as Array<{ value: string; label: string }>,
  // PRD §14 — client-approved quotes only. No fabricated endorsements.
  testimonials: [] as Array<{
    quote: string;
    name: string;
    title: string;
    company: string;
  }>,
} as const;

/** Derived guards used across the app and schema. */
export const CAN_PUBLISH = {
  localBusinessSchema: CONTACT.address !== null, // PRD §16
  companyDetailsInFooter: SITE.legalName !== null,
  phoneChannels: CONTACT.phone !== null,
  localKeywords: CONTACT.address !== null, // PRD §17 Tier 2 gate
} as const;
