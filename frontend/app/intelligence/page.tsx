"use client"

import * as React from "react"
import { DEMO_CRYPTO_ASSET_COUNT } from "@/lib/demo-metrics"

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
  Radar,
  LockKeyhole,
  Search,
  GitBranch,
  Server,
  ShieldAlert,
  CircleDot,
  Sparkles,
  Gauge,
  Workflow,
  Eye,
  Bug,
  KeyRound,
  Timer,
  TrendingUp,
  Radio,
  ScanSearch,
  Boxes,
} from "lucide-react"

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
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


/* =========================================================
   AGENTS
========================================================= */

const AGENTS = [
  {
    name: "Planner Agent",
    status: "completed",
    type: "supervisor",
    confidence: 98,
  },
  {
    name: "Discovery Agent",
    status: "completed",
    type: "worker",
    confidence: 99,
  },
  {
    name: "Classification Agent",
    status: "completed",
    type: "worker",
    confidence: 96,
  },
  {
    name: "Threat Intelligence Agent",
    status: "completed",
    type: "worker",
    confidence: 94,
  },
  {
    name: "Quantum Risk Agent",
    status: "completed",
    type: "worker",
    confidence: 97,
  },
  {
    name: "CBOM Builder",
    status: "completed",
    type: "worker",
    confidence: 99,
  },
  {
    name: "Migration Planner Agent",
    status: "completed",
    type: "worker",
    confidence: 92,
  },
  {
    name: "CryptoWatch",
    status: "active",
    type: "monitor",
    confidence: 95,
  },
]


/* =========================================================
   TIMELINE
========================================================= */

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
    result:
      "Scope confirmed: mypay enterprise perimeter and repository.",
    payload: {
      mode: "Hybrid Discovery",
      domain: "mypay.com",
      assets_expected: DEMO_CRYPTO_ASSET_COUNT,
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
    tool: "subfinder-engine",
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

  {
    id: 5,
    agent: "Classification Agent",
    node: "Classify",
    action: "Cryptographic assets classified",
    tool: "CryptoFinder",
    runtime: "18.4s",
    confidence: 0.97,
    timestamp: "19:42",
    result:
      "RSA, ECC, AES, SHA and PQC algorithms identified.",
    payload: {
      algorithms: [
        "RSA-2048",
        "RSA-3072",
        "ECDSA-P256",
        "AES-256",
        "ML-KEM-768",
      ],
    },
  },

  {
    id: 6,
    agent: "Threat Intelligence Agent",
    node: "Correlate",
    action: "Threat intelligence correlation completed",
    tool: "QShieldX TI Engine",
    runtime: "12.8s",
    confidence: 0.94,
    timestamp: "19:42",
    result:
      "Cryptographic assets correlated with current threat intelligence.",
    payload: {
      matched_assets: 17,
      risk_signals: 9,
    },
  },

  {
    id: 7,
    agent: "Quantum Risk Agent",
    node: "Assess",
    action: "Quantum vulnerability assessment completed",
    tool: "QARS",
    runtime: "8.6s",
    confidence: 0.97,
    timestamp: "19:43",
    result:
      "8 cryptographic assets classified as quantum vulnerable.",
    payload: {
      vulnerable: 8,
      resistant: 6,
      score: 78,
    },
  },

  {
    id: 8,
    agent: "CBOM Builder",
    node: "Generate",
    action: "CycloneDX CBOM generated",
    tool: "CBOM Generator",
    runtime: "4.2s",
    confidence: 0.99,
    timestamp: "19:43",
    result:
      "CycloneDX 1.7 Cryptographic Bill of Materials generated.",
    payload: {
      specification: "CycloneDX 1.7",
      assets: 22,
    },
  },
]


/* =========================================================
   LOGS
========================================================= */

