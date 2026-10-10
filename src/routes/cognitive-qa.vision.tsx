import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/CognitiveQAVision";

export const Route = createFileRoute("/cognitive-qa/vision")({
  head: () => ({
    meta: [
      { title: "Cognitive QA Vision — Mohamad Noor Chowdhury" },
      { name: "description", content: "The vision behind Cognitive QA." },
      { property: "og:title", content: "Cognitive QA Vision — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "The vision behind Cognitive QA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
