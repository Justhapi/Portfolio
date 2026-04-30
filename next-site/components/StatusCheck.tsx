"use client";

/**
 * StatusCheck — direct port of the user's hand-drawn "Status Check"
 * sketch.
 *
 * Each row is a project name (Caveat yellow) above a fat rounded
 * progress bar. The bar's filled portion is a soft yellow; the
 * unfilled portion is white. Below the bar, two captions in white
 * Caveat: "Start date" (left) and "(Expected) End Date" (right).
 *
 * Background — dark-teal → lighter-teal vertical gradient, matching
 * the AboutMe section so the two read as a sketchbook spread.
 *
 * The title "Status Check" sits at the top with a hand-drawn squiggly
 * underline (rendered inline as SVG so the wave reads cleanly).
 */

const SKETCH = {
  bgTop: "#3d5560",
  bgBottom: "#7da3ad",
  yellow: "#f0c97f",       // hand-lettering accent
  yellowBar: "#f7e29e",    // progress fill (warm yellow)
  peachUnfilled: "#e3a583",// remaining-time track — warm peach, never white
  peachOutline: "#b5675b", // sparkle stroke / pin accent
  cream: "#fdf6e8",        // body copy
  white: "#ffffff",
  ink: "#1a1612",
} as const;

export type StatusItem = {
  name: string;
  /** 0–1 progress value. */
  progress: number;
  startDate: string;
  endDate: string;
};

const DEFAULT_ITEMS: StatusItem[] = [
  {
    name: "JourneyTrack AI Agent Implementation",
    progress: 0.62,
    startDate: "Sept 2024",
    endDate: "May 2026 (Expected)",
  },
  {
    name: "Purdue Research Collaboration Platform",
    progress: 0.55,
    startDate: "Jan 2024",
    endDate: "Aug 2026 (Expected)",
  },
  {
    name: "Grub Asset Designs",
    progress: 0.78,
    startDate: "Feb 2026",
    endDate: "Jun 2026 (Expected)",
  },
];

export type StatusCheckProps = {
  items?: StatusItem[];
};

