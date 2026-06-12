"use client";

import { useEffect, useRef, useState } from "react";
import SparkleField from "@/components/SparkleField";

/**
 * ConnectV2 — pitch + link rows + footer.
 *
 * Bullets are 4-pointed sparkle SVGs (ported from Home/style.css "footer-link-spark")
 * — they rotate 90° on hover with a spring ease.
 *
 * Email row drops down an inline compose form on click — Subject + Message
 * inputs + "Send Message" button. Send opens `mailto:` with the filled
 * values so the visitor's default mail client handles delivery. No backend
 * needed; the form is purely a UX wrapper around mailto.
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
  const [formOpen, setFormOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState("");
  const sectionRef = useRef<HTMLElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);

  // Focus the subject input once the form has finished expanding so the
  // visitor can start typing immediately. Delay matches the panel's
  // max-height transition (320ms) so the focus ring doesn't appear inside
  // an in-flight reveal.
  useEffect(() => {
    if (!formOpen) return;
    const t = window.setTimeout(() => subjectRef.current?.focus(), 320);
    return () => window.clearTimeout(t);
  }, [formOpen]);

  // Esc closes the form. Scoped to formOpen so the listener only attaches
  // when there's actually a form to close.
  useEffect(() => {
    if (!formOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFormOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepend the visitor's contact info to the body so Kathleen sees how
    // to reach them even if the mail client's From header doesn't match
    // their preferred contact channel (e.g. they typed a LinkedIn URL or
    // a non-default email).
    const composedBody = from.trim()
      ? `Contact: ${from.trim()}\n\n${body}`
      : body;
    const url = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(composedBody)}`;
    window.location.href = url;
  };

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
      className={`section connect ${formOpen ? "has-open-form" : ""}`}
      data-screen-label="04 Connect"
      ref={sectionRef}
    >
      <div className="section-sparkles connect-sparkles" aria-hidden="true">
        {/* Fewer, larger, slower sparkles — wind-down feel vs hero's energetic scatter */}
        <SparkleField count={7} scale={1.5} slowdown={2.2} lifeScale={1.5} />
      </div>
      <div className="container">
        {/* connect-row fills the space above the footer and slides down on scroll.
            Heading sits INSIDE the grid as a row-1 element spanning both columns,
            so it inherits the parallax transform applied to .connect-row by
            SmoothScroll.tsx (the heading drifts in lockstep with the pitch + links
            below it, no separate JS registration needed). */}
        <div className="connect-row reveal">
          <h2 className="connect-head">Connect more over my designs?</h2>
          <div className="connect-pitch">
            I am available for <em>internships in Interaction Design, Product Design, and Design Engineering!</em>
          </div>
          <div className={`connect-links ${formOpen ? "has-open-form" : ""}`}>
            {/* Email row — click expands an inline compose form below it.
                The mailto link is preserved as a fallback for keyboard
                users who Cmd+click (open default mail client) and for
                visitors with JavaScript disabled. */}
            <div className={`c-link c-email ${formOpen ? "is-open" : ""}`}>
              <a
                href={`mailto:${EMAIL}`}
                className="c-email-main"
                onClick={(e) => {
                  e.preventDefault();
                  setFormOpen((v) => !v);
                }}
                aria-expanded={formOpen}
                aria-controls="email-compose-form"
              >
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

            {/* Email compose form — drops down underneath the Email row.
                `max-height` + `opacity` transitions give the slide-out
                feel. Inputs follow the Connect section palette: dark
                surface, cream text, accent-soft borders. The form opens
                a `mailto:` URL on submit — no backend required; the
                visitor's default mail client handles delivery. */}
            <form
              id="email-compose-form"
              className={`c-email-form ${formOpen ? "is-open" : ""}`}
              onSubmit={handleSend}
              aria-hidden={!formOpen}
            >
              <div className="c-email-form-inner">
                <label className="c-email-form-field">
                  <span className="c-email-form-label">Subject</span>
                  <input
                    ref={subjectRef}
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    autoComplete="off"
                  />
                </label>
                <label className="c-email-form-field">
                  <span className="c-email-form-label">Message</span>
                  <textarea
                    name="body"
                    placeholder="Write your message…"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>
                <div className="c-email-form-actions">
                  <label className="c-email-form-from">
                    <span className="c-email-form-label">From</span>
                    <input
                      type="text"
                      name="from"
                      placeholder="your email or LinkedIn — so I can reply"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                  <button type="submit" className="c-email-form-send">
                    <span>Send Message</span>
                    <span className="c-email-form-send-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </form>

            <a
              className="c-link"
              href="https://www.linkedin.com/in/kathleen-li-564a13328"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
            >
              <span>
                <SparkleBullet />
                LinkedIn
              </span>
            </a>
            <a
              className="c-link"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume PDF (opens in new tab)"
            >
              <span>
                <SparkleBullet />
                Resume
              </span>
            </a>
          </div>
        </div>

        {/* Footer anchored at the bottom of Connect — semantic <footer>
            so screen-reader users get the contentinfo landmark. */}
        <footer className="foot">
          <span>© Kathleen Li · 李曦 · 2026</span>
          <span>Made with Procreate, Figma &amp; a lot of React</span>
        </footer>
      </div>
    </section>
  );
}
