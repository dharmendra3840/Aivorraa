"use client";

import { useEffect } from "react";

/**
 * Keeps keyboard focus visible inside the pinned horizontal stage.
 *
 * THE PROBLEM THIS EXISTS FOR
 * The stage holds eight card links, and only three or four are on screen at a
 * time. Tabbing reaches all eight — which is correct, they must all be
 * reachable — but the browser's own "scroll the focused thing into view" has
 * nothing useful to work with: the cards are positioned by a transform on the
 * track, driven by a scroll timeline, and the stage is `overflow: clip` so
 * there is no scroll container for the browser to nudge. Left alone, focus
 * lands on a card sitting somewhere off to the right of the viewport and the
 * reader sees nothing move. That is WCAG 2.4.11 (focus not obscured).
 *
 * Before `clip`, the stage was `overflow: hidden`, which DOES leave a scroll
 * container behind. The browser then scrolled it sideways to reveal the card —
 * silently and permanently offsetting the whole track from the timeline that
 * positions it. A single Tab to the last card put it 1670px out of step.
 *
 * WHAT IT DOES INSTEAD
 * Scrolls the page, because page scroll is what moves the track. Given a card,
 * it works out the scroll position at which that card sits centred and goes
 * there — so the timeline places the card on screen as a side effect of
 * ordinary scrolling, and nothing is ever out of step.
 *
 * One delegated `focusin` listener on the document, no per-card handlers, and
 * every branch that does not apply exits before touching layout.
 */
export function StageFocusScroll() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".hscroll-shell");
    const track = shell?.querySelector<HTMLElement>(".hscroll-track");
    if (!shell || !track) return;

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const card = target.closest<HTMLElement>(".hscroll-card");
      if (!card || !shell.contains(card)) return;

      /*
        Read the travel distance the stylesheet computed rather than deriving
        it again here. `--hscroll-span` is a registered <length>, so this is a
        resolved pixel value. Zero means the timeline is not driving the track
        — reduced motion, or a browser without scroll-timeline support, where
        the stage is a real scroller or a plain grid and the browser's own
        focus handling is already correct.
      */
      const span = Number.parseFloat(
        getComputedStyle(track).getPropertyValue("--hscroll-span"),
      );
      if (!Number.isFinite(span) || span <= 0) return;

      const shellTop = shell.getBoundingClientRect().top + window.scrollY;
      // The span of page scroll over which the stage is pinned.
      const travel = shell.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - shellTop) / travel),
      );

      /*
        Where this card would sit with the track at rest. Derived from its
        CURRENT position plus however far the track has already moved, rather
        than from offsetLeft — offsetLeft is measured against whichever
        ancestor happens to be positioned, which is not something this needs to
        depend on.
      */
      const restLeft = card.getBoundingClientRect().left + progress * span;
      const centred = (window.innerWidth - card.offsetWidth) / 2;
      const wanted = Math.min(1, Math.max(0, (restLeft - centred) / span));

      window.scrollTo({ top: shellTop + wanted * travel, behavior: "auto" });
    };

    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  return null;
}
