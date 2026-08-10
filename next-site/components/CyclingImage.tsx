"use client";

import { useEffect, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";

/**
 * CyclingImage — auto-cycling slideshow for showing multiple versions
 * of the same visual in a single container, with the full
 * ZoomableImage interactivity preserved (drag-to-pan, scroll-to-zoom,
 * reset button).
 *
 * Behaviour:
 *   - Rotates through `slides` every `interval` ms (default 3500).
 *     Always cycles — no hover / focus pause. The reader can still
 *     zoom and drag the currently-shown frame; when the interval
 *     ticks, the src is swapped in place and the zoom / pan carries
 *     over (all slides are expected to share aspect ratio).
 *   - Internally renders a single ZoomableImage whose `src` prop
 *     changes with the active slide, so no additional visual chrome
 *     (dots / labels) competes with the ZoomableImage's own
 *     affordances.
 */

type Slide = {
  src: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  /** Aspect ratio (w/h). All slides expected to share this. */
  aspectRatio: number;
  /** Auto-advance interval in ms. Default 3500. Pass 0 to disable. */
  interval?: number;
  caption?: React.ReactNode;
};

export default function CyclingImage({
  slides,
  aspectRatio,
  interval = 3500,
  caption,
}: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!interval || slides.length <= 1) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [interval, slides.length]);

  const current = slides[idx];

  return (
    <div className="cycling-image">
      <ZoomableImage
        src={current.src}
        alt={current.alt}
        aspectRatio={aspectRatio}
        caption={caption}
      />
    </div>
  );
}
