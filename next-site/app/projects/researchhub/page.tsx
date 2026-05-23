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
            Purdue University's multitiude of research collaboration opportunities between students and faculty are
            <mark className="hl"> spread throughout various websites </mark> without <mark className="hl"> a consistent method
            of maintain research progression. </mark> Purdue Stack wanted to develop a platform that <strong>resolves both
            issues with a streamlined platform.</strong>
            <br></br>
            <br></br>
            Currently, the platform <mark className="hl"> functions in regards to initial usage </mark>
            through research searching and creating along with account creating and profiling. 
            This continuation project focuses primarily on <mark className="hl"> maintaining usage </mark> 
            through assistance in <strong>tracking research progression and communication</strong>
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
