"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's live demo: an automation running in front of the visitor.
 *
 * A customer message arrives in a chat window, the assistant replies, and on
 * the right the systems behind it react -- a CRM record, a calendar slot, a
 * reminder. Three scenarios a visitor can switch between. This replaces
 * decoration with the product: the fastest way to show what Aivorraa builds.
 *
 * Every conversation is a SAMPLE, labelled as one on screen. No client names,
 * no figures.
 *
 * MOTION RULES
 *  - steps advance on a timer, then loop after a pause
 *  - "Pause motion" (the motion-paused class, WCAG 2.2.2) and reduced motion
 *    both show the whole conversation at once, with nothing moving
 *  - the timer only runs while the demo is on screen
 *  - the steps are real text in the DOM from the first render, so screen
 *    readers and crawlers get the full conversation; aria-live is off so a
 *    looping demo never talks over the page
 */

type Msg = { from: "customer" | "assistant"; text: string };
type Event = { system: string; detail: string };
type Scenario = {
  id: string;
  label: string;
  channel: string;
  /** Interleaved: each step reveals one message and, optionally, one event. */
  steps: Array<{ msg: Msg; event?: Event }>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "clinic",
    label: "Clinic booking",
    channel: "WhatsApp",
    steps: [
      { msg: { from: "customer", text: "Hi, is there a slot with the dentist tomorrow evening?" } },
      {
        msg: { from: "assistant", text: "Yes — 6:30 pm or 7:15 pm tomorrow. Which works for you?" },
        event: { system: "Calendar", detail: "2 free slots found" },
      },
      { msg: { from: "customer", text: "6:30 please" } },
      {
        msg: { from: "assistant", text: "Booked for 6:30 pm. You'll get a reminder two hours before." },
        event: { system: "Calendar", detail: "Appointment booked · 6:30 pm" },
      },
      {
        msg: { from: "assistant", text: "Need directions to the clinic? I can send the map pin." },
        event: { system: "CRM", detail: "Patient record updated" },
      },
    ],
  },
  {
    id: "store",
    label: "Order status",
    channel: "Instagram DM",
    steps: [
      { msg: { from: "customer", text: "Where is my order #1042?" } },
      {
        msg: { from: "assistant", text: "It shipped today and should reach you on Thursday. Here's your tracking link." },
        event: { system: "Store", detail: "Order #1042 · shipped" },
      },
      { msg: { from: "customer", text: "Can I change the delivery address?" } },
      {
        msg: { from: "assistant", text: "I've asked the courier to update it — you'll get a confirmation shortly." },
        event: { system: "Courier", detail: "Address change requested" },
      },
      {
        msg: { from: "assistant", text: "Anything else I can help with?" },
        event: { system: "Helpdesk", detail: "Ticket resolved · logged" },
      },
    ],
  },
  {
    id: "lead",
    label: "New enquiry",
    channel: "Website chat",
    steps: [
      { msg: { from: "customer", text: "Looking for a 2BHK in Gurugram, ready to move." } },
      {
        msg: { from: "assistant", text: "Got it. What budget range should I search in?" },
        event: { system: "CRM", detail: "New lead created" },
      },
      { msg: { from: "customer", text: "Around 80 lakh." } },
      {
        msg: { from: "assistant", text: "Three homes match. Would you like to visit on Saturday?" },
        event: { system: "CRM", detail: "Lead qualified · agent assigned" },
      },
      {
        msg: { from: "assistant", text: "Saturday 11 am is confirmed. The agent will call to share the location." },
        event: { system: "Calendar", detail: "Site visit booked" },
      },
    ],
  },
];

const STEP_MS = 1500;
const HOLD_MS = 3600;

