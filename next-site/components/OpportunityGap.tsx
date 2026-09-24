"use client";

import { useEffect, useId, useRef } from "react";

/**
 * OpportunityGap — the "opportunity gap" ornament on the inline case study,
 * with the feature star rising out of the hole as the reader scrolls, then
 * floating gently once it's out.
 *
 * Scroll-LINKED rather than scroll-triggered: the star's position is a pure
 * function of where the ornament sits in the viewport, so a flick-scroller
 * sees it already out and someone reading slowly watches it climb. Nothing
 * here can leave the ornament half-drawn (see scrollVelocity.ts for why
 * that matters on this site).
 *
 * The hole is faked with a clip: the star is only drawn above the hole's
 * centre line or inside the hole's ellipse, so while it's parked below it
 * reads as "inside the ground" and emerges through the opening.
 *
 * Decorative only — aria-hidden, same as the <img> it replaced.
 */

/** The feature star outline — shared with ProgramSwitch, where a small
 *  copy of it travels between the two tools. */
export const STAR_PATH =
  "M524.846 33.6871C526.816 34.3564 527.96 35.6786 528.489 36.4327C529.07 37.2608 529.368 38.0424 529.514 38.4771C529.812 39.3611 529.937 40.2069 530 40.7246C530.138 41.8517 530.187 43.2167 530.204 44.5905C530.241 47.409 530.153 51.3813 530.048 56.059C529.836 65.5295 529.539 78.4943 529.915 93.1165C530.671 122.601 534.152 157.779 545.891 183.901C557.267 209.216 579.171 229.019 598.763 243.414C608.513 250.577 617.44 256.227 624.098 260.588C627.335 262.708 630.247 264.659 632.314 266.303C633.315 267.099 634.462 268.089 635.376 269.211C635.835 269.774 636.457 270.638 636.908 271.762C637.37 272.912 637.813 274.756 637.224 276.883C636.612 279.09 635.206 280.418 634.429 281.038C633.587 281.711 632.722 282.156 632.088 282.443C630.81 283.024 629.331 283.466 627.945 283.825C625.107 284.559 621.256 285.287 616.897 286.069C608.001 287.664 596.196 289.616 583.109 292.57C556.691 298.532 526.636 308.262 507.104 325.795C480.014 350.113 459.887 378.919 446.045 401.721C439.132 413.11 433.83 422.924 429.974 429.965C428.081 433.421 426.442 436.382 425.151 438.451C424.531 439.446 423.803 440.542 423.028 441.437C422.663 441.858 422.006 442.57 421.087 443.185C420.356 443.676 417.97 445.108 414.841 444.241C412.707 443.65 411.442 442.286 410.828 441.436C410.215 440.587 409.899 439.777 409.739 439.309C409.418 438.366 409.291 437.459 409.227 436.891C409.088 435.662 409.056 434.171 409.062 432.662C409.075 429.568 409.257 425.226 409.48 420.119C409.931 409.782 410.575 395.706 410.524 379.998C410.422 348.255 407.458 311.233 395.25 285.705C383.814 261.793 364.804 240.599 348.398 224.51C340.189 216.459 332.877 209.916 327.393 204.791C324.731 202.303 322.377 200.035 320.711 198.167C319.897 197.255 319.018 196.187 318.341 195.063C318.001 194.498 317.575 193.698 317.278 192.725C316.992 191.791 316.665 190.175 317.158 188.289C318.22 184.229 321.831 182.915 322.622 182.634C323.95 182.162 325.375 181.942 326.517 181.81C328.887 181.537 332.036 181.443 335.441 181.371C342.483 181.222 351.812 181.148 362.483 180.218C383.918 178.352 409.695 173.095 430.472 157.709C455.445 139.214 476.077 109.316 491.01 83.5059C498.425 70.6893 504.327 59.0774 508.6 50.6269C510.71 46.4565 512.494 42.9127 513.838 40.4591C514.493 39.2641 515.175 38.081 515.827 37.1514C516.124 36.7281 516.644 36.0226 517.35 35.3693C517.696 35.0483 518.364 34.4772 519.326 34.0189C520.289 33.5603 522.168 32.933 524.44 33.5626L524.846 33.6871Z";

/** Star's resting centre, in SVG units (from the original Oppurtunity.svg). */
const CX = 477;
const CY = 239;
/** How far below its resting spot the star starts — enough to sit fully
 *  under the hole's front rim at progress 0. */
const RISE = 470;
/** Progress runs from the ornament's top at START×vh to END×vh. START is
 *  held back from the viewport edge so the star waits a beat after the
 *  hole comes into view before it starts to climb. */
const START = 0.85;
const END = 0.35;
/** Lag, in seconds: the star chases the scroll position rather than being
 *  pinned to it, so it trails the reader's scroll slightly and eases in. */
