"use client";

import { useEffect, useRef, useState } from "react";
import SparkleField from "@/components/SparkleField";
import ArtistDesignerWordmark from "@/components/ArtistDesignerWordmark";

/**
 * HeroV2 — sticker-collage polaroid hero on dark stage
 * Adapted from Claude Design Portoflio/hero.jsx + the latest 3 hero sketches:
 *   - Connected "Artist × Designer" ligature (the t→D forms an X)
 *   - Polaroid with photo + caption ("Last Updated · 05/07/26" + tagline)
 *   - Olive yellow "Kathleen Li" sticker (top-right) + maroon 李曦 oval underneath
 *   - Green "Currently designing at __ while" sticky (bottom-left)
 *   - Faint strings/luggage tags from polaroid corners to stickers
 *   - Muted, paper-feel palette
 */
export default function HeroV2() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLButtonElement | null>(null);

  /* Polaroid interaction — rise → flip → rest choreography
     -------------------------------------------------------
     Replaces the earlier "peek spotlight + hover reveal" system with a
     3D flip. On click the whole polaroid RISES toward the viewer for
     300ms, then FLIPS on its Y-axis for 500ms to reveal the opposite
     face (photo ↔ drawing), then RESTS back down for 300ms — total
     1100ms. Additional clicks during that window are ignored.
     The attached stickers shift outward from the polaroid during the
     raised phase (school-note pushes up-left, designing-green pushes
     down-right — each away from the polaroid's center) and drift back
     as the polaroid settles. */
  const [flipped, setFlipped] = useState(false);       // which face is showing
  const [isRaised, setIsRaised] = useState(false);     // t=0..800ms
  const [isAnimating, setIsAnimating] = useState(false); // click lock, t=0..1100ms
  const riseTimerRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);

  // body class for nav theming + scrolled state.
  // Two triggers add `on-paper`:
  //   1. Scroll past 70% of the hero (viewer is exiting the collage).
  //   2. A time-based fallback at ~2900ms — right after the hero
  //      entrance choreography settles — so the sidebar nav appears
  //      even if the viewer never scrolls. Once added, on-paper is
  //      NEVER removed (previously toggled off when scrolling back
  //      up, which would re-hide the nav mid-session — annoying).
  useEffect(() => {
    const HERO_ENTRANCE_END = 2900; // ms — matches scroll cue settle + a beat
    let hasPaper = false;
    const applyPaper = () => {
      if (hasPaper) return;
      hasPaper = true;
      document.body.classList.add("on-paper");
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) applyPaper();
      document.body.classList.toggle("scrolled", window.scrollY > 60);
    };
    const revealTimer = window.setTimeout(applyPaper, HERO_ENTRANCE_END);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.clearTimeout(revealTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Rise → flip → rest choreography.
  //   t=0     click → raise + start flip (with 300ms transition delay)
  //   t=800   drop the raise (sticker shift-back begins, scale-down begins)
  //   t=1100  full cycle complete, unlock for next click
  const handlePhotoClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsRaised(true);
    setFlipped((f) => !f);

    if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    riseTimerRef.current = window.setTimeout(() => {
      setIsRaised(false);
      riseTimerRef.current = null;
    }, 800);
    unlockTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      unlockTimerRef.current = null;
    }, 1100);
  };

  useEffect(() => {
    return () => {
      if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  // Real polaroid assets — resolved with the project basePath so the
  // src still works when deployed under /Portfolio on GitHub Pages
  // (next.config sets basePath to '/Portfolio' in production, empty
  // for local dev).
  const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
  const photoSrc = `${basePath}/img/polaroid/polaroid_real.webp`;
  const drawingSrc = `${basePath}/img/polaroid/polaroid_drawing.webp`;

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="hero-stage" ref={stageRef}>
        {/* ── LEFT column: handwritten greeting ──────────────────────────
            "Hello, I'm [Kathleen sticker + 李曦 chip], an Artist/Designer
             focusing on product design & design engineering."
            Sketch-driven layout — the greeting flows in Caveat/Klee
            handwriting so the recruiter reads a first-person address
            (matches the peer pattern from Rachel/Arjun/Emmi/Jackie)
            rather than a decorative wordmark alone.
        */}
        <div className="hero-greeting">
          <p className="hero-greet-lead">
            <span className="hero-greet-hi">Hello, I&rsquo;m </span>
            {/* Kathleen sticker + 李曦 chip inline within the greeting
                sentence — they now flow with the text instead of
                floating as absolute decorations on the hero stage. */}
            <span className="sticker name-yellow name-inline">
              <span className="name-en">Kathleen</span>
              <span
                className="chip-zh"
                role="img"
                aria-label="Li Xi (李曦) — my Chinese name"
              >
                <span className="chip-zh-text">李曦</span>
              </span>
            </span>
          </p>
          {/* "an Artist · Designer" — kept as the animated wordmark for
              signature-flair but left-aligned + demoted to h2 weight so
              the greeting above reads as the primary hero H1. */}
          <h1 className="ribbon-artist">
            <span className="visually-hidden">an Artist · Designer</span>
            <span className="hero-an" aria-hidden="true">an </span>
            <ArtistDesignerWordmark />
          </h1>
          <p className="hero-focus">
            focusing on <strong>product design</strong>
            {" & "}
            <strong>design engineering</strong>
          </p>
        </div>

        {/* cycling-glyph sparkle field — slots respawn at fresh random positions. */}
        <div className="hero-sparkles" aria-hidden="true">
          <SparkleField count={8} />
        </div>

        {/* ── RIGHT column: polaroid + attached stickers ─────────────────
            The polaroid now hosts the two contextual stickers directly
            (Purdue year at top-right, availability at bottom-right)
            instead of them floating as separate elements on the stage.
        */}
        <div
          className={`hero-polaroid${isRaised ? " is-raised" : ""}`}
          data-cursor="polaroid"
        >
          {/* .polaroid-lift wrapper carries the RISE / REST transform.
              The parallax scroll system (SmoothScroll.tsx) writes an
              inline `transform: translateY(x) rotate(-4deg)` directly
              onto .hero-polaroid every scroll frame — putting the rise
              transform there too would be immediately overridden by
              inline-style specificity. Moving the rise to this inner
              element lets the two transforms compose via the CSS
              transform chain instead of clobbering each other. */}
          <div className={`polaroid-lift${isRaised ? " is-raised" : ""}`}>
            {/* Full-card flipper — the WHOLE polaroid (paper + photo well +
                caption) is the front face; the back face is a same-sized
                paper card with the drawing and NO caption text. Clicking
                anywhere on the card triggers the rise → flip → rest
                choreography. Stickers stay OUTSIDE the flipper so they
                don't rotate with the card (they only slide outward during
                the raised phase — see .polaroid-attached rules in CSS). */}
            <button
              type="button"
              className={`polaroid-card${flipped ? " is-flipped" : ""}`}
              ref={photoRef}
              onClick={handlePhotoClick}
              aria-label={`${flipped ? "Self-portrait doodle" : "Photo"} currently shown. Click to flip the polaroid.`}
              aria-pressed={flipped}
            >
            {/* FRONT — photo + caption. position: relative so it sizes
                the card; the back face overlays it absolutely. */}
            <div className="polaroid-face polaroid-face-front">
              <div className="photo has-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc}
                  alt="Kathleen — photo"
                  className="photo-img"
                  draggable={false}
                />
              </div>
              <div className="caption-block">
                <div className="caption-meta">Last Updated · 05/07/26</div>
                {/* Two explicit line spans (.cap-write) — each wipes in
                    left→right like being written, line 1 then line 2. */}
                <div className="caption-line">
                  <span className="cap-write">I design <strong>solutions</strong> with</span>
                  <span className="cap-write">moments worth <strong>lingering</strong> on</span>
                </div>
              </div>
            </div>

            {/* BACK — drawing only, no caption. Absolute overlay same
                dimensions as front. Pre-rotated 180° on Y so when the
                flipper turns 180° the back's world rotation is 0 and
                its content displays as authored. */}
            <div className="polaroid-face polaroid-face-back">
              <div className="photo has-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={drawingSrc}
                  alt="Kathleen — self-portrait doodle (drawn mirrored for
                       the back-of-polaroid immersion effect)"
                  className="photo-img"
                  draggable={false}
                />
              </div>
              {/* No caption on the back — leaves blank paper below the
                  drawing to match a real polaroid's un-labeled back. */}
            </div>
            </button>
          </div>
          {/* End .polaroid-lift — stickers below live OUTSIDE the lift
              wrapper so they don't scale/translate WITH the polaroid;
              instead they shift OUTWARD from it via their own transitions. */}

          {/* Purdue year sticker — attached to the polaroid's TOP-RIGHT
              corner, overlapping it. Was previously nested inside the
              green availability sticker; moved to the polaroid to make
              the polaroid the anchor of the recruitment cluster (per
              redesign sketch). */}
          <div className="sticker school-note polaroid-attached">
            <span className="school-note-text">
              Currently completing my junior year @ Purdue
            </span>
          </div>

          {/* Availability sticker — attached to the polaroid's BOTTOM-
              RIGHT corner. Was previously floating bottom-left of the
              hero stage; now paired with the polaroid so all recruiter
              signals cluster around the visual centerpiece. */}
          <div className="sticker designing-green polaroid-attached">
            {/* interlocked-circles doodle */}
            <svg
              className="design-doodle"
              viewBox="0 0 274 240"
              aria-hidden="true"
            >
              <path
                d="M110.5 20.5C160.118 20.5 200.5 60.931 200.5 111C200.5 161.069 160.118 201.5 110.5 201.5C60.882 201.5 20.5 161.069 20.5 111C20.5 60.931 60.882 20.5 110.5 20.5Z"
                stroke="currentColor"
                strokeWidth="28"
                fill="none"
              />
              <path
                d="M200 102C237.711 102 268 131.703 268 168C268 204.297 237.711 234 200 234C162.289 234 132 204.297 132 168C132 131.703 162.289 102 200 102Z"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
              />
            </svg>
            <div className="d-text">
              <strong>Available Summer 2026</strong>
              <span className="d-sub">
                Product Design · Design Engineering internships
              </span>
            </div>
          </div>
        </div>

        {/* LEGACY-REMOVE-START */}
        <div className="legacy-hidden" style={{ display: "none" }} aria-hidden="true">
          {/* diagonal hatching corner accent — top-right */}
          <svg
            className="sticker-hatch hatch-tr"
            viewBox="0 0 96 64"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <g clipPath="url(#hatch-clip-ky)">
              <line x1="0" y1="0" x2="100" y2="76" stroke="currentColor" strokeWidth="5" />
              <line x1="14" y1="-8" x2="114" y2="68" stroke="currentColor" strokeWidth="5" />
              <line x1="-14" y1="8" x2="86" y2="84" stroke="currentColor" strokeWidth="5" />
              <line x1="28" y1="-16" x2="128" y2="60" stroke="currentColor" strokeWidth="5" />
              <line x1="-28" y1="16" x2="72" y2="92" stroke="currentColor" strokeWidth="5" />
            </g>
            <defs>
              <clipPath id="hatch-clip-ky">
                <rect width="96" height="64" rx="8" />
              </clipPath>
            </defs>
          </svg>
          <div className="name-en">
            <em className="it">Kathleen</em>&nbsp;Li
          </div>
          {/* 李曦 chip — NESTED INSIDE the Kathleen sticker so the two
              elements share a single coordinate space. Any transform
              applied to .sticker.name-yellow (parallax, entrance,
              hover) automatically applies to the chip as well, which
              means the chip cannot drift from the Kathleen sticker
              under any circumstances — they literally move as one
              element subtree. The chip's CSS uses absolute positioning
              relative to its new containing block (the Kathleen
              sticker), and has been removed from the parallax target
              registry to avoid double-transform. */}
          <div className="chip-zh" role="img" aria-label="Li Xi (李曦) — my Chinese name">
            <svg
              className="sticker-hatch hatch-tl"
              viewBox="0 0 64 64"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <g clipPath="url(#hatch-clip-zh)">
                <line x1="-12" y1="-8" x2="72" y2="64" stroke="currentColor" strokeWidth="5" />
                <line x1="-20" y1="8"  x2="64" y2="80" stroke="currentColor" strokeWidth="5" />
                <line x1="-28" y1="24" x2="56" y2="96" stroke="currentColor" strokeWidth="5" />
              </g>
              <defs>
                <clipPath id="hatch-clip-zh">
                  <rect width="64" height="64" rx="6" />
                </clipPath>
              </defs>
            </svg>
            <span className="chip-zh-text">李曦</span>
          </div>
          {/* 4-pointed X-star with wavy tips — the same hand-drawn
              twinkle used inside the FolderOpen SVGs on the Projects
              cards. Reused here so the sticker's punctuation mark
              shares vocabulary with the project cards. */}
          <svg
            className="name-burst"
            viewBox="70 0 95 105"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M105.094 7.08122C105.939 6.98293 106.516 7.46228 106.604 7.53257C106.807 7.69599 106.955 7.87395 107.04 7.98072C107.222 8.21067 107.403 8.49446 107.565 8.76349C107.901 9.31864 108.335 10.1108 108.836 11.0247C109.856 12.8849 111.244 15.4194 112.98 18.1993C116.482 23.8068 121.264 30.1843 127.011 33.9235C132.613 37.5682 140.181 39.0139 146.606 39.6593C149.793 39.9795 152.611 40.0964 154.717 40.2112C155.745 40.2672 156.662 40.3255 157.338 40.4159C157.663 40.4594 158.041 40.523 158.381 40.6373C158.548 40.6932 158.81 40.7946 159.072 40.9809C159.327 41.1627 159.776 41.5673 159.919 42.2651C160.066 42.9844 159.784 43.5387 159.665 43.7452C159.521 43.994 159.35 44.1864 159.232 44.3091C158.987 44.5619 158.68 44.8069 158.387 45.0257C157.786 45.4758 156.938 46.0367 155.967 46.6668C153.989 47.9512 151.337 49.6285 148.488 51.6403C142.715 55.7166 136.537 60.8968 133.805 66.3818C130.001 74.0183 128.382 81.758 127.604 87.6603C127.215 90.6102 127.038 93.0803 126.898 94.8722C126.829 95.745 126.765 96.5205 126.682 97.086C126.642 97.3565 126.584 97.6859 126.483 97.9868C126.434 98.1326 126.341 98.3766 126.168 98.6252C126.004 98.8606 125.606 99.3269 124.895 99.472C123.977 99.6595 123.334 99.1507 123.206 99.0484C122.989 98.8747 122.831 98.6824 122.74 98.5645C122.544 98.3125 122.353 98.0003 122.181 97.7019C121.825 97.0862 121.372 96.2101 120.851 95.1996C119.79 93.144 118.36 90.3567 116.58 87.3312C112.98 81.2134 108.121 74.4345 102.335 70.8653C96.8705 67.4943 89.8574 65.4683 84.035 64.1446C81.1278 63.4836 78.6056 63.0156 76.6979 62.6243C75.7705 62.4341 74.9474 62.2537 74.3364 62.0758C74.0404 61.9896 73.7058 61.8789 73.4092 61.7328C73.2628 61.6607 73.0485 61.543 72.8383 61.363C72.647 61.1991 72.2761 60.8283 72.1403 60.2187C71.9881 59.5353 72.2229 58.9872 72.3938 58.7018C72.5625 58.42 72.7659 58.2232 72.894 58.1103C73.1554 57.8799 73.4651 57.6885 73.7198 57.5421C74.2531 57.2355 74.9971 56.8764 75.818 56.4878C77.5086 55.6875 79.7762 54.6457 82.2726 53.2894C87.3066 50.5544 92.9722 46.6953 96.2576 41.4653C100.191 35.2037 101.807 27.2218 102.511 20.6175C102.86 17.3389 102.98 14.4562 103.062 12.35C103.102 11.3164 103.135 10.4174 103.185 9.77929C103.209 9.47081 103.244 9.13602 103.305 8.84783C103.333 8.71514 103.389 8.4799 103.506 8.23359C103.567 8.10738 103.944 7.30812 104.922 7.10833L105.094 7.08122Z" />
          </svg>
        </div>

        {/* Old floating designing-green sticker — moved onto the polaroid
            as .polaroid-attached above. This copy stays hidden as a
            fallback in case any CSS/JS still references it. */}
        <div className="legacy-hidden" style={{ display: "none" }} aria-hidden="true">
          {/* diagonal hatching corner accent — top-left */}
          <svg
            className="sticker-hatch hatch-tl"
            viewBox="0 0 100 64"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <g clipPath="url(#hatch-clip-gd)">
              <line x1="-16" y1="-8" x2="92" y2="80" stroke="currentColor" strokeWidth="5" />
              <line x1="-2"  y1="-16" x2="106" y2="72" stroke="currentColor" strokeWidth="5" />
              <line x1="12"  y1="-24" x2="120" y2="64" stroke="currentColor" strokeWidth="5" />
              <line x1="-30" y1="0"   x2="78"  y2="88" stroke="currentColor" strokeWidth="5" />
            </g>
            <defs>
              <clipPath id="hatch-clip-gd">
                <rect width="100" height="64" rx="8" />
              </clipPath>
            </defs>
          </svg>
          {/* interlocked-circles doodle perched above the sticky */}
          <svg
            className="design-doodle"
            viewBox="0 0 274 240"
            aria-hidden="true"
          >
            <path
              d="M110.5 20.5C160.118 20.5 200.5 60.931 200.5 111C200.5 161.069 160.118 201.5 110.5 201.5C60.882 201.5 20.5 161.069 20.5 111C20.5 60.931 60.882 20.5 110.5 20.5Z"
              stroke="currentColor"
              strokeWidth="28"
              fill="none"
            />
            <path
              d="M200 102C237.711 102 268 131.703 268 168C268 204.297 237.711 234 200 234C162.289 234 132 204.297 132 168C132 131.703 162.289 102 200 102Z"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
            />
          </svg>
          <div className="d-text">
            <strong>Available Summer 2026</strong>
            <span className="d-sub">
              Product Design · Design Engineering internships
            </span>
          </div>
          {/* Purdue year sub-sticker — nested INSIDE the availability
              sticker (mirrors the 李曦 chip nested inside the Kathleen
              sticker) so the two paper notes overlap physically. Its
              absolute positioning is scoped to the green sticker as its
              containing block, so it visually sits at the sticker's
              bottom-right corner, tilted the opposite direction. */}
          <div className="sticker school-note">
            <span className="school-note-text">
              Currently completing my junior year at Purdue
            </span>
          </div>
        </div>

      </div>

      {/* string positions are hero-specific — kept inline so they live with the JSX */}
      <style jsx>{`
        @keyframes stringFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
