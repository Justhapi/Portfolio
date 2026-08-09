import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";

/* Case-study images are co-located with the route — imported as ES
   modules so Webpack bundles them into /_next/static/media/ at build
   time with hashed filenames. basePath (/Portfolio in prod) is
   applied automatically by Next.js, so no manual prefixing needed. */
import platformAudit from "./images/Platform_Audit_Visual.webp";
import agentComponents from "./images/Ai_Agent_Components_Visual.webp";
import directCompetitor from "./images/Direct_Competitor_Visual.webp";
import indirectCompetitor from "./images/Indirect_Competitor_Visual.webp";
import interactionPattern from "./images/Interaction_Pattern_Visual.webp";
import interviewNotes from "./images/Interview_Notes_Visual.webp";
import interviewAffinity from "./images/Interview_Affinity_Diagramming.webp";
import crazyEightSketch from "./images/Crazy_Eight_Sketch.webp";
import whiteboardConcept from "./images/Whiteboard_Concept.webp";
import usabilityTesting from "./images/Usability_Test_Feedback_Visual.webp";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};
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
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>~30 days after handoff</strong>, the sponsor announced the AI agent going
              live in beta — with designs and features that closely mirror the concept our team
              delivered.
            </p>
            <p className="outcome-callout__meta">
              Spring 2026 · JourneyTrack platform · concept → beta
            </p>
          </aside>

          <p>
            We delivered a <mark className="hl"> concept expressed through a high-fidelity interactive prototype and 
            design-principle documentation </mark>{" "} to the sponsor&rsquo;s leadership. The deliverables defined
            <mark className="hl"> an AI maintenance agent</mark> that could keep customer journey maps accurate and trustworthy over time.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            The sponsor operates a customer journey management platform that teams use to close
            the gap in understanding their customers&rsquo; experience across a product. Our team
            was asked to explore how{" "}
            <mark className="hl">an AI maintenance agent</mark> could be implemented into the
            platform to help teams keep their journey maps accurate.
          </p>

          <h3>The Problem</h3>
          <p>
            The platform&rsquo;s users (CX strategists, designers, and product teams) are often
            tasked with <mark className="hl">managing, updating, and analyzing data within customer journey maps</mark>.
            <br></br><br></br>
            However, without a system for flagging data staleness, teams currently rely on manual
            and potentially inaccurate review cadences. As a result, the journey maps&rsquo; value
            inevitably degrades over time as the scale and difficulty of maintenance grow alongside
            the volume of content.
          </p>
          <h3>My Role</h3>
          <p>
            I worked as a UX Designer &amp; Researcher on this project,{" "}
            <mark className="hl">leading concept ideation and exploration</mark> and contributing
            to research synthesis, wireframing, high-fidelity prototyping, and usability testing.
            <br></br><br></br>
            In addition to leading ideation, I{" "} also
            <mark className="hl">managed communication between the team, sponsor leads, and platform users</mark>
            {" "}to ensure alignment on project progression, sponsor goals, and user needs — through
            organizing update meetings, update emails, and interviews. I also mentored the junior
            designers joining the studio on Figma onboarding and studio deliverable expectations.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding What Makes an AI Maintenance Agent Effective in Existing Platform</h3>
          <p>
            To effeciently conceptualize an AI maintenance agent, we explored four research focuses: the platform&rsquo;s current state,
            the agent&rsquo;s required components, the current industry, and the current user
            needs.
          </p>

          <p className="research-split-lead">
            To cover each focus within a tight time frame, we{" "}
            <mark className="hl">split into two sub-teams running in parallel across two sprints</mark>,
            reconvening after each sprint to share findings with the other team.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Track 1 · My team</span>
              <h3>Current State of Platform</h3>
              <p>
                I audited the platform as a user, exploring{" "}
                <mark className="hl">its features across functionality and placement</mark> to
                better ideate aspects of the agent such as its <mark className="hl">placement within the existing UI
                and integration with related features.</mark>
              </p>
              <figure>
                <ZoomableImage
                  src={platformAudit.src}
                  alt="Platform audit board — sticky notes on screenshots. All content anonymized; sponsor name and specific findings replaced with category-level labels."
                  aspectRatio={3975 / 2922}
                  caption={
                    <>
                      My platform audit board containing sticky notes on blurred platform screenshots, color-coded
                      by category.
                    </>
                  }
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Track 2 · Partner team</span>
              <h3>Current State of Agent Components</h3>
              <p>
                The partner team surveyed the AI components that a maintenance agent would require:{" "}
                <mark className="hl">the types of AI, categories of monitoring, and user trust of AI</mark>.
                {" "}
              </p>
              <figure>
                <ZoomableImage
                  src={agentComponents.src}
                  alt="Agent-components synthesis board — five research-lens categories with sticker clusters. Sticker content blurred; framework structure and section labels legible."
                  aspectRatio={5128 / 3458}
                  caption={
                    <>
                      The agent-components synthesis the partner team authored — five research-lens
                      columns with blurred sticker clusters.
                    </>
                  }
                />
              </figure>
            </div>
          </div>

          <h3>Industry &amp; Interaction Patterns</h3>
          <p>
            We then conducted competitive analysis of  <mark className="hl">direct and indirect competitors</mark> to understand the 
            current state of the AI agent industry.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Direct · My team</span>
              <h3>4 Direct Journey-management Competitors</h3>
              <p>
                I audited one of the four direct competitors hands-on, focusing on three aspects of the platform's AI: {" "}
                <mark className="hl">user interactions, reach within the platform, and user flow pain points.</mark>{" "}
              </p>
              <figure>
                <ZoomableImage
                  src={directCompetitor.src}
                  alt="Direct-competitor analysis board — three columns: Agent & User Interactions, Agent's Components within Platform, Agent's Pain Points. Screenshots blurred, sticker text category-level only. Competitor logo redacted."
                  aspectRatio={7696 / 2260}
                  caption={
                    <>
                      My direct-competitor analysis focused on three columns (Agent &amp; User Interactions,
                      Agent&rsquo;s Components within Platform, Agent&rsquo;s Pain Points) with blurred
                      screenshots and category-labeled stickers.
                    </>
                  }
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Indirect · Partner team</span>
              <h3>3 Indirect Analogous AI-driven SaaS Competitors</h3>
              <p>
                The partner team focused on auditing products that utilize AI to analyze customer data for feedback and insights.
              </p>
              <figure>
                <ZoomableImage
                  src={indirectCompetitor.src}
                  alt="Indirect-competitor analysis board — analogous AI-driven SaaS platforms audited for cross-domain pattern references. Screenshots blurred; sticker text category-level only."
                  aspectRatio={3380 / 2204}
                  caption={
                    <>
                      The partner team&rsquo;s indirect-competitor analysis of analogous AI-driven
                      SaaS platforms, feeding cross-domain pattern references into our synthesis.
                    </>
                  }
                />
              </figure>
            </div>
          </div>
          <p>
            After the competitive analysis, we then moved onto examining interaction patterns within knowledge-verification platforms to surface the structural 
            moves every modern verification flow currently shares.
          </p>
          <figure>
            <ZoomableImage
              src={interactionPattern.src}
              alt="Interaction-pattern synthesis: Nielsen 10-heuristic evaluation of a competitor platform + agent, paired with four user-flow diagrams categorized by content-manipulation type. Screenshots blurred; sticker text category-level only."
              aspectRatio={4727 / 1576}
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
            To verify that the direction the desk research pointed toward matched what platform
            users needed from an AI agent focused on journey-map maintenance, the team ran{" "}
            <mark className="hl">six interviews with current users of the sponsor&rsquo;s platform</mark>.
          </p>
          <p>
            I <mark className="hl">participated in three of the six one-hour sessions</mark>,
            rotating between interviewer and note-taker with my partner during each session. After
            all six interviews were completed, we categorized the insights to determine the
            platform-relevant user needs the AI agent had to address.
          </p>
          <figure>
            <ZoomableImage
              src={interviewNotes.src}
              alt="Session notes from the three interviews I participated in — text blurred so note-taking structure and volume read without exposing participant-level findings."
              aspectRatio={4746 / 1517}
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
              src={interviewAffinity.src}
              alt="Cross-session affinity diagram — nine themed clusters with headers visible, individual sticky-note content blurred. Draws from all six interviews."
              aspectRatio={3996 / 2413}
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
            Each designer ideated during the Crazy 8&rsquo;s sprint before walking through everyone&rsquo;s
            ideas together and combining the most supported features through group whiteboarding.{" "}
          </p>
          <figure>
            <ZoomableImage
              src={crazyEightSketch.src}
              alt="My Crazy 8's sketch sheet — hand-drawn low-fidelity ideation quadrants exploring AI-agent feature concepts."
              aspectRatio={2453 / 1664}
              caption={
                <>
                  My Crazy 8&rsquo;s — hand-drawn quadrants of AI-agent feature sketches.
                </>
              }
            />
          </figure>
          <p>
            During the idea walkthroughs, I pitched a concept direction focusing on our recurring
            themes of user inputs, resulting in me{" "}
            <mark className="hl">leading a rules-based approach to the agent concept</mark>.
            <br></br><br></br>
            Although it was ultimately not selected as a final concept during the sponsor&rsquo;s
            assessment, elements of it were integrated into the concepts that were.
          </p>
          <figure>
            <ZoomableImage
              src={whiteboardConcept.src}
              alt="Whiteboarding session I led on a rules-based direction that was ultimately not selected. Shown at full content pending sponsor review."
              aspectRatio={5290 / 3588}
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
            We presented <mark className="hl">six concept proposals</mark> to the sponsor —
            including the rules-based whiteboarded direction I led (shown above) — each paired
            with the research evidence behind it. The sponsor selected two complementary
            directions to move forward with.
          </p>

          <h3>Wireframing &amp; Eventual Merging into One System</h3>
          <p>
            Wireframing the two concepts in parallel later revealed heavy overlap in context and
            evidence. Rather than shipping two parallel surfaces, we{" "}
            <mark className="hl">merged them into a single agentic system</mark>.
            <br></br><br></br>
            Because the wireframes are built on the sponsor&rsquo;s platform UI, they aren&rsquo;t
            shown here to comply with the NDA.
          </p>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Prototyping and Testing the Unified Concept</h3>
          <p>
            We took the combined concept into{" "}
            <mark className="hl">high-fidelity prototyping, usability testing, and iteration</mark>.
            The process below describes how the work was structured.
          </p>

          <h3>Hi-Fi Prototyping</h3>
          <p>
            We built an interactive Figma prototype that expressed the unified concept end-to-end
            through user flows, applying the{" "} <mark className="hl">insights the research had surfaced</mark>.
            <br></br><br></br>
            Because the prototype was constructed directly on the sponsor&rsquo;s platform
            surface, the screens themselves aren&rsquo;t shown here.
          </p>

          <h3>Usability Testing</h3>
          <p>
            To avoid setting false expectations about feature directions that might not be
            implemented, the sponsor asked us{" "}
            <mark className="hl">to each recruit a UX Design major classmate familiar with journey mapping as substitute testers</mark>.
            <br></br><br></br>
            During each usability test, we had participants complete three tasks that probed
            navigating and using the concept prototype&rsquo;s features, followed by a reflection
            round.
          </p>
          <figure className="visual-compact">
            <ZoomableImage
              src={usabilityTesting.src}
              alt="Usability-testing feedback affinity — four rows: Task 1 (Initial Navigation), Task 2 (Informed Map Modifications / Updating), Task 3 (Further AI Agent Interactions), Reflections (General Thoughts of Concept and User Flow). Sticky-note content blurred; row labels legible."
              aspectRatio={1980 / 1291}
              caption={
                <>
                  Notes from the usability test I conducted.
                </>
              }
            />
          </figure>

          <h3>Iterations</h3>
          <p>
            After the round of usability tests, we then categorized the insights to determine iteration focuses.
            The resulting iterations focused on agent access, information organization, and user flow simplification.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <h3>Design Decision-Making Related to Platform</h3>
          <p>
            This project was my first time{" "}
            <mark className="hl">designing within an existing product context and design system</mark>.
            The first half was exploratory and general regarding takeaways, but the second half
            focused heavily on the platform&rsquo;s own needs, making it natural to narrow
            down findings to apply to the final product later on.
            <br></br><br></br>
            <mark className="hl">Narrowing down scope was a challenge I had previously addressed early</mark> on when
            constructing the first set of guidelines for Frogslayer. I now understand that
            <mark className="hl">specific factors, like a project&rsquo;s theme of expansion, hints at its unique
            expected window for scope narrowing.</mark>
          </p>
        </section>
      </main>
    </div>
  );
}
