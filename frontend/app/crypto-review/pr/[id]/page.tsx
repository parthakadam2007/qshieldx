"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Lock,
  GitPullRequest,
  GitBranch,
  GitCommit,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Check,
  Copy,
  ExternalLink,
  Code2,
  FileCode,
  FileJson,
  Sparkles,
  Bot,
  MessageSquare,
  Wand2,
  Terminal,
  TrendingDown,
  TrendingUp,
  Layers,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { initialPRReviews, PRReview } from "../../data"

export default function PRReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const prId = params?.id as string

  // Locate the PR from mock dataset or default to #142
  const pr: PRReview =
    initialPRReviews.find((p) => p.id === prId || p.prNumber.toString() === prId) ||
    initialPRReviews[0]

  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [expandedCodeFinding, setExpandedCodeFinding] = React.useState<string | null>(
    pr.findings[0]?.id || null
  )
  const [showFixModal, setShowFixModal] = React.useState<string | null>(null)
  const [copiedComment, setCopiedComment] = React.useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyComment = () => {
    const commentMarkdown = `## 🔐 PQ-Guard Crypto Review
> Automated cryptographic and post-quantum security analysis

### 🔴 1 Critical Crypto Risk Detected
- **Finding**: RSA-2048 detected in \`src/security/Signer.java:42\`
- **Threat**: Shor's Algorithm (Polynomial-time factoring by quantum adversary)
- **Recommendation**: Consider immediate migration to NIST FIPS 204 ML-DSA (CRYSTALS-Dilithium).

#### CBOM Diff
- Assets: ${pr.cbomDiff.cryptoAssetsBefore} → ${pr.cbomDiff.cryptoAssetsAfter}
- Quantum Readiness: ${pr.cbomDiff.quantumReadinessBefore}% → ${pr.cbomDiff.quantumReadinessAfter}%`

    navigator.clipboard.writeText(commentMarkdown)
    setCopiedComment(true)
    showToast("PR comment copied as Markdown!")
    setTimeout(() => setCopiedComment(false), 2500)
  }

  const renderRiskBadge = (risk: PRReview["risk"]) => {
    switch (risk) {
      case "Critical":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 gap-1.5 text-xs font-semibold px-2.5 py-1">
            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
            Critical Risk
          </Badge>
        )
      case "High":
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 gap-1.5 text-xs font-semibold px-2.5 py-1">
            <span className="size-2 rounded-full bg-orange-500" />
            High Risk
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 gap-1.5 text-xs font-medium px-2.5 py-1">
            <span className="size-2 rounded-full bg-amber-500" />
            Medium Risk
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 gap-1.5 text-xs font-medium px-2.5 py-1">
            <span className="size-2 rounded-full bg-blue-500" />
            Low Risk
          </Badge>
        )
      case "Safe":
      default:
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 text-xs font-medium px-2.5 py-1">
            <span className="size-2 rounded-full bg-emerald-500" />
            Safe
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xl animate-in fade-in slide-in-from-top-3">
          <Check className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/crypto-review"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Crypto Review
        </Link>
        <span>/</span>
        <span className="font-mono">{pr.repository}</span>
        <span>/</span>
        <span className="text-foreground font-semibold">PR #{pr.prNumber}</span>
      </div>

      {/* PR Header Banner */}
      <div className="border border-border rounded-xl bg-card p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">#{pr.prNumber}</span>
              <h1 className="text-xl font-bold tracking-tight">{pr.title}</h1>
              {renderRiskBadge(pr.risk)}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <GitBranch className="size-3.5" />
                <span className="font-mono font-medium text-foreground">{pr.repository}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">
                  {pr.branch}
                </span>
                <span>into</span>
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">
                  {pr.baseBranch}
                </span>
              </div>
              <span>•</span>
              <div>
                Author: <span className="font-medium text-foreground">{pr.author.name}</span>
              </div>
              <span>•</span>
              <div>Reviewed {pr.reviewedAt}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyComment}
              className="text-xs h-8 gap-1.5"
            >
              {copiedComment ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              Copy PR Comment
            </Button>

            <Button
              size="sm"
              onClick={() => showToast("Triggered re-analysis with latest CBOM catalog")}
              className="text-xs h-8 gap-1.5"
            >
              <Sparkles className="size-3" />
              Re-run Review
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left content vs Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: CBOM Diff, Findings, and PR Comment Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* ========================================================================= */}
          {/* 1. CBOM DIFF (FIRST-CLASS FEATURE)                                        */}
          {/* ========================================================================= */}
          <Card className="border-border overflow-hidden">
            <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  CBOM Diff (Cryptographic Bill of Materials)
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated delta analysis of cryptographic dependencies and primitives
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono">
                CycloneDX 1.7
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Metrics Diff Row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Crypto Assets */}
                <div className="border rounded-lg p-3 bg-card/60">
                  <span className="text-[11px] text-muted-foreground block">Crypto Assets</span>
                  <div className="text-lg font-bold mt-1 flex items-center gap-2">
                    <span>{pr.cbomDiff.cryptoAssetsBefore}</span>
                    <ArrowLeft className="size-3.5 rotate-180 text-muted-foreground" />
                    <span className="text-primary">{pr.cbomDiff.cryptoAssetsAfter}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {pr.cbomDiff.cryptoAssetsAfter - pr.cbomDiff.cryptoAssetsBefore > 0 ? "+" : ""}
                    {pr.cbomDiff.cryptoAssetsAfter - pr.cbomDiff.cryptoAssetsBefore} asset change
                  </span>
                </div>

                {/* Critical Risks */}
                <div className="border rounded-lg p-3 bg-card/60">
                  <span className="text-[11px] text-muted-foreground block">Critical Risks</span>
                  <div className="text-lg font-bold mt-1 flex items-center gap-2">
                    <span>{pr.cbomDiff.criticalRisksBefore}</span>
                    <ArrowLeft className="size-3.5 rotate-180 text-muted-foreground" />
                    <span
                      className={
                        pr.cbomDiff.criticalRisksAfter > pr.cbomDiff.criticalRisksBefore
                          ? "text-red-500"
                          : "text-foreground"
                      }
                    >
                      {pr.cbomDiff.criticalRisksAfter}
                    </span>
                  </div>
                  <span className="text-[10px] text-red-500 font-medium">
                    +{pr.cbomDiff.criticalRisksAfter - pr.cbomDiff.criticalRisksBefore} new vulnerability
                  </span>
                </div>

                {/* Quantum Readiness */}
                <div className="border rounded-lg p-3 bg-card/60">
                  <span className="text-[11px] text-muted-foreground block">Quantum Readiness</span>
                  <div className="text-lg font-bold mt-1 flex items-center gap-2">
                    <span>{pr.cbomDiff.quantumReadinessBefore}%</span>
                    <ArrowLeft className="size-3.5 rotate-180 text-muted-foreground" />
                    <span
                      className={
                        pr.cbomDiff.quantumReadinessAfter < pr.cbomDiff.quantumReadinessBefore
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }
                    >
                      {pr.cbomDiff.quantumReadinessAfter}%
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                    <TrendingDown className="size-3" />
                    {pr.cbomDiff.quantumReadinessAfter - pr.cbomDiff.quantumReadinessBefore}% degradation
                  </span>
                </div>
              </div>

              {/* Side-by-Side CBOM Comparison */}
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 divide-x border-b bg-muted/40 p-2.5 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 px-2">
                    <span className="text-muted-foreground">CBOM BEFORE</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                      {pr.baseBranch}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 px-2">
                    <span className="text-primary font-semibold">CBOM AFTER</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                      {pr.branch}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x p-3 font-mono text-xs gap-y-2 bg-card">
                  {/* Left: Before */}
                  <div className="space-y-1.5 px-2">
                    {pr.cbomDiff.before.map((alg, i) => (
                      <div key={i} className="text-muted-foreground py-0.5">
                        {alg}
                      </div>
                    ))}
                  </div>

                  {/* Right: After */}
                  <div className="space-y-1.5 px-2">
                    {pr.cbomDiff.after.map((alg, i) => {
                      const isNew = alg.startsWith("+")
                      return (
                        <div
                          key={i}
                          className={`py-0.5 font-medium ${
                            isNew
                              ? "text-red-600 dark:text-red-400 bg-red-500/10 px-1.5 rounded -mx-1.5 inline-block"
                              : "text-foreground"
                          }`}
                        >
                          {alg}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* New Crypto Assets List */}
              {pr.cbomDiff.newAssets.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-foreground">New Crypto Assets:</span>
                  <div className="space-y-2">
                    {pr.cbomDiff.newAssets.map((asset, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-red-500/30 bg-red-500/5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-red-600 dark:text-red-400">
                            + {asset.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">({asset.category})</span>
                        </div>
                        <Badge variant="outline" className="bg-red-500/15 text-red-500 border-red-500/40 text-[10px]">
                          🔴 {asset.risk}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ========================================================================= */}
          {/* 2. FINDINGS LIST                                                          */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                Findings ({pr.findings.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Ranked by post-quantum risk severity
              </span>
            </div>

            {pr.findings.length > 0 ? (
              pr.findings.map((finding, idx) => (
                <Card
                  key={finding.id}
                  className="border-border/90 overflow-hidden shadow-xs"
                >
                  <CardHeader className="p-4 pb-3 bg-muted/20 border-b border-border/70">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">
                            Finding #{idx + 1}
                          </span>
                          {finding.severity === "Critical" && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-[10px] font-semibold">
                              🔴 CRITICAL
                            </Badge>
                          )}
                          {finding.severity === "High" && (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 text-[10px] font-semibold">
                              🔴 HIGH
                            </Badge>
                          )}
                          {finding.severity === "Medium" && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] font-semibold">
                              🟠 MEDIUM
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-sm font-semibold">{finding.title}</CardTitle>
                      </div>

                      <div className="text-right font-mono text-xs text-muted-foreground shrink-0">
                        {finding.file}:{finding.line}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3.5 text-xs">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/60">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">File:</span>
                        <span className="font-mono font-medium">{finding.file}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Line:</span>
                        <span className="font-mono font-medium">{finding.line}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Usage:</span>
                        <span className="font-medium">{finding.usage}</span>
                      </div>
                    </div>

                    {/* Threat description */}
                    <div className="space-y-1">
                      <span className="font-semibold text-foreground">Threat:</span>
                      <p className="text-muted-foreground leading-relaxed">{finding.threat}</p>
                    </div>

                    {/* Recommendation */}
                    <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        Recommendation:
                      </span>
                      <p className="text-foreground leading-relaxed">{finding.recommendation}</p>
                    </div>

                    {/* Code Snippet Viewer */}
                    {finding.codeSnippet && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-mono">{finding.file}</span>
                          <span className="text-red-500 font-medium">Line {finding.line}</span>
                        </div>
                        <div className="rounded-lg bg-black/95 dark:bg-black/70 border border-white/10 p-3 overflow-x-auto">
                          <pre className="font-mono text-[11px] text-gray-300 leading-relaxed">
                            {finding.codeSnippet.code}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* AI Suggested Fix Diff Preview (Interactive) */}
                    {showFixModal === finding.id && finding.suggestedFix && (
                      <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                            <Wand2 className="size-3.5" />
                            PQ-Guard Automated Remediation Patch:
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFixModal(null)}
                            className="h-6 text-[10px] text-muted-foreground"
                          >
                            Close
                          </Button>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {finding.suggestedFix.description}
                        </p>
                        <div className="rounded bg-black/90 p-2 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                          <pre>{finding.suggestedFix.diff}</pre>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-3 bg-muted/20 border-t flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          showToast(`Opened code view for ${finding.file} at line ${finding.line}`)
                        }
                        className="text-xs h-7 gap-1"
                      >
                        <Code2 className="size-3" />
                        View Code
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/cbom")}
                        className="text-xs h-7 gap-1"
                      >
                        <FileJson className="size-3" />
                        View CBOM
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          showToast(`GitHub Issue created: [PQ-Risk] ${finding.title}`)
                        }
                        className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-3" />
                        Create Issue
                      </Button>

                      <Button
                        size="sm"
                        onClick={() =>
                          setShowFixModal(showFixModal === finding.id ? null : finding.id)
                        }
                        className="text-xs h-7 gap-1 bg-primary text-primary-foreground"
                      >
                        <Wand2 className="size-3" />
                        Generate Fix
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              /* EMPTY / SAFE STATE FOR PR */
              <Card className="border-border p-8 text-center bg-card/60">
                <div className="mx-auto size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <ShieldCheck className="size-6 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">
                  🟢 No cryptographic changes detected.
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                  No crypto assets were added, removed, or modified in this Pull Request.
                </p>
              </Card>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. PR COMMENT EXPERIENCE (CODERABBIT-STYLE PR BOT SIMULATION)              */}
          {/* ========================================================================= */}
          <Card className="border-border overflow-hidden bg-card/70">
            <CardHeader className="p-4 pb-2 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                    PQ
                  </div>
                  <CardTitle className="text-xs font-semibold">
                    Simulated Pull Request Comment
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    GitHub Bot
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">Preview as rendered on PR</span>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {/* Box replicating the user's specification */}
              <div className="rounded-xl border border-border/80 bg-background/90 p-4 space-y-3 font-sans shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <Lock className="size-3.5 text-primary" />
                    <span>PQ-Guard Crypto Review</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">just now</span>
                </div>

                {pr.hasCryptoChanges ? (
                  <div className="space-y-3 text-xs">
                    <div className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-500" />
                      1 Critical Crypto Risk
                    </div>

                    <p className="font-mono text-xs text-foreground bg-muted/40 p-2 rounded border">
                      RSA-2048 detected in Signer.java:42
                    </p>

                    <div className="text-muted-foreground">
                      <strong className="text-foreground">Threat:</strong> Shor&apos;s Algorithm
                    </div>

                    <div className="text-muted-foreground">
                      <strong className="text-foreground">Recommendation:</strong> Consider migration to a post-quantum signature algorithm such as ML-DSA.
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => showToast("Scrolled to finding")}
                        className="text-xs h-7"
                      >
                        View Finding
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowFixModal(pr.findings[0]?.id || null)}
                        className="text-xs h-7"
                      >
                        Generate Fix
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs space-y-1.5 py-1">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      All cryptographic checks passed
                    </div>
                    <p className="text-muted-foreground">
                      No cryptographic assets modified. Post-quantum policy check: <strong>PASSED</strong>.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Crypto Review Summary & Policy Check */}
        <div className="space-y-6">
          {/* ========================================================================= */}
          {/* 4. CRYPTO REVIEW SUMMARY CHECKLIST                                        */}
          {/* ========================================================================= */}
          <Card className="border-border">
            <CardHeader className="p-4 pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold">Crypto Review Summary</CardTitle>
              <CardDescription className="text-xs">
                Static & cryptographic AST pipeline validation
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {[
                { label: "Dependency analysis", passed: pr.summary.dependencyAnalysis },
                { label: "Crypto API analysis", passed: pr.summary.cryptoApiAnalysis },
                { label: "CBOM comparison", passed: pr.summary.cbomComparison },
                { label: "Post-quantum risk analysis", passed: pr.summary.quantumRiskAnalysis },
                { label: "Policy check", passed: pr.summary.policyCheck },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <Check className="size-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-red-500 shrink-0" />
                    )}
                    <span className={item.passed ? "text-foreground" : "text-red-500 font-medium"}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {item.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              ))}
            </CardContent>

            <CardFooter className="p-3.5 bg-muted/20 border-t flex flex-col items-start gap-2">
              <div className="text-xs font-semibold">Automated Gate Status:</div>
              {pr.summary.policyCheck ? (
                <div className="w-full p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Pull Request approved for post-quantum safety.</span>
                </div>
              ) : (
                <div className="w-full p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertOctagon className="size-4 shrink-0" />
                  <span>Merge blocked: Critical quantum risk detected.</span>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Quick Context Card */}
          <Card className="border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold">Review Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between py-1 border-b">
                <span>Repository</span>
                <span className="font-mono text-foreground">{pr.repository}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Base Branch</span>
                <span className="font-mono text-foreground">{pr.baseBranch}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Head Branch</span>
                <span className="font-mono text-foreground">{pr.branch}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Scanner Engine</span>
                <span className="text-foreground">PQ-Guard AST 2.4</span>
              </div>
              <div className="flex justify-between py-1">
                <span>NIST Standards</span>
                <span className="text-foreground">FIPS 203, 204, 205</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

