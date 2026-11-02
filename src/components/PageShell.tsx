import { useNavigate } from '@/lib/router-compat';
import type { ReactNode } from "react";
import BackToTop from "./BackToTop";
import NavBar from "./NavBar";

interface PageShellProps {
  /** Sheet reference, e.g. "Box 02 / Sheet 03 of 04", printed in the title block. */
  sheetRef: string;
  title: string;
  /** Prints the sheet in reverse: accent ground, dark ink. */
  accent?: boolean;
  children?: ReactNode;
}

/**
 * Shared "drafting sheet" layout for every page that isn't the home scene.
 */
export default function PageShell({ sheetRef, title, accent = false, children }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div className={accent ? "sheet sheet--accent" : "sheet"}>
      <NavBar />
      <main className="sheet-main">
        <h1 className="sheet-title">{title}</h1>

        {children ?? (
          <p className="sheet-body">Sunnah is still asleep in the box. This sheet is ready for your content.</p>
        )}

        <footer className="sheet-foot">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to the boxes
          </button>

          <div className="blueprint title-block sheet-label">
            <i className="corner tl" />
            <i className="corner tr" />
            <i className="corner bl" />
            <i className="corner br" />
            {sheetRef.split(" / ").map((part) => (
              <span key={part}>{part}</span>
            ))}
          </div>
        </footer>
      </main>
      <BackToTop />
    </div>
  );
}
