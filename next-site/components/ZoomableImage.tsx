"use client";

import { useRef, useState, useCallback, useEffect } from "react";

/**
 * ZoomableImage — click-and-drag to pan, scroll to zoom.
 *
 * Wraps an <img> in a fixed-aspect frame. The image can be:
 *   - dragged with the mouse (pan)
 *   - zoomed with the scroll wheel (zoom is centered on the cursor)
 *   - reset to 1× via the small "reset" button in the corner
 *
 * On touch devices, one-finger drag pans; pinch/spread is left to the
 * browser default (no custom two-touch handler yet — can be added
 * later if usage patterns need it).
 *
 * Zoom is clamped between MIN_SCALE and MAX_SCALE. Pan is clamped so
 * the image can't be dragged completely off the frame — at any zoom
 * level a portion of the image always covers the frame center.
 */

type Props = {
  src: string;
  alt: string;
  /** Optional aspect ratio for the frame (w/h). If omitted, uses 4/3. */
  aspectRatio?: number;
  /** Caption to render below (also used for aria-describedby if provided). */
  caption?: React.ReactNode;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const WHEEL_SENSITIVITY = 0.0018; // higher = zooms faster per wheel tick

export default function ZoomableImage({
  src,
  alt,
  aspectRatio = 4 / 3,
  caption,
}: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // Mirrors of the transform state accessible synchronously inside
  // native event handlers (React state closure is stale after the
  // native listener registers).
  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { txRef.current = tx; }, [tx]);
  useEffect(() => { tyRef.current = ty; }, [ty]);

  // Drag tracking — refs so the mouse-move handler doesn't re-render.
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Clamp translation so at any scale, the image doesn't drift entirely
  // out of the frame. Max offset is (scale - 1) × halfDimension so the
  // image edge lines up with the frame edge at max drag.
  const clampTranslation = useCallback(
    (nx: number, ny: number, s: number) => {
      const frame = frameRef.current;
      if (!frame) return { x: nx, y: ny };
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      const maxX = ((s - 1) * w) / 2;
      const maxY = ((s - 1) * h) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, nx)),
        y: Math.max(-maxY, Math.min(maxY, ny)),
      };
    },
    [],
  );

  // Wheel handler — zoom centered on cursor. Registered as a NATIVE,
   // non-passive listener via useEffect below so preventDefault() can
   // actually stop the page from scrolling (React's default onWheel is
   // passive and preventDefault is a no-op there).
   useEffect(() => {
     const frame = frameRef.current;
     if (!frame) return;
     const onWheel = (e: WheelEvent) => {
       e.preventDefault();
       const rect = frame.getBoundingClientRect();
       // cursor position relative to frame center (in frame-local coords)
       const cx = e.clientX - rect.left - rect.width / 2;
       const cy = e.clientY - rect.top - rect.height / 2;

       const delta = -e.deltaY * WHEEL_SENSITIVITY;
       const factor = Math.exp(delta); // exponential feels smoother than linear
       const currentScale = scaleRef.current;
       const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale * factor));
       if (newScale === currentScale) return;

       // Keep the point under the cursor stationary — solve for new tx/ty:
       // (cursor - t) / s = (cursor - t') / s'  →  t' = cursor - (cursor - t) * s'/s
       const ratio = newScale / currentScale;
       const newTx = cx - (cx - txRef.current) * ratio;
       const newTy = cy - (cy - tyRef.current) * ratio;
       const clamped = clampTranslation(newTx, newTy, newScale);

       scaleRef.current = newScale;
       txRef.current = clamped.x;
       tyRef.current = clamped.y;
       setScale(newScale);
       setTx(clamped.x);
       setTy(clamped.y);
     };
     // passive: false is REQUIRED for preventDefault() to actually stop
     // page scrolling. Without it, the browser assumes the listener won't
     // preventDefault and lets the wheel event scroll the page anyway.
     frame.addEventListener("wheel", onWheel, { passive: false });
     return () => {
       frame.removeEventListener("wheel", onWheel);
     };
   }, [clampTranslation]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only start a drag on primary button
    if (e.button !== 0) return;
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setTx((prevX) => clampTranslation(prevX + dx, 0, scale).x);
    setTy((prevY) => clampTranslation(0, prevY + dy, scale).y);
  };
  const endDrag = () => {
    draggingRef.current = false;
  };

  // Touch drag — single finger only. Pinch-zoom currently uses browser
  // default (nothing custom). Prevent default so page doesn't scroll
  // while dragging within the frame.
  const touchLastRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchLastRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - touchLastRef.current.x;
    const dy = e.touches[0].clientY - touchLastRef.current.y;
    touchLastRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setTx((prevX) => clampTranslation(prevX + dx, 0, scale).x);
    setTy((prevY) => clampTranslation(0, prevY + dy, scale).y);
  };

  const reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  // Global mouseup so the drag ends even if the cursor leaves the frame
  // before button release.
  useEffect(() => {
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  const isZoomed = scale > 1.02 || Math.abs(tx) > 1 || Math.abs(ty) > 1;

  return (
    <div className="zoomable-wrap">
      <div
        ref={frameRef}
        className={`zoomable-frame${draggingRef.current ? " is-dragging" : ""}`}
        style={{ aspectRatio: `${aspectRatio}` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="zoomable-img"
          draggable={false}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          }}
        />
        {/* Hint chip — fades out once user has interacted (any zoom/pan) */}
        <div
          className={`zoomable-hint${isZoomed ? " is-hidden" : ""}`}
          aria-hidden="true"
        >
          drag · scroll to zoom
        </div>
        {/* Reset button — appears only when zoomed/panned */}
        {isZoomed && (
          <button
            type="button"
            className="zoomable-reset"
            onClick={reset}
            aria-label="Reset zoom and position"
          >
            reset
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </div>
  );
}
