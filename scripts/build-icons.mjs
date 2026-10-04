/**
 * Builds the favicon set: a light "a" in the site's typeface (Inter Tight) on
 * charcoal, with a lime full stop -- the brand initial set the way the site
 * sets its headlines.
 *
 *   node scripts/build-icons.mjs
 *
 * Rendered through headless Chrome (puppeteer-core) rather than an SVG
 * rasteriser, because the glyph must be the real Inter Tight outline and the
 * SVG rasteriser cannot load a web font. The font file is the variable Latin
 * subset, kept at scripts/assets/inter-tight-latin.woff2 (SIL Open Font
 * License).
 *
 * PER-SIZE TUNING
 * At 512px the "a" is set light (300), as the site's headlines are. Scaled
 * straight down to a 16px tab, a 300 stroke falls below a pixel and greys
 * out, so the small sizes are drawn heavier and larger -- what type designers
 * call optical sizing. Each size is rendered at 8x and downscaled once.
 *
 * Also writes a real /favicon.ico (16/32/48, PNG-in-ICO). Browsers, bookmark
 * managers and Google Search request /favicon.ico directly whatever the
 * <link> tags say.
 *
 * Outputs (public/):
 *   favicon.ico                      16, 32, 48
 *   brand/icon-32.png                <link rel="icon"> for tabs
 *   brand/icon-192.png, icon-512.png manifest, "any"
 *   brand/icon-maskable-512.png      manifest, "maskable" (glyph inside the
 *                                    80% safe zone, full-bleed background)
 *   brand/apple-touch-icon.png       180, full-bleed (iOS applies its mask)
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FONT = fs.readFileSync(path.join("scripts", "assets", "inter-tight-latin.woff2")).toString("base64");

const BG = "#1b1b1c"; // --color-panel
const INK = "#ffffff";
const DOT = "#d2ff00"; // --color-lime-400

/*
  weight: glyph weight. scale: glyph size as a share of the tile.
  radius: corner radius as a share of the tile (0 = full-bleed, where the
  platform applies its own mask).
*/
const SPEC = {
  16: { weight: 560, scale: 1.02, radius: 0.2 },
  32: { weight: 460, scale: 0.94, radius: 0.22 },
  48: { weight: 400, scale: 0.9, radius: 0.22 },
  180: { weight: 320, scale: 0.78, radius: 0 },
  192: { weight: 320, scale: 0.8, radius: 0.22 },
  512: { weight: 300, scale: 0.8, radius: 0.22 },
  maskable: { weight: 320, scale: 0.6, radius: 0 },
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

async function icon(size, { weight, scale, radius }) {
  const R = size * 8; // render resolution
  await page.setViewport({ width: R, height: R });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: IT; src: url(data:font/woff2;base64,${FONT}) format("woff2"); font-weight: 100 900; }
    html, body { margin: 0; background: transparent; }
    #t {
      width: ${R}px; height: ${R}px; border-radius: ${radius * R}px;
      background: ${BG}; color: ${INK};
      display: grid; place-items: center; overflow: hidden;
      font-family: IT; font-weight: ${weight};
    }
    /* Optically centred: the x-height block sits on the tile's centre. */
    #t span { font-size: ${scale * R}px; line-height: 1; letter-spacing: -0.06em; translate: 0.02em -0.1em; }
    #t i { font-style: normal; color: ${DOT}; }
  </style></head><body><div id="t"><span>a<i>.</i></span></div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const shot = await (await page.$("#t")).screenshot({ omitBackground: true });
  return sharp(shot).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();
}

fs.mkdirSync("public/brand", { recursive: true });
const png = {};
for (const s of [16, 32, 48]) png[s] = await icon(s, SPEC[s]);

fs.writeFileSync("public/brand/icon-32.png", png[32]);
fs.writeFileSync("public/brand/icon-192.png", await icon(192, SPEC[192]));
fs.writeFileSync("public/brand/icon-512.png", await icon(512, SPEC[512]));
fs.writeFileSync("public/brand/icon-maskable-512.png", await icon(512, SPEC.maskable));
fs.writeFileSync("public/brand/apple-touch-icon.png", await icon(180, SPEC[180]));
await browser.close();

// ---- favicon.ico: PNG-in-ICO, understood by every current browser ----
const sizes = [16, 32, 48];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
const dir = Buffer.alloc(16 * sizes.length);
let offset = 6 + dir.length;
sizes.forEach((s, i) => {
  const b = png[s];
  dir.writeUInt8(s, i * 16); // width
  dir.writeUInt8(s, i * 16 + 1); // height
  dir.writeUInt8(0, i * 16 + 2); // palette
  dir.writeUInt8(0, i * 16 + 3); // reserved
  dir.writeUInt16LE(1, i * 16 + 4); // planes
  dir.writeUInt16LE(32, i * 16 + 6); // bits per pixel
  dir.writeUInt32LE(b.length, i * 16 + 8);
  dir.writeUInt32LE(offset, i * 16 + 12);
  offset += b.length;
});
fs.writeFileSync("public/favicon.ico", Buffer.concat([header, dir, ...sizes.map((s) => png[s])]));

for (const f of ["favicon.ico", "brand/icon-32.png", "brand/icon-192.png", "brand/icon-512.png", "brand/icon-maskable-512.png", "brand/apple-touch-icon.png"])
  console.log(f.padEnd(30), fs.statSync(`public/${f}`).size, "B");
