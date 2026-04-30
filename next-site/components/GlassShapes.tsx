"use client";

import { useEffect, useRef } from "react";

/**
 * GlassShapes — frosted-glass scattered geometry, parallax-scrolled.
 *
 * Each shape uses the user-supplied SVG (in /public/shapes) as a CSS
 * mask-image. The masked div has:
 *   • backdrop-filter: blur — content behind refracts through the silhouette
 *   • a soft 135° highlight gradient as fill — gives the "glass dial" look
 *   • drop-shadow filter for warm-tinted depth (no pure-black shadows)
 *
 * Three depth layers parallax at different rates so the scene feels
 * volumetric. Foreground shapes ride a faster (sometimes negative) rate
 * so they appear to swim past the camera; background shapes drift slowly.
 *
 * Scatter is hand-placed (Memphis-style asymmetric composition) — values
 * are in vw (left) and px (top) so positions track the viewport's width
 * but anchor to absolute page-y to maintain rhythm against sections.
 */

type ShapeName =
  | "disc"
  | "ring-thick"
  | "ring-thin"
  | "triangle"
  | "rect"
  | "striped-circle";

type ShapeDef = {
  id: string;
  shape: ShapeName;
  layer: "bg" | "mid" | "fg";
  left: string; // vw or %
  top: number; // px page-y
  width: number;
  rotate: number;
  rate: number; // px-per-px scroll. Positive = lags, negative = leads
  tint?: "white" | "cream" | "peach" | "teal" | "cornflower"; // gradient color
  flip?: boolean;
};

// Native aspect ratios from the SVG viewBoxes — used to derive height.
const ASPECT: Record<ShapeName, number> = {
  disc: 222 / 221,
  "ring-thick": 222 / 221,
  "ring-thin": 144 / 148,
  triangle: 239 / 244,
  rect: 235 / 259,
  "striped-circle": 310 / 342,
};

// Hand-placed Memphis scatter. Reads asymmetric on purpose. Edit freely
// — keep mass distribution roughly balanced (a far-right cluster wants
// a far-left counterweight a section or two down).
const SHAPES: ShapeDef[] = [
  // ── Hero band (0 – 800px) ────────────────────────────────────
  { id: "h1", shape: "ring-thick",     layer: "bg",  left: "76vw", top:  -40, width: 240, rotate:  -12, rate:  0.18, tint: "teal" },
  { id: "h2", shape: "triangle",       layer: "bg",  left: "8vw",  top:  220, width: 180, rotate:   18, rate:  0.22, tint: "cornflower" },
  { id: "h3", shape: "disc",           layer: "mid", left: "62vw", top:  500, width: 90,  rotate:    0, rate: -0.30, tint: "peach" },
  { id: "h4", shape: "ring-thin",      layer: "mid", left: "16vw", top:  640, width: 110, rotate:   24, rate:  0.45, tint: "cream" },
  { id: "h5", shape: "striped-circle", layer: "bg",  left: "84vw", top:  720, width: 220, rotate:   30, rate:  0.20, tint: "white" },
  { id: "h6", shape: "rect",           layer: "fg",  left: "44vw", top:  340, width: 70,  rotate:  -22, rate: -0.65, tint: "cornflower" },
  { id: "h7", shape: "triangle",       layer: "fg",  left: "92vw", top:  420, width: 56,  rotate:   38, rate:  0.85, tint: "white" },

  // ── Projects band (800 – 1700px) ─────────────────────────────
  { id: "p1", shape: "ring-thick",     layer: "bg",  left: "4vw",  top: 1100, width: 200, rotate:    8, rate:  0.20, tint: "teal" },
  { id: "p2", shape: "disc",           layer: "bg",  left: "78vw", top: 1180, width: 180, rotate:    0, rate:  0.25, tint: "cream" },
  { id: "p3", shape: "triangle",       layer: "mid", left: "30vw", top: 1320, width: 80,  rotate:  -14, rate: -0.4,  tint: "peach" },
  { id: "p4", shape: "ring-thin",      layer: "mid", left: "70vw", top: 1500, width: 130, rotate:   16, rate:  0.55, tint: "cornflower" },
  { id: "p5", shape: "rect",           layer: "fg",  left: "8vw",  top: 1620, width: 80,  rotate:   30, rate:  0.78, tint: "cream" },
  { id: "p6", shape: "disc",           layer: "fg",  left: "58vw", top: 1740, width: 50,  rotate:    0, rate:  0.9,  tint: "white" },
  { id: "p7", shape: "striped-circle", layer: "bg",  left: "20vw", top: 1820, width: 180, rotate:  -22, rate:  0.18, tint: "teal" },

  // ── Footer band (2000+) ──────────────────────────────────────
  { id: "f1", shape: "ring-thick",     layer: "bg",  left: "82vw", top: 2200, width: 220, rotate:   28, rate:  0.22, tint: "white" },
  { id: "f2", shape: "triangle",       layer: "bg",  left: "12vw", top: 2400, width: 160, rotate:   12, rate:  0.18, tint: "cornflower" },
  { id: "f3", shape: "ring-thin",      layer: "mid", left: "48vw", top: 2600, width: 110, rotate:   -8, rate:  0.5,  tint: "cream" },
  { id: "f4", shape: "rect",           layer: "fg",  left: "32vw", top: 2820, width: 60,  rotate:   18, rate: -0.7,  tint: "peach" },
  { id: "f5", shape: "disc",           layer: "fg",  left: "88vw", top: 3000, width: 44,  rotate:    0, rate:  0.85, tint: "white" },
];

