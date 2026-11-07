"use client";

import { useEffect, useRef, useState } from "react";
import { COPY, POP_UP, mod, stop, useCycle } from "./motion";

const ALBUMS = ["LBI", "Ashley", "FACE"].map((n) => `${POP_UP}/music/${n}.webp`);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* ══ MUSIC — not a player: the albums sit on a turning ring and come round
   on their own. The ring is driven frame by frame on a continuous angle,
   so the album going round the back really travels behind — no jump, no
   z-index snap. Clicking the album in front opens it on Spotify; clicking
   a side one turns it to the front. ══ */

const SPOTIFY = [
  "https://open.spotify.com/track/1OMXYy50LI1cYDsKkpFvt4", // LBI利比 — 坏坏
  "https://open.spotify.com/track/2EPQXOr3VLvDImQnoHOYO3", // Henry Young, Ashley Alisha — One More Last Time
  "https://open.spotify.com/album/05sqhNGCcu9Yb4BnCRF4To", // F/ACE — NAUTICAL STAR (check this is the one on the cover)
];
const TURN_MS = 760;

export function BagPlaylist({ bump }: { bump: number }) {
  const t = useCycle(3400, bump);
  const [extra, setExtra] = useState(0);
  const target = t + extra;
  const covers = useRef<(HTMLSpanElement | null)[]>([]);
  const pos = useRef(0); // the ring's current (fractional) turn

  const place = (p: number) => {
    covers.current.forEach((el, k) => {
      if (!el) return;
      const th = ((k - p) * 2 * Math.PI) / 3;
      const depth = Math.cos(th); // 1 = front, -1 = straight behind
      const near = (depth + 1) / 2;
      el.style.translate = `${(Math.sin(th) * 94).toFixed(2)}px ${((1 - near) * 8).toFixed(2)}px`;
      el.style.scale = (0.7 + 0.3 * near).toFixed(3);
      el.style.rotate = `${(Math.sin(th) * 5).toFixed(2)}deg`;
      el.style.zIndex = String(Math.round(near * 100));
    });
  };

  useEffect(() => { place(pos.current); }, []);
  useEffect(() => {
    const from = pos.current, to = target;
    if (from === to) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { pos.current = to; place(to); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / TURN_MS);
      pos.current = from + (to - from) * easeInOut(x);
      place(pos.current);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="rp" aria-hidden="true">
      <div className="rp-ring">
        {ALBUMS.map((src, k) => (
          <span
            key={src}
            ref={(el) => { covers.current[k] = el; }}
            className="rp-cover"
            data-k={k}
            onClick={(e) => {
              stop(e);
              const rel = mod(k - Math.round(pos.current), 3); // 0 front, 1 right, 2 left
              if (rel === 0) window.open(SPOTIFY[k], "_blank", "noopener,noreferrer");
              else setExtra((x) => x + (rel === 1 ? 1 : -1));
            }}
          >
            <span className="rp-art"><img src={src} alt="" draggable={false} /></span>
          </span>
        ))}
      </div>
      <p className="rp-line">{COPY.music}</p>
    </div>
  );
}
