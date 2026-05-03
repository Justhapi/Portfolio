import GlassShapes from "@/components/GlassShapes";
import Hero from "@/components/Hero";
import SiteNav from "@/components/SiteNav";
import ProjectCarousel from "@/components/ProjectCarousel";
import FooterConnect from "@/components/FooterConnect";
import AboutMe from "@/components/AboutMe";
import StatusCheck from "@/components/StatusCheck";

export default function Home() {
  return (
    <>
      {/* Glasslike parallax shapes — placeholders until SVGs land. */}
      <GlassShapes />

      <main className="page-shell">
        {/* Hero — sticky-note business card on a dark spotlight stage.
            Sized so it shares the first viewport with SiteNav (height
            is calc(100vh - var(--nav-h)) on .hero, see Hero.tsx). */}
        <Hero />

        {/* Sticky navigation — sits between hero and projects in
            document flow, then sticks to the top of the viewport
            once the user scrolls past it. */}
        <SiteNav />

        {/* Project Inventory — bounded card with folder carousel. */}
        <ProjectCarousel />

        {/* Status Check — current-tasks progress sketch. */}
        <StatusCheck />

        {/* About me — hand-lettered teal sketchbook section. */}
        <AboutMe />

        {/* Slate-blue ready-check footer */}
        <div id="footer">
          <FooterConnect />
        </div>
      </main>
    </>
  );
}
