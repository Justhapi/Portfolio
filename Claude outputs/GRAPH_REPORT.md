# Graph Report - next-site  (2026-11-07)

## Corpus Check
- 84 files · ~116,460 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 55 file(s) not represented in the graph (top: .ttf 41, .woff2 8, .css 4)

## Summary
- 745 nodes · 1472 edges · 33 communities (29 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.81)
- Token cost: 104,171 input · 0 output

## Community Hubs (Navigation)
- Old Memory Prototypes
- Doodle Pad & Connect Proto
- Connect Sky & Notes
- Home Page & Projects
- NPM Dependencies
- Hero Wordmark Motion
- Production Bag Pop-ups
- Root Layout & Fonts
- Frogslayer Case Study
- Bag Prototype Hover Logic
- AI Journey Agent Case
- Production HoverBag
- Case Study Shared Parts
- Final Punch Prototype
- Prototype Sticky Pad
- TypeScript Config
- Case Study Decisions
- ResearchHub Case Study
- Bag Prototype Harness
- Feenix Case Study
- About Bag Design Notes
- About Section
- Old Bag Tray
- Agent & Deploy Docs
- Bag Pill Variants
- Research Carousel
- Orbit Pill Layouts
- Bag Splash
- Case Equation
- Friends Scatter
- Next Config
- Media Types

