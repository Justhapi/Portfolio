/**
 * heroStickerMotion — the "Slap" interactions for the hero stickers
 * (promoted from the /prototypes/hero-stickers exploration).
 *
 *  - Name badge: clicking swaps Kathleen ⇄ 妤𣎮. Each name keeps its own
 *    plate and typeface; only size and spot trade. The swap is instant;
 *    the big sticker lands with a squash and the chip pops in (Web
 *    Animations on scale/opacity only — no View Transition, see below).
 *  - The big name stays centred on the same spot whichever name it holds;
 *    "Hello, I'm" slides straight across to stay beside it.
 *  - The two lines under it (wordmark + focus line) hop when the name
 *    lands, as if the slam bumped the table: each gets an upward velocity
 *    kick at impact and a damped spring does the rest; the lower line
 *    feels it a beat later and lighter.
 *  - Polaroid stickers: clicking pops one forward over the photo, squared
 *    up, then slams it back into place.
 *
 * Reduced motion: the swap is instant and the nudges are skipped.
 */

/** How long one swap blocks the next click. */
export const SWAP_MS = 460;

const OUT = "cubic-bezier(0.25, 1, 0.5, 1)";
const INOUT = "cubic-bezier(0.45, 0, 0.55, 1)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The big sticker lands right away now (no lift); hop just after. */
const IMPACT_MS = 40;
/** Delay between lines as the bump travels down the copy. */
const TRAVEL_MS = 55;
const FRAME = 1 / 60;
const hops = new WeakMap<HTMLElement, { anim: Animation; ys: number[]; vs: number[] }>();

/** Give `el` an upward kick (px/s) and let a damped spring settle it.
 *  A kick mid-motion starts from the live offset + velocity, so rapid
 *  swaps blend. Layered with composite "add" over parallax/entrance. */
function hop(el: HTMLElement, impulse: number, zeta = 0.55, response = 0.36) {
  let y = 0, v = 0;
  const prev = hops.get(el);
  if (prev && prev.anim.playState === "running") {
    const i = Math.min(prev.ys.length - 1, Math.floor(Number(prev.anim.currentTime ?? 0) / 1000 / FRAME));
    y = prev.ys[i];
    v = prev.vs[i];
    prev.anim.cancel();
  }
  v -= impulse;
  const w = (2 * Math.PI) / response, k = w * w, c = 2 * zeta * w;
  const ys: number[] = [], vs: number[] = [];
  for (let n = 0; n < 240; n++) {
    ys.push(y);
    vs.push(v);
    if (n > 3 && Math.abs(y) < 0.05 && Math.abs(v) < 0.4) break;
    for (let s = 0; s < 4; s++) {
      v += (-k * y - c * v) * (FRAME / 4);
      y += v * (FRAME / 4);
    }
  }
  ys[ys.length - 1] = 0;
  const anim = el.animate(
    ys.map((n) => ({ translate: `0 ${n.toFixed(2)}px` })),
    { duration: ys.length * FRAME * 1000, easing: "linear", composite: "add" },
  );
  hops.set(el, { anim, ys, vs });
}

/**
 * Swap the two names.
 *
 * Plain DOM swap + a few compositor-only animations. This used to run as a
 * View Transition, but every swap snapshotted the whole page (root
 * transition) on top of the animated hero, and rapid clicking stacked those
 * captures until the tab ran out of GPU memory and crashed. Now nothing is
 * captured: the state flips instantly, the new big sticker lands with a
 * squash, the chip pops in, "Hello, I'm" slides over, and the copy hops.
 *
 * @param big      the big name sticker (holds the chip)
 * @param chip     the small chip sticker
 * @param hello    the "Hello, I'm" span
 * @param swapped  current state (before the swap)
 * @param commit   synchronously flips the state in the DOM (flushSync)
 */
