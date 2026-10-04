export type IconKey =
  | "code"
  | "layers"
  | "phone"
  | "spark"
  | "search"
  | "megaphone"
  | "palette"
  | "play"
  | "chart"
  | "shield"
  | "bolt"
  | "cart"
  | "home";

export type Accent = "blue" | "lime" | "violet" | "cyan" | "amber" | "rose";

export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  /** Flat top-level route slug — PRD §13. Do not change once indexed. */
  slug: string;
  /** Short label for navigation and cards. */
  nav: string;
  /** Full service name used in body copy and Service schema. */
  name: string;
  icon: IconKey;
  accent: Accent;
  /** PRD §15 — max 60 characters. Enforced by a test in scripts/check-seo.mjs */
  title: string;
  /** PRD §15 — max 155 characters. */
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  /** PRD §15 — exactly one H1: service name plus outcome. */
  h1: string;
  lede: string;
  /** Card blurb on the homepage and services hub. */
  summary: string;
  who: { heading: string; intro: string; items: string[] };
  deliverables: {
    heading: string;
    intro: string;
    included: Array<{ title: string; body: string }>;
    excluded: string[];
  };
  process: Array<{ title: string; body: string }>;
  pricing: { model: string; body: string; note?: string };
  faqs: Faq[];
  /** PRD §15.8 — two or three sibling pages. */
  related: string[];
}

export interface Industry {
  slug: string;
  name: string;
  icon: IconKey;
  problem: string;
  body: string;
  services: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string | null;
  industry: string;
  location: string | null;
  year: string;
  categories: string[];
  role: string;
  brief: string;
  approach: string[];
  deliverables: string[];
  outcomes: Array<{ metric: string; label: string; source: string }>;
  /**
   * PRD §17 — a case study may only render once written client permission and
   * confirmation of Aivorraa's exact role are on file. Until then `published`
   * stays false and the entry is excluded from the site and the sitemap.
   */
  published: boolean;
  permissionOnFile: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  /** Tier from PRD §17 keyword tiers — Tier 4 long-tail is the launch focus. */
  tier: 1 | 2 | 3 | 4;
  keyword: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  readingMinutes: number;
  /** PRD §17 — every article links to at least two service pages. */
  serviceLinks: string[];
  body: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] }
    | { type: "callout"; text: string }
  >;
  published: boolean;
}
