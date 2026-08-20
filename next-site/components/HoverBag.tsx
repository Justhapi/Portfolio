"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HoverBag — layered bag illustration with hoverable items.
 *
 * The bag is composed of 10 transparent PNG layers stacked in z-order
 * (one_earbud_1 on top, ten_back_bag at the bottom). Six of the items
 * (earbuds, ticket, usagi, phone, laptop, ipad) are interactive:
 * hovering the item's bounding zone shows a pill near the cursor
 * (same interaction model as HoverWord in the About body), and the
 * hovered item's layer(s) animate per its own hoverEffect:
 *   - laptop, ipad → lift straight up
 *   - earbuds, ticket, phone, usagi → tilt around a specific corner
 *
 * Entrance: the whole stack slides in from the left with a cartoonish
 * bounce on scroll-into-view (via .reveal / .in from RevealOnScroll).
 * No per-layer drag — the stack moves as a rigid unit.
 *
 * Debug mode: pass `debug` prop to outline hit zones with dashed
 * borders + labels — for tuning zone positions without inspecting
 * DevTools.
 */

type HoverEffect = "lift" | "tilt-left" | "tilt-right";

type Item = {
  key: string;
  label: string;
  layers: string[];
  hoverEffect: HoverEffect;
  zone: { x: number; y: number; w: number; h: number };
  /* Per-item pill placement — tuned by hand so each item's pill sits
     in a visually pleasing spot that doesn't cover the item itself.
     xPct / yPct are percentages of the .hover-bag__stack bounds (same
     coordinate system as `zone`), and describe where the pill's CENTRE
     should land. E.g. { xPct: 50, yPct: 42 } → pill centre sits at the
     illustration's horizontal middle, 42% down. */
  pillOffset: { xPct: number; yPct: number };
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

/* ITEMS — per-item hit zone + per-item pill placement.
   ───────────────────────────────────────────────────────────────────
   `pillOffset` = { xPct, yPct } is the pill CENTRE, expressed as
   percentages of the .hover-bag__stack rect (same coord system as
   `zone`). Tune these visually per item — starting values below place
   each pill in the bag's empty pocket area, away from the item's own
   position. Adjust in browser (Cmd+R to reload after each tweak).

   Reference for eyeballing (zones in stack %):
     ipad     — top-center-left    (x 23-47, y  2-19)
     laptop   — top-center-right   (x 48-85, y  0-18)
     phone    — right-mid          (x 67-84, y 36-59)
     ticket   — front pocket       (x 44-58, y 54-74)
     usagi    — right-bottom hang  (x 63-73, y 63-98)
     earbuds  — left-bottom hang   (x  4-24, y 60-87)                */
const ITEMS: Item[] = [
  {
    key: "ipad",
    label: "art",
    layers: ["eight_ipad"],
    hoverEffect: "lift",
    zone: { x: 23, y:  2, w: 24, h: 17 },
    pillOffset: { xPct: 50, yPct: 55 },
  },
  {
    key: "laptop",
    label: "games",
    layers: ["nine_laptop"],
    hoverEffect: "lift",
    zone: { x: 48, y:  0, w: 37, h: 18 },
    pillOffset: { xPct: 45, yPct: 55 },
  },
  {
    key: "phone",
    label: "friends",
    layers: ["five_phone"],
    hoverEffect: "lift",
    zone: { x: 67, y: 36, w: 17, h: 23 },
    pillOffset: { xPct: 35, yPct: 40 },
  },
  {
    key: "ticket",
    label: "travel",
    layers: ["six_ticket"],
    hoverEffect: "tilt-right",
    zone: { x: 44, y: 54, w: 14, h: 20 },
    pillOffset: { xPct: 50, yPct: 25 },
  },
  {
    key: "usagi",
    label: "food",
    layers: ["three_usagi"],
    hoverEffect: "tilt-right",
    zone: { x: 63, y: 63, w: 10, h: 35 },
    pillOffset: { xPct: 35, yPct: 35 },
  },
  {
    key: "earbuds",
    label: "music",
    layers: ["one_earbud_1", "two_earbud_2"],
    hoverEffect: "tilt-left",
    zone: { x:  4, y: 60, w: 20, h: 27 },
    pillOffset: { xPct: 55, yPct: 35 },
  },
];

const EFFECT_CLASS: Record<HoverEffect, string> = {
  "lift":       "is-lifted",
  "tilt-left":  "is-tilted-left",
  "tilt-right": "is-tilted-right",
};

/* Pill placement is now driven per-item via ITEMS[i].pillOffset — see
   the ITEMS array below. No shared anchor / no algorithmic overlap
   avoidance — each item's pill position is hand-tuned. */

/**
 * GitHub Pages serves the site under /Portfolio/, so raw <img src="/…"> paths
 * 404 in production. Next's basePath is applied to routing / next/link / next/image
 * automatically, but NOT to plain <img> tags. Prepend manually to match the
 * pattern already used elsewhere in the repo (see HANDOVER.md → GitHub Pages / basePath).
 */
const BASE_PATH = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

export default function HoverBag({ debug = false }: { debug?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  /* Anchor for pill positioning — the direct visual container of the
     bag illustration (parent of the layer <img>s). Using this instead
     of the outer .hover-bag container avoids the pill drifting into
     the empty grid space to the right of the artwork. */
  const stackRef = useRef<HTMLDivElement | null>(null);
  /* Gate the entire pill interaction to hover-capable pointers. Touch
     users can't hover, so all 6 pill variants + the cursor-follow shell
     are dead weight on mobile — no display + no listeners saves CSS
     evaluation and JS work on the platform that most needs both.
     Default true (SSR + before hydration) so hover-capable devices see
     the pill instantly on first hover; useEffect corrects on touch. */
  const [hoverCapable, setHoverCapable] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /**
   * Position the pill using the hovered item's hand-tuned pillOffset.
   * X/Y are read as percentages of the .hover-bag__stack rect (same
   * coord system as `zone`) and describe the pill's CENTRE. Anchoring
   * to the stack (not the outer .hover-bag) keeps the pill visually
   * pinned to the bag artwork regardless of surrounding whitespace.
   *
   * Called on hover-enter / focus and on resize — NOT on mousemove.
   * Viewport clamp is the only safety net; per-item positions are the
   * source of truth. Tune the numbers in ITEMS[].pillOffset above.
   */
  const positionPill = (item: Item | null | undefined) => {
    const pill = pillRef.current;
    const stack = stackRef.current;
    if (!pill || !stack || !item) return;
    const pillRect = pill.getBoundingClientRect();
    // getBoundingClientRect can return 0×0 on first paint before the
    // pill has been laid out. Fall back to shell dimensions (240×170)
    // matching the CSS so positioning still works on the very first frame.
    const pillW = pillRect.width || 240;
    const pillH = pillRect.height || 170;
    const stackRect = stack.getBoundingClientRect();

    // Pill centre lands at (xPct, yPct) of the stack; convert to the
    // pill's top-left for style.left/top writes.
    const centreX = stackRect.left + stackRect.width * (item.pillOffset.xPct / 100);
    const centreY = stackRect.top + stackRect.height * (item.pillOffset.yPct / 100);
    const desiredX = centreX - pillW / 2;
    const desiredY = centreY - pillH / 2;

    // Viewport clamp — safety net so the pill never leaves the screen
    // even if a hand-tuned offset overflows on small viewports.
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - pillW - margin);
    const maxY = Math.max(margin, window.innerHeight - pillH - margin);
    const clampedX = Math.min(Math.max(desiredX, margin), maxX);
    const clampedY = Math.min(Math.max(desiredY, margin), maxY);
    pill.style.left = `${clampedX}px`;
    pill.style.top = `${clampedY}px`;
  };

  /* Reposition on window resize while a pill is active — the stack's
     size / position changes with the viewport, so the cached pill spot
     would otherwise drift. Only bound while a pill is showing. */
  useEffect(() => {
    if (!active) return;
    const item = ITEMS.find((i) => i.key === active);
    const onResize = () => positionPill(item);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

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
        {/* Hit zones + mouse listeners: only rendered on hover-capable
            pointers. On touch, the bag illustration stays visible as
            static art but has no interactive hotspots — pointer events
            on the bag are moot without a pill to reveal. */}
        {hoverCapable && ITEMS.map((item) => (
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
            onMouseEnter={() => {
              setActive(item.key);
              positionPill(item);
            }}
            onMouseLeave={() => setActive(null)}
            onFocus={() => {
              setActive(item.key);
              positionPill(item);
            }}
            onBlur={() => setActive(null)}
            aria-label={item.label}
            data-debug-label={debug ? item.label : undefined}
          />
        ))}
      </div>
      {/* Pill wrapper: gated on hover-capable so the entire cursor-
          follow overlay is skipped on touch. Removes the pill's DOM
          node entirely so its continuous CSS keyframe animations don't
          run in the background either — meaningful battery win. */}
      {hoverCapable && (
        <div
          ref={pillRef}
          className={`hover-bag__pill hover-bag__pill--${activeItem?.key ?? "none"}${active ? " is-on" : ""}`}
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
   different peeks into Kathleen's world rather than six labels.

   ASSET PLACEHOLDERS — the following are visually complete via CSS/SVG
   but need real assets swapped in when available:
     - PillFriends: 4 grey photo placeholders → swap with actual friend
       polaroid photos in /public/img/hoverbag/friends/*.webp
     - PillFood: 4 grey circle slices → swap with actual food photos
       in /public/img/hoverbag/food/*.webp
     - PillGames: text-initial icons → swap with actual game logo SVGs
       in /public/img/hoverbag/games/{lol,tft,pokemon}.svg
     - PillArt: geometric doodle placeholder → swap with actual doodle
       thumbnail in /public/img/hoverbag/art/*.webp */

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

/* Music — iPod frame in the middle of the shell with two flanking
   handwritten notes (CPOP/KPOP/JPOP on the left, LBI on the right)
   about Kathleen's music taste. */
function PillMusic() {
  return (
    <div className="pill-music">
      <span className="pill-music__note pill-music__note--left">
        I listen to<br /><strong>CPOP · KPOP · JPOP</strong>
      </span>
      <div className="pill-music__ipod">
        <div className="pill-music__screen">
          <span className="pill-music__track">LBI</span>
          <span className="pill-music__wave" />
        </div>
        <div className="pill-music__wheel">
          <span className="pill-music__wheel-btn">◁</span>
          <span className="pill-music__wheel-btn pill-music__wheel-btn--center">▶</span>
          <span className="pill-music__wheel-btn">▷</span>
        </div>
      </div>
      <span className="pill-music__note pill-music__note--right">
        On repeat:<br /><strong>LBI</strong>
      </span>
    </div>
  );
}

/* Friends — polaroids scroll UPWARD continuously through the pill,
   with new photos entering from the bottom as older ones exit at the
   top. Each card has its own horizontal offset + rotation so they
   read as a dispersed pile (not a single column), so multiple names
   are visible in the pill at any moment. */
function PillFriends() {
  const FRIENDS = [
    { name: "Sam",   rot: -8, x: -55 },
    { name: "Alex",  rot:  6, x:  50 },
    { name: "Jamie", rot: -3, x:  -5 },
    { name: "Chris", rot:  9, x: -40 },
    { name: "Ren",   rot: -5, x:  45 },
    { name: "Kai",   rot:  4, x:  15 },
  ];
  return (
    <div className="pill-friends">
      <div className="pill-friends__frame">
        {FRIENDS.map((f, i) => (
          <div
            key={f.name}
            className="pill-friends__card"
            style={{
              animationDelay: `${(i * -12) / FRIENDS.length}s`,
              ["--rot" as string]: `${f.rot}deg`,
              ["--x" as string]: `${f.x}px`,
            }}
          >
            <div className="pill-friends__photo" />
            <span className="pill-friends__name">{f.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Food — lazy-Susan wheel: 4 plates arranged around a rotating disc.
   The disc spins continuously, plates counter-rotate to stay upright.
   Only the plate at the FRONT position (bottom of the visible arc) is
   spotlighted; others rotate through as they cycle around. */
function PillFood() {
  const FOODS = [
    { label: "boba",      hue: "#C68D5F" },
    { label: "ramen",     hue: "#B5533A" },
    { label: "dumplings", hue: "#D9A983" },
    { label: "dim sum",   hue: "#7EA07B" },
  ];
  return (
    <div className="pill-food">
      <span className="pill-food__caption">recent bites</span>
      <div className="pill-food__wheel">
        {FOODS.map((f, i) => {
          const angle = (i * 360) / FOODS.length;
          return (
            <div
              key={f.label}
              className="pill-food__slot"
              style={{
                transform: `rotate(${angle}deg) translateY(-118px)`,
              }}
            >
              <div
                className="pill-food__counter"
                style={{ transform: `rotate(${-angle}deg)` }}
              >
                <span
                  className="pill-food__plate"
                  style={{
                    background: `radial-gradient(circle, ${f.hue} 0%, color-mix(in oklch, ${f.hue}, black 32%) 100%)`,
                  }}
                />
                <span className="pill-food__label">{f.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Travel — pinboard with 3 destination pins (purple/China,
   red/Japan, yellow/HK). A "camera" zooms into each pin in turn,
   holding on it before panning to the next. Cycles purple → red →
   yellow → back to purple, repeat. */
function PillTravel() {
  return (
    <div className="pill-travel">
      <span className="pill-travel__caption">recent trips</span>
      {/* Camera-scale wrapper — animated to translate + scale into
          each pin position sequentially. */}
      <div className="pill-travel__camera">
        <svg
          className="pill-travel__web"
          viewBox="0 0 240 170"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 70 Q 100 50 130 100 Q 165 140 200 60"
            fill="none"
            stroke="#4C3C2E"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.4"
          />
        </svg>
        {/* Purple frame around China */}
        <span
          className="pill-travel__pin pill-travel__pin--purple"
          style={{ top: "42%", left: "20%" }}
        >
          <span className="pill-travel__dot" />
          China
        </span>
        {/* Red frame around Japan */}
        <span
          className="pill-travel__pin pill-travel__pin--red"
          style={{ top: "60%", left: "54%" }}
        >
          <span className="pill-travel__dot" />
          Japan
        </span>
        {/* Yellow frame around HK */}
        <span
          className="pill-travel__pin pill-travel__pin--yellow"
          style={{ top: "36%", left: "82%" }}
        >
          <span className="pill-travel__dot" />
          HK
        </span>
      </div>
    </div>
  );
}

/* Games — 3 dispersed icons + a cursor that visits each. The story
   overlay always appears in the CENTER of the pill, showing the
   currently-focused game's history — a single unified reveal spot
   rather than one popup per icon. Story text is placeholder until
   Kathleen provides the real copy. */
function PillGames() {
  const GAMES = [
    { key: "lol", name: "LoL",     hue: "#3273fa", story: "played since Season 3 — mained mid" },
    { key: "tft", name: "TFT",     hue: "#c78d2e", story: "gold since Set 8 — comp obsessed" },
    { key: "pkm", name: "Pokémon", hue: "#e2564b", story: "living dex sword & shield" },
  ];
  return (
    <div className="pill-games">
      {GAMES.map((g, i) => (
        <div key={g.key} className="pill-games__slot" data-idx={i}>
          <span className="pill-games__icon" style={{ background: g.hue }}>
            {g.name[0]}
          </span>
          <span className="pill-games__label">{g.name}</span>
        </div>
      ))}
      {/* Centered story overlay — content rotates through each game's
          story in sync with the cursor's orbit. */}
      <div className="pill-games__stage" aria-hidden="true">
        {GAMES.map((g, i) => (
          <span
            key={g.key}
            className="pill-games__story"
            data-idx={i}
            style={{ animationDelay: `${i * -3}s` }}
          >
            {g.story}
          </span>
        ))}
      </div>
      {/* Cursor sprite — orbits between the 3 icons */}
      <span className="pill-games__cursor" aria-hidden="true">
        <svg viewBox="0 0 16 20" width="14" height="18">
          <path
            d="M 2 2 L 14 12 L 8 12 L 11 18 L 8 19 L 5 13 L 2 16 Z"
            fill="#2A302F"
            stroke="#FFFDF7"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

/* Art — large cloud-shaped bubble sized bigger than the shell so its
   wobbly edges extend past the pill perimeter (per Kathleen's sketch).
   Caption sits on top of the cloud, doodle inside the cloud. */
function PillArt() {
  return (
    <div className="pill-art">
      {/* Cloud SVG — sized larger than the shell (280×220 for a
          240×170 shell), positioned via top/left negatives so its
          bumpy edges bleed past all four sides of the pill. */}
      <svg
        className="pill-art__cloud"
        viewBox="0 0 280 220"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="
            M 60 100
            C 40 100, 24 84, 32 66
            C 20 52, 30 30, 52 32
            C 60 14, 90 12, 100 30
            C 112 18, 140 20, 148 40
            C 168 28, 200 40, 200 60
            C 224 60, 244 76, 236 100
            C 256 110, 254 138, 232 144
            C 240 168, 216 186, 196 178
            C 190 200, 158 204, 148 186
            C 138 200, 108 200, 100 184
            C 84 196, 56 190, 56 170
            C 32 168, 20 148, 34 130
            C 20 122, 30 100, 60 100 Z
          "
          fill="#FFFDF7"
          stroke="rgba(76, 60, 46, 0.22)"
          strokeWidth="2"
        />
      </svg>
      <div className="pill-art__inner">
        <div className="pill-art__doodle">
          <svg viewBox="0 0 60 60" aria-hidden="true">
            <path
              d="M 12 42 Q 20 18 32 26 T 48 20 M 18 48 Q 30 52 44 46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="26" cy="14" r="2" fill="currentColor" />
          </svg>
        </div>
        <p className="pill-art__caption">
          I capture memories<br />by sharing my vision.
        </p>
      </div>
    </div>
  );
}
