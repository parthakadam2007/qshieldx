"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileSearch,
  GitBranch,
  Layers3,
  ListChecks,
  LockKeyhole,
  ScanSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  XCircle,
} from "lucide-react";

type ValidationStatus = "Confirmed" | "Needs review" | "Conflict";
type Severity = "Critical" | "High" | "Medium";

type Finding = {
  id: string;
  title: string;
  asset: string;
  algorithm: string;
  severity: Severity;
  scanner: string;
  evidence: string;
  aiAssessment: string;
  validation: ValidationStatus;
  confidence: number;
  recommendation: string;
  checks: string[];
};

const findings: Finding[] = [
  {
    id: "CRYPTO-001",
    title: "Quantum-vulnerable RSA certificate",
    asset: "api.mypay.com",
    algorithm: "RSA-2048",
    severity: "Critical",
    scanner: "TLS / Certificate Scanner",
    evidence:
      "The certificate public key uses RSA with a 2048-bit modulus. RSA key establishment and signatures are vulnerable to sufficiently capable quantum computers using Shor's algorithm.",
    aiAssessment:
      "The cryptographic algorithm is susceptible to a future quantum attack. Prioritize this asset according to data confidentiality lifetime, migration lead time, and business criticality.",
    validation: "Confirmed",
    confidence: 98,
    recommendation:
      "Assess certificate dependencies and plan migration to a suitable post-quantum or hybrid cryptographic approach.",
    checks: [
      "Certificate algorithm identified",
      "Public-key size extracted",
      "Algorithm classification matched",
      "Finding supported by scanner evidence",
    ],
  },
  {
    id: "CRYPTO-002",
    title: "Potential hardcoded cryptographic key",
    asset: "payment-service",
    algorithm: "Hardcoded secret",
    severity: "High",
    scanner: "Secret Scanner",
    evidence:
      "A source-code scan identified a string matching a cryptographic-key pattern. The value must be checked against the source context and secret-management configuration.",
    aiAssessment:
      "The string may represent a sensitive key, but pattern matching alone does not establish that it is active or exploitable.",
    validation: "Needs review",
    confidence: 76,
    recommendation:
      "Review the source location, verify whether the value is a real credential, and rotate it if exposure is confirmed.",
    checks: [
      "Potential key pattern detected",
      "Source context requires review",
      "Active-key status not established",
    ],
  },
  {
    id: "CRYPTO-003",
    title: "Legacy TLS protocol detected",
    asset: "legacy.mypay.com",
    algorithm: "TLS 1.0",
    severity: "High",
    scanner: "TLS Configuration Scanner",
    evidence:
      "The TLS scan reports support for TLS 1.0. Confirm the endpoint and service configuration before changing protocol settings.",
    aiAssessment:
      "Legacy protocol support can increase cryptographic exposure and should be assessed against current security requirements.",
    validation: "Confirmed",
    confidence: 96,
    recommendation:
      "Disable obsolete protocol versions after checking client compatibility. Prefer currently approved TLS configurations.",
    checks: [
      "Protocol version extracted",
      "Legacy version identified",
      "Finding supported by scan output",
    ],
  },
  {
    id: "CRYPTO-004",
    title: "Conflicting algorithm observations",
    asset: "auth.mypay.com",
    algorithm: "RSA / ECDSA",
    severity: "Medium",
    scanner: "Certificate Scanner + Inventory",
    evidence:
      "The certificate scan and inventory records report different public-key algorithms for this asset. The records may refer to different certificates or scan times.",
    aiAssessment:
      "The discrepancy cannot be resolved from the available records alone. Compare certificate fingerprints, timestamps, and endpoint coverage.",
    validation: "Conflict",
    confidence: 64,
    recommendation:
      "Re-scan the endpoint and reconcile certificate fingerprints and observation timestamps before updating the inventory.",
    checks: [
      "Multiple algorithm observations found",
      "Asset association identified",
      "Certificate identity needs reconciliation",
    ],
  },
  {
    id: "CRYPTO-005",
    title: "Post-quantum key exchange observed",
    asset: "checkout.mypay.com",
    algorithm: "X25519MLKEM768",
    severity: "Medium",
    scanner: "TLS / Handshake Scanner",
    evidence:
      "The scan output reports the X25519MLKEM768 hybrid key-establishment group. Confirm client support and the negotiated group for the tested connection.",
    aiAssessment:
      "The observed group indicates hybrid key establishment support. This observation alone does not establish that every connection or cryptographic dependency is post-quantum ready.",
    validation: "Confirmed",
    confidence: 94,
    recommendation:
      "Record the negotiated group, verify deployment coverage, and assess remaining certificates, signatures, and cryptographic dependencies.",
    checks: [
      "Key-establishment group extracted",
      "Hybrid group recognized",
      "Observation supported by scan output",
    ],
  },
];

