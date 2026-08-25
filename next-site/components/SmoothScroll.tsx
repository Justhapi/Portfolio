"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * SmoothScroll — global Lenis smooth-scroll + parallax.
 *
 * Smooth scroll: Lenis intercepts native scroll events and interpolates
 * the page position, giving a momentum/inertia feel with configurable
 * duration and easing. This makes the page feel like you need to scroll
 * "more strongly" while the movement itself glides.
 *
 * Parallax: A small set of decorative elements drift at different speeds
 * relative to scroll, creating depth. We target:
 *   .hero-sparkles          speed −0.14  (fastest drift — background)
 *   .sticker.name-yellow    speed −0.08  (preserves rotate(8deg) base)
 *   .chip-zh                speed −0.06  (preserves rotate(−6deg) base)
 *   .sticker.designing-green speed −0.11  (preserves rotate(−5deg) base)
 *   .hero-polaroid          speed −0.05  (special centred-transform handling)
 *
 * Case-cover hero — no per-element parallax. Instead .case-cover is
 * position: sticky at top:0 (z:0) and .case-body is position: relative
 * (z:1) with a cream background, so the content section physically
 * slides UP over the pinned hero as the user scrolls. This mirrors the
 * main page's .hero → .work depth illusion.
 *
 * Entrance animation fill-mode lock:
 *   CSS `animation: ... both` keeps elements at their final keyframe,
 *   which sits above author-rule CSS in the cascade. We must clear
 *   `el.style.animation` (removing the fill lock) before inline parallax
 *   transforms take effect. We wait 2 400 ms so all entrance animations
 *   have fully completed before touching their styles.
 *
 * Skip conditions:
 *   - prefers-reduced-motion: Lenis is skipped entirely; no parallax.
 *   - Touch / coarse-pointer devices: parallax only (Lenis still runs).
 *
 * About/Connect reveal:
 *   .ac-scene wraps ConnectV2 (sticky, z:0) and AboutV2 (absolute, z:2).
 *   About starts on top of Connect and slides off as the user scrolls,
 *   revealing Connect behind it. JS sets scene height = aboutH + connectH
 *   so Connect has a valid sticky range (= aboutH px of scroll).
 */

type ParallaxConfig = {
  selector: string;
  speed: number;
  /** CSS rotate to preserve after clearing the entrance animation. */
  baseRotate?: string;
  /**
   * If true the element uses `translate(-50%, -50%)` centering and we must
   * compose the parallax offset inside that transform chain.
   */
  centred?: boolean;
  /**
   * If true the element uses `translateX(-50%)` horizontal centering only
   * (no vertical centering). We prepend it so the parallax Y offset doesn't
   * knock the element off-centre.
   */
  centredX?: boolean;
  /**
   * If true, the parallax delta is computed relative to the .ac-scene's
   * scroll start instead of 0. Use for Connect section elements so their
   * offset is 0 when Connect first becomes visible, not from page top.
   */
  relativeToScene?: boolean;
  /**
   * If true, the delta zeroes at the END of the sticky range
   * (sceneTop + aboutHeight) — the moment About has fully slid off.
   * Use for elements that must SETTLE at their natural layout position
   * when the reveal completes (e.g. .foot, pinned to Connect's bottom:
   * a scene-start base would leave it permanently displaced once the
   * reveal finishes). With negative speed the element sits below its
   * resting spot during the reveal and rises into place.
   */
  relativeToSceneEnd?: boolean;
};

