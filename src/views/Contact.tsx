import PageShell from "../components/PageShell";
import { photographerInfo as person } from "../data/photographer";

const ROWS = [
  { label: "Email", value: person.email, href: `mailto:${person.email}` },
  { label: "Phone", value: person.phone, href: `tel:${person.phone.replace(/[^+\d]/g, "")}` },
  { label: "LinkedIn", value: "in/mohamad-noor-chowdhury", href: person.linkedin },
  { label: "GitHub", value: "MoNC5959", href: person.github },
  { label: "Location", value: person.location, href: undefined },
];

export default function Contact() {
  return (
    <PageShell kicker="Box 03 / Sheet 04 of 04" title="Contact">
      <p
        style={{
          margin: 0,
          maxWidth: "58ch",
          fontSize: 17,
          lineHeight: 1.6,
          color: "color-mix(in srgb, var(--color-text) 80%, transparent)",
        }}
      >
        Let's discuss your next project. Here's how to reach me directly.
      </p>

      <div className="blueprint" style={{ width: "100%", maxWidth: 520, position: "relative" }}>
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                padding: "14px 20px",
                borderTop: i === 0 ? "none" : "1px solid var(--color-divider)",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "color-mix(in srgb, var(--color-text) 65%, transparent)",
                }}
              >
                {row.label}
              </span>
              {row.href ? (
                <a href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ color: "var(--color-accent-300)", fontWeight: 600, textAlign: "right" }}>
                  {row.value}
                </a>
              ) : (
                <span style={{ fontWeight: 600, textAlign: "right" }}>{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
