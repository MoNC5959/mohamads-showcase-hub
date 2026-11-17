import { useEffect, useRef } from "react";
import BackToTop from "@/components/BackToTop";
import markup from "./affordable-gaming.html?raw";
import "./affordable-gaming.css";

type Curve = (t: number) => number;
type Run = { raf: number; to: number; safe: number };
type Price = { pre: string; v: number; dec: number; suf: string };
type Kind = { cls?: string; arm?: (g: HTMLElement) => void; play: (g: HTMLElement) => void };

const easeOut: Curve = (t) => 1 - Math.pow(1 - t, 4);
const linear: Curve = (t) => t;

/* A price is the last text node in its element, after any screen-reader lead-in. */
const priceNode = (el: Element | null): Text | null => {
  let n: Text | null = null;
  el?.childNodes.forEach((c) => {
    if (c.nodeType === Node.TEXT_NODE && c.nodeValue?.trim()) n = c as Text;
  });
  return n;
};
const parse = (s: string): Price | null => {
  const m = /^([^\d]*)([\d,]+(?:\.(\d+))?)(.*)$/.exec(s.trim());
  if (!m) return null;
  const [, pre = "", num = "", dec = "", suf = ""] = m;
  return { pre, v: parseFloat(num.replace(/,/g, "")), dec: dec.length, suf };
};
const secs = (el: HTMLElement) => parseFloat(el.style.getPropertyValue("--delay")) || 0;
/* Each price's real text, kept outside the effect so a remount (React dev runs effects twice)
   never mistakes a figure caught mid-count for the real one. */
const realText = new WeakMap<Text, string>();

