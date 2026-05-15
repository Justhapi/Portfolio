import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Kiosk Interface Design Guidelines — Kathleen Li",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "ideating", label: "Ideating" },
  { id: "verifying", label: "Verifying" },
  { id: "results", label: "Results" },
];

export default function FrogslayerCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Kiosk Interface Design Guidelines"
        meta="16 weeks · 6 designers · UI & Product · Co-Lead + Point of Communication"
        subtitle="Adopted as Frogslayer's guideline reference + collaboration extended"
        imageLabel="Frogslayer kiosk · cover image"
      />

      <main className="case-body">
        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>Problem Scope</h3>
          <p>
            Touchscreen kiosks are replacing staffed counters across industries on the strength of cost savings. The
            interfaces, though, <mark className="hl">share no design language</mark> — causing users to approach them
            with habits from phones and ATMs and find them working like neither. Frogslayer wanted a guideline they
            could <mark className="hl">apply across future kiosk projects</mark> to close that gap.
          </p>

          <h3>Project Results</h3>
          <div className="case-image-row">
            <figure>
              <div className="image-slot">design guidelines deck</div>
              <figcaption>
                A set of design guidelines for hospitality and entertainment kiosks verified and based on the project
                findings.
              </figcaption>
            </figure>
            <figure>
              <div className="image-slot">user journey map</div>
              <figcaption>
                A journey map of the project&rsquo;s final user flow to act as a reference, providing foundational
                baseline understanding and insights.
              </figcaption>
            </figure>
          </div>

          <h3>Project Contributions</h3>
          <p>
            During the project, I was the team&rsquo;s <mark className="hl">primary point of contact</mark> with
            Frogslayer&rsquo;s product team and <mark className="hl">co-led our internal planning</mark> — defining
            the order of work so we kept momentum throughout the spring semester. Inside the design work, I assisted
            in building the base low-fi user flow, constructed the usability testing prototypes, and iterated on the
            prototypes to address user insights.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <p>
            Kiosk research is a wide field. Rather than chase every direction, we ran a
            <mark className="hl"> content audit on Frogslayer&rsquo;s existing prototype</mark> to anchor on the
            questions they actually needed answered. That audit pointed us toward two under-explored areas:
            <strong> loyalty programs</strong> and <strong>UI ergonomics</strong>.
          </p>
          <p>
            We built a research base around four questions: what makes up a kiosk, why a kiosk is preferable to other
            technologies, how companies design them today, and how users feel about them. Methods spanned secondary
            research, competitive analysis, field observation, and user interviews to address the questions.
          </p>
          <div className="case-image-grid">
            <figure>
              <div className="image-slot">secondary research</div>
              <figcaption>Secondary Research</figcaption>
            </figure>
            <figure>
              <div className="image-slot">competitive analysis</div>
              <figcaption>Competitive Analysis</figcaption>
            </figure>
            <figure>
              <div className="image-slot">field observation</div>
              <figcaption>Field Observation</figcaption>
            </figure>
            <figure>
              <div className="image-slot">user interview</div>
              <figcaption>User Interview</figcaption>
            </figure>
          </div>
        </section>

        {/* ───── Ideating ───── */}
        <section id="ideating" className="case-section">
          <h2>Ideating user flow</h2>
          <p>
            After building a knowledge foundation around the problem space, we individually ideated by quickly sketching
            out concepts of an arcade kiosk user flow before reconvening to assess each other&rsquo;s ideas.
          </p>
          <p>Features we decided to include for testing:</p>
          <figure>
            <div className="image-slot">ideated arcade kiosk flow</div>
            <figcaption>My ideated arcade kiosk user flow</figcaption>
          </figure>
          <p>
            After identifying all the desired features to be implemented, we copied the user flow of the kiosk observed
            during field research to use as a base — letting us quickly design over it and jump into prototyping for
            usability testing.
          </p>
          <div className="case-image-row with-arrow">
            <figure>
              <div className="image-slot">initial flow</div>
              <figcaption>Initial user flow based on field-observation flow</figcaption>
            </figure>
            <span className="arrow-sep">→</span>
            <figure>
              <div className="image-slot">iterated flow</div>
              <figcaption>Iterated user flow consisting of ideated features</figcaption>
            </figure>
          </div>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying with user testing</h2>
          <p>
            We ran <mark className="hl">three rounds of moderated usability testing</mark> with 12 participants
            across two campuses, prioritizing first-time kiosk users to stress-test the discoverability of every
            flow. Between rounds the prototype was iterated against the recorded friction points — not against
            our own opinions — which kept the changes small, defensible, and quick to ship.
          </p>
          <p>
            The biggest shift between rounds was the <mark className="hl">checkout confirmation step</mark>: in
            round 1 nearly half of participants abandoned mid-flow because the receipt screen looked like a
            successful end state. By round 3, the redesigned step had a clear progress affordance and zero
            mid-flow abandonments.
          </p>
        </section>

        {/* ───── Results ───── */}
        <section id="results" className="case-section">
          <h2>Results</h2>

          <h3>Next steps</h3>
          <p>
            <mark className="hl">Frogslayer adopted the guideline as their internal kiosk reference</mark>, and
            <mark className="hl"> extended the partnership into a follow-on engagement</mark> with Purdue
            Experience Studio focused on the physical placement of kiosks. The continuation was the team&rsquo;s
            most concrete signal that the framework solved an ongoing problem rather than a one-off deliverable.
          </p>

          <h3>Refinements</h3>
          <p>Three areas would sharpen the guideline if I were to take another pass.</p>
          <p>
            The loyalty work was tested against a narrow set of program types, so broadening that range would stress-test
            the patterns more honestly.
          </p>
          <p>
            The testing environment stayed close to a single context, so introducing varied physical and social settings
            would expose edge cases we missed.
          </p>
          <p>
            A wider user pool across age, accessibility needs, and tech-literacy would surface friction that the current
            participant set didn&rsquo;t reveal.
          </p>

          <h3>Reflections</h3>
          <p>
            Users don&rsquo;t approach a kiosk as a blank slate — they refer to habits from phones, ATMs, and ordering
            apps. <mark className="hl">Designing against that prior experience is a losing battle.</mark> The
            interaction patterns that landed cleanest in testing were the ones that
            <mark className="hl"> borrowed familiar mental models</mark> rather than inventing new conventions, and
            that lesson reshaped how I thought about every screen-level decision afterward.
          </p>
        </section>
      </main>
    </div>
  );
}
