# Portfolio Handover

**Project:** Kathleen Li — personal portfolio  
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

---

## Architecture overview

```
app/
  layout.tsx        — root layout: fonts, <CursorFollower />, <SmoothScroll />
  globals.css       — single CSS file for the entire site (~3 200 lines)
  page.tsx          — home: HeroV2 · ProjectsV2 · [.ac-scene] · RevealOnScroll

components/
  HeroV2.tsx        — hero section
  ProjectsV2.tsx    — folder cards + 3-D tilt hover effect
  AboutV2.tsx       — About section with HoverWord magnetic keywords
  ConnectV2.tsx     — Connect section (sticky behind About)
  SiteNavV2.tsx     — fixed nav with active-section tracking
  SmoothScroll.tsx  — Lenis init + parallax + About/Connect scene height
  RevealOnScroll.tsx — IntersectionObserver scroll-reveal (.reveal → .in)
  SparkleField.tsx  — animated sparkle canvas
  CursorFollower.tsx — custom cursor ring (desktop only, pointer-events:none)
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
| `.chip-zh` | −0.14 | `baseRotate:"-6deg"` |
| `.sticker.designing-green` | −0.22 | `baseRotate:"-5deg"` |
| `.hero-polaroid` | −0.12 | `centred:true` preserves `translate(-50%,-50%)` |
| `.case-hero-image` | −0.18 | project cover image |
| `.connect-row` | −0.18 | `relativeToScene:true` — delta from ac-scene top, not page top |

**Sign convention (empirically confirmed):** negative speed = element drifts **downward** as the user scrolls down.

`buildEntries()` fires after 2 400 ms (all entrance animations done) and sets `el.style.animation = "none"` to clear CSS fill-mode locks. Parallax is skipped on `pointer:coarse` / touch devices (Lenis still runs for smooth scroll).

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
- `smoothScrollTo("connect")` special-cases the sticky element (see above).

---

## CSS conventions (globals.css)

- Font tokens: `--f-sans` (K2D), `--f-mono` (JetBrains Mono), `--f-display` (K2D 800), `--f-hand` (Caveat), `--f-hand-zh` (Long Cang — loaded via targeted `<link text="李曦">` for just those 2 glyphs).  
- Color tokens: `--accent: #C68D5F`, `--accent-soft: #D9A983`, `--hero-bg` / `--hero-fg` (dark bg, cream fg used in Connect + peek strip).  
- `.reveal` / `.reveal-stagger` → `.in` driven by `RevealOnScroll.tsx` (IntersectionObserver).  
- `.connect-row.reveal` is pre-marked `.in` at page load — it is always "in viewport" since Connect is sticky, so the parallax scroll is the reveal instead of an IO callback.

---

## Known pending items

- **HoverWord images:** all five pill views still show placeholder text. Swap `<div class="image-slot">` with `<img src="…">` when assets are ready.  
- **LinkedIn / Resume links:** both `.c-link.is-pending` in ConnectV2 — add real `href` values when ready.  
- **Git lock:** if `A lock file already exists` blocks a commit, delete `.git/index.lock` in the repo root then retry.

---

## Useful commands

```bash
cd next-site
npm run dev          # dev server → http://localhost:3000
npx tsc --noEmit     # type-check without building
npm run build        # static export → out/
```
