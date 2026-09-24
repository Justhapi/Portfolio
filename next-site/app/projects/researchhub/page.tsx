import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import ResearchCarousel from "@/components/ResearchCarousel";
import CyclingImage from "@/components/CyclingImage";

/* Case-study images are co-located with the route — imported as ES
   modules so Webpack bundles them into /_next/static/media/ at build
   time with hashed filenames. Same pattern as Frogslayer + JT. */
import auditImg from "./images/audit.webp";
import interviewNotesImg from "./images/interview_notes.webp";
import affinityDiagrammingImg from "./images/affinity_diagraming.webp";
import referencesImg from "./images/references.webp";
import sketchesImg from "./images/sketches.webp";
import colorSchemeImg from "./images/color_scheme.webp";
/* Finalized page visuals shown in the Prototyping carousel. */
import homePage from "./images/Home_Page.webp";
import messagesPage from "./images/Messages_Page.webp";
import projectPage1 from "./images/Project_Page_1.webp";
import projectPage2 from "./images/Project_Page_2.webp";
import projectPage3 from "./images/Project_Page_3.webp";
import projectPage4 from "./images/Project_Page_4.webp";
import projectPage5 from "./images/Project_Page_5.webp";
/* Wide-strip iteration-progression visuals for the Prototyping section. */
import projectDashboardProgression from "./images/Project_Dashboard_Progression.webp";

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

/* Cover video — served from /public/img/cover so the static export
   pipeline copies it verbatim to /out. Custom domain (kathleenli.tech)
   serves from the root, so BASE_PATH is empty. MP4 first — VP9-in-WebM
   decode support is inconsistent across browsers/engines, which was
   causing this cover to render blank or inconsistently. */
const BASE_PATH = "";
const COVER_VIDEO = {
  mp4: `${BASE_PATH}/img/cover/ResearchHub.mp4`,
  webm: `${BASE_PATH}/img/cover/ResearchHub.webm`,
};
const COVER_POSTER = `${BASE_PATH}/img/cover/ResearchHub-poster.webp`;

