"use client";

import { useEffect, useState } from "react";

import { cx } from "@/components/ui";

/**
 * "Pause motion" -- WCAG 2.2 success criterion 2.2.2 (Pause, Stop, Hide).
 *
 * Anything that moves on its own for more than five seconds, alongside other
 * content, must be pausable. The looping motion here is the tools marquee,
 * the dot field and the reel video; `prefers-reduced-motion` alone only helps
 * people who know to set an operating-system preference.
 *
 * WHAT IT PAUSES, AND WHAT IT DELIBERATELY DOES NOT
 * Only time-based animations that loop forever. It does NOT touch the
 * scroll-driven animations (reveals, the growing reel): those move only when
 * the reader scrolls, so they are not "auto-playing", and pausing them would
 * freeze reveals half-way -- content stuck at opacity 0 is worse than motion.
 * A blanket `animation-play-state: paused` in CSS cannot tell the two apart;
 * the Web Animations API can (`timeline` and `iterations`).
 *
 * New looping animations that start later -- a section scrolled into view,
 * a new page -- are caught by `animationstart`. The reel video (Reel.tsx)
 * listens for the `motion-paused` class on <html> and pauses itself.
 *
 * The choice persists (localStorage, a functional preference -- see the
 * privacy policy) and is applied before first paint by the inline script in
 * the root layout, so a paused visitor never sees a frame of motion.
 */

const KEY = "aivorraa:motion";

function isLoopingTimeAnimation(a: Animation) {
  const timing = a.effect?.getTiming();
  return (
    a.timeline instanceof DocumentTimeline &&
    !!timing &&
    timing.iterations === Infinity
  );
}

/*
  Only the animations THIS toggle paused are ever resumed. Calling play() on
  an animation takes it over from CSS for good -- after that its
  `animation-play-state` rules are ignored -- so resuming everything on every
  sync (including the initial one on mount) silently broke CSS-driven pauses
  such as the marquee stopping on hover.
*/
const pausedByToggle = new WeakSet<Animation>();

function applyToRunning(paused: boolean) {
  for (const a of document.getAnimations()) {
    if (!isLoopingTimeAnimation(a)) continue;
    if (paused) {
      if (a.playState === "running") {
        a.pause();
        pausedByToggle.add(a);
      }
    } else if (pausedByToggle.has(a)) {
      a.play();
      pausedByToggle.delete(a);
    }
  }
}

export function MotionToggle({ className }: { className?: string }) {
  // Starts false on the server; synced to the real state on mount.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const on = root.classList.contains("motion-paused");
      setPaused(on);
      applyToRunning(on);
    };
    sync();

    // Every toggle on the page (hero + footer) stays in step via the class.
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    // Catch looping animations that start after the toggle was set.
    const onStart = (e: AnimationEvent) => {
      if (!root.classList.contains("motion-paused")) return;
      const el = e.target as Element;
      for (const a of el.getAnimations()) {
        if (isLoopingTimeAnimation(a)) {
          a.pause();
          pausedByToggle.add(a);
        }
      }
    };
    document.addEventListener("animationstart", onStart, true);
    return () => {
      mo.disconnect();
      document.removeEventListener("animationstart", onStart, true);
    };
  }, []);

  const toggle = () => {
    const next = !paused;
    document.documentElement.classList.toggle("motion-paused", next);
    try {
      if (next) localStorage.setItem(KEY, "paused");
      else localStorage.removeItem(KEY);
    } catch {
      // Storage blocked: the toggle still works for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className={cx("motion-toggle", className)}
    >
      <span aria-hidden="true" className="motion-toggle-icon">
        {paused ? (
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M4 2.5v11l9-5.5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
            <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
          </svg>
        )}
      </span>
      {/* A STABLE label: with aria-pressed, the pressed state carries the
          meaning. Swapping the text to "Play motion" as well would make a
          screen reader announce "Play motion, pressed" -- a contradiction. */}
      Pause motion
    </button>
  );
}
