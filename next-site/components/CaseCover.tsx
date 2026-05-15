export default function CaseCover({
  title,
  meta,
  subtitle,
  imageLabel = "cover image",
}: {
  title: string;
  meta: string;
  subtitle: string;
  imageLabel?: string;
}) {
  return (
    <header className="case-cover">
      <div className="case-cover-inner">
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
