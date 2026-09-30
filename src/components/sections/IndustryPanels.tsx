import Link from "next/link";

import type { Industry } from "@/content/types";
import { getService } from "@/content/services";
import { ArrowRightIcon } from "@/components/icons";

/**
 * Industries as an expanding panel row.
 *
 * Four panels sit equal until one is pointed at or focused, at which point it
 * grows, its siblings desaturate and recede, its copy unfolds and its visual
 * comes up from a whisper to full strength. See motion-panels.css for the
 * mechanism and the accessibility handling.
 *
 * WHY FOUR
 * The interaction needs few enough panels that a collapsed one still reads.
 * Four is the number this content happens to have; eight services would be too
 * many and would come out as unreadable slivers, which is why the service list
 * stays a grid.
 *
 * Each panel carries a small CSS scene chosen to say something about the
 * problem rather than to decorate: a plan being drawn, a chart climbing, a
 * stack of documents signed off, a system orbiting a core.
 */

type VisualKey = "blueprint" | "growth" | "docs" | "orbit";

/** Maps each industry to its scene. Falls back to the blueprint. */
const VISUALS: Record<string, VisualKey> = {
  "startups-and-smes": "blueprint",
  "retail-and-ecommerce": "growth",
  "professional-services": "docs",
  "operations-heavy-businesses": "orbit",
};

export function IndustryPanels({ industries }: { industries: Industry[] }) {
  return (
    <ul className="expand-row">
      {industries.map((industry, i) => (
        <li
          key={industry.slug}
          id={industry.slug}
          className="expand-panel border-line bg-surface/60 rounded-card scroll-mt-28 border"
        >
          <PanelVisual kind={VISUALS[industry.slug] ?? "blueprint"} />

          {/* Top: index and name */}
          <div className="panel-layer p-6 sm:p-7">
            <span
              aria-hidden="true"
              className="panel-num font-display block text-4xl"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="panel-title font-display text-ink mt-4 text-xl font-semibold">
              {industry.name}
            </h3>
          </div>

          {/* Bottom: problem, unfolding copy, service links */}
          <div className="panel-layer from-surface via-surface/95 bg-gradient-to-t to-transparent p-6 sm:p-7">
            <p className="text-ink-700 text-[0.9375rem] leading-snug font-medium">
              {industry.problem}
            </p>

            <div className="panel-copy overflow-hidden">
              <p className="text-ink-500 text-sm leading-relaxed">
                {industry.body}
              </p>
            </div>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {industry.services.map((slug) => {
                const service = getService(slug);
                if (!service) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/${slug}`}
                      className="wipe-line border-line text-ink-500 hover:border-ink-300 hover:text-ink rounded-pill inline-flex items-center gap-1 border px-3 py-1 text-xs font-medium transition"
                    >
                      {service.nav}
                      <ArrowRightIcon className="h-3 w-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Decorative. Announced by nothing — the copy beside it carries the meaning. */
function PanelVisual({ kind }: { kind: VisualKey }) {
  return (
    <div className="panel-visual" aria-hidden="true">
      {kind === "blueprint" ? (
        <div className="v-blueprint">
          <span className="v-grid" />
          <span className="v-plan" />
        </div>
      ) : null}

      {kind === "growth" ? (
        <div className="v-growth">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      ) : null}

      {kind === "docs" ? (
        <div className="v-docs">
          <span />
          <span />
          <span>
            <span className="doc-line" />
            <span className="doc-line" />
            <span className="doc-check" />
          </span>
        </div>
      ) : null}

      {kind === "orbit" ? (
        <div className="v-orbit">
          <span className="o-ring" />
          <span className="o-ring" />
          <span className="o-core" />
        </div>
      ) : null}
    </div>
  );
}
