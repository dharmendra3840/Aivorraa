import { CLAIMS } from "@/lib/site-config";
import {
  BoltIcon,
  ChartIcon,
  CheckIcon,
  LayersIcon,
  SparkIcon,
  WhatsAppIcon,
} from "@/components/icons";

/**
 * The floating AI command dashboard under the hero headline.
 *
 * A server component: it is markup and CSS, so it ships no JavaScript. The
 * 3D tilt that straightens as you scroll, the travelling packet, the drawing
 * chart line and the ticking log are all CSS -- see motion-hero.css.
 *
 * THE FOUR TILES, AND WHY THEY DEFAULT TO STATUS RATHER THAN NUMBERS
 * The theme brief put 32+ agents, 99% success, 450+ workflows and +87% growth
 * here. Any number on an agency's homepage is read as a claim about that
 * agency, however it is framed, and none of these is documented -- while the
 * same page promises "No invented statistics". So the figures sit behind
 * CLAIMS.showcaseMetrics (site-config.ts), OFF by default, and the tiles show
 * the live state of the sample workflow the dashboard depicts instead. That is
 * a true description of the picture, and it still reads as a working console.
 *
 * Decorative as a whole (`aria-hidden`): everything it says is said in real
 * copy elsewhere on the page, and a screen reader walking through a mock UI of
 * status chips and log lines gains nothing but noise.
 */

type Tile = { label: string; value: string; note: string; tone: "violet" | "cyan" | "blue" };

function tiles(): Tile[] {
  const m = CLAIMS.showcaseMetrics;
  if (m.enabled) {
    return [
      { label: "AI agents active", value: m.agentsActive, note: "across workflows", tone: "violet" },
      { label: "Automation success", value: m.automationSuccess, note: "last 30 days", tone: "cyan" },
      { label: "Workflows running", value: m.workflowsRunning, note: "live now", tone: "blue" },
      { label: "Business growth", value: m.businessGrowth, note: "vs. baseline", tone: "violet" },
    ];
  }
  return [
    { label: "AI agent", value: "Online", note: "answering enquiries", tone: "violet" },
    { label: "Automation", value: "Running", note: "5-step pipeline", tone: "cyan" },
    { label: "Lead routing", value: "Lead → CRM", note: "no manual entry", tone: "blue" },
    { label: "Reporting", value: "Auto-synced", note: "GA4 + Ads, weekly", tone: "violet" },
  ];
}

const FLOW = [
  { label: "Enquiry", Icon: WhatsAppIcon },
  { label: "AI agent", Icon: SparkIcon },
  { label: "Qualify", Icon: LayersIcon },
  { label: "CRM", Icon: BoltIcon },
];

const LOG = [
  { t: "09:41:02", ev: "enquiry.received", detail: "via WhatsApp" },
  { t: "09:41:02", ev: "agent.replied", detail: "intent: pricing" },
  { t: "09:41:03", ev: "lead.qualified", detail: "score: high" },
  { t: "09:41:03", ev: "crm.deal_created", detail: "owner assigned" },
];

export function HeroDashboard() {
  return (
    <div className="dash-stage scope-dark" aria-hidden="true">
      <div className="dash">
        {/* ---- window chrome ---- */}
        <div className="dash-bar">
          <span className="dash-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="dash-title">aivorraa &middot; workflow monitor</span>
          <span className="dash-tag">
            {CLAIMS.showcaseMetrics.enabled ? "Live" : "Sample workflow"}
          </span>
          <span className="dash-live">
            <b />
            Live
          </span>
        </div>

        <div className="dash-body">
          {/* ---- sidebar ---- */}
          <div className="dash-side">
            {[SparkIcon, LayersIcon, BoltIcon, ChartIcon].map((I, i) => (
              <span key={i} className={i === 0 ? "is-on" : undefined}>
                <I className="h-4 w-4" />
              </span>
            ))}
          </div>

          <div className="dash-main">
            {/* ---- metric / status tiles ---- */}
            <div className="dash-tiles">
              {tiles().map((tile, i) => (
                <div
                  key={tile.label}
                  className={`dash-tile tone-${tile.tone}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="dash-tile-label">{tile.label}</span>
                  <span className="dash-tile-value">{tile.value}</span>
                  <span className="dash-tile-note">
                    <b />
                    {tile.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="dash-row">
              {/* ---- workflow graph with a travelling packet ---- */}
              <div className="dash-card dash-flow">
                <span className="dash-card-title">Workflow &middot; lead intake</span>
                <div className="flow-track">
                  <span className="flow-line" />
                  <span className="flow-packet" />
                  {FLOW.map(({ label, Icon }, i) => (
                    <span
                      key={label}
                      className="flow-node"
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <span className="flow-icon">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flow-label">{label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ---- throughput chart: a shape, deliberately without axis values ---- */}
              <div className="dash-card dash-chart">
                <span className="dash-card-title">Throughput</span>
                <svg viewBox="0 0 240 90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dashArea" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" style={{ stopColor: "var(--color-brand-600)" }} stopOpacity="0.45" />
                      <stop offset="100%" style={{ stopColor: "var(--color-brand-400)" }} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="dashLine" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" style={{ stopColor: "var(--color-brand-800)" }} />
                      <stop offset="100%" style={{ stopColor: "var(--color-brand-600)" }} />
                    </linearGradient>
                  </defs>
                  <path
                    className="chart-area"
                    d="M0 78 C20 74 30 70 48 66 S80 60 96 52 S130 44 146 40 S182 26 198 22 S226 12 240 8 L240 90 L0 90 Z"
                    fill="url(#dashArea)"
                  />
                  <path
                    className="chart-line"
                    d="M0 78 C20 74 30 70 48 66 S80 60 96 52 S130 44 146 40 S182 26 198 22 S226 12 240 8"
                    fill="none"
                    stroke="url(#dashLine)"
                    strokeWidth="2"
                    pathLength={1}
                  />
                </svg>
              </div>
            </div>

            {/* ---- activity log ---- */}
            <ul className="dash-log">
              {LOG.map((row, i) => (
                <li key={row.ev} style={{ "--i": i } as React.CSSProperties}>
                  <span className="log-t">{row.t}</span>
                  <span className="log-ev">{row.ev}</span>
                  <span className="log-d">{row.detail}</span>
                  <CheckIcon className="log-ok h-3.5 w-3.5" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---- floating glass cards around the window ---- */}
      <div className="dash-float dash-float--agent">
        <span className="float-orb">
          <SparkIcon className="h-4 w-4" />
        </span>
        <span>
          <b>AI agent</b>
          <em>
            <i />
            Online
          </em>
        </span>
      </div>

      <div className="dash-float dash-float--chat">
        <span className="chat-bubble chat-bubble--in">Do you ship to Pune?</span>
        <span className="chat-bubble chat-bubble--out">
          <span className="typing">
            <i />
            <i />
            <i />
          </span>
        </span>
      </div>

      <div className="dash-float dash-float--done">
        <span className="done-check">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <span>
          <b>Workflow complete</b>
          <em>Lead synced to CRM</em>
        </span>
      </div>
    </div>
  );
}
