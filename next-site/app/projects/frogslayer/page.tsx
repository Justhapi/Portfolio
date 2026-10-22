import CaseCover from "@/components/CaseCover";
import NextProject from "@/components/NextProject";
import CaseSectionNav from "@/components/CaseSectionNav";
import UsabilityRound, { InsightCard } from "@/components/UsabilityRound";
import ResearchCarousel from "@/components/ResearchCarousel";
import ZoomableImage from "@/components/ZoomableImage";
import outcomeGuidelines from "./images/Guidelines.webp";
import outcomeJourneyMap from "./images/Journey_Map.webp";
import producerKioskBenefits from "./images/Secondary_Research_Visual.webp";
import producerCompetitorAnalysis from "./images/Competitor_Analysis_Visual.webp";
import consumerUserObservation from "./images/User_Observation_Visual.webp";
import consumerUserInterview from "./images/User_Interview_Visual.webp";
import ideatingCrazyEights from "./images/Crazy_Eights.webp";
import ideatingObservationFlow from "./images/Observation_User_Flow.webp";
import ideatingBaseWireframes from "./images/Base_Wireframes.webp";
import verifyingInitialPrototype from "./images/Initial_Prototype.webp";
import verifyingFinalPrototype from "./images/Final_Prototype.webp";
/* Key screens cropped from the final flow, shown large. */
import finalStart from "./images/Final_Start.webp";
import finalMember from "./images/Final_Member.webp";
import finalPay from "./images/Final_Pay.webp";
import finalDispensing from "./images/Final_Dispensing.webp";

const KEY_SCREENS = [
  { img: finalStart, step: "01", label: "Start", note: "" },
  { img: finalMember, step: "02", label: "Member upsell", note: "Labelled with pricing to combat the suspicion that membership costs money." },
  { img: finalPay, step: "03", label: "Payment", note: "" },
  { img: finalDispensing, step: "04", label: "Dispensing", note: "" },
];
/* Round 1 iterations — each image contains the before + after side-by-side. */
import round1CardLoading from "./images/Card_Load_Iteration.webp";
import round1Loyalty from "./images/Loyalty_Round_1_Iteration.webp";
import round1Ending from "./images/Ending_Iteration.webp";
import round1PaymentButton from "./images/Payment_Button_Iteration.webp";
/* Round 2 iterations — each image contains the before + after side-by-side. */
import round2Upsell from "./images/Upsell_Iteration.webp";
import round2Reset from "./images/Reset_Iteration.webp";

export const metadata = {
  title: "Kiosk Interface Design Guidelines — Kathleen Li",
};

const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "ideating", label: "Ideating" },
  { id: "verifying", label: "Verifying" },
  { id: "takeaways", label: "Takeaways" },
];

// Custom domain (kathleenli.tech) serves from the root — no prefix needed.
const BASE_PATH = "";
/* MP4 first — VP9-in-WebM decode support is inconsistent across
   browsers/engines, which was causing this cover to render blank or
   inconsistently. MP4/H.264 is universally supported. */
const COVER_VIDEO = {
  mp4: `${BASE_PATH}/img/cover/Frogslayer.mp4`,
  webm: `${BASE_PATH}/img/cover/Frogslayer.webm`,
};
const COVER_POSTER = `${BASE_PATH}/img/cover/Frogslayer-poster.webp`;

