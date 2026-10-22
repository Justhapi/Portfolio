/* Final-design blocks for ResearchHub + JourneyTrack, written once and
   styled two ways (Showcase / Breakout) by the harness. Content is the
   pages' own wording, shortened. */

import ZoomableImage from "@/components/ZoomableImage";
import CyclingImage from "@/components/CyclingImage";
import CaseVideo from "@/components/CaseVideo";
import homePage from "@/app/projects/researchhub/images/Home_Page.webp";
import messagesPage from "@/app/projects/researchhub/images/Messages_Page.webp";
import projectPage1 from "@/app/projects/researchhub/images/Project_Page_1.webp";
import projectPage2 from "@/app/projects/researchhub/images/Project_Page_2.webp";
import projectPage3 from "@/app/projects/researchhub/images/Project_Page_3.webp";
import projectPage4 from "@/app/projects/researchhub/images/Project_Page_4.webp";
import projectPage5 from "@/app/projects/researchhub/images/Project_Page_5.webp";

const AR = 1566 / 823;

export function RHFinals() {
  return (
    <div className="final-set">
      <figure className="final">
        <figcaption className="final__head">
          <span className="final__n">01</span>
          <b>General Dashboard</b>
          <span className="final__lead">Centralizes a routine day&rsquo;s needs, for students and professors alike.</span>
        </figcaption>
        <div className="final__screen">
          <ZoomableImage src={homePage.src} alt="ResearchHub general dashboard." aspectRatio={AR} noDrag />
        </div>
        <ul className="final__features">
          <li>Mini project dashboard with access to tasks and other projects</li>
          <li>One click to any project dashboard or direct message</li>
        </ul>
      </figure>

      <figure className="final">
        <figcaption className="final__head">
          <span className="final__n">02</span>
          <b>Communication</b>
          <span className="final__lead">Organizes messages between professors, research assistants and students, in a structure they already know.</span>
        </figcaption>
        <div className="final__screen">
          <ZoomableImage src={messagesPage.src} alt="ResearchHub messages page." aspectRatio={AR} noDrag />
        </div>
        <ul className="final__features">
          <li>Standard file attachments, familiar from other platforms</li>
          <li>&ldquo;Simplified Kanban or pin board&rdquo; for progress and external links</li>
          <li>Two-level navigation, projects down to individuals, like Microsoft Teams</li>
        </ul>
      </figure>

      <figure className="final">
        <figcaption className="final__head">
          <span className="final__n">03</span>
          <b>Project Content Maintenance</b>
          <span className="final__lead">Centralizes a project&rsquo;s content without overwhelming the viewer. Began as Professor Reese&rsquo;s request.</span>
        </figcaption>
        <div className="final__screen">
          <CyclingImage
            aspectRatio={AR}
            slides={[
              { src: projectPage1.src, alt: "Project page — Notifications." },
              { src: projectPage2.src, alt: "Project page — Students." },
              { src: projectPage3.src, alt: "Project page — Documents." },
              { src: projectPage4.src, alt: "Project page — Task Log." },
              { src: projectPage5.src, alt: "Project page — Timeline." },
            ]}
          />
        </div>
        <ul className="final__features">
          <li>Five sections on the left: Notifications, Students, Documents, Task Log, Timeline</li>
          <li>Each section serves both roles: professors manage, students engage</li>
          <li>AI-generated comprehension quizzes in Documents, one of Professor Reese&rsquo;s core requests</li>
        </ul>
      </figure>
    </div>
  );
}

export function JTFinals() {
  return (
    <div className="final-set">
      <figure className="final">
        <figcaption className="final__head">
          <span className="final__n">01</span>
          <b>Reactive flow</b>
          <span className="final__lead">Agent features responding to user requests.</span>
        </figcaption>
        <div className="final__screen">
          <CaseVideo src="/img/proto/reactive.mp4" poster="/img/proto/reactive-poster.webp" label="Wireframe walkthrough of the agent's reactive flow." />
        </div>
      </figure>
      <figure className="final">
        <figcaption className="final__head">
          <span className="final__n">02</span>
          <b>Proactive flow</b>
          <span className="final__lead">Agent features surfacing issues to the user.</span>
        </figcaption>
        <div className="final__screen">
          <CaseVideo src="/img/proto/proactive.mp4" poster="/img/proto/proactive-poster.webp" label="Wireframe walkthrough of the agent's proactive flow." />
        </div>
      </figure>
    </div>
  );
}
