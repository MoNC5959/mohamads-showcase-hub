import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mohamad Noor Chowdhury" },
      { name: "description", content: "Get in touch with Mohamad." },
      { property: "og:title", content: "Contact — Mohamad Noor Chowdhury" },
      { property: "og:description", content: "Get in touch with Mohamad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
