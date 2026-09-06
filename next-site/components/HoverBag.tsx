"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * HoverBag — layered bag illustration.
 *
 * The bag is composed of 10 transparent PNG layers stacked in z-order.
 * Hovering one of the 6 item hit-zones lifts/tilts that layer and shows
 * a themed pill card that follows the cursor (see `placePill` below).
 */

type HoverEffect = "lift" | "tilt-left" | "tilt-right";

type Item = {
  key: string;
  label: string;
  layers: string[];
  hoverEffect: HoverEffect;
  zone: { x: number; y: number; w: number; h: number };
};

type Layer = {
  key: string;
  src: string;
};

const LAYERS: Layer[] = [
  { key: "ten_back_bag",     src: "/img/bag/ten_back_bag.webp" },
  { key: "nine_laptop",      src: "/img/bag/nine_laptop.webp" },
  { key: "eight_ipad",       src: "/img/bag/eight_ipad.webp" },
  { key: "seven_middle_bag", src: "/img/bag/seven_middle_bag.webp" },
  { key: "six_ticket",       src: "/img/bag/six_ticket.webp" },
  { key: "five_phone",       src: "/img/bag/five_phone.webp" },
  { key: "four_front_bag",   src: "/img/bag/four_front_bag.webp" },
  { key: "three_usagi",      src: "/img/bag/three_usagi.webp" },
  { key: "two_earbud_2",     src: "/img/bag/two_earbud_2.webp" },
  { key: "one_earbud_1",     src: "/img/bag/one_earbud_1.webp" },
];

const ITEMS: Item[] = [
  {
    key: "ipad",
    label: "art",
    layers: ["eight_ipad"],
    hoverEffect: "lift",
    zone: { x: 23, y:  2, w: 24, h: 17 },
  },
  {
    key: "laptop",
    label: "games",
    layers: ["nine_laptop"],
    hoverEffect: "lift",
    zone: { x: 48, y:  0, w: 37, h: 18 },
  },
  {
    key: "phone",
    label: "friends",
    layers: ["five_phone"],
    hoverEffect: "lift",
    zone: { x: 67, y: 36, w: 17, h: 23 },
  },
  {
    key: "ticket",
    label: "travel",
    layers: ["six_ticket"],
    hoverEffect: "tilt-right",
    zone: { x: 44, y: 54, w: 14, h: 20 },
  },
  {
    key: "usagi",
    label: "food",
    layers: ["three_usagi"],
    hoverEffect: "tilt-right",
    zone: { x: 63, y: 63, w: 10, h: 35 },
  },
  {
    key: "earbuds",
    label: "music",
    layers: ["one_earbud_1", "two_earbud_2"],
    hoverEffect: "tilt-left",
    zone: { x:  4, y: 60, w: 20, h: 27 },
  },
];

const EFFECT_CLASS: Record<HoverEffect, string> = {
  "lift":       "is-lifted",
  "tilt-left":  "is-tilted-left",
  "tilt-right": "is-tilted-right",
};

/** Custom domain (kathleenli.tech) serves from the root — no path
 *  prefix needed. Kept as a named constant (rather than inlining "")
 *  since plain <img> tags don't pick up next.config's basePath
 *  automatically, so if that ever changes again, this is the one
 *  place to update (same pattern as elsewhere in the repo). */
const BASE_PATH = "";

/* Visible painted bounds of everything under `root`: each descendant is
   intersected with every clipping ancestor up to (but not including)
   root's own parent, so content hidden inside an overflow:hidden shell
   (the friends film-strip, the food wheel's oversized disc) isn't
   counted. Used to catch content that bleeds past the nominal pill box
   (art's cloud, music's flanking notes) so it can be nudged fully
   on-screen rather than clipped by the viewport edge. */
function getPaintedBounds(root: HTMLElement) {
  let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
  const clips = (n: Element) => {
    const s = getComputedStyle(n);
    return /hidden|clip|auto|scroll/.test(s.overflow + " " + s.overflowX + " " + s.overflowY);
  };
  root.querySelectorAll("*").forEach((n) => {
    const r = n.getBoundingClientRect();
    if (!r.width && !r.height) return;
    let { left, top, right, bottom } = r;
    for (let p = n.parentElement; p && p !== root.parentElement; p = p.parentElement) {
      if (!clips(p)) continue;
      const c = p.getBoundingClientRect();
      left = Math.max(left, c.left);
      top = Math.max(top, c.top);
      right = Math.min(right, c.right);
      bottom = Math.min(bottom, c.bottom);
    }
    if (right <= left || bottom <= top) return;
    if (left < L) L = left;
    if (top < T) T = top;
    if (right > R) R = right;
    if (bottom > B) B = bottom;
  });
  return L === Infinity ? null : { left: L, top: T, right: R, bottom: B };
}

