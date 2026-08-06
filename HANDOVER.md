# Portfolio Handover

**Project:** Kathleen Li — personal and professional UX Design portfolio
**Stack:** Next.js 16 (TypeScript, App Router, static export) · Lenis smooth scroll · self-hosted fonts via `next/font/local`
**Repo root:** `/Users/kathleenli/Desktop/Portfolio/next-site/`
**Live deploy:** GitHub Pages at `https://justhapi.github.io/Portfolio/` via `.github/workflows/static.yml`

---

## Goals, audience & design intent

### Who this is for
Recruiters and hiring managers at **design-forward tech companies** — primarily targeting UX Design, Product Design, and PM/Producer roles (Riot Game Producer, Microsoft APM, and similar). These are people who review dozens of portfolios a day and have a sharp eye for craft. The site needs to clear their bar for visual polish *and* signal that Kathleen can build what she designs (design-engineering crossover) AND that she works well in a team (Point-of-Communication, cross-functional coordination).

### What it needs to communicate
- **Credibility fast.** Role, school, and strongest projects should land within the first scroll without reading a word.
- **Taste, not just skill.** The interactions, motion, and typography should feel intentional and personal — not a template.
- **Personality alongside professionalism.** Illustrated stickers, hand-lettered accents, and the artist-before-designer framing serve this. It should feel like meeting a person, not reading a résumé.
- **Both individual design thinking AND teammate ability.** Each case study should let recruiters see her personal design decisions AND how she coordinated with teammates + sponsors.

### Tone
Professional but not corporate. Precise but not cold. Copy uses first person, avoids buzzwords, and names concrete outcomes ("~30 days after handoff, the sponsor announced the AI agent going live in beta", "continued collaboration beyond the semester").

### Visual direction
- High contrast, dark-on-cream palette with warm amber accents.
- Motion is purposeful: parallax, magnetic hover, and scroll reveals add depth without being distracting.
- Typography stack: **K2D** (geometric sans — headings + body), **JetBrains Mono** (metadata + tracked labels), **Caveat** (handwriting accents — hero subtitle only), **Klee One** (case-study pull-quotes), **CookieRun** (About section body — warm and personal, self-hosted from `/public/fonts/`), **Long Cang** (李曦 glyph only, targeted `<link>` load).
- Folder metaphor in Projects: playful and tactile.

### What to avoid
- Generic "AI portfolio" aesthetics: gradient text, glassmorphism, hero metrics grids, neon glow.
- **Don't restructure the case-study skeleton** (Outcome → Overview → Process phases → Takeaways) without an explicit ask. All four case studies now share this shape, and consistency is a real recruiter signal.

---

## Case-study information architecture

**All four case studies share the same shape.** A recruiter opening any one after reading another finds the same navigation rhythm and skims faster. When editing any case, preserve this pattern.

```
<CaseCover />                              cover: title · meta · subtitle
<main id="main" className="case-body">
  <p className="case-disclaimer">…</p>     NDA / confidentiality note (top of page)
  <section id="outcome">
    <h2>Outcome</h2>
    <aside className="outcome-callout">    elevated impact stat (see pattern below)
    <p>…</p>                               supporting body copy
    [optional figures]
  <section id="overview">
    <h2>Overview</h2>
    <p>…</p>                               intro paragraph (sponsor + team's task)
    <h3>The Problem</h3>
    <p>…</p>
    <h3>My Role</h3>
    <p>…</p>                               paragraph 1: design contributions
    <p>…</p>                               paragraph 2: team coordination / mentoring
  <section id="researching">
    <h2>Researching</h2>
    <h3>…framing h3…</h3>                  opens the section with an angle
    [multiple sub-h3s for each research activity]
  <section id="ideating|designing">
    <h2>Ideating (or Designing)</h2>
    <h3>…framing h3…</h3>
    [sub-h3s: Sketching / Concept Proposals / Wireframing, or equivalent]
  <section id="verifying|implementing|testing">
    <h2>Verifying (or Testing / Implementing)</h2>
    <h3>…framing h3…</h3>
    [sub-h3s per process pass]
  <section id="iterating">                 (Inline2 only — closed-loop rounds)
  <section id="takeaways">
    <h2>Takeaways</h2>
    <h3>…lesson 1 title…</h3>
    <p>…</p>
    <h3>…lesson 2 title…</h3>
    <p>…</p>
  </section>
</main>
```

