import { forwardRef } from "react";

interface NapBoxProps {
  index: number;
  sheetLabel: string;
  title: string;
  active: boolean;
  onEnter: () => void;
  onFocusEnter: () => void;
  onLeave: () => void;
  onPick: () => void;
}

/**
 * One cardboard box on the home "blueprint" sheet. The two top flaps swing
 * open (flapL / flapR) while the box is hovered/focused or has been picked,
 * as if inviting the cat in, and the front face floods with the accent.
 */
const NapBox = forwardRef<HTMLDivElement, NapBoxProps>(function NapBox(
  { index, sheetLabel, title, active, onEnter, onFocusEnter, onLeave, onPick },
  boxRef
) {
  const flapOpen = active;

  return (
    <button
      type="button"
      aria-label={`Open ${title}`}
      className={active ? "nap-box is-active" : "nap-box"}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocusEnter}
      onBlur={onLeave}
      onClick={onPick}
    >
      <div
        ref={boxRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 264,
          aspectRatio: "240 / 210",
          containerType: "inline-size",
        }}
      >
        <svg
          viewBox="0 0 240 210"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          <g style={{ fill: "var(--color-bg)", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" }}>
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
            <rect className="nap-box-face" x="30" y="80" width="180" height="129" />
            <polygon className="nap-box-face" points="30,80 210,80 217,95 23,95" />
            <path
              className="nap-box-mark"
              d="M44 120 V105 M40.5 108.5 L44 105 L47.5 108.5 M54 120 V105 M50.5 108.5 L54 105 L57.5 108.5 M39 124 H59"
              fill="none"
            />
          </g>
        </svg>

        <div className="nap-box-stencil">
          <span className="nap-box-number">Box {String(index + 1).padStart(2, "0")}</span>
          <span className="nap-box-title">{sheetLabel}</span>
        </div>
      </div>
    </button>
  );
});

export default NapBox;
