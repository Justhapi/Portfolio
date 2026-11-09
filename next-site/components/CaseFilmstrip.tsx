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

type Img = { src: string; width: number; height: number };

export type Shot = {
  key: string;
  /**
   * next/image static import(s) — they carry width and height. Pass an
   * array for frames that only make sense next to each other (a public
   * and a private state, an empty and a filled field): they share one
   * slide, side by side, instead of making the reader hold the first in
   * their head while they page to the second.
   */
  img: Img | Img[];
  /** One per image, in the same order. */
  alt: string | string[];
  /** Short name for the caption and the thumbnail. */
  label: string;
};

const imagesOf = (s: Shot): Img[] => (Array.isArray(s.img) ? s.img : [s.img]);
const altsOf = (s: Shot): string[] => (Array.isArray(s.alt) ? s.alt : [s.alt]);
/** Combined proportions of a slide: the images' ratios, added up. */
const ratioOf = (s: Shot) =>
  imagesOf(s).reduce((t, i) => t + i.width / i.height, 0);

/** Gap between images sharing a slide, in px. */
const PAIR_GAP = 14;

/**
 * Share of the viewport one frame may occupy. Deliberately modest: a
 * frame that fills the screen pushes its caption and the next heading out
 * of view, which is what makes a long case study feel like work.
 */
const VH_SHARE = 0.4;

export default function CaseFilmstrip({
  shots,
  label,
  side,
}: {
  shots: Shot[];
  /** Names the group for assistive tech — usually the h3 above it. */
  label: string;
  /**
   * Prose to sit to the LEFT of the carousel. The component is only as
   * wide as its pictures, so a group of narrow frames leaves a column of
   * dead space beside it — this fills it with the writing that belongs
   * to that group instead. Omit it and the carousel centres as before.
   */
  side?: React.ReactNode;
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
  /*
   * One box shape for the whole group. Sizing each frame to its own
   * image is what made a group look ragged — "Create account flow" is
   * 6.6:1 and "Recover account flow" is 2.3:1, so side by side in one
   * carousel they were two unrelated shapes. Every frame now gets the
   * same box and the image is contained inside it, free to be zoomed
   * and panned (ZoomableImage already does both).
   *
   * The shape is the group's median ratio, clamped: a single site-wide
   * ratio can't serve this case study, whose images run from 0.51 to
   * 6.6: a panorama in a square box is a sliver, a portrait board in a
   * wide one is a stamp. Per group it stays honest — a group of
   * panoramas gets a wide box, a group of portraits a tall one — and
   * within a group, which is where the raggedness showed, every frame
   * matches.
   */
  const RATIO_MIN = 0.85, RATIO_MAX = 2.8;
  const allRatios = shots
    .flatMap((sh) => imagesOf(sh).map((i) => i.width / i.height))
    .sort((a, b) => a - b);
  const boxAR = Math.min(
    RATIO_MAX,
    Math.max(RATIO_MIN, allRatios[(allRatios.length - 1) >> 1]),
  );

  const frameH = colW ? Math.round(Math.min(colW / boxAR, vh * VH_SHARE)) : 0;

  /**
   * What a slide actually renders at inside that box. A slide holding
   * two images is laid out as one unit — the pair's combined width is
   * what gets clamped to the column, so both shrink together and the
   * row stays level.
   */
  const fit = (s: Shot) => {
    const n = imagesOf(s).length;
    const gaps = PAIR_GAP * (n - 1);
    const total = Math.min(frameH * boxAR * n + gaps, colW);
    const h = Math.round((total - gaps) / (boxAR * n));
    return { h, widths: Array.from({ length: n }, () => Math.round(h * boxAR)) };
  };

  /*
   * The component is only as wide as its pictures. Before this the
   * viewport, the strip and the caption all spanned the whole text
   * column while a portrait frame sat centred in the middle of it, so
   * the tabs began a long way left of the image they index and the two
   * read as unrelated. Width comes from the widest slide — the widest,
   * not the current one, so paging doesn't shuffle the strip sideways.
   */
  const boxW = frameH
    ? Math.max(...shots.map((sh) => {
        const f = fit(sh);
        return f.widths.reduce((a, b) => a + b, 0) + PAIR_GAP * (f.widths.length - 1);
      }))
    : 0;

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
    const list = imagesOf(s);
    const captions = altsOf(s);
    const f = frameH ? fit(s) : null;
    return (
      <div
        key={s.key}
        className="cf-cell"
        style={frameH ? { height: frameH } : undefined}
      >
        <div className="cf-pair">
          {list.map((img, i) => (
            <div
              key={img.src}
              className="cf-fit"
              style={f ? { width: f.widths[i], height: f.h } : undefined}
            >
              <ZoomableImage
                src={img.src}
                alt={captions[i] ?? captions[0] ?? s.label}
                aspectRatio={boxAR}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // A lone image needs no strip and no counter.
  if (shots.length === 1) {
    return (
      <div className={`cf-measure${side ? " cf-measure--row" : ""}`} ref={wrapRef}>
        {side && <div className="cf-side">{side}</div>}
        {/* a single picture sits on the right, leaving the left for the writing beside it */}
        <div className="cf cf--single" style={boxW ? { width: boxW } : undefined}>
          {cell(shots[0])}
          <p className="case-strip__cap">{shots[0].label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cf-measure${side ? " cf-measure--row" : ""}`} ref={wrapRef}>
    {side && <div className="cf-side">{side}</div>}
    <div
      className="cf"
      style={boxW ? { width: boxW } : undefined}
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

      <div className="case-strip" role="tablist" aria-label={`${label} frames`}>
        {shots.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            className="case-strip__tab"
            data-on={i === active || undefined}
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            {/* Decorative: the label below is the accessible name. */}
            <img src={imagesOf(s)[0].src} alt="" loading="lazy" />
            <span className="case-strip__label">{s.label}</span>
          </button>
        ))}
      </div>

      <p className="case-strip__cap" aria-live="polite">
        <strong>
          {active + 1} / {shots.length}
        </strong>{" "}
        · {shots[active].label}
      </p>
    </div>
    </div>
  );
}
