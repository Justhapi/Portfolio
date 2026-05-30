import type { Metadata } from "next";
import { K2D, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";
import SmoothScroll from "@/components/SmoothScroll";

/* ── Google Fonts via next/font ────────────────────────────────────────────
   Self-hosted at build time — no render-blocking @import, no Google DNS
   round-trip, automatic size-adjust fallbacks to minimise layout shift.
   Each font exposes a CSS variable on <html> that the :root token
   definitions in globals.css reference via var(--font-*). */

/** K2D — Thai-Latin geometric sans. Handles headings AND body text. */
const k2d = K2D({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-k2d",
  display: "swap",
});

/** JetBrains Mono — code-flavored labels and metadata. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/** Caveat — handwriting accents (hero subtitle, design notes). */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-caveat",
  display: "swap",
});

/* Long Cang is excluded from next/font because its only Google Fonts
   subset is 'chinese-simplified', which next/font doesn't type-support.
   Instead it's loaded via a targeted <link> below with `text=李曦` —
   Google serves only those 2 glyphs (~2 KB), so the request is tiny.
   The --f-hand-zh token in globals.css uses the string name directly. */

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
  const fontVars = [k2d.variable, jetbrainsMono.variable, caveat.variable].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <head>
        {/* Long Cang — targeted load for 李曦 only (~2 KB, 2 glyphs) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Long+Cang&text=%E6%9D%8E%E6%9B%A6&display=swap"
        />
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
      </body>
    </html>
  );
}
