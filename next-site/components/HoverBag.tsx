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

  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { prefersReducedMotionRef.current = mq.matches; };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Sideways "lean" — the pill tips opposite the cursor's horizontal
     motion, like a sign swinging from where it's held (its
     transform-origin is the bottom-left corner, same anchor the cursor
     sits at — see the entrance-scale comment below), settling back
     level a beat after the mouse stops moving. Kept on the individual
     `rotate` property, set directly via the DOM ref rather than
     through React state, so it never triggers a re-render and never
     fights `.hover-bag__pill`'s own `transform: scale()` entrance. */
  const leanTimeout = useRef<number | null>(null);
  const LEAN_SENSITIVITY = 0.6; // deg of lean per px of horizontal movement
  const LEAN_MAX = 7; // deg, clamped so a fast swipe can't over-rotate it

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

    if (!prefersReducedMotionRef.current) {
      // No previous position for THIS hover session (fresh mouseenter,
      // since onMouseLeave/onBlur null it out below) means no lean yet
      // — otherwise the jump between two different bag items would
      // read as one big spurious kick.
      const dx = lastPos.current ? clientX - lastPos.current.x : 0;
      const lean = Math.max(-LEAN_MAX, Math.min(LEAN_MAX, -dx * LEAN_SENSITIVITY));
      pill.style.rotate = `${lean}deg`;
      if (leanTimeout.current) window.clearTimeout(leanTimeout.current);
      leanTimeout.current = window.setTimeout(() => {
        if (pillRef.current) pillRef.current.style.rotate = "0deg";
      }, 140);
    }

    lastPos.current = { x: clientX, y: clientY };
    const card = pill.firstElementChild as HTMLElement | null;
    // Fallback matches .pill-polaroid / .pill-deck's own width (190)
    // and roughly the polaroid's natural rendered height — only used
    // for the very first frame, before the real DOM has been measured.
    const w = card?.offsetWidth || 190;
    const h = card?.offsetHeight || 250;
    const margin = 12;
    // Every popup is a uniform polaroid now, so a single gap works
    // for all six (the old per-key tighter gap was tuned for the
    // music pill's flanking notes, which no longer exist).
    const gap = 16;
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
            onMouseLeave={hoverCapable ? () => {
              setActive(null);
              // Fresh start for whichever item is hovered next — see
              // the comment in placePill on why this matters for lean.
              lastPos.current = null;
              if (leanTimeout.current) window.clearTimeout(leanTimeout.current);
              if (pillRef.current) pillRef.current.style.rotate = "0deg";
            } : undefined}
            onFocus={hoverCapable ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              placePill(r.left + r.width / 2, r.top + r.height / 2, item.key);
              setActive(item.key);
            } : undefined}
            onBlur={hoverCapable ? () => {
              setActive(null);
              lastPos.current = null;
              if (leanTimeout.current) window.clearTimeout(leanTimeout.current);
              if (pillRef.current) pillRef.current.style.rotate = "0deg";
            } : undefined}
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

/* All six popups now share one shape — a polaroid: a photo area
   (currently an .image-slot placeholder, ready for real photos later)
   over a hand-captioned line, matching the hero polaroid's look.
   Friends and travel use a "deck" of these instead of one — a couple
   of static polaroids peek out behind as texture while the real cards
   take turns flipping to the front on a timer. */

function PillPolaroid({
  label,
  caption,
  meta,
  rotate = 0,
}: {
  label: string;
  caption: React.ReactNode;
  meta?: string;
  rotate?: number;
}) {
  return (
    <div className="pill-polaroid" style={{ ["--rot" as string]: `${rotate}deg` }}>
      <div className="pill-polaroid__photo">
        <span className="image-slot">{label}</span>
      </div>
      <div className="pill-polaroid__caption">
        {meta && <span className="pill-polaroid__meta">{meta}</span>}
        <span className="pill-polaroid__line">{caption}</span>
      </div>
    </div>
  );
}

type OrbitIcon = {
  label: string;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
};

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
}: {
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
        const float = ICON_FLOAT[i % ICON_FLOAT.length];
        return (
          <div
            key={i}
            className="pill-orbit__item"
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
              // Static tilt on the individual `rotate` property — kept
              // apart from the `translate` property that floatBob
              // animates, so the two never override each other.
              rotate: `${icon.rotate}deg`,
              ["--icon-float-amp" as string]: `${float.amp}px`,
              animationDuration: `${float.dur}s`,
              animationDelay: `${float.delay}s`,
            }}
          >
            <span className="image-slot">{icon.label}</span>
          </div>
        );
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

