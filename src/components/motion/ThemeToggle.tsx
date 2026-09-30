"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Light / dark theme switch, fixed to the bottom-right corner.
 *
 * Dark (espresso) is the default; light (parchment) is the alternative. The
 * theme is the `data-theme` attribute on <html> -- globals.css flips every
 * token on it -- rendered as "dark" by the server, so a visitor without
 * JavaScript gets the default. A saved "light" choice is restored by the
 * inline script in the root layout BEFORE first paint, so a returning visitor
 * never sees a frame of the wrong theme. Stored in localStorage as a
 * functional preference (see the privacy policy), like the motion toggle.
 *
 * THE SWITCH ITSELF
 * Where the View Transitions API exists, the new theme is revealed as a circle
 * growing out of the toggle. Skipped under reduced motion and when the reader
 * has paused motion (MotionToggle) -- they get an instant switch instead.
 *
 * ACCESSIBLE NAME
 * A stable "Dark theme" with aria-pressed, for the same reason as "Pause
 * motion": swapping the label as well would announce a contradiction.
 */

const KEY = "aivorraa:theme";
const THEME_COLOR = { dark: "#0f0c09", light: "#f4efe6" } as const;

type Theme = keyof typeof THEME_COLOR;

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[next]);
  try {
    if (next === "light") localStorage.setItem(KEY, "light");
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the switch still works for this page view.
  }
}

export function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null);
  // Matches the server render (dark); synced to the real theme on mount.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(currentTheme());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("motion-paused");

    if (still || !("startViewTransition" in document) || !ref.current) {
      applyTheme(next);
      return;
    }

    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Transition skipped (e.g. the tab was hidden): the theme is applied.
      });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label="Dark theme"
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="theme-toggle"
      data-print-hide
    >
      <span aria-hidden="true" className="theme-toggle-knob" />
      <span aria-hidden="true" className="theme-toggle-icon theme-toggle-icon--sun">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </svg>
      </span>
      <span aria-hidden="true" className="theme-toggle-icon theme-toggle-icon--moon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z" />
        </svg>
      </span>
    </button>
  );
}
