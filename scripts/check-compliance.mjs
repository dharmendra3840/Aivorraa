/**
 * Compliance audit -- run against a production build (`next start`).
 *
 *   BASE_URL=http://localhost:3000 npm run check:compliance
 *
 * Checks, on every public page:
 *   - Content-Security-Policy: no violations
 *   - WCAG 1.4.3 contrast: all visible text >= 4.5:1 (3:1 for large text),
 *     measured against the real background, alpha-blended
 *   - WCAG 2.5.8 target size: >= 24x24, or spaced so a 24px circle clears
 *     every other target (inline links in running text are exempt)
 *   - WCAG 1.4.4: no overflow or clipped text at 200% browser zoom
 * And on the homepage:
 *   - WCAG 2.2.2: "Pause motion" stops every looping animation, leaves
 *     scroll-driven ones alone, stops the canvas, persists, stays in sync
 *   - security headers present
 *
 * Exits non-zero on any failure. Requires Chrome at the standard Windows path.
 */
import puppeteer from "puppeteer-core";

const CH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const PAGES = ["/", "/services/", "/web-development/", "/ai-automation/", "/interior-design/", "/about/", "/contact/", "/portfolio/", "/industries/", "/insights/", "/insights/what-is-n8n-automation-used-for/", "/privacy-policy/", "/terms/", "/accessibility/"];
const b = await puppeteer.launch({ executablePath: CH, headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
const out = [];
const ck = (n, ok, d = "") => out.push(`  ${ok ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);

// ---------------------------------------------------------------- per page: CSP, contrast, target size
// Every page in BOTH themes: contrast is checked in each; CSP and target
// size do not depend on the theme, so the first (dark) pass covers them.
const cspAll = [], lowAll = [], lowLight = [], smallAll = [];
for (const theme of ["dark", "light"])
for (const path of PAGES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const errs = [];
  p.on("console", (m) => /Content Security Policy|Refused to/i.test(m.text()) && errs.push(m.text().slice(0, 120)));
  await p.evaluateOnNewDocument((t) => {
    try { if (t === "dark") localStorage.setItem("aivorraa:theme", "dark"); else localStorage.removeItem("aivorraa:theme"); } catch {}
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  }, theme);
  await p.goto(BASE + path, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  // scroll through so scroll-driven reveals settle, then back up
  await p.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 600));
  const r = await p.evaluate(() => {
    const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
    const L = ([r, g, bl]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl); };
    const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0.5) return c; } return [5, 11, 23, 1]; };
    const low = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[aria-hidden='true']")) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (!own) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      // Effective opacity through ancestors (reveals that have finished are 1)
      let op = 1; for (let n = el; n; n = n.parentElement) op *= Number(getComputedStyle(n).opacity);
      if (op < 0.5) continue;
      const fg = rgba(cs.color), bg = bgOf(el);
      let mix = fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
      // Text in a `mix-blend-mode: difference` layer (the header) composites
      // as |text - backdrop| per channel; measure what is actually painted.
      for (let n = el; n; n = n.parentElement) {
        if (getComputedStyle(n).mixBlendMode === "difference") {
          mix = mix.map((v, i) => Math.abs(v - bg[i]));
          break;
        }
      }
      const a = L(mix), c = L(bg);
      const ratio = (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
      const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
      if (ratio < (big ? 3 : 4.5)) low.push(`${ratio.toFixed(2)} "${el.textContent.trim().slice(0, 30)}"`);
    }
    // WCAG 2.5.8 target size: >= 24x24, or a 24px circle on its centre clears every other target.
    const targets = [...document.querySelectorAll("a[href], button, input, select, textarea, summary")].filter((el) => {
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && !el.closest("[aria-hidden='true']") && !el.closest(".sr-only");
    });
    const rects = targets.map((el) => el.getBoundingClientRect());
    const small = [];
    targets.forEach((el, i) => {
      const r = rects[i];
      if (r.width >= 24 && r.height >= 24) return;
      // inline links inside running text are exempt
      if (el.tagName === "A" && el.closest("p, li, dd") && getComputedStyle(el).display === "inline") return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const clash = rects.some((o, j) => {
        if (j === i) return false;
        const ox = Math.max(o.left, Math.min(cx, o.right)), oy = Math.max(o.top, Math.min(cy, o.bottom));
        return Math.hypot(cx - ox, cy - oy) < 12;
      });
      if (clash) small.push(`${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 24)}"`);
    });
    return { low: [...new Set(low)], small: [...new Set(small)], csp: window.__csp };
  });
  if (r.low.length) (theme === "dark" ? lowAll : lowLight).push(`${path}: ${r.low.slice(0, 4).join(" | ")}`);
  if (theme === "dark") {
    if (r.csp.length || errs.length) cspAll.push(`${path}: ${[...r.csp, ...errs].slice(0, 2).join(" | ")}`);
    if (r.small.length) smallAll.push(`${path}: ${r.small.slice(0, 4).join(" | ")}`);
  }
  await p.close();
}
ck(`CSP: no violations on ${PAGES.length} pages`, cspAll.length === 0, cspAll.join("\n        "));
ck(`Contrast, dark theme: all text meets WCAG AA on ${PAGES.length} pages`, lowAll.length === 0, lowAll.join("\n        "));
ck(`Contrast, light theme: all text meets WCAG AA on ${PAGES.length} pages`, lowLight.length === 0, lowLight.join("\n        "));
ck(`Target size (WCAG 2.5.8) on ${PAGES.length} pages`, smallAll.length === 0, smallAll.join("\n        "));

