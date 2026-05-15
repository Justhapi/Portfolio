"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SECTIONS = ["hero", "work", "about", "learnings", "connect"] as const;
type SectionId = (typeof SECTIONS)[number];

const LABELS: Record<SectionId, string> = {
  hero: "Index",
  work: "Work",
  about: "About",
  learnings: "Learnings",
  connect: "Connect",
};

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const update = () => {
      const probeY = window.innerHeight * 0.35;
      let current: SectionId = "hero";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** 4-pointed sparkle SVG used as the bullet on each nav option. */
const NavSpark = () => (
  <svg
    className="nav-spark"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
  </svg>
);

export default function SiteNavV2() {
  const active = useActiveSection();

  // sliding highlight — measure the active link and translate to it.
  // Uses ResizeObserver so the pill re-measures when its layout changes
  // (e.g., the gap shrinks when transitioning from hero → out-of-hero).
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [hl, setHl] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false });

  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const measure = () => {
      const el = pill.querySelector<HTMLElement>(".nav-link.active");
      if (!el) {
        setHl((s) => ({ ...s, visible: false }));
        return;
      }
      setHl({
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight,
        visible: true,
      });
    };
    measure();

    // re-measure on pill resize (catches body.on-paper layout flip)
    const ro = new ResizeObserver(measure);
    ro.observe(pill);
    pill.querySelectorAll<HTMLElement>(".nav-link").forEach((el) => ro.observe(el));

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <nav className="nav" aria-label="Section navigation">
      <div className="nav-inner">
        <a
          className="nav-mark"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("hero");
          }}
        >
          <span>
            <em style={{ fontStyle: "italic" }}>Kathleen</em>&nbsp;Li
          </span>
        </a>
        <div className="nav-pill" ref={pillRef}>
          <span
            className="nav-pill-highlight"
            aria-hidden="true"
            style={{
              transform: `translate(${hl.x}px, ${hl.y}px)`,
              width: hl.w,
              height: hl.h,
              opacity: hl.visible ? 1 : 0,
            }}
          />
          {SECTIONS.slice(1).map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${active === id ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo(id);
              }}
            >
              <NavSpark />
              <span className="nav-link-label">{LABELS[id]}</span>
            </a>
          ))}
        </div>
        {/* nav-status (CT clock) removed */}
      </div>
    </nav>
  );
}
