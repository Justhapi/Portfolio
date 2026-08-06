import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import UsabilityRound, { InsightCard } from "@/components/UsabilityRound";
import ResearchCarousel from "@/components/ResearchCarousel";
import ZoomableImage from "@/components/ZoomableImage";

/* GitHub Pages serves under /Portfolio in production; empty in dev so
   images resolve from localhost. Same pattern as JT case study. */
const basePath =
  process.env.NODE_ENV === "production" ? "/Portfolio" : "";

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
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
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
            {" "}alongside a <mark className="hl">journey map exemplifying the findings</mark> and recommended next steps for
            continuation of the guidelines to Frogslayer.
          </p>
          <div className="case-image-row">
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Guidelines.Webp`}
              alt="Kiosk design guidelines deck — NN/g-style heuristics for hospitality and entertainment kiosks."
              aspectRatio={8820 / 4766}
              caption={
                <>
                  A set of design guidelines for hospitality and entertainment kiosks, formatted
                  after NN/g&rsquo;s heuristics and verified across three rounds of testing.
                </>
              }
            />
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Journey_Map.Webp.png`}
              alt="User journey map of the final validated kiosk flow with emotion dips flagged."
              aspectRatio={5024 / 2366}
              caption={
                <>
                  A journey map of the project&rsquo;s final validated user flow, capturing emotion
                  dips and reference insights for the guidelines.
                </>
              }
            />
          </div>
        </section>
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            The sponsor was Frogslayer, <mark className="hl">a custom software development firm who partners with food and
            entertainment brands to build guest-facing digital products.</mark> Our team was asked to explore and construct a{" "}
            <mark className="hl">standardized set of evidence-based design guidelines</mark> that would
            help assist in future kiosk-related projects by avoiding the industry&rsquo;s usability pitfalls.
          </p>

          <h3>The Problem</h3>
          <p>
            Kiosks are becoming increasingly common in various industries due to their convenience and cost-efficiency for businesses, however their design 
            continues to cause users to consistently experience moments of frustration. 
            <br></br><br></br>
            Unlike older and more common digital products such as mobile or web apps, kiosks lack a standard practice design framework, leading to 
            continuation of recurring usability pain points.

          </p>
          <h3>My Role</h3>
          <p>
            I worked as a UX Designer &amp; Researcher on this project, contributing through{" "}
            <mark className="hl">researching the current state of kiosk design, building the base low-fi user flow, constructing the usability testing prototypes,
            and iterating upon insights</mark> {" "} across three rounds of testing.
            <br></br><br></br>
            In addition to design work, I was the team&rsquo;s{" "}
            <mark className="hl">primary point of contact</mark> with Frogslayer&rsquo;s product
            team, maintaining both sides&rsquo; mutual understanding of the project&rsquo;s
            progression, and also <mark className="hl">co-led internal planning and defined specific actions </mark>for the
            project&rsquo;s progression to accomplishing the intended goal.
          </p>
        </section>
        <section id="researching" className="case-section">
          <h2>Researching</h2>

          <h3>Clarifying Scope with the Sponsor</h3>
          <p>
            Due to the <mark className="hl">requested problem goal initially arriving vague as "design kiosk interface guidelines"</mark>
            we recognized the need to{" "} <mark className="hl">immediately narrow down the broad scope for tangible results.</mark>
            <br></br><br></br>
            This understanding led us to <mark className="hl">approach Frogslayer's product team for contents of their prior internal research</mark> that led to the 
            project's inception, resulting in us receiving an existing Figma prototype. 
            <br></br><br></br>
            After auditing it, we discussed our thoughts with Frogslayer's product team and eventually determined the following scope focuses:
          </p>
          <ul className="focus-list">
            <li><strong>Internal ergonomics</strong></li>
            <li><strong>Hospitality &amp; entertainment industry</strong></li>
            <li><strong>Loyalty programs</strong></li>
            <li><strong>External environmental factors</strong></li>
          </ul>

          <h3>Establishing the Evidence Base</h3>
          <p>
            With scope locked, we built our foundation through five guiding questions — split
            across the two perspectives our guidelines needed to serve:{" "}
            <mark className="hl">the producer side (how businesses build kiosks) and the consumer side (how users experience them)</mark>.
            Starting with the producer side, two industry-literature-grounded questions:
          </p>
          <ul className="focus-list">
            <li><strong>Why is a kiosk preferable to alternatives?</strong></li>
            <li><strong>How are companies designing kiosk interfaces today?</strong></li>
          </ul>
          <ResearchCarousel
            slides={[
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
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={`${basePath}/img/frogslayer/Kiosk_Benefits.Webp`}
                        alt="Secondary-research synthesis on why businesses and users choose kiosks over staffed counters."
                        aspectRatio={13205 / 7607}
                        noDrag
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "conventions",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Competitive Analysis</span>
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
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={`${basePath}/img/frogslayer/Competitor_Analysis_Visual.Webp`}
                        alt="Competitive analysis of kiosk-industry companies — current design conventions and patterns."
                        aspectRatio={9126 / 4145}
                        noDrag
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          <h3>Gathering Firsthand User Insight</h3>
          <p>
            Then we shifted to the{" "}
            <mark className="hl">consumer side — how users actually experience kiosks</mark>. Three
            questions total: one framed by industry literature on kiosk-user gaps, and two
            grounded in firsthand user contact (field observations and interviews, run with
            separate participant cohorts).
          </p>
          <ResearchCarousel
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
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={`${basePath}/img/frogslayer/Components_Of_Kiosk_Interfaces_Visual.Webp`}
                        alt="Secondary-research synthesis of gaps in current kiosk-interface components across the industry."
                        aspectRatio={5239 / 3374}
                        noDrag
                      />
                    </div>
                  </div>
                ),
              },
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
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={`${basePath}/img/frogslayer/User_Observation_Visual.png`}
                        alt="Field observation journey map from participants completing real card-purchase/reload tasks at an entertainment center."
                        aspectRatio={9745 / 6599}
                        noDrag
                      />
                    </div>
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
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={`${basePath}/img/frogslayer/User_Interview_Visual.png`}
                        alt="User interview insights board — how users feel about using kiosks, clustered by theme."
                        aspectRatio={8272 / 4613}
                        noDrag
                      />
                    </div>
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
        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <h3>From Individual Sketching to a Testable User Flow</h3>
          <p>
            We developed the user flow in two passes:{" "}
            <mark className="hl">individual sketching + feature selection</mark>, then wireframing
            on a real observed flow.
          </p>

          <h3>Individual Sketching &amp; Feature Selection</h3>
          <p>
            To ideate in extensive detail, we first{" "}
            <mark className="hl">individually brainstormed through quick sketching arcade kiosk user flows before reconvening</mark>.
            After discussing and assessing each other&rsquo;s individual feature ideas, we
            ultimately decided which features to include in the usability test flow.
          </p>
          <div className="visual-compact">
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Crazy_Eights.png`}
              alt="My Crazy 8's sketch sheet — individual ideation quadrants of arcade kiosk feature concepts before team walkthrough."
              aspectRatio={8446 / 4981}
              caption={<>My ideated arcade kiosk user flow</>}
            />
          </div>

          <h3>Wireframing on the Observed Base Flow</h3>
          <p>
            To focus more on the features&rsquo; implementation, we imported a base kiosk arcade
            user flow copied from user observations to{" "}
            <mark className="hl">quickly finish designing the wireframes</mark> into an
            interactive prototype.
          </p>
          <div className="case-image-row with-arrow">
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Observation_User_Flow.png`}
              alt="Initial user flow based directly on the field-observation kiosk flow, before any feature additions."
              aspectRatio={3654 / 4120}
              caption={<>Initial user flow based on field-observation flow</>}
            />
            <span className="arrow-sep">→</span>
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Base_Wireframes.png`}
              alt="Iterated user flow with ideated features integrated into the base kiosk arcade flow."
              aspectRatio={5591 / 4716}
              caption={<>Iterated user flow consisting of ideated features</>}
            />
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
          <div className="usability-flow-anchor">
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Initial_Prototype.png`}
              alt="Initial user flow prototype taken into Round 1 — built from field observations, before any iteration."
              aspectRatio={7016 / 3306}
              caption={
                <>
                  The initial user flow taken into Round 1 — built from field observations of real
                  kiosk use, before any iteration.
                </>
              }
            />
          </div>
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
          <p>
            By round 3 the loyalty program — initially the biggest source of friction — had been
            reshaped into a{" "}
            <mark className="hl">&ldquo;Join for Free&rdquo; upsell with clear pricing</mark>, and
            the interface itself was validated as intuitive at first contact. With both confirmed,
            the team moved into guideline synthesis.
          </p>
          <div className="usability-flow-anchor">
            <ZoomableImage
              src={`${basePath}/img/frogslayer/Final_Prototype.png`}
              alt="Final user flow prototype after three rounds of testing — Join-for-Free surfaced, cash-payment flow dedicated, buttons unified."
              aspectRatio={4634 / 3514}
              caption={
                <>
                  The final user flow after three rounds of testing — upsell-based loyalty
                  prominent, &ldquo;Join for Free&rdquo; surfaced at the top of the pop-up,
                  cash-payment flow dedicated, buttons unified.
                </>
              }
            />
          </div>
        </section>
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <blockquote className="case-pullquote">
            &ldquo;Is it pretty?&rdquo; mattered less than &ldquo;what will this teach us?&rdquo;
            <cite>Frogslayer · design guideline project</cite>
          </blockquote>

          <h3>Prototype as Research Instrument</h3>
          <p>
            Designing a prototype{" "}
            <mark className="hl">as a tool for generating evidence, not as a product</mark>,
            changed how I evaluated every screen — each element existed to test a hypothesis, and
            the pull-quote above became the working rule for every review.
          </p>

          <h3>Environment as Design Material</h3>
          <p>
            The project also showed me how much{" "}
            <mark className="hl">environment is a design material</mark>: testing in a
            deliberately busy student union surfaced behaviors — skimming, rushing, tunnel vision
            on the screen — that a quiet lab never would have. User actions are shaped as much by
            habits and prior experiences with similar stimuli (phones, ads, familiar interfaces)
            as by the interface itself, so designing against those mental models is a losing
            battle; the guidelines work by leaning on them.
          </p>
        </section>
      </main>
    </div>
  );
}