**Case studies + shipped patterns:**

- **Frogslayer** (`/projects/frogslayer/`) — Fall 2025 · 16 weeks · 6-person team · UX Designer & Researcher, Point of Communication · kiosk design guidelines. Uses `<ResearchCarousel>` × 2 (Producer + Consumer views), `<UsabilityRound>` × 3 (round-based testing insights), flow-anchor figures, real images wired from `/public/img/frogslayer/`. Outcome callout: "Continued Collaboration Beyond Semester."
- **AI Journey Agent / JT** (`/projects/ai-journey-agent/`) — Spring 2026 · 14 weeks · UX Designer & Researcher · agentic AI concept for JourneyTrack platform. Uses `<StaticImage>` (7 anonymized process artifacts) + `<ZoomableImage>` (2 for sketching + whiteboarding), `.parallel-tracks` grid (Track 1 · Mine / Track 2 · Partner sub-team). Outcome callout: "~30 days after handoff, the sponsor announced the AI agent going live in beta."
- **ResearchHub** (`/projects/researchhub/`) — Spring 2026 · 16 weeks · 5 engineers + me · Sole UI Designer → Design Engineer · Purdue Stack platform. Outcome callout: "Planned to ship summer 2026." Currently placeholder image slots (real assets pending).
- **inline** (`/projects/inline/`) — Summer 2026 · Product Design Intern · **NDA-locked**. Public route shows only the role, scope categories, and a "contact for materials" gate.
- **Pop by inline** (`/projects/inline2/`) — DRAFT / PRIVATE route (`robots: noindex/nofollow`, not linked from home). Full detailed case for private review; **do not link or share until sponsor written consent is on file**. Uses ~10 outcome-callout / body highlights, 4-round testing narrative, cohort-consolidation subsection.

### Outcome callout pattern (used across all 4 cases)

```jsx
<aside className="outcome-callout" aria-label="Project outcome">
  <p className="outcome-callout__stat">
    <strong>Key stat / claim</strong> — supporting fact.
  </p>
  <p className="outcome-callout__meta">
    Semester · sponsor/platform · handoff → outcome
  </p>
</aside>
```

CSS lives at `.outcome-callout` in `globals.css` — warm accent bg (`#F6EEE6`-adjacent tint), left border in accent, K2D display type. Purpose: single-strongest claim gets elevated above body copy so 30-second skimmers get the killer fact.

### Highlight discipline

`<mark className="hl">` gets 1 highlight per paragraph (2 max for outcome-critical). If every important phrase is highlighted, none of them are. Enforce this on new copy.

### Research-Carousel + UsabilityRound components (Frogslayer)

- **`<ResearchCarousel slides={[...]} />`** — infinite-loop swipeable carousel. Slides array of `{key, content}`. Phantom-slide architecture: track is `[phantomLast, ...slides, phantomFirst]`, so forward-past-last smoothly scrolls onto phantomFirst then silently resets to real first (no snap visible). Same in reverse. Interactions: touch swipe, mouse drag, trackpad two-finger horizontal, dot click, keyboard arrows. Vertical wheel passes through to Lenis for page scroll. Nested `<ZoomableImage noDrag>` handles its own pointerdown stopPropagation so the carousel drag doesn't fight image interaction.
- **`<UsabilityRound title meta focus>`** with `<InsightCard>` children. Header (title + meta) + focus paragraph + dot tracker (top-right of the carousel) + horizontal scroll-snap of insight cards. Round-focus paragraph names what THAT round was deliberately testing.

### rq-block layout (research cards inside carousels)

Text left (40%) + visual right (60%) side-by-side by default. `@media (max-width: 720px)` flips to vertical stack. Card `.rq-block__visual .zoomable-frame` capped at 32vh so a carousel card never exceeds viewport (leaves room for section h3 + intro paragraph to stay visible above).

---

## Fonts — self-hosted via next/font/local

