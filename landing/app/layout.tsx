import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "BrowserBuddy AI - Your AI-Powered Browsing Assistant",
  description:
    "Stop juggling tabs, simplifying content manually, and wasting time. Let AI do the heavy lifting with Smart Tab Manager, Content Simplifier, Reading Mode, and more.",
  keywords: [
    "Chrome Extension",
    "AI",
    "Browser Assistant",
    "Tab Manager",
    "Content Simplifier",
    "Productivity",
  ],
  openGraph: {
    title: "BrowserBuddy AI - Your AI-Powered Browsing Assistant",
    description:
      "Stop juggling tabs, simplifying content manually, and wasting time. Let AI do the heavy lifting.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
