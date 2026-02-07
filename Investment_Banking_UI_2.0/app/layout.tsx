import React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"

import "./globals.css"

const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})
const _dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Wall Street Walk - Career Explorer",
  description:
    "A gamified career exploration game set on Wall Street. Learn about investment banking through interactive gameplay.",
}

export const viewport: Viewport = {
  themeColor: "#240115",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${_spaceGrotesk.variable} ${_dmSans.variable} font-sans antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  )
}
