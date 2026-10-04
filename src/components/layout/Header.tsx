"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

// Deliberately NOT importing from @/content/services: this is a client
// component, and that module would drag the whole service catalogue — every
// FAQ answer and deliverable description — into the browser bundle. See the
// header comment in services.nav.ts. (media.ts is small: names and alt text.)
import {
  NAV_GROUPS,
  SERVICE_NAV,
  getNavItem,
} from "@/content/services.nav";
import { SERVICE_MEDIA } from "@/content/media";
import { ButtonLink, Container, cx } from "@/components/ui";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Photo } from "@/components/media/Photo";
import { Logo } from "./Logo";

/**
 * PRD §13 — "The mega-menu must link all eight service pages directly. Deep
 * internal linking from a site-wide element is one of the strongest levers for
 * getting those pages crawled."
 *
 * The links are rendered in the server-delivered HTML at all times, not
 * injected on hover, so a crawler sees all eight without executing JavaScript.
 * The menu only controls visibility.
 *
 * PRD §19 — grouped services, keyboard support, clear focus states, mobile
 * menu.
 *
 * THE REFERENCE'S HEADER (brandium.nl), reproduced:
 *   - it is never a bar: no background, fixed in place, always there -- the
 *     page scrolls UNDER it rather than the header scrolling away
 *   - the name and the links are white in a `mix-blend-mode: difference`
 *     layer (.header-blend, motion.css §8d), so they invert against whatever
 *     passes beneath: black over white, white over charcoal and photographs
 *   - the action button is a separate, normal layer, so it stays solid
 * Two fixed layers rather than one: a blend only works on the fixed element
 * itself; any positioned wrapper with a z-index would isolate it.
 */

