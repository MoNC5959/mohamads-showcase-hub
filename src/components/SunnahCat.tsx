interface SunnahCatProps {
  /** -1 = looking left, 0 = looking center, 1 = looking right */
  lookDirection: -1 | 0 | 1;
}

/**
 * The standing grey shorthair cat that patrols the blueprint sheet and
 * looks toward whichever box the visitor is considering.
 */
export default function SunnahCat({ lookDirection }: SunnahCatProps) {
  const pupilShift = lookDirection * 1.6;

  return (
    <svg
      viewBox="0 0 120 132"
      aria-label="Sunnah, a grey shorthair cat"
      style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}
    >
      <g>
        <path
          d="M84 122 C 102 122 110 110 108 94 C 107 86 102 80 98 78"
          fill="none"
          stroke="var(--color-neutral-800)"
          strokeWidth={11}
          strokeLinecap="round"
        />
        <path
          d="M84 122 C 102 122 110 110 108 94 C 107 86 102 80 98 78"
          fill="none"
          stroke="var(--color-neutral-500)"
          strokeWidth={8.5}
          strokeLinecap="round"
        />
      </g>
      <path
        d="M60 52 C 41 52 31 76 31 100 C 31 116 35 128 46 128 L 74 128 C 85 128 89 116 89 100 C 89 76 79 52 60 52 Z"
        fill="var(--color-neutral-500)"
        stroke="var(--color-neutral-800)"
        strokeWidth={1.25}
      />
      <path
        d="M60 64 C 52 64 48 76 50 90 C 53 98 67 98 70 90 C 72 76 68 64 60 64 Z"
        fill="var(--color-neutral-400)"
      />
      <path
        d="M35 108 C 38 96 49 97 51 113 M85 108 C 82 96 71 97 69 113"
        fill="none"
        stroke="var(--color-neutral-700)"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      <g>
        <rect x={46} y={94} width={12} height={34} rx={6} fill="var(--color-neutral-500)" stroke="var(--color-neutral-800)" strokeWidth={1.25} />
        <path d="M50 124 v3.5 M54 124 v3.5" stroke="var(--color-neutral-700)" strokeWidth={1} strokeLinecap="round" />
      </g>
      <g>
        <rect x={62} y={94} width={12} height={34} rx={6} fill="var(--color-neutral-500)" stroke="var(--color-neutral-800)" strokeWidth={1.25} />
        <path d="M66 124 v3.5 M70 124 v3.5" stroke="var(--color-neutral-700)" strokeWidth={1} strokeLinecap="round" />
      </g>
      <g>
        <path
          d="M33 34 L29 7 L53 22 Z M87 34 L91 7 L67 22 Z"
          fill="var(--color-neutral-500)"
          stroke="var(--color-neutral-800)"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        <path d="M35.5 29 L33 13.5 L47 22.5 Z M84.5 29 L87 13.5 L73 22.5 Z" fill="var(--color-neutral-300)" />
        <path
          d="M60 19 C 79 19 91 29 92 44 C 93 59 78 67 60 67 C 42 67 27 59 28 44 C 29 29 41 19 60 19 Z"
          fill="var(--color-neutral-500)"
          stroke="var(--color-neutral-800)"
          strokeWidth={1.25}
        />
        <path d="M55 23 v6 M60 22 v7.5 M65 23 v6" stroke="var(--color-neutral-600)" strokeWidth={1.6} strokeLinecap="round" />
        <ellipse cx={54.5} cy={53.5} rx={7} ry={5.5} fill="var(--color-neutral-400)" />
        <ellipse cx={65.5} cy={53.5} rx={7} ry={5.5} fill="var(--color-neutral-400)" />
        <g>
          <ellipse cx={46.5} cy={41} rx={6.5} ry={7} fill="var(--color-accent-400)" stroke="var(--color-neutral-800)" strokeWidth={1.1} />
          <ellipse cx={73.5} cy={41} rx={6.5} ry={7} fill="var(--color-accent-400)" stroke="var(--color-neutral-800)" strokeWidth={1.1} />
          <g style={{ transition: "transform 260ms ease" }} transform={`translate(${pupilShift} 0)`}>
            <ellipse cx={46.5} cy={41} rx={2.2} ry={5.4} fill="var(--color-neutral-900)" />
            <ellipse cx={73.5} cy={41} rx={2.2} ry={5.4} fill="var(--color-neutral-900)" />
            <circle cx={48.3} cy={38.4} r={1.3} fill="var(--color-neutral-100)" />
            <circle cx={75.3} cy={38.4} r={1.3} fill="var(--color-neutral-100)" />
          </g>
        </g>
        <path d="M57 49.5 L63 49.5 L60 53 Z" fill="var(--color-neutral-700)" stroke="var(--color-neutral-800)" strokeWidth={0.8} strokeLinejoin="round" />
        <path
          d="M60 53 V55.5 M60 55.5 C 58.5 58 55.5 58 54.5 56 M60 55.5 C 61.5 58 64.5 58 65.5 56"
          fill="none"
          stroke="var(--color-neutral-800)"
          strokeWidth={1}
          strokeLinecap="round"
        />
        <path
          d="M46 52 L23 48.5 M46 55 L23 57.5 M74 52 L97 48.5 M74 55 L97 57.5"
          stroke="var(--color-neutral-800)"
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.6}
        />
      </g>
    </svg>
  );
}
