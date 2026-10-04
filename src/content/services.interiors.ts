import type { Service } from "./types";

/**
 * Interior Design — added at the owner's direction (October 2026), confirming
 * the service is operational. The hero copy is the owner's own, from the
 * earlier site ("Design And Construction, Shaped As One Craft").
 *
 * Deliberately free of figures, prices, timelines and project counts: none
 * is documented yet. Add them only with a source you would show a client,
 * and add a case study only with written permission (PRD §17).
 */
export const INTERIOR_SERVICES: Service[] = [
  {
    slug: "interior-design",
    nav: "Interior Design",
    name: "Interior Design & Build",
    icon: "home",
    accent: "amber",
    title: "Interior Design & Build Studio | Aivorraa",
    description:
      "Aivorraa designs and delivers interiors as one accountable studio — concept, planning, materials and execution coordinated from first sketch to handover.",
    primaryKeyword: "interior design services",
    secondaryKeywords: [
      "interior design and build",
      "office interior design",
      "home interior design",
    ],
    h1: "Design and Construction, Shaped as One Craft",
    lede: "One accountable studio from first sketch to final handover — so your space is designed beautifully, engineered intelligently and built without the friction of coordinating separate teams.",
    summary:
      "Concept, space planning, materials, 3D visuals and execution coordination for homes, offices and retail spaces.",
    who: {
      heading: "Who this is for",
      intro:
        "Most interior projects go wrong in the gaps between the designer, the contractor and the client, not in any one of them.",
      items: [
        "You are fitting out a new home, office or store and want one team answerable for the result.",
        "You have tried managing a designer and separate contractors and spent more time relaying messages than deciding.",
        "You want to see the space before it is built, not discover the problems after.",
        "Your space needs to work with your brand — a store, a studio or an office clients visit.",
      ],
    },
    deliverables: {
      heading: "What you get",
      intro:
        "Every interior engagement is scoped in writing after a site visit. A typical design-and-build scope includes the following.",
      included: [
        {
          title: "Brief and site study",
          body: "How the space will actually be used, by whom and when, together with measurements and a record of the existing conditions — services, light, ventilation and anything that has to stay. Agreed in writing before any design begins, because a brief nobody signed off is the most common reason a finished space disappoints.",
        },
        {
          title: "Concept and space planning",
          body: "Layout options that work through circulation, storage, light and use, presented with a design direction for the look and feel of the space.",
        },
        {
          title: "3D visualisation",
          body: "Views of the proposed space, so decisions about layout, materials and colour are made on what you can see rather than on a plan you have to imagine. Revisions happen here, on screen, where they cost an afternoon rather than a rebuild.",
        },
        {
          title: "Materials and finishes",
          body: "A specified palette of materials, finishes, lighting and fixtures, chosen for how they wear as well as how they look, with samples where it matters. Each choice is recorded with its maintenance needs, so the space you approve on day one still looks right after a year of daily use, cleaning and wear.",
        },
        {
          title: "Working drawings",
          body: "The drawings and specifications the build is carried out against, so what is executed matches what was approved.",
        },
        {
          title: "Execution coordination",
          body: "One point of contact through the build: scheduling, site coordination and quality checks against the approved drawings, with progress reported rather than chased. Where something on site does not match the drawings, it is raised with you before it is resolved, not explained afterwards.",
        },
        {
          title: "Handover",
          body: "A walkthrough of the finished space, a snag list closed out, and the care details for the materials and fittings that were used.",
        },
      ],
      excluded: [
        "Structural alterations and statutory approvals, which require the relevant licensed professional",
        "Furniture, fixtures and materials themselves, which are purchased at cost or quoted separately",
        "Building society or landlord permissions, which remain the owner's responsibility",
        "Changes to the approved design after work begins, which are scoped and quoted as variations",
      ],
    },
    process: [
      {
        title: "Brief",
        body: "A site visit and a conversation about how the space needs to work, followed by a written brief.",
      },
      {
        title: "Concept",
        body: "Layout options and a design direction, refined into one agreed plan.",
      },
      {
        title: "Design",
        body: "3D views, materials and finishes, and the working drawings the build follows.",
      },
      {
        title: "Quote",
        body: "A written scope and quote for execution, with exclusions and payment milestones stated before anything is committed.",
      },
      {
        title: "Build",
        body: "Execution coordinated by one team, with quality checks against the approved drawings.",
      },
      {
        title: "Handover",
        body: "Walkthrough, snag list closed out, and the space handed over ready to use.",
      },
    ],
    pricing: {
      model: "Quoted after a site visit",
      body: "Interior work is quoted after a site visit and an agreed brief, because the honest cost depends on the size of the space, its existing condition, the scope of work and the materials chosen. You receive a written scope with deliverables, exclusions and payment milestones before anything is committed.",
      note: "Aivorraa does not publish a per-square-foot rate, because a number without a scope and a site attached is not a quote.",
    },
    faqs: [
      {
        q: "Do you handle both design and execution?",
        a: "Yes. The point of the service is one accountable team from first sketch to handover, so you are not left coordinating a designer and separate contractors yourself.",
      },
      {
        q: "Can I see the space before it is built?",
        a: "Yes. Layouts are presented as plans and then as 3D views with the proposed materials, so decisions are made on what you can see.",
      },
      {
        q: "Do you take on design-only projects?",
        a: "Where it makes sense, yes. The scope is agreed in writing after the brief, and a design-only engagement ends with the drawings and specifications your own contractor builds from.",
      },
      {
        q: "Which kinds of spaces do you work on?",
        a: "Homes, offices, studios and retail spaces. Each starts with the same site visit and written brief, because a reception area that has to impress visitors and a family kitchen that has to survive daily use are different problems, even when they share a palette.",
      },
      {
        q: "What happens if I want to change something mid-build?",
        a: "Changes after the design is approved are scoped and quoted as variations before they are carried out, so the cost and the timeline effect are clear before you decide.",
      },
    ],
    related: ["branding-graphics", "video-motion", "digital-marketing"],
  },
];