const MOCK_LOGS = [
  "[19:40] PLANNER: Agent initialized Hybrid Discovery.",
  "[19:40] DISCOVERY: Subfinder discovered 34 subdomains.",
  "[19:41] NMAP_TLS: Identified 18 TLS services.",
  "[19:41] TESTSSL: Found TLS 1.1 on api.mypay.com.",
  "[19:42] CERT_PARSER: Extracted RSA-2048 certificates.",
  "[19:42] CRYPTOFINDER: Discovered crypto libraries.",
  "[19:42] GITLEAKS: Detected exposed AWS Access Key.",
  "[19:43] SEMGREP: Detected SHA-1 implementation.",
  `[19:43] CORRELATION: Merged evidence for ${DEMO_CRYPTO_ASSET_COUNT} assets.`,
  "[19:43] CBOM: Generated CycloneDX 1.7.",
  "[19:43] QARS: Calculated score 91.",
  "[19:43] MIGRATION: Generated Wave 1 roadmap.",
  "[19:44] INTELLIGENCE: Threat intelligence correlation completed.",
  "[19:44] CRYPTOWATCH: Monitoring cryptographic changes.",
]


/* =========================================================
   CHART DATA
========================================================= */

const DISCOVERY_DATA = [
  { time: "19:40", assets: 12, findings: 2 },
  { time: "19:41", assets: 28, findings: 5 },
  { time: "19:42", assets: 46, findings: 9 },
  { time: "19:43", assets: 73, findings: 17 },
  { time: "19:44", assets: 91, findings: 24 },
  { time: "19:45", assets: 112, findings: 31 },
  { time: "19:46", assets: 128, findings: 38 },
  { time: "19:47", assets: DEMO_CRYPTO_ASSET_COUNT, findings: 46 },
]


const CRYPTO_DATA = [
  {
    name: "Quantum Vulnerable",
    value: 8,
    color: "#ef4444",
  },
  {
    name: "Quantum Resistant",
    value: 6,
    color: "#22c55e",
  },
  {
    name: "Legacy",
    value: 4,
    color: "#f59e0b",
  },
  {
    name: "Transitional",
    value: 4,
    color: "#8b5cf6",
  },
]


const ALGORITHM_DATA = [
  { name: "RSA", value: 2 },
  { name: "ECC", value: 2 },
  { name: "AES", value: 2 },
  { name: "SHA", value: 2 },
  { name: "PQC", value: 3 },
  { name: "TLS", value: 2 },
  { name: "Other", value: 6 },
]


const AGENT_ACTIVITY = [
  { name: "Plan", completed: 12, active: 1 },
  { name: "Discover", completed: 34, active: 2 },
  { name: "Classify", completed: 27, active: 1 },
  { name: "Threat", completed: 21, active: 2 },
  { name: "Quantum", completed: 18, active: 1 },
  { name: "CBOM", completed: 14, active: 1 },
]


