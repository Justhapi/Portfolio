"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COPY, slap } from "./bag/motion";
import { BagTrips } from "./bag/BagTrips";
import { BagReceipt } from "./bag/BagReceipt";
import { BagDoodles } from "./bag/BagDoodles";
import { BagPlaylist } from "./bag/BagPlaylist";


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
/** Caption labels in the pop-ups — left out when deciding what sits against the cursor. */
const CAPTIONS = ".tw2-line, .pd-line, .rp-line, .pill-orbit__caption, .pill-scatter__caption, .pill-polaroid__line";

/* Visible painted bounds of everything under `root`: each descendant is
   intersected with every clipping ancestor up to (but not including)
   root's own parent, so content hidden inside an overflow:hidden shell
   (the friends film-strip, the food wheel's oversized disc) isn't
   counted. Used to catch content that bleeds past the nominal pill box
   (art's cloud, music's flanking notes) so it can be nudged fully
   on-screen rather than clipped by the viewport edge. */
/** Does this element itself draw anything? (an image or canvas, a fill,
 *  a border, a shadow or its own text — not just a box around others) */
function paints(n: Element) {
  if (/^(IMG|CANVAS|SVG|VIDEO|svg)$/.test(n.tagName)) return true;
  const s = getComputedStyle(n);
  if (s.visibility === "hidden" || s.opacity === "0") return false;
  if (s.backgroundImage !== "none") return true;
  if (!/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor)) return true;
  if (s.boxShadow !== "none") return true;
  if (parseFloat(s.borderTopWidth) || parseFloat(s.borderLeftWidth)) return true;
  for (const c of Array.from(n.childNodes)) if (c.nodeType === 3 && c.textContent?.trim()) return true;
  return false;
}
function getPaintedBounds(root: HTMLElement, skip?: string) {
  let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
  const clips = (n: Element) => {
    const s = getComputedStyle(n);
    return /hidden|clip|auto|scroll/.test(s.overflow + " " + s.overflowX + " " + s.overflowY);
  };
  root.querySelectorAll("*").forEach((n) => {
    if ((n as HTMLElement).dataset?.boundsIgnore !== undefined || n.closest("[data-bounds-ignore]")) return;
    if (skip && n.closest(skip)) return;
    if (!paints(n)) return; // layout wrappers draw nothing, so they don't count
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

/* ── Warm-up preload ─────────────────────────────────────────────────
   The pop-up art (friends photos, album covers, game tiles, doodles)
   only mounts when an item is hovered/tapped, so the browser used to
   start fetching it at that moment and the pill filled in piece by
   piece. Instead, fetch + decode everything once the page has finished
   its own loading and the main thread is idle — or sooner if the bag
   comes within ~1.5 screens of the viewport. Image objects are kept in
   a module array so the decoded bitmaps stay warm in memory. */
const warmed: HTMLImageElement[] = [];
let warmStarted = false;
function bagPreloadSrcs(): string[] {
  // Pop-up art only — the bag layers are already <img>s in the DOM, so
  // holding a second decoded copy of each here just doubled their memory.
  return [
    ...FRIEND_PHOTOS.map((p) => p.src),
    `${POP_UP}/music/LBI.webp`,
    `${POP_UP}/music/Ashley.webp`,
    `${POP_UP}/music/FACE.webp`,
    `${POP_UP}/games/League.webp`,
    `${POP_UP}/games/TFT.webp`,
    `${POP_UP}/games/Pokemon/Z-A.webp`,
    `${POP_UP}/games/Pokemon/Pokopia.webp`,
    `${POP_UP}/games/Pokemon/Violet.webp`,
    `${POP_UP}/games/Pokemon/Arceus.webp`,
    `${POP_UP}/doodles/Lost.webp`,
    `${POP_UP}/doodles/Rice.webp`,
    `${POP_UP}/doodles/Locked.webp`,
  ];
}
function warmBagImages() {
  if (warmStarted) return;
  warmStarted = true;
  for (const src of bagPreloadSrcs()) {
    const img = new Image();
    img.decoding = "async";
    img.src = `${BASE_PATH}${src}`;
    img.decode?.().catch(() => {});
    warmed.push(img);
  }
}

export default function HoverBag({ debug = false }: { debug?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  /* Clicks on the item or its pop-up: each one advances the pop-up's
     photos early and slaps it (like the hero stickers). */
  const [bump, setBump] = useState(0);
  const press = () => {
    setBump((b) => b + 1);
    const card = pillRef.current?.querySelector(".hover-bag__pill-inner") as HTMLElement | null;
    if (card) slap(card);
  };
  /* The pop-up stays put once shown and only closes after the pointer
     has left both the item and the pop-up (a short grace covers the gap
     between them). */
  const closeT = useRef<number | undefined>(undefined);
  const keepOpen = () => window.clearTimeout(closeT.current);
  const closeSoon = () => {
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => { setActive(null); lastPos.current = null; }, 220);
  };
  const switchT = useRef<number | undefined>(undefined);
  useEffect(() => () => { window.clearTimeout(closeT.current); window.clearTimeout(switchT.current); }, []);
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

  /* Kick off the pop-up image warm-up (see warmBagImages above). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    let idleId: number | undefined;
    let timer: number | undefined;
    const ric = (window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    });
    const schedule = () => {
      if (ric.requestIdleCallback) idleId = ric.requestIdleCallback(warmBagImages, { timeout: 2500 });
      else timer = window.setTimeout(warmBagImages, 1200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    // Safety net: if the reader scrolls fast, start as soon as the bag
    // is within ~1.5 screens, idle or not.
    let io: IntersectionObserver | undefined;
    const el = stackRef.current;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { warmBagImages(); io?.disconnect(); }
      }, { rootMargin: "150% 0px 150% 0px" });
      io.observe(el);
    }
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) ric.cancelIdleCallback?.(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
      io?.disconnect();
    };
  }, []);

  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { prefersReducedMotionRef.current = mq.matches; };
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

  /* Placement: the pop-up opens to the top-right of the pointer and then
     stays still where it opened (its pieces keep their own float). Once
     it has painted, what it actually draws is measured and it eases into
     the corrected spot; `base` is where it opened, the correction is a
     `translate` on top. */
  const base = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  /** What the pop-up paints, relative to its own origin (measured after it shows). */
  const painted = useRef<{ l: number; t: number; r: number; b: number; al: number; ab: number } | null>(null);
  const followRaf = useRef(0);
  const follow = () => {
    const pill = pillRef.current;
    followRaf.current = 0;
    if (!pill) return;
    const dx = target.current.x - cur.current.x, dy = target.current.y - cur.current.y;
    const snapNow = prefersReducedMotionRef.current || Math.abs(dx) + Math.abs(dy) < 0.3;
    cur.current = snapNow ? { ...target.current } : { x: cur.current.x + dx * 0.24, y: cur.current.y + dy * 0.24 };
    pill.style.translate = `${(cur.current.x - base.current.x).toFixed(2)}px ${(cur.current.y - base.current.y).toFixed(2)}px`;
    if (!snapNow) followRaf.current = requestAnimationFrame(follow);
  };
  const placePill = (clientX: number, clientY: number, key: string | null, snap = false) => {
    const pill = pillRef.current;
    if (!pill || !key) return;
    lastPos.current = { x: clientX, y: clientY };
    const card = pill.firstElementChild as HTMLElement | null;
    const fw = card?.offsetWidth || 190, fh = card?.offsetHeight || 250;
    const pr = painted.current ?? { l: 0, t: 0, r: fw, b: fh, al: 0, ab: fh };
    const margin = 12, gap = 10;
    const vw = window.innerWidth, vh = window.innerHeight;
    /* Top-right of the pointer, snug against it: the pop-up's main picture
       (everything but its captions) starts just right of the cursor and
       ends just above it. A caption may hang lower, off to the right.
       Clamped (never flipped) so all of it stays on screen. */
    let x = clientX + gap - pr.al;
    const yIdeal = clientY - gap - pr.ab;
    x = Math.min(Math.max(x, margin - pr.l), vw - margin - pr.r);
    const y = Math.min(Math.max(yIdeal, margin - pr.t), vh - margin - pr.b);
    /* Near the top of the window the clamp pushes it down over the
       pointer — then slide it sideways to clear the cursor ring. */
    if (y > yIdeal) {
      const clear = 34 * 1.6 * 0.5 + 6;
      const right = clientX + clear - pr.l;
      if (right + pr.r <= vw - margin) x = Math.max(x, right);
      else x = Math.max(margin - pr.l, clientX - clear - pr.r);
    }
    target.current = { x, y };
    if (snap) {
      base.current = { x, y };
      cur.current = { x, y };
      pill.style.left = `${x}px`;
      pill.style.top = `${y}px`;
      pill.style.translate = "0px 0px";
      // grow out of the pointer
      pill.style.transformOrigin = `${clientX - x}px ${clientY - y}px`;
      return;
    }
    if (!followRaf.current) followRaf.current = requestAnimationFrame(follow);
  };
  /** Measure what the open pop-up actually paints, then re-centre on the pointer. */
  const measure = () => {
    const pill = pillRef.current;
    if (!pill || !activeRef.current) return;
    const bounds = getPaintedBounds(pill);
    if (!bounds) return;
    // the main picture, without its captions: this is what sits against the cursor
    const main = getPaintedBounds(pill, CAPTIONS) ?? bounds;
    const ox = cur.current.x, oy = cur.current.y;
    painted.current = { l: bounds.left - ox, t: bounds.top - oy, r: bounds.right - ox, b: bounds.bottom - oy, al: main.left - ox, ab: main.bottom - oy };
    if (lastPos.current) placePill(lastPos.current.x, lastPos.current.y, activeRef.current);
  };
  const activeRef = useRef<string | null>(null);
  activeRef.current = active;
  useEffect(() => () => cancelAnimationFrame(followRaf.current), []);

  // Once a newly opened pop-up has painted (and again once its grow-in has
  // finished, so the scale doesn't skew the numbers), measure and re-centre.
  useEffect(() => {
    if (!active) return;
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(measure); });
    const t = window.setTimeout(measure, 260);
    return () => { cancelAnimationFrame(id); window.clearTimeout(t); };
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

  /* Hover, worked out from the pointer position rather than enter/leave
     events — the pop-up sits on top of the item now, so the item itself
     never sees the pointer. Using everything under the pointer:
       · on its item, or on the pop-up itself → it stays open and still
       · resting on a different item for a moment switches to that one
       · anywhere else → closes after the grace period */
  useEffect(() => {
    if (!hoverCapable) return;
    let raf = 0, px = -1, py = -1;
    let pending: string | null = null;
    /* The way to the pop-up: while the pointer is travelling from its item
       toward the open pop-up, other items it crosses don't take over —
       they only do once it stops on them. `anchor` is the last spot on the
       open item; the route is the area between it and the pop-up. */
    let anchor: { x: number; y: number } | null = null;
    /** Clicked or dragged inside the open pop-up: you're using it, so nothing under it takes over. */
    let engaged = false;
    let stillT: number | undefined;
    const onRoute = (x: number, y: number) => {
      const pill = pillRef.current;
      if (!anchor || !pill || !painted.current) return false;
      const ox = cur.current.x, oy = cur.current.y, pr = painted.current;
      const pad = 10;
      const corners = [[ox + pr.l - pad, oy + pr.t - pad], [ox + pr.r + pad, oy + pr.t - pad], [ox + pr.r + pad, oy + pr.b + pad], [ox + pr.l - pad, oy + pr.b + pad]];
      // inside any triangle (anchor, corner i, corner i+1) = inside the hull of anchor + pop-up
      const side = (ax: number, ay: number, bx: number, by: number) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
      for (let i = 0; i < 4; i++) {
        const [bx, by] = corners[i], [cx, cy] = corners[(i + 1) % 4];
        const d1 = side(anchor.x, anchor.y, bx, by), d2 = side(bx, by, cx, cy), d3 = side(cx, cy, anchor.x, anchor.y);
        if ((d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0)) return true;
      }
      return false;
    };
    const open = (key: string) => {
      painted.current = null;
      anchor = { x: px, y: py };
      engaged = false;
      placePill(px, py, key, true);
      setActive(key);
      activeRef.current = key;
    };
    const evaluate = () => {
      raf = 0;
      if (px < 0) return;
      const els = document.elementsFromPoint(px, py);
      const zone = els.find((el) => el.classList.contains("hover-bag__zone")) as HTMLElement | undefined;
      const key = zone?.dataset.key ?? null;
      const now = activeRef.current;
      const pill = pillRef.current;
      // only the pop-up's actual pieces count, not the empty space between them
      const onPill = !!now && !!pill && els.some((el) => pill.contains(el) && paints(el));
      if (key) {
        keepOpen();
        if (!now) { open(key); return; }
        if (key === now) { window.clearTimeout(switchT.current); pending = null; anchor = { x: px, y: py }; return; }
        // on the pop-up where it covers another item: holds while you're using it (or just passing);
        // stop there for a moment without clicking and that item takes over
        if (onPill) {
          window.clearTimeout(switchT.current); pending = null;
          window.clearTimeout(stillT);
          if (!engaged) stillT = window.setTimeout(() => { if (activeRef.current === now) open(key); }, 600);
          return;
        }
        // on the way to the pop-up: only switch if the pointer actually stops here
        if (onRoute(px, py)) {
          window.clearTimeout(switchT.current); pending = null;
          window.clearTimeout(stillT);
          stillT = window.setTimeout(() => { if (activeRef.current === now) open(key); }, 420);
          return;
        }
        // resting on a different item switches to it
        if (pending !== key) {
          pending = key;
          window.clearTimeout(switchT.current);
          switchT.current = window.setTimeout(() => { pending = null; open(key); }, 260);
        }
        return;
      }
      if (onPill) { keepOpen(); window.clearTimeout(switchT.current); pending = null; return; }
      window.clearTimeout(switchT.current); pending = null;
      if (now) closeSoon();
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(evaluate); };
    const onMove = (e: PointerEvent) => { if (e.pointerType === "touch") return; px = e.clientX; py = e.clientY; window.clearTimeout(stillT); queue(); };
    const onDown = (e: PointerEvent) => { if (pillRef.current?.contains(e.target as Node)) { engaged = true; window.clearTimeout(stillT); } };
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget && activeRef.current) { px = -1; closeSoon(); } };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("scroll", queue, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(stillT);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", queue);
      document.removeEventListener("mouseout", onOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverCapable]);

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
            data-key={item.key}
            onFocus={hoverCapable ? (e) => {
              keepOpen();
              const r = e.currentTarget.getBoundingClientRect();
              painted.current = null;
              placePill(r.left + r.width / 2, r.top + r.height / 2, item.key, true);
              setActive(item.key);
            } : undefined}
            onBlur={hoverCapable ? closeSoon : undefined}
            /* Touch path: tap toggles the centered popup — tap the same
               item again (or it's already active) to fade it back out. */
            onClick={hoverCapable ? press : () => {
              if (active === item.key) press();
              else setActive(item.key);
            }}
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
          onClick={press}
        >
          <div className="hover-bag__pill-inner">
            {activeItem && renderPillVariant(activeItem.key, bump)}
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
          onClick={press}
        >
          <div className="hover-bag__pill-inner">
            {activeItem && renderPillVariant(activeItem.key, bump)}
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

function renderPillVariant(key: string, bump: number): React.ReactNode {
  switch (key) {
    case "usagi":
      return <BagReceipt bump={bump} />;
    case "ipad":
      return <BagDoodles bump={bump} />;
    case "ticket":  return <BagTrips bump={bump} />;
    case "earbuds": return <BagPlaylist bump={bump} />;
    case "phone":   return <PillFriends bump={bump} />;
    case "laptop":  return <PillGames bump={bump} />;
    default:        return null;
  }
}

type OrbitArtwork = {
  src: string;
  /** Tile colour behind this particular art. The game logos are
   *  22–74% transparent, so this reads as part of the artwork rather
   *  than a generic dark well — each one is pulled from that game's
   *  own palette, darkened so the (mostly bright) logo still pops. */
  bg?: string;
};

type OrbitIcon = {
  label: string;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  /** One artwork, or several that crossfade in place on a timer (the
   *  Pokémon tile rotates through her current titles this way while
   *  League and TFT hold still). Omit for a placeholder slot. */
  art?: OrbitArtwork[];
  /** Wordmark-style art (a wide logo rather than square cover art) —
   *  gets inset inside the tile so it doesn't run to the edges. */
  inset?: boolean;
};

/** How long each artwork in an alternating tile holds before crossfading. */
const ALT_SLOT_SECONDS = 2.8;

/* One tile of the cluster. Owns both the crossfade index and the tile
   colour, since the two change together — the container has to follow
   whichever game is currently showing. A single artwork just sits at
   opacity 1 with no timer running. */
function OrbitTile({
  icon,
  float,
  bump,
}: {
  bump: number;
  icon: OrbitIcon;
  float: { dur: number; amp: number; delay: number };
}) {
  const art = icon.art ?? [];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (art.length < 2) return;
    const id = window.setInterval(
      () => setShown((prev) => (prev + 1) % art.length),
      ALT_SLOT_SECONDS * 1000
    );
    return () => window.clearInterval(id);
  }, [art.length, bump]);
  // a click shows the next title now (and restarts the timer above)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (art.length > 1) setShown((prev) => (prev + 1) % art.length);
  }, [bump, art.length]);

  return (
    <div
      className="pill-orbit__item"
      style={{
        top: icon.top,
        left: icon.left,
        right: icon.right,
        // Static tilt on the individual `rotate` property — kept
        // apart from the `translate` property that floatBob
        // animates, so the two never override each other.
        rotate: `${icon.rotate}deg`,
        backgroundColor: art[shown]?.bg,
        ["--icon-float-amp" as string]: `${float.amp}px`,
        animationDuration: `${float.dur}s`,
        animationDelay: `${float.delay}s`,
      }}
    >
      {art.length > 0 ? (
        <span className={`image-slot has-image${icon.inset ? " pill-orbit__art-inset" : ""}`}>
          {art.map((a, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={a.src}
              src={`${BASE_PATH}${a.src}`}
              alt=""
              className={`pill-orbit__art${i === shown ? " is-on" : ""}`}
              draggable={false}
            />
          ))}
        </span>
      ) : (
        <span className="image-slot">{icon.label}</span>
      )}
    </div>
  );
}