All four Google-Fonts-origin faces (K2D, JetBrains Mono, Caveat, Klee One) are shipped as woff/ttf files in `/public/fonts/[Family]/` and loaded via `next/font/local` in `app/layout.tsx`. This eliminates runtime dependency on Google Fonts — no `Failed to fetch from Google Fonts` errors, offline-safe builds. **Do NOT switch back to `next/font/google`** — that's what caused the multi-hour Caveat-rendering-as-Arial-fallback issue we already debugged.

CookieRun is self-hosted from `/public/fonts/CookieRun-*.woff2` via native `@font-face` in `globals.css`.

Long Cang loads a targeted 2-glyph subset (`text=李曦`) via `<link>` in `layout.tsx <head>` — only ~2 KB.

Token variables in `globals.css :root`:
- `--f-sans` / `--f-serif` / `--f-display` → K2D (all three point at same font — single superfamily)
- `--f-mono` → JetBrains Mono
- `--f-hand` → Caveat (hero "Hello I'm", section subtitles, `.hero-an`)
- `--f-quote` → Klee One (case-pullquote only)
- `--f-cookie` → CookieRun (About body, case-section p, case-subtitle)
- `--f-hand-zh` → Long Cang (李曦 only)

---

## Components directory

```
components/
  HeroV2.tsx                  hero section
  ArtistDesignerWordmark.tsx  t→D X-ligature SVG with handwriting trace
  ProjectsV2.tsx              folder cards + 3-D tilt hover effect
  AboutV2.tsx                 About section with HoverWord magnetic keywords
  ConnectV2.tsx               Connect section (sticky behind About)
  SiteNavV2.tsx               fixed nav with active-section tracking
  CaseSectionNav.tsx          case-study nav (Back to projects + section pill)
  CaseCover.tsx               case-study hero cover
  CaseReveal.tsx              case-body scroll-reveal wrapper
  SmoothScroll.tsx            Lenis init + parallax + About/Connect scene height
  RevealOnScroll.tsx          IntersectionObserver scroll-reveal (.reveal → .in)
  SparkleField.tsx            animated sparkle canvas
  SparkleText.tsx             glyph-cycling sparkle-text
  CursorFollower.tsx          custom cursor ring (desktop only, pointer-events:none)
  ClickSound.tsx              global click sound
  ScrollRestore.tsx           scroll-to-anchor restoration

  ResearchCarousel.tsx        infinite-loop carousel with phantom-slide smooth wrap (Frogslayer)
  UsabilityRound.tsx          round header + insight-card carousel (Frogslayer)
  StaticImage.tsx             frame-styled non-interactive image (JT process artifacts)
  ZoomableImage.tsx           frame with click-drag pan + wheel zoom + hover auto-pan + reset
```

**ZoomableImage props:**
- `src`, `alt` (required)
- `aspectRatio?: number` (default 4/3) — frame w/h
- `caption?: React.ReactNode` — rendered as `<figcaption>` below
- `noDrag?: boolean` — skips mouse/touch drag; wheel zoom + hover auto-pan + reset still work. Use when nested inside a carousel so parent slide-nav gesture isn't intercepted. Component also `stopPropagation`s pointerdown so the enclosing carousel doesn't treat image drags as slide-nav swipes.

---

## About / Connect sticky reveal

Most complex layout mechanic on the page — unchanged from earlier iterations.

```
<div class="ac-scene">       position:relative; height set by JS
  <ConnectV2 />              position:sticky; top:0; z-index:0; height:100vh
  <AboutV2 />                position:absolute; top:0; z-index:2
</div>
```

- **How it works:** About sits on top of Connect. As user scrolls through `.ac-scene`, About slides off revealing Connect behind it.
- **JS (SmoothScroll.tsx):** `sceneEl.style.height = aboutEl.offsetHeight + connectEl.offsetHeight`. A `ResizeObserver` keeps it in sync.
- **Nav "Connect" link** (`SiteNavV2.tsx → smoothScrollTo`): scrolls to `scene.offsetTop + about.offsetHeight` — NOT `#connect` directly (getBoundingClientRect on sticky element = ~0 while in range).
- **Active-section detection:** Connect is only marked active once `aboutEl.getBoundingClientRect().bottom <= 0`.
- **Peek strip** (`AboutV2.tsx → handlePeekClick`): jumps to `scene.offsetTop + about.offsetHeight`.

---

## Parallax system (SmoothScroll.tsx)

