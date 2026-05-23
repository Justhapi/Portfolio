"use client";

import { useEffect, useRef, useState } from "react";

/** 4-pointed sparkle bullet — mirrors the one in ConnectV2. */
const SparkleBullet = () => (
  <svg
    className="c-spark"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
  </svg>
);

/**
 * AboutV2 — bio + an interactive polaroid "iPad" screen.
 *
 * The four bio bullets double as hover/focus triggers: pointing at one
 * swaps the polaroid screen to a matching preview —
 *   · "Purdue Stack"          → a screenshot of the live site
 *   · "Asian Scientists…"     → a carousel of mentoring photos
 *   · "digital illustrations" → an auto-playing carousel of drawings
 *   · "next trip"             → a snapshot of my Beli
 * Clicking the screen opens the live link for the Stack and Beli views,
 * or advances the carousel for the photo / drawing views. With nothing
 * hovered the screen rests on the default sketchbook shot.
 *
 * To drop in real media, replace each <div className="image-slot"> with
 * an <img> (files go in next-site/public/). For the click-through links,
 * set STACK_URL / BELI_URL below and delete the matching e.preventDefault()
 * in handleScreenClick so the links go live.
 */

type IpadView = "sketch" | "stack" | "mentor" | "illos" | "food";

// Slide counts — bump to match how many real photos / drawings you add.
const MENTOR_COUNT = 3;
const ILLOS_COUNT  = 5;

// Click-through destinations. Placeholders — see the file note.
const STACK_URL = "#"; // → Purdue Stack website
const BELI_URL  = "#"; // → your Beli profile

// ── Carousel captions ────────────────────────────────────────────────
// Replace each string with the real caption once photos are dropped in.
// MENTOR_ME_INDEX: which photo (0-based) is the one with you in it.
const MENTOR_ME_INDEX = 0;
const MENTOR_CAPTIONS = [
  "That's me!",                                   // MENTOR_ME_INDEX photo
  "Placeholder mentor caption 2 — swap me",
  "Placeholder mentor caption 3 — swap me",
];
const ILLOS_CAPTIONS = [
  "Placeholder illo caption 1 — swap me",
  "Placeholder illo caption 2 — swap me",
  "Placeholder illo caption 3 — swap me",
  "Placeholder illo caption 4 — swap me",
  "Placeholder illo caption 5 — swap me",
];


