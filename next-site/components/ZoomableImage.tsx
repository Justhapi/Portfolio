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
  /** If true, disables mouse/touch drag-to-pan (wheel zoom, hover
   *  auto-pan, and reset button all still work). Use when nesting
   *  inside a horizontally-swipable parent (e.g. a carousel) so the
   *  parent's drag gesture isn't intercepted by the image. */
  noDrag?: boolean;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const WHEEL_SENSITIVITY = 0.0018; // higher = zooms faster per wheel tick

export default function ZoomableImage({
  src,
  alt,
  aspectRatio = 4 / 3,
  caption,
  noDrag = false,
}: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  // ── Hint visibility ─────────────────────────────────────────────
  // Hint shows only when the cursor is INSIDE the container AND the
  // user hasn't interacted yet. First interaction (wheel, mousedown,
  // touch) hides the hint permanently for this session.
  const [isHovering, setIsHovering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

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
  // Hover-follow auto-pan tracking — cursor position (normalized -1..1)
  // + a requestAnimationFrame handle. Continuous pan runs while the
  // cursor is inside the frame AND the image is zoomed in.
  const cursorRef = useRef({ nx: 0, ny: 0 });
  const hoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);

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
       // Horizontal-dominant wheel = trackpad horizontal gesture. Let
       // it bubble to a parent handler (e.g. a carousel's slide-nav
       // wheel listener) instead of hijacking it for zoom, which only
       // reacts to deltaY anyway. Prevents this component from
       // silently swallowing horizontal trackpad swipes when nested.
       if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
       // First wheel event = interaction; hide the hint permanently.
       setHasInteracted(true);
       // ── Release-to-scroll at min zoom ─────────────────────────────
       // If the image is already at minimum zoom AND the user keeps
       // scrolling in the "zoom-out" direction (deltaY > 0), treat that
       // as intent to scroll the page rather than intent to zoom out
       // further. Scroll the page manually at REDUCED speed so an
       // accidental over-scroll doesn't launch the reader across the
       // page — it acts as a "did you mean to leave the image?" cushion.
       const currentScale = scaleRef.current;
       const atMinZoom = currentScale <= MIN_SCALE + 0.001;
       const wantsToZoomOut = e.deltaY > 0;
       if (atMinZoom && wantsToZoomOut) {
         e.preventDefault();
         e.stopPropagation();
         e.stopImmediatePropagation();
         // Bypass Lenis (data-lenis-prevent on the frame stops Lenis'
         // wheel listener) — scroll the page via native window.scrollBy
         // at 35% of the raw delta.
         const RELEASE_SLOWDOWN = 0.35;
         window.scrollBy({ top: e.deltaY * RELEASE_SLOWDOWN, behavior: "auto" });
         return;
       }

       // Normal zoom path — preventDefault + stopPropagation isolate the
       // event from Lenis (JS smooth-scroll) and browser native scroll.
       e.preventDefault();
       e.stopPropagation();
       e.stopImmediatePropagation();
       const rect = frame.getBoundingClientRect();
       // cursor position relative to frame center (in frame-local coords)
       const cx = e.clientX - rect.left - rect.width / 2;
       const cy = e.clientY - rect.top - rect.height / 2;

       const delta = -e.deltaY * WHEEL_SENSITIVITY;
       const factor = Math.exp(delta); // exponential feels smoother than linear
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
    // noDrag: skip drag initiation entirely so a nesting carousel's
    // horizontal-swipe gesture can consume the mouse event instead.
    // The image can still be zoomed (wheel) and panned (hover auto-pan
    // once zoomed).
    if (noDrag) return;
    // Only start a drag on primary button
    if (e.button !== 0) return;
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setHasInteracted(true);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // ── Explicit drag (mouse button held): 1:1 pan ──────────────────
    if (draggingRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setTx((prevX) => clampTranslation(prevX + dx, 0, scale).x);
      setTy((prevY) => clampTranslation(0, prevY + dy, scale).y);
      return;
    }
    // ── Auto-pan cursor position update ─────────────────────────────
    // Just record where the cursor is (normalized -1..1). The rAF loop
    // reads this and does the actual panning. Splitting mousemove from
    // pan-update lets the pan run at 60fps even when the cursor is
    // stationary near an edge (RTS-style edge scroll).
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    cursorRef.current.nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    cursorRef.current.ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  const endDrag = () => {
    draggingRef.current = false;
  };

  // ── Auto-pan rAF loop ─────────────────────────────────────────────
  // Runs continuously while the cursor is inside the frame AND the
  // image is zoomed in. Pan velocity is proportional to the cursor's
  // distance from center: cursor at center = no movement, cursor at
  // edge = maximum speed. Direction is INVERTED (cursor right → image
  // translates left → view shows more right content).
  useEffect(() => {
    const MAX_SPEED_PX_PER_FRAME = 12; // ~720 px/sec at 60fps at edge
    const DEAD_ZONE = 0.12;            // center ±12% = no movement (prevents jitter)

    const tick = () => {
      if (!hoveringRef.current || draggingRef.current || scaleRef.current <= 1.01) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const { nx, ny } = cursorRef.current;
      // Dead-zone: don't move when cursor is near the center
      const ax = Math.abs(nx) < DEAD_ZONE ? 0 : nx;
      const ay = Math.abs(ny) < DEAD_ZONE ? 0 : ny;
      if (ax === 0 && ay === 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      // Velocity: cubic falloff so the response feels more natural —
      // slow drift near the middle, sharp acceleration near the edges.
      const vx = -Math.sign(ax) * Math.pow(Math.abs(ax), 1.6) * MAX_SPEED_PX_PER_FRAME;
      const vy = -Math.sign(ay) * Math.pow(Math.abs(ay), 1.6) * MAX_SPEED_PX_PER_FRAME;
      const frame = frameRef.current;
      if (!frame) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const maxX = ((scaleRef.current - 1) * frame.clientWidth) / 2;
      const maxY = ((scaleRef.current - 1) * frame.clientHeight) / 2;
      const newTx = Math.max(-maxX, Math.min(maxX, txRef.current + vx));
      const newTy = Math.max(-maxY, Math.min(maxY, tyRef.current + vy));
      // Update refs synchronously so the next frame reads the latest
      // position, then setState to trigger re-render.
      if (newTx !== txRef.current || newTy !== tyRef.current) {
        txRef.current = newTx;
        tyRef.current = newTy;
        setTx(newTx);
        setTy(newTy);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    hoveringRef.current = true;
    setIsHovering(true);
  };
  const handleMouseLeaveForHover = () => {
    hoveringRef.current = false;
    setIsHovering(false);
  };

  // Touch drag — single finger only. Pinch-zoom currently uses browser
  // default (nothing custom). Prevent default so page doesn't scroll
  // while dragging within the frame.
  const touchLastRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // noDrag: skip touch drag so parent-carousel touch swipe still works.
    if (noDrag) return;
    if (e.touches.length !== 1) return;
    touchLastRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setHasInteracted(true);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (noDrag) return;
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
        style={{
          aspectRatio: `${aspectRatio}`,
          /* Pair with .zoomable-frame's max-height: 62vh in CSS.
             For portrait images (aspect < 1), capping height alone
             would leave the frame full-width with letterboxing around
             a narrow image. Setting max-width = maxHeight * aspect
             makes the frame itself shrink to fit the image's natural
             aspect within the height budget — no ugly letterbox bars. */
          maxWidth: `min(100%, calc(62vh * ${aspectRatio}))`,
        }}
        /* data-lenis-prevent: tells the global Lenis smooth-scroll
           library (SmoothScroll.tsx) to ignore any wheel event that
           fires on this frame or its children. Without this, Lenis
           captures wheel events at the window level and animates the
           page scroll via JS — preventDefault alone can't stop that
           because Lenis isn't using the browser's native scroll. */
        data-lenis-prevent
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => { endDrag(); handleMouseLeaveForHover(); }}
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
        {/* Hint chip — only shown while cursor is inside the container AND
            no interaction has happened yet. First wheel/mousedown/touch
            flips hasInteracted permanently and the hint stays gone. */}
        <div
          className={`zoomable-hint${isHovering && !hasInteracted ? "" : " is-hidden"}`}
          aria-hidden="true"
        >
          drag · scroll to zoom
        </div>
        {/* Zoom-out button — appears only when zoomed/panned. Snaps
            back to 1× with position reset. */}
        {isZoomed && (
          <button
            type="button"
            className="zoomable-reset"
            onClick={reset}
            aria-label="Zoom out to 1×"
          >
            zoom out
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </div>
  );
}
