"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CaseVideo — an inline case-study walkthrough clip in a captioned figure.
 *
 * Distinct from HeroVideo (the case COVER player) in three ways, all of
 * them because these appear two-up in the body rather than one per page:
 *
 *  1. PLAYS ONLY WHILE VISIBLE. Two 1280×720 clips decoding simultaneously
 *     the whole time the page is open is real battery and CPU for footage
 *     nobody is looking at. An IntersectionObserver starts each clip when
 *     it's a third on screen and pauses it when it leaves.
 *
 *  2. IT HAS CONTROLS. The cover video is atmosphere; these are
 *     walkthroughs of a prototype, 20-50s long, and someone evaluating the
 *     work will want to pause or scrub back to a moment. Autoplay gets
 *     them going without a click; controls let them take over.
 *
 *  3. preload="none". The poster carries the still, so nothing hits the
 *     wire until the reader actually reaches this section — which, per the
 *     recruiter session, many never will.
 *
 * Reduced motion: no autoplay and no observer. The poster shows and the
 * controls are there to play it deliberately.
 *
 * MP4/H.264 only, deliberately. These are flat-shaded screen recordings
 * of a wireframe, and at this size VP9 encoded LARGER than H.264 while
 * adding a format whose decode support is patchy (see the note in
 * HeroVideo). One universally-decodable file is both smaller and simpler.
 */
export default function CaseVideo({
  src,
  poster,
  label,
  caption,
}: {
  src: string;
  poster?: string;
  label?: string;
  caption?: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks autoplay (or if the
          // element is torn down mid-promise). Nothing to recover from —
          // the controls are right there.
          void el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <figure className="case-video-fig">
      <div className="case-video-frame">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className="case-video"
          muted
          loop
          playsInline
          controls
          preload="none"
          poster={poster}
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
