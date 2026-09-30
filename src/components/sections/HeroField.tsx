"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's neural floor: a dotted wave mesh receding to a horizon, with a
 * scatter of glowing network nodes and a few drifting particles.
 *
 * WHY CANVAS, WHEN EVERYTHING ELSE ON THE SITE IS CSS
 * The mesh is ~1,200 points whose heights change every frame. As DOM nodes
 * that is 1,200 elements animating; as SVG it is a path re-serialised 60
 * times a second. On a canvas it is a few dozen draw calls, and the whole
 * component is a couple of kilobytes. It is the one place a script earns its
 * keep.
 *
 * WHAT KEEPS IT CHEAP
 *  - Draw calls are batched by depth row, not issued per segment: ~50 strokes
 *    and ~26 fills per frame rather than ~2,400.
 *  - Device pixel ratio is capped at 1.5. The mesh is soft and faint; the
 *    extra pixels of a 3x display are invisible and cost 4x the fill.
 *  - It stops entirely when scrolled out of view or when the tab is hidden,
 *    and draws at ~30fps rather than the display's refresh rate.
 *
 * WHAT KEEPS IT HONEST TO THE REST OF THE SITE
 *  - Decorative only: `aria-hidden`, no pointer events, never the LCP element
 *    (the H1 is), and it cannot shift layout because it is absolutely
 *    positioned into a box that already exists.
 *  - Reduced motion draws ONE still frame and never animates or follows the
 *    pointer. The look survives; the movement does not.
 *  - Without JavaScript a CSS perspective grid (`.hero-floor-fallback`) stands
 *    in, so the hero is never a flat black void (PRD §2, Finding 1).
 */

const COLS = 46;
const ROWS = 26;
const SPAN_X = 28; // world units across
const DEPTH = 30; // world units to the horizon
const NEAR = 1.4;
const CAM_H = 1.25; // camera height above the floor