const PARALLAX_TARGETS: ParallaxConfig[] = [
  // ── Hero parallax gradient ────────────────────────────────────────────
  // Ordered TOP-to-BOTTOM by vertical position on the hero, with speed
  // scaling from FASTEST at the top to SLOWEST at the bottom. All speeds
  // ~2× stronger than the previous pass so the motion actually reads
  // as parallax — the slowest sticker (Available) now drifts visibly
  // instead of looking pinned.
  //
  //   school-note (top-left of polaroid)  → effective -0.44  (fastest)
  //   hero-greeting (mid, left column)    → effective -0.28
  //   hero-polaroid (mid, right column)   → effective -0.20
  //   designing-green (bottom-right)      → effective -0.12  (slowest, visible)
  //
  // Effective drift for polaroid-attached stickers = polaroid's own
  // speed + the sticker's own speed (parent transform moves the whole
  // subtree, sticker's own transform adds extra drift).

  // TOP — school-note (Currently @ Purdue, top-left of polaroid):
  //   effective = polaroid (-0.20) + own (-0.24) = -0.44 FASTEST
  { selector: ".sticker.school-note",     speed: -0.24, baseRotate: "-6deg" },

  // MID-UPPER — greeting column (Kathleen sticker + wordmark + focus line):
  { selector: ".hero-greeting",           speed: -0.28 },

  // MID — polaroid frame:
  { selector: ".hero-polaroid",           speed: -0.20, baseRotate: "-4deg" },

  // BOTTOM — designing-green (Available Summer 2026, bottom-right of polaroid):
  //   effective = polaroid (-0.20) + own (+0.08) = -0.12 SLOWEST but
  //   clearly moving (previous +0.06 landed at effective -0.04 which
  //   read as pinned).
  { selector: ".sticker.designing-green", speed:  0.08, baseRotate: "-4deg" },

  // ── Case-cover hero ──────────────────────────────────────────────────
  // No per-element parallax on case study heroes. The depth illusion is
  // achieved via CSS: .case-cover is sticky top:0 z:0, .case-body is
  // relative z:1 with a cream bg, so the content physically slides over
  // the pinned hero (matches the main page's .hero → .work pattern).

  // ── Connect section elements ─────────────────────────────────────────
  // Negative speed → row drifts DOWN as scroll increases (confirmed from
  // browser: translateY sign is inverted for scene-relative targets).
  // At ~0.55 the row exits the viewport bottom by end of the sticky range.
  /* Reduced from -0.18 → -0.05: the larger drift was pulling the
     heading/pitch cluster off-center by ~180px on final scroll into
     Connect, so the content read as clipped at the top of the
     viewport. -0.05 keeps a subtle depth cue without dragging the
     cluster away from the true vertical center. */
  { selector: ".connect-row",           speed: -0.05, relativeToScene: true },
  // Footer credits line — counter-drift vs .connect-row for depth.
  // Scene-END base so delta = 0 exactly when About finishes sliding off:
  // during the reveal the footer sits below its resting spot (~0.08 ×
  // viewport height ≈ 70px down, off the viewport edge) and rises into
  // place as Connect is uncovered. Ends pinned at Connect's bottom with
  // no residual offset — the divider + © line travel as one block.
  { selector: ".foot",                  speed: -0.08, relativeToSceneEnd: true },
];

/** Delay after page load before parallax transforms activate (ms). */
/* Short — parallax runs concurrently with hero entrance animations
 * (see comment in buildEntries below explaining why the two systems
 * don't fight). 300ms is just enough for React hydration + first
 * layout so `getBoundingClientRect` calls in buildEntries return
 * stable numbers. */
const PARALLAX_ACTIVATE_DELAY = 300;

