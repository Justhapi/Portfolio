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
    <h3>The Problem</h3>                   NOTE: omitted from public inline case study — would leak product thesis under NDA
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
- **inline / Pop by inline** (`/projects/inline/`) — Summer 2026 · 10 weeks · Product Design Intern · **NDA-sensitive**. Full case-study skeleton is now populated but written to respect the NDA: no competitor names, no specific product features / mechanics, no monetization strategy, "The Problem" section deliberately omitted (would leak thesis), Scenario 1 brief questions abstracted to "factors regarding uncertainty." Page has `robots: noindex/nofollow`. Outcome frames the handoff as "a set of must-have features for Pop + research findings for justification, in a written product direction report." **Do not link publicly or share externally until sponsor (Yuehlin) written consent is on file** — a portfolio-approval email is drafted and pending send (see Known pending items).
- **Pop by inline (private detailed draft)** (`/projects/inline2/`) — DRAFT / PRIVATE route (`robots: noindex/nofollow`, not linked from home). More detailed than the public inline page for internal reference. Historically had ~10 outcome-callout / body highlights, 4-round testing narrative, cohort-consolidation subsection. **Do not link or share.**

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
  CaseCover.tsx               case-study hero cover (supports heroVideoSrc)
  HeroVideo.tsx               autoplay-guarded case cover video player
  CaseReveal.tsx              case-body scroll-reveal wrapper
  SmoothScroll.tsx            Lenis init + parallax + About/Connect scene height
  RevealOnScroll.tsx          IntersectionObserver scroll-reveal (.reveal → .in)
  SparkleField.tsx            animated sparkle canvas
  SparkleText.tsx             glyph-cycling sparkle-text
  CursorFollower.tsx          custom cursor ring (desktop only, pointer-events:none)
  ClickSound.tsx              global click sound
  ScrollRestore.tsx           home-page scroll memory across "Back to projects" nav

  ResearchCarousel.tsx        infinite-loop carousel with phantom-slide smooth wrap (Frogslayer)
  UsabilityRound.tsx          round header + insight-card carousel (Frogslayer)
  StaticImage.tsx             frame-styled non-interactive image (JT process artifacts)
  ZoomableImage.tsx           frame with click-drag pan + wheel zoom + hover auto-pan + reset
  HoverBag.tsx                layered PNG bag illustration with 6 hoverable hit zones + cursor-following pill (About section)
  HoverWord.tsx               inline text keyword with floating pill card + magnetic 3-D tilt (About body)
