import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "ResearchHub — Kathleen Li",
};

/* Outcome leads so recruiters see results first. Process is broken
   into its three actual phases (Researching, Designing, Implementing)
   so the nav exposes the work rather than collapsing it under a
   single "Process" label — matches the structure used in Frogslayer. */
const SECTIONS = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "designing", label: "Designing" },
  { id: "implementing", label: "Implementing" },
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
            The semester-long project resulted in a <mark className="hl">redesign of ResearchHub</mark>, a Purdue-specific research collaboration platform, <mark className="hl">with new additional features,</mark>{" "}
            planned to ship in summer 2026 for students and faculty to use the
            following semester.
            <br></br><br></br>
            Some of the new features were <mark className="hl">directly requested by our client, Professor Reese</mark> (a professor from the stats department); others were made to <mark className="hl">address student needs, specifically around communication and maintenance</mark> — needs that surfaced through my own user research rather than the original brief.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            ResearchHub is an <mark className="hl">AI-assisted platform</mark> that streamlines <mark className="hl">Purdue students&rsquo; ability to discover and contribute to Purdue research projects</mark>, and assists <mark className="hl">professors in finding and onboarding the right students</mark>. Rather than replacing cold emails and departmental pages, it consolidates them into a single system where both parties see the same information.
          </p>

          <h3>The Problem</h3>
          <p>
            Currently at Purdue, research opportunities are <mark className="hl">plentiful but scattered</mark> across department pages, faculty sites, listings, and word-of-mouth. There is no canonical place to look.
            <br></br><br></br>
            Beyond discovery, the relationship itself lacks infrastructure. Students <mark className="hl">need an adequate method of connecting with professors</mark> during and after the research project — initial contact happens over agonized-over cold emails, and ongoing coordination scatters across email, chat, and shared docs.
            <br></br><br></br>
            Professors, conversely, <mark className="hl">have no consistent workspace to coordinate and maintain project workload</mark> across their students: no shared view of who is responsible for what, what&rsquo;s blocked, and what needs follow-up.
          </p>

          <h3>My Role</h3>
          <p>
            During the project I was the <mark className="hl">sole UI designer, later a Design Engineer,</mark> in the 6-person Purdue Stack team alongside 5 full-stack developers. I <mark className="hl">owned all UX and UI decisions and also wrote front-end React code</mark> during stagnated project progression.
            <br></br><br></br>
            While designing and coding for professor and student needs, I also <mark className="hl">maintained discussions with my teammates to ensure alignment and feasibility of conceptualized features.</mark> This wasn&rsquo;t a formality — designing and developing happened concurrently all semester, so every design decision I made had to survive a feasibility conversation before it was worth pixels. That constraint kept my specs pragmatic: I designed knowing someone (possibly me) had to build it within the semester.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Context</h3>
          <p>
            I inherited a functional but <mark className="hl">visually basic, AI-generated</mark> prototype. Core features existed — student signup, project postings, application submission — but the experience felt unfinished and inconsistent.
            <br></br><br></br>
            The real constraint was time: I needed to <mark className="hl">build a plan of redesign and feature implementation in a span of 1.5 weeks</mark> so my teammates could effectively further the platform&rsquo;s development over the semester. With developers ready to build from week two, conceptualization had to be finalized early — which shaped every research decision that followed.
          </p>

          <h3>Auditing the Current State of the Platform</h3>
          <p>
            I <mark className="hl">explored the platform as both a student and a professor</mark>, walking each role&rsquo;s flow end-to-end and <mark className="hl">logging pain points of redundancy and opportunity gaps for new features</mark>. I wasn&rsquo;t hunting bugs — I was hunting friction, which clustered into three categories:
            <br></br><br></br>
            <strong>Redundancy and inconsistency.</strong> Duplicate buttons performing the same action, visual styling that varied for no reason, and unclear information hierarchy across pages that should have felt related.
            <br></br><br></br>
            <strong>Broken trust moments.</strong> Saves that didn&rsquo;t visibly persist, application status that didn&rsquo;t clearly distinguish pending from accepted from rejected, and state changes (loading, success, error) that didn&rsquo;t register on screen.
            <br></br><br></br>
            <strong>Opportunity gaps.</strong> Profile information that was collected but never used, project listings that showed logistics but nothing about the professor or team, no communication channel inside the platform, and no shared workspace for accepted students — the gaps that later became the new features.
          </p>

          <h3>Understanding User Needs</h3>
          <p>
            I understood the professor&rsquo;s needs through our client, Professor Reese — but not the needs of students. So I <mark className="hl">conducted 4 student interviews and synthesized them with affinity diagramming.</mark>
            <br></br><br></br>
            The interviews covered how students discovered their research positions, what information drove their decision to join, what surprised them in the first weeks, and how they coordinated with their professor once inside a lab. Affinity diagramming clustered the observations into themes around discovery, evaluation, communication, and ongoing maintenance of the working relationship.
            <br></br><br></br>
            The breakthrough insight: the platform surfaced <mark className="hl">logistics</mark> well but not <mark className="hl"><em>fit</em></mark> — yet fit (supervision style, lab culture, what the work actually involves) was what students genuinely decided on. A student can find ten projects matching their availability and coursework and still have no way to know which lab they&rsquo;d thrive in. That insight became <mark className="hl">the north star for every decision after</mark>: what information project listings needed to surface, what the student profile asked, and why communication features mattered as much as discovery features.
          </p>
          <figure>
            <div className="image-slot">research synthesis</div>
            <figcaption>
              Affinity diagramming 4 student interviews into the core insight: students decide on fit, not logistics.
            </figcaption>
          </figure>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>
          <h3>Constructing a More Attractive Design System</h3>
          <p>
            With me designing and my teammates developing concurrently throughout the semester, building <mark className="hl">a complex design system completely from scratch was not realistic</mark> — every week I spent on foundations was a week developers built without guidance.
            <br></br><br></br>
            So I worked within the existing base, refining the UI and components with a <mark className="hl">stronger focus on Purdue University&rsquo;s color scheme</mark> to highlight the platform&rsquo;s identity as a Purdue research tool. The refinement pass standardized spacing, typography hierarchy, button and card patterns, and state styling (loading, empty, error, success) so that student-facing and professor-facing flows — which present very different content — still read as one coherent product.
            <br></br><br></br>
            The practical test of the system wasn&rsquo;t beauty; it was whether a developer could build a screen I hadn&rsquo;t explicitly mocked up and have it land on-brand. Components and patterns were documented to that standard.
          </p>
          <figure>
            <div className="image-slot">design system</div>
            <figcaption>
              Refining the existing component library around the Purdue palette to keep student and professor flows
              visually coherent.
            </figcaption>
          </figure>

          <h3>Prototyping to Describe to Developers Better</h3>
          <p>
            To ensure my teammates understood my redesigns, I <mark className="hl">constructed various prototypes in Figma</mark> that showcased my <mark className="hl">conceptualization of a full redesign of the platform</mark> — not isolated screens, but connected flows: a student moving from discovery through application, a professor moving from posting through applicant review, and the shared workspace both roles would inhabit.
            <br></br><br></br>
            Prototypes did the explaining that documents couldn&rsquo;t. Walking a developer through a clickable flow surfaced questions (&ldquo;what happens if there are no projects?&rdquo; &ldquo;where does this status come from?&rdquo;) early, while answers were still cheap. Edge states — empty, loading, error — were part of the prototype scope precisely because they&rsquo;re what developers otherwise improvise under deadline.
          </p>
        </section>

        {/* ───── Implementing ───── */}
        <section id="implementing" className="case-section">
          <h2>Implementing</h2>
          <h3>Stepping In to Ship the Platform on Time</h3>
          <p>
            Due to the <mark className="hl">tight timeline, in addition to academic workload causing some of my teammates to be unable to meet consistent progression</mark>, I also contributed through <mark className="hl">front-end React coding</mark> to help build the platform.
            <br></br><br></br>
            In practice this meant implementing screens and components from my own Figma specs — which turned out to be the fastest possible feedback loop on my own design work. When a spec was ambiguous, I was the one who hit the ambiguity. When a layout fought the data the backend actually returned, I felt the fight directly. Building my own designs exposed the difference between <mark className="hl">&ldquo;specified&rdquo; and &ldquo;buildable&rdquo;</mark> in a way no handoff meeting could.
            <br></br><br></br>
            It also changed the team dynamic: design conversations became problem-solving between peers rather than requests across a fence. I could ask &ldquo;would this be easier if the structure changed?&rdquo; with enough technical context for the question to be useful.
          </p>
          <figure>
            <div className="image-slot">spec vs shipped</div>
            <figcaption>
              A spec-vs-shipped side-by-side of a component I designed and then implemented in React.
            </figcaption>
          </figure>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <p>
            <mark className="hl">Directly building my own ideas has definitely modified my factoring of limitations.</mark> Sometimes I would half-angrily think, &ldquo;Jeez, who is the designer who designed and thought of all these (details)&rdquo; — and the designer was me. Working as both designer and engineer emphasized the need to ideate as a <em>partner</em> instead of simply an <em>ideater or documenter</em>: a design&rsquo;s worth includes the cost of building it, and the designer who knows that cost makes better designs.
            <br></br><br></br>
            Due to needing conceptualization finalized early in the semester, I was <mark className="hl">unable to conduct user research on professors as in-depth as I did with students</mark>, since the two user groups offered very different access — I had one professor (our client) readily available and an entire campus of students. Despite that, I was still able to make design decisions addressing both user groups&rsquo; needs by <mark className="hl">effectively utilizing what I had immediate access to within the small window given</mark>: deep client conversations on the professor side, structured interviews and affinity synthesis on the student side, and the audit findings as a shared foundation for both.
          </p>
        </section>
      </main>
    </div>
  );
}