## God Nodes (most connected - your core abstractions)
1. `react` - 51 edges
2. `slap()` - 24 edges
3. `useCycle()` - 23 edges
4. `ConnectSky()` - 21 edges
5. `ZoomableImage()` - 20 edges
6. `ConnectSkyProto()` - 17 edges
7. `compilerOptions` - 17 edges
8. `useSong()` - 14 edges
9. `CaseCover()` - 12 edges
10. `Controls()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `AboutV2()`  [EXTRACTED]
  app/page.tsx → components/AboutV2.tsx
- `Home()` --calls--> `ConnectSky()`  [EXTRACTED]
  app/page.tsx → components/ConnectSky.tsx
- `Home()` --calls--> `HeroV2()`  [EXTRACTED]
  app/page.tsx → components/HeroV2.tsx
- `Home()` --calls--> `RevealOnScroll()`  [EXTRACTED]
  app/page.tsx → components/RevealOnScroll.tsx
- `PrototypeDemos()` --calls--> `CaseVideo()`  [EXTRACTED]
  app/projects/ai-journey-agent/page.tsx → components/CaseVideo.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four case studies sharing the IA skeleton** — handover_case_study_skeleton, handover_frogslayer_case, handover_ai_journey_agent_case, handover_researchhub_case, handover_inline_case, handover_outcome_callout_pattern [EXTRACTED 1.00]
- **HoverBag popup system** — handover_hoverbag_layered_bag, handover_pillorbit, handover_pillscatter, handover_pillart, handover_placepill_popup_placement, handover_floatbob_idle_motion, handover_individual_transform_composition [EXTRACTED 1.00]
- **Recruiter-recording-driven skim optimizations** — handover_recruiter_session_recording, handover_velocity_aware_reveals, handover_hero_entrance_pacing, handover_recruiter_audience [INFERRED 0.85]

## Communities (33 total, 4 thin omitted)

### Community 0 - "Old Memory Prototypes"
Cohesion: 0.06
Nodes (88): ALBUMS, CLOUD, Controls(), DoodleFading(), DoodleKeepsake(), DOODLES, DoodleThought(), mod() (+80 more)

### Community 1 - "Doodle Pad & Connect Proto"
Cohesion: 0.07
Nodes (53): DoodleView(), DoodlePage(), metadata, burst(), ButterStar(), Compose(), ConnectSkyProto(), CopyEmail() (+45 more)

### Community 2 - "Connect Sky & Notes"
Cohesion: 0.09
Nodes (42): Box, burst(), ButterStar(), clampWords(), Compose(), ConnectSky(), CopyEmail(), countWords() (+34 more)

### Community 3 - "Home Page & Projects"
Cohesion: 0.07
Nodes (34): Home(), Harness(), VARIANTS, metadata, Page(), getLenis(), CoverVideo, FOLDER_COVER (+26 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.07
Nodes (36): dependencies, framer-motion@^11.18.2, lenis@^1.3.23, next@^16.3.0, react@^18.3.1, react-dom@^18.3.1, devDependencies, autoprefixer@^10.4.19 (+28 more)

### Community 5 - "Hero Wordmark Motion"
Cohesion: 0.10
Nodes (27): ArtistDesignerWordmark(), computeTimings(), Glyph, GLYPH_ORDER, GLYPHS, I_DOT_CENTER, MIDDOT_CENTER, STAR_CENTER (+19 more)

### Community 6 - "Production Bag Pop-ups"
Cohesion: 0.14
Nodes (29): BagDoodles(), DOODLES, easeInOut(), easeOut(), LOOSE, LOOSE_SIZE, PAD, popForward() (+21 more)

### Community 7 - "Root Layout & Fonts"
Cohesion: 0.09
Nodes (21): caveat, jetbrainsMono, k2d, kleeOne, metadata, RootLayout(), viewport, ChunkReload() (+13 more)

### Community 8 - "Frogslayer Case Study"
Cohesion: 0.07
Nodes (9): COVER_VIDEO, FrogslayerCaseStudy(), KEY_SCREENS, metadata, SECTIONS, InsightCard(), UsabilityRound(), Frogslayer case study (+1 more)

### Community 9 - "Bag Prototype Hover Logic"
Cohesion: 0.07
Nodes (29): ART_DOODLE, ART_MINIS, ART_TOOLS, artFloat(), bagPreloadSrcs(), CAPTION_FLOAT, CARD_FLOAT, DeckCard (+21 more)

### Community 10 - "AI Journey Agent Case"
Cohesion: 0.09
Nodes (16): AIJourneyAgentCaseStudy(), COVER_VIDEO, metadata, PrototypeDemos(), SECTIONS, THEMES, COVER_VIDEO, metadata (+8 more)

### Community 11 - "Production HoverBag"
Cohesion: 0.07
Nodes (25): ART_DOODLE, ART_MINIS, ART_TOOLS, CAPTION_FLOAT, CARD_FLOAT, DeckCard, EFFECT_CLASS, FRIEND_PHOTOS (+17 more)

### Community 12 - "Case Study Shared Parts"
Cohesion: 0.16
Nodes (17): ProjectsLayout(), CaseReveal(), clamp(), easeOutBack(), OpportunityGap(), STAR_PATH, starTransform(), easeInOutSine() (+9 more)

### Community 13 - "Final Punch Prototype"
Cohesion: 0.18
Nodes (17): ResearchHubCaseStudy(), JTFinals(), RHFinals(), Harness(), PROJECTS, SKINS, VARIANTS, FinalPunchPrototype() (+9 more)

### Community 14 - "Prototype Sticky Pad"
Cohesion: 0.15
Nodes (18): ALBUMS, DOODLES, easeInOut(), easeOut(), LOOSE, LOOSE_SIZE, mod(), PAD (+10 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 16 - "Case Study Decisions"
Cohesion: 0.12
Nodes (8): Props, AI Journey Agent / JourneyTrack case study, inline2 private detailed draft, inline / Pop by inline case study (NDA-sensitive), inline NDA pending confirmations / sponsor consent (Yuehlin), TikTok recruiter screen recording (Sept 2026), ResearchHub case study (Purdue Stack), Typography stack (K2D, JetBrains Mono, Caveat, Klee One, CookieRun, Long Cang)

### Community 17 - "ResearchHub Case Study"
Cohesion: 0.15
Nodes (3): COVER_VIDEO, metadata, SECTIONS

### Community 18 - "Bag Prototype Harness"
Cohesion: 0.21
Nodes (12): AboutProto(), clamp(), HoverWord(), Sparkle(), View, Harness(), VARIANTS, getPaintedBounds() (+4 more)

### Community 19 - "Feenix Case Study"
Cohesion: 0.21
Nodes (10): ar(), FeenixCaseStudy(), Img, metadata, SECTIONS_NAV, Z(), CaseCover(), HeroVideo() (+2 more)

### Community 20 - "About Bag Design Notes"
Cohesion: 0.16
Nodes (10): Deferred animation improvements, Hover-capable gating ((hover: hover) and (pointer: fine)), HoverBag layered bag illustration (6 hit zones), HoverWord inline keyword pills, PillArt (doodles taped comic sheet, 11:10 window), PillOrbit (music/games popup), PillScatter (friends popup), program_svg.md (rounded-rect SVG with embedded PNG) (+2 more)

### Community 21 - "About Section"
Cohesion: 0.31
Nodes (9): AboutV2(), clamp(), HoverWord(), Sparkle(), View, bagPreloadSrcs(), getPaintedBounds(), HoverBag() (+1 more)

### Community 22 - "Old Bag Tray"
Cohesion: 0.24
Nodes (9): FOOD, FoodBento(), reduced(), REFILL, TRIPS_WIDE, TripsWindow(), useTick(), PillFood() (+1 more)

### Community 23 - "Agent & Deploy Docs"
Cohesion: 0.25
Nodes (6): generate-agent-files.js (next dev re-adds block), node_modules/next/dist/docs guides, CLAUDE.md (imports AGENTS.md), Portfolio Handover, GitHub Pages deploy / basePath /Portfolio, Kathleen Li UX Design Portfolio (Next.js 16 static export)

### Community 24 - "Bag Pill Variants"
Cohesion: 0.25
Nodes (8): fitPhoto(), OrbitTile(), PillFriends(), PillGames(), PillMusic(), PillOrbit(), PillScatter(), renderPillVariant()

### Community 25 - "Research Carousel"
Cohesion: 0.25
Nodes (5): Props, Slide, Props, ZoomButton(), rq-block layout (40/60 text-visual split)

### Community 26 - "Orbit Pill Layouts"
Cohesion: 0.33
Nodes (7): artFloat(), OrbitTile(), PillArt(), PillGames(), PillMusic(), PillOrbit(), renderPillVariant()

### Community 27 - "Bag Splash"
Cohesion: 0.53
Nodes (5): arc(), BagSplash(), ITEMS, reduced(), shakeOff()

### Community 29 - "Friends Scatter"
Cohesion: 0.67
Nodes (3): fitPhoto(), PillFriends(), PillScatter()

## Ambiguous Edges - Review These
- `program_svg.md (rounded-rect SVG with embedded PNG)` → `PillArt (doodles taped comic sheet, 11:10 window)`  [AMBIGUOUS]
  program_svg.md · relation: conceptually_related_to

## Knowledge Gaps
- **13 isolated node(s):** `node_modules/next/dist/docs guides`, `generate-agent-files.js (next dev re-adds block)`, `CLAUDE.md (imports AGENTS.md)`, `Embedded 512x512 base64 PNG (image0_2548_58933)`, `Rounded clipPath rx=93 (clip0_2548_58933)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 291 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Production Bag Pop-ups` to `Old Memory Prototypes`, `Doodle Pad & Connect Proto`, `Connect Sky & Notes`, `Home Page & Projects`, `NPM Dependencies`, `Hero Wordmark Motion`, `Root Layout & Fonts`, `Frogslayer Case Study`, `Bag Prototype Hover Logic`, `AI Journey Agent Case`, `Production HoverBag`, `Case Study Shared Parts`, `Final Punch Prototype`, `Prototype Sticky Pad`, `Bag Prototype Harness`, `Feenix Case Study`, `About Section`, `Old Bag Tray`, `Research Carousel`, `Bag Splash`?**
  _High betweenness centrality (0.688) - this node is a cross-community bridge._
- **What connects `node_modules/next/dist/docs guides`, `generate-agent-files.js (next dev re-adds block)`, `CLAUDE.md (imports AGENTS.md)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Old Memory Prototypes` be split into smaller, more focused modules?**
  _Cohesion score 0.055364905056051246 - nodes in this community are weakly interconnected._
- **Why does `HoverBag layered bag illustration (6 hit zones)` connect `About Bag Design Notes` to `Production HoverBag`, `About Section`, `Root Layout & Fonts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `Doodle Pad & Connect Proto` be split into smaller, more focused modules?**
  _Cohesion score 0.06662770309760374 - nodes in this community are weakly interconnected._
- **Why does `react-dom` connect `NPM Dependencies` to `Bag Prototype Hover Logic`, `Connect Sky & Notes`, `Production HoverBag`, `Hero Wordmark Motion`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `program_svg.md (rounded-rect SVG with embedded PNG)` and `PillArt (doodles taped comic sheet, 11:10 window)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._