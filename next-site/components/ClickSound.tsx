"use client";

import { useEffect, useRef } from "react";

/**
 * ClickSound — global mouse-click audio feedback.
 *
 * On mount, listens for every `click` event on the document and plays a
 * short tick sound (/public/sounds/click.wav). Catches:
 *   - Mouse clicks (desktop)
 *   - Touch taps that synthesize click events (mobile)
 *   - Keyboard activations (Enter/Space on focused buttons/links)
 *
 * Why a single audio element with `.cloneNode().play()` per click:
 * If the same Audio element is reused, rapid consecutive clicks cut
 * each other off because `currentTime = 0` interrupts the previous
 * playback. Cloning the element lets each click play to completion
 * even when clicks overlap. The clone is created from the preloaded
 * master Audio so no network fetch happens per click.
 *
 * Accessibility:
 *   - Respects `prefers-reduced-motion: reduce` as a proxy for "I
 *     want less stimulation." Users with that setting get silence.
 *   - Volume capped at 0.07 so the sound reads as a quiet UI tick,
 *     not an alert. Office/coffee-shop friendly.
 *   - `play()` is wrapped in `.catch()` — browser autoplay policies,
 *     missing audio devices, and other AudioContext issues fail
 *     silently rather than throwing.
 *
 * No-JS / SSR: returns null, no DOM rendered, no effect runs.
 */
export default function ClickSound() {
  const masterRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honour the user's motion-reduction preference
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Preload once — the master audio is the source for per-click clones
    const master = new Audio("/sounds/click.wav");
    master.volume = 0.07;
    master.preload = "auto";
    masterRef.current = master;

    function handleClick() {
      const master = masterRef.current;
      if (!master) return;
      // Clone so overlapping clicks each play independently
      const node = master.cloneNode() as HTMLAudioElement;
      node.volume = 0.07;
      node.play().catch(() => {
        /* Silently swallow autoplay / device errors. */
      });
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      masterRef.current = null;
    };
  }, []);

  return null;
}
