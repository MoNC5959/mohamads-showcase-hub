import { Link, useLocation } from '@/lib/router-compat';

const LINKS = [
  { label: "About", to: "/about" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact", to: "/contact" },
];

interface NavBarProps {
  showLinks?: boolean;
}

export default function NavBar({ showLinks = true }: NavBarProps) {
  const location = useLocation();

  return (
    <nav
      className="nav"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "16px clamp(20px, 5vw, 72px)", gap: "clamp(14px, 3vw, 28px)" }}
    >
      <Link to="/" className="nav-brand" style={{ fontSize: 20, letterSpacing: "0.02em", textTransform: "uppercase" }}>
        Mohamad Noor Chowdhury
      </Link>
      {LINKS.map((link) => (
        <Link key={link.to} to={link.to} className={location.pathname === link.to ? "active" : ""}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
