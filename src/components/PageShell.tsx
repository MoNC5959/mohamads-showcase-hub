import { useNavigate } from '@/lib/router-compat';
import type { ReactNode } from "react";
import NavBar from "./NavBar";

interface PageShellProps {
  kicker: string;
  title: string;
  children?: ReactNode;
}

/**
 * Shared "drafting sheet" layout for every page that isn't the home scene.
 */
export default function PageShell({ kicker, title, children }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}>
      <NavBar />
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "56px clamp(20px, 5vw, 72px) 96px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: "var(--color-accent-300)" }}>
          {kicker}
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "clamp(56px, 9vw, 120px)",
            lineHeight: 1,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>

        {children ?? (
          <p style={{ margin: 0, maxWidth: "54ch", fontSize: 17, lineHeight: 1.5, color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}>
            Sunnah is still asleep in the box. This sheet is ready for your content.
          </p>
        )}

        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate("/")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12 }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to the boxes
        </button>
      </main>
    </div>
  );
}
