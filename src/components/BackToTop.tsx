import { ArrowUp } from "lucide-react";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";

const SHOW_AFTER_PX = 480;

interface BackToTopProps {
  /** Button color, for pages outside the hub's palette. */
  ground?: string;
  /** Arrow color, for pages outside the hub's palette. */
  ink?: string;
}

export default function BackToTop({ ground, ink }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLButtonElement>) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // A keyboard press has no pointer position. The button is about to hide, so hand focus to the top of the page.
    if (event.detail === 0) document.querySelector<HTMLElement>("header a, nav a")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={visible ? "to-top is-visible" : "to-top"}
      onClick={scrollToTop}
      style={{ "--to-top-ground": ground, "--to-top-ink": ink } as CSSProperties}
    >
      <ArrowUp size={22} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
