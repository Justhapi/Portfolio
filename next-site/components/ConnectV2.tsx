"use client";

import { useRef, useState } from "react";
import SparkleField from "@/components/SparkleField";

/**
 * ConnectV2 — pitch + link rows + footer.
 *
 * Bullets are 4-pointed sparkle SVGs (ported from Home/style.css "footer-link-spark")
 * — they rotate 90° on hover with a spring ease.
 */

const EMAIL = "likathleen094@gmail.com";

/** 4-pointed sparkle SVG used as the bullet on each connect link row. */
const SparkleBullet = () => (
  <svg
    className="c-spark"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
  </svg>
);

export default function ConnectV2() {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback for older browsers — select the value via a hidden input
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        /* silent — user can still click the mailto */
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <section
      id="connect"
      className="section connect"
      data-screen-label="04 Connect"
      ref={sectionRef}
    >
      <div className="section-sparkles connect-sparkles" aria-hidden="true">
        {/* Fewer, larger, slower sparkles — wind-down feel vs hero's energetic scatter */}
        <SparkleField count={7} scale={1.5} slowdown={2.2} lifeScale={1.5} />
      </div>
      <div className="container">
        <div className="section-head head reveal">
          <div>
            <h2 className="h">Connect</h2>
            <div
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "var(--muted)",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              say hi · let&rsquo;s make something
            </div>
          </div>
        </div>

        <div className="connect-row reveal">
          <div className="connect-pitch">
            I&rsquo;m open to <em>summer 2026 internships</em> in UI, interaction, and design-engineering — and to chatting with anyone who likes
            drawing problems before solving them.
          </div>
          <div className="connect-links">
            {/* Email row — link + dedicated copy-to-clipboard button */}
            <div className="c-link c-email">
              <a href={`mailto:${EMAIL}`} className="c-email-main">
                <span>
                  <SparkleBullet />
                  Email
                </span>
              </a>
              <button
                type="button"
                className={`c-copy ${copied ? "is-copied" : ""}`}
                onClick={handleCopy}
                aria-label={copied ? "Email address copied" : "Copy email address"}
              >
                <span className="c-copy-label">{copied ? "copied" : "copy email"}</span>
                <span className="c-copy-icon" aria-hidden="true">
                  {copied ? (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8.5 L 6.5 12 L 13 5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="5" width="8" height="8" rx="1.5" />
                      <path d="M3 11 V 4.5 A 1.5 1.5 0 0 1 4.5 3 H 11" />
                    </svg>
                  )}
                </span>
              </button>
            </div>

            <a
              className="c-link is-pending"
              href="#"
              aria-label="LinkedIn (link coming soon)"
              onClick={(e) => e.preventDefault()}
            >
              <span>
                <SparkleBullet />
                Linkedin
              </span>
            </a>
            <a
              className="c-link is-pending"
              href="#"
              aria-label="Resume (link coming soon)"
              onClick={(e) => e.preventDefault()}
            >
              <span>
                <SparkleBullet />
                Resume
              </span>
            </a>
          </div>
        </div>

        <div className="foot">
          <span>© Kathleen Li · 李曦 · 2026</span>
          <span>Made with Procreate, Figma &amp; a lot of React</span>
        </div>
      </div>
    </section>
  );
}
