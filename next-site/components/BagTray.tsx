"use client";

import { useEffect, useState } from "react";

/* The About bag's photo pop-ups (promoted from /prototypes/bag-stacks, "Tray · Outline"):
   food is a bento box whose compartments refill out of order; trips is an
   airplane window with the view gliding past. */

const P = "/img/bag/pop_up";
const FOOD = Array.from({ length: 18 }, (_, i) => `${P}/food/web/${String(i + 1).padStart(2, "0")}.webp`);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Advances every `ms` (paused under reduced motion). */
function useTick(ms: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    const id = window.setInterval(() => setT((x) => x + 1), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return t;
}

// compartments refill out of order so it never ticks like a grid
const REFILL = [0, 2, 1, 3, 2, 0, 3, 1];

export function FoodBento() {
  const t = useTick(1700);
  const counts = [0, 0, 0, 0];
  for (let i = 0; i < t; i++) counts[REFILL[i % REFILL.length]]++;
  const cells = ["a", "b", "c", "d"].map((a, k) => ({ a, src: FOOD[(k * 5 + counts[k] * 4) % FOOD.length] }));
  return (
    <div className="bs-bento" aria-hidden="true">
      {cells.map((c) => (
        <span key={c.a} className="bs-bento__cell" style={{ gridArea: c.a }}>
          <img key={c.src} src={c.src} alt="" />
        </span>
      ))}
    </div>
  );
}

// landscape trips read best gliding past the window
const TRIPS_WIDE = [1, 2, 3, 4, 5, 6, 10, 12, 15].map((n) => `${P}/trips/web/${String(n).padStart(2, "0")}.webp`);

export function TripsWindow() {
  const strip = [...TRIPS_WIDE, ...TRIPS_WIDE];
  return (
    <div className="bs-window" aria-hidden="true">
      <div className="bs-window__pane">
        <div className="bs-window__view">
          {strip.map((src, i) => <img key={i} src={src} alt="" />)}
        </div>
      </div>
    </div>
  );
}
