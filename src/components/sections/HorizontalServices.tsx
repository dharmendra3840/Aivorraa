import Link from "next/link";

import type { Service } from "@/content/types";
import { SERVICES } from "@/content/services";
import { ACCENT, ButtonLink, cx } from "@/components/ui";
import { ArrowRightIcon, Icon } from "@/components/icons";
import { StageFocusScroll } from "@/components/motion/StageFocusScroll";
import { CoverflowDepth } from "@/components/motion/CoverflowDepth";

/**
 * The eight services, driven sideways through a pinned stage.
 *
 * The page scrolls down; the cards travel across. See motion-scroll.css for
 * the timeline wiring — the shell declares a `view-timeline` and the track
 * references it by name, because the track sits inside a sticky stage and its
 * own visibility barely changes.
 *
 * WHY THIS SECTION AND NOT ANOTHER
 * Horizontal scroll suits a set that is long, uniform and browsable. Eight
 * services is exactly that, and as a four-across grid it was the most ordinary
 * block on the page. It would be the wrong move for the four industry panels
 * (too few to be worth pinning for) or the process (a sequence, which reads
 * better stacked than raced through).
 *
 * THE HEADING IS NOT IN THE TRACK
 * It sits in the stage, above the cards, so it holds while they pass. An
 * earlier version put it at the head of the track with `position: sticky`,
 * which pinned nothing — see the note on `.hscroll-head`. Lifting it out also
 * gave the pinned screen a top and a bottom; with the heading gone by the
 * second card, the cards were left floating in an empty viewport.
 *
 * The travel distance is NOT computed here. It is derived in motion-scroll.css
 * from the same variables that lay the track out, and the only thing passed in
 * is the card count — the one number the stylesheet cannot know. An earlier
 * version did the arithmetic here from a duplicate set of card/gap/lead
 * measurements, and the copies drifted: the last card came to rest 16px short
 * of its gutter.
 *
 * FALLBACKS
 *  - No scroll-timeline support: the stage stays a native horizontal scroller,
 *    so the cards are swiped rather than scrolled. Nothing is unreachable.
 *  - Reduced motion: the shell unpins and the track becomes a wrapping grid.
 *    A pinned stage with no motion is a screen the reader cannot get past.
 *  - No JavaScript: same as no support — every card is in the HTML and
 *    reachable, which matters here more than usual (PRD §2, Finding 1).
 */
export function HorizontalServices({
  services = SERVICES,
}: {
  services?: Service[];
}) {
  return (
    <section
      aria-labelledby="services-heading"
      className="hscroll-shell"
    >
      <StageFocusScroll />
      <CoverflowDepth />
      <div
        className="hscroll-stage"
        style={{ "--hscroll-count": services.length } as React.CSSProperties}
      >
        {/* Holds while the cards pass. */}
        <div className="hscroll-head">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-ink-400 mb-4 flex items-center gap-2.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
                <span
                  aria-hidden="true"
                  className="bg-lime-400 h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(var(--glow-rgb),0.44)]"
                />
                Eight services, one team
              </p>
              <h2
                id="services-heading"
                className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem]"
              >
                Eight services.{" "}
                <span className="text-signature">One team</span> accountable
                for all of them.
              </h2>
            </div>
            <ButtonLink href="/services" variant="outline" withArrow>
              All services
            </ButtonLink>
          </div>
        </div>

        <div className="hscroll-track">
          <ul className="contents">
            {services.map((service, i) => {
              const accent = ACCENT[service.accent];
              return (
                <li key={service.slug} className="hscroll-card velocity-skew">
                  <Link
                    href={`/${service.slug}`}
                    className="lift spot-edge card-sweep group bg-surface border-line flex h-[22rem] flex-col rounded-card border p-7 transition-[border-color,box-shadow] duration-500 hover:border-brand-500/40 hover:shadow-[0_0_50px_-18px_rgba(var(--glow-rgb),0.36)]"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cx(
                          "group-hover:bg-signal flex h-12 w-12 items-center justify-center rounded-2xl transition-[transform,background-color,color,box-shadow] duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-page group-hover:shadow-[0_8px_24px_-8px_rgba(var(--glow-rgb),0.33)]",
                          accent.bg,
                          accent.text,
                        )}
                      >
                        <Icon name={service.icon} className="h-6 w-6" />
                      </span>
                      <span className="text-ink-400 font-display text-sm font-bold tracking-[0.06em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-display text-ink group-hover:text-brand-700 mt-7 text-2xl font-semibold transition-colors">
                      {service.nav}
                    </h3>
                    <p className="text-ink-500 mt-3 flex-1 text-[0.9375rem] leading-relaxed">
                      {service.summary}
                    </p>

                    <span className="text-brand-700 mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold">
                      <span className="card-underline relative">Explore</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/*
          Travel indicator. Decorative — it reports how far through a scroll
          the reader is, which they already know from scrolling, and the count
          either side is announced by the cards themselves.
        */}
        <div className="hscroll-progress" aria-hidden="true">
          <span className="text-ink-400 font-display text-xs font-bold tracking-[0.14em]">
            01
          </span>
          <span className="hscroll-progress-rail">
            <span className="hscroll-progress-bar" />
          </span>
          <span className="text-ink-400 font-display text-xs font-bold tracking-[0.14em]">
            {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
