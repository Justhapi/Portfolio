import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import UsabilityRound, { InsightCard } from "@/components/UsabilityRound";

export const metadata = {
  title: "Kiosk Interface Design Guidelines — Kathleen Li",
};

/* Section order leads with Results (deliverables + impact) so recruiters
   see the outcome first. Process sections (Researching → Ideating →
   Verifying) follow as the supporting story, and Takeaways closes
   with next steps, refinements, and what was learned. Renamed from
   "Reflections" to match the takeaway naming used in JourneyTrack
   and ResearchHub. */
const SECTIONS = [
  { id: "results", label: "Results" },
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
        meta="16 weeks · 6 designers · UI & Product · Co-Lead + Point of Communication"
        subtitle="Adopted as Frogslayer's guideline reference + collaboration extended"
        imageLabel="Frogslayer kiosk · cover image"
      />

      <main id="main" className="case-body">
        {/* ───── Results ───── (deliverables + impact summary up front
              so a recruiter reads the outcome in the first viewport) */}
        <section id="results" className="case-section">
          <h2>Results</h2>
          <p>
            The project delivered <mark className="hl">design guidelines, usability test user flow, and a user journey map</mark> that{" "}
            Frogslayer also adopted as an <mark className="hl">internal references for future continuation of guidelines</mark>.
          </p>
          <div className="case-image-row">
            <figure>
              <div className="image-slot">design guidelines deck</div>
              <figcaption>
                A set of design guidelines for hospitality and entertainment kiosks verified and based on the project
                findings.
              </figcaption>
            </figure>
            <figure>
              <div className="image-slot">user journey map</div>
              <figcaption>
                A journey map of the project&rsquo;s final user flow to act as a reference, providing foundational
                baseline understanding and insights.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ───── Overview ───── (Project Results h3 moved up into the
              top Results section; Overview now holds Problem Scope +
              Project Contributions so it reads as scope + role.) */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>Problem Scope</h3>
          <p>
            Due to cost effeciency, <mark className="hl">touchscreen kiosks are replacing staff</mark> across industries. However,
            interface designs <mark className="hl">share no design consistency</mark>, causing <mark className="hl">user frustation from 
            internal and external factors.</mark>
            <br></br>
            <br></br>
            Frogslayer wants to develope a set of guidelines that could <mark className="hl">apply across future kiosk projects</mark> to resolve that gap.
          </p>
          <h3>Project Contributions</h3>
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
          <h3>Aligning and Narrowing Research Focus With Frogslayer's Intentions</h3>
          <p>
            Due to the <mark className="hl">problem scope intially being vague</mark> with "Design kiosk interface guidelines verified through 
            research", we understood the need to <mark className="hl">immediately narrow down the broad scope 
            for tangible results.</mark>
            <br></br><br></br>
            As a result, we wanted to <mark className="hl"> avoid acting upon inferences</mark> from just the intial scope and instead
            <mark className="hl"> act on concrete evidence of Frogslayer's vision.</mark> This led to us requesting elaboration and being 
            provided with <mark className="hl">a prototype previously constructed</mark>, relating to kiosk 
            interface design.
            <br></br><br></br>
            We then ran a<mark className="hl"> content audit on the prototype</mark> that pointed us towards the following focuses:
            <br></br><br></br>
            <strong>
            <ul>Hospitality & entertainment industry</ul>
            <ul>Loyalty programs</ul>
            <ul>UI ergonomics</ul>
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
            Union (PMU), chosen to simulate the high-traffic, distractible atmosphere of a real arcade. Between
            rounds the prototype was iterated against the recorded friction points — not against our own opinions —
            which kept every change small, defensible, and quick to ship.
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
        </section>

        {/* ───── Takeaways ───── (closes the case study with what was
              learned from the project. Renamed from "Reflections" to
              match the takeaway naming used in JourneyTrack and
              ResearchHub. Single paragraph, no h3 — matches the
              one-paragraph takeaways pattern in the other two cases. */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            User interactions are <mark className="hl">do not occur just from instinctual rocognition, but also from habits shaped
            through prior experiences of a similar stimuli.</mark> Users consistently refer to extensive experiences of <mark className="hl">utilziing similar 
            technology such as phones and encountering ads</mark> as the fuel of their actions when interacting with the kiosk. As a result, directly <mark className="hl">designing against 
            prior experiences is a losing battle, highlighting reliance on familiar mental models</mark> to better guide favorable 
            user actions.
          </p>
        </section>
      </main>
    </div>
  );
}
