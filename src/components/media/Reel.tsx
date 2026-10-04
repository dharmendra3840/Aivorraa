"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { REEL } from "@/content/media";

/**
 * The growing reel: a card that opens to full-bleed as the reader scrolls
 * (motion.css §4), playing a silent loop.
 *
 * The video is decorative -- no sound, no information -- so it is hidden from
 * assistive technology, and the caption beside it is real text. It is never
 * the LCP element: `preload="none"` and no `src` is fetched until the reel is
 * near the viewport, and the poster stands in until then.
 *
 * It plays only while ALL of these hold, and pauses the moment one stops:
 *   - the reel is on screen
 *   - the reader has not asked for reduced motion
 *   - the reader has not pressed "Pause motion" (WCAG 2.2.2) -- watched via
 *     the `motion-paused` class the toggle puts on <html>
 */
export function Reel({ caption }: { caption?: ReactNode }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      const allowed = visible && !reduce.matches && !root.classList.contains("motion-paused");
      if (allowed) {
        if (!v.src) v.src = REEL.src;
        v.play().catch(() => {
          // Autoplay refused (data saver, power mode): the poster stays.
        });
      } else if (!v.paused) {
        v.pause();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    reduce.addEventListener("change", sync);
    return () => {
      io.disconnect();
      mo.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="reel scope-dark">
      <div className="reel-stage">
        <div
          className="reel-frame"
          style={{ backgroundImage: `url(${REEL.poster})` }}
        >
          <video
            ref={video}
            poster={REEL.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            width={REEL.width}
            height={REEL.height}
          />
        </div>
        {caption ? <div className="reel-caption">{caption}</div> : null}
      </div>
    </div>
  );
}
