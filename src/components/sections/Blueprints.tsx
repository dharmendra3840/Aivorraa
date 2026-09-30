import Link from "next/link";

import { CheckIcon, MinusIcon } from "@/components/icons";
import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/sections/common";
import { Reveal } from "@/components/motion/Reveal";
import { staggerStyle } from "@/components/motion/stagger";

/**
 * System blueprints -- the theme brief's "case studies", done honestly.
 *
 * The brief asked for case-study cards ("E-commerce AI Automation System",
 * before / after, dashboard screenshots). PRD §17 forbids publishing client
 * work without written permission and a confirmed role, and none is cleared
 * yet. So these are BLUEPRINTS: the before and after each kind of engagement
 * is designed to deliver, labelled as such on every card, with no client name,
 * no logo and no outcome figures. When real case studies are approved they
 * belong on /portfolio, and this section links there.
 *
 * The "screenshot" at the top of each card is CSS -- a chat thread, a pipeline
 * board, a report -- so it costs no image request and never goes stale when
 * the design system changes.
 */

type Blueprint = {
  title: string;
  before: string;
  after: string;
  stack: string[];
  mock: "chat" | "board" | "report";
};

const BLUEPRINTS: Blueprint[] = [
  {
    title: "E-commerce AI support system",
    before: "Manual customer handling across chat, email and Instagram DMs.",
    after: "AI chatbot + automated order workflow + CRM integration.",
    stack: ["AI chatbot", "n8n", "CRM"],
    mock: "chat",
  },
  {
    title: "Lead capture to CRM pipeline",
    before: "Enquiries sit in an inbox until someone finds time to reply.",
    after: "Form → AI qualification → CRM deal → instant WhatsApp follow-up.",
    stack: ["Forms", "Make", "CRM", "WhatsApp"],
    mock: "board",
  },
  {
    title: "Automated growth reporting",
    before: "Weekly reports assembled by hand from Ads and Analytics.",
    after: "Scheduled GA4 + Ads pull → live dashboard → plain-English summary.",
    stack: ["GA4", "Google Ads", "LLM"],
    mock: "report",
  },
];

function Mock({ kind }: { kind: Blueprint["mock"] }) {
  if (kind === "chat") {
    return (
      <div className="bp-mock bp-chat">
        <span className="bp-msg bp-msg--in">Where is my order #1042?</span>
        <span className="bp-msg bp-msg--out">It shipped today — arriving Thursday. Tracking link sent.</span>
        <span className="bp-msg bp-msg--in">Great, thanks!</span>
        <span className="bp-chip">
          <b />
          Resolved by AI &middot; logged to CRM
        </span>
      </div>
    );
  }
  if (kind === "board") {
    return (
      <div className="bp-mock bp-board">
        {["New", "Qualified", "Won"].map((col, c) => (
          <span key={col} className="bp-col">
            <em>{col}</em>
            {Array.from({ length: 3 - c }, (_, i) => (
              <i key={i} className={c === 1 && i === 0 ? "is-live" : undefined} />
            ))}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="bp-mock bp-report">
      <span className="bp-bars">
        {[38, 52, 46, 64, 58, 76, 88].map((h, i) => (
          <i key={i} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />
        ))}
      </span>
      <span className="bp-summary">
        <b />
        Summary ready &middot; sent Monday 9:00
      </span>
    </div>
  );
}

export function Blueprints() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="System blueprints"
            title={
              <>
                What these systems look like{" "}
                <span className="text-signature">in practice</span>
              </>
            }
            lede="Example builds, not client case studies. Aivorraa publishes a case study only with the client's written permission — these show the before and after each engagement is designed to deliver."
          />
          <Link
            href="/portfolio"
            className="text-brand-700 hover:text-brand-800 text-sm font-semibold transition-colors"
          >
            How case studies are published &rarr;
          </Link>
        </Reveal>

        <Reveal as="ul" mode="group" className="mt-12 grid gap-5 lg:grid-cols-3">
          {BLUEPRINTS.map((bp, i) => (
            <li
              key={bp.title}
              className="bp-card lift sd-enter-soft"
              style={staggerStyle(i)}
            >
              <div className="bp-window scope-dark" aria-hidden="true">
                <span className="bp-window-bar">
                  <span className="dash-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="bp-tag">Blueprint</span>
                </span>
                <Mock kind={bp.mock} />
              </div>

              <div className="p-6 sm:p-7">
                <h3 className="font-display text-ink text-lg font-semibold">
                  {bp.title}
                </h3>

                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="bp-row bp-row--before">
                    <dt>
                      <span className="bp-mark">
                        <MinusIcon className="h-3 w-3" />
                      </span>
                      Before
                    </dt>
                    <dd>{bp.before}</dd>
                  </div>
                  <div className="bp-row bp-row--after">
                    <dt>
                      <span className="bp-mark">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      After
                    </dt>
                    <dd>{bp.after}</dd>
                  </div>
                </dl>

                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
                  {bp.stack.map((tool) => (
                    <li key={tool} className="bp-stack">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
