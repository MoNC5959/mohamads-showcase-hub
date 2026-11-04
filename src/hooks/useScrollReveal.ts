import { useLayoutEffect } from "react";

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 3;
// Long enough for the slowest transition in styles.css (.reveal-playing).
const PLAYING_MS = 900;
const PHOTO_WAIT_MS = 700;

/**
 * Fades in each `[data-reveal]` element on the page as it scrolls into view.
 * Content is visible by default, including in the server-rendered HTML: only elements
 * still below the fold get hidden, so nothing on screen flashes, and the page reads
 * fine without JavaScript or with reduced motion. Animates opacity and transform only,
 * to stay on the compositor. Use `data-reveal="photo"` to decode an image first.
 */
export function useScrollReveal() {
  useLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fold = window.innerHeight;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top > fold,
    );

    let cancelled = false;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const play = (el: HTMLElement, delay: number) => {
      if (cancelled) return;
      el.style.transitionDelay = `${delay}ms`;
      el.classList.remove("reveal-waiting");
      el.classList.add("reveal-playing");
      later(() => {
        el.classList.remove("reveal-playing");
        el.style.transitionDelay = "";
      }, delay + PLAYING_MS);
    };

    // Decode photos before they animate, so a large image can't stall the fade.
    const playWhenReady = (el: HTMLElement, delay: number) => {
      const photo = el.getAttribute("data-reveal") === "photo" ? el.querySelector("img") : null;
      if (!photo) {
        play(el, delay);
        return;
      }
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        play(el, delay);
      };
      photo.decode().then(start, start);
      later(start, PHOTO_WAIT_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let step = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          playWhenReady(
            entry.target as HTMLElement,
            Math.min(step, MAX_STAGGER_STEPS) * STAGGER_MS,
          );
          step += 1;
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    items.forEach((el) => {
      el.classList.add("reveal-waiting");
      observer.observe(el);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      items.forEach((el) => {
        el.classList.remove("reveal-waiting", "reveal-playing");
        el.style.transitionDelay = "";
      });
    };
  }, []);
}
