import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/ui";
import { PageTransition } from "@/components/motion/PageTransition";
import { PointerFX } from "@/components/motion/PointerFX";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ThemeToggle } from "@/components/motion/ThemeToggle";
import { organizationSchema, schemaGraph } from "@/lib/schema";
import { SITE } from "@/lib/site-config";

/**
 * PRD §18 — Poppins and DM Sans were the stated typography preference.
 * Self-hosted via next/font so there is no external stylesheet request and no
 * font-swap layout shift (PRD §21 — CLS <= 0.1).
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  /**
   * PRD §15 — the homepage title already set in Rank Math is good and stays.
   * Child pages supply their own absolute title; the template appends the brand
   * so the name co-occurs with service terms (PRD §3.7).
   */
  title: {
    default: "Aivorraa — Digital Agency | Web Dev, AI & Growth",
    template: "%s",
  },
  description: SITE.proposition,
  applicationName: SITE.name,
  /**
   * PRD §2 Finding 6 — "interior designer near me" is deliberately NOT present.
   * It matched no content on the page. No keywords meta is emitted at all;
   * it carries no ranking weight.
   */
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  /**
   * Icons are generated at build time from brand tokens (see
   * src/components/og/BrandCard.tsx) and served from routes with real file
   * extensions. Next's extensionless `icon`/`opengraph-image` conventions are
   * deliberately not used: with `trailingSlash: true` their paths 308-redirect
   * before serving, and a crawler should get a 200 on the first request.
   */
  icons: {
    /*
      Built by scripts/build-icons.mjs from the monogram, with the strokes
      thickened per size so the calligraphic hairlines survive at 16px.
      /favicon.ico matters on its own: browsers, bookmarks and Google Search
      request it directly whatever these tags say -- it used to 404.
      New filenames, not the old /icon.png, so browsers holding the previous
      icon in their (very sticky) favicon cache fetch the new one.
    */
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/brand/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: `${SITE.url}/` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0c09",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={SITE.language}
      className={`${poppins.variable} ${dmSans.variable}`}
      // Dark (espresso) is the default theme -- and what renders without JS.
      data-theme="dark"
      /*
        The inline script below adds `js` to this element BEFORE hydration, so
        React finds a className on the client that differs from the one it
        rendered on the server and logs a hydration mismatch.

        This is the sanctioned escape hatch for exactly that case: an attribute
        on <html> deliberately mutated by a pre-hydration script. It suppresses
        the warning for this element's own attributes only — one level deep —
        so a genuine mismatch anywhere in the tree is still reported.
      */
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document as JavaScript-capable BEFORE first paint.

          Every animation that starts an element hidden is gated behind
          `html.js` in motion.css. If this script does not run — JS disabled, a
          crawler that does not execute it, a script error earlier in the head —
          none of the hiding rules apply and the page renders fully visible.

          PRD §2 Finding 4 records the live site's scroll-animation library
          setting the header to `opacity: 0` and breaking it, and Finding 1 is
          that only the homepage was indexed. Content that needs JavaScript to
          become visible is the wrong risk to take on this site.

          Inline and blocking on purpose: as an external or deferred script it
          would land after first paint and cause a visible flash.
        */}
        <script
          dangerouslySetInnerHTML={{
            // "js" gates the motion CSS; "motion-paused" restores a saved
            // WCAG 2.2.2 pause choice BEFORE first paint (MotionToggle), and
            // data-theme a saved light-theme choice (ThemeToggle) -- so a
            // returning visitor never sees a frame of the wrong theme.
            __html: `var d=document.documentElement;d.classList.add("js");try{if(localStorage.getItem("aivorraa:motion")==="paused")d.classList.add("motion-paused");if(localStorage.getItem("aivorraa:theme")==="light")d.setAttribute("data-theme","light")}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        {/* PRD §19 — keyboard users reach the content without tabbing the menu. */}
        <a
          href="#main"
          className="bg-ink text-page rounded-pill sr-only z-[100] px-5 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>

        {/*
          PRD §3.1 / §16 — Organization schema with sameAs on EVERY page. This is
          the primary mechanism for linking the website, Instagram and (once
          verified) LinkedIn to one entity, which is what resolves the
          "Aivorraa vs Aivora" spelling-correction problem in PRD §3.
        */}
        <JsonLd json={schemaGraph(organizationSchema())} />

        {/*
          Scroll progress hairline. Pure CSS via `animation-timeline: scroll()`
          — there is no scroll listener behind it. Decorative, so it is hidden
          from assistive technology.
        */}
        <div className="scroll-progress" aria-hidden="true" />

        {/*
          The branded curtain: first load (pure CSS, self-terminating -- see
          motion.css) and every page change after it. See PageTransition.
        */}
        <PageTransition />

        {/* One delegated pointer listener drives every spotlight and magnet. */}
        <PointerFX />

        {/* Inertial scrolling. Disabled entirely under reduced motion. */}
        <SmoothScroll />

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Light / dark switch, fixed bottom-right. Last in the DOM so it is
            last in the tab order rather than the first stop on every page. */}
        <ThemeToggle />
      </body>
    </html>
  );
}
