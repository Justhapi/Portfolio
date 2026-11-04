"use client";

/* Connect as a night sky — a guestbook.
   - Shooting stars carry notes earlier visitors left. Click one (it slows
     down under the cursor) and it pops into a shower of the site's
     sparkles; the note unfolds where it popped, then pops away on its own
     a little after you stop reading it.
   - Still stars are side projects that aren't elsewhere in the portfolio
     (hover for a bag-style card).
   - "write me a note" / "read everyone's notes" sit minimized as sparkles
     so the sky stays open. Picking one opens it out of its sparkle and the
     other dissipates; the minimize sparkle lands right under the cursor.
     A sent note shoots off as a star.
   - Connect is the sticky layer behind About, so the entrance waits until
     About has slid off enough of it, then sweeps top → bottom and you lean
     in onto the desk line with the footer. You're three GIFs (MeGif): idle
     most of the time, a blink every 6–12s, a lean back the moment send is pressed.

   PLACEHOLDERS: PROJECTS (real side projects). Approved notes come from
   connectNotes.ts. Sent notes are emailed to you through Web3Forms
   (NOTES_INBOX_KEY); nothing shows on the site until you add it there. */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ZhName from "@/components/ZhName";
import SparkleField from "@/components/SparkleField";
import { STAR_D } from "@/components/starPath";
import { NOTES, NOTES_INBOX_KEY, type VisitorNote } from "@/components/connectNotes";
import MeGif, { type MeHandle } from "@/components/MeGif";
import { DOODLE_MAX_POINTS, DOODLE_W, encodeDoodle, strokePath, type Pt } from "@/components/doodle";

