import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Pop by inline — Kathleen Li",
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

export default function InlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Pop by inline — Designing Event Coordination Under Uncertainty"
        meta="Summer 2026 · 3-month remote internship · Product Design Intern · In progress"
        subtitle="Making group coordination feel smooth when headcount, time, and location are all still TBD"
        imageLabel="Pop by inline · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          This project is under an active confidentiality agreement. Product details below are intentionally
          generalized; confidential and proprietary details have been removed or anonymized. This case study
          focuses on my design and research process rather than the product itself.
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome (so far)</h2>
          <p>
            Within the first stretch of the internship I delivered a{" "}
            <mark className="hl">competitive audit of six event-coordination products</mark>, a{" "}
            <mark className="hl">gap analysis</mark> of the team&rsquo;s proposed feature set that surfaced two
            genuine strategic gaps, and an <mark className="hl">end-to-end interactive prototype</mark> of the
            product&rsquo;s first scenario &mdash; covering both host and guest flows &mdash; that my manager
            accepted with no critical pushback.
          </p>
          <p>
            I then ran <mark className="hl">four rounds of usability testing as lead facilitator</mark>. The
            priority distribution across rounds &mdash;{" "}
            <em>red-heavy &rarr; mostly-yellow with one red &rarr; mostly-blue with no red</em> &mdash; is the
            strongest single piece of evidence that the shipped iterations landed. Round 1 surfaced a
            market-specific localization insight that reframed a whole feature; Rounds 3 and 4 verbalized
            closed-loop confirmations that the earlier iterations worked.
          </p>
          <p>
            Every Round 2 finding was implemented as a shipped design change before the Figma Make port, which is
            complete and now serves as the design-review artifact. Four candidate features have been solidified for
            the July 16 CEO-attended review and the written Product Direction Summary, each grounded in a distinct
            evidence chain spanning multiple rounds.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            Pop is an early-stage consumer-product exploration from a restaurant-technology company &mdash; a
            step from pure B2B into B2B2C. It&rsquo;s a <em>lightweight tool for planning everyday gatherings</em>
            {" "}and connecting them to venues.
          </p>

          <h3>The Problem</h3>
          <p>
            Every gathering involves three variables &mdash;{" "}
            <mark className="hl">headcount, time, and location</mark> &mdash; and in real life they&rsquo;re rarely
            all confirmed at once. The design challenge: make coordination feel smooth while those variables are
            still uncertain, with lower friction than a group chat, for a Gen Z audience.
          </p>

          <h3>My Role</h3>
          <p>
            Product Design Intern, <mark className="hl">remote across a ~12-hour time-zone gap</mark> with a team
            based in Taiwan. My role was explicitly framed around <em>clarity of thinking over production output</em>{" "}
            &mdash; bringing an outside-in perspective through competitive research, gap analysis, concept design,
            and usability testing.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>

          <h3>Competitive Audits with One Reusable Framework</h3>
          <p>
            I built a single competitive-analysis framework &mdash;{" "}
            <mark className="hl">positioning, key features, strengths/weaknesses, business model, and end-to-end
            host and guest walkthroughs</mark> &mdash; and applied it consistently across six event-coordination
            products. The audits were hands-on: I tested edge cases directly (reminder customization, paywall
            behavior) rather than skimming feature lists.
          </p>
          <p>
            A key realization: <mark className="hl">competitors are not all the same kind of product</mark>. Some
            share Pop&rsquo;s category; others don&rsquo;t &mdash; and that distinction became the backbone of the
            gap analysis.
          </p>
          <figure>
            <div className="image-slot">competitive analysis framework (empty template)</div>
            <figcaption>
              The reusable audit framework applied to every competitor for direct comparability.
            </figcaption>
          </figure>

          <h3>Gap Analysis with Category Discipline</h3>
          <p>
            Cross-referencing each competitor&rsquo;s weaknesses against the team&rsquo;s proposed feature set
            required <mark className="hl">judgment, not a mechanical table</mark> &mdash; a weakness in a different
            product category is not automatically a gap for Pop. After filtering for that, two genuine,
            category-independent gaps remained.
          </p>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Scenario 1: An Evolving Event</h3>
          <p>
            The design brief posed two questions: <em>how does the flow handle TBD time and venue?</em> and{" "}
            <em>how does the guest experience an evolving event?</em> I worked through three artifact layers &mdash;
            a FigJam user flow with phase swimlanes, AI-assisted wireframes, and a final{" "}
            <mark className="hl">interactive single-phone prototype with simulated push notifications</mark> that
            conveyed the event&rsquo;s evolving state.
          </p>
          <p>
            Every major design move traced explicitly to a competitor observation: an{" "}
            <em>interest-gauging mechanism</em> that routes undefined variables into a collaborative poll instead of
            treating the creation form as incomplete; a <em>two-step RSVP architecture</em> (soft interest signal +
            final RSVP) that gives &ldquo;maybe&rdquo; responders a home; progressive-disclosure preference inputs
            that feed venue suggestions without questionnaire overload.
          </p>
          <figure>
            <div className="image-slot">FigJam swimlane flow (abstracted)</div>
            <figcaption>
              Three-phase flow &mdash; interest gauging, coordination, finalization &mdash; anchoring the design.
            </figcaption>
          </figure>

          <h3>Working with AI Prototyping Tools</h3>
          <p>
            First heavy use of AI-assisted prototyping. Lesson:{" "}
            <mark className="hl">AI tools generate polish but don&rsquo;t preserve design intent without explicit
            guardrails</mark>. Early iterations flattened product-specific mechanics into generic event-app shapes
            until I prompted with explicit &ldquo;what to leave alone&rdquo; constraints.
          </p>
          <p>
            <em>AI as shears, manual refinement as scissors.</em> The bulk was AI&rsquo;s job &mdash; generating
            dozens of screens, full components, plausible interactions. The refining &mdash; making host and guest
            calendars behave identically, sizing modals to hug their content, removing redundant pickers, fixing
            hooks that snapped state back to a default &mdash; was mine.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing (Rounds 1–4 complete)</h2>
          <p>
            I served as <mark className="hl">lead facilitator</mark> across three back-to-back sessions in a
            two-hour window &mdash; my first time proctoring after months of preparing as the researcher. Same-day,
            I synthesized findings into an{" "}
            <em>Insight &rarr; Reasoning &rarr; Proposed Iteration &rarr; Implementation</em> document with priority
            color-coding.
          </p>

          <h3>Round 1: The Core Design Bet Was Validated</h3>
          <p>
            All three testers independently confirmed the app&rsquo;s value lives specifically in the{" "}
            <em>uncertain-coordination phase</em>. A market-specific localization insight surfaced:{" "}
            <mark className="hl">distance from the user&rsquo;s location is the wrong frame</mark> for venue
            preferences in the launch market &mdash; what matters is <em>proximity to mass-transit and area access</em>.
            Discoverability was the dominant usability failure mode: features that can&rsquo;t be found are
            functionally absent.
          </p>

          <h3>Round 2: The Priority Distribution Itself Was the Result</h3>
          <p>
            Round 2 (two new testers) produced only one red-priority finding, with the remaining rows landing as
            yellow refinements and one blue feature idea.{" "}
            <mark className="hl">A round whose synthesis shifts from reds to yellows is the closest a usability
            process gets to objective evidence that an iteration worked.</mark>
          </p>
          <p>
            The one red was information architecture, not affordance. The &ldquo;Maybe-as-polite-no&rdquo; question
            got a structural answer: initial-interest RSVPs become <em>binary</em> (&ldquo;Interested in
            Coordinating / Not Interested&rdquo;); finalized-event RSVPs keep the <em>three-state</em> Yes/Maybe/No
            pattern where real-world tradeoffs actually exist.
          </p>

          <h3>Rounds 3 &amp; 4: Zero Reds, Mostly Blues</h3>
          <p>
            The cleanest priority distribution of any round:{" "}
            <mark className="hl">zero red-priority findings, mostly blue &ldquo;feature idea&rdquo; rows, and
            multiple explicit validation callouts</mark> confirming the Rounds 1 and 2 shipped iterations landed as
            intended. Blue findings are the reward of shipping successful red and yellow fixes &mdash; a
            tester&rsquo;s brain only reaches feature-idea territory once the underlying usability failures are
            cleared.
          </p>
          <p>
            A Round 4 tester independently rediscovered a Round 1 finding through a different task.{" "}
            <em>Convergent findings across rounds are how a designer distinguishes coincidental preference from real
            design signal.</em>
          </p>
          <figure>
            <div className="image-slot">testing plan diagram · Rounds 1–4 → cohort consolidation → final review</div>
            <figcaption>
              Method visualization; product screens omitted per confidentiality agreement.
            </figcaption>
          </figure>
        </section>

        {/* ───── Iterating ───── */}
        <section id="iterating" className="case-section">
          <h2>Iterating</h2>
          <p>
            Within days of Round 1 synthesis, I built a new prototype iteration that closed the most-leveraged
            findings:
          </p>
          <p>
            <strong>A new transit-aware venue display.</strong> The Round 1 insight became a shipped design
            change, not a backlog item &mdash; each venue now maps to specific transit-station access with walking
            times, area context, and route information.
          </p>
          <p>
            <strong>Event variables now lock individually.</strong> Hosts can confirm/lock specific event variables
            individually rather than as a single committed bundle &mdash; an event can exist with one factor
            decided and others TBD, routing cleanly through the collaborative flow.
          </p>
          <p>
            <strong>Two artifacts, two conversations.</strong> After Round 2, the prototype was ported to Figma
            Make for the polished UI review, while the AI-Studio prototype kept the interactive testing panel.{" "}
            <mark className="hl">Same prototype state, two coherent artifacts, each optimized for the conversation
            it serves.</mark>
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            The biggest analytical lesson was <mark className="hl">synthesis over listing</mark> &mdash; collecting
            observations is the input; the value comes from comparing across them and committing to a
            recommendation. The biggest personal lesson was iteration habits: I noticed I tended to polish the
            parts I was confident about and avoid the harder parts &mdash; yet the harder parts were exactly what
            the brief hinged on. <em>Design the crux first, polish second.</em>
          </p>
          <p>
            Round 1 added a third:{" "}
            <mark className="hl">research output has a quality ceiling set by energy, not skill</mark>. When
            I&rsquo;m fresh, one more polish pass usually improves the work; when I&rsquo;m tired after running
            sessions, the same instinct produces marginal returns at high cognitive cost. Knowing when to stop is a
            research discipline.
          </p>
          <p>
            Round 2 taught me to <mark className="hl">read the shape of a synthesis</mark>, not just its rows. The
            priority distribution across rounds &mdash; how many reds vs. yellows vs. blues &mdash; is itself a
            diagnostic about whether the previous iteration landed. Future synthesis reviews start with the shape
            and then read the content.
          </p>
          <p>
            Rounds 3 &amp; 4 taught me that{" "}
            <mark className="hl">blue findings are the reward of shipping successful red and yellow fixes</mark>. A
            tester only reaches feature-idea territory once the underlying usability failures are out of the way.
            The absence of reds by Round 3 is what the shipped iterations look like when they work.
          </p>
          <p>
            Finally: <em>individual synthesis and cohort aggregation serve different jobs.</em> My by-round-by-tester
            document tells the research-process story (portfolio framing); the cohort by-feature table drives
            structural decisions at team scale. Both formats are valid; neither replaces the other; knowing which
            instrument to reach for depends on the job.
          </p>
        </section>
      </main>
    </div>
  );
}
