import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};

/* Outcome leads so recruiters see results first. Process is broken
   into its three actual phases (Researching, Ideating, Verifying) so
   the nav exposes the work rather than collapsing it under a single
   "Process" label — matches the structure used in Frogslayer. */
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
        meta="14 weeks · 9 designers · UI & Interaction · Designer"
        subtitle="An agentic AI concept that keeps customer journey maps accurate and trustworthy over time"
        imageLabel="AI maintenance agent · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          Confidential and proprietary details have been removed or anonymized to protect client information.
        </p>

        {/* ───── Outcome ───── (moved to top: recruiters see outcome first) */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            We delivered a high-fidelity interactive prototype, design-principle documentation, and a final
            presentation to the client&rsquo;s leadership. The final design gives users a{" "}
            <mark className="hl">trustworthy way to keep journey maps current</mark>: proactive alerts when content
            drifts, transparent evidence for every recommendation, and controls that keep people in the loop rather
            than handing decisions to automation.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            This <mark className="hl">conceptualization</mark> ideated and tested during this project was for a <mark className="hl">customer journey management platform</mark> — a tool teams utilize to close the gap of understanding their customers' experience utilizing their products.
            <br></br><br></br>
            Our team researched and designed an <mark className="hl"> AI{" "}
            &ldquo;maintenance intelligence agent&rdquo;</mark> that 
            <br></br>
            <br></br>
            <li>continuously monitors journey data, personas, and insights relevance</li>
            <li>informs users of data flagged as outdated</li>
            <li>recommends actions for updates</li>
            <br></br>
            to consistently keep maps accurate and trustworthy over time.
          </p>

          <h3>The Problem</h3>
          <p>
            A <mark className="hl">journey map's value degrades</mark> everytime an <mark className="hl">older and outdated content is not flagged</mark> as such upon the <mark className="hl">addition of newer and more accurate data.</mark>
            <br></br><br></br>
            The journey map platform&rsquo;s users — CX strategists, designers, product teams — are tasked with managing and analyzing the customer journey maps.
            <br></br><br></br>
            However, <mark className="hl">maintenance becomes increasingly difficult</mark> as the volume of data to assess increases, resulting in journey map content becoming outdated without any alerts to address the staleness.
          </p>

          <h3>My Role</h3>
          <p>
            During the project, I worked in UX studio team of nine people. I{" "}
            <mark className="hl">led concept ideation and exploration</mark> and contributed to research synthesis, wireframing, high-fidelity prototyping, and
            usability testing.

            <br></br><br></br>
            In addition to leading ideation, I also managed communication between <mark className="hl">the team, the
            company leads, and platform users</mark> to ensure alignment in regards to project progression, company 
            goals, and user needs through update meetings, update emails, and inteview organization.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding what would make a journey maintenance agent effective</h3>

          {/* Throughline promoted to the TOP of Researching so a skimmer
              who reads only the first paragraph still walks away with
              the section's payoff. The body below explains how we got
              here across four lenses; the throughline names where it
              landed. */}
          <p className="research-throughline-lead">
            <strong>The throughline:</strong> maintenance today is{" "}
            <mark className="hl">reactive, manual, and tied to project milestones</mark> —
            and users only trust AI suggestions when they can see the reasoning behind them.
          </p>
          <p>
            We arrived there through four research lenses:{" "}
            <mark className="hl">the platform, the agent components, the industry, and our users.</mark>
          </p>

          {/* ── Parallel research tracks ──
              The team split into two smaller groups to research the
              platform's current state and the agent's components in
              parallel within the project window. The .parallel-tracks
              grid below puts the two h3 subsections side-by-side with
              a faint vertical divider between them, visually
              communicating the split. */}
          <p className="research-split-lead">
            To cover both within the project window, we{" "}
            <mark className="hl">split into two smaller teams running in parallel:</mark>
          </p>
          <div className="parallel-tracks">
            <div className="research-track">
              <span className="track-label">Track 1</span>
              <h3>Current state of platform</h3>
              <p>
                We reviewed JourneyTrack as a user,{" "}
                <mark className="hl">logging what worked and where the gaps were</mark> before
                proposing anything new.
                <br></br><br></br>
                The biggest gap:{" "}
                <mark className="hl">staleness still depended on a &ldquo;last modified&rdquo; timestamp</mark>,
                and the agent <mark className="hl">required a manual trigger</mark> to do anything
                useful.
              </p>
              <figure>
                <div className="image-slot">JourneyTrack platform · current-state audit</div>
                <figcaption>
                  Mapping JourneyTrack&rsquo;s current strengths and opportunity gaps.
                </figcaption>
              </figure>
            </div>
            <div className="research-track">
              <span className="track-label">Track 2</span>
              <h3>Current state of agent components</h3>
              <p>
                To design a maintenance agent, we needed to understand its{" "}
                <mark className="hl">moving parts</mark>: the kinds of AI involved, how they monitor,
                and what makes users trust them.
                <br></br><br></br>
                We compared <mark className="hl">agentic vs maintenance AI</mark>, focused on{" "}
                <mark className="hl">proactive (not reactive) monitoring</mark>, and identified the
                conditions that build trust — <em>transparency, user control, and visible
                reasoning.</em>
              </p>
              <figure>
                <div className="image-slot">agent components · AI types · monitoring · trust</div>
                <figcaption>
                  Comparing AI types, monitoring approaches, and the conditions that build user trust.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* ── Industry & Interaction Patterns ──
              The competitive analysis (direct + indirect) and the
              interaction-pattern synthesis covered the same material
              (how the broader industry handles maintenance + verification),
              so they're grouped under one umbrella here. */}
          <h3>Industry &amp; interaction patterns</h3>
          <p>
            A competitive analysis across two groups — <mark className="hl">direct
            competitors</mark> in the journey-management category and{" "}
            <mark className="hl">indirect competitors</mark> from analogous SaaS — then triangulated
            through an interaction-pattern synthesis of four verification-focused platforms.
          </p>
          <p>
            <strong>Direct</strong> — <em>TheyDo, Cemantica, Smaply.</em> They led with{" "}
            <mark className="hl">actionable insights and AI-powered creation.</mark>
          </p>
          <figure>
            <div className="image-slot">direct competitors · TheyDo · Cemantica · Smaply</div>
            <figcaption>Direct competitors in the journey-management category.</figcaption>
          </figure>
          <p>
            <strong>Indirect</strong> — <em>Gong, Observe.AI, Productboard.</em> They excelled at{" "}
            <mark className="hl">proactive monitoring</mark> and turning raw data into{" "}
            <mark className="hl">structured, actionable insights.</mark>
          </p>
          <figure>
            <div className="image-slot">indirect competitors · Gong · Observe.AI · Productboard</div>
            <figcaption>Analogous SaaS solving parallel monitoring + insight problems.</figcaption>
          </figure>
          <p>
            We then combined both groups through an{" "}
            <mark className="hl">interaction pattern synthesis</mark> of Notion, Confluence, Guru,
            and Alation — surfacing the structural moves every modern verification flow shares.
          </p>
          <figure>
            <div className="image-slot">interaction pattern synthesis · Notion · Confluence · Guru · Alation</div>
            <figcaption>
              Annotated verification flows surfacing transferable patterns for our own design.
            </figcaption>
          </figure>

          {/* ── User Interviews ── */}
          <h3>User interviews</h3>
          <p>
            Six interviews with current CX strategists and UX researchers (affinity-diagrammed)
            confirmed the desk research: <mark className="hl">no clear system for spotting
            outdated content</mark>, and users want AI involved — only if they can see <em>why</em>.
          </p>
          <figure>
            <div className="image-slot">user interview synthesis · affinity diagram</div>
            <figcaption>
              Six interviews with CX strategists and UX researchers, synthesized into the themes
              that drove ideation.
            </figcaption>
          </figure>
        </section>

        {/* ───── Ideating ───── */}
        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <h3>From six concepts to one cohesive agent</h3>
          <p>
            We developed concept directions in three passes:{" "}
            <mark className="hl">sketching, concept proposals, and wireframing.</mark>
          </p>

          {/* ── Sketching ── */}
          <h3>Sketching</h3>
          <p>
            Each designer started with <mark className="hl">Crazy 8&rsquo;s</mark>, then we walked
            through everyone&rsquo;s sheets together and combined the strongest threads through{" "}
            <mark className="hl">group whiteboarding</mark>.
          </p>
          <figure>
            <div className="image-slot">individual sketches + group whiteboarding</div>
            <figcaption>
              Crazy 8&rsquo;s into a collaborative whiteboarding session to refine and combine ideas.
            </figcaption>
          </figure>

          {/* ── Concept Proposals ── */}
          <h3>Concept proposals</h3>
          <p>
            We presented <mark className="hl">six mid-fi concepts</mark> to our sponsors — four
            within scope (proactive insights, walkthrough mode, AI chat, growing tracker) and two
            exploratory.
            <br></br><br></br>
            They selected <mark className="hl">a proactive suggestion model and a reactive
            guided-walkthrough model</mark> to move forward with.
          </p>
          <figure>
            <div className="image-slot">concept proposal slides · A · B · C · D · E · F</div>
            <figcaption>Six mid-fi concepts presented for sponsor selection.</figcaption>
          </figure>

          {/* ── Wireframing & Combining ── */}
          <h3>Wireframing &amp; combining into one</h3>
          <p>
            After wireframing both selected concepts in parallel, we recognized how much the
            proactive and reactive models overlapped — and{" "}
            <mark className="hl">combined them into a single cohesive agent</mark> rather than two
            competing AI surfaces.
          </p>
          <figure>
            <div className="image-slot">proposal A + B wireframes → unified concept</div>
            <figcaption>
              Wireframing surfaced enough overlap between proactive + reactive to merge them into
              one agent.
            </figcaption>
          </figure>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Designing and testing the unified agent</h3>
          <p>
            We took the combined concept into{" "}
            <mark className="hl">high-fidelity prototyping, usability testing, and iteration.</mark>
          </p>

          {/* ── Hi-Fi Prototyping ── */}
          <h3>Hi-fi prototyping</h3>
          <p>
            We built an interactive Figma prototype with the agent&rsquo;s core moves:{" "}
            <mark className="hl">evidence-backed suggestion cards</mark> (each with reasoning and a
            quote pulled from the user&rsquo;s own documents),{" "}
            <mark className="hl">approve / deny / snooze controls</mark>, a guided walkthrough, and
            an in-context AI chat.
          </p>
          <figure>
            <div className="image-slot">hi-fi prototype · suggestion cards · walkthrough · chat</div>
            <figcaption>
              The agent panel: proactive suggestions and a reactive assistant, unified in one surface.
            </figcaption>
          </figure>

          {/* ── Usability Testing ── */}
          <h3>Usability testing</h3>
          <p>
            Six UX designers familiar with journey mapping ran through three tasks.{" "}
            <mark className="hl">Average task difficulty: 3 out of 10.</mark>
            <br></br><br></br>
            They appreciated the evidence transparency and the reduced cognitive load of the
            walkthrough — but flagged that <mark className="hl">evidence interactions weren&rsquo;t
            obvious</mark>, suggestion cards felt text-heavy, and the storytelling AI and maintenance
            AI got mixed up.
          </p>
          <figure>
            <div className="image-slot">usability testing debrief · affinity diagram</div>
            <figcaption>Six sessions synthesized into iteration insights.</figcaption>
          </figure>

          {/* ── Iterations ── */}
          <h3>Iterations</h3>
          <p>
            We tightened evidence interactions to match other interactable elements, raised spacing
            and contrast on the suggestion cards, consolidated the maintenance AI into the chatbot
            in the corner, and <mark className="hl">moved agent customization into general
            settings</mark> to match users&rsquo; existing mental model.
          </p>
          <figure>
            <div className="image-slot">final iterated hi-fi design</div>
            <figcaption>
              The final agent: evidence-backed suggestions, approve/deny/snooze, a guided
              walkthrough, and a unified chat.
            </figcaption>
          </figure>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            Designing for AI is mostly designing for <em>trust</em>. The hardest problems
            weren&rsquo;t visual — they were about transparency, control, and helping users decide
            when to rely on the system. I also learned to design within an existing product: every
            decision had to fit the platform&rsquo;s established patterns and its users&rsquo;
            mental models.
          </p>
        </section>
      </main>
    </div>
  );
}