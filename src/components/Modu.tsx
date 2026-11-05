import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FULL_SWING, LEGS, WALKER_LEG_LENGTH, legTransform } from "./SunnahWalker";

// Modu's own colors: he's a ginger cat with a white face, chest, belly and paws.
const COAT = "#e08a3c";
const STRIPE = "#b5622a";
const WHITE = "#fbf5ea";
const LINE = "#4e2614";
const PINK = "#f0a6a0";
const EYE = "#c9d36b";
const PUPIL = "#1d1410";

const RUN_SPEED = 476;
const RUN_MS = 5200;
const ROLL_MS = 1800;
const ZOOMIES_CLICKS = 3;
const BRAKING = 1800;
const DRAWING_WIDTH = 120;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface HeadHandle {
  look: (x: number, y: number) => void;
}

/** His face: orange head and ears, with a white blaze over the muzzle and chin. */
const ModuHead = forwardRef<HeadHandle, { blissful?: boolean; lookAhead?: boolean }>(function ModuHead({ blissful = false, lookAhead = false }, ref) {
  const headRef = useRef<SVGGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  useImperativeHandle(ref, () => ({
    look(x, y) {
      headRef.current?.setAttribute("transform", `rotate(${x * 9} 60 52) translate(${x * 2.2} ${y * 1.6})`);
      pupilsRef.current?.setAttribute("transform", `translate(${x * 2.2} ${y * 1.8})`);
    },
  }));

  const head = "M60 19 C 79 19 91 29 92 44 C 93 59 78 67 60 67 C 42 67 27 59 28 44 C 29 29 41 19 60 19 Z";
  return (
    <g ref={headRef}>
      <path d="M33 34 L29 7 L53 22 Z M87 34 L91 7 L67 22 Z" fill={COAT} stroke={LINE} strokeWidth={1.25} strokeLinejoin="round" />
      <path d="M35.5 29 L33 13.5 L47 22.5 Z M84.5 29 L87 13.5 L73 22.5 Z" fill={PINK} />
      <path d={head} fill={COAT} />
      <path d="M55 23 v6 M60 22 v7.5 M65 23 v6" stroke={STRIPE} strokeWidth={1.8} strokeLinecap="round" />
      <path
        d="M60 31 C 55 31 52 38 51 44 C 44 45 36 50 34 56 C 40 64 50 67 60 67 C 70 67 80 64 86 56 C 84 50 76 45 69 44 C 68 38 65 31 60 31 Z"
        fill={WHITE}
      />
      <path d={head} fill="none" stroke={LINE} strokeWidth={1.25} />
      {blissful ? (
        <path d="M40 42 Q46.5 36 53 42 M67 42 Q73.5 36 80 42" fill="none" stroke={LINE} strokeWidth={1.8} strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={46.5} cy={41} rx={6.5} ry={7} fill={EYE} stroke={LINE} strokeWidth={1.1} />
          <ellipse cx={73.5} cy={41} rx={6.5} ry={7} fill={EYE} stroke={LINE} strokeWidth={1.1} />
          <g ref={pupilsRef} transform={lookAhead ? "translate(1.6 0)" : undefined} style={{ transition: "transform 160ms ease" }}>
            <ellipse cx={46.5} cy={41} rx={2.3} ry={5.4} fill={PUPIL} />
            <ellipse cx={73.5} cy={41} rx={2.3} ry={5.4} fill={PUPIL} />
            <circle cx={48.3} cy={38.4} r={1.3} fill={WHITE} />
            <circle cx={75.3} cy={38.4} r={1.3} fill={WHITE} />
          </g>
        </>
      )}
      <path d="M57 49.5 L63 49.5 L60 53 Z" fill={PINK} stroke={LINE} strokeWidth={0.8} strokeLinejoin="round" />
      <path d="M60 53 V55.5 M60 55.5 C 58.5 58 55.5 58 54.5 56 M60 55.5 C 61.5 58 64.5 58 65.5 56" fill="none" stroke={LINE} strokeWidth={1} strokeLinecap="round" />
      <path d="M46 52 L23 48.5 M46 55 L23 57.5 M74 52 L97 48.5 M74 55 L97 57.5" stroke={LINE} strokeWidth={0.8} strokeLinecap="round" opacity={0.55} />
    </g>
  );
});

/** A white paw cap at the bottom of an orange leg, drawn in the leg's own coordinates. */
function Paw({ x, y, width = 12 }: { x: number; y: number; width?: number }) {
  const r = width / 2;
  return <path d={`M${x} ${y} h${width} v${4} a${r} ${r} 0 0 1 ${-width} 0 Z`} fill={WHITE} />;
}

