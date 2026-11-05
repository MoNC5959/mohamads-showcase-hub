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
    <header className="site-header">
      <nav className="nav">
        <Link to="/" className="nav-brand">
          Mohamad Noor-Chowdhury
        </Link>
        {showLinks &&
          LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={location.pathname === link.to ? "active" : ""}>
              {link.label}
            </Link>
          ))}
      </nav>
    </header>
  );
}
