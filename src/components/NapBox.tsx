import { forwardRef } from "react";

interface NapBoxProps {
  index: number;
  sheetLabel: string;
  title: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPick: () => void;
}

/**
 * One cardboard box on the home "blueprint" sheet. The two top flaps swing
 * open (flapL / flapR) while the box is hovered/focused or has been picked,
 * as if inviting the cat in.
 */
const NapBox = forwardRef<HTMLDivElement, NapBoxProps>(function NapBox(
  { index, sheetLabel, title, active, onEnter, onLeave, onPick },
  boxRef
) {
  const flapOpen = active;

  return (
    <button
      type="button"
      aria-label={`Open ${title}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onPick}
      style={{
        appearance: "none",
        background: "none",
        border: 0,
        padding: 0,
        margin: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        color: active ? "var(--color-accent-300)" : "var(--color-neutral-300)",
        font: "inherit",
        transition: "color 160ms",
      }}
    >
      <div
        ref={boxRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 240,
          aspectRatio: "240 / 210",
          containerType: "inline-size",
        }}
      >
        <svg
          viewBox="0 0 240 210"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          <g style={{ fill: "var(--color-bg)", stroke: "currentColor", strokeWidth: 1.2, strokeLinejoin: "round" }}>
            <polygon points="50,64 190,64 184,26 56,26" />
            <polygon points="30,80 210,80 190,64 50,64" fill="url(#sunnah-hatch)" />
            <polygon
              points="30,80 50,64 28,36 6,54"
              style={{
                transformBox: "view-box",
                transformOrigin: "40px 72px",
                transition: "transform 340ms cubic-bezier(.3,1.6,.5,1)",
                transform: flapOpen ? "rotate(-22deg) translate(-3px, -2px)" : "rotate(0deg)",
              }}
            />
            <polygon
              points="210,80 190,64 212,36 234,54"
              style={{
                transformBox: "view-box",
                transformOrigin: "200px 72px",
                transition: "transform 340ms cubic-bezier(.3,1.6,.5,1)",
                transform: flapOpen ? "rotate(22deg) translate(3px, -2px)" : "rotate(0deg)",
              }}
            />
            <rect x="30" y="80" width="180" height="129" />
            <polygon points="30,80 210,80 217,95 23,95" />
            <path
              d="M44 120 V105 M40.5 108.5 L44 105 L47.5 108.5 M54 120 V105 M50.5 108.5 L54 105 L57.5 108.5 M39 124 H59"
              fill="none"
            />
          </g>
        </svg>

        <div
          className="blueprint"
          style={{
            position: "absolute",
            left: "50%",
            top: "53%",
            transform: "translateX(-50%)",
            width: "54%",
            padding: "3.5cqw 4cqw",
            display: "flex",
            flexDirection: "column",
            gap: "1.5cqw",
            textAlign: "left",
            pointerEvents: "none",
          }}
        >
          <i className="corner tl" />
          <i className="corner tr" />
          <i className="corner bl" />
          <i className="corner br" />
          <span
            style={{
              fontSize: "clamp(8px, 4.4cqw, 11px)",
              lineHeight: 1,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Box {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "clamp(11px, 9.4cqw, 23px)",
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {sheetLabel}
          </span>
        </div>
      </div>
    </button>
  );
});

export default NapBox;