const EMAIL = "likathleen094@gmail.com";
const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`;

/* PLACEHOLDERS — swap for the real side projects. */
const PROJECTS = [
  { id: "p1", label: "Side project", meta: "role · year", note: "your project name + one line" },
  { id: "p2", label: "Side project", meta: "role · year", note: "your project name + one line" },
  { id: "p3", label: "Side project", meta: "role · year", note: "your project name + one line" },
];

/* Approved visitor notes live in connectNotes.ts. With none yet, a
   popped star and the board both invite the visitor to write the first. */
const PAST_NOTES = NOTES;
const FIRST_NOTE: Note = { from: "", date: "", text: "no notes up here yet. write the first one ✦" };
type Note = VisitorNote;

const QUART = "cubic-bezier(0.25, 1, 0.5, 1)";
const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const HOVER_RATE = 0.25; // shooting stars crawl to a quarter speed under the cursor
const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SPARK_D =
  "M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z";
const Spark = () => (
  <svg className="c-spark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d={SPARK_D} />
  </svg>
);
const ButterStar = ({ size = 26 }: { size?: number }) => (
  <svg viewBox="318 170 88 92" width={size} height={size} aria-hidden="true" focusable="false">
    <path d={STAR_D} fill="#F8E0A8" stroke="#D59B6E" strokeWidth="4" />
  </svg>
);

/** Fresh still-star positions every visit, in the open sky right of the
 *  note column and above the footer, kept apart. % units. */
function scatter(count: number, mobile: boolean) {
  const box = mobile ? { x0: 40, x1: 90, y0: 62, y1: 84 } : { x0: 48, x1: 90, y0: 12, y1: 70 };
  const minD = mobile ? 14 : 16;
  const out: { x: number; y: number }[] = [];
  for (let tries = 0; out.length < count && tries < 400; tries++) {
    const p = { x: box.x0 + Math.random() * (box.x1 - box.x0), y: box.y0 + Math.random() * (box.y1 - box.y0) };
    if (out.every((q) => Math.hypot(q.x - p.x, (q.y - p.y) * 1.4) > minD)) out.push(p);
  }
  return out;
}

/** Damped-spring samples, so motion never stalls. */
function spring(from: number, zeta: number, response: number, frames = 120) {
  const dt = 1 / 60, w = (2 * Math.PI) / response, k = w * w, c = 2 * zeta * w;
  let x = from, v = 0;
  const out: number[] = [];
  for (let i = 0; i < frames; i++) {
    out.push(x);
    for (let s = 0; s < 4; s++) { v += (-k * x - c * v) * (dt / 4); x += v * (dt / 4); }
    if (i > 10 && Math.abs(x) < 0.05 && Math.abs(v) < 0.5) break;
  }
  out[out.length - 1] = 0;
  return out;
}

/** The two note options slide in from the left, one after the other,
 *  overshooting a little and rebounding into place (sampled spring, so
 *  the rebound comes from physics rather than a bounce curve). */
function slideInOptions(el: HTMLElement, delay = 0) {
  const xs = spring(-48, 0.5, 0.7);
  const frames = xs.map((x, i) => ({ translate: `${x.toFixed(1)}px 0`, opacity: Math.min(1, i / 12) }));
  const dur = (xs.length / 60) * 1000;
  el.querySelectorAll<HTMLElement>(".cs-mini").forEach((opt, k) => {
    opt.animate(frames, { duration: dur, delay: delay + k * 110, easing: "linear", fill: "backwards" });
  });
}

/** A visitor note unfolds downward like a folded slip of paper. */
function popIn(el: HTMLElement, delay = 0) {
  if (reduced()) return;
  el.style.transformOrigin = "50% 0";
  el.animate(
    [
      { scale: "1 0.05", rotate: "-6deg", opacity: 0, easing: OUT },
      { scale: "1 1.06", rotate: "2deg", opacity: 1, offset: 0.65, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
      { scale: "1 1", rotate: "0deg", opacity: 1 },
    ],
    { duration: 620, delay: delay + 120, fill: "backwards" },
  );
}

function glow(sky: HTMLElement, x: number, y: number) {
  const f = document.createElement("span");
  f.className = "cs-flash";
  f.style.left = `${x}px`;
  f.style.top = `${y}px`;
  sky.appendChild(f);
  f.animate([{ scale: "0.3", opacity: 0.9 }, { scale: "1.6", opacity: 0 }], { duration: 300, easing: QUART })
    .finished.then(() => f.remove(), () => f.remove());
}

/** A star pops into the site's 4-point sparkles: flung out, slowed by drag
 *  while gravity takes over, in one continuous arc. `soft` is the quieter
 *  version a visitor note leaves with. */
function burst(sky: HTMLElement, x: number, y: number, soft = false) {
  if (reduced()) return;
  const n = soft ? 7 : 14;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "cs-burst";
    if (soft) s.style.opacity = "0.7";
    s.innerHTML = `<svg viewBox="0 0 100 100"><path d="${SPARK_D}"/></svg>`;
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    const size = soft ? 5 + Math.random() * 5 : 7 + Math.random() * 9;
    s.style.width = s.style.height = `${size}px`;
    sky.appendChild(s);
    const ang = (i / n) * Math.PI * 2 + Math.random() * 0.4;
    const speed = soft ? 240 + Math.random() * 160 : 420 + Math.random() * 300; // px/s
    let vx = Math.cos(ang) * speed, vy = Math.sin(ang) * speed * 0.8 - 120;
    let px = 0, py = 0, rot = 0;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (160 + Math.random() * 160);
    const frames: Keyframe[] = [];
    const steps = soft ? 60 : 84, dt = 1 / 60;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      frames.push({
        translate: `calc(-50% + ${px.toFixed(1)}px) calc(-50% + ${py.toFixed(1)}px)`,
        rotate: `${rot.toFixed(0)}deg`,
        scale: `${(0.4 + Math.min(1, t * 6) * 0.6).toFixed(2)}`,
        opacity: t < 0.6 ? 1 : Math.max(0, 1 - (t - 0.6) / 0.4),
      });
      vx *= 0.93; vy = vy * 0.93 + 520 * dt;
      px += vx * dt; py += vy * dt; rot += spin * dt;
    }
    s.animate(frames, { duration: steps * dt * 1000, easing: "linear" })
      .finished.then(() => s.remove(), () => s.remove());
  }
  if (!soft) glow(sky, x, y);
}

/* ── Shooting stars ─────────────────────────────────────────────────── */
type Shoot = { id: number; top: number };

/* A passing star flies straight down the diagonal, does one flip midway,
   and leaves a tight stream of sparkle dust drifting back the way it came. */
const FLIGHT_MS = 3400;

function ShootingStar({ s, onDone, onPop }: { s: Shoot; onDone: (id: number) => void; onPop: (id: number, el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const anim = useRef<Animation | null>(null);
  const flipAnim = useRef<Animation | null>(null);
  const target = useRef(1);
  const raf = useRef(0);
  const slowTimer = useRef<number | undefined>(undefined);
  /** Ease the playback rate toward the target so the star glides to a crawl. */
  const steer = (to: number) => {
    target.current = to;
    cancelAnimationFrame(raf.current);
    const tick = () => {
      const a = anim.current;
      if (!a || a.playState !== "running") return;
      const r = a.playbackRate + (target.current - a.playbackRate) * 0.18;
      const next = Math.abs(r - target.current) < 0.01 ? target.current : r;
      a.updatePlaybackRate(next);
      flipAnim.current?.updatePlaybackRate(next); // the flip slows with it
      if (a.playbackRate !== target.current) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => { cancelAnimationFrame(raf.current); window.clearTimeout(slowTimer.current); }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const a = el.animate(
      [
        { translate: "0 0", opacity: 0 },
        { opacity: 1, offset: 0.08 },
        { opacity: 1, offset: 0.82 },
        { translate: "-64vw 30vh", opacity: 0 },
      ],
      { duration: FLIGHT_MS, easing: "linear" },
    );
    const headEl = el.querySelector<HTMLElement>(".cs-shoot__head");
    const flip = headEl?.animate(
      [
        { rotate: "0deg", offset: 0 },
        { rotate: "0deg", offset: 0.38, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
        { rotate: "360deg", offset: 0.62 },
        { rotate: "360deg", offset: 1 },
      ],
      { duration: FLIGHT_MS, easing: "linear" },
    ) ?? null;
    anim.current = a;
    flipAnim.current = flip;
    a.finished.then(() => onDone(s.id), () => {});

    // the stream: a sparkle every few px, drifting back opposite the flight
    const sky = el.parentElement;
    let raf = 0;
    if (sky && headEl && !reduced()) {
      const W = window.innerWidth, H = window.innerHeight;
      const len = Math.hypot(0.64 * W, 0.3 * H);
      const ux = (0.64 * W) / len, uy = (-0.3 * H) / len; // up and to the right
      // measured once: after that the star's spot comes from how far along
      // its straight flight it is, so the loop never forces a layout
      const hb = headEl.getBoundingClientRect(), sb = sky.getBoundingClientRect();
      const x0 = hb.left + hb.width / 2 - sb.left, y0 = hb.top + hb.height / 2 - sb.top;
      let last: [number, number] | null = null;
      const shed = () => {
        if (a.playState === "finished" || a.playState === "idle") return; // done: stop looping
        const prog = Number(a.effect?.getComputedTiming().progress ?? 0);
        if (a.playState === "running" && sky.childElementCount < 120) { // never let dust pile up
          const x = x0 - 0.64 * W * prog, y = y0 + 0.3 * H * prog;
          if (!last || Math.hypot(x - last[0], y - last[1]) > 9) {
            last = [x, y];
            const d = document.createElement("span");
            d.className = "cs-dust";
            d.innerHTML = `<svg viewBox="0 0 100 100"><path d="${SPARK_D}"/></svg>`;
            const size = 3 + Math.random() * 3;
            d.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
            sky.appendChild(d);
            const back = 14 + Math.random() * 8, side = (Math.random() - 0.5) * 3;
            const fading = prog > 0.82;
            d.animate(
              [
                { translate: "-50% -50%", scale: "1", opacity: fading ? 0.4 : 0.9 },
                { translate: `calc(-50% + ${(ux * back - uy * side).toFixed(1)}px) calc(-50% + ${(uy * back + ux * side).toFixed(1)}px)`, scale: "0.2", opacity: 0 },
              ],
              { duration: 520 + Math.random() * 160, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
            ).finished.then(() => d.remove(), () => d.remove());
          }
        }
        raf = requestAnimationFrame(shed);
      };
      raf = requestAnimationFrame(shed);
    }
    return () => { a.cancel(); flip?.cancel(); cancelAnimationFrame(raf); };
  }, [s, onDone]);
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Pop this shooting star to read a note a visitor left"
      className="cs-shoot is-catchable"
      style={{ top: `${s.top}%` }}
      onPointerEnter={() => {
        if (reduced()) return;
        window.clearTimeout(slowTimer.current);
        steer(HOVER_RATE);
      }}
      onPointerLeave={() => {
        // the star drifts out from under a still cursor, so stay slow a moment
        window.clearTimeout(slowTimer.current);
        slowTimer.current = window.setTimeout(() => steer(1), 1100);
      }}
      onFocus={() => steer(HOVER_RATE)}
      onBlur={() => steer(1)}
      onClick={(e) => {
        e.currentTarget.getAnimations({ subtree: true }).forEach((x) => x.pause());
        onPop(s.id, e.currentTarget);
      }}
    >
      <span className="cs-shoot__head"><ButterStar size={30} /></span>
    </button>
  );
}

/* ── A popped note: stays while read, pops away after ──────────────── */
const LEAVE_AFTER_HOVER = 2000;
const LEAVE_IF_UNREAD = 6000;

function popAway(el: HTMLElement): Promise<unknown> {
  if (reduced()) return Promise.resolve();
  const sky = el.parentElement;
  const a = el.animate(
    [{ scale: "1", opacity: 1 }, { scale: "1.05", opacity: 1, offset: 0.35 }, { scale: "0.2", opacity: 0 }],
    { duration: 240, easing: QUART, fill: "forwards" },
  );
  window.setTimeout(() => {
    if (sky) burst(sky, el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2, true);
  }, 110);
  return a.finished;
}

function PastNote({ n, x, y, onGone }: { n: Note; x: number; y: number; onGone: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const gone = useRef(false);
  const goneRef = useRef(onGone);
  goneRef.current = onGone;
  const arm = useCallback((ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el || gone.current) return;
      gone.current = true;
      popAway(el).then(() => goneRef.current(), () => goneRef.current());
    }, ms);
  }, []);
  const hold = () => window.clearTimeout(timer.current);
  useEffect(() => {
    const el = ref.current;
    if (el) popIn(el, 90);
    // the pop happens under the cursor, so it starts as "being read"
    if (el && !el.matches(":hover")) arm(LEAVE_IF_UNREAD);
    return () => window.clearTimeout(timer.current);
  }, [arm]);
  return (
    <div
      ref={ref}
      className="cs-past"
      style={{ left: x, top: y }}
      role="note"
      onPointerEnter={hold}
      onPointerLeave={() => arm(LEAVE_AFTER_HOVER)}
      onFocus={hold}
      onBlur={() => arm(LEAVE_AFTER_HOVER)}
    >
      <p className="cs-past__text">{n.text}</p>
      {(n.from || n.date) && <p className="cs-past__meta"><span>{n.from ? `from ${n.from}` : ""}</span><time>{n.date}</time></p>}
    </div>
  );
}

/* ── Write a note ───────────────────────────────────────────────────── */
/** Emails the note to you. Resolves true once it's delivered. */
async function deliverNote(from: string, message: string, doodle = ""): Promise<boolean> {
  if (!NOTES_INBOX_KEY) {
    console.warn("[ConnectSky] NOTES_INBOX_KEY is empty, so this note wasn't delivered.");
    return true;
  }
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: NOTES_INBOX_KEY,
        subject: `New note in the night sky${from ? ` from ${from}` : ""}`,
        from_name: "kathleenli.tech",
        name: from || "(no name)",
        message: message || "(just a doodle)",
        // the drawing comes as a link that redraws it on your site
        doodle: doodle ? `${location.origin}/doodle#${doodle}` : "none",
        sent: new Date().toLocaleString(),
      }),
    });
    const data = await res.json().catch(() => null);
    return res.ok && !!data?.success;
  } catch {
    return false;
  }
}

