import {
  CAN_PUBLISH,
  CONTACT,
  ORGANISATION,
  SITE,
  VERIFIED_PROFILES,
} from "./site-config";
import { absoluteUrl, assetUrl } from "./seo";
import type { Article, Faq, Service } from "@/content/types";

/**
 * PRD §16 — Structured data plan.
 *
 * Schema is the principal lever for the entity problem in PRD §3: Google does
 * not yet accept "Aivorraa" as a distinct entity and treats it as a probable
 * misspelling of "Aivora". Organization + sameAs on every page is the primary
 * mechanism for linking the profiles to one entity.
 *
 * HARD RULES ENFORCED IN THIS FILE:
 *  - Every type must describe something verifiably true. Any field whose source
 *    value is null in site-config is omitted rather than invented.
 *  - NO AggregateRating and NO Review schema, anywhere, ever, without real
 *    attributable reviews on the page. There is deliberately no function here
 *    capable of emitting them.
 *  - NO Service schema for deferred verticals (interiors, PMC, construction,
 *    realty, ventures, labs) — they are not in SERVICES, so they cannot be.
 *  - LocalBusiness only once a verified address exists (CAN_PUBLISH gate).
 */

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

type Json = Record<string, unknown>;

function compact(obj: Json): Json {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null),
  );
}

function postalAddress() {
  if (!CONTACT.address) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.locality,
    addressRegion: CONTACT.address.region,
    postalCode: CONTACT.address.postalCode,
    addressCountry: CONTACT.address.country,
  };
}

/** PRD §16 — Organization, site-wide. The single most important item. */
export function organizationSchema(): Json {
  return compact({
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    // §29 — legalName only once the registered entity name is confirmed.
    legalName: SITE.legalName ?? undefined,
    alternateName: "Aivorraa Digital",
    url: `${SITE.url}/`,
    description: SITE.proposition,
    logo: {
      "@type": "ImageObject",
      url: assetUrl("logo.png"),
      width: 512,
      height: 512,
    },
    image: assetUrl("og.png"),
    email: CONTACT.email,
    telephone: CONTACT.phone ?? undefined,
    address: postalAddress(),
    foundingDate: ORGANISATION.foundingDate ?? undefined,
    founder: {
      "@type": "Person",
      name: ORGANISATION.founder,
    },
    areaServed: CONTACT.serviceArea,
    // §3.1 / §16.1 — verified profiles only. x.com/aivorraa is excluded because
    // it does not exist, and pointing at a nonexistent profile weakens the
    // entity signal rather than strengthening it.
    sameAs: VERIFIED_PROFILES.map((p) => p.url),
    contactPoint: [
      compact({
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT.email,
        telephone: CONTACT.phone ?? undefined,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      }),
    ],
  });
}

/** PRD §16 — WebSite on the homepage, enables the sitelinks search box. */
export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    description: SITE.proposition,
    inLanguage: SITE.language,
    publisher: { "@id": ORG_ID },
  };
}

/**
 * PRD §16 — LocalBusiness on homepage and about, ONLY once a verified address
 * exists. Returns null otherwise, and callers must handle null.
 */
export function localBusinessSchema(): Json | null {
  if (!CAN_PUBLISH.localBusinessSchema) return null;
  return compact({
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.legalName ?? SITE.name,
    url: `${SITE.url}/`,
    image: assetUrl("og.png"),
    email: CONTACT.email,
    telephone: CONTACT.phone ?? undefined,
    address: postalAddress(),
    areaServed: CONTACT.serviceArea,
    parentOrganization: { "@id": ORG_ID },
    // Deliberately no aggregateRating. PRD §16 prohibits it without real,
    // attributable, on-page reviews.
  });
}

/** PRD §16 — BreadcrumbList on all pages except the homepage. */
export function breadcrumbSchema(
  trail: Array<{ name: string; path: string }>,
): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "/" },
      ...trail,
    ].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** PRD §16 — Service on each launch service page. */
export function serviceSchema(service: Service): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(service.slug)}#service`,
    name: service.name,
    serviceType: service.primaryKeyword,
    description: service.description,
    url: absoluteUrl(service.slug),
    provider: { "@id": ORG_ID },
    areaServed: CONTACT.serviceArea,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} deliverables`,
      itemListElement: service.deliverables.included.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d.title },
      })),
    },
  };
}

/** PRD §16 — FAQPage on service pages that carry an FAQ section. */
export function faqSchema(faqs: Faq[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** PRD §16 — Article on each insights post. */
export function articleSchema(article: Article): Json {
  const url = absoluteUrl(`insights/${article.slug}`);
  return compact({
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.language,
    image: assetUrl("og.png"),
  });
}

/** PRD §16 — Person on the about page, linked to the organisation. */
export function personSchema(): Json {
  return compact({
    "@type": "Person",
    "@id": `${SITE.url}/about/#founder`,
    name: ORGANISATION.founder,
    jobTitle: ORGANISATION.founderRole,
    worksFor: { "@id": ORG_ID },
    url: absoluteUrl("about"),
  });
}

/**
 * Wraps one or more schema nodes into a single @graph document.
 * Emitting one graph per page keeps node @ids resolvable across types.
 */
export function schemaGraph(...nodes: Array<Json | null>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes.filter((n): n is Json => n !== null),
  });
}
