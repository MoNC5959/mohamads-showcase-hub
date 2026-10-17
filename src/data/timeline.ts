export type TimelineType = "ahead" | "work" | "edu" | "cert";

export interface TimelineItem {
  type: TimelineType;
  typeLabel: string;
  kicker: string;
  title: string;
  org: string;
  place: string;
  summary: string;
  detail: string;
  points: string[];
  tags: string[];
}

// Newest first.
export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    type: "ahead",
    typeLabel: "What's ahead",
    kicker: "Next",
    title: "Product Owner / Product Manager",
    org: "Open to new roles",
    place: "Philadelphia, PA or remote",
    summary: "Owning an end-to-end client experience on a platform at scale.",
    detail:
      "I'm looking for a product role where I own the full client journey on a platform serving many users: finding friction, shaping the roadmap and delivering the improvements, with risk and compliance built into the strategy from the start.",
    points: [
      "End-to-end experience ownership on a high-volume platform",
      "Roadmaps and success measures grounded in client and operational signal",
      "Regulated or infrastructure-heavy domains such as payments, financial services and healthcare",
    ],
    tags: ["Product Ownership", "Roadmapping", "SAFe POPM"],
  },
  {
    type: "work",
    typeLabel: "Work",
    kicker: "Jun 2026 — Present",
    title: "Product Analyst & Product Owner",
    org: "Independence Blue Cross (Contract)",
    place: "Philadelphia, PA",
    summary: "Own the client experience for Provider Finder, used by 2 million members.",
    detail:
      "Own the end-to-end client experience for Provider Finder, the platform 2 million members use to find care, accountable for the full journey rather than individual features.",
    points: [
      "Identify friction and pain points by analyzing about 20 client servicing requests a month from trigger through resolution, distinguishing one-off issues from systemic breakdowns and turning recurring problems into prioritized roadmap work.",
      "Define current-state workflows and the future-state vision for Admin Console, the internal platform colleagues use to manage provider and benefit plan data, documenting operational dependencies across 3 connected systems.",
      "Establish the annual roadmap, priorities, and success measures, then present the strategy to directors and senior leadership for approval.",
      "Build risk and compliance considerations into strategy from the start, owning monthly federal price transparency reporting on time for 4 consecutive months and ensuring benefit plan changes meet regulatory requirements before they reach members.",
      "Partner across operations, technology, compliance, and external vendor teams to translate strategy into execution while staying accountable for the overall experience.",
      "Writing the strategy document defining Admin Console’s multi-year roadmap, gathering input across product and engineering teams.",
      "Built a tracker giving leadership ongoing visibility into delivered work and issue volume across both platforms.",
    ],
    tags: ["Healthcare", "Compliance", "Roadmapping"],
  },
  {
    type: "work",
    typeLabel: "Work",
    kicker: "Oct 2024 — Jan 2026",
    title: "Business Analyst Lead",
    org: "H&H Group",
    place: "Orlando, FL / Remote",
    summary: "Mapped journeys across six departments and got three initiatives approved by the CIO.",
    detail:
      "Led business analysis across six departments, mapping where client and colleague experiences broke down and turning that into approved initiatives, a feedback program and a leaner technology stack.",
    points: [
      "Documented current-state and future-state journeys across six departments through 10+ stakeholder sessions, identifying where client and colleague experiences broke down and building the business cases that got three initiatives approved by the CIO.",
      "Established a client feedback and measurement program using AskNicely integrated with HubSpot data, defining the success measures that raised response volume 45% and satisfaction scores 15%, then using results to prioritize improvements.",
      "Simplified a multi-step launch process after a build vs. buy business case, reducing friction across a 15-person team spanning sales, finance, engineering, marketing, and IT; improved performance by 50% and cut manual effort by 25%.",
      "Redesigned the inventory transfer journey with a 10-person operations team, documenting the future-state workflow before automating it to improve processing speed 30%.",
      "Introduced a governance and risk review process that consolidated the technology stack and cut $75K a year in redundant spend.",
      "Evaluated third-party platforms and selected Salsify as the central product data solution, designing the API integrations connecting NetSuite ERP and multiple external systems.",
    ],
    tags: ["HubSpot", "Salsify", "NetSuite", "APIs"],
  },
  {
    type: "work",
    typeLabel: "Work",
    kicker: "Sept 2022 — Oct 2024",
    title: "Technology Consultant",
    org: "Ernst & Young",
    place: "Philadelphia, PA",
    summary: "Product owner and associate PM on client product teams of 20–25.",
    detail:
      "Consulted across media, financial services and utilities clients, owning backlogs and MVP strategy for product teams and building executive reporting.",
    points: [
      "Product Owner for a media and entertainment client’s consumer mobile app modernization, shaping MVP strategy and prioritizing the backlog for a 25-person product and engineering team focused on customer experience.",
      "Associate Product Manager for a financial services client’s global document platform, running agile ceremonies and backlog management for a 20-person engineering and product team across multiple regions.",
      "Built Power BI dashboards for a utilities client that gave executives a real-time view of customer complaint volume and trends, replacing manual tracking across disconnected systems.",
      "Reconciled $100K in client financials in Excel into a structured dataset used for downstream reporting.",
    ],
    tags: ["Agile", "Power BI", "Jira"],
  },
  {
    type: "work",
    typeLabel: "Work",
    kicker: "Jan 2022 — Aug 2022",
    title: "Strategy & Intelligence Analyst",
    org: "Kinesso (IPG) (Contract)",
    place: "New York, NY / Remote",
    summary: "Research and intelligence briefings for advertising teams.",
    detail:
      "Researched shifts in the advertising technology landscape and turned them into analysis and briefings for advertising teams and directors.",
    points: [
      "Researched first-party data strategies as alternatives to third-party cookies, producing analysis advertising teams used to adapt audience targeting.",
      "Led a brand safety initiative assessing misinformation risk across client advertising content and coordinating mitigation across stakeholders.",
      "Produced weekly AdTech intelligence briefings for director-level stakeholders, distilling complex market developments into concise summaries.",
    ],
    tags: ["AdTech", "Research"],
  },
  {
    type: "edu",
    typeLabel: "Education",
    kicker: "Graduated 2021",
    title: "MSc in Digital Innovation in Marketing",
    org: "Temple University",
    place: "Philadelphia, PA",
    summary: "A combination of MIS and Digital Marketing.",
    detail: "MSc in Digital Innovation in Marketing at Temple University.",
    points: ["Combination of MIS and Digital Marketing"],
    tags: ["MIS", "Digital Marketing"],
  },
  {
    type: "edu",
    typeLabel: "Education",
    kicker: "Graduated 2019",
    title: "BBA in Management Information Systems",
    org: "Temple University",
    place: "Philadelphia, PA",
    summary: "Undergraduate foundation in information systems and business.",
    detail: "BBA in Management Information Systems at Temple University.",
    points: [],
    tags: ["MIS"],
  },
];
