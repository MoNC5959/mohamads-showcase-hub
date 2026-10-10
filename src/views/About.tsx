import PageShell from "../components/PageShell";
import Carousel from "../components/Carousel";
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

const TIMELINE = [
  {
    period: "What's Next",
    role: "Looking Ahead",
    org: "",
    points: [
      "Pursuing roles in product management, strategy, or business analysis.",
      "Aligning cross-functional teams around a shared goal and shipping solutions that move the needle.",
    ],
  },
  {
    period: "2024 – 2026",
    role: "Business Analyst Lead",
    org: "H&H Group",
    points: [
      "Built and presented business cases based on pain points discovered from stakeholder interviews.",
      "Delivered $75K in annual cost savings through software governance improvements and a 50% efficiency gain.",
      "Led the deployment of a Microsoft Copilot AI Agent to 25 employees.",
    ],
  },
  {
    period: "2022 – 2024",
    role: "Technology Consultant",
    org: "Ernst & Young",
    points: [
      "Served as Associate Product Manager and Product Owner on two client engagements in financial services, coordinating delivery across teams of 20-25 people.",
      "Translated user research into backlog priorities and shipped MVP improvements for a mobile application modernization initiative and a global document repository platform.",
    ],
  },
  {
    period: "2022",
    role: "Strategy & Intelligence Analyst",
    org: "Kinesso",
    points: [
      "Conducted a research initiative exploring first-party data strategies as alternatives to third-party cookies, providing insights used by advertising teams to adapt targeting strategies.",
      "Produced and distributed weekly AdTech intelligence briefings for director-level stakeholders summarizing major market developments.",
    ],
  },
  {
    period: "2020 – 2021",
    role: "MSc, Digital Innovation in Marketing",
    org: "Temple University",
    points: [
      "Concentration of MIS and Digital Marketing.",
      "Every semester challenged me and my classmates to make innovative products, ranging from incorporating AI (this was before the huge AI boom) to reviving a legacy brand with new technology.",
    ],
  },
  {
    period: "2015 – 2019",
    role: "BBA, Management Information Systems",
    org: "Temple University",
    points: [
      "This is where I fell in love with the field. Being at the intersection of business and tech is where I thrived, and this program helped me realize that.",
      "Coursework included business analysis, coding (HTML & JS), project management, and cybersecurity.",
    ],
  },
];

const bodyTextStyle = {
  margin: 0,
  maxWidth: "62ch",
  fontSize: 17,
  lineHeight: 1.6,
  color: "color-mix(in srgb, var(--color-text) 80%, transparent)",
};

export default function About() {
  return (
    <PageShell kicker="Box 01 / Sheet 02 of 04" title="About">
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", width: "100%" }}>
        <img
          src={profilePortrait}
          alt={person.name}
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid var(--color-divider)",
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 260 }}>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 24, textTransform: "uppercase" }}>
              {person.name}
            </p>
            <p style={{ margin: 0, fontSize: 15, color: "var(--color-accent-300)", fontWeight: 600 }}>{person.tagline}</p>
          </div>
          {person.biography.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} style={bodyTextStyle}>
              {paragraph}
            </p>
          ))}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14 }}>
            <a href={`mailto:${person.email}`} style={{ color: "var(--color-accent-300)", fontWeight: 600 }}>
              {person.email}
            </a>
            <a href={person.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--color-accent-300)", fontWeight: 600 }}>
              LinkedIn
            </a>
            <a href={person.github} target="_blank" rel="noreferrer" style={{ color: "var(--color-accent-300)", fontWeight: 600 }}>
              GitHub
            </a>
            <span style={{ color: "color-mix(in srgb, var(--color-text) 65%, transparent)" }}>{person.location}</span>
          </div>
        </div>
      </div>

      <section style={{ width: "100%", marginTop: 12 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, textTransform: "uppercase", margin: "0 0 16px" }}>
          Where I've Been
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TIMELINE.map((entry) => (
            <div
              key={`${entry.period}-${entry.role}`}
              className="blueprint"
              style={{ padding: "16px 20px", position: "relative" }}
            >
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-300)" }}>
                {entry.period}
              </p>
              <p style={{ margin: "4px 0 10px", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, textTransform: "uppercase" }}>
                {entry.role}
                {entry.org ? ` — ${entry.org}` : ""}
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {entry.points.map((point) => (
                  <li key={point.slice(0, 24)} style={{ fontSize: 15, lineHeight: 1.5, color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ width: "100%", marginTop: 12 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, textTransform: "uppercase", margin: "0 0 16px" }}>
          Off the Clock
        </h2>
        {person.interests.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} style={{ ...bodyTextStyle, maxWidth: "70ch", marginBottom: 14 }}>
            {paragraph}
          </p>
        ))}
      </section>

      <section style={{ width: "100%", marginTop: 12, maxWidth: 480 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 18, textTransform: "uppercase", margin: "0 0 12px" }}>
          The Dessert Gallery
        </h2>
        <Carousel items={DESSERTS} />
      </section>

      <section style={{ width: "100%", marginTop: 12, maxWidth: 480 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 18, textTransform: "uppercase", margin: "0 0 12px" }}>
          The Cat Tax
        </h2>
        <p style={{ ...bodyTextStyle, marginBottom: 12 }}>
          And because the internet demands it, the cat tax has been paid below. Meet Sunnah the beautiful diva and Modu
          the gluttonous yet adorable demon.
        </p>
        <Carousel items={CATS} />
      </section>
    </PageShell>
  );
}
