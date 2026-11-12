import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { DocsLayout } from "@/components/layout/docs-layout";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MatchForge — String Matching Toolkit",
    template: "%s | MatchForge",
  },
  description:
    "An open-source TypeScript toolkit for string similarity, text normalization, and record matching.",
  keywords: [
    "MatchForge",
    "String Similarity",
    "Record Matching",
    "Entity Resolution",
    "TypeScript",
  ],
  authors: [{ name: "MatchForge" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <NextTopLoader
          color="#286B49"
          height={3}
          showSpinner={false}
          crawlSpeed={200}
          speed={300}
          shadow={false}
        />
        <DocsLayout>
          <Navbar />
          {children}
          <Footer />
        </DocsLayout>
      </body>
    </html>
  );
}
