"use client"

import * as React from "react"
import {
  Activity,
  Terminal,
  Cpu,
  Network,
  ShieldCheck,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Binary,
  BrainCircuit,
  Zap,
  ShieldAlert,
  LockKeyhole,
  Server,
  Radio,
  Sparkles,
  CircleDot,
  TrendingUp,
  GitBranch,
  Search,
  Bot,
  Workflow,
  Gauge,
  Eye,
  KeyRound,
  TriangleAlert,
  Radar,
  ScanLine,
  Waves,
} from "lucide-react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { useGlobalData } from "@/app/context/GlobalDataContext"

declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

/* =========================================================
   MOCK DATA
========================================================= */

const CRYPTO_STATS = [
  { name: "RSA", value: 22, risk: "high" },
  { name: "ECC", value: 14, risk: "high" },
  { name: "AES", value: 31, risk: "safe" },
  { name: "SHA", value: 18, risk: "medium" },
  { name: "PQC", value: 7, risk: "safe" },
]

const TELEMETRY_DATA = [
  { time: "19:40", agents: 3, discoveries: 12, events: 8 },
  { time: "19:41", agents: 5, discoveries: 28, events: 15 },
  { time: "19:42", agents: 6, discoveries: 46, events: 24 },
  { time: "19:43", agents: 7, discoveries: 73, events: 37 },
  { time: "19:44", agents: 8, discoveries: 91, events: 48 },
  { time: "19:45", agents: 6, discoveries: 112, events: 59 },
  { time: "19:46", agents: 8, discoveries: 128, events: 71 },
  { time: "19:47", agents: 7, discoveries: 148, events: 86 },
]

const AGENTS = [
  {
    name: "Planner Agent",
    status: "completed",
    type: "supervisor",
    icon: BrainCircuit,
  },
  {
    name: "Discovery Agent",
    status: "completed",
    type: "worker",
    icon: Search,
  },
  {
    name: "Classification Agent",
    status: "completed",
    type: "worker",
    icon: Binary,
  },
  {
    name: "Threat Intelligence",
    status: "completed",
    type: "worker",
    icon: ShieldAlert,
  },
  {
    name: "Quantum Risk Agent",
    status: "completed",
    type: "worker",
    icon: Radar,
  },
  {
    name: "CBOM Builder",
    status: "completed",
    type: "worker",
    icon: FileJson,
  },
  {
    name: "Migration Planner",
    status: "completed",
    type: "worker",
    icon: GitBranch,
  },
  {
    name: "CryptoWatch",
    status: "active",
    type: "monitor",
    icon: Eye,
  },
]

const TIMELINE_EVENTS = [
  {
    id: 1,
    agent: "Planner Agent",
    node: "Observe",
    action: "Initialized Hybrid Discovery",
    tool: null,
    runtime: "1.2s",
    confidence: 0.98,
    timestamp: "19:40",
    result: "Scope confirmed: enterprise perimeter and repository.",
    payload: {
      mode: "Hybrid Discovery",
      domain: "mypay.com",
      assets_expected: 148,
    },
  },
  {
    id: 2,
    agent: "Planner Agent",
    node: "Decide",
    action: "Launched Subfinder",
    tool: "LangGraph Router",
    runtime: "2.5s",
    confidence: 0.95,
    timestamp: "19:40",
    result: "Subfinder discovered 34 subdomains.",
    payload: {
      subdomains_found: 34,
      engine: "Subfinder",
    },
  },
  {
    id: 3,
    agent: "Discovery Agent",
    node: "Tool Used",
    action: "Nmap TLS completed",
    tool: "Nmap TLS",
    runtime: "31.0s",
    confidence: 1.0,
    timestamp: "19:41",
    result: "Nmap identified 18 TLS services.",
    payload: {
      tls_services: 18,
      engine: "Nmap TLS Discovery",
    },
  },
  {
    id: 4,
    agent: "Discovery Agent",
    node: "Action",
    action: "testssl completed",
    tool: "testssl.sh",
    runtime: "42.0s",
    confidence: 0.99,
    timestamp: "19:41",
    result: "TLS 1.1 found on api.mypay.com.",
    payload: {
      endpoint: "api.mypay.com",
      finding: "TLS 1.1 enabled",
    },
  },
]

