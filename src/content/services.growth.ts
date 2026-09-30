import type { Service } from "./types";

/**
 * Launch services, part 2 of 2 — growth & media.
 * See services.ts for the combined export and the launch-scope rules.
 */
export const GROWTH_SERVICES: Service[] = [
  {
    slug: "seo-ads",
    nav: "SEO & Ads",
    name: "SEO & Google Ads",
    icon: "search",
    accent: "amber",
    title: "SEO & Google Ads Services | Aivorraa",
    description:
      "Aivorraa fixes what stops you being found — technical SEO, keyword and intent mapping, and Google Ads built on conversion tracking. Get an audit.",
    primaryKeyword: "seo services",
    secondaryKeywords: [
      "technical seo audit",
      "google ads management",
      "local seo services",
    ],
    h1: "SEO & Ads Built on What the Data Actually Says",
    lede: "Aivorraa starts every search engagement with a technical audit, because on-page work, content and structured data are all worthless while pages remain uncrawled.",
    summary:
      "Technical audits, on-page and local SEO, keyword and intent mapping, Google Ads with real conversion tracking.",
    who: {
      heading: "Who this is for",
      intro:
        "Search problems usually have an unglamorous technical cause sitting underneath the strategy conversation.",
      items: [
        "You search your own business name and a competitor, a directory or your own Instagram profile ranks above your website.",
        "Your site has service pages that you are fairly sure nobody has ever found through Google.",
        "You are spending on Google Ads without conversion tracking, so nobody can say which clicks turned into enquiries.",
        "A previous agency reported rankings monthly but you never saw the enquiries those rankings should have produced.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Scope depends on what the audit finds. A typical engagement covers the following.",
      included: [
        {
          title: "Technical and indexation audit",
          body: "Crawl and index coverage first: which pages Google has actually indexed, what is blocked by robots.txt or a stray noindex, whether the sitemap generates and is submitted, and whether the titles Google displays match the ones on the server. This is checked before anything else because nothing below it improves until it is fixed.",
        },
        {
          title: "Entity and brand-signal work",
          body: "Organization structured data with consistent sameAs profiles, Google Business Profile setup, identical name, address and phone across every directory and profile, and an about page that states the entity plainly. This is how a search engine learns that a brand is a distinct organisation rather than a misspelling of a similar one.",
        },
        {
          title: "Keyword and intent mapping",
          body: "Keywords grouped by tier — branded, service-plus-location, generic service, and long-tail informational — and mapped to a specific page that can realistically rank for them. One page per intent, rather than five pages competing with each other.",
        },
        {
          title: "On-page optimisation",
          body: "Unique titles under 60 characters and descriptions under 155, a single H1 per page, a logical heading structure, internal links that connect related pages, descriptive alt text, and structured data validated in the Rich Results Test.",
        },
        {
          title: "Content briefs",
          body: "Briefs for the pages and articles the map calls for, specifying the search intent, the questions to answer, the internal links to include and the word count the topic warrants. Writing is delivered by Aivorraa or by your team from the brief.",
        },
        {
          title: "Google Ads setup and management",
          body: "Account and campaign structure, keyword and negative-keyword lists, ad copy, landing page recommendations and conversion tracking configured before a rupee is spent. Ongoing optimisation and reporting where a management retainer is agreed. Ad spend is billed separately by Google unless otherwise agreed.",
        },
        {
          title: "Measurement and reporting",
          body: "GA4 and Search Console configured under accounts you own, events for form submissions and click-to-call, and monthly reporting on indexed pages, query positions, sessions and enquiries — with the limits of attribution stated plainly rather than papered over.",
        },
      ],
      excluded: [
        "Google and Meta ad spend, which is billed by the platform to your own account",
        "Paid link acquisition and any tactic that violates search engine guidelines",
        "Fake reviews or review gating — only legitimate, verified review workflows",
        "Guaranteed rankings or guaranteed lead volume for any keyword",
      ],
    },
    process: [
      {
        title: "Baseline",
        body: "Record where you actually start: indexed page count, current position for your brand name, mobile page speed, organic sessions over the last thirty days. Without a baseline, no improvement can be proven.",
      },
      {
        title: "Audit",
        body: "Technical, indexation, on-page, structured data and competitive review, delivered as a prioritised list rather than a 90-page export nobody reads.",
      },
      {
        title: "Fix the blockers",
        body: "Crawlability, indexation, duplicate or missing metadata, broken internal links and dead navigation links. This is the cheapest work with the largest effect.",
      },
      {
        title: "Build the signals",
        body: "Entity and structured data work, page-level optimisation, internal linking, and the first content aimed at achievable long-tail queries.",
      },
      {
        title: "Measure and iterate",
        body: "Monthly reporting against the baseline, with the next month's priorities set by what the data shows rather than by a fixed content quota.",
      },
    ],
    pricing: {
      model: "Fixed-price audit, then monthly retainer",
      body: "Search work starts with a fixed-price technical and indexation audit, delivered as a prioritised action list you own and can implement yourself or with anyone else. Ongoing SEO is a monthly retainer sized to the number of pages and the content volume agreed. Google Ads management is a separate monthly fee, with ad spend billed directly to your own account so you keep control and visibility of the budget.",
      note: "Aivorraa does not guarantee rankings for competitive terms or a fixed lead volume. Branded search is highly likely to be won; competitive terms depend on sustained content work and on competitor activity, which nobody controls.",
    },
    faqs: [
      {
        q: "How long before SEO shows results?",
        a: "It depends entirely on the keyword tier. Your own brand name typically responds within four to eight weeks of the entity signals landing and the site being recrawled. Service-plus-location terms are realistically a six to twelve month effort and need a verified address. Generic national terms are an eighteen-month-plus commitment. Long-tail informational content often earns its first traffic within weeks, which is why it is usually where early effort belongs.",
      },
      {
        q: "Why would my own website not rank for my own brand name?",
        a: "Two common reasons. First, if only a handful of your pages are indexed, there is almost no corroborating signal for the search engine to work with. Second, if your brand name is close in spelling to an established company, spelling correction fires and you get shown their results instead. Both are fixable — indexation is a technical fix, and the spelling problem is solved by building enough independent, consistent evidence that your brand is a distinct entity.",
      },
      {
        q: "Can you guarantee first position?",
        a: "No, and any agency that does is either misleading you or planning to rank you for a term nobody searches. What can be committed to is the work: the technical fixes, the entity signals, the page-level optimisation, the content and the honest monthly reporting. Branded search is the objective most likely to be won outright, and it is the right place to start.",
      },
      {
        q: "Do I need a physical address for SEO?",
        a: "For local search, effectively yes. A Google Business Profile with a verified address is the single strongest entity signal available and it is free, and service-plus-location keywords are difficult to compete for without one. If you cannot publish an address yet, Aivorraa focuses the strategy on branded and long-tail informational terms, which do not depend on it.",
      },
      {
        q: "Will you report on things other than rankings?",
        a: "Yes, because rankings alone are a vanity number. Monthly reporting covers indexed pages, positions for the queries that matter, organic sessions, enquiries received and the specific work completed that month. Where enquiries can be attributed to a source, they are; where the data does not support attribution, that is stated rather than estimated.",
      },
    ],
    related: ["digital-marketing", "web-development", "ai-automation"],
  },
  {
    slug: "digital-marketing",
    nav: "Digital Marketing",
    name: "Digital Marketing",
    icon: "megaphone",
    accent: "rose",
    title: "Digital Marketing Agency | Aivorraa",
    description:
      "Aivorraa plans and runs digital marketing with a measurement framework attached — channels, funnels, social, content and email. Book a consultation.",
    primaryKeyword: "digital marketing agency",
    secondaryKeywords: [
      "social media management services",
      "lead generation services",
      "content marketing agency",
    ],
    h1: "Digital Marketing With the Measurement Built In",
    lede: "Aivorraa plans the channel, the funnel and the offer together, then instruments them — so the monthly report says what happened and what it cost rather than how many posts went out.",
    summary:
      "Channel strategy, funnels, social media, content and email — with GA4 and CRO instrumentation.",
    who: {
      heading: "Who this is for",
      intro:
        "Marketing that cannot be measured tends to be renewed on faith, and faith runs out.",
      items: [
        "You are posting consistently on social media and cannot tell whether any of it produces business.",
        "Traffic arrives but does not convert, and nobody has looked at the funnel between the two.",
        "Your marketing is a collection of channels run by different people with no shared plan or number.",
        "You have a good offer and no repeatable system for getting it in front of the right audience.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Engagements are scoped per channel mix and reporting cadence. A typical programme includes the following.",
      included: [
        {
          title: "Strategy and measurement framework",
          body: "Audience definition, channel selection, funnel design, offer and message planning, and the specific measures each activity will be judged on — agreed before anything is published, so success is defined in advance rather than argued about afterwards.",
        },
        {
          title: "Social media management",
          body: "Platform strategy, monthly content calendars, static posts, carousels, reels and captions, scheduling, and a defined community-management scope. Monthly reporting on reach, engagement and, where trackable, resulting enquiries.",
        },
        {
          title: "Content marketing",
          body: "Blogs and articles aimed at questions your prospects actually type, website and landing page copy, campaign messaging and repurposing of one piece across formats. Every article links to the service pages it supports, which is also how orphan pages get crawled.",
        },
        {
          title: "Lead generation funnels",
          body: "Landing pages built for a single action, enquiry forms and lead magnets, conversion tracking end to end, and a defined handoff into your CRM or inbox with response-time ownership assigned. No guaranteed lead volume is offered.",
        },
        {
          title: "Email marketing",
          body: "Newsletter and campaign setup, segmentation, automated sequences and reporting — on consent-compliant lists only. Aivorraa does not send to purchased or scraped lists, which damage sender reputation and carry legal exposure.",
        },
        {
          title: "Analytics and conversion optimisation",
          body: "GA4 configured with events for form submissions, WhatsApp clicks, phone clicks and service-page-to-contact paths. Funnel review, heatmaps where consent-compliant, and A/B testing once traffic volume can actually support a conclusion.",
        },
        {
          title: "Monthly reporting",
          body: "Activity, spend, traffic, leads and conversions with clear definitions and stated attribution limits, plus the specific work completed and next month's priorities. One document, in plain language.",
        },
      ],
      excluded: [
        "Paid advertising budget, billed by each platform to your own accounts",
        "Purchased contact lists, follower buying and engagement pods",
        "Fake reviews, fabricated testimonials and misleading claims of any kind",
        "Guaranteed lead volume, sales figures or follower growth targets",
      ],
    },
    process: [
      {
        title: "Baseline",
        body: "Current traffic, enquiry volume, channel performance and what has already been tried. Confirm that tracking works before judging anything by it.",
      },
      {
        title: "Plan",
        body: "Audience, channels, funnel, offer, calendar and the measures of success, documented and approved as one plan rather than assembled channel by channel.",
      },
      {
        title: "Produce",
        body: "Creative, copy, landing pages and campaign assets, reviewed against the plan and your brand guidelines.",
      },
      {
        title: "Run",
        body: "Publish, distribute and manage, with tracking verified on every entry point and response ownership assigned for incoming leads.",
      },
      {
        title: "Report and adjust",
        body: "Monthly review against the agreed measures, and a decision each month about what to continue, change or stop.",
      },
    ],
    pricing: {
      model: "Monthly retainer, scoped by channel mix",
      body: "Digital marketing is a monthly retainer sized to the channels in scope, the volume of creative produced and the reporting cadence. It is deliberately not sold as a one-month trial, because most channels cannot demonstrate anything meaningful inside four weeks. A three-month minimum engagement is typical, with a defined deliverable list per month so what you are paying for is never ambiguous. Ad spend sits outside the retainer and is billed to your own platform accounts.",
    },
    faqs: [
      {
        q: "How much should I budget for ads?",
        a: "Separately from management fees, and the honest answer depends on your market's cost per click and your conversion rate. Aivorraa's recommendation is to start small enough that a month of learning is affordable, instrument it properly, and only scale a campaign once the cost per qualified enquiry is known. Spend is always billed by the platform directly to your account so you retain full control and visibility.",
      },
      {
        q: "Can you guarantee a number of leads?",
        a: "No. Lead volume depends on your market, your offer, your pricing, your response time and competitor activity — several of which are outside Aivorraa's control. What is committed to is the work, the tracking and honest reporting. Anyone guaranteeing a lead count is either quoting one so low it is meaningless or counting things you would not call a lead.",
      },
      {
        q: "Do you write the content or do we?",
        a: "Either. Aivorraa can write to brief, or provide the briefs and calendar for your team to write against, which is often the better choice when deep subject expertise sits inside your business. What matters is that a single named person approves any claim about outcomes, clients or capabilities — content programmes without a named approver stall, and that is the most common failure mode.",
      },
      {
        q: "How long before we see results?",
        a: "Paid channels produce data within days and a reliable read within four to six weeks. Organic social and content compound over months, not weeks. Email performs fastest of all when you already have a consent-compliant list. Aivorraa sets expectations per channel at the planning stage rather than offering one blended timeline that is wrong for every channel in it.",
      },
      {
        q: "What happens to the accounts if we stop working together?",
        a: "You keep everything, because it was all created in your name. GA4, Search Console, ad accounts, business profiles, email platform and social logins are yours throughout — never held in a contractor's personal account. Aivorraa's access is removed on request and you retain full history and data.",
      },
    ],
    related: ["seo-ads", "branding-graphics", "video-motion"],
  },
  {
    slug: "branding-graphics",
    nav: "Brand & Graphics",
    name: "Brand Identity & Graphic Design",
    icon: "palette",
    accent: "violet",
    title: "Brand Identity & Graphic Design | Aivorraa",
    description:
      "Aivorraa builds brand identities and the design system around them — logo, colour, type, guidelines and the everyday assets your team needs.",
    primaryKeyword: "brand identity design",
    secondaryKeywords: [
      "graphic design services",
      "logo design company",
      "presentation design services",
    ],
    h1: "Brand Identity That Survives Contact With Real Use",
    lede: "Aivorraa designs identities as systems — logo, colour, type, rules and the everyday templates your team will actually use — so the brand still looks like itself six months after handover.",
    summary:
      "Logo and identity systems, brand guidelines, social and ad creative, brochures and pitch decks.",
    who: {
      heading: "Who this is for",
      intro:
        "A logo is the smallest part of a brand problem. The bigger part is what happens every day afterwards.",
      items: [
        "You are launching and need an identity that will not need replacing in eighteen months.",
        "Your brand looks different on the website, the invoice, Instagram and the pitch deck.",
        "Your team recreates the same social post format from scratch every week because no template exists.",
        "You are raising or pitching and the deck does not match the quality of what you are actually selling.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Identity and ongoing design work are scoped separately. A typical identity engagement includes the following.",
      included: [
        {
          title: "Brand discovery",
          body: "What the business does, who it serves, how it wants to be understood, and what the competitive set already looks like. The output is a written direction, agreed before any visual is presented — which is what keeps the review from becoming a matter of personal taste.",
        },
        {
          title: "Logo design and variations",
          body: "A primary mark with the variations real use demands: horizontal and stacked lockups, an icon-only mark, single-colour and reversed versions, and a favicon-scale treatment tested at the size it will actually appear.",
        },
        {
          title: "Colour and typography system",
          body: "A defined palette with exact values for screen and print, checked for contrast so text on brand colours remains legible and accessible, and a type scale with specified weights and licensing confirmed for the intended use.",
        },
        {
          title: "Brand guidelines",
          body: "A practical document covering clear space, minimum sizes, correct and incorrect usage, colour application, type hierarchy and tone of voice. Written to be used by whoever joins next, not to win a design award.",
        },
        {
          title: "Everyday asset templates",
          body: "The formats your team needs weekly: social post and story templates, ad creative sizes, letterhead and invoice, email signature and presentation master. This is what determines whether the identity holds together in practice.",
        },
        {
          title: "Marketing collateral",
          body: "Brochures, flyers, banners, company profiles, proposal and capability decks, pitch and investor decks, and stationery — designed within the system rather than as one-off pieces.",
        },
        {
          title: "Files and handover",
          body: "Source and export files in the formats you will need, organised and named sensibly, with fonts and licensing documented. You own your brand assets outright.",
        },
      ],
      excluded: [
        "Trademark searching, filing and legal clearance, which requires a qualified attorney",
        "Font and stock asset licence fees, which are purchased in your name",
        "Print production and delivery, unless coordinated as a separately quoted scope",
        "Unlimited concepts or revision rounds — both are specified in the scope",
      ],
    },
    process: [
      {
        title: "Discover",
        body: "Brief, audience, competitive review and written creative direction, approved before design begins.",
      },
      {
        title: "Explore",
        body: "A defined number of distinct directions presented in context — on a screen, a sign, a document — rather than as a mark floating on white.",
      },
      {
        title: "Refine",
        body: "One direction chosen and developed through the agreed revision rounds, with the variations and edge cases resolved.",
      },
      {
        title: "Systemise",
        body: "Colour, type, components, templates and guidelines built out into a system your team can apply without a designer present.",
      },
      {
        title: "Hand over",
        body: "Organised source and export files, documented licensing, and a walkthrough of the guidelines with the people who will use them.",
      },
    ],
    pricing: {
      model: "Fixed-scope identity, or a design retainer",
      body: "Identity work is quoted as a fixed scope, priced by the number of directions explored, the revision rounds included and the depth of the guidelines and template set. Ongoing creative — social, ads, collateral, decks — is better handled as a monthly retainer with an agreed volume, which avoids re-quoting every request. Both are confirmed in writing with deliverables, revision limits, file formats and third-party licence costs itemised.",
      note: "Any historical promotional offer, including free-concept or fixed-price logo packages, must be reconfirmed as currently available before it is relied upon.",
    },
    faqs: [
      {
        q: "How many logo concepts do you present?",
        a: "The number is specified in your scope, and Aivorraa deliberately presents few rather than many. Three well-reasoned directions produce a better decision than twenty variations, because a large set shifts the conversation from strategy to preference and usually ends in a committee-designed compromise. Each direction is shown in real context so you can judge it as it will be used.",
      },
      {
        q: "Do I own the logo and the source files?",
        a: "Yes. On completion of the agreed payment, ownership of the final identity and its source files transfers to you, and you receive organised working and export files. Third-party fonts and stock assets remain licensed from their vendors, and Aivorraa documents exactly what those licences cover so you are not exposed later.",
      },
      {
        q: "Can you register the trademark?",
        a: "No — that requires a qualified trademark attorney and Aivorraa will not imply otherwise. What Aivorraa does is a reasonable visual check against the obvious competitive set during discovery, and it will flag a direction that looks risky. Formal searching, clearance and filing should be handled by a professional before you commit to the mark commercially.",
      },
      {
        q: "We already have a logo. Can you build a system around it?",
        a: "Often the most valuable version of this work. Aivorraa audits the existing mark, establishes whether it holds up at real sizes and in single colour, and then builds the colour, type, template and guideline layer that is usually what is actually missing. A full rebrand is recommended only when the existing mark genuinely cannot carry the business.",
      },
      {
        q: "What file formats will I receive?",
        a: "Vector source for the logo plus exports for screen and print use, colour values for digital and print, and editable templates in the applications your team already works in. Everything is organised and named so a new hire can find the right file without asking, and licensing notes are included alongside.",
      },
    ],
    related: ["ui-ux-design", "video-motion", "digital-marketing"],
  },
  {
    slug: "video-motion",
    nav: "Video & Motion",
    name: "Video Editing & Motion Graphics",
    icon: "play",
    accent: "blue",
    title: "Video Editing & Motion Graphics | Aivorraa",
    description:
      "Aivorraa edits reels, shorts, YouTube and promo video, and builds motion graphics — explainers, logo animation and campaign assets.",
    primaryKeyword: "video editing services",
    secondaryKeywords: [
      "motion graphics services",
      "reels editing services",
      "explainer video production",
    ],
    h1: "Video & Motion Built for Where It Will Actually Be Watched",
    lede: "Aivorraa edits for the platform and the first two seconds — reels, shorts, YouTube, promos and explainers, cut in the aspect ratio and pacing the destination rewards.",
    summary:
      "Reels and shorts, YouTube edits, promo video, subtitles, logo animation and explainers.",
    who: {
      heading: "Who this is for",
      intro:
        "Most video underperforms for production reasons rather than creative ones.",
      items: [
        "You have footage on a phone and no consistent pipeline for turning it into publishable content.",
        "Your video is edited once and posted everywhere, so it is letterboxed on the platform that matters most.",
        "You need to explain a product or service that is difficult to photograph and easier to animate.",
        "Your brand has a logo that appears as a static image everywhere, including in video.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Volume, turnaround and revision rounds are agreed per engagement. Typical deliverables include the following.",
      included: [
        {
          title: "Short-form editing",
          body: "Reels, shorts and vertical video cut for a hook in the opening seconds, with pacing, captions and sound designed for muted autoplay — which is how most of the audience will encounter it.",
        },
        {
          title: "Long-form and YouTube edits",
          body: "Structured edits with an intro that earns the next thirty seconds, chapter markers, lower thirds, b-roll placement and a considered end screen.",
        },
        {
          title: "Promotional and brand video",
          body: "Product, service and company films assembled from your footage or coordinated production, edited to a defined length and message rather than to whatever the footage allows.",
        },
        {
          title: "Subtitles and sound",
          body: "Accurate burned-in or soft subtitles, audio levelling to platform norms, noise reduction and music selection from properly licensed libraries.",
        },
        {
          title: "Motion graphics",
          body: "Animated titles, explainer sequences, logo animation, data and UI motion, and campaign assets built within your brand's existing system rather than in a separate visual language.",
        },
        {
          title: "Format adaptation",
          body: "One edit delivered in the aspect ratios and durations each platform needs — vertical, square and horizontal — reframed rather than crudely cropped, with safe areas respected.",
        },
        {
          title: "Organised delivery",
          body: "Final exports at the correct codec and bitrate per destination, sensible file naming, and project files retained for an agreed period so future edits do not start from scratch.",
        },
      ],
      excluded: [
        "Music, stock footage and sound-effect licence fees, which are purchased in your name",
        "On-location filming crew, equipment hire and talent, unless separately scoped and quoted",
        "Scriptwriting and voiceover talent, unless included in the agreed scope",
        "Guaranteed views, watch time or platform reach",
      ],
    },
    process: [
      {
        title: "Brief",
        body: "The message, the destination platform, the required durations and formats, and the reference material that shows what good looks like to you.",
      },
      {
        title: "Assemble",
        body: "Footage review, selects, a rough cut for structure and message approval before detail work begins — approving structure late is the expensive mistake.",
      },
      {
        title: "Edit",
        body: "Pacing, colour, sound, captions, graphics and motion, built to the approved structure.",
      },
      {
        title: "Review",
        body: "Consolidated feedback per round against the number of rounds in scope, with timecoded comments so nothing is ambiguous.",
      },
      {
        title: "Deliver",
        body: "Exports in every required format and aspect ratio, correctly named, with project files archived for the agreed retention period.",
      },
    ],
    pricing: {
      model: "Per deliverable or monthly volume retainer",
      body: "One-off edits are quoted per deliverable based on finished duration, source footage volume and graphics complexity. Teams publishing continuously are better served by a monthly retainer covering an agreed number of short-form and long-form edits with a defined turnaround, which is both cheaper per asset and far more predictable to plan content around. Licensing for music and stock is purchased in your name and itemised separately.",
    },
    faqs: [
      {
        q: "What turnaround should I expect?",
        a: "For short-form edits from supplied footage, two to four working days per batch is typical, and a retainer with an agreed weekly volume can run faster because the pipeline is already set up. Long-form and motion graphics depend on duration and complexity, and the honest estimate is given against your actual brief rather than as a blanket promise.",
      },
      {
        q: "Do you shoot the footage as well?",
        a: "Production coordination can be arranged and quoted separately, and Aivorraa will be explicit about whether a given shoot is handled in-house or by a production partner — you should always know who is actually holding the camera. Many clients supply their own phone footage, and with a short briefing on lighting, framing and audio, that footage edits well.",
      },
      {
        q: "Can you work within our existing brand?",
        a: "Yes, and it is the default. Your colour, type, logo behaviour and motion conventions are applied to every deliverable. If no motion guidance exists yet, Aivorraa can establish a small set of conventions — how the logo resolves, how titles enter, standard transition timings — so video stops looking like a separate brand.",
      },
      {
        q: "Who owns the music licence?",
        a: "You do. Music, stock footage and sound effects are licensed in your name, for the usage you actually need, and the licence terms are documented on delivery. This matters because platform copyright claims and takedowns almost always trace back to audio licensed for the wrong scope, and a licence held by an agency you later stop working with is a licence you do not have.",
      },
      {
        q: "How many revisions are included?",
        a: "Stated in your scope, typically two rounds per deliverable, with structure approved at the rough-cut stage. Rough-cut approval matters: reordering the story after colour, captions and graphics are finished means redoing that work, so the process front-loads the structural decision deliberately.",
      },
    ],
    related: ["branding-graphics", "digital-marketing", "ui-ux-design"],
  },
];
