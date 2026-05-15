import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "ResearchHub Collaboration Platform — Kathleen Li",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "designing", label: "Designing" },
  { id: "reflections", label: "Reflections" },
];

export default function ResearchHubCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="ResearchHub Collaboration Platform"
        meta="Purdue Stack · Lead · Systems · 2025—"
        subtitle="A campus-wide platform connecting students with faculty research"
        imageLabel="ResearchHub · cover image"
      />

      <main className="case-body">
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>Problem Scope</h3>
          <p>
            Undergrads at Purdue knew faculty did research but had <mark className="hl">no shared way to find which
            labs were hiring</mark>, scoping, or about to wrap up. Faculty had the inverse problem — no consistent
            surface to recruit student researchers from. Stack wanted a hub that <strong>closed the loop</strong>.
          </p>

          <h3>Project Results</h3>
          <div className="case-image-row">
            <figure>
              <div className="image-slot">browse view</div>
              <figcaption>Browse view — students filtering open lab opportunities.</figcaption>
            </figure>
            <figure>
              <div className="image-slot">lab profile</div>
              <figcaption>Lab profile — faculty&rsquo;s curated picture of their research and openings.</figcaption>
            </figure>
          </div>

          <h3>Project Contributions</h3>
          <p>
            I <mark className="hl">led design from kickoff</mark>: framing the user research, running the synthesis
            sessions, owning the design system, and delivering
            <mark className="hl"> four high-fidelity views</mark> — browse, lab profile, application flow, and
            dashboard.
          </p>
        </section>

        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <p>
            We interviewed 8 students and 5 faculty across colleges and departments. The clearest theme was scope —
            students wanted to know what they&rsquo;d actually do day-to-day, not the lab&rsquo;s mission statement.
          </p>
          <div className="case-image-grid">
            <figure>
              <div className="image-slot">interview notes</div>
              <figcaption>Interview synthesis</figcaption>
            </figure>
            <figure>
              <div className="image-slot">opportunity map</div>
              <figcaption>Opportunity map</figcaption>
            </figure>
          </div>
        </section>

        <section id="designing" className="case-section">
          <h2>Designing the system</h2>
          <p>
            Because Stack ships fast across many teams, the design system was load-bearing. I built tokens, components,
            and a documentation site alongside the views — so the next team picking up Hub could ship a feature without
            re-litigating spacing.
          </p>
          <figure>
            <div className="image-slot">system docs</div>
            <figcaption>Design system documentation</figcaption>
          </figure>
        </section>

        <section id="reflections" className="case-section">
          <h2>Reflections</h2>
          <p>
            Working as both designer and design-system owner meant every screen-level decision had to justify its
            existence at the token level too. That pressure forced cleaner choices upstream — and it&rsquo;s the
            engineering mindset I want to keep carrying into future product work.
          </p>
        </section>
      </main>
    </div>
  );
}
