import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Competitive Research Case Study — Kathleen Li",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "process", label: "Process" },
  { id: "approach", label: "How I Worked" },
  { id: "takeaways", label: "Takeaways" },
];

export default function CompetitorResearchCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Competitive Research for an Early-Stage Consumer Product"
        meta="Summer 2026 · Remote · Product Design · Product Design Intern"
        subtitle="An outside-in competitive read shaping where a new consumer product could stand out"
        imageLabel="Competitive research · cover image"
      />

      <main className="case-body">
        <p className="case-disclaimer">
          This is an anonymized overview. The client, product, and proprietary details have been withheld or
          generalized to respect a confidentiality agreement. It focuses on my research process and methods rather
          than the product itself.
        </p>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            I joined an early-stage product team as a <mark className="hl">Product Design Intern</mark>, working
            remotely across a roughly 12-hour time-zone gap. Because the product direction itself was still being
            explored, my role was explicitly <em>outside-in</em>: research how comparable products solve the same
            problem, then pressure-test the team&rsquo;s proposed direction for gaps.
          </p>

          <h3>Context</h3>
          <p>
            The product addresses an everyday coordination problem — planning casual group gatherings, where the key
            details are rarely all settled at the same time. With the direction still being shaped, the team needed
            someone to bring an external benchmark and an honest read on where the plan had holes. The internship was
            framed around clarity of thinking and quality of ideas rather than production output.
          </p>

          <h3>My Role</h3>
          <p>
            My work to date has been research-led. I own the{" "}
            <mark className="hl">competitive research and gap analysis</mark>, and contribute an outside-in
            perspective on opportunities and risks in the proposed direction.
          </p>
        </section>

        {/* ───── Process ───── */}
        <section id="process" className="case-section">
          <h2>Process</h2>

          <h3>A reusable competitive-analysis framework</h3>
          <p>
            Rather than auditing each product ad hoc, I built{" "}
            <mark className="hl">one consistent framework</mark> — covering positioning, key features, strengths and
            weaknesses, business model, and end-to-end host and guest flows — and applied it identically to every
            product so they were directly comparable. I audited six consumer event-coordination and invitation apps,
            testing them hands-on (walking both the host and guest journeys, probing edge cases like reminder
            customization and paywall behavior) rather than reviewing them at surface level.
          </p>
          <figure>
            <div className="image-slot">competitive analysis framework</div>
            <figcaption>
              Anonymized example of the competitive-analysis framework applied consistently across products.
            </figcaption>
          </figure>

          <h3>Cross-app synthesis</h3>
          <p>
            Comparing across the audits revealed how each product made a different bet on the same underlying problem
            — and where the market left whitespace. I presented this research to the team and it became the
            foundation for the next phase.
          </p>

          <h3>Gap analysis with category discipline</h3>
          <p>
            I cross-referenced each competitor&rsquo;s documented weaknesses against the team&rsquo;s proposed
            feature set in a structured table. The key analytical catch: one of the products was a fundamentally
            different <em>category</em> of product, so mechanically applying the table would have{" "}
            <mark className="hl">manufactured false gaps</mark>. Filtering for that left only the genuine,
            category-independent gaps — a more honest and more useful result than a longer, noisier list.
          </p>
        </section>

        {/* ───── How I Worked ───── */}
        <section id="approach" className="case-section">
          <h2>How I Worked</h2>
          <ul>
            <li>
              <strong>Tested products hands-on</strong> instead of reviewing them superficially, so findings
              reflected real user flows, not marketing pages.
            </li>
            <li>
              <strong>Raised blockers early and clearly.</strong> I hit access blockers three times (region-locked
              sign-ups and a paywall) and escalated each by email rather than stalling on them.
            </li>
            <li>
              <strong>Matched effort to scope</strong> in an ambiguous, still-forming project — asking before
              expanding the work rather than assuming.
            </li>
          </ul>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>What I Took Away</h2>
          <p>
            The value of a research role isn&rsquo;t collecting observations — it&rsquo;s{" "}
            <mark className="hl">synthesis</mark>: moving from &ldquo;here&rsquo;s what I saw&rdquo; to
            &ldquo;here&rsquo;s what&rsquo;s missing and what I&rsquo;d recommend.&rdquo; I also learned{" "}
            <em>category discipline</em>: applying an analysis method blindly can produce false findings, and
            judgment about when a method applies matters more than the method itself.
          </p>
        </section>
      </main>
    </div>
  );
}