"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";

/**
 * Scroll reveal, PRD §18 ("subtle micro-interactions, scroll reveals").
 *
 * DESIGN NOTES
 *
 * One shared IntersectionObserver for the whole page rather than one per
 * element. With ~40 revealed elements on the homepage, per-element observers
 * are 40 objects the browser has to track; this is one.
 *
 * Elements are UNOBSERVED once revealed. A reveal is a one-way trip — replaying
 * it when the user scrolls back up is the thing that makes animated sites
 * tiring to read.
 *
 * The visible state is written to a data attribute, not a class, so it cannot
 * collide with Tailwind's class handling and is obvious in devtools.
 *
 * The CSS that hides these elements is gated behind `html.js` (see motion.css),
 * so if this component never runs, nothing is hidden. That matters more than
 * usual here: PRD §2 Finding 1 is that only the homepage was indexed, and
 * Finding 4 records an animation library setting the live header to opacity 0.
 */

type RevealMode = "single" | "group";

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;
  if (!("IntersectionObserver" in window)) return null;

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const attr = el.hasAttribute("data-reveal-group")
          ? "data-reveal-group"
          : "data-reveal";
        el.setAttribute(attr, "visible");
        observer?.unobserve(el);
      }
    },
    {
      // Fire a little before the element reaches the viewport edge, so the
      // transition is already underway by the time it is properly in view.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.1,
    },
  );

  return observer;
}

interface RevealProps {
  children: ReactNode;
  /** "group" staggers direct children; "single" reveals the element itself. */
  mode?: RevealMode;
  /** Delay in ms before this element's transition starts. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

export function Reveal({
  children,
  mode = "single",
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = getObserver();
    if (!io) {
      // No IntersectionObserver: show immediately rather than never.
      el.setAttribute(
        mode === "group" ? "data-reveal-group" : "data-reveal",
        "visible",
      );
      return;
    }

    // Already in view on first paint (above the fold, or a deep link landing
    // mid-page): reveal without waiting for a scroll event.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.setAttribute(
        mode === "group" ? "data-reveal-group" : "data-reveal",
        "visible",
      );
      return;
    }

    io.observe(el);
    return () => io.unobserve(el);
  }, [mode]);

  const attrs =
    mode === "group"
      ? { "data-reveal-group": "hidden" }
      : { "data-reveal": "hidden" };

  return (
    <Tag
      ref={ref}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      {...attrs}
    >
      {children}
    </Tag>
  );
}

/*
 * staggerStyle lives in ./stagger.ts, not here.
 *
 * Every export of a "use client" module is a client reference, and server
 * components call staggerStyle directly while mapping their children — which
 * fails at build time if it is exported from here.
 */