/** Draw on the note with the pencil. An SVG laid over the message box:
 *  while the pencil is on it takes the pointer; off, it just shows the
 *  drawing and you can type underneath. */
function DoodlePad({ on, strokes, setStrokes }: { on: boolean; strokes: Pt[][]; setStrokes: (fn: (s: Pt[][]) => Pt[][]) => void }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const liveRef = useRef<SVGPathElement | null>(null);
  const [h, setH] = useState(500);
  // the line being drawn lives here, not in React state, so a stroke
  // redraws one path per move instead of re-rendering the whole drawing
  const live = useRef<{ pts: Pt[]; rect: DOMRect; budget: number } | null>(null);
  // The pad's real shape, from its layout size. (Its on-screen box is skewed
  // while the note spins open, so measuring that put the ink above the
  // cursor.) Re-read when a stroke starts, in case anything changed.
  const shape = (el: SVGSVGElement) => {
    const w = el.clientWidth, ht = el.clientHeight;
    return w ? Math.round((ht / w) * DOODLE_W) : 0;
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { const v = shape(el); if (v) setH(v); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const at = (x: number, y: number, r: DOMRect): Pt => {
    const k = DOODLE_W / r.width;
    return [Math.round((x - r.left) * k), Math.round((y - r.top) * k)];
  };
  const finish = () => {
    const l = live.current;
    live.current = null;
    if (liveRef.current) liveRef.current.setAttribute("d", "");
    if (l?.pts.length) setStrokes((s) => [...s, l.pts]);
  };
  const used = strokes.reduce((n, s) => n + s.length, 0);
  return (
    <svg
      ref={ref}
      className={`cs-doodle${on ? " is-on" : ""}`}
      viewBox={`0 0 ${DOODLE_W} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      // only the mouse's default (text selection / focus) is blocked here —
      // preventing pointerdown would also stop the mouse events the cursor
      // circle follows
      onMouseDown={(e) => { if (on) e.preventDefault(); }}
      onPointerDown={(e) => {
        if (!on || used >= DOODLE_MAX_POINTS) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const v = shape(e.currentTarget);
        if (v && v !== h) setH(v);
        const rect = e.currentTarget.getBoundingClientRect(); // read once per stroke
        live.current = { pts: [at(e.clientX, e.clientY, rect)], rect, budget: DOODLE_MAX_POINTS - used - 1 };
        liveRef.current?.setAttribute("d", strokePath(live.current.pts));
      }}
      onPointerMove={(e) => {
        const l = live.current;
        if (!l || l.budget <= 0) return;
        const last = l.pts[l.pts.length - 1];
        const p = at(e.clientX, e.clientY, l.rect);
        if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 6) return; // skip tiny moves
        l.pts.push(p);
        l.budget--;
        liveRef.current?.setAttribute("d", strokePath(l.pts));
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
      onLostPointerCapture={() => { if (live.current) finish(); }}
    >
      {strokes.map((s, i) => <path key={i} d={strokePath(s)} />)}
      <path ref={liveRef} d="" />
    </svg>
  );
}

const PencilIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M13.6 3.2 16.8 6.4 7.2 16 3.4 16.6 4 12.8Z" />
    <path d="M11.8 5 15 8.2" />
  </svg>
);

function NoteCard({ onSent, onSend, onMin, hidden, cardRef }: {
  onSent: (from: string, cardEl: HTMLElement) => void;
  /** the moment send is pressed with a message in it */
  onSend: () => void;
  onMin: () => void;
  hidden: boolean;
  cardRef: { current: HTMLFormElement | null };
}) {
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "failed">("idle");
  const [pencil, setPencil] = useState(false);
  const [strokes, setStrokes] = useState<Pt[][]>([]);
  const ref = useRef<HTMLFormElement | null>(null);
  const shake = () => {
    if (!reduced()) ref.current?.animate(
      [{ translate: "0 0" }, { translate: "-6px 0" }, { translate: "5px 0" }, { translate: "-3px 0" }, { translate: "0 0" }],
      { duration: 280, easing: "ease-out" },
    );
  };
  return (
    <form
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      className="cs-note"
      hidden={hidden}
      aria-label="Leave a Note"
      onKeyDown={(e) => { if (e.key === "Escape") onMin(); }}
      onSubmit={async (e) => {
        e.preventDefault();
        if (state === "sending") return;
        if (!msg.trim() && !strokes.length) { setErr(true); shake(); return; }
        // spam bots fill the hidden field; let them think it worked
        const bot = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;
        setState("sending");
        onSend();
        const pad = ref.current?.querySelector(".cs-doodle")?.getAttribute("viewBox")?.split(" ")[3];
        const doodle = strokes.length ? encodeDoodle({ h: Number(pad) || 500, strokes }) : "";
        const ok = bot ? true : await deliverNote(from.trim(), msg.trim(), doodle);
        if (!ok) { setState("failed"); shake(); return; }
        setState("idle");
        if (ref.current) onSent(from.trim(), ref.current);
        setFrom(""); setMsg(""); setErr(false); setStrokes([]); setPencil(false);
      }}
    >
      <button type="button" className="cs-note__min" aria-label="Minimize note" onClick={onMin}>
        <Spark />
      </button>
      <label className="cs-note__row">
        <span className="cs-note__label">From</span>
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="your name" autoComplete="name" />
      </label>
      <label className="cs-note__body">
        <span className="visually-hidden">Message</span>
        <textarea
          value={msg}
          onChange={(e) => { setMsg(e.target.value); setErr(false); if (state === "failed") setState("idle"); }}
          placeholder={pencil ? "" : "leave a note for me (and the next visitor)…"}
          rows={5}
          aria-invalid={err || undefined}
        />
        <DoodlePad on={pencil} strokes={strokes} setStrokes={(fn) => { setStrokes(fn); setErr(false); }} />
      </label>
      <input type="checkbox" name="botcheck" className="cs-botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="cs-note__foot">
        <div className="cs-note__tools">
          <button
            type="button"
            className={`cs-tool${pencil ? " is-on" : ""}`}
            aria-pressed={pencil}
            aria-label={pencil ? "Stop drawing" : "Draw on the note"}
            title={pencil ? "back to typing" : "doodle"}
            onClick={() => setPencil((p) => !p)}
          >
            <PencilIcon />
          </button>
          {strokes.length > 0 && (
            <button type="button" className="cs-tool cs-tool--text" onClick={() => setStrokes((s) => s.slice(0, -1))} aria-label="Undo the last line">undo</button>
          )}
        </div>
        <span className="visually-hidden" role="status">
          {err ? "Write or draw something before sending." : state === "sending" ? "Sending your note." : ""}
        </span>
        {state === "failed" && <span className="cs-note__fail" role="alert">didn&rsquo;t send. try again?</span>}
        <button type="submit" className="cs-send" disabled={state === "sending"} aria-busy={state === "sending" || undefined}>
          {state === "sending" ? "sending" : "send"} <Spark />
        </button>
      </div>
    </form>
  );
}

/* ── Read everyone's notes: a pinboard of slips ─────────────────────── */
const SLIP_TILT = [-1.6, 1.2, 0.6, -0.8, 1.6, -1.2];
const FADE_TOP = 32;     // px of fade at an edge that has more behind it
const FADE_BOTTOM = 44;

function NotesPanel({ onMin, panelRef, hidden }: { onMin: () => void; panelRef: { current: HTMLDivElement | null }; hidden: boolean }) {
  const notes = [...PAST_NOTES].reverse();
  const boardRef = useRef<HTMLDivElement | null>(null);
  /** The fades grow with the distance scrolled (and shrink as you near the
   *  end), instead of switching on all at once. */
  const readEdge = useCallback(() => {
    const b = boardRef.current;
    if (!b) return;
    const above = Math.min(b.scrollTop, FADE_TOP);
    const below = Math.min(Math.max(b.scrollHeight - b.clientHeight - b.scrollTop, 0), FADE_BOTTOM);
    b.style.setProperty("--fade-top", `${above.toFixed(1)}px`);
    b.style.setProperty("--fade-bottom", `${below.toFixed(1)}px`);
  }, []);
  // The board fills the room down to the sketch / desk line and scrolls past it.
  useLayoutEffect(() => {
    if (hidden) return;
    const fit = () => {
      const b = boardRef.current, panel = panelRef.current, slot = panel?.parentElement, cs = panel?.closest(".cs");
      if (!b || !panel || !slot || !cs) return;
      // measured from the slot, which never moves, so the glide-up doesn't skew it
      const top = slot.getBoundingClientRect().top + b.offsetTop;
      const me = cs.querySelector(".cs-me")?.getBoundingClientRect().top ?? Infinity;
      const line = cs.querySelector(".cs-foot")?.getBoundingClientRect().top ?? Infinity;
      const floor = Math.min(me, line, window.innerHeight) - 24 - 14; // 14 = panel bottom padding
      b.style.maxHeight = `${Math.max(180, Math.round(floor - top))}px`;
      readEdge();
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [hidden, panelRef, readEdge]);
  return (
    <div
      ref={panelRef}
      className="cs-notes"
      hidden={hidden}
      role="region"
      aria-label="Notes visitors left"
      onKeyDown={(e) => { if (e.key === "Escape") onMin(); }}
    >
      <div className="cs-notes__head">
        <button type="button" className="cs-note__min cs-note__min--inline" aria-label="Minimize notes" onClick={onMin}>
          <Spark />
        </button>
        <span className="cs-note__label">
          {notes.length === 0 ? "no notes yet" : `${notes.length} ${notes.length === 1 ? "note" : "notes"} left here`}
        </span>
      </div>
      <div ref={boardRef} className="cs-notes__board" data-lenis-prevent tabIndex={0} aria-label="All notes" onScroll={readEdge}>
        {notes.length === 0 && (
          <div className="cs-notes__slip cs-notes__slip--empty" style={{ rotate: "-1deg" }}>
            <p className="cs-past__text">be the first to leave one ✦</p>
          </div>
        )}
        {notes.map((n, k) => (
          <div key={k} className="cs-notes__slip" style={{ rotate: `${SLIP_TILT[k % SLIP_TILT.length]}deg` }}>
            <p className="cs-past__text">{n.text}</p>
            <p className="cs-past__meta"><span>{n.from}</span><time>{n.date}</time></p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── The two minimized sparkles and what they open ──────────────────── */
type Mode = "write" | "read" | null;
const ORIGIN = { write: "23px 32px", read: "23px 20px" } as const;

function Compose({ onSent, onSend, onRead }: { onSent: (from: string, cardEl: HTMLElement) => void; onSend: () => void; onRead: (open: boolean) => void }) {
  const [mode, setMode] = useState<Mode>(null);
  const cardRef = useRef<HTMLFormElement | null>(null);
  const readRef = useRef<HTMLDivElement | null>(null);
  const writeTrig = useRef<HTMLButtonElement | null>(null);
  const readTrig = useRef<HTMLButtonElement | null>(null);
  const busy = useRef(false);
  const closing = useRef<{ which: "write" | "read"; refocus: boolean } | null>(null);
  const onReadRef = useRef(onRead);
  onReadRef.current = onRead;

  useEffect(() => { onReadRef.current(mode === "read"); }, [mode]);
  // once a panel has folded away and its sparkle is back
  useEffect(() => {
    const c = closing.current;
    if (mode || !c) return;
    closing.current = null;
    const t = c.which === "write" ? writeTrig.current : readTrig.current;
    if (!t) return;
    if (c.refocus) t.focus({ preventScroll: true });
    if (!reduced()) t.animate([{ opacity: 0, scale: "0.9" }, { opacity: 1, scale: "1" }], { duration: 220, easing: OUT });
  }, [mode]);

  const panelOf = (m: "write" | "read") => (m === "write" ? cardRef.current : readRef.current);

  const open = (m: "write" | "read") => {
    if (busy.current) return;
    // reading moves up into the top spot: measure how far it travels
    const dy = m === "read"
      ? Math.round((readTrig.current?.getBoundingClientRect().top ?? 0) - (writeTrig.current?.getBoundingClientRect().top ?? 0))
      : 0;
    setMode(m);
    requestAnimationFrame(() => {
      const p = panelOf(m);
      if (!p) return;
      if (m === "write") p.querySelector("textarea")?.focus({ preventScroll: true });
      else p.querySelector<HTMLElement>(".cs-note__min")?.focus({ preventScroll: true });
      if (reduced()) return;
      p.style.transformOrigin = ORIGIN[m];
      if (dy) {
        // opens out of its sparkle where it was, then glides up into place
        p.animate(
          [
            { opacity: 0, scale: "0.2", rotate: "-8deg", translate: `0 ${dy}px` },
            { opacity: 1, scale: "1", rotate: "0deg", translate: `0 ${dy}px`, offset: 0.45, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
            { opacity: 1, scale: "1", rotate: "0deg", translate: "0 0" },
          ],
          { duration: 640, easing: OUT },
        );
        return;
      }
      p.animate([{ opacity: 0, scale: "0.2", rotate: "-8deg" }, { opacity: 1, scale: "1", rotate: "0deg" }], { duration: 340, easing: OUT });
    });
  };
  const close = (refocus = true) => {
    const m = mode;
    if (!m) return;
    const p = panelOf(m);
    const done = () => { busy.current = false; closing.current = { which: m, refocus }; setMode(null); };
    if (!p || reduced()) return done();
    busy.current = true;
    p.style.transformOrigin = ORIGIN[m];
    p.animate([{ opacity: 1, scale: "1", rotate: "0deg" }, { opacity: 0, scale: "0.2", rotate: "-8deg" }], { duration: 200, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" })
      .finished.then((a) => { done(); requestAnimationFrame(() => a.cancel()); }, done);
  };

  return (
    <div className={`cs-compose${mode ? ` is-${mode}` : ""}`}>
      <div className="cs-compose__slot">
        <button
          ref={writeTrig}
          type="button"
          className={`cs-mini${mode === "read" ? " is-gone" : ""}`}
          hidden={mode === "write"}
          aria-expanded={mode === "write"}
          tabIndex={mode === "read" ? -1 : undefined}
          onClick={() => open("write")}
        >
          <span className="cs-mini__star"><Spark /></span>
          <span className="cs-mini__label">Leave a note</span>
        </button>
        <NoteCard
          cardRef={cardRef}
          hidden={mode !== "write"}
          onMin={() => close()}
          onSend={onSend}
          onSent={(from, el) => { onSent(from, el); window.setTimeout(() => close(false), 750); }}
        />
      </div>
      <div className="cs-compose__slot">
        <button
          ref={readTrig}
          type="button"
          className={`cs-mini cs-mini--read${mode === "write" ? " is-gone" : ""}`}
          hidden={mode === "read"}
          aria-expanded={mode === "read"}
          tabIndex={mode === "write" ? -1 : undefined}
          onClick={() => open("read")}
        >
          <span className="cs-mini__star"><Spark /></span>
          <span className="cs-mini__label">Read through notes</span>
        </button>
        <NotesPanel panelRef={readRef} hidden={mode !== "read"} onMin={() => close()} />
      </div>
    </div>
  );
}

/** A sent note: a butter star leaves the card and shoots off up-right. */
function launchNote(card: HTMLElement, sky: HTMLElement) {
  if (reduced()) return;
  const c = card.getBoundingClientRect();
  const s = sky.getBoundingClientRect();
  const x = c.left + c.width / 2 - s.left;
  const y = c.top + c.height / 2 - s.top;
  const star = document.createElement("span");
  star.className = "cs-launch";
  star.innerHTML = `<span class="cs-shoot__trail"></span><span class="cs-shoot__head"><svg viewBox="318 170 88 92" width="28" height="28"><path d="${STAR_D}" fill="#F8E0A8" stroke="#D59B6E" stroke-width="4"/></svg></span>`;
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  sky.appendChild(star);
  star.animate(
    [
      { translate: "-50% -50%", scale: "0.4", opacity: 0 },
      { translate: "-50% -50%", scale: "1.2", opacity: 1, offset: 0.15 },
      { translate: `calc(-50% + ${s.width - x + 120}px) calc(-50% + ${-y - 80}px)`, scale: "0.8", opacity: 0 },
    ],
    { duration: 1300, easing: "cubic-bezier(0.5, 0, 0.75, 0.6)" },
  ).finished.then(() => star.remove(), () => star.remove());
  card.animate(
    [{ scale: "1", opacity: 1 }, { scale: "0.92", opacity: 0.35, offset: 0.4 }, { scale: "1", opacity: 1 }],
    { duration: 700, easing: QUART },
  );
}

/* ── Entrance: night falls from the top down ────────────────────────── */
function play(el: Element | null | undefined, frames: Keyframe[], o: KeyframeAnimationOptions) {
  if (el) (el as HTMLElement).animate(frames, { fill: "backwards", ...o });
}

/** Everything appears in order of how high it sits; you rise out of the
 *  desk line with the footer. Returns when the shooting stars may start. */
function enterSection(root: HTMLElement): number {
  const q = (sel: string) => root.querySelector(sel);
  const head = q(".cs-head"), legend = q(".cs-legend"), form = q(".cs-compose");
  const me = q(".cs-me") as HTMLElement | null, foot = q(".cs-foot");
  const items: { el: Element; y: number; how: "star" | "text" | "form" | "fade" }[] = [];
  const add = (el: Element | null, how: (typeof items)[number]["how"]) => {
    if (el) items.push({ el, y: el.getBoundingClientRect().top, how });
  };
  add(head, "text"); add(legend, "text"); add(form, "form"); add(foot, "fade");
  root.querySelectorAll(".cs-star").forEach((st) => add(st, "star"));
  items.sort((a, b) => a.y - b.y);
  const y0 = items[0]?.y ?? 0, y1 = items[items.length - 1]?.y ?? 1;
  const SPAN = 1500;
  // empty sky between the top half and the footer shouldn't read as a pause
  const MAX_GAP = 200;
  let last = 0, footAt = 0, prevRaw = 0, prevD = 0;
  items.forEach((it, i) => {
    const raw = ((it.y - y0) / Math.max(1, y1 - y0)) * SPAN;
    const d = i === 0 ? raw : prevD + Math.min(raw - prevRaw, MAX_GAP);
    prevRaw = raw; prevD = d;
    last = Math.max(last, d);
    if (it.el === foot) footAt = d;
    if (it.how === "star") play(it.el, [{ opacity: 0, scale: "0" }, { opacity: 1, scale: "1.5", offset: 0.55 }, { opacity: 1, scale: "1" }], { duration: 520, delay: d, easing: QUART });
    else if (it.how === "text") play(it.el, [{ opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0)" }], { duration: 650, delay: d, easing: QUART });
    else if (it.how === "form") slideInOptions(it.el as HTMLElement, d);
    else play(it.el, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: d, easing: QUART });
  });
  // you lean in from the left and straighten up on the desk line
  if (me) {
    me.style.transformOrigin = "50% 100%";
    me.animate(
      [{ translate: "-32px 0", rotate: "-4deg", opacity: 0 }, { translate: "0 0", rotate: "0deg", opacity: 1 }],
      { duration: 850, delay: footAt, easing: QUART, fill: "backwards" },
    );
  }
  return Math.max(last + 700, footAt + 850);
}

/** How much of the section is actually on screen. Connect sits sticky
 *  behind About, so the part About still covers doesn't count. */
function visibleShare(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  let top = Math.max(r.top, 0);
  const about = document.querySelector<HTMLElement>(".about");
  if (about) {
    const a = about.getBoundingClientRect();
    if (a.top <= top && a.bottom > top) top = a.bottom;
  }
  const bottom = Math.min(r.bottom, window.innerHeight);
  return Math.max(0, bottom - top) / Math.max(1, Math.min(r.height, window.innerHeight));
}

/** Copies the address for visitors who don't use Gmail. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const done = () => {
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      done();
    } catch {
      // older browsers: copy through a temporary textarea
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      try { if (document.execCommand("copy")) done(); } catch { /* the Gmail link still works */ }
      document.body.removeChild(ta);
    }
  };
  return (
    <button
      type="button"
      className={`c-copy cs-copy${copied ? " is-copied" : ""}`}
      onClick={copy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      title={copied ? "copied" : "copy email"}
    >
      <span className="c-copy-icon" aria-hidden="true">
        {copied ? (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5 L 6.5 12 L 13 5" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="5" width="8" height="8" rx="1.5" />
            <path d="M3 11 V 4.5 A 1.5 1.5 0 0 1 4.5 3 H 11" />
          </svg>
        )}
      </span>
    </button>
  );
}

type Shown = { key: number; n: Note; x: number; y: number };

export default function ConnectSky() {
  const meRef = useRef<MeHandle | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const skyRef = useRef<HTMLDivElement | null>(null);
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [shown, setShown] = useState<Shown[]>([]);
  const [sentMsg, setSentMsg] = useState("");
  const nextId = useRef(0);
  const noteIdx = useRef(0);
  // placed after mount (random per visit; avoids a server/client mismatch)
  const [spots, setSpots] = useState<{ x: number; y: number }[] | null>(null);
  useEffect(() => { setSpots(scatter(PROJECTS.length, window.innerWidth <= 760)); }, []);

  // opening "read everyone's notes" clears any popped note
  const [readAll, setReadAll] = useState(false);
  useEffect(() => { if (readAll) setShown([]); }, [readAll]);

  // side-project card that follows the cursor (same as the hero bag)
  const [hover, setHover] = useState<string | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const showPill = (id: string, x: number, y: number) => {
    setHover(id);
    const el = pillRef.current;
    if (!el) return;
    const h = el.offsetHeight || 250;
    el.style.left = `${Math.min(x + 14, window.innerWidth - 262)}px`;
    el.style.top = `${y - h - 8 < 12 ? y + 18 : y - h - 8}px`; // flip below when there's no room above
  };

  const done = useCallback((id: number) => setShoots((s) => s.filter((x) => x.id !== id)), []);

  const popStar = useCallback((id: number, el: HTMLElement) => {
    const sky = skyRef.current;
    if (!sky) return;
    const sr = sky.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2 - sr.left;
    const cy = r.top + r.height / 2 - sr.top;
    if (!reduced()) {
      el.animate([{ scale: "1", opacity: 1 }, { scale: "1.8", opacity: 1, offset: 0.35 }, { scale: "0", opacity: 0 }], { duration: 220, easing: QUART, fill: "forwards" });
    }
    burst(sky, cx, cy);
    window.setTimeout(() => setShoots((s) => s.filter((x) => x.id !== id)), 240);
    // the note opens centred on the pop, kept on screen and off the note column
    const W = 270, H = 112;
    const col = sky.querySelector(".cs-left")?.getBoundingClientRect();
    const minX = col && sr.width > 760 ? col.right - sr.left + 24 : 16;
    const x = Math.min(Math.max(cx - W / 2, minX), sr.width - W - 16);
    const y = Math.min(Math.max(cy - H / 2, 60), sr.height - H - 16);
    const n = PAST_NOTES.length ? PAST_NOTES[noteIdx.current++ % PAST_NOTES.length] : FIRST_NOTE;
    setShown([{ key: Date.now(), n, x, y }]);
  }, []);

  // play the entrance once ~35% of the section is uncovered and on screen
  const [inView, setInView] = useState(false);
  const [starsOn, setStarsOn] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !spots) return;
    if (reduced()) { setInView(true); setStarsOn(true); return; }
    let raf = 0, fired = false;
    const check = () => {
      raf = 0;
      if (fired || visibleShare(el) < 0.35) return;
      fired = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      setInView(true);
      const wait = enterSection(el);
      window.setTimeout(() => setStarsOn(true), wait);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [spots]);

  // one passing shooting star at a time
  useEffect(() => {
    if (reduced() || !starsOn) return;
    const spawn = () => setShoots((s) => (s.length ? s : [{ id: nextId.current++, top: 6 + Math.random() * 20 }]));
    const first = window.setTimeout(spawn, 300);
    const t = window.setInterval(spawn, 4600);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, [starsOn]);

  // you blink now and then so the drawing never looks frozen
  useEffect(() => {
    if (!starsOn || reduced()) return;
    let t: number;
    const loop = () => { t = window.setTimeout(() => { meRef.current?.play("blink"); loop(); }, 6000 + Math.random() * 6000); };
    loop();
    return () => window.clearTimeout(t);
  }, [starsOn]);

  const onSent = (_from: string, card: HTMLElement) => {
    if (skyRef.current) launchNote(card, skyRef.current);
    setSentMsg("Note sent.");
    window.setTimeout(() => setSentMsg(""), 4000);
  };

  return (
    <section
      id="connect"
      ref={sectionRef}
      className={`cs connect${inView ? "" : " is-pending"}`}
      data-screen-label="04 Connect"
    >
      <div className="section-sparkles connect-sparkles" aria-hidden="true">
        <SparkleField count={7} scale={1.5} slowdown={2.2} lifeScale={1.5} />
      </div>
      <div className="cs-sky" ref={skyRef}>
        {spots && PROJECTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`cs-star${hover === p.id ? " is-active" : ""}`}
            style={{ left: `${spots[i].x}%`, top: `${spots[i].y}%` }}
            aria-label={`${p.label}: ${p.note}`}
            onMouseEnter={(e) => showPill(p.id, e.clientX, e.clientY)}
            onMouseMove={(e) => showPill(p.id, e.clientX, e.clientY)}
            onMouseLeave={() => setHover(null)}
            onFocus={(e) => { const r = e.currentTarget.getBoundingClientRect(); showPill(p.id, r.right, r.top + r.height / 2); }}
            onBlur={() => setHover(null)}
          >
            <Spark />
          </button>
        ))}
        {shoots.map((s) => <ShootingStar key={s.id} s={s} onDone={done} onPop={popStar} />)}
        {shown.map((m) => (
          <PastNote key={m.key} n={m.n} x={m.x} y={m.y} onGone={() => setShown((cur) => cur.filter((c) => c.key !== m.key))} />
        ))}

        <div className="cs-left">
          <h2 className="cs-head">Connect more over my designs?</h2>
          {/* you lean back the moment send is pressed */}
          <Compose onSent={onSent} onSend={() => { if (!reduced()) meRef.current?.play("lean"); }} onRead={setReadAll} />
          <p className="visually-hidden" role="status" aria-live="polite">{sentMsg}</p>
        </div>
        <MeGif ref={meRef} />
      </div>

      <div ref={pillRef} className={`hover-bag__pill cs-pill${hover ? " is-on" : ""}`} aria-hidden="true">
        <div className="hover-bag__pill-inner cs-pill__inner">
          {(() => {
            const p = PROJECTS.find((x) => x.id === hover) ?? PROJECTS[0];
            return (
              <div className="cs-pill__card">
                <span className="cs-pill__photo">{p.label}</span>
                <p className="cs-pill__text">{p.note}</p>
                <p className="cs-past__meta"><span>{p.meta}</span></p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* data-slug: the nav's Connect submenu scrolls to these */}
      <footer className="cs-foot">
        <span className="cs-handle">@KathleenLi · <span className="name-zh-inline"><ZhName /><span className="visually-hidden" lang="zh-Hant">妤𣎮</span></span></span>
        <nav className="cs-links" aria-label="Connect">
          <a data-slug="resume" href="/resume.pdf" target="_blank" rel="noopener noreferrer"><Spark />Resume</a>
          <span className="cs-email">
            <a data-slug="email" href={GMAIL} target="_blank" rel="noopener noreferrer"><Spark />Email</a>
            <CopyEmail />
          </span>
          <a data-slug="linkedin" href="https://www.linkedin.com/in/kathleen-li-564a13328" target="_blank" rel="noopener noreferrer"><Spark />LinkedIn</a>
        </nav>
      </footer>
    </section>
  );
}
