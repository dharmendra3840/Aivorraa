import type { ComponentType } from "react";

import {
  BoltIcon,
  ChartIcon,
  LayersIcon,
  SparkIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/sections/common";

/**
 * The AI workflow, drawn as an operating-system console.
 *
 * Five nodes -- request, agent, data, action, result -- power up one after
 * another as the section scrolls through the viewport. A packet runs the rail
 * between them, a PIPELINE counter ticks from 00 to 05, and a terminal line
 * writes itself for each node. It is the "gamified" moment of the page: the
 * reader's scroll is what brings the system online.
 *
 * All of it is scroll-driven CSS on one named timeline (motion-sections.css);
 * the component ships no JavaScript.
 *
 * WITHOUT JAVASCRIPT OR TIMELINE SUPPORT the section renders in its finished
 * state -- every node online, the rail full, every log line written. The
 * starting "queued" state exists only where the timeline can move it on; a
 * console frozen at "queued" would be describing a broken system.
 *
 * The node copy is plain, accurate description of what the AI Automation
 * service builds (n8n / Make workflows with LLM steps) -- it is the real
 * content of the section, not decoration, so it stays in the accessibility
 * tree as an ordered list. The console chrome and log are aria-hidden.
 */

type Node = {
  title: string;
  body: string;
  Icon: ComponentType<{ className?: string }>;
  log: [string, string];
};

const NODES: Node[] = [
  {
    title: "Customer request",
    body: "A message lands on WhatsApp, a web form, email or live chat — any hour of the day.",
    Icon: WhatsAppIcon,
    log: ["request.received", 'channel=whatsapp  "Any slots on Friday?"'],
  },
  {
    title: "AI agent",
    body: "An LLM agent reads it, works out what the customer wants and replies in your tone.",
    Icon: SparkIcon,
    log: ["agent.classify", "intent=booking  reply=sent"],
  },
  {
    title: "Data processing",
    body: "Details are extracted, checked against your records and enriched before anything acts on them.",
    Icon: LayersIcon,
    log: ["data.enrich", "customer=returning  records=matched"],
  },
  {
    title: "Business action",
    body: "The workflow does the work: creates the CRM deal, books the slot, raises the invoice.",
    Icon: BoltIcon,
    log: ["action.execute", "crm.deal=created  calendar=booked"],
  },
  {
    title: "Growth result",
    body: "Every step is logged, so response time and conversion are measured rather than guessed.",
    Icon: ChartIcon,
    log: ["result.logged", "pipeline=updated  status=ok"],
  },
];

const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function WorkflowOS() {
  // overflow-x-clip: the console tilts in 3D as it arrives (motion-3d.css §6),
  // and under perspective its near edge projects wider than the viewport on
  // narrow screens. clip, not hidden: no scroll container is created.
  return (
    <section className="overflow-x-clip py-16 sm:py-20 lg:py-28">
      <Container>
        <div>
          <SectionHeading
            align="center"
            eyebrow="AI workflow"
            title={
              <>
                From customer request to{" "}
                <span className="text-signature">business result</span>
              </>
            }
            lede="What an Aivorraa automation actually does, step by step — built in n8n or Make, with a language model only where it earns its place."
          />
        </div>

        <div className="wf-os scope-dark mt-14">
          <span className="hud-corners" aria-hidden="true" />

          <div className="wf-bar" aria-hidden="true">
            <span className="dash-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="wf-bar-title">aivorraa-os &mdash; automation pipeline</span>
            <span className="wf-progress">
              Pipeline <b className="wf-count" /> / 05
            </span>
          </div>

          <div className="wf-stage">
            <span className="wf-rail" aria-hidden="true">
              <span className="wf-rail-fill" />
              <span className="wf-packet" />
            </span>

            <ol className="wf-nodes">
              {NODES.map(({ title, body, Icon }, i) => (
                <li key={title} className="wf-node" style={idx(i)}>
                  <span className="wf-index" aria-hidden="true">
                    Node {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="wf-icon" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="wf-title">{title}</h3>
                  <p className="wf-body">{body}</p>
                  <span className="wf-status" aria-hidden="true">
                    <span className="wf-status-q">Queued</span>
                    <span className="wf-status-on">
                      <b />
                      Online
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="wf-term" aria-hidden="true">
            {NODES.map(({ log }, i) => (
              <p key={log[0]} className="wf-line" style={idx(i)}>
                <span className="wf-prompt">&gt;</span>
                <span className="wf-ev">{log[0]}</span>
                <span className="wf-detail">{log[1]}</span>
              </p>
            ))}
            <p className="wf-cursor">
              <span className="wf-prompt">&gt;</span>
              <i />
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
