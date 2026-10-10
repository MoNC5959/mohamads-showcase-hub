import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Mohamad Noor Chowdhury" },
      { name: "description", content: "Pick a box. Sunnah will nap in it." },
      { property: "og:title", content: "Portfolio — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Pick a box. Sunnah will nap in it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
