import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/TokenizationArticle";

export const Route = createFileRoute("/tokenization")({
  head: () => ({
    meta: [
      { title: "Tokenization — Mohamad Noor Chowdhury" },
      { name: "description", content: "An illustrated article on tokenization." },
      { property: "og:title", content: "Tokenization — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "An illustrated article on tokenization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
