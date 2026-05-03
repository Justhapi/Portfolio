"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SiteNav — sticky navigation that lives between Hero and the rest
 * of the site. Behavior:
 *   • Sits in document flow between Hero and ProjectCarousel.
 *   • Once the user scrolls past it, position: sticky pins it to
 *     the top of the viewport.
 *   • Stays sticky through the rest of the page so navigation is
 *     reachable from any section below the hero.
 *   • A scrolled-state class adds a subtle backdrop blur + drop
 *     shadow so the nav reads as elevated only when it's
 *     genuinely sticky (not when it's still in flow).
 *
 * Design — matches the site's warm sketchbook aesthetic. Caveat
 * for the wordmark, Sora for the section links, cream + dark teal
 * palette, no card chrome (just spacing and a hairline rule).
 */

export default function SiteNav() {
  const navRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    /* When the nav's top edge hits the viewport top (i.e., it has
       become sticky), the IntersectionObserver fires with
       intersectionRatio < 1 because the nav's invisible top
       sentinel sits 1px above the nav itself. We use that to
       toggle the elevated state. */
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:-1px;left:0;width:1px;height:1px;pointer-events:none;";
    el.parentElement?.insertBefore(sentinel, el);
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: [1] }
    );
    obs.observe(sentinel);
    return () => {
      obs.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`site-nav${scrolled ? " is-stuck" : ""}`}
      aria-label="Primary"
    >
      <style>{`
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
          background: transparent;
          /* The nav is transparent in flow (sitting between hero
             and projects, blending into the gradient). When stuck,
             .is-stuck adds the surface treatment so it reads as
             a real navbar instead of floating text. */
          transition:
            background-color 0.35s var(--ease-out-expo),
            backdrop-filter 0.35s var(--ease-out-expo),
            box-shadow 0.35s var(--ease-out-expo),
            border-color 0.35s var(--ease-out-expo);
          border-bottom: 1px solid transparent;
        }
        .site-nav.is-stuck {
          background: rgba(15, 18, 22, 0.78);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          backdrop-filter: blur(14px) saturate(140%);
          border-bottom: 1px solid rgba(252, 246, 232, 0.10);
          box-shadow: 0 12px 30px -18px rgba(0, 0, 0, 0.55);
        }

        .nav-row {
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(14px, 1.4vw, 20px) clamp(20px, 4vw, 56px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(16px, 3vw, 40px);
        }

        /* Wordmark — hand-lettered, slightly oversized so it reads
           as a signature rather than a label. */
        .nav-mark {
          font-family: 'Caveat', cursive;
          font-size: clamp(22px, 2vw, 28px);
          font-weight: 700;
          color: var(--cream-white, #fcf6e8);
          letter-spacing: 0.005em;
          line-height: 1;
          text-decoration: none;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          transition: color 0.22s var(--ease-out-expo);
        }
        .nav-mark .nav-mark-dot {
          color: var(--cream, #ffda85);
          font-family: 'Caveat', cursive;
        }
        .nav-mark:hover { color: var(--cream, #ffda85); }

        /* Section links — Sora at small caps for a quiet, refined
           lockup that contrasts the hand-lettered wordmark. */
        .nav-links {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2.4vw, 36px);
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          font-family: 'Sora', system-ui, sans-serif;
          font-size: clamp(13px, 1vw, 14px);
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(252, 246, 232, 0.72);
          text-decoration: none;
          padding: 8px 4px;
          position: relative;
          transition: color 0.22s var(--ease-out-expo);
        }
        @media (hover: hover) {
          .nav-link:hover { color: var(--cream-white, #fcf6e8); }
        }
        /* Animated underline — draws in on hover. */
        .nav-link::after {
          content: "";
          position: absolute;
          left: 4px;
          right: 4px;
          bottom: 2px;
          height: 1.5px;
          background: var(--cream, #ffda85);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.32s var(--ease-out-expo);
        }
        @media (hover: hover) {
          .nav-link:hover::after { transform: scaleX(1); }
        }

        /* Connect — the lone CTA on the right. Cream pill so it
           reads as the primary action without competing visually
           with the section links. */
        .nav-cta {
          font-family: 'Sora', system-ui, sans-serif;
          font-size: clamp(13px, 1vw, 14px);
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--cocoa, #3a2a1f);
          background: var(--cream, #ffda85);
          padding: 9px 18px;
          border-radius: 999px;
          text-decoration: none;
          line-height: 1;
          transition:
            transform 0.22s var(--ease-out-expo),
            background 0.22s var(--ease-out-expo);
        }
        @media (hover: hover) {
          .nav-cta:hover {
            transform: translateY(-1px);
            background: var(--cream-light, #ffe6ac);
          }
        }
        .nav-cta:focus-visible,
        .nav-link:focus-visible,
        .nav-mark:focus-visible {
          outline: 2px solid var(--focus-ring, rgba(255, 218, 133, 0.9));
          outline-offset: 4px;
          border-radius: 6px;
        }

        /* Mobile — collapse the section list, keep wordmark + CTA. */
        @media (max-width: 720px) {
          .nav-row { padding: 12px 18px; gap: 12px; }
          .nav-links { display: none; }
        }
      `}</style>

      <div className="nav-row">
        <a className="nav-mark" href="#hero" aria-label="Kathleen Li — back to top">
          kathleen<span className="nav-mark-dot">.</span>li
        </a>

        <ul className="nav-links">
          <li>
            <a className="nav-link" href="#projects">Projects</a>
          </li>
          <li>
            <a className="nav-link" href="#status-check">Tasks</a>
          </li>
          <li>
            <a className="nav-link" href="#about-me">About</a>
          </li>
        </ul>

        <a className="nav-cta" href="#footer">
          Let&apos;s talk
        </a>
      </div>
    </nav>
  );
}
