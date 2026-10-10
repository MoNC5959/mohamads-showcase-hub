import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/CognitiveQADemo";

export const Route = createFileRoute("/cognitive-qa/demo")({
  head: () => ({
    meta: [
      { title: "Cognitive QA Demo — Mohamad Noor Chowdhury" },
      { name: "description", content: "Interactive Cognitive QA demos." },
      { property: "og:title", content: "Cognitive QA Demo — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Interactive Cognitive QA demos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
