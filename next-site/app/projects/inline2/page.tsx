import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Pop by inline — Kathleen Li",
  robots: { index: false, follow: false },
};

/* PRIVATE / DRAFT ROUTE
   This is the pre-NDA-swap detailed version of the inline case study.
   It is intentionally NOT linked from the home page — access is by
   direct URL only (/projects/inline2) so it can be reviewed privately.
   The public-facing /projects/inline route remains the NDA-safe
   placeholder shown on the folder card. This route names the product
   ("Pop"), the sponsor context, and the shape of the work under the
   confidentiality agreement — but does NOT name specific competitors,
   feature mechanics, tester quotes, or numeric outcome claims that
   were fabricated in earlier drafts. Fill in specifics from your own
   documentation when written approval is on file. Do not link, share,
   or index this route until then. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "designing", label: "Designing" },
  { id: "testing", label: "Testing" },
  { id: "iterating", label: "Iterating" },
  { id: "takeaways", label: "Takeaways" },
];

export default function PopByInlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Pop by inline — Designing Event Coordination Under Uncertainty"
        meta="Summer 2026 · 3-month remote internship · Product Design Intern"
        subtitle="A lightweight consumer tool for planning everyday gatherings, marking inline's step from B2B into B2B2C"
        imageLabel="Pop by inline · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          Draft copy for private review. Under the terms of the sponsor&rsquo;s confidentiality
          agreement, this page is not publicly linked and should not be shared until written
          consent is on file. Confidential and proprietary details remain covered by the
          agreement.
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>

          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Priority distribution shifted red-heavy to mostly-blue with zero reds</strong>{" "}
              across four rounds of usability testing, with each round&rsquo;s findings closed as
              shipped iterations before the following round began.
            </p>
            <p className="outcome-callout__meta">
              Summer 2026 · Pop by inline · 3-month remote internship · 4 test rounds
            </p>
          </aside>

          <p>
            I delivered a{" "}
            <mark className="hl">competitive audit, gap analysis, and an end-to-end interactive prototype</mark>{" "}
            of the product&rsquo;s first scenario covering both host and guest flows. I then ran
            four rounds of usability testing as lead facilitator, closing each round&rsquo;s
            findings as shipped iterations before the following round began.
          </p>
          <p>
            Following the interim stakeholder presentation, I contributed to a{" "}
            <mark className="hl">cohort-wide consolidation step</mark> that aggregated findings
            across all interns&rsquo; testers, informing structural decisions ahead of the
            CEO-attended final review. Four candidate features were ultimately solidified for the
            final review and the written Product Direction Summary:{" "}
            <mark className="hl">Questionnaire, Interest + Finalized RSVP, Notifications, and Archive</mark>.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            <mark className="hl">Pop by inline</mark> is an early-stage consumer product
            exploration from inline, a restaurant-technology company whose core business is B2B
            reservation and table-management systems. Pop is a lightweight tool for planning
            everyday gatherings and connecting them to restaurant venues, marking inline&rsquo;s
            step from pure B2B into B2B2C.
          </p>

          <h3>The Problem</h3>
          <p>
            Every gathering involves three variables:{" "}
            <mark className="hl">headcount, time, and location</mark>. In real life, these are
            rarely all confirmed at once. The design challenge was to make coordination feel
            smooth while those variables were still uncertain, with lower friction than a group
            chat, for a Gen Z audience.
          </p>

          <h3>My Role</h3>
          <p>
            I worked as a Product Design Intern,{" "}
            <mark className="hl">remote across a roughly 12-hour time-zone gap</mark> with a team
            based in Taiwan. The role was framed around clarity of thinking over production
            output, focusing on bringing an outside-in perspective through competitive research,
            gap analysis, concept design, and usability testing.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Mapping the Competitive Landscape</h3>
          <p>
            I built a{" "}
            <mark className="hl">single competitive-analysis framework</mark> covering
            positioning, key features, strengths and weaknesses, business model, and end-to-end
            host and guest walkthroughs. This framework was then applied consistently across
            multiple event-coordination products, with the audits themselves conducted hands-on
            rather than by simply skimming feature lists.
          </p>
          <p>
            A significant realization from this pass was that{" "}
            <mark className="hl">competitors were not all the same kind of product</mark> as Pop.
            That category distinction then became the backbone of the following gap analysis, so
            that a weakness in a different product category would not be automatically counted as
            a gap for Pop.
          </p>
          <figure>
            <div className="image-slot">competitive-analysis framework · reusable template</div>
            <figcaption>
              The reusable framework template applied consistently across the audited products,
              with columns for positioning, features, strengths, weaknesses, business model, and
              end-to-end walkthroughs.
            </figcaption>
          </figure>

          <h3>Gap Analysis with Category Discipline</h3>
          <p>
            Cross-referencing each competitor&rsquo;s weaknesses against the team&rsquo;s
            proposed feature set required{" "}
            <mark className="hl">judgment rather than a mechanical table</mark>. After filtering
            for the category distinction identified in the audit, the remaining gaps became the
            grounding evidence for the design proposals that followed.
          </p>
          <figure>
            <div className="image-slot">gap-analysis matrix · competitor weakness × proposed feature</div>
            <figcaption>
              Gap-analysis matrix cross-referencing competitor weaknesses against Pop&rsquo;s
              proposed feature set.
            </figcaption>
          </figure>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Scenario 1: An Evolving Event</h3>
          <p>
            The design brief posed two questions: <em>how does the flow handle TBD time and
            venue?</em> and <em>how does the guest experience an evolving event?</em> I worked
            through three artifact layers to answer them, starting with a{" "}
            <mark className="hl">FigJam user flow with phase swimlanes</mark>, then moving to
            AI-assisted wireframes, and finally to an interactive single-phone prototype that
            conveyed the event&rsquo;s evolving state over time.
          </p>
          <p>
            Each major design move traced back to a specific observation from the competitive
            audit and gap analysis, so that every feature decision could be defended against a
            documented finding rather than a preference.
          </p>
          <figure>
            <div className="image-slot">FigJam phase-swimlane flow + key prototype screens</div>
            <figcaption>
              The three-phase user flow (creation → coordination → finalization) alongside key
              prototype screens.
            </figcaption>
          </figure>

          <h3>Working with AI Prototyping Tools</h3>
          <p>
            This project marked the first heavy use of AI-assisted prototyping in my workflow,
            and it consequently taught me that{" "}
            <mark className="hl">AI tools generate polish but do not preserve design intent without explicit guardrails</mark>.
            Early iterations flattened product-specific mechanics into generic event-app shapes
            until prompted with explicit &ldquo;what to leave alone&rdquo; constraints. I also
            actively caught and removed AI-fabricated framing before sharing deliverables, since
            content I did not author should not appear in work attributed to me.
          </p>
          <p>
            AI prototyping handled the heavy lifting throughout the project by generating
            components and plausible interactions, while manual refinement handled the precision
            work that made the interface actually consistent. As a result, I find that{" "}
            <mark className="hl">using AI and manual refinement together, in the right order and with the right ratio for the moment, is the actual skill</mark>.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Four Rounds of Usability Testing</h3>
          <p>
            I served as{" "}
            <mark className="hl">lead facilitator across four rounds of usability testing</mark>,
            which was my first time proctoring after months of preparing as a researcher.
            Same-day for each round, I synthesized the findings into a structured insights
            document organized as Insight → Reasoning → Proposed Iteration, with priority
            color-coding applied throughout.
          </p>
          <p>
            To prepare for the sessions, I built a{" "}
            <mark className="hl">bilingual participant guide</mark> that placed one task per page
            so participants always knew what came next, along with an interview plan that paired
            warm-up and post-task debrief probes anchored on the brief&rsquo;s two original
            design questions. As a result, I find that a testing protocol benefits from the same
            iterative rigor as the designs it evaluates.
          </p>

          <h3>Priority Distribution as Diagnostic</h3>
          <p>
            The clearest signal of iteration progress across the four rounds was the{" "}
            <mark className="hl">priority distribution itself</mark>: Round 1 produced multiple
            red-priority findings, Round 2 produced only one, and Rounds 3 and 4 produced zero
            red-priority findings with mostly blue &ldquo;additional feature idea&rdquo; rows.
            From this shift, I find that a round whose synthesis moves from reds to yellows to
            blues is the closest a usability process gets to objective evidence that an iteration
            worked.
          </p>
          <figure>
            <div className="image-slot">insights document · four-round priority-distribution comparison</div>
            <figcaption>
              The Insight → Reasoning → Proposed Iteration → Implementation table across all four
              rounds, showing the priority distribution shift from red-heavy to mostly-blue.
            </figcaption>
          </figure>
        </section>

        {/* ───── Iterating ───── */}
        <section id="iterating" className="case-section">
          <h2>Iterating</h2>
          <h3>Closing Loops Between Rounds</h3>
          <p>
            Within days of each round&rsquo;s synthesis, I built a new prototype iteration that
            closed the most-leveraged findings from the round before the following round began.
            As a result, every round of testing evaluated a prototype that had already responded
            to the previous round&rsquo;s recorded evidence, rather than the same prototype
            re-tested with different participants.
          </p>

          <h3>Two-Artifact Split for Two Conversations</h3>
          <p>
            After the interim review, the prototype was{" "}
            <mark className="hl">ported to Figma Make through a deliberate guardrails contract</mark>,
            preserving every screen, interactive element, label, and state transition exactly.
            Only the visual treatment was redesigned during the port.
          </p>
          <p>
            The two artifacts then served two distinct conversations. The Figma Make version
            carried the polished UI for design review and the final-review stakeholders, while
            the AI Studio prototype kept the live testing panel and consequently remained the
            active usability-research artifact.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Synthesis Over Listing, Crux First Over Polish First</h3>
          <p>
            The biggest analytical lesson from this project was{" "}
            <mark className="hl">synthesis over listing</mark>. Collecting observations is only
            the input; the actual value comes from comparing across them and committing to a
            recommendation. On a personal iteration-habits level, I also noticed that I tended
            to polish the parts I was already confident about while avoiding the harder parts,
            yet the harder parts were exactly what the brief hinged on. As a result, I find that
            designing the crux first and polishing second is the discipline I am carrying
            forward.
          </p>

          <h3>Research Quality Has an Energy Ceiling</h3>
          <p>
            Round 1 of testing added an additional lesson, which was that{" "}
            <mark className="hl">research output has a quality ceiling set by energy, not skill</mark>.
            When fresh, &ldquo;one more polish pass&rdquo; usually improves the work; when tired
            after running sessions, the same instinct produces marginal returns at high
            cognitive cost. As a result, I find that knowing when to stop is itself a research
            discipline, and one that consequently protects the quality of the <em>next</em>{" "}
            round.
          </p>

          <h3>Individual and Cohort Docs Serve Different Jobs</h3>
          <p>
            The cohort-consolidation step taught me that{" "}
            <mark className="hl">individual synthesis and cohort aggregation serve different jobs</mark>:
            the individual document tells the closed-loop story of the specific project, while
            the by-feature aggregation across all testers drives structural decisions. Both
            formats are valid, and neither replaces the other.
          </p>
        </section>
      </main>
    </div>
  );
}
