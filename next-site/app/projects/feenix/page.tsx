import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import CaseFilmstrip from "@/components/CaseFilmstrip";

import briefImg from "./images/Feenix_Project_Introduction.png";
import googleIcon from "./images/Google_Icon.png";
import microsoftIcon from "./images/Microsoft_Icon.png";
import discordIcon from "./images/Discord_Icon.png";
import competitorSignIn from "./images/Competitor_Sign_In.png";
import aternosServer from "./images/Aternos_Server.png";
import playHostingServer from "./images/Play.Hosting_Server.png";
import aternosMaintenance from "./images/Aternos_Maintenance.png";
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
import createAccountSeparated from "./images/Server_Creation_Flow_Sketch_Separated.png"
import captchaIntegration from "./images/Captcha_Integration.png"
import feenixLogo from "./images/Feenix_Logo.png";
import aternosLogo from "./images/Aternos_Logo.png";
import playHostingLogo from "./images/Play.Hosting_Logo.png";


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

/** Feedback → what changed, one pair per row: the quote on the left, the change it led to on the right. */
function FeedbackList({ items, label }: { items: [string, string][]; label: string }) {
  return (
    <div className="case-feedback" role="group" aria-label={label}>
      <div className="case-feedback__head" aria-hidden="true">
        <span className="case-map__label">Feedback</span>
        <span />
        <span className="case-map__label case-feedback__out-label">What changed</span>
      </div>
      <ul>
        {items.map(([quote, change]) => (
          <li key={change}>
            <span className="case-feedback__in">&ldquo;{quote}&rdquo;</span>
            <span className="case-feedback__arrow" aria-hidden="true">&rarr;</span>
            <span className="case-feedback__out">{change}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FeenixCaseStudy() {
  return (
    <div className="case case-stars">
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
          <div className="case-intro case-intro--fill">
            <p>
              Feenix Group is an international gaming, esports, and youth-culture agency known for its
              Roblox projects. To branch out to Minecraft, Feenix partnered with Purdue&rsquo;s Data Mine
              Corporate Partners to build the foundations of a scalable server hosting platform, with free
              and premium hosting, over two phases across the academic year.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="case-intro__logo" src={feenixLogo.src} width={96} height={96} alt="Feenix Group logo" />
          </div>
          <div className="case-map">
            <div className="case-map__col">
              <span className="case-map__label">Phase 1 · Minimum Viable Product (MVP) Features</span>
              <ul>
                <li>Account Registration</li>
                <li>Server Creation</li>
                <li>Server Management</li>
                <li>Server Backup</li>
              </ul>
            </div>
            <span className="case-map__arrow" aria-hidden="true">&rarr;</span>
            <div className="case-map__col case-map__col--out">
              <span className="case-map__label">Phase 2 · Feature Enhancements</span>
              <ul>
                {/* may need to add more features here in the future */}
                <li>Server Plugins & Modpacks</li>
                <li>Automatic Backup</li>
                <li>Monetary Profit (Premium & Subscriptions)</li>
                <li>Discord / Community Integration</li>
              </ul>
            </div>
          </div>
          <Z img={briefImg} alt="Project brief board with the platform description and user assumptions on sticky notes."
             caption={<>The project brief, split into what the platform needs to let users do and who we assumed the users were.</>} />
          <h3>My Role</h3>
          <p>
            As UX designer and frontend developer, I designed the information architecture, user flows,
            and interface while building the frontend, working with the data, backend, and infrastructure
            teams to balance design against technical (and sometimes legal) constraints.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Auditing Two Competing Hosting Platforms</h3>
          <p>
            To learn how Minecraft hosting platforms work, I audited two competitors against the features
            Feenix requested:
          </p>
          <ul className="case-logo-list">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <li><img src={aternosLogo.src} width={42} height={42} alt="" />Aternos</li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <li><img src={playHostingLogo.src} width={42} height={42} alt="" />Play.Hosting</li>
          </ul>
          <h3>Mapping Competitor Sign-in and Server Creation Flows</h3>
          <p>
            I went through each competitor&rsquo;s <strong>sign-in, server creation, and server management
            flows</strong> to learn what a hosting platform needs from a user&rsquo;s account and server setup.
          </p>

          <CaseFilmstrip
            label="Competitor Sign-in and Server Creation Flows"
            shots={[
              { key: "competitor-sign-in", img: competitorSignIn, label: "Both platforms' Sign-in", alt: "Sign-in screens from Aternos and play.hosting side by side." },
              { key: "aternos-server", img: aternosServer, label: "Aternos dashboard", alt: "The Aternos server dashboard." },
              { key: "play-hosting-server", img: playHostingServer, label: "play.hosting dashboard", alt: "The play.hosting server dashboard." },
            ]}
          />

          <p>
            This surfaced pain points and opportunity gaps, especially around modifying a server&rsquo;s seed.
          </p>
          <h3>Condensing 17 Competitor Features into 6 Maintenance Sections</h3>
          <CaseFilmstrip
            label="Competitor Server Maintenance Features"
            minWidth={500}
            align="right"
            side={
              <>
                <strong>Between Aternos, Play.Hosting, and Feenix&rsquo;s requests, the maintenance features had to fit into one clear set.</strong>{" "}
                Aternos offered 10 maintenance features and Play.Hosting 7, with partial overlap. I mapped
                both against Feenix&rsquo;s requests and condensed them into 6 sections:
                <ul className="feature-list">
                  <li>Console: start/stop/restart, live logs, CPU and RAM</li>
                  <li>World: properties, seed, and minor settings</li>
                  <li>Players: whitelist, bans, operators, and IP bans</li>
                  <li>Admin: platform permissions and access</li>
                  <li>Backup: world backups, cloud sync, and revision history</li>
                  <li>Software: engines (Vanilla, Paper, Forge, Fabric), plugins, and modpacks</li>
                </ul>
              </>
            }
            shots={[
              { key: "aternos-maintenance", img: aternosMaintenance, label: "Aternos maintenance", alt: "Aternos server maintenance screens." },
              { key: "competitor-server-maintenance", img: competitorMaintenance, label: "Maintenance, both platforms", alt: "Server maintenance screens captured across both competitors." },
            ]}
          />
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>
          <h3>From Account Flows to a Six-Section Server Dashboard</h3>
          <CaseFilmstrip
            label="Account Creation"
            minWidth={450}
            align = "right"
            side={
              <>
              <h3>Designing the Account Flows</h3>
              <strong>I pitched sign-in options around the accounts gamers already have.</strong>{" "}
              I sketched the account creation page after reviewing competitor and common sign-up flows,
              landing on three options:
              <ul className="case-logo-list case-logo-list--stack">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <li><img src={googleIcon.src} width={42} height={42} alt="" />Google: the account most people already have</li>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <li><img src={microsoftIcon.src} width={42} height={42} alt="" />Microsoft: where Minecraft accounts already live</li>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <li><img src={discordIcon.src} width={42} height={42} alt="" />Discord: where gaming communities already are</li>
              </ul>
              Cross-team feedback then added two requirements:
              <FeedbackList
                label="Cross-team feedback on the auth flows"
                items={[
                ["The standard username and password requirement is 4 and 8 characters", "Username and Password Requirements"],
                ["We need to ensure bots are not able to make accounts", "Captcha Implementation for security against bots"],
                ]}
              />
              </>
            }
            shots={[
              { key: "create-account-sketch", img: createAccountSketch, label: "First pass", alt: "First hand sketch of the create account screen." },
              { key: "create-account-sketch-final", img: createAccountSketchFinal, label: "Final pass", alt: "Final create account sketch." },
            ]}
          />

          <CaseFilmstrip
            label="Log in, recovery and the auth flow"
            side={
              <>
                Since the dashboard would launch as a standalone platform, I made the login page do double
                duty: a quick sign-in for returning users and an introduction to Feenix&rsquo;s features for
                new visitors.
              </>
            }
            shots={[
              { key: "login-sketch", img: loginSketch, label: "Log in sketch", alt: "Hand sketch of the log in screen." },
              { key: "account-recovery-sketch", img: accountRecoverySketch, label: "Recovery sketch", alt: "Hand sketch of the account recovery screens." },
            ]}
          />

          <p>I turned the sketches into wireframes using Feenix&rsquo;s design system.</p>
          <CaseFilmstrip
            label="Auth flow wireframes"
            shots={[
              { key: "create-account-flow-wireframe", img: createAccountFlowWire, label: "Create account flow", alt: "Wireframe of the full create account flow." },
              { key: "recover-account-flow-wireframe", img: recoverAccountFlowWire, label: "Recover account flow", alt: "Wireframe of the full account recovery flow." },
              { key: "captcha-integration", img: captchaIntegration, label: "Integration of Captcha", alt: "Integration of Captcha visible on localhost" },
            ]}
          />
          <p>
            After I built the frontend, teammates added the Captcha, and a new minimum-age check
            prompted minor reformatting.
          </p>
          <h3>Simplifying Server Creation into Staged Pages</h3>

          <CaseFilmstrip
            label="Working out what a server needs"
            align="right"
            side={
              <>
                I simplified the competitors&rsquo; creation stages into Feenix&rsquo;s flow and added a world
                modification stage: users could shape the world with a seed or biome and building
                blueprints, then preview their spawn area on a small map.
                <br></br><br></br>
                Hari and Calvin approved it but placed it in Phase 2. Because each stage lived on its own
                page, we kept the flow and simply set the world stage aside.
              </>
            }
            shots={[
              { key: "server-creation-ideation", img: serverCreationIdeation, label: "Feature inventory", alt: "Sticky-note board listing what a server needs: address, privacy, whitelist, admins, blueprint, backup, world seed." },
              { key: "server-creation-flow-sketch", img: serverCreationFlowSketch, label: "Flow sketch", alt: "Hand sketch of the server creation flow across its pages." },
            ]}
          />
          <h3>A Dashboard for Managing Many Servers</h3>
          <CaseFilmstrip
            label="Sidebar Process"
            align = "right"
            side={
              <>
                <strong>Users needed quick access to maintenance features across multiple servers, so I referenced Discord&rsquo;s dual tier sidebar.</strong>{" "}
                Maintenance features need to be one click away, and competitors already used side
                navigation, so I chose a sidebar ordered by expected frequency of use. Its two strips:
                <ul>
                  <li>Primary strip: switch between servers you own or admin</li>
                  <li>Secondary strip: switch between the selected server&rsquo;s maintenance features</li>
                </ul>
              </>
            }
            shots={[
              { key: "competitor-sidebars", img: competitorSidebar, label: "Side navigation references", alt: "Aternos' side navigation next to a command palette from another tool." },
              { key: "sidebar-sketch", img: sidebarSketch, label: "First pass", alt: "First side navigation sketch." },
              { key: "sidebar-idea", img: sidebarIdea, label: "Sidebar direction idea", alt: "Early navigation idea." },
              { key: "sidebar-sketch-final", img: sidebarSketchFinal, label: "Final pass", alt: "Final side navigation sketch." },
            ]}
          />

          <p>I then sketched the 6 maintenance sections, building on competitor patterns like Aternos&rsquo;s console.</p>
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

          <CaseFilmstrip
            label="Six sections, resolved"
            side={
              <>
                Team feedback on hierarchy and missing features led to small iterations:
                <ul>
                  <li>Handling cases like a server failing to start</li>
                  <li>Boxing related elements together</li>
                  <li>Icon buttons for actions like per-player permissions</li>
                </ul>
              </>
            }
            shots={[
              { key: "console-sketch-final", img: consoleSketchFinal, label: "Console", alt: "Final console section sketch." },
              { key: "world-sketch-final", img: worldSketchFinal, label: "World", alt: "Final world section sketch." },
              { key: "players-sketch-final", img: playersSketchFinal, label: "Players", alt: "Final players section sketch." },
              { key: "backup-sketch-final", img: backupSketchFinal, label: "Backup", alt: "Final backup section sketch." },
            ]}
          />

        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Testing the Prototype Against Both Competitors</h3>
          <CaseFilmstrip
            label="Section wireframes"
            align ="right"
            side={
              <>
                I built an interactive prototype in Figma Make and had users with varying hosting
                experience complete the same tasks on both competitors and the prototype:
                <ul>
                  <li>Create a server with given settings</li>
                  <li>Explore it before inviting others</li>
                  <li>Change the server&rsquo;s version</li>
                  <li>Set up automatic backups</li>
                  <li>Add friends to the whitelist</li>
                  <li>Ban a griefer for a week</li>
                </ul>
              </>
            }
            shots={[
              { key: "server-creation-new", img: serverCreationNew, label: "Create your first server", alt: "The empty state before any server exists, with a single Create server action." },
              { key: "server-creation-step-1", img: creationStep1, label: "1 · General", alt: "Server creation step one, general settings." },
              { key: "server-creation-step-2-initial", img: creationStep2a, label: "2 · World setup", alt: "Server creation step two, first pass." },
              { key: "server-creation-step-3-initial", img: creationStep3a, label: "3 · Backup settings", alt: "Server creation step three, first pass." },
            ]}
          />
          <br></br>
          <CaseFilmstrip
            label="Section wireframes"
            align ="right"
            side={
              <>
                After each session, I asked where they struggled and what would have helped.
                <h3>Testers Found the Clearest Guidance and Navigation</h3>
                Testers rated the prototype strongest in guidance and navigation. It avoided Aternos&rsquo;s
                information overload, Play.Hosting&rsquo;s bottlenecked feature access, and both
                platforms&rsquo; confusing feature names. They also valued the world modification stage for
                tailoring their world and checking the seed up front.
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

          <h3>Iterating on User and Technical Feedback</h3>
          <p>Tester feedback was mostly about layout and placement:</p>
          <FeedbackList
            label="Tester feedback and the iterations it prompted"
            items={[
            ["Creation buttons were too far apart", "Combining the creation of server with and without server into one button"],
            ["What if I were to want to add a specific biome AND building?", "Add ability to select either types of blueprint options (Biomes and Custom Buildings)"],
            ["I fear for moments where I don't understand the server issue", "Simplify technical terms of server running errors"],
            ["I almost didn't notice the create server button", "Improve visibility of general server creation and server running"],
            ]}
          />
          <p>Calvin, Hari, and teammates on other teams also reviewed the prototype for technical concerns:</p>
          <FeedbackList
            label="Technical feedback from the team and the iterations it prompted"
            items={[
            ["The console already logs events, so it could send commands and messages too", "Add platform-server communication"],
            ["What if the user were to use different google accounts for account and backup connections?", "Include manual Google Drive connecting"],
            ["Considering how backup is saved, we could also allow for importing of existing server files", "Implement import files option in World Setup stage"],
            ]}
          />
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
                key: "iteration-step-3",
                img: [creationStep3a, creationStep3b],
                label: "Step 3 · Backup",
                alt: [
                  "Server creation step three, first pass.",
                  "Server creation step three, second pass.",
                ],
              }]}
          />
          <p>
            The biggest technical concern was the spawn map, since its commercial-use limits were unclear.
            I researched third-party seed preview tools, found Chunkbase, and revised the world feature
            and world setup stage around it.
          </p>
          <CaseFilmstrip
            label=""
            shots={[
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
            ]}
          />
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>

          <h3>Designing Beyond the Current Sprint&rsquo;s Scope</h3>
          <p>
            Designing while also building the frontend meant constantly re-scoping my sprints. When the
            team&rsquo;s first sprint was accounts and login, I designed only those flows, but I found I
            could <mark className="hl">design more effectively by briefly looking at other parts of the
            project</mark>, accounting for future sprints without circling back to rework earlier ones.
          </p>
        </section>
      </main>
      {/* No NextProject: this case is not in that component's CASES list
          while it stays unlisted, so it has no neighbours to link to. */}
    </div>
  );
}
