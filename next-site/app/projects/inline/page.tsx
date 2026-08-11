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

export default function PopByInlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Pop by inline — Designing Event Coordination Under Uncertainty"
        meta="Summer 2026 · 10 weeks · Product Design Intern"
        subtitle="A lightweight B2B2C consumer tool for planning everyday gatherings"
        imageLabel="Pop by inline · cover image"
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer">
          Under the terms of the sponsor&rsquo;s non-disclosure agreement, confidential and proprietary details remain covered by the
          agreement.
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
            I worked as a Product Design Intern,{" "}
            <mark className="hl">remote across a roughly 12-hour time-zone gap</mark> with the
            team based in Taiwan. I was the{" "}
            <mark className="hl">sole designer on one branch of the project</mark>, working
            alongside a parallel branch of the internship. My focus was to bring an outside perspective of the
            current market through competitive research, gap analysis, concept design, and
            usability testing.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Mapping the Competitive Landscape</h3>
          <p>
            I built a{" "}
            <mark className="hl">single competitive-analysis framework</mark> covering
            positioning, key features, strengths and weaknesses, business model, and end-to-end
            host and guest walkthroughs. I then applied this framework consistently across{" "}
            <mark className="hl">three event-coordination products</mark>, conducting audits
            that focused mainly on user flows of hosts and guests.
          </p>

          <h3>Gap Analysis with Category Discipline</h3>
          <p>
            After the analysis, I then cross-referenced each competitor&rsquo;s weaknesses against the team&rsquo;s{" "}
            <mark className="hl">eight solution features proposed</mark> prior by the parallel branch team in a structured table.
            For each competitor weakness, I verified if a proposed feature already addresses it,
            partially addresses it, or leaves it open.
            <br></br><br></br>
            From the set of remaining unaddressed weaknesses that became opportunity gaps, I was able to modify
            existing features and ideate additional features that would eventually <mark className="hl">determine the product's unique approach to solve
            the same problem as competitors, but more efficiently.</mark>
          </p>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Use Case Scenario</h3>
          <p>
            To narrow the scope to guide implementations and determine success, the scenario included
            <mark className="hl"> factors regarding uncertainty</mark>. After the scenario was determined in detail,
            I then went on to plan the user flow to determine where to implement the ideated features.
            <br></br><br></br>
            Due to the scale of the user flow and interactions needed within the small window, I utilized AI-assisted
            prototyping tools. Initially, I utilized Figma Make, but eventually <mark className="hl">swapped to Google AI Studio as
            its daily prompting credit limits were more well-suited</mark> to future usability testing sessions and iterations.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Four Rounds of Usability Testing</h3>
          <p>
            During the 8 usability test sessions, I served as the facilitator. First I would introduce the intent of the prototype by
            asking each tester warm-up questions before directing them to complete tasks while navigating the prototype's user flows
            and probing for feedback on those flows.
          </p>

          <h3>Addressing Insights and Feedback with Iterations</h3>
          <p>
            After every 2 - 3 sessions to ensure that feedback reflected a general rather than a singular voice, I would assess the feedback to identify
            iterations to implement into the prototype and tweak the usability protocol to probe for feedback on those iterations.
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
            implementing with AI. The AI tools I utilized (Figma Make and Google AI Studio)
            limited the number of iterations I could implement at a time. To adapt, I made
            sure to use the credits efficiently by{" "}
            <mark className="hl">recognizing and prioritizing larger-scale implementations based on their impact on the 
            prototype&rsquo;s efficiency</mark> during usability testing while{" "}
            <mark className="hl">manually refining smaller and specific details afterwards.</mark>
          </p>
        </section>
      </main>
    </div>
  );
}