export default function SmoothScroll() {
  /* Re-run the entire setup whenever the route changes. SmoothScroll is
     mounted in the root layout so its useEffect would otherwise fire
     once on initial mount only. That leaves parallax `entries[]` and
     the sceneEl/aboutEl/connectEl refs pointing at the FIRST home
     page's DOM elements — which get destroyed when the user navigates
     to a project route. Returning home creates NEW DOM elements, but
     the effect never re-queries them, so applyParallax writes to
     detached orphan nodes and the hero + Connect parallax appears
     broken. Depending on `pathname` triggers cleanup (destroys Lenis,
     clears transforms, unsubscribes observers) on route change and
     re-runs setup with a fresh DOM query. */
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;

    /* ── About/Connect sticky reveal ─────────────────────────────────────
       .ac-scene wraps <ConnectV2> (first in DOM) and <AboutV2> (second).
       Connect is position:sticky top:0 z:0 — pinned background.
       About is position:absolute top:0 z:2 — foreground that scrolls off.

       For sticky to have a valid range, the containing block (.ac-scene)
       must be taller than the sticky element by at least the desired range.
       scene height = aboutH + connectH  →  sticky range = aboutH.
       This is exactly how long About takes to fully scroll off the viewport.

       A ResizeObserver keeps the height in sync on reflow.

       This block runs BEFORE the reduced-motion early-return below so the
       reveal still works with smooth scroll + parallax disabled — otherwise
       ac-scene collapses to Connect's 100vh natural height and the user
       arrives at Connect after 0 px of About-slide scroll. */
    const sceneEl   = document.querySelector<HTMLElement>(".ac-scene");
    const aboutEl   = document.querySelector<HTMLElement>(".about");
    const connectEl = document.querySelector<HTMLElement>(".connect");

    /* Forward-declared so syncScene() can call buildEntries + applyParallax
       once they're defined further down. Kept as `let` bindings so JS
       hoisting of the actual function declarations still works. */
    let buildEntries: () => void = () => {};
    let applyParallax: (scroll: number) => void = () => {};

    function syncScene() {
      if (!sceneEl || !aboutEl || !connectEl) return;
      sceneEl.style.height = `${aboutEl.offsetHeight + connectEl.offsetHeight}px`;
      /* Rebuild parallax entries whenever the ac-scene resizes — otherwise
         Connect elements (relativeToScene / relativeToSceneEnd) keep a
         stale scrollBase and drift out of alignment as About/Connect
         content reflows (fonts loading, images decoding, form opening,
         viewport changes). Apply transforms immediately so the fix is
         visible without waiting for the next scroll event. */
      buildEntries();
      applyParallax(window.scrollY);
    }
    syncScene();

    const ro = new ResizeObserver(syncScene);
    if (aboutEl)   ro.observe(aboutEl);
    if (connectEl) ro.observe(connectEl);

    /* Reduced-motion: keep the ac-scene sync + ResizeObserver running above
       so the About→Connect reveal still has scroll range, but skip Lenis
       smooth-scroll and parallax below. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        ro.disconnect();
        if (sceneEl) sceneEl.style.height = "";
      };
    }

    /* ── Lenis initialisation ──────────────────────────────────────────── */
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* ── Parallax ──────────────────────────────────────────────────────── */
    /* Parallax now runs on touch devices too. Lenis's onScroll fires
       on native touch scroll (Lenis doesn't smooth touch by default,
       so its `scroll` value equals window.scrollY on mobile), which
       means parallax transforms update on every scroll event — same
       code path as desktop. Previously skipped on touch to avoid
       jank, but modern mobile devices handle rAF-driven transform
       writes at 60fps without issue. */

    type ParallaxEntry = {
      el: HTMLElement;
      config: ParallaxConfig;
      /**
       * The scroll value at which delta = 0 for this element.
       * Hero elements: 0 (offset from page top).
       * Connect elements: ac-scene's scroll offset (scene-relative).
       */
      scrollBase: number;
    };
    let entries: ParallaxEntry[] = [];
    let activated = false;

    /* Reassign the forward-declared hoists above so syncScene() can
       call these. Function expressions instead of declarations because
       hoisting a later `function buildEntries()` would shadow the
       `let buildEntries` above and break syncScene's binding. */
    buildEntries = function () {
      entries = [];
      // Measure ac-scene's scroll position for Connect-relative targets.
      const sceneRect = sceneEl?.getBoundingClientRect();
      const sceneBase = sceneRect
        ? window.scrollY + sceneRect.top
        : 0;
      // End of the sticky range — scroll position at which About has
      // fully slid off and Connect is completely revealed.
      const sceneEndBase = sceneBase + (aboutEl?.offsetHeight ?? 0);

      for (const cfg of PARALLAX_TARGETS) {
        const nodes = document.querySelectorAll<HTMLElement>(cfg.selector);
        nodes.forEach((el) => {
          /* Do NOT clear the element's `animation` property here. Prior
             implementation set `el.style.animation = "none"` under the
             assumption that a running entrance animation would fight the
             parallax's inline transform. In practice the two systems
             time-share cleanly:
               - Before/during the entrance animation: the animation wins
                 the transform property (browser gives animations priority
                 over author styles during their active + fill windows).
                 Parallax's inline write has no visible effect for those
                 few hundred ms — invisible on `opacity: 0` anyway.
               - After the animation ends: since we use `backwards` fill
                 (pre-fill only), no post-fill state holds the transform.
                 Cascade normalises, and parallax's inline transform wins
                 on every subsequent scroll frame.
             Leaving the animation alone means the entrance can start,
             finish, and hand off to parallax without either system
             stepping on the other. This also lets PARALLAX_ACTIVATE_DELAY
             be short (parallax active immediately, not after the whole
             hero settles). */
          const scrollBase = cfg.relativeToSceneEnd
            ? sceneEndBase
            : cfg.relativeToScene
              ? sceneBase
              : 0;
          entries.push({ el, config: cfg, scrollBase });
        });
      }
    };

    /* Wait for hero entrance animations to complete before flipping
       `activated` — parallax onScroll no-ops until this fires so we
       don't inline-override an animation still in flight. Once activated,
       buildEntries runs and an initial applyParallax pass writes the
       transforms for the current scroll position (no more "silent until
       next scroll" dead frame). */
    const activateTimer = window.setTimeout(() => {
      activated = true;
      buildEntries();
      applyParallax(window.scrollY);
    }, PARALLAX_ACTIVATE_DELAY);

    /* ── Footer fade-in on first uncover ────────────────────────────────
       .foot can't use the .reveal IO pattern: it sits inside sticky
       .connect, whose reveal children are pre-marked .in at page load
       (they're always "in viewport", just covered by About). The true
       encounter is About's bottom edge rising past the footer's top, so
       we check that each scroll frame and add .foot--in once, first
       time it happens. Armed HERE rather than hidden in CSS so the
       touch and reduced-motion paths — which never reach onScroll —
       leave the footer fully visible. */
    const footEl = document.querySelector<HTMLElement>(".foot");
    let footShown = false;
    footEl?.classList.add("foot--armed");

    function checkFoot() {
      if (footShown || !footEl || !aboutEl) return;
      // Both rects include live transforms (About scrolling off, the
      // footer's own parallax rise), so the crossover is the actual
      // visual uncover moment.
      if (aboutEl.getBoundingClientRect().bottom <= footEl.getBoundingClientRect().top) {
        footShown = true;
        footEl.classList.add("foot--in");
      }
    }
    // Cover restored scroll positions past the scene (deep-link /
    // refresh mid-page) — without this the footer would stay hidden
    // until the first scroll event.
    checkFoot();

    /* Shared transform-apply pass — used by both the Lenis scroll
       handler and one-shot triggers (buildEntries, syncScene,
       visibilitychange). Extracting this means every "resync" path
       reads the current scroll position and writes transforms once,
       instead of waiting for the next wheel event. */
    applyParallax = function (scroll: number) {
      for (const { el, config, scrollBase } of entries) {
        const delta = (scroll - scrollBase) * config.speed;

        // Availability sticker (.sticker.designing-green.polaroid-attached)
        // writes to a CSS custom property instead of an inline transform.
        // This lets the CSS compose parallax Y with the polaroid-raise
        // outward shift (which sets --raise-x/--raise-y on .is-raised)
        // in a single transform expression, so the two systems no longer
        // fight over inline vs class-based transforms.
        if (el.classList.contains("designing-green")) {
          el.style.setProperty("--parallax-y", `${delta.toFixed(2)}px`);
          continue;
        }

        if (config.centred) {
          // .hero-polaroid is positioned by its TOP EDGE (translate(-50%, 0))
          // so the gap from the "FROM ONE SCENE…" subtitle stays consistent
          // across viewport widths. Parallax delta composes as the Y
          // translation only — no -50% Y centering to preserve.
          el.style.transform = `translate(-50%, ${delta.toFixed(2)}px) rotate(-4deg)`;
        } else if (config.centredX) {
          // Element uses translateX(-50%) horizontal centering only —
          // preserve it while adding the parallax Y offset.
          el.style.transform = `translateX(-50%) translateY(${delta.toFixed(2)}px)`;
        } else if (config.baseRotate) {
          el.style.transform = `translateY(${delta.toFixed(2)}px) rotate(${config.baseRotate})`;
        } else {
          el.style.transform = `translateY(${delta.toFixed(2)}px)`;
        }
      }
      checkFoot();
    };

    function onScroll({ scroll }: { scroll: number }) {
      if (!activated) {
        // Still in the entrance-animation window; skip parallax writes
        // so inline transforms don't override a running keyframe. Foot
        // fade-in check is safe to run since it only toggles a class.
        checkFoot();
        return;
      }
      applyParallax(scroll);
    }

    lenis.on("scroll", onScroll);

    /* Rebuild + reapply on resize regardless of whether parallax has
       activated yet — layout numbers (scene position, offsetHeight)
       can shift during the entrance window too, and we want them
       captured whenever they change. */
    const onResize = () => {
      syncScene();
      if (activated) applyParallax(window.scrollY);
    };
    window.addEventListener("resize", onResize);

    /* When the tab regains focus, Lenis's RAF was paused — scroll
       events fired natively in the meantime weren't relayed, and the
       parallax offsets can be stale relative to the current position.
       Rebuild + reapply so nothing looks frozen mid-scroll after a
       tab switch. */
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (!activated) return;
      buildEntries();
      applyParallax(window.scrollY);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ro.disconnect();
      window.clearTimeout(activateTimer);
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (sceneEl) sceneEl.style.height = "";
      footEl?.classList.remove("foot--armed", "foot--in");
      // Restore parallax elements
      for (const { el } of entries) {
        el.style.transform = "";
        el.style.animation = "";
      }
    };
  }, [pathname]);

  return null;
}
