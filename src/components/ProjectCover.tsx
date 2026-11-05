import type { CSSProperties, ReactNode } from "react";

const INK = "var(--color-text)";
const ACCENT = "var(--color-accent-300)";
const SHEET = "var(--color-bg)";

const heavy: CSSProperties = { fill: SHEET, stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" };
const mid: CSSProperties = { fill: "none", stroke: INK, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" };
const thin: CSSProperties = { fill: "none", stroke: INK, strokeWidth: 1, opacity: 0.55 };
const dashed: CSSProperties = { fill: "none", stroke: ACCENT, strokeWidth: 2, strokeDasharray: "3 8", strokeLinecap: "round" };
const label: CSSProperties = {
  fill: INK,
  fontFamily: "var(--font-heading)",
  fontSize: 17,
  fontWeight: 600,
  letterSpacing: "0.06em",
};

const range = (start: number, end: number, step = 1) => {
  const out: number[] = [];
  for (let n = start; n <= end; n += step) out.push(n);
  return out;
};

/** A drafting dimension line with end ticks. */
function Dimension({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g style={thin}>
      <path d={`M${x1} ${y}H${x2}M${x1} ${y - 8}V${y + 8}M${x2} ${y - 8}V${y + 8}`} />
    </g>
  );
}

function Aircraft({ labelled }: { labelled: boolean }) {
  const fuselage = "M70 290C90 250 140 222 210 218L770 218C800 218 860 200 900 190L900 205C860 250 800 330 720 342L210 342C140 342 90 330 70 290Z";
  return (
    <>
      <defs>
        <clipPath id="cover-fuselage">
          <path d={fuselage} />
        </clipPath>
      </defs>
      <path d="M760 218L850 76L892 76L856 205Z" style={heavy} />
      <path d="M840 238L920 204L932 212L862 256Z" style={heavy} />
      <path d={fuselage} style={heavy} />
      <g clipPath="url(#cover-fuselage)">
        {range(180, 780, 44).map((x) => (
          <path key={x} d={`M${x} 212V348`} style={thin} />
        ))}
        <rect x={500} y={200} width={88} height={160} style={{ fill: ACCENT }} />
        <path d="M60 322H920" style={thin} />
      </g>
      {range(196, 740, 22).map((x) => (
        <rect key={x} x={x} y={246} width={9} height={14} rx={4} style={{ ...mid, strokeWidth: 1.5, fill: SHEET }} />
      ))}
      <path d="M112 256L150 238L176 238L176 262L112 262Z" style={{ ...mid, fill: SHEET }} />
      <path d="M430 322L286 452L340 452L572 326Z" style={heavy} />
      <rect x={330} y={366} width={104} height={40} rx={18} style={heavy} />
      <path d="M352 366V406M412 366V406" style={thin} />
      <path d="M544 66L500 218M544 66L588 218" style={dashed} />
      <circle cx={544} cy={58} r={9} style={{ fill: ACCENT }} />
      {labelled && (
        <>
          <text x={566} y={50} style={label}>
            FRAME 38
          </text>
          <text x={566} y={72} style={{ ...label, fontWeight: 400 }}>
            3.2 MM OFFSET
          </text>
        </>
      )}
      <Dimension x1={70} x2={900} y={490} />
    </>
  );
}

function VaultToPhone() {
  const cx = 296;
  const cy = 270;
  return (
    <>
      <rect x={70} y={174} width={36} height={52} style={heavy} />
      <rect x={70} y={314} width={36} height={52} style={heavy} />
      <circle cx={cx} cy={cy} r={206} style={heavy} />
      <circle cx={cx} cy={cy} r={172} style={mid} />
      {range(0, 345, 15).map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return <circle key={deg} cx={cx + Math.cos(rad) * 189} cy={cy + Math.sin(rad) * 189} r={5} style={{ ...mid, fill: SHEET }} />;
      })}
      <circle cx={cx} cy={cy} r={118} style={thin} />
      {[0, 60, 120].map((deg) => (
        <path key={deg} d={`M${cx - 124} ${cy}H${cx + 124}`} transform={`rotate(${deg} ${cx} ${cy})`} style={{ ...mid, strokeWidth: 8 }} />
      ))}
      <circle cx={cx} cy={cy} r={52} style={heavy} />
      <circle cx={cx} cy={cy} r={14} style={{ fill: ACCENT }} />
      <path d={`M${cx} ${cy - 206}L758 196M${cx} ${cy + 206}L758 344`} style={dashed} />
      <rect x={656} y={42} width={204} height={456} rx={30} style={heavy} />
      <rect x={672} y={84} width={172} height={366} rx={6} style={mid} />
      <path d="M736 62H780" style={mid} />
      <circle cx={758} cy={270} r={74} style={{ fill: ACCENT }} />
      <circle cx={758} cy={270} r={56} style={{ fill: "none", stroke: SHEET, strokeWidth: 2 }} />
      {[0, 60, 120].map((deg) => (
        <path key={deg} d="M718 270H798" transform={`rotate(${deg} 758 270)`} style={{ fill: "none", stroke: SHEET, strokeWidth: 4, strokeLinecap: "round" }} />
      ))}
      <circle cx={758} cy={270} r={17} style={{ fill: SHEET }} />
    </>
  );
}

