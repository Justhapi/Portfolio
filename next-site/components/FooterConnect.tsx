"use client";

import * as React from "react";

/**
 * Connect With Me — animated footer
 * Inspired by the League of Legends Ready Check UI:
 * rotating light rays, breathing glow, and drifting bokeh sparkles
 * layered over a painterly slate-blue horizon. Ported from a Framer
 * code component into Next.js (props replace addPropertyControls).
 */

type Sparkle = {
  size: number;
  left: number;
  bottom: number;
  dur: number;
  delay: number;
  dx: number;
  opacity: number;
  big: boolean;
  blue: boolean;
};

type CustomCSSProperties = React.CSSProperties & {
  "--dx"?: string;
  "--o"?: string;
};

export type FooterConnectProps = {
  email?: string;
  linkedInUrl?: string;
  resumeUrl?: string;
  mindSpaceUrl?: string;
  headline?: string;
  subtitle?: string;
  mindSpaceLabel?: string;
  copyright?: string;
  sparkleCount?: number;
  animate?: boolean;
};

export default function FooterConnect({
  email = "kathleenli0424@gmail.com",
  linkedInUrl = "https://www.linkedin.com/in/kathleen-li-564a13328/",
  resumeUrl = "",
  mindSpaceUrl = "",
  headline = "Connect With Me",
  subtitle = "Always down to chat, swap notes, or build something weird together.",
  mindSpaceLabel = "Mind Space",
  copyright = "Designed & built by Kathleen · West Lafayette, IN · 2026",
  sparkleCount = 16,
  animate = true,
}: FooterConnectProps) {
  const [copied, setCopied] = React.useState(false);
  const rawId = React.useId();
  const uid = rawId.replace(/[^a-zA-Z0-9-_]/g, "");
  const cls = (name: string) => `fc-${uid}-${name}`;
  const headingId = `${uid}-connect`;

  const sparkles = React.useMemo<Sparkle[]>(() => {
    const list: Sparkle[] = [];
    const count = Math.max(0, Math.min(80, sparkleCount));
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const big = r > 0.85;
      const blue = r < 0.22;
      const size = big ? 6 + Math.random() * 6 : 2 + Math.random() * 3;
      list.push({
        size,
        left: Math.random() * 100,
        bottom: -30 + Math.random() * 40,
        dur: 7 + Math.random() * 11,
        delay: -Math.random() * 16,
        dx: Math.random() * 90 - 45,
        opacity: 0.2 + Math.random() * 0.25,
        big,
        blue,
      });
    }
    return list;
  }, [sparkleCount]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
    setCopied(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setCopied(true)));
    window.setTimeout(() => setCopied(false), 1500);
  };

  const SparkleBullet = (
    <svg className={cls("bullet")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 1.5 L13.6 9.8 L22 12 L13.6 14.2 L12 22.5 L10.4 14.2 L2 12 L10.4 9.8 Z"
        fill="currentColor"
      />
    </svg>
  );

  const Link = ({ href, children }: { href?: string; children: React.ReactNode }) =>
    href ? (
      <a className={cls("link")} href={href} target="_blank" rel="noopener noreferrer">
        {SparkleBullet}
        {children}
      </a>
    ) : (
      <span className={cls("link") + " " + cls("linkDisabled")} aria-disabled="true">
        {SparkleBullet}
        {children}
      </span>
    );

  return (
    <footer className={cls("root")} aria-labelledby={headingId}>
      <style>{`
        .${cls("root")} {
          position: relative;
          width: 100%;
          min-height: 400px;
          overflow: hidden;
          isolation: isolate;
          color: white;
          font-family: 'Sora', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        /* Painterly slate-blue horizon — fades from transparent at top so it
           blends into the page gradient, then deepens through the footer. */
        .${cls("root")}::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -4;
          background:
            linear-gradient(180deg,
              rgba(61, 93, 130, 0) 0%,
              rgba(93, 130, 166, 0.55) 12%,
              #5d82a6 30%,
              #3d5d82 58%,
              #253c5e 100%);
        }
        .${cls("mist")} {
          position: absolute;
          top: -2px; left: 0; right: 0;
          height: 72px;
          z-index: -3;
          pointer-events: none;
          filter: blur(8px);
          background:
            radial-gradient(120% 80% at 20% 100%, rgba(255,255,255,0.45), transparent 60%),
            radial-gradient(120% 80% at 70% 100%, rgba(255,255,255,0.35), transparent 55%),
            radial-gradient(90% 70% at 92% 100%, rgba(255,255,255,0.32), transparent 60%);
        }
        .${cls("rays")} {
          position: absolute;
          left: 50%;
          bottom: -60%;
          width: 200%;
          aspect-ratio: 1 / 1;
          transform: translateX(-50%);
          z-index: -2;
          pointer-events: none;
          mask: radial-gradient(circle at 50% 60%, black 12%, rgba(0,0,0,0.85) 35%, transparent 78%);
          -webkit-mask: radial-gradient(circle at 50% 60%, black 12%, rgba(0,0,0,0.85) 35%, transparent 78%);
        }
        .${cls("ray-a")},
        .${cls("ray-b")} {
          position: absolute; inset: 0;
          transform-origin: 50% 50%;
        }
        .${cls("ray-a")} {
          background: conic-gradient(from 0deg,
            transparent 0deg,
            rgba(230, 240, 255, 0.16) 6deg,
            transparent 20deg,
            transparent 54deg,
            rgba(210, 226, 245, 0.11) 62deg,
            transparent 78deg,
            transparent 132deg,
            rgba(230, 240, 255, 0.14) 140deg,
            transparent 156deg,
            transparent 218deg,
            rgba(210, 226, 245, 0.10) 226deg,
            transparent 244deg,
            transparent 306deg,
            rgba(230, 240, 255, 0.15) 314deg,
            transparent 332deg);
          filter: blur(2px);
          ${animate ? `animation: ${cls("rayRot")} 90s linear infinite;` : ""}
        }
        .${cls("ray-b")} {
          background: conic-gradient(from 180deg,
            transparent 0deg,
            rgba(180, 210, 236, 0.20) 4deg,
            transparent 16deg,
            transparent 88deg,
            rgba(245, 232, 195, 0.10) 96deg,
            transparent 112deg,
            transparent 200deg,
            rgba(180, 210, 236, 0.16) 210deg,
            transparent 225deg,
            transparent 290deg,
            rgba(245, 232, 195, 0.10) 298deg,
            transparent 312deg);
          filter: blur(4px);
          opacity: 0.9;
          ${animate ? `animation: ${cls("rayRotRev")} 140s linear infinite;` : ""}
        }
        @keyframes ${cls("rayRot")} {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ${cls("rayRotRev")} {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        .${cls("glow")} {
          position: absolute;
          left: 50%;
          bottom: -30%;
          width: 110%;
          aspect-ratio: 1.7 / 1;
          transform: translateX(-50%);
          z-index: -1;
          pointer-events: none;
          filter: blur(2px);
          background: radial-gradient(ellipse at center,
            rgba(210, 228, 245, 0.22) 0%,
            rgba(180, 210, 236, 0.12) 28%,
            rgba(180, 210, 236, 0.0) 62%);
          ${animate ? `animation: ${cls("breathe")} 7.5s ease-in-out infinite;` : ""}
        }
        @keyframes ${cls("breathe")} {
          0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1); }
          50%      { opacity: 1;    transform: translateX(-50%) scale(1.08); }
        }
        .${cls("sparkles")} {
          position: absolute; inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .${cls("sparkle")} {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          will-change: transform, opacity;
          background: radial-gradient(circle,
            rgba(240, 248, 255, 0.95) 0%,
            rgba(240, 248, 255, 0.35) 40%,
            rgba(240, 248, 255, 0) 75%);
          ${animate ? `animation: ${cls("floatUp")} linear infinite;` : ""}
        }
        .${cls("sparkle")}.${cls("big")} {
          background: radial-gradient(circle,
            rgba(230, 240, 252, 0.8) 0%,
            rgba(230, 240, 252, 0.25) 45%,
            rgba(230, 240, 252, 0) 78%);
          filter: blur(1.5px);
        }
        .${cls("sparkle")}.${cls("blue")} {
          background: radial-gradient(circle,
            rgba(180, 210, 236, 0.9) 0%,
            rgba(180, 210, 236, 0.3) 45%,
            rgba(180, 210, 236, 0) 78%);
        }
        @keyframes ${cls("floatUp")} {
          0%   { transform: translate(0, 20px) scale(0.8); opacity: 0; }
          12%  { opacity: var(--o, 0.45); }
          88%  { opacity: var(--o, 0.45); }
          100% { transform: translate(var(--dx, 30px), -160px) scale(1); opacity: 0; }
        }
        .${cls("grain")} {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.06;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        .${cls("content")} {
          position: relative;
          z-index: 3;
          max-width: 1280px;
          margin: 0 auto;
          padding: 88px 56px 48px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .${cls("linksRow")} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 48px;
          width: 100%;
        }
        .${cls("left")} {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .${cls("heading")} {
          font-family: 'Caveat', cursive;
          font-size: 56px;
          font-weight: 600;
          color: #f2c75b;
          letter-spacing: 0.01em;
          line-height: 0.95;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 28px rgba(242,199,91,0.28);
        }
        .${cls("kicker")} {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 500;
          color: rgba(252, 246, 232, 0.72);
          letter-spacing: 0.01em;
          line-height: 1;
          margin: 0 0 14px 0;
          font-style: italic;
        }
        /* Tiny horizontal mark before the kicker — reads as a
           hand-drawn dash, the kind of mark you'd scribble before
           a margin note. Sized to feel light but intentional. */
        .${cls("kicker")}::before {
          content: "";
          display: inline-block;
          width: 22px;
          height: 1.5px;
          background: currentColor;
          opacity: 0.55;
          border-radius: 2px;
        }
        .${cls("subtitle")} {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 500;
          color: white;
          opacity: 0.8;
          letter-spacing: 0.01em;
          line-height: 1.25;
          max-width: 38ch;
          margin: 0 0 72px 0;
        }
        .${cls("links")} {
          display: flex;
          gap: 12px 40px;
          flex-wrap: wrap;
          align-items: center;
          margin: 0 0 6px 0;
        }
        .${cls("link")} {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-height: 44px;
          color: white;
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'Caveat', cursive;
          font-size: 30px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 4px 2px;
          position: relative;
          border-radius: 6px;
          transition:
            transform 220ms cubic-bezier(.2,.7,.2,1),
            color 220ms ease,
            opacity 220ms ease;
        }
        .${cls("link")}::after {
          content: "";
          position: absolute;
          left: 26px;
          right: 2px;
          bottom: 4px;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 280ms cubic-bezier(.2,.7,.2,1);
          opacity: 0.7;
        }
        @media (hover: hover) {
          .${cls("link")}:not(.${cls("linkDisabled")}):hover {
            color: #f7dc8e;
            transform: translateY(-2px);
          }
          .${cls("link")}:not(.${cls("linkDisabled")}):hover::after {
            transform: scaleX(1);
          }
          .${cls("link")}:not(.${cls("linkDisabled")}):hover .${cls("bullet")} {
            animation: ${cls("spin")} 1.6s cubic-bezier(.5,0,.3,1) infinite;
            filter: drop-shadow(0 0 10px rgba(247,220,142,0.75));
          }
        }
        .${cls("link")}:focus-visible {
          outline: 2px solid rgba(247,220,142,0.95);
          outline-offset: 4px;
          color: #f7dc8e;
        }
        .${cls("link")}:focus-visible::after { transform: scaleX(1); }
        .${cls("link")}:focus-visible .${cls("bullet")} {
          animation: ${cls("spin")} 1.6s cubic-bezier(.5,0,.3,1) infinite;
          filter: drop-shadow(0 0 10px rgba(247,220,142,0.75));
        }
        .${cls("link")}:active:not(.${cls("linkDisabled")}) {
          transform: translateY(-1px) scale(0.985);
          transition-duration: 90ms;
        }
        .${cls("linkDisabled")} {
          cursor: default;
          opacity: 0.55;
        }
        .${cls("bullet")} {
          width: 16px; height: 16px;
          flex-shrink: 0;
          color: white;
          filter: drop-shadow(0 0 6px rgba(220,235,250,0.5));
          transition: filter 220ms ease;
        }
        @keyframes ${cls("spin")} {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .${cls("emailLine")} {
          display: inline-flex;
          align-items: center;
        }
        .${cls("emailRow")} {
          font-size: 22px;
          font-weight: 500;
          opacity: 0.5;
          min-height: 36px;
          padding: 2px 2px;
        }
        @media (hover: hover) {
          .${cls("emailRow")}:hover {
            opacity: 0.95;
          }
        }
        .${cls("emailRow")}:focus-visible {
          opacity: 1;
        }
        .${cls("flash")} {
          font-family: 'Caveat', cursive;
          color: #f2c75b;
          font-size: 18px;
          font-weight: 600;
          opacity: 0;
          pointer-events: none;
          text-shadow: 0 2px 12px rgba(242,199,91,0.4);
          white-space: nowrap;
          margin-left: 10px;
          align-self: center;
        }
        .${cls("left")}.${cls("copied")} .${cls("flash")} {
          animation: ${cls("flashAnim")} 1.4s cubic-bezier(.2,.7,.2,1) forwards;
        }
        @keyframes ${cls("flashAnim")} {
          0%   { opacity: 0; transform: translateX(-6px); }
          25%  { opacity: 1; transform: translateX(0); }
          75%  { opacity: 1; transform: translateX(2px); }
          100% { opacity: 0; transform: translateX(12px); }
        }
        .${cls("mind")} {
          display: flex;
          align-items: center;
          gap: 14px;
          color: white;
          font-weight: 500;
          font-size: 19px;
          letter-spacing: 0.01em;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 14px;
          transition:
            transform 260ms cubic-bezier(.2,.7,.2,1),
            background-color 260ms ease;
          align-self: flex-start;
          margin-top: -8px;
        }
        @media (hover: hover) {
          .${cls("mind")}:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.06);
          }
        }
        .${cls("mind")}:focus-visible {
          outline: 2px solid rgba(247,220,142,0.95);
          outline-offset: 4px;
        }
        .${cls("mind")}:active {
          transform: translateY(-1px) scale(0.99);
          transition-duration: 100ms;
        }
        .${cls("plant")} {
          width: 28px; height: 38px;
          flex-shrink: 0;
          transform-origin: 50% 85%;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.22));
          transition: transform 500ms cubic-bezier(.2,.7,.2,1);
        }
        @media (hover: hover) {
          .${cls("mind")}:hover .${cls("plant")} {
            animation: ${cls("plantSway")} 1.6s ease-in-out infinite;
          }
        }
        @keyframes ${cls("plantSway")} {
          0%, 100% { transform: rotate(-6deg); }
          50%      { transform: rotate(6deg); }
        }
        .${cls("bottom")} {
          position: relative;
          z-index: 3;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 56px 24px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        @media (max-width: 860px) {
          .${cls("content")} {
            padding: 64px 28px 28px;
          }
          .${cls("linksRow")} {
            flex-direction: column;
            gap: 24px;
          }
          .${cls("heading")} { font-size: 44px; margin-bottom: 4px; }
          .${cls("subtitle")} { font-size: 18px; margin-bottom: 40px; }
          .${cls("links")} { gap: 10px 28px; }
          .${cls("link")} { font-size: 26px; min-height: 44px; }
          .${cls("emailRow")} { font-size: 20px; }
          .${cls("bottom")} {
            padding: 0 28px 22px;
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          .${cls("mind")} { align-self: flex-end; padding: 8px 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${cls("ray-a")}, .${cls("ray-b")},
          .${cls("glow")}, .${cls("sparkle")},
          .${cls("plant")} {
            animation: none !important;
          }
          .${cls("link")}, .${cls("mind")} {
            transition: none !important;
          }
        }
      `}</style>
      <div className={cls("mist")} aria-hidden="true" />
      <div className={cls("rays")} aria-hidden="true">
        <div className={cls("ray-a")} />
        <div className={cls("ray-b")} />
      </div>
      <div className={cls("glow")} aria-hidden="true" />
      <div className={cls("sparkles")} aria-hidden="true">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className={
              cls("sparkle") +
              (s.big ? " " + cls("big") : "") +
              (s.blue ? " " + cls("blue") : "")
            }
            style={
              {
                width: s.size,
                height: s.size,
                left: s.left + "%",
                bottom: s.bottom + "px",
                animationDuration: s.dur + "s",
                animationDelay: s.delay + "s",
                "--dx": s.dx + "px",
                "--o": s.opacity.toFixed(2),
              } as CustomCSSProperties
            }
          />
        ))}
      </div>
      <div className={cls("grain")} aria-hidden="true" />
      <div className={cls("content")}>
        {/* Hand-lettered kicker — one beat of personality before the
            big heading. Reads like a sticky note Kathleen left
            taped to the bottom of the page, not a section label. */}
        <span className={cls("kicker")} aria-hidden>
          <span>psst. you made it to the bottom.</span>
        </span>
        <h2 id={headingId} className={cls("heading")}>
          {headline}
        </h2>
        {subtitle ? <p className={cls("subtitle")}>{subtitle}</p> : null}
        <div className={cls("linksRow")}>
          <div className={cls("left") + (copied ? " " + cls("copied") : "")}>
            <nav className={cls("links")} aria-label="Contact">
              <a
                className={cls("link")}
                href={email ? `mailto:${email}` : undefined}
                aria-label={email ? `Send email to ${email}` : "Email"}
              >
                {SparkleBullet}
                Gmail
              </a>
              <Link href={linkedInUrl}>LinkedIn</Link>
              <Link href={resumeUrl}>Resume</Link>
            </nav>
            <div className={cls("emailLine")}>
              <button
                type="button"
                className={cls("link") + " " + cls("emailRow")}
                onClick={handleCopy}
                aria-label={`Copy email ${email} to clipboard`}
              >
                {SparkleBullet}
                {email}
              </button>
              <div className={cls("flash")} role="status" aria-live="polite">
                copied ✦
              </div>
            </div>
          </div>
          {mindSpaceUrl ? (
            <a
              className={cls("mind")}
              href={mindSpaceUrl}
              aria-label={`Visit ${mindSpaceLabel}`}
            >
              <PlantIcon cls={cls} />
              <span>{mindSpaceLabel}</span>
            </a>
          ) : (
            <span className={cls("mind")}>
              <PlantIcon cls={cls} />
              <span>{mindSpaceLabel}</span>
            </span>
          )}
        </div>
      </div>
      <div className={cls("bottom")}>
        <span>{copyright}</span>
      </div>
    </footer>
  );
}

function PlantIcon({ cls }: { cls: (n: string) => string }) {
  return (
    <svg
      className={cls("plant")}
      viewBox="0 0 60 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M30.0156 39.7793C30.0156 39.7793 6.02469 39.2736 6.02283 42.7778C6.01857 50.775 13.0228 79.7806 18.0277 79.7806C24.5228 79.7806 35.09 79.7806 46.0228 79.7806C51.0228 79.7806 56.0228 53.7778 56.0228 42.7778C56.0228 39.2778 30.0156 39.7793 30.0156 39.7793ZM30.0156 39.7793C29.5829 35.8124 29.5246 31.2793 29.5246 26.3298M29.5246 26.3298C29.5246 8.7793 46.5043 -3.56982 53.5156 6.78003C64.0156 22.2797 32.4081 25.8298 29.5246 26.3298ZM29.5246 26.3298C24.5156 10.2797 16.0079 -3.22029 6.01405 6.78035C-6.61541 19.4184 24.193 26.8298 29.5264 26.3298"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
