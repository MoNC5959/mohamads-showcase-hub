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

type Phase = "idle" | "walking" | "napping";

const WALK_MS = 380;
const NAP_VIEW_MS = 900;

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
    const stageCenter = stageRect.left + stageRect.width / 2;
    const boxCenter = boxRect.left + boxRect.width / 2;
    return boxCenter - stageCenter;
  }, []);

  const handleEnter = (index: number) => {
    if (phase !== "idle") return;
    setHoveredIndex(index);
    setCatOffset(measureOffset(index));
  };

  const handleLeave = (index: number) => {
    if (phase !== "idle") return;
    setHoveredIndex((current) => (current === index ? null : current));
  };

  // While the cursor isn't over a specific box, Sunnah drifts toward it
  // continuously instead of sitting still — hovering a box still wins and
  // snaps her precisely to that box's center (handleEnter, above).
  const handleStageMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (phase !== "idle" || hoveredIndex !== null) return;
    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const stageCenter = stageRect.left + stageRect.width / 2;
    const maxOffset = stageRect.width / 2 - 70;
    const raw = event.clientX - stageCenter;
    setCatOffset(Math.max(-maxOffset, Math.min(maxOffset, raw)));
  };

  const handleStageMouseLeave = () => {
    if (phase !== "idle" || hoveredIndex !== null) return;
    setCatOffset(0);
  };

  const handlePick = (index: number) => {
    if (phase !== "idle") return;
    const reduced = prefersReducedMotion();

    setSelectedIndex(index);
    setHoveredIndex(index);
    setCatOffset(measureOffset(index));
    setPhase("walking");

    const walkDelay = reduced ? 20 : WALK_MS;
    const napDelay = reduced ? 60 : NAP_VIEW_MS;

    const t1 = window.setTimeout(() => setPhase("napping"), walkDelay);
    const t2 = window.setTimeout(() => navigate(items[index].route), walkDelay + napDelay);
    timeouts.current.push(t1, t2);
  };

  useEffect(() => {
    const onResize = () => {
      const active = selectedIndex ?? hoveredIndex;
      if (active !== null) setCatOffset(measureOffset(active));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hoveredIndex, selectedIndex, measureOffset]);

  const lookDirection: -1 | 0 | 1 = catOffset < -12 ? -1 : catOffset > 12 ? 1 : 0;
  const sleepiness = phase === "napping" ? 1 : 0;

  const statusDot = phase === "idle" ? "var(--color-neutral-400)" : "var(--color-accent-300)";
  const statusText =
    phase === "idle"
      ? hoveredIndex === null
        ? "Awaiting your cursor"
        : `Sizing up Box 0${hoveredIndex + 1} — ${items[hoveredIndex].title}`
      : phase === "walking"
      ? "Climbing in..."
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
              onEnter={() => handleEnter(i)}
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
              opacity: phase === "napping" ? 0 : 1,
              transform: `translateX(${catOffset}px)`,
              transition: "transform 160ms cubic-bezier(.22,1,.36,1), opacity 220ms ease",
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
              opacity: phase === "napping" ? 0 : 1,
              transform: `translateX(${catOffset}px) scale(${phase === "napping" ? 0.85 : 1})`,
              transition: "transform 160ms cubic-bezier(.22,1,.36,1), opacity 220ms ease",
            }}
          >
            <SunnahCat lookDirection={lookDirection} />
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 6,
              width: 120,
              height: 100,
              marginLeft: -60,
              transform: `translateX(${catOffset}px)`,
              opacity: phase === "napping" ? 1 : 0,
              transition: "opacity 260ms ease, transform 160ms cubic-bezier(.22,1,.36,1)",
            }}
          >
            <SunnahSleeper sleepiness={sleepiness} />
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
                    animation: phase === "napping" ? `sunnah-float-z 1800ms ease-in-out ${z * 500}ms infinite` : "none",
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
        <div style={{ padding: "12px 20px", borderLeft: "1px solid var(--color-divider)" }}>Drawn by Mohamad Noor Chowdhury</div>
        <div style={{ padding: "12px 20px", borderLeft: "1px solid var(--color-divider)" }}>Sheet 01 of 04</div>
      </div>
    </div>
  );
}