```

**ZoomableImage props:**
- `src`, `alt` (required)
- `aspectRatio?: number` (default 4/3) — frame w/h
- `caption?: React.ReactNode` — rendered as `<figcaption>` below
- `noDrag?: boolean` — skips mouse/touch drag; wheel zoom + hover auto-pan + reset still work. Use when nested inside a carousel so parent slide-nav gesture isn't intercepted. Component also `stopPropagation`s pointerdown so the enclosing carousel doesn't treat image drags as slide-nav swipes.

**CaseCover props:**
- `title`, `meta`, `subtitle` (required)
- `imageLabel?: string` — hero image placeholder text (default `"cover image"`)
- `kicker?: string` — optional Caveat handwriting kicker above the title
- `hideHero?: boolean` — suppress the hero image slot entirely. Used on the public `inline` case study where NDA prevents adding real visuals — hides the empty placeholder rather than showing a blank frame.
- `heroVideoSrc?: string` — cover video URL. When provided, renders `<HeroVideo>` in place of the image slot. Pattern (used in all 4 case pages):
  ```ts
  const BASE_PATH = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
  const COVER_VIDEO = `${BASE_PATH}/img/cover/inline.webm`;
  <CaseCover … heroVideoSrc={COVER_VIDEO} />
  ```
- `heroVideoPoster?: string` — optional poster frame shown before playback / on `preload="none"` devices.

**HeroVideo (`components/HeroVideo.tsx`)** — client-component wrapper for the case cover video.
- Guards autoplay with `matchMedia("(prefers-reduced-motion: reduce)")` (falls back to poster) and `matchMedia("(hover: hover) and (pointer: fine)")` (touch devices get `preload="none"` to save bandwidth; desktop gets `preload="metadata"`).
- Videos live in `/public/img/cover/*.webm` so Next's static export copies them verbatim — do NOT rely on Webpack's asset/resource loader for these (it emits to the wrong path for static export).
- Current files: `Frogslayer.webm`, `ResearchHub.webm`, `inline.webm`, `Ai_Agent.webm`. See ffmpeg re-encoding notes in Known pending items.

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

- **Source of truth:** `/app/projects/frogslayer/images/*.png|.webp` — 17 files (~72 MB), co-located with the route so images live next to the page that references them.
- **How they're served:** ES module imports at the top of `frogslayer/page.tsx` — Webpack bundles them into `/_next/static/media/` with hashed filenames at build time. basePath (`/Portfolio` in prod) is applied automatically by Next.js, so no manual prefixing needed inside the JSX.
- **Do NOT put these in `/public/`.** Kathleen wants the images co-located with the route. If you add more images, drop them into `/app/projects/frogslayer/images/` and add another `import` at the top of the file.
- **Filenames use lowercase `.webp`** (not `.Webp`) so Next's built-in image-types TypeScript declarations recognize them without a custom module declaration. Rename any new `.Webp` files to `.webp` before importing.
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

## About — HoverBag + HoverWord (AboutV2.tsx)

The About section has **two independent hover interactions**, both in the same section:

### HoverBag — layered bag illustration (left side of body split)

The bag is composed of **10 transparent PNG layers** stacked in z-order (`one_earbud_1` on top → `ten_back_bag` at bottom), served from `/public/img/bag/*.webp`. Six of the items have interactive hit zones. Hovering an item shows a small pill near the cursor (label only, e.g. "art", "games") and animates that item's layer(s) per its own effect.

**Interactive items + labels:**
| Item | Layer(s) | Label | Effect |
|---|---|---|---|
| ipad | `eight_ipad` | art | lift |
| laptop | `nine_laptop` | games | lift |
| phone | `five_phone` | friends | lift |
| ticket | `six_ticket` | travel | tilt-right |
| usagi | `three_usagi` | food | tilt-right |
| earbuds | `one_earbud_1` + `two_earbud_2` | music | tilt-left |

- **Hit zones** — invisible `.hover-bag__zone` `<button>` overlays positioned by `%` (left/top/width/height per item's `zone`). Layer PNGs use `pointer-events: none`; only zones capture mouse.
- **Transform composition** — entrance animation (`bagSlideBounceIn`, 1100 ms) and per-item hover both write to the same layer element, so they compose via CSS custom properties (`--enter-y`, `--hover-transform`) rather than clobbering each other.
- **Rebound-phase per-item animations** — timed with `~750ms` delay to align with the parent entrance's 68–100% rebound window (`bagItemBounceUp` for lift items, `bagEarbudSway`, `bagTicketBob`, `bagUsagiSway` for tilt items).
- **Pill offsets** — `PILL_OFFSET_X = 6`, `PILL_OFFSET_Y = -2 - 170` (gap + pill height; user-tightened to sit close to the cursor). Pill is `position:fixed`, updated via direct DOM writes on `mousemove` — no per-frame React re-renders. Position is clamped to viewport bounds inside `moveToPointer` so the pill never overflows.
- **Hover-capable gating** — `hoverCapable` state driven by `matchMedia("(hover: hover) and (pointer: fine)")`. Hit zones AND the pill are only rendered on hover-capable devices; touch devices see the layered illustration without any interaction target. Prevents pill flicker + tap-hijack on mobile.
- **Per-item pill content** — six unique pill components (`PillMusic`, `PillFriends`, `PillFood`, `PillTravel`, `PillGames`, `PillArt`). Every item hovers into a distinct visual layout inside a unified 240×170 shell. Content placeholders are marked in-file; swap for real photos/logos when assets are ready. `.hover-bag__pill:not(.is-on) * { animation-play-state: paused !important }` freezes inner animations while the pill is offscreen so they always start from frame 0 when a new item is entered.
- **Z-index note** — `.about-body-split .about-body { z-index: 1 }`, `.about-body-split .hover-bag { z-index: 2 }` so the pill sits above the paragraph text (was clipped otherwise).
- **Debug mode** — pass `<HoverBag debug />` to outline hit zones with dashed red borders + labels for tuning without DevTools.

### HoverWord — inline keyword pills (right side, in body paragraphs)

Inline keywords in the About body (`mentor`, `next trip`, etc.) that do:

1. **Floating pill image card** on hover — `.hw-pill` is `position:fixed`, follows cursor via direct DOM writes.
2. **Magnetic 3-D tilt** on the keyword label.
3. **Touch support** — pill appears above finger on `touchstart`, auto-hides 1.4 s after `touchend`.
4. **Keyboard/focus** — pill centred above the word's bounding rect on focus.

Image slots are **placeholders** — replace `<div class="image-slot">` with `<img src="…">` when photos are ready.

### About layout — body split

`.about-prose` contains the h3 heading full-width above, then `.about-body-split` grid with **HoverBag on the left, paragraphs on the right**. Both live inside `.about-prose` so existing reveal / stagger animations still fire from `.about-prose.in`.

### Removed
The `.about-peek` "let's connect" handwritten note + curvy arrow strip at the bottom of the About section has been removed. Associated `handlePeekClick` callback and `useCallback` import were also removed. The `.about-peek*` CSS in `globals.css` is currently dormant (harmless — remove for cleanliness if desired).

---

## Motion tokens (globals.css `:root`)

Shared timing + easing tokens introduced in the animation-review pass. Prefer these over inline `cubic-bezier(…)` / ad-hoc millisecond values so all UI state changes share one rhythm.

| Token | Value | When to use |
|---|---|---|
| `--ease-snap` | `cubic-bezier(0.23, 1, 0.32, 1)` | Strong ease-out for UI state changes — dropdowns, pill highlights, hover reveals. Emil-derived; no overshoot. |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Signature bounce/overshoot — reserved for entrance moments, NOT continuous mousemove-driven position (was causing wobble on the HoverBag pill). |
| `--dur-instant` | `100ms` | Button press feedback. |
| `--dur-fast` | `160ms` | Tooltips, hover state changes, HoverBag pill entrance + HoverWord tilt. |
| `--dur-med` | `240ms` | Dropdowns, hover pops. |
| `--dur-slow` | `400ms` | Modals, drawers, cascade reveals, nav-pill layout thrash. |

Media queries that gate motion:
- `prefers-reduced-motion: reduce` — kills entrance animations + HeroVideo autoplay.
- `prefers-reduced-transparency: reduce` — reduces backdrop-filter blur on case-nav + pill backgrounds.
- `(hover: hover) and (pointer: fine)` — gates HoverBag pill rendering, HoverVideo autoplay, cursor-follower.

---

## Home-page scroll restoration (ScrollRestore + saveHomeScroll)

Pattern: sessionStorage-based memory so the "Back to projects" link from a case study returns the user to their exact home-page scrollY.

**Wiring**
1. `ScrollRestore` (mounted in `app/page.tsx`) sets `history.scrollRestoration = "manual"` and, on mount, reads `sessionStorage["portfolio:home-scroll"]`. If present, runs a three-pass `window.scrollTo(0, y)` (immediate + rAF + `+90ms`) to survive layout settle (paint → Lenis init → sticky `.ac-scene` height calc).
2. `saveHomeScroll` (exported from `ScrollRestore.tsx`) is called via `onClick={saveHomeScroll}` on every folder-card `<Link>` in `ProjectsV2.tsx`. Writes `String(window.scrollY)`.
3. `CaseSectionNav.tsx` "Back to projects" link uses `<Link href="/" scroll={false}>` — critically NOT `/#work`, so Next.js's default hash-scroll doesn't race with ScrollRestore.

**Do NOT `sessionStorage.removeItem` inside ScrollRestore's effect.** React strict mode (enabled in `next.config.mjs`) double-invokes useEffect in dev — run #1 would consume the value, run #2 would find `null` and force `scrollTo(0, 0)`. Result: user always lands on the hero. Because `saveHomeScroll` overwrites the key on every folder click, keeping the stored value is safe and idempotent.

**Fresh visits** (no saved value) fall through the effect with no scroll manipulation, so browser default (or hash-scroll from a shared `/#work` link) behaves normally.

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
- **HoverBag pill image slot.** Currently shows text label only ("art", "games", etc.). If we want mini photos, replace `<div className="image-slot">{activeItem?.label}</div>` in `HoverBag.tsx` with `<img src={activeItem?.imageSrc} …>` and add an `imageSrc` field to each ITEMS entry.
- **HoverWord images.** All five pill views still show placeholder text.
- **LinkedIn / Resume links.** Both `.c-link.is-pending` in ConnectV2. `next-site/public/resume.pdf` is on disk; not wired.
- **inline NDA — pending confirmations before external sharing:**
  1. **Is "Pop by inline" publicly announced?** If yes, current naming/category/B2B2C references are all fine. If not (Overview still says *"early-stage consumer product exploration"*), the product name, subtitle *"planning everyday gatherings,"* and *"step from pure B2B into B2B2C"* line all leak confidential product plans. Verify against inline's public site / press / App Store before publishing externally.
  2. **Written sponsor consent (Section 4).** The NDA gives inline ownership of portfolio work. A portfolio-approval email addressed to **Yuehlin** is drafted (see chat/email folder — subject *"Portfolio approval request — Pop by inline case study"*). Do not share the `/projects/inline/` link with recruiters until the reply email with explicit approval is saved.
  3. **Feature-count specifics still on the page.** Outcome body says *"the product's 4 must-have features"* and Gap Analysis says *"eight solution features proposed prior by the parallel branch team."* Both disclose internal MVP / proposal sizes. Consider softening to "a set of must-have features" and "the parallel branch's proposed feature set" regardless of Pop's launch status.
  4. **"Host and guest" appears 3× on the page** — reveals a specific product mechanic (dual-role structure). If not public in Pop's marketing, abstract at least one occurrence.
- **inline2 (private detailed draft).** Lives at `/projects/inline2/` with `robots: noindex/nofollow`. Historically kept as the fuller version for private review. Do not link or share.
- **Baked-in image whitespace.** Several Frogslayer PNGs (Initial_Prototype, Final_Prototype) have ~30% vertical background baked into the source. Non-carousel container cap (44vh) reduces total footprint but same proportion of whitespace scales in. Full fix is source-image cropping; not yet done.
- **Dormant `.about-peek*` CSS.** The "let's connect" strip was removed from AboutV2 but its CSS classes remain in `globals.css`. Safe to leave; remove for cleanliness if desired.
- **Cover-video re-encode swap-in.** ffmpeg-optimized versions live alongside originals in `/public/img/cover/`: `Frogslayer_opt.webm` (3.1 MB, was 25.4 MB), `inline_opt.webm` (2.7 MB, was 19 MB), `Ai_Agent_opt.webm` (2.7 MB, was 18.5 MB). Preview each, then `mv` the `_opt` versions over the originals (case-sensitive filenames — match Frogslayer.webm / inline.webm / Ai_Agent.webm exactly). ResearchHub.webm at 6.2 MB was left as-is. Cleanup: `rm ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree` from the working dir.
- **HoverBag revision in progress.** Kathleen is actively iterating on hover behavior. Any change here should preserve: `hoverCapable` gating (touch devices get no pill), viewport-clamped `moveToPointer`, the 240×170 unified pill shell, and the paused-when-off animation-play-state guard.
- **Deferred animation improvements** (from `improve-animations` audit):
  - Spring-track HoverBag pill position (would smooth cursor tracking further; requires a spring library).
  - Interruptible polaroid flip (would rewrite the rise-flip-rest keyframes as transitions so mid-flip clicks can reverse mid-air).
  - Body text migration from `px` → `rem` (mechanical codemod for user-agent font-size respect).

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

### Landed (most recent session — hover-revision handoff point)
- **"Back to projects" scroll restoration finalized.** Two-part fix:
  1. `CaseSectionNav.tsx` Link changed from `href="/#work"` → `href="/" scroll={false}` so Next.js's default hash-scroll stops racing with ScrollRestore.
  2. `ScrollRestore.tsx` — removed `sessionStorage.removeItem(KEY)` inside the effect. React strict mode double-invokes useEffect in dev, and run #2 was seeing an empty sessionStorage and forcing `scrollTo(0, 0)`. Idempotent restore is safe because `saveHomeScroll` overwrites the key on every folder click. See "Home-page scroll restoration" section.
- **Cover videos wired for all 4 case studies** via `/public/img/cover/*.webm`. New `HeroVideo.tsx` client component gates autoplay on `prefers-reduced-motion` + `(hover: hover) and (pointer: fine)`, uses `preload="metadata"` on desktop / `preload="none"` on touch. `CaseCover.tsx` extended with `heroVideoSrc` + `heroVideoPoster` props. ffmpeg-optimized `_opt.webm` versions staged next to originals — see Known pending items for the swap.
- **Motion tokens introduced** in `globals.css :root`: `--ease-snap`, `--ease-spring`, `--dur-instant / fast / med / slow`. New timing baseline for all UI state changes; replaces scattered inline `cubic-bezier(…)` values. See "Motion tokens" section.
- **HoverBag pill — Emil-design-eng iteration.**
  - Six unique pill variants: `PillMusic`, `PillFriends`, `PillFood`, `PillTravel`, `PillGames`, `PillArt` — each with distinct content inside a unified 240×170 shell.
  - `hoverCapable` state via `matchMedia`; zones AND pill only render on hover-capable pointers (touch devices see the illustration only, no interaction target).
  - `PILL_OFFSET_X = 6`, `PILL_OFFSET_Y = -172` — tightened to sit close to the cursor. `moveToPointer` clamps to viewport bounds.
  - `.hover-bag__pill:not(.is-on) * { animation-play-state: paused !important }` freezes inner animations while offscreen so they restart from frame 0 on each new item.
  - Zone hint pulse animation staggered across the 6 items as an ambient affordance signal.
- **HoverBag pill entrance re-timed** to `--ease-snap` at 160ms (was `--ease-spring` — was causing wobble on mousemove-driven position). `transform-origin: 0 100%` so the pill scales up out of the pointer corner rather than its center.
- **HoverWord tilt re-timed** to `--ease-snap` at 160ms (same overshoot-wobble fix). `transform-origin: 50% 100%` on `.hw-pill`.
- **HoverWord entrance animation** applied to About-section bullet points as requested — matches HoverBag rebound rhythm.
- **Polaroid flip choreography stabilised.** `RISE_HOLD_MS = 460`, `ANIM_END_MS = 580` in `HeroV2.tsx` — bumped up to match the 560ms CSS animation (previous 260/330ms timers caused a mid-flip snap). New `.play-wiggle` class fires via IntersectionObserver on `liftRef` when the polaroid enters ≥40% viewport, delayed 900ms as an ambient clickability hint.
- **Case-nav polish.** Background alpha bumped to `0.88`, `backdrop-filter: blur(14px)`, border-bottom hairline restored. `.nav::after` and `.case-nav::after` scroll-edge fades REMOVED per user request.
- **Mobile responsiveness pass** on hero + Connect. Multiple aggressive shrinks: polaroid width clamp, text sizes to `clamp()`, polaroid caption hidden below breakpoint, About-section bullets aligned right next to text with centered alignment.
- **NDA disclaimers landed on 3 of 4 case studies** (Frogslayer IP, inline, Ai_Agent). Purdue Stack / ResearchHub uncovered.
- **Animation reviews run**: `improve-animations`, `emil-design-eng`, `apple-design`, `review-animations`. Findings implemented inline where actionable; longer-horizon items in Known pending → Deferred animation improvements.
- **TypeScript: `types/media.d.ts`** — module declarations for `*.webm` + `*.mp4` imports.
- **inline case study** — additional NDA-driven trims. Overview slimmed, "The Problem" section removed, Scenario 1 questions abstracted.

### Landed (this session)
- **HoverBag component** — new layered PNG bag illustration for the About section with 6 hoverable items (iPad→art, laptop→games, phone→friends, ticket→travel, usagi→food, earbuds→music). 10 layer PNGs, transparent buttons for hit zones positioned by `%`, cursor-following pill, entrance bounce animation + per-item rebound-phase animations, transform composition via CSS custom properties. Extensive iteration on hit-zone geometry, pivot points, rotation timing, pill offsets.
- **About layout — body split.** HoverBag on the left, body paragraphs on the right, h3 heading full-width above. Fixed pill z-index vs body text (pill now sits above paragraphs via `.about-body-split` z-index rules).
- **Removed `.about-peek` "let's connect" strip** from AboutV2. Removed the `handlePeekClick` callback and `useCallback` import. CSS remains dormant.
- **CaseCover `hideHero` prop** — suppresses the hero image slot on cases where NDA prevents adding real visuals.
- **inline case study — major NDA-driven rewrite.**
  - Outcome reframed as handoff-focused ("a set of must-have features for Pop, alongside research findings for justification, in a written product direction report").
  - "The Problem" section removed entirely (was leaking product thesis).
  - Overview trimmed: monetization strategy line dropped, brief abstracted to "early-stage coordination design under uncertainty."
  - Scenario 1 subhead genericized ("Scenario 1: An Evolving Event" → "Ideating Scenario"), specific brief questions replaced with "factors regarding uncertainty."
  - Iterating section removed — content folded into Testing.
  - Grammar/typo pass across all sections.
  - Stale `iterating` nav entry removed from `SECTIONS`.
- **inline NDA audit performed.** Identified remaining risks (product name / category leak if Pop is unreleased, feature-count specifics, "host and guest" mechanic exposure). See Known pending items.
- **Portfolio-approval email to Yuehlin drafted.** Covers Section 4 (inline ownership of portfolio work), notes noindex/private link, invites review + edits before external sharing.

### Landed (prior sessions)
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
- `public/img/frogslayer/` — the WRONG-location duplicate. Canonical images live at `/app/projects/frogslayer/images/` (co-located with the route) and are ES-module-imported in `page.tsx`. Do not resurrect the `/public/img/frogslayer/` copy.

---

## How the user works

**Rhythm**
- Tight iteration loops. Most messages are 1-3 sentences and ask for one focused change. When she batches, it's related work hitting the same file.
- She'll say "continue" and expect you to thread the previous conversation into the next task without needing to re-establish context.
- She hand-edits files between turns. If the file has changed since your last read, re-read before editing that depends on surrounding context.

**Decision style**
- She brings the decision, not the problem. Requests usually skip "here's the problem" and go straight to "here's what I want." Your job is execution, not analysis.
- She reverses course without ceremony. "actually revert that" doesn't need explanation. Roll back cleanly; don't re-litigate ("but earlier you said…").
- When she offers you A/B/C options, she picks one and moves on. Don't push her to reconsider unless there's a real reason.

**Feedback style**
- She uses two distinct modes: *critique mode* ("critique this / how is its readability / is this a good idea") wants honest opinion — she's stress-testing an instinct, not fishing for validation; *execute mode* ("do X") wants action only. The mode is usually explicit in the prompt.
- When she asks "be honest," she means it. Agreeing when you shouldn't is worse than pushback.
- Screenshots almost always highlight the exact region of concern. Read the image carefully — the issue is where she circled/marked, not something you might infer from surroundings.

**Values**
- Recruiter-lens is her primary evaluation frame. Almost every design decision gets tested against "how does this read to a recruiter with 30 seconds and 40 portfolios in a queue." When defending a change, tie it back to that lens.
- Visual precision + systems consistency, both at once. She'll spot 4px spacing issues AND ask for a pattern to be applied across all 4 case studies in the same turn.
- Personality signal matters. Stickers, doodle-vs-photo polaroid flip, CookieRun font, hand-lettered accents — these differentiate from generic AI-portfolio aesthetics. Don't strip them for "cleanliness" without an explicit ask.
- Copy: she cares about grammar/typos and will ask for a pass. She doesn't want stylistic rewrites of her voice — critique structure (buried stat, defensive framing, dead words), not aesthetic preference.
- She's patient with technical debugging (fonts, build errors, Turbopack). She wants the fix, not the theater. Skip the "let me…" preamble; just do the diagnostic.
- She appreciates the *why* behind a change — mechanism + downstream implication — but doesn't want a recap of obvious facts. Assume she's already read the code.
