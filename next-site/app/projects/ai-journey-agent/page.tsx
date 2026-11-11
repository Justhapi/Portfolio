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
import crazyEightSketch from "./images/Crazy_Eight_Sketch.webp";
import whiteboardConcept from "./images/Whiteboard_Concept.webp";
import sketchingCorner from "./images/Sketching_corner.webp";
import conceptRefinement from "./images/Concept_A_Refinement.webp";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};
/* Interview themes, as titled on the team's affinity board. Colours
   match the board's sticky notes; tilt is a hand-placed scatter. */
const THEMES: { name: string; tone: string; tilt: number }[] = [
  { name: "Triggers for maintenance / updates", tone: "pink", tilt: -2 },
  { name: "Concerns of AI use safety", tone: "teal", tilt: 1.5 },
  { name: "Onboarding & learning patterns", tone: "purple", tilt: -1 },
  { name: "Requests of AI automation", tone: "orange", tilt: 2 },
  { name: "AI-feature usage patterns", tone: "blue", tilt: -1.5 },
  { name: "Data-connection patterns", tone: "green", tilt: 1 },
  { name: "Typical reactions to journey map maintenance gaps", tone: "pink", tilt: -2.5 },
  { name: "Current manual processes in typical workflow", tone: "blue", tilt: 1.5 },
];

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
              After the concept was successfully prototyped and tested, the sponsor's 
              product team then <strong>moved the AI maintenance agent concept into beta 
              a month after handoff.</strong>
            </p>
            <p className="outcome-callout__meta">
              Spring 2026 · Sponsor platform → Concept Prototype · Beta Development
            </p>
          </aside>

          <p>
            We delivered a{" "}
            high-fidelity prototype and design-principle documentation{" "}
            to the sponsor&rsquo;s leadership, conceptualizing an AI maintenance agent that keeps
            customer journey maps consistently accurate and trustworthy over time.
          </p>

          <PrototypeDemos />
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            The sponsor operates a B22B customer journey management platform that assists teams in
            understanding their customers&rsquo; experience. We were asked to explore and conceptualize 
            how an AI maintenance agent would be implemented to keep journey maps accurate.
          </p>

          <h3>The Problem</h3>
          <p>
            The platform&rsquo;s users (CX strategists, designers, and product teams) are typically the 
            sole individuals managing customer journey maps along with their other duties.
            <br></br><br></br>
            However, without a system for flagging staleness, they often rely on{" "}
            <mark className="hl">manual and potentially inaccurate review cadences</mark>.
            <br></br><br></br>
            As a result, a map&rsquo;s value will degrade as maintenance workload grows 
            with the volume of content.
          </p>
          <h3>My Role</h3>
          <p>
            During this project, I worked as a UX Designer &amp; Researcher,{" "}
            leading concept ideation and exploration and
            contributing to research synthesis, wireframing, high-fidelity prototyping, and
            usability testing.
            <br></br><br></br>
            I also managed communication between the team, sponsor leads, and platform
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
            We first explored four research focuses: the
            platform&rsquo;s state, the agent&rsquo;s required components, the industry, and
            user needs.
          </p>

          <p className="research-split-lead">
            To cover each focus within a tight time frame, we{" "}
            split into two sub-teams across two sprints,
            reconvening to share findings.
          </p>
          <div className="case-split">
            <div className="case-split__col case-split__col--mine">
              <div className="case-split__head">
                <h3>Current State of Platform</h3>
                <span className="case-split__who">Me</span>
              </div>
              <p>
                I audited the platform as a user, exploring{" "}
                its features regarding functionality and placement to
                determine the agent would accessed and integrate with other
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
            <div className="case-split__col">
              <div className="case-split__head">
                <h3>Current State of Agent Components</h3>
                <span className="case-split__who">Partner team</span>
              </div>
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
            direct competitors and analogous AI-driven SaaS platforms{" "}
            to understand the state of the AI agent industry.
          </p>
          <div className="case-split">
            <div className="case-split__col case-split__col--mine">
              <div className="case-split__head">
                <h3>4 Direct Journey-management Competitors</h3>
                <span className="case-split__who">Me</span>
              </div>
              <p>
                I audited one of the four direct competitors, focusing on three aspects of its AI agent: user
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
            <div className="case-split__col">
              <div className="case-split__head">
                <h3>3 Analogous AI-driven SaaS Platforms</h3>
                <span className="case-split__who">Partner team</span>
              </div>
              <p>
                The partner team audited platforms that utilize AI to analyze data for
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
            identify patterns within every information verification flow.
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
            Out of the 6 interview sessions with current platform users, I ran 3 as interviewer or note-taker. 
            Through affinity diagramming, we surfaced 8 themes the agent had to address.
          </p>
          <div className="case-board" aria-label="Interview themes from the team's affinity synthesis">
            {THEMES.map((t, i) => (
              <div
                key={t.name}
                className={`case-sticky case-sticky--${t.tone}`}
                style={{ "--tilt": `${t.tilt}deg` } as React.CSSProperties}
              >
                <span className="case-sticky__n">{String(i + 1).padStart(2, "0")}</span>
                {t.name}
              </div>
            ))}
          </div>
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
            We individually ideated in a Crazy 8&rsquo;s sprint before walking 
            through each ideas and combined the most supported features through group
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
            During the walkthroughs I pitched a direction built on our recurring theme
            of user inputs, and went on to{" "}
            lead a rule-based approach to the concept.
          </p>
          <figure>
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
            We presented six concept proposals to the sponsor with 
            cited with research evidence. In the end, the
            sponsor selected two complementary directions.
          </p>

          <h3>Dual Feature Wireframing</h3>
          <p>
            With two concepts approved, we split the team evenly to develop both concurrently.
          </p>

          <div className="case-split">
            <div className="case-split__col case-split__col--mine">
              <div className="case-split__head">
                <h3>Concept A</h3>
                <span className="case-split__who">Me</span>
              </div>
              <p>
                I led the team sketching variations of Concept A,
                following the sponsor platform&rsquo;s UI patterns as I provided sketches 
                to refine organization of the concept's features through partner-team
                and sponsor feedback.
              </p>
              <figure>
                <ZoomableImage
                  src={conceptRefinement.src}
                  alt="Timeline of the Concept A's refinement"
                  aspectRatio={3975 / 2922}
                  caption={<>Timeline of Concept A&rsquo;s refinement into its finalized version (not shown due to NDA).</>}
                />
              </figure>
            </div>
            <div className="case-split__col">
              <div className="case-split__head">
                <h3>Concept B</h3>
                <span className="case-split__who">Partner team</span>
              </div>
              <p>
                The partner team constructed Concept B&rsquo;s wireframes. As I didn&rsquo;t
                contribute to its ideation or construction, images aren&rsquo;t shown.
              </p>
            </div>
          </div>

          <h3>Eventual Merging of Wireframes into One System</h3>
          <p>
            Due to wireframing revelaing heavy overlap, we{" "} decided to{" "}
            <mark className="hl">merged them into a single agentic system</mark>.
          </p>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Prototyping and Testing the Unified Concept</h3>
          <p>
            We took the now combined concept into{" "}
            high-fidelity prototyping, usability testing, and iteration.
          </p>

          <h3>Hi-Fi Prototyping</h3>
          <p>
            We built an interactive Figma prototype comprising of the unified concept flows.
          </p>

          <h3>Usability Testing</h3>
          <p>
            To avoid setting false expectations about features that might not ship, the sponsor
            asked us instead each to recruit{" "} a UX Design classmate who is familiar with 
            journey mapping as substitute testers.
          </p>
          <div className="case-flow">
            <div className="case-flow__in">
              <b>3</b>
              <span>tasks + a reflection round per session</span>
            </div>
            <span className="case-flow__arrow" aria-hidden="true">&rarr;</span>
            <ul className="case-flow__out" aria-label="Iteration focuses">
              <li>Agent access</li>
              <li>Information organization</li>
              <li>Flow simplification</li>
            </ul>
          </div>

        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <h3>Design Decision-Making Related to Platform</h3>
          <p>
            This project was my first time{" "}
            <mark className="hl">designing within an existing product context and design system. </mark>
            While first half was exploratory in nature, but the second half
            focused heavily on the platform&rsquo;s specific needs, making it natural to narrow down
            findings to apply to the final product later on.
            <br></br><br></br>
            Narrowing down scope has been a challenge subjective from project to project that I had to previously addressed early{" "}
            on when constructing the first set of guidelines for Frogslayer. I now understand that{" "}
            specific factors, like a project&rsquo;s theme of expansion, hints at its natural window for scope narrowing.
          </p>
        </section>
      </main>
      <NextProject current="ai-journey-agent" 
        note={<>Worked on this project while designing a <strong>Purdue Research Collaboration Platform</strong></>}
      />
    </div>
  );
}
