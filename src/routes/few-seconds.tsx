import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/FewSecondsArticle";

export const Route = createFileRoute("/few-seconds")({
  head: () => ({
    meta: [
      { title: "A Few Seconds — Mohamad Noor Chowdhury" },
      { name: "description", content: "An article about a few seconds." },
      { property: "og:title", content: "A Few Seconds — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "An article about a few seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
