import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "AI Journey Map Maintenance Agent — Kathleen Li",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "process", label: "Process" },
  { id: "decisions", label: "Key Decisions" },
  { id: "outcome", label: "Outcome" },
  { id: "takeaways", label: "Takeaways" },
];

export default function AIJourneyAgentCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Designing an AI Maintenance Agent for Customer Journey Maps"
        meta="14 weeks · 9 designers · UI & Interaction · Designer"
        subtitle="An agentic AI concept that keeps customer journey maps accurate and trustworthy over time"
        imageLabel="AI maintenance agent · cover image"
      />

      <main className="case-body">
        <p className="case-disclaimer">
          Confidential and proprietary details have been removed or anonymized to protect client information.
        </p>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            This project was for a customer journey management platform — a tool teams use to map and understand
            their customers. Those maps are meant to be living documents, but they quietly go stale as products and
            customers change, and nothing tells users when. Our team researched and designed an agentic AI{" "}
            <mark className="hl">&ldquo;maintenance agent&rdquo;</mark> that monitors journey data, flags outdated
            content, and recommends fixes — keeping maps accurate and trustworthy over time.
          </p>

          <h3>The Problem</h3>
          <p>
            A journey map loses its value the moment it falls out of date. The platform&rsquo;s users — CX
            strategists, designers, product teams — rely on manual review and gut feel to catch stale content. The
            result: <mark className="hl">outdated maps, disconnected data, and eroding trust</mark> in a tool meant
            to be a source of truth. The brief: design an AI agent that monitors journeys, detects inaccurate
            content, and surfaces actionable recommendations.
          </p>

          <h3>My Role</h3>
          <p>
            I worked on a nine-person UX studio team across three phases. I{" "}
            <mark className="hl">led concept ideation and exploration</mark> — generating and pressure-testing the
            agent concepts — and contributed to research synthesis, wireframing, high-fidelity prototyping, and
            usability testing.
          </p>
        </section>

        {/* ───── Process ───── */}
        <section id="process" className="case-section">
          <h2>Process</h2>

          <h3>Research — understanding staleness and trust</h3>
          <p>
            We compared traditional, agentic, and maintenance AI; ran a competitive analysis of journey-management
            and analogous SaaS tools; studied how knowledge tools handle content verification; and interviewed six
            current users of the platform. The throughline: maintenance today is{" "}
            <mark className="hl">reactive, manual, and tied to project milestones</mark> — and users only trust AI
            suggestions when they can see the reasoning behind them.
          </p>
          <figure>
            <div className="image-slot">research synthesis</div>
            <figcaption>
              Affinity diagramming user interviews and interaction-pattern research into the themes that shaped the
              design.
            </figcaption>
          </figure>

          <h3>Ideation — from six concepts to one</h3>
          <p>
            Through Crazy 8&rsquo;s and group whiteboarding we developed six concept directions and presented them to
            the client&rsquo;s sponsors. They selected two — a <em>proactive</em> suggestion model and a{" "}
            <em>reactive</em> guided-walkthrough model — which we combined into a single, cohesive agent after
            recognizing how much the two overlapped.
          </p>

          <h3>Design &amp; testing</h3>
          <p>
            We built a high-fidelity, interactive Figma prototype: evidence-backed suggestion cards, approve / deny /
            snooze controls, a guided walkthrough, and an in-context AI chat. Usability testing with six participants
            showed strong, positive reception and low task difficulty; iterations focused on making evidence
            interactions more obvious and reducing on-screen text density.
          </p>
          <figure>
            <div className="image-slot">final hi-fi design</div>
            <figcaption>
              The final agent: proactive suggestions and a reactive assistant, unified in one panel.
            </figcaption>
          </figure>
        </section>

        {/* ───── Key Decisions ───── */}
        <section id="decisions" className="case-section">
          <h2>Key Decisions</h2>
          <ul>
            <li>
              <mark className="hl">Made every AI suggestion evidence-backed</mark> — each recommendation includes its
              reasoning and a supporting quote pulled from the user&rsquo;s own uploaded documents — because research
              showed transparency is the foundation of AI trust.
            </li>
            <li>
              <strong>Kept the human in control</strong> with approve, deny, and snooze actions, plus an
              Approved/Denied history so users can revisit and undo decisions.
            </li>
            <li>
              <strong>Combined the proactive and reactive concepts into one agent</strong> to avoid redundancy and
              the confusion of a second, competing AI surface.
            </li>
            <li>
              <strong>Moved agent customization into general settings</strong> to match the mental model users
              already had for that kind of control.
            </li>
          </ul>
        </section>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <p>
            We delivered a high-fidelity interactive prototype, design-principle documentation, and a final
            presentation to the client&rsquo;s leadership. The final design gives users a{" "}
            <mark className="hl">trustworthy way to keep journey maps current</mark>: proactive alerts when content
            drifts, transparent evidence for every recommendation, and controls that keep people in the loop rather
            than handing decisions to automation.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>What I Took Away</h2>
          <p>
            Designing for AI is mostly designing for <em>trust</em>. The hardest problems weren&rsquo;t visual — they
            were about transparency, control, and helping users decide when to rely on the system. I also learned to
            design within an existing product: every decision had to fit the platform&rsquo;s established patterns
            and its users&rsquo; mental models.
          </p>
        </section>
      </main>
    </div>
  );
}