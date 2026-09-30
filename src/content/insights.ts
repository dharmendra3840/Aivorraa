import type { Article } from "./types";

/**
 * PRD §17 — Content operations.
 *
 * Launch focus is Tier 1 (branded) and Tier 4 (long-tail informational),
 * because Tier 4 is low competition with real search demand and the fastest
 * route to organic traffic. Tier 2 waits on a verified address.
 *
 * Cadence: two articles per month, 1,200–1,800 words, each answering a question
 * a prospective client would actually type. Every article MUST link to at least
 * two service pages — this is also how orphan pages get crawled (PRD §17).
 *
 * `published: false` keeps a draft out of the site and out of the sitemap.
 */
export const ARTICLES: Article[] = [
  {
    slug: "business-website-cost-india",
    title: "How Much Does a Business Website Cost in India?",
    description:
      "An honest breakdown of what a business website costs in India in 2026, what drives the price up or down, and the recurring costs most quotes leave out.",
    tier: 4,
    keyword: "how much does a business website cost in india",
    publishedAt: "2026-09-21",
    author: "Aivorraa",
    readingMinutes: 8,
    serviceLinks: ["web-development", "ui-ux-design", "seo-ads"],
    published: true,
    body: [
      {
        type: "p",
        text: "Ask five agencies what a business website costs and you will get five numbers with a spread of ten times between them. None of them is necessarily lying. A website is not one product, and the honest answer depends on what is actually being built, how much of the work you are absorbing yourself, and what happens after launch.",
      },
      {
        type: "p",
        text: "This article sets out the bands you will realistically encounter in India, what moves a quote between them, and the recurring costs that are frequently left out of the conversation until the first renewal notice arrives.",
      },
      { type: "h2", text: "The four price bands you will encounter" },
      {
        type: "h3",
        text: "Template sites — roughly ₹5,000 to ₹25,000",
      },
      {
        type: "p",
        text: "A purchased theme, your logo and copy dropped into it, and five to eight pages. This is a real option and sometimes the right one: if you need a credible web presence this month and your budget is genuinely tight, a well-chosen template beats no website by a wide margin.",
      },
      {
        type: "p",
        text: "What you are giving up is anything specific to your business. The layout was designed for a generic use case, performance is usually poor because themes ship features you will never use, and customisation beyond colours and text tends to cost more than it saved. Be careful about offers at the bottom of this band — check what is actually included, how many revisions you get, whether hosting and domain are extra, and what happens if you want a change in month three.",
      },
      {
        type: "h3",
        text: "Custom small-business sites — roughly ₹40,000 to ₹1,50,000",
      },
      {
        type: "p",
        text: "Designed rather than selected: a layout built around your services, content structured for how you actually sell, a CMS you can edit, forms that deliver reliably, and search foundations built in from the start rather than retrofitted. Eight to fifteen pages is typical.",
      },
      {
        type: "p",
        text: "This is where most established small and mid-sized businesses land, and where the return is usually clearest. The variation inside the band comes down to page count, how much copy and photography already exists, and whether the design is original or adapted.",
      },
      {
        type: "h3",
        text: "Content-heavy and e-commerce builds — roughly ₹1,50,000 to ₹5,00,000",
      },
      {
        type: "p",
        text: "Stores with real catalogues, multi-service sites with dozens of landing pages, or sites needing payment, shipping, inventory and CRM integration. The cost driver stops being design and becomes structure: category architecture that can rank, product data that stays accurate, and a checkout tested across payment methods and failure paths.",
      },
      {
        type: "h3",
        text: "Web applications — ₹5,00,000 and up",
      },
      {
        type: "p",
        text: "Customer portals, dashboards, role-based internal tools, SaaS products. At this point you are not buying a website; you are commissioning software, and it should be scoped, estimated and managed as software. Anyone quoting this from a one-page brief is guessing.",
      },
      {
        type: "callout",
        text: "A number without a scope attached is not a quote. Before comparing two prices, confirm they cover the same page count, revision rounds, content responsibility, integrations and post-launch support.",
      },
      { type: "h2", text: "What actually moves the number" },
      {
        type: "ul",
        items: [
          "Page and template count. Twelve pages built from four templates cost far less than twelve individually designed pages. Ask which you are getting.",
          "Who writes the content. Copywriting is frequently the largest hidden line item. If the quote assumes you supply final copy and you do not have it, the project will stall rather than cost less.",
          "Whether photography exists. Original photography or approved project imagery is a separate cost. Generic stock is cheap and looks it.",
          "Integrations. Payment gateways, CRM, calendar booking, shipping, ERP — each is a discrete piece of work with its own testing and failure cases.",
          "CMS depth. Making every element editable sounds appealing and costs more to build, more to test, and more to keep from breaking. Editable should mean the content that genuinely changes.",
          "Performance and accessibility. Meeting a real performance target and WCAG AA is work, not a checkbox, and it is worth specifying if you care about it.",
        ],
      },
      { type: "h2", text: "The recurring costs most quotes leave out" },
      {
        type: "p",
        text: "The build is a one-time figure. These are not, and they should be in your budget from day one:",
      },
      {
        type: "ul",
        items: [
          "Domain renewal — typically ₹800 to ₹1,500 a year for a .com.",
          "Hosting — anywhere from ₹2,000 a year on shared hosting to ₹50,000 or more annually for managed application hosting, depending on what you built.",
          "Business email — usually charged per mailbox, per month.",
          "SSL — included free by most hosts now; be sceptical of anyone charging separately for it.",
          "Premium plugin and theme licences — annual, and features silently stop updating when they lapse.",
          "Maintenance — updates, backups, monitoring and security patches. Either you pay for this or you accept the risk of an unpatched site.",
          "Content and SEO work — the site is a starting point, not a finished asset.",
        ],
      },
      { type: "h2", text: "Questions worth asking before you sign" },
      {
        type: "ol",
        items: [
          "Who owns the domain, hosting and analytics accounts? They should be in your name, not a contractor's personal login.",
          "How many revision rounds are included, and what counts as one round?",
          "What happens to my existing URLs and search rankings? The answer should mention a redirect map written before development starts.",
          "Is SEO metadata included per page, or added later as an extra?",
          "Who fixes it if something breaks in month two, and how fast?",
          "What exactly is excluded? A quote that lists nothing as excluded has not been thought through.",
          "Will I be able to edit content myself, and which parts?",
        ],
      },
      { type: "h2", text: "How to decide what you actually need" },
      {
        type: "p",
        text: "Start from the commercial question rather than the feature list. If one additional client a month would cover the difference between a template and a custom build, the custom build is not really the more expensive option. If you are testing whether a service has a market at all, spending six figures to find out is the wrong sequence — build small, learn, then invest in what the evidence supports.",
      },
      {
        type: "p",
        text: "The failure mode to avoid is spending the whole budget on a build and leaving nothing for the work that makes a site produce enquiries. A beautiful site nobody can find is not an asset. Budget for content and search from the beginning, and be suspicious of any proposal that treats launch as the finish line.",
      },
      { type: "h2", text: "Where Aivorraa fits" },
      {
        type: "p",
        text: "Aivorraa quotes web development after a short discovery conversation rather than from a price list, because the honest cost of a marketing site and a customer portal are not in the same range. You receive a written scope listing deliverables, revision limits, exclusions, third-party costs and payment milestones before anything is committed — and if the right recommendation is to fix your existing site rather than rebuild it, you will hear that instead.",
      },
    ],
  },
  {
    slug: "what-is-n8n-automation-used-for",
    title: "What Is n8n Automation Used For? Practical Business Examples",
    description:
      "What n8n actually does, the business workflows it suits best, how it compares to Zapier and Make, and when automation is the wrong answer entirely.",
    tier: 4,
    keyword: "what is n8n automation used for",
    publishedAt: "2026-09-21",
    author: "Aivorraa",
    readingMinutes: 7,
    serviceLinks: ["ai-automation", "web-development", "digital-marketing"],
    published: true,
    body: [
      {
        type: "p",
        text: "n8n is a workflow automation tool. You describe a trigger — a form submission, an incoming email, a scheduled time — and then the sequence of things that should happen next, connecting the applications your business already uses. It occupies the same category as Zapier and Make, with one meaningful difference: it can be self-hosted, so the workflows and the data passing through them stay on infrastructure you control.",
      },
      {
        type: "p",
        text: "That is the technical description. The more useful question is which parts of a business it actually earns its place in.",
      },
      { type: "h2", text: "The work n8n is genuinely good at" },
      {
        type: "h3",
        text: "Getting every enquiry into one place",
      },
      {
        type: "p",
        text: "A typical small business receives enquiries through a website form, WhatsApp, Instagram DMs, a phone number and someone's personal email. Nobody has a complete picture, and the slow ones go cold. A workflow can collect all of them into a single sheet or CRM, deduplicate, assign by rule, send an immediate acknowledgement, and escalate to a manager if nothing has been actioned within your agreed window. This is usually the highest-return first automation, because the cost of a missed enquiry is the whole enquiry.",
      },
      {
        type: "h3",
        text: "Moving data between systems that do not integrate",
      },
      {
        type: "p",
        text: "Order comes into the store, customer record needs creating in the CRM, invoice needs raising in the accounting tool, warehouse needs notifying, customer needs an update. Each of those tools has an API and none of them talk to each other by default. This is the least glamorous automation work and frequently the most valuable, because it is pure repetition with a clear failure cost.",
      },
      {
        type: "h3",
        text: "Scheduled checks and reports",
      },
      {
        type: "p",
        text: "Pull yesterday's numbers from three sources every morning and post a summary to the team channel. Check stock levels and flag anything below threshold. Watch a competitor's pricing page weekly. Anything you currently do on a calendar reminder is a candidate.",
      },
      {
        type: "h3",
        text: "Handling documents that arrive as unstructured files",
      },
      {
        type: "p",
        text: "Invoices, purchase orders and ID documents arrive as PDFs and phone photos, and someone reads them and retypes the fields. This is where a language model genuinely helps: n8n can call an LLM to extract structured fields, apply a confidence threshold, write the clean data into your system, and route anything uncertain to a human queue rather than guessing.",
      },
      { type: "h2", text: "n8n, Zapier or Make — which one?" },
      {
        type: "ul",
        items: [
          "Zapier is the easiest to start with and has the widest catalogue of ready-made integrations. It becomes expensive at volume because pricing is driven by task count.",
          "Make offers more visual control over branching logic and is generally cheaper per operation than Zapier, with a slightly steeper learning curve.",
          "n8n can be self-hosted, which changes the economics completely at high volume and lets sensitive data stay on your own infrastructure. It also allows custom code inside a workflow, so an unusual requirement does not become a dead end. The trade-off is that self-hosting is infrastructure you or someone else must maintain.",
        ],
      },
      {
        type: "p",
        text: "The right answer depends on volume, data sensitivity and who will maintain it. A business running a few hundred operations a month with no unusual data-handling constraints is often best served by the hosted option that its team finds easiest to understand. Choosing the most powerful tool and then having nobody able to maintain it is a common and expensive mistake.",
      },
      { type: "h2", text: "When automation is the wrong answer" },
      {
        type: "p",
        text: "This is the part most automation articles skip.",
      },
      {
        type: "ul",
        items: [
          "The process is broken. Automating a bad process makes it fail faster and at greater scale. Fix or remove the steps first — a good process audit usually eliminates more steps than it automates.",
          "The volume is low. A task done twice a month rarely justifies the build, the testing and the ongoing maintenance.",
          "The rules keep changing. If the logic genuinely changes every few weeks, you will spend more time maintaining the workflow than you saved.",
          "The decision needs judgement. Anything with legal, financial or safety consequences should keep a human approval step. Automate the preparation, not the decision.",
        ],
      },
      { type: "h2", text: "What good automation looks like in practice" },
      {
        type: "p",
        text: "The difference between an automation that lasts and one that quietly dies is almost entirely in the unglamorous parts:",
      },
      {
        type: "ul",
        items: [
          "Failure notifications that reach a human. The real risk is silent failure — a workflow stops and nobody notices for a week.",
          "Retries on transient errors, so a momentary API timeout does not lose a record.",
          "Logging you can actually inspect when someone asks what happened to a specific enquiry.",
          "Written documentation, so the automation is not a black box only its builder understands.",
          "Credentials stored in accounts your business owns, not in a contractor's personal login.",
          "A measured baseline, so you can prove the saving rather than assert it.",
        ],
      },
      { type: "h2", text: "A sensible first step" },
      {
        type: "p",
        text: "Pick the single most repetitive task in your week. Write down how often it happens, how long it takes and how often it goes wrong. That is your baseline, and it takes an afternoon. Automate that one workflow, run it alongside the manual process until you trust it, and measure the result against the baseline before building anything else.",
      },
      {
        type: "p",
        text: "Aivorraa approaches automation the same way: a paid process audit producing a prioritised map with estimated hours saved per workflow — useful even if you build none of it — then individual workflows quoted per build, so you can stop after the first if the return is not there.",
      },
    ],
  },
];

export const PUBLISHED_ARTICLES = ARTICLES.filter((a) => a.published).sort(
  (a, b) => (a.publishedAt < b.publishedAt ? 1 : -1),
);

export function getArticle(slug: string): Article | undefined {
  return PUBLISHED_ARTICLES.find((a) => a.slug === slug);
}
