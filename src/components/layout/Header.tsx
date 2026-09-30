"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

// Deliberately NOT importing from @/content/services: this is a client
// component, and that module would drag the whole service catalogue — every
// FAQ answer and deliverable description — into the browser bundle. See the
// header comment in services.nav.ts.
import {
  NAV_GROUPS,
  SERVICE_NAV,
  getNavItem,
} from "@/content/services.nav";
import {
  ACCENT,
  ButtonLink,
  Container,
  cx,
} from "@/components/ui";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  Icon,
  MenuIcon,
} from "@/components/icons";
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
 * accordion.
 */

/*
  Every label points at a real, indexable page, in plain words:
    Services      -> /services, and carries the mega-menu linking all eight
                     service pages (PRD §13 -- the crawl-critical part)
    AI Automation -> /ai-automation
    Development   -> /web-development
    Growth        -> /digital-marketing (funnels, CRO, GA4 -- the "growth
                     systems" of the brief)
    Case Studies  -> /portfolio
  About and Industries moved to the footer, where they remain linked from
  every page.
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

export function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaId = useId();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on navigation. Done by comparing against the previous
  // pathname during render rather than in an effect: setState inside an effect
  // triggers a second render pass, and React's own guidance is to adjust state
  // during render when it derives from a changed input.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  // Subtle elevation change once the page scrolls, matching the design's
  // floating pill treatment.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      /*
        Scrolling closes the mega-menu.

        It opens on hover and closes on mouseleave, which covers the pointer
        moving away but not the far more common case: the reader opens it,
        decides against it and just scrolls on. The pointer never moves, so no
        mouseleave ever fires and the panel stays open over the page -- which
        is what it was doing while the reader was three sections further down.

        Safe to call unconditionally; React bails out when the state is
        already false, so this does not re-render on every scroll event.
      */
      setMegaOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes; click outside closes the mega-menu.
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

  // Lock scroll behind the mobile drawer.
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

  /*
    The keyboard equivalent of mouseleave. The menu opens when the Services
    link takes focus, so it has to close when focus leaves the header ---
    otherwise tabbing past it left a 460px panel open over the page with the
    reader's focus already somewhere below it.

    React's onBlur is a delegated `focusout`, so it fires for descendants too
    and `relatedTarget` is whatever is receiving focus. A null relatedTarget
    means focus left the document entirely, which should also close.
  */
  const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !navRef.current?.contains(next)) setMegaOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-5">
      <Container>
        <div
          ref={navRef}
          onMouseLeave={scheduleCloseMega}
          onBlur={handleFocusOut}
          data-mega-shell={megaOpen ? "open" : "closed"}
          className={cx(
            /*
              `relative` so the mega-menu can hang off the pill's bottom edge
              instead of being laid out inside it -- in flow it pushed the
              whole page down 459px every time it opened.

              The bottom corners square off while it is open so the pill and
              the panel read as one continuous card, and the pill's own bottom
              border becomes the divider between them.
            */
            "pill-surface relative transition-shadow duration-300",
            megaOpen ? "rounded-t-[1.75rem]" : "rounded-[1.75rem]",
            scrolled && "shadow-float",
          )}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
            <Link
              href="/"
              className="rounded-pill shrink-0"
              aria-label="Aivorraa — home"
            >
              <Logo className="h-6 w-auto sm:h-7" />
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Primary"
              className="hidden items-center gap-0.5 lg:flex xl:gap-1"
            >
              {NAV.map((item) =>
                item.mega ? (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={openMega}
                  >
                    <Link
                      href={item.href}
                      aria-expanded={megaOpen}
                      aria-controls={megaId}
                      onFocus={openMega}
                      onClick={() => setMegaOpen(false)}
                      className={cx(
                        "rounded-pill flex items-center gap-1 px-2 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors xl:px-3.5 xl:text-sm",
                        isActive(item.href)
                          ? "text-ink"
                          : "text-ink-500 hover:text-ink",
                      )}
                    >
                      <span className="roll">
                        <span data-text={item.label}>{item.label}</span>
                      </span>
                      <ChevronDownIcon
                        className={cx(
                          "h-4 w-4 transition-transform duration-200",
                          megaOpen && "rotate-180",
                        )}
                      />
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "rounded-pill px-2 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors xl:px-3.5 xl:text-sm",
                      isActive(item.href)
                        ? "text-ink"
                        : "text-ink-500 hover:text-ink",
                    )}
                  >
                    <span className="roll">
                      <span data-text={item.label}>{item.label}</span>
                    </span>
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              {/* Wrapped rather than given `hidden sm:inline-flex` directly:
                  a display utility on the component loses to the button's own
                  base `inline-flex`. Below 640px the label wraps and the pill
                  becomes a blob, and the drawer already carries a full-width
                  CTA, so it is hidden there. See the note in components/ui. */}
              <span className="hidden sm:block">
                <ButtonLink href="/contact" variant="primary" withArrow>
                  Start a project
                </ButtonLink>
              </span>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="border-line text-ink hover:bg-ink-50 rounded-pill inline-flex h-11 w-11 items-center justify-center border lg:hidden"
              >
                {mobileOpen ? (
                  <CloseIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop mega-menu. All eight service links are in the HTML at all
              times; `hidden` only controls visibility. */}
          <div
            id={megaId}
            hidden={!megaOpen}
            data-mega-open={megaOpen ? "true" : "false"}
            className="mega-panel mega-dock pill-surface hidden px-6 pt-6 pb-7 lg:block"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr_16rem]">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-ink-400 mb-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
                    {group.label}
                  </p>
                  <p className="text-ink-400 mb-4 text-sm">{group.blurb}</p>
                  <ul className="grid gap-1.5">
                    {group.slugs.map((slug, i) => {
                      const service = getNavItem(slug);
                      if (!service) return null;
                      const accent = ACCENT[service.accent];
                      return (
                        <li
                          key={slug}
                          className="mega-item"
                          style={{ "--i": i } as React.CSSProperties}
                        >
                          <Link
                            href={`/${slug}`}
                            className="spot group hover:bg-ink-50 flex items-start gap-3 rounded-2xl p-2.5 transition-colors"
                          >
                            <span
                              className={cx(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-transparent transition duration-300 group-hover:scale-110",
                                accent.bg,
                                accent.text,
                                accent.ring,
                              )}
                            >
                              <Icon name={service.icon} className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="text-ink group-hover:text-brand-700 block text-[0.9375rem] font-semibold transition-colors">
                                {service.nav}
                              </span>
                              <span className="text-ink-400 mt-0.5 block text-[0.8125rem] leading-snug">
                                {service.summary}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <div className="scope-dark bg-panel rounded-card border-brand-500/30 flex flex-col justify-between border bg-[linear-gradient(150deg,rgba(var(--glow-rgb),0.14),rgba(var(--accent-rgb),0.12)_60%,rgba(var(--glow-rgb),0.06))] p-6 text-ink shadow-[0_0_40px_-18px_rgba(var(--glow-rgb),0.39)]">
                <div>
                  <p className="font-display text-xl leading-tight font-semibold">
                    Not sure which one you need?
                  </p>
                  <p className="mt-2.5 text-sm text-ink/70">
                    Tell Aivorraa what you are building and you will get a
                    straight recommendation — including when the answer is to fix
                    what you have rather than rebuild it.
                  </p>
                </div>
                <div className="mt-6 grid gap-2">
                  <ButtonLink
                    href="/contact"
                    variant="primary"
                    size="sm"
                    withArrow
                    className="shine"
                  >
                    Start a project
                  </ButtonLink>
                  <Link
                    href="/services"
                    className="rounded-pill inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink/80 transition-colors hover:text-ink"
                  >
                    See all services
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      {/*
        Also docked rather than in flow, for the same reason as the mega-menu:
        as a sibling after the pill it grew the sticky header and pushed the
        page down by the full height of the drawer the moment it opened.
      */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="absolute inset-x-0 top-full lg:hidden"
      >
        <Container>
          <div className="pill-surface drawer-dock rounded-card mt-3 max-h-[calc(100dvh-8rem)] overflow-y-auto p-4">
            <nav aria-label="Mobile" className="grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                    isActive(item.href)
                      ? "bg-ink-50 text-ink"
                      : "text-ink-600 hover:bg-ink-50",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-line mt-4 border-t pt-4">
              <p className="text-ink-400 mb-2 px-4 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
                All services
              </p>
              <ul className="grid gap-0.5">
                {SERVICE_NAV.map((service) => {
                  const accent = ACCENT[service.accent];
                  return (
                    <li key={service.slug}>
                      <Link
                        href={`/${service.slug}`}
                        className="hover:bg-ink-50 flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors"
                      >
                        <span
                          className={cx(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                            accent.bg,
                            accent.text,
                          )}
                        >
                          <Icon name={service.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-ink-600 text-[0.9375rem] font-medium">
                          {service.nav}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <ButtonLink
              href="/contact"
              variant="primary"
              size="lg"
              withArrow
              className="mt-5 w-full"
            >
              Start Your Project
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
