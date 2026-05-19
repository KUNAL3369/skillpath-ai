import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillPath AI - AI Career Gap Analyzer & Skill Roadmap Generator",
  description:
    "Analyze your career gaps and generate personalized skill roadmaps with AI. Identify critical skills, get actionable learning plans, and accelerate your career growth.",
  keywords: [
    "career analyzer",
    "skill gap",
    "AI career coach",
    "roadmap generator",
    "job preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          minHeight: "100vh",
        }}
      >
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
