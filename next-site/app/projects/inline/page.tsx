import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

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

/* Cover video — served from /public/img/cover so static export copies
   it verbatim. Same pattern as Frogslayer + ResearchHub. */
const BASE_PATH = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
const COVER_VIDEO = `${BASE_PATH}/img/cover/inline.webm`;

export default function PopByInlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Designing Features For An Event Coordination Uncertainties"
        meta="Summer 2026 · 10 weeks · Product Design Intern"
        subtitle="A lightweight B2B2C consumer tool for planning everyday gatherings"
        imageLabel="Pop by inline · cover animation"
        heroVideoSrc={COVER_VIDEO}
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer" aria-label="NDA notice">
          <span className="case-disclaimer__badge">NDA</span>
          <span className="case-disclaimer__text">
            This case study covers sponsor work protected by a non-disclosure agreement, 
            specifically <strong>product features, competitor names, and internal artifacts 
            are excluded or generalized.</strong>
          </span>
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>

          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Handed off a set of must-have features for Pop, </strong>
              alongside research findings for justification, in a written product
              direction report for future development.
            </p>
            <p className="outcome-callout__meta">
              Summer 2026 · 10 weeks inline internship → Handoff
            </p>
          </aside>

          <p>
            The handoff for the internship was a report that bundled the{" "}
            <mark className="hl">competitive audit, gap analysis, and an end-to-end interactive prototype</mark> focused on
            a specific use case, describing the product's 4 must-have features to support its unique market position.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            <mark className="hl">Pop by inline</mark> is an early-stage consumer product
            exploration from inline, a restaurant-technology company headquartered in Taipei
            whose core business is a{" "}
            <mark className="hl">B2B reservation, waitlist, and table-management platform</mark>{" "}
            serving thousands of restaurants across the Asia-Pacific region. Pop marks
            inline&rsquo;s step from pure B2B into B2B2C. The brief centered on{" "}
            <mark className="hl">early-stage coordination design under uncertainty</mark>.
          </p>

          <h3>My Role</h3>
          <p>
            During this project, I worked as a Product Design Intern working remotely with inline's Product team based in Taiwan. I 
            was the{" "}<mark className="hl">sole designer on one branch of the project</mark>, working
            alongside a parallel branch of the internship. My focus was to bring an outside perspective of the
            current market through competitive research, gap analysis, concept design, and
            usability testing to ensure priority of features that ensures success of the Pop app within the exisiting market.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Mapping the Competitive Landscape</h3>
          <p>
            I applied a single competitive-analysis framework across{" "}
            <mark className="hl">three event-coordination products</mark>, conducting audits on apps
            that focused on user flows of hosts and guests.
          </p>

          <h3>Gap Analysis with Category Discipline</h3>
          <p>
            After the analysis, I then cross-referenced each competitor&rsquo;s weaknesses against the team&rsquo;s{" "}
            <mark className="hl">eight solution features proposed</mark> prior by the parallel branch team.
            For each competitor weakness I discovered, I verified if a proposed feature already addresses it,
            partially addresses it, or leaves it open.
            <br></br><br></br>
            From the set of remaining unaddressed weaknesses, I utilized them as opportunity gaps to ideate additional 
            features that <mark className="hl">determines the product's ability to solve
            the same problem as competitors, but a more unique and efficient approach.</mark>
          </p>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Ideating Scenario</h3>
          <p>
            To narrow the scope to guide relevant feedback and success, the <mark className="hl"> user case scenario included event 
            coordinating under uncertainty.</mark> After the scenario was determined in detail,
            I then went on to <mark className="hl">ideate the user flow that would address the user case and determine
            how features would be integrated</mark> into the prototype.
          </p>
          <h3>Prototyping</h3>
          <p>
            Due to the <mark className="hl">scale of ideating and building the prototype within the small window before testing, I utilized AI-assisted
            prototyping tools to build</mark> the core interactivity of the user flow. Initially, I utilized Figma Make, but eventually <mark className="hl">swapped 
            to Google AI Studio as its daily prompting credit limits were more well-suited to the demands of iterating</mark> before and during the 
            rounds of usability tests.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Usability Testing</h3>
          <p>
            During the 8 usability test sessions, I served as the facilitator. First, I would <mark className="hl">introduce the focus of the prototype by
            asking each tester warm-up questions</mark> before directing them to <mark className="hl">complete tasks while navigating the prototype's user flows. </mark>
            After they completed each flow, I would probe for feedback and thoughts of the recently traversed user flow.
          </p>

          <h3>Addressing Insights and Feedback with Iterations</h3>
          <p>
            After <mark className="hl"> sprints of 2 - 3 sessions to ensure that feedback reflected a general rather than a singular voice,</mark> I would 
            assess the feedback to <mark className="hl">identify iterations to implement into the prototype and tweak the usability protocol</mark> to probe 
            for feedback on those iterations.
            <br></br><br></br>
            Because of this structure, <mark className="hl">each sprint tested a prototype that had already responded to the previous sprint&rsquo;s feedback. </mark>
            As the rounds progressed, I noticed that the feedback from participants gradually <mark className="hl">shifted from usability issues to 
            additive feature suggestions</mark> that would enhance the prototype to be adaptable to other use cases and continued usage.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <h3>Distinguishing Categories of Competitors</h3>
          <p>
            During the project's research phase, I recognized that a <mark className="hl">rigorous gap analysis requires determination of the 
            scope's limitations.</mark> While conducting the competitive audit, I realized <mark className="hl">that some of the audited competitors
            had differing overlaps of identity compared to Pop.</mark> As a result, I had to distinguish the scope of direct competitors in context
            to Pop's focus before building the gap analysis, so a gap of a competitor would not automatically be counted as a gap for Pop if it were
            to be an outside-of-scope gap.
          </p>

          <h3>Priorities in Implementation with AI</h3>
          <p>
            From this project, I understood how to better navigate a workflow that includes
            implementing with AI. The <mark className="hl">AI tools I utilized (Figma Make and Google AI Studio)
            limited the number of iterations I could implement at a time.</mark> To adapt, I made
            <mark className="hl"> recognized and prioritized larger-scale implementations based on impact on the 
            prototype&rsquo;s efficiency</mark> during usability testing while{" "}
            <mark className="hl">manually refining smaller and specific details afterwards.</mark> As a result, I was 
            able to utilize my prompting tokens while also being well informed of the prototype's abilities and limitations 
            through manual involvements of altering the code.
          </p>
        </section>
      </main>
    </div>
  );
}
