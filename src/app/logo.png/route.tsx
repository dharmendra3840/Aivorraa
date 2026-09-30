import { ImageResponse } from "next/og";
import { LOGO_SIZE, LogoMark } from "@/components/og/BrandCard";

/**
 * Square brand logo at /logo.png, for the `logo` property of Organization
 * schema (PRD §16).
 *
 * Google expects a real raster image at a stable URL, and a schema property
 * pointing at a 404 is a broken entity signal — exactly the problem PRD §3 is
 * trying to solve.
 *
 * To swap in the approved logo asset (PRD §29): delete this folder and drop a
 * real `logo.png` into /public. Nothing else needs to change.
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<LogoMark />, LOGO_SIZE);
}