export function AutomationDemo() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(1);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scenario = SCENARIOS[active];
  const total = scenario.steps.length;

  // Static when the reader asked for no motion.
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(reduce.matches || root.classList.contains("motion-paused"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    reduce.addEventListener("change", sync);
    return () => {
      mo.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, []);

  // Advance only while on screen and not still.
  useEffect(() => {
    if (still) return;
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    let visible = false;
    const tick = () => {
      setShown((n) => {
        if (n < total) {
          timer = window.setTimeout(tick, n + 1 < total ? STEP_MS : HOLD_MS);
          return n + 1;
        }
        timer = window.setTimeout(tick, STEP_MS);
        return 1;
      });
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      window.clearTimeout(timer);
      if (visible) timer = window.setTimeout(tick, STEP_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [still, total, active]);

  const count = still ? total : shown;
  // Every event is rendered (no JavaScript: all visible); `.js` hides the
  // ones the conversation has not reached yet.
  const events = scenario.steps.flatMap((s, i) => (s.event ? [{ ...s.event, at: i }] : []));

  return (
    <div ref={ref} className="demo">
      {/* Scenario switcher: a capsule ornament above the window. */}
      <div role="tablist" aria-label="Sample automations" className="spatial spatial-solid ornament max-w-full flex-wrap">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => {
              setActive(i);
              setShown(1);
            }}
            className={
              "rounded-full px-3 py-1.5 text-[0.75rem] font-medium whitespace-nowrap transition-colors " +
              (i === active
                ? "bg-signal text-page"
                : "text-ink-600 hover:text-ink hover:bg-[rgba(var(--hi-rgb),0.08)]")
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1.25fr_1fr]">
        {/* The conversation. */}
        <div className="spatial spatial-tilt flex min-h-[21rem] flex-col p-4" role="tabpanel">
          <div className="depth-1 border-line flex items-center justify-between border-b pb-3">
            <span className="flex items-center gap-2 text-[0.8125rem] font-medium">
              <span aria-hidden="true" className="bg-lime-400 h-2 w-2 rounded-full" />
              {scenario.channel}
            </span>
            <span className="text-ink-400 text-[0.6875rem] tracking-[0.08em] uppercase">
              Sample
            </span>
          </div>
          <ol className="depth-2 mt-3 flex flex-1 flex-col justify-end gap-2" aria-label={`${scenario.label} conversation`}>
            {scenario.steps.map((s, i) => (
              <li
                key={`${scenario.id}-${i}`}
                className={
                  "demo-msg max-w-[88%] rounded-2xl px-3.5 py-2 text-[0.8125rem] leading-snug " +
                  (s.msg.from === "customer"
                    ? "self-end rounded-br-md bg-[rgba(var(--hi-rgb),0.1)]"
                    : "bg-brand-500/15 text-ink self-start rounded-bl-md") +
                  (i < count ? " is-shown" : "")
                }
              >
                <span className="sr-only">{s.msg.from === "customer" ? "Customer: " : "Assistant: "}</span>
                {s.msg.text}
              </li>
            ))}
          </ol>
        </div>

        {/* What happened behind it. */}
        <div className="spatial spatial-tilt p-4">
          <p className="depth-1 eyebrow">
            <span aria-hidden="true" className="bg-brand-500 inline-block h-px w-6" />
            Behind the scenes
          </p>
          <ul className="depth-2 mt-3 grid gap-2">
            {events.map((e, i) => (
              <li
                key={`${scenario.id}-e-${i}`}
                className={
                  "demo-event border-line flex items-start gap-2.5 rounded-xl border bg-[rgba(var(--hi-rgb),0.04)] p-2.5" +
                  (e.at < count ? " is-shown" : "")
                }
              >
                <span aria-hidden="true" className="text-brand-700 mt-0.5 text-[0.75rem]">
                  ✓
                </span>
                <span>
                  <span className="text-ink block text-[0.75rem] font-medium">{e.system}</span>
                  <span className="text-ink-500 block text-[0.75rem]">{e.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-ink-500 mt-3 text-[0.6875rem] leading-relaxed">
            Built in n8n or Make, connected to the tools you already use.
          </p>
        </div>
      </div>
    </div>
  );
}
