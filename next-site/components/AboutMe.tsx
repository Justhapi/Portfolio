"use client";

/**
 * AboutMe — direct port of the user's hand-drawn "About me" sketch.
 *
 * Layout (matches the mockup):
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  About me              An artist that likes to explore   │
 *   │  ┌──────────────┐      the "why" behind design.          │
 *   │  │              │                                        │
 *   │  │  insert pic  │      Once I realized I could continue  │
 *   │  │   of me      │      designing but also problem solve  │
 *   │  │              │      for others, I immediately joined  │
 *   │  │       ┌────┐ │      the UX field.                     │
 *   │  └───────│self│─┘                                        │
 *   │          │doodl│      Outside of academics, I am:        │
 *   │          └────┘                                          │
 *   │   ↑          ↑          ◇ Designing UI at Purdue Stack   │
 *   │  How I       How I      ◇ Mentoring at Purdue Society…   │
 *   │  look in     view       ◇ Producing digital illustration │
 *   │  real life   myself     ◇ Planning my next trip to…      │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Aesthetic — preserved verbatim from the sketch:
 *   • Dark-teal → lighter-teal vertical gradient as section background.
 *   • Yellow (#f0c97f) Caveat hand-lettering for the heading & bullet
 *     accents; cream Caveat for body copy.
 *   • Two stacked yellow rounded-rectangle "frames": a tall one that
 *     holds the photo placeholder, and a smaller offset one (bottom-
 *     right of the tall frame) that holds the self-doodle.
 *   • Caption arrows point up at each frame, labeled "How I look in
 *     real life" and "How I view myself".
 *   • Sparkle (◇) bullet glyphs ahead of each list item.
 */

/* Palette — tuned so the section sits on the light top of the
   page-wide white→teal gradient. Heading + accents use a warm
   terracotta that holds contrast against paper-cream; body copy
   uses cocoa ink. Frame strokes still use a warm yellow because
   they sit on the white photo plates. */
const SKETCH = {
  bgTop: "transparent",
  bgBottom: "transparent",
  yellow: "#b5675b",      // terracotta — accent / heading
  yellowDeep: "#d8a653",  // warm yellow — frame stroke (on white plates)
  cream: "#2c2018",       // cocoa ink — body copy
  white: "#ffffff",
  ink: "#1a1612",
} as const;

export type AboutMeProps = {
  /** Optional photo URL — defaults to placeholder. */
  photoSrc?: string;
  /** Optional doodle URL — defaults to placeholder. */
  doodleSrc?: string;
};

