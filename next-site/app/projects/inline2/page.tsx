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
            I delivered a <mark className="hl">competitive audit, gap analysis, and an end-to-end interactive prototype</mark>{" "}
            of the product&rsquo;s first scenario covering both host and guest flows. As I ran
            each of the four rounds of usability testing as lead facilitator, I closed the
            findings from each round as shipped iterations before the following round began.
          </p>
          <p>
            After the interim stakeholder presentation, I contributed to a{" "}
            <mark className="hl">cohort-wide consolidation step</mark> that aggregated findings
            across all the interns&rsquo; testers, so structural decisions could be made ahead of
            the CEO-attended final review. From that consolidation, four candidate features were
            ultimately solidified for the final review and the written Product Direction Summary:{" "}
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
            <mark className="hl">headcount, time, and location</mark>, however in real life these
            are rarely all confirmed at once. As a result, the design challenge was to make
            coordination feel smooth while those variables were still uncertain, with lower
            friction than a group chat, for a Gen Z audience.
          </p>

          <h3>My Role</h3>
          <p>
            I worked as a Product Design Intern,{" "}
            <mark className="hl">remote across a roughly 12-hour time-zone gap</mark> with a team
            based in Taiwan. The role was framed around clarity of thinking rather than
            production output, so I focused on bringing an outside perspective through
            competitive research, gap analysis, concept design, and usability testing.
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
            host and guest walkthroughs. I then applied this framework consistently across
            multiple event-coordination products, conducting each audit hands-on instead of
            simply skimming their feature lists.
          </p>
          <p>
            Something I realized during this pass was that{" "}
            <mark className="hl">the competitors were not all the same kind of product</mark> as
            Pop. Because of that, the category distinction became the backbone of the following
            gap analysis, so a weakness from a different product category would not automatically
            be counted as a gap for Pop.
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
            <mark className="hl">judgment rather than a mechanical table</mark>. After I filtered
            through the audit&rsquo;s category distinction, the remaining gaps became the
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
            venue?</em> and <em>how does the guest experience an evolving event?</em> To answer
            them, I worked through three artifact layers, starting with a{" "}
            <mark className="hl">FigJam user flow with phase swimlanes</mark>, then moving to
            AI-assisted wireframes, and finally arriving at an interactive single-phone prototype
            that conveyed the event&rsquo;s evolving state over time.
          </p>
          <p>
            As I made each major design move, I traced it back to a specific observation from
            the competitive audit and gap analysis, so every feature decision could be defended
            against a documented finding instead of a preference.
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
            This project was my first heavy use of AI-assisted prototyping, and it taught me
            that{" "}
            <mark className="hl">AI tools generate polish but do not preserve design intent without explicit guardrails</mark>.
            Early iterations flattened product-specific mechanics into generic event-app shapes
            until I prompted with explicit &ldquo;what to leave alone&rdquo; constraints. I also
            actively caught and removed AI-fabricated framing before sharing deliverables, since
            content I did not author should not appear in work attributed to me.
          </p>
          <p>
            AI prototyping handled the heavy lifting throughout the project by generating
            components and plausible interactions, while I handled the precision work manually
            to make the interface actually consistent. As a result, I recognize that{" "}
            <mark className="hl">using AI and manual refinement together, in the right order and with the right ratio for the moment</mark>,
            is what makes the difference between an AI-shaped output and a designer-shaped one.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Four Rounds of Usability Testing</h3>
          <p>
            I served as{" "}
            <mark className="hl">lead facilitator across four rounds of usability testing</mark>,
            which was my first time proctoring after months of preparing as a researcher. On the
            same day as each round, I synthesized the findings into a structured insights
            document organized as Insight → Reasoning → Proposed Iteration, with priority
            color-coding applied throughout.
          </p>
          <p>
            To prepare for the sessions, I built a{" "}
            <mark className="hl">bilingual participant guide</mark> that placed one task per
            page so participants always knew what came next, along with an interview plan that
            paired warm-up and post-task debrief probes anchored on the brief&rsquo;s two
            original design questions. From building this protocol, I recognize that a testing
            protocol benefits from the same iterative rigor as the designs it evaluates.
          </p>

          <h3>Priority Distribution as Diagnostic</h3>
          <p>
            The clearest signal of iteration progress across the four rounds was the{" "}
            <mark className="hl">priority distribution itself</mark>. Round 1 produced multiple
            red-priority findings, however Round 2 produced only one, and Rounds 3 and 4
            produced zero red-priority findings with mostly blue &ldquo;additional feature
            idea&rdquo; rows. From this shift, I recognize that a round whose synthesis moves
            from reds to yellows to blues is the closest a usability process gets to objective
            evidence that an iteration worked.
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
            addressed the highest-priority findings from that round before the following round
            began. As a result, every round of testing evaluated a prototype that had already
            responded to the previous round&rsquo;s recorded evidence, instead of the same
            prototype re-tested with different participants.
          </p>

          <h3>Splitting the Prototype Across Two Artifacts</h3>
          <p>
            After the interim review, the prototype was{" "}
            <mark className="hl">ported to Figma Make through a deliberate guardrails contract</mark>,
            preserving every screen, interactive element, label, and state transition exactly.
            Only the visual treatment was redesigned during the port.
          </p>
          <p>
            The two artifacts then served two distinct purposes. The Figma Make version carried
            the polished UI for design review and the final-review stakeholders, while the AI
            Studio prototype kept the live testing panel and stayed the active
            usability-research artifact.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Prioritizing Synthesis Over Listing</h3>
          <p>
            The biggest analytical lesson from this project was that{" "}
            <mark className="hl">collecting observations is only the input</mark>, so the actual
            value comes from comparing across the observations and committing to a
            recommendation based on them.
            <br></br><br></br>
            On the same note, I also noticed that I tended to polish the parts I was already
            confident about while avoiding the harder parts, even though the harder parts were
            what the brief was actually asking about. Because of that, I am now more deliberate
            about tackling the least-confident parts first, so the remaining time goes to
            refining instead of stalling.
          </p>

          <h3>Recognizing When to Stop</h3>
          <p>
            Round 1 of testing also taught me that{" "}
            <mark className="hl">research output has a quality ceiling set by energy rather than skill</mark>.
            When I was fresh, one more polish pass would usually improve the work. However, when
            I was tired after running sessions, the same instinct produced marginal returns at a
            high cognitive cost.
            <br></br><br></br>
            From this, I now recognize that knowing when to stop is itself a research skill,
            since stopping at the right point protects the quality of the following round.
          </p>

          <h3>Individual and Cohort Synthesis Serve Different Purposes</h3>
          <p>
            The cohort-consolidation step taught me that{" "}
            <mark className="hl">individual synthesis and cohort aggregation are used differently</mark>.
            The individual document captures the story of a specific project, while the
            aggregation across all testers drives structural decisions across the product.
            Because both formats have their own role, I now think differently about which one to
            reach for at each stage of the project.
          </p>
        </section>
      </main>
    </div>
  );
}
