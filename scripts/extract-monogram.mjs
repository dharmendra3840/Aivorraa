/**
 * Regenerates public/brand/monogram.png (and copies the video to
 * public/brand/logo-reveal.mp4) from the brand's logo-reveal video.
 *
 *   node scripts/extract-monogram.mjs [path/to/video.mp4]
 *
 * Plays the video in headless Chrome, captures the settled final frames via
 * requestVideoFrameCallback (drawing inside `seeked` lags a frame behind in
 * headless Chrome and returns stale frames), and builds a clean white-on-
 * transparent monogram:
 *   - MIN across the last frames everywhere (drops the moving light glint),
 *   - MAX only inside the patch where the glint's dark edge cuts the I stem,
 *   - alpha from the RED channel, so the navy outline and blue glow vanish.
 *
 * It measures the monogram's bounding box strictly ABOVE y=440. The current
 * video ends with a wordmark reading "AIVORRA" (misspelt) from y~450, and it
 * must never be included. If a corrected video is framed differently, check
 * the printed bbox and update CROP in src/components/brand/MonogramVideo.tsx
 * and NOTCH below. Then regenerate the 64/160px copies:
 *   sharp public/brand/monogram.png -> monogram-64.png, monogram-160.png
 *
 * Requires Chrome at the standard Windows path (same as the check scripts).
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import sharp from "sharp";

const file = path.resolve(process.argv[2] || "aivorraa_cinematic_logo_reveal.mp4");
const srv = http
  .createServer((req, res) => {
    if (req.url === "/v.mp4") {
      const buf = fs.readFileSync(file);
      res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": buf.length });
      return res.end(buf);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<video id="v" src="/v.mp4" muted playsinline preload="auto"></video><canvas id="c"></canvas>');
  })
  .listen(4456);

const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const p = await b.newPage();
await p.goto("http://localhost:4456/", { waitUntil: "load" });

// Per-pixel MINIMUM over the settled tail of the video: the monogram is static
// and filled there, while the light glint moves -- the minimum keeps the first
// and drops the second.
const W = 960, H = 540;
const min = new Uint8ClampedArray(W * H * 4).fill(0); // composite, filled below
const lo = new Uint8ClampedArray(W * H * 4).fill(255); // per-pixel MIN, last 3 frames
const hi = new Uint8ClampedArray(W * H * 4).fill(0); // per-pixel MAX, all settled frames
const FRAMES = fs.mkdtempSync(path.join(os.tmpdir(), "monogram-"));
/*
  Capture during PLAYBACK via requestVideoFrameCallback, which fires when a
  frame is actually presented -- so drawImage inside it gets that frame.
  Seeking and drawing in `seeked` was lagging one frame behind in headless
  Chrome, which is why every "late" capture came back as early navy.
*/
const shots = await p.evaluate(
  () =>
    new Promise((res) => {
      const v = document.getElementById("v");
      const c = document.getElementById("c");
      c.width = 960;
      c.height = 540;
      const ctx = c.getContext("2d");
      const out = [];
      const onFrame = (_now, meta) => {
        if (meta.mediaTime >= 2.9) {
          ctx.drawImage(v, 0, 0);
          out.push({ t: meta.mediaTime, url: c.toDataURL("image/png") });
        }
        if (!v.ended) v.requestVideoFrameCallback(onFrame);
      };
      v.requestVideoFrameCallback(onFrame);
      v.addEventListener("ended", () => res(out), { once: true });
      v.muted = true;
      v.play();
    }),
);
console.log(`captured ${shots.length} presented frames from ${shots[0]?.t.toFixed(2)}s to ${shots.at(-1)?.t.toFixed(2)}s`);
for (const [k, shot] of shots.entries()) {
  const f = path.join(FRAMES, `p${String(k).padStart(2, "0")}.png`);
  fs.writeFileSync(f, Buffer.from(shot.url.split(",")[1], "base64"));
  const { data } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let bright = 0;
  /*
    Per-pixel MAXIMUM across the settled frames. A light sheen sweeps the
    letters at the end; wherever its dark leading edge sits in one frame, the
    same pixel is fully white in another, so the maximum recovers the whole
    fill. (A minimum kept the dark edge and cut a notch through the I.)
  */
  for (let i = 0; i < data.length; i++) if (data[i] > hi[i]) hi[i] = data[i];
  if (k >= shots.length - 3) for (let i = 0; i < data.length; i++) if (data[i] < lo[i]) lo[i] = data[i];
  for (let i = 0; i < W * 440 * 4; i += 4) if (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] > 140) bright++;
  if (k % 3 === 0 || k === shots.length - 1) console.log(`  ${shot.t.toFixed(2)}s: ${bright} bright px above wordmark band`);
}
await b.close();
srv.close();

