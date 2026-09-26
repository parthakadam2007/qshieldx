"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  FileText,
  FileDown,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  blockchainProof,
  computedRootHash,
  onChainRootHash,
} from "@/constants/merkleData";

/* =========================================================
   TYPES
========================================================= */

type Severity = "Critical" | "High" | "Medium" | "Low";

type Finding = {
  id: string;
  finding: string;
  asset: string;
  algorithm: string;
  severity: Severity;
  validation: "Confirmed" | "Needs review" | "Conflict";
  confidence: number;
};

/* =========================================================
   REPORT DATA
========================================================= */

const reportData = {
  repository: "mypay/mypay-payment-gateway",
  scanId: "scan-dev-179035597410",
  generatedAt: "9/26/2026",
  businessCriticality: "Not tagged",
  filesScanned: null as number | null,
  cbomComponents: 1,
    discoveredAssets: 37,

  vulnerableAssets: 12,
  quantumReadyAssets: 18,
  atRiskAssets: 7,
  immediatePriorityAssets: 12,
  scanTimestamp: "9/25/2026, 10:21 PM",
  network: "sepolia",
  blockNumber: "179035228",
};

/* Findings transcribed from your screenshot */

const findings: Finding[] = [
  {
    id: "CRYPTO-001",
    finding: "Quantum-vulnerable RSA certificate",
    asset: "api.mpay.com",
    algorithm: "RSA-2048",
    severity: "Critical",
    validation: "Confirmed",
    confidence: 98,
  },
  {
    id: "CRYPTO-002",
    finding: "Potential hardcoded cryptographic key",
    asset: "payment-service",
    algorithm: "Hardcoded secret",
    severity: "High",
    validation: "Needs review",
    confidence: 76,
  },
  {
    id: "CRYPTO-003",
    finding: "Legacy TLS protocol detected",
    asset: "legacy.mypay.com",
    algorithm: "TLS 1.0",
    severity: "High",
    validation: "Confirmed",
    confidence: 96,
  },
  {
    id: "CRYPTO-004",
    finding: "Conflicting algorithm observations",
    asset: "auth.mpay.com",
    algorithm: "RSA / ECDSA",
    severity: "Medium",
    validation: "Conflict",
    confidence: 64,
  },
  {
    id: "CRYPTO-005",
    finding: "Post-quantum key exchange observed",
    asset: "checkout.mpay.com",
    algorithm: "X25519MLKEM768",
    severity: "Medium",
    validation: "Confirmed",
    confidence: 94,
  },
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CryptoScanReport() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const computedRoot = String(computedRootHash ?? "");
  const onChainRoot = String(onChainRootHash ?? "");

  const rootsMatch =
    computedRoot.length > 0 &&
    onChainRoot.length > 0 &&
    computedRoot.toLowerCase() === onChainRoot.toLowerCase();

  const transactionHash = String(
    blockchainProof.txHash ?? "Not available"
  );

  const ipfsCid = String(blockchainProof.ipfsCid ?? "");

  const anchorTimestamp = blockchainProof.anchorTimestamp
    ? new Date(blockchainProof.anchorTimestamp).toLocaleString()
    : "Not available";

  const riskCounts = useMemo(
    () => ({
      Critical: findings.filter((f) => f.severity === "Critical").length,
      High: findings.filter((f) => f.severity === "High").length,
      Medium: findings.filter((f) => f.severity === "Medium").length,
      Low: findings.filter((f) => f.severity === "Low").length,
      Quantum: findings.filter((f) =>
        f.finding.toLowerCase().includes("quantum-vulnerable")
      ).length,
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
          finding.finding,
          finding.asset,
          finding.algorithm,
          finding.severity,
          finding.validation,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All statuses" ||
        finding.validation === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ================= ACTIONS ================= */}

        <div className="no-print mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <Button onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Save as PDF
          </Button>

          <Button variant="outline" onClick={handleExportPDF}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>

          <p className="text-sm text-muted-foreground">
            Choose “Save as PDF” in the print destination.
          </p>
        </div>

        {/* ================= HEADER ================= */}

        <header className="mb-8 border-b-2 border-slate-900 pb-6 dark:border-border">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-600">
                <ShieldCheck className="h-5 w-5" />
                CryptoScan Security Intelligence
              </div>

              <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Executive Security & CBOM Verification Report
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Post-Quantum Cryptography Assessment & Blockchain Anchor
                Proof
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs">
                <Badge variant="secondary">
                  Repository: {reportData.repository}
                </Badge>

                <Badge variant="secondary">
                  Scan ID: {reportData.scanId}
                </Badge>

                <Badge variant="secondary">
                  Generated: {reportData.generatedAt}
                </Badge>
              </div>
            </div>

            <div className="shrink-0 rounded-xl border border-border p-4 text-center">
              <FileText className="mx-auto mb-2 h-7 w-7 text-blue-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Report
              </p>
              <p className="text-sm font-bold">CBOM / Integrity</p>
            </div>
          </div>
        </header>

        {/* ================= 01: METADATA ================= */}

        <section className="mb-9">
          <SectionHeading
            number="01"
            title="CBOM Metadata & Identity"
            subtitle="Scan and inventory identification"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <MetadataCard
              label="Repository"
              value={reportData.repository}
            />

            <MetadataCard
              label="Business Criticality"
              value={reportData.businessCriticality}
            />

            <MetadataCard
              label="Files Scanned"
              value={String(reportData.filesScanned)}
            />

            <MetadataCard
              label="CBOM Components"
              value={String(reportData.cbomComponents)}
            />

            <MetadataCard
              label="Timestamp"
              value={reportData.scanTimestamp}
            />
          </div>
        </section>

        {/* ================= 02: RISK COUNTS ================= */}

        <section className="mb-9">
          <SectionHeading
            number="02"
            title="Summary Risk Counts"
            subtitle="Cryptographic findings grouped by severity"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <RiskCard
              label="Critical"
              count={riskCounts.Critical}
              color="text-red-500"
            />

            <RiskCard
              label="High"
              count={riskCounts.High}
              color="text-orange-500"
            />

            <RiskCard
              label="Medium"
              count={riskCounts.Medium}
              color="text-amber-500"
            />

            <RiskCard
              label="Low"
              count={riskCounts.Low}
              color="text-blue-500"
            />

            <RiskCard
              label="Quantum Vulnerable"
              count={riskCounts.Quantum}
              color="text-violet-500"
            />
          </div>
        </section>

        {/* ================= 03: BLOCKCHAIN PROOF ================= */}

        <section className="mb-9">
          <SectionHeading
            number="03"
            title="Blockchain Anchor & Cryptographic Proof of Integrity"
            subtitle="Merkle integrity and blockchain anchoring evidence"
          />

          <Card
            className={
              rootsMatch
                ? "border-emerald-500"
                : "border-amber-500"
            }
          >
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {rootsMatch ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                )}

                <h3
                  className={`text-lg font-extrabold uppercase ${
                    rootsMatch
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {rootsMatch
                    ? "Verified — Integrity Confirmed on Ledger"
                    : "Verification Requires Review"}
                </h3>

                <Badge
                  variant={rootsMatch ? "default" : "destructive"}
                  className="ml-auto"
                >
                  {rootsMatch ? "VERIFIED" : "CHECK ROOTS"}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <ProofField
                    label="CBOM Merkle Tree Root"
                    value={computedRoot}
                    monospace
                  />

                  <ProofField
                    label="Blockchain Network"
                    value={reportData.network}
                  />

                  <ProofField
                    label="Block Number"
                    value={reportData.blockNumber}
                  />
                </div>

                <div className="space-y-4">
                  <ProofField
                    label="Verification Outcome"
                    value={rootsMatch ? "VERIFIED" : "REQUIRES REVIEW"}
                    valueClass={
                      rootsMatch
                        ? "font-bold text-emerald-600"
                        : "font-bold text-amber-600"
                    }
                  />

                  <ProofField
                    label="Transaction Hash"
                    value={transactionHash}
                    monospace
                  />

                  <ProofField
                    label="Anchor Timestamp"
                    value={anchorTimestamp}
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  On-Chain Merkle Root
                </p>

                <code className="block break-all rounded-lg bg-muted p-3 text-xs leading-5">
                  {onChainRoot}
                </code>
              </div>

              {ipfsCid && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    IPFS Content Identifier
                  </p>

                  <a
                    href={
                      ipfsCid.startsWith("http")
                        ? ipfsCid
                        : `https://ipfs.io/ipfs/${ipfsCid}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 break-all text-sm text-blue-600 underline"
                  >
                    {ipfsCid}
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                  </a>
                </div>
              )}

              <p className="mt-5 text-xs leading-5 text-muted-foreground">
                Verification compares the Merkle root values supplied by
                the application. Independent on-chain verification requires
                querying the blockchain.
              </p>
            </div>
          </Card>
        </section>

        {/* ================= 04: CRYPTOGRAPHIC FINDINGS ================= */}

        <section className="mb-9">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-foreground" />
                <h2 className="text-xl font-semibold">
                  Cryptographic Findings
                </h2>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Search findings and inspect the supporting evidence and
                validation results.
              </p>
            </div>

            <Badge variant="outline">
              {filteredFindings.length} of {findings.length} findings
            </Badge>
          </div>

          {/* Search and filter — hidden in PDF */}

          <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search finding, asset, algorithm, or scanner..."
                className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-lg border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>All statuses</option>
              <option>Confirmed</option>
              <option>Needs review</option>
              <option>Conflict</option>
            </select>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-4 font-medium text-muted-foreground">
                      Finding
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Asset
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Algorithm
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Severity
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Validation
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Confidence
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredFindings.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="p-4">
                        <p className="font-medium">{item.finding}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.id}
                        </p>
                      </td>

                      <td className="p-4 font-mono text-xs">
                        {item.asset}
                      </td>

                      <td className="p-4">
                        <code className="rounded-md bg-muted px-2 py-1 text-xs">
                          {item.algorithm}
                        </code>
                      </td>

                      <td className="p-4">
                        <SeverityBadge severity={item.severity} />
                      </td>

                      <td className="p-4">
                        <ValidationBadge status={item.validation} />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-cyan-600"
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>

                          <span className="text-xs tabular-nums">
                            {item.confidence}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredFindings.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-10 text-center text-muted-foreground"
                      >
                        No findings match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="flex flex-col justify-between gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row">
          <span>CryptoScan · Executive Security Report</span>
          <span>Confidential — For authorized use</span>
        </footer>
      </div>

      {/* ================= PRINT STYLES ================= */}

      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 12mm;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          body {
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          main {
            min-height: 0 !important;
            padding: 0 !important;
          }

          section,
          table,
          tr,
          footer,
          header {
            break-inside: avoid;
          }

          a {
            color: #1d4ed8 !important;
            text-decoration: none !important;
          }

          button {
            display: none !important;
          }

          .shadow,
          .shadow-sm,
          .shadow-md,
          .shadow-lg {
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3 border-b border-border pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-extrabold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
        {number}
      </span>

      <div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function MetadataCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card className="h-full">
      <div className="p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="break-words text-sm font-medium">{value}</p>
      </div>
    </Card>
  );
}

function RiskCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <Card className="bg-muted/30">
      <div className="p-5 text-center">
        <p className={`text-3xl font-extrabold ${color}`}>{count}</p>

        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </Card>
  );
}

function ProofField({
  label,
  value,
  monospace = false,
  valueClass = "",
}: {
  label: string;
  value: string;
  monospace?: boolean;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p
        className={`break-all text-sm ${
          monospace ? "font-mono" : "font-medium"
        } ${valueClass}`}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    Critical: "border-red-200 bg-red-50 text-red-700",
    High: "border-orange-200 bg-orange-50 text-orange-700",
    Medium: "border-amber-200 bg-amber-50 text-amber-700",
    Low: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <Badge variant="outline" className={styles[severity]}>
      {severity}
    </Badge>
  );
}

function ValidationBadge({
  status,
}: {
  status: Finding["validation"];
}) {
  const styles = {
    Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Needs review": "border-amber-200 bg-amber-50 text-amber-700",
    Conflict: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {status === "Confirmed" && (
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
      )}

      {status === "Conflict" && (
        <AlertTriangle className="mr-1 h-3.5 w-3.5" />
      )}

      {status}
    </Badge>
  );
}