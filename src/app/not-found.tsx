import Link from "next/link";
import type { Metadata } from "next";

import { Container, Section } from "@/components/sections/common";
import { ACCENT, ButtonLink, cx } from "@/components/ui";
import { ArrowRightIcon, Icon } from "@/components/icons";
import { SERVICES } from "@/content/services";
import { CONTACT } from "@/lib/site-config";

/**
 * PRD §13 and §22 Phase 4 — "Branded 404 page exists" is a required
 * pre-launch check.
 *
 * This is a recovery page rather than a dead end: it routes to every service,
 * which also means a visitor who lands here from a stale link has one click to
 * where they were going. The page is noindexed, which is the one legitimate
 * exception to "no noindex on any production page".
 */
export const metadata: Metadata = {
  title: "Page not found | Aivorraa",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-brand-200 text-7xl font-bold sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 text-[2rem] sm:text-[2.75rem]">
            That page has moved, or never existed
          </h1>
          <p className="text-ink-500 mx-auto mt-5 max-w-xl text-lg leading-relaxed">
            If you followed a link from somewhere else, it is probably pointing
            at an old address. Everything Aivorraa does is one click away below.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/" variant="primary" size="lg" withArrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Contact Aivorraa
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <p className="text-ink-400 mb-5 text-center text-xs font-semibold tracking-[0.14em] uppercase">
            All services
          </p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {SERVICES.map((service) => {
              const accent = ACCENT[service.accent];
              return (
                <li key={service.slug}>
                  <Link
                    href={`/${service.slug}`}
                    className="group bg-surface border-line hover:border-line-strong flex items-center gap-3.5 rounded-2xl border p-4 transition"
                  >
                    <span
                      className={cx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        accent.bg,
                        accent.text,
                      )}
                    >
                      <Icon name={service.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-ink group-hover:text-brand-700 flex-1 text-[0.9375rem] font-semibold transition-colors">
                      {service.nav}
                    </span>
                    <ArrowRightIcon className="text-ink-400 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="text-ink-400 mt-10 text-center text-sm">
            Still stuck? Email{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-brand-700 underline underline-offset-4"
            >
              {CONTACT.email}
            </a>{" "}
            and tell Aivorraa what you were looking for.
          </p>
        </div>
      </Container>
    </Section>
  );
}
