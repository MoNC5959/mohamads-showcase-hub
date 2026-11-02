import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "Cognitive QA",
    category: "strategy",
    projectType: "product-demo",
    year: "2026",
    slug: "cognitive-qa",
    externalUrl: "/cognitive-qa",
    description:
      "An AR inspection concept for aircraft. HoloLens 2 checks every part against its digital blueprint as the work happens, from the assembly line to the maintenance hangar.",
    images: [],
  },
  {
    id: "2",
    title: "The Future of FinTech",
    category: "FinTech",
    projectType: "case-study",
    year: "2026",
    slug: "fintech",
    externalUrl: "/project/fintech",
    description:
      "You don't need to be a banker or a tech wizard to understand what's happening to the world's financial system. Here's a plain-English breakdown of the biggest shifts underway and why they'll likely affect your wallet, your bank, and your job.",
    client: "Editorial Series",
    images: [],
  },
  {
    id: "3",
    title: "The Tokenization of Assets",
    category: "Tokenization",
    projectType: "case-study",
    year: "2026",
    slug: "tokenization",
    externalUrl: "/tokenization",
    description:
      "How tokenization turns analog assets into programmable ones, and what that changes about ownership, settlement, and access.",
    client: "Editorial Series",
    images: [],
  },
  {
    id: "4",
    title: "Colosseum to Cloud",
    category: "Sports Media",
    projectType: "case-study",
    year: "2026",
    slug: "colosseum",
    externalUrl: "/colosseum",
    description:
      "How leagues and streaming giants built a lucrative partnership, and left the fan holding the bill.",
    images: [],
  },
  {
    id: "5",
    title: "Money in Motion",
    category: "Payments",
    projectType: "case-study",
    year: "2026",
    slug: "few-seconds",
    externalUrl: "/few-seconds",
    description:
      "What happens in the seconds after you tap a card: the banks, networks, and fees behind every purchase, and why Capital One bought Discover.",
    images: [],
  },
];

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
