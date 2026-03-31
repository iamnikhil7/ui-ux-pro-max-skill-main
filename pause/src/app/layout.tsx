import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAUSE \u2014 Your Behavioral Intelligence Layer",
  description: "Discover your behavioral archetype and build lasting change through intelligent interception.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
