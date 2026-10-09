/**
 * Builds the favicon set from public/brand/monogram.png.
 *
 *   node scripts/build-icons.mjs
 *
 * WHY THIS EXISTS INSTEAD OF A SINGLE GENERATED ICON
 * The monogram is calligraphic: hairline strokes a few pixels wide at 512px.
 * Scaled straight down to a 16px browser tab they fall below a pixel and
 * dissolve into the gradient -- the old 64px icon read as a pale smudge. So
 * each size gets its own rendering, with the strokes thickened in proportion
 * to how far it is being reduced (a morphological dilation of the alpha), and
 * the mark filling more of the square the smaller it gets. This is what logo
 * systems do by hand for their smallest sizes.
 *
 * Also writes a real /favicon.ico (16/32/48, PNG-in-ICO). Browsers, bookmark
 * managers and Google Search request /favicon.ico directly whatever the
 * <link> tags say; it was returning 404.
 *
 * Outputs (public/):
 *   favicon.ico                      16, 32, 48
 *   brand/icon-32.png                <link rel="icon"> for tabs
 *   brand/icon-192.png, icon-512.png manifest, "any"
 *   brand/icon-maskable-512.png      manifest, "maskable" (mark inside the
 *                                    80% safe zone, full-bleed background)
 *   brand/apple-touch-icon.png       180, full-bleed (iOS applies its mask)
 */
import fs from "node:fs";
import sharp from "sharp";

const SRC = "public/brand/monogram.png";
const M = 512; // working resolution

const { data: mono } = await sharp(SRC)
  .resize(M, M)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const alpha = new Uint8Array(M * M);
for (let i = 0; i < M * M; i++) alpha[i] = mono[i * 4 + 3];

/** Square max-filter (dilation) of the alpha channel, radius r px. */
function dilate(a, r) {
  if (r <= 0) return a;
  const tmp = new Uint8Array(M * M);
  const out = new Uint8Array(M * M);
  for (let y = 0; y < M; y++)
    for (let x = 0; x < M; x++) {
      let m = 0;
      for (let k = Math.max(0, x - r); k <= Math.min(M - 1, x + r); k++) {
        const v = a[y * M + k];
        if (v > m) m = v;
      }
      tmp[y * M + x] = m;
    }
  for (let y = 0; y < M; y++)
    for (let x = 0; x < M; x++) {
      let m = 0;
      for (let k = Math.max(0, y - r); k <= Math.min(M - 1, y + r); k++) {
        const v = tmp[k * M + x];
        if (v > m) m = v;
      }
      out[y * M + x] = m;
    }
  return out;
}

/** Pale mark (given alpha) as a PNG buffer at M x M. */
async function markPng(a) {
  const rgba = Buffer.alloc(M * M * 4);
  for (let i = 0; i < M * M; i++) {
    // Off-white mark (#F4F6F1) on deep teal -- 7.6:1.
    rgba[i * 4] = 244;
    rgba[i * 4 + 1] = 246;
    rgba[i * 4 + 2] = 241;
    rgba[i * 4 + 3] = a[i];
  }
  return sharp(rgba, { raw: { width: M, height: M, channels: 4 } }).png().toBuffer();
}

/*
  Deep teal (the world's water, darkened) with the off-white monogram, as
  the logo appears in the header. A mid-dark tile keeps an edge on both
  light and dark tab strips, where the night colour would vanish on a dark
  one and off-white on a light one.
*/
function background(size, radius) {
  const r = Math.round(size * radius);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#23735d"/><stop offset="0.55" stop-color="#17503f"/><stop offset="1" stop-color="#0d2a22"/>
      </linearGradient></defs>
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#g)"/>
    </svg>`,
  );
}

/**
 * One icon: dilate for the target size, place the mark at `fill` of the
 * square, render at 512 and downscale once (a single high-quality resample).
 */
async function icon(size, { dilateAt512, fill, radius }) {
  const mark = await markPng(dilate(alpha, dilateAt512));
  const inner = Math.round(M * fill);
  const markSized = await sharp(mark).resize(inner, inner).toBuffer();
  const off = Math.round((M - inner) / 2);
  // Two passes: sharp runs resize BEFORE composite whatever the call order,
  // so compositing and downscaling in one chain shrinks the background first.
  const full = await sharp(background(M, radius))
    .composite([{ input: markSized, top: off, left: off }])
    .png()
    .toBuffer();
  return sharp(full)
    .resize(size, size, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/*
  Dilation radius is in 512px units: 14px at 512 is ~0.45px at 16 -- enough to
  turn a 0.2px hairline into a stroke that survives, without closing the A's
  counter. Tuned by eye at each size against a real tab strip.
*/
const SPEC = {
  16: { dilateAt512: 14, fill: 0.9, radius: 0.22 },
  32: { dilateAt512: 9, fill: 0.86, radius: 0.22 },
  48: { dilateAt512: 6, fill: 0.84, radius: 0.22 },
  180: { dilateAt512: 2, fill: 0.72, radius: 0 },
  192: { dilateAt512: 2, fill: 0.78, radius: 0.22 },
  512: { dilateAt512: 0, fill: 0.78, radius: 0.22 },
  maskable: { dilateAt512: 1, fill: 0.58, radius: 0 },
};

fs.mkdirSync("public/brand", { recursive: true });
const png = {};
for (const s of [16, 32, 48]) png[s] = await icon(s, SPEC[s]);

fs.writeFileSync("public/brand/icon-32.png", png[32]);
fs.writeFileSync("public/brand/icon-192.png", await icon(192, SPEC[192]));
fs.writeFileSync("public/brand/icon-512.png", await icon(512, SPEC[512]));
fs.writeFileSync("public/brand/icon-maskable-512.png", await icon(512, SPEC.maskable));
fs.writeFileSync("public/brand/apple-touch-icon.png", await icon(180, SPEC[180]));

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
