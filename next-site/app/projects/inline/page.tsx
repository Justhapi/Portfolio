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
   it verbatim. Same pattern as Frogslayer + ResearchHub. MP4 first —
   VP9-in-WebM decode support is inconsistent across browsers/engines,
   which was causing this cover to render blank or inconsistently. */
// Custom domain (kathleenli.tech) serves from the root — no prefix needed.
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
        title="Designing Features For An Event Coordination Uncertainties"
        meta="Summer 2026 · 10 weeks · Product Design Intern"
        subtitle="A lightweight B2B2C consumer tool for planning everyday gatherings"
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
            are excluded or generalized.</strong>
          </span>
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>

          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Handed off a set of must-have features for Pop,</strong>{" "}
              alongside research findings for justification, in a written product
              direction report for future development.
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
            Pop by inline is an early-stage consumer product exploration from inline, a
            Taipei restaurant-technology company whose core business is a B2B reservation,
            waitlist, and table-management platform serving thousands of restaurants across
            Asia-Pacific. Pop marks its step from pure B2B into B2B2C, and the brief centered
            on <mark className="hl">coordination design under uncertainty</mark>.
          </p>

          <h3>My Role</h3>
          <p>
            <strong>I worked remotely with inline&rsquo;s Product team in Taiwan</strong> as the{" "}
            <mark className="hl">sole designer on one branch</mark>, alongside a parallel
            branch of the internship. My focus was bringing an outside perspective on the market through competitive research, gap analysis, concept design, and
            usability testing, prioritizing the features Pop needed to succeed in it.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Mapping the Competitive Landscape</h3>
          <p>
            <strong>I applied one competitive-analysis framework</strong> across{" "}
            <mark className="hl">three event-coordination products</mark>, auditing the host
            and guest flows in each.
          </p>

          <h3>Gap Analysis with Category Discipline</h3>
          <p>
            <strong>I cross-referenced each competitor&rsquo;s weaknesses</strong> against the solution
            features the parallel branch had proposed, marking every weakness as already
            addressed, partially addressed, or left open.
            <br></br><br></br>
            The weaknesses left open became the{" "}
            <mark className="hl">opportunity gaps</mark>, the basis for features that solve the same problems as
            competitors by a more efficient route.
          </p>
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
          <h3>Prototyping</h3>
          <p>
            With a small window before testing, <strong>I built the flow&rsquo;s core interactivity</strong> with <mark className="hl">AI-assisted prototyping tools</mark>, starting in Figma Make, then moving to Google AI Studio,
            whose daily credit limits better suited the pace of iterating between test rounds.
          </p>
        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Facilitating Usability Testing</h3>
          <p>
            <strong>I facilitated</strong> <mark className="hl">8 usability sessions</mark>. Each opened with
            warm-up questions to frame the prototype, moved into tasks that walked the tester
            through its flows, then probed for feedback on each flow once completed.
          </p>

          <h3>Addressing Insights and Feedback with Iterations</h3>
          <p>
            I ran the sessions in <mark className="hl">sprints of 2 to 3</mark>, so feedback
            reflected a general rather than a singular voice. After each sprint <strong>I identified iterations to implement</strong> and tweaked the
            protocol to probe them.
            <br></br><br></br>
            Every sprint therefore tested a prototype that had already answered the last one.
            As the rounds progressed, feedback{" "}
            <mark className="hl">shifted from usability issues to feature suggestions</mark>{" "}
            for adapting the prototype to other use cases and continued usage.
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
    </div>
  );
}
