import fs from "node:fs";
import path from "node:path";

import { SITE } from "@/lib/site-config";

/**
 * Shared artwork for the generated brand images: /og.png and /logo.png.
 * (The favicons are NOT generated here -- see scripts/build-icons.mjs, which
 * thickens the strokes per size. Satori cannot, and a straight downscale of
 * this mark dissolves at 16px.)
 *
 * Rendered by Satori via next/og, which supports a subset of CSS. Two rules
 * matter here and are easy to trip over:
 *   1. Any element with more than one child needs an explicit `display`.
 *   2. Only inline styles are read — Tailwind classes do nothing.
 *
 * THE MARK
 * The monogram is the one in the brand's logo-reveal video, extracted from its
 * settled final frames into public/brand/monogram.png (white on transparent,
 * 512px). It is read here at build time and embedded as a data URI, because
 * Satori cannot fetch from the site it is building. The video's closing
 * wordmark ("AIVORRA", misspelt) was never part of the extraction.
 *
 * PRD §2 Finding 6 — the social card is 1200x630, never square, because square
 * images crop badly on every platform.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const LOGO_SIZE = { width: 512, height: 512 };

// "Nocturne" -- see globals.css: night card, off-white type, mint accent.
const PAGE = "#070b0a";
const SIGNAL = "#2ee6b4";
const SIGNAL_DEEP = "#5ff0c8";

const cache = new Map<string, string>();
function dataUri(name: string): string {
  let v = cache.get(name);
  if (!v) {
    const file = path.join(process.cwd(), "public", "brand", name);
    v = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
    cache.set(name, v);
  }
  return v;
}
/** White monogram, for dark backgrounds. */
const monogram = () => dataUri("monogram.png");


/** 1200x630 social card. */
export function SocialCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: PAGE,
        backgroundImage:
          "radial-gradient(900px 520px at 78% 30%, rgba(46,230,180,0.18), transparent 62%)",
        color: "#f4f6f1",
        fontFamily: "sans-serif",
      }}
    >
      {/* The monogram, large, on the right — the brand moment of the card.
          The glow behind it is the card's own background bloom: a separate
          radial disc rendered in Satori with a hard rim and a dark centre. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={monogram()}
        width={400}
        height={400}
        alt=""
        style={{ position: "absolute", right: 60, top: 115 }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 720,
          padding: "72px 0 72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={monogram()} width={46} height={46} alt="" />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>
            AIVORRAA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* One text child per div — see the Satori note above. */}
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            We Build, Market &amp;
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              color: SIGNAL_DEEP,
            }}
          >
            Automate
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            Your Digital Future
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 25,
              lineHeight: 1.4,
              color: "rgba(242,242,242,0.66)",
            }}
          >
            Websites, apps and AI automation for growing businesses.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "rgba(242,242,242,0.58)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: SIGNAL,
            }}
          />
          <div>{SITE.domain}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Square mark: the off-white monogram on deep teal, matching the favicon. Used for the
 * Organization schema logo (/logo.png), which is square so it sits correctly
 * in whatever shape the consumer crops it to.
 */
export function LogoMark({ size = 512 }: { size?: number }) {
  const mark = Math.round(size * 0.78);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(135deg, #23735d 0%, #17503f 55%, #0d2a22 100%)`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={monogram()} width={mark} height={mark} alt="" />
    </div>
  );
}
