"use client";

import { useEffect } from "react";

/**
 * Adds the "in" class to .reveal and .reveal-stagger elements when they enter
 * the viewport, triggering the CSS opacity/translate animations defined in
 * globals.css. Mounts once at the page root.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (targets.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      targets.forEach((t) => t.classList.add("in"));
      return;
    }

    // .connect is position:sticky at top:0 — its children are technically
    // "in the viewport" from page load, so IntersectionObserver would fire
    // them immediately while they're hidden behind the About section.
    // Pre-mark connect reveals as already .in; the parallax scroll (About
    // sliding off) is the reveal — no additional entrance animation needed.
    const connectSection = document.querySelector(".connect");
    if (connectSection) {
      connectSection.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger").forEach((el) => {
        el.classList.add("in");
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-10% 0px", threshold: 0.05 },
    );

    // Exclude connect's children — already handled above
    targets.forEach((t) => {
      if (!connectSection?.contains(t)) io.observe(t);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
