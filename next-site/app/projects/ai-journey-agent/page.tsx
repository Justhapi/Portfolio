import CaseCover from "@/components/CaseCover";
import NextProject from "@/components/NextProject";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import CaseVideo from "@/components/CaseVideo";

import platformAudit from "./images/Platform_Audit_Visual.webp";
import agentComponents from "./images/Ai_Agent_Components_Visual.webp";
import directCompetitor from "./images/Direct_Competitor_Visual.webp";
import indirectCompetitor from "./images/Indirect_Competitor_Visual.webp";
import interactionPattern from "./images/Interaction_Pattern_Visual.webp";
import interviewNotes from "./images/Interview_Notes_Visual.webp";
import interviewAffinity from "./images/Interview_Affinity_Diagramming.webp";
import crazyEightSketch from "./images/Crazy_Eight_Sketch.webp";
import whiteboardConcept from "./images/Whiteboard_Concept.webp";
import sketchingCorner from "./images/Sketching_corner.webp";
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
// Custom domain (kathleenli.tech) serves from the root — no prefix needed.
const BASE_PATH = "";

/* The two wireframe walkthroughs. Defined once and rendered in BOTH the
   Outcome section (so a reader who never gets past the fold still sees the
   prototype move) and at the end of Verifying, where the iteration
   narrative sits — so the captions can't drift apart between the two.

   Clips are served from /public/img/proto/, NOT the co-located images/
   folder: Next's static export copies /public verbatim, while the asset
   loader emits videos to the wrong path.

   The encoded files carry masked regions over the platform's breadcrumb
   and tab labels, and over every on-screen product/person name. The mask
   list was derived by OCR-ing every frame, not by eye — see HANDOVER
   before re-encoding from source, or the masks will be lost. */