/* Independent float timing per icon/caption slot, so the three icons
   and the caption card each bob at their own pace instead of moving
   together as one rigid unit. Set via inline animation-duration/-delay
   plus a --icon-float-amp custom property (read by the shared
   @keyframes floatBob in globals.css, which animates the `translate`
   property — kept separate from `rotate`/`transform` so it never
   fights each element's own static tilt). */
const ICON_FLOAT = [
  { dur: 3.0, amp: 5, delay: 0 },
  { dur: 3.7, amp: 7, delay: 0.35 },
  { dur: 4.3, amp: 4, delay: 0.6 },
];
const CAPTION_FLOAT = { dur: 3.9, amp: 3, delay: 0.15 };

/* Music + Games only — instead of one photo in a paper card, three
   equal-size bare "icon" squares (each its own shadowed silhouette, no
   shared card) sit in a loose, hand-set triangle, with the caption
   nested as its own small card in the negative space between them.
   The icon shape itself is the pill; there's no outer wrapper card. */
function PillOrbit({
  icons,
  meta,
  caption,
  rotate = 0,
  captionTop,
  captionLeft,
  captionRotate = 0,
  bump = 0,
  shiftOnBump = false,
}: {
  bump?: number;
  shiftOnBump?: boolean;
  icons: OrbitIcon[];
  meta?: string;
  caption: React.ReactNode;
  rotate?: number;
  captionTop: string;
  captionLeft: string;
  captionRotate?: number;
}) {
  return (
    <div className="pill-orbit" style={{ ["--rot" as string]: `${rotate}deg` }}>
      {icons.map((icon, i) => {
        // music: each click passes the covers round to the next tile
        const art = shiftOnBump ? icons[(i + bump) % icons.length].art : icon.art;
        return <OrbitTile key={i} icon={{ ...icon, art }} float={ICON_FLOAT[i % ICON_FLOAT.length]} bump={bump} />;
      })}
      <div
        className="pill-orbit__caption"
        style={{
          top: captionTop,
          left: captionLeft,
          // Centering + tilt stay on the `transform` shorthand; the
          // bob runs on the separate `translate` property, which
          // composes on top instead of overriding this.
          transform: `translate(-50%, -50%) rotate(${captionRotate}deg)`,
          ["--icon-float-amp" as string]: `${CAPTION_FLOAT.amp}px`,
          animationDuration: `${CAPTION_FLOAT.dur}s`,
          animationDelay: `${CAPTION_FLOAT.delay}s`,
        }}
      >
        {meta && <span className="pill-polaroid__meta">{meta}</span>}
        <span className="pill-polaroid__line">{caption}</span>
      </div>
    </div>
  );
}

