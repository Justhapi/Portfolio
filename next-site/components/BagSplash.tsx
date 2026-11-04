"use client";

/* As the About bag lands, sparkles shake off the items in it — one wave
   that sweeps across the bag, from the earbuds on the left to the phone on
   the right. Each item flicks a small, spread-out fan of sparkles in the
   direction its landing jolt throws it. Sits over the bag (see AboutV2). */

import { useEffect, useRef } from "react";

const SPARK_D =
  "M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z";

/* Where each item sits on the bag (% of the bag, measured off the drawing)
   and which way its jolt throws it (bagSlideBounceIn's item keyframes). */
const ITEMS = [
  { x: 67, y: 66, dir: [1, -0.3] },   // usagi — shifts right
  { x: 34, y: 6,  dir: [0, -1] },     // ipad — pops up
  { x: 68, y: 4,  dir: [0, -1] },     // laptop
  { x: 75, y: 50, dir: [0, -1] },     // phone
  { x: 19, y: 72, dir: [1, -0.4] },   // earbud — swings right
  { x: 23, y: 74, dir: [1, -0.4] },   // earbud
  { x: 53, y: 56, dir: [0, -1] },     // ticket — springs back up
] as const;
const SWEEP_START = 640; // ms into the bag's slide-in, as it lands
const SWEEP_STEP = 110;  // between neighbouring items
const PER_ITEM = 3;
const FAN = 1.6;         // radians the three sparkles spread across

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Drag + gravity path sampled at 60fps — one continuous arc. */
function arc(vx: number, vy: number, steps: number, spin: number) {
  const frames: Keyframe[] = [];
  let px = 0, py = 0, rot = 0;
  const dt = 1 / 60;
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    frames.push({
      translate: `calc(-50% + ${px.toFixed(1)}px) calc(-50% + ${py.toFixed(1)}px)`,
      rotate: `${rot.toFixed(0)}deg`,
      scale: `${(0.4 + Math.min(1, t * 6) * 0.6).toFixed(2)}`,
      opacity: t < 0.5 ? 0.85 : Math.max(0, 0.85 * (1 - (t - 0.5) / 0.5)),
    });
    vx *= 0.9; vy = vy * 0.9 + 380 * dt;
    px += vx * dt; py += vy * dt; rot += spin * dt;
  }
  return frames;
}

function shakeOff(layer: HTMLElement, item: (typeof ITEMS)[number]) {
  const x = (item.x / 100) * layer.clientWidth, y = (item.y / 100) * layer.clientHeight;
  const [dx, dy] = item.dir, center = Math.atan2(dy, dx);
  for (let i = 0; i < PER_ITEM; i++) {
    const s = document.createElement("span");
    s.className = `bag-splash__spark is-${i === 1 ? "butter" : "warm"}`;
    s.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${SPARK_D}"/></svg>`;
    const size = 6 + Math.random() * 4;
    s.style.cssText = `left:${x + (Math.random() - 0.5) * 8}px;top:${y}px;width:${size}px;height:${size}px`;
    layer.appendChild(s);
    // spread evenly across the fan so they disperse instead of clumping
    const a = center + (i / (PER_ITEM - 1) - 0.5) * FAN + (Math.random() - 0.5) * 0.25;
    const sp = 170 + Math.random() * 90;
    s.animate(arc(Math.cos(a) * sp, Math.sin(a) * sp, 46, dx >= 0 ? 240 : -240), { duration: 760, easing: "linear" })
      .finished.then(() => s.remove(), () => s.remove());
  }
}

export default function BagSplash() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const layer = ref.current;
    const bag = layer?.parentElement?.querySelector<HTMLElement>(".hover-bag");
    if (!layer || !bag) return;
    const timers: number[] = [];
    const onStart = (e: AnimationEvent) => {
      if (e.target !== bag || e.animationName !== "bagSlideBounceIn" || reduced()) return;
      [...ITEMS].sort((a, b) => a.x - b.x).forEach((it, k) =>
        timers.push(window.setTimeout(() => shakeOff(layer, it), SWEEP_START + k * SWEEP_STEP)));
    };
    bag.addEventListener("animationstart", onStart);
    return () => { bag.removeEventListener("animationstart", onStart); timers.forEach((t) => window.clearTimeout(t)); };
  }, []);
  return <div ref={ref} className="bag-splash" aria-hidden="true" />;
}
