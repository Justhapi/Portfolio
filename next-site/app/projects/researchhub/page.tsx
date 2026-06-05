import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "ResearchHub — Kathleen Li",
};

/* Outcome leads so recruiters see results first. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "process", label: "Process" },
  { id: "takeaways", label: "Takeaways" },
];

export default function ResearchHubCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="ResearchHub — Connecting Students with Faculty Research"
        meta="Spring 2026 · 16 weeks · 5 engineers + me · Design Engineer (sole designer)"
        subtitle="A redesigned student–faculty research platform, planned to ship summer 2026"
        imageLabel="ResearchHub · cover image"
      />

      <main id="main" className="case-body">
        {/* ───── Outcome ───── (moved to top: recruiters see outcome first) */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            The semester-long project resulted in a <mark className="hl">redesign of ResearchHub</mark>, a Purdue-specific collaboration research platform, <mark className="hl">with new additional features,</mark>{" "}
            planned to ship in summer 2026 for students and faculty to utilize the
            following semester.
            <br></br><br></br>
            Although some of the new features were <mark className="hl">directly requested by our client Professor Reese,</mark> a professor from the stats
             department, other features were made to <mark className="hl">address student needs, specifically regarding communication and maintenance.</mark>
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            ResearchHub is an <mark className="hl">AI-assisted platform</mark> that streamlines <mark className="hl">Purdue students' ability to discover and contribute</mark> to Purdue
            research projects and assists <mark className="hl">professors to find and onboard the right students.</mark>
          </p>

          <h3>The Problem</h3>
          <p>
            Currently at Purdue, research opportunities are <mark className="hl">plentiful but scattered across sources</mark> such as department
            pages, faculty sites, listings, and word-of-mouth.
            <br></br><br></br>
            Students<mark className="hl"> require an adequate method of connecting with professors </mark> 
            during and after the research project. 
            <br></br><br></br>
            Professors <mark className="hl">have no consistent
            workspace to coordinate and maintain</mark> project workload to their students.
          </p>

          <h3>My Role</h3>
          <p>
            During the project I was the{" "}<mark className="hl">sole UI designer, later a Design Engineer,</mark> in the 6 person Purdue Stack team with 5 full stack developers where I <mark className="hl">owned all UX and UI
            decisions and also wrote front-end React code</mark> during stagnated project progression.
            <br></br><br></br>
            While designing and coding for professor and student needs, I also <mark className="hl">maintained 
            discussions with my teammates to ensure alignment and feasibility of conceptualized features.</mark>
          </p>
        </section>

        {/* ───── Process ───── */}
        <section id="process" className="case-section">
          <h2>Process</h2>
          <h3>Context</h3>
          <p>
            I inherited a functional but <mark className="hl">visually basic AI-generated</mark> prototype
            that I needed to <mark className="hl">build a plan</mark> of redesign and feature implementation <mark className="hl">in a span of 1.5 weeks</mark> for my teammates to effectively further the platform's development over the semester.
          </p>
          <h3>Auditing the Current State of Platform</h3>
          <p>
            I <mark className="hl">explored the platform</mark> as both a student and professor, <mark className="hl">logging pain points of redundancy and opportunity gaps for new features.</mark>
          </p>

          <h3>Understanding User Needs</h3>
          <p>
            Due to understanding the professor's needs through Professor Reese but not the needs of students, I <mark className="hl">conducted{" "}
            4 student interviews and synthesized them with affinity diagramming.</mark>
            <br></br><br></br>
            The breakthrough insight: the platform surfaced logistics well but not <em>fit</em>{" "}
            — yet fit (supervision style, lab culture, what the work actually involves) was what students genuinely
            decided on. That insight became the north star for every decision after.
          </p>
          <figure>
            <div className="image-slot">research synthesis</div>
            <figcaption>
              Affinity diagramming 4 student interviews into the core insight: students decide on fit, not logistics.
            </figcaption>
          </figure>

          <h3>Constructing a More Attractive Design System</h3>
          <p>
            With the team designing and developing in one semester, building <mark className="hl">a design system completely from scratch
            was not realistic</mark>. As a result, I worked within the existing base, refining the UI and components with a
            <mark className="hl"> stronger focus on Purdue University's color scheme</mark> to highlight the platform's focus on Purdue research.
          </p>
          <figure>
            <div className="image-slot">design system</div>
            <figcaption>
              Refining the existing component library to keep student and professor flows visually coherent.
            </figcaption>
          </figure>

          <h3>Prototyping to Describe to Developers Better</h3>
          <p>
            To ensure my teammates understand my redesigns, I <mark className="hl">constructed various prototypes in Figma </mark>
            that showcased my <mark className="hl">conceptualization of a full redesign of the platform.</mark>
          </p>

          <h3>Implementing the Designs</h3>
          <p>
            Due to the <mark className="hl">tight timeline in addition to academic workload causing some of my teammates not being able to meet consistent progression,</mark> I also contributed through front-end React coding to help build the platform.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            <mark className="hl">Directly building my own ideas has definitely modified my factoring of
            limitations.</mark> Sometimes I would half-angrily think, "Jeez, who is the designer who designed and thought of all these (details)". Working as both designer and engineer has emphasized to me
            the need to ideate as <em>partner</em> instead of simply an <em>ideater or documenter</em>.
            <br></br><br></br>
            Due to needing conceptualization finalized rather early into the semester, I was <mark className="hl">unable to conduct user research on professors as in-depth as I did with students </mark>
            due to differing user group access. Despite that, I was still able to make design decisions that address both user group needs through <mark className="hl">effectively utilizing what I had immediate access to within the small window frame given.</mark>
          </p>
        </section>
      </main>
    </div>
  );
}