"use client";
import { useRef, useState, useCallback } from "react";

type View = "stack" | "mentor" | "illos" | "food" | "sketch";

/** 4-pointed sparkle — corner marker on hover pills */
const Sparkle = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
  </svg>
);

/**
 * HoverWord — an inline keyword that pops up a floating image pill on hover.
 *
 * The keyword is bold + accent-colored at rest. Hovering it shows a
 * pill-shaped card containing a placeholder image slot (replace <div
 * className="image-slot"> with <img src="…"> once photos are ready).
 *
 * View keys match the old iPad views for copy continuity:
 *   stack  → Purdue Stack screenshot
 *   mentor → mentoring photo
 *   illos  → digital illustration
 *   food   → Beli food screenshot
 *   sketch → iPad / sketchbook photo
 */
// Desktop: pill appears 14px right + 14px below cursor
const PILL_OFFSET_X = 14;
const PILL_OFFSET_Y = 14;

// Touch: pill appears above the finger (196px wide × 136px tall + 20px gap)
// Clamped to viewport edges so it never clips off-screen.
const PILL_W = 196;
const PILL_H = 136;
const TOUCH_GAP = 20;

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), Math.max(min, max));
}

function HoverWord({
  children,
  view,
  href,
  imageSrc,
  hint = false,
}: {
  children: React.ReactNode;
  view: View;
  href?: string;
  /** When provided, the keyword opens an image pill on hover/focus. When
   *  undefined, the keyword renders as a plain bold accent (or an
   *  underlined link if `href` is set) with NO pill behavior — so empty
   *  placeholders never flash on hover before assets land. */
  imageSrc?: string;
  /** When true, the label plays a one-time pulse animation on mount —
   *  used on the first HoverWord in a section to signal that the
   *  keyword is interactive (otherwise the dotted underline is too
   *  subtle for a first-time visitor). */
  hint?: boolean;
}) {
  const [on, setOn] = useState(false);
  const pillRef    = useRef<HTMLSpanElement>(null);
  const labelRef   = useRef<HTMLElement>(null);
  const touchTimer = useRef<number | null>(null);
  // Pill is only wired up when we actually have an image to show.
  const hasPill = Boolean(imageSrc);

  // ── Magnetic tilt (mirrors folder card behaviour) ────────────────────
  /** Direct DOM write — no React re-render on every mousemove frame. */
  const applyTilt = (e: React.MouseEvent) => {
    const el = labelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // −1 → 1
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2; // −1 → 1
    el.style.transition = "transform 220ms cubic-bezier(0.34,1.56,0.64,1)";
    el.style.transform  =
      `perspective(400px) translateX(${x * 5}px) translateY(${y * 3}px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
  };

  const resetTilt = () => {
    const el = labelRef.current;
    if (!el) return;
    el.style.transition = "transform 600ms cubic-bezier(0.34,1.56,0.64,1)";
    el.style.transform  =
      "perspective(400px) translateX(0px) translateY(0px) rotateY(0deg) rotateX(0deg)";
  };

  // ── Mouse tracking (desktop) ──────────────────────────────────────────
  /** Direct DOM mutation — no React re-render on every mousemove frame. */
  const moveToPointer = (e: React.MouseEvent) => {
    if (!pillRef.current) return;
    pillRef.current.style.left = `${e.clientX + PILL_OFFSET_X}px`;
    pillRef.current.style.top  = `${e.clientY + PILL_OFFSET_Y}px`;
    applyTilt(e);
  };

  // ── Touch support (iPhone / iPad) ─────────────────────────────────────
  /** Position pill above the finger, clamped to stay inside the viewport. */
  const moveToTouch = (e: React.TouchEvent) => {
    if (!pillRef.current) return;
    const t = e.touches[0] ?? e.changedTouches[0];
    if (!t) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = clamp(t.clientX - PILL_W / 2, 8, vw - PILL_W - 8);
    const y = clamp(t.clientY - PILL_H - TOUCH_GAP, 8, vh - PILL_H - 8);
    pillRef.current.style.left = `${x}px`;
    pillRef.current.style.top  = `${y}px`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchTimer.current !== null) window.clearTimeout(touchTimer.current);
    moveToTouch(e);
    setOn(true);
  };

  /** Auto-hide 1.4 s after the finger lifts — long enough to see the image. */
  const handleTouchEnd = () => {
    touchTimer.current = window.setTimeout(() => {
      setOn(false);
      touchTimer.current = null;
    }, 1400);
  };

  // ── Keyboard / focus (screen readers, tab nav) ────────────────────────
  /** Centre the pill below the word's bounding box on focus. */
  const handleFocus = (e: React.FocusEvent) => {
    if (!pillRef.current) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = clamp(rect.left + rect.width / 2 - PILL_W / 2, 8, vw - PILL_W - 8);
    // Prefer above; fall back below if near top of viewport
    const yAbove = rect.top - PILL_H - 8;
    const yBelow = rect.bottom + 8;
    const y = clamp(yAbove < 8 ? yBelow : yAbove, 8, vh - PILL_H - 8);
    pillRef.current.style.left = `${x}px`;
    pillRef.current.style.top  = `${y}px`;
    setOn(true);
  };

  const handleBlur = () => { setOn(false); resetTilt(); };

  const labelClass = `hw-label${href ? " hw-label--link" : ""}${hint ? " hw-label--hint" : ""}`;

  // ── Label — plain span or real link ───────────────────────────────────
  const label = href ? (
    <a
      ref={labelRef as React.RefObject<HTMLAnchorElement>}
      className={labelClass}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <span ref={labelRef as React.RefObject<HTMLSpanElement>} className={labelClass}>{children}</span>
  );

  // ── No-pill path: keyword renders as plain styled label only. ─────────
  // This is the default state until per-view images exist. Recruiters
  // no longer get an empty image-slot flash on hover; the dotted
  // underline is also dropped via the `hw--no-pill` modifier so the
  // affordance doesn't promise an interaction that isn't there.
  if (!hasPill) {
    return <span className="hw hw--no-pill">{label}</span>;
  }

  // ── Pill path: full HoverWord behavior with image pill. ───────────────
  return (
    <span
      className={`hw${on ? " hw--on" : ""}`}
      onMouseEnter={(e) => { moveToPointer(e); setOn(true); }}
      onMouseMove={moveToPointer}
      onMouseLeave={() => { setOn(false); resetTilt(); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {label}
      {/* pill always in DOM; left/top mutated directly for zero-lag tracking */}
      <span ref={pillRef} className="hw-pill" aria-hidden="true">
        <span className="hw-pill-img">
          <img src={imageSrc} alt="" />
        </span>
        <Sparkle />
      </span>
    </span>
  );
}

export default function AboutV2() {
  /**
   * Peek strip click — scrolls to `ac-scene.offsetTop + about.offsetHeight`
   * so the viewport lands with About fully scrolled off and Connect visible.
   * Falls back to smooth anchor scroll if elements aren't found.
   */
  const handlePeekClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const scene = document.querySelector<HTMLElement>(".ac-scene");
    const about = document.querySelector<HTMLElement>(".about");
    if (scene && about) {
      const target = scene.offsetTop + about.offsetHeight;
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section id="about" className="section about" data-screen-label="03 About">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <h2 className="h">About</h2>
            <div className="section-subhead">self introduction</div>
          </div>
        </div>

        <div className="about-prose reveal">
          {/* Stage 1 — heading arrives first */}
          <h3 className="lead">
            Purdue UX undergrad with a{" "}
            <em className="de">design-engineering</em>{" "}
            minor.
          </h3>

          {/* Stage 2 — body follows 300 ms after the heading starts */}
          <div className="about-body">
            <p>
              I prototype in code, sketch on{" "}
              <HoverWord view="sketch" hint>iPad</HoverWord>
              , and live in Figma. Most recently I co-led a kiosk design system
              that Frogslayer adopted as their internal reference, and I now lead UI at{" "}
              <HoverWord view="stack" href="https://www.purduestack.org">Purdue Stack</HoverWord>.
            </p>

            <p>
              I joined UX once I realized I could keep{" "}
              <HoverWord view="illos">drawing, painting, and animating</HoverWord>
              {" "}<em className="it">and</em> solve real problems for
              real people. I&rsquo;m also a mentor at{" "}
              <HoverWord view="mentor" href="https://linktr.ee/sasepurdue">Purdue SASE</HoverWord>
              , and I plan my{" "}
              <HoverWord view="food" href="https://beliapp.co/app/lyux">next trip</HoverWord>
              {" "}around a list of local food spots.
            </p>

            <p>
              Looking for a <strong>summer 2026 internship</strong> where that
              crossover earns its keep.
            </p>
          </div>
        </div>
      </div>

      {/* Peek strip — always visible at About's bottom edge, hinting
          at the Connect section below. Clicking scrolls past About so
          Connect is fully revealed rather than scrolling to page top. */}
      <a href="#connect" className="about-peek" onClick={handlePeekClick}>
        <span className="about-peek__label">Connect</span>
        <svg
          className="about-peek__arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}
