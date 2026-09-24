"use client";

import { useEffect, useRef } from "react";
import {
  watchScrollVelocity,
  getScrollVelocity,
  survivableScrollVh,
} from "@/components/scrollVelocity";
import { STAR_PATH } from "@/components/OpportunityGap";
import figmaLogo from "@/app/projects/inline/images/Program_Figma.webp";
import aiStudioLogo from "@/app/projects/inline/images/Program_AIStudio.webp";

/**
 * ProgramSwitch — the Figma Make ⇄ Google AI Studio loop on the inline
 * case study.
 *
 * Once it scrolls into view, the two icons rise in, then a small copy of
 * the gap graphic's feature star shuttles between them on a loop:
 *
 *   top reason fades in → star leaves Figma, arcs over, dives behind
 *   AI Studio → AI Studio gets knocked right and bounces back → reason
 *   fades out → bottom reason fades in → star returns underneath into
 *   Figma → Figma gets knocked left and bounces back → …
 *
 * The star is drawn beneath both icons, so it genuinely disappears "into"
 * each program rather than fading out. Each reason is shown on its own side
 * only while its trip is happening.
 *
 * Layering on each icon (outer → inner), so transforms never overwrite
 * each other: .program-switch__logo (entrance, CSS) → .program-switch__float
 * (idle float, CSS) → .program-switch__knock (impact bounce, WAAPI).
 *
 * The loop pauses while off screen. Reduced motion: no star, no float, both
 * reasons shown. Without JS: everything simply visible and still.
 */

/** Icon entrance length — matches the last ps-logo-in end in globals.css. */
const ENTRANCE_MS = 1100;
const TRIGGER_AHEAD_VH = 0;

/** Star flight paths. Both start and end inside an icon (hidden there).
 *  Each arc peaks through the middle of its label's band, so the star
 *  crosses in front of the reason for that trip. */
const LEG_TOP = "M213 150 C 205 -123, 781 -123, 773 150";
const LEG_BOTTOM = "M773 390 C 781 683, 205 683, 213 390";
/** Icon boxes span roughly y 57–480; the star is "in" once inside this. */
const ICON_TOP = 70;
const ICON_BOTTOM = 470;

/** Timing, ms (the calm pace). */
const TRAVEL = 1625;
const LABEL_LEAD = 750; // label shows this long before the star sets off
const LABEL_HOLD = 690; // …and stays this long after it lands
const GAP = 625; // quiet beat before the next label

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** Knock-back bounce: pushed the way the star was travelling (dir = 1 →
 *  right, -1 → left), tips slightly, then springs back through a couple of
 *  shrinking overshoots. */
/** Knock strength — 0.6 = the "Subtle" setting picked in the prototype. */
const KNOCK = 0.6;

function knock(el: Element, dir: 1 | -1) {
  const f = (x: number, r: number, sx: number) => ({
    transform: `translateX(${x * dir * KNOCK}px) rotate(${r * dir * KNOCK}deg) scale(${1 + (sx - 1) * KNOCK}, 1)`,
  });
  const e = "cubic-bezier(.35,0,.3,1)";
  el.animate(
    [
      { transform: "none", easing: "cubic-bezier(.2,.7,.3,1)" },
      { ...f(16, 4, 0.95), offset: 0.18, easing: e },
      { ...f(-7, -1.8, 1.02), offset: 0.42, easing: e },
      { ...f(3, 0.8, 0.995), offset: 0.63, easing: e },
      { ...f(-1, -0.3, 1), offset: 0.82, easing: e },
      { transform: "none" },
    ],
    { duration: 1100 },
  );
}

type Props = {
  topLabel: React.ReactNode;
  bottomLabel: React.ReactNode;
  alt: string;
  caption?: React.ReactNode;
};

