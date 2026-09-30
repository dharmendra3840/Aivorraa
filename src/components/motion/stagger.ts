import type { CSSProperties } from "react";

/**
 * Sets the stagger index a child uses to offset its reveal transition.
 *
 * WHY THIS IS NOT IN Reveal.tsx: that file is `"use client"`, and every export
 * of a client module becomes a client reference. Calling one from a server
 * component fails at build time with "Attempted to call staggerStyle() from the
 * server but staggerStyle is on the client."
 *
 * This is a pure function producing a style object, so it belongs in a plain
 * module that either environment can call.
 */
export function staggerStyle(index: number): CSSProperties {
  return { "--stagger-index": index } as CSSProperties;
}
