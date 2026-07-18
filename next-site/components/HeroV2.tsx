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
type PhotoMode = "drawing" | "photo";

export default function HeroV2() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const peekLayerRef = useRef<HTMLDivElement | null>(null);

  // which photo is currently the "front" — toggles on click
  const [mode, setMode] = useState<PhotoMode>("drawing");
  // peek visibility only (position is driven via direct DOM for zero lag)
  const [peekOn, setPeekOn] = useState(false);
  // when true, the spotlight is expanding out to reveal the other image
  const [swapping, setSwapping] = useState(false);
  // first-load hint: fades the OTHER image in at 50% over the polaroid
  const [hinting, setHinting] = useState(false);

  // body class for nav theming + scrolled state
  useEffect(() => {
    const onScroll = () => {
      const onPaper = window.scrollY > window.innerHeight * 0.7;
      document.body.classList.toggle("on-paper", onPaper);
      document.body.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // first-load polaroid hint: after the entrance choreography lands (~1.8s),
  // do a quick swap → settle → swap back so the viewer notices it's interactive.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: number[] = [];

    // make sure the peek spotlight expands from the polaroid center
    const layer = peekLayerRef.current;
    if (layer) {
      layer.style.setProperty("--peek-x", "50%");
      layer.style.setProperty("--peek-y", "50%");
    }

    // Hero entrance choreography (polish pass — trimmed from ~5s → ~2.8s
    // for a gentler, less-theatrical arrival modeled on emmiwu.com /
    // jackiezhang.co.za):
    //   location strip : 300–820ms (small, arrives first as grounding)
    //   wordmark trace : 80–980ms
    //   subtitle fade  : 1100–1620ms (was terminal-typed to 3950ms)
    //   polaroid lands : 1200–1580ms
    //   Kathleen sticker: 1600–1880ms
    //   李曦 chip       : 1780–2040ms
    //   green sticker   : 2000–2280ms
    //   scroll cue      : 2500–2780ms
    // Fire the polaroid swap-hint AFTER the last sticker settles + a beat
    // of breathing room.
    const HINT_START = 2900;
    const HINT_HOLD = 850;

    timers.push(window.setTimeout(() => setHinting(true), HINT_START));
    timers.push(window.setTimeout(() => setHinting(false), HINT_START + HINT_HOLD));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const handlePhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (swapping) return; // don't drift the spotlight mid-expansion
    const rect = photoRef.current?.getBoundingClientRect();
    const layer = peekLayerRef.current;
    if (!rect || !layer) return;
    // drive the spotlight position directly via CSS variables — no React re-render
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    layer.style.setProperty("--peek-x", `${x}%`);
    layer.style.setProperty("--peek-y", `${y}%`);
    if (!peekOn) setPeekOn(true);
  };
  const handlePhotoLeave = () => {
    if (swapping) return;
    setPeekOn(false);
  };
  const handlePhotoClick = () => {
    if (swapping) return;
    setSwapping(true);
    // after the expansion animation, commit the swap and reset
    window.setTimeout(() => {
      setMode((m) => (m === "drawing" ? "photo" : "drawing"));
      setSwapping(false);
    }, 700);
  };

  const otherMode: PhotoMode = mode === "drawing" ? "photo" : "drawing";
  const labelFor = (m: PhotoMode) =>
    m === "drawing" ? "drop your self-doodle" : "drop a photo of you";

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="hero-stage" ref={stageRef}>
        {/* Artist · Designer wordmark — primary page heading.
            Handwriting animation: letters trace in via centerline strokes;
            the i-dot from "Artist" shoots over to become the middot. */}
        <h1 className="ribbon-artist">
          <span className="visually-hidden">Artist · Designer</span>
          <ArtistDesignerWordmark />
          {/* Subtitle now a simple fade instead of the previous
              terminal-typed reveal — quieter, feels less like a demo
              and more like an intentional statement. Copy names what
              she does (three practice areas) with the × separator
              echoing the wordmark's t→D X-ligature. */}
          <span className="sub">
            Interaction &times; Product &times; Design Engineering
          </span>
        </h1>

        {/* cycling-glyph sparkle field — slots respawn at fresh random positions.
            Reduced from 14 → 8 for the professional-polish pass: fewer
            simultaneous sparkles reads as intentional atmosphere rather
            than decorative noise. */}
        <div className="hero-sparkles" aria-hidden="true">
          <SparkleField count={8} />
        </div>

        {/* center polaroid — two-layer photo with cursor-peek + click-swap */}
        <div className="hero-polaroid" data-cursor="polaroid">
          <div
            className="photo photo-swap"
            ref={photoRef}
            onMouseMove={handlePhotoMove}
            onMouseLeave={handlePhotoLeave}
            onClick={handlePhotoClick}
            role="button"
            tabIndex={0}
            aria-label={`Currently showing ${mode}. Click to swap, hover to peek.`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handlePhotoClick();
              }
            }}
          >
            {/* base layer — currently selected mode */}
            <div className={`photo-layer photo-base photo-${mode}`}>
              <div className="image-slot">{labelFor(mode)}</div>
            </div>
            {/* peek layer — the OTHER mode, revealed inside a spotlight at the cursor.
                On click, the spotlight expands to fill the frame, completing the swap. */}
            <div
              ref={peekLayerRef}
              className={`photo-layer photo-peek photo-${otherMode} ${peekOn || swapping ? "is-on" : ""} ${swapping ? "is-swapping" : ""} ${hinting ? "is-hinting" : ""}`}
            >
              <div className="image-slot">{labelFor(otherMode)}</div>
            </div>

          </div>
          <div className="caption-block">
            <div className="caption-meta">Last Updated · 05/07/26</div>
            {/* Two explicit line spans (.cap-write) — each wipes in
                left→right like being written, line 1 then line 2. A
                single wipe over the naturally-wrapped block would
                reveal both lines column-wise, which reads as a print
                effect, not handwriting. Line break is hand-placed for
                the fixed 320px polaroid width. */}
            <div className="caption-line">
              <span className="cap-write">I design <strong>solutions</strong> with</span>
              <span className="cap-write">moments worth <strong>lingering</strong> on</span>
            </div>
          </div>
        </div>

        {/* Kathleen Li sticker (top-right) — olive yellow */}
        <div className="sticker name-yellow">
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
          {/* Elaborate 4-pointed sparkle with curled arms */}
          <svg
            className="name-burst"
            viewBox="0 0 384 435"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M160.666 177.674C165.866 162.553 169.711 0 183.351 0C196.991 0 204.94 166.333 209.815 177.674C214.691 189.015 383.712 186.207 383.712 202.249C383.712 218.291 212.959 217.367 209.815 228.708C206.671 240.049 203.991 434.742 189.023 434.742C174.055 434.742 166.868 238.159 160.666 228.708C154.464 219.257 0.609 225.625 0.002 207.916C-0.605 190.207 156.116 190.905 160.666 177.674Z" />
            <path d="M134.924 149.755C142.477 142.193 63.089 43.902 30.963 28.782C-1.163 13.662 51.214 76.207 72.547 100.61C92.958 123.958 127.37 157.316 134.924 149.755Z" />
            <path d="M350.404 27.544C357.957 35.106 278.569 133.397 246.443 148.517C214.317 163.637 266.695 101.092 288.027 76.69C308.438 53.342 342.851 19.983 350.404 27.544Z" />
            <path d="M134.924 258.15C142.477 265.711 63.089 364.003 30.963 379.123C-1.163 394.243 51.214 331.698 72.547 307.295C92.958 283.947 127.37 250.588 134.924 258.15Z" />
            <path d="M236.769 258.15C229.215 265.711 308.604 364.003 340.73 379.123C372.856 394.243 320.478 331.698 299.145 307.295C278.734 283.947 244.322 250.588 236.769 258.15Z" />
          </svg>
        </div>

        {/* "Currently designing at" sticker (bottom-left) — muted green */}
        <div className="sticker designing-green">
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
            Currently a Product Design intern — drafting from cafes!
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
