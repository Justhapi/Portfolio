"use client";

import { useEffect, useRef, useState } from "react";
import SparkleField from "@/components/SparkleField";
import ArtistDesignerWordmark from "@/components/ArtistDesignerWordmark";

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
  /* State model
     ----------------------------------------------------------------
     - `flipped`   — LOGICAL face (front vs back). Drives the rest
                     transform via .is-flipped on .polaroid-card.
                     Toggled at ANIMATION END so it holds the final
                     pose after the keyframe finishes.
     - `animDir`   — 'fwd' | 'bwd' | null. Applied as .is-anim-fwd /
                     .is-anim-bwd during the flip so the malleable
                     keyframe drives transform. Cleared at anim end.
     - `isRaised`  — .is-raised on .hero-polaroid + .polaroid-lift.
                     Rises the card and pushes stickers outward.
     - `isAnimating` — click lock while the whole cycle runs.
  */
  const [flipped, setFlipped] = useState(false);
  const [animDir, setAnimDir] = useState<"fwd" | "bwd" | null>(null);
  const [isRaised, setIsRaised] = useState(false);
  // Target flip state as a REF so rapid clicks stay in sync without
  // waiting for React to commit the setFlipped update. Every click
  // toggles this ref immediately; the visible `flipped` state syncs
  // at animation end. Prevents the "click didn't register" feel that
  // came from the previous isAnimating lock.
  const targetRef = useRef(false);
  const riseTimerRef = useRef<number | null>(null);
  const animEndTimerRef = useRef<number | null>(null);
  /* Ref to the .polaroid-lift wrapper — used by an IntersectionObserver
     that adds the .play-wiggle class the FIRST time the polaroid comes
     into view. Ensures the affordance signal fires when the polaroid
     is actually visible, not on a page-load timer that could miss
     users who scroll fast or return with a restored scroll position. */
  const liftRef = useRef<HTMLDivElement | null>(null);
  // Hover wrapper — receives an inline rotateY on mouseenter for a
  // clear sideways tilt cue that hints clickability.
  const hoverRef = useRef<HTMLDivElement | null>(null);

  // body class for nav theming + scrolled state.
  // Two triggers add `on-paper`:
  //   1. Scroll past 70% of the hero (viewer is exiting the collage).
  //   2. A time-based fallback at ~2900ms — right after the hero
  //      entrance choreography settles — so the sidebar nav appears
  //      even if the viewer never scrolls. Once added, on-paper is
  //      NEVER removed (previously toggled off when scrolling back
  //      up, which would re-hide the nav mid-session — annoying).
  useEffect(() => {
    // 2900ms lands ~600ms after the last primary-trio element (green
    // availability sticker) settles at ~2280ms — nav appears with a
    // clean beat after the polaroid + availability + wordmark trio.
    // Scroll cue now drifts in later (3200ms onwards) as ambient hint;
    // no longer used as the "settle" anchor for the nav trigger.
    const HERO_ENTRANCE_END = 2900;
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

  /* Choreography (no click lock — every click fires):
       t=0    click → cancel in-flight timers, toggle targetRef, apply
              .is-raised + .is-anim-fwd|bwd. If a rapid click comes in
              during a running flip, the previous timers are cancelled
              and this click's dir wins.
       t=460  .is-raised removed → unraise begins (holds through peak
              + slow-shrink portion of the flip so the card doesn't
              fight the flip's own scale animation)
       t=580  flip keyframe ends → sync `flipped` to targetRef, clear
              animDir. Matches the CSS flip animation (520ms duration
              + 40ms delay = 560ms) with a small safety buffer so the
              class swap happens AFTER the keyframe naturally settles
              at the resting transform — no mid-animation snap.
  */
  const RISE_HOLD_MS = 460;
  const ANIM_END_MS = 580;

  const handlePhotoClick = () => {
    // Cancel any in-flight timers from a previous click. Prevents a
    // stale timer from stomping on this click's target state.
    if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
    if (animEndTimerRef.current) window.clearTimeout(animEndTimerRef.current);

    // Toggle the target ref IMMEDIATELY (no React state async delay).
    // Direction is derived from the new target so the animation always
    // reflects the click that just happened.
    targetRef.current = !targetRef.current;
    const dir: "fwd" | "bwd" = targetRef.current ? "fwd" : "bwd";

    setIsRaised(true);
    setAnimDir(dir);

    riseTimerRef.current = window.setTimeout(() => {
      setIsRaised(false);
      riseTimerRef.current = null;
    }, RISE_HOLD_MS);
    animEndTimerRef.current = window.setTimeout(() => {
      setFlipped(targetRef.current);
      setAnimDir(null);
      animEndTimerRef.current = null;
    }, ANIM_END_MS);
  };

  useEffect(() => {
    return () => {
      if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
      if (animEndTimerRef.current) window.clearTimeout(animEndTimerRef.current);
    };
  }, []);

  /* Wiggle hint trigger — adds .play-wiggle the FIRST time the polaroid
     enters the viewport. Was previously CSS-only with a fixed 1600ms
     load delay, which missed users who scrolled past the hero within
     that window (mobile especially) or who returned with a scroll
     position past hero. IntersectionObserver ensures the affordance
     fires when the polaroid is actually visible. Adds a small delay
     after entry so the polaroid's own entrance animation (350+550ms)
     finishes settling first. Once triggered, the observer disconnects
     so the wiggle plays exactly once per session. */
  useEffect(() => {
    const el = liftRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let wiggleTimer: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            wiggleTimer = window.setTimeout(() => {
              el.classList.add("play-wiggle");
            }, 900);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (wiggleTimer) window.clearTimeout(wiggleTimer);
    };
  }, []);

  /* Hover tilt — a 2D rotation (rotate on Z-axis) so the polaroid
     appears to pivot on a flat surface, like a photo card being
     nudged on a tabletop. Different from the folder-card tilt which
     rotates the card in 3D space (rotateX/Y). Applied inline to the
     hover wrapper so it composes with the parent's parallax translate
     and the child's flip keyframe without CSS specificity fights.
     +6° gives a clear visible swing (composes with the -4° parallax
     base rotation on .hero-polaroid → net +2° right when hovered vs
     -4° at rest). */
  const handleHoverEnter = () => {
    const el = hoverRef.current;
    if (!el) return;
    // Token-migrated: was 280ms + inline spring bezier. Now uses the
    // shared --dur-med + --ease-spring so this hover matches every other
    // spring-eased interaction on the site (folder tilt, HoverBag pill
    // entrance). Inline styles can reference CSS custom properties.
    el.style.transition = "transform var(--dur-med) var(--ease-spring)";
    el.style.transform = "rotate(6deg)";
  };
  const handleHoverLeave = () => {
    const el = hoverRef.current;
    if (!el) return;
    // Slightly longer on leave (--dur-slow) so the return-to-rest reads
    // as a slower "settle" than the on-enter snap. Still on the same
    // spring so it visibly overshoots back to 0deg.
    el.style.transition = "transform var(--dur-slow) var(--ease-spring)";
    el.style.transform = "rotate(0deg)";
  };

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
            Focusing on <strong>Product Design</strong>,{" "}
            <strong>Research</strong>, and{" "}
            <strong>Cross-Functional Work</strong>
          </p>
        </div>

        {/* cycling-glyph sparkle field — quieted per /distill: fewer
            slots (5 vs 8), slower drift (slowdown 1.6), longer life
            (lifeScale 1.3) so the field reads as ambient atmosphere
            rather than a competing focal element. Lets the polaroid +
            availability sticker + wordmark hold the primary hierarchy. */}
        <div className="hero-sparkles" aria-hidden="true">
          <SparkleField count={5} slowdown={1.6} lifeScale={1.3} />
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
          <div ref={liftRef} className={`polaroid-lift${isRaised ? " is-raised" : ""}`}>
            {/* Hover-tilt wrapper — mouse tracking rotates this element
                on X/Y to follow the cursor. Wraps the flipper button so
                the click choreography (which owns .polaroid-card's
                transform via keyframes) doesn't conflict with the hover
                transform (which owns .polaroid-hover's inline transform). */}
            <div
              className="polaroid-hover"
              ref={hoverRef}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
            {/* Full-card flipper — the WHOLE polaroid (paper + photo well +
                caption) is the front face; the back face is a same-sized
                paper card with the drawing and NO caption text. Clicking
                anywhere on the card triggers the rise → flip → rest
                choreography. Stickers stay OUTSIDE the flipper so they
                don't rotate with the card (they only slide outward during
                the raised phase — see .polaroid-attached rules in CSS). */}
            <button
              type="button"
              className={[
                "polaroid-card",
                flipped ? "is-flipped" : "",
                animDir ? `is-anim-${animDir}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
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
            {/* End .polaroid-hover */}
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
            {/* interlocked-circles doodle — paths carry pathLength="1"
                so a single stroke-dashoffset keyframe (0 → 1) can trace
                the outline draw-in on entrance regardless of the actual
                path length. Two paths animate with a 220ms stagger via
                the .doodle-p1 / .doodle-p2 classes below. Animation is
                declared in globals.css (see @keyframes doodleDraw). */}
            <svg
              className="design-doodle"
              viewBox="0 0 274 240"
              aria-hidden="true"
            >
              <path
                className="doodle-p1"
                pathLength="1"
                d="M110.5 20.5C160.118 20.5 200.5 60.931 200.5 111C200.5 161.069 160.118 201.5 110.5 201.5C60.882 201.5 20.5 161.069 20.5 111C20.5 60.931 60.882 20.5 110.5 20.5Z"
                stroke="currentColor"
                strokeWidth="28"
                fill="none"
              />
              <path
                className="doodle-p2"
                pathLength="1"
                d="M200 102C237.711 102 268 131.703 268 168C268 204.297 237.711 234 200 234C162.289 234 132 204.297 132 168C132 131.703 162.289 102 200 102Z"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
              />
            </svg>
            <div className="d-text">
              {/* Availability sticker copy — hiring window elevated to the
                  primary read, discipline list demoted to a mono
                  crediential strip below. Recruiters skimming the hero
                  grab "Summer 2026" first (the fact that determines
                  whether to keep reading), then the discipline list
                  (what to slot the candidate into). */}
              <span className="d-avail">Available</span>
              <strong>Summer 2026</strong>
              <span className="d-sub">Product Design · UX · PM</span>
            </div>
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