export default function AboutV2() {
  // Which preview the polaroid screen is currently showing.
  const [view, setView] = useState<IpadView>("sketch");
  // True while the cursor is over a bio bullet (trigger) — dims the screen to 50%.
  const [triggerHovering, setTriggerHovering] = useState(false);
  // Clicking a row locks the iPad to that view until clicked again.
  const [lockedView, setLockedView] = useState<IpadView | null>(null);
  // Carousel hover state — pauses the stream and shows a caption pill.
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [centeredCell, setCenteredCell]     = useState(0);

  // Refs for measuring which cell is centred when the stream pauses.
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const trackRef    = useRef<HTMLDivElement | null>(null);

  // Derived carousel info — computed early so hover handlers can use them.
  const isCarousel  = view === "mentor" || view === "illos";
  const slideCount  = view === "mentor" ? MENTOR_COUNT : view === "illos" ? ILLOS_COUNT : 0;

  // Grace timer — leaving a trigger waits before snapping the screen
  // back to the sketchbook, so the cursor can travel across to the
  // polaroid and click it before the preview disappears.
  const revertTimer = useRef<number | null>(null);
  const cancelRevert = () => {
    if (revertTimer.current !== null) {
      window.clearTimeout(revertTimer.current);
      revertTimer.current = null;
    }
  };
  const scheduleRevert = () => {
    cancelRevert();
    revertTimer.current = window.setTimeout(() => {
      // If a view is locked, revert to it rather than the default sketch.
      setView(lockedView ?? "sketch");
      revertTimer.current = null;
    }, 420);
  };
  useEffect(
    () => () => {
      if (revertTimer.current !== null) {
        window.clearTimeout(revertTimer.current);
      }
    },
    [],
  );

  // Activate a preview (from a trigger's hover or focus).
  const activate = (v: IpadView) => {
    cancelRevert();
    if (v !== view) setView(v);
  };

  // Reset carousel pause state whenever we leave a carousel view.
  useEffect(() => {
    if (!isCarousel) setCarouselPaused(false);
  }, [isCarousel]);

  // Pause the stream on hover and detect which cell is centred.
  const handleCarouselEnter = () => {
    setCarouselPaused(true);
    requestAnimationFrame(() => {
      const carousel = carouselRef.current;
      const track    = trackRef.current;
      if (!carousel || !track) return;
      const { left, width } = carousel.getBoundingClientRect();
      const centerX = left + width / 2;
      const cells = track.querySelectorAll<HTMLElement>(".ipad-cell");
      let found = 0;
      cells.forEach((cell, i) => {
        const r = cell.getBoundingClientRect();
        if (r.left <= centerX && centerX < r.right) found = i % slideCount;
      });
      setCenteredCell(found);
    });
  };
  const handleCarouselLeave = () => setCarouselPaused(false);


  // Trigger handlers — bound to each interactive row.
  const triggerEnter = (v: IpadView) => () => {
    setTriggerHovering(true);
    activate(v);
  };
  const triggerLeave = () => {
    setTriggerHovering(false);
    scheduleRevert();
  };
  const triggerFocus = (v: IpadView) => () => activate(v);

  // Clicking a row locks the iPad to that view so it persists when the
  // cursor leaves. Clicking the already-locked row unlocks it.
  const handleRowClick = (v: IpadView) => () => {
    if (lockedView === v) {
      setLockedView(null);
    } else {
      setLockedView(v);
      cancelRevert();
      setView(v);
    }
  };

  // Polaroid screen click — opens the link views only.
  const handleScreenClick = (e: React.MouseEvent) => {
    if (view === "stack" || view === "food") {
      const url = view === "stack" ? STACK_URL : BELI_URL;
      if (url === "#") e.preventDefault();
    }
  };

  const isLink = view === "stack" || view === "food";
  // (isCarousel + slideCount are declared earlier so hover handlers can use them)

  // Caption for the currently centred cell when the carousel is paused.
  const pausedCaption = isCarousel
    ? (view === "mentor" ? MENTOR_CAPTIONS : ILLOS_CAPTIONS)[centeredCell] ?? ""
    : "";

  // Inner screen content — remounts on view change (via key) so it fades.
  const screenInner = (
    <div className="ipad-content" key={view}>
      {view === "sketch" && (
        <div className="image-slot">drop a sketchbook or iPad shot</div>
      )}
      {view === "stack" && (
        <>
          <div className="image-slot">drop a Purdue Stack screenshot</div>
          <span className="ipad-hint">open site ↗</span>
        </>
      )}
      {view === "food" && (
        <>
          <div className="image-slot">drop your Beli screenshot</div>
          <span className="ipad-hint">open Beli ↗</span>
        </>
      )}
      {isCarousel && (
        <div
          className="ipad-carousel"
          ref={carouselRef}
          onMouseEnter={handleCarouselEnter}
          onMouseLeave={handleCarouselLeave}
        >
          {/* Continuous stream: images doubled so the loop is seamless.
              translateX(--scroll-by) = -(slideCount × 100%) of track width. */}
          <div
            ref={trackRef}
            className={`ipad-track ipad-stream${carouselPaused ? " is-paused" : ""}`}
            style={{
              "--scroll-by": `-${slideCount * 100}%`,
              animationDuration: `${slideCount * 2.8}s`,
            } as React.CSSProperties}
          >
            {[...Array(slideCount * 2)].map((_, i) => (
              <div className="ipad-cell" key={i}>
                <div className="image-slot">
                  {view === "mentor"
                    ? `drop mentoring photo ${(i % slideCount) + 1}`
                    : `drop drawing ${(i % slideCount) + 1}`}
                </div>
              </div>
            ))}
          </div>
          {/* Caption pill — visible only while the stream is paused */}
          {carouselPaused && pausedCaption && (
            <div className="ipad-caption-pill" aria-live="polite">
              {pausedCaption}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const screenClass = `photo ipad-screen ipad-${view}`;
  const onScreenEnter = () => {
    cancelRevert();
    // Cursor has travelled to the screen — restore full opacity so the
    // preview is clear before the user clicks.
    setTriggerHovering(false);
  };

  // Opacity style: 50% while cursor is on a trigger bullet (peek state),
  // full once the cursor moves to the screen or nothing is hovered.
  const screenOpacityStyle: React.CSSProperties = {
    opacity: triggerHovering ? 0.5 : 1,
    transition: "opacity 280ms ease",
  };

  let screen: React.ReactNode;
  if (isLink) {
    screen = (
      <a
        className={screenClass}
        style={screenOpacityStyle}
        href={view === "stack" ? STACK_URL : BELI_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleScreenClick}
        onMouseEnter={onScreenEnter}
        onMouseLeave={scheduleRevert}
        aria-label={
          view === "stack"
            ? "Open the Purdue Stack website"
            : "Open my Beli profile"
        }
      >
        {screenInner}
      </a>
    );
  } else if (isCarousel) {
    screen = (
      <div
        className={screenClass}
        style={screenOpacityStyle}
        onMouseEnter={onScreenEnter}
        onMouseLeave={scheduleRevert}
      >
        {screenInner}
      </div>
    );
  } else {
    screen = (
      <div
        className={screenClass}
        style={screenOpacityStyle}
        onMouseEnter={onScreenEnter}
        onMouseLeave={scheduleRevert}
      >
        {screenInner}
      </div>
    );
  }

  return (
    <section id="about" className="section about" data-screen-label="03 About">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <h2 className="h">About</h2>
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
              self introduction
            </div>
          </div>
        </div>

        <div className="about-grid">
          {/* Polaroid — its "photo" is the interactive iPad screen,
              driven by the bullet triggers in the copy column. */}
          <div className="polaroid-single reveal">
            <div className="polaroid">
              {screen}
            </div>
          </div>

          <div className="about-copy reveal">
            <h3 className="lead">
              Purdue UX undergrad with a{" "}
              <em
                style={{
                  fontFamily: "var(--f-display)",
                  fontStyle: "normal",
                  fontWeight: 800,
                  color: "var(--ink-soft)",
                }}
              >
                design-engineering
              </em>{" "}
              minor.
            </h3>
            <p>
              I <em style={{ fontStyle: "italic" }}>prototype in code, sketch on iPad, and live in Figma</em>.
              Most recently I co-led a kiosk design system that Frogslayer adopted as their internal reference,
              and I now lead UI at Purdue Stack.
            </p>
            <p>
              I joined UX once I realized I could keep drawing, painting, and animating <em style={{ fontStyle: "italic" }}>and</em> solve
              real problems for real people. I&rsquo;m looking for a <strong>summer 2026 internship</strong> where
              that crossover earns its keep.
            </p>
            {/* Each row is a hover/focus trigger — pointing at one swaps the
                polaroid iPad screen. The whole li is the hit target, mirroring
                the Connect link-row pattern (slide + sparkle spin on hover). */}
            <ul>
              {(
                [
                  { v: "stack"  as IpadView, label: <span className="about-trigger">Designing UI at <strong>Purdue Stack</strong></span> },
                  { v: "mentor" as IpadView, label: <span className="about-trigger">Mentoring at <strong>Purdue Society of Asian Scientists &amp; Engineers</strong></span> },
                  { v: "illos"  as IpadView, label: <span className="about-trigger">Producing <strong>digital illustrations</strong> &amp; motion as side practice</span> },
                  { v: "food"   as IpadView, label: <span className="about-trigger">Planning my <strong>next trip</strong> around a list of local food spots</span> },
                ] as const
              ).map(({ v, label }) => (
                <li
                  key={v}
                  role="button"
                  className={`about-link${lockedView === v ? " is-locked" : ""}`}
                  tabIndex={0}
                  onClick={handleRowClick(v)}
                  onMouseEnter={triggerEnter(v)}
                  onMouseLeave={triggerLeave}
                  onFocus={triggerFocus(v)}
                  onBlur={triggerLeave}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleRowClick(v)(); }}
                  aria-pressed={lockedView === v}
                >
                  <span className="about-link-inner">
                    <SparkleBullet />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
}
