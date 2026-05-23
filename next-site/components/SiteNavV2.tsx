"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SECTIONS = ["hero", "work", "about", "connect"] as const;
type SectionId = (typeof SECTIONS)[number];

const LABELS: Record<SectionId, string> = {
  hero: "Index",
  work: "Work",
  about: "About",
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

/** Hamburger / close icon for the mobile menu toggle. */
const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`nav-menu-icon${open ? " is-open" : ""}`}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {/* Top bar → becomes top arm of X */}
    <line
      className="bar bar-1"
      x1="3" y1="5.5" x2="17" y2="5.5"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    />
    {/* Middle bar → fades out when open */}
    <line
      className="bar bar-2"
      x1="3" y1="10" x2="17" y2="10"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    />
    {/* Bottom bar → becomes bottom arm of X */}
    <line
      className="bar bar-3"
      x1="3" y1="14.5" x2="17" y2="14.5"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    />
  </svg>
);

export default function SiteNavV2() {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  // sliding highlight — measure the active link and translate to it.
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [hl, setHl] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false });

  // Close on Escape, scroll, or outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onScroll = () => setMenuOpen(false);
    const onOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [menuOpen]);

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
    <nav
      className={`nav${menuOpen ? " is-menu-open" : ""}`}
      aria-label="Section navigation"
      ref={navRef}
    >
      <div className="nav-inner">
        <a
          className="nav-mark"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("hero");
            setMenuOpen(false);
          }}
        >
          <span>
            <em style={{ fontStyle: "italic" }}>Kathleen</em>&nbsp;Li
          </span>
        </a>

        {/* Desktop pill — hidden on mobile unless menu is open */}
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
                setMenuOpen(false);
              }}
            >
              <NavSpark />
              <span className="nav-link-label">{LABELS[id]}</span>
            </a>
          ))}
        </div>

        {/* Mobile menu toggle — only shown on narrow viewports */}
        <button
          type="button"
          className={`nav-menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
    </nav>
  );
}
