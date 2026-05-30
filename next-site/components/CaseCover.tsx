export default function CaseCover({
  title,
  meta,
  subtitle,
  imageLabel = "cover image",
  kicker,
}: {
  title: string;
  meta: string;
  subtitle: string;
  imageLabel?: string;
  /** Optional Caveat handwriting kicker above the title — e.g. "from the folder" or "Project 01". Carries the home page's handwriting vocabulary into the case cover so the two pages feel co-authored. */
  kicker?: string;
}) {
  return (
    <header className="case-cover">
      <div className="case-cover-inner">
        {kicker && <div className="case-kicker">{kicker}</div>}
        <h1 className="case-title">{title}</h1>
        <div className="case-meta">{meta}</div>
        <div className="case-subtitle">{subtitle}</div>
        <div className="case-hero-image">
          <div className="image-slot">{imageLabel}</div>
        </div>
      </div>
    </header>
  );
}
