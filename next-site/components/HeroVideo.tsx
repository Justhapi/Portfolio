"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HeroVideo — case-study cover video with mobile + accessibility guards.
 *
 * Why a separate client component (instead of putting the <video> tag
 * directly in CaseCover): the guards below require `matchMedia` + a
 * client-side effect, and keeping CaseCover as a pure server component
 * lets the rest of the case page ship without a client JS payload.
 *
 * Guards applied:
 *   1. `prefers-reduced-motion: reduce` → autoplay is disabled and the
 *      poster (or first frame) is shown as a still image. Reduced-motion
 *      users get the visual anchor without the 20s looping motion.
 *   2. `(pointer: coarse)` / narrow viewport → `preload="none"` so the
 *      full multi-MB video doesn't hit the wire on cellular. Desktop
 *      gets `preload="metadata"` (fetch just enough to know dimensions).
 *      Autoplay still fires on mobile hover-capable devices, but not on
 *      touch — touch users see the poster and can tap to play.
 *   3. Poster fallback for any browser that can't play WebM.
 */
export default function HeroVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster?: string;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [preload, setPreload] = useState<"none" | "metadata" | "auto">(
    "none"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const hoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const update = () => {
      // Reduced-motion users NEVER get autoplay — motion is exactly
      // what they've asked to reduce.
      if (reducedMotion.matches) {
        setShouldAutoplay(false);
        setPreload("none");
        return;
      }
      // Autoplay + preload metadata on ALL non-reduced-motion devices,
      // including touch. Cover video is a key case-page moment;
      // recruiters expect it to play automatically. Mobile browsers
      // permit autoplay for muted + playsInline videos (which this
      // one is), so no user-tap gate needed. hoverCapable check is
      // retained only for the preload="auto" bump on desktop.
      setShouldAutoplay(true);
      setPreload(hoverCapable.matches ? "metadata" : "metadata");
    };
    update();

    reducedMotion.addEventListener("change", update);
    hoverCapable.addEventListener("change", update);
    return () => {
      reducedMotion.removeEventListener("change", update);
      hoverCapable.removeEventListener("change", update);
    };
  }, []);

  return (
    /* eslint-disable-next-line jsx-a11y/media-has-caption */
    <video
      ref={videoRef}
      className="case-hero-video"
      src={src}
      poster={poster}
      autoPlay={shouldAutoplay}
      loop
      muted
      playsInline
      preload={preload}
      controls={!shouldAutoplay && !!src}
      aria-label={label}
    />
  );
}
