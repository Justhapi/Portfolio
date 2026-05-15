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
 */

type Variant = "gem" | "mini";

type SlotData = {
  id: number;
  x: number; // %
  y: number; // %
  variant: Variant;
  duration: number; // glyph cycle period (s)
  life: number; // ms the slot lives before respawning
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function freshFields(): Omit<SlotData, "id"> {
  return {
    x: rand(3, 97),
    y: rand(3, 97),
    variant: Math.random() < 0.45 ? "mini" : "gem",
    duration: rand(0.45, 0.75),
    // each star lives 10–20 s before fading out and respawning elsewhere
    life: rand(10000, 20000),
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
  };

  return (
    <span className="hero-spark star-slot" style={style}>
      <Sparkle variant={data.variant} duration={data.duration} />
    </span>
  );
}

export default function SparkleField({ count = 14 }: { count?: number }) {
  // Map<id, { data, generation }> — generation bumps to force StarSlot remount on respawn.
  const [slots, setSlots] = useState<Array<SlotData & { gen: number }>>([]);

  // Populate client-side to avoid Math.random hydration mismatch.
  useEffect(() => {
    setSlots(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        gen: 0,
        ...freshFields(),
      })),
    );
  }, [count]);

  const handleExpire = useCallback((id: number) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === id ? { id, gen: s.gen + 1, ...freshFields() } : s,
      ),
    );
  }, []);

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
