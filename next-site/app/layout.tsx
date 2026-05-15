import type { Metadata } from "next";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";

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
  return (
    <html lang="en">
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
        <CursorFollower />
      </body>
    </html>
  );
}
