"use client";

import { useEffect } from "react";
import {
  watchScrollVelocity,
  getScrollVelocity,
  survivableScrollVh,
} from "@/components/scrollVelocity";

/**
 * Adds the "in" class to .reveal and .reveal-stagger elements when they enter
 * the viewport, triggering the CSS opacity/translate animations defined in
 * globals.css. Mounts once at the page root.
 *
 * These transitions are 800ms — longer than the case pages' — and the
 * staggered variant adds up to 400ms on top. That is a lot to ask of
 * someone skimming, so as on case pages anything arriving faster than the
 * animation can survive is marked `.reveal--instant` and appears at once.
 * See scrollVelocity.ts.
 */
/** Matches .reveal / .reveal-stagger in globals.css. */
const REVEAL_MS = 800;
/** Largest nth-child stagger delay on .reveal-stagger. */
const MAX_DELAY_MS = 400;
const TRIGGER_AHEAD_VH = 0.12;

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

    watchScrollVelocity();
    const fastThreshold = survivableScrollVh(
      MAX_DELAY_MS + REVEAL_MS,
      TRIGGER_AHEAD_VH
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (getScrollVelocity() > fastThreshold) {
              e.target.classList.add("reveal--instant");
            }
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      /* Was "-10% 0px", which held elements back until they were a tenth
         of the way into the viewport — time this animation cannot spare.
         Now triggered just before they enter instead. */
      { rootMargin: `0px 0px ${TRIGGER_AHEAD_VH * 100}% 0px`, threshold: 0.05 },
    );

    // Exclude connect's children — already handled above
    targets.forEach((t) => {
      if (!connectSection?.contains(t)) io.observe(t);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
