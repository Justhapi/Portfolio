import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";
import ZoomableImage from "@/components/ZoomableImage";

import briefImg from "./images/Feenix_Project_Introduction.png";


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
        title="Structuring a Minecraft Server Hosting Platform for Players of Any Experience"
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
            Before wireframing, I defined the purpose of each of the platform&rsquo;s six sections,
            so deciding where a feature belonged came down to what each section was for.
            <br /><br />
            The sections sit inside a{" "}
            dual-tier navigation similar to Discord&rsquo;s, with a server list
            down the side and each server&rsquo;s sections across the top. The account and
            server-creation flows were then built around it.
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
            Currently, Feenix Group is branching out to Minecraft through collaborating the team I was a part of in Purdue&rsquo;s Data 
            Mine Corporate Partners to build a Minecraft server hosting platform.
          </p>
          <Z img={briefImg} alt="Project brief board with the platform description and user assumptions on sticky notes."
             caption={<>The project brief, split into what the platform needs to let users do and who we assumed the users were.</>} />
          <h3>My Role</h3>
          <p>
             During the project I worked as the UX lead on the Frontend team,{" "}
            owning the information architecture, user flows, and interface's design and frontend implementation.
            <br/><br/>
            While designing, I actively collaborated with the other teams (Data, backend, infrastructure) to gauge feasbility and limitations
            of functions within the designs.
          </p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Researching</h2>
          <h3>Auditing Two Competitors</h3>
          <p>
            During sponsor meetings and from the, Hari, the sponsor's _____, named Aternos, another Minecraft server 
            hosting platform, to reference off of and a teammate also mentioned Play.Hosting.
            <br></br><br></br>
            Within each platform, I audited flows regarding server creation and maintenance to understand better Feenix's 
            requested features regarding the following:
            <br></br>
            <ul>
              <li>Functionality</li>
              <li>Additional opportunity gaps (addressed or left open by the competitors)</li>
            </ul>
          </p>

          <>

              <h3>Where Their Structures Fell Short</h3>
              <p>
                Both platforms put platform permissions and in-game player lists under labels that
                don&rsquo;t tell them apart.
                <br /><br />
                On Aternos, a tester looking for the whitelist went to <strong>Access</strong>, which is
                actually for sharing the account. On play.hosting, platform access was under{" "}
                <strong>Sub users</strong>, a term neither tester recognized, and one had to be told where it was.
              </p>

            </>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Designing</h2>
          <h3>Defining a Purpose for Each Section</h3>
          <p>
            Before wireframing, I wrote one line stating what each section is for.
            Those six lines then decided where every feature went.
          </p>


          <h3>Referencing a Navigation Users Already Know</h3>
          <p>
            Our users use Discord daily, so I based the navigation on Discord&rsquo;s: a
            server list down the side, with each server&rsquo;s sections across the top. Since users
            already know how it works, <mark className="hl">they wouldn&rsquo;t need to learn a new pattern</mark>.
          </p>


          <h3>Wireframing the Six Sections</h3>

        </section>

        {/* ───── Testing ───── */}
        <section id="testing" className="case-section">
          <h2>Testing</h2>
          <h3>Testing the Structure</h3>
          <p>
            I ran usability tests with two testers of opposite experience levels. Each
            did the same six tasks on Aternos, play.hosting, and our prototype.
            <br /><br />
            The tasks were picked to cross between sections, so finding
            something like the Minecraft version also tested whether the structure put it where they&rsquo;d
            look. On Aternos, one tester couldn&rsquo;t find it at all:{" "}
            &ldquo;I&rsquo;m not seeing anything that says version.&rdquo;
          </p>

          <h3>Shaping Server Creation</h3>


          <h3>What Testers Liked</h3>
          <p>
            Testers saw fewer sections as an improvement,{" "}
            &ldquo;I like that there are fewer tabs here&rdquo;, and recognized the server
            list right away.
            <br /><br />
            One tester also pointed out that <mark className="hl">separating platform admins from the player list</mark>{" "}
            fixed what had confused them on the competitors.
          </p>
        </section>

        {/* ───── Takeaways ───── */}
        <section id="takeaways" className="case-section">
          <h2>Takeaways</h2>
          <h3>Naming Decides Structure</h3>
          <p>
            While auditing, I noticed that{" "}
            <mark className="hl">every structural problem on both competitors started as a naming problem.</mark>{" "}
            Operator, whitelist, access, and sub users each stand for a real distinction the platform
            needs, but the words don&rsquo;t explain it.
            <br /><br />
            From this project, I learned that{" "}
            writing one sentence on what a section is for is what makes it
            possible to label it clearly.
          </p>
          <h3>Using What Users Already Know</h3>
          <p>
            Basing the navigation on Discord meant users didn&rsquo;t need to learn it, so{" "}
            their attention could go to the parts of the platform that are actually new to them,
            like versions, backups, and the difference between managing a server and playing on it.
          </p>
        </section>
      </main>
      {/* No NextProject: this case is not in that component's CASES list
          while it stays unlisted, so it has no neighbours to link to. */}
    </div>
  );
}
