import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};

/* Outcome leads so recruiters see results first. Process is broken
   into its three actual phases (Researching, Ideating, Verifying) so
   the nav exposes the work rather than collapsing it under a single
   "Process" label — matches the structure used in Frogslayer.

   NDA note: this case study operates under the Purdue UXD Studio
   Student IP/NDA Agreement. Content submitted to the sponsor for
   review per Section 6.a.iv approval process; while review is
   pending, product-specific mechanics, UI details, proprietary
   terminology, and identifying research findings have been kept at
   a process/methodology level. The sponsor may require modifications
   per Section 6.a.iv, which will be applied on receipt. */
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
        meta="Spring 2026 · 14 weeks · UX Designer & Researcher"
        subtitle="An agentic AI concept for keeping customer journey maps accurate and trustworthy over time"
        imageLabel="AI maintenance agent · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          Confidential and proprietary details have been removed or anonymized to protect client information.
        </p>

        {/* ───── Outcome ───── */}
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
            The sponsor — an <mark className="hl">anonymous customer journey management platform</mark> —
            operates a category of tool teams use to close the gap in understanding their customers&rsquo;
            experience across a product. Our team was asked to explore how{" "}
            <mark className="hl">agentic and maintenance AI</mark> could help these teams keep their journey
            documentation current.
          </p>

          <h3>The Problem</h3>
          <p>
            A journey map&rsquo;s value <mark className="hl">degrades over time</mark> as source realities shift
            faster than the documentation is refreshed. The platform&rsquo;s users — CX strategists,
            designers, and product teams — are tasked with managing and analyzing these maps, but{" "}
            <mark className="hl">maintenance becomes increasingly difficult as the volume of content grows</mark>.
            Without a system for flagging staleness, teams rely on manual review cadences and indirect cues,
            and confidence in the maps quietly erodes.
          </p>

          <h3>My Role</h3>
          <p>
            I worked as a UX Designer &amp; Researcher within a studio team. I{" "}
            <mark className="hl">led concept ideation and exploration</mark> and contributed to research synthesis,
            wireframing, high-fidelity prototyping, and usability testing.
            <br></br><br></br>
            In addition to leading ideation, I managed communication between{" "}
            <mark className="hl">the team, the sponsor leads, and platform users</mark> — ensuring alignment
            on project progression, sponsor goals, and user needs through update meetings, update emails, and
            interview organization. I also mentored junior designers joining the studio.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding What Would Make a Maintenance Agent Effective</h3>

          <p className="research-throughline-lead">
            <strong>The throughline:</strong> the research surfaced a coherent set of principles about
            <mark className="hl"> how maintenance actually happens today and what earns user trust in
            AI-driven suggestions</mark>. Specific findings are withheld pending sponsor approval.
          </p>
          <p>
            We arrived there through four research lenses:{" "}
            <mark className="hl">the platform&rsquo;s current state, the agent&rsquo;s underlying components,
            the industry, and our users.</mark>
          </p>

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
                <div className="image-slot">current-state audit — text blurred</div>
                <figcaption>
                  The audit artifact with text intentionally blurred so the structure of the review reads
                  while platform-specific content stays under confidentiality.
                </figcaption>
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Track 2</span>
              <h3>Current State of Agent Components</h3>
              <p>
                A parallel track surveyed the AI components a maintenance agent would need to rest on:{" "}
                <mark className="hl">the categories of AI involved, how they monitor, and what makes users
                trust them</mark>. Specific findings from this survey are withheld pending sponsor approval.
              </p>
              <figure>
                <div className="image-slot">agent-components synthesis — text blurred</div>
                <figcaption>
                  The components synthesis with text blurred so the framework shape reads without exposing the
                  filled analysis.
                </figcaption>
              </figure>
            </div>
          </div>

          <h3>Industry &amp; Interaction Patterns</h3>
          <p>
            A competitive analysis across two groups — <mark className="hl">direct competitors</mark> in
            the journey-management category and <mark className="hl">indirect competitors</mark> from analogous
            AI-driven SaaS — then triangulated through an interaction-pattern synthesis of several
            verification-focused platforms.
          </p>
          <p>
            <strong>Direct group.</strong> Public products competing in the same journey-management space
            as the sponsor.
          </p>
          <figure>
            <div className="image-slot">competitive analysis — text blurred</div>
            <figcaption>
              The competitive analysis artifact with text blurred so the framework structure is visible while
              the filled synthesis (sponsor work product) stays under confidentiality.
            </figcaption>
          </figure>
          <p>
            <strong>Indirect group.</strong> Analogous AI-driven SaaS solving parallel monitoring + insight
            problems. Cross-group synthesis surfaced shared structural patterns; specific conclusions are
            withheld pending sponsor approval.
          </p>
          <figure>
            <div className="image-slot">indirect competitor synthesis — text blurred</div>
            <figcaption>
              Indirect competitor synthesis with text blurred; framework structure reads without exposing the
              filled content.
            </figcaption>
          </figure>
          <p>
            We then combined both groups through an{" "}
            <mark className="hl">interaction-pattern synthesis</mark> of several public knowledge-verification
            platforms — surfacing the structural moves every modern verification flow shares.
          </p>
          <figure>
            <div className="image-slot">verification-pattern template — empty, no content</div>
            <figcaption>
              The verification-pattern synthesis template itself, shown empty — the structure of the framework
              is visible without the specific platforms or filled analysis being exposed.
            </figcaption>
          </figure>

          <h3>User Interviews</h3>
          <p>
            Interviews with current CX strategists and UX researchers (affinity-diagrammed) confirmed the
            desk research&rsquo;s direction. Specific participant findings and interview counts are held
            under confidentiality pending sponsor approval.
          </p>
          <figure>
            <div className="image-slot">interview affinity diagram — finding text blurred, categorization visible</div>
            <figcaption>
              Interview synthesis shown as clusters of findings — the individual sticky-note content is blurred,
              but the categorization labels above each cluster remain clearly readable so the synthesis
              structure is legible without exposing the specific findings.
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

          <h3>Sketching</h3>
          <p>
            Each designer started with <mark className="hl">Crazy 8&rsquo;s</mark>, then we walked through
            everyone&rsquo;s sheets together and combined the strongest threads through{" "}
            <mark className="hl">group whiteboarding</mark>.
          </p>
          <figure>
            <div className="image-slot">Crazy 8&rsquo;s + group whiteboarding — shown unblurred</div>
            <figcaption>
              Individual ideation into a collaborative whiteboarding session, shown without any blur or
              redaction — hand sketches are inherently low-fidelity and don&rsquo;t reveal platform specifics.
            </figcaption>
          </figure>

          <h3>Concept Proposals</h3>
          <p>
            We presented <mark className="hl">a set of mid-fidelity concept directions</mark> to the sponsor
            with the research evidence behind each. The sponsor selected two complementary directions to move
            forward with. Specifics of the concepts, the exact count, and the two selected are withheld per
            the confidentiality agreement.
          </p>
          <figure>
            <div className="image-slot">six concept proposals — 4 direction + 2 exploratory + composite</div>
            <figcaption>
              The six concept proposals presented to the sponsor — four core directions alongside two slightly
              more exploratory concepts — with a companion visual showing how elements from all six informed
              the two directions the sponsor ultimately selected to move forward with.
            </figcaption>
          </figure>

          <h3>Wireframing &amp; Merging into One System</h3>
          <p>
            Wireframing both selected concepts in parallel revealed <mark className="hl">heavy overlap</mark>{" "}
            — they relied on the same context and evidence. Rather than shipping two parallel surfaces, we{" "}
            <mark className="hl">merged them into a single agentic system</mark>. The specific interaction
            mechanics of that unified system are withheld pending sponsor approval.
          </p>
          <figure>
            <div className="image-slot">two conceptions combining into one — blurred wireframes, focus text visible</div>
            <figcaption>
              Blurred wireframes of the two selected concepts merging into one — the wireframe content is
              blurred to protect product mechanics, but each frame&rsquo;s main focus label stays clearly
              readable so the merge logic is legible.
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

          <h3>Hi-Fi Prototyping</h3>
          <p>
            We built an interactive Figma prototype that expressed the unified concept end-to-end, applying the
            <mark className="hl"> trust principles the research had surfaced</mark>. Every design move traced
            back to one of those principles. The specific principles and how they were expressed in the UI are
            withheld pending sponsor approval.
          </p>
          <figure>
            <div className="image-slot">anonymized wireframe · component-anatomy diagram (lorem-ipsum content)</div>
            <figcaption>
              An anonymized wireframe showing the anatomy of one component — content replaced with lorem
              ipsum, sponsor branding and navigation removed.
            </figcaption>
          </figure>

          <h3>Usability Testing</h3>
          <p>
            Participants experienced in journey mapping ran through a set of tasks comparing entry-point
            navigations and probing whether users found the AI&rsquo;s evidence trustworthy. Testing surfaced
            friction points which we addressed in iteration. Specific findings and participant counts are
            held under confidentiality pending sponsor approval.
          </p>
          <figure>
            <div className="image-slot">usability-testing affinity diagram — finding text blurred, categorization visible</div>
            <figcaption>
              Session findings shown as clusters — the individual sticky-note content is blurred, but the
              categorization labels above each cluster remain clearly readable so the synthesis structure is
              legible without exposing the specific findings.
            </figcaption>
          </figure>

          <h3>Iterations</h3>
          <p>
            Iterations focused on clarifying interactable affordances, restructuring information density, and
            simplifying flow between related agent capabilities. Each iteration was traceable back to a specific
            usability finding — we shipped an <em>insight → reasoning → proposed iteration</em>{" "}
            table so the closed-loop reasoning was visible on one page.
          </p>
          <p>
            Honest handoff notes flagged what we couldn&rsquo;t verify in time, along with recommended next steps
            for onboarding and real-user validation.
          </p>
          <figure>
            <div className="image-slot">insight → iteration table (generic wording, non-proprietary)</div>
            <figcaption>
              A generic-worded rewrite of the iteration table — describes reasoning, not proprietary
              functionality.
            </figcaption>
          </figure>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            The core design lesson: for AI that edits people&rsquo;s work,{" "}
            <mark className="hl">trust is the feature</mark>. Every mechanism that tested well was a trust
            mechanism first and an interaction second.
          </p>
          <p>
            I also learned the value of <mark className="hl">letting research kill symmetry</mark>: we started
            with two separate concepts and only earned the simpler, unified design by wireframing both far enough
            to see they were the same system. And I learned to design within an existing product context —
            every decision had to fit the platform&rsquo;s established patterns and its users&rsquo; mental
            models.
          </p>
        </section>
      </main>
    </div>
  );
}
