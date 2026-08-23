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
  const targetRef = useRef(false);
  const riseTimerRef = useRef<number | null>(null);
  const animEndTimerRef = useRef<number | null>(null);
  const liftRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
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

  const RISE_HOLD_MS = 460;
  const ANIM_END_MS = 580;

  const handlePhotoClick = () => {
    if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
    if (animEndTimerRef.current) window.clearTimeout(animEndTimerRef.current);

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

  const handleHoverEnter = () => {
    const el = hoverRef.current;
    if (!el) return;
    el.style.transition = "transform var(--dur-med) var(--ease-spring)";
    el.style.transform = "rotate(6deg)";
  };
  const handleHoverLeave = () => {
    const el = hoverRef.current;
    if (!el) return;
    el.style.transition = "transform var(--dur-slow) var(--ease-spring)";
    el.style.transform = "rotate(0deg)";
  };
  const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
  const photoSrc = `${basePath}/img/polaroid/polaroid_real.webp`;
  const drawingSrc = `${basePath}/img/polaroid/polaroid_drawing.webp`;

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-greeting">
          <p className="hero-greet-lead">
            <span className="hero-greet-hi">Hello, I&rsquo;m </span>
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
        <div className="hero-sparkles" aria-hidden="true">
          <SparkleField count={5} slowdown={1.6} lifeScale={1.3} />
        </div>
        <div
          className={`hero-polaroid${isRaised ? " is-raised" : ""}`}
          data-cursor="polaroid"
        >
          <div ref={liftRef} className={`polaroid-lift${isRaised ? " is-raised" : ""}`}>
            <div
              className="polaroid-hover"
              ref={hoverRef}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
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
            <div className="polaroid-face polaroid-face-front">
              <div className="photo has-image">
                <img
                  src={photoSrc}
                  alt="Kathleen — photo"
                  className="photo-img"
                  draggable={false}
                />
              </div>
              <div className="caption-block">
                <div className="caption-meta">Last Updated · 05/07/26</div>
                <div className="caption-line">
                  <span className="cap-write">I design <strong>solutions</strong> with</span>
                  <span className="cap-write">moments worth <strong>lingering</strong> on</span>
                </div>
              </div>
            </div>

            <div className="polaroid-face polaroid-face-back">
              <div className="photo has-image">
                <img
                  src={drawingSrc}
                  alt="Kathleen — self-portrait doodle (drawn mirrored for
                       the back-of-polaroid immersion effect)"
                  className="photo-img"
                  draggable={false}
                />
              </div>
            </div>
            </button>
            </div>
          </div>
          <div className="sticker school-note polaroid-attached">
            <span className="school-note-text">
              Currently completing my junior year @ Purdue
            </span>
          </div>
          <div className="sticker designing-green polaroid-attached">
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
              <span className="d-avail">Available</span>
              <strong>Summer 2026</strong>
              <span className="d-sub">Product Design · Product Management</span>
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
