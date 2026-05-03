"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useInView } from "@/lib/useInView";

/**
 * ProjectCarousel — Framer port (exact).
 *
 * Visual reference (the user's image):
 *   • Near-black stage; three real folders visible at once.
 *   • Center folder = active (cream/yellow, untilted, full-bright).
 *   • Right peek = brown/terracotta, tilted +10°, dim, smaller.
 *   • Left peek = plum/lilac, tilted -10°, dim, smaller.
 *   • Big cream display heading: "Project [Name]" on the left.
 *   • White body description below the heading.
 *   • Cream pill CTA underneath.
 *   • Three little mini-folder icons in the top-right corner act as
 *     project trackers, each tinted to its project's hue.
 *
 * Behavior preserved from the Framer source:
 *   • Per-project hue identity: a project keeps its color, but the
 *     active slot uses the BRIGHT pair while peek/parked slots use the
 *     DIM pair — so the active folder always reads as "lit up."
 *   • Slot-based choreography: every project owns one persistent
 *     motion.div positioned by its signed slot offset from currentIndex
 *     (0 = active, ±1 = peeks, |n|≥2 = parked off-stage in a direction-
 *     aware way so the user feels which side a card came from).
 *   • Cross-faded copy slide synced to the folder slide.
 *   • ←/→ keyboard navigation when focus is anywhere inside.
 *   • Tracker mini-folders shuffle on every page change.
 */

const BRAND = {
  cream: "#FFDA85",
  creamLight: "#FFE6AC",
  creamWhite: "#FCF6E8",
  creamPaper: "#FFF6E4",
  peach: "#E19F7E",
  peachShade: "#D59B6E",
  terracotta: "#B5675B",
  teal: "#96C5C6",
  cornflower: "#5D8EF4",
  cocoa: "#3A2A1F",
  plum: "#8B7AA8",
  ochre: "#A88958",
  ochreLight: "#E8C887",
  terracottaLight: "#E5A595",
  plumLight: "#C3B5D6",
  tealLight: "#C4E0E1",
  cornflowerLight: "#A8C2F8",
  ochreShade: "#8A6E42",
  terracottaShade: "#934F45",
  plumShade: "#6E5E8A",
  tealShade: "#6FA0A1",
  cornflowerShade: "#4872C8",
} as const;

type FolderPaint = {
  frontBright: string;
  backBright: string;
  frontDim: string;
  backDim: string;
};

/**
 * Per-project palette. Order matches DEFAULT_PROJECTS so project[i] always
 * gets palette[i] regardless of which slot they're occupying.
 *
 * The active slot uses *Bright; peek/parked slots use *Dim. Hue stays the
 * same so the project's identity reads consistently across states.
 */
const FOLDER_PALETTE: ReadonlyArray<FolderPaint> = [
  // Project 0 — cream/yellow (matches the active folder in the reference)
  {
    frontBright: BRAND.cream,
    backBright: BRAND.ochre,
    frontDim: BRAND.ochre,
    backDim: BRAND.ochreShade,
  },
  // Project 1 — terracotta brown (right peek in the reference)
  {
    frontBright: BRAND.terracottaLight,
    backBright: BRAND.terracotta,
    frontDim: BRAND.terracotta,
    backDim: BRAND.terracottaShade,
  },
  // Project 2 — plum lilac (left peek in the reference)
  {
    frontBright: BRAND.plumLight,
    backBright: BRAND.plum,
    frontDim: BRAND.plum,
    backDim: BRAND.plumShade,
  },
  // Project 3 — teal
  {
    frontBright: BRAND.tealLight,
    backBright: BRAND.teal,
    frontDim: BRAND.teal,
    backDim: BRAND.tealShade,
  },
  // Project 4 — cornflower
  {
    frontBright: BRAND.cornflowerLight,
    backBright: BRAND.cornflower,
    frontDim: BRAND.cornflower,
    backDim: BRAND.cornflowerShade,
  },
];

const FOCUS_RING = "rgba(255, 218, 133, 0.9)";
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export type Project = {
  name: string;
  description: string;
  pillLabel?: string;
  href?: string;
  /** Estimated read time, e.g. "5 min" — used on the cursor pill. */
  readTime?: string;
  /** Span of the work, e.g. "Aug '25 — Dec '25". Shown next to name. */
  dates?: string;
};

const DEFAULT_PROJECTS: Project[] = [
  {
    name: "Alpha",
    description:
      "A quick peek into the design thinking, research, and motion work behind this case study.",
    pillLabel: "View case study",
    href: "#",
    readTime: "5 min",
    dates: "Aug '25 — Dec '25",
  },
  {
    name: "Beta",
    description:
      "Two years of design notes cross-linked into a living mental model — heuristics, frameworks, and the arguments I have with my favorite design books.",
    pillLabel: "Take a look",
    href: "#",
    readTime: "8 min",
    dates: "Jan '24 — Mar '25",
  },
  {
    name: "Gamma",
    description:
      "A weekend project pairing a serif I love with a custom display face. An exercise in restraint — saying more with fewer weights.",
    pillLabel: "Read more",
    href: "#",
    readTime: "4 min",
    dates: "Feb '26 — Jun '26",
  },
];

export type ProjectCarouselProps = {
  projects?: Project[];
};