/*
  Each filter is right in one place and wrong in another:
    MIN  -- clean everywhere, except it keeps the sheen's dark leading edge,
            which cuts a notch through the I stem;
    MAX  -- fills that notch, but accumulates faint ghosts of the sheen in the
            gap between the letters.
  So: MIN everywhere, MAX only inside the small patch where the notch sits
  (source px, measured from the MIN composite).
*/
const NOTCH = { x0: 518, x1: 608, y0: 246, y1: 284 };
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const src = x >= NOTCH.x0 && x <= NOTCH.x1 && y >= NOTCH.y0 && y <= NOTCH.y1 ? hi : lo;
    min[i] = src[i];
    min[i + 1] = src[i + 1];
    min[i + 2] = src[i + 2];
    min[i + 3] = 255;
  }

// ---- bounding box of the monogram, strictly ABOVE the wordmark band ----
const lum = (i) => 0.2126 * min[i] + 0.7152 * min[i + 1] + 0.0722 * min[i + 2];
const WORDMARK_TOP = 440; // "AIVORRA" text starts ~y450; never include it
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < WORDMARK_TOP; y++)
  for (let x = 0; x < W; x++) {
    if (lum((y * W + x) * 4) > 140) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
console.log("monogram bbox (source px):", { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 });

// Is the wordmark band really separate? Count bright pixels between bbox and 440.
let gap = 0;
for (let y = y1 + 1; y < WORDMARK_TOP; y++) for (let x = 0; x < W; x++) if (lum((y * W + x) * 4) > 140) gap++;
console.log("bright pixels between monogram and wordmark band:", gap);

// ---- white-on-transparent monogram, alpha from luminance ----
const out = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H * 4; i += 4) {
  /*
    Alpha from the RED channel, not luminance. The fill is white (red ~240);
    the navy outline and the blue glints are low in red. Luminance would have
    kept the glints as faint white smudges around the letters.
  */
  const R = min[i];
  const px = (i / 4) % W, py = Math.floor(i / 4 / W);
  const inNotch = px >= NOTCH.x0 && px <= NOTCH.x1 && py >= NOTCH.y0 && py <= NOTCH.y1;
  // Inside the MAX patch, only near-solid white counts: the sheen's ghosts
  // there are mid-grey (red well under 175), the letter itself is ~240.
  const lowCut = inNotch ? 175 : 95;
  const a = Math.max(0, Math.min(1, (R - lowCut) / (225 - lowCut)));
  out[i] = out[i + 1] = out[i + 2] = 255;
  out[i + 3] = Math.round(a * 255);
}
const pad = 14;
const size = Math.max(x1 - x0, y1 - y0) + pad * 2;
const cx = Math.round((x0 + x1) / 2), cy = Math.round((y0 + y1) / 2);
const left = Math.max(0, cx - Math.round(size / 2));
const top = Math.max(0, cy - Math.round(size / 2));
const side = Math.min(size, W - left, WORDMARK_TOP - top);

fs.mkdirSync("public/brand", { recursive: true });
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left, top, width: side, height: side })
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile("public/brand/monogram.png");
fs.copyFileSync(file, "public/brand/logo-reveal.mp4");

const crop = { left, top, side };
console.log("square crop (source px):", crop);
fs.rmSync(FRAMES, { recursive: true, force: true });
console.log("sizes:", fs.statSync("public/brand/monogram.png").size, "bytes png,", fs.statSync("public/brand/logo-reveal.mp4").size, "bytes mp4");
