import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";

import platformAudit from "./images/Platform_Audit_Visual.webp";
import agentComponents from "./images/Ai_Agent_Components_Visual.webp";
import directCompetitor from "./images/Direct_Competitor_Visual.webp";
import indirectCompetitor from "./images/Indirect_Competitor_Visual.webp";
import interactionPattern from "./images/Interaction_Pattern_Visual.webp";
import interviewNotes from "./images/Interview_Notes_Visual.webp";
import interviewAffinity from "./images/Interview_Affinity_Diagramming.webp";
import crazyEightSketch from "./images/Crazy_Eight_Sketch.webp";
import whiteboardConcept from "./images/Whiteboard_Concept.webp";
import conceptRefinement from "./images/Concept_A_Refinement.webp";
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

/* Cover video — served from /public/img/cover so static export copies
   it verbatim. Same pattern as the other case studies. MP4 first —
   VP9-in-WebM decode support is inconsistent across browsers/engines,
   which was causing this cover to render blank or inconsistently. */
const BASE_PATH = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
const COVER_VIDEO = {
  mp4: `${BASE_PATH}/img/cover/Ai_Agent.mp4`,
  webm: `${BASE_PATH}/img/cover/Ai_Agent.webm`,
};
const COVER_POSTER = `${BASE_PATH}/img/cover/Ai_Agent-poster.webp`;