const POP_UP = "/img/bag/pop_up";

type PhotoCard = { src: string; w: number; h: number };

/** Largest this photo can be inside `maxW` x `maxH` without being
 *  cropped or distorted. */
function fitPhoto(photo: PhotoCard, maxW: number, maxH: number) {
  const ratio = photo.w / photo.h;
  const width = Math.round(Math.min(maxW, maxH * ratio));
  return { width, height: Math.round(width / ratio) };
}

/* Real photos, so each card can take its own aspect ratio rather than
   being forced into the polaroid's square photo well. Dimensions are
   baked in (rather than measured at runtime) so a card is the right
   shape on its very first painted frame — no reflow once the image
   decodes. */
const FRIEND_PHOTOS: PhotoCard[] = [
  { src: `${POP_UP}/friends/1.webp`, w: 757, h: 900 },
  { src: `${POP_UP}/friends/2.webp`, w: 900, h: 675 },
  { src: `${POP_UP}/friends/3.webp`, w: 900, h: 675 },
  { src: `${POP_UP}/friends/4.webp`, w: 669, h: 900 },
  { src: `${POP_UP}/friends/5.webp`, w: 900, h: 781 },
  { src: `${POP_UP}/friends/6.webp`, w: 900, h: 806 },
  { src: `${POP_UP}/friends/7.webp`, w: 900, h: 702 },
  { src: `${POP_UP}/friends/8.webp`, w: 900, h: 550 },
  { src: `${POP_UP}/friends/9.webp`, w: 900, h: 699 },
  { src: `${POP_UP}/friends/10.webp`, w: 693, h: 900 },
  { src: `${POP_UP}/friends/11.webp`, w: 619, h: 900 },
  { src: `${POP_UP}/friends/12.webp`, w: 778, h: 900 },
];