export default function FrogslayerCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Kiosk Interface Design Guidelines"
        meta="Fall 2025 · 8 weeks · UX Designer & Researcher"
        subtitle="A cross-industry kiosk design reference for a consultancy&rsquo;s client engagements"
        imageLabel="Frogslayer kiosk · cover animation"
        heroVideoSrc={COVER_VIDEO}
        heroVideoPoster={COVER_POSTER}
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer" aria-label="NDA notice">
          <span className="case-disclaimer__badge">NDA</span>
          <span className="case-disclaimer__text">
            This case study covers sponsor work protected by a non-disclosure agreement, 
            specifically the <strong>company&rsquo;s prototype visuals and analyzed competitors
            are excluded or generalized.</strong>
          </span>
        </p>
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Frogslayer extended the partnership</strong> with the Purdue UXD Experience
              Studio to expand the guideline set past our initial handoff.
            </p>
            <p className="outcome-callout__meta">
              Fall 2025 · Purdue UXD Experience Studio → Handoff · Continued partnership
            </p>
          </aside>

          <p>
            We handed off a{" "}
            <mark className="hl">validated set of best-practice design guidelines</mark> for
            entertainment and hospitality kiosk interfaces, alongside a journey map exemplifying
            the findings and recommended next steps for continuing the guidelines.
          </p>
          <div className="case-image-row">
            <ZoomableImage
              src={outcomeGuidelines.src}
              alt="A set of kiosk design guidelines for hospitality and entertainment kiosks, formatted after NN/g's heuristics."
              aspectRatio={8820 / 4766}
              caption={
                <>
                  A set of design guidelines for hospitality and entertainment kiosks, formatted
                  after NN/g&rsquo;s heuristics and verified across three rounds of testing.
                </>
              }
            />
            <ZoomableImage
              src={outcomeJourneyMap.src}
              alt="A journey map of the project's final validated user flow, capturing emotion dips and reference insights."
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
            The sponsor was Frogslayer, a custom software development firm partnering with food
            and entertainment brands to build guest-facing digital products. We were asked to
            construct a{" "}
            <mark className="hl">standardized set of evidence-based design guidelines</mark> that
            would help future kiosk projects avoid usability pitfalls.
          </p>

          <h3>The Problem</h3>
          <p>
            Kiosks are increasingly common across industries for their convenience and
            cost-efficiency, yet their design still leaves{" "}
            <mark className="hl">users consistently frustrated</mark>.
            <br></br><br></br>
            Unlike mobile or web apps, kiosks lack a{" "}
            <mark className="hl">standard design framework focused on user comfort</mark>, so the
            same usability pain points recur.
          </p>
          <h3>My Role</h3>
          <p>
            <strong>I worked as a UX Designer &amp; Researcher</strong>,{" "}
            <mark className="hl">researching the current state of kiosk design</mark>, building
            the base user flow, constructing the usability-testing prototype, and iterating on
            insights across three rounds of testing.
            <br></br><br></br>
            I was also the team&rsquo;s{" "}
            <mark className="hl">primary point of contact</mark> with Frogslayer&rsquo;s product
            team, maintaining both sides&rsquo; understanding of the project&rsquo;s progression,
            and co-led internal planning toward the project&rsquo;s goal.
          </p>
        </section>
        <section id="researching" className="case-section">
          <h2>Researching</h2>

          <h3>Clarifying Scope with the Sponsor</h3>
          <p>
            The request arrived vague, as{" "}
            <mark className="hl">&ldquo;design kiosk interface guidelines&rdquo;</mark>. We audited
            the existing Figma prototype from Frogslayer&rsquo;s{" "}
            <mark className="hl">prior internal research</mark> with their product team and
            settled on four scope focuses:
          </p>
          <div className="case-board case-board--4" aria-label="Scope focuses">
            {[
              ["Internal ergonomics", "orange", -1.5],
              ["Hospitality & entertainment industry", "teal", 1],
              ["Loyalty programs", "pink", -1],
              ["External environmental factors", "blue", 1.5],
            ].map(([name, tone, tilt], i) => (
              <div key={name as string} className={`case-sticky case-sticky--${tone}`} style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}>
                <span className="case-sticky__n">{String(i + 1).padStart(2, "0")}</span>
                {name}
              </div>
            ))}
          </div>

          <h3>Establishing the Evidence Base</h3>
          <p>
            We built the foundation on two stakeholder perspectives:{" "}
            <mark className="hl">the producer side and the consumer side</mark>: how businesses build kiosks, and
            how users experience them.
            <br></br><br></br>
            Starting with the producer side, we focused on two questions:
          </p>
          <ul className="focus-list">
            <li><strong>What makes up a kiosk interface?</strong></li>
            <li><strong>How are companies designing kiosk interfaces today?</strong></li>
          </ul>
          <ResearchCarousel
            slides={[
              {
                key: "makes-up",
                label: "Secondary Research",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Secondary Research</span>
                      <h4 className="rq-heading">&ldquo;What makes up a kiosk interface?&rdquo;</h4>
                      <p className="rq-lead">
                        We reviewed articles, journals, and literature across the{" "}
                        <mark className="hl">four dimensions a kiosk interface has to account for</mark>:
                        interface elements, consumer psychology, loyalty programs, and physical
                        kiosk constraints.
                      </p>
                      <p className="rq-findings-lead"><strong>The recurring gaps we surfaced:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Usability challenges: slow task completion, environmental noise, unclear affordances</li>
                        <li>Design pitfalls: inconsistent touch targets, low contrast, inaccessible screen heights</li>
                        <li>Function-first over discoverability: interfaces optimize for transactions, not exploration</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={producerKioskBenefits.src}
                        alt="My portion of the team's secondary-research board on kiosk interface design."
                        aspectRatio={4057 / 5114}
                        noDrag
                        caption={
                          <>
                            My portion of the secondary research.
                          </>
                        }
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "conventions",
                label: "Competitive Analysis",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Competitive Analysis</span>
                      <h4 className="rq-heading">&ldquo;How are companies designing kiosk interfaces today?&rdquo;</h4>
                      <p className="rq-lead">
                        We audited kiosk-industry sites, reviews, and product imagery to map the{" "}
                        <mark className="hl">design conventions incumbents currently share</mark>{" "}
                        and the opportunity gaps our guidelines could target.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Consistent labeling of each screen&rsquo;s purpose at the top</li>
                        <li>Interactive elements clustered center-screen, with names kept to one or two words</li>
                        <li>Opportunity gap: little use of space outside the center, with edges left empty to avoid cognitive overload</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={producerCompetitorAnalysis.src}
                        alt="My contribution to the team's competitive analysis of kiosk-industry companies."
                        aspectRatio={4039 / 4753}
                        noDrag
                        caption={
                          <>
                            My competitive analysis contribution.
                          </>
                        }
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          <h3>Gathering Firsthand User Insight</h3>
          <p>
            After understanding the producer's side, we shifted to the{" "}
            <mark className="hl">consumer's perspective</mark> to answer the following questions:
          </p>
          <ul className="focus-list">
            <li><strong>How do users currently interact with kiosks?</strong></li>
            <li><strong>How do users actually behave on kiosks in context?</strong></li>
          </ul>
          <ResearchCarousel
            slides={[
              {
                key: "interviews",
                label: "Interviews & Survey",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Interviews &amp; Survey</span>
                      <h4 className="rq-heading">
                        &ldquo;How do users currently interact with kiosks?&rdquo;
                      </h4>
                      <p className="rq-lead">
                        We interviewed users for firsthand stories and ran a companion survey with
                        the same guiding questions to reach a broader audience. Together they
                        surfaced how users currently{" "}
                        <mark className="hl">perceive, navigate, and disengage from kiosk flows</mark>.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Confidence stems from familiarity: users treated kiosks as an extension of touch-screen patterns they already know</li>
                        <li>Confusion arises when options become overwhelming or poorly labeled</li>
                        <li>Loyalty programs are rarely used, cited as not worth the effort, annoying sign-up, or simply forgotten</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={consumerUserInterview.src}
                        alt="The interview protocol questions and notes from an interview session I conducted."
                        aspectRatio={1522 / 1813}
                        noDrag
                        caption={
                          <>
                            The questions utilized during, and notes from, an interview session I conducted.
                          </>
                        }
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "observations",
                label: "Field Observations",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Field Observations</span>
                      <h4 className="rq-heading">
                        &ldquo;How do users actually behave on kiosks in context?&rdquo;
                      </h4>
                      <p className="rq-lead">
                        We observed four participants at a partner indoor entertainment center
                        completing two real tasks (buying a play card and checking / reloading
                        balance), converting each session into a user journey map to surface
                        friction that self-report couldn&rsquo;t catch.
                      </p>
                      <p className="rq-findings-lead"><strong>What we found:</strong></p>
                      <ul className="rq-findings-list">
                        <li><mark className="hl">Payment transactions were the biggest point of confusion</mark>: tap vs. swipe vs. insert, and which reader to use</li>
                        <li>Kiosk lag and inefficient screen-space use disrupted flow and hid important information</li>
                        <li>Countdown sounds and abrupt auditory feedback reduced user confidence mid-task</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={consumerUserObservation.src}
                        alt="Journey map from one field observation session I was involved in at a partner indoor entertainment center."
                        aspectRatio={7441 / 6555}
                        noDrag
                        caption={
                          <>
                            Journey map from one field observation session I was involved in.
                          </>
                        }
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </section>
        <section id="ideating" className="case-section">
          <h2>Ideating</h2>
          <h3>From Individual Sketching to a Testable User Flow</h3>
          <p>
            We developed the user flow in two passes,{" "}
            <mark className="hl">individual sketching and feature selection</mark>, then
            wireframing, so usability tests could{" "}
            <mark className="hl">apply our findings to an interactive flow</mark>.
          </p>

          <h3>Individual Sketching &amp; Feature Selection</h3>
          <p>
            To ideate in extensive detail, we first{" "}
            <mark className="hl">individually brainstormed through quick sketching</mark> arcade kiosk user flows before reconvening.
            After discussing and assessing each other&rsquo;s individual feature ideas, we voted
            on each other's works to decide which features to include in the usability test flow.
          </p>
          <div className="case-map">
            <div className="case-map__col">
              <span className="case-map__label">Pain points from field observations</span>
              <ul>
                <li>Payment interactions with text-only instructions</li>
                <li>Auditory countdown cues threatening a return to the start of the flow</li>
              </ul>
            </div>
            <span className="case-map__arrow" aria-hidden="true">&rarr;</span>
            <div className="case-map__col case-map__col--out">
              <span className="case-map__label">Feature themes we selected</span>
              <ul>
                <li>Onboarding assistance</li>
                <li>Clear affordances through consistent UI, to reduce hesitation</li>
              </ul>
            </div>
          </div>
          <div className="visual-compact">
            <ZoomableImage
              src={ideatingCrazyEights.src}
              alt="My ideated arcade kiosk user flow sketch."
              aspectRatio={8446 / 4981}
              caption={<>My ideated arcade kiosk user flow</>}
            />
          </div>

          <h3>Wireframing on the Observed Base Flow</h3>
          <p>
            To focus more on the features&rsquo; implementation, we imported a base kiosk arcade user flow based on the one utilized during user observations 
            to <mark className="hl">quickly expand the wireframe into an interactive prototype</mark> ready for use.
          </p>
          <div className="case-image-row with-arrow">
            <ZoomableImage
              src={ideatingObservationFlow.src}
              alt="Whiteboarding of the field-observation arcade kiosk flow."
              aspectRatio={3654 / 4120}
              caption={<>Whiteboarding of the field-observation arcade kiosk flow</>}
            />
            <span className="arrow-sep">→</span>
            <ZoomableImage
              src={ideatingBaseWireframes.src}
              alt="Wireframed user flow addressing the significant pain points from user observations."
              aspectRatio={5591 / 4716}
              caption={<>Wireframed user flow addressing the significant pain points</>}
            />
          </div>
        </section>

        {/* ───── Verifying ───── */}
        <section id="verifying" className="case-section">
          <h2>Verifying</h2>
          <h3>Validating and Retesting with User Insights</h3>
          <div className="case-stats" role="list">
            <div className="case-stat" role="listitem"><b>3</b><span>rounds of moderated testing at the busy Purdue Memorial Union</span></div>
            <div className="case-stat" role="listitem"><b>19</b><span>test sessions across the three rounds</span></div>
            <div className="case-stat" role="listitem"><b>6</b><span>iterations made between rounds</span></div>
          </div>
          <p>
            The prototype was a research instrument,{" "}
            <mark className="hl">iterated between rounds</mark> to address recorded friction
            points and <mark className="hl">modified to assess user feedback</mark> on specific
            findings.
          </p>
          <div className="usability-flow-anchor">
            <ZoomableImage
              src={verifyingInitialPrototype.src}
              alt="The initial user flow prototype utilized during Round 1 testing."
              aspectRatio={9841 / 4000}
              caption={
                <>
                  The initial user flow utilized during Round 1.
                </>
              }
            />
          </div>
          <div className="usability-rounds">
            <UsabilityRound
              title="Round 1"
              meta="7 users"
              focus={
                <>
                  <strong>Round 1 focus:</strong> Verify that{" "}
                  the PMU testing environment was <mark className="hl">representative of a busy arcade</mark>,
                  and observe how users interacted with the initial prototype for the first time
                </>
              }
            >
              <InsightCard
                label="Card-Loading Page"
                insight="“Cognitive overload on the card-loading selection page”"
                change="Simplified the card-loading page to match the rest of the flow"
                imageSrc={round1CardLoading.src}
                imageAlt="Before and after of the card-loading selection page — original crowded layout on the left, simplified version on the right."
                imageAspectRatio={1983 / 1282}
              />
              <InsightCard
                label="Loyalty Pop-up"
                insight="“Consistent resistance to signup, plus confusion that loyalty required an entry fee”"
                change="Loyalty pop-up with a clear comparison of member tiers and deals to compel interaction"
                imageSrc={round1Loyalty.src}
                imageAlt="Before and after of the loyalty-program introduction — original in-flow prompt on the left, the new pop-up with tiers and deals on the right."
                imageAspectRatio={2017 / 2302}
              />
              <InsightCard
                label="Ending Page"
                insight="“Ending-page orientation broke layout consistency”"
                change="Flipped the end page from vertical to horizontal"
                imageSrc={round1Ending.src}
                imageAlt="Before and after of the end page — original vertical button placement on the left, horizontal on the right."
                imageAspectRatio={1943 / 1282}
              />
              <InsightCard
                label="Payment Buttons"
                insight="“Payment buttons read as different elements from the rest of the screens”"
                change="Redesigned payment buttons to match the site&rsquo;s button system"
                imageSrc={round1PaymentButton.src}
                imageAlt="Before and after of the payment buttons — original inconsistent style on the left, unified style matching other buttons on the right."
                imageAspectRatio={1982 / 1391}
              />
            </UsabilityRound>

            <UsabilityRound
              title="Round 2"
              meta="7 users · A/B test"
              focus={
                <>
                  <strong>Round 2 focus:</strong> Because{" "}
                  <mark className="hl">most Round 1 users didn&rsquo;t attempt</mark> to click the sign-up-as-member button,
                  we surfaced membership as a pop-up to force interaction with it, then ran an{" "}
                  <mark className="hl">A/B test through the pop-up</mark> to gauge two candidate loyalty-program models,
                  tier-based (upgrade for perks) vs. upsell-based (spend $20, play with $25), in the context of the entertainment industry
                </>
              }
            >
              <InsightCard
                label="Loyalty Upsells"
                insight="Upsells engaged even hesitant users, but a recurring “might be a catch” mistrust surfaced around unclear deals and member pricing"
                change="Selected upsells over tiers as the loyalty model, then modified upsell prices and deals for clarity to build trust"
                imageSrc={round2Upsell.src}
                imageAlt="Before and after of the loyalty pop-up — original tiers A/B with unclear pricing on the left, upsells-only version with clarified prices on the right."
                imageAspectRatio={2392 / 1742}
              />
              <InsightCard
                label="Reset Button"
                insight="“Reset button unused in every observed session”"
                change="Replaced the unused reset button with a sign-in button"
                imageSrc={round2Reset.src}
                imageAlt="Before and after of the interface — original screen with the unused reset button on the left, the same screen with a sign-in button in its place on the right."
                imageAspectRatio={2397 / 1770}
              />
            </UsabilityRound>

            <UsabilityRound
              title="Round 3"
              meta="5 users · final validation"
              focus={
                <>
                  <strong>Round 3 focus:</strong> Verify the validity of the{" "}
                  <mark className="hl">iterations we made after Round 2</mark> using an improved
                  prototype. Because Round 2&rsquo;s iterations tested well, we did not iterate
                  on the prototype further after this round, and instead applied the findings
                  directly into the deliverable guideline.
                </>
              }
              findings={
                <>
                  <p>
                    Round 3 confirmed that the Round 2 iterations were effective, so instead of
                    another prototype pass, we{" "}
                    <mark className="hl">recorded the findings</mark> from this round directly into the deliverable guideline:
                  </p>
                  <ul>
                    <li>
                      <strong>Users found the interface intuitive</strong> due to the one-at-a-time
                      instructions that prevented them from feeling overwhelmed.
                    </li>
                    <li>
                      <strong>Users often missed &ldquo;Join for Free&rdquo; while skimming</strong>,
                      even though joining being free was the biggest conversion driver. As a result,
                      we recommended in the guideline to place key information at the top of any
                      membership prompt.
                    </li>
                    <li>
                      <strong>Users habitually rejected memberships</strong> because they assumed
                      the membership required cost or commitment. To combat this, the guideline
                      recommends prominent cost transparency on any membership prompt.
                    </li>
                    <li>
                      <strong>Colors were well-liked</strong> as they are utilized to guide the
                      user throughout the user flow through contrast.
                    </li>
                  </ul>
                </>
              }
            />
          </div>
          <p>
            Across all three rounds, the feature that received the most changes was the loyalty
            program, specifically{" "}
            <mark className="hl">iterations for clarity of its labelling</mark> of the &ldquo;Join for Free&rdquo; upsell with pricing,
            as we needed to <mark className="hl">actively combat users&rsquo; habitual suspicion</mark>{" "}
            of the membership requiring monetary cost.
          </p>
          <div className="case-screens">
            {KEY_SCREENS.map((k) => (
              <figure key={k.step} className="case-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={k.img.src} alt={`${k.label} screen of the final kiosk flow`} width={495} height={882} loading="lazy" />
                <figcaption>
                  <span className="case-screen__step">{k.step}</span>
                  <b>{k.label}</b>
                  {k.note && <span>{k.note}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
          <details className="case-fullflow">
            <summary>See the full flow (all screens)</summary>
            <div className="usability-flow-anchor">
              <ZoomableImage
                src={verifyingFinalPrototype.src}
                alt="The final user flow prototype after three rounds of usability testing."
                aspectRatio={11555 / 5321}
                caption={<>The final user flow after three rounds of testing.</>}
              />
            </div>
          </details>
        </section>
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Prototype as Research Instrument</h3>
          <p>
            Designing a prototype{" "} <mark className="hl">as a tool and not as a product</mark> heavily differed from my previous projects,
            where the end goal was to construct a prototype for developers to implement. As a result, I prioritized research verification over design aesthetics
            when designing the prototype.
          </p>

          <h3>Environment as Design Material</h3>
          <p>
            Due to the project's scope being primarily the entertainment industry, the team and I needed to consider the appropriate environment 
            for testing, leading us to use a nearby campus building known for its consistently busy atmosphere. From this project, I find that it is 
            important to <mark className="hl">heavily assess user feedback in the context of the environment as a factor</mark> of a user's experience with a product.
          </p>
        </section>
      </main>
      <NextProject current="frogslayer" 
      note={<>Recently worked on integrating a <strong>B2B2C product</strong> into an existing market</>}
      />
    </div>
  );
}
