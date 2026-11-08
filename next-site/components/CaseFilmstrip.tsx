"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";

/**
 * CaseFilmstrip — a progression of images under one heading: one frame at
 * a time, a thumbnail strip that is both the position indicator and the
 * jump target, and a caption naming what is on screen.
 *
 * Why this and not ResearchCarousel: that component takes arbitrary JSX
 * slides, so it can't know an image's proportions. This one reads them,
 * which is what lets every frame in a group share one height and lets the
 * visual be centred in that height rather than hanging off the top of it.
 *
 * What it fixes relative to the carousels already on the site:
 *   - position is always visible (thumbnail strip + "3 / 8")
 *   - frames in a group share one height, so advancing never changes the
 *     page height under the reader
 *   - no wheel handler, so a diagonal trackpad scroll is never stolen
 *   - the strip is the control, so there are no 11px low-contrast
 *     prev/next links to find
 */

export type Shot = {
  key: string;
  /** next/image static import — carries width and height. */
  img: { src: string; width: number; height: number };
  alt: string;
  /** Short name for the caption and the thumbnail. */
  label: string;
};

/**
 * Share of the viewport one frame may occupy. Deliberately modest: a
 * frame that fills the screen pushes its caption and the next heading out
 * of view, which is what makes a long case study feel like work.
 */
const VH_SHARE = 0.4;

export default function CaseFilmstrip({
  shots,
  label,
}: {
  shots: Shot[];
  /** Names the group for assistive tech — usually the h3 above it. */
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [colW, setColW] = useState(0);
  const [vh, setVh] = useState(0);
  const [active, setActive] = useState(0);

  // Both measurements come from layout, so the first paint has none; the
  // effect's first run fills them in.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      setColW(el.clientWidth);
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /*
   * One height for the whole group, from its tallest member, so moving
   * between frames never resizes the page. Every frame then sits centred
   * in that height — a 4255×852 panorama is 194px tall where the box is
   * 360px, and the leftover splits evenly above and below instead of
   * pooling under the image.
   */
  const tallest = Math.max(...shots.map((s) => s.img.height / s.img.width));
  const frameH = colW ? Math.round(Math.min(colW * tallest, vh * VH_SHARE)) : 0;

  /** The size this image actually renders at inside that box. */
  const fit = (s: Shot) => {
    const ar = s.img.width / s.img.height;
    const w = Math.round(Math.min(frameH * ar, colW));
    return { w, h: Math.round(w / ar), ar };
  };

  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => Math.min(Math.max(i + dir, 0), shots.length - 1)),
    [shots.length],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  };

  const cell = (s: Shot) => {
    const f = frameH ? fit(s) : null;
    return (
      <div
        key={s.key}
        className="cf-cell"
        style={frameH ? { height: frameH } : undefined}
      >
        <div className="cf-fit" style={f ? { width: f.w, height: f.h } : undefined}>
          <ZoomableImage src={s.img.src} alt={s.alt} aspectRatio={s.img.width / s.img.height} />
        </div>
      </div>
    );
  };

  // A lone image needs no strip and no counter.
  if (shots.length === 1) {
    return (
      <div className="cf" ref={wrapRef}>
        {cell(shots[0])}
        <p className="cf-cap">{shots[0].label}</p>
      </div>
    );
  }

  return (
    <div
      className="cf"
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="cf-viewport">
        <div
          className="cf-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {shots.map((s, i) => (
            <div
              key={s.key}
              className="cf-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${shots.length}: ${s.label}`}
              /* No aria-hidden on off-screen frames: each holds a
                 focusable zoom button, and hidden-but-focusable is
                 worse than announced-but-offscreen. */
            >
              {cell(s)}
            </div>
          ))}
        </div>
      </div>

      <div className="cf-strip" role="tablist" aria-label={`${label} frames`}>
        {shots.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            className="cf-thumb"
            data-on={i === active || undefined}
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            {/* Decorative: the label below is the accessible name. */}
            <img src={s.img.src} alt="" loading="lazy" />
            <span className="cf-thumb-label">{s.label}</span>
          </button>
        ))}
      </div>

      <p className="cf-cap" aria-live="polite">
        <strong>
          {active + 1} / {shots.length}
        </strong>{" "}
        · {shots[active].label}
      </p>
    </div>
  );
}
