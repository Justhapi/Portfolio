"use client";

/**
 * AboutV2 — port of Claude Design Portoflio/about.jsx
 * Single polaroid + bio with bullet list.
 */
export default function AboutV2() {
  return (
    <section id="about" className="section about" data-screen-label="03 About">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <h2 className="h">About</h2>
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
              self introduction
            </div>
          </div>
        </div>

        <div className="about-grid">
          <div className="polaroid-single reveal">
            <div className="polaroid">
              <div className="photo">
                <div className="image-slot">drop a photo of you</div>
              </div>
              <div className="caption">how I look IRL</div>
            </div>
          </div>

          <div className="about-copy reveal">
            <h3 className="lead">
              Purdue UX undergrad with a{" "}
              <em
                style={{
                  fontFamily: "var(--f-hand)",
                  fontWeight: 400,
                  color: "var(--ink-soft)",
                }}
              >
                design-engineering
              </em>{" "}
              minor.
            </h3>
            <p>
              I <em style={{ fontStyle: "italic" }}>prototype in code, sketch on iPad, and live in Figma</em>.
              Most recently I co-led a kiosk design system that Frogslayer adopted as their internal reference,
              and I now lead UI at Purdue Stack.
            </p>
            <p>
              I joined UX once I realized I could keep drawing, painting, and animating <em style={{ fontStyle: "italic" }}>and</em> solve
              real problems for real people. I&rsquo;m looking for a <strong>summer 2026 internship</strong> where
              that crossover earns its keep.
            </p>
            <ul>
              <li>
                <span className="dia" />
                <span>
                  Designing UI at <strong>Purdue Stack</strong>
                </span>
              </li>
              <li>
                <span className="dia" />
                <span>
                  Mentoring at <strong>Purdue Society of Asian Scientists &amp; Engineers</strong>
                </span>
              </li>
              <li>
                <span className="dia" />
                <span>Producing digital illustrations &amp; motion as side practice</span>
              </li>
              <li>
                <span className="dia" />
                <span>Planning my next trip around a list of local food spots</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
