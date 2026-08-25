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

    /* Only restore the saved scroll position when the visitor is
       RETURNING FROM A CASE STUDY (referrer starts with the site's own
       origin and includes /projects/). Every other entry — first visit,
       direct URL, external referrer, opening a new tab — snaps to the
       top so the hero is always the first thing seen on a fresh
       arrival. This prevents sessionStorage carryover from ever
       landing a first-time visitor on the projects row. */
    const referrer = document.referrer;
    const origin = window.location.origin;
    const isFromCaseStudy =
      referrer.startsWith(origin) && referrer.includes("/projects/");

    const clearHash = () => {
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };

    if (!isFromCaseStudy) {
      /* Fresh visit / external referrer — force hero, clear any stale
         hash + any stored scroll position. */
      sessionStorage.removeItem(KEY);
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
       so the visitor lands right back on the folder they clicked. */
    const saved = sessionStorage.getItem(KEY);
    if (!saved) return;
    const y = parseInt(saved, 10);
    if (Number.isNaN(y)) return;

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