const LAG = 0.22;
/** Idle float once the star is out. */
const FLOAT_Y = 24; // SVG units (~5px at rendered size)
const FLOAT_ROT = 6; // degrees
const FLOAT_Y_PERIOD = 2.8; // seconds
const FLOAT_ROT_PERIOD = 3.9;
/** Slight "breathing" scale while floating. */
const FLOAT_SCALE = 0.03;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** Gentle back-ease: a small overshoot so the star "pops" and settles. */
const easeOutBack = (t: number) => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** p = rise progress (0 hidden → 1 out); time = seconds, for the float. */
function starTransform(p: number, time = 0) {
  // Squared input so the climb is even across the scroll range; the
  // back-ease then gives a small overshoot (~5%) near the end.
  const t = clamp(p);
  const e = easeOutBack(t * t);
  // Float fades in over the last stretch so it never fights the pop.
  const w = clamp((t - 0.85) / 0.15);
  const bob = Math.sin((2 * Math.PI * time) / FLOAT_Y_PERIOD) * FLOAT_Y * w;
  const sway = Math.sin((2 * Math.PI * time) / FLOAT_ROT_PERIOD) * FLOAT_ROT * w;
  const y = RISE * (1 - e) + bob;
  const rot = -22 * (1 - e) + sway;
  const breathe = Math.sin((2 * Math.PI * time) / FLOAT_Y_PERIOD + Math.PI / 2) * FLOAT_SCALE * w;
  const s = 0.72 + 0.28 * e + breathe;
  return `translate(${CX} ${CY + y}) rotate(${rot}) scale(${s}) translate(${-CX} ${-CY})`;
}

export default function OpportunityGap({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const starRef = useRef<SVGGElement>(null);
  const uid = useId().replace(/:/g, "");
  const ids = {
    clip: `og-clip-${uid}`,
    radial: `og-radial-${uid}`,
    linear: `og-linear-${uid}`,
  };

  useEffect(() => {
    const svg = svgRef.current;
    const star = starRef.current;
    if (!svg || !star) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = false;
    let current = 0; // lagged progress actually drawn
    let last = 0;

    const target = () => {
      const top = svg.getBoundingClientRect().top;
      const vh = window.innerHeight;
      return clamp((vh * START - top) / (vh * (START - END)));
    };

    // One rAF loop, running only while the ornament is on screen: it eases
    // `current` toward the scroll target and drives the float.
    const frame = (now: number) => {
      raf = 0;
      if (reduced.matches) {
        star.setAttribute("transform", starTransform(1));
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const goal = target();
      current += (goal - current) * (1 - Math.exp(-dt / LAG));
      if (Math.abs(goal - current) < 0.0005) current = goal;
      star.setAttribute("transform", starTransform(current, now / 1000));
      if (visible) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    // Initial pose without animating in from 0 if the page loads scrolled
    // past the ornament (back/forward, anchor links).
    current = target();
    star.setAttribute("transform", starTransform(reduced.matches ? 1 : current));

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(svg);
    const onPref = () => start();
    reduced.addEventListener("change", onPref);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      reduced.removeEventListener("change", onPref);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 684 481"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ aspectRatio: "684 / 481" }}
    >
      <defs>
        {/* Union of: everything above the hole's centre line + the hole
            opening itself. Below the rim and outside the hole = ground. */}
        <clipPath id={ids.clip}>
          <rect x="-100" y="-200" width="900" height="605" />
          <ellipse cx="324.5" cy="405" rx="324.5" ry="76" />
        </clipPath>
        <radialGradient
          id={ids.radial}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(333.5 543) rotate(-99.0771) scale(171.143 419.197)"
        >
          <stop stopColor="#93613A" />
          <stop offset="1" stopColor="#3A1900" />
        </radialGradient>
        <linearGradient
          id={ids.linear}
          x1="324"
          y1="286.5"
          x2="284.5"
          y2="538"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1D009E" />
          <stop offset="1" stopColor="#7E0000" />
        </linearGradient>
      </defs>

      {/* The hole */}
      <ellipse cx="324.5" cy="405" rx="324.5" ry="76" fill="#393331" />
      <ellipse cx="324.5" cy="405" rx="324.5" ry="76" fill={`url(#${ids.radial})`} />
      <ellipse
        cx="324.5"
        cy="405"
        rx="324.5"
        ry="76"
        fill={`url(#${ids.linear})`}
        fillOpacity="0.34"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* The feature star — starts parked inside the hole */}
      <g clipPath={`url(#${ids.clip})`}>
        <g ref={starRef} transform={starTransform(0)}>
          <path
            d={STAR_PATH}
            fill="#FFE6AC"
            stroke="#D59B6E"
            strokeWidth="14.2187"
          />
        </g>
      </g>
    </svg>
  );
}
