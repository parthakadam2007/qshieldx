// OOP: Encapsulation — This component encapsulates project management state and UI interactions.
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  Target,
  SquareTerminal,
  Network,
  BookOpen,
  Settings2,
  Search,
  Bell,
  Plus,
  LayoutGrid,
  List,
  MoreVertical,
  PauseCircle,
  ChevronDown,
  Check,
  Sparkles,
  ExternalLink,
  Copy,
  Trash2,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  Boxes,
  Lock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { DEMO_CRYPTO_ASSET_COUNT } from "@/lib/demo-metrics"
// import { useUser } from "@/hooks/useUser"
// import { createClient } from "@/lib/supabase"

interface ProjectItem {
  id: string
  name: string
  status: "paused" | "active"
  statusText: string
  refId: string
  createdAt: string
  isCurrentApp?: boolean
  quantumReadyPercent?: number
  assetCount?: number
}

const initialProjects: ProjectItem[] = [
  {
    id: "proj-1",
    name: "AiAssignmentChecker",
    status: "paused",
    statusText: "Project is paused",
    refId: "aixckr-8821",
    createdAt: "2026-08-14",
    quantumReadyPercent: 32,
    assetCount: 64,
  },
  {
    id: "proj-2",
    name: "Roblox",
    status: "active",
    statusText: "Active · Quantum Ready",
    refId: "qsx-9904",
    createdAt: "2026-08-28",
    isCurrentApp: true,
    quantumReadyPercent: 58.8,
    assetCount: DEMO_CRYPTO_ASSET_COUNT,
  },
  {
    id: "proj-3",
    name: "SAR_Generator",
    status: "paused",
    statusText: "Project is paused",
    refId: "sar-3312",
    createdAt: "2026-09-02",
    quantumReadyPercent: 44,
    assetCount: 82,
  },
]

