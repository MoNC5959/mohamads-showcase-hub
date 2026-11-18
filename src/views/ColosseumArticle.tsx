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

/* Share of US TV viewing time, Nielsen's The Gauge: its first month (May 2021)
   and the month streaming passed broadcast and cable combined (May 2025). */
const gaugeYears = ["May 2021", "May 2025"];
const gauge = {
  streaming: [26, 44.8],
  cable: [39, 24.1],
  broadcast: [25, 20.1],
};
const gaugeEnd = { streaming: 44.8, cable: 24.1, broadcast: 20.1 };
const CH = { l: 56, r: 150, t: 16, b: 40, w: 800, h: 320 };
const cx = (i: number) => CH.l + (i / (gaugeYears.length - 1)) * (CH.w - CH.l - CH.r);
const cy = (v: number) => CH.t + (CH.h - CH.t - CH.b) * (1 - v / 50);
const line = (vals: number[]) =>
  vals.map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`).join(" ");

const sources = [
  {
    label: "Colosseum seating: about 50,000 spectators",
    title: "Colosseum",
    outlet: "Encyclopaedia Britannica",
    href: "https://www.britannica.com/topic/Colosseum",
  },
  {
    label: "Super Bowl LIX, 127.7 million viewers",
    title: "Super Bowl LIX averages record audience of 127.7 million viewers",
    outlet: "NFL.com",
    href: "https://amp.nfl.com/news/super-bowl-lix-averages-record-audience-of-127-7-million-viewers",
  },
  {
    label:
      "Average streaming subscriber: four paid services, $69 a month; cable and satellite $125",
    title: "Digital Media Trends 2025 press release",
    outlet: "Deloitte",
    href: "https://www.deloitte.com/us/en/about/press-room/digital-media-trends-consumption-habits-survey.html",
  },
  {
    label: "39% cancelled a paid streaming service in six months; 24% cancelled and returned",
    title: "Digital Media Trends, 19th edition",
    outlet: "Deloitte",
    href: "https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html",
  },
  {
    label: "Average subscriber held five services in late 2020, up from three",
    title: "Streaming churn and the pandemic",
    outlet: "Deloitte",
    href: "https://www.deloitte.com/content/dam/assets-shared/legacy/docs/insights/2022/6960_TMT-streaming-churn.pdf",
  },
  {
    label: "Pay TV lost nearly 7.2 million subscribers in 2020",
    title: "Multichannel video subscribers dropped by 7.2 million: Kagan",
    outlet: "Next TV",
    href: "https://www.nexttv.com/news/multichannel-video-subscribers-dropped-by-72-million-kagan",
  },
  {
    label: "The Gauge, May 2021: streaming 26%, broadcast 25%, cable 39%",
    title: "New Nielsen metric finds streaming 26% of TV viewing time",
    outlet: "MediaPost",
    href: "https://www.mediapost.com/publications/article/364325/new-nielsen-metric-finds-streaming-26-of-all-view.html",
  },
  {
    label: "The Gauge, May 2025: streaming 44.8%, cable 24.1%, broadcast 20.1%",
    title: "Streaming eclipses cable and broadcast for first time",
    outlet: "TheWrap",
    href: "https://www.thewrap.com/streaming-cable-broadcast-tv-ratings-nielsen-the-gauge-may-2025/",
  },
  {
    label: "Amazon Thursday Night Football, about $1 billion a year",
    title: "NFL media rights deal: Amazon gets exclusive Thursday Night Football",
    outlet: "CNBC",
    href: "https://www.cnbc.com/2021/03/18/nfl-media-rights-deal-2023-2033-amazon-gets-exclusive-thursday-night.html",
  },
  {
    label: "Thursday Night Football runs 11 seasons from 2022",
    title: "Amazon NFL deal will begin a year early and run 11 seasons",
    outlet: "GeekWire",
    href: "https://www.geekwire.com/2021/amazon-nfl-deal-thursday-night-football-prime-video-will-begin-year-early-run-11-seasons/",
  },
  {
    label: "Black Friday 2023: about $100 million for rights, about $880,000 per 30-second spot",
    title: "Amazon to debut first-ever NFL Black Friday game",
    outlet: "Yahoo Finance",
    href: "https://finance.yahoo.com/news/amazon-to-debut-first-ever-nfl-black-friday-game--another-blow-to-traditional-tv-153415374.html",
  },
  {
    label: "Black Friday 2023 game drew 9.61 million viewers",
    title: "Amazon Prime's Black Friday NFL game drew 9.61 million viewers",
    outlet: "Next TV",
    href: "https://nexttv.com/news/amazon-primes-black-friday-nfl-game-drew-961-million-viewers",
  },
  {
    label: "YouTube Sunday Ticket, about $2 billion a year for seven years",
    title: "YouTube to pay $14 billion for NFL's Sunday Ticket rights",
    outlet: "Bloomberg",
    href: "https://www.bloomberg.com/news/articles/2022-12-22/youtube-googl-snags-nfl-s-sunday-ticket-rights-in-latest-shift-online",
  },
  {
    label: "Peacock playoff game, about $110 million",
    title: "Peacock signs $110 million deal for first exclusive streamed NFL playoff game",
    outlet: "Next TV",
    href: "https://www.nexttv.com/news/peacock-to-host-first-ever-exclusive-live-streamed-nfl-playoff-game",
  },
  {
    label: "Peacock Wild Card game, about 23 million viewers",
    title: "Dolphins-Chiefs playoff game on Peacock sets streaming record",
    outlet: "Associated Press via WPTV",
    href: "https://www.wptv.com/sports/football/dolphins/dolphins-chiefs-playoff-game-on-peacock-sets-streaming-record-with-average-of-23-million-viewers",
  },
  {
    label: "Netflix Christmas games, about $75 million per game",
    title: "Report: Netflix will pay about $75 million each for Christmas games",
    outlet: "NBC Sports",
    href: "https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/report-netflix-will-pay-about-75-million-each-for-christmas-games",
  },
  {
    label: "NBA deal: $76 billion, 11 years, Disney $2.6B and NBC $2.5B a year",
    title: "NBA signs new 11-year media rights deal with Disney, NBC and Amazon",
    outlet: "Indianapolis Business Journal (AP)",
    href: "https://www.ibj.com/articles/nba-new-11-year-media-rights-deal-with-disney-nbc-and-amazon-worth-76b",
  },
  {
    label: "Amazon NBA package, about $20 billion over 11 years",
    title: "$20 billion says you're going to watch a lot of NBA on Amazon Prime",
    outlet: "Tubefilter",
    href: "https://www.tubefilter.com/2024/07/25/nba-wnba-amazon-prime-video-rights-deal/",
  },
  {
    label: "Apple and MLS, $2.5 billion over 10 years from 2023",
    title: "Apple and Major League Soccer streaming details",
    outlet: "Front Office Sports",
    href: "https://frontofficesports.com/apple-major-league-soccer-streaming-details",
  },
  {
    label: "Apple and MLS deal now ends after 2028-29",
    title: "MLS Apple TV deal ends in 2029, years ahead of schedule",
    outlet: "AppleInsider",
    href: "https://appleinsider.com/articles/25/11/14/mls-apple-tv-deal-ends-in-2029-years-ahead-of-schedule",
  },
  {
    label: "Apple Friday Night Baseball, $85 million a year",
    title: "Apple on the hook for $85 million over seven years for MLB streaming",
    outlet: "AppleInsider (citing Forbes)",
    href: "https://appleinsider.com/articles/22/03/09/apple-on-the-hook-for-85-million-over-seven-years-for-mlb-streaming",
  },
  {
    label: "Netflix and WWE Raw, $5 billion over 10 years",
    title: "Netflix pins exclusive rights to WWE Raw in 10-year, $5B deal",
    outlet: "Sports Video Group",
    href: "https://www.sportsvideo.org/2024/01/23/streamer-stunner-netflix-pins-exclusive-rights-to-wwe-monday-night-raw-in-landmark-10-year-5b-deal/",
  },
  {
    label: "Streaming every NFL game in 2024: about $858 with YouTube TV",
    title: "NFL cost breakdown: how much to stream every game in 2024",
    outlet: "NBC Washington",
    href: "https://www.nbcwashington.com/news/sports/nfl/nfl-cost-breakdown-stream-every-game-2024/",
  },
  {
    label: "Average pay-TV bill in 2015: $99.10 a month",
    title: "Average pay-TV bill up more than 9% in one year to $99.10",
    outlet: "StreamTV Insider (Leichtman Research Group)",
    href: "https://www.streamtvinsider.com/cable/average-pay-tv-bill-up-more-than-9-one-year-to-99-10-leichtman-says",
  },
  {
    label: "Venu Sports injunction and $42.99 launch price",
    title: "Judge blocks ESPN, Fox, Warner sports streaming venture Venu",
    outlet: "ESPN",
    href: "https://www.espn.com/espn/story/_/id/40884759/judge-blocks-espn-fox-warner-sports-streaming-venture-venu",
  },
  {
    label: "Venu Sports dropped in January 2025",
    title: "ESPN, Fox, Warner Bros. shut down joint streaming app Venu Sports",
    outlet: "Mediaite",
    href: "https://www.mediaite.com/media/sports/espn-fox-warner-bros-shut-down-joint-streaming-app-venu-sports/",
  },
  {
    label: "79% of viewers found interactive ads more engaging (Amazon-commissioned)",
    title: "Interactive video ads research with Publicis Media",
    outlet: "Amazon Ads",
    href: "https://advertising.amazon.com/library/expert-advice/publicismedia-iva-research",
  },
];

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
    when: "Physical presence",
    title: "The Arena",
    body: "The Colosseum seated about 50,000 people. Access was physical, ranked, and local, and where you sat showed where you stood.",
  },
  {
    art: <EraRadio />,
    when: "Audio access · 1920s",
    title: "Radio",
    body: "Radio broke geography. Millions could hear the same fight at once, and their attention became what broadcasters sold.",
  },
  {
    art: <EraTV />,
    when: "Visual access · 1950s",
    title: "Television",
    body: "TV brought the spectacle home and rights fees ballooned. The 2025 Super Bowl drew 127.7 million US viewers, the largest audience in American TV history.",
  },
  {
    art: <EraStream />,
    when: "On demand · 2020s",
    title: "Streaming",
    body: "The internet unbundled TV, then rebundled it at a higher price, with live sport as the main reason to subscribe.",
  },
  {
    art: <EraNext />,
    when: "Commerce and AI · 2030s",
    title: "What's Next",
    body: "Shoppable ads, personalized feeds, and in-stream betting turn the broadcast into a place to buy things.",
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
      .querySelectorAll<SVGPathElement>(
        ".col-chart .line-stream, .col-chart .line-tv, .col-chart .line-bc",
      )
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
            const t = Math.min(Math.max((now - start) / 1300, 0), 1);
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
                holding the bill.
              </p>
              <p className="col-byline">Mohamad Noor-Chowdhury · 2025, updated November 2026</p>
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
              <dt>In rights deals since 2021 that put games on streaming</dt>
              <dd>
                <Count value={110} prefix="~$" suffix="B" />
              </dd>
            </div>
            <div>
              <dt>Paid streaming services the average subscriber pays for</dt>
              <dd>
                <Count value={4} />
              </dd>
            </div>
            <div>
              <dt>A month to follow one NFL season</dt>
              <dd>$136.55</dd>
            </div>
            <div>
              <dt>Cancelled a paid streaming service in the last six months</dt>
              <dd>
                <Count value={39} suffix="%" />
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
              Sport has always followed the dominant medium of its era. Each new medium widened the
              audience and raised the price of the rights.
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
                Each era brought more viewers and more money. The handover is never smooth, because
                incumbents resist and audiences adapt slowly, but no era has gone back to the one
                before it. We are in the middle of one now.
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
              Leagues and streaming platforms each had what the other wanted, and the deals that
              followed served both sides.
            </p>
            <div className="col-teams">
              <div className="col-team col-team--home">
                <h3 className="col-team-head">What leagues gained</h3>
                <ul>
                  <li>
                    <strong>Bigger rights fees</strong>
                    <span>
                      Tech companies with deep pockets could outbid the broadcasters, and did.
                    </span>
                  </li>
                  <li>
                    <strong>Global distribution</strong>
                    <span>
                      Streaming platforms reach viewers worldwide, so one deal can carry a game to a
                      global audience.
                    </span>
                  </li>
                  <li>
                    <strong>Younger viewers</strong>
                    <span>
                      Streaming reaches the 18 to 34 year-olds who have largely left cable and
                      broadcast TV.
                    </span>
                  </li>
                  <li>
                    <strong>New production tools</strong>
                    <span>
                      Multi-angle cameras, real-time stats overlays, and betting odds built into the
                      stream.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-team col-team--away">
                <h3 className="col-team-head">What streamers gained</h3>
                <ul>
                  <li>
                    <strong>Subscribers</strong>
                    <span>
                      Live sport drives sign-ups on game nights and keeps people subscribed through
                      the season.
                    </span>
                  </li>
                  <li>
                    <strong>Credibility</strong>
                    <span>
                      Carrying a major league tells the market a streamer is a serious media
                      company.
                    </span>
                  </li>
                  <li>
                    <strong>First-party data</strong>
                    <span>
                      Signed-in viewers reveal their household, their buying habits, and what they
                      like.
                    </span>
                  </li>
                  <li>
                    <strong>Commerce</strong>
                    <span>
                      Following Amazon's lead, every ad break becomes a place to shop, and the game
                      becomes a path to a purchase.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-figure-strip">
              <p className="col-big">$69</p>
              <p>
                a month is what the average US streaming subscriber pays across{" "}
                <strong>four paid services</strong>, according to Deloitte's 2025 survey. Cable and
                satellite customers in the same survey paid $125. The audience has already moved.
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
              The pandemic sped all of this up. With stadiums empty and people stuck at home,
              households dropped cable and signed up for streaming services in record numbers.
            </p>
            <figure className="col-chart">
              <figcaption className="col-h3">Share of US TV viewing time, by source</figcaption>
              <svg
                viewBox={`0 0 ${CH.w} ${CH.h}`}
                role="img"
                aria-label="Streaming rose from 26% of US TV viewing in May 2021 to 44.8% in May 2025, while cable fell from 39% to 24.1% and broadcast from 25% to 20.1%"
              >
                <g className="grid">
                  {[0, 10, 20, 30, 40, 50].map((v) => (
                    <line key={v} x1={CH.l} x2={CH.w - CH.r} y1={cy(v)} y2={cy(v)} />
                  ))}
                </g>
                <g className="axis">
                  {[0, 25, 50].map((v) => (
                    <text key={v} x={CH.l - 12} y={cy(v) + 4} textAnchor="end">
                      {v}%
                    </text>
                  ))}
                  {gaugeYears.map((y, i) => (
                    <text key={y} x={cx(i)} y={CH.h - 10} textAnchor="middle">
                      {y}
                    </text>
                  ))}
                </g>
                <path className="line-tv" d={line(gauge.cable)} />
                <path className="line-bc" d={line(gauge.broadcast)} />
                <path className="line-stream" d={line(gauge.streaming)} />
                <circle className="covid-dot" cx={cx(1)} cy={cy(gaugeEnd.streaming)} r={8} />
                <text
                  className="end-label"
                  x={cx(1) + 16}
                  y={cy(gaugeEnd.streaming) + 5}
                  fill="oklch(0.52 0.12 45)"
                >
                  Streaming 44.8%
                </text>
                <text
                  className="end-label"
                  x={cx(1) + 16}
                  y={cy(gaugeEnd.cable) + 5}
                  fill="oklch(0.357 0.054 263)"
                >
                  Cable 24.1%
                </text>
                <text
                  className="end-label"
                  x={cx(1) + 16}
                  y={cy(gaugeEnd.broadcast) + 9}
                  fill="oklch(0.47 0.07 126)"
                >
                  Broadcast 20.1%
                </text>
              </svg>
              <ul className="col-legend">
                <li>
                  <i style={{ background: "var(--terra-ink)" }} />
                  Streaming
                </li>
                <li>
                  <i style={{ background: "var(--navy)" }} />
                  Cable
                </li>
                <li>
                  <i style={{ background: "var(--sage-ink)" }} />
                  Broadcast
                </li>
                <li>
                  <i className="dot" style={{ background: "var(--mustard)" }} />
                  Streaming passes cable and broadcast combined
                </li>
              </ul>
              <p className="col-note" style={{ marginTop: 16 }}>
                Source: Nielsen, The Gauge. May 2021 was its first month; in May 2025 streaming took
                44.8% of viewing against 44.2% for cable and broadcast together.
              </p>
            </figure>
            <div className="col-facts">
              <div className="col-fact">
                <p className="col-fact-num">7.2M</p>
                <h3>Pay-TV subscriptions lost in 2020</h3>
                <p>
                  S&amp;P Global's Kagan counted nearly 7.2 million cable and satellite
                  cancellations in a single year.
                </p>
              </div>
              <div className="col-fact">
                <p className="col-fact-num">3 → 5</p>
                <h3>Streaming services per subscriber</h3>
                <p>
                  Deloitte found the average subscriber held five paid services by late 2020, up
                  from three just before the pandemic.
                </p>
              </div>
              <div className="col-fact">
                <p className="col-fact-num">2021</p>
                <h3>The first exclusive national NFL package goes to a streamer</h3>
                <p>
                  Amazon had streamed NFL games before as a simulcast. In March 2021 it signed for
                  Thursday Night Football outright.
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
              When Amazon won exclusive rights to Thursday Night Football in 2021, it was testing a
              model the rest of the industry would copy.
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
                    <td>Thursday Night Football (exclusive)</td>
                    <td>11 seasons, 2022 to 2032</td>
                    <td className="num">~$1B/yr</td>
                  </tr>
                  <tr className="sub">
                    <td>Per game</td>
                    <td>15 to 17 games a season</td>
                    <td>Reported, not disclosed</td>
                    <td className="num">$59M to $67M</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-prose col-block">
              <h3 className="col-h3">2023: The Black Friday game</h3>
              <p style={{ color: "var(--ink)" }}>
                In 2023 Amazon paid a reported $100 million for the rights to one more game, the
                first NFL game ever played on Black Friday, between the Dolphins and the Jets.
                Football was only part of the point.
              </p>
              <p>
                Amazon wanted to start a new holiday habit inside its own app. Instead of heading to
                the stores on Black Friday, viewers would shop while watching the most-watched sport
                in the United States, with targeted ads running alongside the game. The broadcast
                drew 9.61 million viewers.
              </p>
            </div>

            <div className="col-block">
              <h3 className="col-h3">How the Black Friday game paid for itself</h3>
              <div className="col-flow">
                <div className="col-flow-step">
                  <h4>Acquire</h4>
                  <p className="amount">$100M</p>
                  <p>
                    Amazon reportedly paid about $100 million for exclusive rights, a loss leader
                    meant to prove the model.
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
                    Ad Age reported about $880,000 per 30-second spot, double Amazon's usual
                    Thursday rate, and Amazon said the game sold out. Amazon has not said how many
                    spots it sold, so I watched the broadcast several times and counted 58
                    thirty-second spots. At that price, those ads alone brought in about $51
                    million, roughly half the rights fee, before a single product was sold.
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
                    Instead of fighting crowds, viewers could shop from the couch. Amazon used its
                    own customer data to target the ads, and many carried QR codes that led straight
                    to product pages. Every scan also sent data back to Amazon for its next
                    campaign, so the game doubled as a data collection exercise.
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
              The ad revenue is visible, and sales from shoppable ads can be tracked. The bigger
              prize, and the reason tech companies outbid broadcasters, is first-party data about
              viewers who are signed in.
            </p>
            <div className="col-bars">
              <h3 className="col-h3">Black Friday game: what came in against the rights fee</h3>
              <div className="col-bar col-bar--cost">
                <div className="col-bar-meta">
                  <span>Rights fee (reported)</span>
                  <b>−$100M</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 100 }} />
                </div>
              </div>
              <div className="col-bar col-bar--ads">
                <div className="col-bar-meta">
                  <span>30-second ads: 58 spots counted in the broadcast × $880K</span>
                  <b>+$51.04M</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 51 }} />
                </div>
              </div>
              <div className="col-bar col-bar--unknown">
                <div className="col-bar-meta">
                  <span>Shorter ads, shoppable ads, and product sales</span>
                  <b>Not disclosed</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 38 }} />
                </div>
              </div>
              <div className="col-bar col-bar--data">
                <div className="col-bar-meta">
                  <span>Value of the first-party data</span>
                  <b>Not measured</b>
                </div>
                <div className="col-bar-track">
                  <div className="col-bar-fill" style={{ ["--w" as string]: 82 }} />
                </div>
              </div>
              <p className="col-note" style={{ marginTop: 24 }}>
                The last two bars show the argument, not data: Amazon has not disclosed these
                amounts. The 58 spots are my own count from repeated viewings of the broadcast, and
                cover 30-second spots only; Amazon has not published a number.
              </p>
            </div>
            <div className="col-pair">
              <div>
                <strong>$880K</strong>
                <span>Reported price of a 30-second spot (Ad Age)</span>
              </div>
              <div>
                <strong>9.61M</strong>
                <span>Average viewers (Nielsen)</span>
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
              Once Amazon showed the model worked, the NFL's other packages and the other leagues
              followed it to streaming.
            </p>

            <div className="col-table-wrap col-block">
              <table className="col-table">
                <caption>NFL streaming deals: about $25B committed</caption>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Package</th>
                    <th>Signed</th>
                    <th>Term</th>
                    <th className="num">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amazon Prime Video</td>
                    <td>Thursday Night Football (exclusive)</td>
                    <td>2021</td>
                    <td>11 seasons</td>
                    <td className="num">~$1B/yr</td>
                  </tr>
                  <tr>
                    <td>YouTube</td>
                    <td>Sunday Ticket</td>
                    <td>2022</td>
                    <td>7 seasons</td>
                    <td className="num">~$2B/yr</td>
                  </tr>
                  <tr>
                    <td>Peacock (NBC)</td>
                    <td>One exclusive Wild Card game</td>
                    <td>2023</td>
                    <td>1 game</td>
                    <td className="num">~$110M</td>
                  </tr>
                  <tr>
                    <td>Netflix</td>
                    <td>Christmas Day games</td>
                    <td>2024</td>
                    <td>3 seasons</td>
                    <td className="num">~$75M/game</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-block">
              <p className="col-note" style={{ maxWidth: "var(--measure)" }}>
                The NBA's 11-year, $76 billion agreement starts with the 2025-26 season. It pays for
                games on ABC, ESPN and NBC as well as streaming; Amazon's package is the
                streaming-only one.
              </p>
              <div className="col-table-wrap">
                <table className="col-table">
                  <caption>NBA media rights from 2025-26: $76B over 11 years</caption>
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
                      <td>Amazon Prime Video</td>
                      <td>Regular season, NBA Cup, play-in, playoffs</td>
                      <td>11 seasons</td>
                      <td className="num">~$1.8B/yr</td>
                    </tr>
                    <tr>
                      <td>NBC / Peacock</td>
                      <td>Up to 100 regular-season games, playoffs</td>
                      <td>11 seasons</td>
                      <td className="num">~$2.5B/yr</td>
                    </tr>
                    <tr>
                      <td>ESPN / ABC</td>
                      <td>80 regular-season games, the NBA Finals</td>
                      <td>11 seasons</td>
                      <td className="num">~$2.6B/yr</td>
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
                <p>
                  Apple, 10 seasons from 2023, every match worldwide. In November 2025 the two sides
                  agreed to end it early, after the 2028-29 season.
                </p>
              </div>
              <div className="col-fact">
                <h3 style={{ marginTop: 0 }}>MLB</h3>
                <p className="col-fact-num" style={{ marginTop: 8 }}>
                  $85M/yr
                </p>
                <p>Apple TV+ Friday Night Baseball from 2022, as reported by Forbes.</p>
              </div>
              <div className="col-fact">
                <h3 style={{ marginTop: 0 }}>WWE / Netflix</h3>
                <p className="col-fact-num" style={{ marginTop: 8 }}>
                  $5B
                </p>
                <p>10 years. Raw left cable for Netflix in January 2025.</p>
              </div>
            </div>

            <div className="col-total">
              <div>
                <h3>Committed in the deals above</h3>
                <p className="col-big">
                  <Count value={110} prefix="~$" suffix="B" />
                </p>
                <p className="who">NFL · NBA · MLS · MLB · WWE</p>
              </div>
              <p>
                Since 2021 the NFL, NBA, MLS, MLB and WWE have signed deals worth about{" "}
                <strong>$110 billion</strong> that put games on streaming services. The NBA's $76
                billion is the largest piece and also pays for broadcast games, so the
                streaming-only share is smaller. Live sport was the last big reason to keep cable,
                and the leagues sold it to the highest bidders.
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
              Leagues and platforms negotiated with each other. The fan was not at the table.
            </p>
            <ul className="col-pains">
              <li>
                <h3>À la carte chaos</h3>
                <p>
                  To follow a full NFL season, a fan now needs YouTube TV with Sunday Ticket, Amazon
                  Prime, Peacock, ESPN+, and Netflix, because each carries a different package of
                  games and none carries them all. NBC's stations put the 2024 season at about $858
                  through YouTube TV. The fan has to rebuild the bundle they used to get from one
                  provider, and pay more for it.
                </p>
              </li>
              <li>
                <h3>Subscription fatigue</h3>
                <p className="inline-stat">
                  <b>39%</b> of US consumers cancelled a paid streaming service in the last six
                  months (Deloitte, 2025)
                </p>
                <p>
                  Fans sign up for the big game, cancel after it, and come back for the next one.
                  Deloitte found 24% of consumers cancelled and resubscribed to the same service
                  within six months, and platforms spend the off-season winning them back with
                  discounts.
                </p>
              </li>
              <li>
                <h3>Toll road mentality</h3>
                <p>
                  Playoff games now sit behind streaming subscriptions too. The January 2024 Wild
                  Card game between the Dolphins and the Chiefs streamed only on Peacock, so a game
                  that once would have aired free on broadcast TV required a paid subscription. It
                  still drew about 23 million viewers. Live sport, once free over the air, is
                  becoming a toll road.
                </p>
              </li>
            </ul>

            <div className="col-block">
              <h3 className="col-h3">The true cost: an NFL fan's monthly bill</h3>
              <div className="col-board">
                <div className="col-board-head">
                  <h4>Full NFL season access, 2025 list prices</h4>
                  <p>Monthly cost, with yearly charges divided by 12</p>
                </div>
                <ul>
                  <li>
                    <span>YouTube TV (base plan)</span>
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
                    <span>Netflix (Standard with ads)</span>
                    <b>$7.99</b>
                  </li>
                </ul>
                <div className="col-board-total">
                  <span>Total monthly</span>
                  <b>$136.55</b>
                </div>
              </div>
              <p className="col-board-note">
                Author's estimate. In 2015 the average pay-TV bill was $99.10 a month (Leichtman
                Research Group), and a cable package then carried the networks that aired nearly
                every NFL game except Sunday Ticket.
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
                <h3 className="col-team-head">What you get</h3>
                <ul>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Multi-angle cameras</strong>
                      <span>Pick your view and watch replays from any angle.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Personal stats overlays</strong>
                      <span>Real-time player tracking, fantasy data, and predictions.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Betting in the stream</strong>
                      <span>Live odds on screen, and bets placed without leaving the game.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Plus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Access anywhere</strong>
                      <span>Any device, any place, with fewer games locked to a region.</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-team col-team--away">
                <h3 className="col-team-head">What it costs</h3>
                <ul>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Money</strong>
                      <span>$136.55 a month for one sport, before any other entertainment.</span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Hassle</strong>
                      <span>
                        Five apps to manage, each with its own interface, password, and billing
                        date.
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Access</strong>
                      <span>
                        Lower-income households get priced out, and following your team becomes a
                        luxury.
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="sign" aria-hidden="true">
                      <Minus size={20} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>Privacy</strong>
                      <span>
                        Personalization runs on tracking what each viewer watches and buys.
                      </span>
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
              Fans will only put up with so many apps and price rises. Two futures are emerging, and
              the industry will have to pick one.
            </p>

            <div className="col-venu">
              <div className="col-venu-head">
                <h3>Cautionary tale: Venu Sports</h3>
                <span className="col-stamp">
                  <CircleSlash size={18} strokeWidth={2.5} aria-hidden="true" />
                  Shut down before launch
                </span>
              </div>
              <div className="col-venu-grid">
                <div>
                  <h4>The proposed fix</h4>
                  <p>
                    ESPN, Fox, and Warner Bros. Discovery planned a joint service, Venu Sports, to
                    put most of their sports in one app: competitors rebuilding the bundle together.
                  </p>
                  <p className="col-venu-price">$42.99/mo</p>
                  <span>Planned launch price</span>
                </div>
                <div>
                  <h4>The regulators' answer</h4>
                  <p>
                    In August 2024 Judge Margaret Garnett granted Fubo a preliminary injunction,
                    finding that a bundle from three of the largest sports rights holders likely
                    broke antitrust law. In January 2025, after Disney settled with Fubo, the three
                    companies dropped Venu without launching it.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-block">
              <h3 className="col-h3">Two futures</h3>
              <div className="col-paths">
                <div className="col-path">
                  <h4>Re-aggregation</h4>
                  <p>
                    The industry consolidates into one large bundle, through regulators' approval or
                    acquisitions. The fan gets one bill and one app. That is convenient, and it is
                    also how the cable monopoly worked.
                  </p>
                  <ul>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Precedent: the cable bundle before 2015
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Risk: monopoly pricing without competition
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Blocker: antitrust regulators (see Venu Sports)
                    </li>
                  </ul>
                </div>
                <div className="col-path">
                  <h4>Commerce-first</h4>
                  <p>
                    Streaming becomes the wrapper around shopping, with subscription prices
                    subsidized by sales commissions and targeted ads. The fan pays less in money and
                    more in data.
                  </p>
                  <ul>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Precedent: Amazon's Black Friday game
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Evidence: viewers rate interactive ads as more engaging
                    </li>
                    <li>
                      <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
                      Trade-off: your data for a lower price
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-figure-strip col-figure-strip--ruled">
              <p className="col-big">79%</p>
              <p>
                of 7,800 US viewers in a 2026 Amazon Ads and Publicis Media study said interactive
                streaming ads are more engaging than standard ones. The study comes from the company
                selling those ads, but it is the bet behind the commerce-first model.
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
                On the surface, the story of sports media is one of progress: better technology,
                wider access, more content, and global audiences. Those gains are real.
              </p>
              <p>
                But who gained? The leagues secured rights fees no cable network could match. The
                platforms got subscriber growth, credibility as serious media companies, and, most
                valuable of all, data on a scale they never had before.
              </p>
              <p>
                The fan, whose passion made all of it possible, who filled the stadiums, bought the
                jerseys and watched for fifty years, came last in every deal. Their loyalty was
                assumed, their patience was tested, and their wallet was the number everyone planned
                around.
              </p>
              <p>
                The reckoning will come when the audience decides it has had enough. Whether it
                arrives as a new bundle, as regulation, or as a deal built on commerce will shape
                the next era of sports media. One thing already looks settled:{" "}
                <strong>
                  whoever controls the access controls the audience, and whoever controls the
                  audience controls the game.
                </strong>
              </p>
            </div>
            <p className="col-sign">
              <strong>Mohamad Noor-Chowdhury</strong>
              The Future of Sports Media · 2025, updated November 2026
            </p>

            <div className="col-sources">
              <h2 className="col-h3">Sources</h2>
              <ol>
                {sources.map((s) => (
                  <li key={s.href}>
                    <span className="what">{s.label}</span>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.title}
                    </a>
                    <span className="outlet">{s.outlet}</span>
                  </li>
                ))}
              </ol>
            </div>
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
          <span>© 2025 Mohamad Noor-Chowdhury</span>
        </div>
      </footer>
      <BackToTop ground="oklch(0.357 0.054 263)" ink="oklch(0.806 0.142 89)" />
    </div>
  );
}
