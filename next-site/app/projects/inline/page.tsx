import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Pop by inline — Kathleen Li",
};

/* Section order leads with Outcome (deliverables + impact) so recruiters
   see results first. Process sections follow (Researching → Designing →
   Testing → Iterating → About the Product), with Takeaways closing.
   Section naming matches JourneyTrack, ResearchHub, and Frogslayer.

   Content pulled from the final internship report so the argument chain
   (Gaps → Product Focuses → Hypothesis → Features → Refinements →
   Market Position → Core Feature) is the same one delivered to the
   sponsor's CEO — abstracted where NDA requires.

   NDA note: this case study operates under a strict sponsor
   confidentiality agreement. Product-specific mechanics, UI details,
   competitor names, colleague names, dates, and any interview findings
   that could identify the sponsor or its partners have been removed or
   generalized. The content below focuses on the design and research
   process rather than the resulting product. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "designing", label: "Designing" },
  { id: "testing", label: "Testing" },
  { id: "iterating", label: "Iterating" },
  { id: "product", label: "About the Product" },
  { id: "takeaways", label: "Takeaways" },
];

export default function InlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Pop by inline — Designing Event Coordination Under Uncertainty"
        meta="Summer 2026 · 3-month remote internship · Product Design Intern"
        subtitle="Making group coordination feel smooth when headcount, time, and location are all still TBD"
        imageLabel="Pop by inline · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          This case study operates under an active sponsor confidentiality agreement. Product-specific mechanics,
          UI details, competitor and colleague names, and identifying research findings have been removed or
          generalized. The content below focuses on the design and research process rather than the resulting
          product.
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            I delivered a <mark className="hl">comparable competitive audit of six event-coordination products</mark>,
            a gap analysis that translated the audits into{" "}
            <mark className="hl">two named gaps and three product focuses</mark> Pop&rsquo;s design would target,
            and an <mark className="hl">end-to-end interactive prototype</mark> covering both host and guest flows
            &mdash; built around a{" "}
            <em>collaborative voting mechanism</em> that resolves undetermined event details over time.
          </p>
          <p>
            I then ran <mark className="hl">four rounds of usability testing as lead facilitator</mark> plus an
            internal-employee validation round. The priority distribution across rounds &mdash;{" "}
            <em>red-heavy &rarr; mostly-yellow with one red &rarr; mostly-blue with no red</em> &mdash; is the
            strongest single piece of evidence that the shipped iterations landed. Every finding across rounds was
            traceable to a shipped or queued change through an{" "}
            <mark className="hl">Insight &rarr; Reasoning &rarr; Proposed Iteration &rarr; Implementation</mark>{" "}
            document I authored, closing the research loop visibly on one page.
          </p>
          <p>
            The work closed with a <mark className="hl">final stakeholder presentation</mark> and a written report
            structured around the same argument chain: <em>competitor gaps &rarr; product focuses &rarr; hypothesis
            &rarr; features &rarr; refinements &rarr; market position</em>. Two coherent artifacts of the same
            prototype state &mdash; an interactive testing build and a polished design-review build &mdash; support
            two different conversations.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>The Problem</h3>
          <p>
            Pop is an early-stage consumer-product exploration from a restaurant-technology company &mdash; a step
            from pure B2B into B2B2C. It&rsquo;s a <em>lightweight tool for planning everyday gatherings</em> and
            connecting them to venues.
            <br></br><br></br>
            Every gathering involves three variables &mdash;{" "}
            <mark className="hl">headcount, time, and location</mark> &mdash; and in real life they&rsquo;re rarely
            all confirmed at once. The design challenge: make coordination feel smooth while those variables are
            still uncertain, with lower friction than a group chat, for a Gen Z audience.
          </p>

          <h3>My Role</h3>
          <p>
            Product Design Intern, <mark className="hl">remote across a ~12-hour time-zone gap</mark> with a team
            based overseas. My role was explicitly framed around <em>clarity of thinking over production output</em>{" "}
            &mdash; bringing an outside-in perspective through competitive research, gap analysis, concept design,
            usability testing, and iteration.
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
            <div className="image-slot">competitive analysis framework · empty template</div>
            <figcaption>
              The reusable audit framework applied to every competitor for direct comparability. Filled analyses
              are held under confidentiality.
            </figcaption>
          </figure>

          <h3>From Competitor Gaps to Product Focuses</h3>
          <p>
            Cross-referencing each competitor&rsquo;s weaknesses against Pop&rsquo;s proposed feature set required{" "}
            <mark className="hl">judgment, not a mechanical table</mark> &mdash; a weakness in a different product
            category is not automatically a gap for Pop. After filtering for that, the audits converged on{" "}
            <mark className="hl">two category-independent gaps</mark>:
          </p>
          <p>
            <strong>Allowance of Uncertainty.</strong> One competitor tolerates uncertain event details but{" "}
            <em>never pushes the user to resolve them</em>; the others require specific details up front{" "}
            <em>without exception</em>. Neither extreme handles the real-world middle where details resolve
            gradually.
          </p>
          <p>
            <strong>Host Overreliance.</strong> Every competitor puts the burden of coordinating and finalizing
            event details on the individual host. Speed of coordination becomes limited to whatever the host has
            time and preference to drive.
          </p>
          <p>
            Those two gaps translated into <mark className="hl">three product focuses</mark> that anchored every
            design decision from that point forward:{" "}
            <em>shared target audience with competitors (validating market fit)</em>,{" "}
            <em>gradual reduction of event-detail uncertainty over time</em>, and{" "}
            <em>collaborative coordination between host and guests</em>. The design existed to close the two gaps
            through those three focuses.
          </p>
          <figure>
            <div className="image-slot">gaps → product focuses method diagram</div>
            <figcaption>
              The analytical bridge from competitor gaps to design goals. Method visualization; filled analysis is
              sponsor work product.
            </figcaption>
          </figure>
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
          <figure>
            <div className="image-slot">FigJam swimlane flow · phase structure (abstracted)</div>
            <figcaption>
              Three-phase flow &mdash; interest gauging, coordination, finalization &mdash; anchoring the design.
              Sticky-note text intentionally generalized.
            </figcaption>
          </figure>

          <h3>Four Features Around a Collaborative Core</h3>
          <p>
            Four features carried the product focuses into interactive form:
          </p>
          <p>
            <strong>A dual-RSVP framework</strong> that unites initial-interest signaling with the final RSVP into
            one continuous surface, keeping guests visible into the event&rsquo;s reception through any level of
            initial ambiguity &mdash; where competitors treat those as two separate flows.
          </p>
          <p>
            <strong>A collaborative voting poll</strong> that centralizes suggestions and votes on undetermined
            factors (venue, time). Where competitors leave the host to gauge group consensus through external
            channels before statically finalizing, this <em>dynamically resolves uncertainty over time</em>. This
            is the <mark className="hl">core feature</mark> &mdash; every other component draws from the data the
            poll generates.
          </p>
          <p>
            <strong>A data-informed manual override</strong> that surfaces group consensus first when
            last-minute event changes are unavoidable, so the host isn&rsquo;t guessing what the group actually
            wanted &mdash; where competitors leave overrides to memory or fragmented external channels.
          </p>
          <p>
            <strong>A day-of coordination surface</strong> centralizing arrival status and venue-navigation
            details, addressing the fragmentation that decentralized messaging leaves for larger groups.
          </p>

          <h3>Working with AI Prototyping Tools</h3>
          <p>
            First heavy use of AI-assisted prototyping. Lesson:{" "}
            <mark className="hl">AI tools generate polish but don&rsquo;t preserve design intent without explicit
            guardrails</mark>. Early iterations flattened product-specific mechanics into generic event-app shapes
            until I prompted with explicit &ldquo;what to leave alone&rdquo; constraints. I also caught and
            removed AI-fabricated framing before sharing deliverables &mdash;{" "}
            <em>content I didn&rsquo;t author shouldn&rsquo;t appear in work attributed to me</em>.
          </p>
          <p>
            <em>AI as shears, manual refinement as scissors.</em> The bulk was AI&rsquo;s job &mdash; generating
            dozens of screens, full components, plausible interactions. The refining &mdash; making host and guest
            calendars behave identically, sizing modals to hug their content, fixing hooks that snapped state back
            to a default &mdash; was mine.{" "}
            <mark className="hl">Using them together, in the right order, is the actual skill.</mark>
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
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
            preferences in the launch market &mdash; what matters is <em>proximity to mass-transit and area
            access</em>. Discoverability was the dominant usability failure mode: features that can&rsquo;t be
            found are functionally absent.
          </p>

          <h3>Round 2: The Priority Distribution Itself Was the Result</h3>
          <p>
            Round 2 (two new testers) produced only one red-priority finding, with the rest landing as yellow
            refinements and a blue feature idea.{" "}
            <mark className="hl">A round whose synthesis shifts from reds to yellows is the closest a usability
            process gets to objective evidence that an iteration worked.</mark>
          </p>
          <p>
            The one red was information architecture, not affordance &mdash; a different class of fix than Round 1.
            The &ldquo;Maybe-as-polite-no&rdquo; question also got a structural answer:{" "}
            <em>initial-interest RSVPs become binary; finalized-event RSVPs keep the three-state pattern where
            real-world tradeoffs actually exist</em>. Same word, different placement.
          </p>

          <h3>Rounds 3 &amp; 4: Zero Reds, Mostly Blues</h3>
          <p>
            The cleanest priority distribution of any round:{" "}
            <mark className="hl">zero red-priority findings, mostly blue feature-idea rows, and multiple explicit
            validation callouts</mark> confirming the earlier iterations landed as intended. Blue findings are the
            reward of shipping successful red and yellow fixes &mdash; a tester&rsquo;s brain only reaches
            feature-idea territory once the underlying usability failures are cleared.
          </p>
          <p>
            A later-round tester independently rediscovered a Round 1 finding through a different task.{" "}
            <em>Convergent findings across rounds are how a designer distinguishes coincidental preference from
            real design signal.</em>
          </p>

          <h3>Key Learnings from the Four Rounds</h3>
          <p>
            The prototype was deemed appropriate for scenarios involving{" "}
            <mark className="hl">undetermined time / location / headcount, invitees not close enough to share
            phone numbers or group chats, and headcount over ten</mark> &mdash; the target scenario the entire
            design rests on. Host and guest flow parity received praise for letting testers navigate the guest
            flow more quickly through familiarity with the host flow.
          </p>
          <p>
            One nuance surfaced worth naming: testers described Pop as best-suited for <em>casual</em> gatherings,
            but explicitly credited the visual color scheme and content tone as the reason.{" "}
            <mark className="hl">The casual read is a visual constraint, not an architectural one</mark> &mdash;
            the underlying flow generalizes to more formal contexts through visual/tone adjustments alone.
          </p>

          <h3>Interim Review + Internal Validation Round</h3>
          <p>
            An interim stakeholder presentation surfaced a{" "}
            <mark className="hl">cohort-wide research-consolidation methodology</mark> introduced by the team:
            individual per-session templates feeding a cross-team aggregated table with tester counts, so
            structural design decisions come from aggregated evidence rather than isolated results. I adopted the
            framework and applied it to the final feature-pitch defense.
          </p>
          <p>
            A fifth round with internal colleagues then validated the post-review prototype state, with scope
            approved by my mentor: two representative notifications added to the flow plus end-of-session debrief
            questions on adjacent feature ideas. Small round, validation intent &mdash; not major-research intent.
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
            Every refinement was framed as{" "}
            <mark className="hl">problem &rarr; fix &rarr; why it&rsquo;s better</mark>, traceable back to specific
            tester friction. Selected examples:
          </p>
          <p>
            <strong>&ldquo;Maybe&rdquo; on the initial RSVP became binary.</strong> Testers read &ldquo;Maybe&rdquo;
            on the initial-interest step as a polite &ldquo;No.&rdquo; The structural fix wasn&rsquo;t rewording
            &mdash; it was moving Maybe to where its real-world tradeoffs actually exist:{" "}
            <em>binary Interested / Not Interested on the initial RSVP, three-state Yes / Maybe / No on the
            finalized-event RSVP</em>. Same word, different placement.
          </p>
          <p>
            <strong>Distance became transit-aware.</strong> Testers found a raw distance form subjective to
            wherever they happened to be at time of voting, and unclear whether &ldquo;distance&rdquo; meant to
            venue or via transit. The form was removed and its intent integrated into the venue section as a{" "}
            <em>visual map of public-transit routes plus a distance-based sort</em> &mdash; the research insight
            became a shipped component, not a note.
          </p>
          <p>
            <strong>Manual override reorganized around consensus first.</strong> Testers noted the override page
            felt scroll-heavy. The content was reorganized into three toggles &mdash;{" "}
            <em>Consensus, Venues, Time</em> &mdash; with Consensus loaded first, so the host sees what the group
            wanted before altering anything. <em>The reorganization mirrored the mental model of a good override
            decision.</em>
          </p>
          <p>
            <strong>Two artifacts, two conversations.</strong> After Round 2, the prototype was ported to Figma
            Make for polished UI review while the interactive AI-Studio build kept the live testing panel.{" "}
            <mark className="hl">Same prototype state, two coherent artifacts, each optimized for the conversation
            it serves.</mark> Most intern projects end with one messy file doing too many jobs.
          </p>
          <p>
            A practical lesson: AI-assisted design is paced by shared resource budgets, not just time. Tools ran
            on different refresh cadences (monthly vs. daily credits), which forced a{" "}
            <em>design crux first, polish second</em> discipline at the tooling layer &mdash; the same lesson
            prototype iteration had already taught, now applied to how I planned AI usage.
          </p>
        </section>

        {/* ───── About the Product ───── */}
        <section id="product" className="case-section">
          <h2>About the Product</h2>

          <h3>Market Position</h3>
          <p>
            Where the existing market often separates hosts and guests in event coordination, Pop takes a{" "}
            <mark className="hl">different angle: encouraging collaboration between them</mark> to resolve
            scenarios varying in any level of uncertainty &mdash; headcount, location, or time. The three
            product focuses established during Researching mapped cleanly through to the delivered design.
          </p>

          <h3>Core Feature: The Voting Poll</h3>
          <p>
            The voting poll embodies Pop&rsquo;s collaborative model in practice. It{" "}
            <em>resolves undetermined event factors</em> through structured input from both host and guests, and{" "}
            <mark className="hl">provides the data other statistical features depend on</mark> &mdash; the manual
            override, the live-trends leaderboard, and the finalized-details reveal all draw from it. Without the
            voting poll, those features don&rsquo;t exist as designed.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            The biggest analytical lesson was <mark className="hl">synthesis over listing</mark> &mdash; collecting
            observations is the input; the value comes from committing to a recommendation. The biggest personal
            lesson was iteration habits: I tended to polish the parts I was confident about and avoid the harder
            parts &mdash; yet the harder parts were exactly what the brief hinged on.{" "}
            <em>Design the crux first, polish second.</em>
            <br></br><br></br>
            Round 1 added a third: <mark className="hl">research output has a quality ceiling set by energy, not
            skill</mark>. Later rounds taught me to <mark className="hl">read the shape of a synthesis</mark>,
            not just its rows &mdash; the priority distribution across rounds is itself a diagnostic. And the
            strongest transferable methodology from the whole internship:{" "}
            <mark className="hl">iteration cadence generalizes across artifact types</mark> &mdash; the same
            one-class-of-issue-per-revision discipline that worked on the prototype also worked on the presentation
            deck and the final written report, three separate artifacts, same rhythm, no regressions.
          </p>
        </section>
      </main>
    </div>
  );
}
