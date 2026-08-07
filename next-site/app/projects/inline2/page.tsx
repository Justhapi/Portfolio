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
        subtitle="A lightweight consumer tool for planning everyday gatherings, marking inline's step from B2B into B2B2C"
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

          {/* Outcome callout — mirrors JT/Frogslayer/ResearchHub. The
              strongest measurable outcome is the closed loop: all 7
              interim-review feedback items shipped before final review,
              AND the 4-round test-priority arc went from red-heavy to
              zero reds. Two independent evidence chains of the work
              landing. */}
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>All 7 interim-review feedback items shipped</strong> as prototype changes
              before the CEO-attended final review, and the 4-round test-priority arc shifted from
              red-heavy to mostly-blue with zero reds by the end.
            </p>
            <p className="outcome-callout__meta">
              Summer 2026 · Pop by inline · 3-month remote internship · 4 test rounds
            </p>
          </aside>

          <p>
            Delivered a{" "}
            <mark className="hl">comparable competitive audit across six event-coordination products</mark>,
            a gap analysis that surfaced two genuine category-independent strategic gaps, and an
            end-to-end interactive prototype of the product&rsquo;s first scenario covering both
            host and guest flows, which was accepted by my manager with no critical pushback. I
            then ran four rounds of usability testing as lead facilitator, closing each
            round&rsquo;s findings as shipped iterations before the following round began.
          </p>
          <p>
            Following the interim stakeholder presentation on July 2, I also contributed to a{" "}
            <mark className="hl">cohort-wide consolidation step</mark> that aggregated findings
            across all interns&rsquo; testers, allowing us to drive threshold-based structural
            decisions ahead of the July 16 CEO-attended final review. Four candidate features were
            ultimately solidified for the July 16 review and the written July 23 Product Direction
            Summary: <mark className="hl">Questionnaire, Interest + Finalized RSVP, Notifications, and Archive</mark>,
            each grounded in a distinct evidence chain spanning multiple rounds.
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
            based in Taiwan. The role was explicitly framed around clarity of thinking over
            production output, focusing on bringing an outside-in perspective through competitive
            research, gap analysis, concept design, and usability testing.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>

          <h3>Mapping Competitive Landscape &amp; Locating Gaps</h3>
          <p>
            Researching ran through two passes:{" "}
            <mark className="hl">one reusable competitive-audit framework applied across six products</mark>,
            then a gap analysis that cross-referenced their weaknesses against the team&rsquo;s
            proposed feature set with category discipline.
          </p>

          <h3>Competitive Audits with One Reusable Framework</h3>
          <p>
            I built a single competitive-analysis framework covering positioning, key features,
            strengths and weaknesses, business model, and{" "}
            <mark className="hl">end-to-end host and guest walkthroughs</mark>. This framework
            was then applied consistently across Partiful, Meetup, Luma, Apple Invites, Paperless
            Post, and a Taiwan-based competitor. The audits themselves were hands-on, since I
            tested edge cases directly (such as reminder customization and paywall behavior)
            rather than simply skimming feature lists.
          </p>
          <p>
            A significant realization from this pass was that{" "}
            <mark className="hl">competitors are not all the same kind of product</mark>. Partiful
            shares Pop&rsquo;s category while Meetup does not, and that distinction consequently
            became the backbone of the following gap analysis.
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
            Cross-referencing each competitor&rsquo;s weaknesses against the team&rsquo;s proposed
            feature set required{" "}
            <mark className="hl">judgment rather than a mechanical table</mark>, since a weakness
            in a different product category is not automatically a gap for Pop. After filtering
            for that distinction, two genuine, category-independent gaps remained. One of those
            gaps was that no proposed feature clearly owned low-friction event creation, despite
            the team itself having identified &ldquo;the high psychological cost of starting&rdquo;
            as a core host pain point.
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

          <h3>From Brief Questions to Prototyped Answers</h3>
          <p>
            The design pass ran through two moves:{" "}
            <mark className="hl">designing the first-scenario flow from FigJam through interactive prototype</mark>,
            then developing a working approach for AI-assisted prototyping as a repeatable
            practice.
          </p>

          <h3>Scenario 1: An Evolving Event</h3>
          <p>
            The design brief posed two questions: <em>how does the flow handle TBD time and
            venue?</em> and <em>how does the guest experience an evolving event?</em> I worked
            through three artifact layers to answer them, starting with a{" "}
            <mark className="hl">FigJam user flow with phase swimlanes</mark>, then moving to
            AI-assisted wireframes, and finally to an interactive single-phone prototype with
            simulated push notifications that conveyed the event&rsquo;s evolving state over
            time.
          </p>
          <p>
            Every major design move traced explicitly back to a competitor observation. An{" "}
            <mark className="hl">interest-gauging mechanism</mark> routes undefined time and
            venue variables into a collaborative poll instead of treating the creation form as
            incomplete, which structurally counters a competitor&rsquo;s
            &ldquo;punishment-on-vagueness&rdquo; pattern. A two-step RSVP architecture (a soft
            &ldquo;I&rsquo;m interested!&rdquo; followed by a final RSVP after the host
            finalizes) counters the binary RSVP pattern that leaves &ldquo;maybe&rdquo;
            responders unsupported. Progressive-disclosure preference inputs feed venue
            suggestions without inheriting the questionnaire-overload common to onboarding, and
            a designed reveal moment turns venue finalization into an intentional beat rather
            than a silent state change.
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
            This project marked the first heavy use of AI-assisted prototyping in my workflow,
            and it consequently taught me that{" "}
            <mark className="hl">AI tools generate polish but do not preserve design intent without explicit guardrails</mark>.
            Early iterations flattened product-specific mechanics into generic event-app shapes
            until prompted with explicit &ldquo;what to leave alone&rdquo; constraints. I also
            actively caught and removed AI-fabricated framing before sharing deliverables, since
            content I did not author should not appear in work attributed to me.
          </p>
          <p>
            AI prototyping handled the heavy lifting throughout the project, generating dozens of
            screens, full components, and plausible interactions. Manual refinement, however,
            handled the precision work that made the interface actually consistent, which
            included making host and guest calendars interact identically, sizing modals to hug
            their content, removing redundant calendar pickers, fixing useEffect hooks that were
            snapping state back to a default day, and polishing dot indicators that doubled up on
            the selected state. As a result, I find that{" "}
            <mark className="hl">using AI and manual refinement together, in the right order and with the right ratio for the moment, is the actual skill</mark>.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Four Rounds of Usability Testing</h3>
          <p>
            I served as{" "}
            <mark className="hl">lead facilitator across three back-to-back usability sessions in a two-hour window</mark>,
            which was my first time proctoring after months of preparing as a researcher. Same-day,
            I synthesized the findings into a structured insights document organized as Insight →
            Reasoning → Proposed Iteration, with priority color-coding applied throughout.
          </p>
          <p>
            To prepare for the sessions, I built a{" "}
            <mark className="hl">bilingual participant guide</mark> that placed one task per page
            so participants always knew what came next, along with an interview plan that paired
            warm-up and post-task debrief probes anchored on the brief&rsquo;s two original
            design questions. The interview plan itself went through five focused iterations in a
            single working session, which included sharpening the line between behavioral
            observation and emotional response, balancing the host and guest probe count, and
            pruning leading language. As a result, I find that a testing protocol benefits from
            the same iterative rigor as the designs it evaluates.
          </p>

          <h3>Round 1 — Validating the Core Design Bet</h3>
          <p>
            The core design bet was validated. All three testers independently confirmed that the
            app&rsquo;s value lives specifically in the <em>uncertain-coordination phase</em>,
            meaning when a factor such as headcount, time, or venue is still being decided. One
            tester said directly, <em>&ldquo;Don&rsquo;t see the point of using the app if all
            the details are confirmed.&rdquo;</em> That signal consequently pointed toward an
            enhancement of{" "}
            <mark className="hl">letting hosts lock variables individually</mark>, so that an
            event with one decided factor and two TBD would still route cleanly into the
            collaborative flow.
          </p>
          <p>
            A market-specific localization insight also reframed a whole feature. Three testers
            converged that{" "}
            <mark className="hl">distance from the user&rsquo;s location is the wrong frame</mark>{" "}
            for venue preferences in the product&rsquo;s launch market. What matters for the
            launch market is proximity to mass-transit and area access, not raw kilometers from
            home. This is the kind of finding that would never surface from US-based testing,
            which consequently justified the entire round on its own.
          </p>
          <p>
            Discoverability was also identified as the dominant usability failure mode. Multiple
            existing features such as voting, suggesting times, suggesting venues, and modifying
            deadlines were not findable to testers despite being functionally present. As a
            result, I find that{" "}
            <mark className="hl">features that cannot be found by users are functionally absent</mark>,
            which led the next prototype iteration to prioritize affordance visibility over
            net-new features.
          </p>

          <h3>Round 2 — Priority Distribution Shifts</h3>
          <p>
            Round 2 ran with two new testers and validated that the Round 1 iterations had
            landed. The clearest signal was the{" "}
            <mark className="hl">priority distribution itself</mark>: Round 1 produced multiple
            red-priority findings, while Round 2 produced only one, with the remaining rows
            landing as yellow refinements and a blue feature idea. From this shift, I find that
            a round whose synthesis moves from reds to yellows is the closest a usability process
            gets to objective evidence that an iteration worked.
          </p>
          <p>
            The &ldquo;Maybe-as-polite-no&rdquo; question also received a structural answer.
            Round 1 had flagged &ldquo;Maybe&rdquo; as semantically reading as polite-no across
            testers. Round 2 testers then converged on the actual fix, which was not removing
            &ldquo;Maybe&rdquo; entirely but rather placing it only where it belongs.{" "}
            <mark className="hl">Initial-interest RSVPs should be binary Yes/No</mark> as a
            low-stakes signal of whether someone wants to be in the coordination loop at all,
            while finalized-event RSVPs should keep the Yes/Maybe/No three-state pattern where
            the real-world tradeoffs that produce &ldquo;Maybe&rdquo; actually exist. As a
            result, initial-interest copy was reworded from raw &ldquo;Yes/No&rdquo; to{" "}
            <strong>&ldquo;Interested in Coordinating / Not Interested,&rdquo;</strong>
            addressing the semantic ambiguity that had produced the polite-no read.
          </p>

          <h3>Rounds 3 &amp; 4 — Zero Reds, Mostly Blues</h3>
          <p>
            Rounds 3 and 4 ran across two sessions and produced the cleanest priority distribution
            of any round:{" "}
            <mark className="hl">zero red-priority findings, mostly blue &ldquo;additional feature idea&rdquo; rows, and multiple explicit validation callouts</mark>{" "}
            confirming that the Rounds 1 and 2 shipped iterations had landed as intended.
          </p>
          <p>
            Direct validations from testers included:{" "}
            <em>&ldquo;The change of initial interest RSVP from Yes/Maybe/No to Interested/Not
            Interested was received positively,&rdquo;</em> which validated the Round 1→2 RSVP
            semantic refactor;{" "}
            <em>&ldquo;Discovery of the invite link was made materially faster compared to Round
            1 and Round 2, most likely due to its placement in the header,&rdquo;</em> which
            validated the Round 2 Event Setup IA fix; and{" "}
            <em>&ldquo;Prototype was overall deemed appropriate for an informal large-scale (10+
            person) gathering where standard coordination over social media would be
            tedious,&rdquo;</em> which validated the core design bet the entire project rests on.
          </p>
          <p>
            A Round 4 tester also{" "}
            <mark className="hl">independently rediscovered a Round 1 finding</mark>, observing
            that location as a sorting factor in the questionnaire was inconsistently effective.
            This was a callback to Round 1&rsquo;s finding that raw distance was the wrong frame
            for the launch market. From this, I find that two testers arriving at compatible
            conclusions through different tasks, three rounds apart, is the kind of convergence
            that separates coincidental preference from real design signal.
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
          <h3>Closing Loops on Every Round&rsquo;s Findings</h3>
          <p>
            Within days of Round 1 synthesis, I built a new prototype iteration that closed the
            most-leveraged findings from the round.
          </p>

          <h3>Round 1 → Iteration</h3>
          <p>
            A new transit-aware venue display component was added. Three testers had
            independently surfaced that the venue preference model&rsquo;s distance-from-user
            framing was wrong for the launch market, since what actually mattered was{" "}
            <mark className="hl">transit-station and area access</mark>. As a result, I built a
            new component that maps each venue to specific MRT stations with line and exit
            information, walking times in minutes, bus routes by line number, and walking-route
            context. This is not generic &ldquo;near transit&rdquo; labeling but substantive
            market-specific localization data baked into the venue display, so that the Round 1
            insight became a shipped design change rather than a backlog item.
          </p>
          <p>
            The most-missed CTA was also moved to a findable position. The single most-reproduced
            usability failure from Round 1 was that multiple testers could not find the Cast Vote
            button. It is now a prominent footer action alongside Add Suggestion, with equal
            visual weight, prioritizing affordance visibility over hidden polish.
          </p>
          <p>
            Event variables now lock individually as well. Hosts can confirm or lock specific
            event variables individually, rather than as a single committed bundle. As a result,
            an event can exist with one factor decided and others still TBD, routing cleanly
            through the collaborative flow.
          </p>

          <h3>Round 2 → Iteration + Two-Artifact Split</h3>
          <p>
            Every Round 2 finding was implemented in the AI Studio prototype as a shipped design
            change, including Event Setup rewording and dropdown conversion (which closed the
            round&rsquo;s only red), the binary &ldquo;Interested in Coordinating / Not
            Interested&rdquo; initial-interest RSVP refactor with three-state Maybe preserved on
            finalized RSVPs, questionnaire content gated on locked or unlocked event factors,
            host-only gating of detailed vote statistics on the confirmation page, and leaderboard
            redeployment as a sorting option in the venue questionnaire.
          </p>
          <p>
            The prototype was then{" "}
            <mark className="hl">ported to Figma Make through a deliberate guardrails contract</mark>,
            where every screen, interactive element, label, state transition, and the multi-state
            RSVP / lock-individually / anonymity semantics were preserved exactly. Only the
            visual treatment was redesigned during the port.
          </p>
          <p>
            The two artifacts now serve two distinct conversations. The Figma Make version
            carries the polished UI for design review and the July 16 final-review stakeholders,
            while the AI Studio prototype keeps the live testing panel and consequently remains
            the active usability-research artifact. Most intern projects end with one messy file
            doing too many jobs, however this one ends with{" "}
            <mark className="hl">two coherent artifacts of the same prototype state, each optimized for the conversation it serves</mark>.
          </p>

          <h3>What the Full Arc Demonstrates</h3>
          <p>
            This is the first project of mine to complete{" "}
            <mark className="hl">two full research-iteration loops with evidence on both sides of each</mark>:
            findings identified, prioritized, implemented, re-tested, new findings identified,
            shipped again, and re-tested. Most academic projects show a single
            research-design-test cycle, however this case study demonstrates two closed feedback
            loops in sequence, with closing evidence on each side.
          </p>
        </section>

        {/* ───── Takeaways ───── (four h3s mirror the JT/Frogslayer
              takeaway pattern — each lesson gets its own heading so
              recruiters can skim the arc of what was learned. Each
              paragraph's content is unchanged; only the h3 skeleton is
              new.) */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Synthesis Over Listing, Crux First Over Polish First</h3>
          <p>
            The biggest analytical lesson from this project was{" "}
            <mark className="hl">synthesis over listing</mark>. Collecting observations is only
            the input; the actual value comes from comparing across them and committing to a
            recommendation. On a personal iteration-habits level, I also noticed that I tended
            to polish the parts I was already confident about while avoiding the harder parts,
            yet the harder parts (such as the interest-gauging affordance and the guest&rsquo;s
            mid-flow live state) were exactly what the brief hinged on. As a result, I find that
            designing the crux first and polishing second is the discipline I am carrying
            forward.
          </p>

          <h3>Research Quality Has an Energy Ceiling</h3>
          <p>
            Round 1 of testing added an additional lesson, which was that{" "}
            <mark className="hl">research output has a quality ceiling set by energy, not skill</mark>.
            When fresh, &ldquo;one more polish pass&rdquo; usually improves the work; when tired
            after running sessions, the same instinct produces marginal returns at high cognitive
            cost. As a result, I find that knowing when to stop is itself a research discipline,
            and one that consequently protects the quality of the <em>next</em> round.
          </p>

          <h3>Priority Distribution as Diagnostic</h3>
          <p>
            Round 2 taught me that the{" "}
            <mark className="hl">priority distribution of a usability synthesis is itself a diagnostic</mark>{" "}
            of whether the previous iteration landed. Before reading individual findings, a
            maturing prototype shows up as a shift in the document&rsquo;s color distribution.
            As a result, future synthesis reviews of mine start with the shape and then read the
            content.
          </p>

          <h3>Blues Are Earned; Individual and Cohort Docs Serve Different Jobs</h3>
          <p>
            Rounds 3 and 4 taught me that{" "}
            <mark className="hl">blue findings are the reward of shipping successful red and yellow fixes</mark>,
            since a tester&rsquo;s brain only reaches feature-idea territory once the underlying
            usability failures are out of the way. The cohort-consolidation step additionally
            taught me that individual synthesis and cohort aggregation serve different jobs: the
            individual document tells the closed-loop story of the specific project, while the
            by-feature aggregation across all testers drives structural decisions. Both formats
            are valid, and neither replaces the other.
          </p>
        </section>
      </main>
    </div>
  );
}