export function swapNames(
  big: HTMLElement,
  chip: HTMLElement,
  hello: HTMLElement,
  swapped: boolean,
  commit: () => void,
): Promise<void> {
  /* Keep the big name centred on the same spot whichever name is in it.
     妤𣎮 is narrower than "Kathleen", so when it takes the big spot the
     line is shifted (--name-shift on the line) until its centre lands
     where Kathleen's was. Kathleen sits naturally at shift 0. */
  const line = big.parentElement;
  const centreX = () => {
    const r = big.getBoundingClientRect();
    return r.left + r.width / 2;
  };
  const before = centreX();
  const helloX = hello.getBoundingClientRect().left;

  commit();
  if (line) {
    line.style.setProperty("--name-shift", "0px");
    if (!swapped) line.style.setProperty("--name-shift", `${(before - centreX()).toFixed(2)}px`);
  }
  if (prefersReducedMotion()) return Promise.resolve();

  // Drop any half-finished swap animations so fast clicks never pile up.
  for (const el of [big, chip, hello]) {
    el.getAnimations().forEach((a) => {
      if (!(a instanceof CSSAnimation)) a.cancel();
    });
  }

  // Big sticker lands with a squash (scale only: its translate/rotate are
  // owned by the cursor tilt and the name shift).
  big.animate(
    [
      { scale: "1.12 0.82", easing: OUT },
      { scale: "0.95 1.06", offset: 0.4, easing: INOUT },
      { scale: "1.02 0.98", offset: 0.7, easing: INOUT },
      { scale: "1" },
    ],
    { duration: 420 },
  );
  // Chip pops in from small.
  chip.animate(
    [
      { scale: "0.5", opacity: 0, easing: OUT },
      { scale: "1.1", opacity: 1, offset: 0.55, easing: INOUT },
      { scale: "1", opacity: 1 },
    ],
    { duration: 380, delay: 60, fill: "backwards" },
  );
  // "Hello, I'm" slides straight across from its old spot.
  const from = helloX - hello.getBoundingClientRect().left;
  if (Math.abs(from) >= 0.5) {
    hello.animate(
      [
        { translate: `${from}px 0`, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        { translate: `${(-from * 0.06).toFixed(2)}px 0`, offset: 0.7, easing: INOUT },
        { translate: "0 0" },
      ],
      { duration: 480, composite: "add" },
    );
  }
  // The copy under the name hops as it lands.
  const greeting = big.closest(".hero-greeting");
  [".ribbon-artist", ".hero-focus"].forEach((q, i) => {
    const el = greeting?.querySelector<HTMLElement>(q);
    if (el) window.setTimeout(() => hop(el, i === 0 ? 250 : 170), IMPACT_MS + i * TRAVEL_MS);
  });

  return new Promise((r) => window.setTimeout(r, SWAP_MS));
}

/**
 * Pop a polaroid sticker forward over the photo (squared up), hold, then
 * slam it back. `baseRotate` is the sticker's resting tilt in degrees.
 */
export function slapNudge(el: HTMLElement, photo: HTMLElement, baseRotate: number) {
  if (prefersReducedMotion()) return;
  if (el.getAnimations().some((a) => !(a instanceof CSSAnimation) && a.playState === "running")) return;
  const r = el.getBoundingClientRect();
  const p = photo.getBoundingClientRect();
  const vx = p.left + p.width / 2 - (r.left + r.width / 2);
  const vy = p.top + p.height / 2 - (r.top + r.height / 2);
  const len = Math.hypot(vx, vy) || 1;
  const t = { x: vx / len, y: vy / len };
  const d = (k: number, up = 0) => `${t.x * 24 * k}px ${t.y * 24 * k - up}px`;
  const rot = (k: number) => `${-baseRotate * k}deg`;
  const lifted = "drop-shadow(0 20px 16px rgba(0,0,0,0.45))";
  const flat = "drop-shadow(0 0 0 rgba(0,0,0,0))";

  el.style.zIndex = "30";
  const a = el.animate(
    [
      { translate: "0 0", rotate: "0deg", scale: "1", filter: flat, easing: "cubic-bezier(0.1, 0.9, 0.2, 1)" },
      { translate: d(1.05, 10), rotate: rot(1.3), scale: "1.22", filter: lifted, offset: 0.07, easing: INOUT },
      { translate: d(1, 8), rotate: rot(1), scale: "1.16", filter: lifted, offset: 0.14 },
      { translate: d(1, 8), rotate: rot(1), scale: "1.16", filter: lifted, offset: 0.74, easing: "cubic-bezier(0.7, 0, 0.9, 0.3)" },
      { translate: "0 0", rotate: "0deg", scale: "1.1 0.84", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))", offset: 0.8, easing: OUT },
      { translate: "0 0", rotate: "0deg", scale: "0.95 1.06", filter: flat, offset: 0.87, easing: INOUT },
      { translate: "0 0", rotate: "0deg", scale: "1.02 0.98", filter: flat, offset: 0.94, easing: INOUT },
      { translate: "0 0", rotate: "0deg", scale: "1", filter: flat },
    ],
    { duration: 2100, easing: "linear" },
  );
  a.finished.finally(() => {
    el.style.zIndex = "";
  });
}
