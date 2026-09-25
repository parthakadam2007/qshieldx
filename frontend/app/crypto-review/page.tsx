"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Lock,
  GitPullRequest,
  GitBranch,
  GitCommit,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Check,
  Search,
  Settings as SettingsIcon,
  Plus,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Zap,
  Filter,
  CheckCheck,
  Activity,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  ChevronDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  initialPRReviews,
  defaultSettings,
  PRReview,
  ReviewSettings,
} from "./data"

// Authentic Brand Icons for GitHub and GitLab
function GitHubIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function GitLabIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.65 14.39L20.6 8.08a.72.72 0 0 0-.25-.36.75.75 0 0 0-.44-.14.73.73 0 0 0-.44.15.71.71 0 0 0-.25.35l-1.63 5h-11.2l-1.63-5a.71.71 0 0 0-.25-.35.73.73 0 0 0-.44-.15.75.75 0 0 0-.44.14.72.72 0 0 0-.25.36L1.35 14.39a1.08 1.08 0 0 0 .39 1.2l10 7.27a.48.48 0 0 0 .52 0l10-7.27a1.08 1.08 0 0 0 .39-1.2zM12 21.08l-8.5-6.18L5.7 8.35l2.4 7.37a.49.49 0 0 0 .17.25.48.48 0 0 0 .31.09h6.84a.48.48 0 0 0 .31-.09.49.49 0 0 0 .17-.25l2.2-7.37 2.2 6.55z" />
    </svg>
  )
}

export default function CryptoReviewPage() {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = React.useState(true)

  // Connection State
  const [isConnected, setIsConnected] = React.useState<boolean>(false)
  const [activeProvider, setActiveProvider] = React.useState<"github" | "gitlab">("github")

  // Connection Flow Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false)
  const [connectStep, setConnectStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [gitToken, setGitToken] = React.useState("")
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([
    "payment-service",
    "auth-service",
    "api-gateway",
  ])
  const [isTestingWebhook, setIsTestingWebhook] = React.useState(false)
  const [webhookTestSuccess, setWebhookTestSuccess] = React.useState(false)

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [settings, setSettings] = React.useState<ReviewSettings>(defaultSettings)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  // Dashboard Filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [repoFilter, setRepoFilter] = React.useState<string>("all")
  const [riskFilter, setRiskFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Data
  const [reviews] = React.useState<PRReview[]>(initialPRReviews)

  React.useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsPageLoading(false), 5000)

    return () => window.clearTimeout(loadingTimer)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Open Connect Flow
  const handleOpenConnect = (provider: "github" | "gitlab") => {
    setActiveProvider(provider)
    setConnectStep(1)
    setGitToken("")
    setWebhookTestSuccess(false)
    setIsConnectModalOpen(true)
  }

  // Step 1 -> Step 2: Authorize & Connect
  const handleAuthorizeProvider = () => {
    if (!gitToken.trim() || isConnecting) return

    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setConnectStep(2)
    }, 5000)
  }

  // Step 2 -> Step 3: Enable and Configure Webhook
  const handleEnableCryptoReview = () => {
    setConnectStep(3)
    // Auto advance to ready
    setTimeout(() => {
      setConnectStep(4)
    }, 1200)
  }

  // Test Webhook
  const handleTestWebhook = () => {
    setIsTestingWebhook(true)
    setTimeout(() => {
      setIsTestingWebhook(false)
      setWebhookTestSuccess(true)
      showToast("✓ Webhook ping received: 200 OK (38ms)")
    }, 800)
  }
