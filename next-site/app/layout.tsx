import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";
import SmoothScroll from "@/components/SmoothScroll";
import ClickSound from "@/components/ClickSound";
import Clarity from "@/components/Clarity";

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
  /* Latin-subset woff2, not the shipped .ttf. Klee One is a Japanese face
     carrying full CJK coverage — 15.3 MB across these two weights — and the
     site only ever renders Latin in it (pull-quotes, editorial callouts via
     --f-quote). The one place CJK appears on the site is the name 妤𣎮,
     which uses its own Long Cang subset + SVG (ZhName.tsx), not this. Subsetting to Latin + punctuation takes
     it to 235 KB, a 98.5% cut, with no visible change.
     Regenerate with fontTools if the quote styles ever need more glyphs. */
  src: [
    { path: "../public/fonts/Klee_One/KleeOne-Regular-latin.woff2",  weight: "400", style: "normal" },
    { path: "../public/fonts/Klee_One/KleeOne-SemiBold-latin.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-klee",
  display: "swap",
});

/* The Chinese name (components/ZhName.tsx) uses a self-hosted one-glyph
   Long Cang subset for 妤 (preloaded below) plus an SVG for 𣎮. */

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
        {/* Long Cang — one-glyph subset for 妤 in the Chinese name (~2 KB) */}
        <link rel="preload" href="/fonts/LongCang/long-cang-yu.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
        {/* Analytics last — it's the only thing here that isn't part of
            the experience, and it self-disables in development. */}
        <Clarity />
      </body>
    </html>
  );
}
