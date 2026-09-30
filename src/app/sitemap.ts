import type { MetadataRoute } from "next";

import { SERVICE_SLUGS } from "@/content/services";
import { PUBLISHED_ARTICLES } from "@/content/insights";
import { PUBLISHED_CASE_STUDIES } from "@/content/portfolio";
import { absoluteUrl } from "@/lib/seo";

/**
 * PRD §22 Phase 4 — "Sitemap generates and includes every page."
 * PRD §13 — priorities mirror the URL map: /, /about/ and /contact/ are highest
 * because they carry the entity signals from §3, not because of traffic.
 *
 * Generated from the same content modules the pages render from, so a page
 * cannot exist without appearing here, and an unapproved case study or draft
 * article cannot appear here without being published.
 *
 * /pricing/ and /careers/ are absent: they are not real pages (§13 dead links).
 * The 404 page is absent because it is noindexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), priority: 1.0, changeFrequency: "weekly" },
    { url: absoluteUrl("about"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("contact"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("services"), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl("portfolio"), priority: 0.7, changeFrequency: "weekly" },
    { url: absoluteUrl("insights"), priority: 0.6, changeFrequency: "weekly" },
    { url: absoluteUrl("industries"), priority: 0.4, changeFrequency: "yearly" },
    {
      url: absoluteUrl("privacy-policy"),
      priority: 0.2,
      changeFrequency: "yearly",
    },
    { url: absoluteUrl("terms"), priority: 0.2, changeFrequency: "yearly" },
    { url: absoluteUrl("accessibility"), priority: 0.2, changeFrequency: "yearly" },
  ];

  // The eight launch service pages — the ones PRD Finding 1 reports as missing
  // from Google's index entirely.
  const services: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: absoluteUrl(slug),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const articles: MetadataRoute.Sitemap = PUBLISHED_ARTICLES.map((article) => ({
    url: absoluteUrl(`insights/${article.slug}`),
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    priority: 0.6,
    changeFrequency: "yearly" as const,
  }));

  const caseStudies: MetadataRoute.Sitemap = PUBLISHED_CASE_STUDIES.map(
    (study) => ({
      url: absoluteUrl(`portfolio/${study.slug}`),
      priority: 0.7,
      changeFrequency: "yearly" as const,
    }),
  );

  return [...core, ...services, ...articles, ...caseStudies].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
