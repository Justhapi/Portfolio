import HeroV2 from "@/components/HeroV2";
import ProjectsV2 from "@/components/ProjectsV2";
import AboutV2 from "@/components/AboutV2";
import ConnectV2 from "@/components/ConnectV2";
import SiteNavV2 from "@/components/SiteNavV2";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      <SiteNavV2 />
      <main id="main" className="portfolio-v2">
        <HeroV2 />
        <ProjectsV2 />
        {/* ac-scene: Connect is the sticky background layer, About is the
            absolute foreground that starts on top and slides off, revealing
            Connect. Connect must come FIRST in DOM so it has a valid sticky
            range (same reason Hero comes before Work). JS sets scene height
            = aboutH + connectH so About has room to fully scroll off. */}
        <div className="ac-scene">
          <ConnectV2 />
          <AboutV2 />
        </div>
      </main>
      <RevealOnScroll />
    </>
  );
}