const MOCK_LOGS = [
  "[19:40] PLANNER: Agent initialized Hybrid Discovery.",
  "[19:40] DISCOVERY: Subfinder discovered 34 subdomains.",
  "[19:41] NMAP_TLS: Identified 18 TLS services.",
  "[19:41] TESTSSL: Found TLS 1.1 on api.mypay.com.",
  "[19:42] CERT_PARSER: Extracted RSA-2048 certificates.",
  "[19:42] CRYPTOFINDER: Discovered crypto libraries.",
  "[19:42] GITLEAKS: Detected exposed AWS Access Key.",
  "[19:43] SEMGREP: Detected SHA-1 implementation.",
  "[19:43] CORRELATION: Merged evidence for 148 assets.",
  "[19:43] CBOM: Generated CycloneDX 1.7.",
  "[19:43] QARS: Calculated score 91.",
  "[19:43] MIGRATION: Generated Wave 1 roadmap.",
]

const THREATS = [
  {
    title: "RSA-2048 dependency",
    severity: "HIGH",
    location: "auth-service",
    icon: KeyRound,
  },
  {
    title: "TLS 1.1 enabled",
    severity: "HIGH",
    location: "api.mypay.com",
    icon: ShieldAlert,
  },
  {
    title: "SHA-1 implementation",
    severity: "MEDIUM",
    location: "payment-worker",
    icon: TriangleAlert,
  },
  {
    title: "AWS Access Key detected",
    severity: "CRITICAL",
    location: "repository",
    icon: LockKeyhole,
  },
]

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number
  suffix?: string
}) {
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    let start = display
    const duration = 700
    const startTime = performance.now()

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplay(Math.round(start + (value - start) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <>
      {display}
      {suffix}
    </>
  )
}

function KPI({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  pulse,
}: {
  title: string
  value: number
  subtitle: string
  icon: React.ElementType
  color: string
  pulse?: boolean
}) {
  return (
    <Card
      className={`
        relative overflow-hidden
        border-primary/10
        bg-background/60
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-primary/30
        hover:shadow-xl
        ${pulse ? "shadow-primary/10" : ""}
      `}
    >
      <div
        className={`absolute -right-8 -top-8 size-24 rounded-full blur-3xl ${color}`}
      />

      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div
            className={`flex size-10 items-center justify-center rounded-xl bg-background/80 border border-border/50 ${pulse ? "animate-pulse" : ""}`}
          >
            <Icon className="size-5" />
          </div>

          {pulse && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-500">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs text-muted-foreground">{title}</p>

          <p className="mt-1 text-3xl font-bold tracking-tight">
            <AnimatedNumber value={value} />
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function IntelligencePage() {
  const [expandedEvent, setExpandedEvent] = React.useState<number | null>(
    null,
  )

  const { data, isDemoMode } = useGlobalData()

  const [liveEvents, setLiveEvents] = React.useState(86)
  const [activeAgents, setActiveAgents] = React.useState(7)
  const [assetsDiscovered, setAssetsDiscovered] = React.useState(148)
  const [threatsDetected, setThreatsDetected] = React.useState(8)

  const [pulse, setPulse] = React.useState(false)
  const [currentLog, setCurrentLog] = React.useState(0)

  /* ---------------------------------------------------------
     LIVE SIMULATION
  --------------------------------------------------------- */

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveEvents((v) => v + Math.floor(Math.random() * 4))

      setAssetsDiscovered((v) =>
        Math.min(148, v + Math.floor(Math.random() * 2)),
      )

      setPulse((v) => !v)

      setActiveAgents(Math.floor(Math.random() * 3) + 6)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  /* ---------------------------------------------------------
     TERMINAL STREAM
  --------------------------------------------------------- */

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLog((v) => (v + 1) % MOCK_LOGS.length)
    }, 1700)

    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    document.title = "Intelligence Console | QShieldX Dashboard"
  }, [])

  /* ---------------------------------------------------------
     VALUES
  --------------------------------------------------------- */

  const scanProgress = data.scan ? 100 : 78

  const assetCount = data.scan?.assetCount || assetsDiscovered
  const certificateCount = data.scan?.certificateCount || 36
  const algorithmCount = data.scan ? data.algorithms.length : 8
  const criticalSecrets = data.scan?.criticalSecrets || 2

  return (
    <div className="relative flex min-h-full flex-col gap-6 overflow-hidden p-4 md:p-8">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-0 size-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 size-96 rounded-full bg-purple-500/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
              <BrainCircuit className="size-7 text-primary" />

              <span className="absolute -right-1 -top-1 flex size-4">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-4 rounded-full border-2 border-background bg-emerald-500" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Intelligence Command Center
                </h1>

                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
                >
                  <span className="mr-2 size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  OPERATIONAL
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Real-time AI agent orchestration and cryptographic discovery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-2 border-primary/20 bg-primary/5 px-3 py-1.5"
            >
              <Radio className="size-3 text-primary" />
              WebSocket Connected
            </Badge>

            <Badge
              variant="outline"
              className="gap-2 border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-purple-500"
            >
              <Sparkles className="size-3" />
              LangGraph
            </Badge>
          </div>
        </div>

        {/* =================================================
            KPI ROW
        ================================================= */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          <KPI
            title="Active Agents"
            value={activeAgents}
            subtitle="LangGraph nodes executing"
            icon={Bot}
            color="bg-blue-500/20"
            pulse
          />

          <KPI
            title="Assets Discovered"
            value={assetCount}
            subtitle="Cryptographic assets mapped"
            icon={Database}
            color="bg-emerald-500/20"
          />

          <KPI
            title="Events Processed"
            value={liveEvents}
            subtitle="Agent events this session"
            icon={Activity}
            color="bg-purple-500/20"
            pulse
          />

          <KPI
            title="Quantum Risks"
            value={threatsDetected}
            subtitle="Assets requiring migration"
            icon={ShieldAlert}
            color="bg-red-500/20"
          />

          <Card className="relative col-span-2 overflow-hidden border-primary/20 bg-primary/[0.04] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl xl:col-span-1">
            <div className="absolute right-0 top-0 size-32 rounded-full bg-primary/10 blur-3xl" />

            <CardContent className="relative p-5">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <Gauge className="size-5 text-primary" />
                </div>

                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  QARS
                </Badge>
              </div>

              <div className="mt-5">
                <p className="text-xs text-muted-foreground">
                  Quantum Readiness
                </p>

                <div className="mt-1 flex items-end gap-1">
                  <span className="text-3xl font-bold">91</span>
                  <span className="mb-1 text-xs text-muted-foreground">
                    /100
                  </span>
                </div>

                <Progress value={91} className="mt-3 h-1.5" />

                <p className="mt-2 text-[11px] text-emerald-500">
                  +8.4% from previous scan
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* =====================================================
          TELEMETRY + QUANTUM READINESS
      ===================================================== */}

      <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* TELEMETRY */}

        <Card className="overflow-hidden border-primary/15 bg-background/60 backdrop-blur-xl xl:col-span-2">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="size-4 text-primary" />
                  Agent Telemetry
                </CardTitle>

                <CardDescription className="text-xs">
                  Discovery throughput and orchestration activity
                </CardDescription>
              </div>

              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  Discoveries
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-purple-500" />
                  Events
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TELEMETRY_DATA}>
                  <defs>
                    <linearGradient
                      id="discoveriesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="eventsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.08}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "10px",
                      fontSize: "11px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="discoveries"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#discoveriesGradient)"
                    animationDuration={1800}
                  />

                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fill="url(#eventsGradient)"
                    animationDuration={2200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* QUANTUM READINESS */}

        <Card className="relative overflow-hidden border-purple-500/15 bg-background/60 backdrop-blur-xl">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-purple-500/10 blur-3xl" />

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Waves className="size-4 text-purple-500" />
              Quantum Readiness
            </CardTitle>

            <CardDescription className="text-xs">
              Cryptographic migration posture
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative mx-auto flex size-52 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-purple-500/10" />

              <div className="absolute inset-3 rounded-full border border-purple-500/10" />

              <div className="absolute inset-6 rounded-full border border-primary/10" />

              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-primary animate-spin"
                style={{ animationDuration: "5s" }}
              />

              <div className="relative flex size-36 flex-col items-center justify-center rounded-full border border-primary/20 bg-background shadow-xl">
                <span className="text-5xl font-bold">91</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  QARS Score
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Classical Crypto</span>
                  <span>73%</span>
                </div>

                <Progress value={73} className="h-1.5" />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>PQC Adoption</span>
                  <span>27%</span>
                </div>

                <Progress value={27} className="h-1.5" />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Crypto Agility</span>
                  <span>64%</span>
                </div>

                <Progress value={64} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          AGENT PIPELINE
      ===================================================== */}

      <Card className="relative overflow-hidden border-primary/15 bg-background/60 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Workflow className="size-4 text-primary" />
                Agent Execution Pipeline
              </CardTitle>

              <CardDescription className="text-xs">
                Live LangGraph orchestration flow
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className="border-emerald-500/20 text-emerald-500"
            >
              <span className="mr-2 size-1.5 animate-pulse rounded-full bg-emerald-500" />
              RUNNING
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
            {[
              {
                name: "Discovery",
                sub: "148 assets",
                icon: Search,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                name: "Classification",
                sub: "8 algorithms",
                icon: Binary,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                name: "Threat Analysis",
                sub: "8 risks",
                icon: ShieldAlert,
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
              {
                name: "CBOM Builder",
                sub: "CycloneDX 1.7",
                icon: FileJson,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                name: "Migration",
                sub: "Wave 1 ready",
                icon: GitBranch,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
            ].map((stage, index, arr) => {
              const Icon = stage.icon

              return (
                <React.Fragment key={stage.name}>
                  <div className="group relative z-10 flex w-full flex-col items-center md:w-auto">
                    <div
                      className={`
                        relative flex size-16 items-center justify-center
                        rounded-2xl border border-border/60
                        ${stage.bg}
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:shadow-lg
                      `}
                    >
                      <Icon className={`size-7 ${stage.color}`} />

                      {index < 4 && (
                        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>

                    <p className="mt-3 text-xs font-semibold">
                      {stage.name}
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {stage.sub}
                    </p>
                  </div>

                  {index !== arr.length - 1 && (
                    <div className="hidden flex-1 items-center md:flex">
                      <div className="relative h-px w-full bg-border">
                        <div
                          className="absolute left-0 top-0 h-px w-1/3 bg-primary animate-[pipeline_2s_linear_infinite]"
                        />

                        <ChevronRight className="absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          MAIN 3 COLUMN AREA
      ===================================================== */}

      <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* ===================================================
            AGENT QUEUE
        =================================================== */}

        <Card className="border-primary/15 bg-background/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Network className="size-4 text-primary" />
              Agent Queue
            </CardTitle>

            <CardDescription className="text-xs">
              LangGraph node execution
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {AGENTS.map((agent, idx) => {
              const Icon = agent.icon

              return (
                <div
                  key={agent.name}
                  className={`
                    group flex items-center justify-between
                    rounded-xl border p-2.5
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-primary/30
                    hover:bg-primary/[0.03]
                    ${
                      agent.status === "active"
                        ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                        : "border-border/50 bg-card/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`
                        flex size-8 items-center justify-center rounded-lg
                        ${
                          agent.status === "active"
                            ? "bg-emerald-500/10"
                            : "bg-muted"
                        }
                      `}
                    >
                      <Icon
                        className={`
                          size-4
                          ${
                            agent.status === "active"
                              ? "text-emerald-500 animate-pulse"
                              : "text-muted-foreground"
                          }
                        `}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium">{agent.name}</p>

                      <p className="text-[9px] text-muted-foreground">
                        {agent.status === "active"
                          ? "Processing"
                          : "Completed"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`
                      text-[9px]
                      ${
                        agent.status === "active"
                          ? "border-emerald-500/20 text-emerald-500"
                          : ""
                      }
                    `}
                  >
                    {agent.type}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* ===================================================
            TIMELINE
        =================================================== */}

        <Card className="flex h-[610px] flex-col overflow-hidden border-primary/15 bg-background/60 backdrop-blur-xl xl:col-span-2">
          <CardHeader className="shrink-0 border-b border-border/40 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Cpu className="size-4 text-primary" />
                  Live Agent Timeline
                </CardTitle>

                <CardDescription className="text-xs">
                  Real-time decisions and tool execution
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className="animate-pulse border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
              >
                {isDemoMode ? "DEMO STREAM" : "LIVE"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            {TIMELINE_EVENTS.map((ev, idx) => (
              <div
                key={ev.id}
                className="relative animate-in fade-in slide-in-from-left-2 duration-500"
              >
                {/* LINE */}

                {idx !== TIMELINE_EVENTS.length - 1 && (
                  <div className="absolute bottom-[-20px] left-[10px] top-7 w-px bg-gradient-to-b from-primary/50 to-border" />
                )}

                {/* DOT */}

                <div className="absolute left-[5px] top-2.5 z-10 size-3 rounded-full border-2 border-background bg-primary shadow-lg shadow-primary/40">
                  {idx === TIMELINE_EVENTS.length - 1 && (
                    <span className="absolute inset-[-5px] rounded-full border border-primary/30 animate-ping" />
                  )}
                </div>

                <div className="ml-8 rounded-xl border border-border/50 bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="font-mono text-[9px]"
                      >
                        {ev.agent}
                      </Badge>

                      <ChevronRight className="size-3 text-muted-foreground" />

                      <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/5 font-mono text-[9px] text-primary"
                      >
                        {ev.node}
                      </Badge>
                    </div>

                    <span className="font-mono text-[10px] text-muted-foreground">
                      {ev.timestamp}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold">{ev.action}</p>

                  <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-muted-foreground">
                    {ev.tool && (
                      <div className="flex items-center gap-1">
                        <Terminal className="size-3" />
                        {ev.tool}
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {ev.runtime}
                    </div>

                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex cursor-help items-center gap-1 border-b border-dashed">
                          <Activity className="size-3" />
                          Confidence {ev.confidence}
                        </div>
                      </HoverCardTrigger>

                      <HoverCardContent className="w-64 text-xs">
                        LLM confidence based on tool output validation,
                        evidence correlation, and prompt adherence.
                      </HoverCardContent>
                    </HoverCard>
                  </div>

                  <div className="mt-3 rounded-lg border-l-2 border-primary bg-primary/[0.04] p-3 text-xs">
                    <span className="font-semibold">Result:</span>{" "}
                    {ev.result}
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 text-[10px] text-muted-foreground"
                      onClick={() =>
                        setExpandedEvent(
                          expandedEvent === ev.id ? null : ev.id,
                        )
                      }
                    >
                      <FileJson className="size-3" />

                      {expandedEvent === ev.id
                        ? "Hide Payload"
                        : "View Payload"}

                      {expandedEvent === ev.id ? (
                        <ChevronUp className="size-3" />
                      ) : (
                        <ChevronDown className="size-3" />
                      )}
                    </Button>
                  </div>

                  {expandedEvent === ev.id && (
                    <div className="mt-2 overflow-x-auto rounded-lg border border-primary/20 bg-black/90 p-3 font-mono text-[10px] text-green-400">
                      <pre>{JSON.stringify(ev.payload, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ===================================================
            SCAN PROGRESS
        =================================================== */}

        <Card className="flex h-[610px] flex-col border-primary/15 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ScanLine className="size-4 text-primary" />
              Scan Progress
            </CardTitle>

            <CardDescription className="text-xs">
              Live cryptographic discovery
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>Overall Progress</span>

                <span className="font-mono text-primary">
                  {scanProgress}%
                </span>
              </div>

              <Progress value={scanProgress} className="h-2" />

              <p className="mt-2 text-right font-mono text-[9px] text-muted-foreground">
                {data.scan
                  ? `Completed in ${data.scan.duration}`
                  : "Estimated remaining: 12m 42s"}
              </p>
            </div>

            {/* STAT BLOCKS */}

            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Discovery Metrics
              </div>

              {[
                {
                  label: "Assets Mapped",
                  value: assetCount,
                  icon: Database,
                  color: "text-emerald-500",
                },
                {
                  label: "Certificates",
                  value: certificateCount,
                  icon: ShieldCheck,
                  color: "text-blue-500",
                },
                {
                  label: "Algorithms",
                  value: algorithmCount,
                  icon: Binary,
                  color: "text-purple-500",
                },
                {
                  label: "Secrets Exposed",
                  value: criticalSecrets,
                  icon: LockKeyhole,
                  color: "text-red-500",
                },
              ].map((stat) => {
                const Icon = stat.icon

                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3 transition-all hover:border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`size-4 ${stat.color}`} />

                      <span className="text-xs font-medium">
                        {stat.label}
                      </span>
                    </div>

                    <span className="font-mono text-sm font-bold">
                      {stat.value}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* CRYPTO DISTRIBUTION */}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Crypto Distribution
                </span>

                <Binary className="size-3 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                {CRYPTO_STATS.map((crypto) => (
                  <div key={crypto.name}>
                    <div className="mb-1 flex justify-between text-[10px]">
                      <span className="font-mono">{crypto.name}</span>

                      <span className="text-muted-foreground">
                        {crypto.value}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-1000
                          ${
                            crypto.risk === "high"
                              ? "bg-red-500"
                              : crypto.risk === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }
                        `}
                        style={{
                          width: `${(crypto.value / 35) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          THREAT FEED
      ===================================================== */}

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-red-500/15 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="size-4 text-red-500" />
                  Live Threat Feed
                </CardTitle>

                <CardDescription className="text-xs">
                  Findings correlated by the Threat Intelligence Agent
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className="border-red-500/20 text-red-500"
              >
                {threatsDetected} ACTIVE
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {THREATS.map((threat, index) => {
              const Icon = threat.icon

              return (
                <div
                  key={threat.title}
                  className="group flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/[0.03]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex size-9 items-center justify-center rounded-lg
                        ${
                          threat.severity === "CRITICAL"
                            ? "bg-red-500/10 text-red-500"
                            : threat.severity === "HIGH"
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-amber-500/10 text-amber-500"
                        }
                      `}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        {threat.title}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {threat.location}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`
                      text-[9px]
                      ${
                        threat.severity === "CRITICAL"
                          ? "border-red-500/30 text-red-500"
                          : threat.severity === "HIGH"
                            ? "border-orange-500/30 text-orange-500"
                            : "border-amber-500/30 text-amber-500"
                      }
                    `}
                  >
                    {threat.severity}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* AI REASONING */}

        <Card className="relative overflow-hidden border-purple-500/15 bg-background/60 backdrop-blur-xl">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-purple-500/10 blur-3xl" />

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BrainCircuit className="size-4 text-purple-500" />
              AI Reasoning State
            </CardTitle>

            <CardDescription className="text-xs">
              Current supervisor reasoning context
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <Sparkles className="size-4 text-purple-500" />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Migration planning in progress
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    The supervisor identified RSA and ECC dependencies as
                    quantum-vulnerable and is correlating asset criticality
                    with available PQC migration paths.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border bg-card/50 p-3 text-center">
                <p className="text-lg font-bold">148</p>
                <p className="text-[9px] text-muted-foreground">
                  Evidence
                </p>
              </div>

              <div className="rounded-lg border bg-card/50 p-3 text-center">
                <p className="text-lg font-bold">0.98</p>
                <p className="text-[9px] text-muted-foreground">
                  Confidence
                </p>
              </div>

              <div className="rounded-lg border bg-card/50 p-3 text-center">
                <p className="text-lg font-bold">12</p>
                <p className="text-[9px] text-muted-foreground">
                  Actions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          TERMINAL
      ===================================================== */}

      <Card className="relative min-h-[300px] overflow-hidden rounded-xl border-green-500/20 bg-black font-mono text-green-400 shadow-2xl shadow-green-500/5">
        {/* TERMINAL HEADER */}

        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500" />
              <span className="size-2.5 rounded-full bg-yellow-500" />
              <span className="size-2.5 rounded-full bg-green-500" />
            </div>

            <div className="flex items-center gap-2">
              <Terminal className="size-4" />

              <span className="text-[10px] font-semibold uppercase tracking-widest">
                Agent Console Activity
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>

            <span className="text-[9px] uppercase text-green-400/60">
              Streaming WebSocket
            </span>
          </div>
        </div>

        {/* TERMINAL BODY */}

        <div className="relative h-[280px] overflow-hidden p-5">
          <div className="absolute right-5 top-4 flex items-center gap-2 text-[9px] text-green-400/40">
            <span>LIVE</span>
            <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
          </div>

          <div className="space-y-1 text-[10px] leading-relaxed md:text-[11px]">
            {MOCK_LOGS.map((log, i) => (
              <div
                key={i}
                className={`
                  rounded px-2 py-0.5 transition-all duration-500
                  ${
                    i === currentLog
                      ? "bg-green-500/10 text-green-300"
                      : "text-green-400/70"
                  }
                `}
              >
                <span className="mr-2 text-green-500/50">
                  {i === currentLog ? "▶" : " "}
                </span>

                {log}
              </div>
            ))}

            <div className="flex items-center px-2 pt-2">
              <span className="mr-2">$</span>

              <span className="text-green-300">
                qshieldx.agent.execute --stream
              </span>

              <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-green-400" />
            </div>
          </div>

          {/* SCANLINE EFFECT */}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-green-400/20 shadow-[0_0_20px_2px_rgba(74,222,128,0.15)] animate-[terminalScan_4s_linear_infinite]" />
        </div>
      </Card>

      {/* =====================================================
          FOOTER STATUS
      ===================================================== */}

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CircleDot className="size-3 text-emerald-500" />
            Agent runtime healthy
          </div>

          <div className="flex items-center gap-1.5">
            <Server className="size-3" />
            3 workers
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="size-3 text-amber-500" />
            12.4 events/sec
          </div>
        </div>

        <div className="font-mono">
          QShieldX Intelligence Engine • v1.4.0
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style jsx global>{`
        @keyframes pipeline {
          0% {
            left: 0%;
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes terminalScan {
          0% {
            transform: translateY(0);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: 0.8;
          }

          100% {
            transform: translateY(280px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}