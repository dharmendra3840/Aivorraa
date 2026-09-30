import type { Metadata } from "next";
import { SITE } from "./site-config";

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/**
 * Absolute URL for a file asset — no trailing slash, unlike a page route.
 * Use for schema image/logo properties and anything served as a file.
 */
export function assetUrl(path: string): string {
  return `${SITE.url}/${path.replace(/^\/+/, "")}`;
}

/** Absolute URL for a route. Trailing slash matches next.config trailingSlash. */
export function absoluteUrl(path = "/"): string {
  if (path === "/") return `${SITE.url}/`;
  const clean = `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return `${SITE.url}${clean}`;
}

interface BuildMetadataArgs {
  title: string;
  description: string;
  /** Route path, e.g. "web-development" or "/". Drives the canonical URL. */
  path: string;
  /** PRD §15 — no page should be noindexed in production. Use only for utility routes. */
  noindex?: boolean;
  /**
   * OG image path. Defaults to the build-time generated 1200x630 card at
   * /og.png (PRD §2 Finding 6 — the old asset was 2000x2000 and cropped badly
   * on every platform). Override per page only with another 1200x630 image.
   */
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Single builder for every page's metadata.
 *
 * PRD §15 — titles under 60 chars, descriptions under 155, one canonical per
 * page. PRD §2 Finding 6 — the OG image must be 1200x630, never square, and no
 * stray twitter:data1 / admin-email tags are emitted anywhere.
 */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  ogImage = "/og.png",
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title,
      description,
      locale: SITE.locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE.name} — ${SITE.proposition}`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      // Summary large image only. No twitter:site / twitter:creator handle is
      // emitted: x.com/aivorraa does not exist (PRD §16.1).
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Dev-time guard mirroring scripts/check-seo.mjs. */
export function assertSeoLimits(label: string, title: string, description: string) {
  if (process.env.NODE_ENV !== "production") {
    if (title.length > TITLE_MAX) {
      console.warn(
        `[seo] ${label}: title is ${title.length} chars (max ${TITLE_MAX})`,
      );
    }
    if (description.length > DESCRIPTION_MAX) {
      console.warn(
        `[seo] ${label}: description is ${description.length} chars (max ${DESCRIPTION_MAX})`,
      );
    }
  }
}
