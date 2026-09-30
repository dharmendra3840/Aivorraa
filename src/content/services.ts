import type { Service } from "./types";
import { DIGITAL_SERVICES } from "./services.digital";
import { GROWTH_SERVICES } from "./services.growth";

/**
 * PRD §6 — Launch scope: eight evidence-based services.
 *
 * Interiors, PMC, Construction, Realty, Ventures and Labs are deliberately
 * ABSENT from the website. They stay internal brand planning until
 * qualifications, licensing, insurance, contracting model and geography are
 * confirmed, and each has at least one completed project to reference
 * (PRD §4, §6, §10, §11, §24).
 *
 * Adding a service here automatically adds it to: the mega-menu, the services
 * hub, the homepage grid, the sitemap and Service structured data. Do not add
 * one without a completed project behind it.
 *
 * Titles must be <= 60 chars and descriptions <= 155 (PRD §15).
 * `npm run check:seo` enforces this and fails on violation.
 */
export const SERVICES: Service[] = [...DIGITAL_SERVICES, ...GROWTH_SERVICES];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getService(slug);
  if (!service) return [];
  return service.related
    .map((s) => getService(s))
    .filter((s): s is Service => Boolean(s));
}

/** Grouping used by the header mega-menu (PRD §19 — grouped services). */
export const SERVICE_GROUPS = [
  {
    label: "Build & Product",
    blurb: "Websites, apps and the design that makes them usable.",
    slugs: ["web-development", "ui-ux-design", "app-development", "ai-automation"],
  },
  {
    label: "Growth & Media",
    blurb: "Getting found, getting chosen, and looking the part.",
    slugs: ["seo-ads", "digital-marketing", "branding-graphics", "video-motion"],
  },
] as const;
