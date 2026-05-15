"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: ring + dot, fixed-position, uses mix-blend-mode: difference
 * so it auto-contrasts against any background (white on dark, dark on light).
 *
 * Only renders on fine-pointer devices (mouse/trackpad). Touch devices get
 * the native cursor.
 */
export default function CursorFollower() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({
    visible: false,
    hovering: false,
    pressed: false,
    onPolaroid: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    // mark <html> so we can hide the native cursor only when this is mounted
    document.documentElement.classList.add("has-custom-cursor");

    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      // schedule the position write on next frame so we batch w/ react renders
      if (!raf) {
        raf = requestAnimationFrame(() => {
          wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          raf = 0;
        });
      }
      const target = e.target as HTMLElement | null;
      const onPolaroid = !!target?.closest("[data-cursor='polaroid']");
      const onInteractive =
        onPolaroid ||
        !!target?.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor='hover']",
        );
      setState((s) =>
        s.visible && s.hovering === onInteractive && s.onPolaroid === onPolaroid
          ? s
          : { ...s, visible: true, hovering: onInteractive, onPolaroid },
      );
    };
    const onDown = () => setState((s) => ({ ...s, pressed: true }));
    const onUp = () => setState((s) => ({ ...s, pressed: false }));
    const onEnter = () => setState((s) => ({ ...s, visible: true }));
    const onLeave = () => setState((s) => ({ ...s, visible: false }));

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={[
        "cursor-pos",
        state.visible ? "is-visible" : "",
        state.hovering ? "is-hovering" : "",
        state.pressed ? "is-pressed" : "",
        state.onPolaroid ? "is-on-polaroid" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="cursor-fx">
        <span className="cursor-ring" />
        <span className="cursor-dot" />
      </div>
    </div>
  );
}
