"use client";

/* You at the desk, as three GIFs: Idle loops almost all the time, Blink
   plays now and then so it never looks frozen, Lean plays when a note is
   sent. Each action restarts from its first frame (a fresh blob URL is a
   new image to the browser), then hands back to Idle once it's played. */

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type MeAct = "blink" | "lean";
export type MeHandle = { play: (a: MeAct) => void };

const SRC = { idle: "/img/connect/Idle.gif", blink: "/img/connect/Blink.gif", lean: "/img/connect/Lean.gif" } as const;
const DUR: Record<MeAct, number> = { blink: 1800, lean: 2400 }; // 9 and 12 frames × 200ms

const MeGif = forwardRef<MeHandle, { className?: string }>(function MeGif({ className = "" }, ref) {
  const blobs = useRef<Partial<Record<MeAct, Blob>>>({});
  const [act, setAct] = useState<{ a: MeAct; url: string } | null>(null);
  const [shown, setShown] = useState(false); // the action's first frame is ready
  const timer = useRef<number | undefined>(undefined);
  const current = useRef<MeAct | null>(null);

  // fetch both actions up front so they start instantly
  useEffect(() => {
    let alive = true;
    (["blink", "lean"] as MeAct[]).forEach((a) =>
      fetch(SRC[a]).then((r) => r.blob()).then((b) => { if (alive) blobs.current[a] = b; }).catch(() => {}),
    );
    return () => { alive = false; window.clearTimeout(timer.current); };
  }, []);

  // free the previous action's URL once it's replaced
  useEffect(() => () => { if (act?.url.startsWith("blob:")) URL.revokeObjectURL(act.url); }, [act]);

  useImperativeHandle(ref, () => ({
    play(a) {
      // a blink never cuts into a lean; a lean may cut into a blink
      if (current.current === "lean" && a === "blink") return;
      if (current.current === a) return;
      const blob = blobs.current[a];
      const url = blob ? URL.createObjectURL(blob) : `${SRC[a]}?t=${Date.now()}`;
      current.current = a;
      setShown(false);
      setAct({ a, url });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        current.current = null;
        setAct(null);
        setShown(false);
      }, DUR[a]);
    },
  }), []);

  return (
    <span className={`cs-me me-gif ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="me-gif__frame" src={SRC.idle} alt="" style={{ visibility: act && shown ? "hidden" : "visible" }} />
      {act && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img key={act.url} className="me-gif__frame me-gif__act" src={act.url} alt="" onLoad={() => setShown(true)} style={{ visibility: shown ? "visible" : "hidden" }} />
      )}
    </span>
  );
});

export default MeGif;
