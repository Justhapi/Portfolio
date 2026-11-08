"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ResearchCarousel — infinite-loop swipeable carousel with SMOOTH wrap
 * transitions (no snap on last→first or first→last).
 *
 * The wrap smoothness uses PHANTOM slides — the track is extended with
 *   [duplicate-of-last, ...slides, duplicate-of-first]
 * so when the user advances past the last real slide the animation
 * continues onto a phantom copy of the first slide. Immediately after
 * the transition ends, the track silently resets to the real first
 * slide (transition suppressed just for the reset frame). The reader
 * sees an uninterrupted forward scroll; the "jump" is invisible.
 * Same mechanism handles first→last in reverse.
 *
 * Interactions (all trigger the same advance/retreat behavior):
 *   - Touch swipe (mobile / tablet)
 *   - Mouse click-and-drag (desktop with mouse)
 *   - Trackpad two-finger horizontal swipe (desktop trackpad)
 *   - Click the prev/next nav link (names the adjacent slide directly)
 *   - Keyboard arrows navigate when focus is inside the carousel
 *
 * Nav — replaced the original small dot row (feedback: "did not
 * realize it was a slideshow because the buttons were small and out
 * of the way") with a centered prev/next text link above the track,
 * naming the actual adjacent slide instead of an abstract symbol.
 *
 * Infinite wrap only kicks in at 3+ slides. With exactly 2, "wrapping"
 * means prev and next both resolve to the same other slide — the nav
 * would show that slide's name mirrored on both sides at once, which
 * reads as a glitch, not a feature. So 2-slide carousels clamp instead
 * (prev hidden on the first slide, next hidden on the last) and only
 * 3+ slide carousels get the true infinite loop with both links always
 * present.
 */

type Slide = {
  key: string;
  content: React.ReactNode;
  /** Short plain-text name shown under the strip's tab (e.g.
   *  "Secondary Research"). Kept separate from `content` since content
   *  is often rich JSX and the tab needs plain text. */
  label: string;
  /** Image src for the tab's thumbnail — the same visual the slide
   *  shows. `content` is an opaque ReactNode, so the component can't
   *  find it on its own; the page passes it. Without one the tab falls
   *  back to its label alone. */
  thumb?: string;
};

type Props = {
  slides: Slide[];
  title?: string;
};

const SWIPE_THRESHOLD = 60;   // px — min horizontal drag to trigger slide change
const TRANSITION_MS = 380;    // must match the CSS transition duration on .rc-track

export default function ResearchCarousel({ slides, title }: Props) {
  const total = slides.length;
  // Only 3+ slides get the phantom-based infinite wrap — see the
  // "Infinite wrap" note above for why exactly 2 clamps instead.
  const hasPhantoms = total > 2;

  // Extended track:  [phantomLast, ...slides, phantomFirst]
  // Real slide N lives at track index N + 1 (offset by the prepended phantom).
  const trackSlides = hasPhantoms
    ? [
        { key: `${slides[total - 1].key}__phantomStart`, content: slides[total - 1].content, label: "" },
        ...slides,
        { key: `${slides[0].key}__phantomEnd`, content: slides[0].content, label: "" },
      ]
    : slides;

  // Start at track index 1 = the real first slide (skips the leading phantomLast).
  const initialTrackIdx = hasPhantoms ? 1 : 0;
  const [trackIdx, setTrackIdx] = useState(initialTrackIdx);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [suppressTransition, setSuppressTransition] = useState(false);

  // Derive the real slide index (for the dot indicator) from the track position.
  //   trackIdx 0                = phantomLast     → real (total - 1)
  //   trackIdx 1 to total       = real 0 to (total - 1)
  //   trackIdx (total + 1)      = phantomFirst    → real 0
  const realIndex = hasPhantoms
    ? ((trackIdx - 1 + total) % total)
    : trackIdx;

  const dragStartXRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  // Timer for the phantom → real silent-reset; cleared on unmount so
  // React doesn't warn about setState on an unmounted component.
  const resetTimerRef = useRef<number | null>(null);

  // Move to a specific track position, animating smoothly. If the move
  // lands on a phantom slide, schedule a silent (transition-suppressed)
  // reset to that phantom's real counterpart AFTER the animation ends.
  const goToTrack = useCallback(
    (targetTrackIdx: number) => {
      setTrackIdx(targetTrackIdx);
      if (!hasPhantoms) return;

      // Clear any pending reset from a previous phantom landing so we
      // never fire two resets in quick succession.
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      if (targetTrackIdx === 0) {
        // Landed on phantomLast (track index 0). Silently jump to the
        // real last slide (track index `total`) after the transition.
        resetTimerRef.current = window.setTimeout(() => {
          setSuppressTransition(true);
          setTrackIdx(total);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setSuppressTransition(false));
          });
          resetTimerRef.current = null;
        }, TRANSITION_MS + 20);
      } else if (targetTrackIdx === total + 1) {
        // Landed on phantomFirst (track index total+1). Silently jump
        // to the real first slide (track index 1) after the transition.
        resetTimerRef.current = window.setTimeout(() => {
          setSuppressTransition(true);
          setTrackIdx(1);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setSuppressTransition(false));
          });
          resetTimerRef.current = null;
        }, TRANSITION_MS + 20);
      }
    },
    [total, hasPhantoms],
  );

  // Cleanup pending reset timer on unmount.
  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const advance = useCallback(() => {
    if (!hasPhantoms) {
      // No wrap at 2 slides — clamp at the last one instead of no-op,
      // so the (single) next link still works.
      setTrackIdx((i) => Math.min(i + 1, total - 1));
      return;
    }
    // If we're currently on a phantom, don't advance further — wait
    // for the pending silent-reset to complete first. This guards
    // against rapid double-triggers pushing us off the extended track.
    if (trackIdx === 0 || trackIdx === total + 1) return;
    goToTrack(trackIdx + 1);
  }, [trackIdx, goToTrack, hasPhantoms, total]);

  const retreat = useCallback(() => {
    if (!hasPhantoms) {
      setTrackIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (trackIdx === 0 || trackIdx === total + 1) return;
    goToTrack(trackIdx - 1);
  }, [trackIdx, goToTrack, hasPhantoms, total]);

  /** Jump to a real slide index — what the strip's tabs call. */
  const goToReal = useCallback(
    (realIdx: number) => goToTrack(hasPhantoms ? realIdx + 1 : realIdx),
    [goToTrack, hasPhantoms],
  );

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      retreat();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      advance();
    }
  };

  // ── Unified Pointer handlers (mouse + touch + pen) ───────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragStartXRef.current = e.clientX;
    activePointerIdRef.current = e.pointerId;
    setIsDragging(true);
    setDragOffsetPx(0);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* some browsers throw on invalid pointer id — ignore */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return;
    if (e.pointerId !== activePointerIdRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    setDragOffsetPx(delta);
  };

  const finishDrag = useCallback(
    (releaseDelta: number) => {
      dragStartXRef.current = null;
      activePointerIdRef.current = null;
      setDragOffsetPx(0);
      setIsDragging(false);
      if (Math.abs(releaseDelta) < SWIPE_THRESHOLD) return;
      if (releaseDelta > 0) retreat();
      else advance();
    },
    [retreat, advance],
  );

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerIdRef.current) return;
    const delta = dragStartXRef.current !== null ? e.clientX - dragStartXRef.current : 0;
    finishDrag(delta);
  };
  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerIdRef.current) return;
    finishDrag(0);
  };

  /*
   * No wheel handler. The previous one preventDefault()ed any
   * horizontal-dominant wheel event, and a Mac trackpad emits those
   * constantly on a diagonal flick — so scrolling past a carousel could
   * advance it instead of scrolling the page. Drag, the strip and the
   * arrow keys are enough to move it.
   */

  // Compute the live track transform. During drag, the track follows
  // the pointer for immediate visual feedback. On release, dragOffset
  // resets to 0 and the CSS transition animates to the new trackIdx.
  const viewportWidth = viewportRef.current?.clientWidth ?? 1;
  const dragPercent = (dragOffsetPx / viewportWidth) * 100;
  const trackTransform = `translateX(calc(-${trackIdx * 100}% + ${dragPercent.toFixed(2)}%))`;

  return (
    <div
      className="research-carousel"
      onKeyDown={handleKey}
      role="region"
      aria-roledescription="carousel"
      aria-label={title ?? "Research activities carousel"}
    >
      <header className="rc-header">
        {title && <h4 className="rc-title">{title}</h4>}
      </header>

      <div
        ref={viewportRef}
        className={`rc-viewport${isDragging ? " is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={`rc-track${suppressTransition || isDragging ? " is-jumping" : ""}`}
          style={{ transform: trackTransform }}
        >
          {trackSlides.map((s, i) => (
            <div
              key={s.key}
              className={`rc-slide${i === trackIdx ? " is-active" : ""}`}
              aria-roledescription="slide"
              /* Count real slides only — the extended track carries two
                 phantoms, and announcing "3 of 7" for a 5-slide carousel
                 is just wrong. */
              aria-label={`Slide ${
                (hasPhantoms ? (i - 1 + total) % total : i) + 1
              } of ${total}`}
              // Phantom slides shouldn't be announced to screen readers
              // (they'd read as duplicates of real slides).
              aria-hidden={
                hasPhantoms && (i === 0 || i === trackSlides.length - 1) ? "true" : undefined
              }
            >
              {s.content}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <div
            className={`case-strip${
              slides.some((s) => s.thumb) ? "" : " case-strip--text"
            }`}
            role="tablist"
            aria-label={`${title ?? "Slides"} list`}
          >
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                className="case-strip__tab"
                data-on={i === realIndex || undefined}
                aria-selected={i === realIndex}
                onClick={() => goToReal(i)}
              >
                {/* Decorative: the label below is the accessible name. */}
                {s.thumb && <img src={s.thumb} alt="" loading="lazy" />}
                <span className="case-strip__label">{s.label}</span>
              </button>
            ))}
          </div>
          <p className="case-strip__cap" aria-live="polite">
            <strong>
              {realIndex + 1} / {total}
            </strong>{" "}
            · {slides[realIndex].label}
          </p>
        </>
      )}
    </div>
  );
}
