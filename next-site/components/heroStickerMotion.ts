/**
 * heroStickerMotion — the "Slap" interactions for the hero stickers
 * (promoted from the /prototypes/hero-stickers exploration).
 *
 *  - Name badge: clicking swaps Kathleen ⇄ 李曦. Each name keeps its own
 *    plate and typeface; only size and spot trade. Driven by a view
 *    transition: both are yanked up, then slammed down with a squash
 *    (keyframes in globals.css, "hero-slap-*"). The smaller sticker stays
 *    in front the whole way, and each snapshot hard-cuts old → new (no
 *    cross-fade) at the instant their sizes cross.
 *  - "Hello, I'm" gets knocked sideways on the slam and springs back.
 *  - Polaroid stickers: clicking pops one forward over the photo, squared
 *    up, then slams it back into place.
 *
 * Reduced motion: the swap is instant and the nudges are skipped.
 */

/** Keep in sync with the ::view-transition-group rules in globals.css. */
export const SWAP_MS = 600;
/** Fraction of SWAP_MS at which the two sizes cross: where the group
 *  curve cubic-bezier(0.2, 1.5, 0.5, 1) reaches 0.5. */
const CROSS_AT = 0.086;

const OUT = "cubic-bezier(0.25, 1, 0.5, 1)";
const INOUT = "cubic-bezier(0.45, 0, 0.55, 1)";

type VTDoc = Document & {
  startViewTransition?: (cb: () => void) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Swap the two names.
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
  const doc = document as VTDoc;
  if (prefersReducedMotion() || !doc.startViewTransition) {
    commit();
    return Promise.resolve();
  }
  const html = document.documentElement;

  // Name each IDENTITY so it morphs from its old spot to its new one.
  // "hero-front" = the name heading for the big spot on this click.
  const name = (sw: boolean) => {
    const kathleenEl = sw ? chip : big;
    const lixiEl = sw ? big : chip;
    const lixiGoingBig = !swapped;
    kathleenEl.style.viewTransitionName = lixiGoingBig ? "hero-back" : "hero-front";
    lixiEl.style.viewTransitionName = lixiGoingBig ? "hero-front" : "hero-back";
  };
  const clear = () => {
    big.style.viewTransitionName = "";
    chip.style.viewTransitionName = "";
    html.classList.remove("hero-vt");
  };

  html.classList.add("hero-vt");
  name(swapped);
  const helloX = hello.getBoundingClientRect().left;
  const vt = doc.startViewTransition(() => {
    commit();
    name(!swapped);
  });

  vt.ready
    .then(() => {
      const o = { duration: SWAP_MS, fill: "both" as const };
      const c = CROSS_AT;
      html.animate([{ zIndex: 2 }, { zIndex: 2 }], {
        ...o,
        pseudoElement: "::view-transition-group(hero-front)",
      });
      html.animate(
        [{ zIndex: 1 }, { zIndex: 1, offset: c }, { zIndex: 3, offset: c }, { zIndex: 3 }],
        { ...o, pseudoElement: "::view-transition-group(hero-back)" },
      );
      for (const id of ["hero-front", "hero-back"]) {
        html.animate(
          [{ opacity: 1 }, { opacity: 1, offset: c }, { opacity: 0, offset: c }, { opacity: 0 }],
          { ...o, pseudoElement: `::view-transition-old(${id})` },
        );
        html.animate(
          [{ opacity: 0 }, { opacity: 0, offset: c }, { opacity: 1, offset: c }, { opacity: 1 }],
          { ...o, pseudoElement: `::view-transition-new(${id})` },
        );
      }
    })
    .catch(() => {
      /* pseudo-element animation unsupported: default stacking/fade */
    });

  vt.updateCallbackDone.then(() => {
    // "Hello, I'm" isn't in the transition; it reacts live. FLIP from its
    // old spot (it only moves when the line is centred, e.g. on mobile)
    // and get knocked sideways on the slam.
    const from = helloX - hello.getBoundingClientRect().left;
    hello.animate(
      [
        { translate: `${from}px 0`, rotate: "0deg", easing: "cubic-bezier(0.1, 0.9, 0.2, 1)" },
        { translate: `${from * 0.3 - 20}px 2px`, rotate: "-4.5deg", offset: 0.14, easing: INOUT },
        { translate: "12px 0", rotate: "2.5deg", offset: 0.36, easing: INOUT },
        { translate: "-6px 0", rotate: "-1.2deg", offset: 0.56, easing: INOUT },
        { translate: "3px 0", rotate: "0.5deg", offset: 0.74, easing: INOUT },
        { translate: "-1px 0", rotate: "-0.2deg", offset: 0.88, easing: INOUT },
        { translate: "0 0", rotate: "0deg" },
      ],
      { duration: 900, delay: 330, easing: "linear", fill: "backwards" },
    );
  });

  return vt.finished.then(clear, clear);
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
