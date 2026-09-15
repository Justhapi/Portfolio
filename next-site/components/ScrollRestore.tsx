"use client";

import { useEffect } from "react";
import { getLenis } from "@/components/lenisInstance";

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
 * Why it re-applies on a frame loop rather than a few fixed timers:
 * two things were defeating the old three-pass approach.
 *
 * 1. Lenis owns the scroll position. Every frame it writes its own
 *    interpolated value to the window, so a bare `window.scrollTo`
 *    issued behind its back was silently reverted on the next frame.
 *    The restore now goes through the live Lenis instance when there is
 *    one (see lenisInstance.ts), which is the only way to move the page
 *    without being overwritten.
 *
 * 2. The page is still growing when the restore fires. Fonts, the
 *    project folder art and the `.ac-scene` sticky height (computed in
 *    SmoothScroll.tsx) all land after mount, and `scrollTo` clamps to
 *    whatever the document height is at that instant — so an early
 *    restore to a deep position silently lands short. Retrying each
 *    frame until the target is actually reached rides the page's growth
 *    instead of guessing when it stops.
 *
 * The loop gives up after RESTORE_TIMEOUT_MS, and aborts immediately if
 * the visitor scrolls, so it can never fight a real input.
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
/** How long to keep re-applying while the page settles. */
const RESTORE_TIMEOUT_MS = 1200;
/** Frames the position must hold before we stop watching. */
const SETTLED_FRAMES = 3;

/* React Strict Mode double-invokes effects in development: mount →
   cleanup → mount. The first pass consumed the sessionStorage key, so
   the second pass found nothing and fell through to the force-to-hero
   branch below — which is why every return from a case study landed at
   the top no matter what the restore itself did. Remembering the value
   in module scope for a moment makes the read idempotent across that
   double-invoke. The window is short so a genuine later visit can't
   pick up a stale position, and module state dies with the tab. */
const REMEMBER_MS = 2000;
let recentlyRead: { y: number; at: number } | null = null;

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

    /* Consume the key on the first read, but remember it briefly so a
       Strict Mode re-invocation resolves to the same position instead
       of looking like a fresh visit. */
    let y = NaN;
    const saved = sessionStorage.getItem(KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed)) {
        y = parsed;
        sessionStorage.removeItem(KEY);
        recentlyRead = { y, at: Date.now() };
      }
    } else if (recentlyRead && Date.now() - recentlyRead.at < REMEMBER_MS) {
      y = recentlyRead.y;
    }

    if (Number.isNaN(y)) {
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

    /* Returning from a case study — restore the saved position so the
       visitor lands right back on the folder they clicked. */
    let raf = 0;
    let cancelled = false;
    const started = performance.now();

    /** Aborts the loop the moment the visitor takes over. */
    const abort = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      detach();
    };
    const detach = () => {
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchstart", abort);
      window.removeEventListener("keydown", abort);
    };
    window.addEventListener("wheel", abort, { passive: true, once: true });
    window.addEventListener("touchstart", abort, { passive: true, once: true });
    window.addEventListener("keydown", abort, { once: true });

    /* Consecutive frames on target before we trust it. One frame isn't
       enough: the page can still grow right after we land, which would
       leave the position stale with nothing watching. */
    let settled = 0;

    const tick = () => {
      if (cancelled) return;

      const lenis = getLenis();
      if (lenis) {
        // immediate + force: jump with no easing, and do it even if
        // Lenis currently considers itself stopped.
        lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }

      settled = Math.abs(window.scrollY - y) <= 2 ? settled + 1 : 0;

      if (settled >= SETTLED_FRAMES || performance.now() - started > RESTORE_TIMEOUT_MS) {
        detach();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      detach();
    };
  }, []);

  return null;
}