Lenis fires `onScroll({ scroll })` on every RAF. Each registered element gets `el.style.transform` written directly (no React re-renders).

| Selector | Speed | Notes |
|---|---|---|
| `.ribbon-artist` | −0.13 | `centredX:true` preserves `translateX(-50%)` |
| `.sticker.name-yellow` | −0.18 | `baseRotate:"8deg"` |
| `.sticker.designing-green` | −0.18 | `baseRotate:"-5deg"` — matched to Kathleen so both drift in lockstep |
| `.hero-polaroid` | −0.12 | `centred:true` preserves `translate(-50%,-50%)` |
| `.case-hero-image` | −0.18 | project cover image |
| `.connect-row` | −0.18 | `relativeToScene:true` — delta from ac-scene top, not page top |

The `.chip-zh` (李曦) lives inside `.sticker.name-yellow` as a DOM child, so it inherits Kathleen's parallax transform automatically. **Do NOT register it separately.**

**Sign convention (empirically confirmed):** negative speed = element drifts **downward** as the user scrolls down.

`buildEntries()` fires after 2 400 ms (entrance animations done) and clears CSS animation fill-mode locks. Parallax skipped on `pointer:coarse` / touch devices (Lenis still runs).

---

## Hero composition (HeroV2.tsx)

The hero is intentionally rich — **don't simplify it without explicit direction.**

- **Wordmark:** "Artist · Designer" with the `t→D` forming an X-ligature. Handwriting traces in via `ArtistDesignerWordmark`.
- **Polaroid:** centred, fixed-width 320 px, rotated −2°. Click flips card (rise → flip → shrink); hover peeks. Photo shows Kathleen; back shows doodle version.
- **Kathleen Li sticker** (top-right, olive yellow, rotated +8°). Carries the 李曦 chip as a DOM child. Sparkle burst SVG. Hatching corner accents.
- **Currently designing green sticker** (rotated −5°). Anchored via `top: min(calc(642px + min(12vw, 132px)), calc(68vh + 20px))` — the `68vh + 20px` cap keeps it visible on common laptop viewports.
- **Availability sticker** with sub-line "Product, Design, and PM/Producer internships".
- **Hero focus text:** "Focusing on Product Design, Research, and Cross-Functional Work" (Caveat display size).

### Hero quirks to remember
- `.hero` is `position: sticky; top: 0` — `el.scrollIntoView()` on `#hero` no-ops. Use `window.scrollTo({ top: 0, behavior: "smooth" })`. Already handled in `smoothScrollTo("hero")`.
- `.read-pill` has `white-space: nowrap; width: max-content; max-width: none` to prevent it wrapping into a near-circle at right viewport edge.

---

## Frogslayer image handling

- **Source of truth:** `/public/fonts/frogslayer/*.png|.Webp` (17 images, ~72 MB).
- **App-folder duplicate** (`/app/projects/frogslayer/images/`) was removed — Next.js only serves from `/public/`, so images placed anywhere else are inaccessible. If more images land, drop them straight into `/public/img/frogslayer/`.
- **Wired containers (12 of 17 images):**
  - Outcome (2): Guidelines + Journey_Map — ZoomableImage
  - Producer carousel (2): Kiosk_Benefits + Competitor_Analysis — ZoomableImage `noDrag`
  - Consumer carousel (3): Components_Of_Kiosk_Interfaces + User_Observation + User_Interview — ZoomableImage `noDrag`
  - Ideating (3): Crazy_Eights (wrapped in `.visual-compact`) + Observation_User_Flow + Base_Wireframes — ZoomableImage
  - Verifying flow anchors (2): Initial_Prototype + Final_Prototype — ZoomableImage
- **5 iteration images unused** (Card_Loading, Membership_Free, Payment_Button, Reformat, Tier). These are for InsightCard thumbnails. `InsightCard.tsx` currently accepts text labels only — needs `originalSrc` + `iteratedSrc` optional props added to wire these.
- **Visual container bg:** `#F6EEE6` (warmer cream than `--paper`) so images blend with their frame. Applied to `.rq-block__visual .image-slot`, `.case-section figure .image-slot`, and `.zoomable-frame`.
- **Non-carousel visual containers** get `max-height: 44vh` via `.case-image-row .zoomable-frame`, `.usability-flow-anchor .zoomable-frame`, `.visual-compact .zoomable-frame` (down from the global 62vh cap on `.zoomable-frame`). Prevents wide landscape mockups from leaving huge empty bands.

