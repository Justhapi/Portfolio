"use client";

import { useEffect, useRef, useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";
import type { SideProject } from "@/components/sideProjects";

const Spark = () => (
  <svg className="c-spark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
  </svg>
);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A side project's card: sits still, centred on its star. Hover the belt
 *  and the shot grows up out of its thumbnail into the preview; hover the preview to look closer
 *  (scroll to zoom, drag to pan — same as the case-study images). */
export default function SideCard({ p, style, onEnter, onLeave, cardRef }: {
  p: SideProject;
  style: React.CSSProperties;
  onEnter: () => void;
  onLeave: () => void;
  cardRef: { current: HTMLDivElement | null };
}) {
  const [shown, setShown] = useState<number | null>(null); // index into shots; null = cover
  const [origin, setOrigin] = useState("50% 100%");
  const previewRef = useRef<HTMLDivElement | null>(null);
  const beltRef = useRef<HTMLDivElement | null>(null);

  /* The belt is a real scroller: it drifts on its own, pauses while you're
     on it, and scrolls with the wheel / trackpad (vertical wheel moves it
     sideways) or a swipe. The shots are listed twice, so it wraps at the
     halfway point without a seam. */
  useEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = performance.now(), paused = false, pos = belt.scrollLeft;
    // pos is the true (fractional) position; the belt shows it, wrapped into one copy's width
    const apply = () => {
      const h = belt.scrollWidth / 2;
      if (h > 0) pos = ((pos % h) + h) % h;
      belt.scrollLeft = pos;
    };
    const tick = (t: number) => {
      const dt = Math.min(50, t - last); last = t;
      if (!paused && !still) { pos += dt * 0.028; apply(); }
      raf = requestAnimationFrame(tick);
    };
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!d) return;
      e.preventDefault();
      e.stopPropagation();
      pos += d;
      apply();
    };
    // a swipe (touch) scrolls it natively; pick up where it ended, and wrap
    const onScroll = () => {
      if (Math.abs(belt.scrollLeft - pos) < 1.5) return;
      pos = belt.scrollLeft;
      const h = belt.scrollWidth / 2;
      if (h > 0 && (pos >= h || pos <= 0)) apply();
    };
    const pause = () => { paused = true; };
    const resume = () => { paused = false; last = performance.now(); };
    belt.addEventListener("wheel", onWheel, { passive: false });
    belt.addEventListener("scroll", onScroll, { passive: true });
    belt.addEventListener("pointerenter", pause);
    belt.addEventListener("pointerleave", resume);
    belt.addEventListener("focusin", pause);
    belt.addEventListener("focusout", resume);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      belt.removeEventListener("wheel", onWheel);
      belt.removeEventListener("scroll", onScroll);
      belt.removeEventListener("pointerenter", pause);
      belt.removeEventListener("pointerleave", resume);
      belt.removeEventListener("focusin", pause);
      belt.removeEventListener("focusout", resume);
    };
  }, [p.id]);
  const img = shown == null ? p.cover : p.shots[shown];
  const loop = [...p.shots, ...p.shots]; // twice over, so the belt loops without a seam

  const pick = (i: number, el: HTMLElement) => {
    const k = i % p.shots.length;
    if (k === shown) return;
    const pr = previewRef.current?.getBoundingClientRect(), tr = el.getBoundingClientRect();
    if (pr) setOrigin(`${((tr.left + tr.width / 2 - pr.left) / pr.width) * 100}% ${((tr.top + tr.height / 2 - pr.top) / pr.height) * 100}%`);
    setShown(k);
  };

  return (
    <div
      ref={(el) => { cardRef.current = el; }}
      className="cs-side"
      style={style}
      role="dialog"
      aria-label={p.event ? `${p.name}, ${p.event}` : p.name}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <header className="cs-side__head">
        <div className="cs-side__row">
          <p className="cs-side__name">{p.name}</p>
          <p className="cs-side__role"><Spark />{p.role}</p>
        </div>
        <p className="cs-side__what">
          {p.what}
          {p.credit && (
            <>
              {" · with "}
              <a href={p.credit.href} target="_blank" rel="noopener noreferrer">{p.credit.name}</a>
            </>
          )}
        </p>
        {(p.event || p.award) && (
          <dl className="cs-side__facts">
            {p.event && <div><dt>Event</dt><dd>{p.event}</dd></div>}
            {p.award && <div><dt>Award</dt><dd>{p.award}</dd></div>}
          </dl>
        )}
      </header>

      <div ref={previewRef} className="cs-side__preview" data-lenis-prevent>
        {/* keyed, so each shot gets its own entrance and starts un-zoomed */}
        <div key={img.lg} className="cs-side__zoom" style={reduced() ? undefined : { transformOrigin: origin }}>
          <ZoomableImage src={img.lg} alt={img.alt} aspectRatio={16 / 10} noDrag={false} />
        </div>
      </div>

      <div ref={beltRef} className="cs-side__belt" data-lenis-prevent>
        <div className="cs-side__track">
          {loop.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`cs-side__thumb${shown === i % p.shots.length ? " is-on" : ""}`}
              tabIndex={i < p.shots.length ? 0 : -1}
              aria-hidden={i >= p.shots.length || undefined}
              aria-label={`Show ${s.alt}`}
              onMouseEnter={(e) => pick(i, e.currentTarget)}
              onFocus={(e) => pick(i, e.currentTarget)}
            >
              <img src={s.sm} alt="" draggable={false} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {p.links && p.links.length > 0 && (
        <p className="cs-side__links">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}<span aria-hidden="true"> ↗</span>
            </a>
          ))}
        </p>
      )}
    </div>
  );
}
