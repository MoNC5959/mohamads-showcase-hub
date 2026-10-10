import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/CognitiveQAStrategy";

export const Route = createFileRoute("/cognitive-qa/strategy")({
  head: () => ({
    meta: [
      { title: "Cognitive QA Strategy — Mohamad Noor Chowdhury" },
      { name: "description", content: "Cognitive QA go-to-market strategy." },
      { property: "og:title", content: "Cognitive QA Strategy — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Cognitive QA go-to-market strategy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
