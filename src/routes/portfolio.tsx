import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/Portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Work — Mohamad Noor Chowdhury" },
      { name: "description", content: "Selected projects and articles." },
      { property: "og:title", content: "Work — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Selected projects and articles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