const stages = [
  {
    number: "01",
    title: "Extraction",
    description: "Collect raw findings from the 8-Tier Hybrid Scan.",
    detail:
      "Read scanner output, cryptographic metadata, affected assets, and source references.",
    icon: ScanSearch,
  },
  {
    number: "02",
    title: "Deduplication",
    description: "Merge duplicate findings across tools.",
    detail:
      "Compare asset identity, algorithm, evidence, and finding signatures to reduce duplicate records.",
    icon: GitBranch,
  },
  {
    number: "03",
    title: "Enrichment",
    description: "Add asset and business context.",
    detail:
      "Associate findings with inventory records, service ownership, exposure, and criticality where available.",
    icon: Layers3,
  },
  {
    number: "04",
    title: "AI Analysis",
    description: "Coordinate specialized analysis agents.",
    detail:
      "Use local AI analysis to interpret findings, identify relationships, and propose remediation.",
    icon: Workflow,
  },
  {
    number: "05",
    title: "Contradiction Management",
    description: "Identify inconsistent observations.",
    detail:
      "Compare conflicting results and preserve uncertainty when the available evidence cannot resolve them.",
    icon: GitBranch,
  },
  {
    number: "06",
    title: "Validation",
    description: "Check findings against evidence.",
    detail:
      "Apply deterministic checks and evidence requirements before assigning a validation disposition.",
    icon: ShieldCheck,
  },
];

const statusStyles: Record<ValidationStatus, string> = {
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Needs review": "border-amber-200 bg-amber-50 text-amber-700",
  Conflict: "border-rose-200 bg-rose-50 text-rose-700",
};

