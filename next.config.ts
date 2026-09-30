import type { NextConfig } from "next";

/**
 * PRD §13 — Redirect discipline.
 * Every legacy WordPress slug must 301 to its replacement rather than 404.
 * Add to this map as more legacy slugs are discovered in Search Console.
 */
const LEGACY_REDIRECTS: Array<{ source: string; destination: string }> = [
  { source: "/about-us-page", destination: "/about" },
  { source: "/about-us", destination: "/about" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/ui-ux-designer", destination: "/ui-ux-design" },
  { source: "/ui-ux", destination: "/ui-ux-design" },
  { source: "/search-engine-optimization", destination: "/seo-ads" },
  { source: "/seo", destination: "/seo-ads" },
  { source: "/google-ads", destination: "/seo-ads" },
  { source: "/support-and-mantainance", destination: "/web-development" },
  { source: "/support-and-maintainance", destination: "/web-development" },
  { source: "/web-design", destination: "/web-development" },
  { source: "/website-development", destination: "/web-development" },
  { source: "/mobile-app-development", destination: "/app-development" },
  { source: "/graphic-design", destination: "/branding-graphics" },
  { source: "/branding", destination: "/branding-graphics" },
  { source: "/video-editing", destination: "/video-motion" },
  { source: "/ai", destination: "/ai-automation" },
  { source: "/automation", destination: "/ai-automation" },
  { source: "/our-work", destination: "/portfolio" },
  { source: "/projects", destination: "/portfolio" },
  { source: "/blog", destination: "/insights" },
  { source: "/privacy", destination: "/privacy-policy" },
  { source: "/terms-and-conditions", destination: "/terms" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, a stray package-lock.json in a parent
  // directory makes Turbopack guess the wrong root.
  turbopack: { root: __dirname },

  // PRD §13 — the existing site serves trailing-slash URLs. Preserve them so
  // canonicals, the sitemap and any retained crawl history all agree.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    /*
      The favicons moved from generated routes (/icon.png, /apple-icon.png)
      to static files built by scripts/build-icons.mjs. Browsers and home-
      screen shortcuts can hold the old URLs for a long time; without these
      they would get a 404 -- and the full not-found page with it.
      No trailing slash: paths with a file extension are not slash-normalised.
    */
    const ICON_REDIRECTS = [
      { source: "/icon.png", destination: "/brand/icon-32.png", statusCode: 301 as const },
      { source: "/apple-icon.png", destination: "/brand/apple-touch-icon.png", statusCode: 301 as const },
    ];
    return [...ICON_REDIRECTS, ...LEGACY_REDIRECTS.map(({ source, destination }) => ({
      /**
       * Both sides carry a trailing slash deliberately.
       *
       * With `trailingSlash: true` Next normalises the request path BEFORE
       * redirect matching, so a source written as "/about-us" never matches —
       * by the time rules are evaluated the path is already "/about-us/".
       * Writing the slash into the source is what makes these rules fire.
       *
       * The destination carries one too, so the chain is
       * /about-us/ -> /about/ in a single hop rather than landing on /about
       * and taking another 308 to add the slash.
       */
      source: `${source}/`,
      destination: `${destination}/`,
      // PRD §13 asks for 301 specifically. Next's `permanent: true` emits 308,
      // which is the method-preserving equivalent; 301 is stated explicitly
      // here so the served status matches the specification exactly.
      statusCode: 301 as const,
    }))];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          /*
            Content Security Policy. Everything this site loads is its own:
            fonts are self-hosted by next/font, the logo video and images are
            in /public, the enquiry form posts to a same-origin Server Action
            and email is sent server-side. So every source is 'self'.

            'unsafe-inline' for scripts is required by Next's inline RSC
            bootstrap and the pre-paint theme script; moving to nonces would
            mean giving up static generation for every page. Styles need it
            for React `style` props. 'unsafe-eval' is added in development
            only, where Fast Refresh needs it.

            object-src, base-uri, form-action and frame-ancestors are the
            directives that close the classic injection and clickjacking
            holes, and cost nothing here.
          */
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "media-src 'self'",
              "connect-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        /*
          Brand assets: the logo-reveal video and monogram PNGs. Next serves
          /public with `max-age=0`, so the watermark video -- used twice on the
          homepage -- was revalidated or refetched for its second placement.

          A week, not a year: the filenames are not content-hashed, and the
          video is due to be replaced (its closing wordmark is misspelt). When
          it is, give the new file a new name and the change is immediate.
        */
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
