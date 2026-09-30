import type { Service } from "./types";

/**
 * Launch services, part 1 of 2 — build & product.
 * See services.ts for the combined export and the launch-scope rules.
 */
export const DIGITAL_SERVICES: Service[] = [
  {
    slug: "web-development",
    nav: "Web Development",
    name: "Web Development",
    icon: "code",
    accent: "blue",
    title: "Web Development Services in Delhi NCR | Aivorraa",
    description:
      "Aivorraa builds fast, scalable websites and web applications for growing businesses. Custom development, CMS, e-commerce and support. Get a quote.",
    primaryKeyword: "web development services",
    secondaryKeywords: [
      "website development company",
      "custom web application development",
      "business website design",
    ],
    h1: "Web Development That Scales With Your Business",
    lede: "Aivorraa builds websites and web applications on modern, server-rendered foundations — fast to load, straightforward to edit, and built so the next feature does not require a rebuild.",
    summary:
      "Marketing sites, CMS builds, portals and web apps — server-rendered, fast, and easy to edit.",
    who: {
      heading: "Who this is for",
      intro:
        "Most businesses do not come to Aivorraa asking for a website. They come with a problem the current site is causing.",
      items: [
        "Your site loads slowly on mobile, and you suspect it is costing you enquiries you never hear about.",
        "Editing a single line of copy means raising a ticket with whoever built it, so the site quietly goes stale.",
        "The design looked right at launch but the business has moved on, and new services have nowhere to live.",
        "You are running an operational process in spreadsheets and WhatsApp that should be a proper web application.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Every Aivorraa web development engagement is scoped in writing before work starts. A typical build includes the following.",
      included: [
        {
          title: "Architecture and page structure",
          body: "A sitemap and URL plan agreed before design begins, with redirects mapped for any URL that already exists. Changing a live URL without a 301 discards its search history, so Aivorraa builds the redirect map first rather than patching it after launch.",
        },
        {
          title: "Responsive front-end implementation",
          body: "Built mobile-first and tested from 320px upward with no horizontal overflow. Layouts are implemented against a shared design token set, so spacing, colour and type stay consistent as pages are added.",
        },
        {
          title: "CMS or in-repository content",
          body: "Content you need to change often is editable without a developer. Aivorraa starts with structured content in the repository and adds a headless CMS when a non-technical publisher genuinely needs one, rather than shipping an admin panel nobody logs into.",
        },
        {
          title: "SEO foundations built in",
          body: "Unique titles and descriptions per page, exactly one H1, canonical URLs, an auto-generated sitemap, Organization and Breadcrumb structured data, and descriptive alt text. These go in from the first commit — retrofitting them later is where most builds lose months.",
        },
        {
          title: "Forms and integrations",
          body: "Enquiry forms with server-side validation, spam protection and rate limiting, delivering to a verified inbox that is tested end to end before launch. Payment, CRM, calendar, maps and email integrations as scoped.",
        },
        {
          title: "Performance and accessibility pass",
          body: "Images converted to modern formats with explicit dimensions to prevent layout shift, JavaScript kept to what the page needs, semantic markup, visible keyboard focus, and reduced-motion behaviour for users who ask for it.",
        },
        {
          title: "Handover and documentation",
          body: "Source in version control with controlled access, a documented deployment process, secrets kept outside the repository, and a walkthrough of how to publish and edit. You should never be locked out of your own site.",
        },
      ],
      excluded: [
        "Domain registration, hosting and email subscription fees, which are billed by the provider in your name",
        "Paid stock photography, premium fonts and third-party plugin licences unless explicitly included in scope",
        "Copywriting and photography beyond the agreed scope",
        "Ongoing content updates after launch, unless covered by a support plan",
      ],
    },
    process: [
      {
        title: "Discover",
        body: "A working session on what the site has to achieve, who it is for, and what currently gets in the way. Aivorraa audits the existing site, its URLs and its search visibility before proposing anything.",
      },
      {
        title: "Define",
        body: "Sitemap, page-by-page content outline, technical approach and redirect map. This is the document scope is measured against, and it is signed off before design starts.",
      },
      {
        title: "Design",
        body: "Wireframes first, then responsive high-fidelity screens for the key templates. Consolidated feedback in one list per round, with a defined number of revisions.",
      },
      {
        title: "Build",
        body: "Templates, components, CMS structure, forms and integrations. You get a staging URL from the first week so progress is visible rather than described.",
      },
      {
        title: "Review and launch",
        body: "Functional, responsive, SEO, accessibility and performance checks against a written checklist. Then production setup, analytics, redirects and go-live — with a full backup taken before any change to a live site.",
      },
      {
        title: "Support",
        body: "A defect-fix window after launch, and an optional maintenance plan covering updates, backups, monitoring and content changes with a defined response time.",
      },
    ],
    pricing: {
      model: "Quote-led, scoped in writing",
      body: "Web development is quoted after a short discovery conversation, because the honest cost of a five-page marketing site and a role-based customer portal are not in the same range. What drives the number is page and template count, how much of the content and imagery already exists, the integrations required, and whether you need a CMS. You receive a written scope listing deliverables, revision limits, exclusions, third-party costs, payment milestones and taxes before anything is committed.",
      note: "Aivorraa does not publish a single headline price for web development, because a number without a scope attached is not a quote.",
    },
    faqs: [
      {
        q: "How long does a website take to build?",
        a: "For a marketing site of eight to twelve pages, plan on four to eight weeks from signed scope to launch. The build itself is rarely the long part — approvals, copy and imagery are. Projects that arrive with content ready and a single named approver consistently finish at the fast end of that range. Larger web applications are scoped separately after discovery.",
      },
      {
        q: "Will I be able to edit the site myself?",
        a: "Yes, for the content that actually changes. Aivorraa agrees up front which parts are editable — typically page copy, services, FAQs, articles, portfolio entries and SEO metadata — and builds the editing surface for those. Structural layout changes still go through a developer, which is deliberate: it is what keeps the site from drifting out of shape.",
      },
      {
        q: "Do you rebuild existing WordPress sites?",
        a: "Often, but not automatically. If the current site's real problem is search visibility or metadata, that can usually be fixed in place for a fraction of a rebuild's cost, and Aivorraa will tell you so. A rebuild is worth it when the stack itself has become the obstacle — when a small change breaks something unrelated, or performance cannot be recovered. Either way, every existing URL is preserved or redirected.",
      },
      {
        q: "What happens to my search rankings during a rebuild?",
        a: "They are protected by a redirect map written before development starts, not after launch. Every URL that resolves today must resolve at the same address afterwards or carry a 301 to its replacement. After go-live Aivorraa submits the new sitemap, requests indexing for key pages and watches Search Console daily for the first two weeks, because coverage errors immediately after a migration are normal and leaving them unfixed is not.",
      },
      {
        q: "Who owns the code and the accounts?",
        a: "Domain, hosting, analytics and Search Console are set up in your name and under your control, never a contractor's personal login. Code and design ownership transfers to you subject to the signed terms and completed payment. Third-party licences remain governed by their vendors.",
      },
    ],
    related: ["ui-ux-design", "app-development", "seo-ads"],
  },
  {
    slug: "ui-ux-design",
    nav: "UI/UX Design",
    name: "UI/UX Design",
    icon: "layers",
    accent: "violet",
    title: "UI/UX Design Services | Aivorraa",
    description:
      "Aivorraa designs interfaces people can use — research, wireframes, prototypes and design systems with developer-ready handoff. Start your project.",
    primaryKeyword: "ui ux design services",
    secondaryKeywords: [
      "ui ux design agency",
      "product design services",
      "website design company",
    ],
    h1: "UI/UX Design That Earns Its Place in the Build",
    lede: "Aivorraa designs interfaces around the decision a user is trying to make — researched, prototyped and handed to developers as a system rather than a set of pictures.",
    summary:
      "Research, journeys, wireframes, prototypes and design systems with developer-ready handoff.",
    who: {
      heading: "Who this is for",
      intro:
        "Design problems rarely announce themselves as design problems. They show up as numbers that will not move.",
      items: [
        "People arrive on your site or app and leave without doing the one thing you built it for.",
        "Your product works but feels harder to use than competitors, and support keeps answering the same question.",
        "Every new feature is designed from scratch, so the interface has drifted into six versions of the same button.",
        "You are about to commission a build and want the flow settled before development money is spent on it.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Scope is agreed per engagement. A full design engagement typically covers the following.",
      included: [
        {
          title: "Discovery and research",
          body: "Stakeholder interviews, a review of existing analytics and support themes, and a walkthrough of the current experience. Where budget and access allow, short user interviews — five well-chosen conversations surface most of what is broken.",
        },
        {
          title: "Personas and journey maps",
          body: "Who is actually using this, what they are trying to finish, and where the current path loses them. Kept to the segments that matter commercially rather than a full set nobody refers to again.",
        },
        {
          title: "Information architecture",
          body: "Navigation, page and screen inventory, content hierarchy and naming. This is where most usability problems are either solved or locked in, long before a visual decision is made.",
        },
        {
          title: "Wireframes",
          body: "Low-fidelity layouts for each key template, reviewed for structure and content order before colour and typography enter the conversation. Cheap to change at this stage, expensive later.",
        },
        {
          title: "High-fidelity screens and prototypes",
          body: "Responsive designs for desktop and mobile, plus a clickable prototype of the primary flows so the experience can be tested and approved by clicking through it rather than imagining it.",
        },
        {
          title: "Design system",
          body: "Colour, type scale, spacing, states, and a reusable component set with defined behaviour. This is what stops the interface fragmenting once your team starts adding screens without a designer in the room.",
        },
        {
          title: "Developer handoff",
          body: "Annotated specs, tokens, assets exported at the right sizes, and a walkthrough with whoever is building it. Accessibility notes included: contrast ratios, focus states, keyboard order and reduced-motion behaviour.",
        },
      ],
      excluded: [
        "Front-end implementation, which is quoted separately under web or app development",
        "Illustration, 3D and photography beyond the agreed asset list",
        "Moderated usability testing with recruited participants, unless scoped and budgeted",
        "Unlimited revision rounds — the number of rounds is stated in the scope",
      ],
    },
    process: [
      {
        title: "Discover",
        body: "Understand the business goal, the user, the constraints and what has already been tried. Review analytics, support tickets and the existing interface.",
      },
      {
        title: "Define",
        body: "Agree the flows in scope, the screens each requires, and what success looks like. Information architecture is settled here.",
      },
      {
        title: "Design",
        body: "Wireframes, then visual design, then prototype. Each stage is reviewed with one consolidated feedback list rather than scattered comments.",
      },
      {
        title: "Validate",
        body: "Walk the prototype through the real task with real stakeholders, and where possible actual users. Fix what the walkthrough exposes.",
      },
      {
        title: "Hand off",
        body: "Specs, tokens, components and assets delivered with a live session for the development team, plus availability for questions during the build.",
      },
    ],
    pricing: {
      model: "Fixed-scope project or design retainer",
      body: "Discrete design work — a marketing site, an onboarding flow, an app's core screens — is quoted as a fixed scope once the screen count and revision rounds are agreed. Teams shipping continuously are usually better served by a monthly design retainer with an agreed capacity, which avoids re-quoting every small change. Both are priced after a discovery call and confirmed in writing with revision limits and exclusions stated.",
    },
    faqs: [
      {
        q: "Can you design without building it?",
        a: "Yes. Design-only engagements are common, and the handoff pack is built to be implemented by your own team or another agency. You receive annotated specs, design tokens, an exported asset set and a walkthrough session, plus availability for implementation questions during the build.",
      },
      {
        q: "Do you work in Figma?",
        a: "Yes. Files are organised so they remain useful after the project closes — named layers, published components, documented tokens and a clear separation between work in progress and approved screens. You get edit access to your own files.",
      },
      {
        q: "How many revision rounds are included?",
        a: "The number is stated in your scope document before work begins, typically two consolidated rounds per stage. One round means one collected feedback list, not a stream of individual comments, which is what keeps a design phase from expanding without anyone deciding to expand it. Additional rounds can be added as a written change request with cost and timeline impact.",
      },
      {
        q: "Is accessibility included?",
        a: "The fundamentals, yes, as standard: colour contrast that meets WCAG AA, visible focus states, sensible keyboard order, labelled form fields, clear error messages and reduced-motion alternatives. A formal accessibility audit or a compliance certification against a specific standard is a separate scope, and Aivorraa will say so rather than imply coverage it has not provided.",
      },
      {
        q: "What if we already have a brand and design system?",
        a: "Then the work starts from it rather than around it. Aivorraa audits what exists, identifies gaps against the screens in scope, extends the system in its own language and hands back components that fit what your team already uses. Replacing a working system is rarely the right recommendation, and is not the default one here.",
      },
    ],
    related: ["web-development", "app-development", "branding-graphics"],
  },
  {
    slug: "app-development",
    nav: "App Development",
    name: "Mobile App Development",
    icon: "phone",
    accent: "cyan",
    title: "Mobile App Development Company | Aivorraa",
    description:
      "Aivorraa plans, designs and builds Android and iOS apps — cross-platform builds, API integration, testing and release support. Get a quote.",
    primaryKeyword: "app development company",
    secondaryKeywords: [
      "mobile app development services",
      "android app development",
      "cross platform app development",
    ],
    h1: "Mobile Apps Built to Reach the Store and Stay There",
    lede: "Aivorraa plans, designs and builds Android and iOS applications — with the release process, store requirements and post-launch support treated as part of the project rather than someone else's problem.",
    summary:
      "Android and iOS planning, cross-platform builds, app UI/UX, API integration, testing and release.",
    who: {
      heading: "Who this is for",
      intro:
        "An app is a significant commitment, and the right first question is usually whether you need one at all.",
      items: [
        "You have a validated service and customers are asking for something on their phone, not another browser tab.",
        "Your operations team needs an app for the field — job updates, photos, attendance, stock — that works on patchy connectivity.",
        "You have a web product with real usage and a mobile experience that is holding back retention.",
        "You need an MVP in front of users and investors, built so the second version does not mean starting over.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "App scope is confirmed in discovery. A typical engagement includes the following.",
      included: [
        {
          title: "Product definition",
          body: "Feature list split into the first release and what deliberately waits. Most app projects fail on scope rather than code, so this document is where the hard decisions get made and recorded.",
        },
        {
          title: "App UI/UX design",
          body: "Platform-appropriate navigation and screens, designed for thumbs and for real device sizes, with offline and error states designed rather than discovered during testing.",
        },
        {
          title: "Cross-platform or native build",
          body: "Cross-platform development covers one codebase for Android and iOS and suits most business applications. Where a feature genuinely needs native capability, Aivorraa says so and scopes it explicitly instead of promising parity it cannot deliver.",
        },
        {
          title: "API and backend integration",
          body: "Connection to your existing systems, or a purpose-built API where none exists. Authentication, role-based permissions, data synchronisation, push notifications and third-party services as scoped.",
        },
        {
          title: "Testing",
          body: "Functional testing across a defined device and OS matrix agreed in scope, plus performance checks on mid-range hardware rather than only the newest phone in the room.",
        },
        {
          title: "Release support",
          body: "Store listing assets, metadata, privacy declarations, build signing and submission, with the review-rejection cycle handled. Both stores reject first submissions routinely; it is planned for, not treated as a surprise.",
        },
        {
          title: "Post-launch window",
          body: "A defect-fix period after release, crash and error monitoring configured, and an optional maintenance plan for OS updates, store policy changes and new features.",
        },
      ],
      excluded: [
        "Apple Developer and Google Play developer account fees, registered in your name",
        "Ongoing server, database and push-notification service costs",
        "App store optimisation campaigns and paid user acquisition, quoted separately",
        "Guaranteed store approval — no developer can promise this, as the decision rests with Apple and Google",
      ],
    },
    process: [
      {
        title: "Discover",
        body: "What the app must do, for whom, and why a mobile app rather than a responsive web application. If the honest answer is that you do not need an app yet, you will hear it at this stage.",
      },
      {
        title: "Define",
        body: "Release-one feature set, technical approach, platform decision, integration list and device matrix, signed off before design.",
      },
      {
        title: "Design",
        body: "Flows, screens and a clickable prototype covering the primary journeys, reviewed on a phone rather than only on a desktop monitor.",
      },
      {
        title: "Build",
        body: "Development in reviewable increments with test builds distributed to your team, so feedback arrives while it is still cheap to act on.",
      },
      {
        title: "Test and release",
        body: "Device testing, fixes, store assets, submission and launch, followed by monitoring and the defect-fix window.",
      },
    ],
    pricing: {
      model: "Quote-led after discovery",
      body: "App development is quoted only after discovery, because feature count, integration complexity, whether a backend already exists and how many platforms you are launching on move the figure substantially. Aivorraa will often recommend a deliberately smaller first release — get something real in users' hands, then invest the remaining budget in what they actually ask for. Scope, milestones, payment schedule, revision limits and exclusions are confirmed in writing.",
      note: "No fixed price list is published for app development. Quotes follow discovery.",
    },
    faqs: [
      {
        q: "Should I build one app for both Android and iOS?",
        a: "For most business applications, yes — a single cross-platform codebase covers both, costs meaningfully less than two native builds and is simpler to keep updated. Native becomes the right call when you depend on advanced device capability, heavy graphics or platform features that cross-platform frameworks support poorly. Aivorraa makes that recommendation during discovery, with the trade-off stated plainly rather than buried.",
      },
      {
        q: "How long until the app is live?",
        a: "A focused first release typically takes eight to sixteen weeks from signed scope, plus store review time, which is outside anyone's control. The biggest variables are how many features you insist on in release one and how quickly feedback comes back on test builds.",
      },
      {
        q: "Do you handle the app store submission?",
        a: "Yes. Listing copy and assets, screenshots at required sizes, privacy and data-use declarations, build signing and submission are all handled, and Aivorraa manages the review cycle including responding to rejections. The developer accounts are registered in your name so you retain ownership of the listings.",
      },
      {
        q: "What happens when Android or iOS releases a new version?",
        a: "Apps need maintenance — this is not optional, and an unmaintained app eventually breaks or gets delisted. Both platforms periodically raise minimum SDK requirements and change policies. A maintenance plan covers OS compatibility updates, dependency upgrades, security patches and store policy compliance, with a defined response time.",
      },
      {
        q: "Can you take over an app someone else built?",
        a: "Sometimes, and it depends entirely on what you have. Aivorraa needs access to the source, the repository history, the build configuration and the store accounts. Given those, a paid technical assessment establishes what the code is actually like and what handover would cost. Without the source, the realistic options are a rebuild, and you should be sceptical of anyone who says otherwise.",
      },
    ],
    related: ["web-development", "ui-ux-design", "ai-automation"],
  },
  {
    slug: "ai-automation",
    nav: "AI Automation",
    name: "AI Automation",
    icon: "spark",
    accent: "lime",
    title: "AI Automation & Workflow Services | Aivorraa",
    description:
      "Aivorraa automates the repetitive work inside your business — workflows, chatbots, document handling and CRM integration. Book a consultation.",
    primaryKeyword: "ai automation services",
    secondaryKeywords: [
      "workflow automation services",
      "n8n automation agency",
      "ai chatbot development",
    ],
    h1: "AI Automation for the Work Nobody Should Be Doing by Hand",
    lede: "Aivorraa automates the repetitive middle of your business — the copying between systems, the chasing, the retyping — using workflow tooling and language models where each is genuinely the right instrument.",
    summary:
      "Workflow automation, chatbots, document handling and CRM integration using n8n, Make and LLM APIs.",
    who: {
      heading: "Who this is for",
      intro:
        "The best automation candidates are boring, frequent and rule-shaped. If a task is done fifty times a week and follows a describable pattern, it is worth costing out.",
      items: [
        "Someone on your team spends hours a week moving the same data between a form, a spreadsheet and a CRM.",
        "Enquiries arrive across WhatsApp, email, Instagram and a web form, and the slow ones go cold before anyone replies.",
        "Invoices, purchase orders or ID documents arrive as PDFs and photos that a human reads and retypes.",
        "Your team answers the same twenty customer questions daily, and the answers already exist in writing somewhere.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Every automation engagement starts by mapping the process as it actually runs, not as the process document claims. A typical build includes the following.",
      included: [
        {
          title: "Process audit and automation map",
          body: "The current workflow written out step by step with volumes and time per step, and each step marked automate, simplify or leave alone. Automating a broken process just makes it fail faster, so this stage often removes steps rather than automating them.",
        },
        {
          title: "Workflow automation build",
          body: "Implementation in n8n, Make or direct API integration depending on where your data lives and who will maintain it. Triggers, conditional logic, retries, and failure notifications that reach a human when something breaks.",
        },
        {
          title: "Lead capture and routing",
          body: "Enquiries from every channel collected into one place, deduplicated, enriched, assigned by rule and acknowledged automatically, with escalation when nobody responds inside your agreed window.",
        },
        {
          title: "AI-assisted document and content handling",
          body: "Language models applied where they genuinely fit — extracting fields from unstructured documents, classifying and summarising incoming messages, drafting first-pass replies for human review. Applied with confidence thresholds and a human checkpoint on anything that carries consequences.",
        },
        {
          title: "Chatbots and knowledge assistants",
          body: "Assistants grounded in your own documented content so answers are traceable to a source, with a defined scope, an explicit refusal behaviour for anything outside it, and a clean handover to a human. A bot that confidently invents an answer costs more trust than it saves time.",
        },
        {
          title: "Monitoring and documentation",
          body: "Dashboards or reports showing what ran, what failed and what was saved, plus written documentation of every workflow so the automation is not a black box that only its builder understands.",
        },
        {
          title: "Handover and training",
          body: "Your team is shown how each workflow works, how to spot a failure, and which parts they can safely change themselves. Credentials are stored in your own accounts.",
        },
      ],
      excluded: [
        "Subscription costs for n8n, Make, Zapier, CRM seats and LLM API usage, billed to your accounts",
        "Training a custom model on your data, which is a separate scope and rarely necessary",
        "Any automation that would require handling data you are not lawfully permitted to process",
        "Decisions with legal, financial or safety consequences left to run without human review",
      ],
    },
    process: [
      {
        title: "Audit",
        body: "Map the process as it actually runs, with volumes and time per step. Identify what is worth automating and what should simply be removed.",
      },
      {
        title: "Prioritise",
        body: "Rank candidates by hours saved against build effort and risk. Start with one workflow that pays for itself quickly, not with the most ambitious one.",
      },
      {
        title: "Build",
        body: "Implement the first workflow end to end, including the failure paths. Run it in parallel with the manual process until it is trusted.",
      },
      {
        title: "Verify",
        body: "Measure against the baseline captured in the audit. Tune thresholds, fix edge cases and confirm the human checkpoints are in the right places.",
      },
      {
        title: "Extend",
        body: "Add the next workflow, with each one documented and monitored. Automation compounds when it is built deliberately and becomes unmaintainable when it is not.",
      },
    ],
    pricing: {
      model: "Paid audit, then per-workflow build",
      body: "Automation starts with a paid process audit producing a prioritised map with estimated hours saved per workflow — a deliverable that is useful even if you build none of it. Individual workflows are then quoted per build, and ongoing monitoring and adjustment is available as a retainer. Aivorraa prices per workflow rather than as one large programme so you can stop after the first if the return is not there.",
      note: "Platform subscriptions and LLM API usage are billed to your own accounts and remain under your control.",
    },
    faqs: [
      {
        q: "Do we need AI, or just automation?",
        a: "Usually just automation, and the distinction matters to your budget. If a task follows clear rules — when this form arrives, create that record and notify this person — conventional workflow automation is cheaper, faster and far more reliable. Language models earn their place on unstructured input: reading a document, classifying a message, drafting a reply. Aivorraa uses each where it fits and will not attach a model to a problem that an if-statement solves.",
      },
      {
        q: "What can go wrong with an automation?",
        a: "Silent failure is the real risk: a workflow stops and nobody notices for a week. Every Aivorraa build includes failure notifications to a human, retries on transient errors, and logging you can inspect. Anything with financial, legal or customer-facing consequence keeps a human approval step by design.",
      },
      {
        q: "Will this replace people on my team?",
        a: "In practice it removes the least valuable part of their week. The realistic outcome is that the same team handles more volume with fewer errors and faster response times, and spends their attention on the judgement calls rather than the retyping. Aivorraa cannot promise a headcount reduction and will not frame the business case that way.",
      },
      {
        q: "Is my data safe with a language model?",
        a: "That depends on choices made deliberately at the design stage, and it is a question worth pressing any vendor on. Aivorraa establishes what data a workflow may send to a third-party API, uses providers whose terms exclude training on your inputs, redacts identifiers where the task does not require them, and can keep sensitive steps entirely inside conventional automation with no model involved.",
      },
      {
        q: "How do you measure whether it worked?",
        a: "Against a baseline captured during the audit — how long the task took, how often it was done, how frequently it went wrong. After go-live, the same measures are reported so the saving is demonstrable rather than asserted. If a workflow does not pay for itself, that shows up in the numbers and the honest recommendation is to retire it.",
      },
    ],
    related: ["web-development", "app-development", "digital-marketing"],
  },
];
