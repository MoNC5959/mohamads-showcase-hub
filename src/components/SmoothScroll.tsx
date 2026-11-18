import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth scrolling for the whole site, mounted once in the root route.
 *
 * - Readers who ask for reduced motion keep the browser's native scroll.
 * - Scrollable panels inside a page (the Cognitive QA demo's panes, wide
 *   tables) keep their own native scroll through allowNestedScroll; anything
 *   that handles the wheel itself opts out with a data-lenis-prevent attribute.
 * - Same-page anchor links glide to their target and stop below the page's
 *   sticky header, using the target's own scroll-margin-top when it sets one.
 */
const FALLBACK_HEADER_OFFSET = 96;

export default function SmoothScroll() {
  const router = useRouter();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis || media.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        allowNestedScroll: true,
      });
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };
    const onMotionChange = () => (media.matches ? stop() : start());

    // In-page links: glide with Lenis instead of the browser's instant jump.
    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      if (!link || !id) return;
      const target = document.getElementById(decodeURIComponent(id));
      if (!target) return;
      event.preventDefault();
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      // Update the address only once the glide lands: a hash change mid-glide
      // makes the router jump straight to the target.
      lenis.scrollTo(target, {
        offset: -(margin || FALLBACK_HEADER_OFFSET),
        onComplete: () => history.replaceState(history.state, "", `#${id}`),
      });
    };

    start();
    media.addEventListener("change", onMotionChange);
    document.addEventListener("click", onClick);

    // New routes have new heights; re-measure once each page has rendered.
    const unsubscribe = router.subscribe("onResolved", () => {
      requestAnimationFrame(() => lenis?.resize());
    });

    return () => {
      unsubscribe();
      media.removeEventListener("change", onMotionChange);
      document.removeEventListener("click", onClick);
      stop();
    };
  }, [router]);

  return null;
}
