"use client";

import { useEffect } from "react";
import {
  watchScrollVelocity,
  getScrollVelocity,
  survivableScrollVh,
} from "@/components/scrollVelocity";

/**
 * CaseReveal — scroll-triggered entrance for project page body content.
 *
 * On mount it marks `.case-body` with `data-case-animate="ready"`, activating
 * CSS initial-hidden state. An IntersectionObserver adds `.case-in` to each
 * element when it enters the viewport, triggering the CSS transition.
 *
 * Stagger timing differentiates element type so there is a noticeable pause
 * between section headings and the body copy that follows them:
 *   h2 / h3 : sibIdx × 70 ms  (headings arrive quickly in sequence)
 *   body content : sibIdx × 70 ms + 180 ms  (extra gap after any heading)
 *
 * The .case-disclaimer NDA banner (direct child of .case-body, not inside a
 * .case-section) is also observed and revealed on scroll.
 *
 * No-JS / SSR: data attribute never present server-side → content always
 * visible. prefers-reduced-motion: everything revealed immediately.
 *
 * FAST SCROLL: the stagger above is worth watching only if the reader is
 * moving slowly enough to watch it. A recruiter session recording showed
 * someone covering this page at 1.7-2.3 viewport-heights per second —
 * roughly four times what this timing can survive — and the result was a
 * case study read start to finish without a single section ever finishing
 * its fade. Body copy rendered half-transparent; whole figures never
 * arrived at all. So above the speed the animation can keep up with,
 * elements are marked `.case-instant` and simply appear. See
 * scrollVelocity.ts for where the threshold comes from.
 */
/** Matches the transition duration in globals.css. */
const REVEAL_MS = 560;
/** The largest transition-delay assigned below. */
const MAX_DELAY_MS = 600;
/** rootMargin below the fold, as a fraction of viewport height. */
const TRIGGER_AHEAD_VH = 0.15;

export default function CaseReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.querySelector<HTMLElement>(".case-body");
    if (!body) return;

    // Activate CSS hiding — must come before observe() calls so elements are
    // already at opacity:0 when the first IO callback fires.
    body.dataset.caseAnimate = "ready";

    watchScrollVelocity();
    const fastThreshold = survivableScrollVh(
      MAX_DELAY_MS + REVEAL_MS,
      TRIGGER_AHEAD_VH
    );

    // All section children + any standalone disclaimer banner
    const sectionTargets = Array.from(
      body.querySelectorAll<HTMLElement>(".case-section > *")
    );
    const disclaimers = Array.from(
      body.querySelectorAll<HTMLElement>(".case-disclaimer")
    );
    const allTargets = [...disclaimers, ...sectionTargets];

    if (reduced) {
      allTargets.forEach((el) => el.classList.add("case-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;

          /* Moving faster than the stagger can survive — show it now.
             Checked per element rather than once, because a reader can
             flick past the research boards and then settle to read the
             takeaways, and the takeaways should still animate. */
          if (getScrollVelocity() > fastThreshold) {
            el.classList.add("case-instant", "case-in");
            io.unobserve(el);
            return;
          }

          // Standalone disclaimer — no stagger needed, just reveal
          if (el.classList.contains("case-disclaimer")) {
            el.style.transitionDelay = "0ms";
            el.classList.add("case-in");
            io.unobserve(el);
            return;
          }

          // Section children — stagger by type
          const parent = el.parentElement;
          const siblings = parent ? Array.from(parent.children) : [];
          const sibIdx = siblings.indexOf(el);
          const isHeading = /^H[123]$/.test(el.tagName);

          // Headings: quick sequential appearance
          // Body content: extra 180 ms gap so the heading settles before text arrives
          const delay = isHeading
            ? Math.min(sibIdx * 70, 280)
            : Math.min(sibIdx * 70 + 180, 600);

          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("case-in");
          io.unobserve(el);
        });
      },
      /* Bottom margin expanded so elements are triggered before they
         enter the viewport rather than 4% after — at a normal reading
         pace that hands the stagger an extra ~250ms to finish in, which
         is most of the gap it was losing. Sides/top stay at 0. */
      { rootMargin: `0px 0px ${TRIGGER_AHEAD_VH * 100}% 0px`, threshold: 0.08 }
    );

    allTargets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
