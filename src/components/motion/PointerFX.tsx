"use client";

import { useEffect } from "react";

/**
 * Drives the magnetic buttons (`.magnetic`): each drifts a few pixels toward
 * the pointer as it approaches. (The follower cursor is Cursor.tsx.)
 *
 * WHY ONE DELEGATED HANDLER RATHER THAN A COMPONENT PER ELEMENT
 * A wrapper component would attach its own listener for every button. This is a single `pointermove` listener on
 * the document that finds the relevant ancestors from `event.target`. One
 * listener, one rAF, no matter how many elements opt in.
 *
 * WHY IT COSTS NOTHING IN REACT
 * It writes CSS custom properties directly to the DOM. React re-renders
 * nothing as the pointer moves — there is no state here at all. That is what
 * keeps the effect inside the PRD §21 INP budget of 200ms.
 *
 * WHERE IT DELIBERATELY DOES NOT RUN
 * Coarse pointers (touch — there is no hover, so a magnet would stick
 * wherever the user last tapped) and anyone who has asked for reduced motion.
 * In both cases the listener is never attached, so it costs nothing rather
 * than being attached and ignored.
 *
 * Renders no DOM of its own.
 */

/** Maximum distance a magnetic element travels toward the cursor. */
const MAGNET_STRENGTH = 6;
/** How far outside its box a magnetic element starts reacting. */
const MAGNET_RADIUS = 70;

export function PointerFX() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let latest: PointerEvent | null = null;
    let attached = false;

    // The magnetic element currently pulled, so it can be released cleanly.
    let magnetised: HTMLElement | null = null;

    const applyMagnet = (event: PointerEvent) => {
      const target = event.target;
      const hovered =
        target instanceof Element
          ? target.closest<HTMLElement>(".magnetic")
          : null;

      // Left the previous magnet: let it glide back.
      if (magnetised && magnetised !== hovered) {
        magnetised.style.setProperty("--mag-x", "0px");
        magnetised.style.setProperty("--mag-y", "0px");
        magnetised = null;
      }

      if (!hovered) return;

      const rect = hovered.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      // Normalise against the element's own size plus the reaction radius, so
      // a wide button is not yanked further than a small one.
      const nx = dx / (rect.width / 2 + MAGNET_RADIUS);
      const ny = dy / (rect.height / 2 + MAGNET_RADIUS);

      hovered.style.setProperty(
        "--mag-x",
        `${(nx * MAGNET_STRENGTH).toFixed(2)}px`,
      );
      hovered.style.setProperty(
        "--mag-y",
        `${(ny * MAGNET_STRENGTH).toFixed(2)}px`,
      );
      magnetised = hovered;
    };

    const onPointerMove = (event: PointerEvent) => {
      latest = event;
      if (frame) return;
      // Throttled to one write per frame: pointermove fires far faster than the
      // display refreshes on a high-polling mouse, and the extra work is thrown
      // away.
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!latest) return;
        applyMagnet(latest);
      });
    };

    const releaseAll = () => {
      if (!magnetised) return;
      magnetised.style.setProperty("--mag-x", "0px");
      magnetised.style.setProperty("--mag-y", "0px");
      magnetised = null;
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      document.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      document.addEventListener("pointerleave", releaseAll, { passive: true });
      // A click can move focus and unhover without a final pointermove.
      document.addEventListener("pointerdown", releaseAll, { passive: true });
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", releaseAll);
      document.removeEventListener("pointerdown", releaseAll);
      releaseAll();
    };

    const sync = () => {
      if (finePointer.matches && !reducedMotion.matches) attach();
      else detach();
    };

    sync();
    // Re-evaluate if a mouse is plugged in, or the motion setting changes,
    // without a reload.
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      detach();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
