import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import UsabilityRound, { InsightCard } from "@/components/UsabilityRound";
import ResearchCarousel from "@/components/ResearchCarousel";

export const metadata = {
  title: "Kiosk Interface Design Guidelines — Kathleen Li",
};

/* Section order leads with Outcome (deliverables + impact) so recruiters
   see results first. Process sections (Researching → Ideating →
   Verifying) follow as the supporting story, and Takeaways closes
   with next steps, refinements, and what was learned. Section naming
   (Outcome/Takeaways) matches AI Journey Agent, ResearchHub, and inline. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "ideating", label: "Ideating" },
  { id: "verifying", label: "Verifying" },
  { id: "takeaways", label: "Takeaways" },
];

export default function FrogslayerCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Kiosk Interface Design Guidelines"
        meta="Fall 2025 · 16 weeks · 6-person team · UX Designer & Researcher, Point of Communication"
        subtitle="Adopted as Frogslayer's guideline reference + collaboration extended"
        imageLabel="Frogslayer kiosk · cover image"
      />

      <main id="main" className="case-body">
        {/* ───── Outcome ───── (deliverables + impact summary up front
              so a recruiter reads the outcome in the first viewport;
              naming matches the other three case studies) */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>

          {/* Outcome callout — mirrors the JT case study's elevated
              impact stat so the two case pages read as siblings. The
              killer fact is the continued sponsor collaboration AFTER
              the semester, which validates the guidelines held up
              beyond the deliverable window. */}
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Continued Collaboration Beyond Semester</strong> — Frogslayer continued
              partnering with the Purdue UXD Experience Studio to expand the guideline set past
              our initial handoff.
            </p>
            <p className="outcome-callout__meta">
              Fall 2025 · Purdue UXD Experience Studio · handoff → continued partnership
            </p>
          </aside>

          <p>
            From the project, we handed off a{" "}
            <mark className="hl">validated set of best-practice design guidelines for entertainment and hospitality kiosk interfaces</mark>
            {" "}alongside a journey map exemplifying the findings and recommended next steps for
            future sets of guidelines to Frogslayer.
          </p>
          <div className="case-image-row">
            <figure>
              <div className="image-slot">design guidelines deck</div>
              <figcaption>
                A set of design guidelines for hospitality and entertainment kiosks, formatted after NN/g&rsquo;s
                heuristics and verified across three rounds of testing.
              </figcaption>
            </figure>
            <figure>
              <div className="image-slot">user journey map</div>
              <figcaption>
                A journey map of the project&rsquo;s final validated user flow, capturing emotion dips and reference
                insights for the guidelines.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ───── Overview ───── (Overview holds The Problem + My Role
              so it reads as scope + role — matches the subsection
              naming used in AI Journey Agent, ResearchHub, and inline.) */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>The Problem</h3>
          <p>
            Frogslayer is a custom software development firm that partners with food and entertainment brands to build guest-facing 
            digital products, including large-screen kiosks.
            <br></br><br></br>
            Interactive kiosks in public hospitality and entertainment venues consistently create <mark className="hl">user 
              frustration, anxiety, and privacy concerns</mark> — driven by confusing navigation, inefficient use of screen 
              real estate, and designs that ignore the public, high-traffic context they live in.
            <br></br><br></br>
            Kiosks are a billion-dollar industry, yet their design is fragmented and inconsistent: businesses keep repeating the 
            same usability mistakes because <mark className="hl">no evidence-based, standardized guidelines exist</mark> for designers 
            to build against. Frogslayer wanted a guideline set that could apply across future kiosk projects to resolve that gap.
          </p>
          <h3>My Role</h3>
          <p>
            During the project, I was the team&rsquo;s <mark className="hl">primary point of contact</mark> with
            Frogslayer&rsquo;s product team, maintaining both sides&rsquo; mutual understanding of the project&rsquo;s progression, 
            and co-led through internal planning and defining of specific actions for the project&rsquo;s success.
            <br></br>
            <br></br>
            Regarding design, I contributed through researching the current state of kiosk design, building the base low-fi user 
            flow, constructing the usability testing prototypes, and iterating on them to address user insights.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Aligning with the Sponsor</h3>
          <p>
            The problem scope initially arrived vague — &ldquo;design kiosk interface guidelines verified through research&rdquo; 
            — so we understood the need to <mark className="hl">immediately narrow down the broad scope for tangible results.</mark>
            <br></br><br></br>
            We began with a content audit of Frogslayer&rsquo;s prior internal research, including an existing Figma prototype. 
            This revealed the sponsor&rsquo;s previous focus on interface ergonomics — and clarified that they wanted us to research 
            <mark className="hl">in the opposite, externally oriented direction</mark>: how a consumer&rsquo;s environment affects 
            kiosk use. It also confirmed loyalty programs as a secondary focus of the deliverable.
          </p>
          <p>The audit ultimately pointed us toward the following focuses:</p>
          {/* Focus list — pulled OUT of the <p> above; nesting <ul> inside
              <p> is invalid HTML and was triggering a Next.js hydration
              error (browsers auto-close <p> when they encounter <ul>). */}
          <ul className="focus-list">
            <li><strong>Hospitality &amp; entertainment industry</strong></li>
            <li><strong>Loyalty programs</strong></li>
            <li><strong>External environment (not internal ergonomics)</strong></li>
          </ul>
          <h3>Understanding the Current State Internally and Externally</h3>
          <p>
            After determining our focuses, we built our foundation through <mark className="hl">four
            guiding questions</mark> — the first three grounded in secondary research on the kiosk
            industry (folded into the first carousel below), and the fourth grounded in firsthand
            user interviews and field observations, which we ran as two separate activities with
            different participants (second carousel).
          </p>

          {/* Three secondary-research activities folded into a carousel so
              recruiter reads "3 activities" as one unit instead of scrolling
              past 3 stacked rq-blocks. Field Observations + User Interviews
              live in a SECOND carousel below (they were run as two separate
              activities with different participants — observations watched
              behavior, interviews asked questions). */}
          <ResearchCarousel
            title="Secondary Research"
            slides={[
              {
                key: "gaps",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Secondary Research</span>
                      <h4 className="rq-heading">&ldquo;What are the gaps of kiosks?&rdquo;</h4>
                      <p className="rq-lead">
                        A survey of kiosk-industry literature and design critiques revealed a{" "}
                        <mark className="hl">fragmented, inconsistent design landscape</mark> —
                        businesses repeating the same usability mistakes because no evidence-based
                        standards exist for the category.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li>External environmental factors (light, noise, crowds) act as compounding stresses</li>
                        <li>Inconsistent user expectations across venues and kiosk types</li>
                        <li>Focus on general functionality without discoverability of specific features</li>
                        <li>Need to reduce cognitive load — especially at moments of decision-making</li>
                        <li>Loyalty programs consistently under-integrated with the core flow</li>
                      </ul>
                    </div>
                    <figure className="rq-block__visual">
                      <div className="image-slot">visual placeholder · research artifact</div>
                    </figure>
                  </div>
                ),
              },
              {
                key: "preferable",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Secondary Research</span>
                      <h4 className="rq-heading">&ldquo;Why is a kiosk preferable to alternatives?&rdquo;</h4>
                      <p className="rq-lead">
                        Understanding why businesses and users choose kiosks over staffed counters
                        helped us identify the <mark className="hl">value users implicitly expect</mark>
                        {" "}to retain — and what our design couldn&rsquo;t break without breaking
                        the appeal.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li>User independence without needing human assistance</li>
                        <li>Applicability across indoor and outdoor environments</li>
                        <li>Operational cost savings + financial upside for businesses</li>
                      </ul>
                    </div>
                    <figure className="rq-block__visual">
                      <div className="image-slot">visual placeholder · research artifact</div>
                    </figure>
                  </div>
                ),
              },
              {
                key: "conventions",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Secondary Research</span>
                      <h4 className="rq-heading">&ldquo;How are companies designing kiosk interfaces today?&rdquo;</h4>
                      <p className="rq-lead">
                        A competitive analysis of kiosk-industry companies mapped{" "}
                        <mark className="hl">current design conventions</mark> — the patterns
                        established by incumbents that our guidelines would need to either build on or
                        deliberately contradict.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Consistent labeling of interface purpose (menu, payment, help) at the screen level</li>
                        <li>Centered placement of interactable elements</li>
                        <li>Element naming trends toward 1&ndash;2 words</li>
                        <li>Lack of elements outside the screen&rsquo;s center — significant unused real estate</li>
                      </ul>
                    </div>
                    <figure className="rq-block__visual">
                      <div className="image-slot">visual placeholder · competitive analysis</div>
                    </figure>
                  </div>
                ),
              },
            ]}
          />

          {/* Interviews and Field Observations were run as two DIFFERENT
              activities with different participants — observations
              watched people complete real kiosk tasks in an entertainment
              center, interviews asked separate participants questions.
              Folded into a second carousel so each activity gets its own
              card instead of being conflated into one block. */}
          <ResearchCarousel
            title="User Interviews & Field Observations"
            slides={[
              {
                key: "observations",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Field Observations</span>
                      <h4 className="rq-heading">
                        &ldquo;How do users actually behave on kiosks in context?&rdquo;
                      </h4>
                      <p className="rq-lead">
                        We observed participants completing real tasks — purchasing and reloading
                        play cards — on kiosks at an indoor entertainment center, converting each
                        session into a journey map. Behavior in the actual environment surfaced
                        friction that self-report could never catch.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li><mark className="hl">Payment interactions were the biggest point of confusion</mark> — tap vs. swipe vs. 
                        insert, which reader to use</li>
                        <li>Screen real estate was poorly utilized — most content clustered mid-screen</li>
                        <li>Stressful auditory countdown cues damaged user confidence mid-task</li>
                        <li>External environmental factors (noise, crowd pressure, glare) affected users unevenly</li>
                      </ul>
                    </div>
                    <figure className="rq-block__visual">
                      <div className="image-slot">visual placeholder · field-observation journey map</div>
                    </figure>
                  </div>
                ),
              },
              {
                key: "interviews",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">User Interviews</span>
                      <h4 className="rq-heading">
                        &ldquo;How do users feel about using kiosks?&rdquo;
                      </h4>
                      <p className="rq-lead">
                        A separate cohort of participants was interviewed (with a companion survey)
                        for the firsthand perception context observations couldn&rsquo;t reach:{" "}
                        <mark className="hl">users are confident with kiosks until options become
                        overwhelming or poorly labeled</mark>, and loyalty programs are rarely used
                        because sign-up feels annoying or effortful.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Confidence stems from familiarity with touch-screen technology</li>
                        <li>Confusion arises from poorly labeled or over-abundant options at decision points</li>
                        <li>Hesitance around loyalty programs that require effort or perceived commitment</li>
                        <li>Users skim before reading — assumptions form before instructions register</li>
                      </ul>
                    </div>
                    <figure className="rq-block__visual">
                      <div className="image-slot">visual placeholder · interview insights board</div>
                    </figure>
                  </div>
                ),
              },
            ]}
          />

          <p>
            After successfully building this knowledge foundation, we were ready to ideate the user
            flow.
          </p>
        </section>

        {/* ───── Ideating ───── */}
        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <h3>Ideating User Flow to Verify</h3>
          <p>
            To ideate in extensive detail, we first <mark className="hl">individually brainstormed
            through quick sketching arcade kiosk user flows before reconvening.</mark>
          </p>
          <p>
            After discussing and assessing each other&rsquo;s individual feature ideas, we
            ultimately decided to include the following features into the usability test flow for
            testing:
          </p>
          <figure>
            <div className="image-slot">ideated arcade kiosk flow</div>
            <figcaption>My ideated arcade kiosk user flow</figcaption>
          </figure>
          <p>
            To focus more on the features&rsquo; implementation, we imported a base kiosk arcade
            user flow copied from user observations to{" "}
            <mark className="hl">quickly finish designing the wireframes</mark> into an interactive
            prototype.
          </p>
          <div className="case-image-row with-arrow">
            <figure>
              <div className="image-slot">initial flow</div>
              <figcaption>Initial user flow based on field-observation flow</figcaption>
            </figure>
            <span className="arrow-sep">→</span>
            <figure>
              <div className="image-slot">iterated flow</div>
              <figcaption>Iterated user flow consisting of ideated features</figcaption>
            </figure>
          </div>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Validating and Retesting with User Insights</h3>
          <p>
            We ran <mark className="hl">three rounds of moderated usability testing</mark> at the
            Purdue Memorial Union (PMU), chosen to simulate the busy, distracting atmosphere of a
            real arcade. The prototype was used as a research instrument, not a shippable product —
            between rounds it was iterated against the recorded friction points, not our own
            opinions, so every change was small, defensible, and directly traceable to a user
            behavior.
            <br></br><br></br>
            Field observations before testing had already surfaced the highest-friction moments:{" "}
            <mark className="hl">payment interactions were the biggest point of confusion</mark>{" "}
            (tap vs. swipe vs. insert), and stressful auditory countdown cues damaged user
            confidence.
          </p>

          {/* User flow anchor — the FIRST version, as it existed before
              any of the three testing rounds. Recruiter sees the
              starting-state artifact at a glance; the three round
              blocks below describe what changed and why; the final
              flow at the bottom shows the shipped result. */}
          <figure className="usability-flow-anchor">
            <div className="image-slot">initial user flow · pre-testing</div>
            <figcaption>
              The initial user flow taken into Round 1 — built from field observations of real kiosk
              use, before any iteration.
            </figcaption>
          </figure>

          {/* Each round is its own block with a header naming the round
              and a stack of insight cards beneath. Each card pairs one
              user insight with the change it produced, alongside small
              before/after thumbnails. Replaces the previous wide
              equation row layout that didn't scale to 11 insights. */}
          <div className="usability-rounds">
            <UsabilityRound
              title="Round 1"
              meta="7 users · PMU"
              focus={
                <>
                  <strong>Round 1 focus:</strong> validating the{" "}
                  <mark className="hl">general UI of the flow</mark> — is the sequence intuitive at
                  first contact, and where does cognitive overload emerge?
                </>
              }
            >
              <InsightCard
                insight="“Cognitive overload from too many options at once”"
                change="Simplified card-loading page"
                originalLabel="card-loading · original"
                iteratedLabel="card-loading · simplified"
              />
              <InsightCard
                insight="“Resistance to signup and confusion with entry-fee loyalty”"
                change="Loyalty pop-up that introduces deals without overload"
                originalLabel="loyalty intro · original"
                iteratedLabel="loyalty pop-up · introduces deals"
              />
              <InsightCard
                insight="“End-page orientation broke layout consistency”"
                change="Flipped end page from vertical to horizontal"
                originalLabel="end page · vertical"
                iteratedLabel="end page · horizontal"
              />
              <InsightCard
                insight="“Button styles read as different elements across screens”"
                change="Unified button design across the flow"
                originalLabel="buttons · inconsistent"
                iteratedLabel="buttons · unified"
              />
            </UsabilityRound>

            <UsabilityRound
              title="Round 2"
              meta="7 users · PMU · A/B test"
              focus={
                <>
                  <strong>Round 2 focus:</strong> an{" "}
                  <mark className="hl">A/B test of the two candidate loyalty-program models</mark> —
                  tier-based (upgrade for perks) vs. upsell-based (spend $20, play with $25). Which
                  one actually gets hesitant users to consider joining?
                </>
              }
            >
              <InsightCard
                insight="“Upsells engaged hesitant users far more than tiers”"
                change="Selected upsells over tiers as the loyalty model"
                originalLabel="loyalty A/B · tiers vs upsells"
                iteratedLabel="loyalty · upsells only"
              />
              <InsightCard
                insight="“There might be a catch”"
                change="Deals and prices clarified to build trust"
                originalLabel="deals UI · unclear pricing"
                iteratedLabel="deals UI · clarified prices"
              />
              <InsightCard
                insight="“Cash payment needed clearer step-by-step guidance”"
                change="Added a dedicated cash payment screen"
                originalLabel="cash payment · no dedicated flow"
                iteratedLabel="cash payment · dedicated screen"
              />
              <InsightCard
                insight="“Reset button untouched in every observed session”"
                change="Replaced the unused reset with sign-in"
                originalLabel="interface · reset button"
                iteratedLabel="interface · sign-in button"
              />
            </UsabilityRound>

            <UsabilityRound
              title="Round 3"
              meta="5 users · PMU · final prototype"
              focus={
                <>
                  <strong>Round 3 focus:</strong> refining the{" "}
                  <mark className="hl">user&rsquo;s introduction to the membership</mark> —
                  surfacing &ldquo;Join for Free&rdquo; prominently and making cost transparency
                  impossible to miss, because skimming users habitually assume membership costs
                  money.
                </>
              }
            >
              <InsightCard
                insight="“Skimming users miss ‘Join for Free’ entirely”"
                change="Surfaced “Join for Free” at the top of the pop-up"
                originalLabel="loyalty pop-up · “Free” mid-screen"
                iteratedLabel="loyalty pop-up · “Free” at top"
                iteratedCaption="Finalized"
              />
              <InsightCard
                insight="“Habitual rejection — users assume cost or commitment”"
                change="Made cost transparency more prominent"
                originalLabel="membership prompt · cost ambiguous"
                iteratedLabel="membership prompt · cost transparency"
                iteratedCaption="Finalized"
              />
              <InsightCard
                insight="“Colors liked but could be more dynamic”"
                change="Color-dynamism flagged for the guideline"
                originalLabel="color palette · static"
                iteratedLabel="color palette · note for guideline"
                iteratedCaption="Finalized"
              />
            </UsabilityRound>
          </div>

          {/* Final flow anchor — the shipped-to-Frogslayer version
              after all three rounds. Pairs with the initial-flow anchor
              above so recruiters get a clean before/after read without
              having to reconstruct the delta from intermediate images. */}
          <figure className="usability-flow-anchor">
            <div className="image-slot">final user flow · after Round 3</div>
            <figcaption>
              The final user flow after three rounds of testing — upsell-based loyalty prominent,
              &ldquo;Join for Free&rdquo; surfaced at the top of the pop-up, cash-payment flow
              dedicated, buttons unified.
            </figcaption>
          </figure>

          <p>
            By round 3 the loyalty program — initially the biggest source of friction — had been
            reshaped into a{" "}
            <mark className="hl">&ldquo;Join for Free&rdquo; upsell with clear pricing</mark>, and
            the interface itself was validated as intuitive at first contact. With both confirmed,
            the team moved into guideline synthesis.
          </p>
          <p>
            We compiled findings into a final journey map demonstrating the validated flow, then
            ran a guideline workshop with our project owner to categorize insights into{" "}
            <mark className="hl">Marketing/Loyalty Programs, UX/UI, and Social Implications/Physical Placement</mark>{" "}
            — formatted after NN/g&rsquo;s design heuristics as the most comprehensive yet minimal
            model. Handoff included honest limitations and next steps: testing loyalty models
            beyond tiers/upsells, diversifying venues beyond arcades, widening the tester
            demographic beyond college students, and validating with real purchase stakes.
          </p>
        </section>

        {/* ───── Takeaways ───── (closes the case study with what was
              learned from the project. Renamed from "Reflections" to
              match the takeaway naming used in AI Journey Agent and
              ResearchHub. Single paragraph, no h3 — matches the
              one-paragraph takeaways pattern in the other two cases. */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          {/* Editorial pull-quote — Klee One (Japandi editorial voice)
              with an ochre left rule. Used sparingly, one per case
              study, to anchor a defining line. */}
          <blockquote className="case-pullquote">
            &ldquo;Is it pretty?&rdquo; mattered less than &ldquo;what will this teach us?&rdquo;
            <cite>Frogslayer · design guideline project</cite>
          </blockquote>
          <p>
            Designing a prototype <mark className="hl">as a tool for generating evidence, not as a product</mark>, changed how I 
            evaluated every screen — each element existed to test a hypothesis, and the pull-quote above became the working rule for every review.
            <br></br><br></br>
            The project also showed me how much <mark className="hl">environment is a design material</mark>: testing in a deliberately 
            busy student union surfaced behaviors — skimming, rushing, tunnel vision on the screen — that a quiet lab never would have. 
            User actions are shaped as much by habits and prior experiences with similar stimuli (phones, ads, familiar interfaces) as 
            by the interface itself, so designing against those mental models is a losing battle; the guidelines work by leaning on them.
          </p>
        </section>
      </main>
    </div>
  );
}