/** Deterministic pseudo-random in [0,1) from two ints -- stable node picks. */
function hash(a: number, b: number) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    let w = 0;
    let h = 0;
    let raf = 0;
    let inView = true;
    // Pointer parallax: target and eased current, both in -1..1.
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;

    // Projected grid, reused every frame rather than reallocated.
    const sx = new Float32Array(COLS * ROWS);
    const sy = new Float32Array(COLS * ROWS);
    const rowAlpha = new Float32Array(ROWS);
    const rowScale = new Float32Array(ROWS);

    // ~9% of intersections are "network nodes" that pulse in the accent.
    const nodes: Array<{ i: number; seed: number; cyan: boolean }> = [];
    for (let r = 2; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = hash(r, c);
        if (v > 0.91) nodes.push({ i: r * COLS + c, seed: v * 40, cyan: hash(c, r) > 0.7 });
      }
    }

    const particles = Array.from({ length: 34 }, (_, k) => ({
      x: hash(k, 1),
      y: hash(k, 2),
      speed: 0.00002 + hash(k, 3) * 0.00004,
      size: 0.6 + hash(k, 4) * 1.2,
      cyan: hash(k, 5) > 0.75,
    }));

    // Theme colours, as the "r, g, b" triplets globals.css defines -- so the
    // floor is umber ink on paper and warm light inside a .scope-dark region.
    let mesh = "110, 80, 50";
    let glow = "138, 90, 43";
    let accent = "164, 132, 94";
    const readColors = () => {
      const cs = getComputedStyle(canvas);
      mesh = cs.getPropertyValue("--mesh-rgb").trim() || mesh;
      glow = cs.getPropertyValue("--glow-rgb").trim() || glow;
      accent = cs.getPropertyValue("--accent-rgb").trim() || accent;
    };

    const resize = () => {
      readColors();
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t: number) => {
      px += (tx - px) * 0.04;
      py += (ty - py) * 0.04;

      ctx.clearRect(0, 0, w, h);

      /*
        Scroll-linked camera -- the "spatial zoom" technique. Scrolling flies
        the camera FORWARD over the terrain (rows advance toward the viewer,
        wrapping so the floor is endless) and tips it down as it climbs, so
        the horizon lifts. `flight` is how far through the hero the reader is.
      */
      const flight = Math.min(1, window.scrollY / Math.max(1, h));
      const spacing = DEPTH / (ROWS - 1);
      const travel = window.scrollY * 0.018; // world units flown
      const drift = travel % spacing;
      const camH = CAM_H + flight * 0.55;

      const horizon = h * 0.34 + py * 12 - flight * h * 0.14;
      const cx = w / 2 + px * 36;
      const fov = Math.max(h * 0.95, w * 0.42);

      // ---- project the mesh ----
      for (let r = 0; r < ROWS; r++) {
        const z = NEAR + r * spacing - drift;
        const depthT = Math.max(0, (z - NEAR) / DEPTH);
        // Near rows bright, far rows fading into the horizon haze.
        rowAlpha[r] = Math.pow(1 - depthT, 0.85);
        rowScale[r] = fov / z;
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1) - 0.5) * SPAN_X;
          const edge = Math.abs(x) / (SPAN_X / 2);
          // A slow rolling swell, plus the mesh lifting toward the far edges --
          // the "wave rising at the horizon" of the reference.
          const y =
            0.32 * Math.sin(x * 0.33 + t * 0.00042) * Math.cos((z + travel) * 0.21 - t * 0.0003) +
            1.05 * edge * edge * edge * depthT;
          const k = r * COLS + c;
          sx[k] = cx + x * rowScale[r];
          sy[k] = horizon + (camH - y) * rowScale[r];
        }
      }

      ctx.lineWidth = 1;

      // ---- rows: constant depth, one stroke each ----
      for (let r = 0; r < ROWS; r++) {
        const a = rowAlpha[r] * 0.22;
        if (a < 0.01) continue;
        ctx.strokeStyle = `rgba(${mesh}, ${a})`;
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const k = r * COLS + c;
          if (c === 0) ctx.moveTo(sx[k], sy[k]);
          else ctx.lineTo(sx[k], sy[k]);
        }
        ctx.stroke();
      }

      // ---- columns: segments batched by the depth band they span ----
      for (let r = 0; r < ROWS - 1; r++) {
        const a = rowAlpha[r] * 0.16;
        if (a < 0.01) continue;
        ctx.strokeStyle = `rgba(${mesh}, ${a})`;
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const k = r * COLS + c;
          ctx.moveTo(sx[k], sy[k]);
          ctx.lineTo(sx[k + COLS], sy[k + COLS]);
        }
        ctx.stroke();
      }

      // ---- intersection dots, one fill per row ----
      for (let r = 0; r < ROWS; r++) {
        const a = rowAlpha[r] * 0.75;
        if (a < 0.02) continue;
        const s = Math.min(2.4, Math.max(0.6, rowScale[r] * 0.0045));
        ctx.fillStyle = `rgba(${mesh}, ${a})`;
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const k = r * COLS + c;
          ctx.rect(sx[k] - s / 2, sy[k] - s / 2, s, s);
        }
        ctx.fill();
      }

      // ---- network nodes: pulsing, with a soft halo ----
      for (const n of nodes) {
        const r = Math.floor(n.i / COLS);
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0016 + n.seed);
        const a = rowAlpha[r] * (0.35 + pulse * 0.65);
        if (a < 0.04) continue;
        const rad = Math.min(3.2, Math.max(1, rowScale[r] * 0.006)) * (0.8 + pulse * 0.5);
        const rgb = n.cyan ? glow : accent;
        ctx.fillStyle = `rgba(${rgb}, ${a * 0.18})`;
        ctx.beginPath();
        ctx.arc(sx[n.i], sy[n.i], rad * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${rgb}, ${a})`;
        ctx.beginPath();
        ctx.arc(sx[n.i], sy[n.i], rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- particles drifting up through the air above the floor ----
      for (const p of particles) {
        const y = (((p.y - t * p.speed) % 1) + 1) % 1;
        const x = p.x * w + px * 14 * p.size;
        const yy = y * h * 0.8;
        const a = Math.sin(y * Math.PI) * 0.55;
        ctx.fillStyle = p.cyan ? `rgba(${glow}, ${a})` : `rgba(${mesh}, ${a})`;
        ctx.beginPath();
        ctx.arc(x, yy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /*
      Drawn at ~30fps, not the display rate. The swell moves a fraction of a
      pixel per frame, so 30 and 60 are indistinguishable -- but every drawn
      frame also forces a re-blur of the glass header floating over it, and on
      a 120Hz display "display rate" would be four times the work for nothing.
    */
    let last = 0;
    const loop = (t: number) => {
      if (t - last >= 32) {
        last = t;
        frame(t);
      }
      raf = requestAnimationFrame(loop);
    };

    // WCAG 2.2.2 -- the site-wide "Pause motion" toggle (MotionToggle).
    const pausedByUser = () =>
      document.documentElement.classList.contains("motion-paused");

    const start = () => {
      if (raf || reduce.matches || !inView || document.hidden || pausedByUser()) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      stop();
      resize();
      if (reduce.matches || pausedByUser()) frame(performance.now()); // a still frame
      else start();
    };

    const classWatch = new MutationObserver(sync);
    classWatch.observe(document.documentElement, {
      attributes: true,
      // class: the pause toggle. data-theme: re-read the floor colours.
      attributeFilter: ["class", "data-theme"],
    });

    const onPointer = (e: PointerEvent) => {
      if (!finePointer.matches || reduce.matches) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce.matches) frame(0);
    });
    ro.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());

    sync();
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", sync);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      classWatch.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
