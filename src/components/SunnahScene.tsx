// @ts-nocheck -- imported code written for looser TypeScript settings
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useNavigate } from '@/lib/router-compat';
import NapBox from "./NapBox";
import SunnahCat from "./SunnahCat";
import SunnahSleeper from "./SunnahSleeper";

export interface NapBoxItem {
  label: string;
  title: string;
  route: string;
}

interface SunnahSceneProps {
  items: [NapBoxItem, NapBoxItem, NapBoxItem];
}

type Phase = "idle" | "walking" | "jumping" | "settling" | "napping";

const WALK_MS = 320;
const JUMP_MS = 380;
const SETTLE_MS = 380;
const NAP_VIEW_MS = 1100;

// Box artwork is drawn in a 240x210 viewBox; the front rim sits at y=80.
const BOX_VIEW_W = 240;
const BOX_RIM_Y = 80;
// The sleeper artwork is 120 wide and is clipped at y=60, the line that rests on the rim.
const SLEEPER_HALF_W = 60;
const SLEEPER_RIM_Y = 60;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SunnahScene({ items }: SunnahSceneProps) {
  const navigate = useNavigate();

  const stageRef = useRef<HTMLDivElement>(null);
  const boxRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [catOffset, setCatOffset] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [nap, setNap] = useState({ x: 0, y: 0, scale: 1, lift: 0 });

  const timeouts = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

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

  const followCursor = (clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const maxOffset = stageRect.width / 2 - 70;
    const raw = clientX - (stageRect.left + stageRect.width / 2);
    setCatOffset(Math.max(-maxOffset, Math.min(maxOffset, raw)));
  };

  // Keyboard focus has no cursor to follow, so it sends her to the focused box.
  const handleEnter = (index: number, viaFocus: boolean) => {
    if (phase !== "idle") return;
    setHoveredIndex(index);
    if (viaFocus) setCatOffset(measureOffset(index));
  };

  const handleLeave = (index: number) => {
    if (phase !== "idle") return;
    setHoveredIndex((current) => (current === index ? null : current));
  };

  const handleStageMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (phase !== "idle") return;
    followCursor(event.clientX);
  };

  const handleStageMouseLeave = () => {
    if (phase !== "idle") return;
    setCatOffset(0);
  };

  const handlePick = (index: number) => {
    if (phase !== "idle") return;

    setSelectedIndex(index);
    setHoveredIndex(index);
    setCatOffset(measureOffset(index));
    setNap(measureNap(index));

    const later = (fn: () => void, ms: number) => timeouts.current.push(window.setTimeout(fn, ms));

    if (prefersReducedMotion()) {
      setPhase("napping");
      later(() => navigate(items[index].route), 250);
      return;
    }

    setPhase("walking");
    later(() => setPhase("jumping"), WALK_MS);
    later(() => setPhase("settling"), WALK_MS + JUMP_MS);
    later(() => setPhase("napping"), WALK_MS + JUMP_MS + SETTLE_MS);
    later(() => navigate(items[index].route), WALK_MS + JUMP_MS + SETTLE_MS + NAP_VIEW_MS);
  };

  useEffect(() => {
    const onResize = () => {
      if (selectedIndex === null) return;
      setCatOffset(measureOffset(selectedIndex));
      setNap(measureNap(selectedIndex));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedIndex, measureOffset, measureNap]);

  const lookDirection: -1 | 0 | 1 = catOffset < -12 ? -1 : catOffset > 12 ? 1 : 0;
  const inBox = phase === "settling" || phase === "napping";
  const leavingFloor = phase === "jumping" || inBox;
  const sleepiness = phase === "napping" ? 1 : 0;

  const catTransition =
    phase === "idle"
      ? "transform 160ms cubic-bezier(.22,1,.36,1), opacity 160ms ease"
      : phase === "walking"
      ? `transform ${WALK_MS}ms cubic-bezier(.4,0,.2,1), opacity 160ms ease`
      : `transform ${JUMP_MS}ms cubic-bezier(.3,.9,.4,1), opacity 120ms ease ${JUMP_MS - 120}ms`;

  const statusDot = phase === "idle" ? "var(--color-neutral-400)" : "var(--color-accent-300)";
  const statusText =
    phase === "idle"
      ? hoveredIndex === null
        ? "Awaiting your cursor"
        : `Sizing up Box 0${hoveredIndex + 1} — ${items[hoveredIndex].title}`
      : phase === "walking"
      ? "On her way..."
      : phase === "jumping"
      ? "Climbing in..."
      : phase === "settling"
      ? "Getting comfortable..."
      : "Sunnah is asleep — taking you there";

  return (
    <div className="blueprint">
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />

      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        style={{ position: "relative", paddingTop: 44 }}
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
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-text) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-text) 5%, transparent) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

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

        <div style={{ height: 168 }} />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: -2,
              width: 84,
              height: 7,
              marginLeft: -42,
              borderRadius: "50%",
              background: "color-mix(in srgb, black 45%, transparent)",
              opacity: leavingFloor ? 0 : 1,
              transform: `translateX(${catOffset}px)`,
              transition: catTransition,
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              width: 112,
              height: 123,
              marginLeft: -56,
              transformOrigin: "50% 100%",
              opacity: leavingFloor ? 0 : 1,
              transform: leavingFloor
                ? `translate(${catOffset}px, ${-nap.lift}px) scale(${0.6 * nap.scale})`
                : `translate(${catOffset}px, 0px) scale(1)`,
              transition: catTransition,
            }}
          >
            <SunnahCat lookDirection={lookDirection} />
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
