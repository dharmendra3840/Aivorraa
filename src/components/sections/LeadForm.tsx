"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import { submitLead } from "@/app/actions/lead";
import {
  INITIAL_LEAD_STATE,
  type LeadFormState,
} from "@/lib/lead-form-state";
// Lightweight nav data, not the full catalogue: this is a client component
// and @/content/services would ship every FAQ answer to the browser.
import { SERVICE_NAV } from "@/content/services.nav";
import { Button, cx } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

/**
 * PRD §19 — Lead form.
 *
 * "Name, email, phone, service, message. Optional budget, timeline, location,
 *  project type. Tailor fields to selected service."
 *
 * Tailoring is implemented literally: choosing a service swaps in the project
 * type options and the message placeholder that are relevant to it, and reveals
 * a budget field only for the services that are quote-led. Asking an SEO
 * enquirer which app stores they need is how forms get abandoned.
 *
 * Accessibility (§19): every field labelled, errors associated via
 * aria-describedby, invalid fields marked aria-invalid, the result announced in
 * a live region, and focus moved to the summary on submit.
 */

const BUDGETS = [
  "Under ₹50,000",
  "₹50,000 – ₹1.5 lakh",
  "₹1.5 – 5 lakh",
  "₹5 lakh+",
  "Not sure yet",
];

const TIMELINES = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "Just exploring",
];

/** Per-service message prompts, so the field asks for what is actually useful. */
const PROMPTS: Record<string, string> = {
  "web-development":
    "What does the site need to do, roughly how many pages, and is there an existing site to preserve?",
  "ui-ux-design":
    "Which flows or screens need designing, and is there an existing brand or design system to work within?",
  "app-development":
    "What should the app do in its first release, which platforms, and does a backend or API already exist?",
  "ai-automation":
    "Which repetitive task takes the most time, roughly how often does it happen, and which tools does it touch?",
  "seo-ads":
    "What are you trying to rank or advertise for, and what has already been tried?",
  "digital-marketing":
    "Which channels matter to you, what does a good month look like, and what is your current enquiry volume?",
  "branding-graphics":
    "Is this a new identity or a refresh, and which assets and templates do you need day to day?",
  "video-motion":
    "What kind of edits, roughly what volume per month, and which platforms are they for?",
  "not-sure":
    "Describe the problem in a couple of lines and Aivorraa will suggest where to start.",
};

/** Services where a budget question is genuinely useful at first contact. */
const BUDGET_SERVICES = new Set([
  "web-development",
  "app-development",
  "ui-ux-design",
  "branding-graphics",
  "ai-automation",
  "not-sure",
]);

