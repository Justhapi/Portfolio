import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};

/* Outcome leads so recruiters see results first. Process is broken
   into its three actual phases (Researching, Ideating, Verifying) so
   the nav exposes the work rather than collapsing it under a single
   "Process" label — matches the structure used in Frogslayer.

   NDA note: this case study operates under a strict sponsor
   confidentiality agreement. Content is intentionally kept at a
   process/methodology level — feature mechanics, product UI details,
   proprietary terminology, and any interview findings that could
   identify the sponsor, its clients, or its platform users have been
   removed or generalized. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "ideating", label: "Ideating" },
  { id: "verifying", label: "Verifying" },
  { id: "takeaways", label: "Takeaways" },
];

export default function AIJourneyAgentCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Designing an AI Maintenance Agent for Customer Journey Maps"
        meta="Spring 2026 · 14 weeks · 9-person team · UX Designer & Researcher"
        subtitle="An agentic AI concept for keeping customer journey maps accurate and trustworthy over time"
        imageLabel="AI maintenance agent · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          This case study operates under an active sponsor confidentiality agreement. Product-specific mechanics,
          UI details, proprietary terminology, and identifying research findings have been removed or generalized.
          The content below focuses on the design and research process rather than the resulting product.
        </p>

        {/* ───── Outcome ───── (moved to top: recruiters see outcome first) */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            We delivered a <mark className="hl">high-fidelity interactive concept prototype</mark> and{" "}
            <mark className="hl">design-principle documentation</mark> to the sponsor&rsquo;s leadership. The work
            defined how an agentic AI concept could{" "}
            <mark className="hl">keep a class of living documents accurate and trustworthy over time</mark> —
            grounded in a set of trust principles the research surfaced, and validated through usability testing at
            the concept level.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            The sponsor operates a{" "}
            <mark className="hl">customer journey management platform</mark> &mdash; a category of tool teams use
            to close the gap in understanding their customers&rsquo; experience across a product. Our team was
            asked to explore how <mark className="hl">agentic and maintenance AI</mark> could help these teams
            keep their journey documentation current.
          </p>

          <h3>The Problem</h3>
          <p>
            A journey map&rsquo;s value <mark className="hl">degrades over time</mark> as source realities shift
            faster than the documentation is refreshed. The platform&rsquo;s users &mdash; CX strategists,
            designers, and product teams &mdash; are tasked with managing and analyzing these maps, but{" "}
            <mark className="hl">maintenance becomes increasingly difficult as the volume of content grows</mark>.
            Without a system for flagging staleness, teams rely on manual review cadences and indirect cues,
            and confidence in the maps quietly erodes.
          </p>

          <h3>My Role</h3>
          <p>
            I worked in a UX studio team of nine. I{" "}
            <mark className="hl">led concept ideation and exploration</mark> and contributed to research synthesis,
            wireframing, high-fidelity prototyping, and usability testing.
            <br></br><br></br>
            In addition to leading ideation, I managed communication between{" "}
            <mark className="hl">the team, the sponsor leads, and platform users</mark> &mdash; ensuring alignment
            on project progression, sponsor goals, and user needs through update meetings, update emails, and
            interview organization. I also{" "}
            <mark className="hl">mentored three junior designers</mark> joining the studio.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding What Would Make a Maintenance Agent Effective</h3>

          {/* Throughline promoted to the TOP of Researching so a skimmer
              who reads only the first paragraph still walks away with
              the section's payoff. Kept at process-level; no product
              or interview specifics named. */}
          <p className="research-throughline-lead">
            <strong>The throughline:</strong> maintenance today is{" "}
            <mark className="hl">reactive, manual, and tied to project milestones</mark> &mdash;
            and users only trust AI when they can see the reasoning behind its suggestions.
          </p>
          <p>
            We arrived there through four research lenses:{" "}
            <mark className="hl">the platform&rsquo;s current state, the agent&rsquo;s underlying components,
            the industry, and our users.</mark>
          </p>

          {/* ── Parallel research tracks ── */}
          <p className="research-split-lead">
            To cover both within the project window, we{" "}
            <mark className="hl">split into two smaller teams running in parallel:</mark>
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Track 1</span>
              <h3>Current State of Platform</h3>
              <p>
                One track reviewed the platform as a user, logging{" "}
                <mark className="hl">what worked and where the gaps were</mark> before proposing anything new.
                Specific findings are omitted here per the confidentiality agreement; the takeaways informed the
                design principles we later documented.
              </p>
              <figure>
                <div className="image-slot">methodology · current-state audit approach (non-identifying)</div>
                <figcaption>
                  The audit approach; platform-specific findings are held under confidentiality.
                </figcaption>
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Track 2</span>
              <h3>Current State of Agent Components</h3>
              <p>
                A parallel track surveyed the AI components a maintenance agent would need to rest on:{" "}
                <mark className="hl">the categories of AI involved, how they monitor, and what makes users
                trust them</mark>.
                <br></br><br></br>
                We compared <mark className="hl">agentic vs. maintenance AI</mark>, focused on{" "}
                <mark className="hl">proactive (not reactive) monitoring</mark>, and identified the conditions
                that build trust &mdash; <em>transparency, user control, and visible reasoning</em>.
              </p>
              <figure>
                <div className="image-slot">AI-types comparison · monitoring · trust conditions</div>
                <figcaption>
                  Comparing AI types, monitoring approaches, and the conditions that build user trust. Industry-
                  general knowledge, not sponsor material.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* ── Industry & Interaction Patterns ── */}
          <h3>Industry &amp; Interaction Patterns</h3>
          <p>
            A competitive analysis across two groups &mdash; <mark className="hl">direct competitors</mark> in
            the journey-management category and <mark className="hl">indirect competitors</mark> from analogous
            AI-driven SaaS &mdash; then triangulated through an interaction-pattern synthesis of four
            verification-focused platforms.
          </p>
          <p>
            <strong>Direct</strong> &mdash; <em>TheyDo, Cemantica, Smaply.</em> Public products in the
            journey-management space.
          </p>
          <figure>
            <div className="image-slot">methodology diagram · two-ring competitive framework (no filled analysis)</div>
            <figcaption>
              The two-ring competitive framework. The filled synthesis is sponsor work product and is not shown.
            </figcaption>
          </figure>
          <p>
            <strong>Indirect</strong> &mdash; <em>Gong, Observe.AI, Productboard.</em> Analogous SaaS solving
            parallel monitoring + insight problems. They converge on{" "}
            <mark className="hl">proactive monitoring</mark> and turning raw data into{" "}
            <mark className="hl">structured, actionable insights</mark>.
          </p>
          <figure>
            <div className="image-slot">analogous SaaS · Gong · Observe.AI · Productboard</div>
            <figcaption>Public analogous SaaS surveyed for pattern transfer.</figcaption>
          </figure>
          <p>
            We then combined both groups through an{" "}
            <mark className="hl">interaction-pattern synthesis</mark> of Notion, Confluence, Guru, and Alation
            &mdash; four public knowledge-verification platforms &mdash; surfacing the structural moves every
            modern verification flow shares.
          </p>
          <figure>
            <div className="image-slot">annotated verification flow · public platform (e.g., Notion)</div>
            <figcaption>
              Annotated flow of a public third-party verification pattern; shows the method without exposing the
              sponsor&rsquo;s IP.
            </figcaption>
          </figure>

          {/* ── User Interviews ── */}
          <h3>User Interviews</h3>
          <p>
            Six interviews with current CX strategists and UX researchers (affinity-diagrammed) confirmed the
            desk research&rsquo;s direction. Specific participant findings are held under confidentiality; the
            synthesis pattern was that{" "}
            <mark className="hl">maintenance is reactive, project-bound, and manually heavy</mark> today, and{" "}
            <mark className="hl">trust in AI depends on transparent, defensible outputs</mark> &mdash; full
            automation was explicitly not desired.
          </p>
          <figure>
            <div className="image-slot">affinity diagram · text blurred to texture</div>
            <figcaption>
              Interview synthesis with sticky-note text blurred; shows synthesis rigor without exposing findings.
            </figcaption>
          </figure>
        </section>

        {/* ───── Ideating ───── */}
        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <h3>From Individual Sketching to a Sponsor-Selected Direction</h3>
          <p>
            We developed concept directions in three passes:{" "}
            <mark className="hl">sketching, concept proposals, and wireframing</mark>.
          </p>

          {/* ── Sketching ── */}
          <h3>Sketching</h3>
          <p>
            Each designer started with <mark className="hl">Crazy 8&rsquo;s</mark>, then we walked through
            everyone&rsquo;s sheets together and combined the strongest threads through{" "}
            <mark className="hl">group whiteboarding</mark>.
          </p>
          <figure>
            <div className="image-slot">Crazy 8&rsquo;s + group whiteboarding (hand sketches)</div>
            <figcaption>
              Individual ideation into a collaborative whiteboarding session. Hand sketches are inherently
              low-fidelity and don&rsquo;t reveal platform specifics.
            </figcaption>
          </figure>

          {/* ── Concept Proposals ── */}
          <h3>Concept Proposals</h3>
          <p>
            We presented <mark className="hl">six mid-fidelity concept directions</mark> to the sponsor with the
            research evidence behind each. The sponsor selected two complementary directions to move forward
            with. Specifics of the six concepts and the two selected are withheld per the confidentiality
            agreement.
          </p>
          <figure>
            <div className="image-slot">concept proposal method diagram (labels abstracted)</div>
            <figcaption>
              The proposal method &mdash; six directions on one deck; selection driven by evidence-tied trade-offs.
            </figcaption>
          </figure>

          {/* ── Wireframing & Combining ── */}
          <h3>Wireframing &amp; Merging into One System</h3>
          <p>
            Wireframing both selected concepts in parallel revealed <mark className="hl">heavy overlap</mark>{" "}
            &mdash; they relied on the same context and evidence. Rather than shipping two parallel surfaces, we{" "}
            <mark className="hl">merged them into a single agentic system</mark>: a continuous loop where the
            agent anticipates needs while also adapting to user-initiated inquiry. The specific interaction
            mechanics of that unified system are withheld.
          </p>
          <figure>
            <div className="image-slot">abstract concept diagram · two loops converging into one system</div>
            <figcaption>
              Diagram of the reasoning behind the merge &mdash; process-level, not product UI.
            </figcaption>
          </figure>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Prototyping and Testing the Unified Concept</h3>
          <p>
            We took the combined concept into{" "}
            <mark className="hl">high-fidelity prototyping, usability testing, and iteration</mark>. The
            specifics of the mechanics tested are held under confidentiality; the process below describes how the
            work was structured.
          </p>

          {/* ── Hi-Fi Prototyping ── */}
          <h3>Hi-Fi Prototyping</h3>
          <p>
            We built an interactive Figma prototype that expressed the unified concept end-to-end, applying the
            trust principles the research had surfaced &mdash;{" "}
            <mark className="hl">transparency of AI reasoning, evidence pairing, user-in-control approvals,
            reviewable history, and guided assistance</mark>. Every design move traced back to one of those
            principles.
          </p>
          <figure>
            <div className="image-slot">anonymized wireframe · component-anatomy diagram (lorem-ipsum content)</div>
            <figcaption>
              An anonymized wireframe showing the anatomy of one component &mdash; content replaced with lorem
              ipsum, sponsor branding and navigation removed.
            </figcaption>
          </figure>

          {/* ── Usability Testing ── */}
          <h3>Usability Testing</h3>
          <p>
            <mark className="hl">Six participants</mark> experienced in journey mapping ran through three tasks
            comparing two entry-point navigations and probing whether users found the AI&rsquo;s evidence
            trustworthy. Reception was positive on simplicity and{" "}
            <mark className="hl">evidence transparency was explicitly appreciated</mark> &mdash; but testing
            surfaced friction points which we addressed in iteration. Specific findings are held under
            confidentiality.
          </p>
          <figure>
            <div className="image-slot">usability-testing affinity diagram · blurred to texture</div>
            <figcaption>
              Six sessions synthesized into iteration insights. Sticky-note text intentionally blurred.
            </figcaption>
          </figure>

          {/* ── Iterations ── */}
          <h3>Iterations</h3>
          <p>
            Iterations focused on clarifying interactable affordances, restructuring information density, and
            simplifying flow between related agent capabilities. Each iteration was traceable back to a specific
            usability finding &mdash; we shipped an <em>insight &rarr; reasoning &rarr; proposed iteration</em>{" "}
            table so the closed-loop reasoning was visible on one page.
          </p>
          <p>
            Honest handoff notes flagged what we couldn&rsquo;t verify in time, along with recommended next steps
            for onboarding and real-user validation.
          </p>
          <figure>
            <div className="image-slot">insight → iteration table (generic wording, non-proprietary)</div>
            <figcaption>
              A generic-worded rewrite of the iteration table &mdash; describes reasoning, not proprietary
              functionality.
            </figcaption>
          </figure>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            The core design lesson: for AI that edits people&rsquo;s work,{" "}
            <mark className="hl">trust is the feature</mark>. Every mechanism that tested well &mdash; evidence
            pairing, visible reasoning, undoable decisions, review history &mdash; was a trust mechanism first
            and an interaction second.
          </p>
          <p>
            I also learned the value of <mark className="hl">letting research kill symmetry</mark>: we started
            with two separate concepts and only earned the simpler, unified design by wireframing both far enough
            to see they were the same system. And I learned to design within an existing product context &mdash;
            every decision had to fit the platform&rsquo;s established patterns and its users&rsquo; mental
            models.
          </p>
        </section>
      </main>
    </div>
  );
}
