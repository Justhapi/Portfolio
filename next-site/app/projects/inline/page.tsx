import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "inline — Kathleen Li",
};

/* NDA note — the inline confidentiality agreement (see Project Works
   folder) explicitly names "portfolios" among the works the Company
   is deemed the author of and requires "prior written consent" for
   any use of engagement materials outside the scope of the engagement.
   Until that written consent is obtained, this page shows only:
     - the employment fact (role, dates, arrangement)
     - the generic scope categories (competitive research, gap analysis,
       concept design, usability testing) — no artifacts, no findings,
       no product mechanics, no framework specifics
     - a "contact for materials" gate directing recruiters to reach out
   Once written approval is received, expand this page to the approved
   scope with the approving contact's name/title on file. */
const SECTIONS = [
  { id: "outcome", label: "Overview" },
  { id: "role", label: "My Role" },
  { id: "materials", label: "Detailed Materials" },
];

export default function InlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="inline"
        meta="Summer 2026 · 3-month remote internship · Product Design Intern"
        subtitle="Under active confidentiality agreement, detailed materials available on request"
        imageLabel="inline · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          This project is under an active confidentiality agreement with the sponsor. Under the
          terms of that agreement, which explicitly covers portfolios and presentations,
          engagement artifacts, product mechanics, research findings, testing protocols, and
          design decisions cannot be published without prior written consent from the sponsor.
          Approval is currently being pursued; in the meantime, this page shows only the role and
          scope categories.
        </p>

        <section id="outcome" className="case-section">
          <h2>Overview</h2>

          {/* Outcome-callout keeps the sibling case-study pages visually
              consistent even under NDA lockdown. The stat here is the
              NDA status itself — the honest headline for this page today.
              Once sponsor written approval is on file, swap this callout
              for the real outcome from /projects/inline2. */}
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Under active confidentiality agreement</strong>, so engagement artifacts
              and specific outcomes cannot be published until sponsor written approval is
              received. Approval is currently being pursued.
            </p>
            <p className="outcome-callout__meta">
              Summer 2026 · inline · Product Design Intern · detailed materials on request
            </p>
          </aside>

          <p>
            Interned as a <mark className="hl">Product Design Intern</mark> at inline, a
            restaurant-technology company based in the Asia-Pacific region. Contributed to an
            early-stage product exploration over a{" "}
            <mark className="hl">3-month remote internship</mark> across a roughly 12-hour
            time-zone gap.
          </p>
        </section>

        <section id="role" className="case-section">
          <h2>My Role</h2>
          <p>
            My scope covered four categories of product-design work:
          </p>
          <ul>
            <li><strong>Competitive research</strong> across public event-coordination products.</li>
            <li><strong>Gap analysis</strong> against the team&rsquo;s proposed feature set.</li>
            <li><strong>Concept design and prototyping</strong> for the product&rsquo;s first scenario, covering both host and guest flows.</li>
            <li><strong>Usability testing</strong> as lead facilitator across multiple rounds, from participant recruitment through session facilitation, synthesis, and iteration.</li>
          </ul>
          <p>
            The role was framed around{" "}
            <mark className="hl">clarity of thinking over production output</mark>, focusing on
            bringing an outside-in perspective to an early-stage product exploration.
          </p>
        </section>

        <section id="materials" className="case-section">
          <h2>Detailed Materials</h2>
          <p>
            Detailed case-study materials, including competitive research synthesis, prototype
            walkthroughs, testing findings, and design iterations, are available upon request.
            Approval to share specific engagement artifacts is currently being pursued with the
            sponsor; in the meantime, I am happy to share what has already been approved on a
            case-by-case basis.
          </p>
          <p>
            <strong>Recruiters and hiring managers:</strong> please reach out via the{" "}
            <a
              href="/#connect"
              style={{ color: "var(--accent-on-cream)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              Connect
            </a>{" "}
            section with your name, role, and company. I will follow up with the appropriate
            approved materials.
          </p>
        </section>
      </main>
    </div>
  );
}
