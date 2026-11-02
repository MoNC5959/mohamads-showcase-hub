import { Link, useLocation } from '@/lib/router-compat';

const SECTIONS = [
  { label: "Vision", to: "/cognitive-qa/vision" },
  { label: "Strategy", to: "/cognitive-qa/strategy" },
  { label: "Demo", to: "/cognitive-qa/demo" },
];

/**
 * The frozen bar shared by the Cognitive QA Vision, Strategy, and Demo pages.
 */
export default function CognitiveQANav() {
  const { pathname } = useLocation();

  return (
    <header className="cqa-nav">
      <Link to="/cognitive-qa" className="cqa-nav-back">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M7 1L3 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>
      <Link to="/cognitive-qa" className="cqa-nav-brand">
        <span className="cqa-nav-dot" aria-hidden="true" />
        Cognitive QA
      </Link>
      <nav className="cqa-nav-sections" aria-label="Cognitive QA sections">
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} aria-current={pathname.startsWith(section.to) ? "page" : undefined}>
            {section.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
