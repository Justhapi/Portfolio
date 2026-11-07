"use client";

import { useEffect, useRef, useState } from "react";

/* Shared bits for the About bag pop-ups (promoted from /prototypes/bag-pops). */

export const POP_UP = "/img/bag/pop_up";
export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const stop = (e: React.SyntheticEvent) => e.stopPropagation();
export const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Kathleen's own captions for each pop-up. */
export const COPY = {
  tripsA: "Going from a small city to countries is daunting but always exciting!",
  tripsB: "Hoping to do more to broaden my horizons",
  music: "Currently jamming to Asian pop",
  friends: "Behold, my sidequest partners and inspirations",
  art: "I've been doodling moments with others since coming to Purdue",
  games: "Games I turn on to relax",
  food: "Food is always on my itinerary",
};


/** The sticker slap: lifts forward squared-up, then slams back with a squash. */
export function slap(el: HTMLElement) {
  if (reduced()) return;
  el.animate(
    [
      { scale: "1", translate: "0 0" },
      { scale: "1.07", translate: "0 -8px", offset: 0.35 },
      { scale: "0.96 1.03", translate: "0 2px", offset: 0.68 },
      { scale: "1", translate: "0 0" },
    ],
    { duration: 380, easing: "cubic-bezier(0.25, 1, 0.5, 1)", composite: "add" },
  );
}

/** Counts up every `ms`; a bump counts up now and restarts the wait. */
export function useCycle(ms: number, bump: number, paused = false) {
  const [t, setT] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setT((x) => x + 1);
  }, [bump]);
  useEffect(() => {
    if (reduced() || paused) return;
    const id = window.setInterval(() => setT((x) => x + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, bump, paused]);
  return t;
}

