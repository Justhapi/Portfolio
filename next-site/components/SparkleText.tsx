import type { CSSProperties } from "react";

/**
 * Tiny inline "GIF-style" sparkle made from cycling Unicode glyphs, plus
 * one hand-drawn ink-splatter variant rendered as inline SVG for a rougher
 * "ink on paper" texture in the sketch/japandi aesthetic.
 *
 * Variants:
 *   - gem      ✦ 𖥔
 *   - mini     . ｡ .
 *   - splatter tiny asymmetric ink blob + satellite specks (SVG)
 */

type Variant = "gem" | "mini" | "splatter";

/** Inline ink-splatter — asymmetric main blob with 4 satellite specks
 *  and a small teardrop. Drawn with intentionally irregular points so
 *  it reads as a hand-drawn ink dot rather than a geometric icon. */
const InkSplatter = () => (
  <svg
    className="sparkle-splatter-svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    {/* main blob — asymmetric ellipse */}
    <path d="M11.4 10.2 C 8.9 10.4 8.2 12.6 9.7 13.9 C 11.1 15.1 13.9 14.6 14.7 13 C 15.4 11.7 13.5 10 11.4 10.2 Z" />
    {/* teardrop drip below */}
    <path d="M13.2 14.5 C 13.6 15.6 13.4 16.7 12.9 17.1 C 12.4 17.4 12 16.6 12.2 15.7 C 12.3 15.2 12.7 14.7 13.2 14.5 Z" />
    {/* satellite specks */}
    <circle cx="6.5" cy="8" r="0.9" />
    <circle cx="17.5" cy="9.5" r="0.7" />
    <circle cx="5.2" cy="14.5" r="0.5" />
    <circle cx="18.6" cy="15.2" r="0.6" />
  </svg>
);

export default function Sparkle({
  variant = "gem",
  duration,
  className = "",
  delay,
}: {
  variant?: Variant;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const style: CSSProperties & Record<string, string> = {};
  if (duration != null) style["--sparkle-d"] = `${duration}s`;
  if (delay != null) style["--sparkle-delay"] = `${delay}s`;

  return (
    <span
      className={`sparkle sparkle-${variant} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {variant === "splatter" ? <InkSplatter /> : null}
    </span>
  );
}
