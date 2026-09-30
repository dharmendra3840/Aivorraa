"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { cx } from "@/components/ui";

/**
 * The Aivorraa monogram drawing itself -- the brand's logo-reveal video, used
 * as a large, faint watermark.
 *
 * THE VIDEO IS NEVER SHOWN DIRECTLY. ITS FRAMES ARE DRAWN ONTO A CANVAS.
 * Two reasons, both measured:
 *
 *  1. LCP. A playing <video> is a Largest Contentful Paint candidate, and at
 *     watermark size it out-measures the H1. It took over as the LCP element
 *     (460ms-1256ms locally) -- tying the page's LCP to a 197KB file that
 *     only starts after the load event, which on a slow connection is
 *     seconds. Setting the video to opacity 0 did NOT help: Chrome still
 *     counted it. So the decoder is a DETACHED element, created in script and
 *     never inserted into the document -- it cannot be an LCP candidate
 *     because it is not on the page at all. A <canvas> never is either. The
 *     H1 stays the LCP element.
 *
 *  2. THE WORDMARK. The source (public/brand/logo-reveal.mp4, 960x540, 3.5s)
 *     ends by fading in a wordmark that reads "AIVORRA" -- one A short.
 *     drawImage copies only the monogram's source rectangle (x 295..664,
 *     y 70..439, measured from the settled frames); the wordmark begins at
 *     y~450, so it is never drawn at all, in any frame. Replace the file with
 *     a corrected export when one exists; if its framing changes, re-measure
 *     CROP.
 *
 * THE NAVY BACKGROUND IS REMOVED, NOT MASKED
 * The video sits on #040d1c navy. `contrast()` on the canvas pushes that to
 * black while leaving the strokes intact. On paper the frame is then inverted
 * and multiplied (white adds nothing); inside `.scope-dark` it is screened
 * (black adds nothing). Either way there is no box, only the letters -- see
 * motion-brand.css.
 *
 * LOADING AND FALLBACKS
 *  - No `src` until needed: the file is fetched only when the watermark
 *    scrolls into view (or, for `trigger="load"`, after the load event).
 *  - Plays ONCE and holds on the finished mark. A looping watermark would
 *    pull the eye back to it every 3.5 seconds.
 *  - Reduced motion, no JavaScript, or playback refused: the static monogram
 *    (extracted from the same video) is shown instead.
 */

const SRC = "/brand/logo-reveal.mp4";
// Source rectangle of the monogram, px. See the note above before changing.
const CROP = { left: 295, top: 70, side: 369 };

export function MonogramVideo({
  className,
  trigger = "view",
  rate = 1.1,
}: {
  className?: string;
  /** "view": play when scrolled into view. "load": play after page load. */
  trigger?: "view" | "load";
  rate?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /*
    Mode lives in a data attribute written straight to the DOM, not in React
    state -- it drives CSS only, so a re-render would be wasted work.
      idle   -- JS running, waiting to start: show NOTHING, so the mark draws
                from empty (showing the finished still first and then letting
                the video "undraw" it would be backwards)
      video  -- playing / finished: the canvas is the mark
      static -- reduced motion or playback refused: the extracted still
    Without JavaScript the attribute stays "idle" and CSS shows the still for
    `html:not(.js)` instead.
  */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const setMode = (m: "video" | "static") => {
      wrap.dataset.mode = m;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("static");
      return;
    }

    // Detached decoder -- see note 1 above. Never appended to the document.
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";

    const draw = () =>
      ctx.drawImage(
        video,
        CROP.left,
        CROP.top,
        CROP.side,
        CROP.side,
        0,
        0,
        canvas.width,
        canvas.height,
      );

    // Copied once per display frame for the ~3s it plays, then never again.
    let raf = 0;
    const pump = () => {
      draw();
      if (!video.ended && !video.paused) raf = requestAnimationFrame(pump);
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      video.src = SRC;
      video.playbackRate = rate;
      video.addEventListener("ended", draw, { once: true }); // hold the last frame
      video
        .play()
        .then(() => {
          setMode("video");
          pump();
        })
        // Autoplay refused (data saver, policy): keep the still. Nothing lost.
        .catch(() => setMode("static"));
    };

    /*
      "Pause motion" (WCAG 2.2.2). The reveal is only ~3s, under the 5s the
      criterion allows, but a visitor who asked for stillness should get it:
      a reveal in progress jumps to its finished frame; one not yet started
      shows the still instead of playing.
    */
    const root = document.documentElement;
    const honourPause = () => {
      if (!root.classList.contains("motion-paused")) return;
      if (!started) {
        started = true;
        setMode("static");
        return;
      }
      if (!video.ended && Number.isFinite(video.duration)) {
        video.pause();
        video.addEventListener("seeked", draw, { once: true });
        video.currentTime = video.duration;
      }
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const pauseWatch = new MutationObserver(honourPause);
    pauseWatch.observe(root, { attributes: true, attributeFilter: ["class"] });
    honourPause();

    let io: IntersectionObserver | null = null;
    if (trigger === "load") {
      if (document.readyState === "complete") start();
      else window.addEventListener("load", start, { once: true });
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            start();
            io?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(wrap);
    }

    return () => {
      pauseWatch.disconnect();
      window.removeEventListener("load", start);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute("src");
      video.load(); // release the decoder
    };
  }, [trigger, rate]);

  return (
    <div
      ref={wrapRef}
      className={cx("mono-video", className)}
      data-mode="idle"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="mono-video-canvas"
        width={CROP.side}
        height={CROP.side}
      />
      <Image
        className="mono-video-still"
        src="/brand/monogram.png"
        alt=""
        width={512}
        height={512}
        unoptimized
      />
    </div>
  );
}
