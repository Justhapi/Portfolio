import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import ResearchCarousel from "@/components/ResearchCarousel";

/* Case-study images are co-located with the route — imported as ES
   modules so Webpack bundles them into /_next/static/media/ at build
   time with hashed filenames. Same pattern as Frogslayer + JT. */
import auditImg from "./images/audit.webp";
import interviewNotesImg from "./images/interview_notes.webp";
import affinityDiagrammingImg from "./images/affinity_diagraming.png";
import wireframingImg from "./images/wireframing.webp.png";
import referencesImg from "./images/references.png";
import sketchesImg from "./images/sketches.png";
import colorSchemeImg from "./images/color_scheme.webp";

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
        subtitle="A redesigned student–faculty research platform, planned to ship fall 2026"
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
            sites, listings, and word-of-mouth references. As a result, there is no consistent and centralized place for project discovery for students.
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
            Due to the project being a continuation of prior work, I recognized the need to
            understand the platform&rsquo;s current state and its two user groups. Because my
            teammates needed to{" "}
            <mark className="hl">begin development on schedule</mark>, the research phase needed
            to fit within a <mark className="hl">1.5-week sprint</mark>.
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
            <div className="audit-split__visual">
              <ZoomableImage
                src={auditImg.src}
                alt="Platform audit board — walking through student and professor flows end-to-end, logging redundancies, broken trust moments, and opportunity gaps."
                aspectRatio={6214 / 5021}
              />
            </div>
            <div className="audit-split__text">
              <p>
                <strong>Redundancy and Technical Issues.</strong> Although the platform has a
                mostly functioning base, there are instances of elements with the same
                affordances being implemented on the same page, along with technical issues such
                as data modifications not being saved. I either noted these findings or reported
                them to the development team for quick resolution.
              </p>
              <p>
                <strong>Hinted but not fulfilled features</strong> The platform introduces the existence of
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
            <div className="audit-split__visual">
              <ZoomableImage
                src={interviewNotesImg.src}
                alt="Session notes from the 4 student interviews — capturing responses across the five probing categories."
                aspectRatio={5806 / 3812}
              />
            </div>
            <div className="audit-split__text">
              <p>
                During the interviews, I learned about Purdue students&rsquo; current experiences
                with research projects by probing for the following information:
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
          <div className="audit-split">
            <div className="audit-split__visual">
              <ZoomableImage
                src={affinityDiagrammingImg.src}
                alt="Cross-interview affinity diagram — clustering 4 student interview observations into themes around discovery, evaluation, communication, and ongoing maintenance."
                aspectRatio={9366 / 6144}
                caption={
                  <>
                    Affinity diagramming the 4 student interviews into themes around intention
                    clarity, communication features, and consistent meeting rhythms.
                  </>
                }
              />
            </div>
            <div className="audit-split__text">
              <p>
                After finishing all the interviews, I then synthesized the findings through
                affinity diagramming, allowing me to cluster the findings into the following
                themes:
              </p>
              <ul className="focus-list">
                <li><strong>Communication</strong></li>
                <li><strong>Maintenance</strong></li>
                <li><strong>Project Details</strong></li>
              </ul>
              <p>
                From the synthesized findings, I was able to recognize the main student needs
                that the new features needed to address, specifically regarding{" "}
                <mark className="hl">ease of communication with professors and project maintenance of files organization</mark>.
              </p>
            </div>
          </div>

          <p>
            On the professor side, I was later informed that Professor Reese&rsquo;s schedule had unexpectedly prevented the 
            meeting for in-depth professor-side insights. 
            <br></br><br></br>
            Within the sprint window, I decided to{" "}
            <mark className="hl">base the professor needs on the features Professor Reese had requested during an earlier meeting</mark>{" "}
            with my project lead. I then{" "}
            <mark className="hl">filtered through those requests, continuing development of only features that served both user groups.</mark>
          </p>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>
          <h3>From Existing Base to Handoff-Ready Prototypes</h3>
          <p>
            The design process ran through brainstorming to handing off three stages:
          </p>
          <ul className="focus-list">
            <li><strong>Identifying UI patterns from familiar platforms</strong></li>
            <li><strong>Ideating UI and Design System</strong></li>
            <li><strong>Wireframing for development handoff</strong></li>
          </ul>

          <h3>Referencing UI Patterns from Familiar Platforms</h3>
          <p>
            Due to students frequently mentioning platforms such as the Microsoft suite, Outlook,
            and Gmail as the tools they currently used to communicate with professors, I decided
            to{" "} <mark className="hl">reference the same platforms when designing the UI for ResearchHub</mark>.
            <br></br><br></br>
            As a result, <mark className="hl">interaction patterns from those platforms were utilized as the base design </mark>
            for the platform components with <mark className="hl">modifications to better fit the platform's focus on
            organization through projects instead of individuals.</mark>
          </p>
          <ZoomableImage
            src={referencesImg.src}
            alt="Screenshots of Microsoft Suite, Outlook, and Gmail — the familiar communication platforms students referenced as tools they already used with professors."
            aspectRatio={8634 / 6674}
            caption={
              <>
                Screenshots of Microsoft Suite, Outlook, and Gmail, referenced as the familiar
                communication platforms students already used with professors.
              </>
            }
          />

          <h3>Ideating UI and Design System</h3>
          <p>
            After identifying the reference platform UI patterns, I moved on to sketching ideas
            for the platform&rsquo;s features and screens to explore possibilities quickly.
            During these sketching sessions, I{" "}
            <mark className="hl">showed the sketches to my teammates to discuss the plausibility of developing each page&rsquo;s components</mark>,
            while also gathering outside feedback in parallel.
          </p>
          <ZoomableImage
            src={sketchesImg.src}
            alt="My sketches for ResearchHub features and screens, developed alongside plausibility discussions with the development team."
            aspectRatio={5333 / 2131}
            caption={
              <>
                My sketches for ResearchHub features and screens, developed alongside
                plausibility discussions with the development team.
              </>
            }
          />
          <div className="audit-split">
            <div className="audit-split__visual">
              <ZoomableImage
                src={colorSchemeImg.src}
                alt="ResearchHub color scheme anchored on Purdue University's identity — refined component palette applied across student and professor flows."
                aspectRatio={2568 / 2406}
              />
            </div>
            <div className="audit-split__text">
              <p>
                My <mark className="hl">time spent on the design system needed to be short </mark>as the platform being 
                utilizable next semester was the project's main priority, <mark className="hl">prompting more
                focus on the necessary feature's development.</mark>
              </p>
              <p>
                As a result, I focused instead on refining the existing UI and components to be <mark className="hl">more
                reminiscent of Purdue University through{" "}
                color scheme and text</mark> that would highlight the
                platform&rsquo;s <mark className="hl">identity as primarily a Purdue research platform.</mark>
              </p>
            </div>
          </div>

          <h3>Prototyping to Describe to Developers Better</h3>
          <p>
            To keep development on schedule, I{" "}
            <mark className="hl">wireframed the platform in Figma while concurrently discussing implementation plausibility with my teammates and gathering outside feedback on the wireframes</mark>{" "}
            for both feasibility and usability.
            <br></br><br></br>
            Since I needed to wireframe both the student and professor flows in that same window,
            I{" "}
            <mark className="hl">utilized Figma Make to keep pages shared by both accounts consistent in design</mark>.
          </p>
          <ZoomableImage
            src={wireframingImg.src}
            alt="Wireframes for ResearchHub developed in Figma concurrently with plausibility discussions and outside feedback."
            aspectRatio={6649 / 3779}
            caption={
              <>
                Wireframes for ResearchHub developed in Figma concurrently with plausibility
                discussions with the development team and outside feedback rounds.
              </>
            }
          />
          <p>
            The final Figma prototype showcased the full redesign as connected flows that were
            applicable to real-world use cases of the platform that include the following:
          </p>
          <ul className="focus-list">
            <li><strong>Students logging in to just update task progression</strong></li>
            <li><strong>Professors maintaining and organizing contents of each project</strong></li>
            <li><strong>Communication between students and professors</strong></li>
          </ul>
          <ResearchCarousel
            slides={[
              {
                key: "student-tasks",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Student Flow</span>
                      <h4 className="rq-heading">Students Updating Task Progression</h4>
                      <p className="rq-lead">
                        A quick log-in flow for students returning to the platform to update
                        ongoing project progress, without needing to navigate deep into the
                        platform first.
                      </p>
                      <p className="rq-findings-lead"><strong>Key features and design decisions:</strong></p>
                      <ul className="rq-findings-list">
                        <li>[Feature — design decision]</li>
                        <li>[Feature — design decision]</li>
                        <li>[Feature — design decision]</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <div className="image-slot">student task-progression pages</div>
                    </div>
                  </div>
                ),
              },
              {
                key: "professor-projects",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Professor Flow</span>
                      <h4 className="rq-heading">Professors Maintaining Project Contents</h4>
                      <p className="rq-lead">
                        A workspace for professors to organize and track project materials,
                        deliverables, and student progress across their labs from a single view.
                      </p>
                      <p className="rq-findings-lead"><strong>Key features and design decisions:</strong></p>
                      <ul className="rq-findings-list">
                        <li>[Feature — design decision]</li>
                        <li>[Feature — design decision]</li>
                        <li>[Feature — design decision]</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <div className="image-slot">professor project-maintenance pages</div>
                    </div>
                  </div>
                ),
              },
              {
                key: "communication",
                content: (
                  <div className="rq-block">
                    <div className="rq-block__body">
                      <span className="rq-method-chip">Cross-Role</span>
                      <h4 className="rq-heading">Communication Between Students and Professors</h4>
                      <p className="rq-lead">
                        Shared communication channels within the platform, replacing the
                        scattered email, chat, and shared-doc workflow that both roles previously
                        relied on.
                      </p>
                      <p className="rq-findings-lead"><strong>Key features and design decisions:</strong></p>
                      <ul className="rq-findings-list">
                        <li>[Feature — design decision]</li>
                        <li>[Feature — design decision]</li>
                        <li>[Feature — design decision]</li>
                      </ul>
                    </div>
                    <div className="rq-block__visual">
                      <div className="image-slot">shared communication pages</div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* ───── Implementing ───── */}
        <section id="implementing" className="case-section">
          <h2>Implementing</h2>
          <h3>Stepping In to Ship the Platform on Time</h3>
          <p>
            When academic workloads slowed some teammates&rsquo; progression, I also contributed
            through{" "}
            <mark className="hl">front-end React coding</mark> to help build the platform on
            time.
            <br></br><br></br>
            The dynamic within the team also shifted, as design conversations became peer-to-peer
            problem-solving instead of one-way requests. I was able to ask questions such as
            &ldquo;would this be easier if the structure changed?&rdquo; with enough technical
            context for the question to be productive.
          </p>
        </section>

        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Design With the Cost of Building in Mind</h3>
          <p>
            <mark className="hl"> Directly building my own ideas{" "}
            significantly modified how I factor in limitations</mark>.
            Sometimes I would <mark className="hl">code while half-angrily thinking &ldquo;Jeez, who is the designer who designed
            and requested all of these details&rdquo;.</mark> Working as both designer and engineer emphasized the need to ideate as 
            a <em>partner</em> to development rather than simply as an <em>ideater or documenter</em>. 
            <br></br><br></br>
            From this project, I understand that a <mark className="hl">high-quality design&rsquo;s demands includes research and the building cost,</mark> and that designer
            who <mark className="hl">accounts for the cost is able to ensure that the well-designed handoff will be also fully utilized.</mark>
          </p>

          <h3>Adapting to Uneven User-Group Access</h3>
          <p>
            Due to needing conceptualization finalized early in the semester, I was{" "}
            <mark className="hl">unable to conduct user research on professors as in-depth as I did with students</mark>,
            since the two user groups offered very different levels of access. I had only one
            professor (our client) available and an entire campus of students readily available.
            As a result, I prioritized the features Professor Reese had requested based on how
            those features would also serve students.
            <br></br><br></br>
            From adapting to this differing-access obstacle, I now recognize that working
            across uneven user-group research requires <mark className="hl">prioritizing the less-accessible group&rsquo;s
            requests through a lens of how the same solution can also serve the more-accessible
            group</mark> to ensure that I filtered the applicable ideas from the impractical ideas.
          </p>
        </section>
      </main>
    </div>
  );
}