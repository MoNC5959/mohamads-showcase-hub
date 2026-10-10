import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mohamad Noor Chowdhury" },
      { name: "description", content: "About Mohamad Noor Chowdhury." },
      { property: "og:title", content: "About — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "About Mohamad Noor Chowdhury." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
