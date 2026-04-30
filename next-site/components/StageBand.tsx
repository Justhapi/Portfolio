"use client";

import { type ReactNode } from "react";

/**
 * StageBand — colorfulstage.com-style section wrapper.
 *
 * Project Sekai: Colorful Stage uses a recognizable visual vocabulary
 * that this component hard-encodes:
 *
 *   • Parallelogram section dividers — top + bottom of the band are
 *     skewed -8° so adjacent bands "interlock" diagonally rather than
 *     stacking on flat horizontal seams.
 *   • Multi-stop saturated gradient (each unit/section gets its own
 *     palette via the `accent` prop — purple, pink, blue, teal,
 *     yellow, green — keyed to Colorful Stage's idol-unit colors).
 *   • Stage-spotlight beam lines streaming diagonally across the
 *     background — implemented as repeating-linear-gradient at -65°.
 *   • Chunky condensed display heading — single word, very tight
 *     letter-spacing, italic + skewed for performance feel.
 *   • Halftone dot field anchored bottom-right (inherited motif).
 *
 * Children render *inside* the un-skewed inner shell so content stays
 * upright while the band's silhouette is angular.
 */

export type StageAccent =
  | "leoneed"        // pink   — Leo/need
  | "moremorejump"   // sky    — MORE MORE JUMP!
  | "vivid"          // green  — Vivid BAD SQUAD
  | "wonderlands"    // yellow — Wonderlands x Showtime
  | "nightcord"      // purple — 25-ji, Nightcord de.
  | "virtual";       // teal   — Virtual Singer

const PALETTES: Record<
  StageAccent,
  {
    a: string; // gradient start
    b: string; // gradient mid
    c: string; // gradient end
    beam: string; // beam-line color (alpha applied in CSS)
    ink: string; // heading ink
    body: string; // body ink
  }
> = {
  leoneed: {
    a: "#ff5b8a",
    b: "#ff7fa6",
    c: "#ffc4d8",
    beam: "255,255,255",
    ink: "#3a0e22",
    body: "#5a1936",
  },
  moremorejump: {
    a: "#3aa8ff",
    b: "#74c4ff",
    c: "#cae8ff",
    beam: "255,255,255",
    ink: "#06243f",
    body: "#0c3358",
  },
  vivid: {
    a: "#1aa97a",
    b: "#3fc899",
    c: "#bdf0d9",
    beam: "255,255,255",
    ink: "#06321f",
    body: "#0c4630",
  },
  wonderlands: {
    a: "#ffb734",
    b: "#ffce6c",
    c: "#fff0c3",
    beam: "255,255,255",
    ink: "#3a230c",
    body: "#5a3414",
  },
  nightcord: {
    a: "#6b4dc7",
    b: "#9d7fe6",
    c: "#d6c8f6",
    beam: "255,255,255",
    ink: "#1d0a3e",
    body: "#2c1357",
  },
  virtual: {
    a: "#3fc4d4",
    b: "#74dde9",
    c: "#cef1f5",
    beam: "255,255,255",
    ink: "#073138",
    body: "#0d4750",
  },
};

export type StageBandProps = {
  /** Big single-word display heading at the top of the band. */
  heading: string;
  /** Smaller eyebrow above the heading (caveat-style label). */
  eyebrow?: string;
  /** Optional small italic subtitle under the heading. */
  subtitle?: string;
  /** Color palette / unit identity. */
  accent?: StageAccent;
  /** Whether to skew the top edge (set false for first band). */
  skewTop?: boolean;
  /** Whether to skew the bottom edge (set false for last band). */
  skewBottom?: boolean;
  /** Body content — renders inside an un-skewed inner shell. */
  children?: ReactNode;
  /** Optional anchor id. */
  id?: string;
};