export default function StatusCheck({ items = DEFAULT_ITEMS }: StatusCheckProps = {}) {
  return (
    <section className="status-check" id="status-check" aria-label="Current projects status">
      <style>{`
        .status-check {
          position: relative;
          /* Constrain to one viewport so all rows fit without scrolling.
             min-height: 100vh keeps it full-bleed but the inner shell
             uses dynamic spacing keyed off vh so 3 rows always land
             above the fold. */
          min-height: 100vh;
          padding: clamp(48px, 6vh, 72px) clamp(20px, 4vw, 56px);
          /* Transparent — sits on the page-wide white→teal→navy gradient
             where the lower mid-teal / dusk-blue band sits, so cream
             text already has good contrast against the wash. */
          background: transparent;
          color: ${SKETCH.cream};
          font-family: 'Caveat', cursive;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .status-check::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0, transparent 40%),
                            radial-gradient(circle at 20% 80%, rgba(0,0,0,0.06) 0, transparent 50%);
        }

        .sc-inner {
          position: relative;
          width: 100%;
          /* Narrower max-width so the bars read as a contained module
             rather than spanning the full viewport. ~720px keeps the
             rhythm tight and the row labels close to the date stamps. */
          max-width: 720px;
          margin: 0 auto;
        }

        /* Title with hand-drawn underline + caption subtitle */
        .sc-title-wrap {
          margin-bottom: clamp(28px, 4vh, 48px);
          text-align: center;
        }
        .sc-title {
          font-family: 'Caveat', cursive;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          color: ${SKETCH.yellow};
          margin: 0;
          font-weight: 600;
          line-height: 0.95;
          letter-spacing: -0.01em;
        }
        .sc-underline {
          display: block;
          width: clamp(140px, 18vw, 200px);
          height: 12px;
          margin: 4px auto 0;
          color: ${SKETCH.cream};
        }
        .sc-underline svg {
          width: 100%; height: 100%; display: block;
        }
        .sc-subtitle {
          margin: 8px auto 0;
          max-width: 56ch;
          font-family: 'Sora', sans-serif;
          font-size: clamp(0.92rem, 1.05vw, 1.05rem);
          font-weight: 400;
          color: rgba(253, 246, 232, 0.78);
          letter-spacing: 0.005em;
          line-height: 1.45;
        }

        /* Status row — vertical rhythm keyed off vh so 3 rows fit. */
        .sc-row {
          margin-bottom: clamp(20px, 3.4vh, 38px);
        }
        .sc-row:last-child { margin-bottom: 0; }
        .sc-row-name {
          font-family: 'Caveat', cursive;
          font-size: clamp(1.4rem, 2.6vw, 2.1rem);
          color: ${SKETCH.yellow};
          margin: 0 0 8px;
          line-height: 1.1;
          letter-spacing: -0.005em;
          font-weight: 500;
        }

        /* Bar — pill with peach "remaining" track and yellow fill on
           the completed side. The sparkle marker rides the boundary
           between the two colors. */
        .sc-bar {
          position: relative;
          width: 100%;
          height: clamp(20px, 2.6vh, 30px);
          border-radius: 999px;
          background: ${SKETCH.peachUnfilled};
          box-shadow:
            0 3px 0 rgba(0,0,0,0.18),
            inset 0 0 0 1px rgba(58, 35, 28, 0.10);
          overflow: visible; /* sparkle escapes the pill bounds */
        }
        .sc-bar-fill {
          position: absolute; left: 0; top: 0; bottom: 0;
          background: ${SKETCH.yellowBar};
          border-radius: 999px 0 0 999px;
          box-shadow: inset 0 0 0 1px rgba(180, 140, 50, 0.2);
          transition: width 0.7s cubic-bezier(.16,1,.3,1);
        }
        /* Round only the leading (right) edge a touch so the
           yellow→peach boundary feels like a soft handoff rather
           than a hard step. The sparkle then sits over that boundary
           and disguises it. */
        .sc-bar-fill::after {
          content: "";
          position: absolute;
          right: -1px; top: 0; bottom: 0;
          width: 12px;
          background: linear-gradient(90deg,
            ${SKETCH.yellowBar} 0%,
            rgba(247, 226, 158, 0) 100%);
        }
        /* Sparkle marker — pinned to the progress fill's right edge */
        .sc-bar-marker {
          position: absolute;
          top: 50%;
          width: clamp(28px, 3vw, 38px);
          height: clamp(28px, 3vw, 38px);
          color: ${SKETCH.yellowBar};
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: drop-shadow(0 2px 3px rgba(58, 35, 28, 0.25));
          transition: left 0.7s cubic-bezier(.16,1,.3,1);
        }
        .sc-bar-marker svg { width: 100%; height: 100%; display: block; }

        /* Bar row — dates flank the bar on the left and right
           rather than stacking underneath it. The bar grows to
           fill the remaining space so the row reads as one rule
           with date stamps as endpoints. */
        .sc-bar-row {
          display: flex;
          align-items: center;
          gap: clamp(10px, 1.4vw, 16px);
          font-family: 'Caveat', cursive;
          font-size: clamp(0.95rem, 1.3vw, 1.15rem);
          color: ${SKETCH.cream};
          line-height: 1;
        }
        .sc-bar-row .sc-bar { flex: 1 1 auto; }
        .sc-bar-row .start,
        .sc-bar-row .end {
          flex: 0 0 auto;
          white-space: nowrap;
          opacity: 0.92;
        }

        /* Below 720px, scale type a touch more aggressively but still
           prefer fitting 3 rows in viewport. */
        @media (max-width: 720px) {
          .status-check { min-height: auto; padding: 56px 20px; }
          .sc-row-name { font-size: clamp(1.25rem, 4vw, 1.55rem); }
        }
      `}</style>

      <div className="sc-inner">
        <div className="sc-title-wrap">
          <h2 className="sc-title">Status Check</h2>
          <span className="sc-underline" aria-hidden>
            <svg viewBox="0 0 240 14" preserveAspectRatio="none">
              <path
                d="M2 8 Q 22 1 42 8 T 82 8 T 122 8 T 162 8 T 202 8 T 238 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
          <p className="sc-subtitle">What I&apos;m currently working on</p>
        </div>

        {items.map((it) => {
          const pct = Math.round(clamp01(it.progress) * 100);
          return (
            <div className="sc-row" key={it.name}>
              <h3 className="sc-row-name">{it.name}</h3>
              <div className="sc-bar-row">
                <span className="start">{it.startDate}</span>
                <div
                  className="sc-bar"
                  role="progressbar"
                  aria-label={`${it.name} progress`}
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="sc-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                  {/* Sparkle pinned to the progress endpoint — the
                      visual handoff between done (yellow) and
                      remaining (peach). aria-hidden because it's a
                      decorative duplicate of the progressbar value. */}
                  <span
                    className="sc-bar-marker"
                    style={{ left: `${pct}%` }}
                    aria-hidden
                  >
                    <ProgressSparkle />
                  </span>
                </div>
                <span className="end">{it.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/* 4-pointed progress sparkle — yellow fill, peach outline. Same
   silhouette as the sparkles in the open-folder SVG so the design
   reads as one family. */
function ProgressSparkle() {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d="M20 2
           C 20 11, 11 20, 2 20
           C 11 20, 20 29, 20 38
           C 20 29, 29 20, 38 20
           C 29 20, 20 11, 20 2 Z"
        fill="#f7e29e"
        stroke="#b5675b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
