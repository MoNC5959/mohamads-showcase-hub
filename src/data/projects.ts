import type { Project } from "@/types";
import cognitiveQaImage from "@/assets/cognitive-qa-infographic.png";
import finTechImage from "@/assets/FinTech.jpg";
import tokenizationImage from "@/assets/tokenization-cover.png";
import colosseumImage from "@/assets/colosseum-cover.png";
import fewSecondsImage from "@/assets/few-seconds-cover.png";

export const projects: Project[] = [
  {
    id: "1",
    title: "Cognitive QA",
    category: "strategy",
    projectType: "product-demo",
    year: "2026",
    slug: "cognitive-qa",
    externalUrl: "/cognitive-qa",
    coverImage: cognitiveQaImage,
    description:
      "An AI-powered quality assurance platform designed to streamline testing workflows and improve software reliability.",
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
    coverImage: finTechImage,
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
    coverImage: tokenizationImage,
    description:
      "How tokenization is turning analog assets into programmable value — rewriting the rules of ownership, settlement, and access for every asset class on earth.",
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
    coverImage: colosseumImage,
    description:
      "From the Colosseum to the Cloud — tracing the evolution of infrastructure, governance, and digital transformation in sports media rights.",
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
    coverImage: fewSecondsImage,
    description:
      "A short exploration of how the smallest units of time shape attention, decisions, and product experience in modern payments.",
    images: [],
  },
];

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