export default function StageBand({
  heading,
  eyebrow,
  subtitle,
  accent = "nightcord",
  skewTop = true,
  skewBottom = true,
  children,
  id,
}: StageBandProps) {
  const p = PALETTES[accent];

  return (
    <section
      id={id}
      className="stage-band"
      data-accent={accent}
      data-skew-top={skewTop}
      data-skew-bottom={skewBottom}
      style={
        {
          "--sb-a": p.a,
          "--sb-b": p.b,
          "--sb-c": p.c,
          "--sb-beam": p.beam,
          "--sb-ink": p.ink,
          "--sb-body": p.body,
        } as React.CSSProperties & { [key: `--${string}`]: string }
      }
    >
      <style>{`
        /* Tokens are scoped per-band via inline style on the outer; the
           static rules below read those custom-properties. */
        .stage-band {
          position: relative;
          isolation: isolate;
          /* Negative top-margin lets adjacent bands' diagonal seams
             interlock rather than leaving a horizontal sliver. */
          margin-top: -36px;
          padding: clamp(120px, 14vw, 220px) 0 clamp(140px, 16vw, 240px);
          color: var(--sb-body);
        }

        /* The skewed background plate sits behind content. We render it
           as ::before so the inner content stays un-skewed. */
        .stage-band::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            /* Spotlight beams streaming diagonally — thin alternating
               highlights. The mask fades them out toward the bottom-left
               so they read as light shafts, not stripes. */
            repeating-linear-gradient(
              -65deg,
              rgba(var(--sb-beam), 0)         0px,
              rgba(var(--sb-beam), 0)         52px,
              rgba(var(--sb-beam), 0.07)      52px,
              rgba(var(--sb-beam), 0.07)      62px,
              rgba(var(--sb-beam), 0)         62px,
              rgba(var(--sb-beam), 0)         108px,
              rgba(var(--sb-beam), 0.16)      108px,
              rgba(var(--sb-beam), 0.16)      114px
            ),
            /* Stage-light radial blooms — top-right hot, bottom-left cool. */
            radial-gradient(
              ellipse 70% 90% at 90% 10%,
              rgba(255,255,255,0.30) 0%,
              transparent 55%
            ),
            radial-gradient(
              ellipse 60% 80% at 5% 95%,
              rgba(0,0,0,0.18) 0%,
              transparent 55%
            ),
            /* Base unit gradient. */
            linear-gradient(135deg, var(--sb-a) 0%, var(--sb-b) 50%, var(--sb-c) 100%);
          /* Skew the plate so its top + bottom edges read as
             parallelograms. clip-path takes precedence when supported,
             giving us crisp angular seams without overflow weirdness. */
          z-index: -1;
        }
        .stage-band[data-skew-top="true"][data-skew-bottom="true"]::before {
          clip-path: polygon(0 4%, 100% 0%, 100% 96%, 0 100%);
        }
        .stage-band[data-skew-top="true"][data-skew-bottom="false"]::before {
          clip-path: polygon(0 4%, 100% 0%, 100% 100%, 0 100%);
        }
        .stage-band[data-skew-top="false"][data-skew-bottom="true"]::before {
          clip-path: polygon(0 0, 100% 0, 100% 96%, 0 100%);
        }

        /* Halftone dot field anchored bottom-right — inherited from your
           hero. Sits above the gradient but below content. */
        .stage-band-halftone {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          background-image:
            radial-gradient(circle, rgba(0,0,0,0.32) 1.6px, transparent 1.6px),
            radial-gradient(circle, rgba(0,0,0,0.18) 1px,   transparent 1px);
          background-size: 22px 22px, 11px 11px;
          background-position: 0 0, 5px 5px;
          -webkit-mask-image:
            radial-gradient(ellipse 90% 70% at 105% 95%, black 5%, transparent 60%);
          mask-image:
            radial-gradient(ellipse 90% 70% at 105% 95%, black 5%, transparent 60%);
        }

        /* Inner shell — keeps content upright, max-width centered. */
        .stage-band-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 56px);
        }

        /* Eyebrow — chevron + caveat label */
        .stage-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Caveat', cursive;
          font-size: clamp(1.05rem, 1.4vw, 1.35rem);
          letter-spacing: 0.02em;
          color: var(--sb-ink);
          margin: 0 0 18px;
          opacity: 0.78;
        }
        .stage-eyebrow::before {
          content: "▶";
          font-size: 0.7em;
          transform: translateY(-1px);
          color: var(--sb-ink);
          opacity: 0.6;
        }

        /* Display heading — chunky, condensed, italic-skewed.
           This is the colorfulstage signature: a stretched single word
           that reads almost like a stage banner. */
        .stage-heading {
          font-family: 'Anton', 'Bebas Neue', 'Oswald', 'Impact',
            system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(4.5rem, 12vw, 11rem);
          line-height: 0.84;
          letter-spacing: -0.02em;
          margin: 0;
          color: var(--sb-ink);
          text-transform: uppercase;
          /* Slight italic skew for performance feel. */
          transform: skewX(-6deg);
          transform-origin: left center;
          /* Layered drop-shadow gives it stage-banner depth without
             leaning on a heavy bg blur. */
          text-shadow:
            2px 2px 0 rgba(255,255,255,0.55),
            6px 6px 0 rgba(0,0,0,0.18);
        }
        /* Outline-overlay copy of the heading offset behind it for a
           "ghost banner" effect — mimics the Project Sekai unit
           wordmarks where the second-language title sits behind the
           main lockup. */
        .stage-heading-ghost {
          position: absolute;
          left: clamp(20px, 4vw, 56px);
          top: -0.18em;
          font-family: 'Anton', 'Bebas Neue', 'Oswald', 'Impact',
            system-ui, sans-serif;
          font-weight: 900;
          font-size: clamp(4.5rem, 12vw, 11rem);
          line-height: 0.84;
          letter-spacing: -0.02em;
          color: transparent;
          -webkit-text-stroke: 2px rgba(255,255,255,0.55);
          text-transform: uppercase;
          transform: skewX(-6deg) translate(10px, 10px);
          transform-origin: left center;
          pointer-events: none;
          user-select: none;
        }

        .stage-heading-row {
          position: relative;
          margin-bottom: clamp(28px, 4vw, 56px);
        }

        .stage-subtitle {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: clamp(1rem, 1.3vw, 1.2rem);
          font-style: italic;
          color: var(--sb-body);
          opacity: 0.85;
          max-width: 56ch;
          line-height: 1.5;
          margin: 1.4rem 0 0;
        }

        /* Children area — gives content breathing room from the heading. */
        .stage-band-content {
          position: relative;
          margin-top: clamp(24px, 3vw, 56px);
        }

        /* Mobile: drop the skew so seams stay clean on narrow viewports. */
        @media (max-width: 720px) {
          .stage-band {
            margin-top: -18px;
            padding: clamp(80px, 18vw, 140px) 0 clamp(100px, 22vw, 180px);
          }
          .stage-band::before {
            clip-path: none !important;
          }
          .stage-heading {
            font-size: clamp(3.4rem, 16vw, 5.6rem);
            transform: skewX(-4deg);
          }
          .stage-heading-ghost {
            font-size: clamp(3.4rem, 16vw, 5.6rem);
            transform: skewX(-4deg) translate(6px, 6px);
            -webkit-text-stroke-width: 1.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stage-band, .stage-band::before, .stage-heading {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className="stage-band-halftone" aria-hidden />

      <div className="stage-band-inner">
        {eyebrow ? <p className="stage-eyebrow">{eyebrow}</p> : null}
        <div className="stage-heading-row">
          <span className="stage-heading-ghost" aria-hidden>
            {heading}
          </span>
          <h2 className="stage-heading">{heading}</h2>
        </div>
        {subtitle ? <p className="stage-subtitle">{subtitle}</p> : null}
        {children ? (
          <div className="stage-band-content">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
