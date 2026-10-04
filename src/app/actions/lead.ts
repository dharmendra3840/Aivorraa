"use server";

import { headers } from "next/headers";
import { SERVICE_SLUGS, getService } from "@/content/services";
import { CONTACT } from "@/lib/site-config";
// A "use server" module may only export async functions, so the state type and
// its initial value live in a plain module. See lead-form-state.ts.
import type { LeadFormState } from "@/lib/lead-form-state";

/**
 * Lead form handler — PRD §19 and §24.
 *
 * Requirements this implements:
 *  - Server-side validation and sanitisation (never trust the client)
 *  - Rate limiting
 *  - Spam protection without a third-party tracker (honeypot + submit timing)
 *  - Delivery to a verified inbox, with explicit success and error states
 *  - Collect only necessary lead information (§24 data minimisation)
 *
 * Email transport is pluggable via environment variables so no secret is ever
 * committed. With none configured the submission is logged server-side and the
 * user is told delivery is unconfirmed — it never silently pretends to succeed.
 *
 * PRD §19 requires end-to-end delivery testing before launch: set RESEND_API_KEY
 * and LEAD_INBOX, submit the form, and confirm arrival plus spam placement.
 */

const MAX_LENGTHS = {
  name: 100,
  email: 160,
  phone: 24,
  company: 120,
  message: 4000,
  budget: 40,
  timeline: 40,
  location: 120,
} as const;

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

/**
 * In-process rate limiter. Adequate for the single Node process this site runs
 * in on Hostinger (PRD §20). If the app is ever moved to a multi-instance or
 * serverless platform, replace this with a shared store (Redis / Upstash),
 * because per-instance memory would let an attacker multiply the limit by the
 * number of instances.
 */
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown";
  return ip;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

/** Replaces C0/C1 control characters with a space.
 *
 * Written as an explicit scan rather than a regex character class on purpose:
 * control characters have no safe literal representation in source, and an
 * escaped class is easy to corrupt silently as a file passes through tooling.
 * This states the intent directly and cannot be mangled.
 *
 * `keepNewlines` preserves line breaks for the free-text message field, where
 * the sender's paragraphing is worth keeping.
 */
function stripControlCharacters(value: string, keepNewlines = false): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isNewline = char === "\n";
    const isControl = code < 32 || code === 127 || (code >= 128 && code <= 159);
    out += isControl && !(keepNewlines && isNewline) ? " " : char;
  }
  return out;
}

/** Collapses whitespace, strips control characters, enforces a max length. */
function clean(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  return stripControlCharacters(value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** As `clean`, but preserves paragraph breaks for the message body. */
function cleanMultiline(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  return stripControlCharacters(value.replace(/\r\n/g, "\n"), true)
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

// Deliberately permissive: the goal is to reject obvious typos, not to police
// valid-but-unusual addresses. Delivery is the real validator.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Accepts Indian and international formats; strips presentation characters. */
function normalisePhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d+]/g, "");
  const bare = digits.replace(/\D/g, "");
  if (bare.length < 8 || bare.length > 15) return null;
  return digits;
}

/* -------------------------------------------------------------------------- */
/* Delivery                                                                   */
/* -------------------------------------------------------------------------- */

interface Lead {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  serviceLabel: string;
  budget: string;
  timeline: string;
  location: string;
  message: string;
  submittedAt: string;
}

function renderLeadEmail(lead: Lead): string {
  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Company", lead.company || "—"],
    ["Service", lead.serviceLabel],
    ["Budget", lead.budget || "—"],
    ["Timeline", lead.timeline || "—"],
    ["Location", lead.location || "—"],
    ["Submitted", lead.submittedAt],
  ];
  return [
    "New enquiry from aivorraa.com",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message,
  ].join("\n");
}

/**
 * Sends via Resend when configured. Uses fetch rather than an SDK so the
 * project takes on no additional dependency.
 * Returns true only on confirmed acceptance by the provider.
 */
async function deliver(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.LEAD_INBOX ?? CONTACT.email;
  const from = process.env.LEAD_FROM ?? "Aivorraa Website <website@aivorraa.com>";

  if (!apiKey) {
    // No transport configured. Log so the enquiry is not lost, and report
    // failure upward so the user is shown the direct email fallback.
    console.warn(
      "[lead] RESEND_API_KEY is not set — enquiry logged but NOT emailed.",
      renderLeadEmail(lead),
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [inbox],
        reply_to: lead.email,
        subject: `New enquiry — ${lead.serviceLabel} — ${lead.name}`,
        text: renderLeadEmail(lead),
      }),
    });

    if (!res.ok) {
      console.error("[lead] delivery failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[lead] delivery threw", error);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Action                                                                     */
/* -------------------------------------------------------------------------- */

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const values: Record<string, string> = {
    name: clean(formData.get("name"), MAX_LENGTHS.name),
    email: clean(formData.get("email"), MAX_LENGTHS.email),
    phone: clean(formData.get("phone"), MAX_LENGTHS.phone),
    company: clean(formData.get("company"), MAX_LENGTHS.company),
    service: clean(formData.get("service"), 64),
    budget: clean(formData.get("budget"), MAX_LENGTHS.budget),
    timeline: clean(formData.get("timeline"), MAX_LENGTHS.timeline),
    location: clean(formData.get("location"), MAX_LENGTHS.location),
    message: cleanMultiline(formData.get("message"), MAX_LENGTHS.message),
  };

  /* --- Spam checks, before any work is done ---------------------------- */

  // Honeypot: a field hidden from humans. Anything in it is a bot.
  if (clean(formData.get("company_website"), 200) !== "") {
    // Respond as success so the bot has no signal to adapt to.
    return { status: "success", message: "Thanks — your enquiry was received." };
  }

  // Submit timing: a genuine person takes more than three seconds to fill this
  // in. The client stamps render time into a hidden field.
  const renderedAt = Number(formData.get("rendered_at"));
  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const elapsed = Date.now() - renderedAt;
    if (elapsed < 3000) {
      return {
        status: "error",
        message: "That submitted unusually fast. Please try once more.",
        values,
      };
    }
  }

  /* --- Rate limit ------------------------------------------------------ */

  if (rateLimited(await clientKey())) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Please email ${CONTACT.email} directly.`,
      values,
    };
  }

  /* --- Validation ------------------------------------------------------ */

  const errors: Record<string, string> = {};

  if (values.name.length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!EMAIL_RE.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (values.phone) {
    const normalised = normalisePhone(values.phone);
    if (!normalised) {
      errors.phone = "Please enter a valid phone number, or leave this blank.";
    } else {
      values.phone = normalised;
    }
  }
  if (values.message.length < 20) {
    errors.message =
      "Please add a couple of lines about the project — 20 characters or more.";
  }
  // Service must be one of the listed services, or the generic option.
  if (values.service && values.service !== "not-sure") {
    if (!SERVICE_SLUGS.includes(values.service)) {
      errors.service = "Please choose a service from the list.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors,
      values,
    };
  }

  /* --- Deliver --------------------------------------------------------- */

  const serviceLabel =
    values.service === "not-sure" || !values.service
      ? "Not sure yet"
      : (getService(values.service)?.name ?? values.service);

  const delivered = await deliver({
    ...values,
    serviceLabel,
    submittedAt: new Date().toISOString(),
  } as Lead);

  if (!delivered) {
    return {
      status: "error",
      message: `Aivorraa could not confirm delivery of that message. Please email ${CONTACT.email} directly so nothing is lost.`,
      values,
    };
  }

  return {
    status: "success",
    message:
      "Thanks — your enquiry has been received. You will get a reply within one working day.",
  };
}
