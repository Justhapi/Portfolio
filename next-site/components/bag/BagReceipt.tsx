"use client";

import { useState } from "react";
import { COPY, POP_UP, mod, slap, stop, useCycle } from "./motion";

const FOOD = Array.from({ length: 18 }, (_, i) => `${POP_UP}/food/web/${String(i + 1).padStart(2, "0")}.webp`);

/** A receipt that keeps printing: a new dish feeds in at the bottom, the oldest drops off the top. */
export function BagReceipt({ bump }: { bump: number }) {
  const t = useCycle(2600, bump);
  const [extra, setExtra] = useState<Record<number, number>>({});
  const rows = [t, t + 1, t + 2];
  return (
    <div className="pt-receipt" aria-hidden="true">
      <p className="pt-receipt__head">{COPY.food}</p>
      <div className="pt-receipt__rows">
        {rows.map((r, k) => {
          const src = FOOD[mod(r * 5 + (extra[r] ?? 0) * 7, FOOD.length)];
          return (
            <span key={r} className={`pt-receipt__row${k === 2 ? " is-new" : ""}`} onClick={(e) => { stop(e); setExtra((x) => ({ ...x, [r]: (x[r] ?? 0) + 1 })); slap(e.currentTarget); }}>
              <img key={src} src={src} alt="" draggable={false} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

