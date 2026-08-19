"use client";

import { useEffect } from "react";

/**
 * ScrollRestore — return-to-home scroll memory.
 *
 * When a visitor clicks a folder card on the home page, we record their
 * exact scrollY in sessionStorage. When they return (via browser back,
 * case-page "Back to projects" link, or any other navigation back to "/"),
 * this component runs on mount and snaps the page back to that position.
 *
 * Why sessionStorage instead of relying on browser scroll restoration:
 * Next.js auto-restores on browser back, but the "Back to projects" link
 * in CaseSectionNav is a forward Link navigation that doesn't trigger
 * restore. Lenis smooth-scroll also competes with the browser's native
 * restore. Manual save/restore is the only path that works in all cases.
 *
 * Why three scrollTo calls: layout settles in passes — first paint, then
 * Lenis init, then the sticky `.ac-scene` height calculation in
 * SmoothScroll.tsx. A single scrollTo can miss the final layout because
 * the page is still growing. Reapplying after rAF + a 90ms timer covers
 * the settle window without feeling jumpy.
 */

const KEY = "portfolio:home-scroll";

/** Call right before navigating AWAY from the home page. */
export function saveHomeScroll() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, String(window.scrollY));
}

export default function ScrollRestore() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable native scroll restoration so it doesn't fight our manual
    // restore (especially across browser back/forward). We handle it.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const saved = sessionStorage.getItem(KEY);

    // ── No saved position: this is a FRESH visit (first load, refresh,
    // or new tab). Force scroll to top so the hero is the entry point
    // regardless of any stale hash left in the URL from a previous
    // session (e.g. /#work carried over from the "Back to projects"
    // link). Without this, mobile users who ever navigated via a hash
    // land on Projects instead of Hero on their next fresh visit. */
    if (!saved) {
      // Clear any hash so a lingering /#work / /#about doesn't get
      // re-scrolled to by browser hash-nav on subsequent internal links
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      const goTop = () => window.scrollTo(0, 0);
      goTop();
      const rafTop = requestAnimationFrame(goTop);
      const tTop = window.setTimeout(goTop, 90);
      return () => {
        cancelAnimationFrame(rafTop);
        window.clearTimeout(tTop);
      };
    }

    // Do NOT sessionStorage.removeItem here — React strict mode in dev
    // double-invokes useEffect (mount → cleanup → mount). If we remove
    // the saved value on run #1, run #2 sees an empty sessionStorage
    // and falls into the "no saved" branch above, which forces the page
    // to scrollTo(0, 0). Result: user lands on the hero every time.
    // Keeping the value is safe because `saveHomeScroll` overwrites it
    // on every subsequent folder-card click, so it always reflects the
    // most recent scroll position — no stale restore.
    const y = parseInt(saved, 10);
    if (Number.isNaN(y)) return;

    // Three-pass restore handles layout settle (paint → Lenis init →
    // sticky scene height). Cancel hash-based scroll-into-view too —
    // sessionStorage takes precedence over /#work anchor.
    const restore = () => window.scrollTo(0, y);
    restore();
    const raf = requestAnimationFrame(restore);
    const t = window.setTimeout(restore, 90);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
