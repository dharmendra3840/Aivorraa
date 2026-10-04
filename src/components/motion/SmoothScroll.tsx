"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling.
 *
 * This is the single thing that makes reference sites like alethia.earth feel
 * different from an ordinary page: the wheel does not jump the document, it
 * feeds a velocity that eases toward a target. Everything else — the reveals,
 * the parallax, the growing reel — is native CSS.
 *
 * WHY LENIS AND NOT A TRANSFORM-BASED SMOOTH SCROLLER
 * The older approach (Locomotive v4 and similar) leaves the document at scroll
 * 0 and translates a wrapper instead. That would break everything built here:
 * `animation-timeline: scroll()` and `view()` read the REAL scroll position, so
 * every scroll-driven animation in motion.css would freeze, and
 * `position: sticky` inside a transformed ancestor stops behaving.
 *
 * Lenis scrolls the actual document — it only smooths how the position is
 * reached — so the scroll-driven CSS, the sticky panels and the scroll
 * progress line all keep working untouched.
 *
 * DISABLED, NOT DAMPENED, UNDER REDUCED MOTION
 * Inertia is exactly the kind of movement that triggers motion sickness, and
 * it applies to every scroll on the site rather than to one decorative
 * element. When the preference is set, Lenis is never constructed at all and
 * the browser's own scrolling is left alone.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        // Long enough to feel weighted, short enough that a deliberate scroll
        // still lands where the reader expects.
        duration: 1.05,
        // Standard exponential ease-out: quick to respond, slow to settle.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        /*
          Left off for touch. A finger drag already has the platform's own
          physics, and layering a second inertia model on top of it feels
          detached from the gesture.
        */
        syncTouch: false,
        // Makes in-page links (#main from "Back to top", #faqs)
        // animate through Lenis rather than fighting it.
        anchors: true,
      });

      const loop = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lenis?.destroy();
      lenis = null;
    };

    const sync = () => {
      if (reduceMotion.matches) stop();
      else start();
    };

    sync();
    reduceMotion.addEventListener("change", sync);

    return () => {
      reduceMotion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
