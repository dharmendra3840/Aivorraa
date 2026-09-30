import Link from "next/link";
import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  PageHeader,
  Section,
} from "@/components/sections/common";
import { Card, JsonLd } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { PUBLISHED_ARTICLES } from "@/content/insights";
import { getService } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, schemaGraph } from "@/lib/schema";

/**
 * PRD §13 — /insights/ article index.
 * PRD §17 — two articles per month, 1,200–1,800 words, each answering a
 * question a prospective client would actually type. Launch focus is Tier 4
 * long-tail informational, which is the fastest route to organic traffic.
 */
export const metadata: Metadata = buildMetadata({
  // 45 chars.
  title: "Insights — Web, AI & Marketing | Aivorraa",
  description:
    "Practical answers to what businesses actually search: website costs in India, automation, SEO and the decisions behind building a digital presence.",
  path: "insights",
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InsightsPage() {
  const [featured, ...rest] = PUBLISHED_ARTICLES;

  return (
    <>
      <JsonLd
        json={schemaGraph(
          breadcrumbSchema([{ name: "Insights", path: "insights" }]),
        )}
      />

      <Container>
        <Breadcrumbs trail={[{ name: "Insights", path: "/insights" }]} />
        <PageHeader
          eyebrow="Insights"
          title="Answers to what people actually search"
          lede="Two articles a month, each answering a question a prospective client would genuinely type into Google — written to be useful whether or not you ever hire Aivorraa."
        />
      </Container>

      <Section className="pt-8">
        <Container>
          {PUBLISHED_ARTICLES.length === 0 ? (
            <div className="border-line rounded-card border border-dashed p-10 text-center">
              <p className="text-ink-500">
                The first articles are being written. Check back shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Featured — the most recent article. */}
              <Card as="article" className="mb-5">
                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
                  <div>
                    <p className="text-ink-400 text-xs font-semibold tracking-[0.14em] uppercase">
                      Latest &middot; {formatDate(featured.publishedAt)} &middot;{" "}
                      {featured.readingMinutes} min read
                    </p>
                    <h2 className="font-display text-ink mt-3 text-2xl leading-tight font-semibold sm:text-3xl">
                      <Link
                        href={`/insights/${featured.slug}`}
                        className="hover:text-brand-700 transition-colors"
                      >
                        {featured.title}
                      </Link>
                    </h2>
                    <p className="text-ink-500 mt-4 leading-relaxed">
                      {featured.description}
                    </p>
                    <Link
                      href={`/insights/${featured.slug}`}
                      className="text-brand-700 hover:text-brand-800 mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                    >
                      Read the article
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* PRD §17 — every article links to at least two service
                      pages, which is also how orphan pages get crawled. */}
                  <div className="border-line lg:border-l lg:pl-8">
                    <p className="text-ink-400 text-xs font-semibold tracking-[0.12em] uppercase">
                      Related services
                    </p>
                    <ul className="mt-3.5 grid gap-2">
                      {featured.serviceLinks.map((slug) => {
                        const service = getService(slug);
                        if (!service) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/${slug}`}
                              className="group text-ink-600 hover:text-brand-700 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                            >
                              {service.nav}
                              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Card>

              {rest.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <Card as="li" key={article.slug} className="h-full">
                      <p className="text-ink-400 text-xs font-semibold tracking-[0.14em] uppercase">
                        {formatDate(article.publishedAt)} &middot;{" "}
                        {article.readingMinutes} min
                      </p>
                      <h2 className="font-display text-ink mt-3 text-[1.0625rem] leading-snug font-semibold">
                        <Link
                          href={`/insights/${article.slug}`}
                          className="hover:text-brand-700 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h2>
                      <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
                        {article.description}
                      </p>
                      <span className="text-brand-700 mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                        Read
                        <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </Card>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
