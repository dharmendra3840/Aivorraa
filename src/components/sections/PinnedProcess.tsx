import Link from "next/link";

import { Container } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { ProcessScene, type SceneName } from "./ProcessScene";

/**
 * Pinned scroll stage for the delivery process.
 *
 * Each stage is a sticky card at the same offset, so they stack in document
 * order as the page scrolls and the one being passed recedes behind the next.
 * A rail on the left counts progress; a rotated label runs up the edge.
 *
 * WHY THE PROCESS AND NOT THE PORTFOLIO
 * This pattern is usually built for case studies, and that is where it is most
 * effective. It cannot be used that way here yet: PRD §17 requires written
 * client permission and a confirmed role before any case study is published,
 * and all ten candidates are still gated. Rather than leave the pattern unused
 * or fill it with work Aivorraa is not cleared to show, it carries the six
 * delivery stages — content that is entirely Aivorraa's own and needs no
 * approval to publish.
 *
 * Move it to the portfolio once approved case studies exist; the component
 * takes an array and does not care what is in it.
 *
 * MOTION: the recede is scroll-driven CSS (`animation-timeline: view()`), so
 * there is no scroll listener. Under reduced motion the stack unpins entirely
 * and becomes an ordinary list — held pinned without motion, the cards would
 * overlap into an unreadable pile.
 *
 * THE RAIL REPORTS THE REAL POSITION
 * Its index used to be the literal string "01", which never changed: the rail
 * said "01 / 06" while stage 04 filled the screen. It is now a CSS counter
 * driven by the shell's own timeline, so it cannot disagree with what is on
 * screen — there is no second source of truth for it to fall out of step
 * with. Same for the dots, which had transitions declared but no rule that
 * ever changed them. See motion-process.css §1–2.
 */
export function PinnedProcess({
  eyebrow,
  title,
  lede,
  steps,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  /*
    `scene` is optional: the component is meant to carry approved case studies
    once PRD §17 permissions exist, and those will bring their own visuals
    rather than these diagrams.
  */
  steps: Array<{ title: string; body: string; scene?: SceneName }>;
}) {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28">
      <Container>
        {/* Intro */}
        <div className="border-line grid gap-8 border-b pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-ink-400 mb-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
              <span aria-hidden="true" className="bg-ink-300 h-px w-9" />
              {eyebrow}
            </p>
            <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem]">
              {title}
            </h2>
          </div>
          <p className="text-ink-500 leading-relaxed">{lede}</p>
        </div>

        {/* Stage */}
        <div className="pin-shell relative mt-12">
          <span className="side-label" data-side="left" aria-hidden="true">
            <i />
            <span className="text-ink-400 text-[0.6rem] font-semibold tracking-[0.18em] uppercase">
              Delivery process
            </span>
          </span>

          <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-14">
            {/* Rail — sticky beside the stack. */}
            <div className="mb-10 lg:sticky lg:top-28 lg:mb-0 lg:self-start">
              <div className="flex items-baseline justify-between">
                {/* Painted by a CSS counter from the scroll position — see
                    motion-process.css §1. Deliberately empty in the markup:
                    a hard-coded number here is exactly what went stale. */}
                <span
                  className="rail-count font-display text-ink text-sm font-bold tracking-[0.06em]"
                  aria-hidden="true"
                />
                <span className="text-ink-400 text-[0.7rem] font-semibold">
                  / {String(steps.length).padStart(2, "0")}
                </span>
              </div>

              <div className="rail-track mt-3">
                <span className="rail-fill" />
              </div>

              <ul className="mt-4 flex justify-between gap-1.5">
                {steps.map((step, i) => (
                  <li key={step.title}>
                    <span
                      className="rail-dot block"
                      aria-hidden="true"
                      style={{ "--i": i } as React.CSSProperties}
                    />
                  </li>
                ))}
              </ul>

              <p className="text-ink-400 mt-6 hidden text-[0.8125rem] leading-relaxed lg:block">
                Every stage has a named output and an approval point, so you
                always know what is being decided and by whom.
              </p>
            </div>

            {/* The stack itself. */}
            <ol className="pin-stack grid gap-6">
              {steps.map((step, i) => (
                <li key={step.title} className="pin-card">
                  {/*
                    NOT `ghost-num`. That utility draws its number with a
                    ::before, and so does `card-sweep` -- one element has one
                    ::before, so the two collided. `card-sweep` won `content`,
                    which silently blanked the number, and `ghost-num` won the
                    vertical offset, which parked the hover sweep across the
                    middle of the card instead of along its bottom edge. The
                    number is a real element here, so neither has to give way.
                  */}
                  <article className="stage-card spot-edge card-sweep bg-surface border-line rounded-card border p-7 sm:p-10">
                    <span className="stage-edge" aria-hidden="true" />
                    <span className="stage-ghost" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/*
                      The scene sits beside the copy, not below it, and only
                      from `sm` up. On a phone the card is already the width of
                      the screen, and the diagram would squeeze the body text
                      into a column too narrow to read.
                    */}
                    <div className="flex items-start justify-between gap-8">
                      <div className="min-w-0">
                        <div className="mb-5 flex items-center gap-3.5">
                          <span className="font-display text-ink text-xs font-bold tracking-[0.06em]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            aria-hidden="true"
                            className="bg-ink-200 h-px w-8"
                          />
                          <span className="text-ink-400 text-[0.65rem] font-semibold tracking-[0.13em] uppercase">
                            Stage
                          </span>
                        </div>

                        <h3 className="font-display text-ink text-2xl font-semibold sm:text-[2rem]">
                          {step.title}
                        </h3>
                        <p className="text-ink-500 mt-4 max-w-xl leading-relaxed">
                          {step.body}
                        </p>
                      </div>

                      {step.scene ? (
                        <ProcessScene
                          name={step.scene}
                          className="stage-scene--lift hidden sm:block"
                        />
                      ) : null}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/contact"
            className="text-ink-600 hover:text-ink underline-sweep inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            Start at stage one
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
