// OOP: Composition — This module composes multiple providers (Auth, GlobalData, Theme, Sidebar) to create a layered application structure.
// OOP: Encapsulation — The layout encapsulates global setup and providers, hiding complexity from individual pages.

import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Metadata } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalDataProvider } from "@/app/context/GlobalDataContext"
import { AppLayoutWrapper } from "@/components/app-layout-wrapper"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "QShieldX | Enterprise Cryptographic Discovery",
  description: "AI-driven cryptographic asset inventory and quantum risk assessment.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <GlobalDataProvider>
          <ThemeProvider>
            <TooltipProvider>
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
            </TooltipProvider>
          </ThemeProvider>
        </GlobalDataProvider>
      </body>
    </html>
  )
}
