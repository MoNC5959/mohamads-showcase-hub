import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/ColosseumArticle";

const DESCRIPTION =
  "How leagues and streaming giants built a lucrative partnership, and left the fan holding the bill.";

export const Route = createFileRoute("/colosseum")({
  head: () => ({
    meta: [
      { title: "From the Colosseum to the Cloud | Mohamad Noor-Chowdhury" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "From the Colosseum to the Cloud | Mohamad Noor-Chowdhury" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Libre+Franklin:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap",
      },
    ],
  }),
  component: Page,
});
