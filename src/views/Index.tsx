import NavBar from "../components/NavBar";
import SunnahScene, { type NapBoxItem } from "../components/SunnahScene";

const ITEMS: [NapBoxItem, NapBoxItem, NapBoxItem] = [
  { label: "About", title: "About", route: "/about" },
  { label: "Portfolio", title: "Portfolio", route: "/portfolio" },
  { label: "Contact", title: "Contact", route: "/contact" },
];

export default function Index() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}>
      <NavBar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 5vw, 72px) 72px" }}>
        <header style={{ padding: "36px 0 40px", display: "flex", flexDirection: "column", gap: 18 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "clamp(42px, 6.4vw, 84px)",
              lineHeight: 1.02,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "block" }}>Pick a box.</span>
            <span style={{ display: "block", color: "var(--color-accent-300)" }}>Sunnah will nap in it.</span>
          </h1>
          <p style={{ margin: 0, maxWidth: "54ch", fontSize: 17, lineHeight: 1.5, color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}>
            Hover over a box and Sunnah will wander over. Click one, and she'll climb in for a nap before taking you to that page.
          </p>
        </header>

        <SunnahScene items={ITEMS} />
      </div>
    </div>
  );
}
