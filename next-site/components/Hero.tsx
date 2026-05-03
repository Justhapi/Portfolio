"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero — centered white business card on a dark studio ground.
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │                                                              │
 *   │     ╔════════════════════════════════════════╗               │
 *   │     ║  — designer · artist                   ║   ┌────┐      │
 *   │     ║                                        ║   │char│      │
 *   │     ║  Kathleen Li                           ║   │peek│      │
 *   │     ║  ──────────                            ║   └────┘      │
 *   │     ║  UX · Interaction · UI Design          ║               │
 *   │     ║  An artist who learned to design       ║               │
 *   │     ║  systems — and a designer who          ║               │
 *   │     ║  never stopped making art.             ║               │
 *   │     ║   ─ turned ─                           ║               │
 *   │     ║                          Purdue · 2028 ║               │
 *   │     ║                          Scroll ↓      ║               │
 *   │     ╚════════════════════════════════════════╝               │
 *   │                                                              │
 *   └──────────────────────────────────────────────────────────────┘
 *
 *  Concept — flat-lay of a real designer's business card on a dark
 *  desk surface. All identity copy lives on the card; the studio
 *  manifesto sits in a hand-lettered ribbon along the bottom-right;
 *  char.gif peeks out from BEHIND the card's right edge so it never
 *  covers any reading copy.
 *
 *  Construction details that earn the "real card" read:
 *   • Slightly off-white paper (#fdfaf2) — never #fff.
 *   • A two-layer shadow stack: a tight 3px contact shadow plus a
 *     wide 56px falloff, with the card rotated -0.8° so the shadow
 *     tilts naturally rather than sitting symmetrically beneath it.
 *   • Subtle paper grain (two layered radial-gradient dots) and a
 *     letterpress hairline at the card's edge.
 *   • A small yellow post-it tab pinned to the upper-right corner
 *     so a sticky-note flavor survives from the previous lockup.
 *   • The "Kathleen" and "Li" words remain hover-targets that fire
 *     the artist.png / designer.png peek tooltips (kept from before).
 *
 *  Motion — emmiwu-style cascade:
 *    1. hero ground breathes in   (heroFade, 0.65s)
 *    2. card lands & settles      (cardLand: drop + rotate overshoot, 0.9s)
 *    3. inner copy rises in turn  (eyebrow → name → divider → role
 *                                  → tagline → turned → statement → scroll)
 *    4. yellow post-it pops on    (stickPop, after the card lands)
 *    5. char peeks from the right (charPeek + slow charIdle wobble)
 */

const SPARKLE_PATH =
  "M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [artistVisible, setArtistVisible] = useState(false);
  const [designerVisible, setDesignerVisible] = useState(false);
  const [tipPos, setTipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    /* Cursor coords drive THREE masks:
        --cx / --cy        → hero-relative; used by .hero-dim and
                             the warm cursor glow
        --bc-cx / --bc-cy  → CARD-relative; used by .bc-card-shade
                             so the card paper brightens only in
                             the local pocket near the cursor,
                             not uniformly. */
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--cx", `${e.clientX - r.left}px`);
      hero.style.setProperty("--cy", `${e.clientY - r.top}px`);
      const card = hero.querySelector<HTMLElement>(".business-card");
      if (card) {
        const cr = card.getBoundingClientRect();
        hero.style.setProperty("--bc-cx", `${e.clientX - cr.left}px`);
        hero.style.setProperty("--bc-cy", `${e.clientY - cr.top}px`);
      }
      hero.classList.add("glow-active");
    };
    const onLeave = () => {
      hero.classList.remove("glow-active");
      /* Push every spotlight hole far off-screen so the dim/shade
         layers re-cover everything when the cursor leaves. CSS
         vars don't transition, so this jump is instant — fine
         because the cursor is already off the section. */
      hero.style.setProperty("--cx", "-9999px");
      hero.style.setProperty("--cy", "-9999px");
      hero.style.setProperty("--bc-cx", "-9999px");
      hero.style.setProperty("--bc-cy", "-9999px");
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);


  const trackTip = (e: React.MouseEvent) => {
    setTipPos({ x: e.clientX + 18, y: e.clientY + 18 });
  };

  return (
    <>
      <svg style={{ display: "none" }} aria-hidden focusable={false}>
        <defs>
          <path id="sparkle" d={SPARKLE_PATH} />
        </defs>
      </svg>

      <section
        id="hero"
        className="hero"
        ref={(el) => {
          heroRef.current = el;
        }}
      >
        <style>{`
          .hero {
            --bg-dark:     #14110d;
            --bg-deep:     #0a0807;
            --ink:         #1a1612;
            --ink-soft:    #3a322a;
            --paper:       #fdfaf2;
            --paper-deep:  #f4ecda;
            --paper-rule:  #d8cfb8;
            --paper-mute:  #6e6553;
            --yellow:      #f7c75a;
            --yellow-deep: #e9b94a;
            --yellow-warm: #fce18b;
            --lilac-light: #c8b8e0;
            --ff-hand:     'Caveat', cursive;
            --ff-display:  'Gloock', 'Cormorant', serif;
            --ff-sans:     'Sora', -apple-system, system-ui, sans-serif;
            --ease-out:    cubic-bezier(.16,1,.3,1);
            --ease-out-quint: cubic-bezier(.22,1,.36,1);
            --ease-spring: cubic-bezier(.5,1.6,.4,1);
          }
          .hero {
            position: relative;
            /* Hero shares the first viewport with SiteNav.
               --nav-h is bumped to 110px to comfortably account
               for the nav's actual rendered height (padding +
               text + bottom border) plus a small visual buffer,
               so the nav is FULLY visible on first load without
               any scroll. */
            --nav-h: 110px;
            min-height: calc(100vh - var(--nav-h));
            /* Also cap the height so the hero never grows past
               the available viewport-minus-nav space — keeps the
               nav guaranteed-visible even when content might
               otherwise stretch. */
            max-height: calc(100vh - var(--nav-h));
            /* Deeper base + a strong dark vignette so the cursor
               spotlight has somewhere to cut through. The ambient
               warm corner glows were lifting the whole scene; they
               are gone now so the room reads as genuinely dark. */
            background: var(--bg-deep);
            color: var(--paper);
            font-family: var(--ff-sans);
            overflow: hidden;
            padding: clamp(48px, 6vw, 96px) clamp(28px, 5vw, 96px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: heroFade 0.65s var(--ease-out) both;
          }
          @keyframes heroFade {
            from { background-color: #1f1612; }
            to   { background-color: var(--bg-deep); }
          }
          /* Dark vignette overlay — sits above content surfaces but
             BELOW the cursor glow (which uses mix-blend-mode: screen
             to brighten through this layer). The radial gradient is
             effectively transparent in the center and deepens to
             solid near-black at the corners, so the eye perceives
             the room as much darker than the bg color alone. */
          .hero::after {
            content: "";
            position: absolute; inset: 0;
            pointer-events: none;
            z-index: 1;
            background:
              radial-gradient(
                ellipse 80% 80% at 50% 50%,
                rgba(0,0,0,0) 0%,
                rgba(0,0,0,0.35) 55%,
                rgba(0,0,0,0.65) 100%
              );
          }

          /* ── Cursor warm-glow — sits BELOW the business card
             (z:2 vs card stage z:2 — see .bc-stage which is also
             z:2; this glow paints first since it's earlier in the
             stacking context with no positioning quirks). Putting
             the glow below the card prevents mix-blend-mode:screen
             from brightening the already-white card paper, which
             was making the spotlight feel blinding.
             Now the glow only illuminates the dark area AROUND
             the card; the card stays at its natural cream tone. ── */
          .hero-cursor-glow {
            position: absolute;
            z-index: 1;
            pointer-events: none;
            width: 760px; height: 760px;
            border-radius: 50%;
            background: radial-gradient(circle,
              rgba(255, 222, 158, 0.32) 0%,
              rgba(247, 199, 90, 0.18) 30%,
              rgba(247, 199, 90, 0.07) 58%,
              transparent 82%);
            transform: translate(-50%, -50%);
            left: var(--cx, -9999px);
            top: var(--cy, -9999px);
            transition: opacity .35s var(--ease-out);
            opacity: 0;
            mix-blend-mode: screen;
          }
          .hero.glow-active .hero-cursor-glow { opacity: 1; }

          /* ── Dim mask — the heart of the spotlight reveal. ──
             A near-black layer paints OVER all content. A radial
             mask centered at the cursor cuts a transparent hole, so
             content is visible only inside that spotlight pocket.
             Without the cursor (--cx/--cy default to -9999px), the
             hole is far off-screen and the entire layer covers,
             leaving the hero very dark by default.

             Two-stop falloff in the mask:
               0% (black, mask opaque) → fully transparent dim. inside
               25% (still black) → still no dim
               75-100% (transparent in mask) → dim fully visible
             so the spotlight has a soft edge but a solid bright core.

             z-index: 7 puts this above the card AND the char gif so
             the dim genuinely covers them; the mask hole reveals
             both at once when the cursor crosses them. */
          .hero-dim {
            position: absolute; inset: 0;
            pointer-events: none;
            z-index: 7;
            /* Lower opacity so the contrast between the dim and
               the spotlight pocket isn't extreme — the previous
               0.82 was too dark, making the spotlight feel like
               a flashbulb. 0.62 keeps the room clearly darker
               than the spotlight without blinding the eye when
               the spotlight reveals the bright card. */
            background: rgba(8, 6, 5, 0.62);
            /* 520px spotlight hole with a softer ramp — the
               transparent center extends further (45%) and the
               falloff is more gradual (45→100%) so the edge of
               the spotlight feels diffuse rather than a hard line. */
            -webkit-mask-image: radial-gradient(
              circle 520px at var(--cx, -9999px) var(--cy, -9999px),
              transparent 0%,
              transparent 45%,
              rgba(0, 0, 0, 0.55) 75%,
              black 100%
            );
            mask-image: radial-gradient(
              circle 520px at var(--cx, -9999px) var(--cy, -9999px),
              transparent 0%,
              transparent 45%,
              rgba(0, 0, 0, 0.55) 75%,
              black 100%
            );
          }

          /* ── Halftone edge band ──
             Lichtenstein-style dot pattern painted in a RING
             around the spotlight, matching the halftone in the
             card's bottom-right corner. Two stacked radial-dot
             grids at 7px / 12px cells give the print a real-paper
             density gradient. The mask is a ring (transparent in
             the bright center, opaque in the edge band, transparent
             again outside) so the dots appear ONLY at the spotlight
             rim — the dark outside stays solid, the bright center
             stays clean, and the transition between them is a
             halftone fade instead of a smooth gradient. */
          .hero-halftone-edge {
            position: absolute; inset: 0;
            pointer-events: none;
            z-index: 7;
            background-image:
              radial-gradient(circle, rgba(8, 6, 5, 0.95) 1.4px, transparent 1.7px),
              radial-gradient(circle, rgba(8, 6, 5, 0.65) 0.9px, transparent 1.2px);
            background-size: 7px 7px, 12px 12px;
            background-position: 0 0, 3.5px 3.5px;
            -webkit-mask-image: radial-gradient(
              circle 580px at var(--cx, -9999px) var(--cy, -9999px),
              transparent 0%,
              transparent 38%,
              rgba(0, 0, 0, 0.4) 50%,
              black 65%,
              black 78%,
              rgba(0, 0, 0, 0.45) 90%,
              transparent 100%
            );
            mask-image: radial-gradient(
              circle 580px at var(--cx, -9999px) var(--cy, -9999px),
              transparent 0%,
              transparent 38%,
              rgba(0, 0, 0, 0.4) 50%,
              black 65%,
              black 78%,
              rgba(0, 0, 0, 0.45) 90%,
              transparent 100%
            );
          }

          /* Faint paper-grain noise so the dark doesn't look CSS-flat */
          .hero::before {
            content: "";
            position: absolute; inset: 0; pointer-events: none; z-index: 0;
            background-image:
              radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px);
            background-size: 3px 3px, 5px 5px;
            background-position: 0 0, 1px 1px;
          }

          /* ── The business card itself ──
             z-index 8 puts the card stage ABOVE the dim mask
             (z:7), so the text is always readable regardless of
             whether the cursor spotlight is on it or not. The dim
             continues to cover the dark BG + cursor glow, creating
             the spotlight illumination behind/around the card,
             but the card content is no longer affected by the
             reveal/dim cycle. ── */
          .bc-stage {
            position: relative;
            z-index: 8;
            width: min(1080px, 92vw);
          }

          .business-card {
            position: relative;
            background: var(--paper);
            color: var(--ink);
            border-radius: 4px;
            aspect-ratio: 16 / 9;
            min-height: 460px;
            padding: clamp(36px, 4vw, 64px) clamp(40px, 5vw, 80px);
            transform: rotate(-0.8deg);
            opacity: 0;
            animation: cardLand 0.95s 0.18s var(--ease-out-quint) both;
            /* Layered shadow — tight contact + soft falloff so the
               card reads as resting on the dark surface, not floating. */
            box-shadow:
              0 1px 0 rgba(0,0,0,0.35),
              0 3px 6px rgba(0,0,0,0.45),
              0 24px 48px rgba(0,0,0,0.55),
              0 56px 96px rgba(0,0,0,0.45),
              inset 0 0 0 1px rgba(0,0,0,0.04);
          }
          @keyframes cardLand {
            0%   { opacity: 0; transform: translateY(40px) rotate(-3deg) scale(0.96); }
            55%  { opacity: 1; transform: translateY(-3px) rotate(-1.4deg) scale(1.005); }
            100% { opacity: 1; transform: translateY(0)     rotate(-0.8deg) scale(1); }
          }
          /* Paper grain — two radial dot layers, masked to corners
             so the center stays clean for reading. */
          .business-card::before {
            content: "";
            position: absolute; inset: 0;
            pointer-events: none;
            background-image:
              radial-gradient(circle, rgba(58,42,28,0.06) 1px, transparent 1.4px),
              radial-gradient(circle, rgba(58,42,28,0.04) 1px, transparent 1.2px);
            background-size: 6px 6px, 11px 11px;
            background-position: 0 0, 3px 3px;
            -webkit-mask-image:
              radial-gradient(ellipse 90% 100% at 50% 50%, transparent 50%, black 95%);
            mask-image:
              radial-gradient(ellipse 90% 100% at 50% 50%, transparent 50%, black 95%);
            border-radius: inherit;
            opacity: 0.7;
          }
          /* Top sheen — the soft glance of light across paper */
          .business-card::after {
            content: "";
            position: absolute; inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              168deg,
              rgba(255,255,255,0.35) 0%,
              rgba(255,255,255,0.04) 22%,
              transparent 60%
            );
            pointer-events: none;
          }

          /* ── Yellow Post-it tab pinned to the card ── */
          .bc-postit {
            position: absolute;
            top: clamp(-18px, -1.4vw, -22px);
            right: clamp(40px, 5vw, 90px);
            background: var(--yellow);
            color: var(--ink);
            font-family: var(--ff-hand);
            font-size: clamp(1rem, 1.2vw, 1.2rem);
            font-weight: 700;
            line-height: 1;
            padding: 10px 18px 12px;
            border-radius: 3px 5px 4px 6px;
            transform: rotate(5deg);
            box-shadow:
              0 1px 1px rgba(0,0,0,0.18),
              0 6px 14px rgba(0,0,0,0.22);
            opacity: 0;
            animation: stickPop 0.6s 0.95s var(--ease-out-quint) both;
            cursor: default;
            z-index: 6;
          }
          .bc-postit::after {
            content: "";
            position: absolute; inset: 0;
            border-radius: inherit;
            background: linear-gradient(168deg,
              rgba(255,255,255,0.45) 0%,
              rgba(255,255,255,0.04) 22%,
              transparent 55%);
            pointer-events: none;
          }
          @keyframes stickPop {
            0%   { opacity: 0; transform: rotate(-3deg) scale(0.6) translateY(-12px); }
            65%  { opacity: 1; transform: rotate(7deg)  scale(1.05); }
            100% { opacity: 1; transform: rotate(5deg)  scale(1); }
          }

          /* ── Card shade overlay ──
             A dark layer painted INSIDE the business card,
             between the paper background and the text grid. By
             default it dims the paper (so the card reads as a
             card sitting in a dark room), and fades to transparent
             when the cursor enters the hero (.glow-active). The
             text grid sits on top at z-index 2, so it's never
             affected by this shade — text stays at its declared
             color regardless of spotlight state. ── */
          .bc-card-shade {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            background: rgba(15, 18, 22, 0.42);
            border-radius: inherit;
            transition: opacity 0.45s var(--ease-out-quint);
            opacity: 1;
          }
          .hero.glow-active .bc-card-shade {
            opacity: 0;
          }

          /* ── Card grid: identity left, statement right ── */
          .bc-grid {
            position: relative; z-index: 2;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.05fr);
            column-gap: clamp(28px, 3.6vw, 56px);
            align-items: start;
            height: 100%;
          }

          .bc-divider {
            align-self: stretch;
            width: 1px;
            background:
              linear-gradient(180deg,
                transparent 0%,
                var(--paper-rule) 14%,
                var(--paper-rule) 86%,
                transparent 100%);
            opacity: 0;
            animation: rise .6s 0.62s var(--ease-out) both;
          }

          /* ── Left column: identity ── */
          .bc-left {
            display: flex;
            flex-direction: column;
            gap: clamp(14px, 1.5vw, 22px);
          }
          .bc-eyebrow {
            display: inline-flex; align-items: center; gap: 0.6rem;
            font-family: var(--ff-hand);
            font-size: clamp(1.1rem, 1.3vw, 1.35rem);
            color: var(--paper-mute);
            line-height: 1; margin: 0;
            opacity: 0;
            animation: rise .55s 0.4s var(--ease-out) both;
          }
          .bc-eyebrow::before {
            content: "";
            width: 28px; height: 1.6px;
            background: currentColor;
            border-radius: 2px;
            opacity: 0.65;
            transform-origin: left center;
            animation: ruleStretch .5s 0.5s var(--ease-out-quint) both;
          }
          @keyframes ruleStretch {
            from { transform: scaleX(0); opacity: 0; }
            to   { transform: scaleX(1); opacity: 0.65; }
          }

          .bc-name {
            margin: 0;
            font-family: var(--ff-display);
            font-weight: 400;
            font-size: clamp(3rem, 5.4vw, 5rem);
            line-height: 0.92;
            letter-spacing: -0.01em;
            color: var(--ink);
            display: flex;
            flex-direction: column;
            gap: 0.05em;
            opacity: 0;
            animation: rise .7s 0.5s var(--ease-out) both;
          }
          .bc-name-first,
          .bc-name-last {
            display: inline-block;
            cursor: pointer;
            transition: color .25s var(--ease-out);
          }
          .bc-name-first { transform: translateX(-0.04em); }
          .bc-name-last  {
            position: relative;
            color: var(--ink);
            padding: 0 0.08em;
            align-self: flex-start;
          }
          /* Yellow highlighter swipe under "Li" — letterpress accent */
          .bc-name-last::before {
            content: "";
            position: absolute;
            inset: 18% -2% 12% -2%;
            background: var(--yellow-warm);
            z-index: -1;
            transform: skew(-8deg) rotate(-1.2deg);
            border-radius: 2px 6px 3px 5px;
            transform-origin: left center;
            animation: swipe 0.7s 0.95s var(--ease-out-quint) both;
          }
          @keyframes swipe {
            from { transform: skew(-8deg) rotate(-1.2deg) scaleX(0); }
            to   { transform: skew(-8deg) rotate(-1.2deg) scaleX(1); }
          }
          @media (hover: hover) {
            .bc-name-first:hover { color: var(--ink-soft); }
            .bc-name-last:hover  { color: var(--ink-soft); }
          }

          .bc-role {
            margin: 0;
            font-family: var(--ff-sans);
            font-size: clamp(0.9rem, 1vw, 1rem);
            font-weight: 500;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--ink-soft);
            opacity: 0;
            animation: rise .55s 0.7s var(--ease-out) both;
          }
          .bc-tagline {
            margin: 0;
            font-family: var(--ff-display);
            font-weight: 400;
            font-size: clamp(1.15rem, 1.4vw, 1.4rem);
            line-height: 1.4;
            color: var(--ink);
            max-width: 28ch;
            opacity: 0;
            animation: rise .6s 0.85s var(--ease-out) both;
          }

          .bc-meta {
            margin-top: auto;
            padding-top: clamp(14px, 1.6vw, 22px);
            display: flex; align-items: baseline; justify-content: space-between;
            gap: 16px;
            border-top: 1px solid var(--paper-rule);
            font-family: var(--ff-sans);
            font-size: 0.78rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--paper-mute);
            opacity: 0;
            animation: rise .55s 1.1s var(--ease-out) both;
          }
          .bc-meta strong {
            color: var(--ink);
            font-weight: 600;
          }

          /* ── Right column: statement ── */
          .bc-right {
            display: flex;
            flex-direction: column;
            gap: clamp(14px, 1.5vw, 20px);
            position: relative;
            min-height: 100%;
          }
          .bc-section {
            display: inline-flex; align-items: center; gap: 0.55rem;
            font-family: var(--ff-sans);
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--paper-mute);
            opacity: 0;
            animation: rise .55s 0.72s var(--ease-out) both;
          }
          .bc-section::before {
            content: "";
            width: 14px; height: 1.4px;
            background: currentColor;
            border-radius: 2px;
            opacity: 0.7;
          }

          .bc-statement {
            margin: 0;
            font-family: var(--ff-display);
            font-weight: 400;
            font-size: clamp(1.6rem, 2.2vw, 2.25rem);
            line-height: 1.08;
            letter-spacing: -0.005em;
            color: var(--ink);
            max-width: 14ch;
            opacity: 0;
            animation: rise .65s 0.86s var(--ease-out) both;
          }
          .bc-statement-sub {
            margin: 0;
            font-family: var(--ff-sans);
            font-size: clamp(0.92rem, 1vw, 1.02rem);
            line-height: 1.55;
            color: var(--ink-soft);
            max-width: 32ch;
            opacity: 0;
            animation: rise .55s 1s var(--ease-out) both;
          }

          /* "── turned ──" ribbon, hand-lettered, sits between halves */
          .bc-turned {
            position: relative;
            display: inline-flex; align-items: center; gap: 12px;
            margin-top: clamp(8px, 1vw, 14px);
            font-family: var(--ff-hand);
            font-size: clamp(1.15rem, 1.4vw, 1.4rem);
            color: var(--paper-mute);
            font-style: italic;
            line-height: 1;
            opacity: 0;
            animation: rise .55s 1.18s var(--ease-out) both;
          }
          .bc-turned::before,
          .bc-turned::after {
            content: "";
            width: clamp(22px, 3vw, 38px);
            height: 1.4px;
            background: currentColor;
            border-radius: 2px;
            opacity: 0.55;
            transform-origin: center;
            animation: ruleStretch .55s 1.28s var(--ease-out-quint) both;
          }

          /* Halftone fade — Lichtenstein-style printed-paper dots
             that bloom out of the bottom-right corner of the card.
             Two stacked dot grids at slightly different sizes give the
             print a real-paper density gradient instead of one flat
             pattern. The radial mask softens the bloom so the dots
             never collide with the reading copy. */
          .bc-halftone {
            position: absolute; inset: 0;
            pointer-events: none;
            z-index: 1;
            border-radius: inherit;
            background-image:
              radial-gradient(circle, rgba(58,42,28,0.55) 1.6px, transparent 1.8px),
              radial-gradient(circle, rgba(58,42,28,0.30) 1px,   transparent 1.2px);
            background-size: 14px 14px, 7px 7px;
            background-position: 0 0, 3px 3px;
            -webkit-mask-image:
              radial-gradient(ellipse 70% 80% at 100% 100%, black 5%, transparent 60%);
            mask-image:
              radial-gradient(ellipse 70% 80% at 100% 100%, black 5%, transparent 60%);
            opacity: 0;
            animation: rise .8s 0.45s var(--ease-out) both;
          }

          /* Subtle decorative sparks tucked into the card corners */
          .bc-spark {
            position: absolute; pointer-events: none;
            display: block; color: var(--ink);
          }
          .bc-spark svg { display: block; width: 100%; height: 100%; fill: currentColor; }
          .bc-spark-a {
            width: 1.1rem; height: 1.1rem;
            top: 14%; right: 6%;
            color: rgba(58,42,28,0.16);
            animation: hs-drift-a 7s 0.8s ease-in-out infinite alternate;
          }
          .bc-spark-b {
            width: 0.78rem; height: 0.78rem;
            bottom: 18%; left: 36%;
            color: rgba(58,42,28,0.10);
            animation: hs-drift-b 9s 2s ease-in-out infinite alternate;
          }
          @keyframes hs-drift-a {
            from { transform: translateY(0) rotate(0deg); }
            to   { transform: translateY(-6px) rotate(20deg); }
          }
          @keyframes hs-drift-b {
            from { transform: translateY(0) rotate(-10deg); }
            to   { transform: translateY(5px) rotate(10deg); }
          }

          /* ── Scroll cue, bottom of right column ── */
          .bc-scroll {
            margin-top: auto;
            display: inline-flex; align-items: center; gap: 0.6rem;
            font-family: var(--ff-hand);
            font-size: 1.05rem;
            color: var(--paper-mute);
            opacity: 0;
            animation: rise .5s 1.32s var(--ease-out) both;
          }
          .bc-scroll-rule {
            display: block; width: 32px; height: 1.5px;
            background: currentColor; opacity: 0.55;
          }

          /* ── Character pushed slightly PAST the right edge of the
                hero so its cropped right side stays off-screen.
                The idle wobble translates the inner <img> up to -3px
                left and the entrance overshoot reaches -6px left;
                a -12px right buffer absorbs both with margin to
                spare, so the viewer always sees a clean character
                silhouette with the cut-off edge hidden under the
                viewport's right boundary.
                The wrapper just anchors the gif; the inner img
                runs the entrance + idle wobble. No parallax — the
                gif scrolls naturally with the hero section. ── */
          .bc-char-parallax {
            position: absolute;
            right: clamp(-16px, -1vw, -10px);
            bottom: clamp(-28px, -2vw, -8px);
            /* Above the .hero-dim (z:7) so the character face
               stays clearly visible even outside the spotlight —
               it's the personality anchor of the page, never
               buried under the dim. */
            z-index: 8;
            pointer-events: none;
          }
          .bc-char-peek {
            display: block;
            width: clamp(200px, 22vw, 320px);
            height: auto;
            filter: drop-shadow(-14px 16px 28px rgba(0, 0, 0, 0.6));
            opacity: 0;
            transform-origin: 100% 100%;
            animation:
              charPeek 1s 0.95s var(--ease-out-quint) both,
              charIdle 5.5s 2.1s ease-in-out infinite alternate;
          }
          @keyframes charPeek {
            0%   { opacity: 0; transform: translate(60px, 12px) rotate(8deg); }
            55%  { opacity: 1; transform: translate(-6px, 0) rotate(-2deg); }
            100% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes charIdle {
            from { transform: translate(0, 0) rotate(0deg); }
            to   { transform: translate(-3px, -4px) rotate(-1.5deg); }
          }

          @keyframes rise {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .chip-tooltip {
            position: fixed; z-index: 9998; pointer-events: none;
            width: 200px; border-radius: 12px; overflow: hidden;
            border: 2px solid var(--lilac-light);
            opacity: 0; transform: scale(0.92) translateY(6px);
            transition: opacity .2s, transform .2s var(--ease-out);
            box-shadow: 0 12px 36px rgba(0,0,0,0.18);
            background: var(--paper);
          }
          .chip-tooltip img { width: 100%; display: block; }
          .chip-tooltip.visible { opacity: 1; transform: scale(1) translateY(0); }

          /* ── Responsive ── */
          @media (max-width: 880px) {
            .hero { padding: 4.5rem 1.25rem 4rem; }
            .business-card {
              aspect-ratio: auto;
              min-height: 0;
              padding: clamp(28px, 6vw, 40px) clamp(24px, 5vw, 36px);
            }
            .bc-grid {
              grid-template-columns: 1fr;
              row-gap: clamp(20px, 4vw, 28px);
            }
            .bc-divider {
              width: 100%; height: 1px;
              background: linear-gradient(90deg,
                transparent 0%, var(--paper-rule) 12%,
                var(--paper-rule) 88%, transparent 100%);
            }
            .bc-meta { padding-top: 14px; }
            .bc-char-parallax {
              right: -12px;
              bottom: -34px;
            }
            .bc-char-peek {
              width: clamp(160px, 38vw, 220px);
            }
            .bc-postit { right: 24px; }
          }

          @media (prefers-reduced-motion: reduce) {
            .hero, .hero::before,
            .business-card, .bc-postit,
            .bc-char-parallax, .bc-char-peek,
            .bc-halftone,
            .bc-eyebrow, .bc-eyebrow::before, .bc-name,
            .bc-role, .bc-tagline, .bc-meta, .bc-section,
            .bc-statement, .bc-statement-sub,
            .bc-turned, .bc-turned::before, .bc-turned::after,
            .bc-scroll, .bc-divider,
            .bc-name-last::before,
            .bc-spark-a, .bc-spark-b {
              animation: none !important;
              opacity: 1 !important;
            }
            .business-card { transform: rotate(-0.8deg) !important; }
            .bc-postit     { transform: rotate(5deg)   !important; }
            .bc-name-last::before {
              transform: skew(-8deg) rotate(-1.2deg) scaleX(1) !important;
            }
            .bc-char-peek  { transform: none !important; }
          }
        `}</style>

        <div className="hero-cursor-glow" aria-hidden />
        {/* Spotlight dim — covers everything; the mask cuts a
            transparent hole at the cursor so content is only
            visible inside the spotlight. */}
        <div className="hero-dim" aria-hidden />
        {/* Halftone edge — Lichtenstein dot pattern painted in
            a ring around the spotlight rim. Sits at the same
            z-index as .hero-dim and adds a printed-paper fade
            between the bright center and the dark outside. */}
        <div className="hero-halftone-edge" aria-hidden />

        <div className="bc-stage">
          <article className="business-card" aria-label="Kathleen Li — designer business card">
            {/* Card shade — darkens the paper by default; fades
                to transparent when the cursor enters the hero so
                the card paper is "responsive" to the spotlight.
                Sits below .bc-grid (z:2) so text on top is never
                affected by this overlay. */}
            <span className="bc-card-shade" aria-hidden />
            {/* Halftone print bloom anchored to bottom-right corner */}
            <span className="bc-halftone" aria-hidden />

            {/* Yellow Post-it tab pinned to the card's upper-right */}
            <span className="bc-postit" aria-hidden>
              say&nbsp;hi&nbsp;→
            </span>

            {/* Decorative sparks tucked in the corners */}
            <span className="bc-spark bc-spark-a" aria-hidden>
              <svg viewBox="0 0 100 100" focusable={false}>
                <use href="#sparkle" />
              </svg>
            </span>
            <span className="bc-spark bc-spark-b" aria-hidden>
              <svg viewBox="0 0 100 100" focusable={false}>
                <use href="#sparkle" />
              </svg>
            </span>

            <div className="bc-grid">
              {/* Left column — identity */}
              <section className="bc-left">
                <span className="bc-eyebrow">designer · artist</span>

                <h1 className="bc-name" aria-label="Kathleen Li">
                  <span
                    className="bc-name-first"
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setArtistVisible(true)}
                    onMouseLeave={() => setArtistVisible(false)}
                    onMouseMove={trackTip}
                  >
                    Kathleen
                  </span>
                  <span
                    className="bc-name-last"
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setDesignerVisible(true)}
                    onMouseLeave={() => setDesignerVisible(false)}
                    onMouseMove={trackTip}
                  >
                    Li
                  </span>
                </h1>

                <p className="bc-role">UX · Interaction · UI Design</p>
                <p className="bc-tagline">
                  An artist who learned to design systems — and a designer who
                  never stopped making art.
                </p>

                <div className="bc-meta">
                  <span><strong>Purdue</strong> · Class of 2028</span>
                  <span>West Lafayette, IN</span>
                </div>
              </section>

              <span className="bc-divider" aria-hidden />

              {/* Right column — statement */}
              <section className="bc-right">
                <span className="bc-section">The studio</span>

                <p className="bc-statement">
                  From one canvas, to every screen.
                </p>
                <p className="bc-statement-sub">
                  Building interfaces that feel as good as they look — research,
                  systems, and the occasional sticker sheet.
                </p>

                <span className="bc-turned" aria-hidden>turned</span>

                <span className="bc-scroll">
                  <span className="bc-scroll-rule" />
                  scroll to explore
                </span>
              </section>
            </div>
          </article>
        </div>

        {/* char.gif peeks from the right side of the hero. The
            wrapper handles parallax (JS-driven), the inner img runs
            its entrance + idle animations. Sibling of .bc-stage so it
            positions against the .hero, not against the card. */}
        <div
          className="bc-char-parallax"
          aria-hidden
        >
          <img
            className="bc-char-peek"
            src="/img/char.gif"
            alt=""
          />
        </div>
      </section>

      {/* Chip tooltips — fixed-position so they escape hero overflow */}
      <div
        className={`chip-tooltip${artistVisible ? " visible" : ""}`}
        style={{ left: tipPos.x, top: tipPos.y }}
        aria-hidden
      >
        <img src="/img/artist.png" alt="" />
      </div>
      <div
        className={`chip-tooltip${designerVisible ? " visible" : ""}`}
        style={{ left: tipPos.x, top: tipPos.y }}
        aria-hidden
      >
        <img src="/img/designer.png" alt="" />
      </div>
    </>
  );
}