/* Friends — four prints at a time on a scattered table, drawn from
   twelve places around a fixed caption. Only four places are occupied
   at once, so a print that's taken away comes back somewhere else and
   the arrangement never repeats. No two places share an x or a y
   value, which is what keeps the four from ever lining up into rows.

   The geometry is verified rather than eyeballed: working from the
   widest padded bounding box a print can have once rotated (135.6 x
   123.4 for a 116x102 print at up to 7 degrees, including the 4px the
   paper edge spreads past the element), all 66 pairs of places were
   checked against each other and the caption. Prints may tuck under
   the caption and clip each other, but only by a sliver — that
   allowance is what pays for their size. 81 four-place arrangements
   are legal, the worst clip in any of them is 24px, and from every one
   of them every print has two places it can legally move to, so the
   shuffle can never paint itself into a corner. */
const SCATTER_MOVE_MS = 1600;
/** Exit is deliberately quicker than entrance. */
const SCATTER_FADE_MS = 190;
const SCATTER_W = 300;
const SCATTER_H = 288;
const SCATTER_CARDS = 4;
/** Every print is fitted into this box, so none is ever larger. */
const PRINT_W = 116;
const PRINT_H = 102;
const MAX_OVERLAP = 26;
/** How far a print travels along its corner diagonal on the way out. */
const CORNER_TRAVEL = 58;
/** Worst-case padded bbox for a print at up to 7 degrees. */
const BOX_W = 135.6;
const BOX_H = 123.4;
/** Anything above this line is in the band above the caption. */
const TOP_BAND_MAX_Y = 100;