export default function ProjectCarousel({
  projects: projectsProp,
}: ProjectCarouselProps = {}) {
  const projects =
    projectsProp && projectsProp.length > 0 ? projectsProp : DEFAULT_PROJECTS;
  const n = projects.length;
  const prefersReducedMotion = useReducedMotion();
  const reactId = useId();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [shuffleNonce, setShuffleNonce] = useState(0);
  /* Three-way hover enum — drives the floating cursor pill's label
     ("5 min" over the description, "Open project" over the folder)
     AND the folder's closed→open keyframe morph. */
  const [hoveredArea, setHoveredArea] = useState<
    "none" | "description" | "folder"
  >("none");

  /* Settle gate — keep the open-folder keyframe sequence locked while
     the slide is changing. The incoming folder is mid-transition for
     ~600ms after currentIndex changes; firing the open-folder keyframes
     during that window looks chaotic (papers fly in before the folder
     itself has stopped). We flip false on every index change, then back
     to true once the slide has had time to settle. */
  const [activeSettled, setActiveSettled] = useState(true);
  useEffect(() => {
    setActiveSettled(false);
    const ms = prefersReducedMotion ? 0 : 720;
    const t = setTimeout(() => setActiveSettled(true), ms);
    return () => clearTimeout(t);
  }, [currentIndex, prefersReducedMotion]);

  /* Cursor-following pill: motion values updated by the section's
     mousemove handler. Using motion values (not state) means moving
     the mouse never re-renders the carousel — updates go straight to
     the DOM transform, keeping the pill at 60fps and freeing the rest
     of the section from layout work on every move. */
  const sectionRef = useRef<HTMLElement | null>(null);
  /* In-view flag for the section's scroll-reveal cascade. Reuses
     the existing sectionRef (which the cursor pill also reads from).
     Once visible, the observer disconnects so the reveal plays once. */
  const [sectionInView, setSectionInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSectionInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const onSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    // +18 puts the pill at the bottom-RIGHT of the cursor, matching the
    // Framer source. Tooltip-style offset, not pinned to it.
    cursorX.set(e.clientX - r.left + 18);
    cursorY.set(e.clientY - r.top + 18);
  };

  const current = projects[currentIndex % n];
  const currentPaint = FOLDER_PALETTE[currentIndex % FOLDER_PALETTE.length];

  const bumpShuffle = () => setShuffleNonce((s) => s + 1);

  /* Mini-folder click — pick the SHORTER wrap direction. So if you're
     on project 0 of 3 and click project 2, we slide BACKWARDS (since
     0 → -1 → 2 is one step, while 0 → 1 → 2 is two). */
  const goTo = (i: number) => {
    const target = ((i % n) + n) % n;
    if (target === currentIndex) {
      bumpShuffle();
      return;
    }
    const forward = (target - currentIndex + n) % n;
    const backward = (currentIndex - target + n) % n;
    setDirection(forward <= backward ? 1 : -1);
    setCurrentIndex(target);
    bumpShuffle();
  };
  /* Arrow nav — direction ALWAYS matches the arrow regardless of
     wrap. `next` from the last project wraps to the first but still
     slides forward (right→left); `prev` from the first wraps to the
     last but still slides backward (left→right). */
  const next = () => {
    setDirection(1);
    setCurrentIndex((c) => (c + 1) % n);
    bumpShuffle();
  };
  const prev = () => {
    setDirection(-1);
    setCurrentIndex((c) => (c - 1 + n) % n);
    bumpShuffle();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  // Slot offset, signed and wrapped so |slot| <= n/2.
  const getSlot = (idx: number) => {
    const raw = (((idx - currentIndex) % n) + n) % n;
    return raw > n / 2 ? raw - n : raw;
  };

  // Choreography distances (px, scale, deg). Tuned to match the reference
  // image's relative sizing/tilt of the peeks vs. the centered active.
  const PEEK_X = 240;
  const PEEK_Y = 14;
  const PEEK_SCALE = 0.74;
  const PEEK_ROTATE = 10;
  const PEEK_OPACITY = 0.95;

  const getSlotTarget = (slot: number, dir: number) => {
    if (prefersReducedMotion) {
      if (slot === 0) return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
      if (slot === -1)
        return {
          x: -PEEK_X,
          y: 0,
          scale: PEEK_SCALE,
          rotate: 0,
          opacity: PEEK_OPACITY,
        };
      if (slot === 1)
        return {
          x: PEEK_X,
          y: 0,
          scale: PEEK_SCALE,
          rotate: 0,
          opacity: PEEK_OPACITY,
        };
      return { x: 0, y: 0, scale: 0.6, rotate: 0, opacity: 0 };
    }
    if (slot === 0) {
      return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
    }
    if (slot === -1) {
      return {
        x: -PEEK_X,
        y: PEEK_Y,
        scale: PEEK_SCALE,
        rotate: -PEEK_ROTATE,
        opacity: PEEK_OPACITY,
      };
    }
    if (slot === 1) {
      return {
        x: PEEK_X,
        y: PEEK_Y,
        scale: PEEK_SCALE,
        rotate: PEEK_ROTATE,
        opacity: PEEK_OPACITY,
      };
    }
    // Parked off-stage: direction decides which side it parks on so the
    // user feels which way the carousel just rotated.
    if (slot < -1) {
      return dir > 0
        ? { x: -1100, y: 0, scale: 0.6, rotate: -16, opacity: 0 }
        : { x: -PEEK_X * 1.4, y: -380, scale: 0.7, rotate: -PEEK_ROTATE, opacity: 0 };
    }
    return dir > 0
      ? { x: PEEK_X * 1.4, y: -380, scale: 0.7, rotate: PEEK_ROTATE, opacity: 0 }
      : { x: 1100, y: 0, scale: 0.6, rotate: 16, opacity: 0 };
  };

  /* Track viewport width so the slide distances scale to the screen.
     Default to a generous 1600 for the SSR pass (covers typical
     desktops) — useEffect updates it on mount + resize. */
  const [viewportW, setViewportW] = useState<number>(1600);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Copy slide variants — horizontal translate + a CSS filter blur
     while the content is OUTSIDE the bounded card. The blur lifts
     while the slide is in flight (enter/exit), then sharpens to 0
     as the slide lands at center; on the way out it blurs again.
     Net effect: anything that isn't centered in the container reads
     as out-of-focus — the bounded card holds the only sharp frame. */
  const slideDistance = prefersReducedMotion ? 0 : viewportW + 200;
  const SLIDE_BLUR = prefersReducedMotion ? 0 : 10;
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? slideDistance : -slideDistance,
      filter: `blur(${SLIDE_BLUR}px)`,
    }),
    center: { x: 0, filter: "blur(0px)" },
    exit: (dir: number) => ({
      x: dir > 0 ? -slideDistance : slideDistance,
      filter: `blur(${SLIDE_BLUR}px)`,
    }),
  };
  const slideTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        x: { duration: 0.7, ease: EASE_EXPO },
        filter: { duration: 0.55, ease: EASE_EXPO },
      };

  /* Folder-stage slide variants — same full-viewport travel + a
     small rotate so the folder feels physical when the carousel
     pages, plus the same blur-while-out-of-center treatment. The
     folder leaves the OPPOSITE side from the description so the
     two halves feel like one gesture (going next: description
     slides off left, folder slides off right; going prev: mirrored). */
  const folderSlideDistance = prefersReducedMotion ? 0 : viewportW + 200;
  const FOLDER_BLUR = prefersReducedMotion ? 0 : 12;
  const folderSlideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? folderSlideDistance : -folderSlideDistance,
      rotate: dir > 0 ? 6 : -6,
      filter: `blur(${FOLDER_BLUR}px)`,
    }),
    center: { x: 0, rotate: 0, filter: "blur(0px)" },
    exit: (dir: number) => ({
      x: dir > 0 ? -folderSlideDistance : folderSlideDistance,
      rotate: dir > 0 ? -6 : 6,
      filter: `blur(${FOLDER_BLUR}px)`,
    }),
  };
  const folderSlideTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        x: { duration: 0.75, ease: EASE_EXPO },
        rotate: { duration: 0.75, ease: EASE_EXPO },
        filter: { duration: 0.6, ease: EASE_EXPO },
      };

  return (
    <section
      className={`projects-section${sectionInView ? " in-view" : ""}`}
      id="projects"
      aria-label="Projects"
      onKeyDown={onKeyDown}
      onMouseMove={onSectionMove}
      onMouseLeave={() => setHoveredArea("none")}
      ref={sectionRef}
      tabIndex={0}
    >
      <style>{`
        .projects-section {
          position: relative;
          width: 100%;
          /* Sketchbook teal — matches the user's hand-drawn reference.
             A subtle vertical gradient gives depth without breaking
             the page-wide white→teal→navy wash. */
          background: linear-gradient(180deg, #2c4f57 0%, #244850 100%);
          color: ${BRAND.creamWhite};
          padding: clamp(80px, 9vw, 140px) clamp(28px, 5vw, 80px) clamp(96px, 10vw, 160px);
          outline: none;
          overflow: hidden;
        }
        .projects-section:focus-visible {
          outline: 2px solid ${FOCUS_RING};
          outline-offset: -10px;
          border-radius: 12px;
        }

        /* Soft warm spotlight + paper grain */
        .projects-section::before {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 60% 50%, rgba(255, 218, 133, 0.07) 0%, rgba(0,0,0,0) 55%),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.04) 0, transparent 35%),
            radial-gradient(circle at 80% 30%, rgba(0,0,0,0.10) 0, transparent 50%);
        }

        /* ── Decorative blue sparkles scattered around the section ── */
        .sparkle-deco {
          position: absolute;
          color: ${BRAND.tealLight};
          pointer-events: none;
          display: block;
          opacity: 0.55;
          z-index: 0;
        }
        .sparkle-deco svg { width: 100%; height: 100%; fill: currentColor; display: block; }
        .sd-1 { top: 12%;  left: 4%;   width: 26px; height: 26px; opacity: 0.45; animation: sd-drift 9s ease-in-out infinite alternate; }
        .sd-2 { top: 78%;  left: 2%;   width: 38px; height: 38px; opacity: 0.6;  animation: sd-drift 11s 1s ease-in-out infinite alternate-reverse; }
        .sd-3 { bottom: 18%; right: 4%; width: 22px; height: 22px; opacity: 0.5;  animation: sd-drift 8s 0.5s ease-in-out infinite alternate; }
        .sd-4 { top: 38%;  right: 1.5%; width: 18px; height: 18px; opacity: 0.42; animation: sd-drift 10s 2s ease-in-out infinite alternate-reverse; }
        .sd-5 { top: 6%;   left: 38%;  width: 14px; height: 14px; opacity: 0.32; }
        @keyframes sd-drift {
          from { transform: translate(0, 0) rotate(0deg); }
          to   { transform: translate(-3px, -6px) rotate(8deg); }
        }

        /* Carousel as a contained module — bounded ~16:9 module
           shape from the layout reference. max-width caps the
           horizontal sprawl, min-height locks in the proportion,
           and a soft inner border + subtle frame tint give it the
           "card on a desk" read without heavy chrome. Internal
           padding rides the 4pt scale. */
        .projects-inner {
          position: relative;
          max-width: 1080px;
          min-height: 540px;
          margin: 0 auto;
          /* Horizontal padding sized to clear the side nav buttons
             (clamp(64px, 8%, 110px)) PLUS ~20px breathing room, so
             the title row, copy column, and folder stage never
             overlap with the click strips on the edges. */
          padding: clamp(28px, 3vw, 44px) clamp(84px, 11%, 130px) clamp(36px, 3.5vw, 56px);
          border-radius: 18px;
          background: rgba(196, 224, 225, 0.04);
          /* Visible cream-tinted outline so the bounded card reads
             clearly against the dark teal section. The inset shadow
             approach paints the outline INSIDE the box so it doesnt
             shift content the way a real border property would. */
          box-shadow:
            inset 0 0 0 1.5px rgba(252, 246, 232, 0.40),
            0 24px 48px -24px rgba(0, 0, 0, 0.45);
          z-index: 1;
          display: flex;
          flex-direction: column;
          /* Clip slide content to the bounded card. Combined with
             the slideVariants' filter:blur on enter/exit, content
             OUTSIDE the container reads as blurred + cropped at the
             card's rounded edges, while only the centered (in-frame)
             content is sharp and visible. */
          overflow: hidden;
        }

        /* ── Section title: "Project Inventory" with squiggle underline ── */
        .pi-title-wrap {
          position: relative;
          margin: 0 0 clamp(40px, 6vw, 72px);
          max-width: 720px;
        }
        .pi-title {
          font-family: 'Caveat', cursive;
          font-size: clamp(3rem, 6vw, 5.4rem);
          color: ${BRAND.cream};
          margin: 0;
          font-weight: 600;
          letter-spacing: -0.005em;
          line-height: 0.95;
        }
        /* Subtitle — elaborates on the section heading. Sora at sm
           weight with a quiet cream-white opacity reads as a caption
           beneath the hand-lettered title without competing with it. */
        .pi-subtitle {
          margin: 8px 0 0;
          font-family: 'Sora', sans-serif;
          font-size: clamp(0.92rem, 1.05vw, 1.05rem);
          font-weight: 400;
          color: rgba(252, 246, 232, 0.78);
          letter-spacing: 0.005em;
          line-height: 1.45;
          max-width: 56ch;
        }

        /* ── "project preview" label arrow above the mini-folder tracker ── */
        .tracker-label {
          position: absolute;
          top: -2px;
          right: 110px;
          font-family: 'Caveat', cursive;
          font-size: clamp(18px, 1.4vw, 22px);
          color: ${BRAND.cream};
          opacity: 0.75;
          line-height: 1;
          white-space: nowrap;
          z-index: 3;
        }
        .tracker-label svg {
          display: inline-block;
          width: 32px; height: 32px;
          color: ${BRAND.cream};
          vertical-align: -8px;
          margin-left: 4px;
          opacity: 0.65;
        }

        /* ── Top-right tracker (mini folders) ── Inset matches the
           .projects-inner horizontal padding so the tracker sits
           inside the bounded interior, past the right nav button.
           Z-index is BELOW the side nav buttons so the wider edge
           click zones still take precedence — tracker mini folders
           remain clickable on themselves but don't compete with
           the side nav strips for hover/focus on the very edge. */
        .tracker-mini {
          position: absolute;
          top: clamp(28px, 3vw, 44px);
          right: clamp(84px, 11%, 130px);
          display: flex;
          gap: 8px;
          align-items: center;
          z-index: 5;
        }
        .mini-folder-btn {
          all: unset;
          cursor: pointer;
          width: 30px; height: 24px;
          display: inline-block;
          opacity: 0.7;
          transition: opacity 220ms ease, transform 220ms ease;
        }
        .mini-folder-btn:hover { opacity: 0.95; transform: translateY(-1px); }
        .mini-folder-btn.active { opacity: 1; transform: translateY(-2px); }
        .mini-folder-btn:focus-visible {
          outline: 2px solid ${FOCUS_RING};
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* ── Main grid: copy left, folder stage right ──
           Column minimums are kept modest so the two-column layout
           still fits inside the bounded card after horizontal
           padding. Below the responsive breakpoint the grid stacks
           to a single centered column. */
        .pi-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
          gap: clamp(20px, 3vw, 48px);
          align-items: center;
        }

        /* ── Copy column ── */
        .projects-copy {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }
        /* Bounded stage for the two in-flight slides — outgoing and
           incoming motion.divs both sit at inset:0 here, so they
           occupy the same coordinate space and visibly cross each
           other instead of queuing. */
        .copy-stage {
          position: relative;
          min-height: clamp(220px, 22vw, 300px);
        }
        /* Project name + dates row — name dominates, dates ride the
           baseline as a quiet date-range caption to its right. */
        .project-name-row {
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .project-name {
          font-family: 'Caveat', cursive;
          font-size: clamp(2.6rem, 5vw, 4.4rem);
          font-weight: 600;
          color: ${BRAND.cream};
          letter-spacing: 0.005em;
          line-height: 0.95;
          margin: 0;
        }
        .project-dates {
          font-family: 'Sora', sans-serif;
          font-size: clamp(0.85rem, 1vw, 1rem);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(252, 246, 232, 0.65);
          line-height: 1;
          padding-bottom: 6px;
          white-space: nowrap;
        }
        .project-description {
          font-family: 'Caveat', cursive;
          font-size: clamp(1.25rem, 1.7vw, 1.55rem);
          color: rgba(252, 246, 232, 0.92);
          line-height: 1.45;
          margin: 0 0 28px;
          max-width: 38ch;
          letter-spacing: 0.005em;
        }

        /* ── Edge nav buttons ──
           Each side of the bounded carousel card is a clickable
           gradient zone. At rest the gradient is quiet — the cream
           fades from a low alpha at the edge to fully transparent
           inboard. On hover the gradient brightens and the chevron
           pops into full opacity, telegraphing "click here to see
           the next folder." Z-indexed above the description so the
           click always lands here when the cursor is on the edge. */
        .pi-nav {
          all: unset;
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(64px, 8%, 110px);
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 18px;
          z-index: 4;
          transition: background 280ms cubic-bezier(0.22,1,0.36,1);
        }
        .pi-nav-prev {
          left: 0;
          justify-content: flex-start;
          padding-left: clamp(12px, 1.4vw, 20px);
          background: linear-gradient(
            90deg,
            rgba(255, 218, 133, 0.18) 0%,
            rgba(255, 218, 133, 0.10) 35%,
            rgba(255, 218, 133, 0) 100%
          );
        }
        .pi-nav-next {
          right: 0;
          justify-content: flex-end;
          padding-right: clamp(12px, 1.4vw, 20px);
          background: linear-gradient(
            270deg,
            rgba(255, 218, 133, 0.18) 0%,
            rgba(255, 218, 133, 0.10) 35%,
            rgba(255, 218, 133, 0) 100%
          );
        }
        @media (hover: hover) {
          .pi-nav-prev:hover {
            background: linear-gradient(
              90deg,
              rgba(255, 230, 172, 0.55) 0%,
              rgba(255, 218, 133, 0.32) 40%,
              rgba(255, 218, 133, 0) 100%
            );
          }
          .pi-nav-next:hover {
            background: linear-gradient(
              270deg,
              rgba(255, 230, 172, 0.55) 0%,
              rgba(255, 218, 133, 0.32) 40%,
              rgba(255, 218, 133, 0) 100%
            );
          }
        }
        .pi-nav:focus-visible {
          outline: 2px solid ${FOCUS_RING};
          outline-offset: -4px;
          border-radius: 18px;
        }
        /* Chevron — sits centered vertically against the gradient.
           Quiet cream by default, full bright on hover, and shifts
           in its travel direction so the click feels intentional. */
        .pi-nav-chev {
          display: grid;
          place-items: center;
          width: clamp(22px, 2vw, 30px);
          height: clamp(40px, 4vw, 56px);
          color: ${BRAND.cream};
          opacity: 0.5;
          transition:
            opacity 220ms cubic-bezier(0.22,1,0.36,1),
            transform 220ms cubic-bezier(0.22,1,0.36,1),
            color 220ms ease;
        }
        .pi-nav-chev svg { width: 100%; height: 100%; display: block; }
        @media (hover: hover) {
          .pi-nav:hover .pi-nav-chev {
            opacity: 1;
            color: ${BRAND.creamLight};
          }
          .pi-nav-prev:hover .pi-nav-chev { transform: translateX(-4px); }
          .pi-nav-next:hover .pi-nav-chev { transform: translateX(4px); }
        }

        /* ── Folder stage: ONE folder, hover swaps closed → open ── */
        .folder-stage {
          position: relative;
          height: clamp(380px, 38vw, 520px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Subtle teal patch / shadow on the floor under the folder,
           matching the sketch's hand-drawn ground-shadow shape. */
        .folder-floor {
          position: absolute;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%) rotate(-4deg);
          width: 64%;
          height: 26px;
          background: rgba(150, 197, 198, 0.18);
          border-radius: 50%;
          filter: blur(8px);
          pointer-events: none;
        }
        /* The hover target — a button so it's keyboard-reachable.
           Wraps both the folder graphic and the read-time pill so they
           transform together. */
        .folder-button {
          all: unset;
          position: relative;
          cursor: pointer;
          width: clamp(280px, 28vw, 380px);
          aspect-ratio: 4 / 3;
          display: grid;
          place-items: center;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
          z-index: 2;
        }
        .folder-button:focus-visible {
          outline: 2px solid ${FOCUS_RING};
          outline-offset: 8px;
          border-radius: 12px;
        }
        @media (hover: hover) {
          .folder-button:hover { transform: translateY(-4px) rotate(-1deg); }
        }
        /* Folder layers are absolute siblings stacked at the same
           coordinates — the keyframe morph squeezes both to the same
           y:-110 / scaleX:0.32 sliver, then crossfades opacity at that
           midpoint, so visually it reads as one folder transforming
           into the other. transform-origin at 50% 85% (bottom-center)
           is what makes the squeeze grow UPWARD rather than collapsing
           into the middle of the image. */
        .folder-svg-wrap {
          position: absolute;
          inset: 0;
          display: block;
          will-change: transform;
        }
        .folder-svg-layer {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          transform-origin: 50% 85%;
          will-change: transform, opacity;
          pointer-events: none;
        }
        .folder-svg-layer svg {
          width: 100%; height: 100%;
          display: block;
          filter: drop-shadow(0 24px 30px rgba(0,0,0,0.32));
        }

        /* Tight hover hit-region — sits over the central area of the
           folder so cursoring across the empty corners of the stage
           doesn't keep flipping the morph open/closed. */
        .folder-hit {
          position: absolute;
          left: 22%;
          right: 22%;
          top: 24%;
          bottom: 14%;
          z-index: 4;
          cursor: pointer;
        }

        /* ── Cursor-following pill ──
           Anchored at top:0/left:0 of the section; motion values for
           x and y land it at the cursor's position relative to the
           section. The mousemove handler adds an 18px offset so the
           pill sits at the bottom-RIGHT of the cursor. */
        .cursor-pill {
          position: absolute;
          top: 0; left: 0;
          background: ${BRAND.cream};
          color: ${BRAND.cocoa};
          padding: 8px 18px;
          border-radius: 999px;
          font-family: 'Caveat', cursive;
          font-size: clamp(1rem, 1.25vw, 1.2rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.01em;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 6px 18px rgba(58, 35, 28, 0.35);
          z-index: 50;
          will-change: transform, opacity;
        }

        /* ── Scroll-reveal cascade ──
           Title, subtitle, tracker, and the bounded card frame fade
           in with staggered delays once the section enters the
           viewport. The internal carousel content (description,
           folder, etc.) keeps its own framer-motion animations and
           is exempted via .pi-grid > * (no .pi-reveal class). */
        .projects-section .pi-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition:
            opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .projects-section.in-view .pi-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        .projects-section.in-view .pi-reveal[data-r="1"] { transition-delay: 0.05s; }
        .projects-section.in-view .pi-reveal[data-r="2"] { transition-delay: 0.18s; }
        .projects-section.in-view .pi-reveal[data-r="3"] { transition-delay: 0.30s; }

        @media (prefers-reduced-motion: reduce) {
          .projects-section .pi-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        /* Trigger the stack BEFORE the two-column grid crashes —
           the bounded card has clamp(84px, 11%, 130px) horizontal
           padding plus the side nav buttons, so once the viewport
           is below ~1100px the inner content area becomes too narrow
           for both columns to fit comfortably. Stacking earlier keeps
           the layout readable instead of forcing word-per-line wraps. */
        @media (max-width: 1100px) {
          .projects-section { padding: 64px 24px 96px; }
          .projects-inner {
            min-height: 0;
            /* Side nav buttons get narrower at this breakpoint so
               the inner content has room to breathe. */
            padding: clamp(28px, 5vw, 48px) clamp(56px, 9vw, 96px) clamp(36px, 5vw, 56px);
          }
          /* Stacked layout — center each row so the carousel reads
             as a single vertical column on narrow viewports.
             NOTE: no justify-items:center here — that would shrink
             grid items to their intrinsic width, which forces the
             description to wrap word-per-line. Stretch is the default
             and keeps each row at full column width; centering
             happens via text-align + auto margins on inner elements. */
          .pi-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          .projects-copy {
            width: 100%;
            align-items: center;
          }
          .pi-title-wrap { text-align: center; }
          .pi-title { font-size: clamp(2.4rem, 7vw, 3.4rem); }
          .pi-subtitle { margin-left: auto; margin-right: auto; }
          .project-name-row { justify-content: center; flex-wrap: wrap; }
          .project-name { font-size: clamp(2rem, 6vw, 2.8rem); }
          .project-description {
            margin-left: auto;
            margin-right: auto;
            max-width: 36ch;
          }
          /* In stacked mode, drop the absolute-positioned slide
             container — let the project name + description flow
             naturally in document order so the description has full
             column width to wrap and never overlaps the title above
             or the folder below. The slide animations still run via
             transform on whichever motion.div is mounted. */
          .copy-stage {
            position: static;
            min-height: 0;
            width: 100%;
          }
          .copy-stage > * {
            position: relative !important;
            inset: auto !important;
            justify-content: flex-start !important;
          }
          .tracker-label { display: none; }
          .tracker-mini {
            position: relative;
            top: 0;
            right: auto;
            margin: 0 auto 8px;
          }
          .folder-stage { height: 320px; justify-content: center; }
          .folder-button { width: clamp(200px, 50vw, 280px); }
          /* Narrower side nav strips on small screens — but never
             below 44px so the touch target meets the accessibility
             minimum. */
          .pi-nav { width: clamp(44px, 7%, 64px); }
          .pi-nav-chev { width: clamp(18px, 1.6vw, 22px); height: clamp(32px, 3vw, 40px); }
        }
      `}</style>

      {/* ── Decorative blue sparkle stars scattered across the section ── */}
      <span className="sparkle-deco sd-1" aria-hidden><SparkleStar /></span>
      <span className="sparkle-deco sd-2" aria-hidden><SparkleStar /></span>
      <span className="sparkle-deco sd-3" aria-hidden><SparkleStar /></span>
      <span className="sparkle-deco sd-4" aria-hidden><SparkleStar /></span>
      <span className="sparkle-deco sd-5" aria-hidden><SparkleStar /></span>

      <div className="projects-inner">
        {/* ── Edge nav zones — each side of the container fades into
            cream and brightens on hover; clicking navigates prev/next.
            They replace the explicit chevron arrow buttons by turning
            the edges of the bounded card themselves into the nav
            affordance. ── */}
        <button
          type="button"
          className="pi-nav pi-nav-prev"
          onClick={prev}
          aria-label="Previous project"
        >
          <span className="pi-nav-chev" aria-hidden>
            <svg viewBox="0 0 24 44" fill="none" focusable="false">
              <path
                d="M16 8 L8 22 L16 36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="pi-nav pi-nav-next"
          onClick={next}
          aria-label="Next project"
        >
          <span className="pi-nav-chev" aria-hidden>
            <svg viewBox="0 0 24 44" fill="none" focusable="false">
              <path
                d="M8 8 L16 22 L8 36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* ── Section title + subtitle that elaborates on what
            the section is about. ── */}
        <div className="pi-title-wrap">
          <h2 className="pi-title pi-reveal" data-r="1">Project Inventory</h2>
          <p className="pi-subtitle pi-reveal" data-r="2">
            Projects I&apos;ve worked on — what problems I solved and how
          </p>
        </div>

        {/* ── Mini-folder tracker (top-right corner) ── */}
        <div className="tracker-mini pi-reveal" data-r="3" role="tablist" aria-label="Project tracker">
          {projects.map((p, i) => {
            const paint = FOLDER_PALETTE[i % FOLDER_PALETTE.length];
            const active = i === currentIndex;
            return (
              <motion.button
                key={`${p.name}-${shuffleNonce}-${i}`}
                className={`mini-folder-btn${active ? " active" : ""}`}
                role="tab"
                aria-selected={active}
                aria-controls="project-panel"
                aria-label={`Project ${p.name}`}
                onClick={() => goTo(i)}
                initial={
                  prefersReducedMotion ? false : { y: 4, opacity: 0.5, rotate: 0 }
                }
                animate={{
                  y: active ? -2 : 0,
                  opacity: active ? 1 : 0.7,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.42,
                  delay: i * 0.04,
                  ease: EASE_EXPO,
                }}
              >
                <MiniFolder paint={paint} active={active} />
              </motion.button>
            );
          })}
        </div>

        <div className="pi-grid">
          {/* ── Copy column ── */}
          <div
            className="projects-copy"
            role="tabpanel"
            id="project-panel"
            aria-live="polite"
            onMouseEnter={() => setHoveredArea("description")}
            onMouseLeave={() => setHoveredArea("none")}
          >
            {/* `.copy-stage` is the bounded coordinate space the two
                in-flight slides share. It owns the height so the
                arrow row below it doesn't get covered. Inside, both
                outgoing AND incoming motion.divs render at the same
                time — they cross each other in mid-air instead of
                queuing one after the other. */}
            <div className="copy-stage">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    willChange: "transform",
                  }}
                >
                  <div className="project-name-row">
                    <h3 className="project-name">Project {current.name}</h3>
                    {current.dates && (
                      <span className="project-dates">{current.dates}</span>
                    )}
                  </div>
                  <p className="project-description">{current.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* ── Folder stage: hover keyframe-morphs closed → open;
              the whole stage slides on currentIndex change so clicking
              an arrow swaps the folder in sync with the description. */}
          <div className="folder-stage">
            <span className="folder-floor" aria-hidden />
            {/* No `mode` — the outgoing folder and the incoming
                folder both run their slide concurrently so the two
                cards visibly cross each other in mid-air, instead
                of one waiting for the other to finish. */}
            <AnimatePresence custom={direction} initial={false}>
              <motion.a
                key={`folder-${currentIndex}`}
                className="folder-button"
                href={current.href || "#"}
                aria-label={`Open ${current.name} project`}
                onFocus={() => setHoveredArea("folder")}
                onBlur={() => setHoveredArea("none")}
                custom={direction}
                variants={folderSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  position: "absolute",
                  inset: 0,
                  willChange: "transform",
                }}
                transition={folderSlideTransition}
              >
                <FolderAnimation
                  isHovered={activeSettled && hoveredArea === "folder"}
                  prefersReducedMotion={!!prefersReducedMotion}
                  currentIndex={currentIndex}
                  reactId={reactId}
                  paint={currentPaint}
                />
                {/* Tight hit-region — only the central area of the
                    folder fires the hover-open. Sized inside the
                    folder's visible silhouette so cursoring across the
                    empty corners of the stage doesn't bounce the
                    morph open/closed. */}
                <span
                  className="folder-hit"
                  aria-hidden
                  onMouseEnter={() => setHoveredArea("folder")}
                  onMouseLeave={() => setHoveredArea("none")}
                />
              </motion.a>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Cursor-following pill ──
          Appears at the bottom-right of the cursor whenever the user is
          over the description column or the folder. Label flips by area:
          "5 min" (read time) over the description, "Open project" over
          the folder. Bound to motion values so following the mouse
          never re-renders the carousel. */}
      <AnimatePresence>
        {hoveredArea !== "none" && (
          <motion.div
            key={`pill-${hoveredArea}`}
            className="cursor-pill"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              opacity: { duration: 0.18 },
              scale: { type: "spring", stiffness: 420, damping: 24 },
            }}
            style={{ x: cursorX, y: cursorY }}
            aria-hidden
          >
            {/* hoveredArea === "folder" → "Read more" call-to-action.
                hoveredArea === "description" → the project's read time
                (e.g. "5 min"). The pill itself only mounts when one
                of the two regions is hovered, courtesy of the
                AnimatePresence above. */}
            {hoveredArea === "folder"
              ? "Read more"
              : current.readTime || ""}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   FolderAnimation — keyframe morph between the closed and open folders.

   Choreography (from the Framer source):
     • Both folders share transformOrigin: 50% 85% (bottom-center) so
       the squeeze grows UP rather than collapsing toward the middle.
     • Closed folder: rest → lift slightly → squeeze + lift → fade out
         y:       [0, -40, -110, -110, -110, -110]
         scaleX:  [1, 0.85, 0.32, ...]
         scaleY:  [1, 1.05, 1.18, ...]
         opacity: [1, 1, 1, 0, 0, 0]      ← fades at midpoint
     • Open folder: hidden behind closed → appears at midpoint →
       overshoots wide → settles
         y:       [-110, ..., -110, 18, 0]
         scaleX:  [0.32, ..., 0.32, 1.12, 1]
         scaleY:  [1.18, ..., 1.18, 0.92, 1]
         opacity: [0, 0, 0, 1, 1, 1]      ← fades in at midpoint
     • At time 0.42–0.5 both folders are stacked at y:-110, scaleX:0.32,
       scaleY:1.18 — a tall thin sliver. Closed fades out, open fades
       in, AT THE SAME y/scale: visually it reads as one folder
       morphing into another instead of two cross-fading.

   Important: only the HOVER direction uses the keyframe array. Unhover
   uses a single target so framer-motion interpolates from the current
   state straight back to rest — without that, navigating mid-hover
   would snap to the first frame of a return-keyframe array and produce
   a visible jump.

   A continuous idle float lives on the OUTER wrapper while the
   keyframes live on the inner closed/open divs, so the folder keeps
   bobbing even mid-morph.
   ────────────────────────────────────────────────────────────────────── */