export default function ProgramSwitch({ topLabel, bottomLabel, alt, caption }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const travRef = useRef<SVGGElement>(null);
  const spinRef = useRef<SVGGElement>(null);
  const legTopRef = useRef<SVGPathElement>(null);
  const legBotRef = useRef<SVGPathElement>(null);
  const knockFigmaRef = useRef<SVGGElement>(null);
  const knockStudioRef = useRef<SVGGElement>(null);
  const labTopRef = useRef<HTMLParagraphElement>(null);
  const labBotRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const trav = travRef.current;
    const spin = spinRef.current;
    const legTop = legTopRef.current;
    const legBot = legBotRef.current;
    const kFig = knockFigmaRef.current;
    const kStu = knockStudioRef.current;
    const labTop = labTopRef.current;
    const labBot = labBotRef.current;
    if (!root || !trav || !spin || !legTop || !legBot || !kFig || !kStu || !labTop || !labBot)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("is-armed");
    watchScrollVelocity();
    const fast = survivableScrollVh(ENTRANCE_MS, TRIGGER_AHEAD_VH);

    // Where along each leg the star crosses into its target icon.
    const legs = [
      { path: legTop, hit: kStu, lab: labTop, dir: 1 as const, spin: 1 },
      { path: legBot, hit: kFig, lab: labBot, dir: -1 as const, spin: -1 },
    ].map((l) => {
      const len = l.path.getTotalLength();
      let hitAt = 0.9;
      for (let i = 50; i <= 100; i++) {
        const y = l.path.getPointAtLength((len * i) / 100).y;
        if (y > ICON_TOP && y < ICON_BOTTOM) {
          hitAt = i / 100;
          break;
        }
      }
      return { ...l, len, hitAt };
    });

    type State = "lead" | "travel" | "hold" | "gap";
    let leg = 0;
    let state: State = "lead";
    let stateStart = 0;
    let hitDone = false;
    let raf = 0;
    let started = false;
    let visible = false;
    let pausedAt = 0;
    let startTimer = 0;

    const frame = (now: number) => {
      raf = 0;
      const l = legs[leg];
      const el = now - stateStart;
      if (state === "lead") {
        if (el >= LABEL_LEAD) {
          state = "travel";
          stateStart = now;
          hitDone = false;
        }
      } else if (state === "travel") {
        const raw = Math.min(1, el / TRAVEL);
        const t = easeInOutSine(raw);
        const pt = l.path.getPointAtLength(l.len * t);
        trav.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        spin.setAttribute("transform", `rotate(${l.spin * t * 240})`);
        trav.style.opacity = raw < 0.04 || raw > 0.98 ? "0" : "1";
        if (!hitDone && t >= l.hitAt + 0.04) {
          hitDone = true;
          knock(l.hit, l.dir);
        }
        if (raw >= 1) {
          trav.style.opacity = "0";
          state = "hold";
          stateStart = now;
        }
      } else if (state === "hold") {
        if (el >= LABEL_HOLD) {
          l.lab.classList.remove("is-on");
          state = "gap";
          stateStart = now;
        }
      } else if (el >= GAP) {
        leg = 1 - leg;
        state = "lead";
        stateStart = now;
        legs[leg].lab.classList.add("is-on");
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const beginLoop = () => {
      started = true;
      stateStart = performance.now();
      legs[0].lab.classList.add("is-on");
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible = e.isIntersecting;
          root.classList.toggle("is-offscreen", !visible);
          if (!visible) {
            // Freeze the timeline where it is.
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
            pausedAt = performance.now();
            return;
          }
          if (started && !raf) {
            // Resume, shifting the clock by however long we were away.
            if (pausedAt) stateStart += performance.now() - pausedAt;
            pausedAt = 0;
            raf = requestAnimationFrame(frame);
          }
          if (!root.classList.contains("is-in") && e.intersectionRatio >= 0.45) {
            const instant = getScrollVelocity() > fast;
            if (instant) root.classList.add("is-instant");
            root.classList.add("is-in");
            startTimer = window.setTimeout(beginLoop, instant ? 0 : ENTRANCE_MS);
          }
        });
      },
      { threshold: [0, 0.45] },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(startTimer);
    };
  }, []);

  return (
    <div className="zoomable-wrap">
      <div className="zoomable-frame is-static program-switch" ref={rootRef}>
        <div className="program-switch__inner">
          {/* Stage: the labels sit behind the SVG, inside the bands the
              star's arcs run through, so the star passes in front of them
              and the figure needs no extra room for text. */}
          <div className="program-switch__stage">
            <p
              ref={labTopRef}
              className="program-switch__label program-switch__label--top"
            >
              {topLabel}
            </p>
            <p
              ref={labBotRef}
              className="program-switch__label program-switch__label--bottom"
            >
              {bottomLabel}
            </p>
            <svg
              className="program-switch__svg"
              viewBox="0 -110 978 772"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={alt}
            >
              <defs>
                {/* Rounded-square crop from the updated Figma icon export (410×413,
                    rx 93), kept in the icon's original position. */}
                <clipPath id="ps-figma-clip">
                  <rect x="8" y="66.4961" width="410" height="413" rx="93" />
                </clipPath>
              </defs>

              {/* Star first, so both icons sit on top of it. */}
              <g ref={travRef} className="program-switch__star" style={{ opacity: 0 }}>
                <g ref={spinRef}>
                  <g transform="scale(0.15) translate(-477 -239)">
                    <path d={STAR_PATH} fill="#FFE6AC" stroke="#D59B6E" strokeWidth="44" />
                  </g>
                </g>
              </g>
              <path ref={legTopRef} d={LEG_TOP} fill="none" />
              <path ref={legBotRef} d={LEG_BOTTOM} fill="none" />

              <g className="program-switch__logo program-switch__logo--figma">
                <g className="program-switch__float program-switch__float--figma">
                  <g ref={knockFigmaRef} className="program-switch__knock">
                    <image
                      href={figmaLogo.src}
                      x="-41"
                      y="17.5"
                      width="512"
                      height="512"
                      clipPath="url(#ps-figma-clip)"
                    />
                  </g>
                </g>
              </g>
              <g className="program-switch__logo program-switch__logo--studio">
                <g className="program-switch__float program-switch__float--studio">
                  <g ref={knockStudioRef} className="program-switch__knock">
                    <image href={aiStudioLogo.src} x="568" y="57.4961" width="410" height="413" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </div>
  );
}