function PrototypeDemos() {
  return (
    <div className="case-image-row">
      <CaseVideo
        src={`${BASE_PATH}/img/proto/reactive.mp4`}
        poster={`${BASE_PATH}/img/proto/reactive-poster.webp`}
        label="Wireframe walkthrough of the agent's reactive flow."
        caption={<>Demo of Agent features responding to user requests.</>}
      />
      <CaseVideo
        src={`${BASE_PATH}/img/proto/proactive.mp4`}
        poster={`${BASE_PATH}/img/proto/proactive-poster.webp`}
        label="Wireframe walkthrough of the agent's proactive flow."
        caption={<>Demo of Agent features surfacing issues to the user.</>}
      />
    </div>
  );
}
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
            specifically the <strong>sponsor company&rsquo;s identity, product name, and
            prototype features are anonymized or generalized.</strong>
          </span>
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              The concept was selected by the sponsor and developed into a high-fidelity
              prototype <strong>handed off to their product team.</strong> Shortly after, the{" "}
              <strong>sponsor shared that an AI maintenance agent was moving into
              development,</strong> validating the direction the team had explored.
            </p>
            <p className="outcome-callout__meta">
              Spring 2026 · Sponsor platform → Concept · Development
            </p>
          </aside>

          <p>
            We delivered a{" "}
            <mark className="hl">high-fidelity prototype and design-principle documentation</mark>{" "}
            to the sponsor&rsquo;s leadership, defining an AI maintenance agent that keeps
            customer journey maps accurate and trustworthy over time.
          </p>

          <PrototypeDemos />
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            The sponsor operates a customer journey management platform teams use to
            understand their customers&rsquo; experience across a product. We were asked to
            explore how <mark className="hl">an AI maintenance agent</mark> could be
            implemented into it to keep journey maps accurate.
          </p>

          <h3>The Problem</h3>
          <p>
            The platform&rsquo;s users (CX strategists, designers, and product teams) manage,
            update, and analyze data inside customer journey maps.
            <br></br><br></br>
            Without a system for flagging staleness, they rely on{" "}
            <mark className="hl">manual and potentially inaccurate review cadences</mark>, so a
            map&rsquo;s value degrades as maintenance grows with the volume of content.
          </p>
          <h3>My Role</h3>
          <p>
            <strong>I worked as a UX Designer &amp; Researcher</strong>,{" "}
            <mark className="hl">leading concept ideation and exploration</mark> and
            contributing to research synthesis, wireframing, high-fidelity prototyping, and
            usability testing.
            <br></br><br></br>
            <strong>I also managed communication</strong> between the team, sponsor leads, and platform
            users through update meetings, update emails, and interviews, and
            mentored the junior designers on Figma onboarding and studio deliverable
            expectations.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding What Makes an AI Maintenance Agent Effective in Existing Platform</h3>
          <p>
            To conceptualize the agent, we explored four research focuses: the
            platform&rsquo;s state, the agent&rsquo;s required components, the industry, and
            user needs.
          </p>

          <p className="research-split-lead">
            To cover each within a tight time frame, we{" "}
            <mark className="hl">split into two sub-teams across two sprints</mark>,
            reconvening after each to share findings.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Track 1 · My team</span>
              <h3>Current State of Platform</h3>
              <p>
                <strong>I audited the platform as a user</strong>, exploring{" "}
                <mark className="hl">its features across functionality and placement</mark> to
                inform where the agent would sit and how it would integrate with related
                features.
              </p>
              <figure>
                <ZoomableImage
                  src={platformAudit.src}
                  alt="My platform audit board of sticky notes on blurred platform screenshots, color-coded by category."
                  aspectRatio={3975 / 2922}
                  caption={<>My platform audit board of sticky notes on blurred platform screenshots, color-coded by category.</>}
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Track 2 · Partner team</span>
              <h3>Current State of Agent Components</h3>
              <p>
                The partner team surveyed the AI components a maintenance agent would require:
                types of AI, categories of monitoring, and user trust.
              </p>
              <figure>
                <ZoomableImage
                  src={agentComponents.src}
                  alt="The agent-components synthesis the partner team authored, categorized into five focuses."
                  aspectRatio={5128 / 3458}
                  caption={<>The partner team&rsquo;s agent-components synthesis, categorized into five focuses.</>}
                />
              </figure>
            </div>
          </div>

          <h3>Industry &amp; Interaction Patterns</h3>
          <p>
            We then ran competitive analysis across{" "}
            <mark className="hl">direct competitors and analogous AI-driven SaaS platforms</mark>{" "}
            to understand the state of the AI agent industry.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Direct · My team</span>
              <h3>4 Direct Journey-management Competitors</h3>
              <p>
                <strong>I audited one of the four hands-on</strong>, focusing on three aspects of its AI: user
                interactions, reach within the platform, and user flow pain points.
              </p>
              <figure>
                <ZoomableImage
                  src={directCompetitor.src}
                  alt="My direct-competitor analysis of one of the four direct competitors."
                  aspectRatio={7696 / 2260}
                  caption={<>My analysis of one of the four direct competitors.</>}
                />
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Analogous · Partner team</span>
              <h3>3 Analogous AI-driven SaaS Platforms</h3>
              <p>
                The partner team audited products that use AI to analyze customer data for
                feedback and insights.
              </p>
              <figure>
                <ZoomableImage
                  src={indirectCompetitor.src}
                  alt="The partner team's indirect-competitor analysis of analogous AI-driven SaaS platforms."
                  aspectRatio={3380 / 2204}
                  caption={<>The partner team&rsquo;s analysis of analogous AI-driven SaaS platforms.</>}
                />
              </figure>
            </div>
          </div>
          <p>
            We then examined interaction patterns within knowledge-verification platforms to
            surface the structural moves every modern verification flow shares.
          </p>
          <figure>
            <ZoomableImage
              src={interactionPattern.src}
              alt="My interaction-pattern synthesis through a Nielsen 10-heuristic evaluation of the platform's AI features."
              aspectRatio={4727 / 1576}
              caption={<>My interaction-pattern synthesis, a Nielsen 10-heuristic evaluation across the platform and the flows of its AI features.</>}
            />
          </figure>

          <h3>User Interviews</h3>
          <p>
            To verify the desk research matched what users needed, the team ran{" "}
            <mark className="hl">six interviews with current platform users</mark>.
          </p>
          <p>
            I <mark className="hl">participated in three of the six</mark>, rotating between
            interviewer and note-taker. Afterwards we categorized the insights into the
            platform-relevant needs the agent had to address.
          </p>
          <figure>
            <ZoomableImage
              src={interviewNotes.src}
              alt="My session notes from the three interviews I participated in."
              aspectRatio={4746 / 1517}
              caption={<>My session notes from the three interviews I participated in.</>}
            />
          </figure>
          <figure>
            <ZoomableImage
              src={interviewAffinity.src}
              alt="Team affinity synthesis across all six interviews, clustered into themes."
              aspectRatio={3996 / 2413}
              caption={<>Team affinity synthesis across all six interviews, clustered into themes.</>}
            />
          </figure>
        </section>

        {/* ───── Ideating ───── */}
        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <h3>From Individual Sketching to a Sponsor-Selected Direction</h3>
          <p>
            We developed the concept through three stages: sketching, proposing, and
            wireframing.
          </p>

          <h3>Sketching Ideas</h3>
          <p>
            Each designer ideated in a Crazy 8&rsquo;s sprint before we walked through
            everyone&rsquo;s ideas and combined the most supported features through group
            whiteboarding.
          </p>
          <figure>
            <ZoomableImage
              src={crazyEightSketch.src}
              alt="My Crazy 8's sketches of my AI agent concept features."
              aspectRatio={2453 / 1664}
              caption={<>My Crazy 8&rsquo;s sketches of my AI agent concept features.</>}
            />
          </figure>
          <p>
            During the walkthroughs <strong>I pitched a direction</strong> built on our recurring theme
            of user inputs, and went on to{" "}
            <mark className="hl">lead a rules-based approach</mark> to the concept.
          </p>
          <figure>
            {/* The sketch sits over the whiteboard's top-left corner, anchored to
                the top of the stack rather than the bottom: ZoomableImage renders
                its figcaption inside the same wrapper, so a bottom-anchored
                overlay would land on the caption instead of the board. */}
            <div className="wb-stack">
              <ZoomableImage
                src={whiteboardConcept.src}
                alt="A whiteboarding session I led on a rules-based direction that was not selected as the final concept."
                aspectRatio={5290 / 3588}
                caption={<>A whiteboarding session I led on the rules-based direction. It wasn&rsquo;t selected, but its human-in-the-loop rule editing informed the direction the sponsor did select.</>}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="wb-stack__sketch"
                src={sketchingCorner.src}
                alt="A sketch from the whiteboarding session."
                draggable={false}
              />
            </div>
          </figure>

          <h3>Proposing Concepts</h3>
          <p>
            We presented <mark className="hl">six concept proposals</mark>, including the
            rules-based direction I led, each paired with the research evidence behind it. The
            sponsor selected two complementary directions.
          </p>

          <h3>Dual Feature Wireframing</h3>
          <p>
            With two concepts approved, we split the team evenly to develop both concurrently.
          </p>

          <h3>Concept A · My team</h3>
          <p>
            I <mark className="hl">led the team sketching variations of Concept A</mark>,
            holding to the sponsor platform&rsquo;s UI patterns while providing access to
            Concept B&rsquo;s features. Those sketches opened refinement through partner-team
            and sponsor feedback, toward a more compressed and decision-focused UI.
          </p>
          <figure>
            <ZoomableImage
              src={conceptRefinement.src}
              alt="Timeline of the Concept A's refinement"
              aspectRatio={3975 / 2922}
              caption={<>Timeline of Concept A&rsquo;s refinement into its finalized version (not shown due to NDA).</>}
            />
          </figure>

          <h3>Concept B · Partner team</h3>
          <p>
            The partner team constructed Concept B&rsquo;s wireframes. As I didn&rsquo;t
            contribute to its ideation or construction, images aren&rsquo;t shown.
          </p>

          <h3>Eventual Merging of Wireframes into One System</h3>
          <p>
            Wireframing revealed heavy overlap, as both concepts drew on the same context and
            evidence, so we{" "}
            <mark className="hl">merged them into a single agentic system</mark>.
            <br></br><br></br>
            Because the wireframes are built on the sponsor&rsquo;s platform UI, they
            aren&rsquo;t shown here to comply with the NDA.
          </p>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Prototyping and Testing the Unified Concept</h3>
          <p>
            We took the combined concept into{" "}
            <mark className="hl">high-fidelity prototyping, usability testing, and iteration</mark>.
          </p>

          <h3>Hi-Fi Prototyping</h3>
          <p>
            We built an interactive Figma prototype expressing the unified concept end-to-end
            through user flows, applying the insights the research had surfaced.
            <br></br><br></br>
            Because the prototype was constructed directly on the sponsor&rsquo;s platform
            surface, the screens themselves aren&rsquo;t shown here.
          </p>

          <h3>Usability Testing</h3>
          <p>
            To avoid setting false expectations about features that might not ship, the sponsor
            asked us each to recruit{" "}
            <mark className="hl">a UX Design classmate familiar with journey mapping</mark> as a
            substitute tester.
            <br></br><br></br>
            Each session had participants complete three tasks probing navigation and use of
            the prototype&rsquo;s features, followed by a reflection round.
          </p>
          <figure className="visual-compact">
            <ZoomableImage
              src={usabilityTesting.src}
              alt="Notes from the usability test I conducted."
              aspectRatio={1980 / 1291}
              caption={<>Notes from the usability test I conducted.</>}
            />
          </figure>

          <h3>Iterations</h3>
          <p>
            We categorized the insights to determine iteration focuses:{" "}
            <mark className="hl">agent access, information organization, and flow simplification</mark>.
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
            focused heavily on the platform&rsquo;s own needs, making it natural to narrow down
            findings to apply to the final product later on.
            <br></br><br></br>
            <mark className="hl">Narrowing down scope was a challenge subjective from project to project that I had previously addressed early</mark>{" "}
            on when constructing the first set of guidelines for Frogslayer. I now understand that{" "}
            <mark className="hl">specific factors, like a project&rsquo;s theme of expansion, hints at its expected window for scope narrowing.</mark>
          </p>
        </section>
      </main>
      {/* Side note: add note={<>…</>} to say anything about how this project
          relates to the others (e.g. what you were working on alongside it). */}
      <NextProject current="ai-journey-agent" />
    </div>
  );
}
