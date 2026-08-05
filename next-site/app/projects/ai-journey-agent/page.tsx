import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";

const basePath =
  process.env.NODE_ENV === "production" ? "/Portfolio" : "";

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
        meta="Spring 2026 · 14 weeks · UX Designer & Researcher · Concept shipped to beta"
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
          <p>
            <mark className="hl">Roughly a month after handoff (late April → mid-May 2026), the sponsor
            announced the AI agent going live in beta</mark> — with designs and features that closely mirror
            the concept our team delivered.
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
            To cover both within the project window, we split into two sub-teams running in parallel:{" "}
            <mark className="hl">I owned the platform audit; a partner sub-team surveyed the underlying
            agent-component landscape.</mark> Their headline takeaways fed my synthesis, so both tracks
            converged on the same set of design principles.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Track 1 · Mine</span>
              <h3>Current State of Platform</h3>
              <p>
                I audited the platform as a user, logging{" "}
                <mark className="hl">what worked and where the gaps were</mark> before proposing anything new.
                Specific findings are omitted here per the confidentiality agreement; the takeaways informed the
                design principles we later documented.
              </p>
              <figure>
                <ZoomableImage
                  src={`${basePath}/img/journey-agent/platform-audit.webp`}
                  alt="Platform audit board — sticky notes on screenshots. All content anonymized for confidentiality; sponsor name and specific findings are replaced with category-level labels."
                  aspectRatio={1556 / 2200}
                  caption={
                    <>
                      My platform audit board — sticky notes on blurred platform screenshots, organized
                      by category labels.
                    </>
                  }
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Track 2 · Partner sub-team</span>
              <h3>Current State of Agent Components</h3>
              <p>
                A partner sub-team surveyed the AI components a maintenance agent would need to rest on:{" "}
                <mark className="hl">the categories of AI involved, how they monitor, and what makes users
                trust them</mark>. I carried their headline takeaways into the shared synthesis so both tracks
                fed the same design decisions. Specific findings from their survey are withheld pending sponsor
                approval.
              </p>
              <figure>
                <ZoomableImage
                  src={`${basePath}/img/journey-agent/agent-components.webp`}
                  alt="Agent-components synthesis board — five research-lens categories with sticker clusters. Sticker content blurred; only the framework structure and section labels are legible."
                  aspectRatio={3000 / 2052}
                  caption={
                    <>
                      The agent-components synthesis my partner sub-team authored — five research-lens
                      columns with blurred sticker clusters.
                    </>
                  }
                />
              </figure>
            </div>
          </div>

          <h3>Industry &amp; Interaction Patterns</h3>
          <p>
            A competitive analysis across two groups — <mark className="hl">direct competitors</mark> in
            the journey-management category and <mark className="hl">indirect competitors</mark> from analogous
            AI-driven SaaS — <mark className="hl">run concurrently</mark> by two sub-teams and later
            triangulated through an interaction-pattern synthesis of several verification-focused platforms.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Direct · Mine</span>
              <h3>Journey-management competitors</h3>
              <p>
                Public products competing in the same journey-management space as the sponsor. My analysis
                of one competitor across three lenses (agent interactions, components within the platform,
                and pain points).
              </p>
              <figure>
                <ZoomableImage
                  src={`${basePath}/img/journey-agent/direct-competitor.webp`}
                  alt="Direct-competitor analysis board — three columns: Agent & User Interactions, Agent's components within platform, Agent's pain points. Screenshots blurred, sticker text kept at category level only. Competitor logo redacted."
                  aspectRatio={3000 / 741}
                  caption={
                    <>
                      My direct-competitor analysis — three columns (Agent &amp; User Interactions,
                      Agent&rsquo;s Components within Platform, Agent&rsquo;s Pain Points) with blurred
                      screenshots and category-labeled stickers.
                    </>
                  }
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Indirect · Partner sub-team</span>
              <h3>Analogous AI-driven SaaS</h3>
              <p>
                Products solving parallel monitoring + insight problems outside the journey-management
                category. <mark className="hl">Researched by a partner sub-team</mark>; I integrated their
                headline takeaways into my direct-group synthesis so both feeds converged on the same
                structural patterns.
              </p>
            </div>
          </div>
          <p>
            We then combined both groups through an{" "}
            <mark className="hl">interaction-pattern synthesis</mark> of several public knowledge-verification
            platforms — surfacing the structural moves every modern verification flow shares.
          </p>
          <figure>
            <ZoomableImage
              src={`${basePath}/img/journey-agent/interaction-pattern.webp`}
              alt="Interaction-pattern synthesis: Nielsen 10-heuristic evaluation of a competitor platform + agent, paired with four user-flow diagrams categorized by content-manipulation type. All screenshots heavily blurred; sticker text at category level only."
              aspectRatio={2567 / 3000}
              caption={
                <>
                  Interaction-pattern synthesis — Nielsen 10-heuristic evaluation (violation +
                  recommendation columns) paired with four user-flow diagrams categorized by
                  content-manipulation type (creation, organization, creation-with-user-input,
                  summarization).
                </>
              }
            />
          </figure>

          <h3>User Interviews</h3>
          <p>
            The team ran <mark className="hl">six interviews with current users of the sponsor&rsquo;s
            platform</mark>. The purpose was to <mark className="hl">check that the direction the desk
            research pointed toward would match what platform users needed from an AI agent maintaining
            journey-map health</mark>.
          </p>
          <p>
            I <mark className="hl">participated in three of the six one-hour sessions</mark>, rotating
            between interviewer and note-taker roles with my partner within each session so neither of us
            burned out. Notes below are from the sessions I was in; the affinity synthesis draws from all
            six.
          </p>
          <figure>
            <ZoomableImage
              src={`${basePath}/img/journey-agent/interview-notes.webp`}
              alt="Session notes from the three interviews I participated in — text blurred throughout so note-taking structure and volume read without exposing participant-level findings."
              aspectRatio={3000 / 2121}
              caption={
                <>
                  My session notes from the three interviews I participated in — blurred sticky notes on
                  a paper background.
                </>
              }
            />
          </figure>
          <figure>
            <ZoomableImage
              src={`${basePath}/img/journey-agent/interview-affinity.webp`}
              alt="Cross-session affinity diagram — nine themed clusters with headers visible, individual sticky-note content blurred. Draws from all six interviews."
              aspectRatio={3000 / 1555}
              caption={
                <>
                  Team affinity synthesis across all six interviews — nine themed clusters with visible
                  headers and blurred sticky content.
                </>
              }
            />
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
            <mark className="hl">group whiteboarding</mark>. <mark className="hl">I led one of the
            whiteboarded directions</mark> — a rules-based approach that was ultimately not selected as the
            final concept, though elements of the thinking informed the direction that was.
          </p>
          <figure>
            <ZoomableImage
              src={`${basePath}/img/journey-agent/crazy-eight-sketch.webp`}
              alt="My Crazy 8's sketch sheet — hand-drawn low-fidelity ideation quadrants exploring AI-agent feature concepts."
              aspectRatio={3000 / 2110}
              caption={
                <>
                  My Crazy 8&rsquo;s — hand-drawn quadrants of AI-agent feature sketches.
                </>
              }
            />
          </figure>
          <figure>
            <ZoomableImage
              src={`${basePath}/img/journey-agent/whiteboard-concept.webp`}
              alt="Whiteboarding session I led on a rules-based direction that was ultimately not selected. Shown at full content pending sponsor review."
              aspectRatio={3000 / 2035}
              caption={
                <>
                  A whiteboarding session I led on a rules-based direction that was not selected as the
                  final concept. Elements of the human-in-the-loop rule editing informed the direction
                  the sponsor did select.
                </>
              }
            />
          </figure>

          <h3>Concept Proposals</h3>
          <p>
            We presented <mark className="hl">six concept proposals</mark> to the sponsor — including the
            rules-based whiteboarded direction I led (shown above) — each paired with the research evidence
            behind it. The sponsor selected two complementary directions to move forward with. Specifics of
            the concepts and the two selected are withheld per the confidentiality agreement.
          </p>

          <h3>Wireframing &amp; Merging into One System</h3>
          <p>
            Wireframing both selected concepts in parallel revealed <mark className="hl">heavy overlap</mark>{" "}
            — they relied on the same context and evidence. Rather than shipping two parallel surfaces, we{" "}
            <mark className="hl">merged them into a single agentic system</mark>. Wireframes are not shown
            because the prototype was built directly on top of the sponsor&rsquo;s platform surface;
            interaction mechanics are withheld pending sponsor approval.
          </p>
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
            back to one of those principles. Prototype screens are not shown because the concept was
            constructed directly on the sponsor&rsquo;s platform surface; the specific principles and how they
            were expressed in the UI are withheld pending sponsor approval.
          </p>

          <h3>Usability Testing</h3>
          <p>
            The sponsor asked us <mark className="hl">not to test the prototype on their current customers or
            our earlier interviewees</mark> — to avoid setting false expectations about features they might not
            actually implement. As substitutes we recruited <mark className="hl">UX Design major classmates
            familiar with journey mapping</mark>, running each participant through{" "}
            <mark className="hl">three tasks</mark> that probed navigating and using the concept
            prototype&rsquo;s features, followed by a reflection round.
          </p>
          <figure>
            <ZoomableImage
              src={`${basePath}/img/journey-agent/usability-testing.webp`}
              alt="Usability-testing feedback affinity — four rows: Task 1 (Initial Navigation), Task 2 (Informed Map Modifications / Updating), Task 3 (Further AI Agent Interactions), Reflections (General Thoughts of Concept and User Flow). Individual sticky-note content blurred; row labels legible."
              aspectRatio={3000 / 2178}
              caption={
                <>
                  Usability testing findings clustered by task — Task 1 (Initial Navigation), Task 2
                  (Informed Map Modifications / Updating), Task 3 (Further AI Agent Interactions), and
                  Reflections. Blurred sticky notes with visible row labels.
                </>
              }
            />
          </figure>

          <h3>Iterations</h3>
          <p>
            Iterations focused on clarifying interactable affordances, restructuring information density, and
            simplifying flow between related agent capabilities. Each iteration was traceable back to a specific
            usability finding — we shipped an <em>insight → reasoning → proposed iteration</em>{" "}
            table so the closed-loop reasoning was visible on one page. The iteration artifacts themselves are
            not shown because they render on the sponsor&rsquo;s platform surface.
          </p>
          <p>
            Honest handoff notes flagged what we couldn&rsquo;t verify in time, along with recommended next
            steps for onboarding and real-user validation.
          </p>
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
