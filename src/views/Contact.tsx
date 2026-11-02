import { ArrowUpRight } from "lucide-react";
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
    <PageShell sheetRef="Box 03 / Sheet 04 of 04" title="Contact" accent>
      <p className="contact-lede">Hiring for product? Here's how to reach me directly.</p>

      <div className="blueprint">
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        {ROWS.map((row) =>
          row.href ? (
            <a
              key={row.label}
              href={row.href}
              target={row.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="contact-row"
            >
              <span className="sheet-label">{row.label}</span>
              <span className="contact-value">{row.value}</span>
              <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ) : (
            <div key={row.label} className="contact-row">
              <span className="sheet-label">{row.label}</span>
              <span className="contact-value">{row.value}</span>
            </div>
          )
        )}
      </div>
    </PageShell>
  );
}
