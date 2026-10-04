"use client";

import { useEffect, useRef } from "react";

/**
 * The follower cursor of the reference (brandium.nl uses Cuberto's
 * "mouse-follower" on GSAP; this is the same behaviour in ~2KB of plain JS).
 *
 *   - a small dot trails the pointer with easing, and stretches along the
 *     direction of travel the faster it moves
 *   - over a link or button it shrinks to a point
 *   - over an element carrying `data-cursor-text` it grows into a dark disc
 *     with that label ("View", "Read", ...)
 *   - over `data-cursor="hidden"` (the header nav) it gets out of the way
 *   - it turns white over charcoal panels and in the dark theme, so it never
 *     vanishes into the ground it is on
 *
 * The NATIVE cursor is kept, exactly as on the reference: the dot is an
 * ornament, never the only indication of where the pointer is. The follower
 * is aria-hidden, takes no pointer events, and only exists for a fine
 * pointer that can hover -- never on touch -- and never under reduced motion.
 *
 * Its animation loop runs only while the dot is catching up with the pointer
 * and stops once it has settled, so an idle page does no per-frame work (and
 * "Pause motion" has nothing to stop).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const capable = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!capable.matches || reduce.matches) return;

    const label = el.querySelector<HTMLElement>(".cursor-label");
    let tx = -100;
    let ty = -100;
    let x = tx;
    let y = ty;
    let raf = 0;
    let shown = false;

    const tick = () => {
      const dx = tx - x;
      const dy = ty - y;
      x += dx * 0.2;
      y += dy * 0.2;
      // Stretch along the direction of travel, proportional to speed.
      const speed = Math.hypot(dx, dy);
      const stretch = Math.min(speed / 60, 0.55);
      const angle = Math.atan2(dy, dx);
      el.style.transform =
        `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad) ` +
        `scale(${1 + stretch}, ${1 - stretch * 0.45}) rotate(${-angle}rad)`;
      if (speed > 0.1) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
    };

    const setState = (target: Element | null) => {
      const textHost = target?.closest<HTMLElement>("[data-cursor-text]");
      const hidden = target?.closest('[data-cursor="hidden"]');
      const pointer = target?.closest("a, button, summary, label, select, input, textarea");
      const dark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        !!target?.closest(".scope-dark");
      el.dataset.state = textHost ? "text" : hidden ? "hidden" : pointer ? "pointer" : "idle";
      el.dataset.tone = dark ? "light" : "dark";
      if (label) label.textContent = textHost?.dataset.cursorText ?? "";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.dataset.visible = "true";
      }
      setState(e.target as Element);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor"
      data-visible="false"
      data-state="idle"
      data-tone="dark"
      aria-hidden="true"
    >
      <span className="cursor-dot">
        <span className="cursor-label" />
      </span>
    </div>
  );
}
