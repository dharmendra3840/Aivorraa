import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

/**
 * PRD §22 Phase 0 — "Confirm robots.txt blocks nothing and no page carries
 * noindex."
 *
 * Given Finding 1 (only the homepage is indexed), this file deliberately blocks
 * nothing that should be crawled. Only Next.js internals are disallowed.
 * Do not add a Disallow rule here without checking it against Search Console
 * coverage first — this file is the most common cause of an index that will not
 * grow.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