/** Sitting, facing the visitor. */
const ModuSit = forwardRef<HeadHandle>(function ModuSit(_, ref) {
  return (
    <svg viewBox="0 0 120 132" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
      <path d="M84 122 C 104 122 112 110 110 94 C 109 86 104 80 100 78" fill="none" stroke={LINE} strokeWidth={11} strokeLinecap="round" />
      <path d="M84 122 C 104 122 112 110 110 94 C 109 86 104 80 100 78" fill="none" stroke={COAT} strokeWidth={8.5} strokeLinecap="round" />
      <path d="M103 88 l6 -2 M101 100 l7 0" stroke={STRIPE} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M60 52 C 39 52 28 76 28 100 C 28 116 33 128 45 128 L 75 128 C 87 128 92 116 92 100 C 92 76 81 52 60 52 Z" fill={COAT} stroke={LINE} strokeWidth={1.25} />
      <path d="M60 60 C 48 60 43 77 45 95 C 49 108 71 108 75 95 C 77 77 72 60 60 60 Z" fill={WHITE} />
      <path d="M34 80 q5 3 6 8 M86 80 q-5 3 -6 8 M32 94 q5 2 7 6 M88 94 q-5 2 -7 6" fill="none" stroke={STRIPE} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M33 110 C 36 98 48 99 50 114 M87 110 C 84 98 72 99 70 114" fill="none" stroke={LINE} strokeWidth={1.1} strokeLinecap="round" />
      {[46, 62].map((x) => (
        <g key={x}>
          <rect x={x} y={94} width={12} height={34} rx={6} fill={COAT} />
          <Paw x={x} y={118} />
          <rect x={x} y={94} width={12} height={34} rx={6} fill="none" stroke={LINE} strokeWidth={1.25} />
          <path d={`M${x + 4} 124 v3.5 M${x + 8} 124 v3.5`} stroke={LINE} strokeWidth={1} strokeLinecap="round" />
        </g>
      ))}
      <ModuHead ref={ref} />
    </svg>
  );
});

/** Rolled onto his back, belly up, paws in the air. */
function ModuBelly() {
  const legs = [
    { x: 40, y: 99, angle: -24 },
    { x: 52, y: 95, angle: -9 },
    { x: 78, y: 95, angle: 9 },
    { x: 90, y: 99, angle: 24 },
  ];
  return (
    <svg viewBox="0 0 120 132" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
      <path d="M98 118 C 118 126 134 121 138 108" fill="none" stroke={LINE} strokeWidth={11} strokeLinecap="round" />
      <path d="M98 118 C 118 126 134 121 138 108" fill="none" stroke={COAT} strokeWidth={8.5} strokeLinecap="round" />
      {legs.map((leg, i) => (
        <g key={i} transform={`translate(${leg.x} ${leg.y}) rotate(${leg.angle})`}>
          <g className="modu-paw" style={{ animationDelay: `${i * 90}ms` }}>
            <rect x={-6} y={-28} width={12} height={30} rx={6} fill={COAT} />
            <path d="M-6 -22 v-0 a6 6 0 0 1 12 0 v4 h-12 Z" fill={WHITE} />
            <rect x={-6} y={-28} width={12} height={30} rx={6} fill="none" stroke={LINE} strokeWidth={1.25} />
          </g>
        </g>
      ))}
      <ellipse cx={64} cy={110} rx={42} ry={18} fill={COAT} stroke={LINE} strokeWidth={1.25} />
      <ellipse cx={66} cy={103} rx={31} ry={10} fill={WHITE} />
      <path d="M36 116 q4 -4 9 -3 M90 116 q-4 -4 -9 -3" fill="none" stroke={STRIPE} strokeWidth={1.6} strokeLinecap="round" />
      <g transform="translate(20 100) rotate(-78) scale(0.8) translate(-60 -43)">
        <ModuHead blissful />
      </g>
    </svg>
  );
}

interface RunnerHandle {
  update: (phase: number, swing: number, facing: number) => void;
}

