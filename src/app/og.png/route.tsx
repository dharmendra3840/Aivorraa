import { ImageResponse } from "next/og";
import { OG_SIZE, SocialCard } from "@/components/og/BrandCard";

/**
 * Social share card at /og.png — PRD §2 Finding 6 / §15: "Replace the
 * 2000x2000px OG image with a 1200x630px version."
 *
 * Served from a route with a real file extension rather than Next's
 * `opengraph-image` convention, because `trailingSlash: true` makes the
 * convention's extensionless path 308-redirect before serving. A social
 * crawler or a schema consumer should get a 200 on the first request.
 *
 * Generated at build time from brand tokens, so it cannot be the wrong size
 * and cannot drift out of date with the positioning line.
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<SocialCard />, OG_SIZE);
}
