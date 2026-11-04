"use client";

import { useEffect, useState } from "react";
import { DOODLE_W, decodeDoodle, strokePath, type Doodle } from "@/components/doodle";

export default function DoodleView() {
  const [d, setD] = useState<Doodle | null | undefined>(undefined);
  // the drawing lives after the "#", which never leaves the browser
  useEffect(() => setD(decodeDoodle(decodeURIComponent(location.hash.slice(1)))), []);
  return (
    <main id="main" className="doodle-page">
      <figure className="doodle-page__card">
        {d ? (
          <svg viewBox={`0 0 ${DOODLE_W} ${d.h}`} role="img" aria-label="A doodle a visitor left on a note">
            {d.strokes.map((s, i) => <path key={i} d={strokePath(s)} />)}
          </svg>
        ) : (
          <p className="doodle-page__empty">{d === null ? "This doodle link looks incomplete." : ""}</p>
        )}
        <figcaption>a doodle left in the night sky ✦</figcaption>
      </figure>
    </main>
  );
}
