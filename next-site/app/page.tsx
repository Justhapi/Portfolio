import GlassShapes from "@/components/GlassShapes";
import Hero from "@/components/Hero";
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
        {/* Hero — port of Home/index.html from Justhapi/Portfolio
            (dark left + peek-window with char.gif) */}
        <Hero />

        {/* About me — hand-lettered teal sketchbook section. */}
        <AboutMe />

        {/* Folder-stack project carousel — Framer-port faithful */}
        <ProjectCarousel />

        {/* Status Check — current-tasks progress sketch. */}
        <StatusCheck />

        {/* Slate-blue ready-check footer */}
        <div id="footer">
          <FooterConnect />
        </div>
      </main>
    </>
  );
}
