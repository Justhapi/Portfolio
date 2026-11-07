"use client";

import { useEffect, useRef, useState } from "react";
import { COPY, POP_UP, reduced, slap, stop, useCycle } from "./motion";

const TRIPS_WIDE = [1, 2, 3, 4, 5, 6, 10, 12, 15].map((n) => `${POP_UP}/trips/web/${String(n).padStart(2, "0")}.webp`);

/* ══ TRIPS — two windows, each with its own line. Drag a shade down to
   close it, up to open it; it rests 10% down, and on entrance it slides
   further down and back up as a hint. ══ */

const SHADE_MIN = 10; // % of the pane the shade covers at rest

function Window({ photos, rest, offset, dir, bump, hint = false }: { photos: string[]; rest: number; offset: number; dir: "left" | "up"; bump: number; hint?: boolean }) {
  const pane = useRef<HTMLDivElement>(null);
  const shadeEl = useRef<HTMLSpanElement>(null);
  const [shade, setShade] = useState(SHADE_MIN);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ y0: number; s0: number; moved: boolean; swapped: boolean } | null>(null);
  const [hover, setHover] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => setStarted(true), offset); return () => window.clearTimeout(id); }, [offset]);
  const closed = shade > 90;
  const t = useCycle(rest, bump, hover || !started || closed);
  const [extra, setExtra] = useState(0);

  // seamless forward slide (a copy of the first photo, then a silent snap back)
  const len = photos.length, n = t + extra, k = n % len;
  const [snapped, setSnapped] = useState(-1);
  const atCopy = k === 0 && n > 0 && snapped !== n;
  useEffect(() => {
    if (!atCopy) return;
    const id = window.setTimeout(() => setSnapped(n), 660);
    return () => window.clearTimeout(id);
  }, [atCopy, n]);
  const pos = atCopy ? len : k;
  /* A swap made while the shade is fully down cuts straight to the new
     photo (no slide), so lifting the shade just reveals it. */
  const [cutAt, setCutAt] = useState(-1);
  const swapHidden = () => { setCutAt(n + 1); setExtra((x) => x + 1); };

  /* Entrance hint, on one window only: the shade pulls all the way down,
     rests a beat, and goes back up — on a new photo, so the hint also
     shows what closing it does. */
  useEffect(() => {
    const el = shadeEl.current;
    if (!hint || !el || reduced()) return;
    const a = el.animate(
      [
        { translate: "0 -90%" },
        { translate: "0 0%", offset: 0.38, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
        { translate: "0 0%", offset: 0.55, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
        { translate: "0 -90%" },
      ],
      { duration: 1500, delay: 350, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
    );
    const id = window.setTimeout(swapHidden, 350 + 1500 * 0.45);
    return () => { a.cancel(); window.clearTimeout(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const onDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault(); // no text selection / native drag, which would cancel the pointer
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, s0: shade, moved: false, swapped: shade >= 99 };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current, el = pane.current;
    if (!d || !el) return;
    const dy = e.clientY - d.y0;
    if (Math.abs(dy) > 4) { d.moved = true; setDragging(true); }
    if (!d.moved) return;
    const next = Math.min(100, Math.max(SHADE_MIN, d.s0 + (dy / el.offsetHeight) * 100));
    setShade(next);
    /* Holding on: pull it all the way down and the view changes behind it;
       push it back up past halfway and the next full pull changes it again. */
    if (next >= 99 && !d.swapped) { d.swapped = true; swapHidden(); }
    else if (next < 50 && d.swapped) d.swapped = false;
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (d.moved) {
      // settle where it was heading: past halfway closes, otherwise opens
      const close = shade > 50;
      setShade(close ? 100 : SHADE_MIN);
      // closing the shade swaps the view behind it, so opening shows somewhere new
      // closing swaps the photo straight away (a cut, not a slide)
      if (close && !d.swapped) swapHidden();
    } else {
      // a plain click moves the view on one photo
      setExtra((x) => x + 1);
      slap(e.currentTarget.parentElement as HTMLElement);
    }
  };

  return (
    <div
      className="tw2-pane"
      ref={pane}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onClick={stop}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="tw2-view" data-dir={dir} style={{ translate: dir === "up" ? `0 ${-100 * pos}%` : `${-100 * pos}% 0`, transition: snapped === n || cutAt === n || shade > 50 ? "none" : undefined }}>
        {[...photos, photos[0]].map((src, i) => <span key={i} className="tw2-frame"><img src={src} alt="" draggable={false} /></span>)}
      </div>
      <span
        ref={shadeEl}
        className={`tw2-shade${dragging ? " is-dragging" : ""}`}
        style={{ translate: `0 ${shade - 100}%` }}
      >
        <span className="tw2-shade__tab" />
      </span>
    </div>
  );
}

export function BagTrips({ bump }: { bump: number }) {
  const a = TRIPS_WIDE.filter((_, i) => i % 2 === 0);
  const b = TRIPS_WIDE.filter((_, i) => i % 2 === 1);
  return (
    <div className="tw2" aria-hidden="true">
      <div className="tw2-window" data-w="0"><Window photos={a} rest={2800} offset={0} dir="left" bump={bump} hint /></div>
      <p className="tw2-line" data-w="0">{COPY.tripsA}</p>
      <div className="tw2-window" data-w="1"><Window photos={b} rest={3100} offset={1300} dir="up" bump={bump} /></div>
      <p className="tw2-line" data-w="1">{COPY.tripsB}</p>
    </div>
  );
}

