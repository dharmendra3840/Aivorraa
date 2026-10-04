import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  Breadcrumbs,
  Container,
  CtaSection,
  RelatedServices,
  Section,
  SectionHeading,
} from "@/components/sections/common";
import { Card, JsonLd } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { PUBLISHED_ARTICLES, getArticle } from "@/content/insights";
import { getService } from "@/content/services";
import type { Article, Service } from "@/content/types";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, schemaGraph } from "@/lib/schema";

/**
 * PRD §13 — /insights/[slug]/ individual article.
 * PRD §16 — Article schema on each insights post.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_ARTICLES.map((article) => ({ slug: article.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `insights/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
  });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const services = article.serviceLinks
    .map((s) => getService(s))
    .filter((s): s is Service => Boolean(s));

  const others = PUBLISHED_ARTICLES.filter((a) => a.slug !== article.slug).slice(
    0,
    2,
  );

  return (
    <>
      <JsonLd
        json={schemaGraph(
          articleSchema(article),
          breadcrumbSchema([
            { name: "Insights", path: "insights" },
            { name: article.title, path: `insights/${article.slug}` },
          ]),
        )}
      />

      <Container>
        <Breadcrumbs
          trail={[
            { name: "Insights", path: "/insights" },
            { name: article.title, path: `/insights/${article.slug}` },
          ]}
        />

        <article className="pt-10 sm:pt-14">
          <header className="mx-auto max-w-3xl">
            <p className="text-brand-700 mb-4 text-[0.7rem]">
              Insights
            </p>
            {/* PRD §15 — exactly one H1 per page. */}
            <h1 className="text-[2rem] sm:text-[2.75rem]">{article.title}</h1>
            <p className="text-ink-500 mt-5 text-lg leading-relaxed">
              {article.description}
            </p>
            <div className="border-line text-ink-400 mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-5 text-sm">
              <span>{article.author}</span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{article.readingMinutes} min read</span>
            </div>
          </header>

          <div className="prose-aivorraa mx-auto mt-10 max-w-3xl">
            {article.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </article>
      </Container>

      {/* PRD §17 — every article links to at least two service pages. */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Related services"
              title="Where Aivorraa can help with this"
            />
            <div className="mt-8">
              <RelatedServices services={services} />
            </div>
          </div>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section tone="surface">
          <Container>
            <div className="mx-auto max-w-3xl">
              <SectionHeading eyebrow="Keep reading" title="More insights" />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {others.map((other) => (
                  <Card as="li" key={other.slug} className="h-full">
                    <p className="text-ink-400 text-xs">
                      {other.readingMinutes} min read
                    </p>
                    <h3 className="font-display text-ink mt-3 text-[1.0625rem] leading-snug font-normal">
                      <Link
                        href={`/insights/${other.slug}`}
                        className="link-draw"
                      >
                        {other.title}
                      </Link>
                    </h3>
                    <span className="text-brand-700 mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                      Read
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </Card>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaSection />
    </>
  );
}

function Block({ block }: { block: Article["body"][number] }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <p className="bg-lime-100/60 border-lime-400 text-ink-700 my-7 rounded-r-2xl border-l-3 px-6 py-5 font-medium not-italic">
          {block.text}
        </p>
      );
    default:
      return null;
  }
}
