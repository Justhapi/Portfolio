import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";
import CaseFilmstrip from "@/components/CaseFilmstrip";

import briefImg from "./images/Feenix_Project_Introduction.png";
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
            To branch out to Minecraft, Feenix Group partnered with Purdue&rsquo;s Data 
            Mine Corporate Partners to build a Minecraft server hosting and management platform.
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
             During the project I worked as the UX designer and Frontend Developer,{" "}
            designing the end-to-end information architecture, user flows, and interface design
            while implementing the frontend components.
            <br/><br/>
            While designing, I actively collaborated with cross-functional teams (Data, backend, infrastructure) to 
            balance design and technical (sometimes leagal) constraints.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Competitor Auditing</h2>
            To familiarize myself with Minecraft Server Hosting platforms, I assessed two competitors to 
            better understand how to design the server features requested by Feenix: 
            <br></br><br></br>
            <ul>
              <li>Aternos</li>
              <li>Play.Hosting</li>
            </ul>
          <h3>Competitor Accounts and Server Creation Flows</h3>
            While exploring the competitors, I <strong>went through the sign-in, server creation, 
            and server management flows,</strong> understanding the basic structure of what a Minecraft
            server hosting platform needs for a user regarding personal account and server creation.

          <CaseFilmstrip
            label="Competitor Sign-in and Server Creation Flows"
            shots={[
              { key: "competitor-sign-in", img: competitorSignIn, label: "Both platforms' Sign-in", alt: "Sign-in screens from Aternos and play.hosting side by side." },
              { key: "aternos-server", img: aternosServer, label: "Aternos dashboard", alt: "The Aternos server dashboard." },
              { key: "play-hosting-server", img: playHostingServer, label: "play.hosting dashboard", alt: "The play.hosting server dashboard." },
            ]}
          />

          I was also able to identify pain points, needed UI modifications, inter-team collaborations, and oppurtunity gaps 
          for the platform, particularly in server seed modification.
          <h3>Competitor Server Maintenance Features</h3>
          <CaseFilmstrip
            label="Competitor Server Maintenance Features"
            minWidth={500}
            align="right"
            side={
              <>
                While exploring both competitor's server maintenance-related features, I
                identified their relation to a feature directly requested by Feenix. Aternos had 10 features 
                varying in overlap while Play.Hosting had 7 features that sometimes overlapped.
                <br></br><br></br>
                From this, I was condensed the competitor overlaps and Feenix requests down to 6 maintenance features:
                <ul className="feature-list">
                  <li>Console : Server runtime controls (Start/Stop/Restart), Live server logs, CPU and RAM metrics</li>
                  <li>World: World properties, seed, and minor server settings</li>
                  <li>Players: White list, ban list, operators, and banned IPs controls and management</li>
                  <li>Admin: Platform admin permission and access</li>
                  <li>Backup: World file backup, cloud sync, and revision history</li> 
                  <li>Software: Server engines (Vanilla, Paper, Forge, Fabric), plugins, and modpacks</li>
                </ul>
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
          <CaseFilmstrip
            label="Account Creation"
            minWidth={450}
            align = "right"
            side={
              <>
              <h3>Account Creation Flow</h3>
              For the account creation flow, I assessed the competitors' and general account creation 
              flows before creating a quick sketch of the account creation page. 
              <br></br><br></br>
              When reviewing the designs, I pitched the authenication options: 
              <br></br><br></br>
              <ul>
                <li>Google due to being standard accoutn ubiquity</li>
                <li>Microsoft due to Minecraft account's integration within Microsoft</li>
                <li>Discord due to being commonly used within the gaming setting</li>
              </ul>
              <br></br><br></br>
              Following cross-team pitching and feedbacks, I refined the flows to
              address the following feedback of specifics in regards:
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

          <h3>Account Log in and Recovery Flow</h3>
          <CaseFilmstrip
            label="Log in, recovery and the auth flow"
            side={
              <>
                After confirming that the hosting dashboard would launch as a standalone platform, 
                I designed the login page to serve a dual purpose: enabling returning users 
                to sign in quickly while introducing new visitors to Feenix’s platform capabilities 
                and recent updates.
              </>
            }
            shots={[
              { key: "login-sketch", img: loginSketch, label: "Log in sketch", alt: "Hand sketch of the log in screen." },
              { key: "account-recovery-sketch", img: accountRecoverySketch, label: "Recovery sketch", alt: "Hand sketch of the account recovery screens." },
            ]}
          />

          <h3>Account Login, Creation, and Recovery Wireframes</h3>
          From the sketches, I constructed the base wireframes while applying the design system provided by Feenix.
          <CaseFilmstrip
            label="Auth flow wireframes"
            shots={[
              { key: "create-account-flow-wireframe", img: createAccountFlowWire, label: "Create account flow", alt: "Wireframe of the full create account flow." },
              { key: "recover-account-flow-wireframe", img: recoverAccountFlowWire, label: "Recover account flow", alt: "Wireframe of the full account recovery flow." },
              { key: "captcha-integration", img: captchaIntegration, label: "Integration of Captcha", alt: "Integration of Captcha visiblew on local host" },
            ]}
          />
          Some time after implementation of the frontend, my teammates were able to successfully implement the 
          captcha and there was an additional request to add an minimum age confirmation, prompting minor reformatting.
          <h3>Platform Server Creation Flow</h3>

          <CaseFilmstrip
            label="Working out what a server needs"
            align="right"
            side={
              <>
                For the server creation flow, I simplfiied the competitor server creation flow 
                stages to ideate the Feenix platform flow.
                <br></br><br></br>
                Specifically, the world modification stage would allow modifications to the world 
                through the server seed or blueprints of biomes and custom buildings. 
                The user would also be able to preview the world through a small map view of the 
                world's spawnpoint's surroundings.
                <br></br><br></br>
                When the idea was pitched, both Hari and Calvin approved of the feature, though they 
                noted that the focus of this feature is more aligned with phase 2. Thankfully, due to
                the server creation flow stages being on separate pages, we were able to continue with
                the ideated flow minus the world modification section.
              </>
            }
            shots={[
              { key: "server-creation-ideation", img: serverCreationIdeation, label: "Feature inventory", alt: "Sticky-note board listing what a server needs: address, privacy, whitelist, admins, blueprint, backup, world seed." },
              { key: "server-creation-flow-sketch", img: serverCreationFlowSketch, label: "Flow sketch", alt: "Hand sketch of the server creation flow across its pages." },
            ]}
          />
          <h3>Sidebar Navigation</h3>
          <CaseFilmstrip
            label="Sidebar Process"
            align = "right"
            side={
              <>
                Due to the platform needing quick maintenance features access and 
                competitors' navigation bar leading to maintenance features, 
                I opted to design Feenix's platform's navigation to also be a sidebar with the 
                order of features being determined by inference of consistent usage.
                <br></br><br></br>
                While the base format was simple to determine, the feature design was more
                difficult to decide on. Ultimately, I decided to reference Discord's dual 
                tier side bar as it provided formatting for individual server maintenance features 
                and inter-server navigation.
                <ul>
                  <li>Primary strip navigates between servers where the user is the owner or an admin</li>
                  <li>Secondary strip navigates between server maintenace features for the currently selected server</li>
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

          <h3>Initial Maintenance Feature Sketches</h3>
          With the side bar navigation determined, I the moved on to integrate the 6 maintenance features, implementing
          the base functionality while designing based off of competitors like Aternos's console.
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

          <h3>Refinement to Sketches</h3>
          <CaseFilmstrip
            label="Six sections, resolved"
            side={
              <>
                After the base sketches were made and pitched to the rest of the team, feedback in regards to
                information hierachy and additional features were given, prompting small iterations to specific feature pages.
                <br></br><br></br>
                <ul>
                  <li>Accounting for specific usage cases such as server failure to run</li>
                  <li>Boxing elements to better organize relation</li>
                  <li>Icons as buttons for specific features like individual player permissions</li>
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

          <h3>Server Maintenance Prototyping</h3>
          <CaseFilmstrip
            label="Section wireframes"
            align ="right"
            side={
              <>
                To verify if the ideated platform is user friendly, I utilized Figma Make 
                to quickly construct an interactive prototype that is reflective in the 
                feature implementation and formatting. During testing, I asked users 
                varying in familiarity with server hosting to navigate competitor
                platforms and then the prototype through tasks I assigned them.
                <br></br><br></br>
                The tasks were assigned with scenarios that included the following:
                <br></br><br></br>
                <ul>
                  <li>You just successfully created your account, create your own server with the following settings</li>
                  <li>After creating the server, you want to explore the server before inviting others</li>
                  <li>Due to realizing your server's version was not the correct version, you opted to get it changed</li>
                  <li>Since this server is planned to be used for a while, you prepare the server files to be automatically backed up</li>
                  <li>Now that your server is ready, you started adding your friends' usernames in</li>
                  <li>Due to a player griefing your server, ban them for a week</li>
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
                After a user finishes the following tasks in all three platforms, I then 
                probed for feedback on either the competitors or prototype, specifically 
                any moments of struggles and what they would have wanted to better overcome the
                obstacle.
                <br></br>
                <h3>Tester Feedback</h3>
                Overall, testers identified the prototype as the strongest in user guidance and 
                navigation as it avoided competitor pain points like Aternos's overabundance of
                information assistance, Play.hosting'sinstances of bottlenecking feature access,
                and overall feature naming confusion.
                <br></br><br></br>
                Testers also appreciated the world modification stage as it would allow them to
                ensure the world is tailored to their preference and quickly identify if they wanted
                to modify the world seed.
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

          <h3>Iterations</h3>
          <p>
            Most of the changes requested by testers were regarding formatting
            and placements of elements, prompting the following iterations:
          </p>
          <FeedbackList
            label="Tester feedback and the iterations it prompted"
            items={[
            ["Creation buttons were too far apart", "Combining the creation of server with and without server into one button"],
            ["What if I were to want to add a specific biome AND building?", "Add ability to select either types of blueprint options (Biomes and Custom Buildings)"],
            ["I fear for moments where I don't understand the server issue", "Simplify technical terms of server running errors"],
            ["I almost didn't notice the create server button", "Improve visibility of general server creation and server running"],
            ]}
          />
          <p>
            During the general user testing, Calvin, Hari, and my teammates within other teams also reviewed
            the prototype and raised their technical concerns that also resulted in the following iterations:
          </p>
          <FeedbackList
            label="Technical feedback from the team and the iterations it prompted"
            items={[
            ["Since the console is planned to track logs of events and actions, including the ability to enact commands and messages are possible too", "Add platform-server communication"],
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
          <h3>Third-Party Seed Previewing Iteration</h3>
          <p>
            In addition to minor reformatting, the core technical feedback from the
            team were concerns of the spawnpoint mapping as questions were raised
            on commercial use limitations.
          </p>
          <p>
            As a result, a brief research on third-party Minecraft seed preview
            platforms was conducted, leading to identification of Chunkbase. Building
            off of this, I revised the world maintenace feature and world settings
            feature to account for the seed preview alterations in addition to minor feedback.
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

          <h3>Sprint Scope Limiting</h3>
          <p>
            Due to the nature of the project requiring me to design while contributing to the
            implementations, I often needed to tweak the scope and focus of my design sprints.
          </p>
          <p>
            For example, the starting sprint focus for the entire team was the account creation and
            login. Due to this, my design sprint focused solely on assessing competitor instances of the
            aforementioned features before designing the Feenix platform's version and implementing the
            front end into the codebase.
          </p>
          <p>
            Despite the sprint limiting scope and allow focus on sprint goals to slowly achieve the
            overarching goal of constructing Feenix's Minecraft server hosting platform, I found that I
            was able to <mark className="hl">more effectively design by briefly assessing other aspects
            of the project</mark> to actively account for future sprints goals without needing to go
            back and review previous works.
          </p>
        </section>
      </main>
      {/* No NextProject: this case is not in that component's CASES list
          while it stays unlisted, so it has no neighbours to link to. */}
    </div>
  );
}
