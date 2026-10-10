interface SunnahSleeperProps {
  /** 0 = eyes open, 1 = eyes fully closed */
  sleepiness: number;
}

/**
 * Sunnah's head + paws, peeking over the rim of a box. Fades/crossfades
 * in while the standing cat climbs in and settles down for a nap.
 */
export default function SunnahSleeper({ sleepiness }: SunnahSleeperProps) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" style={{ display: "block", width: 120, height: 100, overflow: "visible" }}>
      <defs>
        <clipPath id="sunnah-rim">
          <rect x={-40} y={-80} width={200} height={140} />
        </clipPath>
      </defs>
      <g clipPath="url(#sunnah-rim)">
        <g transform="translate(0 -6)">
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

          <g style={{ opacity: 1 - sleepiness, transition: "opacity 220ms ease" }}>
            <ellipse cx={46.5} cy={41} rx={6.5} ry={7} fill="var(--color-accent-400)" stroke="var(--color-neutral-800)" strokeWidth={1.1} />
            <ellipse cx={73.5} cy={41} rx={6.5} ry={7} fill="var(--color-accent-400)" stroke="var(--color-neutral-800)" strokeWidth={1.1} />
            <ellipse cx={46.5} cy={41} rx={3.4} ry={5.4} fill="var(--color-neutral-900)" />
            <ellipse cx={73.5} cy={41} rx={3.4} ry={5.4} fill="var(--color-neutral-900)" />
          </g>
          <g style={{ opacity: sleepiness, transition: "opacity 220ms ease" }}>
            <path
              d="M40.5 41 Q46.5 45.5 52.5 41 M67.5 41 Q73.5 45.5 79.5 41"
              fill="none"
              stroke="var(--color-neutral-800)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
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
      </g>

      <g style={{ opacity: sleepiness, transition: "opacity 260ms ease" }}>
        <path
          d="M96 58 C 104 60 106 68 103 76"
          fill="none"
          stroke="var(--color-neutral-800)"
          strokeWidth={10.5}
          strokeLinecap="round"
        />
        <path
          d="M96 58 C 104 60 106 68 103 76"
          fill="none"
          stroke="var(--color-neutral-500)"
          strokeWidth={8}
          strokeLinecap="round"
        />
      </g>
      <g style={{ opacity: sleepiness, transition: "opacity 260ms ease" }}>
        <ellipse cx={45} cy={61} rx={10.5} ry={6} fill="var(--color-neutral-500)" stroke="var(--color-neutral-800)" strokeWidth={1.25} />
        <ellipse cx={75} cy={61} rx={10.5} ry={6} fill="var(--color-neutral-500)" stroke="var(--color-neutral-800)" strokeWidth={1.25} />
        <path
          d="M41 63.5 v3 M45 64.2 v3 M49 63.5 v3 M71 63.5 v3 M75 64.2 v3 M79 63.5 v3"
          stroke="var(--color-neutral-700)"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
