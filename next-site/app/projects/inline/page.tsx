import CaseCover from "@/components/CaseCover";
import NextProject from "@/components/NextProject";
import CaseSectionNav from "@/components/CaseSectionNav";
import OpportunityGap from "@/components/OpportunityGap";
import ProgramSwitch from "@/components/ProgramSwitch";

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
  { id: "takeaways", label: "Takeaways" },
];

const BASE_PATH = "";
const COVER_VIDEO = {
  mp4: `${BASE_PATH}/img/cover/inline.mp4`,
  webm: `${BASE_PATH}/img/cover/inline.webm`,
};
const COVER_POSTER = `${BASE_PATH}/img/cover/inline-poster.webp`;

export default function PopByInlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Designing Features For A B2B2C Consumer App"
        meta="Summer 2026 · 10 weeks · Product Design Intern"
        subtitle="A B2B2C Consumer App with Features Built Upon Identified Competitor Gaps and Standard Trends"
        imageLabel="Pop by inline · cover animation"
        heroVideoSrc={COVER_VIDEO}
        heroVideoPoster={COVER_POSTER}
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer" aria-label="NDA notice">
          <span className="case-disclaimer__badge">NDA</span>
          <span className="case-disclaimer__text">
            This case study covers sponsor work protected by a non-disclosure agreement, 
            specifically <strong>product features, competitor names, and internal artifacts 
            are excluded or blurred.</strong>
          </span>
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>

          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Handed off a set of must-have features to inline's development team,</strong>{" "}
              alongside research findings for justification, in a written product
              direction report.
            </p>
            <p className="outcome-callout__meta">
              Summer 2026 · 10 weeks inline internship → Handoff
            </p>
          </aside>

          <p>
            The report bundled a{" "}
            <mark className="hl">competitive audit, gap analysis, and interactive prototype</mark>{" "}
            focused on one use case, describing the must-have features that support
            Pop&rsquo;s market position.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            inline's current project is an early-stage consumer product exploration from inline, a
            Taipei restaurant-technology company whose core business is a B2B reservation,
            waitlist, and table-management platform serving thousands of restaurants across
            Asia-Pacific. This project marks inline's step from pure B2B into B2B2C.
          </p>

          <h3>My Role</h3>
          <p>
            <strong>I worked remotely with inline&rsquo;s Product team in Taiwan</strong> as the{" "}
            <mark className="hl">sole designer on one branch</mark>, alongside a parallel
            branch of the internship. My focus was bringing an outside perspective on the market through competitive research, gap analysis, concept design, and
            usability testing, <strong>ideating features for the product to succeed within the existing market.</strong>
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Mapping the Competitive Landscape</h3>
          <p>
            <strong>I applied one competitive-analysis framework</strong> across{" "}
            <mark className="hl">three competitor apps</mark>, auditing the flows.
          </p>

          <h3>Gap Analysis with Category Discipline</h3>
          {/* Ornament parks in the right margin of the paragraph it annotates,
              and drops below it once the browser is too thin for two columns. */}
          <div className="case-ornament-split">
            <div>
              <p>
                <strong>I cross-referenced each competitor&rsquo;s weaknesses</strong> against the
                parallel branch&rsquo;s proposed features. Weaknesses still left open became the{" "}
                <mark className="hl">opportunity gaps</mark> for Pop&rsquo;s features to build upon.
              </p>
              <ol className="case-legend" aria-label="How each competitor weakness was marked">
                <li>Already addressed</li>
                <li>Partially addressed</li>
                <li className="is-key">Left open &rarr; opportunity gap</li>
              </ol>
            </div>
            {/* Decorative only — a gap with something coming out of it. It carries
                no information the paragraph doesn't, so it gets an empty alt and
                is hidden from assistive tech rather than described. Not a
                StaticImage: that component frames its subject as a case artifact
                and sizes it to ~880px, which would read as evidence. Inline SVG
                (not <img>) so the star can rise out of the hole on scroll. */}
            <OpportunityGap className="case-ornament" />
          </div>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Ideating Scenario</h3>
          <p>
            To keep feedback focused, the user scenario centered on{" "}
            <mark className="hl">coordinating an event under uncertainty</mark>. From it <strong>I ideated the user flow</strong> and decided how each feature would be
            integrated into the prototype.
          </p>
          <div className="case-equation-text" aria-label="Base user flow plus 4 features">
            <span>Base user flow</span>
            <b>+ 4</b>
            <span>features mapped onto the coordination scenario</span>
          </div>
          <h3>Prototyping</h3>
          {/* Text leads, figure sits right, and the two stack below 820px.
              ProgramSwitch, not a zoomable one: a two-node framework
              diagram has nothing to reveal on zoom, and it animates in. */}
          <div className="audit-split audit-split--figure-right audit-split--top">
            <div className="audit-split__text">
              <p>
                With a small window before testing,{" "}
                <strong>I built the flow&rsquo;s core interactivity</strong> with{" "}
                <mark className="hl">AI-assisted prototyping tools</mark>, starting in Figma Make,
                then moving to Google AI Studio, whose daily credit limits better suited the pace
                of iterating between test rounds.
              </p>
              <p>
                Once testing was done,{" "}
                <strong>I adapted the prototype back into Figma</strong> so access to my materials
                was centralized with the parallel branch&rsquo;s, where the rest of the
                team&rsquo;s work already lived.
              </p>
            </div>
            <div className="audit-split__visual">
              <ProgramSwitch
                topLabel={<>I Need More Credit To Iterate<br />Upon the Prototype More</>}
                bottomLabel={<>I Need to Centralize Access to<br />My Materials with the Teams&rsquo;</>}
                alt="Diagram of the prototype moving from Figma Make to Google AI Studio for iteration credits, then back into Figma to centralize access with the parallel branch."
              />
            </div>
          </div>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Usability Testing</h3>
          <div className="case-stats" role="list">
            <div className="case-stat" role="listitem"><b>8</b><span>usability sessions I facilitated</span></div>
            <div className="case-stat" role="listitem"><b>3</b><span>sprints of 2&ndash;3 participants each</span></div>
            <div className="case-stat" role="listitem"><b>10</b><span>feature iterations between sprints</span></div>
          </div>
          <p>
            Each session opened with warm-up questions, walked the tester through the
            prototype&rsquo;s flows, then probed for feedback on each flow.
          </p>

          <h3>Addressing Insights and Feedback with Iterations</h3>
          <p>
            <strong>After each sprint I identified iterations to implement</strong> and tweaked
            the protocol to probe them, so every sprint tested a prototype that had already
            answered the last one.
          </p>
          <div className="case-shift" aria-label="How feedback shifted after the first round">
            <span>UI feedback</span>
            <span className="case-shift__arrow" aria-hidden="true">&rarr;</span>
            <span className="is-key">Feature expansion</span>
            <small>for flexibility in other user scenarios and continued usage</small>
          </div>
          <p>
            Of the four features carried into the initial prototype,{" "}
            <strong>I deemed three pivotal</strong> for directly contributing to the app&rsquo;s
            unique position within the market.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <h3>Distinguishing Categories of Competitors</h3>
          <p>
            During the project&rsquo;s research phase, I recognized that a{" "}
            <mark className="hl">rigorous gap analysis requires determination of the scope&rsquo;s limitations.</mark>{" "}
            While conducting the competitive audit, I realized{" "}
            <mark className="hl">that some of the audited competitors had differing overlaps of identity compared to Pop.</mark>{" "}
            As a result, I had to distinguish the scope of direct competitors in context to
            Pop&rsquo;s focus before building the gap analysis, so a gap of a competitor would not
            automatically be counted as a gap for Pop if it were to be an outside-of-scope gap.
          </p>

          <h3>Priorities in Implementation with AI</h3>
          <p>
            From this project, I understood how to better navigate a workflow that includes
            implementing with AI. The{" "}
            <mark className="hl">AI tools I utilized (Figma Make and Google AI Studio) limited the number of iterations I could implement at a time.</mark>{" "}
            To adapt, I{" "}
            <mark className="hl">recognized and prioritized larger-scale implementations based on impact on the prototype&rsquo;s efficiency</mark>{" "}
            during usability testing while{" "}
            <mark className="hl">manually refining smaller and specific details afterwards.</mark>{" "}
            As a result, I was able to utilize my prompting tokens while also being well informed
            of the prototype&rsquo;s abilities and limitations through manual involvements of
            altering the code.
          </p>
        </section>
      </main>
      <NextProject current="inline" 
      note={<>Started after finishing conceptualizing an <strong>AI Journey Map Maintenance Agent</strong></>}
      />
    </div>
  );
}