export default function ProjectsView() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
  }, [])

  const [projects, setProjects] = React.useState<ProjectItem[]>(initialProjects)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "paused">("all")
  const [sortBy, setSortBy] = React.useState<"name" | "recent">("name")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [notification, setNotification] = React.useState<string | null>(null)

  // Dialog states
  const [isNewProjectOpen, setIsNewProjectOpen] = React.useState(false)
  const [isProModalOpen, setIsProModalOpen] = React.useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false)
  const [isSearchCommandOpen, setIsSearchCommandOpen] = React.useState(false)

  // New project form state
  const [newProjectName, setNewProjectName] = React.useState("")
  const [newProjectDbPassword, setNewProjectDbPassword] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  // Feedback state
  const [feedbackText, setFeedbackText] = React.useState("")

  const showToast = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Ctrl+K keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsSearchCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Filter and sort
  const filteredProjects = React.useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.refId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus =
          statusFilter === "all" ? true : p.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name)
        }
        return b.createdAt.localeCompare(a.createdAt)
      })
  }, [projects, searchQuery, statusFilter, sortBy])

  // Handle Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    setIsCreating(true)
    setTimeout(() => {
      const created: ProjectItem = {
        id: `proj-${Date.now()}`,
        name: newProjectName.trim(),
        status: "active",
        statusText: "Active · Initializing Scan",
        refId: `${newProjectName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString().split("T")[0],
        quantumReadyPercent: 50,
        assetCount: 12,
      }
      setProjects((prev) => [created, ...prev])
      setIsCreating(false)
      setIsNewProjectOpen(false)
      setNewProjectName("")
      setNewProjectDbPassword("")
      showToast(`Project "${created.name}" created successfully!`)
    }, 600)
  }

  // Handle Open Project / Launch Dashboard
  const handleOpenProject = (project: ProjectItem) => {
    showToast(`Launching ${project.name} workspace...`)
    setTimeout(() => {
      router.push("/targets/new")
    }, 300)
  }

  // Toggle status
  const toggleProjectStatus = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "paused" ? "active" : "paused"
          return {
            ...p,
            status: nextStatus,
            statusText:
              nextStatus === "active" ? "Active · Quantum Ready" : "Project is paused",
          }
        }
        return p
      })
    )
    showToast("Project status updated")
  }

  // Delete project
  const handleDeleteProject = (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setProjects((prev) => prev.filter((p) => p.id !== id))
    showToast(`Project "${name}" deleted`)
  }

  // Copy ref ID
  const handleCopyRef = (refId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    navigator.clipboard.writeText(refId)
    showToast(`Copied reference ID: ${refId}`)
  }

  // Sign out
  const handleSignOut = async () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const userDisplayName =
    user?.user_name ||
    user?.email?.split("@")[0] ||
    "User"
  const orgName = `Workspace`

  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased select-none font-sans">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xl animate-in fade-in slide-in-from-top-3">
          <Check className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Left Slim Navigation Rail (Matching QShieldX Sidebar Aesthetics) */}
      <aside className="w-14 shrink-0 border-r border-border bg-card flex flex-col items-center justify-between py-3.5 z-20">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* QShieldX Brand Icon */}
          <button
            onClick={() => router.push("/projects")}
            className="flex items-center justify-center size-9 rounded-lg bg-primary text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            title="QShieldX Projects"
          >
            <Shield className="size-5 stroke-[2.2]" />
          </button>

          {/* Navigation Rail Icons */}
          <nav className="flex flex-col items-center gap-2.5 w-full px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center size-9 rounded-md bg-accent text-accent-foreground font-medium shadow-xs">
                  <Boxes className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Workspaces & Projects
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/targets")}
                  className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <Target className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Discovery & Scanners
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/intelligence")}
                  className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <SquareTerminal className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Intelligence
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/quantum-risk")}
                  className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <Network className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Quantum Security
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/cbom")}
                  className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <BookOpen className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                CBOM Reports
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/crypto-review")}
                  className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <Lock className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Crypto Review
              </TooltipContent>
            </Tooltip>
          </nav>
        </div>

        {/* Bottom Gear Icon */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              >
                <Settings2 className="size-4.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              System Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {/* 2. Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between shrink-0">
          {/* Left: Organization Selector */}
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <span>QShieldX</span>
              <span className="text-muted-foreground font-light">/</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-accent transition-colors font-medium text-foreground">
                  <span>{orgName}</span>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.2">
                    Free Tier
                  </Badge>
                  <ChevronDown className="size-3.5 text-muted-foreground ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Active Workspace
                </DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center justify-between text-xs py-2 cursor-pointer font-medium">
                  <span>{orgName}</span>
                  <Check className="size-4 text-emerald-500" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsNewProjectOpen(true)}
                  className="text-xs py-2 cursor-pointer"
                >
                  <Plus className="size-3.5 mr-2" />
                  Create new workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFeedbackOpen(true)}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
            >
              Feedback
            </Button>

            {/* Quick Search Ctrl K */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSearchCommandOpen(true)}
              className="h-8 gap-2 text-xs text-muted-foreground px-2.5 hidden sm:flex"
            >
              <Search className="size-3.5" />
              <span>Search...</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => showToast("No pending alerts")}
              title="Notifications"
            >
              <Bell className="size-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative size-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold uppercase hover:ring-2 hover:ring-primary/20 transition-all ml-1">
                  {userDisplayName.slice(0, 2)}
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 bg-emerald-500 rounded-full ring-2 ring-card"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal text-xs">
                  <div className="font-semibold truncate">{userDisplayName}</div>
                  <div className="text-muted-foreground truncate text-[11px]">
                    {user?.email || "agent@qshieldx.com"}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")} className="text-xs cursor-pointer">
                  <Settings2 className="size-3.5 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsProModalOpen(true)} className="text-xs cursor-pointer">
                  <Sparkles className="size-3.5 mr-2 text-primary" />
                  Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-xs text-destructive cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Cryptographic discovery workspaces and post-quantum readiness environments.
                </p>
              </div>

              {/* Keyboard Shortcut Indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg border border-border/60">
                <span>Quick Discovery</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono font-medium">
                    G
                  </kbd>
                  <span className="text-[10px]">then</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono font-medium">
                    D
                  </kbd>
                </span>
              </div>
            </div>

            <Separator />

            {/* Toolbar Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-64 sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a project"
                    className="h-9 pl-9 text-xs bg-card"
                  />
                </div>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 font-normal">
                      <span>
                        {statusFilter === "all"
                          ? "Status: All"
                          : statusFilter === "active"
                          ? "Status: Active"
                          : "Status: Paused"}
                      </span>
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-36">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-xs cursor-pointer">
                      <span className={statusFilter === "all" ? "font-semibold" : ""}>All status</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")} className="text-xs cursor-pointer">
                      <span className={statusFilter === "active" ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}>
                        Active
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("paused")} className="text-xs cursor-pointer">
                      <span className={statusFilter === "paused" ? "font-semibold text-amber-600 dark:text-amber-400" : ""}>
                        Paused
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 font-normal">
                      <span>{sortBy === "name" ? "Sorted by name" : "Recently created"}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem onClick={() => setSortBy("name")} className="text-xs cursor-pointer">
                      <span className={sortBy === "name" ? "font-semibold" : ""}>Sorted by name</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("recent")} className="text-xs cursor-pointer">
                      <span className={sortBy === "recent" ? "font-semibold" : ""}>Recently created</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right: View mode and New Project Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-lg bg-card p-0.5 shadow-2xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-accent text-accent-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-accent text-accent-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="List view"
                  >
                    <List className="size-4" />
                  </button>
                </div>

                {/* Primary Button */}
                <Button
                  onClick={() => setIsNewProjectOpen(true)}
                  size="sm"
                  className="h-9 gap-1.5 font-medium shadow-xs cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>New project</span>
                </Button>
              </div>
            </div>

            {/* Split Grid: Projects + Plan Usage Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left / Center Section: Project Cards */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                {filteredProjects.length === 0 ? (
                  <Card className="p-12 text-center flex flex-col items-center justify-center gap-3">
                    <Boxes className="size-10 text-muted-foreground" />
                    <p className="text-sm font-semibold">No projects found</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      No workspaces matched "{searchQuery}". Clear your search or change the status filter.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                    >
                      Clear filters
                    </Button>
                  </Card>
                ) : viewMode === "grid" ? (
                  /* Grid View */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <Card
                        key={project.id}
                        onClick={() => handleOpenProject(project)}
                        className="group relative flex flex-col justify-between h-48 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md bg-card/70 backdrop-blur-xs"
                      >
                        <CardHeader className="p-5 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                                {project.name}
                              </CardTitle>
                            </div>

                            {/* 3-dots Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors -mr-1"
                                >
                                  <MoreVertical className="size-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenProject(project)
                                  }}
                                  className="text-xs cursor-pointer font-medium"
                                >
                                  <ExternalLink className="size-3.5 mr-2 text-primary" />
                                  Open Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => handleCopyRef(project.refId, e)}
                                  className="text-xs cursor-pointer"
                                >
                                  <Copy className="size-3.5 mr-2" />
                                  Copy Reference ID
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => toggleProjectStatus(project.id, e)}
                                  className="text-xs cursor-pointer"
                                >
                                  {project.status === "paused" ? (
                                    <>
                                      <Play className="size-3.5 mr-2 text-emerald-500" />
                                      Resume project
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="size-3.5 mr-2 text-amber-500" />
                                      Pause project
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => handleDeleteProject(project.id, project.name, e)}
                                  className="text-xs text-destructive cursor-pointer"
                                >
                                  <Trash2 className="size-3.5 mr-2" />
                                  Delete project
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>

                        <CardContent className="p-5 pt-2 flex flex-col justify-end gap-3">
                          {project.quantumReadyPercent !== undefined && (
                            <div className="space-y-1">
                  
                            </div>
                          )}

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              {project.status === "paused" ? (
                                <PauseCircle className="size-3.5 text-amber-500" />
                              ) : (
                                <ShieldCheck className="size-3.5 text-emerald-500" />
                              )}
                              <span className={project.status === "active" ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                                {project.statusText}
                              </span>
                            </div>

                            {project.isCurrentApp && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
                                Current
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <Card className="divide-y divide-border overflow-hidden">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleOpenProject(project)}
                        className="flex items-center justify-between p-4 hover:bg-accent/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-primary font-bold">
                            <Shield className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{project.name}</span>
                              {project.isCurrentApp && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span>Ref: {project.refId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {project.status === "paused" ? (
                              <PauseCircle className="size-4 text-amber-500" />
                            ) : (
                              <ShieldCheck className="size-4 text-emerald-500" />
                            )}
                            <span className={project.status === "active" ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                              {project.statusText}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenProject(project)
                            }}
                            className="text-xs h-8 gap-1"
                          >
                            Open
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>

              {/* Right Sidebar Section */}

            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: Create New Project Dialog */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="size-5 text-primary" />
              Create new project
            </DialogTitle>
            <DialogDescription className="text-xs">
              Allocate a dedicated cryptographic inventory scanner and post-quantum audit instance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="proj-name" className="text-xs">
                Project Name
              </Label>
              <Input
                id="proj-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. enterprise-crypto-scan"
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="db-pwd" className="text-xs">
                  Inventory Security Key
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    const pwd = "qsx_" + Math.random().toString(36).slice(2, 10) + "!"
                    setNewProjectDbPassword(pwd)
                  }}
                  className="text-[11px] text-primary hover:underline"
                >
                  Generate Key
                </button>
              </div>
              <Input
                id="db-pwd"
                type="text"
                value={newProjectDbPassword}
                onChange={(e) => setNewProjectDbPassword(e.target.value)}
                placeholder="Enter or generate key"
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewProjectOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !newProjectName.trim()}
                className="h-9 text-xs font-semibold"
              >
                {isCreating ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Upgrade to Pro Modal */}
      <Dialog open={isProModalOpen} onOpenChange={setIsProModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Sparkles className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Upgrade to QShieldX Enterprise</DialogTitle>
            <DialogDescription className="text-xs">
              Scale continuous cryptographic discovery and automated quantum compliance across all your clusters.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <Card className="p-4 flex items-center justify-between bg-muted/40">
              <div>
                <div className="text-sm font-semibold">Enterprise Cryptography Tier</div>
                <div className="text-xs text-muted-foreground">Dedicated scanner clusters & CBOM reporting</div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">$25</span>
                <span className="text-xs text-muted-foreground"> / mo</span>
              </div>
            </Card>

            <div className="space-y-2 text-xs text-muted-foreground pl-1">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span className="text-foreground">Unlimited cryptographic asset discovery scans</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span className="text-foreground">Dedicated Postgres CBOM Inventory Database</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span className="text-foreground">Continuous certificate expiration & algorithm drift monitors</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span className="text-foreground">Automated NIST PQC compliance certification exports</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
     
          
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Feedback Modal */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Share Feedback</DialogTitle>
            <DialogDescription className="text-xs">
              Tell us how we can improve your cryptographic discovery workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What could we improve?"
              className="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFeedbackOpen(false)}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsFeedbackOpen(false)
                setFeedbackText("")
                showToast("Thank you for your feedback!")
              }}
              className="h-9 text-xs font-semibold"
            >
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Command Search Palette (Ctrl + K) */}
      <Dialog open={isSearchCommandOpen} onOpenChange={setIsSearchCommandOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="flex items-center px-4 border-b border-border">
            <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, targets, reports..."
              className="w-full bg-transparent py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="p-2 max-h-72 overflow-y-auto space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase">
              Projects
            </div>
            {projects
              .filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setIsSearchCommandOpen(false)
                    handleOpenProject(p)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent text-left text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                  <ArrowRight className="size-3 text-muted-foreground" />
                </button>
              ))}

            <div className="px-2 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase">
              Quick Actions
            </div>
            <button
              onClick={() => {
                setIsSearchCommandOpen(false)
                setIsNewProjectOpen(true)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-left text-xs text-foreground transition-colors"
            >
              <Plus className="size-3.5 text-primary" />
              <span>Create new project</span>
            </button>
            <button
              onClick={() => {
                setIsSearchCommandOpen(false)
                router.push("/settings")
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-left text-xs text-foreground transition-colors"
            >
              <Settings2 className="size-3.5 text-muted-foreground" />
              <span>Go to Settings</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

