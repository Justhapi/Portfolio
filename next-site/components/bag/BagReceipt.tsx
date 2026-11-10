"use client";

import { useEffect, useState } from "react";
import { COPY, POP_UP, mod, slap, stop, useCycle } from "./motion";

const FOOD = Array.from({ length: 18 }, (_, i) => `${POP_UP}/food/web/${String(i + 1).padStart(2, "0")}.webp`);

/**
 * One row of the receipt, running the same filmstrip the trip windows use:
 * the photos sit in a column with a copy of the first at the end, the column
 * slides one frame at a time, and on reaching that copy it snaps silently
 * back to the top so the loop never shows a rewind.
 *
 * No pane and no shade — the receipt has nothing to look through, so it
 * takes the motion and leaves the window behind.
 */
function Strip({ photos, rest, offset, bump }: { photos: string[]; rest: number; offset: number; bump: number }) {
  const [hover, setHover] = useState(false);
  const [started, setStarted] = useState(false);
  /* Staggered start, so the three rows don't all take their first step on
     the same frame. */
  useEffect(() => {
    const id = window.setTimeout(() => setStarted(true), offset);
    return () => window.clearTimeout(id);
  }, [offset]);

  const t = useCycle(rest, bump, hover || !started);
  const [extra, setExtra] = useState(0);

  const len = photos.length;
  const n = t + extra;
  const k = n % len;
  const [snapped, setSnapped] = useState(-1);
  const atCopy = k === 0 && n > 0 && snapped !== n;
  useEffect(() => {
    if (!atCopy) return;
    const id = window.setTimeout(() => setSnapped(n), 660);
    return () => window.clearTimeout(id);
  }, [atCopy, n]);
  const pos = atCopy ? len : k;

  return (
    <span
      className="pt-receipt__row pt-strip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => { stop(e); setExtra((x) => x + 1); slap(e.currentTarget); }}
    >
      <span
        className="pt-strip__view"
        style={{ translate: `0 ${-100 * pos}%`, transition: snapped === n ? "none" : undefined }}
      >
        {[...photos, photos[0]].map((src, i) => (
          <span className="pt-strip__frame" key={i}>
            <img src={src} alt="" draggable={false} />
          </span>
        ))}
      </span>
    </span>
  );
}

/** A receipt of dishes, each row turning over on its own clock. */
export function BagReceipt({ bump }: { bump: number }) {
  /* Every third photo, so the three rows never hold the same dish and each
     has a full strip of its own to cycle through. */
  const rows = [0, 1, 2].map((r) => FOOD.filter((_, i) => mod(i, 3) === r));
  return (
    <div className="pt-receipt" aria-hidden="true">
      <p className="pt-receipt__head">{COPY.food}</p>
      <div className="pt-receipt__rows">
        {rows.map((photos, k) => (
          <Strip key={k} photos={photos} rest={2600 + k * 700} offset={k * 900} bump={bump} />
        ))}
      </div>
    </div>
  );
}