const RISK_DATA = [
  {
    name: "Critical",
    value: 9,
    icon: ShieldAlert,
    className: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "High",
    value: 17,
    icon: AlertCircle,
    className: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Medium",
    value: 28,
    icon: Activity,
    className: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    name: "Low",
    value: 94,
    icon: CheckCircle2,
    className: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
]


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  pulse = false,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  color: string
  pulse?: boolean
}) {
  return (
    <Card className="group relative overflow-hidden border-primary/10 bg-background/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${color}`}
      />

      <div
        className={`absolute -right-10 -top-10 size-24 rounded-full blur-3xl opacity-20 bg-gradient-to-r ${color}`}
      />

      <CardContent className="relative p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {title}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                {value}
              </span>

              {pulse && (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl bg-gradient-to-br ${color} p-2 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="size-4" />
          </div>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  )
}


function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="size-4 text-primary" />
      </div>

      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-[11px] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}


/* =========================================================
   PAGE
========================================================= */

export default function IntelligencePage() {
  const [expandedEvent, setExpandedEvent] =
    React.useState<number | null>(null)

  const [pulse, setPulse] = React.useState(0)

  const [liveAssets, setLiveAssets] = React.useState(DEMO_CRYPTO_ASSET_COUNT)

  const [activeAgents, setActiveAgents] =
    React.useState(1)

  const { data, isDemoMode } = useGlobalData()

  React.useEffect(() => {
    document.title = "Intelligence Console | QShieldX Dashboard"

    const interval = setInterval(() => {
      setPulse((p) => p + 1)

      setLiveAssets((current) => {
        if (current >= DEMO_CRYPTO_ASSET_COUNT) return DEMO_CRYPTO_ASSET_COUNT

        return Math.min(
          DEMO_CRYPTO_ASSET_COUNT,
          current + Math.floor(Math.random() * 3)
        )
      })

      setActiveAgents(
        Math.floor(Math.random() * 3) + 1
      )
    }, 2500)

    return () => clearInterval(interval)
  }, [])


  const assetCount =
    data.scan?.assetCount || liveAssets

  const algorithmCount =
    data.scan
      ? data.algorithms?.length || 0
      : 8

  const certificateCount =
    data.scan?.certificateCount || 36

  const secretCount =
    data.scan?.criticalSecrets || 2


  return (
    <div className="relative flex h-full flex-col gap-6 overflow-y-auto overflow-x-hidden p-4 md:p-8">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] size-72 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] size-96 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-[10%] left-[40%] size-80 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-xl bg-primary/30" />

              <div className="relative rounded-xl bg-gradient-to-br from-primary to-purple-600 p-3 text-white shadow-lg shadow-primary/20">
                <BrainCircuit className="size-6" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Intelligence Command Center
              </h1>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Autonomous cryptographic security orchestration
                </span>

                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
                >
                  <Radio className="size-3 animate-pulse" />
                  {isDemoMode ? "DEMO STREAM" : "LIVE"}
                </Badge>
              </div>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-2">

          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-primary/5 px-3 py-1.5"
          >
            <Workflow className="size-3.5 text-primary" />
            LangGraph
          </Badge>

          <Badge
            variant="outline"
            className="gap-2 border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-purple-500"
          >
            <Sparkles className="size-3.5" />
            AI Orchestrated
          </Badge>

        </div>
      </div>


      {/* =====================================================
          KPI ROW
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

        <MetricCard
          title="Assets Discovered"
          value={assetCount}
          subtitle="Cryptographic assets mapped"
          icon={Database}
          color="from-blue-500 to-cyan-500"
          pulse
        />

        <MetricCard
          title="Algorithms"
          value={algorithmCount}
          subtitle="Unique crypto primitives"
          icon={Binary}
          color="from-purple-500 to-violet-500"
        />

        <MetricCard
          title="Certificates"
          value={certificateCount}
          subtitle="TLS certificates parsed"
          icon={ShieldCheck}
          color="from-emerald-500 to-teal-500"
        />

        <MetricCard
          title="Secrets"
          value={secretCount}
          subtitle="Potential exposed secrets"
          icon={KeyRound}
          color="from-orange-500 to-red-500"
        />

        <MetricCard
          title="Agents Active"
          value={activeAgents}
          subtitle="Running intelligence nodes"
          icon={Cpu}
          color="from-pink-500 to-rose-500"
          pulse
        />

        <MetricCard
          title="Risk Score"
          value={data.scan?.riskScore || 78}
          subtitle="Current crypto risk posture"
          icon={Gauge}
          color="from-amber-500 to-orange-600"
        />

      </div>


      {/* =====================================================
          LIVE PIPELINE
      ===================================================== */}

      <Card className="overflow-hidden border-primary/15 bg-background/60 backdrop-blur">

        <CardContent className="p-4">

          <div className="mb-4 flex items-center justify-between">

            <SectionHeader
              icon={Workflow}
              title="Intelligence Pipeline"
              description="Agent execution flow"
            />

            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 text-emerald-500"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Processing
            </Badge>

          </div>


          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">

            {[
              {
                name: "Planner",
                icon: BrainCircuit,
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Discovery",
                icon: Search,
                color: "from-cyan-500 to-teal-500",
              },
              {
                name: "Classification",
                icon: Boxes,
                color: "from-violet-500 to-purple-500",
              },
              {
                name: "Threat Intel",
                icon: Radar,
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Quantum Risk",
                icon: ShieldAlert,
                color: "from-red-500 to-pink-500",
              },
              {
                name: "CBOM",
                icon: FileJson,
                color: "from-purple-500 to-indigo-500",
              },
              {
                name: "Migration",
                icon: GitBranch,
                color: "from-emerald-500 to-green-500",
              },
              {
                name: "CryptoWatch",
                icon: Eye,
                color: "from-pink-500 to-rose-500",
              },
            ].map((stage, index) => {

              const Icon = stage.icon

              return (
                <React.Fragment key={stage.name}>

                  <div className="group relative">

                    <div className="rounded-xl border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">

                      <div
                        className={`mb-2 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${stage.color} text-white shadow-md`}
                      >
                        <Icon className="size-4" />
                      </div>

                      <p className="text-xs font-medium">
                        {stage.name}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">

                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />

                        <span className="text-[10px] text-muted-foreground">
                          Complete
                        </span>

                      </div>

                    </div>

                  </div>

                  {index < 7 && (
                    <div className="hidden items-center justify-center lg:flex">
                      <ChevronRight className="size-4 animate-pulse text-primary/40" />
                    </div>
                  )}

                </React.Fragment>
              )
            })}

          </div>

        </CardContent>
      </Card>


      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Discovery Chart */}

        <Card className="xl:col-span-2 border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader className="pb-2">

            <div className="flex items-center justify-between">

              <SectionHeader
                icon={TrendingUp}
                title="Discovery Telemetry"
                description="Assets and findings discovered over time"
              />

              <Badge variant="secondary">
                LIVE
              </Badge>

            </div>

          </CardHeader>

          <CardContent>

            <div className="h-[280px] w-full">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={DISCOVERY_DATA}>

                  <defs>

                    <linearGradient
                      id="assetGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="findingGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f97316"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#f97316"
                        stopOpacity={0}
                      />
                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.15}
                  />

                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="assets"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#assetGradient)"
                    animationDuration={1200}
                  />

                  <Area
                    type="monotone"
                    dataKey="findings"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#findingGradient)"
                    animationDuration={1500}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">

              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-500" />
                Assets
              </div>

              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-orange-500" />
                Findings
              </div>

            </div>

          </CardContent>

        </Card>


        {/* Crypto Pie */}

        <Card className="border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader className="pb-0">

            <SectionHeader
              icon={LockKeyhole}
              title="Crypto Posture"
              description="Current cryptographic classification"
            />

          </CardHeader>

          <CardContent>

            <div className="relative h-[260px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={CRYPTO_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    animationBegin={100}
                    animationDuration={1200}
                  >

                    {CRYPTO_DATA.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-3xl font-bold">
                  22
                </span>

                <span className="text-[10px] text-muted-foreground">
                  TOTAL ASSETS
                </span>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-2">

              {CRYPTO_DATA.map((item) => (

                <div
                  key={item.name}
                  className="flex items-center gap-2 rounded-lg border bg-card/50 p-2"
                >

                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <div className="min-w-0">

                    <p className="truncate text-[10px] text-muted-foreground">
                      {item.name}
                    </p>

                    <p className="text-sm font-bold">
                      {item.value}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =====================================================
          SECOND CHART ROW
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Algorithms */}

        <Card className="border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader>

            <SectionHeader
              icon={Binary}
              title="Algorithm Inventory"
              description="Cryptographic primitive distribution"
            />

          </CardHeader>

          <CardContent>

            <div className="h-[250px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={ALGORITHM_DATA}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.15}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    fill="#8b5cf6"
                    animationDuration={1000}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>


        {/* Agent Activity */}

        <Card className="border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader>

            <SectionHeader
              icon={Activity}
              title="Agent Activity"
              description="Execution throughput across intelligence nodes"
            />

          </CardHeader>

          <CardContent>

            <div className="h-[250px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={AGENT_ACTIVITY}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.15}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={9}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#22c55e"
                    radius={[5, 5, 0, 0]}
                    animationDuration={1200}
                  />

                  <Bar
                    dataKey="active"
                    name="Active"
                    fill="#f59e0b"
                    radius={[5, 5, 0, 0]}
                    animationDuration={1400}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =====================================================
          SECURITY POSTURE + RISK
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Quantum Readiness */}

        <Card className="border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader>

            <SectionHeader
              icon={ShieldCheck}
              title="Quantum Readiness"
              description="Cryptographic migration posture"
            />

          </CardHeader>

          <CardContent className="space-y-5">

            <div className="flex items-center justify-center py-2">

              <div className="relative flex size-40 items-center justify-center">

                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />

                <div className="absolute inset-3 rounded-full border-8 border-muted" />

                <div className="absolute inset-3 rounded-full border-8 border-primary border-r-transparent border-b-transparent rotate-45" />

                <div className="relative text-center">

                  <div className="text-3xl font-bold text-primary">
                    {data.scan?.quantumReadiness || 42}%
                  </div>

                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Readiness
                  </div>

                </div>

              </div>

            </div>


            <div className="space-y-3">

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Quantum Resistant</span>
                  <span className="font-mono text-emerald-500">
                    27%
                  </span>
                </div>

                <Progress
                  value={27}
                  className="h-1.5"
                />
              </div>


              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Migration Coverage</span>
                  <span className="font-mono text-blue-500">
                    42%
                  </span>
                </div>

                <Progress
                  value={42}
                  className="h-1.5"
                />
              </div>


              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>PQC Adoption</span>
                  <span className="font-mono text-purple-500">
                    27%
                  </span>
                </div>

                <Progress
                  value={27}
                  className="h-1.5"
                />
              </div>

            </div>

          </CardContent>

        </Card>


        {/* Risk Distribution */}

        <Card className="lg:col-span-2 border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader>

            <SectionHeader
              icon={ShieldAlert}
              title="Risk Distribution"
              description="Prioritized findings across the discovered environment"
            />

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

              {RISK_DATA.map((risk) => {

                const Icon = risk.icon

                return (
                  <div
                    key={risk.name}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${risk.bg}`}
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`rounded-lg bg-background/60 p-2 ${risk.className}`}
                      >
                        <Icon className="size-4" />
                      </div>

                      <TrendingUp
                        className={`size-4 ${risk.className} opacity-50`}
                      />

                    </div>

                    <div className="mt-4">

                      <p className="text-xs text-muted-foreground">
                        {risk.name}
                      </p>

                      <p
                        className={`text-3xl font-bold ${risk.className}`}
                      >
                        {risk.value}
                      </p>

                    </div>

                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-background/50">

                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          risk.name === "Critical"
                            ? "w-[25%] bg-red-500"
                            : risk.name === "High"
                              ? "w-[45%] bg-orange-500"
                              : risk.name === "Medium"
                                ? "w-[65%] bg-yellow-500"
                                : "w-[90%] bg-emerald-500"
                        }`}
                      />

                    </div>

                  </div>
                )
              })}

            </div>


            <div className="mt-5 rounded-xl border bg-card/50 p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-red-500/10 p-2">
                  <Zap className="size-4 text-red-500" />
                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-semibold">
                      Immediate Migration Exposure
                    </p>

                    <Badge
                      variant="destructive"
                      className="animate-pulse"
                    >
                      HIGH
                    </Badge>

                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Quantum-vulnerable cryptographic primitives require
                    migration planning and crypto-agility controls.
                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =====================================================
          AGENT QUEUE + TIMELINE
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        {/* Agent Queue */}

        <Card className="border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader className="pb-3">

            <SectionHeader
              icon={Network}
              title="Agent Queue"
              description="LangGraph node execution status"
            />

          </CardHeader>

          <CardContent className="space-y-2">

            {AGENTS.map((agent) => (

              <div
                key={agent.name}
                className="group rounded-lg border bg-card/60 p-2.5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >

                <div className="flex items-center justify-between">

                  <div className="flex min-w-0 items-center gap-2">

                    {agent.status === "completed" ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <span className="relative flex size-4 shrink-0">
                        <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/50" />
                        <Activity className="relative size-4 text-amber-500" />
                      </span>
                    )}

                    <span className="truncate text-xs font-medium">
                      {agent.name}
                    </span>

                  </div>

                  <Badge
                    variant={
                      agent.type === "supervisor"
                        ? "default"
                        : "secondary"
                    }
                    className="ml-2 text-[9px]"
                  >
                    {agent.type}
                  </Badge>

                </div>


                <div className="mt-2 flex items-center gap-2">

                  <Progress
                    value={agent.confidence}
                    className="h-1 flex-1"
                  />

                  <span className="font-mono text-[9px] text-muted-foreground">
                    {agent.confidence}%
                  </span>

                </div>

              </div>

            ))}

          </CardContent>

        </Card>


        {/* Timeline */}

        <Card className="lg:col-span-3 border-primary/15 bg-background/60 backdrop-blur">

          <CardHeader className="pb-3">

            <div className="flex items-center justify-between">

              <SectionHeader
                icon={Cpu}
                title="Live Agent Timeline"
                description="Real-time graph transitions and decisions"
              />

              <Badge
                variant="outline"
                className="animate-pulse border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
              >
                <CircleDot className="mr-1 size-3" />
                STREAMING
              </Badge>

            </div>

          </CardHeader>


          <CardContent className="max-h-[560px] overflow-y-auto pr-3">

            <div className="space-y-4">

              {TIMELINE_EVENTS.map((ev, idx) => (

                <div
                  key={ev.id}
                  className="relative pl-7"
                >

                  {idx !== TIMELINE_EVENTS.length - 1 && (
                    <div className="absolute left-[11px] top-7 bottom-[-20px] w-px bg-gradient-to-b from-primary/50 to-border" />
                  )}


                  <div className="absolute left-[6px] top-2 size-3 rounded-full border-2 border-background bg-primary shadow-[0_0_12px_rgba(99,102,241,0.7)]" />


                  <div className="rounded-xl border bg-card/60 p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-md">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

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
                          className="border-primary/30 bg-primary/5 font-mono text-[9px] text-primary"
                        >
                          {ev.node}
                        </Badge>

                      </div>

                      <span className="font-mono text-[10px] text-muted-foreground">
                        {ev.timestamp}
                      </span>

                    </div>


                    <p className="mt-3 text-sm font-semibold">
                      {ev.action}
                    </p>


                    <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-muted-foreground">

                      {ev.tool && (
                        <div className="flex items-center gap-1">
                          <Terminal className="size-3" />
                          Tool:
                          <span className="font-mono text-foreground">
                            {ev.tool}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Timer className="size-3" />
                        Runtime:
                        <span className="font-mono text-foreground">
                          {ev.runtime}
                        </span>
                      </div>

                      <HoverCard>

                        <HoverCardTrigger asChild>

                          <div className="flex cursor-help items-center gap-1 border-b border-dashed border-muted-foreground/40">
                            <Activity className="size-3" />
                            Confidence:
                            <span className="font-mono text-foreground">
                              {(ev.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                        </HoverCardTrigger>

                        <HoverCardContent className="w-64 text-xs">
                          Agent confidence based on tool output validation,
                          evidence correlation, and execution consistency.
                        </HoverCardContent>

                      </HoverCard>

                    </div>


                    <div className="mt-3 rounded-lg border-l-2 border-primary bg-primary/5 p-3 text-xs">

                      <span className="font-semibold">
                        Result:
                      </span>{" "}

                      {ev.result}

                    </div>


                    <div className="mt-2 flex justify-end">

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() =>
                          setExpandedEvent(
                            expandedEvent === ev.id
                              ? null
                              : ev.id
                          )
                        }
                      >

                        <FileJson className="mr-1 size-3" />

                        {expandedEvent === ev.id
                          ? "Hide Payload"
                          : "View Payload"}

                        {expandedEvent === ev.id ? (
                          <ChevronUp className="ml-1 size-3" />
                        ) : (
                          <ChevronDown className="ml-1 size-3" />
                        )}

                      </Button>

                    </div>


                    {expandedEvent === ev.id && (

                      <div className="mt-2 overflow-x-auto rounded-lg border border-emerald-500/20 bg-black p-3 font-mono text-[10px] text-emerald-400 shadow-inner">

                        <pre>
                          {JSON.stringify(
                            ev.payload,
                            null,
                            2
                          )}
                        </pre>

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>


      {/* =====================================================
          DISCOVERY STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

        {[
          {
            label: "Subdomains",
            value: 34,
            icon: Network,
            color: "text-blue-500",
          },
          {
            label: "TLS Services",
            value: 18,
            icon: Server,
            color: "text-cyan-500",
          },
          {
            label: "Crypto Libraries",
            value: 12,
            icon: Boxes,
            color: "text-purple-500",
          },
          {
            label: "Threat Signals",
            value: 9,
            icon: Radar,
            color: "text-red-500",
          },
        ].map((item) => {

          const Icon = item.icon

          return (
            <Card
              key={item.label}
              className="group border-primary/10 bg-background/60 backdrop-blur transition-all duration-300 hover:border-primary/30"
            >

              <CardContent className="flex items-center gap-3 p-4">

                <div
                  className={`rounded-xl bg-muted p-3 ${item.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="size-5" />
                </div>

                <div>

                  <p className="text-xs text-muted-foreground">
                    {item.label}
                  </p>

                  <p className="text-xl font-bold">
                    {item.value}
                  </p>

                </div>

              </CardContent>

            </Card>
          )
        })}

      </div>


      {/* =====================================================
          STREAMING TERMINAL
      ===================================================== */}

      <Card className="min-h-[300px] overflow-hidden border-emerald-500/20 bg-black font-mono text-green-400 shadow-2xl shadow-green-500/5">

        <div className="flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-3">

          <div className="flex items-center gap-3">

            <div className="rounded-md bg-green-500/10 p-1.5">
              <Terminal className="size-4 text-green-400" />
            </div>

            <div>

              <span className="text-xs font-semibold uppercase tracking-widest text-green-400/90">
                Agent Console Activity
              </span>

              <p className="text-[9px] text-green-400/40">
                QShieldX Intelligence Runtime
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <span className="relative flex size-2">

              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex size-2 rounded-full bg-green-500" />

            </span>

            <span className="text-[9px] uppercase tracking-wider text-green-400/60">
              WebSocket Streaming
            </span>

          </div>

        </div>


        <div className="max-h-[320px] overflow-y-auto p-4 text-[11px] leading-relaxed">

          {MOCK_LOGS.map((log, index) => (

            <div
              key={index}
              className="group flex gap-2 rounded px-1 py-0.5 transition-colors hover:bg-green-400/5"
            >

              <span className="select-none text-green-400/20">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span>
                {log}
              </span>

            </div>

          ))}


          <div className="mt-2 flex items-center gap-2">

            <span className="text-green-400/50">
              $
            </span>

            <span className="inline-block h-3 w-2 animate-pulse bg-green-400" />

          </div>

        </div>

      </Card>


      {/* =====================================================
          FOOTER STATUS
      ===================================================== */}

      <div className="flex flex-col items-center justify-between gap-2 border-t py-3 text-[10px] text-muted-foreground sm:flex-row">

        <div className="flex items-center gap-3">

          <span className="flex items-center gap-1.5">

            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />

            Intelligence Engine Operational

          </span>

          <span>•</span>

          <span>
            Scan ID: {data.scan?.id || "QX-DEMO-2026-001"}
          </span>

        </div>


        <div className="flex items-center gap-3">

          <span>
            Pulse #{pulse}
          </span>

          <span>•</span>

          <span className="font-mono">
            QShieldX Runtime
          </span>

        </div>

      </div>

    </div>
  )
}