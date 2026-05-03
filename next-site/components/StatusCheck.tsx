"use client";

import { useInView } from "@/lib/useInView";

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
  const [sectionRef, inView] = useInView<HTMLElement>();
  return (
    <section
      ref={sectionRef}
      className={`status-check${inView ? " in-view" : ""}`}
      id="status-check"
      aria-label="Current projects status"
    >
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
        /* Sparkle marker — slides ALONG the bar from 0% to the
           project progress endpoint, synced with the bar fill. The
           inline style sets --progress (e.g. 62%); CSS pins left to
           0% by default, then transitions to var(--progress) when
           the section is in-view. */
        .sc-bar-marker {
          position: absolute;
          top: 50%;
          left: 0%;
          width: clamp(28px, 3vw, 38px);
          height: clamp(28px, 3vw, 38px);
          color: ${SKETCH.yellowBar};
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: drop-shadow(0 2px 3px rgba(58, 35, 28, 0.25));
          transition: left 0.85s cubic-bezier(.16,1,.3,1);
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

        /* ── Scroll-reveal cascade ── */
        .status-check .sc-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .status-check.in-view .sc-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        .status-check.in-view .sc-reveal[data-r="1"] { transition-delay: 0.05s; }
        .status-check.in-view .sc-reveal[data-r="2"] { transition-delay: 0.18s; }
        .status-check.in-view .sc-reveal[data-r="3"] { transition-delay: 0.30s; }
        .status-check.in-view .sc-reveal[data-r="4"] { transition-delay: 0.42s; }
        .status-check.in-view .sc-reveal[data-r="5"] { transition-delay: 0.54s; }
        /* Bar fill + sparkle marker also stagger in once the row is
           visible — they grow from 0 width on entrance, then settle
           to the project's progress percentage. */
        .status-check .sc-bar-fill {
          transform-origin: left center;
          transform: scaleX(0);
          transition:
            transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
            width 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .status-check.in-view .sc-bar-fill { transform: scaleX(1); }
        .status-check.in-view .sc-row[data-r="2"] .sc-bar-fill { transition-delay: 0.32s; }
        .status-check.in-view .sc-row[data-r="3"] .sc-bar-fill { transition-delay: 0.48s; }
        .status-check.in-view .sc-row[data-r="4"] .sc-bar-fill { transition-delay: 0.64s; }
        /* Marker rides the bar — starts at left:0% and transitions
           to left:var(--progress) on the SAME timing as the bar
           fill, so the sparkle visually surfs the right edge of the
           growing yellow region instead of popping in at the end. */
        .status-check .sc-bar-marker {
          opacity: 0;
          transition:
            left 0.85s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .status-check.in-view .sc-bar-marker {
          left: var(--progress);
          opacity: 1;
        }
        .status-check.in-view .sc-row[data-r="2"] .sc-bar-marker {
          transition-delay: 0.32s;
        }
        .status-check.in-view .sc-row[data-r="3"] .sc-bar-marker {
          transition-delay: 0.48s;
        }
        .status-check.in-view .sc-row[data-r="4"] .sc-bar-marker {
          transition-delay: 0.64s;
        }

        @media (prefers-reduced-motion: reduce) {
          .status-check .sc-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .status-check .sc-bar-fill {
            transform: scaleX(1) !important;
            transition: none !important;
          }
          .status-check .sc-bar-marker {
            opacity: 1 !important;
            left: var(--progress) !important;
            transition: none !important;
          }
        }

        /* Below 720px, scale type a touch more aggressively but still
           prefer fitting 3 rows in viewport. Stack-centered alignment
           so the title, subtitle, and rows read as a single column. */
        @media (max-width: 720px) {
          .status-check { min-height: auto; padding: 56px 20px; }
          .sc-row-name { font-size: clamp(1.25rem, 4vw, 1.55rem); text-align: center; }
          .sc-inner { text-align: center; }
          .sc-bar-row {
            flex-wrap: nowrap;
          }
        }
      `}</style>

      <div className="sc-inner">
        <div className="sc-title-wrap">
          <h2 className="sc-title sc-reveal" data-r="1">Status Check</h2>
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
          <p className="sc-subtitle sc-reveal" data-r="2">
            What I&apos;m currently working on
          </p>
        </div>

        {items.map((it, idx) => {
          const pct = Math.round(clamp01(it.progress) * 100);
          // Stagger row reveal — first row at index 2 since the title
          // and subtitle take slots 1-2; rows fall on 2,3,4 from there.
          const rIdx = Math.min(idx + 2, 4);
          return (
            <div
              className="sc-row sc-reveal"
              data-r={String(rIdx)}
              key={it.name}
            >
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
                      decorative duplicate of the progressbar value.
                      `--progress` is a CSS variable so the marker
                      can start at 0% and slide along the bar to its
                      final position when the section enters view. */}
                  <span
                    className="sc-bar-marker"
                    style={{ ["--progress" as string]: `${pct}%` }}
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
