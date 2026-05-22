"use client";

import { useEffect, useRef } from "react";

/**
 * LearningsV2 — port of Claude Design Portoflio/learnings.jsx
 * Scattered tan polaroids with parallax + 3D perspective.
 * Each card has:
 *   - rate: parallax depth (<1 lags behind, >1 races ahead)
 *   - rot: in-plane rotation (deg)
 *   - tilt: rotateY for subtle depth (deg)
 *   - lift: rotateX for "leaning in/out" (deg)
 *   - z: translateZ depth
 */

type Card = {
  id: string;
  w: number;
  h: number;
  x: number; // % horizontal anchor
  y: number; // % vertical anchor
  rot: number;
  tilt: number;
  lift: number;
  z: number;
  rate: number;
  label: string;
  caption: string;
};

// Arjun-R-style parallax field: cards sit nearly flat (no 3D tilts,
// minimal in-plane rotation) so the vertical-drift parallax becomes
// the dominant motion when scrolling. Each card has a different
// `rate` so adjacent cards never drift in lockstep, producing the
// "river of layers flowing at different speeds" feel from
// arjun-r.com's "I experiment a lot" section.
//
// rates: <1 lags behind the scroll, >1 races ahead. Spread across
// 0.45–1.55 so the strongest cards visibly travel ~220px apart at
// the section's scroll endpoints, while the calmest pair drift just
// enough to read as alive.
//
//   l1: 0.45  — strongest lag (deepest)
//   l2: 1.55  — strongest race (closest)
//   l3: 0.70  — medium lag
//   l4: 1.40  — medium race
//   l5: 0.90  — soft lag (calmest)
//   l6: 1.20  — soft race
const CARDS: Card[] = [
  { id: "l1", w: 270, h: 350, x: 11, y:  6, rot: -3, tilt: 0, lift: 0, z: 0, rate: 0.45, label: "drawing",        caption: "Sketchbook — life drawing" },
  { id: "l2", w: 200, h: 240, x: 36, y:  0, rot:  2, tilt: 0, lift: 0, z: 0, rate: 1.55, label: "code",           caption: "CS minor — coding" },
  { id: "l3", w: 290, h: 380, x: 70, y:  4, rot: -1, tilt: 0, lift: 0, z: 0, rate: 0.70, label: "obsidian graph", caption: "Obsidian — design notes" },
  { id: "l4", w: 230, h: 290, x:  9, y: 54, rot:  2, tilt: 0, lift: 0, z: 0, rate: 1.40, label: "travels",        caption: "Travels — Kyoto, 2025" },
  { id: "l5", w: 250, h: 320, x: 44, y: 48, rot: -1, tilt: 0, lift: 0, z: 0, rate: 0.90, label: "food",           caption: "Food maps — Lisbon" },
  { id: "l6", w: 220, h: 300, x: 79, y: 58, rot:  3, tilt: 0, lift: 0, z: 0, rate: 1.20, label: "side art",       caption: "Field notes — observation" },
];

function buildTransform(c: Card, parallaxY: number) {
  // translate(-50%, …) keeps the x-anchor on the card's center
  return [
    `translate(-50%, ${parallaxY.toFixed(2)}px)`,
    `translateZ(${c.z}px)`,
    `rotateY(${c.tilt}deg)`,
    `rotateX(${c.lift}deg)`,
    `rotate(${c.rot}deg)`,
  ].join(" ");
}

export default function LearningsV2() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const els = Array.from(canvas.querySelectorAll<HTMLDivElement>(".learn-card-tan"));
    const cards: Card[] = els.map((el) => JSON.parse(el.dataset.card!));

    if (reduced) {
      els.forEach((el, i) => {
        el.style.transform = buildTransform(cards[i], 0);
      });
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      const passProgress = (winH - rect.top) / (winH + section.offsetHeight);
      const clamped = Math.max(-0.3, Math.min(1.3, passProgress));

      els.forEach((el, i) => {
        const c = cards[i];
        // Amplitude 520 — strong enough that the layered river of
        // cards visibly flows past each other during a scroll-through,
        // matching the parallax intensity on arjun-r.com's "I
        // experiment a lot" grid. With rates spread 0.45–1.55, the
        // strongest cards travel ±229px between section entry and
        // exit; the calmest pair (0.90 / 1.20) travel ±42–83px.
        const offset = (clamped - 0.5) * 520 * (c.rate - 1);
        el.style.transform = buildTransform(c, offset);
      });
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="learnings"
      className="section learnings"
      data-screen-label="04 Learnings"
      ref={sectionRef}
    >
      <div className="container">
        <div className="section-head reveal">
          <div>
            <h2 className="h">Learnings</h2>
            <div
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "var(--muted)",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              outside of class
            </div>
          </div>
        </div>

        <div className="learn-canvas reveal-stagger" ref={canvasRef}>
          {CARDS.map((c) => (
            <div
              key={c.id}
              className="learn-card-tan"
              data-card={JSON.stringify(c)}
              style={{
                width: c.w,
                height: c.h,
                left: c.x + "%",
                top: c.y + "%",
                transform: buildTransform(c, 0),
              }}
            >
              <div className="image-slot">{c.label}</div>
              <div className="l-caption">{c.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
