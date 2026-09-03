// OOP: Composition — This module composes multiple providers (Auth, GlobalData, Theme, Sidebar) to create a layered application structure.
// OOP: Encapsulation — The layout encapsulates global setup and providers, hiding complexity from individual pages.

import { Geist, Geist_Mono, Inter } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import { Metadata } from "next"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalDataProvider } from "@/app/context/GlobalDataContext"
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


import { ThemeToggle } from "@/components/theme-toggle"

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
              {/* Note: The Sidebar logic will handle its own visibility or we can wrap conditional logic here if it were a client component */}
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full justify-between">
                      <SidebarTrigger className="-ml-1" />
                      <ThemeToggle />
                    </div>
                  </header>
                  <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </GlobalDataProvider>
      </body>
    </html>
  )
}
