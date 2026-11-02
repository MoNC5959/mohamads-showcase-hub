import PageShell from "../components/PageShell";
import Carousel from "../components/Carousel";
import CareerTimeline from "../components/CareerTimeline";
import { photographerInfo as person } from "../data/photographer";

import profilePortrait from "../assets/profile-portrait.jpeg";

import biscoffCookies from "../assets/desserts/biscoff-cookies.jpeg";
import blackWhiteCookies from "../assets/desserts/black-white-cookies.jpeg";
import brownies from "../assets/desserts/brownies.jpeg";
import cake from "../assets/desserts/cake.jpeg";
import mangoCheesecake from "../assets/desserts/mango-cheesecake.jpeg";
import miniCheesecakes from "../assets/desserts/mini-cheesecakes.jpeg";
import muffins from "../assets/desserts/muffins.jpeg";
import peachCheesecake from "../assets/desserts/peach-cheesecake.jpeg";
import peachCheesecake2 from "../assets/desserts/peach-cheesecake-2.jpeg";
import strawberryCheesecake from "../assets/desserts/strawberry-cheesecake.jpeg";
import tiramisu from "../assets/desserts/tiramisu.jpeg";

import modu1 from "../assets/cats/modu-1.jpeg";
import modu2 from "../assets/cats/modu-2.jpeg";
import sunnah1 from "../assets/cats/sunnah-1.jpeg";
import sunnah2 from "../assets/cats/sunnah-2.jpeg";

const DESSERTS = [
  { src: biscoffCookies, alt: "Biscoff cookies" },
  { src: blackWhiteCookies, alt: "Black & white cookies" },
  { src: brownies, alt: "Brownies" },
  { src: cake, alt: "Bundt cake" },
  { src: mangoCheesecake, alt: "Mango cheesecake" },
  { src: miniCheesecakes, alt: "Mini cheesecakes" },
  { src: muffins, alt: "Muffins" },
  { src: peachCheesecake, alt: "Peach cheesecake" },
  { src: peachCheesecake2, alt: "Peach cheesecake, take two" },
  { src: strawberryCheesecake, alt: "Strawberry cheesecake" },
  { src: tiramisu, alt: "Tiramisu" },
];

const CATS = [
  { src: sunnah1, alt: "Sunnah the cat", caption: "Sunnah" },
  { src: sunnah2, alt: "Sunnah the cat", caption: "Sunnah" },
  { src: modu1, alt: "Modu the cat", caption: "Modu" },
  { src: modu2, alt: "Modu the cat", caption: "Modu" },
];

export default function About() {
  return (
    <PageShell sheetRef="Box 01 / Sheet 02 of 04" title="About">
      <div className="about-intro">
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
      </div>

      <section className="about-section">
        <CareerTimeline />
      </section>

      <section className="about-section about-offclock">
        <h2 className="sheet-h2">Off the Clock</h2>
        <div className="about-copy">
          {person.interests.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="sheet-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="about-section about-galleries">
        <div className="about-gallery">
          <h2 className="sheet-h2">The Dessert Gallery</h2>
          <Carousel items={DESSERTS} aspectRatio="1 / 1" />
        </div>
        <div className="about-gallery">
          <h2 className="sheet-h2">The Cat Tax</h2>
          <p className="sheet-body">
            And because the internet demands it, the cat tax has been paid below. Meet Sunnah the beautiful diva and Modu
            the gluttonous yet adorable demon.
          </p>
          <Carousel items={CATS} aspectRatio="1 / 1" />
        </div>
      </section>
    </PageShell>
  );
}