---

## Projects — folder cards (ProjectsV2.tsx)

- **Open/close morph:** `phases[id]` state → `.folder-art--hovered` / `.folder-art--leaving` CSS classes → keyframe animations (`closedExit`, `openEnter`, `closedReturn`, `openExit`) at 460 ms.
- **3-D magnetic tilt:** `handleTiltMove` writes `perspective(800px) translateX/Y rotateX/Y` to `.folder-tilt-wrap` on every `mousemove`. No React re-renders.
- **Entrance:** per-folder `IntersectionObserver` adds `.in` when each card enters the viewport individually.
- **Read-time pill:** `position:fixed` cursor-follower div, `pointer-events:none`.

---

## About — HoverWord (AboutV2.tsx)

Inline keywords (`iPad`, `Purdue Stack`, `drawing…`, `SASE`, `next trip`) that do three things:

1. **Floating pill image card** on hover — `.hw-pill` is `position:fixed`, follows cursor via direct DOM writes.
2. **Magnetic 3-D tilt** on the keyword label.
3. **Touch support** — pill appears above finger on `touchstart`, auto-hides 1.4 s after `touchend`.
4. **Keyboard/focus** — pill centred above the word's bounding rect on focus.

Image slots are **placeholders** — replace `<div class="image-slot">` with `<img src="…">` when photos are ready.

---

## CSS conventions (globals.css)

- Font tokens: see Fonts section above.
- Color tokens: `--accent: #C68D5F`, `--accent-soft: #D9A983`, `--hero-bg` / `--hero-fg` (dark bg, cream fg used in Connect + peek strip). Visual containers use `#F6EEE6` (hardcoded — warmer than `--paper`).
- `.reveal` / `.reveal-stagger` → `.in` driven by `RevealOnScroll.tsx` (IntersectionObserver).
- `.connect-row.reveal` is pre-marked `.in` at page load (sticky, always in viewport).
- Highlight pattern: `<mark className="hl">phrase</mark>` → accent-color text, no background fill. Cap 1 per paragraph.
- Focus list: `<ul className="focus-list"><li>…</li></ul>` — accent-colored disc markers, K2D body. **Never nest `<ul>` inside `<p>`** (hydration error).

Mobile breakpoints:
- `@media (max-width: 820px)` — hero layout shifts
- `@media (max-width: 760px)` — JT `.parallel-tracks` stacks
- `@media (max-width: 720px)` — `.rq-block` flips to vertical
- `@media (max-width: 640px)` — hero-specific simplification + `.rq-block` padding tighter

---

## GitHub Pages / basePath

`next.config.mjs`: `basePath: isProd ? "/Portfolio" : ""`. All internal image references use:

```ts
const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
<img src={`${basePath}/img/frogslayer/…`} />
```

Static export runs `next build` → writes to `out/`. GitHub Actions workflow at `.github/workflows/static.yml`.

---

## Known pending items

- **Frogslayer InsightCard images.** 5 iteration images (Card_Loading, Membership_Free, Payment_Button, Reformat, Tier) sit unused. Wiring requires adding `originalSrc?` + `iteratedSrc?` optional props to `InsightCard` in `UsabilityRound.tsx` and rendering `<img>` inside the `.ur-thumb` divs when srcs are provided.
- **ResearchHub image placeholders.** All `<div className="image-slot">` are intentional — assets not yet produced.
- **HoverWord images.** All five pill views still show placeholder text.
- **LinkedIn / Resume links.** Both `.c-link.is-pending` in ConnectV2. `next-site/public/resume.pdf` is on disk; not wired.
- **inline case study.** Public route (`/projects/inline`) is deliberately NDA-locked. Full detailed version lives at `/projects/inline2` (private / unlinked). When sponsor written consent is on file, swap the public route to inline2's content.
- **Baked-in image whitespace.** Several Frogslayer PNGs (Initial_Prototype, Final_Prototype) have ~30% vertical background baked into the source. Non-carousel container cap (44vh) reduces total footprint but same proportion of whitespace scales in. Full fix is source-image cropping; not yet done.

