"use client";

import { useEffect } from "react";

/**
 * Feeds the services coverflow (motion-3d.css §7).
 *
 * The on-scroll 3D carousel technique needs each card's distance from the
 * viewport centre. CSS cannot measure that here: the cards travel by a
 * transform on their track (the pinned horizontal stage), and no scroll or
 * view timeline sees a transform. So this reads each card's box and writes
 * two custom properties:
 *
 *   --d   signed distance from centre, -1 (left edge) .. +1 (right edge)
 *   --ad  its magnitude
 *
 * CSS turns those into rotateY / translateZ / opacity. React re-renders
 * nothing.
 *
 * Idle by construction: the track only moves when the page scrolls, so a
 * measurement is scheduled per scroll/resize event (at most one per frame)
 * and nothing runs while the page is still -- which keeps the "Pause motion"
 * control honest (WCAG 2.2.2). Never started under reduced motion, where the
 * stage is a plain grid anyway.
 */
export function CoverflowDepth() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shell = document.querySelector<HTMLElement>(".hscroll-shell");
    if (!shell) return;
    const cards = [...shell.querySelectorAll<HTMLElement>(".hscroll-card")];
    if (!cards.length) return;

    let raf = 0;

    const measure = () => {
      raf = 0;
      const box = shell.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      const half = window.innerWidth / 2;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        const d = Math.max(-1.4, Math.min(1.4, (r.left + r.width / 2 - half) / half));
        card.style.setProperty("--d", d.toFixed(3));
        card.style.setProperty("--ad", Math.abs(d).toFixed(3));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
