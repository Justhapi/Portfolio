import type Lenis from "lenis";

/**
 * The live Lenis instance, shared across components.
 *
 * Lenis owns the scroll position: every frame it writes its own
 * interpolated value to the window. Anything that calls
 * `window.scrollTo` behind its back gets silently overwritten on the
 * next frame, which is why scroll restoration has to go THROUGH Lenis
 * rather than around it.
 *
 * SmoothScroll registers the instance on mount and clears it on
 * teardown (it rebuilds per route). Consumers must handle null: Lenis
 * is skipped entirely under prefers-reduced-motion, and there's a
 * window between route change and re-init where nothing is registered.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}
