"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — global Lenis smooth-scroll + parallax.
 *
 * Smooth scroll: Lenis intercepts native scroll events and interpolates
 * the page position, giving a momentum/inertia feel with configurable
 * duration and easing. This makes the page feel like you need to scroll
 * "more strongly" while the movement itself glides.
 *
 * Parallax: A small set of decorative elements drift at different speeds
 * relative to scroll, creating depth. We target:
 *   .hero-sparkles          speed −0.14  (fastest drift — background)
 *   .sticker.name-yellow    speed −0.08  (preserves rotate(8deg) base)
 *   .chip-zh                speed −0.06  (preserves rotate(−6deg) base)
 *   .sticker.designing-green speed −0.11  (preserves rotate(−5deg) base)
 *   .hero-polaroid          speed −0.05  (special centred-transform handling)
 *   .case-hero-image        speed −0.08  (project cover image)
 *
 * Entrance animation fill-mode lock:
 *   CSS `animation: ... both` keeps elements at their final keyframe,
 *   which sits above author-rule CSS in the cascade. We must clear
 *   `el.style.animation` (removing the fill lock) before inline parallax
 *   transforms take effect. We wait 2 400 ms so all entrance animations
 *   have fully completed before touching their styles.
 *
 * Skip conditions:
 *   - prefers-reduced-motion: Lenis is skipped entirely; no parallax.
 *   - Touch / coarse-pointer devices: parallax only (Lenis still runs).
 */

type ParallaxConfig = {
  selector: string;
  speed: number;
  /** CSS rotate to preserve after clearing the entrance animation. */
  baseRotate?: string;
  /**
   * If true the element uses `translate(-50%, -50%)` centering and we must
   * compose the parallax offset inside that transform chain.
   */
  centred?: boolean;
  /**
   * If true the element uses `translateX(-50%)` horizontal centering only
   * (no vertical centering). We prepend it so the parallax Y offset doesn't
   * knock the element off-centre.
   */
  centredX?: boolean;
};

const PARALLAX_TARGETS: ParallaxConfig[] = [
  // Whole wordmark block (heading + subtitle) drifts upward as the
  // work section approaches — the title "retreats" behind the rising card.
  // centredX: true preserves the translateX(-50%) CSS centering.
  { selector: ".ribbon-artist", speed: -0.13, centredX: true },
  { selector: ".sticker.name-yellow", speed: -0.18, baseRotate: "8deg" },
  { selector: ".chip-zh", speed: -0.14, baseRotate: "-6deg" },
  { selector: ".sticker.designing-green", speed: -0.22, baseRotate: "-5deg" },
  { selector: ".hero-polaroid", speed: -0.12, centred: true },
  { selector: ".case-hero-image", speed: -0.18 },
];

/** Delay after page load before parallax transforms activate (ms). */
const PARALLAX_ACTIVATE_DELAY = 2400;

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ── Lenis initialisation ──────────────────────────────────────────── */
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* ── Parallax ──────────────────────────────────────────────────────── */
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    // Skip parallax on touch — scroll behaviour already differs
    if (isTouchDevice) {
      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }

    type ParallaxEntry = {
      el: HTMLElement;
      config: ParallaxConfig;
      /** Scroll-Y at the moment the element's rect was last measured. */
      originY: number;
    };
    let entries: ParallaxEntry[] = [];

    function buildEntries() {
      entries = [];
      for (const cfg of PARALLAX_TARGETS) {
        const nodes = document.querySelectorAll<HTMLElement>(cfg.selector);
        nodes.forEach((el) => {
          // Remove animation fill lock so inline transforms can take effect
          el.style.animation = "none";

          const rect = el.getBoundingClientRect();
          const originY = window.scrollY + rect.top + rect.height / 2;
          entries.push({ el, config: cfg, originY });
        });
      }
    }

    // Wait for all entrance animations to complete before activating parallax
    const activateTimer = setTimeout(buildEntries, PARALLAX_ACTIVATE_DELAY);

    function onScroll({ scroll }: { scroll: number }) {
      for (const { el, config, originY } of entries) {
        const delta = (scroll - 0) * config.speed;

        if (config.centred) {
          // .hero-polaroid uses translate(-50%,-50%) for centering —
          // compose parallax offset as additional translateY
          el.style.transform = `translate(-50%, calc(-50% + ${delta.toFixed(2)}px)) rotate(-2deg)`;
        } else if (config.centredX) {
          // Element uses translateX(-50%) horizontal centering only —
          // preserve it while adding the parallax Y offset.
          el.style.transform = `translateX(-50%) translateY(${delta.toFixed(2)}px)`;
        } else if (config.baseRotate) {
          el.style.transform = `translateY(${delta.toFixed(2)}px) rotate(${config.baseRotate})`;
        } else {
          el.style.transform = `translateY(${delta.toFixed(2)}px)`;
        }
      }
    }

    lenis.on("scroll", onScroll);

    // Re-measure on resize (layout may shift)
    const onResize = () => {
      if (entries.length) buildEntries();
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(activateTimer);
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      window.removeEventListener("resize", onResize);
      // Restore elements
      for (const { el } of entries) {
        el.style.transform = "";
        el.style.animation = "";
      }
    };
  }, []);

  return null;
}
