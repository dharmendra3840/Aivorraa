import Link from "next/link";

import { SERVICES } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";
import { ButtonLink, Container, cx } from "@/components/ui";
import {
  ArrowRightIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons";
import { MotionToggle } from "@/components/motion/MotionToggle";
import {
  CONTACT,
  ORGANISATION,
  SITE,
  VERIFIED_PROFILES,
} from "@/lib/site-config";

/**
 * PRD §14 — "Active service links, social profiles, contact, legal pages,
 * company details only when verified."
 *
 * PRD §13 Dead links — /pricing/ and /careers/ are deliberately ABSENT: there
 * is no approved pricing and no confirmed open role. Re-add them only
 * alongside a real page.
 *
 * Every contact channel and company detail below is rendered conditionally from
 * site-config, so an unverified value cannot reach the page.
 *
 * The reference's footer: charcoal, a closing line with one link, columns of
 * small links, and the name set enormous across the bottom edge.
 */

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
} as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

const WORDMARK = "Aivorraa";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="world-window scope-dark text-ink relative mt-28 overflow-clip sm:mt-36">
      {/* A window onto the world, as the reference closes: the camera has
          flown back down to the portal by the time the footer arrives. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,11,10,0.2)_0%,rgba(7,11,10,0.72)_45%,rgba(7,11,10,0.92)_100%)]"
      />
      <Container className="pt-32 sm:pt-44 lg:pt-56">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-10">
          {/* Closing line + brand */}
          <div className="max-w-md">
            <p className="text-[1.9rem] leading-[1.1] tracking-[-0.03em] sm:text-[2.6rem]">
              Websites that get found, apps that get used, and automation that
              gives your team{" "}
              <span className="text-signature">its week back.</span>
            </p>
            <div className="mt-8">
              <ButtonLink href="/contact" variant="link" className="text-base">
                Start a project
              </ButtonLink>
            </div>
          </div>

          <FooterColumn title="Services">
            {SERVICES.map((service) => (
              <FooterLink key={service.slug} href={`/${service.slug}`}>
                {service.nav}
              </FooterLink>
            ))}
            <FooterLink href="/services" emphasis>
              All services
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Industries">
            {INDUSTRIES.map((industry) => (
              <FooterLink
                key={industry.slug}
                href={`/industries#${industry.slug}`}
              >
                {industry.name}
              </FooterLink>
            ))}
            <FooterLink href="/about" className="mt-4">About Aivorraa</FooterLink>
            <FooterLink href="/portfolio">Case Studies</FooterLink>
            <FooterLink href="/insights">Insights</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <div>
            <h2 className="text-ink-400 mb-5 text-[0.75rem] font-normal tracking-[0.02em]">
              Get in touch
            </h2>
            {/* PRD §3.7 / §5 — the one proposition, stated identically
                everywhere, naming the brand rather than saying "we". */}
            <p className="text-ink-500 text-sm leading-relaxed">
              {SITE.proposition}
            </p>
            <div className="mt-5 grid gap-2.5 text-sm">
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-ink inline-flex items-center gap-2.5"
              >
                <MailIcon className="h-4 w-4 shrink-0" />
                <span className="link-draw">{CONTACT.email}</span>
              </a>

              {/* Rendered only once a verified business number exists (§29). */}
              {CONTACT.phone ? (
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="text-ink"
                >
                  <span className="link-draw">{CONTACT.phone}</span>
                </a>
              ) : null}

              {CONTACT.whatsapp ? (
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  className="text-ink inline-flex items-center gap-2.5"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span className="link-draw">WhatsApp</span>
                </a>
              ) : null}

              <p className="text-ink-500">{CONTACT.serviceArea}</p>
            </div>

            {/* PRD §16 — only verified profiles are linked, matching the
                sameAs array exactly. Labelled, not bare icons. */}
            {VERIFIED_PROFILES.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {VERIFIED_PROFILES.map((profile) => {
                  const IconCmp =
                    SOCIAL_ICONS[profile.key as keyof typeof SOCIAL_ICONS];
                  if (!IconCmp) return null;
                  return (
                    <li key={profile.key}>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-line-strong text-ink hover:bg-ink hover:text-page inline-flex h-9 items-center gap-2 rounded-md border px-3 text-[0.8125rem] transition-colors"
                      >
                        <IconCmp className="h-4 w-4 shrink-0" />
                        {profile.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="border-line text-ink-500 mt-16 flex flex-col gap-4 border-t pt-7 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-1.5">
            <span aria-hidden="true" className="bg-brand-500 inline-block h-px w-6" />
            &copy; {year}{" "}
            {/* §29 — the registered legal name replaces the brand name here
                once confirmed. */}
            {SITE.legalName ?? SITE.name}. All rights reserved.
            {ORGANISATION.gstin ? <> &middot; GSTIN {ORGANISATION.gstin}</> : null}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-draw hover:text-ink transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <MotionToggle />
            </li>
            <li>
              {/* A real anchor, not a scroll handler: works without
                  JavaScript, keyboard-activatable, and Lenis animates it. */}
              <a
                href="#main"
                className="hover:text-ink inline-flex items-center gap-2 transition-colors"
              >
                Back to top
                <ArrowRightIcon className="h-3.5 w-3.5 -rotate-90" />
              </a>
            </li>
          </ul>
        </div>
      </Container>

      {/* The name, enormous, cut by the bottom edge. Decorative: the brand is
          already named by the copyright line, so it is not announced again. */}
      <div aria-hidden="true" className="mt-10 select-none sm:mt-14">
        <div className="container-page">
          <p className="wordmark text-ink">
            {WORDMARK.split("").map((ch, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-ink-400 mb-5 text-[0.75rem] font-normal tracking-[0.02em]">
        {title}
      </h2>
      <ul className="grid gap-2 text-[0.9375rem]">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  emphasis = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <li className={className}>
      <Link
        href={href}
        className={cx(
          "transition-colors",
          emphasis ? "text-ink" : "text-ink-600 hover:text-ink",
        )}
      >
        <span className="link-draw">{children}</span>
      </Link>
    </li>
  );
}
