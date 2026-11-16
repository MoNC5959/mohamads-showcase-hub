import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/AffordableGamingArticle";

const title = "The Slow Death of Affordable Gaming | Mohamad Noor-Chowdhury";
const description =
  "Gaming spent fifty years going from an expensive niche hobby to one of the cheapest forms of entertainment around. The AI boom is starting to push it back the other way.";

export const Route = createFileRoute("/affordable-gaming")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#09251C" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap",
      },
    ],
  }),
  component: Page,
});