function BuildingToTokens() {
  const cell = 26;
  const rows = range(0, 11);
  return (
    <>
      <rect x={70} y={68} width={226} height={404} style={heavy} />
      <rect x={46} y={472} width={274} height={22} style={heavy} />
      {rows.map((r) =>
        range(0, 5).map((c) => <rect key={`${r}-${c}`} x={86 + c * 34} y={84 + r * 31} width={24} height={20} style={{ ...mid, strokeWidth: 1.5 }} />)
      )}
      <path d="M296 68L330 68M296 472L330 472" style={thin} />
      {rows.map((r) =>
        range(0, 9).map((c) => {
          const x = 356 + c * 34 + c * c * 2.2;
          const y = 84 + r * 31 + (r - 5.5) * c * 1.4;
          const lit = (c * 3 + r * 5) % 7 === 0;
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={cell - c}
              height={cell - c}
              style={lit ? { fill: ACCENT } : { ...mid, strokeWidth: 1.5, fill: SHEET }}
            />
          );
        })
      )}
      <Dimension x1={70} x2={296} y={516} />
    </>
  );
}

function ArcadeToCloud() {
  const tiers = [
    { y: 356, h: 104, top: 0 },
    { y: 244, h: 104, top: 0 },
    { y: 132, h: 104, top: 0 },
  ];
  const columns = range(0, 8);
  return (
    <>
      <path d="M58 470H640M58 470V128C200 84 420 84 560 112" style={{ ...mid, strokeWidth: 3 }} />
      <path d="M70 348H600M70 236H590" style={mid} />
      {tiers.map((tier) =>
        columns.map((c) => {
          const x = 76 + c * 64;
          const fading = c > 5;
          const d = `M${x} ${tier.y + tier.h}V${tier.y + 30}A24 24 0 0 1 ${x + 48} ${tier.y + 30}V${tier.y + tier.h}`;
          return (
            <path
              key={`${tier.y}-${c}`}
              d={d}
              style={fading ? { ...dashed, stroke: c > 6 ? ACCENT : INK } : { ...mid, strokeWidth: 2.5 }}
            />
          );
        })
      )}
      <path d="M640 330C700 320 700 270 760 250M628 214C690 210 716 214 760 236M624 420C720 410 760 340 800 262" style={dashed} />
      <path
        d="M690 214C650 214 636 170 668 150C662 104 720 86 748 118C774 66 860 76 864 138C908 138 918 214 866 214Z"
        style={{ fill: ACCENT, stroke: ACCENT, strokeWidth: 2, strokeLinejoin: "round" }}
      />
      <path d="M730 170H830M730 190H800" style={{ fill: "none", stroke: SHEET, strokeWidth: 3, strokeLinecap: "round" }} />
      <Dimension x1={58} x2={640} y={500} />
    </>
  );
}

function CardToTerminal() {
  return (
    <>
      <g transform="rotate(-8 280 270)">
        <rect x={60} y={126} width={430} height={270} rx={22} style={heavy} />
        <rect x={100} y={176} width={82} height={60} rx={10} style={{ fill: ACCENT }} />
        <path d="M100 196H182M100 216H182M141 176V236" style={{ fill: "none", stroke: SHEET, strokeWidth: 2 }} />
        {range(0, 3).map((g) =>
          range(0, 3).map((d) => <circle key={`${g}-${d}`} cx={104 + g * 84 + d * 16} cy={320} r={5} style={{ fill: INK }} />)
        )}
        <path d="M100 356H270" style={mid} />
      </g>
      {[0, 1, 2, 3].map((n) => (
        <path key={n} d={`M${520 + n * 22} ${206 - n * 10}A${70 + n * 22} ${70 + n * 22} 0 0 1 ${520 + n * 22} ${334 + n * 10}`} style={{ ...dashed, strokeDasharray: "none", strokeWidth: 4 - n * 0.6 }} />
      ))}
      <rect x={656} y={44} width={230} height={438} rx={26} style={heavy} />
      <rect x={680} y={70} width={182} height={150} rx={8} style={{ fill: ACCENT }} />
      <path d="M736 146L762 172L810 118" style={{ fill: "none", stroke: SHEET, strokeWidth: 8, strokeLinecap: "round", strokeLinejoin: "round" }} />
      {range(0, 3).map((r) =>
        range(0, 2).map((c) => <rect key={`${r}-${c}`} x={688 + c * 60} y={244 + r * 54} width={46} height={38} rx={6} style={mid} />)
      )}
      <rect x={636} y={482} width={270} height={18} rx={4} style={heavy} />
    </>
  );
}

const DRAWINGS: Record<string, (props: { labelled: boolean }) => ReactNode> = {
  "cognitive-qa": Aircraft,
  fintech: VaultToPhone,
  tokenization: BuildingToTokens,
  colosseum: ArcadeToCloud,
  "few-seconds": CardToTerminal,
};

interface ProjectCoverProps {
  slug: string;
  /** Describes the drawing when it stands on its own, outside a titled link. */
  title?: string;
}

/**
 * The cover drawings, all from one drafting set. They read their colors from
 * the surrounding tokens, so a reversed sheet reverses the drawing with it.
 */
export default function ProjectCover({ slug, title }: ProjectCoverProps) {
  const Drawing = DRAWINGS[slug];
  return (
    <svg
      viewBox="0 0 960 540"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {Drawing ? <Drawing labelled={Boolean(title)} /> : null}
    </svg>
  );
}
