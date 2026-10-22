/* PROTOTYPE — "final designs need punch" (Maddie). ResearchHub's
   final screens and JourneyTrack's prototype walkthroughs, Before vs two
   directions. Delete this folder once one is kept. */

import ResearchCarousel from "@/components/ResearchCarousel";
import ZoomableImage from "@/components/ZoomableImage";
import CyclingImage from "@/components/CyclingImage";
import CaseVideo from "@/components/CaseVideo";
import homePage from "@/app/projects/researchhub/images/Home_Page.webp";
import messagesPage from "@/app/projects/researchhub/images/Messages_Page.webp";
import projectPage1 from "@/app/projects/researchhub/images/Project_Page_1.webp";
import projectPage5 from "@/app/projects/researchhub/images/Project_Page_5.webp";
import { RHFinals, JTFinals } from "./Finals";
import Harness from "./Harness";
import "./proto.css";

function RHBefore() {
  return (
    <ResearchCarousel
      slides={[
        { key: "a", label: "General Dashboard", content: (
          <div className="rq-block rq-block--stacked-findings">
            <div className="rq-block__body"><h4 className="rq-heading">General Dashboard</h4>
              <p className="rq-lead">The dashboard was designed to <mark className="hl">centralize a routine day&rsquo;s needs</mark>, whether a student updating task progression or sending a message, or a professor assessing how their students are progressing.</p></div>
            <div className="rq-block__visual"><ZoomableImage src={homePage.src} alt="Home page." aspectRatio={1566 / 823} noDrag /></div>
            <div className="rq-block__findings"><p className="rq-findings-lead"><strong>Key features:</strong></p>
              <ul className="rq-findings-list"><li>Mini Project Dashboard that provides access to tasks and to other projects</li><li>Buttons to access specific project dashboards and direct messages within one click.</li></ul></div>
          </div>) },
        { key: "b", label: "Communication", content: (
          <div className="rq-block rq-block--stacked-findings">
            <div className="rq-block__body"><h4 className="rq-heading">Communication</h4></div>
            <div className="rq-block__visual"><ZoomableImage src={messagesPage.src} alt="Messages page." aspectRatio={1566 / 823} noDrag /></div>
          </div>) },
        { key: "c", label: "Project Content Maintenance", content: (
          <div className="rq-block rq-block--stacked-findings">
            <div className="rq-block__body"><h4 className="rq-heading">Project Content Maintenance</h4></div>
            <div className="rq-block__visual"><CyclingImage aspectRatio={1566 / 823} slides={[{ src: projectPage1.src, alt: "1" }, { src: projectPage5.src, alt: "5" }]} /></div>
          </div>) },
      ]}
    />
  );
}

function JTBefore() {
  return (
    <div className="case-image-row">
      <CaseVideo src="/img/proto/reactive.mp4" poster="/img/proto/reactive-poster.webp" label="Reactive flow." caption={<>Demo of Agent features responding to user requests.</>} />
      <CaseVideo src="/img/proto/proactive.mp4" poster="/img/proto/proactive-poster.webp" label="Proactive flow." caption={<>Demo of Agent features surfacing issues to the user.</>} />
    </div>
  );
}

function Frame({ title, lead, children }: { title: string; lead: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="case">
      <main className="case-body">
        <section className="case-section">
          <h3>{title}</h3>
          <p>{lead}</p>
          {children}
        </section>
      </main>
    </div>
  );
}

export default function FinalPunchPrototype() {
  const rhLead = <>The final prototype showed the redesign as connected flows covering real use cases.</>;
  const jtLead = <>We delivered a <mark className="hl">high-fidelity prototype and design-principle documentation</mark> to the sponsor&rsquo;s leadership.</>;
  return (
    <div className="portfolio-v2">
      <div className="fp-pane" data-pane="rh-1"><Frame title="Prototyping for Developer Handoff" lead={rhLead}><RHBefore /></Frame></div>
      <div className="fp-pane" data-pane="rh-2"><Frame title="Prototyping for Developer Handoff" lead={rhLead}><RHFinals /></Frame></div>
      <div className="fp-pane" data-pane="jt-1"><Frame title="Outcome" lead={jtLead}><JTBefore /></Frame></div>
      <div className="fp-pane" data-pane="jt-2"><Frame title="Outcome" lead={jtLead}><JTFinals /></Frame></div>
      <Harness />
    </div>
  );
}
