# Portfolio Handover

**Project:** Kathleen Li — personal and professional UX Design portfolio  
**Stack:** Next.js 14 (TypeScript, App Router, static export) · Lenis v1.3.23 smooth scroll · Google Fonts via `next/font`  
**Repo root:** `/Users/kathleenli/Desktop/Portfolio/next-site/`  
**Live deploy:** GitHub Pages via `.github/workflows/static.yml`

---

## Goals, audience & design intent

### Who this is for
Recruiters and hiring managers at **design-forward tech companies** — primarily Apple, Google, Microsoft, and Riot Games. These are people who review dozens of portfolios a day and have a sharp eye for craft. The site needs to clear their bar for visual polish *and* signal that Kathleen can build what she designs (design-engineering crossover).

### What it needs to communicate
- **Credibility fast.** Role, school, and strongest projects should land within the first scroll without reading a word.  
- **Taste, not just skill.** The interactions, motion, and typography should feel intentional and personal — not a template. A recruiter at Apple or Riot should sense that this person has opinions about craft.  
- **Personality alongside professionalism.** The site is allowed to be warm, a little playful, and distinctly Kathleen's — the illustrated stickers, hand-lettered accents, food-list easter egg, and the artist-before-designer framing all serve this. It should feel like meeting a person, not reading a résumé.

### Tone
Professional but not corporate. Precise but not cold. The copy uses first person, avoids buzzwords, and names real outcomes ("Frogslayer adopted as their internal reference", "lead UI at Purdue Stack"). Humor and softness are welcome where they fit; they should never undermine competence.

### Visual direction
- High contrast, dark-on-cream palette with warm amber accents — approachable, not sterile.  
- Motion is purposeful: parallax, magnetic hover, and scroll reveals add depth without being distracting. Every animation has a mechanical reason (shows where things live in z-space, confirms interactivity).  
- Typography mixes a geometric sans (K2D) with a handwriting face (Caveat) to balance the engineered and the drawn — echoing the design-engineering duality. The About section body copy uses **CookieRun** (the "Cookie Kingdom" font) for a warm, distinctly personal feel that separates it from the rest of the site's cleaner type stack. This is a deliberate personality marker — don't replace or homogenise it.  
- Folder metaphor in Projects: playful and tactile, differentiates from the card-grid default without sacrificing scannability.

### What to avoid
- Generic "AI portfolio" aesthetics: gradient text, glassmorphism, hero metrics grids, neon glow.  
- Anything that reads as trying too hard or over-explaining. Let the work carry the weight.  
- Cluttering interactions — if a motion doesn't add information or delight, cut it.
- **Don't restructure the case-study skeleton** (`Outcome → Overview → Process phases → Takeaways`) or the JT parallel-tracks / Frogslayer one-card-at-a-time carousel layouts without an explicit ask. Each was an intentional decision arrived at through iteration.

---

## Architecture overview

```
app/
  layout.tsx        — root layout: fonts, <CursorFollower />, <SmoothScroll />, <ClickSound />
  globals.css       — single CSS file for the entire site (~3 200 lines)
  page.tsx          — home: HeroV2 · ProjectsV2 · [.ac-scene] · RevealOnScroll
  projects/
    frogslayer/page.tsx    — Co-Lead Designer · kiosk system · NDA · 6 designers
    journeytrack/page.tsx  — Designer on 9-designer team · 14 weeks · AI maintenance agent
    researchhub/page.tsx   — Sole UI Designer → Design Engineer · 5 engineers + me

components/
  HeroV2.tsx        — hero section
  ArtistDesignerWordmark.tsx — t→D X-ligature SVG with handwriting trace
  ProjectsV2.tsx    — folder cards + 3-D tilt hover effect
  AboutV2.tsx       — About section with HoverWord magnetic keywords
  ConnectV2.tsx     — Connect section (sticky behind About)
  SiteNavV2.tsx     — fixed nav with active-section tracking
  CaseSectionNav.tsx — case-study nav (Back to projects + section pill)
  CaseCover.tsx     — case-study hero cover
  UsabilityRound.tsx — Frogslayer Verifying carousel (client component)
  SmoothScroll.tsx  — Lenis init + parallax + About/Connect scene height
  RevealOnScroll.tsx — IntersectionObserver scroll-reveal (.reveal → .in)
  SparkleField.tsx  — animated sparkle canvas
  CursorFollower.tsx — custom cursor ring (desktop only, pointer-events:none)
  ClickSound.tsx    — global click sound
  ScrollRestore.tsx — scroll-to-anchor restoration
  StatusCheck.tsx   — status bars section (currently unused; available)
```