export default function AIJourneyAgentCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Conceptualizing an AI Maintenance Agent for Customer Journey Maps"
        meta="Spring 2026 · 8 weeks · UX Designer & Researcher"
        subtitle="An agentic AI concept for keeping customer journey maps accurate over time"
        imageLabel="AI maintenance agent · cover animation"
        heroVideoSrc={COVER_VIDEO}
        heroVideoPoster={COVER_POSTER}
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer" aria-label="NDA notice">
          <span className="case-disclaimer__badge">NDA</span>
          <span className="case-disclaimer__text">
            This case study covers sponsor work protected by a non-disclosure agreement, 
            specifically the <strong>sponsor company's identity, product name, and prototype featurea
            are anonymized or generalized.</strong>
          </span>
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
                The concept was selected by the sponsor and developed into a high-fidelity prototype that was 
                <strong> handed off to their product team.</strong> Shortly after, the <strong>sponsor shared that an AI maintenance agent 
                was moving into development,</strong> validating the direction the team had explored.
            </p>
            <p className="outcome-callout__meta">
              Spring 2026 · Sponsor platform → Concept · Development
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
            <mark className="hl"> managed communication between the team, sponsor leads, and platform users</mark>
            {" "}to ensure alignment on project progression, sponsor goals, and user needs through
            organizing update meetings, update emails, and interviews. I also mentored the junior
            designers regarding onboarding on Figma and studio deliverable expectations.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding What Makes an AI Maintenance Agent Effective in Existing Platform</h3>
          <p>
            To efficiently conceptualize an AI maintenance agent, we explored four research focuses: the platform&rsquo;s current state,
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
                  alt="My platform audit board of sticky notes on blurred platform screenshots, color-coded by category."
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
                  alt="The agent-components synthesis the partner team authored, categorized into five focuses."
                  aspectRatio={5128 / 3458}
                  caption={
                    <>
                      The agent-components synthesis the partner team authored categorized into five focuses.
                    </>
                  }
                />
              </figure>
            </div>
          </div>

          <h3>Industry &amp; Interaction Patterns</h3>
          <p>
            We then conducted competitive analysis across{" "}
            <mark className="hl">direct journey-management competitors and analogous AI-driven SaaS platforms</mark>{" "}
            to understand the current state of the AI agent industry.
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
                  alt="My direct-competitor analysis of one of the four direct competitors."
                  aspectRatio={7696 / 2260}
                  caption={
                    <>
                      My direct-competitor analysis on one of the four direct competitors.
                    </>
                  }
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Analogous · Partner team</span>
              <h3>3 Analogous AI-driven SaaS Platforms</h3>
              <p>
                The partner team focused on auditing products that utilize AI to analyze customer data for feedback and insights.
              </p>
              <figure>
                <ZoomableImage
                  src={indirectCompetitor.src}
                  alt="The partner team's indirect-competitor analysis of analogous AI-driven SaaS platforms."
                  aspectRatio={3380 / 2204}
                  caption={
                    <>
                      The partner team&rsquo;s indirect-competitor analysis of analogous AI-driven
                      SaaS platforms.
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
              alt="My interaction-pattern synthesis through a Nielsen 10-heuristic evaluation of the platform's AI features."
              aspectRatio={4727 / 1576}
              caption={
                <>
                  My interaction-pattern synthesis through a Nielsen 10-heuristic evaluation, going over the general platform
                  and user flows of the instances of the platform&rsquo;s AI features.
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
              alt="My session notes from the three interviews I participated in."
              aspectRatio={4746 / 1517}
              caption={
                <>
                  My session notes from the three interviews I participated in.
                </>
              }
            />
          </figure>
          <figure>
            <ZoomableImage
              src={interviewAffinity.src}
              alt="Team affinity synthesis across all six interviews, clustered into themes."
              aspectRatio={3996 / 2413}
              caption={
                <>
                  Team affinity synthesis across all six interviews clustered into themes.
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
            We developed the AI agent concept direction through three stages:{" "}
            <mark className="hl">sketching, proposing, and wireframing concepts</mark>.
          </p>

          <h3>Sketching Ideas</h3>
          <p>
            Each designer ideated during the Crazy 8&rsquo;s sprint before walking through everyone&rsquo;s
            ideas together and combining the most supported features through group whiteboarding.{" "}
          </p>
          <figure>
            <ZoomableImage
              src={crazyEightSketch.src}
              alt="My Crazy 8's sketches of my AI agent concept features."
              aspectRatio={2453 / 1664}
              caption={
                <>
                  My Crazy 8&rsquo;s sketches of my AI agent concept features.
                </>
              }
            />
          </figure>
          <p>
            During the idea walkthroughs, I pitched a concept direction focusing on our recurring
            themes of user inputs, resulting in me{" "}
            <mark className="hl">leading a rules-based approach to the agent concept</mark>.
          </p>
          <figure>
            <ZoomableImage
              src={whiteboardConcept.src}
              alt="A whiteboarding session I led on a rules-based direction that was not selected as the final concept."
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
          <p>
            Although it was ultimately not selected as a final concept during the sponsor&rsquo;s
            assessment, elements of it were integrated into the concepts that were.
          </p>

        <h3>Proposing Concepts</h3>
          <p>
            We presented <mark className="hl">six concept proposals</mark> to the sponsor —
            including the rules-based whiteboarded direction I led (shown above) — each paired
            with the research evidence behind it. The sponsor selected two complementary
            directions to move forward with.
          </p>

        <h3>Dual Feature Wireframing</h3>
          <p>
            Due to having two feature concepts approved for the AI agent, we split the team evenly to
            develop both concepts concurrently.
          </p>

          <h3>Concept A · My team</h3>
          <p>
            To translate the concept into interactive features, I <mark className="hl">led the team, sketching variations
            of what concept A would look while maintaining the sponsor platform&rsquo;s UI patterns and providing access to
            concept B&rsquo;s features.</mark> The sketches were made to begin refinements through feedback from 
            the partner team and sponsor on the wireframes for more compressed and decision-focused UI.
          </p>
          <figure>
            <ZoomableImage
              src={conceptRefinement.src}
              alt="Timeline of the Concept A's refinement"
              aspectRatio={3975 / 2922}
              caption={
                <>
                  Timeline of Concept A&rsquo;s gradual refinement into its finalized version (not shown due to NDA)
                </>
              }
            />
          </figure>

          <h3>Concept B · Partner team</h3>
          <p>
            As my team focused on Concept A, the partner team focused on constructing the wireframes for Concept B.
            Due to not contributing to the ideation and construction of wireframes for Concept B, images are not shown.
          </p>

          <h3>Eventual Merging of Wireframes into One System</h3>
          <p>
            From wireframing, the two concepts revealed heavy overlap in utilizing the same context and
            evidence. Due to this fact, we decided to <mark className="hl">merge them into a single 
            agentic system</mark>.
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
              alt="Notes from the usability test I conducted."
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
            <mark className="hl">designing within an existing product context and design system. </mark>
            The first half was exploratory and general regarding takeaways, but the second half
            focused heavily on the platform&rsquo;s own needs, making it natural to narrow
            down findings to apply to the final product later on.
            <br></br><br></br>
            <mark className="hl">Narrowing down scope was a challenge subjective from project to project that I had previously addressed early</mark> on when
            constructing the first set of guidelines for Frogslayer. I now understand that
            <mark className="hl"> specific factors, like a project&rsquo;s theme of expansion, hints at its
            expected window for scope narrowing.</mark>
          </p>
        </section>
      </main>
    </div>
  );
}
