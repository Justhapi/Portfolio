import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import CaseFilmstrip from "@/components/CaseFilmstrip";

import briefImg from "./images/Feenix_Project_Introduction.png";
import competitorSignIn from "./images/Competitor_Sign_In.png";
import aternosServer from "./images/Aternos_Server.png";
import playHostingServer from "./images/Play.Hosting_Server.png";
import aternosMaintenance from "./images/Aternos_Maintenace.png";
import competitorMaintenance from "./images/Competitor_Server_Maintenance.png";
import serverCreationIdeation from "./images/Server_Creation_Flow_Ideation.png";
import serverCreationFlowSketch from "./images/Server_Creation_Flow_Sketch.png";
import loginSketch from "./images/Login_Sketch.png";
import createAccountSketch from "./images/Create_Account_Sketch.png";
import authFlow from "./images/Landing_Page_Flow.png";
import createAccountSketchFinal from "./images/Create_Account_Sketch_Final.png";
import accountRecoverySketch from "./images/Account_Recovery_Sketch.png";
import loginMock from "./images/Login_Initial_Wireframe.png";
import createAccountFlowWire from "./images/Create_Account_Flow_Wireframe.png";
import recoverAccountFlowWire from "./images/Recover_Account_Flow_Wireframe.png";
import websiteLogin from "./images/Website_Login.png";
import websiteCreateAgreement from "./images/Website_Create_Account_Agreement.png";
import competitorSidebar from "./images/Competitor_Sidebars.png";
import sidebarIdea from "./images/Sidebar_Idea.png";
import sidebarSketch from "./images/Sidebar_Sketch.png";
import sidebarSketchFinal from "./images/Sidebar_Sketch_Final.png";
import homeNewSketch from "./images/Home_New_Account_Sketch.png";
import consoleSketch from "./images/Console_Sketch_Initial.png";
import worldSketch from "./images/World_Sketch_Initial.png";
import playersSketch from "./images/Players_Sketch_Initial.png";
import backupSketch from "./images/Backup_Sketch_Initial.png";
import adminSketch from "./images/Admin_Sketch_Initial.png";
import softwareSketch from "./images/Server_Software_Sketch_Initial.png";
import consoleSketchFinal from "./images/Console_Sketch_Final.png";
import worldSketchFinal from "./images/World_Sketch_Final.png";
import playersSketchFinal from "./images/Players_Sketch_Final.png";
import backupSketchFinal from "./images/Backup_Sketch_Final.png";
import consoleWire1 from "./images/Server_Console_Wireframe_Initial.png";
import consoleErr1 from "./images/Server_Console_Wireframe_Error_Initial.png";
import consoleErr2 from "./images/Server_Console_Wireframe_Error_Final.png";
import worldWire1 from "./images/Server_World_Wireframe_Initial.png";
import worldWire2 from "./images/Server_World_Wireframe_Final.png";
import playersWire from "./images/Server_Players_Wireframe_Initial.png";
import backupWire from "./images/Server_Backup_Wireframe_Initial.png";
import adminWire from "./images/Server_Admin_Wireframe_Initial.png";
import softwareWire from "./images/Server_Software_Wireframe_Initial.png";
import serverCreationNew from "./images/Server_Creation_New.png";
import creationStep1 from "./images/Server_Creation_Step_1.png";
import creationStep2a from "./images/Server_Creation_Step_2_Initial.png";
import creationStep2b from "./images/Server_Creation_Step_2_Final.png";
import creationStep3a from "./images/Server_Creation_Step_3_Initial.png";
import creationStep3b from "./images/Server_Creation_Step_3_Final.png";


export const metadata = {
  title: "Feenix — Kathleen Li",
  robots: { index: false, follow: false },
};

const SECTIONS_NAV = [
  { id: "outcome", label: "Outcome" },
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "designing", label: "Designing" },
  { id: "testing", label: "Testing" },
  { id: "takeaways", label: "Takeaways" },
];

const SLIDE_RATIO = 1500 / 844;
type Img = { src: string; width: number; height: number };
const ar = (i: Img) => i.width / i.height;



