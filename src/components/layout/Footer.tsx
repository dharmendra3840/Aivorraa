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
import { Logo } from "./Logo";
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
 * PRD §13 Dead links — /pricing/ and /careers/ are deliberately ABSENT. The
 * PRD requires each to either become a real page with real content or be
 * removed from navigation; there is no approved pricing and no confirmed open
 * role, so they are removed. Re-add them here only alongside a real page.
 *
 * Every contact channel and company detail below is rendered conditionally from
 * site-config, so an unverified value cannot reach the page.
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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="scope-dark bg-panel border-line relative isolate mt-20 overflow-clip border-t text-ink">
      {/*
        Brand watermark, sitting BEHIND the footer content rather than in a band
        beneath it.

        Anchored to the footer's lower edge and pushed down by a quarter of its
        own height, so the letters are cut by the bottom of the section and the
        copyright row reads across their upper halves. That overlap is the whole
        effect — as a flow sibling underneath the columns it just added a strip
        of empty dark space.

        `isolate` on the footer gives this its own stacking context, so z-0 here
        and z-10 on the content cannot be affected by anything outside.

        Decorative only: the name is already carried by the logo above and the
        copyright line, so it is hidden from assistive technology rather than
        announced a third time.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none"
      >
        <span className="footer-glow" />
        <span className="brand-watermark">AIVORRAA</span>
      </div>

      {/* Content rides above the watermark. */}
      {/*
        Bottom padding scales with the watermark. The wordmark is sized in vw,
        so on a narrow screen it is small; a fixed large pad would leave it
        stranded in empty space below the bottom bar instead of tucked against
        it.
      */}
      <Container className="relative z-10 pt-14 pb-12 sm:pb-16 lg:pt-18 lg:pb-28">
        {/*
          A closing line that says what the work does, in plain words. PRD
          §5's one proposition is still stated verbatim in the brand column
          below -- this sits above it as a headline.
        */}
        <div className="border-line mb-14 flex flex-col gap-8 border-b pb-14 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-display max-w-3xl text-[1.9rem] leading-[1.12] font-semibold tracking-[-0.03em] text-ink sm:text-[2.6rem]">
            Websites that get found, apps that get used, and automation
            that gives your team <span className="text-signature">its week back.</span>
          </p>
          <div className="shrink-0">
            <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
              Start a project
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo tone="light" className="h-7" />
            {/* PRD §3.7 / §5 — the one proposition, stated identically
                everywhere, naming the brand rather than saying "we". */}
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              {SITE.proposition}
            </p>

            <div className="mt-6 grid gap-2.5 text-sm">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2.5 text-ink/75 transition-colors hover:text-ink"
              >
                <MailIcon className="h-4 w-4 shrink-0" />
                {CONTACT.email}
              </a>

              {/* Rendered only once a verified business number exists (§29). */}
              {CONTACT.phone ? (
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="text-ink/75 transition-colors hover:text-ink"
                >
                  {CONTACT.phone}
                </a>
              ) : null}

              {CONTACT.whatsapp ? (
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  className="inline-flex items-center gap-2.5 text-ink/75 transition-colors hover:text-ink"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              ) : null}

              <p className="text-ink/50">{CONTACT.serviceArea}</p>
            </div>

            {/* PRD §16 — only verified profiles are linked, matching the
                sameAs array exactly. Consistency is the entity signal. */}
            {/*
              Labelled pills rather than bare icon circles. An icon alone
              relies on the visitor recognising the mark and needs an
              aria-label to mean anything; the name beside it is legible to
              everyone and reads as a deliberate component rather than a
              default social row.
            */}
            {VERIFIED_PROFILES.length > 0 ? (
              <ul className="mt-7 flex flex-wrap gap-2.5">
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
                        className="social-pill"
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
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink href="/about">About Aivorraa</FooterLink>
            <FooterLink href="/portfolio">Case Studies</FooterLink>
            <FooterLink href="/insights">Insights</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            {LEGAL_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-7 text-sm text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year}{" "}
            {/* §29 — the registered legal name replaces the brand name here
                once confirmed. Until then the brand name alone is used rather
                than implying an entity form that is not verified. */}
            {SITE.legalName ?? SITE.name}. All rights reserved.
            {ORGANISATION.gstin ? <> &middot; GSTIN {ORGANISATION.gstin}</> : null}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <MotionToggle />
            <p>
              Built by{" "}
              <Link href="/" className="text-ink/70 hover:text-ink">
                Aivorraa
              </Link>
            </p>

            {/*
              A real anchor, not a scroll handler. It works with JavaScript
              disabled, it is focusable and activatable by keyboard for free,
              and `scroll-behavior: smooth` on the root animates it — so the
              whole control costs no JavaScript at all.
            */}
            <a
              href="#main"
              className="to-top group inline-flex items-center gap-2.5 text-ink/60 transition-colors hover:text-ink"
            >
              Back to top
              <span className="to-top-disc" aria-hidden="true">
                <ArrowRightIcon className="h-4 w-4 -rotate-90" />
              </span>
            </a>
          </div>
        </div>
      </Container>
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
      <h2 className="font-display mb-4 text-[0.7rem] font-semibold tracking-[0.14em] text-ink/55 uppercase">
        {title}
      </h2>
      <ul className="grid gap-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  emphasis = false,
}: {
  href: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cx(
          "transition-colors hover:text-ink",
          emphasis ? "font-semibold text-ink/85" : "text-ink/60",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
