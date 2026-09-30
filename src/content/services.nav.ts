import type { Accent, IconKey } from "./types";

/**
 * Lightweight navigation data for the header mega-menu and mobile drawer.
 *
 * WHY THIS FILE EXISTS — and why it is hand-written rather than derived:
 *
 * Header.tsx is a client component. Anything it imports is bundled and shipped
 * to every visitor's browser. Importing SERVICES pulled the entire service
 * catalogue into the client bundle — every FAQ answer, every deliverable
 * description, roughly 62KB of prose that the menu never renders — and pushed
 * the page against the PRD §21 budget of <= 200KB compressed JavaScript.
 *
 * Deriving this list from SERVICES would not help: the bundler follows the
 * import and includes the source module regardless of what is read from it.
 * So this is a standalone constant holding only the five fields the menu needs.
 *
 * KEEPING IT HONEST: `npm run check:seo` fails the build if this list drifts
 * from SERVICES — wrong slugs, wrong order, missing entries or mismatched
 * labels. So the duplication cannot silently rot; it just has to be updated in
 * both places, and the build tells you when you have not.
 */
export interface ServiceNavItem {
  slug: string;
  /** Short label for navigation. */
  nav: string;
  /** Full service name, used in the enquiry form's service dropdown. */
  name: string;
  summary: string;
  icon: IconKey;
  accent: Accent;
}

export const SERVICE_NAV: ServiceNavItem[] = [
  {
    slug: "web-development",
    nav: "Web Development",
    name: "Web Development",
    summary:
      "Marketing sites, CMS builds, portals and web apps — server-rendered, fast, and easy to edit.",
    icon: "code",
    accent: "blue",
  },
  {
    slug: "ui-ux-design",
    nav: "UI/UX Design",
    name: "UI/UX Design",
    summary:
      "Research, journeys, wireframes, prototypes and design systems with developer-ready handoff.",
    icon: "layers",
    accent: "violet",
  },
  {
    slug: "app-development",
    nav: "App Development",
    name: "Mobile App Development",
    summary:
      "Android and iOS planning, cross-platform builds, app UI/UX, API integration, testing and release.",
    icon: "phone",
    accent: "cyan",
  },
  {
    slug: "ai-automation",
    nav: "AI Automation",
    name: "AI Automation",
    summary:
      "Workflow automation, chatbots, document handling and CRM integration using n8n, Make and LLM APIs.",
    icon: "spark",
    accent: "lime",
  },
  {
    slug: "seo-ads",
    nav: "SEO & Ads",
    name: "SEO & Google Ads",
    summary:
      "Technical audits, on-page and local SEO, keyword and intent mapping, Google Ads with real conversion tracking.",
    icon: "search",
    accent: "amber",
  },
  {
    slug: "digital-marketing",
    nav: "Digital Marketing",
    name: "Digital Marketing",
    summary:
      "Channel strategy, funnels, social media, content and email — with GA4 and CRO instrumentation.",
    icon: "megaphone",
    accent: "rose",
  },
  {
    slug: "branding-graphics",
    nav: "Brand & Graphics",
    name: "Brand Identity & Graphic Design",
    summary:
      "Logo and identity systems, brand guidelines, social and ad creative, brochures and pitch decks.",
    icon: "palette",
    accent: "violet",
  },
  {
    slug: "video-motion",
    nav: "Video & Motion",
    name: "Video Editing & Motion Graphics",
    summary:
      "Reels and shorts, YouTube edits, promo video, subtitles, logo animation and explainers.",
    icon: "play",
    accent: "blue",
  },
];

/** Mega-menu grouping (PRD §19 — grouped services). */
export const NAV_GROUPS: Array<{
  label: string;
  blurb: string;
  slugs: string[];
}> = [
  {
    label: "Build & Product",
    blurb: "Websites, apps and the design that makes them usable.",
    slugs: [
      "web-development",
      "ui-ux-design",
      "app-development",
      "ai-automation",
    ],
  },
  {
    label: "Growth & Media",
    blurb: "Getting found, getting chosen, and looking the part.",
    slugs: [
      "seo-ads",
      "digital-marketing",
      "branding-graphics",
      "video-motion",
    ],
  },
];

export function getNavItem(slug: string): ServiceNavItem | undefined {
  return SERVICE_NAV.find((s) => s.slug === slug);
}
