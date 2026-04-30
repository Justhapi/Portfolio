"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * MenuNav — hero composition matching the sketch:
 *   • Circular turquoise badge (top-left) with a "peeking" character slot
 *     and a multi-line pitch tagline inside.
 *   • Vertical stack of yellow pill nav buttons (top-right) with checkbox
 *     bullets — Projects / Work in Progress / About / Connect.
 *
 * Distilled from the original Framer Menu_Nav component, simplified to fit
 * the sketch's quieter top-right pill column rather than the osu!-style
 * orb-tucked pills (we still keep the brand palette + ease tokens so it
 * reads as the same family as the rest of the portfolio).
 */

// ── Brand tokens (mirrors Project_Carousel + FooterConnect vocabulary) ──
const BRAND = {
  cream: "#FFDA85",
  creamLight: "#FFE6AC",
  creamWhite: "#FCF6E8",
  peach: "#E19F7E",
  terracotta: "#B5675B",
  teal: "#96C5C6",
  tealLight: "#C4E0E1",
  tealShade: "#6FA0A1",
  cornflower: "#5D8EF4",
  cocoa: "#3A2A1F",
  plum: "#6B5D70",
  navyDeep: "#1B1E2E",
  navyMid: "#2A2D42",
} as const;

const EASE = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  outQuart: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOutQuart: [0.77, 0, 0.175, 1] as [number, number, number, number],
} as const;

type Pill = {
  label: string;
  href: string;
  subtitle?: string;
};

const DEFAULT_PILLS: Pill[] = [
  { label: "Projects", href: "#projects", subtitle: "things I've built" },
  { label: "Work in Progress", href: "#wip", subtitle: "what's cooking" },
  { label: "About Me", href: "#about", subtitle: "the human bit" },
  { label: "Connect", href: "#footer", subtitle: "say hello" },
];

export type MenuNavProps = {
  pills?: Pill[];
  tagline?: string;
  characterSrc?: string; // peeking character image; falls back to placeholder
  monogram?: string; // shown if no character image
};

