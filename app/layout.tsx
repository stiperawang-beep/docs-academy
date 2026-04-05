import type { Metadata } from "next";
import { Geist, Geist_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import "./print.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { KeyboardShortcutsModal } from "@/components/keyboard-shortcuts";
import { AmbientMesh } from "@/components/ambient-mesh";

export const metadata: Metadata = {
  title: "victory.docs — Modern Documentation Platform",
  description: "High-performance, beautiful documentation platform built with Next.js 15, Velite MDX, and Tailwind CSS.",
  keywords: ["docs", "tutorial", "nextjs", "react", "mdx", "documentation"],
  openGraph: {
    type: "website",
    siteName: "victory.docs",
    title: "victory.docs — Modern Documentation Platform",
    description: "High-performance documentation for developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark", "blue-gray", "ancient-parchment", "system"]}
          enableSystem
          disableTransitionOnChange
        >
          <AmbientMesh />
          {children}
          <ScrollToTop />
          <KeyboardShortcutsModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
