# Portfolio site handover

A working note for the next Claude session. Keeps context tight so you don't have to re-derive the design language and naming conventions.

---

## Who, what, where

- **Designer:** Kathleen Li — Purdue UX undergrad with a design-engineering minor. Seeking summer 2026 product / design-engineering internships at design-forward tech (Apple, Google, Microsoft, Riot Games).
- **Stack:** Next.js 14 (App Router) · TypeScript · static export · Lenis smooth scroll.
- **Repo root:** `/Users/kathleenli/Desktop/Portfolio/next-site`
- **Email:** hapi52321@gmail.com
- **Résumé:** `/public/resume.pdf` exists on disk but is not currently linked from the UI.

---

## Design language — the lens to keep

The site reads as **a designer's sticker collage**, not a tech startup landing page. Hold this line aggressively against AI-slop pulls.

- **Palette:** cream paper (`--paper`) on a deep navy hero (`--hero-bg`), warm yellow chip (`--chip-yellow`), muted green status, maroon 李曦 chip, terracotta accents. No blue-purple gradients. No glassmorphism. No glow.
- **Type:** five intentional fonts, each with a job. **K2D** display/headings + dark-stage body. **CookieRun** warm body on cream surfaces. **Caveat** handwriting accents (hero subtitle, design notes). **JetBrains Mono** labels and metadata. **Long Cang** loaded for 李曦 only (`text=李曦` URL, ~2 KB).
- **Motion:** handwriting trace on the wordmark, polaroid cursor-peek + click-swap, scroll-snap insight carousel, sticker parallax, smooth scroll. Custom SVG sparkles. **No CSS-default animations.** Cubic-bezier easing tokens (`--ease-out-quart`).
- **Layout grammar:** the case-study skeleton is **Outcome → Overview → Process phases → Takeaways**, with Process phases named for what they actually were (`Researching · Ideating · Verifying` for JT; `Researching · Designing · Implementing` for RH; `Researching · Ideating · Verifying` for Frogslayer). **Do not restructure this skeleton.**

---

## Top-level structure

```
app/
  layout.tsx                  fonts via next/font, SmoothScroll, CursorFollower, ClickSound
  page.tsx                    SiteNavV2 → HeroV2 → ProjectsV2 → ac-scene (ConnectV2 + AboutV2)
  globals.css                 ALL CSS lives here. Comments label each block.
  projects/
    frogslayer/page.tsx       Co-Lead designer, kiosk system, NDA. 6 designers.
    journeytrack/page.tsx     Designer on 9-designer team, 14 weeks, AI maintenance agent.
    researchhub/page.tsx      Sole UI Designer → Design Engineer, 5 engineers + me.
components/
  HeroV2.tsx                  sticker collage + polaroid + wordmark
  ArtistDesignerWordmark.tsx  the t→D X-ligature SVG with handwriting trace
  ProjectsV2.tsx              folder-morph project cards w/ cursor-tracked read pill
  AboutV2.tsx                 about section (foreground, slides off)
  ConnectV2.tsx               connect section (sticky background, revealed)
  SiteNavV2.tsx               home nav (Index/Work/About/Connect)
  CaseSectionNav.tsx          case-study nav (Back to projects + section pill)
  CaseCover.tsx               case-study hero cover
  UsabilityRound.tsx          Frogslayer Verifying carousel (client component)
  SmoothScroll.tsx            Lenis + parallax target registry
  CursorFollower.tsx          cursor effect
  ClickSound.tsx              global click sound
  ScrollRestore.tsx           scroll-to-anchor restoration
  RevealOnScroll.tsx          generic reveal helper
  SparkleField.tsx            hero sparkle cycling system
  StatusCheck.tsx             status bars section (currently unused on home; available if needed)
  GlassShapes.tsx             decorative shapes
  StageBand.tsx               decorative band
  MenuNav.tsx                 alternate hero variant (not currently rendered)
public/
  resume.pdf                  on disk, NOT linked anywhere in the UI yet
  fonts/, img/, sounds/, card_img/, shapes/
```

---

## Hero composition (HeroV2.tsx)

The hero is intentionally rich. Don't simplify it without explicit direction — it's how the personality is sold.

