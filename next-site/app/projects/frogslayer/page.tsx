import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import UsabilityRound, { InsightCard } from "@/components/UsabilityRound";

export const metadata = {
  title: "Kiosk Interface Design Guidelines — Kathleen Li",
};

/* Section order leads with Outcome (deliverables + impact) so recruiters
   see results first. Process sections (Researching → Ideating →
   Verifying) follow as the supporting story, and Takeaways closes
   with next steps, refinements, and what was learned. Section naming
   (Outcome/Takeaways) matches JourneyTrack, ResearchHub, and inline. */
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
          <p>
            The semester resulted in a <mark className="hl">validated set of best-practice design guidelines for entertainment and hospitality kiosk interfaces</mark>, modeled after Nielsen Norman Group&rsquo;s design heuristics and handed off to Frogslayer alongside a final journey map and recommended next steps.
            <br></br><br></br>
            Rather than shipping a single polished product, we <mark className="hl">used a mid-fidelity prototype as a research instrument</mark> — three rounds of usability testing (including an A/B test of two loyalty program models) grounded every guideline in observed user behavior rather than assumption. A key applied finding: <mark className="hl">an upsell-based loyalty model outperformed a tier-based one for arcade kiosks</mark>, and surfacing &ldquo;Join for Free&rdquo; prominently was the single biggest conversion driver.
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
              naming used in JourneyTrack, ResearchHub, and inline.) */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>The Problem</h3>
          <p>
            Frogslayer is a custom software development firm that partners with food and entertainment brands to build guest-facing digital products, including large-screen kiosks.
            <br></br><br></br>
            Interactive kiosks in public hospitality and entertainment venues consistently create <mark className="hl">user frustration, anxiety, and privacy concerns</mark> — driven by confusing navigation, inefficient use of screen real estate, and designs that ignore the public, high-traffic context they live in.
            <br></br><br></br>
            Kiosks are a <mark className="hl">billion-dollar industry</mark>, yet their design is fragmented and inconsistent: businesses keep repeating the same usability mistakes because <mark className="hl">no evidence-based, standardized guidelines exist</mark> for designers to build against. Frogslayer wanted a guideline set that could <mark className="hl">apply across future kiosk projects</mark> to resolve that gap.
          </p>
          <h3>My Role</h3>
          <p>
            During the project, I was the team&rsquo;s <mark className="hl">primary point of contact</mark> with
            Frogslayer&rsquo;s product team, maintaining <mark className="hl">both sides' mutual understanding of the project's progression</mark>, 
            and <mark className="hl">co-led through internal planning and defining of
            specific actions</mark> for the project's success. 
            <br></br>
            <br></br>
            Regarding design, I also contributed through <mark className="hl">researching the current state of kiosk design, building the base low-fi user flow, constructed the usability testing prototypes, and iterated on the
            prototypes to address user insights.</mark>
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Aligning with the Sponsor</h3>
          <p>
            Due to the <mark className="hl">problem scope initially being vague</mark> with &ldquo;Design kiosk interface guidelines verified through
            research&rdquo;, we understood the need to <mark className="hl">immediately narrow down the broad scope for tangible results.</mark>
            <br></br><br></br>
            We began with a <mark className="hl">content audit of Frogslayer&rsquo;s prior internal research</mark>, including an existing Figma prototype. This revealed the sponsor&rsquo;s previous focus on <mark className="hl">interface ergonomics</mark> — and clarified that they wanted us to research <mark className="hl">in the opposite, externally oriented direction</mark>: how a consumer&rsquo;s environment affects kiosk use. It also confirmed <mark className="hl">loyalty programs as a secondary focus</mark> of the deliverable.
            <br></br><br></br>
            The audit ultimately pointed us toward the following focuses:
            <br></br><br></br>
            <strong>
            <ul>Hospitality &amp; entertainment industry</ul>
            <ul>Loyalty programs</ul>
            <ul>External environment (not internal ergonomics)</ul>
            </strong>
          </p>
          <h3>Understanding the Current State Internally and Externally</h3>
          <p>
            After determining our focuses, we then built our foundation through four guiding questions.
          </p>

          {/* Each research row reads as an equation:
              Question + Method = Findings.
              Five columns: question (italic, muted) → "+" → method
              artefact card → "=" → findings list (display weight,
              foreground colour). The +/= operators visually frame the
              research as a structured pipeline, making it easy for a
              recruiter to scan "what was asked, what was done, what
              came out" as one cohesive line. */}
          <div className="research-questions">
            <div className="rq-row">
              <p className="rq-question">&ldquo;What are the gaps of kiosks?&rdquo;</p>
              <span className="rq-op" aria-hidden="true">+</span>
              <figure>
                <div className="image-slot rq-method-slot">Secondary Research</div>
                <figcaption className="rq-method-caption">Secondary Research</figcaption>
              </figure>
              <span className="rq-op" aria-hidden="true">=</span>
              <ul className="rq-findings" aria-label="Findings">
                <li>External environmental factors act as stresses</li>
                <li>Inconsistency of user expectations</li>
                <li>Focus of general functionality without discoverability</li>
                <li>Need of reduction in cogntiive load</li>
                <li>Seamless a user-friendly integration of loyalty program</li>
              </ul>
            </div>
            <div className="rq-row">
              <p className="rq-question">&ldquo;Why is a kiosk preferable?&rdquo;</p>
              <span className="rq-op" aria-hidden="true">+</span>
              <figure>
                <div className="image-slot rq-method-slot">Secondary Research</div>
                <figcaption className="rq-method-caption">Secondary Research</figcaption>
              </figure>
              <span className="rq-op" aria-hidden="true">=</span>
              <ul className="rq-findings" aria-label="Findings">
                <li>User independence without human assistance</li>
                <li>Applicability to indoor and outdoor environment</li>
                <li>Business financial profits</li>
              </ul>
            </div>
            <div className="rq-row">
              <p className="rq-question">&ldquo;How are companies designing kiosk interfaces?&rdquo;</p>
              <span className="rq-op" aria-hidden="true">+</span>
              <figure>
                <div className="image-slot rq-method-slot">Secondary Research</div>
                <figcaption className="rq-method-caption">Secondary Research</figcaption>
              </figure>
              <span className="rq-op" aria-hidden="true">=</span>
              <ul className="rq-findings" aria-label="Findings">
                <li>Labeling of interface purpose</li>
                <li>Centered placement of interactable elements</li>
                <li>Trend of element naming to 1-2 words</li>
                <li>Lack of elements outside of screen's center</li>
              </ul>
            </div>
            <div className="rq-row">
              <p className="rq-question">&ldquo;How do users feel about using kiosks?&rdquo;</p>
              <span className="rq-op" aria-hidden="true">+</span>
              <figure>
                <div className="image-slot rq-method-slot">User Interviews &amp; Observations</div>
                <figcaption className="rq-method-caption">User Interviews &amp; Observations</figcaption>
              </figure>
              <span className="rq-op" aria-hidden="true">=</span>
              <ul className="rq-findings" aria-label="Findings">
                <li>Confidence from familiarity with technology</li>
                <li>Confusion through poorly labeled or over-abundant options</li>
                <li>Varying level of effects from environment</li>
                <li>Hesitance in loyalty programs requiring effort</li>
              </ul>
            </div>
          </div>
          <p>
            After successfully building a knowledge foundation, we were then ready to ideate the user flow.
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
            After <mark className="hl">discussing and assessing each other's indivdual feature ideas</mark>, we ultimately decided to include the 
            following features into the usability test flow for testing:
          </p>
          <figure>
            <div className="image-slot">ideated arcade kiosk flow</div>
            <figcaption>My ideated arcade kiosk user flow</figcaption>
          </figure>
          <p>
            To focus more on the features' implementation, we <mark className="hl">imported a base kiosk arcade user flow copied from user observations </mark>
            to <mark className="hl">quickly finish designing the wireframes</mark> into an interactive prototype.
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
            We ran <mark className="hl">three rounds of moderated usability testing</mark> at the Purdue Memorial
            Union (PMU), chosen to <mark className="hl">simulate the busy, distracting atmosphere of a real arcade</mark>. The prototype was <mark className="hl">used as a research instrument, not a shippable product</mark> — between
            rounds it was iterated against the recorded friction points, not our own opinions, so every change
            was small, defensible, and directly traceable to a user behavior.
            <br></br><br></br>
            Field observations before testing had already surfaced the highest-friction moments: <mark className="hl">payment interactions were the biggest point of confusion</mark> (tap vs. swipe vs. insert), and <mark className="hl">stressful auditory countdown cues damaged user confidence</mark>.
          </p>

          {/* Each round is its own block with a header naming the round
              and a stack of insight cards beneath. Each card pairs one
              user insight with the change it produced, alongside small
              before/after thumbnails. Replaces the previous wide
              equation row layout that didn't scale to 11 insights. */}
          <div className="usability-rounds">
            <UsabilityRound title="Round 1" meta="7 users · PMU">
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

            <UsabilityRound title="Round 2" meta="7 users · PMU · A/B test">
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

            <UsabilityRound title="Round 3" meta="5 users · PMU · final prototype">
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
            By round 3 the loyalty program — initially the biggest source of friction — had been reshaped into a
            <mark className="hl"> &ldquo;Join for Free&rdquo; upsell with clear pricing</mark>, and the interface
            itself was validated as intuitive at first contact. With both confirmed, the team moved into guideline
            synthesis.
          </p>
          <p>
            We compiled findings into a final journey map demonstrating the validated flow, then ran a
            <mark className="hl"> guideline workshop</mark> with our project owner to categorize insights into
            <mark className="hl"> Marketing/Loyalty Programs, UX/UI, and Social Implications/Physical Placement</mark>{" "}
            — formatted after NN/g&rsquo;s design heuristics as the most comprehensive yet minimal model. Handoff
            included honest limitations and next steps: testing loyalty models beyond tiers/upsells, diversifying
            venues beyond arcades, widening the tester demographic beyond college students, and validating with
            real purchase stakes.
          </p>
        </section>

        {/* ───── Takeaways ───── (closes the case study with what was
              learned from the project. Renamed from "Reflections" to
              match the takeaway naming used in JourneyTrack and
              ResearchHub. Single paragraph, no h3 — matches the
              one-paragraph takeaways pattern in the other two cases. */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            Designing a prototype <mark className="hl">as a tool for generating evidence, not as a product</mark>, changed how I evaluated every screen — each element existed to test a hypothesis, and &ldquo;is it pretty?&rdquo; mattered less than &ldquo;what will this teach us?&rdquo;
            <br></br><br></br>
            The project also showed me how much <mark className="hl">environment is a design material</mark>: testing in a deliberately busy student union surfaced behaviors — skimming, rushing, tunnel vision on the screen — that a quiet lab never would have. User actions are shaped as much by <mark className="hl">habits and prior experiences with similar stimuli</mark> (phones, ads, familiar interfaces) as by the interface itself, so designing against those mental models is a losing battle; the guidelines work by leaning on them.
          </p>
        </section>
      </main>
    </div>
  );
}
