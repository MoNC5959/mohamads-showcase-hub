import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/CognitiveQAMRO";

export const Route = createFileRoute("/cognitive-qa/mro")({
  head: () => ({
    meta: [
      { title: "Cognitive QA: MRO — Mohamad Noor Chowdhury" },
      { name: "description", content: "MRO hangar demo." },
      { property: "og:title", content: "Cognitive QA: MRO — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "MRO hangar demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
