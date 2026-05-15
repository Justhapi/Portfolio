import type { CSSProperties } from "react";

/**
 * Tiny inline "GIF-style" sparkle made from cycling Unicode glyphs.
 * Each variant rotates through 2-4 similar characters via CSS `content`
 * animation, producing a twinkling effect like Emmi Wu's flower-text.
 *
 * Variants:
 *   - gem   ✦ 𖥔
 *   - mini  . ｡ .
 */

type Variant = "gem" | "mini";

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
    />
  );
}