/** On all fours in profile, using the same walk cycle as Sunnah. */
const ModuRunner = forwardRef<RunnerHandle>(function ModuRunner(_, ref) {
  const rootRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const legRefs = useRef<(SVGGElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    update(phase, swing, facing) {
      const effort = swing / FULL_SWING;
      rootRef.current?.setAttribute("transform", `translate(60 0) scale(${facing} 1) translate(-60 0)`);
      LEGS.forEach((leg, i) => legRefs.current[i]?.setAttribute("transform", legTransform(leg, phase, swing)));
      bodyRef.current?.setAttribute("transform", `translate(0 ${2 * effort * Math.sin(4 * Math.PI * phase)})`);
      tailRef.current?.setAttribute("transform", `rotate(${10 * effort * Math.sin(2 * Math.PI * phase) - 12} -2 78)`);
    },
  }));

  const renderLeg = (leg: (typeof LEGS)[number], i: number) => (
    <g
      key={i}
      ref={(el) => {
        legRefs.current[i] = el;
      }}
      transform={legTransform(leg, 0, 0)}
    >
      <rect x={-6.5} y={-6} width={13} height={leg.length + 6} rx={6.5} fill={leg.far ? STRIPE : COAT} />
      <Paw x={-6.5} y={leg.length - 9} width={13} />
      <rect x={-6.5} y={-6} width={13} height={leg.length + 6} rx={6.5} fill="none" stroke={LINE} strokeWidth={1.25} />
    </g>
  );

  return (
    <svg viewBox="0 0 120 132" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
      <g ref={rootRef}>
        {LEGS.filter((leg) => leg.far).map((leg) => renderLeg(leg, LEGS.indexOf(leg)))}
        <g ref={bodyRef}>
          <g ref={tailRef}>
            <path d="M-2 78 C-22 72 -29 52 -18 36" fill="none" stroke={LINE} strokeWidth={11} strokeLinecap="round" />
            <path d="M-2 78 C-22 72 -29 52 -18 36" fill="none" stroke={COAT} strokeWidth={8.5} strokeLinecap="round" />
          </g>
          <path
            d="M-8 84 C-8 66 8 60 24 62 C44 64 62 62 78 60 C93 58 101 71 97 88 C93 103 80 105 66 103 L14 103 C-1 103 -8 97 -8 84 Z"
            fill={COAT}
            stroke={LINE}
            strokeWidth={1.25}
          />
          <path d="M14 96 C30 105 64 105 80 95 C70 88 24 88 14 96 Z" fill={WHITE} />
          <path d="M12 64 v9 M24 63 v10 M36 64 v9 M48 64 v8" stroke={STRIPE} strokeWidth={1.8} strokeLinecap="round" />
        </g>
        {LEGS.filter((leg) => !leg.far).map((leg) => renderLeg(leg, LEGS.indexOf(leg)))}
        <g transform="translate(46 12) scale(0.82)">
          <ModuHead lookAhead />
        </g>
      </g>
    </svg>
  );
});

type Pose = "sit" | "roll" | "run";

/**
 * Modu, sitting on a floor line below the contact card. He watches the cursor,
 * rolls over when clicked, and after a few clicks in a row does zoomies across
 * the whole width of the window, wrapping from one edge to the other.
 */