export default function HoverBag({ debug = false }: { debug?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [hoverCapable, setHoverCapable] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* The pill is portaled straight to <body> (see the render below).
     .hover-bag's own entrance animation leaves a lingering, non-"none"
     `transform` on it after finishing (animation-fill-mode: forwards
     holds the final translateX(0)/rotate(0)/scale(1,1) frame) — and
     per spec ANY non-"none" transform on an ancestor makes it the
     containing block for position:fixed descendants. Left nested, the
     pill's "fixed" coordinates would be measured from .hover-bag's box
     instead of the viewport, landing it however far .hover-bag sits
     from the viewport origin — which grows/shrinks with scroll. A
     portal sidesteps that (and any other transformed ancestor)
     entirely, since document.body isn't affected by section-level
     entrance/reveal animations. Only portal after mount so SSR and the
     first client render match (no document on the server). */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Mouse-anchored placement: the pill always sits top-right of the
     cursor (consistent everywhere on the page, no left/below flip) —
     clamped, not flipped, so it never overshoots the viewport but
     stays on the same side of the cursor throughout a hover. */
  const placePill = (clientX: number, clientY: number, key: string | null) => {
    const pill = pillRef.current;
    if (!pill || !key) return;
    lastPos.current = { x: clientX, y: clientY };
    const card = pill.firstElementChild as HTMLElement | null;
    const w = card?.offsetWidth || 268;
    const h = card?.offsetHeight || 190;
    const margin = 12;
    const gap = key === "music" ? 4 : 16;
    const vw = window.innerWidth, vh = window.innerHeight;

    const x = Math.min(Math.max(clientX + gap, margin), Math.max(margin, vw - w - margin));
    const y = Math.min(Math.max(clientY - h - gap, margin), Math.max(margin, vh - h - margin));

    pill.style.left = `${x}px`;
    pill.style.top = `${y}px`;
    pill.style.transformOrigin = "0% 100%";

    // Nudge for content that bleeds outside the nominal box (art's
    // cloud, music's notes) — measure real painted bounds and shift
    // just enough to keep them fully on-screen.
    const bounds = getPaintedBounds(pill);
    if (bounds) {
      let dx = 0, dy = 0;
      if (bounds.left < margin) dx = margin - bounds.left;
      else if (bounds.right > vw - margin) dx = Math.max(vw - margin - bounds.right, margin - bounds.left);
      if (bounds.top < margin) dy = margin - bounds.top;
      else if (bounds.bottom > vh - margin) dy = Math.max(vh - margin - bounds.bottom, margin - bounds.top);
      if (dx || dy) {
        pill.style.left = `${x + dx}px`;
        pill.style.top = `${y + dy}px`;
      }
    }
  };

  // Re-place once the newly-active variant's markup has painted, so
  // bleeding elements are measured for real rather than against the
  // previous variant's bounds.
  useEffect(() => {
    if (!active || !lastPos.current) return;
    const pos = lastPos.current;
    const id = requestAnimationFrame(() => placePill(pos.x, pos.y, active));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onResize = () => {
      if (lastPos.current) placePill(lastPos.current.x, lastPos.current.y, active);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* Touch path: tapping anywhere outside the active zone closes the
     centered popup. Only armed while a popup is actually open, and only
     on non-hover-capable devices — desktop already closes on
     onMouseLeave. Checking `.closest(".hover-bag__zone")` lets a tap on
     ANY zone button (the active one, to toggle off, or a different one,
     to switch) fall through to that button's own onClick instead of
     being fought here — this listener only ever fires setActive(null)
     for taps that land outside every zone. */
  useEffect(() => {
    if (hoverCapable || !active) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(".hover-bag__zone")) return;
      setActive(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [hoverCapable, active]);

  const activeItem = ITEMS.find((i) => i.key === active);
  const liftedLayers = new Set(activeItem?.layers ?? []);
  const activeEffectClass = activeItem ? EFFECT_CLASS[activeItem.hoverEffect] : "";

  return (
    <div
      className={`hover-bag reveal${debug ? " is-debug" : ""}`}
      data-active={active ?? ""}
    >
      <div className="hover-bag__stack" ref={stackRef}>
        {LAYERS.map((layer) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={layer.key}
            src={`${BASE_PATH}${layer.src}`}
            alt=""
            className={`hover-bag__layer${liftedLayers.has(layer.key) ? ` ${activeEffectClass}` : ""}`}
            data-layer={layer.key}
            aria-hidden="true"
            draggable={false}
          />
        ))}
        {/* Rendered on every device now — touch devices get a tap-to-toggle
            popup (centered in the bag, see the mobile pill block below)
            instead of the cursor-follow hover pill, so the six items are
            actually reachable on mobile instead of not rendering at all. */}
        {ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`hover-bag__zone${active === item.key ? " is-active" : ""}`}
            style={{
              left: `${item.zone.x}%`,
              top: `${item.zone.y}%`,
              width: `${item.zone.w}%`,
              height: `${item.zone.h}%`,
            }}
            onMouseEnter={hoverCapable ? (e) => {
              placePill(e.clientX, e.clientY, item.key);
              setActive(item.key);
            } : undefined}
            onMouseMove={hoverCapable ? (e) => placePill(e.clientX, e.clientY, item.key) : undefined}
            onMouseLeave={hoverCapable ? () => setActive(null) : undefined}
            onFocus={hoverCapable ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              placePill(r.left + r.width / 2, r.top + r.height / 2, item.key);
              setActive(item.key);
            } : undefined}
            onBlur={hoverCapable ? () => setActive(null) : undefined}
            /* Touch path: tap toggles the centered popup — tap the same
               item again (or it's already active) to fade it back out. */
            onClick={!hoverCapable ? () => {
              setActive((prev) => (prev === item.key ? null : item.key));
            } : undefined}
            aria-label={item.label}
            aria-pressed={!hoverCapable ? active === item.key : undefined}
            data-debug-label={debug ? item.label : undefined}
          />
        ))}
      </div>
      {/* Pill wrapper: gated on hover-capable so the cursor-follow
          overlay (and its DOM node / CSS keyframe animations) is
          skipped entirely on touch. Portaled to <body> — see the
          `mounted` comment above — so its position:fixed coordinates
          are always relative to the real viewport. */}
      {hoverCapable && mounted && createPortal(
        <div
          ref={pillRef}
          className={`hover-bag__pill hover-bag__pill--${activeItem?.key ?? "none"}${active ? " is-on" : ""}`}
          aria-hidden="true"
        >
          <div className="hover-bag__pill-inner">
            {activeItem && renderPillVariant(activeItem.key)}
          </div>
        </div>,
        document.body
      )}
      {/* Touch path: same pill content, but fixed in the middle of the bag
          container and driven purely by fade (no cursor-follow, no
          portal — it only ever needs to sit centered over the bag). */}
      {!hoverCapable && mounted && (
        <div
          className={`hover-bag__pill hover-bag__pill--mobile hover-bag__pill--${activeItem?.key ?? "none"}${active ? " is-on" : ""}`}
          aria-hidden="true"
        >
          <div className="hover-bag__pill-inner">
            {activeItem && renderPillVariant(activeItem.key)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Pill variants ────────────────────────────────────────────────────
   Each hoverable item on the bag reveals a themed pill card, not the
   same generic label. Variants share the cursor-follow shell but each
   has distinctive layout + typography so the six items feel like six
   different peeks into Kathleen's world rather than six labels. */

function renderPillVariant(key: string): React.ReactNode {
  switch (key) {
    case "earbuds": return <PillMusic />;
    case "phone":   return <PillFriends />;
    case "usagi":   return <PillFood />;
    case "ticket":  return <PillTravel />;
    case "laptop":  return <PillGames />;
    case "ipad":    return <PillArt />;
    default:        return null;
  }
}

/* Music — iPod frame with an animated 5-bar equalizer, flanked by two
   handwritten notes (CPOP/KPOP/JPOP on the left, LBI on the right)
   that idle-bob in place. */
function PillMusic() {
  const BARS = [
    { name: "musicBar1", dur: 1850, delay: 0,    hue: "#C68D5F" },
    { name: "musicBar2", dur: 1480, delay: -320, hue: "#C68D5F" },
    { name: "musicBar3", dur: 2220, delay: -640, hue: "#D9A277" },
    { name: "musicBar4", dur: 1620, delay: -180, hue: "#C68D5F" },
    { name: "musicBar5", dur: 2030, delay: -900, hue: "#C68D5F" },
  ];
  return (
    <div className="pill-music">
      <div className="pill-music__ipod">
        <div className="pill-music__screen">
          <span className="pill-music__track">坏坏</span>
          <span className="pill-music__bars">
            {BARS.map((b) => (
              <i
                key={b.name}
                className="pill-music__bar"
                style={{
                  background: b.hue,
                  animationName: b.name,
                  animationDuration: `${b.dur}ms`,
                  animationDelay: `${b.delay}ms`,
                }}
              />
            ))}
          </span>
        </div>
        <div className="pill-music__wheel">
          <span>◁</span>
          <span className="pill-music__wheel-btn--center" />
          <span>▷</span>
        </div>
      </div>
      <span className="pill-music__note pill-music__note--left">
        I tend to listen to <strong>CPOP / KPOP / JPOP</strong>
      </span>
      <span className="pill-music__note pill-music__note--right">
        The artist I listen to the most is <strong>LBI利比</strong>
      </span>
    </div>
  );
}

/* Friends — polaroids scroll UPWARD continuously through the pill as a
   film-strip, new photos entering from the bottom and leaving at the
   top by crossing straight out of the frame's overflow:hidden bounds —
   no fade, just a hard clip, like the strip is longer than the window
   showing it.
   Back to the 3-lane structure (-80/0/80), but each card adds a small
   +/- jitter to both its lane (--x) and its vertical travel (--y) so
   the columns are still recognizably 3 columns, just not perfectly
   aligned — same idea as the row stagger, applied to the columns too. */
function PillFriends() {
  const LANES = [-80, 0, 80];
  const HUES = ["#8E3A3A", "#276866", "#C7A24A", "#93613A", "#87BAAB", "#6B5F55"];
  // rot, x-jitter, y-jitter per card, cycling through the 3 lanes.
  const FRIENDS = [
    { rot: -8, jx: -8,  jy: 8   },
    { rot: 6,  jx: 6,   jy: -6  },
    { rot: -4, jx: -10, jy: 10  },
    { rot: 8,  jx: 9,   jy: -9  },
    { rot: -6, jx: -6,  jy: 5   },
    { rot: 5,  jx: 8,   jy: -8  },
    { rot: -7, jx: -9,  jy: 7   },
    { rot: 7,  jx: 5,   jy: -5  },
    { rot: -5, jx: -7,  jy: 9   },
  ].map((f, i) => ({
    ...f,
    x: LANES[i % LANES.length] + f.jx,
    hue: HUES[i % HUES.length],
  }));
  return (
    <div className="pill-friends">
      <span className="pill-tag">friends</span>
      <div className="pill-friends__frame">
        {FRIENDS.map((f, i) => (
          <div
            key={i}
            className="pill-friends__card"
            style={{
              animationDelay: `${(i * -12) / FRIENDS.length}s`,
              ["--rot" as string]: `${f.rot}deg`,
              ["--x" as string]: `${f.x}px`,
              ["--y" as string]: `${f.jy}px`,
            }}
          >
            <div className="pill-friends__photo" />
            <span className="pill-friends__pin" style={{ background: f.hue }} />
          </div>
        ))}
      </div>
      <span className="pill-friends__caption">photos of friends</span>
    </div>
  );
}

/* Food — a lazy-Susan wheel of 4 plates spinning behind the pill's top
   edge, pausing on each cardinal position before advancing to the
   next — same rhythm as a real lazy Susan being turned to share a
   dish. */
function PillFood() {
  const PLATES = [0, 90, 180, 270];
  return (
    <div className="pill-food">
      <span className="pill-tag">food</span>
      <div className="pill-food__wheel">
        {PLATES.map((angle) => (
          <div
            key={angle}
            className="pill-food__slot"
            style={{ transform: `rotate(${angle}deg) translateY(-152px)` }}
          >
            <div className="pill-food__counter">
              <span className="pill-food__plate" />
            </div>
          </div>
        ))}
      </div>
      <div className="pill-food__footer">
        <span className="pill-food__caption">one dish at a time</span>
      </div>
    </div>
  );
}

/* Travel — a pinboard that PANS across 3 labeled destinations (China,
   Japan, Hong Kong) connected by a dashed route, rather than zooming
   a camera into each pin. */
function PillTravel() {
  const PINS = [
    { name: "China",     note: "where it started", hue: "#8E3A3A", left:   0, top:  63 },
    { name: "Japan",     note: "spring trip",       hue: "#276866", left: 262, top: 188 },
    { name: "Hong Kong", note: "food + family",     hue: "#C7A24A", left: 530, top:   0 },
  ];
  return (
    <div className="pill-travel">
      <span className="pill-tag">travel</span>
      <div className="pill-travel__board">
        <svg
          className="pill-travel__web"
          viewBox="0 0 820 380"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 128 158 L 396 283 L 664 95"
            fill="none"
            stroke="#4C3C2E"
            strokeWidth="1.6"
            strokeDasharray="6 5"
            opacity="0.5"
          />
        </svg>
        {PINS.map((p) => (
          <div key={p.name} className="pill-travel__slot" style={{ left: p.left, top: p.top }}>
            <span className="pill-travel__label">{p.name}</span>
            <span className="pill-travel__dot" style={{ background: p.hue }} />
            <span className="pill-travel__note">{p.note}</span>
          </div>
        ))}
      </div>
      <div className="pill-travel__frame" aria-hidden="true" />
    </div>
  );
}

/* Games — a dark "what I'm playing" panel. A cursor sprite visits each
   of 3 icons in turn, pulsing it and revealing its name below. */
function PillGames() {
  const GAMES = [
    { key: "pkm", initial: "P", name: "Pokémon", from: "#C0433C", to: "#8E2A28", delay: "0s" },
    { key: "lol", initial: "L", name: "League",  from: "#2C6E8F", to: "#1B4459", delay: "-8s" },
    { key: "tft", initial: "T", name: "TFT",     from: "#C68D5F", to: "#8A5A31", delay: "-4s" },
  ];
  return (
    <div className="pill-games">
      <span className="pill-games__caption">what i&rsquo;m playing</span>
      <div className="pill-games__row">
        {GAMES.map((g) => (
          <div key={g.key} className="pill-games__slot">
            <div
              className="pill-games__icon"
              style={{
                background: `linear-gradient(160deg, ${g.from}, ${g.to})`,
                animationDelay: g.delay,
              }}
            >
              {g.initial}
            </div>
            <span className="pill-games__label" style={{ animationDelay: g.delay }}>
              {g.name}
            </span>
          </div>
        ))}
      </div>
      <div className="pill-games__taskbar">
        <span className="pill-games__taskbar-dot pill-games__taskbar-dot--active" />
        <span className="pill-games__taskbar-dot" />
        <span className="pill-games__taskbar-dot" />
        <span className="pill-games__clock">11:42 PM</span>
      </div>
      <span className="pill-games__cursor" aria-hidden="true">
        <svg viewBox="0 0 16 20" width="14" height="18">
          <path
            d="M 2 2 L 14 12 L 8 12 L 11 18 L 8 19 L 5 13 L 2 16 Z"
            fill="#F6EEE6"
            stroke="#2A302F"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

/* Art — a cloud-shaped card drifting gently above the pill's top edge
   (bleeding past the shell — the placement system's painted-bounds
   nudge keeps it fully on-screen), with a placeholder doodle swatch
   and a caption below. */
function PillArt() {
  return (
    <div className="pill-art">
      <span className="pill-tag">art</span>
      <svg
        className="pill-art__cloud"
        viewBox="0 0 280 220"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M 60 100 C 40 100, 24 84, 32 66 C 20 52, 30 30, 52 32 C 60 14, 90 12, 100 30 C 112 18, 140 20, 148 40 C 168 28, 200 40, 200 60 C 224 60, 244 76, 236 100 C 256 110, 254 138, 232 144 C 240 168, 216 186, 196 178 C 190 200, 158 204, 148 186 C 138 200, 108 200, 100 184 C 84 196, 56 190, 56 170 C 32 168, 20 148, 34 130 C 20 122, 30 100, 60 100 Z"
          fill="#FFFDF7"
          stroke="rgba(76, 60, 46, 0.22)"
          strokeWidth="2"
        />
      </svg>
      <div className="pill-art__doodle">
        <span className="pill-art__doodle-tag">doodle</span>
      </div>
      <div className="pill-art__footer">
        <span className="pill-art__kicker">doodles of college to rmr</span>
        <p className="pill-art__caption">
          I like to capture memories through sharing my vision with others
        </p>
      </div>
    </div>
  );
}