/**
 * "The Slow Death of Affordable Gaming", ported from its standalone page.
 * The markup is static and authored here, so it renders as HTML; the effect
 * below wires the page's behaviours and removes them on unmount.
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

    /* ── Motion clock: one run per key; a new run on a key cancels the old one. */
    const runs = new WeakMap<object, Run>();
    const live = new Set<Run>();
    const real = realText;
    const counted = new Set<Text>();
    const played = new WeakSet<HTMLElement>();
    const timers = new Set<number>();
    let disposed = false;
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        if (!disposed) fn();
      }, ms);
      timers.add(t);
    };
    const halt = (run: Run) => {
      cancelAnimationFrame(run.raf);
      clearTimeout(run.to);
      clearTimeout(run.safe);
      live.delete(run);
    };
    const stop = (key: object) => {
      const run = runs.get(key);
      if (run) halt(run);
      runs.delete(key);
    };
    const tween = (
      key: object,
      dur: number,
      delay: number,
      fn: (e: number, p: number) => void,
      done?: () => void,
      curve: Curve = easeOut,
    ) => {
      stop(key);
      const run: Run = { raf: 0, to: 0, safe: 0 };
      runs.set(key, run);
      live.add(run);
      const finish = () => {
        halt(run);
        runs.delete(key);
        done?.();
      };
      // if frames are starved (a background tab), land on the real end state anyway
      run.safe = window.setTimeout(
        () => {
          if (runs.get(key) !== run) return;
          fn(1, 1);
          finish();
        },
        delay + dur + 400,
      );
      run.to = window.setTimeout(() => {
        let t0: number | null = null;
        const tick = (now: number) => {
          if (t0 === null) t0 = now;
          const p = Math.min(1, (now - t0) / dur);
          fn(curve(p), p);
          if (p < 1) run.raf = requestAnimationFrame(tick);
          else finish();
        };
        run.raf = requestAnimationFrame(tick);
      }, delay);
    };

    const realValue = (el: Element | null) => {
      const n = priceNode(el);
      const p = n ? parse(real.get(n) ?? n.nodeValue ?? "") : null;
      return p ? p.v : null;
    };
    /* Run a price from one figure to its real one. The real text always comes back at the end. */
    const countTo = (
      el: Element | null,
      from: number | null,
      delay: number,
      dur: number,
      curve?: Curve,
    ) => {
      const n = priceNode(el);
      if (!el || !n || from == null) return;
      if (!real.has(n)) real.set(n, n.nodeValue ?? "");
      counted.add(n);
      const text = real.get(n) as string;
      const p = parse(text);
      if (!p) return;
      // a "+" (as in $375+) only makes sense on the final figure
      const show = (v: number) => {
        n.nodeValue = p.pre + v.toFixed(p.dec) + (p.suf === "+" ? "" : p.suf);
      };
      show(from);
      tween(
        el,
        dur,
        delay,
        (e) => show(from + (p.v - from) * e),
        () => (n.nodeValue = text),
        curve,
      );
    };
    const resetCount = (el: Element | null) => {
      if (!el) return;
      stop(el);
      const n = priceNode(el);
      if (n && real.has(n)) n.nodeValue = real.get(n) as string;
    };

    /* Hang tags and history lanes: slash the old price, slap the sticker, then the sticker's
       price runs from the figure it covers to the real one, up for markups, down for markdowns. */
    const armTags = (g: HTMLElement) => {
      g.querySelectorAll<HTMLElement>(".tag, .lane").forEach((unit) => {
        const s = unit.querySelector<HTMLElement>("s");
        const st = unit.querySelector<HTMLElement>(".sticker");
        if (s && st) s.style.setProperty("--delay", `${secs(st)}s`);
      });
    };
    const playTags = (g: HTMLElement) => {
      g.querySelectorAll<HTMLElement>(".tag, .lane").forEach((unit) => {
        let prev = realValue(unit.querySelector("s"));
        unit.querySelectorAll<HTMLElement>(".sticker").forEach((st) => {
          const price = st.querySelector(".st-price");
          const next = realValue(price);
          countTo(price, prev, (secs(st) + 0.2) * 1000 + 260, 780);
          prev = next;
        });
      });
    };

    /* Inflation bars: the figure counts with its bar. */
    const playBars = (g: HTMLElement) => {
      g.querySelectorAll(".bar-row .val").forEach((v) => countTo(v, 0, 0, 900));
    };

    /* NVIDIA split: blocks stack one by one; the total keeps pace with the stack. */
    const armBlocks = (g: HTMLElement) => {
      g.querySelectorAll(".blocks").forEach((b) =>
        b
          .querySelectorAll<HTMLElement>("i")
          .forEach((i, k) => i.style.setProperty("--i", String(k))),
      );
    };
    const playBlocks = (g: HTMLElement) => {
      g.querySelectorAll(".split-row").forEach((row) => {
        const n = row.querySelectorAll(".blocks i").length;
        countTo(row.querySelector(".val"), 0, 0, (n - 1) * 45 + 400, linear);
      });
    };

    /* DDR5: every bar first draws out to the April price, then the later bars extend
       from that mark, their stickers riding the bar end while the price climbs. */
    const armGrow = (g: HTMLElement) => {
      g.querySelectorAll(".mem-row").forEach((row) => {
        const fill = row.querySelector<HTMLElement>(".fill");
        const st = row.querySelector<HTMLElement>(".sticker");
        if (!fill || !st) return;
        fill.style.transformOrigin = "0 50%";
        fill.style.transform = "scaleX(0)";
        st.style.transition = "none";
        st.style.opacity = "0";
      });
    };
    const playGrow = (g: HTMLElement) => {
      const rows = Array.from(g.querySelectorAll(".mem-row"));
      const first = rows[0]?.querySelector<HTMLElement>(".fill");
      if (!first) return;
      const base = first.offsetWidth;
      const from = realValue(rows[0]?.querySelector(".st-price") ?? null);
      const slap = (st: HTMLElement, delay: number, done?: () => void) =>
        tween(
          st,
          420,
          delay,
          (e, p) => {
            st.style.opacity = String(Math.min(1, p * 2.4));
            st.style.scale = String(1.55 - 0.55 * e);
          },
          done,
        );
      const settle = (fill: HTMLElement, st: HTMLElement) => {
        fill.style.transform = "";
        fill.style.transformOrigin = "";
        st.style.translate = "";
        st.style.scale = "";
        st.style.opacity = "";
        st.style.transition = "";
      };
      rows.forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>(".fill");
        const st = row.querySelector<HTMLElement>(".sticker");
        if (!fill || !st) return;
        const w = fill.offsetWidth;
        const s0 = i ? Math.min(1, base / w) : 1;
        const gap = Math.max(0, w - base);
        tween(fill, 560, 0, (e) => (fill.style.transform = `scaleX(${s0 * e})`));
        if (!i) {
          slap(st, 320, () => settle(fill, st));
          return;
        }
        const start = 520 + (i - 1) * 520;
        const ride = 1150;
        const go = start + 260;
        st.style.translate = `${-gap}px 0`;
        countTo(st.querySelector(".st-price"), from, go, ride);
        slap(st, start);
        tween(
          row,
          ride,
          go,
          (e) => {
            fill.style.transform = `scaleX(${s0 + (1 - s0) * e})`;
            st.style.translate = `${-gap * (1 - e)}px 0`;
          },
          () => settle(fill, st),
        );
      });
    };

    const kinds: { slap: Kind; bars: Kind; blocks: Kind; grow: Kind } = {
      slap: { cls: "armed", arm: armTags, play: playTags },
      bars: { cls: "armed-bars", play: playBars },
      blocks: { cls: "armed-blocks", arm: armBlocks, play: playBlocks },
      grow: { arm: armGrow, play: playGrow },
    };
    const kindOf = (g: HTMLElement): Kind => {
      if (g.hasAttribute("data-bars")) return kinds.bars;
      if (g.hasAttribute("data-blocks")) return kinds.blocks;
      if (g.hasAttribute("data-grow")) return kinds.grow;
      return kinds.slap;
    };
    const play = (g: HTMLElement) => {
      if (disposed || played.has(g)) return;
      played.add(g);
      g.classList.add("slapped");
      kindOf(g).play(g);
    };

    /* Each figure plays once, when it enters the viewport. Without motion, everything stays at rest. */
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            requestAnimationFrame(() => play(el));
            io.unobserve(el);
          });
        },
        { threshold: 0.35 },
      );
      root
        .querySelectorAll<HTMLElement>("[data-slap], [data-bars], [data-blocks], [data-grow]")
        .forEach((g) => {
          const r = g.getBoundingClientRect();
          const k = kindOf(g);
          if (k.cls) g.classList.add(k.cls);
          k.arm?.(g);
          if (r.top < window.innerHeight && r.bottom > 0) {
            // already on screen (the masthead): play once fonts settle
            const go = () => later(() => play(g), 350);
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
      const genTags = Array.from(gen.querySelectorAll<HTMLElement>(".gen-shelf .tag"));
      let stopScrolly = () => {};
      const genCount = (t: HTMLElement) => {
        if (!reduce)
          countTo(t.querySelector(".st-price"), realValue(t.querySelector("s")), 330, 720);
      };
      const onClick = (b: HTMLButtonElement) => () => {
        stopScrolly();
        const was = gen.getAttribute("data-show");
        const set = b.dataset["set"] || "now";
        gen.setAttribute("data-show", set);
        btns.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        if (set === "now" && was !== "now") genTags.forEach(genCount);
        if (set !== "now") genTags.forEach((t) => resetCount(t.querySelector(".st-price")));
      };
      btns.forEach((b) => {
        const h = onClick(b);
        b.addEventListener("click", h);
        cleanups.push(() => b.removeEventListener("click", h));
      });

      const shelfEl = gen.querySelector<HTMLElement>(".gen-shelf");
      if (
        !reduce &&
        shelfEl &&
        genTags.length &&
        shelfEl.getBoundingClientRect().top > window.innerHeight * 0.4
      ) {
        gen.classList.add("scrolly");
        btns.forEach((o) => o.setAttribute("aria-pressed", "false"));
        const turnOn = (t: HTMLElement, on: boolean) => {
          const was = t.classList.contains("on");
          t.classList.toggle("on", on);
          if (on && !was) genCount(t);
        };
        const step = () => {
          const r = shelfEl.getBoundingClientRect();
          const vh = window.innerHeight;
          const prog = (vh * 0.9 - r.top) / Math.max(1, vh * 0.55);
          const n = Math.max(0, Math.min(genTags.length, Math.floor(prog * genTags.length)));
          genTags.forEach((t, i) => turnOn(t, i < n));
          if (n >= genTags.length) stopScrolly();
        };
        stopScrolly = () => {
          window.removeEventListener("scroll", step);
          genTags.forEach((t) => turnOn(t, true));
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

    cleanups.push(() => {
      disposed = true;
      live.forEach(halt);
      // put every price caught mid-count back to its real figure
      counted.forEach((n) => (n.nodeValue = real.get(n) ?? n.nodeValue));
      timers.forEach((t) => clearTimeout(t));
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div ref={rootRef} className="gaming-article" dangerouslySetInnerHTML={{ __html: markup }} />
      <BackToTop ground="#A55704" ink="#F8EADC" />
    </>
  );
}
