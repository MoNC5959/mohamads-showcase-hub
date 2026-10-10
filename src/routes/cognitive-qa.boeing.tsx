import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/CognitiveQABoeing";

export const Route = createFileRoute("/cognitive-qa/boeing")({
  head: () => ({
    meta: [
      { title: "Cognitive QA: Boeing — Mohamad Noor Chowdhury" },
      { name: "description", content: "Boeing inspection demo." },
      { property: "og:title", content: "Cognitive QA: Boeing — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Boeing inspection demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
