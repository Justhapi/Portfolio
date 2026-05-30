import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "ResearchHub — Kathleen Li",
};

/* Outcome leads so recruiters see results first. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "process", label: "Process" },
  { id: "takeaways", label: "Takeaways" },
];

export default function ResearchHubCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="ResearchHub — Connecting Students with Faculty Research"
        meta="Spring 2026 · 16 weeks · 5 engineers + me · Design Engineer (sole designer)"
        subtitle="A redesigned student–faculty research platform, planned to ship summer 2026"
        imageLabel="ResearchHub · cover image"
      />

      <main id="main" className="case-body">
        {/* ───── Outcome ───── (moved to top: recruiters see outcome first) */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            The semester&rsquo;s work produced a redesigned ResearchHub,{" "}
            <mark className="hl">planned to ship in summer 2026</mark> so students and faculty can use it the
            following semester. The redesign carried one idea through every screen — the platform should help people
            evaluate <em>fit</em> (a professor&rsquo;s supervision style, lab culture, what the work actually
            involves), not just logistics like hours and pay.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            ResearchHub is an AI-assisted platform that streamlines how Purdue students discover and join faculty
            research projects, and how professors find and onboard the right students. I was the{" "}
            <mark className="hl">sole designer</mark> on the six-person Purdue Stack team — owning all UX and UI
            decisions, and also writing front-end React code when the team needed it.
          </p>

          <h3>The Problem</h3>
          <p>
            At Purdue, joining faculty research is friction-heavy. Opportunities are scattered across department
            pages, faculty sites, and word-of-mouth, and listings describe <em>logistics</em> — hours, pay, location
            — but almost nothing about <em>fit</em>. Students commit to projects and discover weeks in that the work
            wasn&rsquo;t what they expected. Professors, meanwhile, drown in unfocused applications and have no shared
            workspace to coordinate once students are accepted.
          </p>

          <h3>My Role</h3>
          <p>
            <mark className="hl">Design Engineer — roughly 70% design, 30% front-end.</mark> I owned every UX and UI
            decision and also wrote front-end React, because the team had to design <em>and</em> build ResearchHub
            within a single semester. Designing while knowing I might code the feature myself kept my specs pragmatic
            and genuinely buildable.
          </p>
        </section>

        {/* ───── Process ───── */}
        <section id="process" className="case-section">
          <h2>Process</h2>

          <h3>Audit &amp; UI revamp</h3>
          <p>
            I inherited a functional but visually inconsistent prototype. I walked it as both a student and a
            professor, logged every point of friction, and turned it into a prioritized punch-list that the team used
            to plan the rework.
          </p>

          <h3>User research</h3>
          <p>
            In a tight 1.5-week window — which also had to cover the UI audit — I ran{" "}
            <mark className="hl">4 student interviews</mark> and synthesized them with affinity diagramming. Faculty
            weren&rsquo;t available to interview directly, so I grounded the professor side in our faculty
            client&rsquo;s brief. The breakthrough insight: the platform surfaced logistics well but not <em>fit</em>{" "}
            — yet fit (supervision style, lab culture, what the work actually involves) was what students genuinely
            decided on. That insight became the north star for every decision after.
          </p>
          <figure>
            <div className="image-slot">research synthesis</div>
            <figcaption>
              Affinity diagramming 4 student interviews into the core insight: students decide on fit, not logistics.
            </figcaption>
          </figure>

          <h3>Design system</h3>
          <p>
            With the team designing <em>and</em> developing in one semester, building a system from scratch
            wasn&rsquo;t realistic — so I worked within the existing design system, refining its UI and components so
            a small team could move fast and stay consistent.
          </p>
          <figure>
            <div className="image-slot">design system</div>
            <figcaption>
              Refining the existing component library to keep student and professor flows visually coherent.
            </figcaption>
          </figure>

          <h3>Prototyping &amp; handoff</h3>
          <p>
            I built interactive prototypes to catch UX gaps before any code was written, and wrote handoff
            documentation the engineering team could build from independently.
          </p>

          <h3>Implementation</h3>
          <p>
            I also contributed front-end React — picking up the framework as I went (new to me, but close to my
            JavaScript background) to help build the platform alongside the design.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>What I Took Away</h2>
          <p>
            <mark className="hl">Designing and building in the same breath changes how you design.</mark> Because I
            might code a feature myself, I designed for what was actually buildable in our one-semester timeline —
            not just what looked best in a mockup. Working as both designer and engineer kept me close to
            implementation as a <em>partner</em>, and picking up React on the fly proved I could learn fast enough to
            help ship, not just hand off.
          </p>
        </section>
      </main>
    </div>
  );
}