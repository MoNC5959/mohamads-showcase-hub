import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/ColosseumArticle";

export const Route = createFileRoute("/colosseum")({
  head: () => ({
    meta: [
      { title: "The Colosseum — Mohamad Noor Chowdhury" },
      { name: "description", content: "An article on the Colosseum." },
      { property: "og:title", content: "The Colosseum — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "An article on the Colosseum." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
