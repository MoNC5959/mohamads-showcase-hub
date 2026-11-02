// @ts-nocheck -- imported code written for looser TypeScript settings
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from '@/lib/router-compat';
import NapBox from "./NapBox";
import SunnahCat from "./SunnahCat";
import SunnahSleeper from "./SunnahSleeper";
import SunnahWalker, { WALKER_LEG_LENGTH, type SunnahWalkerHandle } from "./SunnahWalker";

export interface NapBoxItem {
  label: string;
  title: string;
  route: string;
}

interface SunnahSceneProps {
  items: [NapBoxItem, NapBoxItem, NapBoxItem];
}

type Phase = "idle" | "walking" | "jumping" | "settling" | "napping";

const JUMP_MS = 380;
const SETTLE_MS = 380;
const NAP_VIEW_MS = 1100;

// Box artwork is drawn in a 240x210 viewBox; the front rim sits at y=80.
const BOX_VIEW_W = 240;
const BOX_RIM_Y = 80;
// The sleeper artwork is 120 wide and is clipped at y=60, the line that rests on the rim.
const SLEEPER_HALF_W = 60;
const SLEEPER_RIM_Y = 60;

// Pixels per second. She walks after the cursor and hurries once a box is picked.
const WALK_SPEED = 320;
const RUN_SPEED = 900;
// While hurrying she commits to the leap this close to the box.
const LEAP_DISTANCE = 14;
// Below this distance she stays seated, so a resting hand doesn't wake her.
const WAKE_DISTANCE = 8;
const SIT_DELAY_MS = 140;
const TURN_SECONDS = 0.14;
// Distance from the stage edge to her center, in drawing units, so she stays on the floor.
const FLOOR_MARGIN = 95;
const DRAWING_WIDTH = 120;
const DRAG_DISTANCE = 10;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SunnahScene({ items }: SunnahSceneProps) {
  const navigate = useNavigate();

  const stageRef = useRef<HTMLDivElement>(null);
  const boxRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [walking, setWalking] = useState(false);
  const [touching, setTouching] = useState(false);
  const [touchOnly, setTouchOnly] = useState(false);
  const [look, setLook] = useState<-1 | 0 | 1>(0);
  const [nap, setNap] = useState({ x: 0, y: 0, scale: 1, lift: 0 });

  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;

  const catRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<SunnahWalkerHandle>(null);
  const touch = useRef({ id: null as number | null, startX: 0, dragged: false });
  const motion = useRef({
    x: 0,
    velocity: 0,
    target: 0,
    topSpeed: WALK_SPEED,
    stride: 0,
    swing: 0,
    facing: 1,
    seatedFor: 0,
    walking: false,
    frame: 0,
    lastTime: 0,
    onArrive: null as null | (() => void),
  });

  const timeouts = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(motion.current.frame);
    };
  }, []);

  const placeOnFloor = () => {
    if (floorRef.current) floorRef.current.style.transform = `translateX(${motion.current.x}px)`;
  };

  // One frame of walking: ease toward the target, then advance her legs by the distance covered.
  const step = useCallback((now: number) => {
    const m = motion.current;
    const dt = Math.min((now - m.lastTime) / 1000, 0.05);
    m.lastTime = now;

    const accel = m.topSpeed * 5 * dt;
    const wanted = clamp((m.target - m.x) * (m.onArrive ? 9 : 5), -m.topSpeed, m.topSpeed);
    m.velocity += clamp(wanted - m.velocity, -accel, accel);
    m.x += m.velocity * dt;
    const remaining = m.target - m.x;
    if ((Math.abs(remaining) < 1.5 && Math.abs(m.velocity) < 14) || (m.onArrive && Math.abs(remaining) < LEAP_DISTANCE)) {
      m.x = m.target;
      m.velocity = 0;
    }
    const speed = Math.abs(m.velocity);

    if (Math.abs(remaining) > 6) {
      const turn = (dt / TURN_SECONDS) * 2;
      m.facing = clamp(m.facing + clamp(Math.sign(remaining) - m.facing, -turn, turn), -1, 1);
    } else if (Math.abs(m.facing) < 0.2) {
      m.facing = Math.sign(m.facing || 1) * 0.2;
    }
    const drawnFacing = Math.abs(m.facing) < 0.06 ? Math.sign(m.facing || 1) * 0.06 : m.facing;

    const hurry = Math.max(speed - WALK_SPEED, 0) / (RUN_SPEED - WALK_SPEED);
    const wantedSwing = (16 + 14 * Math.min(speed / WALK_SPEED, 1) + 8 * hurry) * Math.min(speed / 50, 1);
    m.swing += (wantedSwing - m.swing) * Math.min(dt * 14, 1);
    const scale = (catRef.current?.offsetWidth ?? DRAWING_WIDTH) / DRAWING_WIDTH;
    const strideLength = 4 * WALKER_LEG_LENGTH * Math.sin((Math.max(m.swing, 10) * Math.PI) / 180) * scale;
    m.stride += (speed * dt) / strideLength;

    walkerRef.current?.update(m.stride, m.swing, drawnFacing);
    placeOnFloor();

    if (m.x === m.target) {
      if (m.onArrive) {
        const arrive = m.onArrive;
        m.onArrive = null;
        m.frame = 0;
        arrive();
        return;
      }
      m.seatedFor += dt * 1000;
      if (m.seatedFor >= SIT_DELAY_MS) {
        m.walking = false;
        m.frame = 0;
        setWalking(false);
        return;
      }
    } else {
      m.seatedFor = 0;
    }
    m.frame = requestAnimationFrame(step);
  }, []);

  const walkTo = useCallback(
    (target: number) => {
      const m = motion.current;
      m.target = target;
      if (prefersReducedMotion()) {
        m.x = target;
        placeOnFloor();
        setLook(target < -12 ? -1 : target > 12 ? 1 : 0);
        return;
      }
      if (!m.walking && Math.abs(target - m.x) < WAKE_DISTANCE) return;
      m.seatedFor = 0;
      if (!m.walking) {
        m.walking = true;
        setWalking(true);
      }
      if (!m.frame) {
        m.lastTime = performance.now();
        m.frame = requestAnimationFrame(step);
      }
    },
    [step]
  );

  const measureOffset = useCallback((index: number) => {
    const stage = stageRef.current;
    const box = boxRefs[index].current;
    if (!stage || !box) return 0;
    const stageRect = stage.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    return boxRect.left + boxRect.width / 2 - (stageRect.left + stageRect.width / 2);
  }, []);

  // Where the napping cat goes: centered on the box, resting on its front rim.
  const measureNap = useCallback((index: number) => {
    const stage = stageRef.current;
    const box = boxRefs[index].current;
    if (!stage || !box) return { x: 0, y: 0, scale: 1, lift: 0 };
    const stageRect = stage.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    const scale = boxRect.width / BOX_VIEW_W;
    const rimY = boxRect.top - stageRect.top + BOX_RIM_Y * scale;
    return {
      x: boxRect.left - stageRect.left + boxRect.width / 2 - SLEEPER_HALF_W * scale,
      y: rimY - SLEEPER_RIM_Y * scale,
      scale,
      lift: stageRect.height - rimY,
    };
  }, []);

  const followPointer = useCallback(
    (clientX: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const scale = (catRef.current?.offsetWidth ?? DRAWING_WIDTH) / DRAWING_WIDTH;
      const maxOffset = stageRect.width / 2 - FLOOR_MARGIN * scale;
      walkTo(clamp(clientX - (stageRect.left + stageRect.width / 2), -maxOffset, maxOffset));
    },
    [walkTo]
  );

  // A finger has nothing to hover with, so the box under it opens as she's dragged along.
  const boxUnder = useCallback((clientX: number) => {
    const found = boxRefs.findIndex((box) => {
      const rect = box.current?.getBoundingClientRect();
      return rect && clientX >= rect.left && clientX <= rect.right;
    });
    return found === -1 ? null : found;
  }, []);

  useEffect(() => {
    setTouchOnly(window.matchMedia("(hover: none)").matches);

    const onMove = (event: PointerEvent) => {
      if (phaseRef.current !== "idle") return;
      if (event.pointerType !== "touch") {
        followPointer(event.clientX);
        return;
      }
      if (event.pointerId !== touch.current.id) return;
      if (Math.abs(event.clientX - touch.current.startX) > DRAG_DISTANCE) touch.current.dragged = true;
      followPointer(event.clientX);
      setHoveredIndex(boxUnder(event.clientX));
    };
    const onRelease = (event: PointerEvent) => {
      if (event.pointerId !== touch.current.id) return;
      touch.current.id = null;
      setTouching(false);
      if (phaseRef.current === "idle") setHoveredIndex(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
    };
  }, [followPointer, boxUnder]);

  const handleStagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || phase !== "idle") return;
    touch.current = { id: event.pointerId, startX: event.clientX, dragged: false };
    setTouching(true);
    followPointer(event.clientX);
  };

  // Lifting a finger after a drag isn't a tap on whichever box it ended over.
  const handleStageClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!touch.current.dragged) return;
    touch.current.dragged = false;
    event.preventDefault();
    event.stopPropagation();
  };

  // Keyboard focus has no cursor to follow, so it sends her to the focused box.
  const handleEnter = (index: number, viaFocus: boolean) => {
    if (phase !== "idle") return;
    setHoveredIndex(index);
    if (viaFocus) walkTo(measureOffset(index));
  };

  const handleLeave = (index: number) => {
    if (phase !== "idle") return;
    setHoveredIndex((current) => (current === index ? null : current));
  };

  const handlePick = (index: number) => {
    if (phase !== "idle") return;

    setSelectedIndex(index);
    setHoveredIndex(index);
    setNap(measureNap(index));

    const later = (fn: () => void, ms: number) => timeouts.current.push(window.setTimeout(fn, ms));

    if (prefersReducedMotion()) {
      walkTo(measureOffset(index));
      setPhase("napping");
      later(() => navigate(items[index].route), 250);
      return;
    }

    const climbIn = () => {
      setPhase("jumping");
      later(() => setPhase("settling"), JUMP_MS);
      later(() => setPhase("napping"), JUMP_MS + SETTLE_MS);
      later(() => navigate(items[index].route), JUMP_MS + SETTLE_MS + NAP_VIEW_MS);
    };

    const m = motion.current;
    const boxOffset = measureOffset(index);
    setPhase("walking");
    if (Math.abs(boxOffset - m.x) < WAKE_DISTANCE) {
      m.target = m.x = boxOffset;
      placeOnFloor();
      climbIn();
      return;
    }
    m.topSpeed = RUN_SPEED;
    m.onArrive = climbIn;
    walkTo(boxOffset);
  };

  useEffect(() => {
    const onResize = () => {
      if (selectedIndex === null) return;
      walkTo(measureOffset(selectedIndex));
      setNap(measureNap(selectedIndex));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedIndex, measureOffset, measureNap, walkTo]);

  const inBox = phase === "settling" || phase === "napping";
  const leavingFloor = phase === "jumping" || inBox;
  const sleepiness = phase === "napping" ? 1 : 0;

  const catTransition = leavingFloor
    ? `transform ${JUMP_MS}ms cubic-bezier(.3,.9,.4,1), opacity 120ms ease ${JUMP_MS - 120}ms`
    : "transform 160ms cubic-bezier(.22,1,.36,1), opacity 160ms ease";

  const statusDot = phase === "idle" ? "var(--color-neutral-400)" : "var(--color-accent-300)";
  const statusText =
    phase === "idle"
      ? hoveredIndex !== null
        ? `Sizing up Box 0${hoveredIndex + 1}: ${items[hoveredIndex].title}`
        : touching
        ? "Following your finger"
        : walking
        ? "Following your cursor"
        : touchOnly
        ? "Hold and drag to walk her"
        : "Awaiting your cursor"
      : phase === "walking"
      ? "On her way..."
      : phase === "jumping"
      ? "Climbing in..."
      : phase === "settling"
      ? "Getting comfortable..."
      : "Sunnah is asleep. Taking you there";

  return (
    <div className="blueprint">
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />

      <div
        ref={stageRef}
        onPointerDown={handleStagePointerDown}
        onClickCapture={handleStageClickCapture}
        onContextMenu={(event) => {
          if (touching) event.preventDefault();
        }}
        className="cat-stage"
        style={{ position: "relative", paddingTop: 8 }}
      >
        <svg width={0} height={0} aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <pattern id="sunnah-hatch" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={6} height={6} style={{ fill: "var(--color-bg)" }} />
              <line x1={0} y1={0} x2={0} y2={6} style={{ stroke: "var(--color-neutral-600)", strokeWidth: 1 }} />
            </pattern>
          </defs>
        </svg>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(10px, 4vw, 56px)",
            alignItems: "end",
            padding: "0 clamp(12px, 4vw, 56px)",
          }}
        >
          {items.map((item, i) => (
            <NapBox
              key={item.route}
              ref={boxRefs[i]}
              index={i}
              sheetLabel={item.label}
              title={item.title}
              active={hoveredIndex === i || selectedIndex === i}
              onEnter={() => handleEnter(i, false)}
              onFocusEnter={() => handleEnter(i, true)}
              onLeave={() => handleLeave(i)}
              onPick={() => handlePick(i)}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: 7,
            margin: "0 clamp(6px, 2vw, 28px)",
            borderTop: "1px solid color-mix(in srgb, var(--color-text) 60%, transparent)",
            borderBottom: "1px solid var(--color-divider)",
          }}
        >
          <svg viewBox="0 0 22 22" aria-hidden="true" style={{ position: "absolute", left: 18, top: 7, width: 22, height: 22, overflow: "visible" }}>
            <path d="M0 0 H22 L0 22 Z" style={{ fill: "none", stroke: "color-mix(in srgb, var(--color-text) 40%, transparent)", strokeWidth: 1 }} />
          </svg>
          <svg viewBox="0 0 22 22" aria-hidden="true" style={{ position: "absolute", right: 18, top: 7, width: 22, height: 22, overflow: "visible" }}>
            <path d="M0 0 H22 V22 Z" style={{ fill: "none", stroke: "color-mix(in srgb, var(--color-text) 40%, transparent)", strokeWidth: 1 }} />
          </svg>
        </div>

        <div style={{ height: "clamp(120px, 10vw, 144px)" }} />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
          <div ref={floorRef} style={{ position: "absolute", left: "50%", bottom: 0, width: 0, height: 0 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: -2,
                width: 92,
                height: 7,
                marginLeft: -46,
                borderRadius: "50%",
                background: "color-mix(in srgb, black 45%, transparent)",
                opacity: leavingFloor ? 0 : 1,
                transform: walking ? "scaleX(1.6)" : "none",
                transition: catTransition,
              }}
            />

            <div
              ref={catRef}
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "clamp(92px, 8.5vw, 120px)",
                aspectRatio: "120 / 132",
                translate: "-50% 0",
                transformOrigin: "50% 100%",
                opacity: leavingFloor ? 0 : 1,
                transform: leavingFloor ? `translate(0px, ${-nap.lift}px) scale(${0.6 * nap.scale})` : "none",
                transition: catTransition,
              }}
            >
              <div className={walking ? "cat-pose cat-pose--sit is-hidden" : "cat-pose cat-pose--sit"}>
                <SunnahCat lookDirection={look} />
              </div>
              <div className={walking ? "cat-pose cat-pose--walk" : "cat-pose cat-pose--walk is-hidden"}>
                <SunnahWalker ref={walkerRef} />
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 120,
              height: 100,
              transformOrigin: "0 0",
              transform: `translate(${nap.x}px, ${nap.y}px) scale(${nap.scale})`,
              opacity: inBox ? 1 : 0,
              transition: "opacity 120ms ease",
            }}
          >
            <SunnahSleeper risen={inBox} sleepiness={sleepiness} />
            <div style={{ position: "absolute", left: 86, top: -2, width: 0, height: 0 }}>
              {[0, 1, 2].map((z) => (
                <span
                  key={z}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: 16,
                    lineHeight: 1,
                    color: "var(--color-accent-300)",
                    animation: phase === "napping" ? `sunnah-float-z 1500ms ease-in-out ${z * 380}ms infinite` : "none",
                    opacity: 0,
                  }}
                >
                  Z
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          borderTop: "1px solid color-mix(in srgb, var(--color-text) 55%, transparent)",
          fontSize: 12,
          lineHeight: "20px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "color-mix(in srgb, var(--color-text) 72%, transparent)",
        }}
      >
        <div style={{ flex: "1 1 280px", display: "flex", alignItems: "center", gap: 10, padding: "12px 20px" }}>
          <span style={{ width: 7, height: 7, flex: "none", background: statusDot, borderRadius: "50%" }} />
          <span style={{ color: "var(--color-text)" }}>{statusText}</span>
        </div>
        <div style={{ padding: "12px 20px", borderLeft: "1px solid var(--color-divider)" }}>Subject: Sunnah, grey shorthair</div>
      </div>
    </div>
  );
}
