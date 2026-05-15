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
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

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
