import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kathleen Li — Designer",
  description:
    "Artist turned systems designer — I build interfaces that feel as good as they look.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
