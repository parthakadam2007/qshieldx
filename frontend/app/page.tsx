"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Binary,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileJson,
  GitBranch,
  KeyRound,
  Layers3,
  LockKeyhole,
  Radar,
  Rocket,
  ScanLine,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Zap,
} from "lucide-react"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { useGlobalData } from "@/app/context/GlobalDataContext"

/* =========================================================
   CBOM-DERIVED DATA
========================================================= */

const CBOM_STATUS_DATA = [
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
    name: "Other / Transitional",
    value: 4,
    color: "#8b5cf6",
  },
]

const ALGORITHM_DATA = [
  {
    name: "RSA",
    count: 2,
    risk: 100,
  },
  {
    name: "ECC",
    count: 2,
    risk: 95,
  },
  {
    name: "AES",
    count: 2,
    risk: 25,
  },
  {
    name: "SHA",
    count: 2,
    risk: 20,
  },
  {
    name: "PQC",
    count: 3,
    risk: 5,
  },
  {
    name: "DH",
    count: 1,
    risk: 90,
  },
  {
    name: "X25519",
    count: 1,
    risk: 90,
  },
  {
    name: "TLS",
    count: 2,
    risk: 55,
  },
  {
    name: "JWT",
    count: 1,
    risk: 85,
  },
  {
    name: "Other",
    count: 3,
    risk: 30,
  },
]

const SECURITY_POSTURE = [
  {
    name: "Quantum Readiness",
    value: 42,
    icon: Radar,
    color: "bg-purple-500",
    text: "text-purple-500",
  },
  {
    name: "PQC Adoption",
    value: 27,
    icon: ShieldCheck,
    color: "bg-emerald-500",
    text: "text-emerald-500",
  },
  {
    name: "Crypto Agility",
    value: 64,
    icon: GitBranch,
    color: "bg-blue-500",
    text: "text-blue-500",
  },
]

const VULNERABILITIES = [
  {
    id: "QX-CRYPTO-001",
    title: "Weak RSA",
    algorithm: "RSA-2048",
    severity: "critical",
    score: 9.5,
    description:
      "RSA-2048 is vulnerable to future cryptographically relevant quantum computers using Shor's algorithm.",
    recommendation:
      "Migrate to a post-quantum or hybrid cryptographic mechanism.",
  },
  {
    id: "QX-CRYPTO-002",
    title: "ECDSA P-256",
    algorithm: "ECDSA",
    severity: "high",
    score: 8.5,
    description:
      "ECDSA relies on elliptic-curve discrete logarithms and is vulnerable to Shor's algorithm.",
    recommendation:
      "Adopt ML-DSA or another approved post-quantum signature scheme.",
  },
  {
    id: "QX-CRYPTO-003",
    title: "Legacy TLS",
    algorithm: "TLS 1.2",
    severity: "medium",
    score: 6.5,
    description:
      "Legacy TLS configuration detected in the cryptographic inventory.",
    recommendation:
      "Upgrade to TLS 1.3 and evaluate hybrid PQC key exchange.",
  },
]

const MIGRATION_ITEMS = [
  {
    title: "RSA-2048",
    location: "API Gateway certificate",
    priority: "Critical",
    icon: KeyRound,
  },
  {
    title: "JWT RS256",
    location: "Authentication Service",
    priority: "High",
    icon: LockKeyhole,
  },
  {
    title: "ECDSA P-256",
    location: "Digital signatures",
    priority: "High",
    icon: ShieldAlert,
  },
  {
    title: "DH-2048",
    location: "Key agreement",
    priority: "High",
    icon: Binary,
  },
  {
    title: "TLS 1.2",
    location: "Legacy transport",
    priority: "Medium",
    icon: Server,
  },
]

