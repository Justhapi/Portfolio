/**
 * scrollVelocity — a shared, smoothed read of how fast the page is moving.
 *
 * Why this exists: the site's entrance animations are staged (a heading
 * settles, then its body copy follows), and that staging takes time the
 * reader has to be willing to spend. A recruiter session recording showed
 * someone flick-scrolling a case study at 1.7-2.3 viewport-heights per
 * second. The case-body reveal needs up to 1.16s from trigger to fully
 * opaque, so at that pace every element spent its entire time on screen
 * either invisible or half-transparent. They read a whole case study
 * without ever seeing a finished section.
 *
 * So the reveals ask this module how fast things are moving and skip
 * straight to the finished state when the answer is "faster than the
 * animation can survive". Motion should reward someone who slows down;
 * it must never be the reason content isn't there.
 *
 * Velocity is reported in VIEWPORT-HEIGHTS PER SECOND rather than pixels,
 * because that's the unit the decision is actually in: what matters is how
 * much of the screen an element crosses while it's fading, and that's the
 * same judgement on a laptop as on a 5K display.
 */

/** Smoothed speed, in viewport-heights per second. */
let velocity = 0;
let lastY = 0;
let lastT = 0;
let watching = false;

/**
 * Exponential moving average. A single stuttery frame (or one oversized
 * delta after a tab regains focus) shouldn't read as a flick, and equally
 * a genuine flick shouldn't take several frames to register — an even
 * split responds within about two events.
 */
const SMOOTHING = 0.5;

/**
 * How long a reading stays meaningful. Scroll events stop firing when the
 * page stops, and without this the last value would sit there forever —
 * so an element revealed a second after the reader came to rest would
 * still be treated as arriving mid-flick and skip its animation.
 */
const STALE_MS = 140;

function onScroll() {
  const now = performance.now();
  const y = window.scrollY;
  const dt = now - lastT;
  if (lastT && dt > 0) {
    const vh = window.innerHeight || 1;
    const instant = (Math.abs(y - lastY) / vh) * (1000 / dt);
    velocity = velocity * (1 - SMOOTHING) + instant * SMOOTHING;
  }
  lastY = y;
  lastT = now;
}

/**
 * Start tracking. Safe to call from several components — the listener is
 * installed once and deliberately never removed: it's one passive handler
 * doing arithmetic, shared by every reveal on the page, and tearing it
 * down when one component unmounts would break the others.
 */
export function watchScrollVelocity() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  lastY = window.scrollY;
  lastT = performance.now();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/** Current speed in viewport-heights per second; 0 when at rest. */
export function getScrollVelocity(): number {
  if (typeof window === "undefined") return 0;
  if (!lastT || performance.now() - lastT > STALE_MS) return 0;
  return velocity;
}

/**
 * The fastest scroll a staged reveal can survive, in viewport-heights per
 * second, derived from its own timing rather than guessed.
 *
 * An element is triggered `triggerAheadVh` below the fold (the observer's
 * rootMargin), and we want it fully opaque by the time it reaches the
 * middle of the screen — that's where it's actually being read, and
 * anything still fading there reads as missing rather than arriving. So
 * the travel available is (1 + triggerAhead - 0.5) viewport-heights, and
 * the budget is the element's delay plus its transition.
 *
 * HEADROOM shades the threshold downward, biasing borderline cases toward
 * showing content instantly. That asymmetry is deliberate: losing an
 * animation costs a little delight, losing the content costs the reader
 * the page.
 */
const SETTLE_BY_VH = 0.5;
const HEADROOM = 0.85;

export function survivableScrollVh(budgetMs: number, triggerAheadVh: number): number {
  const travelVh = 1 + triggerAheadVh - SETTLE_BY_VH;
  return (travelVh / (budgetMs / 1000)) * HEADROOM;
}
