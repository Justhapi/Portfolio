import CaseCover from "@/components/CaseCover";
import CaseSectionNav from "@/components/CaseSectionNav";

export const metadata = {
  title: "Pop — Product Design & Competitive Research — Kathleen Li",
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "researching", label: "Researching" },
  { id: "designing", label: "Designing" },
  { id: "credential", label: "Credential" },
  { id: "reflections", label: "Reflections" },
];

export default function InlineCaseStudy() {
  return (
    <div className="case">
      <CaseSectionNav sections={SECTIONS} />
      <CaseCover
        title="Pop — Product Design & Competitive Research"
        meta="Internship · Inline · Product Design & Research · 2026"
        subtitle="NDA-restricted — role and process only, no product detail"
        imageLabel="Pop · Inline internship"
      />

      <main className="case-body">
        {/* ───── Overview ───── */}
        <section id="overview" className="case-section">
          <h2>Overview</h2>

          <h3>Problem Scope</h3>
          <p>
            Pop is an early-stage product at Inline. I joined for an internship
            that ran across two tracks — <mark className="hl">competitive research</mark> and{" "}
            <mark className="hl">product design</mark> — feeding what the market was
            doing back into the product as it took shape. The work is covered by an
            NDA, so this page describes the <strong>shape of the engagement and my role</strong>{" "}
            rather than the product itself.
          </p>

          <h3>What I Owned</h3>
          <div className="case-image-row">
            <figure>
              <div className="image-slot">research track</div>
              <figcaption>
                The competitive research track — an abstract preview, NDA-friendly.
              </figcaption>
            </figure>
            <figure>
              <div className="image-slot">design track</div>
              <figcaption>
                The product design track, fed directly by the research signal.
              </figcaption>
            </figure>
          </div>
          <p>
            Across the internship I <mark className="hl">audited the competitive
            landscape</mark> and <mark className="hl">translated those findings into
            design work</mark> — moving between the research and the screens so the
            two stayed in conversation rather than running as separate exercises.
          </p>
          <p className="case-placeholder">— product specifics, metrics, and screens withheld under NDA</p>
        </section>

        {/* ───── Researching ───── */}
        <section id="researching" className="case-section">
          <h2>Mapping the competitive landscape</h2>
          <p>
            My research track centered on competitive analysis. I built a working
            picture of the products adjacent to Pop — what they did well, where they
            left users wanting, and which patterns had quietly become table stakes.
          </p>
          <p>
            Rather than a one-off scan, I set the audit up as something the team
            could keep returning to: a <mark className="hl">structured comparison
            framework</mark> that made it easy to slot in a new competitor and read
            where Pop stood at a glance.
          </p>
          <p>
            The output that mattered most wasn&rsquo;t the list of competitors — it
            was the <mark className="hl">gaps between them</mark>, the spots where no
            one had a strong answer yet and the design had room to do something new.
          </p>
          <div className="case-image-grid">
            <figure>
              <div className="image-slot">competitive matrix</div>
              <figcaption>Competitive matrix</figcaption>
            </figure>
            <figure>
              <div className="image-slot">feature comparison</div>
              <figcaption>Feature comparison</figcaption>
            </figure>
            <figure>
              <div className="image-slot">opportunity gaps</div>
              <figcaption>Opportunity gaps</figcaption>
            </figure>
            <figure>
              <div className="image-slot">market notes</div>
              <figcaption>Market notes</figcaption>
            </figure>
          </div>
          <p className="case-placeholder">— competitor names and findings withheld under NDA</p>
        </section>

        {/* ───── Designing ───── */}
        <section id="designing" className="case-section">
          <h2>Turning research into design</h2>
          <p>
            On the design track I took the research signal and pushed it toward the
            product — sketching directions, exploring UI options, and iterating with
            the team on what felt right for Pop&rsquo;s stage.
          </p>
          <p>
            Holding both tracks meant the design decisions stayed{" "}
            <mark className="hl">anchored to evidence</mark>: where a competitor had
            already set a user expectation, the design either met it deliberately or
            broke from it deliberately — never by accident.
          </p>
          <figure>
            <div className="image-slot">design exploration</div>
            <figcaption>
              An abstract preview of the design exploration (NDA-friendly).
            </figcaption>
          </figure>
          <p className="case-placeholder">— screens and product detail withheld under NDA</p>
        </section>

        {/* ───── Credential ─────
            The image-slot below is a placeholder. To show the real
            certificate, replace the <div className="image-slot"> line
            with an <img> — e.g. drop the scan into next-site/public/ and
            use <img src="/inline-certificate.jpg" alt="Inline internship
            certificate" />. Confirm the scan carries no NDA-covered
            detail before publishing. */}
        <section id="credential" className="case-section">
          <h2>Credential</h2>
          <p>
            Inline issued an <mark className="hl">internship certificate</mark> on
            completion of the engagement. It&rsquo;s included here as independent
            verification of the role and dates — no confidential product
            information involved.
          </p>
          <figure>
            <div className="image-slot">internship certificate</div>
            <figcaption>
              Internship certificate issued by Inline — verification of the role
              and dates.
            </figcaption>
          </figure>
        </section>

        {/* ───── Reflections ───── */}
        <section id="reflections" className="case-section">
          <h2>Reflections</h2>
          <p>
            The internship&rsquo;s real lesson was about <mark className="hl">sequence</mark>:
            research is most useful when it lands <em>before</em> the design
            questions get asked, not after. Holding both tracks myself made that
            obvious — every time the competitive picture sharpened, the design got
            faster and less precious.
          </p>
          <p>
            It also reset how I think about competitive work. A competitor audit
            isn&rsquo;t a verdict on who&rsquo;s winning; it&rsquo;s a{" "}
            <mark className="hl">map of where the open questions are</mark> — and
            those open questions are exactly where the design gets to contribute
            something of its own.
          </p>
        </section>
      </main>
    </div>
  );
}
