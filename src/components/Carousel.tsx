// @ts-nocheck -- imported code written for looser TypeScript settings
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="blueprint" style={{ position: "relative" }}>
      <i className="corner tl" style={{ zIndex: 1 }} />
      <i className="corner tr" style={{ zIndex: 1 }} />
      <i className="corner bl" />
      <i className="corner br" />

      <div style={{ position: "relative", aspectRatio, background: "var(--color-divider)" }}>
        <img
          src={current.src}
          alt={current.alt}
          loading="lazy"
          decoding="async"
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
        }}
      >
        <button type="button" aria-label="Previous image" className="carousel-btn" onClick={() => go(-1)}>
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <span className="sheet-label" aria-live="polite" style={{ textAlign: "center" }}>
          {current.caption ?? current.alt}: {index + 1} / {items.length}
        </span>
        <button type="button" aria-label="Next image" className="carousel-btn" onClick={() => go(1)}>
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