/* Idle drift, one entry per SLOT rather than per photo — the elements
   are keyed by slot index, so a print keeps its own rhythm as photos
   rotate through it instead of restarting the animation on every deal.
   No two durations share a small-integer ratio, so the five pieces
   never fall back into step.

   Amplitude is free here in a way it wasn't for the doodles: floatBob
   only ever raises a print, and SCATTER_COMPATIBLE turns out to be
   decided by HORIZONTAL overlap for every marginal pair on this board
   (the spots are staggered only ~12px apart in x, so `ox` is always
   the smaller dimension). Vertical drift therefore can't push any
   allowed pair past MAX_OVERLAP.

   The caption gets the smallest travel of the five: the prints tuck
   under its edges, so a large movement there would open and close
   gaps around the text. */
const SCATTER_FLOAT = [
  { dur: 3.8, amp: 5, delay: 0 },
  { dur: 4.6, amp: 4, delay: 0.55 },
  { dur: 5.3, amp: 6, delay: 1.1 },
  { dur: 4.1, amp: 5, delay: 1.7 },
];
const SCATTER_CAPTION_FLOAT = { dur: 5.9, amp: 3, delay: 0.3 };

type ScatterSpot = { x: number; y: number; rot: number };

/* Six places above the caption, six below. The top band's y values are
   the bottom band's distances from the caption, mirrored — so a print
   above the text sits exactly as close to it as one below. They were
   previously anchored near the top of the stage, which left them
   14-26px off the caption while the bottom band was 10px under to 2px
   off it: the lower prints read as hugging the text and the upper ones
   as floating away from it. Both bands now range from 10px tucked
   under to 2px clear. */