const severityStyles: Record<Severity, string> = {
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function SovereignAIPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStage, setSelectedStage] = useState(0);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  const summary = useMemo(
    () => ({
      analyzed: findings.length,
      validated: findings.filter((f) => f.validation === "Confirmed").length,
      review: findings.filter((f) => f.validation === "Needs review").length,
      conflicts: findings.filter((f) => f.validation === "Conflict").length,
    }),
    []
  );

  const filteredFindings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return findings.filter((finding) => {
      const matchesSearch =
        !query ||
        [
          finding.id,
          finding.title,
          finding.asset,
          finding.algorithm,
          finding.scanner,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || finding.validation === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeStage = stages[selectedStage];

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[1800px] space-y-6 p-5 sm:p-7 lg:p-8">
        {/* Page header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
              <ShieldCheck className="h-6 w-6 text-zinc-800" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Sovereign AI & Evidence Validation
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <Activity className="h-3.5 w-3.5" />
                  Illustrative demo
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-500 sm:text-base">
                Evidence-driven analysis and validation of cryptographic
                findings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setSelectedStage(0);
              setExpandedFinding(null);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-zinc-50"
          >
            <Activity className="h-4 w-4" />
            Reset view
          </button>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Analyzed"
            value={summary.analyzed}
            description="Illustrative findings"
            icon={ScanSearch}
            iconClass="text-zinc-600 bg-zinc-100"
          />

          <SummaryCard
            label="Validated"
            value={summary.validated}
            description="Evidence supported"
            icon={ShieldCheck}
            iconClass="text-emerald-600 bg-emerald-50"
          />

          <SummaryCard
            label="Needs review"
            value={summary.review}
            description="Requires analyst review"
            icon={AlertTriangle}
            iconClass="text-amber-600 bg-amber-50"
          />

          <SummaryCard
            label="Conflicts"
            value={summary.conflicts}
            description="Inconsistent observations"
            icon={GitBranch}
            iconClass="text-rose-600 bg-rose-50"
          />
        </section>

        {/* Evidence fusion pipeline */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Evidence processing
              </div>
              <h2 className="mt-2 text-xl font-semibold">
                6-Tier Evidence Fusion
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Select a stage to inspect its role in the validation pipeline.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600">
              <Workflow className="h-3.5 w-3.5" />
              Analysis workflow
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const active = selectedStage === index;

              return (
                <button
                  key={stage.number}
                  type="button"
                  onClick={() => setSelectedStage(index)}
                  aria-pressed={active}
                  className={`group rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-cyan-300 bg-cyan-50 ring-1 ring-cyan-100"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        active ? "text-cyan-700" : "text-zinc-400"
                      }`}
                    >
                      TIER {stage.number}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-cyan-700" : "text-zinc-500"
                      }`}
                    />
                  </div>

                  <div className="mt-3 text-sm font-semibold text-zinc-800">
                    {stage.title}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-zinc-500">
                    {stage.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
            <div className="mt-0.5 rounded-lg bg-white p-2 text-cyan-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-zinc-800">
                {activeStage.number}. {activeStage.title}
              </div>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                {activeStage.detail}
              </p>
            </div>
          </div>
        </section>

        {/* Findings */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-start sm:p-6">
            <div>
              <div className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-zinc-700" />
                <h2 className="text-xl font-semibold">
                  Cryptographic Findings
                </h2>
              </div>
              <p className="mt-1.5 text-sm text-zinc-500">
                Search findings and inspect the supporting evidence and
                validation results.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600">
              <ListChecks className="h-3.5 w-3.5" />
              Evidence review
            </span>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search finding, asset, algorithm, or scanner..."
                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by validation status"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="All">All statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Needs review">Needs review</option>
              <option value="Conflict">Conflict</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Finding</th>
                  <th className="px-5 py-3.5 font-medium">Asset</th>
                  <th className="px-5 py-3.5 font-medium">Algorithm</th>
                  <th className="px-5 py-3.5 font-medium">Severity</th>
                  <th className="px-5 py-3.5 font-medium">Validation</th>
                  <th className="px-5 py-3.5 font-medium">Confidence</th>
                  <th className="px-5 py-3.5 font-medium">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {filteredFindings.map((finding) => {
                  const expanded = expandedFinding === finding.id;

                  return (
                    <FindingRows
                      key={finding.id}
                      finding={finding}
                      expanded={expanded}
                      onToggle={() =>
                        setExpandedFinding(expanded ? null : finding.id)
                      }
                    />
                  );
                })}
              </tbody>
            </table>

            {filteredFindings.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <Search className="h-8 w-8 text-zinc-300" />
                <p className="mt-3 text-sm font-medium text-zinc-700">
                  No findings match your filters
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Try a different search term or validation status.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-medium text-cyan-700 hover:text-cyan-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-2 border-t border-zinc-200 bg-zinc-50/70 px-5 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center">
            <span>
              Showing {filteredFindings.length} of {findings.length} demo
              findings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              Illustrative data — not a live scan
            </span>
          </div>
        </section>

        {/* Sovereign AI notes */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-cyan-700" />
              <h3 className="font-semibold">Sovereign execution</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Intended for local model execution within a controlled network
              boundary. Actual isolation and offline operation depend on your
              deployment configuration.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold">Evidence-first validation</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              AI assessments should be checked against scanner output and
              deterministic rules. Unresolved evidence should remain marked
              for review rather than being treated as confirmed.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">{label}</span>
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </div>

      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

function FindingRows({
  finding,
  expanded,
  onToggle,
}: {
  finding: Finding;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="transition hover:bg-zinc-50/80">
        <td className="px-5 py-4">
          <div className="font-medium text-zinc-900">{finding.title}</div>
          <div className="mt-1 text-xs text-zinc-400">{finding.id}</div>
        </td>

        <td className="px-5 py-4">
          <span className="font-mono text-xs text-zinc-700">
            {finding.asset}
          </span>
        </td>

        <td className="px-5 py-4">
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-700">
            {finding.algorithm}
          </span>
        </td>

        <td className="px-5 py-4">
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${severityStyles[finding.severity]}`}
          >
            {finding.severity}
          </span>
        </td>

        <td className="px-5 py-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[finding.validation]}`}
          >
            {finding.validation === "Confirmed" ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : finding.validation === "Conflict" ? (
              <XCircle className="h-3.5 w-3.5" />
            ) : (
              <CircleAlert className="h-3.5 w-3.5" />
            )}
            {finding.validation}
          </span>
        </td>

        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-cyan-600"
                style={{ width: `${finding.confidence}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-zinc-600">
              {finding.confidence}%
            </span>
          </div>
        </td>

        <td className="px-5 py-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            {expanded ? "Hide" : "Inspect"}
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} className="bg-zinc-50/70 px-5 py-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileSearch className="h-4 w-4 text-cyan-700" />
                  Scanner evidence
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {finding.evidence}
                </p>
                <div className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                  Source: {finding.scanner}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-violet-600" />
                  AI assessment
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {finding.aiAssessment}
                </p>
                <div className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                  Illustrative confidence: {finding.confidence}%
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ListChecks className="h-4 w-4 text-emerald-700" />
                  Validation checks
                </div>

                <ul className="mt-3 space-y-2">
                  {finding.checks.map((check) => (
                    <li
                      key={check}
                      className="flex items-start gap-2 text-sm text-zinc-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ArrowUpRight className="h-4 w-4 text-cyan-700" />
                  Recommended action
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {finding.recommendation}
                </p>

                <div className="mt-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[finding.validation]}`}
                  >
                    {finding.validation}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}