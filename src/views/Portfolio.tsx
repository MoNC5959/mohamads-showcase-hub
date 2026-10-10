import type { CSSProperties } from "react";
import { Link } from '@/lib/router-compat';
import PageShell from "../components/PageShell";
import { projects } from "../data/projects";

function isInternalRoute(url: string) {
  return url.startsWith("/");
}

export default function Portfolio() {
  return (
    <PageShell kicker="Box 02 / Sheet 03 of 04" title="Portfolio">
      <p
        style={{
          margin: 0,
          maxWidth: "62ch",
          fontSize: 17,
          lineHeight: 1.6,
          color: "color-mix(in srgb, var(--color-text) 80%, transparent)",
        }}
      >
        A collection of work spanning case studies, demo products, and market explorations. These projects reflect
        the problems I find most pressing and the trends I think are worth paying attention to.
      </p>

      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
          marginTop: 8,
        }}
      >
        {projects.map((project) => {
          const href = project.externalUrl ?? `/project/${project.slug}`;
          const CardInner = (
            <>
              <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}>
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-divider)",
                  }}
                >
                  {project.projectType === "product-demo" ? "Demo" : "Case Study"}
                </span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: 18,
                    textTransform: "uppercase",
                  }}
                >
                  {project.title}
                </p>
                <p
                  style={{
                    margin: "4px 0 10px",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-accent-300)",
                  }}
                >
                  {project.category} · {project.year}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
                  }}
                >
                  {project.description}
                </p>
              </div>
            </>
          );

          const cardStyle: CSSProperties = {
            display: "block",
            textDecoration: "none",
            color: "inherit",
            transition: "transform 180ms ease",
          };

          return (
            <div key={project.id} className="blueprint" style={{ position: "relative" }}>
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              {isInternalRoute(href) ? (
                <Link to={href} style={cardStyle}>
                  {CardInner}
                </Link>
              ) : (
                <a href={href} style={cardStyle} target="_blank" rel="noreferrer">
                  {CardInner}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
