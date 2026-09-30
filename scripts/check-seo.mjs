#!/usr/bin/env node
/**
 * Pre-launch SEO guard — PRD §15, §16, §22 Phase 4.
 *
 * Checks the parts of the PRD's pre-launch checklist that can be verified
 * mechanically, so they cannot regress silently:
 *
 *   - every page title <= 60 characters, every description <= 155
 *   - titles and descriptions unique across pages
 *   - every service has an H1, a primary keyword, 3-5 FAQs and 2-3 related links
 *   - related-service and article service links resolve to real services
 *   - no AggregateRating / Review schema anywhere in shipped code
 *   - no leaked admin email, retired tagline or dead social profile in shipped code
 *   - every published article links to at least two service pages
 *
 * Comments are stripped before the prohibited-pattern scan, so the PRD
 * citations in this codebase's own documentation do not trigger false failures.
 *
 * Run with `npm run check:seo`. Wired into `npm run build`, so a violation
 * fails the build rather than reaching production.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname, resolve, relative as relativePath } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

const errors = [];
const warnings = [];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function readSrc(rel) {
  return readFileSync(join(SRC, rel), "utf8");
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if ([".ts", ".tsx", ".css", ".mjs"].includes(extname(entry)))
      files.push(full);
  }
  return files;
}

/**
 * Removes block comments and whole-line `//` comments. Deliberately does not
 * touch `//` mid-line, so URLs inside string literals survive intact.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");
}

/** Unescapes a captured TS string literal body. */
function unescape(value) {
  return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

/**
 * Extracts a string field at an exact indentation depth, allowing the value to
 * sit on the following line as Prettier formats it. Indentation is what
 * distinguishes a service's metadata `title:` from a process step's `title:`.
 */
function extractAtIndent(source, key, spaces) {
  const indent = " ".repeat(spaces);
  const re = new RegExp(
    `^${indent}${key}:(?:\\s*"((?:[^"\\\\]|\\\\.)*)"|\\s*\\n\\s+"((?:[^"\\\\]|\\\\.)*)")`,
    "gm",
  );
  const out = [];
  let m;
  while ((m = re.exec(source)) !== null) out.push(unescape(m[1] ?? m[2]));
  return out;
}

/** Pulls title/description out of each buildMetadata({...}) call. */
function extractPageMetadata(source) {
  const results = [];
  const re = /buildMetadata\(\{([\s\S]*?)\n\}\)/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const block = m[1];
    const title = block.match(/title:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
    const description = block.match(
      /description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/,
    );
    results.push({
      title: title ? unescape(title[1]) : null,
      description: description ? unescape(description[1]) : null,
    });
  }
  return results;
}

/* -------------------------------------------------------------------------- */
/* 1 & 2. Page titles and descriptions: length and uniqueness                 */
/* -------------------------------------------------------------------------- */

const serviceSources = [
  readSrc("content/services.digital.ts"),
  readSrc("content/services.growth.ts"),
].join("\n");

// Service metadata lives at 4-space indent inside each service object.
const serviceTitles = extractAtIndent(serviceSources, "title", 4);
const serviceDescriptions = extractAtIndent(serviceSources, "description", 4);

const pageFiles = walk(join(SRC, "app")).filter((f) => f.endsWith("page.tsx"));
const pageMeta = pageFiles.flatMap((file) =>
  extractPageMetadata(readFileSync(file, "utf8")).map((meta) => ({
    ...meta,
    file: relativePath(ROOT, file),
  })),
);

const titles = [
  ...serviceTitles.map((title, i) => ({
    title,
    file: `content/services (service ${i + 1})`,
  })),
  ...pageMeta.filter((m) => m.title).map((m) => ({ title: m.title, file: m.file })),
];

const descriptions = [
  ...serviceDescriptions.map((description, i) => ({
    description,
    file: `content/services (service ${i + 1})`,
  })),
  ...pageMeta
    .filter((m) => m.description)
    .map((m) => ({ description: m.description, file: m.file })),
];

for (const { title, file } of titles) {
  if (title.length > TITLE_MAX) {
    errors.push(
      `${file}: title is ${title.length} chars, max ${TITLE_MAX} — "${title}"`,
    );
  }
}

for (const { description, file } of descriptions) {
  if (description.length > DESCRIPTION_MAX) {
    errors.push(
      `${file}: description is ${description.length} chars, max ${DESCRIPTION_MAX} — "${description.slice(0, 64)}…"`,
    );
  }
}

function reportDuplicates(entries, field, label) {
  const seen = new Map();
  for (const entry of entries) {
    const value = entry[field];
    if (seen.has(value)) {
      errors.push(
        `Duplicate ${label} in ${entry.file} and ${seen.get(value)} — "${value.slice(0, 64)}"`,
      );
    } else {
      seen.set(value, entry.file);
    }
  }
}

reportDuplicates(titles, "title", "title");
reportDuplicates(descriptions, "description", "description");

/* -------------------------------------------------------------------------- */
/* 3. Service completeness — PRD §15 template                                 */
/* -------------------------------------------------------------------------- */

const slugs = extractAtIndent(serviceSources, "slug", 4);
const h1s = extractAtIndent(serviceSources, "h1", 4);
const keywords = extractAtIndent(serviceSources, "primaryKeyword", 4);

if (slugs.length !== 8) {
  warnings.push(
    `Expected 8 launch services (PRD §6), found ${slugs.length}. If a service was added, confirm it has a completed project to reference.`,
  );
}
if (h1s.length !== slugs.length) {
  errors.push(
    `Each service needs exactly one h1: ${slugs.length} services, ${h1s.length} h1 values.`,
  );
}
if (keywords.length !== slugs.length) {
  errors.push(
    `Each service needs a primaryKeyword: ${slugs.length} services, ${keywords.length} found.`,
  );
}
if (serviceTitles.length !== slugs.length) {
  errors.push(
    `Each service needs a title: ${slugs.length} services, ${serviceTitles.length} found.`,
  );
}

// Split into per-service blocks on the 4-space `slug:` boundary.
const serviceBlocks = serviceSources.split(/^ {4}slug:/m).slice(1);
serviceBlocks.forEach((block, i) => {
  const slug = slugs[i] ?? `#${i + 1}`;

  const faqSection = block.split(/^ {4}faqs:/m)[1]?.split(/^ {4}related:/m)[0];
  if (!faqSection) {
    errors.push(`Service "${slug}": no FAQs found (PRD §15.7 requires 3–5).`);
  } else {
    const count = (faqSection.match(/^ {8}q:/gm) || []).length;
    if (count < 3 || count > 5) {
      errors.push(`Service "${slug}": ${count} FAQs, PRD §15.7 requires 3–5.`);
    }
  }

  const relatedRaw = block.match(/^ {4}related:\s*\[([^\]]*)\]/m)?.[1] ?? "";
  const related = [...relatedRaw.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
  if (related.length < 2 || related.length > 3) {
    errors.push(
      `Service "${slug}": ${related.length} related services, PRD §15.8 requires 2–3.`,
    );
  }
  for (const rel of related) {
    if (!slugs.includes(rel)) {
      errors.push(`Service "${slug}": links to unknown service "${rel}".`);
    }
    if (rel === slug) {
      errors.push(`Service "${slug}": lists itself as a related service.`);
    }
  }

  // PRD §15 — minimum 800 words per service page. Approximated from the copy
  // fields, which are the bulk of the rendered body.
  const words = (block.match(/"[^"]{40,}"/g) || [])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 800) {
    warnings.push(
      `Service "${slug}": roughly ${words} words of body copy. PRD §15 sets a minimum of 800.`,
    );
  }
});

/* -------------------------------------------------------------------------- */
/* 3b. Nav data must mirror the service catalogue                             */
/* -------------------------------------------------------------------------- */

/**
 * src/content/services.nav.ts duplicates a slice of the service data on
 * purpose, so the client-side header does not bundle the whole catalogue
 * (PRD §21 — JS budget). This check is what keeps the duplicate honest: if the
 * two ever disagree, the build fails rather than shipping a stale menu.
 */
const navSource = readSrc("content/services.nav.ts");
const navSlugs = extractAtIndent(navSource, "slug", 4);
const navLabels = extractAtIndent(navSource, "nav", 4);
const navSummaries = extractAtIndent(navSource, "summary", 4);
const navNames = extractAtIndent(navSource, "name", 4);

const serviceNavLabels = extractAtIndent(serviceSources, "nav", 4);
const serviceSummaries = extractAtIndent(serviceSources, "summary", 4);
const serviceNames = extractAtIndent(serviceSources, "name", 4);

if (navSlugs.join("|") !== slugs.join("|")) {
  errors.push(
    `services.nav.ts is out of sync with the service catalogue.
      nav:      ${navSlugs.join(", ")}
      services: ${slugs.join(", ")}`,
  );
} else {
  navSlugs.forEach((slug, i) => {
    if (navLabels[i] !== serviceNavLabels[i]) {
      errors.push(
        `services.nav.ts "${slug}": nav label "${navLabels[i]}" does not match the service's "${serviceNavLabels[i]}".`,
      );
    }
    if (navNames[i] !== serviceNames[i]) {
      errors.push(
        `services.nav.ts "${slug}": name "${navNames[i]}" does not match the service's "${serviceNames[i]}".`,
      );
    }
    if (navSummaries[i] !== serviceSummaries[i]) {
      errors.push(
        `services.nav.ts "${slug}": summary does not match the service's summary.`,
      );
    }
  });
}

// The mega-menu must link all eight service pages (PRD §13 — deep internal
// linking from a site-wide element is the strongest crawl lever available).
const groupedSlugs = [
  ...navSource
    .split(/^export const NAV_GROUPS/m)[1]
    .matchAll(/"([a-z0-9-]+)"/g),
]
  .map((m) => m[1])
  .filter((v) => slugs.includes(v));

for (const slug of slugs) {
  if (!groupedSlugs.includes(slug)) {
    errors.push(
      `Service "${slug}" is missing from NAV_GROUPS, so the mega-menu would not link it (PRD §13).`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* 4. Prohibited schema and leaked metadata — PRD §16, §2 Finding 6           */
/* -------------------------------------------------------------------------- */

const FORBIDDEN = [
  {
    pattern: /aggregateRating/i,
    message:
      "AggregateRating schema is prohibited without real, attributable on-page reviews (PRD §16).",
  },
  {
    pattern: /"@type":\s*"Review"/,
    message:
      "Review schema is prohibited without real, attributable on-page reviews (PRD §16).",
  },
  {
    pattern: /complyhubindia/i,
    message:
      "Leaked admin email from an unrelated business (PRD §2 Finding 6). Use hello@aivorraa.com.",
  },
  {
    pattern: /interior designer near me/i,
    message:
      "Retired keyword matching no page content (PRD §2 Finding 6, §15).",
  },
  {
    pattern: /best in delhi ncr/i,
    message:
      "Retired tagline — an unsupported superlative (PRD §5 'Retire immediately').",
  },
  {
    pattern: /(?:x|twitter)\.com\/aivorraa/i,
    message:
      "Nonexistent X/Twitter profile weakens the entity signal (PRD §16.1).",
  },
];

for (const file of walk(SRC)) {
  const source = stripComments(readFileSync(file, "utf8"));
  const rel = relativePath(ROOT, file);
  for (const { pattern, message } of FORBIDDEN) {
    if (pattern.test(source)) errors.push(`${rel}: ${message}`);
  }
}

/* -------------------------------------------------------------------------- */
/* 5. Articles link to at least two services — PRD §17                        */
/* -------------------------------------------------------------------------- */

const insightsSource = readSrc("content/insights.ts");
const articleSlugs = extractAtIndent(insightsSource, "slug", 4);
const articleBlocks = insightsSource.split(/^ {4}slug:/m).slice(1);

articleBlocks.forEach((block, i) => {
  const slug = articleSlugs[i] ?? `#${i + 1}`;
  const raw = block.match(/^ {4}serviceLinks:\s*\[([^\]]*)\]/m)?.[1] ?? "";
  const linked = [...raw.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
  if (linked.length < 2) {
    errors.push(
      `Article "${slug}": links to ${linked.length} service pages, PRD §17 requires at least 2.`,
    );
  }
  for (const link of linked) {
    if (!slugs.includes(link)) {
      errors.push(`Article "${slug}": links to unknown service "${link}".`);
    }
  }
});

/* -------------------------------------------------------------------------- */
/* Report                                                                     */
/* -------------------------------------------------------------------------- */

const pad = (n) => String(n).padStart(2, " ");

if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  warnings.forEach((w, i) => console.log(`  ${pad(i + 1)}. ${w}`));
}

if (errors.length > 0) {
  console.error(`\n✖ SEO check failed — ${errors.length} error(s):`);
  errors.forEach((e, i) => console.error(`  ${pad(i + 1)}. ${e}`));
  console.error("");
  process.exit(1);
}

console.log(
  `\n✓ SEO check passed — ${titles.length} titles, ${descriptions.length} descriptions, ${slugs.length} services, ${articleSlugs.length} articles. All within PRD §15 limits.\n`,
);
