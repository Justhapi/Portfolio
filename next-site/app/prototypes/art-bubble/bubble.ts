/**
 * Shared content and the program icons, so every variant differs only
 * in the bubble's shape — not in what it holds.
 *
 * The tail points down-left on purpose: the art popup is positioned
 * up-and-right of the cursor (placePill in HoverBag.tsx puts the cursor
 * at the popup's bottom-left corner), so down-left is where the iPad
 * being hovered actually is. A thought bubble that trails off towards
 * nothing would undercut the whole metaphor.
 */
export const ART_META = "doodles of college to rmr";
export const ART_LINE =
  "I like to capture memories through sharing my vision with others";

export const TOOLS = [
  { name: "Procreate", src: "/img/bag/pop_up/doodles/Procreate.webp" },
  { name: "Clip Studio Paint", src: "/img/bag/pop_up/doodles/CSP.webp" },
];
