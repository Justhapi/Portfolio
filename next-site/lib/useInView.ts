"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useInView — fires once when the element enters the viewport.
 *
 * Pattern matches the hero's emmiwu-style cascade reveals: each
 * section component attaches the returned ref to its <section>, and
 * once that section is at least 18% in view, `inView` flips true and
 * the observer disconnects (the reveal plays once, not on every
 * scroll-back).
 *
 * Add `.in-view` to the section className when the flag is true; the
 * section's CSS then animates its children in via transition-delay
 * for a staggered cascade.
 *
 * Reduced-motion is respected at the CSS layer (each section's
 * @media (prefers-reduced-motion: reduce) override sets opacity:1
 * and transform:none on reveal targets).
 */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit & { rootMargin?: string }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Older browsers / SSR fallback — show content immediately.
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView] as const;
}