// Tint maps to a 135° gradient stop pair. White = neutral cool glass.
const TINTS: Record<NonNullable<ShapeDef["tint"]>, [string, string, string]> = {
  white: [
    "rgba(255, 255, 255, 0.55)",
    "rgba(255, 255, 255, 0.18)",
    "rgba(255, 255, 255, 0.42)",
  ],
  cream: [
    "rgba(255, 230, 172, 0.65)",
    "rgba(255, 218, 133, 0.20)",
    "rgba(255, 246, 232, 0.50)",
  ],
  peach: [
    "rgba(229, 165, 149, 0.65)",
    "rgba(225, 159, 126, 0.22)",
    "rgba(255, 220, 200, 0.45)",
  ],
  teal: [
    "rgba(196, 224, 225, 0.60)",
    "rgba(150, 197, 198, 0.22)",
    "rgba(212, 240, 240, 0.45)",
  ],
  cornflower: [
    "rgba(168, 194, 248, 0.62)",
    "rgba(93, 142, 244, 0.22)",
    "rgba(210, 224, 252, 0.42)",
  ],
};

export default function GlassShapes() {
  const elsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const apply = () => {
      const y = window.scrollY;
      elsRef.current.forEach((el) => {
        if (!el) return;
        const rate = parseFloat(el.dataset.rate || "0");
        const baseRot = parseFloat(el.dataset.rot || "0");
        // Tiny rotation drift adds liveliness without nausea — under 2deg
        // total swing per shape.
        const rot = baseRot + Math.sin((y + el.offsetTop) * 0.0008) * 1.4;
        el.style.transform = `translate3d(0, ${(y * rate).toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      });
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="glass-layer" aria-hidden>
      <style>{`
        .gshape {
          position: absolute;
          will-change: transform;
          pointer-events: none;
        }
        .gshape .glass {
          position: absolute;
          inset: 0;
          /* The shape's silhouette is what masks the glass fill. We use
             the SVG as a luminance mask — the SVG is white-on-transparent
             so opaque pixels of the SVG = where the glass shows. */
          -webkit-mask-image: var(--mask);
          mask-image: var(--mask);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          /* Soft 135° glass dial — bright top-left, dim mid, hot edge bottom-right. */
          background: linear-gradient(135deg,
            var(--c1) 0%,
            var(--c2) 45%,
            var(--c3) 100%);
          /* Frosted refraction of whatever sits behind the shape. */
          backdrop-filter: blur(8px) saturate(1.05);
          -webkit-backdrop-filter: blur(8px) saturate(1.05);
        }
        /* Foreground shapes get heavier frost + a cooler highlight. */
        .gshape.fg .glass {
          backdrop-filter: blur(12px) saturate(1.1);
          -webkit-backdrop-filter: blur(12px) saturate(1.1);
        }
        /* A second masked layer adds a thin cream rim-light along the
           top-left edge — keeps the silhouette from disappearing into
           the gradient page background. Implemented as a luminance
           mask repeated on a slightly offset gradient. */
        .gshape .rim {
          position: absolute;
          inset: 0;
          -webkit-mask-image: var(--mask);
          mask-image: var(--mask);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          background: linear-gradient(135deg,
            rgba(255, 246, 232, 0.55) 0%,
            rgba(255, 246, 232, 0) 35%,
            rgba(0, 0, 0, 0) 65%,
            rgba(58, 35, 28, 0.20) 100%);
          mix-blend-mode: overlay;
          opacity: 0.85;
        }
        /* Warm-tinted drop shadow — never pure black. Applied as a
           filter rather than box-shadow because mask-image clips
           box-shadow to the bounding box, but filter:drop-shadow
           respects the mask silhouette. */
        .gshape.bg  { filter: drop-shadow(0 14px 26px rgba(20, 30, 50, 0.28)); opacity: 0.65; }
        .gshape.mid { filter: drop-shadow(0 18px 32px rgba(20, 30, 50, 0.34)); opacity: 0.85; }
        .gshape.fg  { filter: drop-shadow(0 22px 38px rgba(20, 30, 50, 0.40)); opacity: 0.95; }

        @media (prefers-reduced-motion: reduce) {
          .gshape { transform: none !important; }
        }
        @media (max-width: 860px) {
          /* Quiet the shape layer on mobile — same mass would crowd
             the narrower viewport. We knock out roughly half via :nth. */
          .gshape:nth-child(odd) { display: none; }
        }
      `}</style>
      {SHAPES.map((s, i) => {
        const aspect = ASPECT[s.shape];
        const height = s.width * aspect;
        const tintKey = s.tint ?? "white";
        const [c1, c2, c3] = TINTS[tintKey];
        const flipScale = s.flip ? -1 : 1;
        return (
          <div
            key={s.id}
            ref={(el) => {
              if (el) elsRef.current[i] = el;
            }}
            className={`gshape ${s.layer}`}
            data-rate={s.rate}
            data-rot={s.rotate}
            style={
              {
                left: s.left,
                top: s.top,
                width: s.width,
                height,
                transform: `translate3d(0,0,0) rotate(${s.rotate}deg) scaleX(${flipScale})`,
                "--mask": `url(/shapes/${s.shape}.svg)`,
                "--c1": c1,
                "--c2": c2,
                "--c3": c3,
              } as React.CSSProperties & { [key: `--${string}`]: string }
            }
          >
            <div className="glass" />
            <div className="rim" />
          </div>
        );
      })}
    </div>
  );
}
