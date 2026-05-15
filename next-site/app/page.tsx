import HeroV2 from "@/components/HeroV2";
import ProjectsV2 from "@/components/ProjectsV2";
import AboutV2 from "@/components/AboutV2";
import LearningsV2 from "@/components/LearningsV2";
import ConnectV2 from "@/components/ConnectV2";
import SiteNavV2 from "@/components/SiteNavV2";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      <SiteNavV2 />
      <main className="portfolio-v2">
        <HeroV2 />
        <ProjectsV2 />
        <AboutV2 />
        <LearningsV2 />
        <ConnectV2 />
      </main>
      <RevealOnScroll />
    </>
  );
}
