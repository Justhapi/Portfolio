/**
 * CaseEquation — writes a before/after pair as an arithmetic statement:
 * base + N = result.
 *
 * Built for the inline case study, where both pairs of artifacts are very
 * wide (2.2:1 to 3.5:1) and blurred for NDA. Stating the relationship as a
 * sum does something the two images alone can't: it says what was ADDED
 * between them, which is the part a blurred screenshot can never show.
 *
 * Two layout facts worth keeping if this is ever edited:
 *
 * 1. THE MARKUP IS TERM-MAJOR — image, its caption, operator, addend, its
 *    caption, operator, image, its caption. That ordering is what makes the
 *    stacked (narrow) layout correct with no extra work: it simply follows
 *    the source, so each caption stays under the thing it describes.
 *
 * 2. THE WIDE LAYOUT DOESN'T USE THAT ORDER. Every cell is placed by an
 *    explicit `grid-area` in globals.css, which is what lets the operators
 *    sit on the image row while captions sit on the row beneath without
 *    reordering the markup. If you ever place these by source order
 *    instead, the stacked view strands all three captions at the bottom.
 *
 * The operators living on the image row is also what puts the + and = at
 * the images' optical centre rather than at the centre of an
 * image-plus-caption block — done structurally so it stays right when a
 * caption wraps.
 */

type Term = {
  src: string;
  alt: string;
  caption: React.ReactNode;
};

export default function CaseEquation({
  base,
  count,
  addendLabel,
  result,
}: {
  base: Term;
  /** How many things were added between the two states. */
  count: number;
  addendLabel: string;
  result: Term;
}) {
  return (
    <figure className="case-eq">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="case-eq__img case-eq__at-base"
        src={base.src}
        alt={base.alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="case-eq__cap case-eq__at-basecap">{base.caption}</figcaption>

      <span className="case-eq__glyph case-eq__at-op1" aria-hidden="true">+</span>

      <span className="case-eq__count case-eq__at-addend">{count}</span>
      <figcaption className="case-eq__cap case-eq__at-addcap">{addendLabel}</figcaption>

      <span className="case-eq__glyph case-eq__at-op2" aria-hidden="true">=</span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="case-eq__img case-eq__at-result"
        src={result.src}
        alt={result.alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="case-eq__cap case-eq__at-resultcap">{result.caption}</figcaption>
    </figure>
  );
}
