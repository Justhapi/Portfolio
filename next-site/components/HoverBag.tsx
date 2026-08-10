"use client";

import { useRef, useState } from "react";

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

const PILL_OFFSET_X = -40;
const PILL_OFFSET_Y = -265;

export default function HoverBag({ debug = false }: { debug?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);

  const moveToPointer = (e: React.MouseEvent) => {
    if (!pillRef.current) return;
    pillRef.current.style.left = `${e.clientX + PILL_OFFSET_X}px`;
    pillRef.current.style.top = `${e.clientY + PILL_OFFSET_Y}px`;
  };

  const activeItem = ITEMS.find((i) => i.key === active);
  const liftedLayers = new Set(activeItem?.layers ?? []);
  const activeEffectClass = activeItem ? EFFECT_CLASS[activeItem.hoverEffect] : "";

  return (
    <div
      className={`hover-bag reveal${debug ? " is-debug" : ""}`}
      data-active={active ?? ""}
    >
      <div className="hover-bag__stack">
        {LAYERS.map((layer) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={layer.key}
            src={layer.src}
            alt=""
            className={`hover-bag__layer${liftedLayers.has(layer.key) ? ` ${activeEffectClass}` : ""}`}
            data-layer={layer.key}
            aria-hidden="true"
            draggable={false}
          />
        ))}
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
            onMouseEnter={(e) => {
              setActive(item.key);
              moveToPointer(e);
            }}
            onMouseMove={moveToPointer}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(item.key)}
            onBlur={() => setActive(null)}
            aria-label={item.label}
            data-debug-label={debug ? item.label : undefined}
          />
        ))}
      </div>
      <div
        ref={pillRef}
        className={`hover-bag__pill${active ? " is-on" : ""}`}
        aria-hidden="true"
      >
        <div className="hover-bag__pill-inner">
          <div className="image-slot">
            {activeItem?.label ?? ""}
          </div>
        </div>
      </div>
    </div>
  );
}
