import HeroVideo from "./HeroVideo";

export default function CaseCover({
  title,
  meta,
  subtitle,
  imageLabel = "cover image",
  kicker,
  hideHero = false,
  heroVideoSrc,
  heroVideoPoster,
}: {
  title: string;
  meta: string;
  subtitle: string;
  imageLabel?: string;
  /** Optional Caveat handwriting kicker above the title — e.g. "from the folder" or "Project 01". Carries the home page's handwriting vocabulary into the case cover so the two pages feel co-authored. */
  kicker?: string;
  /** Suppress the hero image slot — used when NDA or other constraints prevent showing visuals. */
  hideHero?: boolean;
  /** When provided, render a looping muted autoplay video as the hero
   *  instead of the placeholder image slot. Pass an ES-imported .webm
   *  / .mp4 asset (e.g. `import cover from './Cover.webm'` → pass
   *  `cover` here — webpack's asset/resource loader outputs a string
   *  URL). */
  heroVideoSrc?: string;
  /** Optional still image shown before the video loads / as fallback for
   *  browsers that don't support the video format. */
  heroVideoPoster?: string;
}) {
  return (
    <header className="case-cover">
      <div className="case-cover-inner">
        {kicker && <div className="case-kicker">{kicker}</div>}
        <h1 className="case-title">{title}</h1>
        <div className="case-meta">{meta}</div>
        <div className="case-subtitle">{subtitle}</div>
        {!hideHero && (
          <div className="case-hero-image">
            {heroVideoSrc ? (
              <HeroVideo
                src={heroVideoSrc}
                poster={heroVideoPoster}
                label={imageLabel}
              />
            ) : (
              <div className="image-slot">{imageLabel}</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
