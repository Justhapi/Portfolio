"use client";

import React, { Children, useEffect, useRef, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";

/**
 * UsabilityRound — round wrapper around an insight-card carousel.
 *
 * Renders the round header (title + meta + progress dots) and a
 * horizontal carousel of insight cards. Only one card is visible at a
 * time via CSS scroll-snap; the progress dots reflect which card is
 * currently centered and let the user click to jump.
 *
 * Implemented as a client component because the active-card index
 * needs to track scroll position on every frame. The cards themselves
 * (children) can be plain server components — see InsightCard below.
 */
export default function UsabilityRound({
  title,
  meta,
  focus,
  findings,
  children,
}: {
  title: string;
  meta: string;
  /** Round-focus paragraph — shown BELOW the round header (title +
   *  meta) and ABOVE the insight-card carousel. Names what this round
   *  was deliberately testing. */
  focus?: React.ReactNode;
  /** Findings-only mode — when no insight-card children are passed,
   *  this content renders in place of the carousel. Used for rounds
   *  that produced observations but no prototype iterations (e.g. a
   *  final validation round where findings went straight into the
   *  deliverable). The round header + focus paragraph render exactly
   *  the same, keeping the section visually consistent with the other
   *  rounds. */
  findings?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const total = Children.count(children);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track which card is centered in the carousel viewport as the user
  // scrolls. Cards are full-width with mandatory snap, so "centered"
  // collapses to "the one whose left edge is closest to the scrollLeft."
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const update = () => {
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let closest = 0;
      let bestDist = Infinity;
      Array.from(carousel.children).forEach((child, i) => {
        if (!(child instanceof HTMLElement)) return;
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < bestDist) {
          bestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };
    update();
    carousel.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      carousel.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [total]);

  const scrollToCard = (idx: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const child = carousel.children[idx];
    if (!(child instanceof HTMLElement)) return;
    carousel.scrollTo({
      left: child.offsetLeft - 4 /* account for ur-insight-cards padding */,
      behavior: "smooth",
    });
  };

  return (
    <section className="ur-round-block">
      {/* Round header — title + meta only. Dots have moved DOWN into
          the carousel wrapper below so they sit at the top-right of
          the actual card viewport. */}
      <header className="ur-round-header">
        <h4>{title}</h4>
        <p>{meta}</p>
      </header>
      {focus && <p className="ur-round-focus">{focus}</p>}
      {total > 0 ? (
        <div className="ur-carousel-wrapper">
          {total > 1 && (
            <nav className="ur-progress" aria-label={`${title} insight progress`}>
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`ur-dot ${i === activeIndex ? "is-active" : ""}`}
                  aria-label={`Show insight ${i + 1} of ${total}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => scrollToCard(i)}
                />
              ))}
            </nav>
          )}
          <div className="ur-insight-cards" ref={carouselRef}>
            {children}
          </div>
        </div>
      ) : findings ? (
        <div className="ur-round-findings">{findings}</div>
      ) : null}
    </section>
  );
}

/**
 * InsightCard — single card in the round's carousel.
 *
 * Two visual modes:
 *   1. Text-thumb pair (legacy) — pass `originalLabel` + `iteratedLabel`
 *      and the card renders two side-by-side placeholder thumbs for a
 *      before/after comparison authored elsewhere.
 *   2. Single combined image — pass `imageSrc` (+ `imageAlt`,
 *      `imageAspectRatio`, optional `imageCaption`) when the image
 *      already contains the before + after side-by-side, so a single
 *      visual slot is more appropriate than two half-width thumbs.
 *
 * When `imageSrc` is provided, the two `*Label` props are ignored.
 */
export function InsightCard({
  insight,
  change,
  originalLabel,
  iteratedLabel,
  iteratedCaption = "Iterated",
  imageSrc,
  imageAlt,
  imageAspectRatio,
  imageCaption,
}: {
  insight: string;
  change: string;
  originalLabel?: string;
  iteratedLabel?: string;
  iteratedCaption?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageAspectRatio?: number;
  imageCaption?: React.ReactNode;
}) {
  const hasImage = Boolean(imageSrc);
  return (
    <article className="ur-insight-card">
      <div className="ur-card-text">
        <p className="ur-card-insight">{insight}</p>
        <p className="ur-card-change">{change}</p>
      </div>
      <div className={`ur-card-visuals${hasImage ? " ur-card-visuals--single" : ""}`}>
        {hasImage ? (
          <figure>
            <ZoomableImage
              src={imageSrc as string}
              alt={imageAlt ?? ""}
              aspectRatio={imageAspectRatio}
              noDrag
              caption={imageCaption}
            />
          </figure>
        ) : (
          <>
            <figure>
              <div className="image-slot ur-thumb">{originalLabel}</div>
              <figcaption>Original</figcaption>
            </figure>
            <figure>
              <div className="image-slot ur-thumb">{iteratedLabel}</div>
              <figcaption>{iteratedCaption}</figcaption>
            </figure>
          </>
        )}
      </div>
    </article>
  );
}
