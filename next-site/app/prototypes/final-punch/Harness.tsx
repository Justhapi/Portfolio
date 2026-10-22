"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const VARIANTS = ["Before", "Showcase", "Breakout"] as const;
const SKINS = [null, "showcase", "breakout"] as const;
const PROJECTS = [
  { key: "rh", label: "ResearchHub" },
  { key: "jt", label: "JourneyTrack" },
] as const;

export default function Harness() {
  const [current, setCurrent] = useState(1);
  const [project, setProject] = useState(0);
  const pickerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const ready = useRef(false);

  useEffect(() => {
    if (ready.current) return;
    const q = new URLSearchParams(location.search);
    const v = parseInt(q.get("v") ?? "", 10);
    if (v >= 1 && v <= VARIANTS.length) setCurrent(v - 1);
    const p = PROJECTS.findIndex((x) => x.key === q.get("p"));
    if (p >= 0) setProject(p);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", "")),
    );
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const html = document.documentElement;
    html.setAttribute("data-fp", `${PROJECTS[project].key}-${current === 0 ? 1 : 2}`);
    const skin = SKINS[current];
    if (skin) html.setAttribute("data-skin", skin);
    else html.removeAttribute("data-skin");
    const url = new URL(location.href);
    url.searchParams.set("v", String(current + 1));
    url.searchParams.set("p", PROJECTS[project].key);
    history.replaceState(null, "", url);
  }, [current, project]);

  const setActive = (i: number) => {
    if (i < 0 || i >= VARIANTS.length) return;
    setCurrent(i);
  };

  useLayoutEffect(() => {
    const move = () => {
      const el = itemRefs.current[current];
      const hl = highlightRef.current;
      if (!el || !hl) return;
      hl.style.width = `${el.offsetWidth}px`;
      hl.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) setActive(num - 1);
      else if (e.key === "ArrowRight") setActive((current + 1) % VARIANTS.length);
      else if (e.key === "ArrowLeft") setActive((current - 1 + VARIANTS.length) % VARIANTS.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current]);

  return (
    <>
      <div className="fp-tabs" role="tablist" aria-label="Project">
        {PROJECTS.map((p, i) => (
          <button key={p.key} role="tab" aria-selected={i === project} data-active={i === project ? "" : undefined} onClick={() => setProject(i)}>
            {p.label}
          </button>
        ))}
      </div>
      <nav className="proto-picker" aria-label="Prototype variants" ref={pickerRef}>
        <span className="proto-picker-highlight" aria-hidden="true" ref={highlightRef} />
        {VARIANTS.map((name, i) => (
          <button
            key={name}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="proto-picker-item"
            data-active={i === current ? "" : undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={() => setActive(i)}
          >
            {name}
          </button>
        ))}
      </nav>
    </>
  );
}