const SCATTER_SPOTS: ScatterSpot[] = [
  { x: 0, y: 36, rot: -7 },
  { x: 12, y: 31, rot: 5 },
  { x: 24, y: 26, rot: -3 },
  { x: 136, y: 34, rot: 6 },
  { x: 146, y: 29, rot: -5 },
  { x: 156, y: 24, rot: 3 },
  { x: 6, y: 150, rot: 4 },
  { x: 18, y: 155, rot: -6 },
  { x: 30, y: 160, rot: 3 },
  { x: 142, y: 152, rot: -4 },
  { x: 152, y: 157, rot: 6 },
  { x: 162, y: 162, rot: -5 },
];

/** Two places can hold prints at the same time if their boxes miss
 *  each other, or clip by no more than a sliver. */
const SCATTER_COMPATIBLE: boolean[][] = SCATTER_SPOTS.map((a) =>
  SCATTER_SPOTS.map((b) => {
    const ox = Math.min(a.x + BOX_W, b.x + BOX_W) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + BOX_H, b.y + BOX_H) - Math.max(a.y, b.y);
    if (ox <= 0 || oy <= 0) return true;
    return Math.min(ox, oy) <= MAX_OVERLAP;
  })
);

type ScatterCard = { photo: number; spot: number; out: boolean };