---

## About / Connect sticky reveal

This is the most complex layout mechanic on the page.

```
<div class="ac-scene">       position:relative; height set by JS
  <ConnectV2 />              position:sticky; top:0; z-index:0; height:100vh
  <AboutV2 />                position:absolute; top:0; z-index:2
</div>
```

- **How it works:** About sits on top of Connect. As the user scrolls through `.ac-scene`, About slides off revealing Connect behind it.  
- **JS (SmoothScroll.tsx):** `sceneEl.style.height = aboutEl.offsetHeight + connectEl.offsetHeight` — gives the sticky element a valid scroll range. A `ResizeObserver` keeps it in sync.  
- **Nav "Connect" link** (`SiteNavV2.tsx → smoothScrollTo`): scrolls to `scene.offsetTop + about.offsetHeight` — NOT `#connect` directly, because `getBoundingClientRect().top` on a sticky element is always ~0 while in range.  
- **Active-section detection** (`useActiveSection`): Connect is only marked active once `aboutEl.getBoundingClientRect().bottom <= 0` — About has fully exited the viewport.  
- **Peek strip** (`AboutV2.tsx → handlePeekClick`): the "Connect ↓" bar at About's bottom uses `window.scrollTo({ top: scene.offsetTop + about.offsetHeight })`.

---

## Parallax system (SmoothScroll.tsx)

Lenis fires `onScroll({ scroll })` on every RAF. Each registered element gets `el.style.transform` written directly (no React re-renders).

| Selector | Speed | Notes |
|---|---|---|
| `.ribbon-artist` | −0.13 | `centredX:true` preserves `translateX(-50%)` |
| `.sticker.name-yellow` | −0.18 | `baseRotate:"8deg"` |
| `.sticker.designing-green` | −0.18 | `baseRotate:"-5deg"` — matched to Kathleen so both stickers drift in lockstep. Previously was −0.22 (too aggressive — sticker drifted noticeably faster than its siblings and read as "minimising"); briefly removed entirely, then re-added at −0.18. |
| `.hero-polaroid` | −0.12 | `centred:true` preserves `translate(-50%,-50%)` |
| `.case-hero-image` | −0.18 | project cover image |
| `.connect-row` | −0.18 | `relativeToScene:true` — delta from ac-scene top, not page top |

The `.chip-zh` (李曦) lives inside `.sticker.name-yellow` as a DOM child, so it inherits Kathleen's parallax transform automatically. **Do NOT register it separately** in `PARALLAX_TARGETS` — it'll get double-transformed.

**Sign convention (empirically confirmed):** negative speed = element drifts **downward** as the user scrolls down.

`buildEntries()` fires after 2 400 ms (all entrance animations done) and sets `el.style.animation = "none"` to clear CSS fill-mode locks. Parallax is skipped on `pointer:coarse` / touch devices (Lenis still runs for smooth scroll).

---

## Hero composition (HeroV2.tsx)

The hero is intentionally rich. **Don't simplify it without explicit direction** — it's how the personality is sold.

