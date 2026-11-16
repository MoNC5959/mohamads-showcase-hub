import { useEffect, useRef } from "react";
import BackToTop from "@/components/BackToTop";
import markup from "./affordable-gaming.html?raw";
import "./affordable-gaming.css";

/**
 * "The Slow Death of Affordable Gaming", ported from its standalone page.
 * The markup is static and authored here, so it renders as HTML; the effect
 * below wires the page's three behaviours and removes them on unmount.
 */
export default function AffordableGamingArticle() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      /[?&]static(&|=|$)/.test(window.location.search);

    /* Sticker slap: one authored motion, reused wherever a price is re-stickered. */
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            requestAnimationFrame(() => el.classList.add("slapped"));
            io.unobserve(el);
          });
        },
        { threshold: 0.35 },
      );
      root.querySelectorAll<HTMLElement>("[data-slap], [data-bars]").forEach((g) => {
        const r = g.getBoundingClientRect();
        g.classList.add(g.hasAttribute("data-bars") ? "armed-bars" : "armed");
        if (r.top < window.innerHeight && r.bottom > 0) {
          const go = () => window.setTimeout(() => g.classList.add("slapped"), 350);
          if (document.fonts?.ready) document.fonts.ready.then(go);
          else go();
        } else {
          io.observe(g);
        }
      });
      cleanups.push(() => io.disconnect());
    }

    /* Generation shelf: one switch re-tags every price; scroll sticks the labels on one by one. */
    const gen = root.querySelector<HTMLElement>(".gen");
    if (gen) {
      const btns = Array.from(gen.querySelectorAll<HTMLButtonElement>(".switch button"));
      let stopScrolly = () => {};
      const onClick = (b: HTMLButtonElement) => () => {
        stopScrolly();
        gen.setAttribute("data-show", b.dataset["set"] || "now");
        btns.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      };
      btns.forEach((b) => {
        const h = onClick(b);
        b.addEventListener("click", h);
        cleanups.push(() => b.removeEventListener("click", h));
      });

      const genTags = Array.from(gen.querySelectorAll<HTMLElement>(".gen-shelf .tag"));
      const shelfEl = gen.querySelector<HTMLElement>(".gen-shelf");
      if (
        !reduce &&
        shelfEl &&
        genTags.length &&
        shelfEl.getBoundingClientRect().top > window.innerHeight * 0.4
      ) {
        gen.classList.add("scrolly");
        btns.forEach((o) => o.setAttribute("aria-pressed", "false"));
        const step = () => {
          const r = shelfEl.getBoundingClientRect();
          const vh = window.innerHeight;
          const prog = (vh * 0.9 - r.top) / Math.max(1, vh * 0.55);
          const n = Math.max(0, Math.min(genTags.length, Math.floor(prog * genTags.length)));
          genTags.forEach((t, i) => t.classList.toggle("on", i < n));
          if (n >= genTags.length) stopScrolly();
        };
        stopScrolly = () => {
          window.removeEventListener("scroll", step);
          genTags.forEach((t) => t.classList.add("on"));
          gen.classList.remove("scrolly");
          btns.forEach((o) => o.setAttribute("aria-pressed", String(o.dataset["set"] === "now")));
          stopScrolly = () => {};
        };
        window.addEventListener("scroll", step, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", step));
        step();
      }
    }

    /* Contents: mark the section in view. */
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".toc a"));
    if (links.length) {
      const map = new Map<string, HTMLAnchorElement>();
      links.forEach((a) => map.set((a.getAttribute("href") || "").slice(1), a));
      const heads = Array.from(map.keys())
        .map((id) => document.getElementById(id))
        .filter((h): h is HTMLElement => Boolean(h));
      let current: HTMLAnchorElement | null = null;
      const update = () => {
        const line = window.innerHeight * 0.3;
        let pick: HTMLElement | null = null;
        heads.forEach((h) => {
          if (h.getBoundingClientRect().top <= line) pick = h;
        });
        const next = pick ? (map.get((pick as HTMLElement).id) ?? null) : null;
        if (next === current) return;
        current?.removeAttribute("aria-current");
        current = next;
        current?.setAttribute("aria-current", "true");
      };
      window.addEventListener("scroll", update, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", update));
      update();
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div ref={rootRef} className="gaming-article" dangerouslySetInnerHTML={{ __html: markup }} />
      <BackToTop ground="#A55704" ink="#F8EADC" />
    </>
  );
}
