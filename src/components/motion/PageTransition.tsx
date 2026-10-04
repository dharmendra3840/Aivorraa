"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * The branded curtain, on first load AND on every page change.
 *
 * FIRST LOAD is unchanged and pure CSS (motion.css): the panel is in the
 * server HTML and wipes away on a timed animation, so it leaves on its own
 * even if no script ever runs.
 *
 * PAGE CHANGES are the part that needs this component. Next.js links swap the
 * page without reloading the document, and this curtain lives in the root
 * layout, which never unmounts -- so its one-shot CSS animation never played
 * again after the first load. Now:
 *
 *   1. COVER  -- an internal link click is caught (capture phase, before
 *                Next's <Link> handler), and the curtain wipes UP over the
 *                current page (~0.38s). Navigation starts only once it is
 *                covered, so the old page never visibly tears into the new.
 *   2. REVEAL -- when the new route commits, the curtain carries on UP and
 *                away, uncovering the new page. One continuous upward sweep.
 *
 * Back / forward (no click to catch) replays the first-load wipe instead.
 *
 * WHY THE PHASE CHANGES DURING RENDER, NOT IN AN EFFECT
 * The route change is detected by comparing the pathname during render, and
 * the curtain's phase is set right there. React then commits the new page
 * and the curtain's new state in the same paint. Doing it in an effect would
 * let the new page paint for one frame before the curtain reacted -- a flash.
 *
 * IT CAN NEVER GET STUCK
 *  - A script safety net lifts the curtain if the route has not committed
 *    within 6s.
 *  - A CSS one too, for the case where scripts have died: the cover phase
 *    carries a second, delayed lift animation (motion.css).
 *  - Reduced motion: no interception at all; navigation is instant, and the
 *    curtain is `display: none` under that preference anyway.
 *
 * Not intercepted: modified clicks (new tab/window), non-primary buttons,
 * target="_blank", downloads, other origins, mailto:/tel:, and links to the
 * page you are already on (hash links such as "Back to top" included).
 */

type Phase = "initial" | "enter" | "cover" | "reveal";

const COVER_MS = 380;
const SAFETY_MS = 6000;

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("initial");
  // Bumped to remount the panel, which restarts every animation inside it.
  const [cycle, setCycle] = useState(0);
  const [awaiting, setAwaiting] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  const busy = useRef(false);
  const safety = useRef(0);

  // Route committed: decide the curtain's phase in the same render.
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    if (awaiting) {
      setAwaiting(false);
      setPhase("reveal");
    } else {
      setCycle((c) => c + 1);
      setPhase("enter");
    }
  }

  // The app is running: tells the inline head script's failsafe to stand
  // down (see layout.tsx). Mounted once, in the root layout.
  useEffect(() => {
    (window as Window & { __aivReady?: boolean }).__aivReady = true;
  }, []);

  // The navigation has landed; accept the next click.
  useEffect(() => {
    busy.current = false;
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const a = target.closest("a");
      if (!a || !a.href) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      // Stops the browser AND Next's <Link> (it bails on defaultPrevented);
      // the navigation happens below, once the page is covered.
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;

      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);
      setAwaiting(true);
      setCycle((c) => c + 1);
      setPhase("cover");
      window.setTimeout(() => router.push(href), COVER_MS);

      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => {
        busy.current = false;
        setAwaiting(false);
        setPhase((p) => (p === "cover" ? "reveal" : p));
      }, SAFETY_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(safety.current);
    };
  }, [router]);

  return (
    <div
      key={cycle}
      className="page-curtain scope-dark"
      data-phase={phase}
      aria-hidden="true"
    >
      {/* The name rises out of a mask while the panel holds the screen. */}
      <span className="curtain-mark">
        <span>Aivorraa</span>
      </span>
    </div>
  );
}
