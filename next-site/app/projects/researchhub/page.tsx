import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "ResearchHub — Kathleen Li",
};

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
        meta="Spring 2026 · 9 weeks · 5 engineers + me · Design Engineer (sole designer)"
        subtitle="A redesigned student–faculty research platform, planned to ship summer 2026"
        imageLabel="ResearchHub · cover image"
      />

      <main id="main" className="case-body">
        {/* ───── Outcome ───── (moved to top: recruiters see outcome first) */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              <strong>Planned to ship fall 2026</strong>, so the redesign and expansion
              would go live for the fall semester&rsquo;s cohort of Purdue students and faculty.
            </p>
            <p className="outcome-callout__meta">
              Spring 2026 · Purdue Stack · design + build → fall ship
            </p>
          </aside>

          <p>
            The semester-long project resulted in a{" "}
            <mark className="hl">redesign and expansion of ResearchHub</mark>, a Purdue-specific research
            collaboration platform, to address its lack of a design system and to improve usability by Purdue students and staff.
            <br></br><br></br>
            Some of these features were directly requested by our client, Professor Reese from the
            statistics department. Others were constructed {" "}
            <mark className="hl"> around communication and project maintenance</mark>,
            needs surfaced through my own user research to address student-side needs.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            ResearchHub is an{" "}
            <mark className="hl">AI-assisted platform</mark> that streamlines Purdue students&rsquo;
            ability to discover and contribute to research projects, while also assisting
            professors in finding and onboarding the right students. Instead of replacing existing
            methods such as cold emails and departmental postings, it consolidates them into a
            single system where both parties are able to view the same information.
            <br></br><br></br>
            <mark className="hl">Prior projects on the platform focused solely on functionality</mark> in logins, project postings, and application 
            submissions. As a result, it contained base functionality but <mark className="hl">lacked a coherent design system and additional 
            features</mark> to address its intended users of students and staff.
          </p>

          <h3>The Problem</h3>
          <p>
            Currently at Purdue, research opportunities are{" "}
            <mark className="hl">plentiful but are also scattered across various sources </mark>such as department pages, faculty
            sites, listings, and word-of-mouth references. As a result, there is no consistent and cnetralized place for project discovery for students.
            <br></br><br></br>
            Professors, similarly, have{" "}
            <mark className="hl">no consistent workspace to coordinate and maintain project workload across their students</mark>,
            meaning there is no shared view of responsibilities, blocked tasks, or items that need
            follow-up. As a result, project progression can be inconsistent due to delays.
          </p>

          <h3>My Role</h3>
          <p>
            I was the <mark className="hl">sole UI designer and later a Design Engineer role</mark>
            in the 6-person Purdue Stack team with 5 full-stack developers. During the project, I <mark className="hl">determined all
            UX and UI decisions and also contributed front-end React code</mark> to maintain project progression.
            <br></br><br></br>
            While designing and coding, I also maintained weekly discussions with my teammates 
            to ensure alignment and feasibility of conceptualized features.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Understanding the Platform &amp; the Two User Groups Under Time Constraints</h3>
          <p>
            Due to the project being a continuation of prior work, I recognized the need to understand the platform's current state and its two user groups. The 
            <mark className="hl"> researching also needed to be completed within a span of 1.5 weeks</mark> for me to <mark className="hl">also ideate the redesign 
            and features</mark> in time for <mark className="hl">development of the implementations into the platform to be completed on time.</mark>
            <br></br><br></br>
            Considering these factors, I decided to{" "}
            <mark className="hl">utilize my existing access to the platform and the user groups to conduct a quick research sprint</mark>{" "}
            containing the following:
          </p>
          <ul className="focus-list">
            <li><strong>Audit of the Platform</strong></li>
            <li><strong>Interviews with Purdue students and staff</strong></li>
          </ul>

          <h3>Understanding the Platform's Current State</h3>
          <p>
            The <mark className="hl">core features (account creation and logins, project postings, and application submission) were functioning</mark>,
            however the overall experience focused solely on functionality. This was due to
            recognizing the state of the platform&rsquo;s UI as{" "}
            <mark className="hl">visually basic and obviously AI-generated</mark>.
            <br></br><br></br>
            I <mark className="hl">explored the platform as both a student and a professor</mark>,
            walking through each role&rsquo;s flow end-to-end while logging redundancies and
            opportunity gaps for new features. Focusing on friction rather than bugs, I found
            that the issues clustered into three categories:
          </p>

          <div className="audit-split">
            <figure className="audit-split__visual">
              <div className="image-slot">audit board · redundancy, trust, opportunity clusters</div>
            </figure>
            <div className="audit-split__text">
              <p>
                <strong>Redundancy and Technical Issues</strong> Although the platform has a mostly functioning base, there 
                are instances of elements with the same affordances being implemented in the same page or technical
                issues of data modifications not being saved that I either noted or reported to the development team to quickly resolve.
              </p>
              <p>
                <strong>Hinted but not fufilled features</strong> The platform introduces the existence of
                various features such as profiles, project listings, and instances of communication. However,
                those features have not been fully utilized, leaving gaps that need to be addressed.
              </p>
              <p>
                <strong>Design System Components Needed</strong> While exploring the platform, I was able to interact with and track
                various elements such as buttons, cards, and navigation labels that needed to be accounted for when constructing the 
                design system later on.
              </p>
            </div>
          </div>

          <h3>Understanding User Needs</h3>
          <p>
            Due to being informed of future meetings with our client, Professor Reese, that guaranteed insights for professor needs, I focused on 
            personally reaching out to interview for student needs. Specifically, I <mark className="hl">conducted 4 student interviews and 
            synthesized them through affinity diagramming.</mark>
          </p>
          <div className="audit-split">

            <div className="audit-split__text">
              <p>
                During the interviews, I learned about Purdue students' current experiences with 
                research projects by probbing for the following information:
              </p>
              <ul className="focus-list">
                <li><strong>Discovery of Research Project</strong></li>
                <li><strong>Process of Applying</strong></li>
                <li><strong>Progress Meeting Logistics</strong></li>
                <li><strong>Research Deliverables (If Applicable)</strong></li>
                <li><strong>Current State Views</strong></li>
              </ul>
            </div>
          </div>
          <p>
            The most significant insight was that the platform surfaced{" "}
            <mark className="hl">logistics well, but not <em>fit</em></mark>. Fit, however, is
            what students genuinely decided on, including factors such as supervision style, lab
            culture, and the actual nature of the work. A student could find ten projects
            matching their availability and coursework, yet still have no way to determine which
            lab they would thrive in. This insight consequently guided every decision that
            followed, including what information project listings needed to surface, what the
            student profile asked, and why communication features mattered as much as discovery
            features.
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
          <h3>From Existing Base to Handoff-Ready Prototypes</h3>
          <p>
            The design pass ran through two moves:{" "}
            <mark className="hl">refining the existing design system around Purdue&rsquo;s identity</mark>,
            then using prototypes as the primary explaining medium for developers.
          </p>

          <h3>Constructing a More Attractive Design System</h3>
          <p>
            Due to me designing and my teammates developing concurrently throughout the semester,
            constructing{" "}
            <mark className="hl">a complex design system completely from scratch was not realistic</mark>,
            as every week spent on foundational elements would be a week developers built without
            design guidance.
            <br></br><br></br>
            As a result, I worked within the existing base, refining the UI and components with a
            stronger focus on Purdue University&rsquo;s color scheme to highlight the
            platform&rsquo;s identity as a Purdue research tool. The refinement pass standardized
            spacing, typography hierarchy, button and card patterns, and state styling such as
            loading, empty, error, and success, so that student-facing and professor-facing flows,
            which present very different content, would still read as one coherent product.
            <br></br><br></br>
            The practical measure of the system&rsquo;s effectiveness was whether a developer
            could build a screen I had not explicitly mocked up and still have it land on-brand.
            As a result, components and patterns were documented to that standard.
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
            To ensure my teammates understood my redesigns, I{" "}
            <mark className="hl">constructed various prototypes in Figma</mark> that showcased my
            conceptualization of a full redesign of the platform, focusing on connected flows
            rather than isolated screens. This included a student moving from discovery through
            application, a professor moving from posting through applicant review, and the shared
            workspace both roles would inhabit.
            <br></br><br></br>
            Prototypes were able to provide the explanation that written documents could not.
            Walking a developer through a clickable flow surfaced important questions early on,
            such as what happens if no projects existed or where a particular status originated
            from, while the answers to those questions were still low-cost to address. Edge states
            such as empty, loading, and error were included in the prototype scope specifically
            because they are what developers would otherwise need to improvise under deadline
            pressure.
          </p>
        </section>

        {/* ───── Implementing ───── */}
        <section id="implementing" className="case-section">
          <h2>Implementing</h2>
          <h3>Stepping In to Ship the Platform on Time</h3>
          <p>
            Due to the tight timeline, in addition to academic workloads preventing some of my
            teammates from maintaining consistent progression, I also contributed through{" "}
            <mark className="hl">front-end React coding</mark> to help build the platform.
            <br></br><br></br>
            In practice, this meant implementing screens and components from my own Figma
            specifications, which turned out to be the fastest feedback loop I could have on my
            own design work. When a specification was ambiguous, I was the person who directly
            encountered the ambiguity. When a layout conflicted with the data the backend actually
            returned, I directly experienced the difficulty. As a result, building my own designs
            exposed the difference between{" "}
            <mark className="hl">&ldquo;specified&rdquo; and &ldquo;buildable&rdquo;</mark> in a
            way that no handoff meeting could.
            <br></br><br></br>
            The dynamic within the team also shifted, as design conversations became peer-to-peer
            problem-solving instead of one-way requests. I was able to ask questions such as
            &ldquo;would this be easier if the structure changed?&rdquo; with enough technical
            context for the question to be productive.
          </p>
          <figure>
            <div className="image-slot">spec vs shipped</div>
            <figcaption>
              A spec-vs-shipped side-by-side of a component I designed and then implemented in React.
            </figcaption>
          </figure>
        </section>

        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Design With the Cost of Building in Mind</h3>
          <p>
            Directly building my own ideas{" "}
            <mark className="hl">significantly modified how I factor in limitations</mark>.
            Sometimes I would half-angrily think &ldquo;Jeez, who is the designer who designed
            and thought of all these details&rdquo;, and the designer would be me. Working as
            both designer and engineer emphasized the need to ideate as a <em>partner</em> to
            development rather than simply as an <em>ideater or documenter</em>. As a result, I
            find that a design&rsquo;s worth includes the cost of building it, and the designer
            who understands that cost is able to make better-informed designs.
          </p>

          <h3>Working Well With Uneven User-Group Access</h3>
          <p>
            Due to needing conceptualization finalized early in the semester, I was{" "}
            <mark className="hl">unable to conduct user research on professors as in-depth as I did with students</mark>,
            since the two user groups offered very different levels of access. I had one professor
            (our client) readily available and an entire campus of students. Despite this
            limitation, I was still able to make design decisions addressing both user
            groups&rsquo; needs by effectively utilizing what I had immediate access to within the
            small window given. This included deep client conversations on the professor side,
            structured interviews and affinity synthesis on the student side, and the audit
            findings serving as a shared foundation for both.



            Designing and development 
            were happening concurrently throughout the semester, so every design decision needed to survive a feasibility
            conversation before being worth committing to. As a result, this kept my
            specifications pragmatic, since I designed with the understanding that someone
            (potentially me) needed to build it within the semester&rsquo;s timeframe.
          </p>
        </section>
      </main>
    </div>
  );
}