const fetchProducts = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/make_isse",
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to create issue");
    }

    console.log("Backend response:", data);

  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  // Finish Connection Flow
  const handleFinishConnection = () => {
    setIsConnected(true)
    setIsConnectModalOpen(false)
    showToast(`Successfully connected ${activeProvider === "github" ? "GitHub" : "GitLab"} integration!`)
    fetchProducts()
  }

  // Disconnect provider (allows user to easily re-test onboarding flow)
  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectStep(1)
    setWebhookTestSuccess(false)
    showToast("Disconnected Git provider. Onboarding view restored.")
  }

  // Filter Reviews
  const filteredReviews = React.useMemo(() => {
    return reviews.filter((pr) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.cryptoChanges.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRepo = repoFilter === "all" || pr.repository === repoFilter
      const matchesRisk = riskFilter === "all" || pr.risk.toLowerCase() === riskFilter.toLowerCase()
      const matchesStatus = statusFilter === "all" || pr.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesRepo && matchesRisk && matchesStatus
    })
  }, [reviews, searchQuery, repoFilter, riskFilter, statusFilter])

  // Repositories list for filters
  const uniqueRepos = Array.from(new Set(reviews.map((r) => r.repository)))

  // Risk badge helper
  const renderRiskBadge = (risk: PRReview["risk"]) => {
    switch (risk) {
      case "Critical":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 gap-1 font-semibold">
            <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
            Critical
          </Badge>
        )
      case "High":
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 gap-1 font-semibold">
            <span className="size-1.5 rounded-full bg-orange-500" />
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 gap-1 font-medium">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 gap-1 font-medium">
            <span className="size-1.5 rounded-full bg-blue-500" />
            Low
          </Badge>
        )
      case "Safe":
      default:
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Safe
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {isPageLoading ? (
        <div className="flex min-h-[75vh] flex-col items-center justify-center gap-3 text-muted-foreground">
          <Activity className="size-8 animate-spin text-primary" />
          <span className="text-sm">Loading Crypto Review...</span>
        </div>
      ) : (
        <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xl animate-in fade-in slide-in-from-top-3">
          <Check className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. FIRST-TIME USER EXPERIENCE (ONBOARDING STATE)                          */}
      {/* ========================================================================= */}
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12">
          <div className="w-full max-w-xl text-center space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 text-xs font-medium text-muted-foreground mb-2">
                <Lock className="size-3 text-primary" />
                <span>PQ-Guard Cryptographic Pull Request Guardian</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Connect GitHub</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Connect GitHub to start reviewing pull requests for cryptographic and post-quantum security risks.
              </p>
            </div>

            {/* Setup Card */}
            <Card className="border-border/80 shadow-lg text-left relative overflow-hidden bg-card/70 backdrop-blur-xs">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
              <CardHeader className="text-center pb-3 pt-8">
                <div className="mx-auto size-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Lock className="size-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Connect GitHub to begin</CardTitle>
                <CardDescription className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                  Automatically analyze cryptographic changes in your GitHub pull requests.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* GitHub Card */}
                  <div
                    onClick={() => handleOpenConnect("github")}
                    className="group border border-border rounded-xl p-4 flex flex-col items-center justify-between gap-3 text-center hover:border-primary/50 hover:bg-accent/40 cursor-pointer transition-all shadow-xs"
                  >
                    <div className="size-11 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center group-hover:scale-105 transition-transform">
                      <GitHubIcon className="size-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">GitHub</div>
                      <div className="text-[11px] text-muted-foreground">Public & Private Repos</div>
                    </div>
                    <Button size="sm" className="w-full text-xs h-8 mt-1">
                      Connect GitHub
                    </Button>
                  </div>

                  {/* GitLab Card */}
                  <div
                    onClick={() => handleOpenConnect("gitlab")}
                    className="group border border-border rounded-xl p-4 flex flex-col items-center justify-between gap-3 text-center hover:border-primary/50 hover:bg-accent/40 cursor-pointer transition-all shadow-xs"
                  >
                    <div className="size-11 rounded-lg bg-[#FC6D26] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                      <GitLabIcon className="size-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">GitLab</div>
                      <div className="text-[11px] text-muted-foreground">Cloud & Self-Managed</div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8 mt-1">
                      Connect GitLab
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 border border-border/50 p-3 text-xs text-muted-foreground flex items-center gap-2.5">
                  <Info className="size-4 shrink-0 text-muted-foreground/80" />
                  <span>You can disconnect, reconfigure, or add additional repositories anytime later.</span>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/20 py-3 px-6 flex justify-between items-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Zero secret storage
                </span>
                <span>FIPS 203 / 204 compliant scan</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. CRYPTO REVIEW DASHBOARD (CONNECTED STATE)                              */
        /* ========================================================================= */
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight">Crypto Review</h1>
                <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeProvider === "github" ? "GitHub" : "GitLab"} Active
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                AI-powered cryptographic security review for your Pull Requests.
              </p>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenConnect(activeProvider)}
                className="text-xs h-9 gap-1.5"
              >
                <Plus className="size-3.5" />
                Repository
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="text-xs h-9 gap-1.5"
              >
                <SettingsIcon className="size-3.5" />
                Settings
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-2 text-muted-foreground hover:text-foreground">
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="text-xs">Integration Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleTestWebhook} className="text-xs gap-2 cursor-pointer">
                    <RefreshCw className="size-3.5" />
                    Test Webhook Health
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenConnect(activeProvider)} className="text-xs gap-2 cursor-pointer">
                    <Layers className="size-3.5" />
                    Manage Repositories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDisconnect} className="text-xs gap-2 text-red-500 cursor-pointer">
                    <Lock className="size-3.5" />
                    Disconnect Provider
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-card/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">PRs Reviewed</span>
                <GitPullRequest className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-bold mt-2">128</div>
              <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-medium">+12</span> this week
              </div>
            </Card>

            <Card className="p-4 bg-card/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Crypto Risks</span>
                <ShieldAlert className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold mt-2">34</div>
              <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-amber-500 font-medium">8</span> unresolved
              </div>
            </Card>

            <Card className="p-4 bg-card/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Critical</span>
                <AlertOctagon className="size-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-red-600 dark:text-red-400">7</div>
              <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-red-500 font-medium">Action required</span>
              </div>
            </Card>

            <Card className="p-4 bg-card/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">PQ Ready</span>
                <ShieldCheck className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">82%</div>
              <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-medium">+4.2%</span> security posture
              </div>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card border border-border rounded-xl p-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search PR, author, crypto algorithm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Repository Filter */}
              <select
                value={repoFilter}
                onChange={(e) => setRepoFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Repositories</option>
                {uniqueRepos.map((repo) => (
                  <option key={repo} value={repo}>
                    {repo}
                  </option>
                ))}
              </select>

              {/* Risk Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Risks</option>
                <option value="critical">🔴 Critical</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟠 Medium</option>
                <option value="low">🔵 Low</option>
                <option value="safe">🟢 Safe</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="reviewed">Reviewed</option>
                <option value="reviewing">Reviewing</option>
                <option value="action needed">Action Needed</option>
              </select>

              {(searchQuery || repoFilter !== "all" || riskFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setRepoFilter("all")
                    setRiskFilter("all")
                    setStatusFilter("all")
                  }}
                  className="text-xs h-9 px-2 text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* PR Reviews Table */}
          <Card className="border-border overflow-hidden">
            <CardHeader className="p-4 pb-2 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Crypto Reviews</CardTitle>
                <CardDescription className="text-xs">
                  Continuous cryptographic assessment and CBOM diff monitoring
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {filteredReviews.length} Pull Requests
              </Badge>
            </CardHeader>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Repository</TableHead>
                    <TableHead className="text-xs">PR</TableHead>
                    <TableHead className="text-xs">Author</TableHead>
                    <TableHead className="text-xs">Crypto Changes</TableHead>
                    <TableHead className="text-xs">Risk</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Reviewed</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((pr) => (
                      <TableRow
                        key={pr.id}
                        onClick={() => router.push(`/crypto-review/pr/${pr.id}`)}
                        className="cursor-pointer hover:bg-muted/40 transition-colors group"
                      >
                        {/* Repository */}
                        <TableCell className="font-mono text-xs font-medium">
                          <div className="flex items-center gap-1.5">
                            <GitBranch className="size-3.5 text-muted-foreground" />
                            <span>{pr.repository}</span>
                          </div>
                        </TableCell>

                        {/* PR Title & Number */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 max-w-xs md:max-w-sm">
                            <span className="font-mono text-xs text-primary font-semibold">#{pr.prNumber}</span>
                            <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                              {pr.title}
                            </span>
                          </div>
                        </TableCell>

                        {/* Author */}
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {pr.author.name}
                        </TableCell>

                        {/* Crypto Changes */}
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1">
                            {pr.hasCryptoChanges ? (
                              pr.cryptoChanges.map((change, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-[11px] font-mono px-1.5 py-0 border border-border"
                                >
                                  {change}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">
                                No crypto changes
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Risk */}
                        <TableCell className="whitespace-nowrap">
                          {renderRiskBadge(pr.risk)}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs">
                            {pr.status === "Reviewed" && (
                              <CheckCircle2 className="size-3.5 text-emerald-500" />
                            )}
                            {pr.status === "Reviewing" && (
                              <Activity className="size-3.5 text-amber-500 animate-spin" />
                            )}
                            <span className="text-xs">{pr.status}</span>
                            {pr.findingsCount > 0 && (
                              <span className="text-[11px] text-muted-foreground">
                                ({pr.findingsCount})
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Reviewed Time */}
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {pr.reviewedAt}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/crypto-review/pr/${pr.id}`)
                            }}
                            className="h-7 text-xs px-2.5 group-hover:bg-primary group-hover:text-primary-foreground"
                          >
                            View
                            <ChevronRight className="size-3 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Lock className="size-8 text-muted-foreground/50" />
                          <div className="font-medium text-sm">No Crypto Reviews Yet</div>
                          <p className="text-xs text-muted-foreground max-w-sm">
                            Create or update a Pull Request and PQ-Guard will automatically analyze its cryptographic changes.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenConnect(activeProvider)}
                            className="text-xs mt-2"
                          >
                            View Integration
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. CONNECTION & WEBHOOK SETUP MODAL                                       */}
      {/* ========================================================================= */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {activeProvider === "github" ? <GitHubIcon className="size-5" /> : <GitLabIcon className="size-5" />}
              </div>
              <DialogTitle className="text-lg font-semibold">
                {activeProvider === "github" ? "Connect GitHub" : "Connect GitLab"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              PQ-Guard needs access to Pull Requests and repository contents to analyze cryptographic changes.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-2 border-y py-3 text-center text-[11px] font-medium">
            <div className={connectStep >= 1 ? "text-primary font-semibold" : "text-muted-foreground"}>
              1. Provider {connectStep > 1 && "✓"}
            </div>
            <div className={connectStep >= 2 ? "text-primary font-semibold" : "text-muted-foreground"}>
              2. Repositories {connectStep > 2 && "✓"}
            </div>
            <div className={connectStep >= 3 ? "text-primary font-semibold" : "text-muted-foreground"}>
              3. Webhook {connectStep > 3 && "✓"}
            </div>
            <div className={connectStep === 4 ? "text-primary font-semibold" : "text-muted-foreground"}>
              4. Ready
            </div>
          </div>

          {/* STEP 1: PERMISSIONS LIST */}
          {connectStep === 1 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="git-token" className="text-xs font-semibold">
                  {activeProvider === "github" ? "GitHub" : "GitLab"} Personal Access Token
                </Label>
                <Input
                  id="git-token"
                  type="password"
                  value={gitToken}
                  onChange={(event) => setGitToken(event.target.value)}
                  placeholder={activeProvider === "github" ? "ghp_..." : "glpat-..."}
                  className="h-9 text-xs"
                  autoComplete="off"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your token is used to access repositories and pull request changes for review.
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Grant PQ-Guard permissions to inspect code changes and provide cryptographic risk reviews on pull requests:
              </p>

              <div className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
                {[
                  "Read repository contents & crypto dependencies",
                  "Read Pull Requests / Merge Requests",
                  "Read commit changes & cryptographic diffs",
                  "Create PR comments with quantum findings",
                  "Create Issues for critical quantum risks",
                  "Create Pull Requests for automated remediation",
                ].map((permission, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>{permission}</span>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsConnectModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAuthorizeProvider} disabled={isConnecting || !gitToken.trim()}>
                  {isConnecting ? (
                    <span className="flex items-center gap-2">
                      <Activity className="size-3.5 animate-spin" /> Connecting...
                    </span>
                  ) : (
                    `Connect ${activeProvider === "github" ? "GitHub" : "GitLab"}`
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 2: SELECT REPOSITORIES */}
          {connectStep === 2 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>{activeProvider === "github" ? "GitHub" : "GitLab"} Connected</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Select repositories to monitor</span>
              </div>

              <div className="rounded-lg border divide-y max-h-52 overflow-y-auto">
                {[
                  { name: "payment-service", desc: "Core transaction handling & crypto signer" },
                  { name: "auth-service", desc: "OAuth2, JWT authentication & key store" },
                  { name: "api-gateway", desc: "Reverse proxy TLS 1.3 edge termination" },
                  { name: "user-service", desc: "User profile management & S3 credentials" },
                  { name: "vault-core", desc: "Secrets storage & HSM key derivation" },
                  { name: "frontend-portal", desc: "Next.js web client" },
                ].map((repo) => {
                  const isChecked = selectedRepos.includes(repo.name)
                  return (
                    <div
                      key={repo.name}
                      onClick={() => {
                        setSelectedRepos((prev) =>
                          isChecked ? prev.filter((r) => r !== repo.name) : [...prev, repo.name]
                        )
                      }}
                      className="flex items-center justify-between p-3 hover:bg-muted/40 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs font-semibold flex items-center gap-1.5">
                          <GitBranch className="size-3.5 text-muted-foreground" />
                          {repo.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{repo.desc}</div>
                      </div>
                      <Checkbox checked={isChecked} />
                    </div>
                  )
                })}
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setConnectStep(1)}>
                  Back
                </Button>
                <Button size="sm" onClick={handleEnableCryptoReview} disabled={selectedRepos.length === 0}>
                  Enable Crypto Review ({selectedRepos.length} Repos)
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 3: WEBHOOK CONFIGURATION PROGRESS */}
          {connectStep === 3 && (
            <div className="space-y-5 py-6 text-center">
              <div className="mx-auto size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Activity className="size-6 text-primary animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm">Configuring Webhooks & Integration…</div>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Registering secure webhook endpoints on {selectedRepos.length} selected repositories.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: READY & WEBHOOK TEST */}
          {connectStep === 4 && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Webhook Status</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 gap-1.5 text-xs">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </Badge>
                </div>

                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div className="font-medium text-foreground">Listening to webhook events:</div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3 text-emerald-500" />
                    <span>Pull Request / Merge Request (open, synchronize, reopen)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3 text-emerald-500" />
                    <span>Push events on monitored branches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3 text-emerald-500" />
                    <span>Cryptographic dependency manifest changes</span>
                  </div>
                </div>

                {webhookTestSuccess && (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Webhook is working correctly. Response status: 200 OK</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                  className="text-xs"
                >
                  {isTestingWebhook ? (
                    <span className="flex items-center gap-1.5">
                      <Activity className="size-3 animate-spin" /> Testing...
                    </span>
                  ) : (
                    "Test Connection"
                  )}
                </Button>

                <Button size="sm" onClick={handleFinishConnection} className="text-xs">
                  Launch Crypto Review Dashboard
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4. SETTINGS MODAL                                                         */}
      {/* ========================================================================= */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Crypto Review Settings</DialogTitle>
            <DialogDescription className="text-xs">
              Configure automatic pull request reviews and cryptographic policy enforcement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Repository Monitoring */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Repository Monitoring</Label>
              <div className="rounded-lg border p-2.5 space-y-2 bg-muted/20 max-h-36 overflow-y-auto">
                {Object.keys(settings.monitoredRepos).map((repo) => (
                  <div key={repo} className="flex items-center justify-between text-xs">
                    <span className="font-mono">{repo}</span>
                    <Checkbox
                      checked={settings.monitoredRepos[repo]}
                      onCheckedChange={(val) => {
                        setSettings((prev) => ({
                          ...prev,
                          monitoredRepos: {
                            ...prev.monitoredRepos,
                            [repo]: !!val,
                          },
                        }))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Configuration */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Review Configuration</Label>
              <div className="space-y-2 text-xs">
                {[
                  { key: "autoReview", label: "Review Pull Requests automatically" },
                  { key: "generateCbomDiff", label: "Generate CBOM diff on every change" },
                  { key: "detectQuantumVulnerable", label: "Detect quantum-vulnerable algorithms" },
                  { key: "commentOnPR", label: "Comment directly on Pull Requests" },
                  { key: "createIssuesForCritical", label: "Create Issues for critical findings" },
                  { key: "autoRemediationPR", label: "Automatically create remediation PR" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <Checkbox
                      checked={settings[item.key as keyof ReviewSettings] as boolean}
                      onCheckedChange={(val) => {
                        setSettings((prev) => ({
                          ...prev,
                          [item.key]: !!val,
                        }))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Policy */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Policy Enforcement</Label>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">Fail PR status check when:</span>
                <select
                  value={settings.failPolicy}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      failPolicy: e.target.value as any,
                    }))
                  }
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High or Critical</option>
                  <option value="Medium">Medium and above</option>
                  <option value="Any Risk">Any Risk</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSettingsOpen(false)
                showToast("Crypto Review settings saved successfully!")
              }}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
}

