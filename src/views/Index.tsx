import BackToTop from "../components/BackToTop";
import NavBar from "../components/NavBar";
import SunnahScene, { type NapBoxItem } from "../components/SunnahScene";

const ITEMS: [NapBoxItem, NapBoxItem, NapBoxItem] = [
  { label: "About", title: "About", route: "/about" },
  { label: "Portfolio", title: "Portfolio", route: "/portfolio" },
  { label: "Contact", title: "Contact", route: "/contact" },
];

export default function Index() {
  return (
    <div className="sheet" style={{ overflowX: "clip" }}>
      <NavBar showLinks={false} />

      <div className="sheet-main" style={{ paddingTop: 8 }}>
        <header style={{ marginBottom: 24 }}>
          <h1 className="sheet-hero">
            <span className="sheet-hero-line">Pick a box.</span>{" "}
            <span className="sheet-hero-line sheet-hero-line--nap">
              <span>Sunnah will</span> <span>nap in it.</span>
            </span>
          </h1>
          <p className="sheet-body" style={{ maxWidth: "80ch" }}>
            Welcome to my portfolio! Hover over a box and my cat, Sunnah, will wander over. Click one, and she'll climb in for a nap before taking you to that page. Enjoy!
          </p>
        </header>

        <SunnahScene items={ITEMS} />
      </div>
      <BackToTop />
    </div>
  );
}
