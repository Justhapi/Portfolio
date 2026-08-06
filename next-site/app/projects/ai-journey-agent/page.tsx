import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import StaticImage from "@/components/StaticImage";

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

          {/* Outcome callout — the single strongest claim in the case
              study, elevated so it earns its own moment above the
              body-copy Outcome paragraph. A skimmer who reads nothing
              else on this page still leaves with this fact. */}
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
            We delivered a <mark className="hl"> concept condensed into a high-fidelity interactive prototype and 
            design-principle documentation </mark>{" "} to the sponsor&rsquo;s leadership. The deliverables defined
            <mark className="hl"> an AI maintenance agent</mark> that could keep customer journey maps accurate and trustworthy over time.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            The sponsor operates an <mark className="hl">customer journey management platform</mark> that teams utilize to close the gap 
            in understanding their <mark className="hl">customers&rsquo; experience</mark> across a product. Our team was asked to explore how{" "}
            <mark className="hl">an AI maintenance agent</mark> could be implemented into the platform for teams to keep their journey maps accurate.
          </p>

          <h3>The Problem</h3>
          <p>
            The platform&rsquo;s users (CX strategists, designers, and product teams) are often tasked with <mark className="hl">managing, updating, and analyzing
            data within customer journey maps.</mark>
            <br></br><br></br>
            However, without a system for flagging data staleness, teams <mark className="hl">currently rely on manual 
            and potentially inaccurate review cadences.</mark> As a result, the journey maps&rsquo; value <mark className="hl">inevitably degrades over time</mark> as 
            <mark className="hl"> the scale and difficulty of maintenance grows with the ever-growing content.</mark> 
          </p>
          <h3>My Role</h3>
          <p>
            I worked as a UX Designer &amp; Researcher during this project,{" "}
            <mark className="hl">leading concept ideation and exploration</mark> and contributing to
            research synthesis, wireframing, high-fidelity prototyping, and usability testing.
            <br></br><br></br>
            In addition to leading ideation, I{" "}<mark className="hl">also managed communication between the team, sponsor leads, and later platform users</mark>
            {" "}to ensure alignment on project progression, sponsor goals, and user needs through <mark className="hl">organizing update meetings, update emails, 
            and interviews.</mark> I also <mark className="hl">mentored the junior designers joining the studio regarding onboarding of Figma and studio deliverable
            expectations.</mark>
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding What Makes an AI Maintenance Agent Effective in the Platform</h3>
          <p>
            We arrived there through four research focuses:{" "}
            <mark className="hl">the platform&rsquo;s current state, the agent&rsquo;s required components,
            the current industry, and the current user needs.</mark>
          </p>

          <p className="research-split-lead">
            To cover the content of each focus within a smaller time frame, we <mark className="hl">split into two sub-teams running in
            parallel in two sprint, reconvening after each sprint to share findings</mark> to the other team.
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Track 1 · My team</span>
              <h3>Current State of Platform</h3>
              <p>
                I audited the platform as a user, exploring{" "} <mark className="hl">its features regarding their funtionailty and placement</mark> 
                 to better ideate aspects of the agent such as <mark className="hl">its placement within the exisiting UI and integration with 
                related features.</mark>
              </p>
              <figure>
                <StaticImage
                  src={`${basePath}/img/journey-agent/platform-audit.webp`}
                  alt="Platform audit board — sticky notes on screenshots. All content anonymized; sponsor name and specific findings replaced with category-level labels."
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
              <span className="track-label">Track 2 · Partner team</span>
              <h3>Current State of Agent Components</h3>
              <p>
                The partner team surveyed the AI components that a maintenance agent would require:{" "}
                <mark className="hl">the types of AI, categories of monitoring, and user trust of AI</mark>.
                {" "}
              </p>
              <figure>
                <StaticImage
                  src={`${basePath}/img/journey-agent/agent-components.webp`}
                  alt="Agent-components synthesis board — five research-lens categories with sticker clusters. Sticker content blurred; framework structure and section labels legible."
                  aspectRatio={3000 / 2052}
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
                I explored a competitor platform, focusing on 3 <mark className="hl">components related to their AI agent functionality: user interactions, reach within the platform,
                and user flow pain points.</mark>
              </p>
              <figure>
                <StaticImage
                  src={`${basePath}/img/journey-agent/direct-competitor.webp`}
                  alt="Direct-competitor analysis board — three columns: Agent & User Interactions, Agent's Components within Platform, Agent's Pain Points. Screenshots blurred, sticker text category-level only. Competitor logo redacted."
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
              <span className="track-label">Indirect · Partner team</span>
              <h3>3 Indirect Analogous AI-driven SaaS Competitors</h3>
              <p>
                The partner team focused on products involved in data management through parallal monitory and insights outside of journey-management. 
              </p>
            </div>
          </div>
          <p>
            After the competitive analysis, we then moved onto examining interaction patterns within knowledge-verification platforms to surface the structural 
            moves every modern verification flow currently shares.
          </p>
          <figure>
            <StaticImage
              src={`${basePath}/img/journey-agent/interaction-pattern.webp`}
              alt="Interaction-pattern synthesis: Nielsen 10-heuristic evaluation of a competitor platform + agent, paired with four user-flow diagrams categorized by content-manipulation type. Screenshots blurred; sticker text category-level only."
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
            To verify alignment of the direction the desk research pointed toward with the
            platform user needs from an AI agent focusing on journey-map maintenance, the team ran 
            <mark className="hl"> six interviews with current users of the sponsor platform</mark>
            {" "}.
          </p>
          <p>
            I <mark className="hl">participated in three of the six one-hour sessions</mark>,
            rotating between being <mark className="hl">interviewer and note-taker</mark> with my partner during each session. After the 6 interviews were completed, we categorized the 
            insights to <mark className="hl">determine the platform-relevant user needs that the Ai agent must address.</mark>
          </p>
          <figure>
            <StaticImage
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
            Each designer ideated during the Crazy 8&rsquo;s sprint before walking through everyone&rsquo;s
            ideas together and combining the most supported features through group whiteboarding.{" "}
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
          <p>
          During the idea walkthroughs, I ideated and pitched to the team a concept direction focusing on <mark className="hl">our recurring themes of user inputs, </mark> 
          resulting in me <mark className="hl"> leading a rules-based approach to the agent concept.</mark> 
          <br></br><br></br>
          Although it was ultimately not selected as one of the final 
          concept during concept assessment by the sponsor, <mark className="hl">elements of it was integrated into the selected concepts.</mark>
          </p>
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
            We presented <mark className="hl">six concept proposals</mark> to the sponsor —
            including the rules-based whiteboarded direction I led (shown above) — each paired
            with the research evidence behind it. The sponsor selected two complementary
            directions to move forward with.
          </p>

          <h3>Wireframing &amp; Eventual Merging into One System</h3>
          <p>
            Wireframing the two concepts in parallel later revealed heavy overlap in context and evidence. Rather than shipping two parallel surfaces, we{" "}
            <mark className="hl">merged them into a single agentic system</mark>.
            <br></br><br></br>
            Due to the wireframes utilizing sponsor&rsquo; platform UI, so they are not shown to follow NDA confidentiality.
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
            We built an interactive Figma prototype that expressed the unified concept end-to-end with userflows,
            applying the{" "}<mark className="hl">trust principles the research had surfaced</mark>.
            <br></br><br></br>
            Because the prototype was constructed directly on the sponsor&rsquo;s platform surface, the screens themselves aren&rsquo;t
            shown here.
          </p>

          <h3>Usability Testing</h3>
          <p>
            To avoid setting false expectations about feature directions that might not be implemented, the sponsor requested us{" "}
            <mark className="hl">to each recruit a UX Design major classmate familiar with journey mapping as subsitute testers.</mark> 
            <br></br><br></br>
            During each of the usability test, we had participants complete three tasks that probed navigating and using the concept 
            prototype&rsquo;s features, followed by a reflection round.
          </p>
          <figure>
            <StaticImage
              src={`${basePath}/img/journey-agent/usability-testing.webp`}
              alt="Usability-testing feedback affinity — four rows: Task 1 (Initial Navigation), Task 2 (Informed Map Modifications / Updating), Task 3 (Further AI Agent Interactions), Reflections (General Thoughts of Concept and User Flow). Sticky-note content blurred; row labels legible."
              aspectRatio={3000 / 2178}
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
            This project was my first time <mark className="hl">designing within an existing product context and design system.</mark> Although the 
            <mark className="hl">first half of the project was exploratory and general in regards to takeaways,</mark> I find that second half of 
            the project focused heavily on the platform's own needs. This allowed an ease of narrowing down which findings 
            to apply into the final product later into the project.
            <br></br><br></br>
            <mark className="hl">Narrowing down the scope has a challenge that I had to previously address early </mark>into my project of constucting
            the first set of guidelines for Frogslayer. However, I now understand that <mark className="hl"> specific factors such as the 
            project's theme of expansion would hint of its unique expected window of scope narrowing.</mark>
          </p>
        </section>
      </main>
    </div>
  );
}