function Z({ img, alt, caption, ratio }: { img: Img; alt: string; caption?: React.ReactNode; ratio?: number }) {
  return <ZoomableImage src={img.src} alt={alt} aspectRatio={ratio ?? ar(img)} caption={caption} />;
}

export default function FeenixCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS_NAV} />
      <CaseCover
        title="Constructing a Minecraft Server Hosting Platform Applicable To Any Level of Experience"
        meta="Feenix Group · 2026–27 · UX Lead, Frontend"
        metaLabels={["Client", "Timeline", "Role"]}
        subtitle="A beginner-friendly server hosting platform built from an audit of two competitors"
        hideHero
      />

      <main id="main" className="case-body">
        <p className="case-disclaimer" aria-label="NDA notice">
          <span className="case-disclaimer__badge">NDA</span>
          <span className="case-disclaimer__text">
            This case study covers sponsor work protected by a non-disclosure agreement,
            specifically{" "}
            <strong>sponsor-internal requirements, unreleased platform features, and team artifacts are excluded or generalized.</strong>
          </span>
        </p>

        {/* ───── Outcome ───── */}
        <section id="outcome" className="case-section">
          <h2>Outcome</h2>
          <aside className="outcome-callout" aria-label="Project outcome">
            <p className="outcome-callout__stat">
              The sponsor&rsquo;s Phase 1 goal is{" "}
              <strong>a working platform where users can securely register, create a Minecraft server, have it set up automatically, and manage it through the web app.</strong>
            </p>
            <p className="outcome-callout__meta">Phase 1 MVP · 2026–27 · in progress</p>
          </aside>
          <p>

          </p>
        </section>

        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>
          <p>
            Feenix Group is an international gaming, esports, and youth-culture agency connecting brands 
            with the younger audience through video games and partnerships. They are well known through 
            their projects in Roblox development.
            <br></br><br></br>
            However, Feenix Group is branching out to Minecraft through collaborating with Purdue&rsquo;s Data 
            Mine Corporate Partners to build a Minecraft server hosting platform.
            <br></br><br></br>
            For this exploratory project, the sponsor directed us to build the foundations of
            a scalable Minecraft hosting service that supports both free and premium hosting within two
            phases over the academic year.
          </p>
          <div className="case-phases">
            <strong>Phase 1 - Minimum Viable Product (MVP) Features</strong>
            <ul>
              <li>Account Registration</li>
              <li>Server Creation</li>
              <li>Server Management</li>
              <li>Server Backup</li>
            </ul>
            <strong>Phase 2 - Feature Enhancements</strong>
            <ul>
              {/* may need to add more features here in the future */}
              <li>Server Plugins & Modpacks</li>
              <li>Automatic Backup</li>
              <li>Monetary Profit (Premium & Subscriptions)</li>
              <li>Discord / Community Integration</li>
            </ul>
          </div>
          <Z img={briefImg} alt="Project brief board with the platform description and user assumptions on sticky notes."
             caption={<>The project brief, split into what the platform needs to let users do and who we assumed the users were.</>} />
          <h3>My Role</h3>
          <p>
             During the project I worked as the UX designer on the Frontend team,{" "}
            owning the information architecture, user flows, and interface's design and frontend implementation.
            <br/><br/>
            While designing, I actively collaborated with the other teams (Data, backend, infrastructure) to identify and address 
            the technical feasbility and limitations within the designs.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
            To familiarize myself with Minecraft Server Hosting platforms, I assessed two competitors to 
            better understand how to design the server fatures requested by Feenix: 
            <br></br><br></br>
            <ul>
              <li>Aternos</li>
              <li>Play.Hosting</li>
            </ul>
            <br></br><br></br>
            In addition to understanding the basic functionality requirements through each 
            individual platform's interpretations, I was also able to identify pain points and 
            oppurtunities of improvmement for the platform, particularly in server seed modification.
          <h3>Auditing two competitors</h3>
          {/* DOC → Phase 3 → "Goal" / "Method" */}
          <CaseFilmstrip
            label="Auditing two competitors"
            shots={[
              { key: "competitor-sign-in", img: competitorSignIn, label: "Sign-in, both platforms", alt: "Sign-in screens from Aternos and play.hosting side by side." },
              { key: "aternos-server", img: aternosServer, label: "Aternos dashboard", alt: "The Aternos server dashboard." },
              { key: "play-hosting-server", img: playHostingServer, label: "play.hosting dashboard", alt: "The play.hosting server dashboard." },
            ]}
          />

          <h3>Where their structures fell short</h3>
          <CaseFilmstrip
            label="Where their structures fell short"
            side={
              <>
                {/* DOC → Phase 3 → "Findings — Aternos" */}
                {/* DOC → Phase 6 → Console paragraph */}
              </>
            }
            shots={[
              { key: "aternos-maintenace", img: aternosMaintenance, label: "Aternos maintenance", alt: "Aternos server maintenance screens." },
              { key: "competitor-server-maintenance", img: competitorMaintenance, label: "Maintenance, both platforms", alt: "Server maintenance screens captured across both competitors." },
            ]}
          />

        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>

          <h3>Working out what a server needs</h3>
          {/* DOC → Phase 7 → "Findings — feature inventory" */}
          <CaseFilmstrip
            label="Working out what a server needs"
            shots={[
              { key: "server-creation-ideation", img: serverCreationIdeation, label: "Feature inventory", alt: "Sticky-note board listing what a server needs: address, privacy, whitelist, admins, blueprint, backup, world seed." },
              { key: "server-creation-flow-sketch", img: serverCreationFlowSketch, label: "Flow sketch", alt: "Hand sketch of the server creation flow across its pages." },
            ]}
          />

          <h3>Create account, four passes</h3>
          <CaseFilmstrip
            label="Create account, four passes"
            side={
              <>
                {/* DOC → Phase 4 → "Goal" */}
              </>
            }
            shots={[
              { key: "create-account-sketch", img: createAccountSketch, label: "First pass", alt: "First hand sketch of the create account screen." },
              { key: "create-account-sketch-Direction", img: createAccountSketch, label: "Third pass", alt: "Third create account sketch." },
              { key: "create-account-sketch-final", img: createAccountSketchFinal, label: "Final pass", alt: "Final create account sketch." },
            ]}
          />

          <h3>Log in, recovery and the auth flow</h3>
          <CaseFilmstrip
            label="Log in, recovery and the auth flow"
            side={
              <>
                {/* DOC → Phase 4 → "Goal" */}
              </>
            }
            shots={[
              { key: "login-sketch", img: loginSketch, label: "Log in sketch", alt: "Hand sketch of the log in screen." },
              { key: "account-recovery-sketch", img: accountRecoverySketch, label: "Recovery sketch", alt: "Hand sketch of the account recovery screens." },
              { key: "landing-page-flow", img: authFlow, label: "Auth branching flow", alt: "Flow diagram branching from the landing page: new user to sign-up, returning user to log in, both ending at the homepage." },
            ]}
          />

          <h3>Log in mockups</h3>
          <CaseFilmstrip
            label="Log in mockups"
            side={
              <>
                {/* DOC → Phase 4 → "Method — colour variants (9/17)" */}
              </>
            }
            shots={[
              { key: "login-initial-mockup-2", img: loginMock, label: "Mockup two", alt: "Second log in mockup." },
            ]}
          />

          <h3>Auth flow wireframes</h3>
          {/* DOC → Phase 4 → "Interaction decisions (10/2)" */}
          <CaseFilmstrip
            label="Auth flow wireframes"
            shots={[
              { key: "create-account-flow-wireframe", img: createAccountFlowWire, label: "Create account flow", alt: "Wireframe of the full create account flow." },
              { key: "recover-account-flow-wireframe", img: recoverAccountFlowWire, label: "Recover account flow", alt: "Wireframe of the full account recovery flow." },
            ]}
          />

          <h3>Authentication as built</h3>
          {/* DOC → Phase 4 → "Outcome" */}
          {/* DOC → Phase 11 → "Outcome" */}
          <CaseFilmstrip
            label="Authentication as built"
            shots={[
              { key: "website-login", img: websiteLogin, label: "Log in", alt: "The log in screen as built." },
              { key: "website-create-account-agreement", img: websiteCreateAgreement, label: "Agreement step", alt: "Create account, agreement step, as built." },
            ]}
          />

          <h3>Navigation reference</h3>
          {/* One image: it sits on the right, with this section's text on the left (like "Log in mockups"). */}
          <CaseFilmstrip
            label="Navigation reference"
            side={
              <>
                {/* DOC → Phase 8 → "Direction" */}
              </>
            }
            shots={[
              { key: "competitor-sidebars", img: competitorSidebar, label: "Side navigation references", alt: "Aternos' side navigation next to a command palette from another tool." },
            ]}
          />

          <h3>Sidebar, three passes</h3>
          <CaseFilmstrip
            label="Sidebar, three passes"
            side={
              <>
                {/* DOC → Phase 8 → "First sketches" / "Navigation structure" */}
              </>
            }
            shots={[
              { key: "sidebar-sketch", img: sidebarSketch, label: "First pass", alt: "First side navigation sketch." },
              { key: "sidebar-idea", img: sidebarIdea, label: "Sidebar direction idea", alt: "Early navigation idea." },
              { key: "sidebar-sketch-final", img: sidebarSketchFinal, label: "Final pass", alt: "Final side navigation sketch." },
            ]}
          />

          <h3>Post-login home states</h3>
          {/* One image: it sits on the right, with this section's text on the left (like "Log in mockups"). */}
          <CaseFilmstrip
            label="Post-login home states"
            side={
              <>
                {/* DOC → Phase 8 → "First sketches" */}
              </>
            }
            shots={[
              { key: "home-new-account-sketch", img: homeNewSketch, label: "Home states", alt: "Four post-login home states: first-time welcome, returning user with a server list, and two empty states reading \u201cNo servers made\u201d." },
            ]}
          />

          <h3>Six sections, sketched</h3>
          {/* DOC → Phase 9 → "Section purposes" */}
          <CaseFilmstrip
            label="Six sections, sketched"
            shots={[
              { key: "console-sketch", img: consoleSketch, label: "Console", alt: "Console section sketch." },
              { key: "world-sketch", img: worldSketch, label: "World", alt: "World section sketch." },
              { key: "players-sketch", img: playersSketch, label: "Players", alt: "Players section sketch." },
              { key: "backup-sketch", img: backupSketch, label: "Backup", alt: "Backup section sketch." },
              { key: "admin-sketch", img: adminSketch, label: "Admin", alt: "Admin section sketch." },
              { key: "software-sketch", img: softwareSketch, label: "Software", alt: "Software section sketch." },
            ]}
          />

          <h3>Six sections, resolved</h3>
          <CaseFilmstrip
            label="Six sections, resolved"
            side={
              <>
                {/* DOC → Phase 9 → "Sponsor feedback (10/6)" */}
              </>
            }
            shots={[
              { key: "console-sketch-final", img: consoleSketchFinal, label: "Console", alt: "Final console section sketch." },
              { key: "world-sketch-final", img: worldSketchFinal, label: "World", alt: "Final world section sketch." },
              { key: "players-sketch-final", img: playersSketchFinal, label: "Players", alt: "Final players section sketch." },
              { key: "backup-sketch-final", img: backupSketchFinal, label: "Backup", alt: "Final backup section sketch." },
            ]}
          />

          <h3>Section wireframes</h3>
          <CaseFilmstrip
            label="Section wireframes"
            side={
              <>
                {/* DOC → Phase 9 → "Console" … "Software" */}
              </>
            }
            shots={[
              { key: "server-console-wireframe-initial", img: consoleWire1, label: "Console", alt: "Console wireframe, first pass." },
              { key: "server-console-wireframe-error-initial", img: consoleErr1, label: "Console · error", alt: "Console wireframe, error state, first pass." },
              { key: "server-world-wireframe-initial", img: worldWire1, label: "World", alt: "World wireframe, first pass." },
              { key: "server-players-wireframe-initial", img: playersWire, label: "Players", alt: "Players wireframe." },
              { key: "server-backup-wireframe-initial", img: backupWire, label: "Backup", alt: "Backup wireframe." },
              { key: "server-admin-wireframe-initial", img: adminWire, label: "Admin", alt: "Admin wireframe." },
              { key: "server-software-wireframe-initial", img: softwareWire, label: "Software", alt: "Software wireframe." },
            ]}
          />

        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>

          <h3>Testing the Structure</h3>
          {/* DOC → Phase 10 — Comparative Usability Testing → "Goal", "Method", */}
          {/* DOC → "Findings — Aternos", "Findings — play.hosting", */}
          {/* DOC → "Findings — prototype", "Confirmed — prototype" */}

          <h3>Before any server exists</h3>
          {/* One image: it sits on the right, with this section's text on the left (like "Log in mockups"). */}
          <CaseFilmstrip
            label="Before any server exists"
            side={
              <>
                {/* DOC → Phase 12 → "Goal" */}
              </>
            }
            shots={[
              { key: "server-creation-new", img: serverCreationNew, label: "Create your first server", alt: "The empty state before any server exists, with a single Create server action." },
            ]}
          />

          <h3>The three steps</h3>
          {/* DOC → Phase 12 — Server Creation Flow → "Goal", "Method" */}
          {/* DOC → Phase 12 → "Backup settings", "Open" */}
          {/* DOC → Phase 7 → "Feedback — World section (10/4)" — Hari asked */}
          {/* DOC → the base plan be finished before the World section */}
          <CaseFilmstrip
            label="The three steps of server creation"
            shots={[
              { key: "server-creation-step-1", img: creationStep1, label: "1 · General", alt: "Server creation step one, general settings." },
              { key: "server-creation-step-2-initial", img: creationStep2a, label: "2 · World setup", alt: "Server creation step two, first pass." },
              { key: "server-creation-step-3-initial", img: creationStep3a, label: "3 · Backup settings", alt: "Server creation step three, first pass." },
            ]}
          />

          <h3>What Testers Liked</h3>
          {/* DOC → Phase 10 → "Confirmed — prototype" and "Monetisation" */}

          <h3>Iterations</h3>
          {/* DOC → Phase 9 → "Sponsor feedback (10/6)" and "Outcome" */}
          {/* DOC → Phase 10 → "Findings — prototype" */}
          {/* DOC → Phase 12 → "Backup settings", "Open" */}
          <CaseFilmstrip
            label="What changed after testing — first pass beside second"
            shots={[
              {
                key: "iteration-console-error",
                img: [consoleErr1, consoleErr2],
                label: "Console · error",
                alt: [
                  "Console wireframe, error state, first pass.",
                  "Console wireframe, error state, second pass.",
                ],
              },
              {
                key: "iteration-world",
                img: [worldWire1, worldWire2],
                label: "World",
                alt: [
                  "World wireframe, first pass.",
                  "World wireframe, second pass.",
                ],
              },
              {
                key: "iteration-step-2",
                img: [creationStep2a, creationStep2b],
                label: "Step 2 · World",
                alt: [
                  "Server creation step two, first pass.",
                  "Server creation step two, second pass.",
                ],
              },
              {
                key: "iteration-step-3",
                img: [creationStep3a, creationStep3b],
                label: "Step 3 · Backup",
                alt: [
                  "Server creation step three, first pass.",
                  "Server creation step three, second pass.",
                ],
              },
            ]}
          />
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Naming Decides Structure</h3>
          {/* DOC → Phase 3 → "Findings — Aternos" (Access vs whitelist) */}
          {/* DOC → Phase 10 → "Findings — Aternos" and "Findings — play.hosting" */}
          {/* DOC → Phase 9 → "Section purposes" */}

          <h3>Using What Users Already Know</h3>
          {/* DOC → Phase 8 → "Navigation structure" */}
          {/* DOC → Phase 6 → "Findings" → the Minecraft and Duolingo paragraphs */}
        </section>
      </main>
      {/* No NextProject: this case is not in that component's CASES list
          while it stays unlisted, so it has no neighbours to link to. */}
    </div>
  );
}
