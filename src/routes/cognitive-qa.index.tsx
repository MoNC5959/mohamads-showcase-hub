import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/CognitiveQAHome";

export const Route = createFileRoute("/cognitive-qa")({
  head: () => ({
    meta: [
      { title: "Cognitive QA — Mohamad Noor Chowdhury" },
      { name: "description", content: "Cognitive QA for aviation maintenance." },
      { property: "og:title", content: "Cognitive QA — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Cognitive QA for aviation maintenance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