- **Wordmark:** "Artist · Designer" with the `t→D` forming an X-ligature. Handwriting traces in via `ArtistDesignerWordmark`. Subtitle below in JetBrains Mono: "From one scene to multiple scenarios".
- **Polaroid:** centered, fixed-width 320 px, rotated −2°. Click to swap drawing ↔ photo; hover to peek at the other inside a spotlight. First-load hint plays once at ~1 900 ms (a swap → settle → swap-back so the viewer notices it's interactive). Caption: `Last Updated · 05/07/26` + "I design solutions with moments worth lingering on".
- **Kathleen Li sticker** (top-right, olive yellow, rotated +8°). Carries the 李曦 chip as a DOM child so the two move as one element. Sparkle burst SVG. Hatching corner accents.
- **Currently designing green sticker** (rotated −5°): "Currently a Product Design intern — drafting from cafes!". Interlocked-circles doodle perched above-right of the sticker. Anchored via `top: min(calc(642px + min(12vw, 132px)), calc(68vh + 20px))`. The `68vh + 20px` cap keeps it visible on common laptop viewports (1080–1136 px) — the previous hard-pixel anchor was pushing it below the fold.
- **Entrance choreography:** wordmark letters trace in (760 ms total) → polaroid lands at 980–1360 ms → Kathleen sticker settles ~1 440 ms → green sticker settles ~1 700 ms → polaroid hint plays at 1 900 ms.

### Hero quirks to remember

- `.hero` is `position: sticky`, `top: 0` — so `el.scrollIntoView()` on `#hero` no-ops when scrolled (the element is "already in view"). Use `window.scrollTo({ top: 0, behavior: "smooth" })` instead. Already handled inside `smoothScrollTo("hero")` in `SiteNavV2.tsx`.
- The `.read-pill` (cursor-following "3 MIN READ" pill on folder hover) has `white-space: nowrap; width: max-content; max-width: none` to prevent it from wrapping into a near-circle when the cursor approaches the right viewport edge.

---

## Case-study pattern

Every case study uses the same outer skeleton — **don't restructure it**:

```
<CaseCover />
<main id="main" className="case-body">
  <p className="case-disclaimer">…</p>  ← NDA notice (Frogslayer only)
  <section id="outcome|results">  ← lead with the result
  <section id="overview">          ← problem + role
  <section id="researching">       ← named process phase 1
  <section id="ideating|designing">← named process phase 2
  <section id="verifying|implementing"> ← named process phase 3
  <section id="takeaways">         ← what was learned + next steps
</main>
```

Inside each section: `<h2>` then `<h3>` subheads then prose with `<mark className="hl">` for key-phrase emphasis. Image placeholders use `<figure><div className="image-slot">…</div><figcaption>…</figcaption></figure>`.

The case nav (`CaseSectionNav.tsx`) auto-scrolls the active label into view; the pill's corner radius collapses from 999 px to 10 px on whichever side has overflow — visual affordance that there's more out of frame.

### Project facts (for filling deliverables)

- **Frogslayer** · section id is `results` (not `outcome` — only one that uses that label) · 16 weeks · 6 designers · Co-Lead Designer + Point of Communication · Hospitality/entertainment kiosk system · NDA · Adopted as Frogslayer's internal reference.
- **JourneyTrack** · 14 weeks · 9 designers · Designer (UI & Interaction) · AI customer-journey maintenance agent · Delivered hi-fi prototype + design-principles doc to client leadership.
- **ResearchHub** · 16 weeks · 5 engineers + me · Sole UI Designer → Design Engineer · Purdue student-faculty research platform · Shipping summer 2026.

### JT Researching — parallel-tracks layout (don't touch without direction)

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
    …
  </div>
  <div className="research-track">
    <span className="track-label">Track 2</span>
    <h3>Current state of agent components</h3>
    …
  </div>
</div>

<h3>Industry & interaction patterns</h3>  ← grouped together (same material)
  Direct competitors + image
  Indirect competitors + image
  Interaction-pattern-synthesis paragraph + image

<h3>User interviews</h3>  ← 6 JT users, affinity diagramming + image

<p>Throughline: maintenance today is reactive, manual, tied to milestones…</p>
```

CSS: `.parallel-tracks` (in `globals.css`, search for "Parallel research tracks") + `.research-track`, `.track-label`. Stacks to single column under 760 px.

### Frogslayer Verifying — one-card carousel (don't touch without direction)

Three Round headers (`<UsabilityRound>` client component), each containing 3–4 `<InsightCard>` children. **One card visible at a time** via `scroll-snap-type: x mandatory` + `flex: 0 0 100%`. Progress dots in the round header track scroll position and let the user click-jump. Files: `components/UsabilityRound.tsx`, CSS at `.usability-rounds .ur-*` blocks in `globals.css`.

---

## Projects — folder cards (ProjectsV2.tsx)

- **Open/close morph:** `phases[id]` state → `.folder-art--hovered` / `.folder-art--leaving` CSS classes → keyframe animations (`closedExit`, `openEnter`, `closedReturn`, `openExit`) at 460 ms.  
- **3-D magnetic tilt:** `handleTiltMove` writes `perspective(800px) translateX/Y rotateX/Y` to `.folder-tilt-wrap` ref on every `mousemove`. `handleTiltLeave` springs back with 700 ms spring ease. No React re-renders — direct DOM writes.  
- **Entrance:** per-folder `IntersectionObserver` adds `.in` when each card enters the viewport individually.  
- **Read-time pill:** `position:fixed` cursor-follower div, `pointer-events:none`.

---

## About — HoverWord (AboutV2.tsx)

Inline keywords (`iPad`, `Purdue Stack`, `drawing…`, `SASE`, `next trip`) that do three things simultaneously:

1. **Floating pill image card** on hover — `.hw-pill` is `position:fixed`, follows cursor via direct DOM writes to `pillRef.current.style.left/top` on every `mousemove`.  
2. **Magnetic 3-D tilt** on the keyword label — `applyTilt` writes `perspective(400px) translateX/Y rotateX/Y` to `labelRef.current` on `mousemove`. Resets on `mouseleave`/`blur` with 600 ms spring. Values scaled down vs folders (±5 px translate, ±8°/5° rotate).  
3. **Touch support** — pill appears above finger on `touchstart`, auto-hides 1.4 s after `touchend`.  
4. **Keyboard/focus** — pill centred above the word's bounding rect on focus.

Image slots are **placeholders** — replace `<div class="image-slot">` with `<img src="…">` when photos are ready. Views: `stack` (Purdue Stack screenshot), `mentor` (SASE mentoring photo), `illos` (illustration), `food` (Beli screenshot), `sketch` (iPad/sketchbook).

---

## Connect section (ConnectV2.tsx)

- **Layout:** `.connect > .container` is `height:100%; display:flex; flex-direction:column`. `.connect-row` has `flex:1`. `.foot` has `margin-top:auto` (pinned to bottom).  
- **connect-row** starts at `padding-top:180px` (hidden under About on first reveal), then parallax drifts it down into view.  
- **Links:** Email (mailto + copy-to-clipboard toggle), LinkedIn (pending), Resume (pending). `.c-link:first-child { border-top:none }` and `.c-link:last-child { border-bottom:none }` remove outer separator lines.  
- **Sparkle field:** `count=7, scale=1.5, slowdown=2.2` — fewer/larger/slower than hero.

---

## Nav (SiteNavV2.tsx)

- Sliding highlight pill: `useLayoutEffect` + `ResizeObserver` measures active `.nav-link` and translates a background `<span>` to it.  
- Mobile: hamburger toggle (`.nav-menu-toggle`), closes on Escape / scroll / outside click.  
- `smoothScrollTo("connect")` special-cases the sticky element (see About / Connect section).
- `smoothScrollTo("hero")` uses `window.scrollTo({ top: 0 })` instead of `scrollIntoView` because `.hero` is sticky-pinned. Without this, clicking the Kathleen Li mark while scrolled was a no-op.

---

## CSS conventions (globals.css)

- Font tokens: `--f-sans` (K2D), `--f-mono` (JetBrains Mono), `--f-display` (K2D 800), `--f-hand` (Caveat), `--f-hand-zh` (Long Cang — loaded via targeted `<link text="李曦">` for just those 2 glyphs), `--f-cookie` (CookieRun — warm body on cream surfaces, About section).  
- Color tokens: `--accent: #C68D5F`, `--accent-soft: #D9A983`, `--hero-bg` / `--hero-fg` (dark bg, cream fg used in Connect + peek strip).  
- `.reveal` / `.reveal-stagger` → `.in` driven by `RevealOnScroll.tsx` (IntersectionObserver).  
- `.connect-row.reveal` is pre-marked `.in` at page load — it is always "in viewport" since Connect is sticky, so the parallax scroll is the reveal instead of an IO callback.
- Case-study selectors: prefix with `.case-section` (e.g. `.case-section h2`, `.case-section .hl`). Highlight pattern: `<mark className="hl">phrase</mark>` → accent-color text, no background fill.
- Mobile breakpoints used consistently: `@media (max-width: 820px)` for layout shifts, `@media (max-width: 640px)` for hero-specific simplification, `@media (max-width: 760px)` for the JT `.parallel-tracks` stack.

---

## Recent session log

### Surviving changes
- **Green status sticker raised.** Top: `min(calc(642px + min(12vw, 132px)), calc(68vh + 20px))`. The `68vh + 20px` cap keeps it visible on common laptop viewports — without the cap it dropped below the fold on anything shorter than ~1 100 px.
- **Green status sticker parallax restored** at speed `-0.18` (not `-0.22`) so it drifts in lockstep with the Kathleen Li sticker.
- **`.read-pill` no-wrap fix.** `white-space: nowrap; width: max-content; max-width: none`. The cursor-following "3 MIN READ" pill was deforming into a near-circle when the cursor approached the right viewport edge.
- **`smoothScrollTo("hero")` fix.** Uses `window.scrollTo({ top: 0 })` because the hero is sticky-pinned and `scrollIntoView` no-ops.
- **JT Researching restructured** into a parallel-tracks grid + Industry & interaction patterns + User interviews + throughline. The text was deliberately sparsed (≈60% shorter than first attempt) to match ResearchHub's skim-rhythm.
- **Frogslayer Verifying rebuilt** as a one-card-at-a-time scroll-snap carousel with progress dots in the round header.

### Reverted (DO NOT re-add without explicit ask)
A `/critique`-driven pass added "recruiter mode" affordances and was fully reverted because it made the site feel cluttered:
- "For recruiters ↓" chip on the hero
- "Selected work" rail under the polaroid
- `<RecruiterSummary />` section between Hero and Projects
- Outcome-chip grids on each case study (`<div class="outcome-chips">`)
- `.subsection-gist` lines on JT Researching
- Résumé + Email chips in both site nav (`.nav-actions`) and case nav (`.case-nav-actions`)
- Sub-positioning line under the wordmark (`.sub-id` — "Kathleen Li · UX undergrad…")

Three orphan files exist in `next-site/` that the sandbox couldn't `rm` — safe to delete manually:
- `components/RecruiterSummary.tsx` (stubbed to `export {};`)
- `HANDOVER.md` (stubbed to a pointer comment)
- `handoff.md` (stubbed to a pointer comment)

---

## Known pending items

- **HoverWord images:** all five pill views still show placeholder text. Swap `<div class="image-slot">` with `<img src="…">` when assets are ready.  
- **LinkedIn / Resume links:** both `.c-link.is-pending` in ConnectV2 — add real `href` values when ready. (`next-site/public/resume.pdf` is on disk; not yet wired to UI.)  
- **Case-study image placeholders:** every `<div className="image-slot">` is intentional — real artwork is still being produced. Don't replace with stock or AI imagery.
- **Git lock:** if `A lock file already exists` blocks a commit, delete `.git/index.lock` in the repo root then retry.

---

## Useful commands

```bash
cd next-site
npm run dev          # dev server → http://localhost:3000
npx tsc --noEmit     # type-check without building
npm run build        # static export → out/
```

---

## How the user works

- Concise, direct feedback. They notice spacing, alignment, motion. They iterate fast — one change per turn is normal.
- They'll ask for a revert if a change feels off. Don't re-litigate, just roll back cleanly.
- When they share a screenshot, the issue is almost always at the highlighted region — read the image carefully before responding.
- They appreciate explanations of *why* a change works (mechanism + downstream implication), not a recap of obvious facts.
