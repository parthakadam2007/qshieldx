// OOP: Composition — This component composes navigation sections, user state, and session awareness into the app sidebar.
// OOP: Encapsulation — Hides navigation logic and session handling from the rest of the app layout.

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import {
  BookOpen,
  Bot,
  Map,
  Settings2,
  SquareTerminal,
  Network,
  Target,
  Shield,
  User
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Modern navigation data
const navData = {
  teams: [
    {
      name: "QShieldX",
      logo: Shield,
      plan: "Enterprise Cryptography",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: Map,
      isActive: true,
    },
    {
      title: "Discovery",
      url: "/targets",
      icon: Target,
    },
    {
      title: "Intelligence",
      url: "/intelligence",
      icon: SquareTerminal,
    },
    {
      title: "Quantum Security",
      url: "/quantum-risk",
      icon: Network,
    },
    {
      title: "Reports",
      url: "/cbom",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const pathname = usePathname()

  // Hide sidebar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register"
  if (isAuthPage) return null

  const userData = {
    name: user?.user_metadata?.full_name || "Initializing...",
    email: user?.email || "",
    avatar: "",
    // @ts-ignore
    role: user?.user_metadata?.role || "customer"
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
