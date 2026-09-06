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
 *
 * Why NOT document.referrer (previous approach, now removed):
 * this site navigates between "/" and "/projects/*" as an SPA — Link
 * clicks are pushState navigations, not full page loads. document.referrer
 * is a browser/HTTP concept that only reflects the referrer of the
 * original hard navigation into the tab; it does NOT update when the
 * route changes via the History API. So "was the previous route a case
 * study" was always false for the actual back-navigation path this is
 * meant to handle, and the restore silently never ran — every "back"
 * fell through to the fresh-visit branch and snapped to the hero.
 * The saved sessionStorage key is written ONLY by saveHomeScroll(), which
 * only ever runs from a project folder's onClick. So the key's mere
 * presence is already proof the visitor is returning from a case study —
 * no referrer check needed. It's consumed (removed) immediately after a
 * successful restore so a later plain refresh of "/" doesn't replay it.
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

    const clearHash = () => {
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };

    const saved = sessionStorage.getItem(KEY);
    const y = saved !== null ? parseInt(saved, 10) : NaN;

    if (saved === null || Number.isNaN(y)) {
      /* No saved position — fresh visit, external referrer, new tab, or
         a position already consumed by an earlier restore. Force hero,
         clear any stale hash. */
      clearHash();
      const goTop = () => window.scrollTo(0, 0);
      goTop();
      const rafTop = requestAnimationFrame(goTop);
      const tTop = window.setTimeout(goTop, 90);
      return () => {
        cancelAnimationFrame(rafTop);
        window.clearTimeout(tTop);
      };
    }

    /* Returning from a case study — restore the saved scroll position
       so the visitor lands right back on the folder they clicked. Consume
       the key right away so a later plain refresh of "/" (no new project
       click in between) doesn't replay a stale position. */
    sessionStorage.removeItem(KEY);

    // Three-pass restore handles layout settle (paint → Lenis init →
    // sticky scene height).
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