---

## Useful commands

```bash
cd next-site
npm run dev          # dev server → http://localhost:3000
npm run dev --webpack  # if Turbopack errors (Next 16 default is Turbopack)
npx tsc --noEmit     # type-check without building
npm run build        # static export → out/
```

**If fonts start rendering as Arial fallback** after a build change: nuke `.next` and `node_modules/.cache`, restart dev server. If that doesn't fix it, run `npm uninstall next && npm install next`. The `next/font/local` self-hosting we set up should prevent this entirely — but if you ever swap back to `next/font/google`, this whole failure mode returns.

---

## Recent session log (Aug 2026)

### Landed
- **Self-hosted fonts.** Moved all 4 Google Fonts from `next/font/google` → `next/font/local` (files in `/public/fonts/[Family]/`). Ends the intermittent "Failed to fetch from Google Fonts" build failures.
- **Case-study info-architecture unified.** All 4 case studies (Frogslayer, JT, ResearchHub, Inline2) now share the same section-and-h3 skeleton. Recruiters skimming across pages find identical structure.
- **Outcome callout added to all 4 cases.** Elevated killer-stat above body copy.
- **Frogslayer producer/consumer framing (Option C).** Two carousels grouped by whose POV they investigate. Framing lives in intro paragraphs; h3s stay methodological.
- **Highlight density trimmed** to ~1 per paragraph across Frogslayer + JT (was 3-4 in some paragraphs).
- **Frogslayer real images wired.** 12 of 17 images placed in interactive containers. 5 iteration images remain unwired pending `InsightCard` component modification.
- **ZoomableImage `noDrag` prop.** Nested inside carousel cards without gesture conflict. Also `stopPropagation`s pointerdown so image-container drags don't trigger carousel navigation.
- **ResearchCarousel phantom-slide smooth wrap.** Last-to-first (and first-to-last) transitions now scroll smoothly through a phantom duplicate then silently reset. No visible snap.
- **rq-block horizontal layout.** Text left (40%) + visual right (60%) with 720px vertical-stack fallback.
- **Visual container bg** changed to `#F6EEE6` so images blend with their frame.
- **Non-carousel zoomable frames capped at 44vh** so wide landscape mockups don't dominate the viewport.
- **Grammar/typo cleanup pass** on JT and Frogslayer copy.

### Reverted (DO NOT re-add without explicit ask)
Historical revert list from earlier iterations — a `/critique`-driven "recruiter mode" pass:
- "For recruiters ↓" chip on the hero
- "Selected work" rail under the polaroid
- `<RecruiterSummary />` section between Hero and Projects
- Outcome-chip grids on each case study (`<div class="outcome-chips">`)
- Résumé + Email chips in both site nav and case nav
- Sub-positioning line under the wordmark (`.sub-id`)

Ephemeral takeaways added and then reverted:
- "Trust is the Feature" JT takeaway added → removed → re-added (final state = kept).
- JT "throughline" paragraph in Researching added → removed (final state = removed).

### Files removed in this cleanup pass
- `components/FooterConnect.tsx`, `GlassShapes.tsx`, `MenuNav.tsx`, `RecruiterSummary.tsx`, `StageBand.tsx`, `StatusCheck.tsx` (0 references anywhere)
- `components/_orig_carousel.tsx.bak` (backup file)
- `lib/useInView.ts` + `lib/` folder (0 references)
- Root orphans: `main.jsx`, `wordmark.jsx`, `NEW-artist-designer-handwriting.html` (ported into `components/ArtistDesignerWordmark.tsx` a while back)
- `app/projects/frogslayer/images/` (72 MB duplicate — Next.js can't serve from `/app/`; canonical copy lives at `/public/img/frogslayer/`)

---

## How the user works

- Concise, direct feedback. She notices spacing, alignment, motion. Iterates fast — one change per turn is normal.
- She'll ask for a revert if a change feels off. Don't re-litigate; roll back cleanly.
- When she shares a screenshot, the issue is almost always at the highlighted region — read the image carefully before responding.
- She appreciates explanations of *why* a change works (mechanism + downstream implication), not a recap of obvious facts.
- She sometimes hand-edits files between turns. If your context says a file is one thing and the file has changed, re-read before editing.