export default function ResearchHubCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Expanding Upon a Research Platform Connecting Students with Faculty Research"
        meta="Spring 2026 · 6 weeks · Design Engineer"
        subtitle="A redesigned student–faculty research platform for a campus research community"
        imageLabel="ResearchHub · cover animation"
        heroVideoSrc={COVER_VIDEO}
        heroVideoPoster={COVER_POSTER}
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
            The 6-week project delivered a{" "}
            <mark className="hl">redesign and expansion of ResearchHub</mark>, a Purdue-specific
            research collaboration platform, addressing its lack of a design system and improving
            usability for Purdue students and staff.
            <br></br><br></br>
            Some features were requested directly by our client, Professor Reese of the statistics
            department. Others were built{" "}
            <mark className="hl">around communication and project maintenance</mark>, student-side needs surfaced
            through my own research.
          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            ResearchHub is an <mark className="hl">AI-assisted platform</mark> that streamlines
            Purdue students&rsquo; ability to discover and contribute to research projects, while
            helping professors find and onboard the right students. Rather than replacing cold
            emails and departmental postings, it consolidates them into one system where both
            parties see the same information.
            <br></br><br></br>
            Prior work on the platform{" "}
            <mark className="hl">focused solely on delivering functionality</mark>: logins, postings, applications. It left a working base with no coherent design system and few
            of the features its users needed.
          </p>

          <h3>The Problem</h3>
          <p>
            Research opportunities at Purdue are{" "}
            <mark className="hl">plentiful but scattered</mark> across department pages, faculty
            sites, listings, and word-of-mouth, so students have no centralized place to discover
            projects.
            <br></br><br></br>
            Professors have{" "}
            <mark className="hl">no shared workspace to coordinate project workload</mark>, so
            there is no common view of responsibilities, blocked tasks, or items needing follow-up, and progression stalls.
          </p>

          <h3>My Role</h3>
          <p>
            I was the{" "}
            <mark className="hl">sole UI designer, later also Design Engineer</mark>, on a
            6-person Purdue Stack team with 5 full-stack developers. <strong>I determined all UX and UI decisions</strong> and contributed front-end React.
            <br></br><br></br>
            I held weekly discussions with my teammates to keep conceptualized features aligned
            and feasible.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Auditing the Platform and Its Two User Groups</h3>
          <p>
            As a continuation of prior work, I needed to understand the platform&rsquo;s current
            state and its two user groups, and my teammates needed to{" "}
            <mark className="hl">begin development on schedule</mark>, so research had to fit a{" "}
            <mark className="hl">1.5-week sprint</mark>.
            <br></br><br></br>
            I used my existing access to the platform and both user groups to run a quick sprint
            containing:
          </p>
          <ul className="focus-list">
            <li><strong>Audit of the Platform</strong></li>
            <li><strong>Interviews with Purdue students and staff</strong></li>
          </ul>

          <h3>The Platform Audit</h3>
          <p>
            The core features (account creation, logins, postings, applications) were
            functioning, but the experience served function alone. The UI was{" "}
            <mark className="hl">visually basic and obviously AI-generated</mark>.
            <br></br><br></br>
            <strong>I explored the platform</strong>{" "}
            <mark className="hl">as both a student and a professor</mark>, walking each
            role&rsquo;s flow end-to-end and logging redundancies and opportunity gaps. Focusing
            on friction rather than bugs, the issues clustered into three categories:
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
                <strong>Redundancy and Technical Issues.</strong> Elements with identical
                affordances appeared on the same page, and some data modifications were not
                saved. I either noted these or reported them to the development team for quick
                resolution.
              </p>
              <p>
                <strong>Hinted-at but Unfulfilled Features.</strong> Profiles, project listings,
                and communication all existed in name but were never fully built out, leaving
                gaps to address.
              </p>
              <p>
                <strong>Design System Components Needed.</strong> Buttons, cards, and navigation
                labels all needed accounting for when the design system came later.
              </p>
            </div>
          </div>

          <h3>Understanding User Needs</h3>
          <p>
            Upcoming meetings with Professor Reese were expected to cover professor needs, so I
            focused on reaching students:{" "}
            <strong>I conducted 4 student interviews</strong> and synthesized them
            through affinity diagramming.
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
                I probed each student&rsquo;s current experience with research projects across:
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
                alt="Cross-interview affinity diagram — clustering 4 student interview observations into three themes: Communication, Maintenance, and Project Details."
                aspectRatio={9366 / 6144}
                caption={
                  <>
                    Affinity diagramming the 4 student interviews into themes around
                    Communication, Maintenance, and Project Details.
                  </>
                }
              />
            </div>
            <div className="audit-split__text">
              <p>
                Affinity diagramming clustered the findings into three themes:
              </p>
              <ul className="focus-list">
                <li><strong>Communication</strong></li>
                <li><strong>Maintenance</strong></li>
                <li><strong>Project Details</strong></li>
              </ul>
              <p>
                From these I identified the main student needs the new features had to address:{" "}
                <mark className="hl">communication with professors, and file organization</mark>.
              </p>
            </div>
          </div>
          <p>
            On the professor side, Professor Reese&rsquo;s schedule unexpectedly prevented the
            meeting for in-depth insights.
            <br></br><br></br>
            Within the sprint window, <strong>I based professor needs</strong> on the features he had requested at an earlier
            meeting with my project lead, and{" "}
            <mark className="hl">prioritized them by how often students would interact with each</mark>, so the highest-student-impact requests
            would ship first even under the tight timeline.
          </p>

          <h3>The Core Features Professor Reese Requested</h3>
          <p>
            From the earlier meeting notes, in prioritization order:
          </p>
          <ul className="focus-list">
            <li>
              <strong>Individual project workspace</strong> to centralize tracking of details,
              team, progress, timeline, and optional milestones.{" "}
              <mark className="hl">Prioritized first</mark>, as this is the primary interface
              students would return to most often.
            </li>
            <li>
              <strong>AI review tests</strong> to verify that students had actually read the
              assigned research documents. <mark className="hl">Prioritized second</mark>, as
              students would encounter it on a per-document basis throughout the project.
            </li>
            <li>
              <strong>The ability to &ldquo;finalize&rdquo; projects</strong>, and to check
              whether the students on the project wanted referral letters at that point.{" "}
              <mark className="hl">Prioritized last</mark>, since the interaction only triggers
              at a project&rsquo;s end.
            </li>
          </ul>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>
          <h3>From Existing Base to Handoff-Ready Prototypes</h3>
          <p>
            The design process ran in three stages:
          </p>
          <ul className="focus-list">
            <li><strong>Identifying UI patterns from familiar platforms</strong></li>
            <li><strong>Refining UI around Purdue identity</strong></li>
            <li><strong>Wireframing for development handoff</strong></li>
          </ul>

          <h3>Referencing UI Patterns from Familiar Platforms</h3>
          <p>
            Students frequently named the Microsoft suite, Outlook, and Gmail as the tools they
            already used with professors, so I{" "}
            <mark className="hl">referenced those same platforms</mark> when designing
            ResearchHub&rsquo;s UI.
            <br></br><br></br>
            Their interaction patterns became the base for the platform&rsquo;s components,
            modified to fit ResearchHub&rsquo;s{" "}
            <mark className="hl">organization by project rather than by individual</mark>.
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

          <h3>Refining UI Around Purdue Identity</h3>
          <p>
            <strong>I moved on to sketching features and screens</strong> to explore possibilities
            quickly,{" "}
            <mark className="hl">showing sketches to my teammates</mark> to check each
            page&rsquo;s development plausibility while gathering outside feedback in parallel.
          </p>
          <ZoomableImage
            src={sketchesImg.src}
            alt="Hand-drawn ResearchHub feature and screen sketches on paper, spanning multiple pages of the student and professor flows."
            aspectRatio={5333 / 2131}
            caption={
              <>
                My sketches for ResearchHub features and screens, developed alongside
                plausibility discussions with the development team.
              </>
            }
          />
          <div className="audit-split audit-split--compact">
            <div className="audit-split__visual">
              <ZoomableImage
                src={colorSchemeImg.src}
                alt="ResearchHub color scheme anchored on Purdue University's identity — refined component palette applied across student and professor flows."
                aspectRatio={2568 / 2406}
              />
            </div>
            <div className="audit-split__text">
              <p>
                Shipping next semester was the priority, so I{" "}
                <mark className="hl">deliberately kept the design system work minimal</mark> and
                let the ship-critical features take precedence.
              </p>
              <p>
                Instead I refined the existing UI and components to be{" "}
                <mark className="hl">more reminiscent of Purdue</mark> through color and type,
                reinforcing its identity as a Purdue research platform.
              </p>
            </div>
          </div>

          <h3>Prototyping for Developer Handoff</h3>
          <p>
            To keep development on schedule,{" "}
            <strong>I wireframed in Figma</strong> while discussing implementation plausibility{" "}
            with my teammates, gathering outside feedback on both
            <mark className="hl">feasibility and usability</mark>.
          </p>
          <ZoomableImage
            src={projectDashboardProgression.src}
            alt="Project dashboard modification progression — successive iterations of the ResearchHub project dashboard laid out side-by-side."
            aspectRatio={6742 / 2059}
            caption={
              <>
                Iterations of the ResearchHub project dashboard in progression order, addressing
                feedback across each round on hierarchy and navigation clarity.
              </>
            }
          />

          <p>
            Because both student and professor flows had to be wireframed in the same window, I
            used <mark className="hl">Figma Make to keep shared pages consistent</mark> without
            re-drawing the same components across two flows.
          </p>
          <p>
            The final prototype showed the redesign as connected flows covering real use cases:
          </p>
          <ul className="focus-list">
            <li><strong>Students logging in to just update task progression</strong></li>
            <li><strong>Communication between students and professors</strong></li>
            <li><strong>Professors maintaining and organizing contents of each project</strong></li>
          </ul>
          <ResearchCarousel
            slides={[
              {
                key: "student-tasks",
                label: "General Dashboard",
                content: (
                  <div className="rq-block rq-block--stacked-findings">
                    <div className="rq-block__body">
                      <h4 className="rq-heading">General Dashboard</h4>
                      <p className="rq-lead">
                        The dashboard was designed to <mark className="hl">centralize a routine day&rsquo;s needs</mark>, whether a student updating task
                        progression or sending a message, or a professor assessing how their
                        students are progressing.
                      </p>
                    </div>
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={homePage.src}
                        alt="Student home page — a quick log-in landing view for updating ongoing project progress."
                        aspectRatio={1566 / 823}
                        noDrag
                      />
                    </div>
                    <div className="rq-block__findings">
                      <p className="rq-findings-lead"><strong>Key features:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Mini Project Dashboard that provides access to tasks and to other projects</li>
                        <li>Buttons to access specific project dashboards and direct messages within one click.</li>
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                key: "communication",
                label: "Communication",
                content: (
                  <div className="rq-block rq-block--stacked-findings">
                    <div className="rq-block__body">
                      <h4 className="rq-heading">Communication</h4>
                      <p className="rq-lead">
                        The messages page was designed to provide{" "}
                        <mark className="hl">organization for communication</mark> between professors, research
                        assistants, and students, in a structure already familiar to them.
                      </p>
                    </div>
                    <div className="rq-block__visual">
                      <ZoomableImage
                        src={messagesPage.src}
                        alt="Messages page — the shared communication channel that replaces the scattered email, chat, and shared-doc workflow."
                        aspectRatio={1566 / 823}
                        noDrag
                      />
                    </div>
                    <div className="rq-block__findings">
                      <p className="rq-findings-lead"><strong>Key features:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Standard file-attachment feature as the base affordance for familiarity to other platforms</li>
                        <li>&ldquo;Simplified Kanban or pin board&rdquo; to track progression and links to external resources or tools also spares the development team from additional integrations into the platform.</li>
                        <li>Two-level navigation from projects down to individuals similar to Microsoft Teams' organization classes down to specific channels.</li>
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                key: "project-pages",
                label: "Project Content Maintenance",
                content: (
                  <div className="rq-block rq-block--stacked-findings">
                    <div className="rq-block__body">
                      <h4 className="rq-heading">Project Content Maintenance</h4>
                      <p className="rq-lead">
                        The project dashboard was designed to{" "}
                        <mark className="hl">centralize a project&rsquo;s content without overwhelming the viewer</mark>,
                        segmenting it into five sections via left-side navigation. It began as
                        Professor Reese&rsquo;s request for a project-maintenance dashboard.
                      </p>
                    </div>
                    <div className="rq-block__visual">
                      <CyclingImage
                        aspectRatio={1566 / 823}
                        slides={[
                          { src: projectPage1.src, alt: "Project page — version 1." },
                          { src: projectPage2.src, alt: "Project page — version 2." },
                          { src: projectPage3.src, alt: "Project page — version 3." },
                          { src: projectPage4.src, alt: "Project page — version 4." },
                          { src: projectPage5.src, alt: "Project page — version 5." },
                        ]}
                      />
                    </div>
                    <div className="rq-block__findings">
                      <p className="rq-findings-lead"><strong>Key features:</strong></p>
                      <ul className="rq-findings-list">
                        <li>Left-side navigation splits content into five sections (Notifications, Students, Documents, Task Log, and Timeline) to avoid overwhelming the viewer.</li>
                        <li>Each section serves both roles simultaneously, so professors manage the content while students engage with it in parallel.</li>
                        <li>The Documents section includes AI-generated comprehension quizzes to verify students have read the assigned materials, addressing one of Professor Reese&rsquo;s core-feature requests.</li>
                      </ul>
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
            As the wireframes were finalized, <strong>I began contributing code</strong>, specifically{" "}
            <mark className="hl">front-end React</mark>. I took the more mundane, tedious parts so
            my code-savvier teammates could focus on the platform&rsquo;s complex areas, keeping
            progression efficient by playing to our individual strengths.
            <br></br><br></br>
            I also had to <mark className="hl">expand my own designs</mark> as I moved onto new
            pages, accounting for feature reactivity across any browser size.
          </p>
        </section>

        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Design With the Cost of Building in Mind</h3>
          <p>
            <mark className="hl">Directly building my own ideas significantly modified how I factor in limitations</mark>.
            Sometimes I would{" "}
            <mark className="hl">code while thinking, half-annoyed, &ldquo;Jeez, who is the designer who designed and requested all of these details&rdquo;</mark>.
            Working as both designer and engineer emphasized the need to ideate as a{" "}
            <em>development partner</em> rather than an <em>ideater.</em>
            <br></br><br></br>
            From this project, I better understood that a{" "}
            <mark className="hl">design&rsquo;s demands include the building cost</mark>, and that a
            designer who{" "}
            <mark className="hl">accounts for the cost is able to ensure a well-designed handoff would be fully utilized.</mark>
          </p>

          <h3>Adapting to Uneven User-Group Access</h3>
          <p>
            Due to needing conceptualization finalized in the project&rsquo;s first weeks, I was{" "}
            <mark className="hl">unable to conduct user research on professors as in-depth as I did with students</mark>,
            since the two user groups offered very different levels of access. I had only one
            professor (our client) available and an entire campus of students readily available.
            As a result of the contrasting amount of specific user feedback, I prioritized the
            features Professor Reese had requested by how frequently students would interact with
            each, so the highest-student-impact professor-requested features would ship first.
            <br></br><br></br>
            From adapting to this obstacle, I now recognize that working with uneven user-group
            research requires{" "}
            <mark className="hl">sequencing the less-accessible group&rsquo;s requests by how frequently the more-accessible group would interact with each</mark>,
            so I can prioritize the applicable ideas ahead of the impractical ones.
          </p>
        </section>
      </main>
    </div>
  );
}