# Portfolio — Session Handover

A continuation brief for a fresh Claude chat. Paste this in (or point Claude
at this file) so it can pick up the portfolio work without re-deriving context.

---

## 1. Project

Kathleen Li's personal portfolio — a Next.js (App Router) + TypeScript site.

- **Repo root:** `/Users/kathleenli/Desktop/Portfolio`
- **App:** `/Users/kathleenli/Desktop/Portfolio/next-site`
- **Owner:** Kathleen Li ("k") — Purdue UX undergrad, design-engineering minor,
  open to summer 2026 internships.

### Structure

```
next-site/
  app/
    globals.css            ← ALL styling + design tokens (:root). Large file.
    layout.tsx             ← root layout, <head> metadata
    page.tsx               ← home composition (Hero → Projects → About → …)
    projects/
      inline/page.tsx        ← "Pop" Inline internship case study (NDA-safe)
      journeytrack/page.tsx
      researchhub/page.tsx   ← "Purdue Stack" case study
      frogslayer/page.tsx
  components/
    HeroV2.tsx             ← sticker-collage hero, interactive polaroid (doodle↔photo swap)
    AboutV2.tsx            ← bio + INTERACTIVE polaroid "iPad" screen (see §5)
    ProjectsV2.tsx         ← folder-card project list (hover morph, scroll reveal)
    ConnectV2.tsx          ← pitch + contact links + footer
    LearningsV2.tsx, RevealOnScroll.tsx, CursorFollower.tsx,
    CaseCover.tsx, CaseSectionNav.tsx, SparkleField.tsx, … etc.
  public/
    fonts/                 ← self-hosted CookieRun woff2 (Regular/Bold/Black)
```

### Verify changes

```bash
cd next-site && npx tsc --noEmit      # must exit 0
```

The bash sandbox often needs `timeout 44 npx tsc --noEmit`. The repo currently
**typechecks clean (exit 0).**

---

## 2. Design system (tokens live in `globals.css` `:root`)

Aesthetic: **warm paper / sticker-collage**, hand-drawn accents, editorial.

**Colors:** `--bg #F4EFE6` · `--bg-2 #EBE5DA` · `--paper #FBF7EE` ·
`--fg #1A1714` · `--fg-soft #3D3530` · `--muted #7A6F66` ·
`--accent #C68D5F` · `--accent-soft #D9A983` · `--ink-soft #6B5D54` ·
`--hero-bg #0F1217` · `--hero-fg #F6EFDC` (dark stage).

**Fonts:** `--f-serif` Fraunces · `--f-sans` Space Grotesk · `--f-mono`
JetBrains Mono · `--f-hand` Caveat · `--f-hand-zh` Long Cang ·
`--f-cookie` CookieRun (self-hosted, used for project-card blurbs).

**Easing:** `--ease-out-quart` · `--ease-out-expo`.

---

## 3. Conventions

- **Placeholder media:** unfinished images are `<div className="image-slot">label</div>`.
  The user swaps in a real `<img>` later (files go in `next-site/public/`).
- **Placeholder links:** `href="#"` + `onClick` `e.preventDefault()` (see the
  `is-pending` pattern on the Connect LinkedIn/Resume links).
- **NDA:** the Inline / "Pop" case study (`app/projects/inline/page.tsx`) is
  deliberately NDA-safe — role and process only, no product specifics,
  metrics, or screens. Keep it that way.
- The user frequently edits files directly between turns — re-Read before editing.

---

## 4. Work completed (most recent session)

All of the following is **done, typechecks clean, awaiting the user's visual review:**

1. **Per-folder scroll entrances** (`ProjectsV2.tsx` + `globals.css`) — removed
   the batched `reveal-stagger`; each folder card now bounces in via its own
   `IntersectionObserver` when *that* card scrolls into view. CSS keyed off
   `.folder.in` instead of `.folder-row.reveal-stagger.in`.
2. **Entrance includes the description** — the `.folder-copy` column (tag, meta,
   blurb) fades up alongside the artwork bounce (`.folder.in .folder-copy`).
3. **Connect pitch flex width** — removed `max-width: 24ch` on `.connect-pitch`
   so it fills its grid column.
4. **Stacked-layout gap fix** — in `@media (max-width: 820px)`, the folder SVG
   scales to 92% of the full-width column and overflows its box; gaps are now
   `clamp(…, calc(37vw - …), …)` so artwork never overlaps the text above/below.
5. **Folder hover mutual exclusion** (`ProjectsV2.tsx`) — added a `hoveredId`
   ref; entering any folder force-closes whatever else is open, so two folders
   can never be in the hovered/open pose at once (fixed a stuck-open bug on
   scroll/touch).
6. **About polaroid repurposed** — was a duplicate "photo of you"; now the
   artist side (sketchbook/iPad), distinct from the hero polaroid.
7. **Interactive About iPad** (NEW — the big one, see §5).

Earlier (pre-compaction) in the same engagement: CookieRun font for project
blurbs; read-pill restyle (white outline, no dot); folder SVG darkening halo;
created the Inline NDA case study + project card; reordered projects;
desynced folder float animations; rewrote blurbs first-person; removed project
title headings; relocated meta chips.

---

## 5. The interactive About iPad (newest feature)

**File:** `components/AboutV2.tsx` + CSS block in `globals.css`
("Interactive bio bullets → polaroid 'iPad' preview").

**Behavior:** the four bio bullets are hover/focus triggers. Pointing at one
swaps the polaroid's "photo" (a dark iPad-like screen) to a matching preview:

| Bullet | View (`IpadView`) | Screen shows | Click does |
|---|---|---|---|
| Purdue Stack | `stack` | site screenshot slot | opens `STACK_URL` |
| SASE mentoring | `mentor` | 3-photo carousel (auto + click) | next photo |
| digital illustrations | `illos` | 5-drawing carousel (auto-plays) | next drawing |
| next trip / food | `food` | Beli screenshot slot | opens `BELI_URL` |
| *(nothing hovered)* | `sketch` | default sketchbook slot | — |

- Triggers carry a **marker highlight** (`.about-trigger`, grows on hover) and
  a cursor-following **"Click me" pill** (reuses the `.read-pill` class).
- A **grace timer** (420ms) keeps the preview alive while the cursor travels
  from the bullet to the polaroid, so the click-through is reachable. Hovering
  the screen itself also cancels the revert.
- Carousels auto-advance (skipped under reduced motion); clicking the screen
  steps them. `stack`/`food` render as `<a>`, carousels as `<button>`.

**User must still:** set `STACK_URL` and `BELI_URL` constants in `AboutV2.tsx`
(currently `"#"`) and delete the matching `e.preventDefault()` in
`handleScreenClick`; drop real images replacing the `image-slot` divs.

---

## 6. Outstanding / user to-do (not blocking)

- Replace `image-slot` placeholders with real `<img>`s throughout: About iPad
  (sketchbook, Stack screenshot, 3 mentoring photos, 5 drawings, Beli),
  hero polaroid, project case-study images, Inline internship certificate.
- Wire real URLs: `STACK_URL` / `BELI_URL` in `AboutV2.tsx`; LinkedIn + Resume
  in `ConnectV2.tsx` (still `is-pending`).
- Adjust `MENTOR_COUNT` / `ILLOS_COUNT` in `AboutV2.tsx` to match the real
  number of photos/drawings added.

---

## 7. Status

No open bugs. `npx tsc --noEmit` exits 0. Awaiting the user's review of the
interactive About iPad in the browser.
