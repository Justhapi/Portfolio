"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Sparkle from "./SparkleText";

/**
 * SparkleField — continuously-respawning scatter of cycling-glyph sparkles.
 *
 * Each "slot" fades in, twinkles for its lifespan, then fades out and respawns
 * at a new random position with a new variant. Each slot manages its own timer
 * in a child component so a respawn in one slot never resets the others.
 *
 * Props:
 *   count      — number of simultaneous sparkles (default 14)
 *   scale      — visual size multiplier applied via font-size (default 1)
 *   slowdown   — glyph cycle speed multiplier: >1 = slower cycle (default 1)
 *   lifeScale  — life duration multiplier: >1 = longer-lived sparkles (default 1)
 *
 * Usage — hero (energetic, tight):   <SparkleField count={14} />
 * Usage — connect (slow, spacious):  <SparkleField count={10} scale={1.5} slowdown={2} lifeScale={1.4} />
 */

type Variant = "gem" | "mini";

type SlotData = {
  id: number;
  x: number; // %
  y: number; // %
  variant: Variant;
  duration: number; // glyph cycle period (s)
  life: number; // ms the slot lives before respawning
  scale: number; // visual size multiplier
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function freshFields(slowdown = 1, lifeScale = 1, scale = 1): Omit<SlotData, "id"> {
  return {
    x: rand(3, 97),
    y: rand(3, 97),
    variant: Math.random() < 0.45 ? "mini" : "gem",
    duration: rand(0.45, 0.75) * slowdown,
    // each star lives 10–20 s (× lifeScale) before fading out and respawning elsewhere
    life: rand(10000, 20000) * lifeScale,
    scale,
  };
}

/** One star: owns its own respawn timer so it's isolated from sibling re-renders. */
function StarSlot({
  data,
  generation,
  onExpire,
}: {
  data: SlotData;
  generation: number; // bumps every respawn → effect re-runs with fresh timer
  onExpire: (id: number) => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(() => onExpire(data.id), data.life);
    return () => window.clearTimeout(t);
    // re-run only when THIS slot respawns (generation bump) or unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]);

  const style: CSSProperties & Record<string, string> = {
    left: `${data.x}%`,
    top: `${data.y}%`,
    "--star-life": `${data.life}ms`,
    // scale via font-size so the glyph and any border/padding scale together
    fontSize: `${data.scale}em`,
  };

  return (
    <span className="hero-spark star-slot" style={style}>
      <Sparkle variant={data.variant} duration={data.duration} />
    </span>
  );
}

export default function SparkleField({
  count = 14,
  scale = 1,
  slowdown = 1,
  lifeScale = 1,
}: {
  count?: number;
  scale?: number;
  slowdown?: number;
  lifeScale?: number;
}) {
  // Map<id, { data, generation }> — generation bumps to force StarSlot remount on respawn.
  const [slots, setSlots] = useState<Array<SlotData & { gen: number }>>([]);

  // Populate client-side to avoid Math.random hydration mismatch.
  useEffect(() => {
    setSlots(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        gen: 0,
        ...freshFields(slowdown, lifeScale, scale),
      })),
    );
  }, [count, slowdown, lifeScale, scale]);

  const handleExpire = useCallback(
    (id: number) => {
      setSlots((prev) =>
        prev.map((s) =>
          s.id === id ? { id, gen: s.gen + 1, ...freshFields(slowdown, lifeScale, scale) } : s,
        ),
      );
    },
    [slowdown, lifeScale, scale],
  );

  if (slots.length === 0) return null;

  return (
    <>
      {slots.map((s) => (
        // The `key` change on respawn forces React to unmount the previous
        // element + mount a fresh one — restarting the CSS lifecycle.
        <StarSlot
          key={`${s.id}-${s.gen}`}
          data={s}
          generation={s.gen}
          onExpire={handleExpire}
        />
      ))}
    </>
  );
}
