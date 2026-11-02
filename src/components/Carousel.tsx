// @ts-nocheck -- imported code written for looser TypeScript settings
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INTERVAL_MS = 5000;

interface CarouselItem {
  src: string;
  alt: string;
  caption?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  label: string;
  aspectRatio?: string;
  /** Wait before the first turn, so galleries side by side don't change in unison. */
  firstTurnMs?: number;
}

export default function Carousel({ items, label, aspectRatio = "4 / 3", firstTurnMs = INTERVAL_MS }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [near, setNear] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const delay = outgoing === null ? firstTurnMs : INTERVAL_MS;
  const running = near && !paused && count > 1;

  const go = (delta: 1 | -1) => {
    setDirection(delta > 0 ? "next" : "prev");
    setOutgoing(index);
    setIndex((index + delta + count) % count);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  // Fetches every photo before it's needed and stops the loop while offscreen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "400px" });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Depends on index, so a click on an arrow restarts the five seconds too.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(1), delay);
    return () => window.clearTimeout(timer);
  }, [index, running]);

  // Decode both neighbors ahead of time so either arrow can paint on its first frame.
  useEffect(() => {
    if (!near) return;
    const slides = rootRef.current?.querySelectorAll("img");
    [index + 1, index - 1 + count].forEach((i) => slides?.[i % count]?.decode?.().catch(() => {}));
  }, [index, near]);

  if (count === 0) return null;

  const current = items[index];

  return (
    <div ref={rootRef} className="blueprint" role="group" aria-roledescription="carousel" aria-label={label} style={{ position: "relative" }}>
      <i className="corner tl" style={{ zIndex: 1 }} />
      <i className="corner tr" style={{ zIndex: 1 }} />
      <i className="corner bl" />
      <i className="corner br" />

      <div className="carousel-stage" style={{ aspectRatio }}>
        {items.map((item, i) => {
          const isCurrent = i === index;
          const isOutgoing = i === outgoing;
          // Until the gallery is close to the viewport, only the first photo is requested.
          if (!near && !isCurrent) return null;
          const state = isCurrent ? (outgoing === null ? "is-current" : "is-current is-entering") : isOutgoing ? "is-outgoing" : "";
          return (
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              aria-hidden={isCurrent ? undefined : true}
              data-direction={direction}
              decoding="async"
              className={`carousel-slide ${state}`}
            />
          );
        })}
        {running && <span key={`${index}-${delay}`} className="carousel-timer" style={{ animationDuration: `${delay}ms` }} aria-hidden="true" />}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 14px",
          borderTop: "1px solid var(--color-divider)",
        }}
      >
        <button type="button" aria-label="Previous image" className="carousel-btn" onClick={() => go(-1)}>
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <span className="sheet-label" aria-live={running ? "off" : "polite"} style={{ textAlign: "center" }}>
          {current.caption ?? current.alt}: <span style={{ whiteSpace: "nowrap" }}>{index + 1} / {count}</span>
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="carousel-btn carousel-btn--quiet"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={18} strokeWidth={1.5} aria-hidden="true" /> : <Pause size={18} strokeWidth={1.5} aria-hidden="true" />}
          </button>
          <button type="button" aria-label="Next image" className="carousel-btn" onClick={() => go(1)}>
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
