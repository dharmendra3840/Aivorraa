import type { Industry } from "./types";

/**
 * PRD §13 — /industries/ is a low-priority page, and PRD §14 requires industry
 * pathways to cover "verified sectors" only. These four describe the kinds of
 * business the eight launch services genuinely fit, framed as problems rather
 * than as claims about clients already served.
 */
export const INDUSTRIES: Industry[] = [
  {
    slug: "startups-and-smes",
    name: "Startups & SMEs",
    icon: "bolt",
    problem: "You need to look established before you are, without overspending to get there.",
    body: "Early-stage businesses usually need one credible site, one clear proposition and a way to capture enquiries reliably — not a platform. Aivorraa scopes the smallest build that can carry the business for the next twelve months, then extends it as the offer settles. The priority is a site that ranks for your own name, explains what you sell, and routes an enquiry to a human quickly.",
    services: ["web-development", "branding-graphics", "seo-ads"],
  },
  {
    slug: "retail-and-ecommerce",
    name: "Retail & E-commerce",
    icon: "cart",
    problem: "Your catalogue, your ads and your fulfilment do not talk to each other.",
    body: "Online retail lives or dies on page speed, category structure and a checkout that does not lose people at the last step. Aivorraa builds and improves stores on WooCommerce and Shopify, structures categories so they can actually rank, connects payment and shipping, and automates the order, stock and customer-notification workflows that otherwise eat a person's day.",
    services: ["web-development", "seo-ads", "ai-automation"],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "shield",
    problem: "Your expertise is real and your website does not demonstrate any of it.",
    body: "Consultants, clinics, agencies and advisory firms are chosen on credibility, which means the site has to do the work a referral used to do. Aivorraa builds service pages with genuine depth, publishes the questions your prospects actually ask, and instruments the enquiry path so you know which pages produce conversations. Response time matters as much as ranking here, so lead routing is part of the scope.",
    services: ["web-development", "seo-ads", "digital-marketing"],
  },
  {
    slug: "operations-heavy-businesses",
    name: "Operations-Heavy Businesses",
    icon: "spark",
    problem: "Your team is doing by hand what software should be doing by rule.",
    body: "Distributors, service operators, education providers and field teams accumulate manual processes that were sensible at a smaller scale. Aivorraa maps those processes with volumes and time per step, automates the repetitive middle, and builds the internal dashboard or portal that replaces the spreadsheet everyone edits at once. Each workflow is quoted individually so you can stop when the return stops.",
    services: ["ai-automation", "web-development", "app-development"],
  },
];
