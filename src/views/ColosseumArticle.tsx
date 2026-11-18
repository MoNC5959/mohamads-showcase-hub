import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight, CircleSlash, Minus, Plus } from "lucide-react";
import BackToTop from "@/components/BackToTop";
import "./colosseum.css";

type Ink = "navy" | "sage" | "mustard" | "terra";

const chapters = [
  { id: "access", label: "Access" },
  { id: "power", label: "Power Play" },
  { id: "amazon", label: "Deals" },
  { id: "victim", label: "The Victim" },
  { id: "reckoning", label: "Reckoning" },
];

/* Streaming vs traditional TV, viewership index 2015–2025 */
const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const streaming = [8, 12, 18, 26, 36, 55, 67, 76, 84, 90, 95];
const traditional = [95, 90, 84, 78, 70, 60, 52, 46, 40, 36, 32];
const CH = { l: 48, r: 112, t: 16, b: 40, w: 800, h: 320 };
const cx = (i: number) => CH.l + (i / (years.length - 1)) * (CH.w - CH.l - CH.r);
const cy = (v: number) => CH.t + (CH.h - CH.t - CH.b) * (1 - v / 100);
const line = (vals: number[]) =>
  vals.map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`).join(" ");

function Opener({ ink, mark, children }: { ink: Ink; mark: ReactNode; children: ReactNode }) {
  return (
    <header className="col-opener" data-ink={ink}>
      <div className="col-opener-inner">
        <h2 className="col-h2">{children}</h2>
        <div className="col-opener-mark" aria-hidden="true">
          {mark}
        </div>
      </div>
    </header>
  );
}

/* Chapter emblems. Three ink slots (--em-a, --em-b, --em-c) are set per opener
   colour so every drawing reads on its own ground; data-part drives playEra. */
const A = "var(--em-a)";
const B = "var(--em-b)";
const C = "var(--em-c)";

const MarkArena = () => (
  <svg viewBox="0 0 180 120">
    <path d="M14 112 V52 Q90 18 166 52 V112 Z" fill={A} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        data-part="seat"
        d={`M${30 + i * 26} 112 V92 a8 8 0 0 1 16 0 V112 Z`}
        fill={B}
      />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={`u${i}`}
        data-part="seat"
        d={`M${30 + i * 26} 74 V62 a8 8 0 0 1 16 0 V74 Z`}
        fill={B}
      />
    ))}
  </svg>
);

const MarkDeal = () => (
  <svg viewBox="0 0 180 120">
    <circle data-part="play" cx="68" cy="60" r="44" fill={A} />
    <circle data-part="play" cx="112" cy="60" r="44" fill={B} />
    <path d="M90 22 A44 44 0 0 1 90 98 A44 44 0 0 1 90 22 Z" fill={C} />
  </svg>
);

const MarkTV = () => (
  <svg viewBox="0 0 180 120">
    <path d="M70 6 L84 22 M110 6 L96 22" stroke={A} strokeWidth="6" strokeLinecap="round" />
    <rect x="24" y="22" width="132" height="80" rx="10" fill={A} />
    <rect data-part="screen" x="36" y="32" width="90" height="60" rx="6" fill={B} />
    <circle data-part="knob" cx="142" cy="48" r="6" fill={C} />
    <circle data-part="knob" cx="142" cy="70" r="6" fill={C} />
  </svg>
);

const MarkBag = () => (
  <svg viewBox="0 0 180 120">
    <g data-part="bag">
      <path
        d="M68 44 V32 a22 22 0 0 1 44 0 V44"
        fill="none"
        stroke={A}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M44 44 H136 L128 114 H52 Z" fill={B} />
      <rect x="70" y="62" width="40" height="30" rx="4" fill={A} />
      <path data-part="play" d="M85 68 V86 L99 77 Z" fill={C} />
    </g>
    <path
      data-part="spark"
      d="M154 16 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z"
      fill={A}
    />
  </svg>
);

const MarkBars = () => (
  <svg viewBox="0 0 180 120">
    <rect x="16" y="110" width="148" height="6" fill={A} />
    <rect data-part="seat" x="28" y="34" width="28" height="76" fill={B} />
    <rect data-part="seat" x="66" y="70" width="28" height="40" fill={A} />
    <rect data-part="seat" x="104" y="80" width="28" height="30" fill={C} />
    <rect data-part="seat" x="142" y="18" width="14" height="92" fill={A} />
  </svg>
);

const MarkDominoes = () => (
  <svg viewBox="0 0 180 120">
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`rotate(${i * 14} ${40 + i * 34} 112)`}>
        <g data-part="seat">
          <rect x={28 + i * 34} y="30" width="24" height="82" rx="3" fill={i % 2 ? B : A} />
          <circle cx={40 + i * 34} cy="52" r="4" fill={i % 2 ? A : C} />
          <circle cx={40 + i * 34} cy="90" r="4" fill={i % 2 ? A : C} />
        </g>
      </g>
    ))}
  </svg>
);

const MarkTicket = () => (
  <svg viewBox="0 0 180 120">
    <g data-part="bag">
      <path d="M18 26 H162 V50 a10 10 0 0 0 0 20 V94 H18 V70 a10 10 0 0 0 0 -20 Z" fill={A} />
      <rect x="114" y="34" width="4" height="52" fill={B} />
      <rect x="32" y="40" width="64" height="10" rx="2" fill={B} />
      <rect x="32" y="58" width="44" height="8" rx="2" fill={C} />
      <rect x="32" y="72" width="54" height="8" rx="2" fill={C} />
    </g>
    <circle data-part="spark" cx="140" cy="60" r="12" fill={B} />
  </svg>
);

const MarkScale = () => (
  <svg viewBox="0 0 180 120">
    <path d="M90 22 L104 112 H76 Z" fill={A} />
    <rect x="86" y="10" width="8" height="16" rx="3" fill={A} />
    <g data-part="knob">
      <rect x="22" y="24" width="136" height="8" rx="4" fill={A} transform="rotate(-8 90 28)" />
      <path d="M22 44 h44 a22 22 0 0 1 -44 0 Z" fill={B} />
      <path d="M114 32 h44 a22 22 0 0 1 -44 0 Z" fill={C} />
    </g>
  </svg>
);

const MarkCloud = () => (
  <svg viewBox="0 0 180 120">
    <g data-part="bag">
      <circle cx="62" cy="62" r="26" fill={A} />
      <circle cx="96" cy="46" r="36" fill={A} />
      <circle cx="132" cy="64" r="24" fill={A} />
      <rect x="38" y="60" width="118" height="30" rx="15" fill={A} />
    </g>
  </svg>
);

function Count({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <span data-count={value} data-prefix={prefix} data-suffix={suffix}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/* ─── Flat four-ink drawings ─────────────────────────── */
function CoverEmblem() {
  const arches = (y: number, h: number) =>
    Array.from({ length: 7 }, (_, i) => {
      const x = 92 + i * 56;
      return <path key={`${y}-${i}`} d={`M${x} ${y} V${y - h + 18} a18 18 0 0 1 36 0 V${y} Z`} />;
    });
  return (
    <svg
      className="col-emblem"
      viewBox="0 0 560 500"
      role="img"
      aria-label="A flat drawing of the Colosseum with a broadcast signal rising to a cloud"
    >
      <g className="col-plate col-plate--paper" fill="oklch(0.955 0.014 120)">
        <g className="col-cloud">
          <circle cx="222" cy="104" r="42" />
          <circle cx="284" cy="78" r="58" />
          <circle cx="346" cy="106" r="40" />
          <rect x="182" y="100" width="204" height="48" rx="24" />
        </g>
      </g>
      <g
        className="col-plate col-plate--sage"
        fill="none"
        stroke="oklch(0.692 0.063 124)"
        strokeWidth="10"
        strokeLinecap="round"
      >
        <path className="col-arc" d="M254 196 Q280 180 306 196" />
        <path className="col-arc" d="M236 182 Q280 154 324 182" />
        <path className="col-arc" d="M218 168 Q280 128 342 168" />
      </g>
      <g className="col-plate col-plate--navy" fill="oklch(0.357 0.054 263)">
        <path d="M60 470 V250 Q280 170 500 250 V470 Z" />
        <rect x="36" y="466" width="488" height="16" rx="3" />
      </g>
      <g className="col-plate col-plate--terra" fill="oklch(0.687 0.109 49)">
        {arches(462, 70)}
        {arches(370, 62)}
        <rect x="74" y="384" width="412" height="10" />
        <rect x="84" y="290" width="392" height="10" />
      </g>
    </svg>
  );
}

/* Each era drawing marks its moving parts with data-part; the era's own
   motion switches the medium on (see playEra). */
const EraArena = () => (
  <svg viewBox="0 0 180 108" aria-hidden="true">
    <path d="M14 100 V44 Q90 14 166 44 V100 Z" fill="oklch(0.357 0.054 263)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        data-part="seat"
        d={`M${30 + i * 26} 100 V82 a8 8 0 0 1 16 0 V100 Z`}
        fill="oklch(0.687 0.109 49)"
      />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={`u${i}`}
        data-part="seat"
        d={`M${30 + i * 26} 66 V54 a8 8 0 0 1 16 0 V66 Z`}
        fill="oklch(0.687 0.109 49)"
      />
    ))}
  </svg>
);

const EraRadio = () => (
  <svg viewBox="0 0 180 108" aria-hidden="true">
    <rect
      x="62"
      y="12"
      width="6"
      height="36"
      rx="3"
      transform="rotate(-20 65 30)"
      fill="oklch(0.357 0.054 263)"
    />
    <rect x="30" y="40" width="96" height="62" rx="10" fill="oklch(0.687 0.109 49)" />
    <circle cx="62" cy="71" r="18" fill="oklch(0.357 0.054 263)" />
    <rect x="92" y="56" width="22" height="6" rx="3" fill="oklch(0.357 0.054 263)" />
    <rect x="92" y="68" width="22" height="6" rx="3" fill="oklch(0.357 0.054 263)" />
    <rect x="92" y="80" width="22" height="6" rx="3" fill="oklch(0.357 0.054 263)" />
    <g fill="none" stroke="oklch(0.692 0.063 124)" strokeWidth="6" strokeLinecap="round">
      <path data-part="wave" d="M138 56 Q148 70 138 84" />
      <path data-part="wave" d="M150 48 Q166 70 150 92" />
    </g>
  </svg>
);

const EraTV = () => (
  <svg viewBox="0 0 180 108" aria-hidden="true">
    <path
      d="M70 6 L84 20 M110 6 L96 20"
      stroke="oklch(0.357 0.054 263)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <rect x="26" y="20" width="128" height="74" rx="10" fill="oklch(0.357 0.054 263)" />
    <rect
      data-part="screen"
      x="38"
      y="30"
      width="86"
      height="54"
      rx="6"
      fill="oklch(0.692 0.063 124)"
    />
    <circle data-part="knob" cx="140" cy="44" r="6" fill="oklch(0.687 0.109 49)" />
    <circle data-part="knob" cx="140" cy="64" r="6" fill="oklch(0.687 0.109 49)" />
    <rect x="44" y="92" width="8" height="14" rx="3" fill="oklch(0.357 0.054 263)" />
    <rect x="128" y="92" width="8" height="14" rx="3" fill="oklch(0.357 0.054 263)" />
  </svg>
);

const EraStream = () => (
  <svg viewBox="0 0 180 108" aria-hidden="true">
    <rect x="22" y="14" width="104" height="70" rx="8" fill="oklch(0.357 0.054 263)" />
    <path data-part="play" d="M64 34 V64 L90 49 Z" fill="oklch(0.687 0.109 49)" />
    <rect x="62" y="84" width="24" height="12" fill="oklch(0.357 0.054 263)" />
    <rect x="46" y="96" width="56" height="8" rx="4" fill="oklch(0.357 0.054 263)" />
    <g fill="none" stroke="oklch(0.692 0.063 124)" strokeWidth="6" strokeLinecap="round">
      <path data-part="wave" d="M140 34 Q150 48 140 62" />
      <path data-part="wave" d="M152 26 Q168 48 152 70" />
    </g>
  </svg>
);

const EraNext = () => (
  <svg viewBox="0 0 180 108" aria-hidden="true">
    <g data-part="bag">
      <path
        d="M70 40 V30 a20 20 0 0 1 40 0 V40"
        fill="none"
        stroke="oklch(0.357 0.054 263)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M48 40 H132 L124 104 H56 Z" fill="oklch(0.687 0.109 49)" />
      <rect x="72" y="58" width="36" height="28" rx="4" fill="oklch(0.357 0.054 263)" />
      <path data-part="play" d="M86 64 V80 L98 72 Z" fill="oklch(0.692 0.063 124)" />
    </g>
    <path
      data-part="spark"
      d="M150 18 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z"
      fill="oklch(0.692 0.063 124)"
    />
  </svg>
);

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/* Switch one era's medium on: seats fill, waves ripple out, the tube warms,
   the play mark pops, the sparkle turns. Content is already drawn; this only
   replays it. */
function playEra(era: Element, start: number) {
  const parts = (name: string) =>
    Array.from(era.querySelectorAll<SVGElement>(`[data-part="${name}"]`));
  const run = (el: SVGElement, frames: Keyframe[], duration: number, delay: number) =>
    el.animate(frames, { duration, delay: start + delay, easing: EASE, fill: "backwards" });

  parts("seat").forEach((el, i) =>
    run(
      el,
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      420,
      i * 70,
    ),
  );
  parts("wave").forEach((el, i) =>
    run(
      el,
      [
        { opacity: 0, transform: "scale(0.5)" },
        { opacity: 1, transform: "scale(1.08)", offset: 0.6 },
        { opacity: 1, transform: "none" },
      ],
      700,
      200 + i * 180,
    ),
  );
  parts("screen").forEach((el) =>
    run(
      el,
      [
        { opacity: 0, transform: "scale(0.5, 0.04)" },
        { opacity: 1, transform: "scale(1, 0.04)", offset: 0.4 },
        { opacity: 1, transform: "none" },
      ],
      760,
      100,
    ),
  );
  parts("knob").forEach((el, i) =>
    run(el, [{ transform: "scale(0.4)" }, { transform: "none" }], 360, 600 + i * 90),
  );
  parts("play").forEach((el) =>
    run(
      el,
      [
        { opacity: 0, transform: "scale(0)" },
        { opacity: 1, transform: "none" },
      ],
      520,
      260,
    ),
  );
  parts("bag").forEach((el) =>
    run(
      el,
      [
        { opacity: 0, transform: "translateY(-14px)" },
        { opacity: 1, transform: "none" },
      ],
      600,
      0,
    ),
  );
  parts("spark").forEach((el) =>
    run(
      el,
      [
        { opacity: 0, transform: "scale(0) rotate(-90deg)" },
        { opacity: 1, transform: "none" },
      ],
      620,
      420,
    ),
  );
}

const eras = [
  {
    art: <EraArena />,
    when: "Physical Presence",
    title: "The Arena",
    body: "The Colosseum held 80,000. Access was physical, hierarchical, and local. Your seat was social currency.",
  },
  {
    art: <EraRadio />,
    when: "Audio Access · 1920s",
    title: "Radio",
    body: "Radio broke geography. Millions heard the fight simultaneously. Attention became the commodity.",
  },
  {
    art: <EraTV />,
    when: "Visual Access · 1950s",
    title: "Television",
    body: "TV made sport spectacular at home. Rights deals ballooned. The Super Bowl became the most-watched event on Earth.",
  },
  {
    art: <EraStream />,
    when: "On-Demand · 2020s",
    title: "Streaming",
    body: "The internet unbundled everything, then rebundled it at a premium. Live sport anchors subscription growth.",
  },
  {
    art: <EraNext />,
    when: "Commerce + AI · 2030s",
    title: "What's Next",
    body: "Shoppable moments. Personalized feeds. Integrated betting. Sport as commerce infrastructure.",
  },
];

export default function ColosseumArticle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reading progress along the running head, and the chapter the reader is in:
    // the last listed chapter whose opener has passed 40% of the viewport.
    const chapterEls = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      const line = window.innerHeight * 0.4;
      let current = "";
      chapterEls.forEach((el) => {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduce) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Lines need their length before they can draw.
    root
      .querySelectorAll<SVGPathElement>(".col-chart .line-stream, .col-chart .line-tv")
      .forEach((p) => {
        p.style.setProperty("--len", String(Math.ceil(p.getTotalLength())));
      });

    // Anything already on screen stays put; only what is below the fold waits to arrive.
    const animated = root.querySelectorAll<HTMLElement>(
      ".col-opener, .col-bars, .col-board, .col-chart",
    );
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    animated.forEach((el) => onScreen(el) && el.classList.add("is-in"));
    root.classList.add("col-motion");

    // A clipped element never reports itself as visible, so watch an unclipped
    // stand-in (the opener's section, or the element itself) and flag the element.
    const watched = new Map<Element, HTMLElement>();
    const arriveObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const hit = watched.get(e.target);
          hit?.classList.add("is-in");
          if (hit?.classList.contains("col-opener")) playEra(hit, 450);
          arriveObs.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -15% 0px" },
    );
    animated.forEach((el) => {
      if (el.classList.contains("is-in")) return;
      const stand = el.classList.contains("col-opener") ? (el.parentElement ?? el) : el;
      watched.set(stand, el);
      arriveObs.observe(stand);
    });

    // A jump (restored scroll, an anchor link) can carry the reader past an
    // element without it ever intersecting; anything above the fold counts as arrived.
    let sweepFrame = 0;
    const sweep = () => {
      sweepFrame = 0;
      watched.forEach((el, stand) => {
        if (stand.getBoundingClientRect().top < window.innerHeight * 0.85) {
          el.classList.add("is-in");
          arriveObs.unobserve(stand);
          watched.delete(stand);
        }
      });
    };
    const onSweep = () => {
      if (!sweepFrame) sweepFrame = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onSweep, { passive: true });

    // Numbers tally up to the printed value when they come into view.
    const frames = new Set<number>();
    const countObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countObs.unobserve(e.target);
          const el = e.target as HTMLElement;
          const target = Number(el.dataset["count"]);
          const prefix = el.dataset["prefix"] ?? "";
          const suffix = el.dataset["suffix"] ?? "";
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / 1300, 1);
            el.textContent = prefix + Math.round((1 - Math.pow(1 - t, 4)) * target) + suffix;
            if (t < 1) frames.add(requestAnimationFrame(tick));
          };
          frames.add(requestAnimationFrame(tick));
        }),
      { threshold: 0.6 },
    );
    root.querySelectorAll("[data-count]").forEach((el) => !onScreen(el) && countObs.observe(el));

    // The eras switch on in the order history did, once, as the lineup arrives.
    const eraList = root.querySelector(".col-eras");
    const eraItems = Array.from(root.querySelectorAll<HTMLElement>(".col-era"));
    const eraObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          eraObs.disconnect();
          eraItems.forEach((era, i) => playEra(era, i * 320));
        }),
      { threshold: 0.3 },
    );
    if (eraList) eraObs.observe(eraList);

    // Pointing at an era turns it on again, unless it is still playing.
    const replay = (e: Event) => {
      const era = e.currentTarget as HTMLElement;
      const busy = era.getAnimations({ subtree: true }).some((a) => a.playState === "running");
      if (!busy) playEra(era, 0);
    };
    eraItems.forEach((era) => era.addEventListener("pointerenter", replay));

    // The cover keeps broadcasting only while it is on screen.
    const cover = root.querySelector(".col-cover");
    const coverObs = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
    );
    if (cover) coverObs.observe(cover);

    return () => {
      window.removeEventListener("scroll", onScroll);
      arriveObs.disconnect();
      window.removeEventListener("scroll", onSweep);
      cancelAnimationFrame(sweepFrame);
      countObs.disconnect();
      frames.forEach((f) => cancelAnimationFrame(f));
      eraObs.disconnect();
      coverObs.disconnect();
      eraItems.forEach((era) => era.removeEventListener("pointerenter", replay));
    };
  }, []);

  const activeLabel = chapters.find((c) => c.id === active)?.label;

  return (
    <div ref={rootRef} className="colosseum-article">
      <div className="col-head">
        <div className="col-head-inner">
          <a href="/" className="col-home">
            Mohamad Noor-Chowdhury
          </a>
          <nav aria-label="Chapters">
            <ul className="col-chapters">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={active === c.id}>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {activeLabel && <span className="col-current">{activeLabel}</span>}
        </div>
        <div ref={progressRef} className="col-progress" aria-hidden="true" />
      </div>

      <main>
        {/* ─── Cover ─── */}
        <section className="col-cover" aria-labelledby="col-title">
          <div className="col-cover-grid">
            <div>
              <h1 id="col-title" className="col-title">
                <span className="col-title-line">From the</span>
                <span className="col-title-line">
                  <span className="col-title-mark">Colosseum</span>
                </span>
                <span className="col-title-line">to the Cloud</span>
              </h1>
              <p className="col-deck">
                How leagues and streaming giants built a lucrative partnership, and left the fan
                holding the bill. A reckoning two millennia in the making.
              </p>
              <p className="col-byline">Mo NC · The Future of Sports Media · 2025</p>
            </div>
            <div className="col-emblem-wrap">
              <CoverEmblem />
              <p className="col-roundel">
                <span>Fan's monthly bill</span>
                <strong>$136.55</strong>
              </p>
            </div>
          </div>
        </section>

        <section className="col-boxscore" aria-label="The story in four numbers">
          <dl>
            <div>
              <dt>Total streaming sports rights deals</dt>
              <dd>
                <Count value={110} prefix="$" suffix="B+" />
              </dd>
            </div>
            <div>
              <dt>18–44 yr-olds on streaming</dt>
              <dd>
                <Count value={70} suffix="%" />
              </dd>
            </div>
            <div>
              <dt>Fan's monthly sports bill</dt>
              <dd>
                <Count value={137} prefix="$" />
              </dd>
            </div>
            <div>
              <dt>Subscribe then cancel</dt>
              <dd>
                <Count value={60} suffix="%" />
              </dd>
            </div>
          </dl>
        </section>

        {/* ─── The march of access ─── */}
        <section id="access" className="col-chapter" aria-label="The Unstoppable March of Access">
          <Opener ink="terra" mark={<MarkArena />}>
            The Unstoppable <span>March of Access</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              Sport has always been inseparable from the dominant medium of its era. Each
              technological revolution broadened reach and inflated the prize.
            </p>
            <ol className="col-eras">
              {eras.map((e) => (
                <li key={e.title} className="col-era">
                  {e.art}
                  <h3>{e.title}</h3>
                  <span className="col-era-when">{e.when}</span>
                  <p>{e.body}</p>
                </li>
              ))}
            </ol>
            <div className="col-pattern">
              <h3>The pattern</h3>
              <p>
                Each era multiplied viewership and revenue. The transition is never smooth:
                incumbents resist, consumers adapt slowly, but the shift is always irreversible. We
                are mid-transition now.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Power play ─── */}
        <section id="power" className="col-chapter" aria-label="A Mutually Beneficial Power Play">
          <Opener ink="sage" mark={<MarkDeal />}>
            A Mutually Beneficial <span>Power Play</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              The marriage between sports leagues and streaming platforms wasn't accidental. Each
              party held exactly what the other desperately needed.
            </p>
            <div className="col-teams">
              <div className="col-team col-team--home">
                <h3 className="col-team-head">What Leagues Gained</h3>
                <ul>
                  <li>
                    <strong>Massive Rights Fees</strong>
                    <span>
                      Tech giants, flush with cash, bid higher than legacy broadcasters ever could
                      or would.
                    </span>
                  </li>
                  <li>
                    <strong>Global Distribution</strong>
                    <span>
                      Streaming platforms reach audiences throughout the world. A single deal is a
                      global audience deal.
                    </span>
                  </li>
                  <li>
                    <strong>Younger Demographics</strong>
                    <span>Streaming reaches the 18–34 cohort that has abandoned linear TV.</span>
                  </li>
                  <li>
                    <strong>Production Innovation</strong>
                    <span>
                      Multi-angle cameras, real-time stats overlays, integrated betting odds.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-team col-team--away">
                <h3 className="col-team-head">What Streamers Gained</h3>
                <ul>
                  <li>
                    <strong>Subscriber Magnets</strong>
                    <span>
                      Live sport drives sign-ups on event nights and keeps churn low during the
                      season.
                    </span>
                  </li>
                  <li>
                    <strong>Legitimate Premium Brand</strong>
                    <span>
                      Owning the rights to a major sports league signals that a streamer is a
                      serious media company.
                    </span>
                  </li>
                  <li>
                    <strong>First-Party Data</strong>
                    <span>
                      Authenticated viewers reveal household income, purchase behavior, and
                      preferences.
                    </span>
                  </li>
                  <li>
                    <strong>Commerce Integration</strong>
                    <span>
                      By following Amazon's lead, every ad slot is a shoppable moment. Sport is a
                      purchase funnel.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-figure-strip">
              <p className="col-big">
                <Count value={70} suffix="%" />
              </p>
              <p>
                of adults aged 18–44 subscribe to at least one streaming service, with an average of{" "}
                <strong>8 active subscriptions</strong> per household. The audience has already
                moved.
              </p>
            </div>
          </div>
        </section>

        {/* ─── COVID ─── */}
        <section id="covid" className="col-chapter" aria-label="The COVID Accelerator">
          <Opener ink="navy" mark={<MarkTV />}>
            The COVID <span>Accelerator</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              The pandemic compressed a decade of change into eighteen months. Empty stadiums forced
              every stakeholder's hand.
            </p>
            <figure className="col-chart">
              <figcaption className="col-h3">
                Streaming vs Traditional TV: Viewership Index 2015–2025
              </figcaption>
              <svg
                viewBox={`0 0 ${CH.w} ${CH.h}`}
                role="img"
                aria-label="Chart showing streaming rising and linear TV falling with a crossover at 2020"
              >
                <g className="grid">
                  {[0, 25, 50, 75, 100].map((v) => (
                    <line key={v} x1={CH.l} x2={CH.w - CH.r} y1={cy(v)} y2={cy(v)} />
                  ))}
                </g>
                <rect
                  className="covid-band"
                  x={cx(5) - 18}
                  y={CH.t}
                  width={36}
                  height={CH.h - CH.t - CH.b}
                />
                <g className="axis">
                  {[0, 50, 100].map((v) => (
                    <text key={v} x={CH.l - 12} y={cy(v) + 4} textAnchor="end">
                      {v}
                    </text>
                  ))}
                  {years.map((y, i) =>
                    i % 2 === 0 || i === years.length - 1 ? (
                      <text key={y} x={cx(i)} y={CH.h - 10} textAnchor="middle">
                        {y}
                      </text>
                    ) : null,
                  )}
                </g>
                <path className="line-tv" d={line(traditional)} />
                <path className="line-stream" d={line(streaming)} />
                <circle className="covid-dot" cx={cx(5)} cy={cy(55)} r={8} />
                <text
                  className="end-label"
                  x={cx(10) + 12}
                  y={cy(95) + 5}
                  fill="oklch(0.52 0.12 45)"
                >
                  Streaming
                </text>
                <text
                  className="end-label"
                  x={cx(10) + 12}
                  y={cy(32) + 5}
                  fill="oklch(0.357 0.054 263)"
                >
                  Linear TV
                </text>
              </svg>
              <ul className="col-legend">
                <li>
                  <i style={{ background: "var(--terra-ink)" }} />
                  Streaming
                </li>
                <li>
                  <i style={{ background: "var(--navy)" }} />
                  Linear TV
                </li>
                <li>
                  <i className="dot" style={{ background: "var(--mustard)" }} />
                  2020 COVID inflection
                </li>
              </ul>
            </figure>
            <div className="col-facts">
              <div className="col-fact">
                <p className="col-fact-num">+26M</p>
                <h3>New US streaming subscribers in 2020</h3>
                <p>
                  Added in a single year as lockdowns made streaming the only live entertainment.
                </p>
              </div>
              <div className="col-fact">
                <p className="col-fact-num">–12%</p>
                <h3>Linear TV viewership decline 2020–22</h3>
                <p>
                  Cord-cutting accelerated permanently. Households that cancelled rarely returned.
                </p>
              </div>
              <div className="col-fact">
                <p className="col-fact-num">2021</p>
                <h3>First major sports rights shift to streaming</h3>
                <p>
                  Amazon had previously aired NFL games, but in 2021 signed the first exclusive
                  streaming rights deal for Thursday Night Football, a watershed moment for the
                  industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Amazon ─── */}
        <section id="amazon" className="col-chapter" aria-label="The Amazon / NFL Blueprint">
          <Opener ink="mustard" mark={<MarkBag />}>
            The Amazon / NFL <span>Blueprint</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              When Amazon secured exclusive NFL Thursday Night Football rights in 2021, it didn't
              buy a broadcast slot; it bought a proof-of-concept for the entire industry.
            </p>
            <div className="col-table-wrap col-block">
              <table className="col-table">
                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Asset</th>
                    <th>Duration</th>
                    <th className="num">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amazon Prime Video</td>
                    <td>Thursday Night Football (excl.)</td>
                    <td>11 years</td>
                    <td className="num">~$1B/yr</td>
                  </tr>
                  <tr className="sub">
                    <td>Per-game cost</td>
                    <td>15–17 games/season</td>
                    <td>2022–2032</td>
                    <td className="num">$58.8M/game</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-prose col-block">
              <h3 className="col-h3">2023: The Black Friday Game</h3>
              <p style={{ color: "var(--ink)" }}>
                Building on the success of exclusive Thursday Night Football, Amazon paid $100M for
                the exclusive rights to a single NFL game on Black Friday 2023. But this was never
                just about football.
              </p>
              <p>
                The move was a deliberate attempt to create a new commercial holiday tradition, one
                that lived entirely within a digital ecosystem. Instead of heading out to stores on
                Black Friday, Amazon wanted the shopping experience to come to viewers, while they
                watched the most-watched sport in the United States.
              </p>
              <p>
                By pairing targeted ads with live football, Amazon turned a single game into a
                shoppable event, redefining what Black Friday could look like for a streaming-first
                generation.
              </p>
            </div>

            <div className="col-block">
              <h3 className="col-h3">
                The Black Friday Experiment: Acquire → Monetize → Integrate
              </h3>
              <div className="col-flow">
                <div className="col-flow-step">
                  <h4>Acquire</h4>
                  <p className="amount">$100M</p>
                  <p>
                    Amazon paid ~$100M for exclusive Black Friday rights, a calculated loss-leader
                    to prove the model.
                  </p>
                </div>
                <ArrowRight
                  className="col-flow-arrow"
                  size={32}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <div className="col-flow-step">
                  <h4>Monetize</h4>
                  <p className="amount">$880K</p>
                  <p>
                    The only publicly available data covers 58 thirty-second ad slots, which alone
                    generated approximately $51M. Shorter formats like 15-second ads were not
                    disclosed, meaning the true ad revenue was almost certainly higher, and Amazon
                    likely recouped well over half its $100M investment from ads before a single
                    item was sold.
                  </p>
                </div>
                <ArrowRight
                  className="col-flow-arrow"
                  size={32}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <div className="col-flow-step">
                  <h4>Integrate</h4>
                  <p className="amount">Shop</p>
                  <p>
                    Instead of going out and battling crowds, the shopping experience was brought
                    directly to the customer's living room. Amazon converted its first-party data
                    into a targeted ad experience tailored to each viewer. Many ads featured QR
                    codes directing users straight to product pages. But every QR code scan sent
                    behavioral data back to Amazon, giving the tech giant even richer targeting
                    signals for future campaigns. The game was not just a commercial event, it was a
                    data collection exercise at scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Data ─── */}
        <section id="data" className="col-chapter" aria-label="The Real Payoff Is Data">
          <Opener ink="terra" mark={<MarkBars />}>
            The Real Payoff <span>Is Data</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              The ad revenue is visible. The commerce integration is trackable. But the real prize,
              why tech companies outbid legacy broadcasters, is first-party data from authenticated
              viewers.
            </p>
            <div className="col-bars">
              <h3 className="col-h3">Black Friday Game: Revenue Analysis</h3>
              <div className="col-bar col-bar--cost">
                <div className="col-bar-meta">
                  <span>Rights Investment</span>
                  <b>−$100M</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 100 }} />
                </div>
              </div>
              <div className="col-bar col-bar--ads">
                <div className="col-bar-meta">
                  <span>Known Direct Ad Revenue (from 30 sec ads, 58 × $880K)</span>
                  <b>+$51.04M</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 51 }} />
                </div>
              </div>
              <div className="col-bar col-bar--unknown">
                <div className="col-bar-meta">
                  <span>Commerce / Shoppable Ads / Unknown Ad Revenue</span>
                  <b>+Unmeasured</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 38 }} />
                </div>
              </div>
              <div className="col-bar col-bar--data">
                <div className="col-bar-meta">
                  <span>First-Party Data Value (modelled)</span>
                  <b>+Strategic</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 82 }} />
                </div>
              </div>
              <p className="col-note" style={{ marginTop: 24 }}>
                * 58 slots. Only accounts for 30 sec ads.
              </p>
            </div>
            <div className="col-pair">
              <div>
                <strong>58</strong>
                <span>30 sec ad slots per game (publicly known)</span>
              </div>
              <div>
                <strong>$880K</strong>
                <span>Per 30-second unit</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Domino ─── */}
        <section id="domino" className="col-chapter" aria-label="The Domino Effect">
          <Opener ink="sage" mark={<MarkDominoes />}>
            The Domino <span>Effect</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              Once Amazon proved the model, every major league renegotiated. The deals that followed
              rewired the entire rights landscape.
            </p>

            <div className="col-table-wrap col-block">
              <table className="col-table">
                <caption>NFL: $26B Total Streaming Portfolio</caption>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Package</th>
                    <th>Deal Signed</th>
                    <th>Term</th>
                    <th className="num">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amazon Prime</td>
                    <td>Thursday Night (excl.)</td>
                    <td>2021</td>
                    <td>11 yr</td>
                    <td className="num">$1.0B/yr</td>
                  </tr>
                  <tr>
                    <td>YouTube TV</td>
                    <td>Sunday Ticket</td>
                    <td>2024</td>
                    <td>7 yr</td>
                    <td className="num">$2.5B/yr</td>
                  </tr>
                  <tr>
                    <td>Peacock (NBC)</td>
                    <td>Exclusive Playoff Game</td>
                    <td>2023</td>
                    <td>Ongoing</td>
                    <td className="num">$110M</td>
                  </tr>
                  <tr>
                    <td>Netflix</td>
                    <td>Christmas Day Games</td>
                    <td>2024</td>
                    <td>3 yr</td>
                    <td className="num">$150M/yr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-block">
              <p className="col-note" style={{ maxWidth: "var(--measure)" }}>
                All deals below were signed as part of the NBA's new media rights agreement,
                covering the 2025-2026 season onwards.
              </p>
              <div className="col-table-wrap">
                <table className="col-table">
                  <caption>NBA: $76B Total Streaming Portfolio</caption>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Package</th>
                      <th>Term</th>
                      <th className="num">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Amazon Prime</td>
                      <td>Package C (excl. streaming)</td>
                      <td>11 yr</td>
                      <td className="num">$1.8B/yr</td>
                    </tr>
                    <tr>
                      <td>NBC / Peacock</td>
                      <td>Package A</td>
                      <td>11 yr</td>
                      <td className="num">$2.5B/yr</td>
                    </tr>
                    <tr>
                      <td>ESPN / ABC</td>
                      <td>Package B</td>
                      <td>11 yr</td>
                      <td className="num">$2.6B/yr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-facts">
              <div className="col-fact">
                <h3 style={{ marginTop: 0 }}>MLS</h3>
                <p className="col-fact-num" style={{ marginTop: 8 }}>
                  $2.5B
                </p>
                <p>Apple TV+, 10-year exclusive. Full league package. Global rights.</p>
              </div>
              <div className="col-fact">
                <h3 style={{ marginTop: 0 }}>MLB</h3>
                <p className="col-fact-num" style={{ marginTop: 8 }}>
                  $85M/yr
                </p>
                <p>Apple TV+ Friday games. First major broadcast-to-streaming shift in baseball.</p>
              </div>
              <div className="col-fact">
                <h3 style={{ marginTop: 0 }}>WWE / Netflix</h3>
                <p className="col-fact-num" style={{ marginTop: 8 }}>
                  $5B
                </p>
                <p>
                  10-year deal. RAW exclusively on Netflix. Combat sport goes mainstream streaming.
                </p>
              </div>
            </div>

            <div className="col-total">
              <div>
                <h3>Total Capital Committed to Streaming Rights</h3>
                <p className="col-big">
                  <Count value={110} prefix="$" suffix="B+" />
                </p>
                <p className="who">NFL · NBA · MLS · MLB · WWE and counting</p>
              </div>
              <p>
                In just a few years, the four major American sports leagues collectively signed over{" "}
                <strong>$110 billion</strong> in streaming rights contracts. Television's
                century-long monopoly on live sport ended not with a whimper, but with a wire
                transfer.
              </p>
            </div>
          </div>
        </section>

        {/* ─── The victim ─── */}
        <section id="victim" className="col-chapter" aria-label="The Victim in the Room">
          <Opener ink="navy" mark={<MarkTicket />}>
            The Victim <span>in the Room</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              As leagues and platforms negotiated their mutual prosperity, one stakeholder was
              absent from the table: the fan.
            </p>
            <ul className="col-pains">
              <li>
                <h3>À La Carte Chaos</h3>
                <p>
                  To watch a complete NFL season, a fan must now subscribe to YouTube TV, Amazon
                  Prime, Peacock, ESPN+, and Netflix, each carrying a different package of games. No
                  single service provides full coverage. The consumer must reconstruct the bundle
                  they once had, at three times the price.
                </p>
              </li>
              <li>
                <h3>Subscription Fatigue</h3>
                <p className="inline-stat">
                  <b>60%</b> of subscribers cancel within 3 months of a major sporting event
                </p>
                <p>
                  The subscribe-and-cancel cycle is now a documented consumer pattern. Fans sign up
                  for the Super Bowl or the Finals, cancel after, and platforms spend the off-season
                  buying them back with discounts. The economics are unstable.
                </p>
              </li>
              <li>
                <h3>Toll Road Mentality</h3>
                <p>
                  Individual playoff games are now paywalled behind specific streaming tiers. The
                  2024 Wild Card game on Peacock required a paid upgrade, a game once available on
                  free broadcast now has a cover charge. The public good of live sport is becoming a
                  private toll road.
                </p>
              </li>
            </ul>

            <div className="col-block">
              <h3 className="col-h3">The True Cost: An NFL Fan's Monthly Bill</h3>
              <div className="col-board">
                <div className="col-board-head">
                  <h4>Full NFL Season Access 2024/25</h4>
                  <p>Monthly subscription breakdown</p>
                </div>
                <ul>
                  <li>
                    <span>YouTube TV (base package)</span>
                    <b>$82.99</b>
                  </li>
                  <li>
                    <span>YouTube Sunday Ticket</span>
                    <b>$23.00</b>
                  </li>
                  <li>
                    <span>Amazon Prime</span>
                    <b>$11.58</b>
                  </li>
                  <li>
                    <span>Peacock Premium</span>
                    <b>$10.99</b>
                  </li>
                  <li>
                    <span>Netflix (Standard)</span>
                    <b>$7.99</b>
                  </li>
                </ul>
                <div className="col-board-total">
                  <span>Total Monthly</span>
                  <b>$136.55</b>
                </div>
              </div>
              <p className="col-board-note">
                vs. $50–60/month for the cable bundle that included all of the above a decade ago.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Trade-off ─── */}
        <section className="col-chapter" aria-label="Innovation vs. Accessibility">
          <Opener ink="mustard" mark={<MarkScale />}>
            Innovation vs. <span>Accessibility</span>
          </Opener>
          <div className="col-page">
            <div className="col-ledger">
              <div className="col-team col-team--home">
                <h3 className="col-team-head">What You Get</h3>
                <ul>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Multi-angle cameras</strong>
                      <span>Choose your view. Watch replays from any angle instantly.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Personalized stats overlays</strong>
                      <span>Real-time player tracking, fantasy data, predictive analytics.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Integrated betting</strong>
                      <span>Live odds in-stream. Place bets without leaving the feed.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Global access</strong>
                      <span>Any device, anywhere. Games no longer geography-locked.</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-team col-team--away">
                <h3 className="col-team-head">What It Costs</h3>
                <ul>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Financial burden</strong>
                      <span>$137/month for one sport. This excludes all other entertainment.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Navigational complexity</strong>
                      <span>Six apps to manage. Different UIs, passwords, and billing cycles.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Reduced accessibility</strong>
                      <span>
                        Lower-income households priced out. Sport becomes a luxury, not a right.
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Privacy erosion</strong>
                      <span>The price of personalization is behavioral surveillance at scale.</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Reckoning ─── */}
        <section id="reckoning" className="col-chapter" aria-label="The Reckoning">
          <Opener ink="terra" mark={<MarkCloud />}>
            The <span>Reckoning</span>
          </Opener>
          <div className="col-page">
            <p className="col-lead">
              Consumer tolerance for fragmented access and escalating costs has limits. Two distinct
              futures are emerging. The industry must choose.
            </p>

            <div className="col-venu">
              <div className="col-venu-head">
                <h3>Cautionary Tale: Venu Sports</h3>
                <span className="col-stamp">
                  <CircleSlash size={18} strokeWidth={2.5} aria-hidden="true" />
                  Blocked on antitrust grounds
                </span>
              </div>
              <div className="col-venu-grid">
                <div>
                  <h4>The Proposed Solution</h4>
                  <p>
                    ESPN, Fox, and Warner Bros. Discovery proposed a joint streaming venture, "Venu
                    Sports", to offer all major sports on a single platform. A genuine
                    re-aggregation attempt. Industry collaboration over competition.
                  </p>
                  <p className="col-venu-price">$42.99/mo</p>
                  <span>Proposed price point</span>
                </div>
                <div>
                  <h4>The Regulatory Block</h4>
                  <p>
                    A federal judge issued a preliminary injunction, ruling that three of the
                    largest sports content owners creating a single bundle raised serious antitrust
                    concerns. Venu Sports was shelved indefinitely.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-block">
              <h3 className="col-h3">Two Futures</h3>
              <div className="col-paths">
                <div className="col-path">
                  <h4>Re-Aggregation</h4>
                  <p>
                    The industry consolidates. A single super-bundle emerges through regulatory
                    approval or acquisition. The fan gets one bill, one interface. Convenient, but
                    historically monopolistic.
                  </p>
                  <ul>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Precedent: Cable TV bundle (pre-2015)
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Risk: monopolistic pricing without competition
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Blocker: antitrust regulators (see Venu Sports)
                    </li>
                  </ul>
                </div>
                <div className="col-path">
                  <h4>Commerce-First</h4>
                  <p>
                    Streaming becomes the wrapper around a commerce experience. Subscription fees
                    are subsidized by purchase commissions and targeted advertising. The cost drops,
                    and the data cost rises.
                  </p>
                  <ul>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Precedent: Amazon Black Friday game
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      58% higher engagement for shoppable content
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Privacy trade-off: data for reduced cost
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-figure-strip col-figure-strip--ruled">
              <p className="col-big">58%</p>
              <p>
                higher viewer engagement with shoppable streaming content versus standard ad
                formats, the number that makes the commerce-first model commercially irresistible.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Closing ─── */}
        <section
          id="closing"
          className="col-chapter col-closing col-sheet-band"
          aria-label="Closing"
        >
          <div className="col-page">
            <div className="col-prose">
              <p>
                The transformation of sports media is, on its surface, a story of progress. Better
                technology, broader access, richer content, global audiences. And those things are
                real.
              </p>
              <p>
                But progress for whom? The leagues secured generational wealth through rights fees
                that no cable network could match. The platforms secured subscriber growth, brand
                legitimacy, and, most valuably, data at a scale previously unimaginable.
              </p>
              <p>
                The fan, the person whose passion made all of this possible, who filled the stadium
                and bought the jersey and tuned in for fifty years, was the last consideration in
                every deal room. Their loyalty was assumed. Their tolerance was tested. Their wallet
                was the variable everyone planned around.
              </p>
              <p>
                The reckoning will come, as it always does, when the audience decides it's had
                enough. What form that reckoning takes, whether re-aggregation, regulation, or a new
                commerce compact, will define the next era of sports media. But one thing is
                certain:{" "}
                <strong>
                  whoever controls the access, controls the audience. And whoever controls the
                  audience, controls the game.
                </strong>
              </p>
            </div>
            <p className="col-sign">
              <strong>Mo NC</strong>
              The Future of Sports Media · 2025
            </p>
          </div>
        </section>
      </main>

      <footer className="col-foot">
        <div className="col-foot-inner">
          <nav aria-label="Series">
            <a href="/project/fintech">The Future of FinTech</a>
            <a href="/colosseum">Sports &amp; Media</a>
            <a href="/portfolio">Technology &amp; Society</a>
          </nav>
          <span>© 2025 Mo NC</span>
        </div>
      </footer>
      <BackToTop ground="oklch(0.357 0.054 263)" ink="oklch(0.806 0.142 89)" />
    </div>
  );
}
