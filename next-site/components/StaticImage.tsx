/**
 * StaticImage — non-interactive image with the same visual frame + caption
 * treatment as ZoomableImage. Use for visuals whose content is already
 * legible at default rendered size (blurred boards with enlarged category
 * headers, framework diagrams, summary artifacts).
 *
 * Rules of thumb for choosing StaticImage vs ZoomableImage:
 *   - StaticImage: content is summary/framework, no reward for zooming in
 *     (would just reveal more blur). Recruiter should absorb it in one look.
 *   - ZoomableImage: content has real detail worth close inspection
 *     (sketches, wireframes, prototype screens, guideline documents).
 *
 * Visual container matches ZoomableImage exactly — same max-height,
 * aspect-ratio sizing, cream paper background, caption placement — so
 * static and interactive images sit side-by-side coherently across a
 * case study.
 */

type Props = {
  src: string;
  alt: string;
  /** Aspect ratio of the source image (w/h). Frame is sized to match so
   *  no letterboxing occurs. */
  aspectRatio?: number;
  caption?: React.ReactNode;
};

export default function StaticImage({
  src,
  alt,
  aspectRatio = 4 / 3,
  caption,
}: Props) {
  return (
    <div className="zoomable-wrap">
      <div
        className="zoomable-frame is-static"
        style={{
          aspectRatio: `${aspectRatio}`,
          /* Match ZoomableImage's portrait-aspect max-width trick so
             tall images shrink their frame rather than letterboxing.
             62vh cap prevents any single image from dominating the
             viewport. */
          maxWidth: `min(100%, calc(62vh * ${aspectRatio}))`,
          cursor: "default",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="zoomable-img is-static"
          draggable={false}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </div>
  );
}
