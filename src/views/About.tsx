import PageShell from "../components/PageShell";
import Carousel from "../components/Carousel";
import CareerTimeline from "../components/CareerTimeline";
import FadeContent from "../components/FadeContent/FadeContent";
import { photographerInfo as person } from "../data/photographer";

import profilePortrait from "../assets/profile-portrait.webp";

import biscoffCookies from "../assets/gallery/biscoff-cookies.webp";
import blackWhiteCookies from "../assets/gallery/black-white-cookies.webp";
import brownies from "../assets/gallery/brownies.webp";
import cake from "../assets/gallery/cake.webp";
import mangoCheesecake from "../assets/gallery/mango-cheesecake.webp";
import miniCheesecakes from "../assets/gallery/mini-cheesecakes.webp";
import muffins from "../assets/gallery/muffins.webp";
import peachCheesecake from "../assets/gallery/peach-cheesecake.webp";
import strawberryCheesecake from "../assets/gallery/strawberry-cheesecake.webp";
import tiramisu from "../assets/gallery/tiramisu.webp";

import modu1 from "../assets/gallery/modu-1.webp";
import modu2 from "../assets/gallery/modu-2.webp";
import sunnah1 from "../assets/gallery/sunnah-1.webp";
import sunnah2 from "../assets/gallery/sunnah-2.webp";

const DESSERTS = [
  { src: biscoffCookies, alt: "Biscoff cookies" },
  { src: blackWhiteCookies, alt: "Black & white cookies" },
  { src: brownies, alt: "Brownies" },
  { src: cake, alt: "Bundt cake" },
  { src: mangoCheesecake, alt: "Mango cheesecake" },
  { src: miniCheesecakes, alt: "Mini cheesecakes" },
  { src: muffins, alt: "Muffins" },
  { src: peachCheesecake, alt: "Peach cheesecake" },
  { src: strawberryCheesecake, alt: "Strawberry cheesecake" },
  { src: tiramisu, alt: "Tiramisu" },
];

const CATS = [
  { src: sunnah1, alt: "Sunnah the cat", caption: "Sunnah" },
  { src: sunnah2, alt: "Sunnah the cat", caption: "Sunnah" },
  { src: modu1, alt: "Modu the cat", caption: "Modu" },
  { src: modu2, alt: "Modu the cat", caption: "Modu" },
];

const FADE = {
  effect: "mist",
  duration: 1.8,
  ease: "power2.out",
  stagger: 0.1,
  threshold: 0.1,
} as const;

export default function About() {
  return (
    <PageShell sheetRef="Box 01 / Sheet 02 of 04" title="About">
      <FadeContent {...FADE} className="about-intro">
        <div className="blueprint">
          <i className="corner tl" />
          <i className="corner tr" />
          <i className="corner bl" />
          <i className="corner br" />
          <img src={profilePortrait} alt={person.name} width={1440} height={1920} decoding="async" className="about-portrait" />
        </div>
        <div>
          <p className="about-name">{person.name}</p>
          <p className="about-role">{person.tagline}</p>
          <div className="about-copy">
            {person.biography.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="sheet-body">
                {paragraph}
              </p>
            ))}
            <div className="about-links">
              <a href={`mailto:${person.email}`}>{person.email}</a>
              <a href={person.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={person.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span>{person.location}</span>
            </div>
          </div>
        </div>
      </FadeContent>

      <section className="about-section">
        <FadeContent {...FADE}>
          <CareerTimeline />
        </FadeContent>
      </section>

      <section className="about-section">
        <FadeContent {...FADE} className="about-offclock">
          <h2 className="sheet-h2">Off the Clock</h2>
          <div className="about-copy">
            {person.interests.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="sheet-body">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeContent>
      </section>

      <section className="about-section">
        <FadeContent {...FADE} className="about-galleries">
          <div className="about-gallery">
            <h2 className="sheet-h2">The Dessert Gallery</h2>
            <Carousel items={DESSERTS} label="Dessert gallery" aspectRatio="1 / 1" />
          </div>
          <div className="about-gallery">
            <h2 className="sheet-h2">The Cat Tax</h2>
            <p className="sheet-body">
              And because the internet demands it, the cat tax has been paid below. Meet Sunnah the
              beautiful diva and Modu the gluttonous yet adorable demon.
            </p>
            <Carousel items={CATS} label="Cat photos" aspectRatio="1 / 1" firstTurnMs={2500} />
          </div>
        </FadeContent>
      </section>
    </PageShell>
  );
}
