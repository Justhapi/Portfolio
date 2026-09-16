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
}: {
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
  }, [art.length]);

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
      {icons.map((icon, i) => (
        <OrbitTile key={i} icon={icon} float={ICON_FLOAT[i % ICON_FLOAT.length]} />
      ))}
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
}: {
  photos: PhotoCard[];
  meta?: string;
  caption: React.ReactNode;
}) {
  const [cards, setCards] = useState<ScatterCard[]>(SCATTER_OPENING);

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
    let beat = 0;
    let settle = 0;

    const id = window.setInterval(() => {
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
    }, SCATTER_MOVE_MS);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(settle);
    };
  }, [photos.length]);

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

      {/* Deliberately static — it is the one thing on the card that
          never changes, so it never animates. */}
      <div className="pill-scatter__caption">
        {meta && <span className="pill-polaroid__meta">{meta}</span>}
        <span className="pill-polaroid__line">{caption}</span>
      </div>
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
        // Square cover art fills its tile edge to edge, so these keep
        // the default dark tile colour — none of it shows.
        { label: "LBI 利比", top: "5%", left: "-3%", rotate: -13, art: [{ src: `${POP_UP}/music/LBI.webp` }] },
        { label: "Ashley", top: "-7%", right: "8%", rotate: 7, art: [{ src: `${POP_UP}/music/Ashley.webp` }] },
        { label: "F/ACE", top: "40%", left: "37%", rotate: 8, art: [{ src: `${POP_UP}/music/FACE.webp` }] },
      ]}
      captionTop="39%"
      captionLeft="46%"
      captionRotate={-2}
    />
  );
}

function PillFriends() {
  return (
    <PillScatter
      photos={FRIEND_PHOTOS}
      meta="friends"
      caption="photos of friends"
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

/* The programs the doodles are drawn in, stamped down the print's right
   edge like tabs on a folder — which keeps the whole bottom of the card
   clear for the caption. Each is its own stamp with its own paper edge
   and tilt; they deliberately don't overlap. */
const ART_TOOLS = [
  /* Each badge drifts on its own speed and travel, distinct from each
     other and from the print's 4.4s — that difference is the whole
     point: matching rhythms would read as one rigid object again. */
  {
    name: "Procreate",
    src: `${POP_UP}/doodles/Procreate.webp`,
    float: { dur: 3.1, amp: 7, delay: 0.25 },
  },
  {
    name: "Clip Studio Paint",
    src: `${POP_UP}/doodles/CSP.webp`,
    float: { dur: 3.8, amp: 5, delay: 0.55 },
  },
];

function PillArt() {
  return (
    <div className="pill-art">
      <PillPolaroid
        label="Photo — art"
        meta="doodles of college to rmr"
        rotate={3}
        caption="I like to capture memories through sharing my vision with others"
      />
      {ART_TOOLS.map((tool, i) => (
        <span
          key={tool.src}
          className={`pill-art__badge pill-art__badge--${i === 0 ? "a" : "b"}`}
          style={{
            ["--icon-float-amp" as string]: `${tool.float.amp}px`,
            // Comma-paired: the entrance first, then the idle float —
            // matching the animation-name order in globals.css.
            animationDuration: `260ms, ${tool.float.dur}s`,
            animationDelay: `${i * 80}ms, ${tool.float.delay}s`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE_PATH}${tool.src}`} alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}
