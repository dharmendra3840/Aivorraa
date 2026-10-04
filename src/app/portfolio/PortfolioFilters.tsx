"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { CaseStudy } from "@/content/types";
// Lightweight nav data — see the note in services.nav.ts. This is a client
// component, so importing the full catalogue would bundle all of it.
import { getNavItem } from "@/content/services.nav";
import { Card, cx } from "@/components/ui";

/**
 * PRD §19 — "Filter by service and industry. Accessible controls, responsive
 * cards."
 *
 * Implemented as real buttons in a labelled group with aria-pressed, so the
 * current state is announced. The full unfiltered list is rendered on the
 * server first, so a crawler and a JavaScript-disabled visitor see every case
 * study — filtering is an enhancement, not a requirement for access.
 */
export function PortfolioFilters({
  caseStudies,
}: {
  caseStudies: CaseStudy[];
}) {
  const [service, setService] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);

  const { services, industries } = useMemo(() => {
    const s = new Set<string>();
    const i = new Set<string>();
    for (const study of caseStudies) {
      study.categories.forEach((c) => s.add(c));
      i.add(study.industry);
    }
    return {
      services: [...s].sort(),
      industries: [...i].sort(),
    };
  }, [caseStudies]);

  const filtered = caseStudies.filter(
    (study) =>
      (!service || study.categories.includes(service)) &&
      (!industry || study.industry === industry),
  );

  return (
    <div>
      <div className="grid gap-5 sm:flex sm:flex-wrap sm:items-start sm:gap-8">
        <FilterGroup
          label="Service"
          options={services.map((slug) => ({
            value: slug,
            label: getNavItem(slug)?.nav ?? slug,
          }))}
          active={service}
          onChange={setService}
        />
        <FilterGroup
          label="Industry"
          options={industries.map((value) => ({ value, label: value }))}
          active={industry}
          onChange={setIndustry}
        />
      </div>

      <p aria-live="polite" className="text-ink-400 mt-6 text-sm">
        Showing {filtered.length} of {caseStudies.length}{" "}
        {caseStudies.length === 1 ? "project" : "projects"}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line rounded-card mt-6 border border-dashed p-10 text-center">
          <p className="text-ink-500">
            No projects match that combination yet. Clear a filter to see the
            rest.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study) => (
            <Card as="li" key={study.slug} className="h-full">
              <p className="text-ink-400 text-xs">
                {study.industry} &middot; {study.year}
              </p>
              <h3 className="font-display text-ink mt-3 text-lg leading-snug font-normal">
                <Link
                  href={`/portfolio/${study.slug}`}
                  className="link-draw"
                >
                  {study.title}
                </Link>
              </h3>
              <p className="text-ink-500 mt-2.5 text-sm leading-relaxed">
                {study.brief}
              </p>
              <p className="text-ink-400 mt-4 text-xs">
                Aivorraa&apos;s role: {study.role}
              </p>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  active: string | null;
  onChange: (value: string | null) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
      <p className="text-ink-400 mb-2.5 text-xs">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={active === null}
          onClick={() => onChange(null)}
        >
          All
        </FilterButton>
        {options.map((option) => (
          <FilterButton
            key={option.value}
            active={active === option.value}
            onClick={() =>
              onChange(active === option.value ? null : option.value)
            }
          >
            {option.label}
          </FilterButton>
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-pill border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "bg-ink border-ink text-page"
          : "border-line text-ink-500 hover:border-ink-300 hover:text-ink bg-surface",
      )}
    >
      {children}
    </button>
  );
}
