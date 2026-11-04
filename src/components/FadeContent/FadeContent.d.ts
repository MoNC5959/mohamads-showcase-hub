import type { ComponentType, HTMLAttributes } from "react";

/** Types for the plain-JS React Bits source in FadeContent.jsx. */
export interface FadeContentProps extends HTMLAttributes<HTMLDivElement> {
  container?: string | Element | null;
  effect?: "fade" | "focus" | "develop" | "dissolve" | "mist" | "pixel";
  blur?: boolean | number;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  stagger?: number;
  staggerFrom?: "start" | "center" | "end" | "edges" | "random" | number;
  trigger?: "scroll" | "mount";
  once?: boolean;
  exit?: boolean;
  scrub?: boolean | number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
}

declare const FadeContent: ComponentType<FadeContentProps>;
export default FadeContent;
