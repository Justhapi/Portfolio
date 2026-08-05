"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ResearchCarousel — infinite-loop swipeable carousel styled to match
 * the UsabilityRound pattern (header with title + progress dots on the
 * right, no arrow buttons).
 *
 * Interactions (all trigger the same advance/retreat behavior):
 *   - Touch swipe (mobile / tablet)
 *   - Mouse click-and-drag (desktop with mouse)
 *   - Trackpad two-finger horizontal swipe (desktop trackpad)
 *   - Click a progress dot to jump to a specific slide
 *   - Keyboard arrows navigate when focus is inside the carousel
 *   - Infinite wrap: swiping past the last slide loops to the first
 *
 * Implementation uses unified Pointer Events (fire for mouse + touch +
 * pen) with pointer capture, plus a separate wheel listener for
 * trackpad horizontal gestures. The track visibly follows the pointer
 * during drag for immediate feedback that the interaction is working.
 */

type Slide = {
  key: string;
  content: React.ReactNode;
};

type Props = {
  slides: Slide[];
  title?: string;
};

const SWIPE_THRESHOLD = 60;  // px — min horizontal drag to trigger slide change
const WHEEL_THRESHOLD = 60;  // px — accumulated horizontal wheel delta to advance
const WHEEL_LOCK_MS = 400;   // brief cooldown after a wheel-triggered advance

export default function ResearchCarousel({ slides, title }: Props) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [suppressTransition, setSuppressTransition] = useState(false);

  const dragStartXRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelLockRef = useRef(false);

  const goTo = useCallback(
    (targetIndex: number) => {
      const wrapped = ((targetIndex % total) + total) % total;
      const isWrap = targetIndex < 0 || targetIndex >= total;
      if (isWrap) {
        setSuppressTransition(true);
        setIndex(wrapped);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setSuppressTransition(false));
        });
      } else {
        setIndex(wrapped);
      }
    },
    [total],
  );

  const advance = useCallback(() => goTo(index + 1), [goTo, index]);
  const retreat = useCallback(() => goTo(index - 1), [goTo, index]);

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
    // Only start drag on primary button / primary touch
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragStartXRef.current = e.clientX;
    activePointerIdRef.current = e.pointerId;
    setIsDragging(true);
    setDragOffsetPx(0);
    // Capture the pointer so we keep receiving events even if it
    // leaves the viewport.
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

  // Trackpad two-finger horizontal swipe. Attached natively (not as a
  // React onWheel) because React binds `wheel` as passive by default,
  // which forbids preventDefault. We ONLY preventDefault on
  // horizontal-dominant wheel events; vertical events pass through
  // unchanged so Lenis handles page scroll normally.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical → let Lenis handle
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

  // Compute the live track transform. During drag, the track offset
  // follows the pointer for immediate visual feedback. On release the
  // dragOffset resets to 0 and the CSS transition snaps to the new
  // index.
  const viewportWidth = viewportRef.current?.clientWidth ?? 1;
  const dragPercent = (dragOffsetPx / viewportWidth) * 100;
  const trackTransform = `translateX(calc(-${index * 100}% + ${dragPercent.toFixed(2)}%))`;

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
                className={`rc-dot${i === index ? " is-active" : ""}`}
                aria-label={`Show activity ${i + 1} of ${total}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
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
          {slides.map((s, i) => (
            <div
              key={s.key}
              className={`rc-slide${i === index ? " is-active" : ""}`}
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}
            >
              {s.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