/* =========================================================
   HELPERS
========================================================= */

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  className = "",
  valueClassName = "",
  iconClassName = "",
}: {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  className?: string
  valueClassName?: string
  iconClassName?: string
}) {
  return (
    <Card
      className={`
        group relative overflow-hidden
        border-border/50
        bg-background/60
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-primary/30
        hover:shadow-xl
        ${className}
      `}
    >
      <div className="absolute -right-10 -top-10 size-24 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <div
          className={`flex size-9 items-center justify-center rounded-xl bg-muted/70 ${iconClassName}`}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className={`text-3xl font-bold tracking-tight ${valueClassName}`}>
          {value}
        </div>

        <p className="mt-1 text-[10px] text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function SeverityBadge({
  severity,
}: {
  severity: string
}) {
  if (severity === "critical") {
    return (
      <Badge
        variant="outline"
        className="border-red-500/30 bg-red-500/10 text-red-500"
      >
        CRITICAL
      </Badge>
    )
  }

  if (severity === "high") {
    return (
      <Badge
        variant="outline"
        className="border-orange-500/30 bg-orange-500/10 text-orange-500"
      >
        HIGH
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-amber-500/30 bg-amber-500/10 text-amber-500"
    >
      MEDIUM
    </Badge>
  )
}

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  const router = useRouter()
  const { data, isLoading } = useGlobalData()

  const scan = data.scan

  const totalAssets = scan?.assetCount ?? 22

  const quantumReady = 42
  const riskScore = 78
  const pqcAdoption = 27
  const vulnerableAssets = 8
  const legacyAssets = 4
  const resistantAssets = 6

  const certificateCount = scan?.certificateCount ?? 36
  const criticalSecrets = scan?.criticalSecrets ?? 2

  const statusTotal = CBOM_STATUS_DATA.reduce(
    (sum, item) => sum + item.value,
    0,
  )

  const riskLabel = riskScore >= 70 ? "HIGH" : "MODERATE"

  const donutLabel = useMemo(() => {
    return `${Math.round((vulnerableAssets / totalAssets) * 100)}%`
  }, [totalAssets])

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 size-[500px] rounded-full bg-purple-500/5 blur-[130px]" />
        <div className="absolute right-0 top-0 size-[500px] rounded-full bg-blue-500/5 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 size-[400px] rounded-full bg-emerald-500/5 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] space-y-6 p-4 md:p-8">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
              <Shield className="size-7 text-primary" />

              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-background bg-emerald-500 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Enterprise Cryptography Overview
                </h1>

                <Badge
                  variant="outline"
                  className="border-red-500/30 bg-red-500/5 text-red-500"
                >
                  <ShieldAlert className="mr-1 size-3" />
                  {riskLabel} RISK
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Post-quantum readiness, cryptographic inventory and migration
                intelligence.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/cbom">
                <FileJson className="mr-2 size-4" />
                CBOM Explorer
              </Link>
            </Button>

            <Button asChild>
              <Link href="/targets/new">
                <ScanLine className="mr-2 size-4" />
                Run Discovery
              </Link>
            </Button>
          </div>
        </div>

        {/* ===================================================
            SCAN STATUS
        =================================================== */}

        <Card className="overflow-hidden border-primary/15 bg-primary/[0.025] backdrop-blur-xl">
          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-500" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  CBOM analysis completed
                </p>

                <p className="text-xs text-muted-foreground">
                  Scan scan-2026-09-15-001 • CycloneDX 1.7 • QShieldX CBOM
                  Engine
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3" />
                {scan?.duration ?? "48.2s"}
              </span>

              <span className="flex items-center gap-1.5">
                <Database className="size-3" />
                {totalAssets} assets
              </span>

              <span className="flex items-center gap-1.5">
                <Layers3 className="size-3" />
                14 recommendations
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ===================================================
            KPI ROW
        =================================================== */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
          <MetricCard
            title="Crypto Assets"
            value={totalAssets}
            description="Indexed in CBOM"
            icon={KeyRound}
            iconClassName="text-primary"
          />

          <MetricCard
            title="Quantum Vulnerable"
            value={vulnerableAssets}
            description="Requires migration"
            icon={ShieldAlert}
            valueClassName="text-red-500"
            iconClassName="text-red-500"
          />

          <MetricCard
            title="Quantum Resistant"
            value={resistantAssets}
            description="Resistant inventory"
            icon={ShieldCheck}
            valueClassName="text-emerald-500"
            iconClassName="text-emerald-500"
          />

          <MetricCard
            title="Legacy"
            value={legacyAssets}
            description="Legacy cryptography"
            icon={TriangleAlert}
            valueClassName="text-amber-500"
            iconClassName="text-amber-500"
          />

          <MetricCard
            title="Risk Score"
            value={`${riskScore}/100`}
            description="Overall cryptographic risk"
            icon={Target}
            valueClassName="text-red-500"
            iconClassName="text-red-500"
          />

          <MetricCard
            title="PQC Adoption"
            value={`${pqcAdoption}%`}
            description="Post-quantum mechanisms"
            icon={Rocket}
            valueClassName="text-purple-500"
            iconClassName="text-purple-500"
          />
        </div>

        {/* ===================================================
            CHART ROW
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* =================================================
              PIE CHART
          ================================================= */}

          <Card className="overflow-hidden border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Radar className="size-4 text-primary" />
                    Cryptographic Risk Distribution
                  </CardTitle>

                  <CardDescription className="text-xs">
                    CBOM assets by quantum security posture
                  </CardDescription>
                </div>

                <Badge variant="outline">
                  {statusTotal} classified
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="relative h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CBOM_STATUS_DATA}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={105}
                      paddingAngle={4}
                      strokeWidth={0}
                      animationDuration={1200}
                    >
                      {CBOM_STATUS_DATA.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {donutLabel}
                  </span>

                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    Vulnerable
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {CBOM_STATUS_DATA.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />

                      <span className="text-[10px]">
                        {item.name}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* =================================================
              ALGORITHM BAR CHART
          ================================================= */}

          <Card className="overflow-hidden border-border/50 bg-background/60 backdrop-blur-xl xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Binary className="size-4 text-purple-500" />
                Algorithm Inventory
              </CardTitle>

              <CardDescription className="text-xs">
                Cryptographic primitives discovered in the CBOM
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ALGORITHM_DATA}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.08}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
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

                    <Bar
                      dataKey="count"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1300}
                    >
                      {ALGORITHM_DATA.map((item) => (
                        <Cell
                          key={item.name}
                          fill={
                            item.risk >= 80
                              ? "#ef4444"
                              : item.risk >= 50
                                ? "#f59e0b"
                                : item.risk <= 20
                                  ? "#22c55e"
                                  : "#8b5cf6"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-500" />
                  Quantum vulnerable
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Transitional
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Resistant / acceptable
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===================================================
            POSTURE + OSCA
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          {/* POSTURE */}

          <Card className="border-border/50 bg-background/60 backdrop-blur-xl xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <GaugeIcon />
                Security Posture
              </CardTitle>

              <CardDescription className="text-xs">
                Current cryptographic modernization state
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {SECURITY_POSTURE.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-4 ${item.text}`} />

                        <span className="text-xs font-medium">
                          {item.name}
                        </span>
                      </div>

                      <span
                        className={`font-mono text-xs font-bold ${item.text}`}
                      >
                        {item.value}%
                      </span>
                    </div>

                    <Progress
                      value={item.value}
                      className="h-2"
                    />
                  </div>
                )
              })}

              <Separator />

              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                    <AlertTriangle className="size-4 text-red-500" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-red-500">
                      Harvest-now, decrypt-later
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                      The CBOM classifies HNDL exposure as high-risk and
                      identifies long-lived data requiring protection.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OSCA */}

          <Card className="relative overflow-hidden border-purple-500/20 bg-background/60 backdrop-blur-xl xl:col-span-3">
            <div className="absolute right-0 top-0 size-48 rounded-full bg-purple-500/10 blur-3xl" />

            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="size-4 text-purple-500" />
                    OSCA's Theorem Timeline
                  </CardTitle>

                  <CardDescription className="text-xs">
                    Shelf life + migration time versus quantum arrival
                  </CardDescription>
                </div>

                <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                  x + y &gt; z
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative">
              {/* Timeline */}

              <div className="relative mt-3 px-2">
                <div className="absolute left-8 right-8 top-7 h-1 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-30" />

                <div className="relative flex items-start justify-between">
                  <div className="flex w-28 flex-col items-center text-center">
                    <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-background bg-emerald-500/15 text-emerald-500 shadow-lg">
                      <Rocket className="size-5" />
                    </div>

                    <p className="mt-3 text-xs font-semibold">
                      Today
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Migration begins
                    </p>

                    <Badge
                      variant="outline"
                      className="mt-2 border-emerald-500/20 text-emerald-500"
                    >
                      y ≈ 3 yrs
                    </Badge>
                  </div>

                  <div className="flex w-32 flex-col items-center text-center">
                    <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-background bg-amber-500/15 text-amber-500 shadow-lg">
                      <Database className="size-5" />
                    </div>

                    <p className="mt-3 text-xs font-semibold">
                      Data Value Horizon
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Data remains valuable
                    </p>

                    <Badge
                      variant="outline"
                      className="mt-2 border-amber-500/20 text-amber-500"
                    >
                      x ≈ 15 yrs
                    </Badge>
                  </div>

                  <div className="flex w-28 flex-col items-center text-center">
                    <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-background bg-red-500/15 text-red-500 shadow-lg shadow-red-500/10">
                      <Zap className="size-5 animate-pulse" />
                    </div>

                    <p className="mt-3 text-xs font-semibold">
                      Q-Day
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      CRQC available
                    </p>

                    <Badge
                      variant="outline"
                      className="mt-2 border-red-500/20 text-red-500"
                    >
                      z ≈ 8 yrs
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Calculation */}

              <div className="mt-7 grid grid-cols-3 gap-2">
                <div className="rounded-xl border bg-card/50 p-3 text-center">
                  <p className="text-lg font-bold">15 yrs</p>
                  <p className="text-[9px] text-muted-foreground">
                    Shelf life
                  </p>
                </div>

                <div className="rounded-xl border bg-card/50 p-3 text-center">
                  <p className="text-lg font-bold">+</p>
                  <p className="text-[9px] text-muted-foreground">
                    Migration
                  </p>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 text-center">
                  <p className="text-lg font-bold text-red-500">
                    18 yrs
                  </p>
                  <p className="text-[9px] text-muted-foreground">
                    Combined horizon
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/[0.04] to-purple-500/[0.04] p-4">
                <div className="flex gap-3">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-500" />

                  <div>
                    <p className="text-xs font-semibold">
                      OSCA timing exposure
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                      The combined migration and data-value horizon is
                      approximately 18 years versus the illustrative
                      projected CRQC arrival window of approximately 8
                      years. This creates a substantial timing gap that
                      should inform migration prioritization.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===================================================
            MIGRATION + VULNERABILITIES
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* MIGRATION */}

          <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <GitBranch className="size-4 text-primary" />
                    Migration Priority
                  </CardTitle>

                  <CardDescription className="text-xs">
                    Cryptographic assets to evaluate first
                  </CardDescription>
                </div>

                <Badge variant="outline">
                  {vulnerableAssets} vulnerable
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {MIGRATION_ITEMS.map((item, index) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="group flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <Icon className="size-4" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold">
                          {item.title}
                        </p>

                        <p className="text-[10px] text-muted-foreground">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          item.priority === "Critical"
                            ? "border-red-500/30 text-red-500"
                            : item.priority === "High"
                              ? "border-orange-500/30 text-orange-500"
                              : "border-amber-500/30 text-amber-500"
                        }
                      >
                        {item.priority}
                      </Badge>

                      <ChevronRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                )
              })}

              <Button
                variant="ghost"
                className="mt-2 w-full text-xs"
                onClick={() => router.push("/intelligence")}
              >
                Open Intelligence Command Center
                <ArrowRight className="ml-2 size-3" />
              </Button>
            </CardContent>
          </Card>

          {/* VULNERABILITIES */}

          <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldAlert className="size-4 text-red-500" />
                CBOM Vulnerabilities
              </CardTitle>

              <CardDescription className="text-xs">
                Findings generated from the cryptographic inventory
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {VULNERABILITIES.map((vulnerability) => (
                <div
                  key={vulnerability.id}
                  className="rounded-xl border border-border/50 bg-card/40 p-4 transition-all hover:border-red-500/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold">
                          {vulnerability.title}
                        </p>

                        <SeverityBadge
                          severity={vulnerability.severity}
                        />
                      </div>

                      <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                        {vulnerability.id} • {vulnerability.algorithm}
                      </p>
                    </div>

                    <div className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500">
                      {vulnerability.score}
                    </div>
                  </div>

                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                    {vulnerability.description}
                  </p>

                  <div className="mt-3 rounded-lg border-l-2 border-primary bg-primary/[0.03] p-2.5 text-[10px]">
                    <span className="font-semibold">
                      Recommendation:
                    </span>{" "}
                    {vulnerability.recommendation}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ===================================================
            INFRASTRUCTURE
        =================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* SERVICES */}

          <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-sm">
                Protected Services
              </CardTitle>

              <CardDescription className="text-xs">
                Services identified in the CBOM
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              {[
                {
                  name: "API Gateway",
                  crypto: "TLS 1.3 + RSA-2048",
                  status: "At Risk",
                },
                {
                  name: "Authentication Service",
                  crypto: "JWT RS256 + bcrypt",
                  status: "At Risk",
                },
                {
                  name: "PostgreSQL Database",
                  crypto: "TLS + AES-256",
                  status: "Protected",
                },
              ].map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-xl border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                      <Server className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        {service.name}
                      </p>

                      <p className="text-[9px] text-muted-foreground">
                        {service.crypto}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      service.status === "Protected"
                        ? "border-emerald-500/20 text-emerald-500"
                        : "border-amber-500/20 text-amber-500"
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CERTIFICATES */}

          <Card className="border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarClock className="size-4 text-amber-500" />
                Certificate Intelligence
              </CardTitle>

              <CardDescription className="text-xs">
                Certificate inventory and lifecycle
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {certificateCount}
                </span>

                <span className="mb-1 text-xs text-muted-foreground">
                  certificates
                </span>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Expiring soon
                  </span>

                  <span className="font-semibold text-amber-500">
                    11
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    RSA based
                  </span>

                  <span className="font-semibold text-red-500">
                    22
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Hybrid migration
                  </span>

                  <span className="font-semibold text-purple-500">
                    Required
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CBOM */}

          <Card
            className="cursor-pointer border-primary/15 bg-background/60 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            onClick={() => router.push("/cbom")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileJson className="size-4 text-primary" />
                CBOM Intelligence
              </CardTitle>

              <CardDescription className="text-xs">
                CycloneDX cryptographic bill of materials
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                  <FileJson className="size-8 text-primary" />
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    1.7
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    CycloneDX specification
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Scan completed
                </span>

                <span className="flex items-center text-xs font-medium text-primary">
                  Explore CBOM
                  <ArrowRight className="ml-1 size-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4 text-[10px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              CBOM Engine Operational
            </span>

            <span className="flex items-center gap-1.5">
              <Activity className="size-3" />
              Last scan: 48.2s
            </span>

            <span className="flex items-center gap-1.5">
              <Database className="size-3" />
              {totalAssets} assets
            </span>
          </div>

          <span className="font-mono">
            QShieldX • Cryptographic Intelligence
          </span>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   ICON HELPER
========================================================= */

function GaugeIcon() {
  return <Target className="size-4 text-blue-500" />
}