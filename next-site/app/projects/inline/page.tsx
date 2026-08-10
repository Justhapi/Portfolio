import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Pop by inline — Kathleen Li",
  robots: { index: false, follow: false },
};
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
              <strong>Delivered against inline&rsquo;s stated criterion of &ldquo;clarity of thinking over production output&rdquo;</strong>{" "}
              across four rounds of usability testing, with each round&rsquo;s findings closed as
              shipped iterations before the following round began. The priority distribution
              shifted red-heavy to mostly-blue with zero reds by the final round.
            </p>
            <p className="outcome-callout__meta">
              Summer 2026 · Pop by inline · 3-month remote internship · 4 test rounds
            </p>
          </aside>

          <p>
            I delivered a <mark className="hl">competitive audit, gap analysis, and an end-to-end interactive prototype</mark>{" "}
            of the product&rsquo;s first scenario covering both host and guest flows. As I ran
            each of the four external rounds of usability testing (plus one internal-employee
            validation round) as lead facilitator, I closed the findings from each round as
            shipped iterations before the following round began.
          </p>
          <p>
            After the interim stakeholder presentation, I contributed to a{" "}
            <mark className="hl">cohort-wide consolidation step</mark> that aggregated findings
            across the interns&rsquo; testers, so structural decisions could be made ahead of
            the CEO-attended final review. From that consolidation, a set of core features was
            solidified for the final review and the written{" "}
            <mark className="hl">Product Direction Summary</mark>.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            <mark className="hl">Pop by inline</mark> is an early-stage consumer product
            exploration from inline, a restaurant-technology company headquartered in Taipei
            whose core business is a{" "}
            <mark className="hl">B2B reservation, waitlist, and table-management platform</mark>{" "}
            serving thousands of restaurants across the Asia-Pacific region. Pop is a
            lightweight consumer tool for planning everyday gatherings and connecting them to
            restaurant venues, marking inline&rsquo;s step from pure B2B into B2B2C by creating
            downstream restaurant-side revenue from a consumer-facing product.
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
            <mark className="hl">remote across a roughly 12-hour time-zone gap</mark> with the
            team based in Taiwan. I was the{" "}
            <mark className="hl">sole designer on one branch of the project</mark>, working
            alongside a parallel-branch team of two other interns grounded in different research
            inputs. The role was framed around clarity of thinking rather than production
            output, so I focused on bringing an outside perspective through competitive
            research, gap analysis, concept design, and usability testing.
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
            host and guest walkthroughs. I then applied this framework consistently across{" "}
            <mark className="hl">six event-coordination products</mark>, conducting each audit
            hands-on (registering as a real user, completing both host and guest tasks
            end-to-end, walking through each interface myself) instead of skimming feature
            lists. When a product blocked access (regional phone-number registration, paywalled
            onboarding), I raised the access blocker with the team rather than getting stuck on
            it, and completed the audit&rsquo;s host or guest side that was still reachable.
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
            I cross-referenced each competitor&rsquo;s weaknesses against the team&rsquo;s{" "}
            <mark className="hl">eight proposed solution features</mark> in a structured table
            &mdash; for every weakness, I asked whether a proposed feature already addresses it,
            partially addresses it, or leaves it open. After filtering out weaknesses that
            belonged to a different product category than Pop, I{" "}
            <mark className="hl">distilled the remaining weaknesses into a small set of named opportunity gaps</mark>{" "}
            within Pop&rsquo;s category. I then translated each of those gaps into a product
            focus, and each product focus in turn anchored a specific design proposal that
            could be defended against a documented finding instead of a preference.
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
            <mark className="hl">FigJam user flow that mapped the event&rsquo;s phases end-to-end</mark>, then moving to
            AI-assisted wireframes, and finally arriving at an interactive single-phone prototype
            that conveyed the event&rsquo;s evolving state over time.
          </p>
          <figure>
            <div className="image-slot">FigJam user flow + key prototype screens</div>
            <figcaption>
              The end-to-end FigJam user flow alongside key prototype screens.
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
            to make the interface actually consistent.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Four Rounds of Usability Testing</h3>
          <p>
            I served as{" "}
            <mark className="hl">lead facilitator across four rounds of usability testing</mark>,
            which was my first time proctoring after months of preparing as a researcher. Each
            round ran as <mark className="hl">three back-to-back sessions in a roughly two-hour window</mark>{" "}
            covering both host and guest perspectives of the flow, with note-takers supporting
            while I drove probes and task pacing. On the same day as each round, I synthesized
            the findings into a structured insights document organized as{" "}
            <mark className="hl">Insight → Reasoning → Proposed Iteration → Implementation</mark>,
            with priority color-coding applied throughout so the highest-leverage issues would
            be visible at a glance.
          </p>
          <p>
            The interview plan itself went through five iterations before Round 1, and each
            subsequent round added iteration-specific probes on top of the core protocol probes
            &mdash; so the plan evolved with the prototype rather than being written once and
            re-used. From building the protocol this way, I recognize that a testing protocol
            benefits from the same iterative rigor as the designs it evaluates.
          </p>

          <h3>Priority Distribution as Diagnostic</h3>
          <p>
            The clearest signal of iteration progress across the four rounds was the{" "}
            <mark className="hl">priority distribution itself</mark>. Round 1 produced multiple
            red-priority findings, Round 2 shifted to mostly yellow with a single red remaining,
            and by Rounds 3 and 4 the findings were mostly blue &ldquo;additional feature
            idea&rdquo; rows with zero reds. An additional internal-employee validation round
            after Round 4 confirmed the pattern held on a fresh audience. From this shift, I
            recognize that a round whose synthesis moves from reds to yellows to blues is the
            closest a usability process gets to objective evidence that an iteration worked.
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
            <mark className="hl">ported from Google AI Studio to Figma Make through a deliberate guardrails contract</mark>{" "}
            &mdash; preserving every screen, interactive element, label, and state transition
            exactly, so only the visual treatment was redesigned during the port. The guardrails
            contract was written up-front and enforced through explicit &ldquo;what to leave
            alone&rdquo; prompts so the AI-assisted port would not silently drift from the
            testing-validated interaction model.
          </p>
          <p>
            The two artifacts then served two distinct purposes. The Figma Make version carried
            the polished UI for design review and the final-review stakeholders, while the
            Google AI Studio prototype kept the live testing panel and stayed the active
            usability-research artifact. Splitting the two conversations across two artifacts
            let each artifact optimize for its own audience without one compromising the other.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <h3>Distinguishing Categories of Competitors</h3>
          <p>
            During the project's research phase, I recognized that a <mark className="hl">rigorous gap analysis requires determination of the 
            scope's limitations.</mark> While conducting the competitive audit, I realized <mark className="hl">that some of audited competitors 
            differing overlaps of identity compared to Pop.</mark> As a result, I had to distinguish the scope of direct competitors in context 
            to Pop's focus before building the gap analysis, so a gap of a competitor would not automatically be counted as a gap for Pop if it were 
            to be an outside-of-scope gap.
          </p>

          <h3>Priorities in Implementation with AI</h3>
          <p>
            From this project, I understood how to better navigate a workflow that includes
            implementing with AI. The AI tools I utilized (Figma Make and Google AI Studio) had
            limits on the number of iterations I could implement at a time. To adapt, I made
            sure to use the credits efficiently by{" "}
            <mark className="hl">recognizing and prioritizing larger-scale implementations based on their impact on the prototype&rsquo;s success during usability testing</mark>{" "}
            (new components, full flow additions), while{" "}
            <mark className="hl">manually refining smaller and specific details afterward</mark>{" "}
            for interface state consistency and visual detail coherence.
          </p>
        </section>
      </main>
    </div>
  );
}
