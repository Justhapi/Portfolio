import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "ideating", label: "Ideating" },
  { id: "verifying", label: "Verifying" },
  { id: "reflections", label: "Reflections" },
];

export default function JourneyTrackCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="AI Journey Map Maintenance Agent"
        meta="Capstone · AI/UX · Concept · 2026"
        subtitle="NDA-restricted — abstract previews and process only"
        imageLabel="JourneyTrack · cover concept"
      />

      <main className="case-body">
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>Problem Scope</h3>
          <p>
            <mark className="hl">Customer journey maps go stale the moment they ship.</mark> Teams revisit them on a
            six-month cadence — long after the experience has drifted — and the cost of re-doing the research keeps
            the document frozen between updates. The capstone explored whether an
            <mark className="hl"> AI agent could keep the map breathing on its own</mark>.
          </p>

          <h3>Project Results</h3>
          <div className="case-image-row">
            <figure>
              <div className="image-slot">agent concept</div>
              <figcaption>An abstract preview of the agent&rsquo;s drift-detection surface (NDA-friendly).</figcaption>
            </figure>
            <figure>
              <div className="image-slot">flow concept</div>
              <figcaption>The proposed loop between agent suggestions and human review.</figcaption>
            </figure>
          </div>

          <h3>Project Contributions</h3>
          <p>
            I <mark className="hl">led concept ideation</mark> and ran the agent-vs-spec usability sessions: pitching
            <strong> three agent personalities</strong>, mapping where humans should still own decisions, and shaping
            the <mark className="hl">review-and-accept pattern</mark> that became the handoff between agent and team.
          </p>
        </section>

        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <p>
            We started by interviewing three teams who keep journey maps. The recurring complaint wasn&rsquo;t the
            mapping itself — it was the maintenance. Maps were trusted as references but distrusted as living artifacts,
            and people had stopped looking at them altogether.
          </p>
          <p>
            That gave us a sharper question than &ldquo;can AI build a journey map?&rdquo; — namely,
            <mark className="hl"> &ldquo;what would have to be true for a team to trust an AI&rsquo;s update?&rdquo;</mark>
          </p>
          <div className="case-image-grid">
            <figure>
              <div className="image-slot">interview synthesis</div>
              <figcaption>Interview synthesis</figcaption>
            </figure>
            <figure>
              <div className="image-slot">competitive scan</div>
              <figcaption>Competitive scan</figcaption>
            </figure>
          </div>
        </section>

        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <p>
            We sketched three agent &ldquo;personalities&rdquo; — a librarian (asks first), a maintainer (acts and
            reports), and a partner (negotiates). Each implied a different power balance with the design team, and that
            balance became the design&rsquo;s real argument.
          </p>
          <figure>
            <div className="image-slot">three personalities</div>
            <figcaption>Three agent personalities sketched in parallel</figcaption>
          </figure>
        </section>

        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <p>
            We tested the partner concept across two sessions. Participants were given a stale journey map and the
            agent&rsquo;s suggested patch, then asked to decide together.
          </p>
          <p className="case-placeholder">— detailed findings under NDA</p>
        </section>

        <section id="reflections" className="case-section">
          <h2>Reflections</h2>
          <p>
            <mark className="hl">The most useful AI behavior turned out to be the most boring one</mark> — surfacing
            what had changed in the source data and asking a human to interpret it. The interesting parts — drafting
            new map nodes, suggesting interventions — only earned trust <em>after</em> the boring part was bulletproof.
            That ordering reshaped how I think about agent UX in general.
          </p>
        </section>
      </main>
    </div>
  );
}