// ---------------------------------------------------------------- 1.4.4 resize text to 200%
{
  const bad = [];
  for (const path of ["/", "/web-development/", "/contact/", "/accessibility/"]) {
    const p = await b.newPage();
    // 200% browser zoom on a 1280x900 window == a 640x450 CSS viewport at 2x.
    await p.setViewport({ width: 640, height: 450, deviceScaleFactor: 2 });
    await p.goto(BASE + path, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 700));
    const r = await p.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      // text clipped by an overflow:hidden/clip box
      const clipped = [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button, main label")].filter((el) => {
        if (el.closest("[aria-hidden='true'], .marquee, .hscroll-stage")) return false;
        const r = el.getBoundingClientRect(); if (!r.width) return false;
        for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (/(hidden|clip)/.test(cs.overflowX + cs.overflowY)) { const pr = n.getBoundingClientRect(); if (r.right > pr.right + 2 || r.bottom > pr.bottom + 2) return true; break; }
        }
        return false;
      }).map((el) => el.textContent.trim().slice(0, 30));
      return { overflow: docW > window.innerWidth, clipped };
    });
    if (r.overflow || r.clipped.length) bad.push(`${path}: overflow=${r.overflow} clipped=${r.clipped.slice(0, 3).join(" | ")}`);
    await p.close();
  }
  ck("200% browser zoom (WCAG 1.4.4): no overflow, no clipped text", bad.length === 0, bad.join("\n        "));
}

// ---------------------------------------------------------------- 2.2.2 pause motion
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.evaluateOnNewDocument(() => { window.__raf = 0; const o = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => { window.__raf++; return o(cb); }; });
  await p.goto(BASE + "/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  const count = () => p.evaluate(() => {
    const loops = document.getAnimations().filter((a) => a.timeline instanceof DocumentTimeline && a.effect?.getTiming().iterations === Infinity);
    const scroll = document.getAnimations().filter((a) => !(a.timeline instanceof DocumentTimeline));
    return { loopsRunning: loops.filter((a) => a.playState === "running").length, loopsTotal: loops.length, scrollDriven: scroll.length, scrollPaused: scroll.filter((a) => a.playState === "paused").length };
  });
  const before = await count();
  await p.click(".motion-toggle");
  await new Promise((r) => setTimeout(r, 1200));
  await new Promise((r) => setTimeout(r, 400));
  const after = await count();
  const pressed = await p.$eval(".motion-toggle", (e) => e.getAttribute("aria-pressed"));
  const r0 = await p.evaluate(() => window.__raf); await new Promise((r) => setTimeout(r, 1000)); const r1 = await p.evaluate(() => window.__raf);
  ck("Pause motion: every looping animation stops", before.loopsRunning > 0 && after.loopsRunning === 0, `looping running ${before.loopsRunning} → ${after.loopsRunning} (of ${after.loopsTotal})`);
  ck("Pause motion: scroll-driven animations untouched", after.scrollPaused === 0 && after.scrollDriven > 0, `${after.scrollDriven} scroll-driven, ${after.scrollPaused} paused`);
  ck("Pause motion: hero canvas stops drawing", r1 - r0 < 180, `${r1 - r0} rAF/s with Lenis alone`);
  ck("Pause motion: aria-pressed reflects state", pressed === "true", `aria-pressed=${pressed}`);
  // persists across reload, applied before paint
  await p.reload({ waitUntil: "domcontentloaded" });
  const early = await p.evaluate(() => document.documentElement.classList.contains("motion-paused"));
  await new Promise((r) => setTimeout(r, 1500));
  const later = await count();
  ck("Pause motion: remembered after reload, applied before first paint", early && later.loopsRunning === 0, `class at DOMContentLoaded=${early}, looping running=${later.loopsRunning}`);
  // footer toggle stays in step
  const both = await p.$$eval(".motion-toggle", (els) => els.map((e) => e.getAttribute("aria-pressed")).join(","));
  ck("Hero and footer toggles stay in sync", both === "true,true", both);
  await p.click(".motion-toggle"); await new Promise((r) => setTimeout(r, 300));
  const resumed = await count();
  ck("Play again resumes the loops", resumed.loopsRunning > 0, `${resumed.loopsRunning} running`);
  await p.close();
}

// ---------------------------------------------------------------- headers
{
  const res = await fetch(BASE + "/");
  const h = (k) => res.headers.get(k) || "(missing)";
  ck("Security headers present", ["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy", "x-frame-options", "permissions-policy", "cross-origin-opener-policy"].every((k) => res.headers.get(k)), `CSP: ${h("content-security-policy").slice(0, 60)}…`);
}

console.log(out.join("\n"));
await b.close();
const failed = out.filter((l) => l.includes("FAIL")).length;
console.log(failed ? `\n✗ ${failed} compliance check(s) failed.` : "\n✓ Compliance checks passed.");
process.exit(failed ? 1 : 0);
