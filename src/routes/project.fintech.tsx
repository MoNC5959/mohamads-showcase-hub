import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/FintechArticle";

export const Route = createFileRoute("/project/fintech")({
  head: () => ({
    meta: [
      { title: "FinTech — Mohamad Noor Chowdhury" },
      { name: "description", content: "A FinTech case study." },
      { property: "og:title", content: "FinTech — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "A FinTech case study." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