- **Wordmark:** "Artist · Designer" with the `t→D` forming an X-ligature. Handwriting traces in via `ArtistDesignerWordmark`. Subtitle below in JetBrains Mono: "From one scene to multiple scenarios".
- **Polaroid:** centered, fixed-width 320px, rotated -2°. Click to swap drawing ↔ photo; hover to peek at the other inside a spotlight. First-load hint plays once at ~1900ms (a swap → settle → swap-back so the viewer notices it's interactive). Caption: `Last Updated · 05/07/26` + "I design solutions with moments worth lingering on".
- **Kathleen Li sticker** (top-right, olive yellow, rotated +8°). Carries the 李曦 chip as a DOM child so the two move as one element (parallax inheritance + no drift). Sparkle burst SVG. Hatching corner accents.
- **Currently designing green sticker** (bottom-left-ish, rotated -5°): "Currently a Product Design intern — drafting from cafes!". Interlocked-circles doodle perched above-right of the sticker. Anchored via `top: min(calc(642px + min(12vw, 132px)), calc(68vh + 20px))` — the `68vh + 20px` cap keeps it visible on common laptop viewports (1080-1136px).
- **Parallax:** all of these stickers drift at speed `-0.18` so they feel like one physical layer. Polaroid drifts at `-0.12`. Wordmark at `-0.13`. Registered in `SmoothScroll.tsx` `PARALLAX_TARGETS`.
- **First-load entrance choreography:** wordmark letters trace in (760ms total) → polaroid lands at 980-1360ms → Kathleen sticker settles ~1440ms → green sticker settles ~1700ms → polaroid hint plays at 1900ms.

### Hero quirks to remember

- `.hero` is `position: sticky`, `top: 0` — so `el.scrollIntoView()` on `#hero` no-ops when scrolled (the element is "already in view"). Use `window.scrollTo({ top: 0, behavior: "smooth" })` instead. Already handled inside `smoothScrollTo()` in `SiteNavV2.tsx`.
- The `.read-pill` (cursor-following "3 MIN READ" pill on folder hover) has `white-space: nowrap; width: max-content; max-width: none` to prevent wrap-into-circle when the cursor approaches the right edge.

---

## Case study pattern

Every case study uses the same outer skeleton — **don't restructure it**:

```
<CaseCover />
<main id="main" className="case-body">
  <p className="case-disclaimer">…</p>  ← NDA notice (Frogslayer)
  <section id="outcome|results">  ← lead with the result
  <section id="overview">          ← problem + role
  <section id="researching">       ← named process phase 1
  <section id="ideating|designing">← named process phase 2
  <section id="verifying|implementing"> ← named process phase 3
  <section id="takeaways">         ← what was learned + next steps
</main>
```

Inside each section: `<h2>` then `<h3>` subheads then prose with `<mark className="hl">` for key-phrase emphasis. Image placeholders use `<figure><div className="image-slot">…</div><figcaption>…</figcaption></figure>`.

The case nav (`CaseSectionNav.tsx`) auto-scrolls the active label into view, and the pill's corner radius collapses from 999px to 10px on whichever side has overflow — visual affordance that there's more out of frame.

### Project facts (for filling deliverables)

- **Frogslayer** · `id="results"` (yes, "Results" not "Outcome" — it's the only one) · 16 weeks · 6 designers · Co-Lead Designer + Point of Communication · Hospitality/entertainment kiosk system · NDA · Adopted as Frogslayer's internal reference.
- **JourneyTrack** · 14 weeks · 9 designers · Designer (UI & Interaction) · AI customer-journey maintenance agent · Delivered hi-fi prototype + design-principles doc to client leadership.
- **ResearchHub** · 16 weeks · 5 engineers + me · Sole UI Designer → Design Engineer · Purdue student-faculty research platform · Shipping summer 2026.

### JT Researching layout (don't touch without direction)

The JT Researching section is intentionally structured to show the parallel-team move:

```
<h2>Researching</h2>
<h3>Understanding what would make a journey maintenance agent effective</h3>
<p>intro — 4 lenses</p>

<p className="research-split-lead">"split into two smaller teams running in parallel:"</p>
<div className="parallel-tracks">                ← 2-col grid, faint divider down middle
  <div className="research-track">
    <span className="track-label">Track 1</span>
    <h3>Current state of platform</h3>
    <p>…</p>
    <figure>image placeholder</figure>
  </div>
  <div className="research-track">
    <span className="track-label">Track 2</span>
    <h3>Current state of agent components</h3>
    …
  </div>
</div>

<h3>Industry & interaction patterns</h3>  ← grouped together; same material
  Direct competitors + image
  Indirect competitors + image
  Interaction pattern synthesis paragraph + image

<h3>User interviews</h3>  ← 6 JT users, affinity diagramming
  + image

<p>Throughline: maintenance today is reactive, manual, tied to milestones…</p>
```

CSS: `.parallel-tracks` (in `globals.css`, search for "Parallel research tracks") + `.research-track`, `.track-label`. Stacks to single column under 760px.

### Frogslayer Verifying layout (don't touch without direction)

Three Round headers (`<UsabilityRound>` client component), each containing 3-4 `<InsightCard>` children. **One card visible at a time** via `scroll-snap-type: x mandatory` + `flex: 0 0 100%`. Progress dots in the round header track scroll position and let the user click-jump. Files: `components/UsabilityRound.tsx`, CSS at `.usability-rounds .ur-*` blocks in `globals.css`.

---

## CSS — what to know before editing

`app/globals.css` is one big stylesheet. Conventions:

- Comments label every major block. Skim for the section header before editing.
- Tokens defined at `:root` (palette, fonts, eases, hero-fg-rgb, fg-rgb).
- Case-study selectors: prefix with `.case-section` (e.g. `.case-section h2`, `.case-section .hl`).
- Highlight pattern: `<mark className="hl">phrase</mark>` → accent-color text, no background fill. Defined at `.case-section .hl`.
- Mobile breakpoint is consistently `@media (max-width: 820px)` for layout shifts, `@media (max-width: 640px)` for hero-specific simplification.

### Recently changed in this session — for next-chat awareness

1. **Green status sticker positioning.** Raised: `top: min(calc(642px + min(12vw, 132px)), calc(68vh + 20px))`. The `68vh + 20px` cap keeps it visible on common laptop viewports.
2. **Green status sticker parallax.** Re-added to `PARALLAX_TARGETS` at speed `-0.18` with `baseRotate: "-5deg"` so it moves in lockstep with the Kathleen Li sticker.
3. **Read-pill wrapping fix.** `.read-pill` gained `white-space: nowrap; width: max-content; max-width: none` to prevent the cursor-following "3 MIN READ" pill from wrapping into a circle near the right viewport edge.
4. **smoothScrollTo hero fix.** In `SiteNavV2.tsx`, `smoothScrollTo("hero")` now uses `window.scrollTo({ top: 0 })` instead of `el.scrollIntoView()`, because the hero is sticky-pinned and scrollIntoView no-ops.

### Reverted this session — DON'T re-add without explicit ask

A `/critique`-driven pass added a bunch of "recruiter mode" affordances (a chip on the hero, a Selected work rail under the polaroid, a RecruiterSummary section between Hero and Projects, outcome-chip grids on each case study, subsection-gist lines on JT Researching, Résumé+Email chips in both navs). **All reverted.** The user found it cluttered. The site is back to its pre-critique state. There is an orphan file `components/RecruiterSummary.tsx` stubbed to `export {};` that the sandbox couldn't `rm` — safe to delete manually.

---

## Known image placeholders (intentional, work in progress)

All `<div className="image-slot">…</div>` are placeholders for real artwork the user is still producing. **Don't replace them with stock or AI-generated visuals.** Captions describe what the real image will be. The polaroid has `DROP YOUR SELF-DOODLE` / `DROP A PHOTO OF YOU` placeholders too — those are intentional.

---

## Verification before shipping any change

```bash
cd /Users/kathleenli/Desktop/Portfolio/next-site
npx tsc --noEmit
```

Must exit clean. Mobile breakpoints to spot-check: 1136px (most laptops), 820px (small laptops), 640px (mobile).

---

## How the user works

- Concise, direct feedback. They notice spacing, alignment, motion. They iterate fast — one change per turn is normal.
- They'll ask for revert if a change feels off. Don't re-litigate, just roll back cleanly.
- When they share a screenshot, the issue is almost always at the highlighted region — read the image carefully before responding.
- They appreciate explanations of *why* a change works, not just *what* was changed. Keep explanations to the change's mechanism + downstream implication; skip the recap of obvious facts.