export default function Modu() {
  const [pose, setPose] = useState<Pose>("sit");
  const rowRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLButtonElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HeadHandle>(null);
  const runnerRef = useRef<RunnerHandle>(null);
  const ghostRunnerRef = useRef<RunnerHandle>(null);
  const poseRef = useRef<Pose>("sit");
  poseRef.current = pose;

  const clicks = useRef(0);
  const rollTimer = useRef(0);
  const pointerX = useRef<number | null>(null);
  const motion = useRef({ x: 0, velocity: 0, dir: 1, stride: 0, runUntil: 0, returning: false, frame: 0, lastTime: 0 });

  // The floor runs the full width of the window, so he has somewhere to run to.
  useEffect(() => {
    const fit = () => {
      const row = rowRef.current;
      if (!row) return;
      row.style.marginLeft = "0px";
      row.style.marginLeft = `${-row.getBoundingClientRect().left}px`;
      row.style.width = `${document.documentElement.clientWidth}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // His face follows the cursor while he sits.
  useEffect(() => {
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      pointerX.current = event.clientX;
      if (frame || poseRef.current !== "sit") return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const cat = catRef.current?.getBoundingClientRect();
        if (!cat) return;
        const span = cat.width * 4;
        const x = clamp((event.clientX - (cat.left + cat.width / 2)) / span, -1, 1);
        const y = clamp((event.clientY - (cat.top + cat.height * 0.3)) / span, -1, 1);
        headRef.current?.look(x, y);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(rollTimer.current);
      cancelAnimationFrame(motion.current.frame);
    };
  }, []);

  const place = (x: number, width: number, period: number) => {
    if (catRef.current) catRef.current.style.transform = `translateX(${x}px)`;
    const ghost = ghostRef.current;
    if (!ghost) return;
    // Near an edge a second copy enters from the far side, so he slides out of one edge and into the other.
    const nearEdge = Math.abs(x) > period / 2 - width / 2;
    ghost.style.visibility = nearEdge ? "visible" : "hidden";
    ghost.style.transform = `translateX(${x - Math.sign(x) * period}px)`;
  };

  const step = useCallback((now: number) => {
    const m = motion.current;
    const dt = Math.min((now - m.lastTime) / 1000, 0.05);
    m.lastTime = now;
    const period = rowRef.current?.clientWidth ?? window.innerWidth;
    const width = catRef.current?.offsetWidth ?? DRAWING_WIDTH;

    if (!m.returning && now >= m.runUntil) m.returning = true;

    let speed = RUN_SPEED;
    if (m.returning) {
      // Keep going the same way until he's back at his spot, braking as he gets close.
      const ahead = ((m.dir > 0 ? -m.x : m.x) % period + period) % period;
      if (ahead < 2 && Math.abs(m.velocity) < 260) {
        m.x = 0;
        m.velocity = 0;
        m.frame = 0;
        place(0, width, period);
        if (ghostRef.current) ghostRef.current.style.visibility = "hidden";
        setPose("sit");
        return;
      }
      speed = Math.min(RUN_SPEED, Math.sqrt(2 * BRAKING * ahead) + 30);
    }

    m.velocity += clamp(m.dir * speed - m.velocity, -2400 * dt, 2400 * dt);
    m.x += m.velocity * dt;
    if (m.x > period / 2) m.x -= period;
    if (m.x < -period / 2) m.x += period;

    const scale = width / DRAWING_WIDTH;
    const swing = 16 + 22 * Math.min(Math.abs(m.velocity) / RUN_SPEED, 1);
    m.stride += (Math.abs(m.velocity) * dt) / (4 * WALKER_LEG_LENGTH * Math.sin((swing * Math.PI) / 180) * scale);
    runnerRef.current?.update(m.stride, swing, m.dir);
    ghostRunnerRef.current?.update(m.stride, swing, m.dir);
    place(m.x, width, period);
    m.frame = requestAnimationFrame(step);
  }, []);

  const startZoomies = () => {
    const m = motion.current;
    window.clearTimeout(rollTimer.current);
    clicks.current = 0;
    const cat = catRef.current?.getBoundingClientRect();
    // He bolts away from whoever was poking him.
    m.dir = cat && pointerX.current !== null && pointerX.current > cat.left + cat.width / 2 ? -1 : 1;
    m.velocity = 0;
    m.returning = false;
    m.runUntil = performance.now() + RUN_MS;
    setPose("run");
    if (!m.frame) {
      m.lastTime = performance.now();
      m.frame = requestAnimationFrame(step);
    }
  };

  const handleClick = () => {
    const m = motion.current;
    if (poseRef.current === "run") {
      // More pets while he's running keep the zoomies going.
      m.returning = false;
      m.runUntil = performance.now() + RUN_MS;
      return;
    }
    clicks.current += 1;
    if (clicks.current >= ZOOMIES_CLICKS && !prefersReducedMotion()) {
      startZoomies();
      return;
    }
    setPose("roll");
    window.clearTimeout(rollTimer.current);
    rollTimer.current = window.setTimeout(() => {
      clicks.current = 0;
      setPose("sit");
    }, ROLL_MS);
  };

  const label = pose === "run" ? "Modu is doing zoomies" : pose === "roll" ? "Modu is rolling on his back. Click again" : "Pet Modu, the orange cat";

  return (
    <div ref={rowRef} className="modu-row">
      <div ref={ghostRef} className="modu-cat modu-ghost" aria-hidden="true">
        <div className="modu-pose is-on">
          <ModuRunner ref={ghostRunnerRef} />
        </div>
      </div>
      <button type="button" ref={catRef} className={`modu-cat modu-cat--${pose}`} onClick={handleClick} aria-label={label} title="Pet Modu">
        <span className="modu-shadow" aria-hidden="true" />
        <span className={pose === "sit" ? "modu-pose modu-pose--sit is-on" : "modu-pose modu-pose--sit"}>
          <ModuSit ref={headRef} />
        </span>
        <span className={pose === "roll" ? "modu-pose modu-pose--roll is-on" : "modu-pose modu-pose--roll"}>
          <ModuBelly />
        </span>
        <span className={pose === "run" ? "modu-pose modu-pose--run is-on" : "modu-pose modu-pose--run"}>
          <ModuRunner ref={runnerRef} />
        </span>
      </button>
    </div>
  );
}
