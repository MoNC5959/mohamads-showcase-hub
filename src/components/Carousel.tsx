import { useState } from "react";

interface CarouselItem {
  src: string;
  alt: string;
  caption?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  aspectRatio?: string;
}

export default function Carousel({ items, aspectRatio = "4 / 3" }: CarouselProps) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const go = (delta: number) => {
    setIndex((current) => (current + delta + items.length) % items.length);
  };

  const current = items[index];

  return (
    <div className="blueprint" style={{ position: "relative", overflow: "hidden" }}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />

      <div style={{ position: "relative", aspectRatio, background: "var(--color-neutral-200)" }}>
        <img
          src={current.src}
          alt={current.alt}
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 14px",
          borderTop: "1px solid var(--color-divider)",
          fontSize: 12,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "color-mix(in srgb, var(--color-text) 72%, transparent)",
        }}
      >
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => go(-1)}
          style={{
            appearance: "none",
            border: "1px solid var(--color-text)",
            background: "transparent",
            borderRadius: "50%",
            width: 44,
            height: 44,
            fontSize: 18,
            cursor: "pointer",
            color: "var(--color-text)",
            fontFamily: "inherit",
          }}
        >
          ‹
        </button>
        <span style={{ color: "var(--color-text)" }}>
          {current.caption ?? current.alt} — {index + 1} / {items.length}
        </span>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => go(1)}
          style={{
            appearance: "none",
            border: "1px solid var(--color-text)",
            background: "transparent",
            borderRadius: "50%",
            width: 44,
            height: 44,
            fontSize: 18,
            cursor: "pointer",
            color: "var(--color-text)",
            fontFamily: "inherit",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
