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

const CARDS: Card[] = [
  { id: "l1", w: 270, h: 350, x: 11, y:  6, rot: -14, tilt:  8, lift: -3, z:  20, rate: 0.62, label: "drawing",        caption: "Sketchbook — life drawing" },
  { id: "l2", w: 200, h: 240, x: 36, y:  0, rot:  12, tilt: -10, lift:  4, z: -30, rate: 1.24, label: "code",           caption: "CS minor — coding" },
  { id: "l3", w: 290, h: 380, x: 70, y:  4, rot:  -6, tilt:  6, lift: -2, z:  40, rate: 0.84, label: "obsidian graph", caption: "Obsidian — design notes" },
  { id: "l4", w: 230, h: 290, x:  9, y: 54, rot:   8, tilt:-12, lift:  6, z: -20, rate: 1.32, label: "travels",        caption: "Travels — Kyoto, 2025" },
  { id: "l5", w: 250, h: 320, x: 44, y: 48, rot:  -3, tilt:  9, lift: -4, z:  10, rate: 0.92, label: "food",           caption: "Food maps — Lisbon" },
  { id: "l6", w: 220, h: 300, x: 79, y: 58, rot:  14, tilt: -7, lift:  3, z: -10, rate: 1.12, label: "side art",       caption: "Field notes — observation" },
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
        const offset = (clamped - 0.5) * 240 * (c.rate - 1);
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
