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
   ("Pop"), the sponsor context, and specific research/design/testing
   findings that the confidentiality agreement covers — do not link,
   share, or index this route until written consent is on file. The
   metadata `robots: noindex/nofollow` above hints crawlers away, but
   the real safeguard is that nothing routes here. */
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
        subtitle="A lightweight consumer tool for planning everyday gatherings — inline's B2B → B2B2C step"
        imageLabel="Pop by inline · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          Draft copy for private review. Under the terms of the sponsor&rsquo;s confidentiality agreement,
          this page is not publicly linked and should not be shared until written consent is on file.
          Confidential and proprietary details described below remain covered by the agreement.
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            Delivered a <mark className="hl">comparable competitive audit across six event-coordination products</mark>,
            a <mark className="hl">gap analysis</mark> that surfaced two genuine category-independent strategic gaps,
            and an <mark className="hl">end-to-end interactive prototype of the product&rsquo;s first scenario</mark>{" "}
            — covering both host and guest flows — accepted by my manager with no critical pushback. Then ran{" "}
            <mark className="hl">four rounds of usability testing as lead facilitator</mark>, closing each
            round&rsquo;s findings as shipped iterations before the next round began. The four-round arc —{" "}
            <mark className="hl">red-heavy → mostly-yellow with one red → mostly-blue with no red</mark> — is
            the strongest single piece of evidence that the shipped iterations actually landed.
          </p>
          <p>
            Following the interim stakeholder presentation on July 2, contributed to a{" "}
            <mark className="hl">cohort-wide consolidation step</mark> aggregating findings across all interns&rsquo;
            testers to drive threshold-based structural decisions ahead of the July 16 CEO-attended final review.
            Every one of the seven tactical feedback items from the interim review was addressed in the prototype
            before final review. Four candidate features were solidified for the July 16 review and the written
            July 23 Product Direction Summary: <mark className="hl">Questionnaire, Interest + Finalized RSVP,
            Notifications, and Archive</mark> — each grounded in a distinct evidence chain spanning multiple rounds.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            <mark className="hl">Pop by inline</mark> is an early-stage consumer product exploration from inline,
            a restaurant-technology company whose core business is B2B reservation and table-management systems.
            Pop is a <mark className="hl">lightweight tool for planning everyday gatherings</mark> and connecting
            them to restaurant venues — inline&rsquo;s step from pure B2B into B2B2C.
          </p>

          <h3>The Problem</h3>
          <p>
            Every gathering involves three variables — <mark className="hl">headcount, time, and location — and
            in real life they&rsquo;re rarely all confirmed at once</mark>. The design challenge: make
            coordination feel smooth while those variables are still uncertain, with lower friction than a group
            chat, for a Gen Z audience.
          </p>

          <h3>My Role</h3>
          <p>
            Product Design Intern, <mark className="hl">remote across a ~12-hour time-zone gap</mark> with a team
            based in Taiwan. The role was explicitly framed around{" "}
            <mark className="hl">clarity of thinking over production output</mark> — bringing an outside-in
            perspective through competitive research, gap analysis, concept design, and usability testing.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>

          <h3>Competitive Audits with One Reusable Framework</h3>
          <p>
            Built a single competitive-analysis framework — positioning, key features, strengths/weaknesses,
            business model, and <mark className="hl">end-to-end host and guest walkthroughs</mark> — and applied
            it consistently across Partiful, Meetup, Luma, Apple Invites, Paperless Post, and a Taiwan-based
            competitor. The audits were hands-on: tested edge cases directly (reminder customization, paywall
            behavior) rather than skimming feature lists.
          </p>
          <p>
            A key realization: <mark className="hl">competitors are not all the same kind of product</mark>.
            Partiful shares Pop&rsquo;s category; Meetup does not — and that distinction became the backbone of
            the gap analysis.
          </p>
          <figure>
            <div className="image-slot">competitive-analysis framework · reusable template</div>
            <figcaption>
              The reusable framework template applied consistently across six products, with columns for
              positioning, features, strengths, weaknesses, business model, and end-to-end walkthroughs.
            </figcaption>
          </figure>

          <h3>Gap Analysis with Category Discipline</h3>
          <p>
            Cross-referencing each competitor&rsquo;s weaknesses against the team&rsquo;s proposed feature set
            required <mark className="hl">judgment, not a mechanical table</mark> — a weakness in a different
            product category is not automatically a gap for Pop. After filtering for that, two genuine,
            category-independent gaps remained, including that{" "}
            <mark className="hl">no proposed feature clearly owned low-friction event creation</mark>, despite
            &ldquo;the high psychological cost of starting&rdquo; being a core host pain point the team itself
            had identified.
          </p>
          <figure>
            <div className="image-slot">gap-analysis matrix · competitor weakness × proposed feature</div>
            <figcaption>
              Gap-analysis matrix cross-referencing competitor weaknesses against Pop&rsquo;s proposed feature
              set, with addressed / partial / open color coding surfacing the two category-independent gaps.
            </figcaption>
          </figure>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Scenario 1: An Evolving Event</h3>
          <p>
            The design brief posed two questions: <em>how does the flow handle TBD time and venue?</em> and{" "}
            <em>how does the guest experience an evolving event?</em> Worked through three artifact layers — a{" "}
            <mark className="hl">FigJam user flow with phase swimlanes</mark>, AI-assisted wireframes, and a
            final <mark className="hl">interactive single-phone prototype with simulated push notifications</mark>{" "}
            that convey the event&rsquo;s evolving state.
          </p>
          <p>
            Every major design move traced explicitly to a competitor observation. An{" "}
            <mark className="hl">interest-gauging mechanism</mark> routes undefined time/venue variables into a
            collaborative poll instead of treating the creation form as incomplete — a structural counter to a
            competitor&rsquo;s &ldquo;punishment on vagueness.&rdquo; A{" "}
            <mark className="hl">two-step RSVP architecture</mark> (a soft &ldquo;I&rsquo;m interested!&rdquo;
            followed by a final RSVP after the host finalizes) counters the binary RSVP pattern that leaves
            &ldquo;maybe&rdquo; responders unsupported.{" "}
            <mark className="hl">Progressive-disclosure preference inputs</mark> feed venue suggestions without
            inheriting questionnaire-overload onboarding, and a{" "}
            <mark className="hl">designed reveal moment</mark> turns venue finalization into a beat rather than
            a silent state change.
          </p>
          <figure>
            <div className="image-slot">FigJam phase-swimlane flow + key prototype screens</div>
            <figcaption>
              The three-phase user flow (creation → coordination → finalization) alongside key prototype screens
              for the interest-gauging poll, two-step RSVP, and reveal moment.
            </figcaption>
          </figure>

          <h3>Working with AI Prototyping Tools</h3>
          <p>
            This was the first heavy use of AI-assisted prototyping in the workflow, and it taught that{" "}
            <mark className="hl">AI tools generate polish but don&rsquo;t preserve design intent without
            explicit guardrails</mark> — early iterations flattened product-specific mechanics into generic
            event-app shapes until prompted with explicit &ldquo;what to leave alone&rdquo; constraints. Caught
            and removed AI-fabricated framing before sharing deliverables:{" "}
            <mark className="hl">content I didn&rsquo;t author shouldn&rsquo;t appear in work attributed to me</mark>.
          </p>
          <p>
            <strong>AI as shears, manual refinement as scissors.</strong> Like a hairdresser using shears for
            bulk volume removal and scissors for precision shaping, AI prototyping handles the heavy lifting —
            generating dozens of screens, full components, plausible interactions — while manual code refinement
            handles the precision work that makes an interface actually consistent. The bulk was AI&rsquo;s job;
            the refining — making host and guest calendars interact identically, sizing modals to hug their
            content, removing redundant calendar pickers, fixing useEffect hooks that hostile-snap state back to
            a default day, polishing dot indicators that doubled up on the selected state — was mine. The two
            aren&rsquo;t substitutes for each other;{" "}
            <mark className="hl">using them together, in the right order, with the right ratio for the moment,
            is the actual skill</mark>.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <p>
            Served as <mark className="hl">lead facilitator across three back-to-back usability sessions in a
            two-hour window</mark> — first time proctoring after months of preparing as the researcher. Same-day,
            synthesized findings into a structured insights document organized as{" "}
            <mark className="hl">Insight → Reasoning → Proposed Iteration</mark>, with priority color-coding.
          </p>
          <p>
            To prepare, built a <mark className="hl">bilingual participant guide</mark> (one task per page so
            the participant always knows what&rsquo;s next) and an{" "}
            <mark className="hl">interview plan with paired warm-up and post-task debrief probes</mark> anchored
            on the brief&rsquo;s two original design questions. The interview plan went through five focused
            iterations in a single working session — sharpening the line between behavioral observation and
            emotional response, balancing the host vs. guest probe count, and pruning leading language.{" "}
            <mark className="hl">A testing protocol benefits from the same iterative rigor as the designs it
            evaluates</mark>.
          </p>

          <h3>Round 1 — Validating the Core Design Bet</h3>
          <p>
            <strong>The core design bet was validated.</strong> All three testers independently confirmed the
            app&rsquo;s value lives specifically in the <em>uncertain-coordination phase</em> — when a factor
            (headcount, time, or venue) is still being decided. One tester said directly:{" "}
            <em>&ldquo;Don&rsquo;t see the point of using the app if all the details are confirmed.&rdquo;</em>{" "}
            That signal pointed toward an enhancement:{" "}
            <mark className="hl">let hosts lock variables individually</mark>, so an event with one decided
            factor and two TBD still routes cleanly into the collaborative flow.
          </p>
          <p>
            <strong>A market-specific localization insight reframed a whole feature.</strong> Three testers
            converged that <mark className="hl">distance from the user&rsquo;s location is the wrong frame</mark>{" "}
            for venue preferences in the product&rsquo;s launch market. What matters is{" "}
            <mark className="hl">proximity to mass-transit and area access</mark>, not raw kilometers from home.
            This is the kind of finding that would never surface from US-based testing — and it justified the
            entire round on its own.
          </p>
          <p>
            <strong>Discoverability is the dominant usability failure mode.</strong> Multiple existing features
            — voting, suggesting times, suggesting venues, modifying deadlines — were not findable to testers
            despite being functionally present.{" "}
            <mark className="hl">Features that can&rsquo;t be found by users are functionally absent</mark>. The
            next prototype iteration prioritized affordance visibility over net-new features.
          </p>

          <h3>Round 2 — Priority Distribution Shifts</h3>
          <p>
            Round 2 ran with two new testers and validated that the Round 1 iterations landed. The clearest
            signal was the <mark className="hl">priority distribution itself</mark>: Round 1 produced multiple
            red-priority findings; Round 2 produced only one, with the remaining rows landing as yellow
            refinements and a blue feature idea.{" "}
            <mark className="hl">A round whose synthesis shifts from reds to yellows is the closest a usability
            process gets to objective evidence that an iteration worked</mark>.
          </p>
          <p>
            <strong>The &ldquo;Maybe-as-polite-no&rdquo; question got a structural answer.</strong> Round 1 had
            flagged &ldquo;Maybe&rdquo; as semantically reading as polite-no across testers. Round 2 testers
            converged on the actual fix — not removing &ldquo;Maybe,&rdquo; but placing it only where it
            belongs. <mark className="hl">Initial-interest RSVPs should be binary Yes/No</mark> (a low-stakes
            signal of whether someone wants to be in the coordination loop at all);{" "}
            <mark className="hl">finalized-event RSVPs should keep the Yes/Maybe/No three-state pattern</mark>{" "}
            (where the real-world tradeoffs that produce &ldquo;Maybe&rdquo; actually exist). Initial-interest
            copy was reworded from raw &ldquo;Yes/No&rdquo; to{" "}
            <strong>&ldquo;Interested in Coordinating / Not Interested,&rdquo;</strong> addressing the semantic
            ambiguity that produced the polite-no read.
          </p>

          <h3>Rounds 3 &amp; 4 — Zero Reds, Mostly Blues</h3>
          <p>
            Rounds 3 and 4 ran across two sessions and produced the cleanest priority distribution of any round:{" "}
            <mark className="hl">zero red-priority findings, mostly blue &ldquo;additional feature idea&rdquo;
            rows, and multiple explicit validation callouts</mark> confirming that the Rounds 1 and 2 shipped
            iterations landed as intended.
          </p>
          <p>
            Direct validations from testers included:{" "}
            <em>&ldquo;The change of initial interest RSVP from Yes/Maybe/No to Interested/Not Interested was
            received positively&rdquo;</em> (validating the Round 1→2 RSVP semantic refactor);{" "}
            <em>&ldquo;Discovery of the invite link was made materially faster compared to Round 1 and Round 2,
            most likely due to its placement in the header&rdquo;</em> (validating the Round 2 Event Setup IA
            fix); and <em>&ldquo;Prototype was overall deemed appropriate for an informal large-scale (10+
            person) gathering where standard coordination over social media would be tedious&rdquo;</em>{" "}
            (validating the core design bet the entire project rests on).
          </p>
          <p>
            A Round 4 tester also <mark className="hl">independently rediscovered a Round 1 finding</mark> —
            observing that location as a sorting factor in the questionnaire was inconsistently effective, a
            callback to Round 1&rsquo;s finding that raw distance was the wrong frame for the launch market.
            Two testers, three rounds apart, arriving at compatible conclusions through different tasks is the
            kind of convergence that separates coincidental preference from real design signal.
          </p>
          <figure>
            <div className="image-slot">insights document · four-round priority-distribution comparison</div>
            <figcaption>
              The Insight → Reasoning → Proposed Iteration → Implementation table across all four rounds,
              showing the priority distribution shift from red-heavy to mostly-blue.
            </figcaption>
          </figure>
        </section>

        {/* ───── Iterating ───── */}
        <section id="iterating" className="case-section">
          <h2>Iterating</h2>
          <p>
            Within days of Round 1 synthesis, built a new prototype iteration that closed the most-leveraged
            findings.
          </p>

          <h3>Round 1 → Iteration</h3>
          <p>
            <strong>A new transit-aware venue display component.</strong> Three testers had independently
            surfaced that the venue preference model&rsquo;s distance-from-user framing was wrong for the launch
            market — what mattered was <mark className="hl">transit-station and area access</mark>. Built a new
            component that maps each venue to <strong>specific MRT stations with line and exit information,
            walking times in minutes, bus routes by line number, and walking-route context</strong>. Not generic
            &ldquo;near transit&rdquo; labeling — substantive market-specific localization data baked into the
            venue display.{" "}
            <mark className="hl">The Round 1 insight became a shipped design change, not a backlog item</mark>.
          </p>
          <p>
            <strong>The most-missed CTA moved to a findable position.</strong> The single most-reproduced
            usability failure from Round 1 was that multiple testers couldn&rsquo;t find the Cast Vote button.
            Now a prominent footer action alongside Add Suggestion, with equal visual weight. Affordance
            visibility over hidden polish.
          </p>
          <p>
            <strong>Event variables now lock individually.</strong> Hosts can confirm/lock specific event
            variables individually rather than as a single committed bundle. An event can exist with one factor
            decided and others TBD, routing cleanly through the collaborative flow.
          </p>

          <h3>Round 2 → Iteration + Two-Artifact Split</h3>
          <p>
            Every Round 2 finding was implemented in the AI Studio prototype as a shipped design change: Event
            Setup rewording and dropdown conversion (closing the round&rsquo;s only red), the binary
            &ldquo;Interested in Coordinating / Not Interested&rdquo; initial-interest RSVP refactor with
            three-state Maybe preserved on finalized RSVPs, questionnaire content gated on locked/unlocked event
            factors, host-only gating of detailed vote statistics on the confirmation page, and leaderboard
            redeployment as a sorting option in the venue questionnaire.
          </p>
          <p>
            The prototype was then <mark className="hl">ported to Figma Make through a deliberate guardrails
            contract</mark> — every screen, interactive element, label, state transition, and the multi-state
            RSVP / lock-individually / anonymity semantics preserved exactly; only the visual treatment
            redesigned.
          </p>
          <p>
            The two artifacts now serve two distinct conversations: <strong>Figma Make</strong> carries the
            polished UI for design review and the July 16 final-review stakeholders; the{" "}
            <strong>AI Studio prototype</strong> keeps the live testing panel and remains the active
            usability-research artifact. Most intern projects end with one messy file doing too many jobs; this
            one ends with <mark className="hl">two coherent artifacts of the same prototype state, each
            optimized for the conversation it serves</mark>.
          </p>

          <h3>What the Full Arc Demonstrates</h3>
          <p>
            This is the first project completing <mark className="hl">two full research-iteration loops with
            evidence on both sides of each</mark>: findings identified → prioritized → implemented → re-tested →
            new findings identified → shipped again → re-tested. Most academic projects show a single
            research-design-test cycle; this case study shows two closed feedback loops in sequence, with
            closing evidence on each side.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            The biggest analytical lesson was <mark className="hl">synthesis over listing</mark> — collecting
            observations is the input; the value comes from comparing across them and committing to a
            recommendation. The biggest personal lesson was about iteration habits: I noticed I tended to{" "}
            <mark className="hl">polish the parts I was confident about and avoid the harder parts</mark> — yet
            the harder parts (the interest-gauging affordance, the guest&rsquo;s mid-flow live state) were
            exactly what the brief hinged on. Designing the crux first, polish second, is the discipline
            I&rsquo;m carrying forward.
          </p>
          <p>
            Round 1 of testing added a third:{" "}
            <mark className="hl">research output has a quality ceiling set by energy, not skill</mark>. When
            fresh, &ldquo;one more polish pass&rdquo; usually improves the work; when tired after running
            sessions, the same instinct produces marginal returns at high cognitive cost. Knowing when to stop
            is itself a research discipline — and one that protects the quality of the <em>next</em> round.
          </p>
          <p>
            Round 2 taught that the <mark className="hl">priority distribution of a usability synthesis is
            itself a diagnostic</mark> about whether the previous iteration landed. Before reading individual
            findings, a maturing prototype shows up as a shift in the document&rsquo;s color distribution.
            Future synthesis reviews start with the shape and then read the content.
          </p>
          <p>
            Rounds 3 &amp; 4 taught that <mark className="hl">blue findings are the reward of shipping
            successful red and yellow fixes</mark> — a tester&rsquo;s brain only reaches feature-idea territory
            once the underlying usability failures are out of the way. And the cohort-consolidation step taught
            that <mark className="hl">individual synthesis and cohort aggregation serve different jobs</mark>:
            the individual doc tells the closed-loop story; the by-feature aggregation across all testers drives
            structural decisions. Both formats are valid; neither replaces the other.
          </p>
        </section>
      </main>
    </div>
  );
}
