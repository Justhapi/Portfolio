"use client";

import { useEffect } from "react";

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
 */
export default function CaseReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.querySelector<HTMLElement>(".case-body");
    if (!body) return;

    // Activate CSS hiding — must come before observe() calls so elements are
    // already at opacity:0 when the first IO callback fires.
    body.dataset.caseAnimate = "ready";

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
      { rootMargin: "-4% 0px", threshold: 0.08 }
    );

    allTargets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