/** Deterministic opening hand — server and client have to agree, so
 *  the shuffling only begins once mounted. */
const SCATTER_OPENING: ScatterCard[] = [
  { photo: 0, spot: 0, out: false },
  { photo: 1, spot: 4, out: false },
  { photo: 2, spot: 8, out: false },
  { photo: 3, spot: 9, out: false },
];

function PillScatter({
  photos,
  meta,
  caption,
  bump = 0,
}: {
  bump?: number;
  photos: PhotoCard[];
  meta?: string;
  caption: React.ReactNode;
}) {
  const [cards, setCards] = useState<ScatterCard[]>(SCATTER_OPENING);
  const dealBeat = useRef(0);
  /* Clicking a print swaps just that photo for one not on the table. */
  const swapPrint = (i: number, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    slap(e.currentTarget);
    setCards((prev) => {
      const showing = prev.map((c) => c.photo);
      let next = prev[i].photo;
      do next = (next + 1) % photos.length; while (showing.includes(next));
      return prev.map((c, k) => (k === i ? { ...c, photo: next } : c));
    });
  };
  const dealArmed = useRef(false);

  // Warm the cache for the photos not on the table yet, so a print
  // never arrives as an empty frame.
  useEffect(() => {
    photos.forEach((p) => {
      const img = new window.Image();
      img.src = `${BASE_PATH}${p.src}`;
    });
  }, [photos]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let beat = dealBeat.current;
    let settle = 0;

    const deal = () => {
      const moving = beat % SCATTER_CARDS;
      beat += 1;

      // Take it off the table first; its place and photo change while
      // it's invisible, so no arrival path ever crosses the caption.
      setCards((prev) => prev.map((c, i) => (i === moving ? { ...c, out: true } : c)));

      settle = window.setTimeout(() => {
        setCards((prev) => {
          const others = prev.filter((_, i) => i !== moving).map((c) => c.spot);
          const options = SCATTER_SPOTS.map((_, s) => s).filter(
            (s) =>
              s !== prev[moving].spot &&
              !others.includes(s) &&
              others.every((o) => SCATTER_COMPATIBLE[s][o])
          );
          const spot = options.length
            ? options[Math.floor(Math.random() * options.length)]
            : prev[moving].spot;
          return prev.map((c, i) =>
            i === moving
              ? { photo: (c.photo + SCATTER_CARDS) % photos.length, spot, out: false }
              : c
          );
        });
      }, SCATTER_FADE_MS);
      dealBeat.current = beat;
    };
    // a click deals the next print now and restarts the rhythm
    if (dealArmed.current) deal(); else dealArmed.current = true;
    const id = window.setInterval(deal, SCATTER_MOVE_MS);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(settle);
    };
  }, [photos.length, bump]);

  return (
    <div className="pill-scatter">
      {cards.map((card, i) => {
        const spot = SCATTER_SPOTS[card.spot];
        const photo = photos[card.photo];
        const size = fitPhoto(photo, PRINT_W, PRINT_H);
        const isTop = spot.y < TOP_BAND_MAX_Y;
        const left = spot.x + (PRINT_W - size.width) / 2;
        /* Centred horizontally, but pushed vertically TOWARDS the
           caption — bottom-aligned above it, top-aligned below. A
           landscape photo is shorter than its box, and centring would
           leave that slack on the caption side, floating the print
           away from the text. */
        const top = spot.y + (isTop ? PRINT_H - size.height : 0);

        /* A print leaves towards, and returns from, whichever corner
           of the card it is nearest — measured from its own centre, so
           a wide photo and a tall one in the same place still pick the
           right one. A fixed distance ALONG that diagonal, so all four
           travel the same amount and read as one gesture. */
        const cx = left + size.width / 2;
        const cy = top + size.height / 2;
        const vx = (cx < SCATTER_W / 2 ? 0 : SCATTER_W) - cx;
        const vy = (cy < SCATTER_H / 2 ? 0 : SCATTER_H) - cy;
        const len = Math.hypot(vx, vy) || 1;

        return (
          <span
            key={i}
            className={`pill-scatter__print${card.out ? " is-out" : ""}`}
            onClick={(e) => swapPrint(i, e)}
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              ["--rot" as string]: `${spot.rot}deg`,
              ["--to-x" as string]: `${Math.round((vx / len) * CORNER_TRAVEL)}px`,
              ["--to-y" as string]: `${Math.round((vy / len) * CORNER_TRAVEL)}px`,
              // Tips the way it's travelling, so the diagonal reads as
              // a direction rather than a slide sideways.
              ["--spin" as string]: `${vx > 0 ? 5 : -5}deg`,
              /* Its own bob. Runs on the individual `translate`
                 property, so it layers over the `transform` that
                 carries this print's tilt and its exit travel rather
                 than overwriting either. */
              ["--icon-float-amp" as string]: `${SCATTER_FLOAT[i].amp}px`,
              animationDuration: `${SCATTER_FLOAT[i].dur}s`,
              animationDelay: `${SCATTER_FLOAT[i].delay}s`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}${photo.src}`}
              alt=""
              width={photo.w}
              height={photo.h}
              draggable={false}
            />
          </span>
        );
      })}

      {/* The caption drifts too, on the slowest and shallowest rhythm
          of the five — it stays the anchor the prints are arranged
          around, but a completely static centre made the drifting
          prints read as sliding past a pinned label rather than
          everything resting on one surface. */}
      <div
        className="pill-scatter__caption"
        style={{
          ["--icon-float-amp" as string]: `${SCATTER_CAPTION_FLOAT.amp}px`,
          animationDuration: `${SCATTER_CAPTION_FLOAT.dur}s`,
          animationDelay: `${SCATTER_CAPTION_FLOAT.delay}s`,
        }}
      >
        {meta && <span className="pill-polaroid__meta">{meta}</span>}
        <span className="pill-polaroid__line">{caption}</span>
      </div>
    </div>
  );
}

function PillFriends({ bump }: { bump: number }) {
  return (
    <PillScatter
      bump={bump}
      photos={FRIEND_PHOTOS}
      meta="friends"
      caption={COPY.friends}
    />
  );
}


function PillGames({ bump }: { bump: number }) {
  return (
    <PillOrbit
      bump={bump}
      rotate={-2}
      meta="what i'm playing"
      caption={COPY.games}
      icons={[
        {
          label: "League of Legends",
          top: "-4%",
          left: "8%",
          rotate: -8,
          // Hextech navy, the dark blue already in League's own crest.
          art: [{ src: `${POP_UP}/games/League.webp`, bg: "#0C2438" }],
        },
        {
          label: "Teamfight Tactics",
          top: "6%",
          right: "-2%",
          rotate: 11,
          // TFT's gold wordmark over its dark indigo board.
          art: [{ src: `${POP_UP}/games/TFT.webp`, bg: "#241C38" }],
        },
        {
          // League and TFT hold still; the Pokémon tile rotates through
          // whichever titles are in play, and its colour follows along.
          label: "Pokémon",
          top: "37%",
          left: "23%",
          rotate: 6,
          inset: true,
          art: [
            { src: `${POP_UP}/games/Pokemon/Z-A.webp`, bg: "#25353A" },
            { src: `${POP_UP}/games/Pokemon/Pokopia.webp`, bg: "#1E3320" },
            { src: `${POP_UP}/games/Pokemon/Violet.webp`, bg: "#2C1338" },
            { src: `${POP_UP}/games/Pokemon/Arceus.webp`, bg: "#22343C" },
          ],
        },
      ]}
      captionTop="41%"
      captionLeft="55%"
      captionRotate={1.5}
    />
  );
}