export default function MenuNav({
  pills = DEFAULT_PILLS,
  tagline = "Digital artist\nturned UI ×\nInteraction\nDesigner",
  characterSrc,
  monogram = "kl",
}: MenuNavProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const taglineLines = useMemo(() => tagline.split("\n"), [tagline]);

  return (
    <section className="hero-section" aria-label="Portfolio hero">
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 80px 56px 64px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: center;
          gap: 64px;
        }

        /* ─── Turquoise hero badge ─────────────────────────────── */
        .hero-badge {
          position: relative;
          width: min(520px, 80%);
          aspect-ratio: 1 / 1;
          margin-left: clamp(0px, 4vw, 80px);
          border-radius: 50%;
          /* Saturated single-hue fill with a soft top-left highlight —
             same poster-weight read as the Framer orb. */
          background:
            radial-gradient(circle at 30% 26%, rgba(255, 230, 172, 0.32) 0%, transparent 58%),
            linear-gradient(155deg, ${BRAND.teal} 0%, ${BRAND.tealShade} 60%, #3F767A 100%);
          border: 18px solid ${BRAND.creamWhite};
          box-sizing: border-box;
          box-shadow:
            0 28px 70px -18px rgba(58, 35, 28, 0.45),
            0 8px 20px -6px rgba(58, 35, 28, 0.24),
            inset 0 -28px 56px -14px rgba(27, 30, 46, 0.48),
            inset 0 14px 26px -6px rgba(255, 246, 232, 0.22);
          isolation: isolate;
          overflow: visible;
        }

        /* Triangle constellation inside the orb */
        .hero-badge .stars {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-badge .stars svg {
          position: absolute;
          opacity: 0.18;
        }

        /* Tagline inside the orb */
        .hero-tagline {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 18% 14% 18% 18%;
          font-family: 'Caveat', cursive;
          font-weight: 600;
          font-size: clamp(28px, 3.8vw, 52px);
          line-height: 1.05;
          color: ${BRAND.creamWhite};
          text-shadow: 0 2px 14px rgba(20, 30, 50, 0.35);
          z-index: 2;
        }
        .hero-tagline span { display: block; }
        .hero-tagline span.accent { color: ${BRAND.cream}; }

        /* Peeking character slot — bottom-right of the orb */
        .hero-character {
          position: absolute;
          right: -8%;
          bottom: -4%;
          width: 38%;
          aspect-ratio: 3 / 4;
          z-index: 3;
          pointer-events: none;
          filter: drop-shadow(0 8px 18px rgba(20, 30, 50, 0.35));
        }
        .hero-character img,
        .hero-character .placeholder {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .hero-character .placeholder {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-family: 'Caveat', cursive;
          font-size: clamp(40px, 6vw, 96px);
          color: ${BRAND.creamWhite};
          background:
            linear-gradient(180deg, transparent 0%, transparent 55%, rgba(94, 107, 161, 0.35) 100%);
          border-radius: 18px;
          line-height: 1;
          padding-bottom: 8%;
          letter-spacing: -0.02em;
        }

        /* ─── Yellow pill stack ────────────────────────────────── */
        .pill-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: stretch;
          justify-self: end;
          width: min(440px, 100%);
        }

        .pill {
          position: relative;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 24px 18px 22px;
          background: linear-gradient(180deg, ${BRAND.creamLight} 0%, ${BRAND.cream} 100%);
          color: ${BRAND.cocoa};
          text-decoration: none;
          border-radius: 999px;
          border: 2px solid rgba(58, 35, 28, 0.22);
          box-shadow:
            0 8px 18px rgba(58, 35, 28, 0.22),
            inset 0 1px 0 rgba(255, 246, 232, 0.55),
            inset 0 -2px 0 rgba(165, 110, 50, 0.18);
          font-family: 'Caveat', cursive;
          font-size: 30px;
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1;
          cursor: pointer;
          transform-origin: 50% 50%;
          transition:
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 320ms ease,
            background 320ms ease;
        }
        .pill .check {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: ${BRAND.creamWhite};
          border: 2px solid ${BRAND.cocoa};
          display: grid;
          place-items: center;
          color: ${BRAND.terracotta};
          font-weight: 800;
          font-size: 18px;
          font-family: 'Sora', sans-serif;
          box-shadow: inset 0 -2px 0 rgba(58, 35, 28, 0.14);
        }
        .pill .pill-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          line-height: 1;
        }
        .pill .pill-sub {
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          font-style: italic;
          font-weight: 400;
          opacity: 0.7;
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        @media (hover: hover) {
          .pill:hover {
            transform: translateY(-3px) translateX(-4px);
            background: linear-gradient(180deg, ${BRAND.cream} 0%, ${BRAND.creamLight} 100%);
            box-shadow:
              0 14px 28px rgba(58, 35, 28, 0.3),
              inset 0 1px 0 rgba(255, 246, 232, 0.6);
          }
          .pill:hover .check {
            background: ${BRAND.terracotta};
            color: ${BRAND.creamWhite};
            border-color: ${BRAND.cocoa};
          }
        }
        .pill:focus-visible {
          outline: 3px solid rgba(255, 218, 133, 0.95);
          outline-offset: 4px;
        }
        .pill:active {
          transform: translateY(-1px) scale(0.985);
          transition-duration: 120ms;
        }

        /* Mobile — stack character and pills vertically */
        @media (max-width: 860px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 56px 24px 40px;
          }
          .hero-badge { margin: 0 auto; width: 86%; }
          .pill-stack { justify-self: stretch; width: 100%; }
          .pill { font-size: 26px; padding: 14px 20px; }
        }
      `}</style>

      {/* ─── Hero badge ─── */}
      <motion.div
        className="hero-badge"
        initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={mounted ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={{ duration: 1, ease: EASE.outExpo }}
      >
        <Stars />
        <div className="hero-tagline" aria-hidden>
          {taglineLines.map((line, i) => (
            <span key={i} className={i === 1 ? "accent" : undefined}>
              {line}
            </span>
          ))}
        </div>

        {/* Peeking character */}
        <motion.div
          className="hero-character"
          initial={prefersReducedMotion ? false : { y: 60, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE.outExpo }}
        >
          {characterSrc ? (
            <img src={characterSrc} alt="" />
          ) : (
            <div className="placeholder" aria-hidden>
              {monogram}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ─── Vertical pill nav ─── */}
      <nav className="pill-stack" aria-label="Primary">
        {pills.map((p, i) => (
          <motion.a
            key={p.label}
            href={p.href}
            className="pill"
            initial={prefersReducedMotion ? false : { x: 80, opacity: 0 }}
            animate={mounted ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.4 + i * 0.1,
              ease: EASE.outQuart,
            }}
          >
            <span className="check" aria-hidden>
              ✓
            </span>
            <span className="pill-text">
              <span>{p.label}</span>
              {p.subtitle && <span className="pill-sub">{p.subtitle}</span>}
            </span>
          </motion.a>
        ))}
      </nav>
    </section>
  );
}

/* Triangle constellation — clipped to the orb's interior. */
function Stars() {
  const triangles = [
    { x: 18, y: 16, size: 22, rot: -12 },
    { x: 62, y: 10, size: 14, rot: 20 },
    { x: 38, y: 30, size: 30, rot: 8 },
    { x: 74, y: 42, size: 18, rot: -22 },
    { x: 10, y: 52, size: 16, rot: 34 },
    { x: 56, y: 64, size: 26, rot: -8 },
    { x: 28, y: 78, size: 20, rot: 16 },
    { x: 78, y: 82, size: 12, rot: -30 },
    { x: 46, y: 90, size: 16, rot: 22 },
    { x: 88, y: 28, size: 10, rot: 14 },
  ];
  return (
    <div className="stars" aria-hidden>
      {triangles.map((t, i) => (
        <svg
          key={i}
          viewBox="0 0 10 10"
          width={`${t.size}%`}
          height={`${t.size}%`}
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            transform: `translate(-50%, -50%) rotate(${t.rot}deg)`,
          }}
        >
          <path d="M5 0 L10 10 L0 10 Z" fill={BRAND.creamWhite} />
        </svg>
      ))}
    </div>
  );
}
