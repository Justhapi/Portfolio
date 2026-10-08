"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import ZhName from "@/components/ZhName";
import { swapNames, slapNudge } from "@/components/heroStickerMotion";
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
  /* isShiftAnim — a short window (raise duration + the shift-back
     transition) during which the attached stickers' CSS transition is
     turned on via .is-shift-anim (see globals.css). Outside this window
     the transition is off entirely, so the SmoothScroll.tsx parallax
     system's per-frame inline transform writes apply instantly instead
     of being eased — that eased chase is what read as the stickers
     "lagging"/"glitching" behind the scroll on mobile. */
  const [isShiftAnim, setIsShiftAnim] = useState(false);
  const targetRef = useRef(false);
  const riseTimerRef = useRef<number | null>(null);
  const animEndTimerRef = useRef<number | null>(null);
  const shiftTimerRef = useRef<number | null>(null);
  const liftRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);

  /* Sticker interactions (see heroStickerMotion.ts) — clicking the name
     badge swaps Kathleen ⇄ 妤𣎮; clicking a polaroid sticker pops it
     forward over the photo for a moment. */
  const [namesSwapped, setNamesSwapped] = useState(false);
  const swappingRef = useRef(false);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const chipRef = useRef<HTMLSpanElement | null>(null);
  const helloRef = useRef<HTMLSpanElement | null>(null);
  const schoolRef = useRef<HTMLDivElement | null>(null);
  const greenRef = useRef<HTMLDivElement | null>(null);

  const handleNameSwap = () => {
    const big = nameRef.current;
    const chip = chipRef.current;
    const hello = helloRef.current;
    if (!big || !chip || !hello || swappingRef.current) return;
    swappingRef.current = true;
    swapNames(big, chip, hello, namesSwapped, () =>
      flushSync(() => setNamesSwapped((v) => !v)),
    ).finally(() => {
      swappingRef.current = false;
    });
  };
  const handleNudge = (el: HTMLDivElement | null, baseRotate: number) => {
    if (el && photoRef.current) slapNudge(el, photoRef.current, baseRotate);
  };
  /** Enter / Space activate the role="button" stickers. */
  const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
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
  const ANIM_END_MS = 760;
  // Covers the raise hold plus the slowest staggered shift-back
  // (delay + duration ≈ 590ms, see "Flip reactions" in globals.css) so
  // the transitions stay on long enough to animate the return trip.
  const SHIFT_ANIM_MS = RISE_HOLD_MS + 640;

  /* Ends the flip on the card's own animationend (not a timer racing
     it). The keyframe also holds its last frame (fill-mode: both), and
     the face swap + class removal land in one render, so there is no
     frame where the card snaps back to the old face before the new
     rest pose applies — that one-frame snap was the end-of-flip glitch. */
  const flipLockRef = useRef(false);
  const finishFlip = () => {
    if (animEndTimerRef.current) {
      window.clearTimeout(animEndTimerRef.current);
      animEndTimerRef.current = null;
    }
    flushSync(() => {
      setFlipped(targetRef.current);
      setAnimDir(null);
    });
    flipLockRef.current = false;
  };
  const handleFlipAnimEnd = (e: React.AnimationEvent<HTMLButtonElement>) => {
    // Caption pen-writes etc. bubble up from inside the card — only the
    // card's own flip keyframe ends the flip.
    if (e.target !== e.currentTarget) return;
    if (!e.animationName.startsWith("flipMalleable")) return;
    finishFlip();
  };

  const handlePhotoClick = () => {
    // Ignore clicks mid-flip: restarting the keyframe from the other
    // direction would jump the card straight to the opposite pose.
    if (flipLockRef.current) return;
    flipLockRef.current = true;
    if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
    if (animEndTimerRef.current) window.clearTimeout(animEndTimerRef.current);
    if (shiftTimerRef.current) window.clearTimeout(shiftTimerRef.current);

    targetRef.current = !targetRef.current;
    const dir: "fwd" | "bwd" = targetRef.current ? "fwd" : "bwd";

    setIsRaised(true);
    setIsShiftAnim(true);
    setAnimDir(dir);

    riseTimerRef.current = window.setTimeout(() => {
      setIsRaised(false);
      riseTimerRef.current = null;
    }, RISE_HOLD_MS);
    // Fallback only (e.g. reduced motion, where no animation runs).
    animEndTimerRef.current = window.setTimeout(finishFlip, ANIM_END_MS);
    shiftTimerRef.current = window.setTimeout(() => {
      setIsShiftAnim(false);
      shiftTimerRef.current = null;
    }, SHIFT_ANIM_MS);
  };

  useEffect(() => {
    return () => {
      if (riseTimerRef.current) window.clearTimeout(riseTimerRef.current);
      if (animEndTimerRef.current) window.clearTimeout(animEndTimerRef.current);
      if (shiftTimerRef.current) window.clearTimeout(shiftTimerRef.current);
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

  /* Cursor tilt — the project folders' hover reactivity, given to the
     polaroid cluster. The whole cluster (card + notes + star) tilts and
     shifts toward the cursor with the folders' exact numbers (±18/14px,
     ±6° Y / ±4° X). On top of that each floating piece leans further on
     its OWN spring, so they read as separate layers at different depths
     rather than one rigid group:
       • star       — lightest: furthest (±14px, spins ±12°), snappy & bouncy
       • Purdue note— middle: ±8px, a little tilt, moderate spring
       • Available  — heaviest: ±4px, slow, lags behind the others
     Springs are integrated per frame and written as CSS variables
     (globals.css "Polaroid cursor tilt"); the loop only runs while
     something is still moving. Mouse/trackpad only; off for reduced
     motion. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current;
    const cluster = stage?.querySelector<HTMLElement>(".hero-polaroid");
    if (!stage || !cluster) return;

    type Body = {
      el: HTMLElement | SVGElement | null;
      gain: number[];          // target = gain × cursor (x, y, x…)
      axis: ("x" | "y")[];     // which cursor axis drives each channel
      k: number; c: number;    // spring stiffness / damping
      v: number[]; p: number[];
      write: (el: HTMLElement | SVGElement, p: number[]) => void;
    };
    const px = (n: number) => `${n.toFixed(2)}px`;
    const layer = (el: HTMLElement | SVGElement | null, g: number[], k: number, c: number): Body => ({
      el, gain: g, axis: ["x", "y", "x"], k, c, v: [0, 0, 0], p: [0, 0, 0],
      write: (e, p) => {
        e.style.setProperty("--hx", px(p[0]));
        e.style.setProperty("--hy", px(p[1]));
        e.style.setProperty("--hr", `${p[2].toFixed(2)}deg`);
      },
    });
    const bodies: Body[] = [
      {
        el: cluster, gain: [18, 14, -4, 6], axis: ["x", "y", "y", "x"],
        k: 170, c: 14, v: [0, 0, 0, 0], p: [0, 0, 0, 0],
        write: (e, p) => {
          e.style.setProperty("--tilt-tx", px(p[0]));
          e.style.setProperty("--tilt-ty", px(p[1]));
          e.style.setProperty("--tilt-rx", p[2].toFixed(3));
          e.style.setProperty("--tilt-ry", p[3].toFixed(3));
          e.style.setProperty("--tilt-ra", `${Math.hypot(p[2], p[3]).toFixed(3)}deg`);
        },
      },
      layer(stage.querySelector<SVGElement>(".polaroid-star"), [14, 11, 12], 320, 15),
      layer(schoolRef.current, [8, 6, 2.5], 210, 17),
      layer(greenRef.current, [4, 3, 1.2], 110, 15),
    ];

    let cx = 0, cy = 0, raf = 0, last = 0;
    const step = (t: number) => {
      const dt = Math.min(0.032, last ? (t - last) / 1000 : 0.016);
      last = t;
      let moving = false;
      for (const b of bodies) {
        if (!b.el) continue;
        for (let i = 0; i < b.p.length; i++) {
          const target = b.gain[i] * (b.axis[i] === "x" ? cx : cy);
          const a = b.k * (target - b.p[i]) - b.c * b.v[i];
          b.v[i] += a * dt;
          b.p[i] += b.v[i] * dt;
          if (Math.abs(target - b.p[i]) > 0.01 || Math.abs(b.v[i]) > 0.01) moving = true;
        }
        b.write(b.el, b.p);
      }
      raf = moving ? requestAnimationFrame(step) : 0;
      if (!moving) last = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    /* Hover is decided by geometry, not by DOM enter/leave. Mid-flip the
       card turns edge-on, so the element under a resting cursor flips to
       the stage and back — enter/leave would fire, the targets would snap
       to 0 and back, and the springs (the star's especially) would thrash
       at the end of every flip. Instead: track the pointer on the window
       and test it against the cluster box, padded to cover the notes
       that hang off the card. */
    const PAD = 0.18;
    let inside = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Cluster box with its own tilt shift taken back out, so the tilt
      // moving the box doesn't feed back into where the cursor "is".
      const b = cluster.getBoundingClientRect();
      const t = bodies[0].p;
      const r = { left: b.left - t[0], top: b.top - t[1], right: b.right - t[0], bottom: b.bottom - t[1], width: b.width, height: b.height };
      const padX = r.width * PAD, padY = r.height * PAD;
      const within =
        e.clientX > r.left - padX && e.clientX < r.right + padX &&
        e.clientY > r.top - padY && e.clientY < r.bottom + padY;
      if (!within) {
        if (inside) { inside = false; cx = 0; cy = 0; kick(); }
        return;
      }
      inside = true;
      const s = stage.getBoundingClientRect();
      stage.style.perspectiveOrigin =
        `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
      cx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      cy = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      kick();
    };
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return; // only when the pointer leaves the window
      inside = false; cx = 0; cy = 0; kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
  // Custom domain (kathleenli.tech) serves from the root — no prefix needed.
  const basePath = "";
  const photoSrc = `${basePath}/img/polaroid/polaroid_real.webp`;
  const drawingSrc = `${basePath}/img/polaroid/polaroid_drawing.webp`;

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-greeting">
          <p className="hero-greet-lead">
            <span className="hero-greet-hi" ref={helloRef}>Hello, I&rsquo;m </span>
            {/* Click to swap which name is the big sticker. Each name keeps
                its own plate; only size and spot trade. */}
            <span
              ref={nameRef}
              className={`sticker name-yellow name-inline is-clickable${namesSwapped ? " is-swapped" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={
                namesSwapped
                  ? "妤𣎮 (Yuxi), also Kathleen — swap names"
                  : "Kathleen, also 妤𣎮 (Yuxi) — swap names"
              }
              onClick={handleNameSwap}
              onKeyDown={onKeyActivate(handleNameSwap)}
            >
              <span className="name-en" aria-hidden="true" lang={namesSwapped ? "zh-Hant" : undefined}>
                {namesSwapped ? <ZhName /> : "Kathleen"}
              </span>
              <span className="chip-zh" ref={chipRef} aria-hidden="true">
                <span className="chip-zh-text" lang={namesSwapped ? undefined : "zh-Hant"}>{namesSwapped ? "Kathleen" : <ZhName />}</span>
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
          className={`hero-polaroid${isRaised ? " is-raised" : ""}${isShiftAnim ? " is-shift-anim" : ""}`}
          data-cursor="polaroid"
        >
          <div ref={liftRef} className={`polaroid-lift${isRaised ? " is-raised" : ""}`}>
            <div
              className="polaroid-hover"
              ref={hoverRef}
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
              onAnimationEnd={handleFlipAnimEnd}
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
                <div className="caption-meta">Last Updated · 10/08/26</div>
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
          {/* Corner star — the same sparkle used on the project folders.
              Pinned to the polaroid's top-right corner; shifts outward
              with the stickers while the card is lifted for a flip. */}
          <svg
            className="polaroid-star"
            viewBox="318 170 88 92"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M383.405 176.641C384.09 177.145 384.186 177.889 384.202 178C384.24 178.258 384.227 178.49 384.216 178.625C384.193 178.918 384.132 179.249 384.068 179.556C383.935 180.191 383.713 181.067 383.457 182.077C382.936 184.134 382.225 186.935 381.602 190.152C380.344 196.643 379.499 204.569 381.158 211.222C382.776 217.707 387.33 223.921 391.593 228.771C393.708 231.177 395.69 233.182 397.154 234.702C397.868 235.443 398.499 236.11 398.933 236.637C399.141 236.89 399.375 237.195 399.546 237.51C399.629 237.664 399.752 237.917 399.817 238.232C399.88 238.539 399.933 239.141 399.562 239.749C399.179 240.375 398.596 240.589 398.368 240.659C398.093 240.744 397.837 240.768 397.666 240.777C397.315 240.795 396.923 240.765 396.56 240.726C395.813 240.646 394.811 240.479 393.671 240.279C391.347 239.87 388.263 239.291 384.807 238.823C377.804 237.873 369.753 237.455 364.016 239.609C356.028 242.606 349.57 247.169 344.979 250.959C342.685 252.853 340.872 254.541 339.548 255.756C338.903 256.349 338.328 256.872 337.882 257.23C337.668 257.401 337.402 257.602 337.122 257.754C336.987 257.827 336.753 257.942 336.457 258.006C336.176 258.067 335.568 258.137 334.948 257.759C334.149 257.271 334.025 256.46 334.001 256.298C333.96 256.023 333.975 255.775 333.989 255.626C334.018 255.308 334.09 254.95 334.168 254.614C334.327 253.921 334.592 252.971 334.899 251.876C335.523 249.649 336.376 246.634 337.134 243.207C338.668 236.276 339.729 228.003 337.926 221.449C336.223 215.258 332.47 208.997 329.111 204.061C327.433 201.596 325.906 199.535 324.776 197.949C324.227 197.178 323.747 196.485 323.421 195.938C323.263 195.674 323.094 195.365 322.976 195.056C322.918 194.903 322.842 194.671 322.81 194.396C322.782 194.146 322.763 193.622 323.079 193.083C323.433 192.479 323.979 192.238 324.298 192.145C324.614 192.054 324.897 192.048 325.067 192.053C325.416 192.063 325.773 192.133 326.059 192.2C326.658 192.339 327.447 192.583 328.313 192.858C330.096 193.424 332.465 194.206 335.217 194.914C340.765 196.342 347.541 197.378 353.509 195.788C360.655 193.885 367.276 189.144 372.291 184.789C374.781 182.627 376.832 180.599 378.328 179.113C379.061 178.384 379.698 177.748 380.169 177.315C380.397 177.106 380.651 176.885 380.892 176.715C381.003 176.637 381.204 176.503 381.458 176.403C381.588 176.351 382.408 176.023 383.261 176.544L383.405 176.641Z"
              fill="#F8E0A8"
              stroke="#D59B6E"
              strokeWidth="3.83596"
            />
          </svg>
          <div
            ref={schoolRef}
            className="sticker school-note polaroid-attached is-clickable"
            role="button"
            tabIndex={0}
            aria-label="Currently completing my junior year at Purdue — bring note forward"
            onClick={() => handleNudge(schoolRef.current, -8)}
            onKeyDown={onKeyActivate(() => handleNudge(schoolRef.current, -8))}
          >
            <span className="school-note-text">
              Currently completing my junior year @ Purdue!
            </span>
          </div>
          <div
            ref={greenRef}
            className="sticker designing-green polaroid-attached is-clickable"
            role="button"
            tabIndex={0}
            aria-label="Availability note — bring note forward"
            onClick={() => handleNudge(greenRef.current, -4)}
            onKeyDown={onKeyActivate(() => handleNudge(greenRef.current, -4))}
          >
            <div className="d-text">
              <span className="d-avail">Available</span>
              <strong>Summer 7</strong>
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