export default function AboutMe({
  photoSrc,
  doodleSrc,
}: AboutMeProps = {}) {
  return (
    <section className="about-me" id="about-me" aria-label="About me">
      <style>{`
        .about-me {
          position: relative;
          padding: clamp(80px, 10vw, 140px) clamp(20px, 4vw, 56px) clamp(120px, 14vw, 180px);
          background: transparent;
          color: ${SKETCH.cream};
          font-family: 'Caveat', cursive;
          overflow: hidden;
        }
        /* Subtle paper-grain noise so the teal doesn't read as flat color. */
        .about-me::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04) 0, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.06) 0, transparent 50%);
        }

        .about-me-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(280px, 460px) 1fr;
          gap: clamp(40px, 6vw, 80px);
          max-width: 1200px;
          margin: 0 auto;
          align-items: start;
        }

        /* ── Heading ── */
        .about-me-title {
          grid-column: 1 / -1;
          font-size: clamp(3rem, 6vw, 5.2rem);
          color: ${SKETCH.yellow};
          margin: 0 0 clamp(20px, 4vw, 48px);
          letter-spacing: -0.01em;
          font-weight: 600;
          line-height: 0.9;
        }

        /* ── Photo column ── */
        .am-photo-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        /* The big yellow frame — slightly off-square, drawn with a
           thicker irregular border via double box-shadow to keep that
           hand-drawn feel. overflow stays VISIBLE so the doodle can
           hang off the bottom-right corner without being clipped;
           the photo gets its own .am-frame-clip wrapper that handles
           the rounded-corner clip. */
        .am-frame {
          position: relative;
          width: 100%;
          max-width: 380px;
          aspect-ratio: 4 / 5;
          border: 6px solid ${SKETCH.yellowDeep};
          border-radius: 18px;
          background: ${SKETCH.white};
          box-shadow:
            inset 0 0 0 2px rgba(255,255,255,0.6),
            6px 6px 0 rgba(0,0,0,0.10);
          /* Slight tilt — matches the sketchy hand-drawn frame */
          transform: rotate(-1.2deg);
          overflow: visible;
        }
        /* Clip layer for the photo only — keeps the photo inside the
           rounded corners, while leaving the doodle free to overhang
           outside the frame as a sibling element. */
        .am-frame-clip {
          position: absolute; inset: 0;
          overflow: hidden;
          border-radius: 12px;
        }
        .am-frame-clip img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .am-frame-placeholder {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          color: ${SKETCH.ink};
          font-family: 'Caveat', cursive;
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          opacity: 0.5;
          padding: 24px;
          text-align: center;
        }

        /* The smaller "self doodle" frame — anchored at the bottom-right
           of the photo frame, peeks out below + right per the sketch. */
        .am-doodle {
          position: absolute;
          right: -30px;
          bottom: -50px;
          width: clamp(120px, 22%, 160px);
          aspect-ratio: 4 / 5;
          border: 5px solid ${SKETCH.yellowDeep};
          border-radius: 14px;
          background: ${SKETCH.white};
          transform: rotate(2.5deg);
          box-shadow:
            inset 0 0 0 2px rgba(255,255,255,0.6),
            4px 4px 0 rgba(0,0,0,0.10);
          overflow: hidden;
        }
        .am-doodle img { width: 100%; height: 100%; object-fit: cover; }
        .am-doodle-placeholder {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          font-family: 'Caveat', cursive;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          color: ${SKETCH.ink};
          text-align: center; padding: 8px;
        }

        /* ── Copy column ── */
        .am-copy {
          position: relative;
          padding-top: 6px;
          font-family: 'Caveat', cursive;
          font-size: clamp(1.35rem, 2vw, 1.7rem);
          line-height: 1.35;
          color: ${SKETCH.cream};
          letter-spacing: 0.005em;
        }
        .am-copy .lead {
          color: ${SKETCH.yellow};
          margin: 0 0 28px;
          font-size: clamp(1.55rem, 2.4vw, 2rem);
          line-height: 1.25;
          max-width: 22ch;
        }
        .am-copy .body {
          color: ${SKETCH.cream};
          max-width: 28ch;
          margin: 0 0 36px;
        }
        .am-copy .subhead {
          color: ${SKETCH.yellow};
          font-size: clamp(1.4rem, 2vw, 1.7rem);
          margin: 0 0 14px;
        }

        /* ── Sparkle bullet list ── */
        .am-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 10px;
          color: ${SKETCH.cream};
        }
        .am-list li {
          display: flex; align-items: flex-start; gap: 14px;
          line-height: 1.35;
        }
        .am-list .sparkle {
          flex: 0 0 auto;
          width: 22px; height: 22px;
          color: ${SKETCH.yellow};
          margin-top: 4px;
        }
        .am-list .sparkle svg { width: 100%; height: 100%; fill: currentColor; }

        @media (max-width: 860px) {
          .about-me-grid {
            grid-template-columns: 1fr;
            gap: 64px;
          }
          .am-frame { max-width: 280px; margin: 0 auto; }
          .am-doodle { right: -20px; bottom: -40px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .am-frame, .am-doodle { transform: none; }
        }
      `}</style>

      <div className="about-me-grid">
        <h2 className="about-me-title">About me</h2>

        {/* ── Left: photo + doodle frames + arrow captions ── */}
        <div className="am-photo-col">
          <div className="am-frame">
            {/* Inner clip — only the photo content is clipped to
                the rounded corners. The doodle below is OUTSIDE
                this wrapper so it can hang off the frame edge
                without being trimmed. */}
            <div className="am-frame-clip">
              {photoSrc ? (
                <img src={photoSrc} alt="Kathleen Li" />
              ) : (
                <span className="am-frame-placeholder">insert pic of me</span>
              )}
            </div>
            <div className="am-doodle">
              {doodleSrc ? (
                <img src={doodleSrc} alt="Self doodle" />
              ) : (
                <span className="am-doodle-placeholder">self doodle</span>
              )}
            </div>
          </div>

        </div>

        {/* ── Right: copy ── */}
        <div className="am-copy">
          <p className="lead">
            An artist that likes to explore the &ldquo;why&rdquo; behind design
          </p>
          <p className="body">
            Once I realized I could continue designing but also problem solve
            for others, I immediately joined the UX field
          </p>
          <p className="subhead">Outside of academics, I am:</p>
          <ul className="am-list">
            <li>
              <span className="sparkle" aria-hidden>
                <Sparkle />
              </span>
              <span>Designing UI at Purdue Stack</span>
            </li>
            <li>
              <span className="sparkle" aria-hidden>
                <Sparkle />
              </span>
              <span>Mentoring at Purdue Society of Asian Scientists &amp; Engineers</span>
            </li>
            <li>
              <span className="sparkle" aria-hidden>
                <Sparkle />
              </span>
              <span>Producing digital illustrations &amp; animation</span>
            </li>
            <li>
              <span className="sparkle" aria-hidden>
                <Sparkle />
              </span>
              <span>Planning my next trip to include a bunch of local food</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Reusable 4-point sparkle glyph — matches the rest of the site. */
function Sparkle() {
  return (
    <svg viewBox="0 0 100 100" focusable="false">
      <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
    </svg>
  );
}