/*
  Every label points at a real, indexable page, in plain words:
    Services      -> /services, and carries the mega-menu linking all eight
                     service pages (PRD §13 -- the crawl-critical part)
    AI Automation -> /ai-automation
    Development   -> /web-development
    Growth        -> /digital-marketing
    Case Studies  -> /portfolio
  About and Industries are in the footer, linked from every page.
*/
const NAV: Array<{ label: string; href: string; mega?: boolean }> = [
  { label: "Services", href: "/services", mega: true },
  { label: "AI Automation", href: "/ai-automation" },
  { label: "Development", href: "/web-development" },
  { label: "Growth", href: "/digital-marketing" },
  { label: "Case Studies", href: "/portfolio" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/** Position of each service in the preview stack (see motion.css). */
const SERVICE_INDEX = new Map(SERVICE_NAV.map((s, i) => [s.slug, i]));

export function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaId = useId();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on navigation -- adjusted during render, not in an
  // effect, because it derives from a changed input (React's guidance).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  // Scrolling closes the mega-menu: a reader who opens it and then just
  // scrolls on never fires a mouseleave. (React bails out when it is
  // already closed, so this does not re-render per scroll event.)
  useEffect(() => {
    const onScroll = () => setMegaOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A pending close must not fire after unmount.
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Escape closes; a click outside closes the mega-menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Lock scroll behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  // The keyboard equivalent of mouseleave: close when focus leaves the header.
  const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !navRef.current?.contains(next)) setMegaOpen(false);
  };

  return (
    <header>
      <div
        ref={navRef}
        onMouseLeave={scheduleCloseMega}
        onBlur={handleFocusOut}
        data-mega-shell={megaOpen ? "open" : "closed"}
      >
        {/* Layer 1 -- the name and the links, difference-blended. */}
        <div className="header-blend">
          <Container>
            <div className="flex h-[4.5rem] items-center gap-6">
              <Link
                href="/"
                className="shrink-0 rounded-md text-[0.95rem]"
                aria-label="Aivorraa — home"
                data-cursor="hidden"
              >
                <Logo />
              </Link>

              {/* Desktop navigation, centred in the bar. */}
              <nav
                aria-label="Primary"
                className="mx-auto hidden items-center gap-1 lg:flex xl:gap-4"
              >
                {NAV.map((item) =>
                  item.mega ? (
                    <div key={item.href} onMouseEnter={openMega}>
                      <Link
                        href={item.href}
                        aria-expanded={megaOpen}
                        aria-controls={megaId}
                        onFocus={openMega}
                        onClick={() => setMegaOpen(false)}
                        data-cursor="hidden"
                        className="flex items-center gap-1 rounded-md px-2.5 py-2 text-[0.9375rem] whitespace-nowrap"
                      >
                        <span className="roll">
                          <span data-text={item.label}>{item.label}</span>
                        </span>
                        <ChevronDownIcon
                          className={cx(
                            "h-3.5 w-3.5 transition-transform duration-300",
                            megaOpen && "rotate-180",
                          )}
                        />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      data-cursor="hidden"
                      className={cx(
                        "rounded-md px-2.5 py-2 text-[0.9375rem] whitespace-nowrap",
                        isActive(item.href) && "underline decoration-1 underline-offset-[6px]",
                      )}
                    >
                      <span className="roll">
                        <span data-text={item.label}>{item.label}</span>
                      </span>
                    </Link>
                  ),
                )}
              </nav>

              {/* Holds the space the action layer occupies on the right. */}
              <span aria-hidden="true" className="ml-auto w-11 shrink-0 sm:w-40 lg:ml-0" />
            </div>
          </Container>
        </div>

        {/* Layer 2 -- the solid action button and the menu toggle. */}
        <div className="header-actions w-full">
          <Container>
            <div className="flex h-[4.5rem] items-center justify-end gap-2">
              {/* Wrapped: a display utility on the button would lose to its
                  own base `inline-flex` (see the note in components/ui). */}
              <span className="hidden sm:block">
                <ButtonLink href="/contact" variant="primary" size="md" withArrow>
                  Start a project
                </ButtonLink>
              </span>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="bg-signal text-page inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden"
              >
                {mobileOpen ? (
                  <CloseIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </Container>
        </div>

        {/* Desktop mega-menu. All eight service links are in the HTML at all
            times; `hidden` only controls visibility. A fixed sheet of its own
            below the bar, so opening it never moves the page. */}
        <div
          id={megaId}
          hidden={!megaOpen}
          className="mega-panel bg-page border-line fixed inset-x-0 top-0 z-40 hidden border-b pt-[4.5rem] shadow-[var(--shadow-float)] lg:block"
        >
          <Container>
            <div className="grid gap-10 pt-8 pb-10 lg:grid-cols-[1fr_1fr_20rem]">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="eyebrow mb-1">
                    <span aria-hidden="true">&#10022;</span>
                    {group.label}
                  </p>
                  <p className="text-ink-500 mb-6 text-sm">{group.blurb}</p>
                  <ul className="grid gap-1">
                    {group.slugs.map((slug) => {
                      const service = getNavItem(slug);
                      if (!service) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/${slug}`}
                            data-i={SERVICE_INDEX.get(slug)}
                            className="group block py-1.5"
                          >
                            <span className="text-[1.6rem] leading-tight font-light tracking-[-0.035em]">
                              <span className="link-draw">{service.nav}</span>
                            </span>
                            <span className="text-ink-500 block text-[0.8125rem] leading-snug">
                              {service.summary}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <div className="flex flex-col gap-5">
                {/* Decorative preview of the hovered service. */}
                <div className="mega-preview rounded-card relative aspect-[4/3] overflow-hidden" aria-hidden="true">
                  {SERVICE_NAV.map((s, i) => (
                    <Photo
                      key={s.slug}
                      id={SERVICE_MEDIA[s.slug] ?? "svc-web"}
                      sizes="20rem"
                      still
                      reveal={false}
                      alt=""
                      className={`preview-${i}`}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-lg leading-snug font-light tracking-[-0.02em]">
                    Not sure which one you need?
                  </p>
                  <p className="text-ink-500 mt-2 text-sm leading-relaxed">
                    Tell Aivorraa what you are building and you will get a
                    straight recommendation — including when the answer is to fix
                    what you have rather than rebuild it.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <ButtonLink href="/contact" variant="primary" size="sm" withArrow>
                      Start a project
                    </ButtonLink>
                    <ButtonLink href="/services" variant="link" className="text-sm">
                      See all services
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile menu: full screen, large light type -- the reference's mobile
          treatment. Fixed, so it never pushes the page. */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="bg-page fixed inset-0 z-40 overflow-y-auto pt-[4.5rem] lg:hidden"
      >
        <Container className="pt-6 pb-12">
          <nav aria-label="Mobile" className="grid">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cx(
                  "border-line border-b py-3.5 text-[2rem] leading-tight font-light tracking-[-0.04em]",
                  isActive(item.href) ? "text-ink" : "text-ink-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="eyebrow mt-10 mb-3">
            <span aria-hidden="true">&#10022;</span>
            All services
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {SERVICE_NAV.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className="text-ink-600 hover:text-ink text-[0.9375rem]"
                >
                  {service.nav}
                </Link>
              </li>
            ))}
          </ul>

          <ButtonLink
            href="/contact"
            variant="primary"
            size="lg"
            withArrow
            className="mt-10 w-full"
          >
            Start a project
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
