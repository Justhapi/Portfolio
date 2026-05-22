# Portfolio site — handoff notes

Paste this into a new chat to resume work without losing context.

---

## Project

- **Repo root:** `/Users/kathleenli/Desktop/Portfolio`
- **Active app:** `/Users/kathleenli/Desktop/Portfolio/next-site` (Next.js)
- **Reference (legacy/source-of-truth assets):** `/Users/kathleenli/Downloads/Claude Design Portoflio`

This is Kathleen Li's personal portfolio. Aesthetic: paper-feel sticker collage on a dark stage. The hero is a "polaroid + stickers + handwritten title" composition with subtle motion that lands inside ~1 second.

---

## What's been worked on most recently

### 1. Nav pill — condense-on-scroll

**File:** `next-site/app/globals.css`, rule `.nav-pill` (around line 306) and `body.on-paper .nav-pill` (~line 320).

In the hero, the nav links sit wide-spread (`gap: 64px`, `padding: 4px 32px`) with a transparent pill. Once `body.on-paper` flips on (HeroV2 toggles it at `scrollY > windowHeight * 0.7`), the pill compresses to `gap: 2px, padding: 4px` and gets a backdrop + border.

**Current timing** (just slowed from 360ms quart → 850ms expo):
```css
transition:
  gap 850ms var(--ease-out-expo),
  padding 850ms var(--ease-out-expo),
  border-color 600ms ease,
  background 600ms ease;
```

`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` is defined at globals.css:50.

If the user wants it even slower or wants the trigger point shifted, the scroll threshold lives in `HeroV2.tsx` (`window.scrollY > window.innerHeight * 0.7`).

### 2. Artist · Designer handwriting wordmark

**File:** `next-site/components/ArtistDesignerWordmark.tsx`

This is the big animated title on the hero. Each letter has:
- A filled glyph (`GLYPHS` array) — the final visible letter shape
- A centerline stroke (`STROKES` map) — the "pen path" used as an SVG mask

**Animation per letter (one continuous gesture):**
1. **drawStroke** — `stroke-dashoffset` animates 1→0 along the centerline; the masked glyph reveals as the pen draws (300ms × per-letter dur multiplier, eased `cubic-bezier(0.5, 0, 0.4, 1)`).
2. **inkBleed** — immediately after, the stroke widens out to 480 user units (eased `cubic-bezier(0.16, 1, 0.3, 1)`, duration ~45% of trace), so the same gesture that drew the line spreads outward to fill the full glyph. Mask is clipped by the letter, so the over-widening is invisible.

**Key recent decisions and why:**
- ❌ **Removed the cross-fade overlay** (`letterFill` keyframe + duplicate letter path). User said it made the handwriting "look fake."
- ❌ **Rejected the snap-in** (1ms instant fill). User said it looked "laggy" / not consistently fluid.
- ✅ **Settled on inkBleed** — the same masked stroke that drew the line widens after the trace, so it reads as one continuous ink motion. No fade, no snap.
- 🔧 **strokeLinecap: "round"** (was "butt") — flat caps were cutting diagonal "shreds" through curvy letters (s, g, e, n) when widened. Round caps wrap as a half-disc around each endpoint.
- 🔧 **inkBleed final width: 480 (unitless)** — was 260px, but some browsers ignored `px` on stroke-width inside a mask, and 260 wasn't wide enough to cover lobes far from centerline. 480 user units is ~5× the widest glyph → guaranteed coverage.

**Special elements inside the wordmark:**
- `star` glyph (4-point) pops in with elastic scale instead of stroke trace.
- `i1` dot detaches from "Artist", arcs over the star, and lands as the middot between Artist and Designer (`shoot` + `bounceSettle` keyframes).
- A replacement dot pops back onto the `i` shortly after the original leaves (`popDot` keyframe).
- Reduced-motion users get the static finished mark.

### 3. HeroV2 polaroid + stickers

**File:** `next-site/components/HeroV2.tsx`

The center polaroid is a two-layer photo with cursor-driven spotlight peek and click-to-swap. There's also a "first-load hint" that briefly reveals the swap interaction at ~1000ms. The Kathleen Li olive sticker (top-right) sits above a maroon 李曦 oval. The green "Currently designing at ___ while" sticker is bottom-left.

---

## File map (only the actively-touched ones)

```
next-site/
├── app/
│   └── globals.css                          # all visual styles + tokens
├── components/
│   ├── ArtistDesignerWordmark.tsx           # the animated title (most active)
│   ├── HeroV2.tsx                           # hero composition
│   ├── SparkleField.tsx                     # background sparkle layer
│   └── …
└── …
```

Legacy source (don't edit unless porting back into next-site):
- `next-site/wordmark.jsx` and `next-site/main.jsx` — original prototype that informed the React port.

---

## Open / likely-next asks

- **If the user thinks the wordmark bleed still looks abrupt:** try moving the bleed to start mid-trace (overlap with the latter 30–40% of drawStroke) so the widening blends into the trace rather than following it as a separate phase.
- **If the user wants the trace itself slower/faster:** edit `LETTER_DUR` (currently 300ms) and `LETTER_STAGGER` (100ms) at the top of `ArtistDesignerWordmark.tsx`.
- **If the nav condense still feels too quick:** push 850ms → 1100–1400ms, or shift the `0.7` threshold in `HeroV2.tsx` so the transition starts sooner.

---

## Working preferences (from this session)

- The user dislikes overlay-based fades for handwriting — wants animations to read as one continuous motion.
- The user reacts to *feel* (laggy vs fluid, fake vs real-ink) more than to technical metrics. Describe trade-offs in those terms when proposing changes.
- The user has computer-use turned off, so visual verification requires them to look manually. Be precise about what to expect when they reload.

---

## Recap of the running iteration on the wordmark

| Iteration | What changed | Result |
|---|---|---|
| Baseline | Masked centerline trace + fade-in fill overlay | User: "the fade makes the handwriting look fake" |
| Fix 1 | Removed fade, used 1ms snap | User: "don't make the writing look laggy" |
| Fix 2 | Stroke widens (inkBleed) after trace, no overlay | User screenshot: shredded `s g n e r` |
| Fix 3 (current) | strokeLinecap "round" + bleed target 480 | Awaiting feedback |

---

*Last updated: 2026-05-17*