type DeckCard = {
  label: string;
  caption: React.ReactNode;
  meta?: string;
  rotate?: number;
};

/* Each card in a deck runs the same 3-position shuffle (front / mid /
   back — see @keyframes deckShuffle in globals.css), offset by a
   negative delay of one DECK_SLOT_SECONDS window per card so they're
   always a step apart in the cycle — one card is front, one is mid,
   one is back, and they continuously rotate through those slots like
   a hand of cards being worked through. */
const DECK_SLOT_SECONDS = 3.6;

/* Independent float timing per card slot, layered on top of each
   card's own deckShuffle choreography — see the shared @keyframes
   floatBob comment on ICON_FLOAT above for how this composes without
   fighting deckShuffle's `transform`. */
const CARD_FLOAT = [
  { dur: 3.2, amp: 5, delay: 0 },
  { dur: 3.9, amp: 4, delay: 0.3 },
  { dur: 4.5, amp: 6, delay: 0.55 },
];

function PillPolaroidDeck({ cards }: { cards: DeckCard[] }) {
  const cycle = cards.length * DECK_SLOT_SECONDS;
  return (
    <div className="pill-deck">
      {cards.map((c, i) => {
        const float = CARD_FLOAT[i % CARD_FLOAT.length];
        return (
        <div
          key={i}
          className="pill-deck__front pill-polaroid"
          style={{
            ["--rot" as string]: `${c.rotate ?? 0}deg`,
            ["--icon-float-amp" as string]: `${float.amp}px`,
            // Comma-paired: deckShuffle's duration/delay first, then
            // floatBob's — matches the animation-name order in CSS.
            animationDuration: `${cycle}s, ${float.dur}s`,
            animationDelay: `${-(i * DECK_SLOT_SECONDS)}s, ${float.delay}s`,
          }}
        >
          <div className="pill-polaroid__photo">
            <span className="image-slot">{c.label}</span>
          </div>
          <div className="pill-polaroid__caption">
            {c.meta && <span className="pill-polaroid__meta">{c.meta}</span>}
            <span className="pill-polaroid__line">{c.caption}</span>
          </div>
        </div>
        );
      })}
    </div>
  );
}

function PillMusic() {
  return (
    <PillOrbit
      rotate={-3}
      meta="now playing"
      caption={<>Mostly <strong>CPOP / KPOP / JPOP</strong> — <strong>LBI利比</strong> on repeat</>}
      icons={[
        { label: "Photo — music 1", top: "5%", left: "-3%", rotate: -13 },
        { label: "Photo — music 2", top: "-7%", right: "8%", rotate: 7 },
        { label: "Photo — music 3", top: "40%", left: "37%", rotate: 8 },
      ]}
      captionTop="39%"
      captionLeft="46%"
      captionRotate={-2}
    />
  );
}

function PillFriends() {
  return (
    <PillPolaroidDeck
      cards={[
        { label: "Photo — friends 1", meta: "friends", caption: "photos of friends", rotate: -3 },
        { label: "Photo — friends 2", meta: "friends", caption: "photos of friends", rotate: 2 },
        { label: "Photo — friends 3", meta: "friends", caption: "photos of friends", rotate: -2 },
      ]}
    />
  );
}

function PillFood() {
  return (
    <PillPolaroid
      label="Photo — food"
      meta="one dish at a time"
      rotate={4}
      caption="always down to share a plate"
    />
  );
}

function PillTravel() {
  return (
    <PillPolaroidDeck
      cards={[
        { label: "Photo — China", meta: "China", caption: "where it started", rotate: -3 },
        { label: "Photo — Japan", meta: "Japan", caption: "spring trip", rotate: 2 },
        { label: "Photo — Hong Kong", meta: "Hong Kong", caption: "food + family", rotate: -2 },
      ]}
    />
  );
}

function PillGames() {
  return (
    <PillOrbit
      rotate={-2}
      meta="what i'm playing"
      caption="Pokémon, League, and TFT"
      icons={[
        { label: "Photo — Pokémon", top: "-4%", left: "8%", rotate: -8 },
        { label: "Photo — League", top: "6%", right: "-2%", rotate: 11 },
        { label: "Photo — TFT", top: "37%", left: "23%", rotate: 6 },
      ]}
      captionTop="41%"
      captionLeft="55%"
      captionRotate={1.5}
    />
  );
}

function PillArt() {
  return (
    <PillPolaroid
      label="Photo — art"
      meta="doodles of college to rmr"
      rotate={3}
      caption="I like to capture memories through sharing my vision with others"
    />
  );
}
