import { useEffect, useRef, useState, type ReactNode } from "react";
import { TIMELINE_ITEMS, type TimelineType } from "@/data/timeline";
import "./career-timeline.css";

type PanelAction = "prev" | "next" | "close";

const Icon = ({ size = 22, children }: { size?: number; children: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// Lucide icons
const TYPE_ICONS: Record<TimelineType, ReactNode> = {
  ahead: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </Icon>
  ),
  work: (
    <Icon>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </Icon>
  ),
  edu: (
    <Icon>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </Icon>
  ),
  cert: (
    <Icon>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </Icon>
  ),
};

const NAV_ICONS: Record<PanelAction, ReactNode> = {
  prev: <Icon size={18}><path d="m18 15-6-6-6 6" /></Icon>,
  next: <Icon size={18}><path d="m6 9 6 6 6-6" /></Icon>,
  close: (
    <Icon size={18}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  ),
};

const Corners = () => (
  <>
    <i className="corner tl" />
    <i className="corner tr" />
    <i className="corner bl" />
    <i className="corner br" />
  </>
);

export default function CareerTimeline() {
  const [sel, setSel] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  // Which panel control had focus, so stepping between milestones keeps focus on it.
  const pendingFocus = useRef<PanelAction | "item" | null>(null);
  const last = TIMELINE_ITEMS.length - 1;

  const step = (delta: number) =>
    setSel((current) => Math.max(0, Math.min(last, (current ?? 0) + delta)));

  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (!target || !listRef.current) return;
    const row = sel == null ? null : listRef.current.children[sel];
    if (target === "item" || !row) return;
    const btn = row.querySelector<HTMLButtonElement>(`[data-action="${target}"]`);
    (btn && !btn.disabled ? btn : row.querySelector<HTMLButtonElement>(".tl-item"))?.focus();
  }, [sel]);

  useEffect(() => {
    if (sel == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const onPanelAction = (action: PanelAction, index: number) => {
    if (action === "close") {
      setSel(null);
      listRef.current?.children[index]?.querySelector<HTMLButtonElement>(".tl-item")?.focus();
      return;
    }
    pendingFocus.current = action;
    step(action === "prev" ? -1 : 1);
  };

  return (
    <div className="ctl">
      <header className="ctl-header">
        <div className="ctl-eyebrow">Mohamad Noor-Chowdhury</div>
        <h2 className="ctl-title">Timeline</h2>
        <p className="ctl-lede">
          Where I'm headed, where I've worked and where I studied. Select any milestone to read more.
        </p>
      </header>

      <div className="tl">
        <div className="tl-axis" aria-hidden="true" />
        <div className="tl-cap" aria-hidden="true" />
        <ol className="tl-list" ref={listRef}>
          {TIMELINE_ITEMS.map((it, i) => {
            const selected = sel === i;
            return (
              <li
                key={`${it.kicker}-${it.title}`}
                className={`tl-row${selected ? " is-selected" : ""}`}
                data-side={i % 2 === 0 ? "left" : "right"}
              >
                <div className="tl-dot" aria-hidden="true" />
                <button
                  type="button"
                  className="tl-item"
                  aria-expanded={selected}
                  aria-controls={`tl-panel-${i}`}
                  onClick={() => setSel(selected ? null : i)}
                >
                  <div className="tl-head">
                    <div className="tl-icon blueprint">
                      <Corners />
                      {TYPE_ICONS[it.type]}
                    </div>
                    <div className="tl-dash" />
                  </div>
                  <div className="tl-text">
                    <div className="kicker">{it.kicker}</div>
                    <div className="tl-title">{it.title}</div>
                    <div className="tl-org">{it.org}</div>
                    <div className="tl-summary">{it.summary}</div>
                  </div>
                </button>

                {selected && (
                  <div className="tl-panel-wrap">
                    <section className="tl-panel blueprint" id={`tl-panel-${i}`} aria-label={`${it.title} details`}>
                      <Corners />
                      <div className="tl-panel-bar">
                        <span className="tl-tag tl-tag--fill">{it.typeLabel}</span>
                        <div className="tl-panel-nav">
                          {(["prev", "next", "close"] as const).map((action) => (
                            <button
                              key={action}
                              type="button"
                              className="tl-panel-btn"
                              data-action={action}
                              aria-label={action === "prev" ? "Newer" : action === "next" ? "Older" : "Close"}
                              disabled={(action === "prev" && i === 0) || (action === "next" && i === last)}
                              onClick={() => onPanelAction(action, i)}
                            >
                              {NAV_ICONS[action]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="tl-panel-heading">
                        <div className="kicker">{it.kicker}</div>
                        <h3 className="tl-panel-title">{it.title}</h3>
                        <div className="tl-panel-org">{it.org}</div>
                        <div className="tl-panel-place">{it.place}</div>
                      </div>
                      <p className="tl-panel-detail">{it.detail}</p>
                      {it.points.length > 0 && (
                        <div className="tl-points-block">
                          <div className="kicker">Highlights</div>
                          <ul className="tl-points">
                            {it.points.map((p) => (
                              <li key={p}>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {it.tags.length > 0 && (
                        <div className="tl-tags">
                          {it.tags.map((t) => (
                            <span key={t} className="tl-tag tl-tag--outline">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
