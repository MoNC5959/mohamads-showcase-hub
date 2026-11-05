import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import Modu from "../components/Modu";
import PageShell from "../components/PageShell";
import { photographerInfo as person } from "../data/photographer";

interface ContactRow {
  label: string;
  value: ReactNode;
  href?: string;
  note?: string;
  className?: string;
}

const ROWS: ContactRow[] = [
  { label: "Email", value: person.email },
  { label: "Phone", value: person.phone },
  {
    label: "LinkedIn",
    // The break opportunity keeps the address whole on phones, splitting it only after the domain.
    value: (
      <>
        https://www.linkedin.com/
        <wbr />
        <span style={{ whiteSpace: "nowrap" }}>in/mohamad-noor-chowdhury/</span>
      </>
    ),
    note: "LinkedIn doesn't allow direct links from Lovable, so please copy the address above.",
    className: "contact-value--long",
  },
  { label: "GitHub", value: "MoNC5959", href: person.github },
  { label: "Location", value: person.location, className: "contact-value--plain" },
];

export default function Contact() {
  return (
    <PageShell sheetRef="Box 03 / Sheet 04 of 04" title="Contact" accentTitle>
      <p className="contact-lede">Hiring for product? Here's how to reach me directly.</p>

      <div className="blueprint">
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        {ROWS.map((row) => {
          const content = (
            <>
              <span className="sheet-label">{row.label}</span>
              <div className="contact-detail">
                <span className={row.className ? `contact-value ${row.className}` : "contact-value"}>{row.value}</span>
                {row.note && <em className="contact-note">{row.note}</em>}
              </div>
            </>
          );

          return row.href ? (
            <a key={row.label} href={row.href} target="_blank" rel="noreferrer" className="contact-row">
              {content}
              <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ) : (
            <div key={row.label} className="contact-row">
              {content}
            </div>
          );
        })}
      </div>

      <Modu />
    </PageShell>
  );
}
