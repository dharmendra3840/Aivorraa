"use client";

import { useEffect, useRef } from "react";

/**
 * The fixed 3D world behind the whole site (engine.ts).
 *
 * LOADING: the engine is imported only after the page's `load` event and an
 * idle moment, so it never competes with the H1 (the LCP element) or the
 * fonts. Until it draws -- and permanently when it cannot -- a static poster
 * of the same world stands in (/media/world-poster.webp), so the site looks
 * the same with JavaScript off, without WebGL2, or under reduced motion.
 *
 * WHEN IT RUNS
 *   - never under prefers-reduced-motion, or on data saver: the poster only
 *   - "Pause motion" (WCAG 2.2.2, the `motion-paused` class): the aurora,
 *     stars and water stop; the camera still follows the scroll, because
 *     that movement is the reader's own
 *   - a hidden tab draws nothing
 *   - phones and low-memory devices get the lighter mesh
 *
 * Decorative: aria-hidden, no pointer events.
 */
export function World() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    if (reduce.matches || nav.connection?.saveData) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const { createWorld } = await import("./engine");
      if (disposed) return;
      const lite =
        window.matchMedia("(max-width: 767px)").matches ||
        (nav.deviceMemory ?? 8) <= 4;
      const world = createWorld({ canvas, lite });
      if (!world) return; // no WebGL2: the poster stays
      wrap.dataset.live = "true";

      const root = document.documentElement;
      const progress = () => {
        const max = root.scrollHeight - window.innerHeight;
        world.setProgress(max > 0 ? window.scrollY / max : 0);
      };
      const running = () =>
        world.setRunning(!document.hidden && !root.classList.contains("motion-paused"));
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        world.setPointer(
          (e.clientX / window.innerWidth - 0.5) * 2,
          (e.clientY / window.innerHeight - 0.5) * 2,
        );
      };
      const onResize = () => {
        world.resize();
        progress();
      };

      progress();
      running();
      window.addEventListener("scroll", progress, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", running);
      const mo = new MutationObserver(running);
      mo.observe(root, { attributes: true, attributeFilter: ["class"] });

      cleanup = () => {
        window.removeEventListener("scroll", progress);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", running);
        mo.disconnect();
        world.destroy();
      };
    };

    // After load, then after an idle moment.
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
      else setTimeout(cb, 300);
    };
    const onLoad = () => idle(() => void start());
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", onLoad);
      cleanup();
    };
  }, []);

  return (
    <div ref={wrapRef} className="world" aria-hidden="true" data-live="false">
      <canvas ref={canvasRef} className="world-canvas" />
    </div>
  );
}