function FolderAnimation({
  isHovered,
  prefersReducedMotion,
  currentIndex,
  reactId,
  paint,
}: {
  isHovered: boolean;
  prefersReducedMotion: boolean;
  currentIndex: number;
  reactId: string;
  paint: FolderPaint;
}) {
  /* Symmetric morph — both directions run the SAME 6-stage keyframe
     sequence (rest → squeeze up → fade-cross at midpoint → emerge
     squeezed → overshoot → settle). On hover the closed folder
     squeezes up while the open folder emerges. On unhover the open
     folder squeezes up while the closed folder emerges. Visually the
     folder always "jumps" in or out instead of cross-fading. */
  const morphTransition = prefersReducedMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : {
        duration: 0.34,
        times: [0, 0.18, 0.42, 0.5, 0.78, 1],
        ease: "easeInOut" as const,
      };
  const transition = morphTransition;

  /* Hold the static rest frame until the user has hovered at least
     once. Without this, framer-motion may animate from the rest target
     to the rest target on mount and never run the float loop. */
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    if (isHovered && !hasInteracted) setHasInteracted(true);
  }, [isHovered, hasInteracted]);

  /* Hover keyframes — closed squeezes up & out, open emerges from
     squeezed and overshoots wide before settling. */
  const closedHover = {
    y: [0, -40, -110, -110, -110, -110],
    scaleX: [1, 0.85, 0.32, 0.32, 0.32, 0.32],
    scaleY: [1, 1.05, 1.18, 1.18, 1.18, 1.18],
    rotate: [-6, -5, -4, -4, -4, -4],
    opacity: [1, 1, 1, 0, 0, 0],
  };
  const openHover = {
    y: [-110, -110, -110, -110, 18, 0],
    scaleX: [0.32, 0.32, 0.32, 0.32, 1.12, 1],
    scaleY: [1.18, 1.18, 1.18, 1.18, 0.92, 1],
    rotate: [-4, -4, -4, -4, 4, -2],
    opacity: [0, 0, 0, 1, 1, 1],
  };

  /* Unhover keyframes — mirror of hover. Open folder squeezes up &
     out, closed folder emerges from squeezed and overshoots back to
     its tilted rest. The user wanted the SAME jump in both
     directions, so this is symmetric to closedHover/openHover. */
  const openUnhover = {
    y: [0, -40, -110, -110, -110, -110],
    scaleX: [1, 0.85, 0.32, 0.32, 0.32, 0.32],
    scaleY: [1, 1.05, 1.18, 1.18, 1.18, 1.18],
    rotate: [-2, -3, -4, -4, -4, -4],
    opacity: [1, 1, 1, 0, 0, 0],
  };
  const closedUnhover = {
    y: [-110, -110, -110, -110, 18, 0],
    scaleX: [0.32, 0.32, 0.32, 0.32, 1.12, 1],
    scaleY: [1.18, 1.18, 1.18, 1.18, 0.92, 1],
    rotate: [-4, -4, -4, -4, -8, -6],
    opacity: [0, 0, 0, 1, 1, 1],
  };

  const closedRest = { y: 0, scaleX: 1, scaleY: 1, rotate: -6, opacity: 1 };
  const openRest = { y: 0, scaleX: 1, scaleY: 1, rotate: -2, opacity: 0 };

  const closedAnim = !hasInteracted
    ? closedRest
    : isHovered
      ? closedHover
      : closedUnhover;
  const openAnim = !hasInteracted
    ? openRest
    : isHovered
      ? openHover
      : openUnhover;

  /* Idle float — runs on the outer wrapper so child keyframes compose
     with it. Tuned for a calm 3.2s cycle, 10px travel + tiny rotate
     for organic paper drift. */
  const floatAnimate = prefersReducedMotion
    ? undefined
    : { y: [0, -10, 0], rotate: [0, -1.2, 0] };
  const floatTransition = {
    duration: 3.2,
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: "easeInOut" as const,
  };

  return (
    <motion.span
      className="folder-svg-wrap"
      initial={{ y: 0, rotate: 0 }}
      animate={floatAnimate}
      transition={floatTransition}
      aria-hidden
    >
      {/* Closed (visible at rest) */}
      <motion.span
        className="folder-svg-layer"
        initial={closedRest}
        animate={closedAnim}
        transition={transition}
      >
        <ClosedFolder
          uniqueId={`folder-closed-${reactId}-${currentIndex}`}
          fillColor={paint.frontBright}
        />
      </motion.span>
      {/* Open (revealed on hover) */}
      <motion.span
        className="folder-svg-layer"
        initial={openRest}
        animate={openAnim}
        transition={transition}
      >
        <OpenFolder
          uniqueId={`folder-open-${reactId}-${currentIndex}`}
          isHovered={isHovered}
          folderColor={paint.frontBright}
          folderBackColor={paint.backBright}
        />
      </motion.span>
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Small 4-pointed sparkle star — used for the floating teal decoration
   scattered across the section background.
   ────────────────────────────────────────────────────────────────────── */
function SparkleStar() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
      <path
        d="M16 1
           C 16 9 9 16 1 16
           C 9 16 16 23 16 31
           C 16 23 23 16 31 16
           C 23 16 16 9 16 1 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Folder SVG — uses the user-supplied artwork:
     • active (hovered / center)   → "open" folder: peach + sparkles +
       blue rectangle + teal rectangle + yellow envelope.
     • inactive (peek / parked)    → "closed" folder: yellow envelope
       with white outline.
   The internal gradient ids are scoped with `uniqueId` so multiple
   folders on the page don't collide.
   ────────────────────────────────────────────────────────────────────── */
function FolderSVG({
  active,
  uniqueId,
}: {
  paint: FolderPaint; // kept for API parity; artwork is now hardcoded
  active: boolean;
  uniqueId: string;
}) {
  return active ? (
    <OpenFolder uniqueId={uniqueId} isHovered />
  ) : (
    <ClosedFolder uniqueId={uniqueId} />
  );
}

function OpenFolder({
  uniqueId,
  isHovered,
  folderColor = "#FFDA85",
  folderBackColor = "#E19F7E",
}: {
  uniqueId: string;
  isHovered: boolean;
  folderColor?: string;
  folderBackColor?: string;
}) {
  const g0 = `${uniqueId}-of-g0`;
  const g1 = `${uniqueId}-of-g1`;

  /* Cards + sparkles emerge from INSIDE the folder pocket. Each
     element gets its OWN x/y offset that points from its final
     position back to roughly (175, 200) in viewBox space — the
     center of the visible front-folder face. Combined with scale:
     0.25 and opacity: 0 in the hidden state, the elements collapse
     into a single point inside the folder; on hover they fan out
     to their declared positions in the artwork.
     transformBox: fill-box anchors each element's transform to its
     own bbox center so the scale grows in place. Stagger delays
     produce a sequence read of "folder spilling its contents." */
  const POCKET = [
    { x: 63, y: 147 },   // sparkle 1 — top-left, lift down + right
    { x: -109, y: 62 },  // blue card — pulls in from upper-right
    { x: 135, y: 22 },   // sparkle 2 — bottom-left, drifts in right
    { x: -2, y: 87 },    // teal card — drops from above
    { x: -173, y: -33 }, // sparkle 3 — far right, slides in left
  ];
  const hiddenFor = (i: number) => ({
    opacity: 0,
    scale: 0.25,
    x: POCKET[i].x,
    y: POCKET[i].y,
  });
  const shown = { opacity: 1, scale: 1, x: 0, y: 0 };
  const targetFor = (i: number) => (isHovered ? shown : hiddenFor(i));

  const stagger = (i: number) =>
    isHovered ? 0.18 + i * 0.05 : 0.04 * (4 - i);
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
  const tx = (i: number) => ({ duration: 0.46, delay: stagger(i), ease });
  const groupStyle: React.CSSProperties = {
    transformBox: "fill-box" as const,
    transformOrigin: "center",
    willChange: "transform, opacity",
  };

  return (
    <svg
      viewBox="0 0 394 343"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={g0} x1="234.13" y1="101.101" x2="202.934" y2="390.854" gradientUnits="userSpaceOnUse">
          <stop offset="0.59647" stopColor="white" />
          <stop offset="0.962107" stopColor="#B5675B" />
        </linearGradient>
        <linearGradient id={g1} x1="234.13" y1="101.101" x2="202.934" y2="390.854" gradientUnits="userSpaceOnUse">
          <stop offset="0.59647" stopColor="white" />
          <stop offset="0.962107" stopColor="#B5675B" />
        </linearGradient>
      </defs>
      <path d="M106.319 77.6451C107.995 69.0631 115.444 63.6587 122.955 65.574L376.664 130.267C384.176 132.182 388.906 140.692 387.23 149.274L353.255 323.193C351.579 331.775 344.13 337.179 336.619 335.264L82.91 270.571C75.3985 268.656 70.6682 260.146 72.3447 251.564L106.319 77.6451Z" fill={folderBackColor} />
      <path d="M100.042 76.0446C102.492 63.5017 113.378 55.6032 124.356 58.4026L378.065 123.095C389.043 125.895 395.957 138.332 393.507 150.875L359.532 324.793C357.082 337.336 346.196 345.236 335.218 342.436L81.5092 277.743C70.5308 274.943 63.6176 262.506 66.0677 249.963L100.042 76.0446ZM122.955 65.574C115.444 63.6587 107.995 69.0631 106.319 77.6451L72.3447 251.564L72.2706 251.966C70.8166 260.41 75.516 268.686 82.91 270.571L336.619 335.264C344.013 337.15 351.346 331.942 353.173 323.593L353.255 323.193L387.23 149.274C388.88 140.826 384.322 132.448 377.014 130.361L376.664 130.267L122.955 65.574Z" fill="white" />
      <motion.g style={groupStyle} initial={hiddenFor(0)} animate={targetFor(0)} transition={tx(0)}>
      <path d="M94.2655 41.0815C102.294 26.4784 100.64 4.40506 101.415 4.22422C102.191 4.04337 109.538 24.6795 121.311 33.4305C132.879 42.029 151.963 39.9327 152.201 41.2619C152.438 42.5912 132.923 53.326 127.208 66.4343C119.632 83.8108 120.816 101.505 119.912 101.716C119.007 101.927 111.489 78.9455 99.524 70.5123C88.4573 62.7124 71.5157 61.3521 71.2784 60.1352C71.041 58.9183 87.4166 53.5387 94.2655 41.0815Z" fill="#FFE6AC" />
      <path d="M152.201 41.2619C151.963 39.9327 132.879 42.029 121.311 33.4305C109.538 24.6795 102.191 4.04337 101.415 4.22422C100.64 4.41035 102.293 26.4802 94.2655 41.0815L93.9379 41.6606C86.9092 53.7061 71.0447 58.9373 71.2784 60.1352C71.5157 61.3521 88.4573 62.7124 99.524 70.5123C111.396 78.8802 118.89 101.572 119.89 101.717L119.912 101.716C120.802 101.506 119.669 84.3582 126.859 67.2491L127.208 66.4343C132.879 53.4273 152.137 42.7573 152.202 41.2944L152.201 41.2619ZM155.821 40.4178C156.096 41.959 155.566 43.1278 155.366 43.5225C155.12 44.0103 154.838 44.3635 154.675 44.556C154.335 44.9575 153.945 45.3083 153.643 45.5666C153.007 46.1109 152.138 46.7651 151.211 47.4527C149.285 48.8809 146.773 50.6956 144.067 52.8785C138.512 57.3605 132.92 62.7999 130.515 68.3161C126.976 76.4332 125.455 84.6973 124.721 91.064C124.354 94.2445 124.187 96.9048 124.051 98.8879C123.986 99.8286 123.92 100.758 123.83 101.465C123.788 101.791 123.713 102.307 123.561 102.824C123.488 103.072 123.331 103.552 123.022 104.059C122.73 104.537 121.992 105.539 120.651 105.852C118.909 106.258 117.706 105.153 117.501 104.966C117.124 104.621 116.867 104.258 116.745 104.078C116.476 103.682 116.241 103.236 116.067 102.891C115.698 102.161 115.239 101.147 114.744 100.051C113.721 97.7842 112.366 94.7677 110.682 91.4966C107.236 84.8067 102.746 77.7425 97.5844 74.1046C92.5927 70.5863 86.0874 68.4169 80.5212 66.9711C77.7457 66.2502 75.3736 65.7485 73.4936 65.3079C72.6041 65.0995 71.7427 64.8858 71.0731 64.663C70.7566 64.5577 70.3122 64.3953 69.8806 64.1524C69.6686 64.033 69.3113 63.8139 68.9458 63.4563C68.6168 63.1345 67.9272 62.357 67.6729 61.0537C67.3869 59.5875 67.829 58.423 68.134 57.841C68.4347 57.267 68.7877 56.8845 68.9801 56.6908C69.3754 56.2928 69.8046 55.9968 70.0761 55.8185C70.6649 55.4319 71.4499 55.0019 72.2266 54.5819C73.8741 53.6909 76.0022 52.5723 78.3506 51.1146C83.1265 48.1501 88.2341 44.1175 91.1376 38.8365C94.6989 32.3589 96.2183 23.9644 96.8866 16.7973C97.216 13.2651 97.3298 10.1533 97.4089 7.84114C97.4469 6.72823 97.4802 5.68469 97.5321 4.92996C97.5564 4.57576 97.596 4.09298 97.6809 3.63404C97.7188 3.42971 97.8088 2.98059 98.0155 2.48577C98.1107 2.25815 98.8136 0.523384 100.676 0.0888495L100.841 0.0542701C102.533 -0.254709 103.684 0.850833 103.823 0.978199C104.177 1.3042 104.421 1.64354 104.534 1.80693C104.785 2.16961 105.009 2.57637 105.173 2.88637C105.52 3.54409 105.96 4.46292 106.435 5.45164C107.417 7.49918 108.732 10.2397 110.373 13.2421C113.712 19.3517 118.142 26.0401 123.326 29.8931C128.332 33.6144 135.246 35.1694 141.375 35.8727C144.391 36.2188 147.047 36.3446 149.102 36.4725C150.079 36.5334 151.035 36.6004 151.77 36.7127C152.112 36.7651 152.619 36.8565 153.119 37.0485C153.361 37.1415 153.804 37.3327 154.265 37.7072C154.714 38.0721 155.554 38.9233 155.821 40.4178Z" fill="#D59B6E" />
      </motion.g>
      <motion.g style={groupStyle} initial={hiddenFor(1)} animate={targetFor(1)} transition={tx(1)}>
      <path d="M355.972 94.7499C361.427 97.3797 363.983 104.563 361.681 110.795L321.076 220.731C318.774 226.963 312.486 229.883 307.032 227.253L212.124 181.496C206.67 178.866 204.114 171.682 206.416 165.45L247.021 55.5146C249.323 49.2828 255.61 46.3627 261.065 48.9925L355.972 94.7499Z" fill="#5D8EF4" />
      <path d="M214.811 169.498L206.416 165.45L247.021 55.5146L255.416 59.5619L214.811 169.498ZM215.667 171.904L310.575 217.662C311.393 218.056 312.336 217.618 312.681 216.683L353.286 106.748C353.631 105.813 353.248 104.736 352.43 104.341L257.522 58.5836C256.704 58.1892 255.761 58.6273 255.416 59.5619L247.021 55.5146L247.132 55.2252C249.519 49.1931 255.695 46.4038 261.065 48.9925L355.972 94.7499C361.427 97.3797 363.983 104.563 361.681 110.795L321.076 220.731C318.774 226.963 312.486 229.883 307.032 227.253L212.124 181.496L211.87 181.369C206.675 178.685 204.228 171.808 206.312 165.744L206.416 165.45L214.811 169.498C214.466 170.432 214.849 171.51 215.667 171.904Z" fill="white" />
      </motion.g>
      <motion.g style={groupStyle} initial={hiddenFor(2)} animate={targetFor(2)} transition={tx(2)}>
      <path d="M21.3957 172.324C25.7129 155.799 18.9508 135.036 19.6556 134.625C20.3605 134.214 32.2719 151.852 45.6647 156.686C58.8242 161.436 76.722 153.584 77.2621 154.792C77.8022 156.001 61.5116 172.308 59.0738 186.685C55.8421 205.744 61.1259 222.432 60.3036 222.912C59.4813 223.392 46.8567 203.545 33.3531 199.075C20.8635 194.942 4.22079 198.809 3.70716 197.709C3.19352 196.609 17.7129 186.42 21.3957 172.324Z" fill="#FFE6AC" />
      <path d="M77.2621 154.792C76.722 153.584 58.8242 161.436 45.6647 156.686C32.2719 151.852 20.3605 134.214 19.6556 134.625C18.9527 135.041 25.7124 155.801 21.3957 172.324L21.2156 172.982C17.2632 186.737 3.20155 196.626 3.70716 197.709C4.22079 198.809 20.8635 194.942 33.3531 199.075C46.7521 203.51 59.2856 223.085 60.2824 222.92L60.3036 222.912C61.1121 222.437 56.0057 206.26 58.9281 187.577L59.0738 186.685C61.4928 172.419 77.5509 156.253 77.2713 154.823L77.2621 154.792ZM80.5524 152.873C81.1786 154.274 80.9412 155.562 80.8416 156.003C80.7186 156.548 80.5298 156.975 80.4176 157.21C80.1836 157.701 79.8903 158.158 79.6597 158.499C79.1737 159.218 78.4902 160.114 77.7576 161.06C76.2362 163.025 74.241 165.541 72.1448 168.471C67.8412 174.488 63.7262 181.438 62.7003 187.488C61.1907 196.391 61.6606 204.819 62.4434 211.178C62.8344 214.355 63.2968 216.969 63.6298 218.921C63.7879 219.847 63.9419 220.763 64.02 221.472C64.0561 221.799 64.1046 222.319 64.0788 222.863C64.0664 223.125 64.028 223.636 63.8486 224.219C63.6796 224.768 63.2026 225.959 61.9839 226.67C60.4011 227.594 58.983 226.897 58.7417 226.78C58.2973 226.563 57.9646 226.292 57.8048 226.155C57.4534 225.856 57.1221 225.498 56.8738 225.219C56.3476 224.628 55.6678 223.791 54.9346 222.886C53.4177 221.015 51.4063 218.522 49.0172 215.885C44.1312 210.492 38.1504 205.058 32.3252 203.13C26.6917 201.265 19.9156 201.163 14.2136 201.471C11.3705 201.624 8.96736 201.866 7.05277 202.016C6.14688 202.087 5.26677 202.144 4.56946 202.134C4.23984 202.129 3.77357 202.109 3.30086 202.007C3.06859 201.956 2.67305 201.854 2.2371 201.622C1.84475 201.412 0.99834 200.874 0.448116 199.696C-0.170775 198.37 -0.0173667 197.113 0.14019 196.459C0.295591 195.814 0.546138 195.338 0.686205 195.092C0.973947 194.588 1.31817 194.171 1.53807 193.917C2.01487 193.364 2.67062 192.71 3.32068 192.068C4.69952 190.706 6.48819 188.978 8.40969 186.855C12.3175 182.539 16.2949 177.093 17.8561 171.117C19.7711 163.787 19.2698 155.234 18.2357 148.124C17.7261 144.62 17.1073 141.586 16.6421 139.334C16.4182 138.25 16.2059 137.235 16.0792 136.492C16.0197 136.143 15.9448 135.666 15.9193 135.197C15.9079 134.989 15.8894 134.529 15.9728 133.989C16.0112 133.74 16.2823 131.854 17.9752 130.866L18.1264 130.782C19.6841 129.968 21.0521 130.681 21.2155 130.761C21.6336 130.967 21.9476 131.22 22.0949 131.343C22.4219 131.615 22.7325 131.939 22.963 132.187C23.4519 132.715 24.0908 133.466 24.7795 134.274C26.2056 135.946 28.114 138.185 30.3983 140.577C35.0465 145.443 40.8807 150.534 46.7774 152.662C52.4726 154.718 59.4988 154.103 65.5686 152.908C68.5557 152.32 71.145 151.629 73.1547 151.125C74.1109 150.884 75.047 150.657 75.7814 150.541C76.1239 150.486 76.6336 150.42 77.1602 150.452C77.4155 150.468 77.8866 150.517 78.4185 150.736C78.9367 150.951 79.9452 151.514 80.5524 152.873Z" fill="#D59B6E" />
      </motion.g>
      <motion.g style={groupStyle} initial={hiddenFor(3)} animate={targetFor(3)} transition={tx(3)}>
      <path d="M225.834 22.7988C231.749 22.5109 236.748 27.7558 237 34.5136L242.676 186.73C242.928 193.488 238.337 199.2 232.422 199.488L129.503 204.497C123.588 204.785 118.589 199.54 118.337 192.782L112.661 40.5654C112.409 33.8076 117 28.0959 122.915 27.808L225.834 22.7988Z" fill="#96C5C6" />
      <path d="M127.441 192.339L118.337 192.782L112.661 40.5654L121.765 40.1221L127.441 192.339ZM129.116 194.096L232.034 189.087C232.921 189.044 233.61 188.187 233.572 187.174L227.897 34.9565C227.859 33.943 227.109 33.1563 226.222 33.1993L123.303 38.2086C122.416 38.2517 121.727 39.1085 121.765 40.1221L112.661 40.5654L112.654 40.2495C112.554 33.6305 117.093 28.0914 122.915 27.808L225.834 22.7988C231.749 22.5109 236.748 27.7558 237 34.5136L242.676 186.73L242.684 187.046C242.784 193.665 238.244 199.204 232.422 199.488L129.503 204.497L129.226 204.507C123.525 204.619 118.74 199.597 118.353 193.098L118.337 192.782L127.441 192.339C127.479 193.353 128.229 194.14 129.116 194.096Z" fill="white" />
      </motion.g>
      <motion.g style={groupStyle} initial={hiddenFor(4)} animate={targetFor(4)} transition={tx(4)}>
      <path d="M340.926 211.8C355.511 207.361 367.464 189.916 368.139 190.387C368.815 190.859 361.886 211.683 365.285 227.253C368.624 242.552 383.843 255.873 383.225 257.031C382.606 258.189 361.92 250.855 349.919 256.001C334.011 262.823 324.326 276.696 323.538 276.146C322.75 275.597 330.952 252.923 327.223 237.436C323.775 223.111 312.185 208.928 312.737 207.852C313.289 206.777 328.484 215.587 340.926 211.8Z" fill="#FFE6AC" />
      <path d="M383.225 257.031C383.843 255.873 368.624 242.552 365.285 227.253C361.886 211.683 368.815 190.859 368.139 190.387C367.461 189.921 355.509 207.361 340.926 211.8L340.341 211.969C328.012 215.314 313.28 206.794 312.737 207.852C312.185 208.928 323.775 223.111 327.223 237.436C330.923 252.803 322.876 275.246 323.521 276.13L323.538 276.146C324.314 276.686 333.712 263.252 349.178 256.326L349.919 256.001C361.827 250.895 382.286 258.076 383.206 257.056L383.225 257.031ZM386.378 259.231C385.66 260.574 384.575 261.016 384.193 261.15C383.722 261.316 383.306 261.355 383.071 261.369C382.583 261.398 382.088 261.351 381.713 261.305C380.923 261.208 379.897 261.011 378.808 260.792C376.546 260.338 373.626 259.711 370.344 259.203C363.604 258.159 356.267 257.787 351.217 259.952C343.786 263.139 337.745 268.005 333.41 272.093C331.245 274.135 329.536 275.953 328.254 277.298C327.646 277.937 327.043 278.566 326.555 279.012C326.33 279.219 325.968 279.538 325.548 279.797C325.347 279.922 324.946 280.152 324.417 280.282C323.918 280.405 322.78 280.563 321.612 279.749C320.096 278.69 319.874 276.945 319.835 276.648C319.765 276.102 319.793 275.636 319.811 275.41C319.85 274.911 319.944 274.401 320.022 274.013C320.188 273.192 320.457 272.092 320.749 270.905C321.351 268.449 322.159 265.187 322.876 261.481C324.344 253.902 325.27 245.236 323.661 238.555C322.106 232.094 318.638 225.442 315.426 220.051C313.824 217.363 312.387 215.149 311.274 213.363C310.747 212.518 310.244 211.691 309.887 211.007C309.718 210.683 309.489 210.218 309.318 209.705C309.234 209.452 309.103 209.014 309.049 208.467C309 207.976 308.959 206.87 309.55 205.718C310.215 204.422 311.233 203.914 311.804 203.725C312.366 203.539 312.853 203.534 313.109 203.542C313.636 203.558 314.126 203.676 314.431 203.757C315.093 203.932 315.924 204.228 316.743 204.526C318.48 205.156 320.705 205.994 323.293 206.755C328.557 208.303 334.7 209.327 339.975 207.722C346.445 205.753 352.563 200.791 357.326 196.065C359.674 193.736 361.613 191.547 363.05 189.916C363.741 189.131 364.388 188.393 364.876 187.881C365.105 187.641 365.422 187.318 365.758 187.048C365.907 186.928 366.241 186.67 366.688 186.468C366.893 186.376 368.442 185.653 370.064 186.785L370.206 186.888C371.629 187.979 371.812 189.684 371.837 189.886C371.902 190.4 371.878 190.838 371.864 191.046C371.831 191.507 371.752 191.979 371.687 192.333C371.55 193.085 371.324 194.1 371.081 195.193C370.579 197.457 369.907 200.486 369.318 203.961C368.119 211.033 367.373 219.377 368.869 226.232C370.314 232.853 374.448 239.373 378.514 244.659C380.515 247.26 382.385 249.42 383.812 251.113C384.492 251.919 385.151 252.711 385.622 253.366C385.841 253.671 386.158 254.132 386.409 254.662C386.531 254.919 386.741 255.403 386.855 256.036C386.966 256.653 387.073 257.93 386.378 259.231Z" fill="#D59B6E" />
      </motion.g>
      <path d="M25.9783 107.967C23.2959 93.2703 23.0305 92.6579 31.3391 94.1888L314.068 153.685C321.575 155.482 325.592 162.601 325.592 173.794L346.853 323.576C345.178 331.628 337.734 336.699 330.227 334.902L76.6714 274.204C67.249 271.468 62.6306 268.598 60.1541 255.671L25.9783 107.967Z" fill={folderColor} />
      <path d="M25.9783 107.967C23.2959 93.2703 23.0305 92.6579 31.3391 94.1888L314.068 153.685C321.575 155.482 325.592 162.601 325.592 173.794L346.853 323.576C345.178 331.628 337.734 336.699 330.227 334.902L76.6714 274.204C67.249 271.468 62.6306 268.598 60.1541 255.671L25.9783 107.967Z" fill={`url(#${g0})`} style={{ mixBlendMode: "multiply" }} />
      <path d="M69.6582 90.2099C69.3903 87.3367 69.3869 82.8337 71.5341 83.1686L168.09 104.273C170.237 104.607 172.274 108.007 172.274 112.891L177.912 173.794C177.626 176.31 177.362 181.885 175.215 181.55L88.1935 160.867C86.0464 160.532 83.4954 156.201 83.7812 153.685L69.6582 90.2099Z" fill={folderColor} />
      <path d="M69.6582 90.2099C69.3903 87.3367 69.3869 82.8337 71.5341 83.1686L168.09 104.273C170.237 104.607 172.274 108.007 172.274 112.891L177.912 173.794C177.626 176.31 177.362 181.885 175.215 181.55L88.1935 160.867C86.0464 160.532 83.4954 156.201 83.7812 153.685L69.6582 90.2099Z" fill={`url(#${g1})`} style={{ mixBlendMode: "multiply" }} />
      <path d="M65.2975 79.1008C66.8693 76.8815 69.3399 75.522 72.1324 75.8507L72.4037 75.8877L72.5743 75.9141L72.7423 75.9511L169.226 97.0381C172.788 97.712 175.195 100.568 176.524 103.136C177.907 105.809 178.64 109.04 178.7 112.438L179.199 117.831L315.234 146.458L315.31 146.474L315.387 146.493C320.72 147.77 325.107 151.076 328.033 156.202C330.771 161 331.948 166.883 332.019 173.175L353.408 323.848L353.111 325.276C350.554 337.566 339.495 344.629 328.908 342.094L75.3524 281.396L75.2194 281.364L75.0872 281.326C70.317 279.941 65.4436 278.21 61.5418 274.259C57.5011 270.167 55.292 264.559 53.9059 257.421L19.7168 109.657L19.6818 109.467C19.0337 105.917 18.4606 102.846 18.1532 100.475C17.9969 99.269 17.8743 97.992 17.8735 96.7506C17.8727 95.5553 17.9792 93.9181 18.5746 92.2366C19.2451 90.343 20.4382 88.6791 22.1418 87.589C23.6667 86.6134 25.1924 86.362 26.2532 86.2929C28.1974 86.1663 30.4922 86.5894 32.3631 86.9341L32.4339 86.9468L32.5038 86.9624L63.7621 93.5395L63.3109 91.5106L63.2623 90.9882C63.1099 89.3536 62.9593 86.6566 63.3663 84.1469C63.5587 82.9614 64.0074 80.9223 65.2975 79.1008ZM71.5341 83.1686C69.3869 82.8337 69.3903 87.3367 69.6582 90.2099L72.4685 102.843L31.3391 94.1888C23.0305 92.6579 23.2959 93.2703 25.9783 107.967L60.1541 255.671C62.6306 268.598 67.249 271.468 76.6714 274.204L330.227 334.902C337.617 336.671 344.946 331.785 346.771 323.951L346.853 323.576L325.592 173.794C325.592 162.776 321.7 155.705 314.418 153.773L314.068 153.685L173.307 124.063L172.274 112.891C172.274 108.007 170.237 104.607 168.09 104.273L71.5341 83.1686Z" fill="white" />
    </svg>
  );
}

/* The closed-folder silhouette path (origin viewBox 0 0 376 304).
   Extracted as a const so the big carousel folder AND the tracker mini
   folders share exactly the same shape — only color and size differ. */
const CLOSED_FOLDER_PATH =
  "M87.9238 10.4043C88.9573 5.77375 93.5492 2.85743 98.1797 3.89062L202.987 27.2822C207.618 28.3157 210.534 32.9074 209.501 37.5381L206.046 53.0146L356.962 86.6973C367.546 89.0596 374.212 99.5544 371.85 110.139L332.953 284.419C330.591 295.003 320.095 301.669 309.511 299.307L19.0439 234.479C8.45952 232.117 1.79398 221.622 4.15625 211.037L43.0527 36.7568C45.415 26.1724 55.9107 19.5069 66.4951 21.8691L84.4697 25.8799L87.9238 10.4043Z";

function ClosedFolder({
  uniqueId,
  fillColor = "#FFDA85",
}: {
  uniqueId: string;
  fillColor?: string;
}) {
  const g = `${uniqueId}-cf-g0`;
  return (
    <svg
      viewBox="0 0 376 304"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={g} x1="242.386" y1="27.922" x2="205.874" y2="359.592" gradientUnits="userSpaceOnUse">
          <stop offset="0.59647" stopColor="white" />
          <stop offset="0.962107" stopColor="#B5675B" />
        </linearGradient>
      </defs>
      <path d={CLOSED_FOLDER_PATH} fill={fillColor} />
      <path d={CLOSED_FOLDER_PATH} fill={`url(#${g})`} style={{ mixBlendMode: "multiply" }} />
      <path d={CLOSED_FOLDER_PATH} stroke="white" strokeWidth="7.36362" fill="none" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   MiniFolder — the tiny folder icons in the top-right tracker. Mirrors
   the big folder geometry in miniature.
   ────────────────────────────────────────────────────────────────────── */
/* MiniFolder — uses the same closed-folder silhouette as the carousel,
   sized down for the top-right tracker. The fill comes from the
   project's paint palette so each tracker entry reads as its project's
   color identity (yellow / terracotta / plum / teal / cornflower). */
function MiniFolder({
  paint,
  active,
}: {
  paint: FolderPaint;
  active: boolean;
}) {
  const reactId = useId();
  const fill = active ? paint.frontBright : paint.frontDim;
  const gId = `mf-${reactId.replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 376 304"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient
          id={gId}
          x1="242.386"
          y1="27.922"
          x2="205.874"
          y2="359.592"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.59647" stopColor="white" />
          <stop offset="0.962107" stopColor="#B5675B" />
        </linearGradient>
      </defs>
      <path d={CLOSED_FOLDER_PATH} fill={fill} />
      <path
        d={CLOSED_FOLDER_PATH}
        fill={`url(#${gId})`}
        style={{ mixBlendMode: "multiply" }}
      />
      {/* Slightly thinner outline at small size so the silhouette
          stays crisp without the stroke dominating the icon. */}
      <path
        d={CLOSED_FOLDER_PATH}
        stroke="white"
        strokeWidth="10"
        fill="none"
      />
    </svg>
  );
}
