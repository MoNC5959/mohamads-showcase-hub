import { forwardRef, useImperativeHandle, useRef } from "react";
import { CatHead } from "./SunnahCat";

export interface SunnahWalkerHandle {
  /** phase counts completed strides, swing is the leg angle in degrees, facing runs -1 (left) to 1 (right). */
  update: (phase: number, swing: number, facing: number) => void;
}

/** Hip-to-floor length of the legs, in the drawing's own units. The scene uses it to pace her stride. */
export const WALKER_LEG_LENGTH = 34;

// A cat's walk: back left, front left, back right, front right, each a quarter stride apart.
export const LEGS = [
  { x: 27, top: 90, length: 36, offset: 0.5, far: true },
  { x: 72, top: 90, length: 36, offset: 0.75, far: true },
  { x: 13, top: 94, length: WALKER_LEG_LENGTH, offset: 0, far: false },
  { x: 82, top: 94, length: WALKER_LEG_LENGTH, offset: 0.25, far: false },
];

export const FULL_SWING = 30;
const FOOT_LIFT = 9;

export function legTransform(leg: (typeof LEGS)[number], phase: number, swing: number) {
  const turn = 2 * Math.PI * (phase + leg.offset);
  const angle = -swing * Math.sin(turn);
  // The foot travels forward on the lifted half and back along the floor on the planted half.
  const lift = Math.max(0, Math.cos(turn)) * (swing / FULL_SWING) * FOOT_LIFT;
  const planted = leg.length * (1 - Math.cos((angle * Math.PI) / 180));
  return `translate(${leg.x} ${leg.top + planted - lift}) rotate(${angle})`;
}

const facingTransform = (facing: number) => `translate(60 0) scale(${facing} 1) translate(-60 0)`;

/**
 * Sunnah on all fours, in profile and facing right. The scene drives every
 * pose directly so her steps stay locked to the distance she covers.
 */
const SunnahWalker = forwardRef<SunnahWalkerHandle>(function SunnahWalker(_, ref) {
  const rootRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const legRefs = useRef<(SVGGElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    update(phase, swing, facing) {
      const effort = swing / FULL_SWING;
      rootRef.current?.setAttribute("transform", facingTransform(facing));
      LEGS.forEach((leg, i) => legRefs.current[i]?.setAttribute("transform", legTransform(leg, phase, swing)));
      bodyRef.current?.setAttribute("transform", `translate(0 ${1.6 * effort * Math.sin(4 * Math.PI * phase)})`);
      tailRef.current?.setAttribute("transform", `rotate(${7 * effort * Math.sin(2 * Math.PI * phase)} -2 78)`);
    },
  }));

  const renderLeg = (leg: (typeof LEGS)[number], i: number) => {
    const fill = leg.far ? "color-mix(in srgb, var(--color-neutral-500) 62%, var(--color-bg))" : "var(--color-neutral-500)";
    return (
      <g
        key={i}
        ref={(el) => {
          legRefs.current[i] = el;
        }}
        transform={legTransform(leg, 0, 0)}
      >
        <rect x={-6.5} y={-6} width={13} height={leg.length + 6} rx={6.5} fill={fill} stroke="var(--color-neutral-800)" strokeWidth={1.25} />
        <path
          d={`M-2.5 ${leg.length - 4} v3.5 M2 ${leg.length - 4} v3.5`}
          stroke="var(--color-neutral-700)"
          strokeWidth={1}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 120 132" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
      <g ref={rootRef} transform={facingTransform(1)}>
        {LEGS.filter((leg) => leg.far).map((leg) => renderLeg(leg, LEGS.indexOf(leg)))}
        <g ref={bodyRef}>
          <g ref={tailRef}>
            <path d="M-2 78 C-22 72 -29 52 -18 36" fill="none" stroke="var(--color-neutral-800)" strokeWidth={11} strokeLinecap="round" />
            <path d="M-2 78 C-22 72 -29 52 -18 36" fill="none" stroke="var(--color-neutral-500)" strokeWidth={8.5} strokeLinecap="round" />
          </g>
          <path
            d="M-6 84 C-6 68 8 62 24 64 C44 66 62 64 78 62 C92 60 100 72 96 88 C92 102 80 104 66 102 L14 102 C0 102 -6 96 -6 84 Z"
            fill="var(--color-neutral-500)"
            stroke="var(--color-neutral-800)"
            strokeWidth={1.25}
          />
          <path d="M18 95 C32 102 62 102 76 95 C68 89 26 89 18 95 Z" fill="var(--color-neutral-400)" />
          <path d="M12 66 v8 M23 65 v9 M34 66 v8" stroke="var(--color-neutral-600)" strokeWidth={1.6} strokeLinecap="round" />
        </g>
        {LEGS.filter((leg) => !leg.far).map((leg) => renderLeg(leg, LEGS.indexOf(leg)))}
        <g transform="translate(46 12) scale(0.82)">
          <CatHead lookDirection={1} />
        </g>
      </g>
    </svg>
  );
});

export default SunnahWalker;
