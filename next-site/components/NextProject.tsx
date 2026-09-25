"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * NextProject — "next case study" connector at the bottom of every case
 * page, plus an optional handwritten side note from Kathleen.
 *
 * Order matches the Work section on the home page (ProjectsV2's PROJECTS)
 * and wraps around, so the last case links back to the first. If you
 * reorder the home page, reorder CASES here too.
 *
 * The note is for context that doesn't belong in the case study itself —
 * e.g. "I did this project while I was working on inline…". Pass it via
 * the `note` prop on each page; it sits on the same line as the "Next
 * project" label (wrapping under it when long). With no note, nothing
 * renders there in production; in `npm run dev` a dashed placeholder
 * marks the spot.
 *
 * Each element also has its own parallax speed (SmoothScroll.tsx,
 * relativeToPageEnd) so the row assembles as the page slides off it.
 *
 * Layout mirrors the case cover: the cover is pinned at the TOP while the
 * case body scrolls up over it; this footer is pinned at the BOTTOM on the
 * same dark surface, and the body scrolls up off it to reveal it.
 */

type Slug = "inline" | "ai-journey-agent" | "researchhub" | "frogslayer";

const CASES: {
  slug: Slug;
  title: string;
  meta: string;
  poster: string;
}[] = [
  {
    slug: "inline",
    title: "Designing Features For A B2B2C Consumer App",
    meta: "inline · Summer 2026 · Product Design Intern",
    poster: "/img/cover/inline-poster.webp",
  },
  {
    slug: "ai-journey-agent",
    title: "Conceptualizing an AI Maintenance Agent for Customer Journey Maps",
    meta: "Customer Journey Platform · Spring 2026 · UX Designer & Researcher",
    poster: "/img/cover/Ai_Agent-poster.webp",
  },
  {
    slug: "researchhub",
    title: "Expanding Upon a Research Platform Connecting Students with Faculty Research",
    meta: "Purdue Stack · Spring 2026 · Design Engineer",
    poster: "/img/cover/ResearchHub-poster.webp",
  },
  {
    slug: "frogslayer",
    title: "Kiosk Interface Design Guidelines",
    meta: "Frogslayer · Fall 2025 · UX Designer & Researcher",
    poster: "/img/cover/Frogslayer-poster.webp",
  },
];

type Props = {
  /** Slug of the page this footer sits on. */
  current: Slug;
  /** Optional side note shown beside the next-project card. */
  note?: React.ReactNode;
};

export default function NextProject({ current, note }: Props) {
  const i = CASES.findIndex((c) => c.slug === current);
  const next = CASES[(i + 1) % CASES.length];
  const href = `/projects/${next.slug}`;
  const showPlaceholder = !note && process.env.NODE_ENV === "development";

  /* The footer is pinned to the viewport bottom for the whole page (that's
     what lets the body slide off it at the end), so without this it would
     sit on top of the case cover while the reader is at the top. Keep it
     hidden until the end of the case body — the sentinel just above the
     footer — has actually scrolled into view. */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const nav = navRef.current;
    if (!sentinel || !nav) return;
    const update = () => {
      const reached = sentinel.getBoundingClientRect().top < window.innerHeight;
      nav.classList.toggle("is-covered", !reached);
    };
    update();
    const io = new IntersectionObserver(update, { threshold: [0, 1] });
    io.observe(sentinel);
    window.addEventListener("resize", update);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
    <div ref={sentinelRef} className="next-case__sentinel" aria-hidden="true" />
    <nav ref={navRef} className="next-case" aria-label="Next case study">
      <div className="next-case__inner">
        <div className="next-case__card">
          {/* Image duplicates the title link, so it's hidden from AT and
              skipped by Tab. */}
          <Link href={href} className="next-case__media" tabIndex={-1} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={next.poster} alt="" loading="lazy" decoding="async" />
          </Link>
          <div className="next-case__text">
            {/* Label and side note share one line; a long note wraps
                under the label. */}
            <div className="next-case__head">
              <span className="next-case__eyebrow">Next project</span>
              {note ? (
                <span className="next-case__note">
                  <span className="visually-hidden">Side note: </span>
                  {note}
                </span>
              ) : showPlaceholder ? (
                <span className="next-case__note is-placeholder" aria-hidden="true">
                  Side note goes here (dev only): add note=&#123;&lt;&gt;…&lt;/&gt;&#125; to
                  &lt;NextProject current=&quot;{current}&quot; /&gt;
                </span>
              ) : null}
            </div>
            <Link href={href} className="next-case__title">
              {next.title}
            </Link>
            <span className="next-case__meta">{next.meta}</span>

            <Link href={href} className="next-case__cta" tabIndex={-1} aria-hidden="true">
              Read case study <span className="next-case__arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
