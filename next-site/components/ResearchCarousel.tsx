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
 *   - Click a progress dot to jump to a specific real slide
 *   - Keyboard arrows navigate when focus is inside the carousel
 */

type Slide = {
  key: string;
  content: React.ReactNode;
};

type Props = {
  slides: Slide[];
  title?: string;
};

const SWIPE_THRESHOLD = 60;   // px — min horizontal drag to trigger slide change
const WHEEL_THRESHOLD = 60;   // px — accumulated horizontal wheel delta to advance
const WHEEL_LOCK_MS = 400;    // brief cooldown after a wheel-triggered advance
const TRANSITION_MS = 380;    // must match the CSS transition duration on .rc-track

export default function ResearchCarousel({ slides, title }: Props) {
  const total = slides.length;
  const hasPhantoms = total > 1;

  // Extended track:  [phantomLast, ...slides, phantomFirst]
  // Real slide N lives at track index N + 1 (offset by the prepended phantom).
  const trackSlides = hasPhantoms
    ? [
        { key: `${slides[total - 1].key}__phantomStart`, content: slides[total - 1].content },
        ...slides,
        { key: `${slides[0].key}__phantomEnd`, content: slides[0].content },
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
  const wheelAccumRef = useRef(0);
  const wheelLockRef = useRef(false);
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
    if (!hasPhantoms) return;
    // If we're currently on a phantom, don't advance further — wait
    // for the pending silent-reset to complete first. This guards
    // against rapid double-triggers pushing us off the extended track.
    if (trackIdx === 0 || trackIdx === total + 1) return;
    goToTrack(trackIdx + 1);
  }, [trackIdx, goToTrack, hasPhantoms, total]);

  const retreat = useCallback(() => {
    if (!hasPhantoms) return;
    if (trackIdx === 0 || trackIdx === total + 1) return;
    goToTrack(trackIdx - 1);
  }, [trackIdx, goToTrack, hasPhantoms, total]);

  const goToRealIdx = useCallback(
    (realIdx: number) => {
      if (!hasPhantoms) {
        setTrackIdx(realIdx);
        return;
      }
      // Dot clicks jump straight to the requested real slide without
      // routing through phantoms.
      const clamped = ((realIdx % total) + total) % total;
      setTrackIdx(clamped + 1);
    },
    [total, hasPhantoms],
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

  // Trackpad two-finger horizontal wheel → advance/retreat.
  // Attached natively so preventDefault works (React's onWheel is passive).
  // Only intercepts horizontal-dominant events; vertical scrolls through
  // to Lenis for normal page scroll.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelAccumRef.current += e.deltaX;
      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) return;
      if (wheelAccumRef.current > 0) advance();
      else retreat();
      wheelAccumRef.current = 0;
      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_LOCK_MS);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [advance, retreat]);

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
        {total > 1 && (
          <nav className="rc-progress" aria-label="Select research activity">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className={`rc-dot${i === realIndex ? " is-active" : ""}`}
                aria-label={`Show activity ${i + 1} of ${total}`}
                aria-current={i === realIndex ? "true" : undefined}
                onClick={() => goToRealIdx(i)}
              />
            ))}
          </nav>
        )}
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
              aria-label={`Slide ${i + 1} of ${trackSlides.length}`}
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
    </div>
  );
}