export function LeadForm({
  defaultService = "not-sure",
  compact = false,
}: {
  defaultService?: string;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(
    submitLead,
    INITIAL_LEAD_STATE,
  );
  const [service, setService] = useState(defaultService);
  const summaryRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  /**
   * Stamps render time into a hidden field so the server can reject
   * sub-three-second submissions as automated. Written straight to the DOM
   * rather than held in state: the value must not exist in the server-rendered
   * HTML (it would hydrate mismatched, and would be a stale timestamp), and
   * writing to the DOM is what an effect is actually for.
   */
  useEffect(() => {
    if (stampRef.current) stampRef.current.value = String(Date.now());
  }, []);

  // Move attention to the result when one arrives.
  useEffect(() => {
    if (state.status !== "idle") summaryRef.current?.focus();
  }, [state]);

  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const showBudget = BUDGET_SERVICES.has(service);

  if (state.status === "success") {
    return (
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="bg-surface border-line rounded-card border p-8 text-center sm:p-10"
      >
        <span className="bg-lime-100 text-lime-600 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full">
          <CheckIcon className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h2 className="text-ink text-3xl">
          Enquiry received
        </h2>
        <p className="text-ink-500 mx-auto mt-3 max-w-md leading-relaxed">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-surface rounded-card p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot. Hidden from sight and from assistive technology, but a bot
          filling every input will complete it. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-company_website`}>
          Company website (leave empty)
        </label>
        <input
          id={`${formId}-company_website`}
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={stampRef} type="hidden" name="rendered_at" defaultValue="0" />

      {state.status === "error" ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="border-danger/25 bg-danger/5 text-danger mb-6 rounded-md border p-4 text-sm font-medium"
        >
          {state.message}
        </div>
      ) : null}

      <div className={cx("grid gap-5", !compact && "sm:grid-cols-2")}>
        <Field
          id={`${formId}-name`}
          name="name"
          label="Your name"
          required
          autoComplete="name"
          defaultValue={values.name}
          error={errors.name}
        />
        <Field
          id={`${formId}-email`}
          name="email"
          type="email"
          label="Email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={values.email}
          error={errors.email}
        />
        <Field
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          label="Phone"
          hint="Optional"
          autoComplete="tel"
          inputMode="tel"
          defaultValue={values.phone}
          error={errors.phone}
        />
        <Field
          id={`${formId}-company`}
          name="company"
          label="Company"
          hint="Optional"
          autoComplete="organization"
          defaultValue={values.company}
          error={errors.company}
        />

        <div className={cx(!compact && "sm:col-span-2")}>
          <FieldLabel htmlFor={`${formId}-service`} label="What do you need?" />
          <select
            id={`${formId}-service`}
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            aria-invalid={Boolean(errors.service) || undefined}
            aria-describedby={
              errors.service ? `${formId}-service-error` : undefined
            }
            className="border-line focus:border-brand-400 mt-2 w-full appearance-none rounded-md border bg-page px-4 py-3 text-[0.9375rem] transition-colors"
          >
            <option value="not-sure">Not sure yet — help me decide</option>
            {SERVICE_NAV.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.service ? (
            <FieldError id={`${formId}-service-error`}>{errors.service}</FieldError>
          ) : null}
        </div>

        {showBudget ? (
          <SelectField
            id={`${formId}-budget`}
            name="budget"
            label="Indicative budget"
            hint="Optional — helps scope the right approach"
            options={BUDGETS}
            defaultValue={values.budget}
          />
        ) : null}

        <SelectField
          id={`${formId}-timeline`}
          name="timeline"
          label="Timeline"
          hint="Optional"
          options={TIMELINES}
          defaultValue={values.timeline}
        />

        {!showBudget ? (
          <Field
            id={`${formId}-location`}
            name="location"
            label="Location"
            hint="Optional"
            defaultValue={values.location}
            error={errors.location}
          />
        ) : null}

        <div className={cx(!compact && "sm:col-span-2")}>
          <FieldLabel
            htmlFor={`${formId}-message`}
            label="About the project"
            required
          />
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={5}
            required
            defaultValue={values.message}
            placeholder={PROMPTS[service] ?? PROMPTS["not-sure"]}
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={
              errors.message ? `${formId}-message-error` : undefined
            }
            className={cx(
              "border-line focus:border-brand-400 placeholder:text-ink-400 mt-2 w-full resize-y rounded-md border bg-page px-4 py-3 text-[0.9375rem] transition-colors",
              errors.message && "border-danger",
            )}
          />
          {errors.message ? (
            <FieldError id={`${formId}-message-error`}>
              {errors.message}
            </FieldError>
          ) : null}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" withArrow disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
        {/*
          PRD §24, and the notice the Digital Personal Data Protection Act,
          2023 (s.5) expects at the point of collection: what is collected,
          why, that it goes no further, and how to have it changed or erased.
          An enquiry is personal data volunteered for a stated purpose, so no
          separate consent checkbox is required -- but the notice is.
        */}
        <p className="text-ink-400 max-w-sm text-xs leading-relaxed">
          Aivorraa uses these details only to reply to this enquiry and, if you
          go ahead, to run the project. They are never sold or used for
          marketing. You can ask for them to be corrected or deleted at any
          time &mdash; see the{" "}
          <Link
            href="/privacy-policy"
            className="text-brand-700 underline underline-offset-2"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Field primitives                                                           */
/* -------------------------------------------------------------------------- */

function FieldLabel({
  htmlFor,
  label,
  hint,
  required,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-ink flex items-baseline gap-2 text-sm font-medium"
    >
      {label}
      {required ? (
        <span className="text-danger" aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? (
        <span className="text-ink-400 text-xs font-normal">{hint}</span>
      ) : null}
    </label>
  );
}

function FieldError({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <p id={id} className="text-danger mt-1.5 text-xs font-medium">
      {children}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  hint,
  error,
  defaultValue,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} hint={hint} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx(
          "border-line focus:border-brand-400 mt-2 w-full rounded-md border bg-page px-4 py-3 text-[0.9375rem] transition-colors",
          error && "border-danger",
        )}
        {...rest}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  hint,
  options,
  defaultValue,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="border-line focus:border-brand-400 mt-2 w-full appearance-none rounded-md border bg-page px-4 py-3 text-[0.9375rem] transition-colors"
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
