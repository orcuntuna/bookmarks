import React from "react";
import {Inter as FontSans} from 'next/font/google'
import {cn} from "@/lib/utils";
import '../assets/css/globals.css'

import type {Metadata} from 'next'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Save and share your bookmarks',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>{children}</body>
    </html>
  )
}
