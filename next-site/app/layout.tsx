import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";
import SmoothScroll from "@/components/SmoothScroll";
import ClickSound from "@/components/ClickSound";

/* ── Self-hosted fonts via next/font/local ─────────────────────────────
   All four typefaces are shipped with the site under /public/fonts/,
   eliminating the runtime dependency on Google Fonts. No CDN round-trip,
   no `Failed to fetch from Google Fonts` errors, offline-safe builds.
   Each font exposes a CSS variable on <html> that the :root token
   definitions in globals.css reference via var(--font-*).

   K2D dropped weight 300 (Light) — confirmed unused via grep. Italics
   retained (used by `.connect-pitch em`, `.rq-question`, `.about-prose
   em.it`, etc.). */

/** K2D — Thai-Latin geometric sans. Handles headings AND body text. */
const k2d = localFont({
  src: [
    { path: "../public/fonts/K2D/K2D-Regular.ttf",         weight: "400", style: "normal" },
    { path: "../public/fonts/K2D/K2D-Italic.ttf",          weight: "400", style: "italic" },
    { path: "../public/fonts/K2D/K2D-Medium.ttf",          weight: "500", style: "normal" },
    { path: "../public/fonts/K2D/K2D-MediumItalic.ttf",    weight: "500", style: "italic" },
    { path: "../public/fonts/K2D/K2D-SemiBold.ttf",        weight: "600", style: "normal" },
    { path: "../public/fonts/K2D/K2D-SemiBoldItalic.ttf",  weight: "600", style: "italic" },
    { path: "../public/fonts/K2D/K2D-Bold.ttf",            weight: "700", style: "normal" },
    { path: "../public/fonts/K2D/K2D-BoldItalic.ttf",      weight: "700", style: "italic" },
    { path: "../public/fonts/K2D/K2D-ExtraBold.ttf",       weight: "800", style: "normal" },
    { path: "../public/fonts/K2D/K2D-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
  ],
  variable: "--font-k2d",
  display: "swap",
});

/** JetBrains Mono — code-flavored labels and metadata. Weights 400 + 500
 *  cover every mono usage in the site (chips, meta, disclaimers). */
const jetbrainsMono = localFont({
  src: [
    { path: "../public/fonts/JetBrains_Mono/static/JetBrainsMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/JetBrains_Mono/static/JetBrainsMono-Medium.ttf",  weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

/** Caveat — handwriting accents (hero subtitle, design notes). Loaded
 *  from the static ttf files rather than the variable font, matching
 *  the original weight list (400 + 600). */
const caveat = localFont({
  src: [
    { path: "../public/fonts/Caveat/static/Caveat-Regular.ttf",  weight: "400", style: "normal" },
    { path: "../public/fonts/Caveat/static/Caveat-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-caveat",
  display: "swap",
});

/** Klee One — rounded handwriting-inspired serif for Japandi pull-quotes.
 *  Restricted to editorial callouts (case-study takeaways, opening
 *  pull-quotes) so it stays a distinct editorial voice rather than
 *  competing with the site's other display faces. */
const kleeOne = localFont({
  src: [
    { path: "../public/fonts/Klee_One/KleeOne-Regular.ttf",  weight: "400", style: "normal" },
    { path: "../public/fonts/Klee_One/KleeOne-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-klee",
  display: "swap",
});

/* Long Cang is excluded from next/font because its only Google Fonts
   subset is 'chinese-simplified', which next/font doesn't type-support.
   Instead it's loaded via a targeted <link> below with `text=李曦` —
   Google serves only those 2 glyphs (~2 KB), so the request is tiny.
   The --f-hand-zh token in globals.css uses the string name directly. */

/* Viewport meta — width=device-width prevents iOS Safari from rendering
   at the default 980px CSS width (which is why the hero was showing
   with cream margins on the sides — the whole page was scaled down to
   fit 980px into the actual viewport). maximumScale + userScalable let
   users still zoom for accessibility. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kathleenli.design"),
  title: {
    default: "Kathleen Li — Artist · Designer",
    template: "%s — Kathleen Li",
  },
  description:
    "Purdue UX undergrad with a design-engineering minor. Co-led a kiosk system adopted by Frogslayer; currently lead UI at Purdue Stack. Open to summer 2026 internships.",
  keywords: ["UX design", "design engineering", "product design", "Purdue", "Kathleen Li", "summer 2026 internship"],
  authors: [{ name: "Kathleen Li" }],
  openGraph: {
    type: "website",
    title: "Kathleen Li — Artist · Designer",
    description:
      "Purdue UX undergrad. I prototype in code, sketch on iPad, and live in Figma. Open to summer 2026 internships.",
    siteName: "Kathleen Li",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Kathleen Li — Artist · Designer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kathleen Li — Artist · Designer",
    description:
      "Purdue UX undergrad. Co-led kiosk system at Frogslayer. Lead UI at Purdue Stack. Summer 2026 internships.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    k2d.variable,
    jetbrainsMono.variable,
    caveat.variable,
    kleeOne.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <head>
        {/* Long Cang — targeted load for 李曦 only (~2 KB, 2 glyphs) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Long+Cang&text=%E6%9D%8E%E6%9B%A6&display=swap"
        />
        {/* No-JS fallback — .reveal / .reveal-stagger start opacity:0 and
            wait for RevealOnScroll's IntersectionObserver to add .in.
            Without JS the class never lands, so content stays invisible.
            Same for the footer's opacity gate. This <noscript> block
            forces everything visible so the page is still readable when
            JavaScript is disabled. */}
        <noscript>
          <style>{`
            .reveal, .reveal-stagger > *, .foot.foot--armed { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
      </head>
      <body>
        {/* Skip link — first focusable element on every page. Lets
            keyboard users jump past the nav directly to the page's
            primary content. Each route's <main> carries id="main". */}
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        {children}
        <SmoothScroll />
        <CursorFollower />
        <ClickSound />
      </body>
    </html>
  );
}
