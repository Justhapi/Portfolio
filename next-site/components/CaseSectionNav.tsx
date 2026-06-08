"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Section = { id: string; label: string };

export default function CaseSectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [scrolled, setScrolled] = useState(false);

  // sliding highlight
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [hl, setHl] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false });

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 40);
      // section is "active" when its top crosses the upper third of the viewport
      const probeY = window.innerHeight * 0.3;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY) current = s.id;
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
  }, [sections]);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const measure = () => {
      const el = pill.querySelector<HTMLElement>(".case-nav-link.active");
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
      // Keep the active link visible inside the (possibly horizontally
      // scrollable) pill — when the user scrolls the page and the
      // active section changes, the pill auto-scrolls so the active
      // label is in view. Critical for case studies with many sections
      // (e.g. Frogslayer's 6) where the pill is wider than the
      // viewport. Centred so the active label sits in the middle of
      // the visible pill area, with neighbours visible on either side.
      const pillRect = pill.getBoundingClientRect();
      const linkRect = el.getBoundingClientRect();
      // Only scroll if the link is outside the visible area
      if (linkRect.left < pillRect.left || linkRect.right > pillRect.right) {
        const targetLeft =
          el.offsetLeft - pill.clientWidth / 2 + el.offsetWidth / 2;
        pill.scrollTo({ left: targetLeft, behavior: "smooth" });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // ── Overflow-edge affordance ──────────────────────────────────────────
  // When the nav pill has content scrolled off either edge, that edge's
  // corner radius collapses from the full pill curve (999px) to a sharp
  // 10px corner, signaling visually that more sections exist past the
  // cut-off. The opposite edge stays fully rounded. Implemented via
  // direct DOM class toggling on every scroll event (no React re-render)
  // because the scroll handler fires at frame rate.
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const updateOverflow = () => {
      // 4px fudge prevents flicker at the exact scroll boundary
      const hasOverflowLeft = pill.scrollLeft > 4;
      const hasOverflowRight =
        pill.scrollLeft < pill.scrollWidth - pill.clientWidth - 4;
      pill.classList.toggle("has-overflow-left", hasOverflowLeft);
      pill.classList.toggle("has-overflow-right", hasOverflowRight);
    };
    updateOverflow();
    pill.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", updateOverflow);
    return () => {
      pill.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", updateOverflow);
    };
  }, [sections]);

  return (
    <nav className={`case-nav ${scrolled ? "scrolled" : ""}`} aria-label="Section navigation">
      <div className="case-nav-inner">
        <Link href="/#work" className="case-back">
          <span className="arrow">←</span>
          <span>Back to projects</span>
        </Link>
        <div className="case-nav-pill" ref={pillRef}>
          <span
            className="case-nav-pill-highlight"
            aria-hidden="true"
            style={{
              transform: `translate(${hl.x}px, ${hl.y}px)`,
              width: hl.w,
              height: hl.h,
              opacity: hl.visible ? 1 : 0,
            }}
          />
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`case-nav-link ${active === s.id ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(s.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
