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

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return null;
}
