"use client"

import * as React from "react"

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Binary,
  BrainCircuit,
  Check,
  Database,
  Download,
  Eye,
  FileJson,
  FileText,
  Gauge,
  GitBranch,
  Info,
  KeyRound,
  Layers,
  Network,
  Search,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  X,
} from "lucide-react"

import { createClient } from "@/lib/supabase"
import { DEMO_CRYPTO_ASSET_COUNT } from "@/lib/demo-metrics"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react"

import { useGlobalData } from "@/app/context/GlobalDataContext"

import { seedCBOM } from "../seedData/cbom"

import {
  initialNodes,
  initialEdges,
} from "../seedData/node"

import { ExecutiveSummary } from "../cbom/ExecutiveSummary"

import { CBOMComponent } from "./CbomInterfaces"



/* ============================================================
   TYPES
============================================================ */

type InventoryAsset = {
  id: string
  name: string
  type: string
  artifactType: string
  algorithm: string
  status: string
  priority: string
  qars: number | null
  riskCategory: string
  migrationWindow: string
  ownerTeam: string
  cloudProvider: string
  businessCriticality: string
  lifetimeYears: number | null
  tags: string[]
}


/* ============================================================
   CONSTANTS
============================================================ */

const PAGE_SIZE = 20


/* ============================================================
   HELPERS
============================================================ */

/*
 * Normalizes values so:
 *
 * "Quantum Ready"
 * "quantum-ready"
 * "QUANTUM_READY"
 *
 * all compare correctly.
 */
function normalizeFilterValue(
  value: unknown
) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
}


/*
 * Safe date formatter.
 *
 * Handles:
 * - ISO dates
 * - normal Date strings
 * - demo strings such as:
 *   "31 Aug 2026 · 07:42 PM IST"
 */
 function formatReportDate(value: unknown): string {
  if (!value) {
    return "Date unavailable";
  }


  const raw = String(value).trim()

  // Handle ISO dates and standard date strings.
  const parsed = new Date(raw);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }


  // Handle demo timestamps such as:
  // "31 Aug 2026 · 07:42 PM IST"
  const humanDateMatch = raw.match(
    /^(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/
  );

  if (humanDateMatch?.[1]) {
    return humanDateMatch[1];
  }

  if (raw.includes("·")) {
    return raw.split("·")[0].trim();
  }

  return raw;
}

/*
 * Return a safe report display name.
 */
function getReportDomain(
  report: any,
  fallback: string
) {
  return (
    report?.scan_jobs?.target_domain ||
    report?.primaryDomain ||
    fallback ||
    "CBOM Report"
  )
}


/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-border/40 pb-2.5 last:border-0">
      <span className="text-[11px] text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-xs font-medium">
        {value}
      </span>
    </div>
  )
}


/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="mb-4 flex items-start gap-2.5">

      <div className="mt-0.5 rounded-md bg-primary/10 p-1.5 text-primary">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>

    </div>
  )
}


/* ============================================================
   STATUS COLOR
============================================================ */

function getStatusClass(
  status: string
) {
  const value =
    normalizeFilterValue(status)

  if (
    value.includes("vulnerable")
  ) {
    return "border-red-500/30 bg-red-500/15 text-red-400"
  }

  if (
    value.includes("quantum ready") ||
    value.includes("quantum resistant")
  ) {
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
  }

  if (
    value.includes("at risk")
  ) {
    return "border-amber-500/30 bg-amber-500/15 text-amber-400"
  }

  if (
    value.includes("legacy")
  ) {
    return "border-orange-500/30 bg-orange-500/15 text-orange-400"
  }

  if (
    value.includes("acceptable")
  ) {
    return "border-sky-500/30 bg-sky-500/15 text-sky-400"
  }

  return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
}


/* ============================================================
   STATUS GRAPH COLOR
============================================================ */

function getGraphColor(
  status: string
) {
  const value =
    normalizeFilterValue(status)

  if (
    value.includes("vulnerable")
  ) {
    return "#ef4444"
  }

  if (
    value.includes("quantum ready") ||
    value.includes("quantum resistant")
  ) {
    return "#10b981"
  }

  if (
    value.includes("at risk")
  ) {
    return "#f59e0b"
  }

  if (
    value.includes("legacy")
  ) {
    return "#f97316"
  }

  if (
    value.includes("acceptable")
  ) {
    return "#38bdf8"
  }

  return "#a78bfa"
}


/* ============================================================
   ALGORITHM HELPERS
============================================================ */

function getAlgorithmFamily(
  algorithm: string
) {
  const value =
    algorithm.toUpperCase()

  if (value.includes("ML-KEM"))
    return "ML-KEM"

  if (value.includes("ML-DSA"))
    return "ML-DSA"

  if (value.includes("SLH-DSA"))
    return "SLH-DSA"

  if (value.includes("RSA"))
    return "RSA"

  if (value.includes("ECDSA"))
    return "ECDSA"

  if (value.includes("ED25519"))
    return "EdDSA"

  if (value.includes("AES"))
    return "AES"

  if (value.includes("SHA"))
    return "SHA"

  return "Unknown"
}


function getAlgorithmPrimitive(
  algorithm: string
) {
  const family =
    getAlgorithmFamily(
      algorithm
    )

  switch (family) {
    case "RSA":
    case "ECDSA":
    case "EdDSA":
    case "ML-DSA":
    case "SLH-DSA":
      return "Signature"

    case "ML-KEM":
      return "Key Encapsulation"

    case "AES":
      return "Block Cipher"

    case "SHA":
      return "Hash"

    default:
      return "Unknown"
  }
}


function getMigrationRecommendation(
  algorithm: string
) {
  const family =
    getAlgorithmFamily(
      algorithm
    )

  switch (family) {

    case "RSA":
      return {
        title:
          "ML-DSA / SLH-DSA",

        description:
          "Evaluate migration from RSA signatures toward post-quantum signature algorithms. Hybrid deployment can be evaluated where interoperability requires a transition period.",
      }

    case "ECDSA":
      return {
        title:
          "ML-DSA / SLH-DSA",

        description:
          "Evaluate a post-quantum signature migration and certificate-chain compatibility before production rollout.",
      }

    case "EdDSA":
      return {
        title:
          "ML-DSA / SLH-DSA",

        description:
          "Evaluate post-quantum signature alternatives and interoperability with the existing identity and certificate infrastructure.",
      }

    case "AES":
      return {
        title:
          "Retain AES with policy review",

        description:
          "Symmetric cryptography should be assessed separately from public-key migration. Review key size, lifecycle, implementation, and long-term confidentiality requirements.",
      }

    case "ML-KEM":
      return {
        title:
          "ML-KEM",

        description:
          "Post-quantum key establishment is already represented. Validate parameter set, implementation, interoperability, and operational deployment.",
      }

    case "ML-DSA":
      return {
        title:
          "ML-DSA",

        description:
          "Post-quantum signature algorithm detected. Validate implementation, parameter set, certificate support, and deployment compatibility.",
      }

    case "SLH-DSA":
      return {
        title:
          "SLH-DSA",

        description:
          "Post-quantum signature algorithm detected. Validate implementation, parameter set, signature size, and operational constraints.",
      }

    default:
      return {
        title:
          "Manual cryptographic review",

        description:
          "The algorithm family could not be classified confidently from the available inventory evidence.",
      }
  }
}


/* ============================================================
   MAIN PAGE
============================================================ */

export default function CBOMPage() {

  const [reports, setReports] =
    React.useState<any[]>([])

  const [selectedReport, setSelectedReport] =
    React.useState<any>(null)

  const [isLoading, setIsLoading] =
    React.useState(true)

  const [copied, setCopied] =
    React.useState(false)

  const {
    isDemoMode,
    data,
  } = useGlobalData()

  const supabase =
    createClient()


  /* ============================================================
     FILTERS
  ============================================================ */

  const [
    searchQuery,
    setSearchQuery,
  ] = React.useState("")

  const [
    statusFilter,
    setStatusFilter,
  ] = React.useState("all")

  const [
    priorityFilter,
    setPriorityFilter,
  ] = React.useState("all")

  const [
    typeFilter,
    setTypeFilter,
  ] = React.useState("all")

  const [
    algorithmFilter,
    setAlgorithmFilter,
  ] = React.useState("all")


  /* ============================================================
     VIEW
  ============================================================ */

  const [
    explorerView,
    setExplorerView,
  ] = React.useState<
    "table" | "graph"
  >("table")


  /* ============================================================
     SELECTED ASSET
  ============================================================ */

  const [
    selectedAsset,
    setSelectedAsset,
  ] =
    React.useState<InventoryAsset | null>(
      null
    )


  /* ============================================================
     PAGINATION
  ============================================================ */

  const [
    currentPage,
    setCurrentPage,
  ] = React.useState(1)


  /* ============================================================
     FETCH REPORTS
  ============================================================ */

  React.useEffect(() => {

    document.title =
      "CBOM Explorer | QShieldX"

    async function fetchReports() {

      if (
        isDemoMode &&
        data.cbom
      ) {

        const demoReport = {

          id:
            data.scan.id,

          created_at:
            data.scan.completed,

          scan_jobs: {
            target_domain:
              data.scan.primaryDomain,
          },

          report_json:
            data.cbom,

          executive_summary:
            "mypay Software Pvt. Ltd. has cryptographic assets across its enterprise payment platform. The scan identified quantum-vulnerable components, certificates, and exposed secrets. Migration planning should prioritize public-facing payment and identity infrastructure.",

        }

        setReports([
          demoReport,
        ])

        setSelectedReport(
          demoReport
        )

        setIsLoading(false)

        return
      }


      const {
        data: reportsData,
        error,
      } = await supabase
        .from("cbom_reports")
        .select(
          `*, scan_jobs ( target_domain )`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )


      if (
        !error &&
        reportsData
      ) {

        setReports(
          reportsData
        )

        if (
          reportsData.length > 0
        ) {

          setSelectedReport(
            reportsData[0]
          )

        }

      }

      setIsLoading(false)

    }

    fetchReports()

  }, [
    isDemoMode,
    data,
  ])


  /* ============================================================
     CBOM COMPONENTS
  ============================================================ */

  const cbomComponents: CBOMComponent[] =
    selectedReport?.report_json?.components ??
    seedCBOM?.components ??
    []


  /* ============================================================
     RAW INVENTORY
  ============================================================ */

  const inventoryAssets =
    (data?.assets ?? []) as any[]


  /* ============================================================
     QUANTUM RISK LOOKUP
  ============================================================ */

  const quantumRiskByAsset =
    React.useMemo(() => {

      const map =
        new Map<string, any>()

      ;(
        data?.quantumRisk ?? []
      ).forEach(
        (item: any) => {

          if (
            item?.asset
          ) {

            map.set(
              String(
                item.asset
              ).toLowerCase(),
              item
            )

          }

        }
      )

      return map

    }, [
      data?.quantumRisk,
    ])


  /* ============================================================
     NORMALIZED INVENTORY
  ============================================================ */

  const inventoryComponents =
    React.useMemo<InventoryAsset[]>(
      () => {

        return inventoryAssets.map(
          (asset: any) => {

            const risk =
              quantumRiskByAsset.get(
                String(
                  asset.name || ""
                ).toLowerCase()
              )


            return {

              id:
                String(
                  asset.id ??
                  asset.name ??
                  "unknown"
                ),

              name:
                asset.name ||
                "Unnamed asset",

              type:
                asset.asset_type ||
                "unknown",

              artifactType:
                asset.artifact_type ||
                "Not available",

              algorithm:
                asset.algorithm ||
                "Not available",

              status:
                asset.quantum_status ||
                "unknown",

              priority:
                risk?.migrationPriority ||
                "—",

              qars:
                risk?.qars ??
                null,

              riskCategory:
                risk?.riskCategory ||
                "Not available",

              migrationWindow:
                risk?.migrationWindow ||
                "Not available",

              ownerTeam:
                asset.owner_team ||
                "Not available",

              cloudProvider:
                asset.cloud_provider ||
                "Not available",

              businessCriticality:
                asset.business_criticality ||
                "Unclassified",

              lifetimeYears:
                asset.lifetime_years ??
                null,

              tags:
                Array.isArray(
                  asset.tags
                )
                  ? asset.tags
                  : [],

            }

          }
        )

      },
      [
        inventoryAssets,
        quantumRiskByAsset,
      ]
    )


  /* ============================================================
     FILTER
  ============================================================ */

  const filteredInventoryComponents =
    React.useMemo(() => {

      const search =
        searchQuery
          .trim()
          .toLowerCase()


      return inventoryComponents.filter(
        (component) => {

          const name =
            String(
              component.name ?? ""
            ).toLowerCase()

          const algorithm =
            String(
              component.algorithm ?? ""
            ).toLowerCase()

          const type =
            String(
              component.type ?? ""
            ).toLowerCase()

          const artifactType =
            String(
              component.artifactType ?? ""
            ).toLowerCase()


          const status =
            normalizeFilterValue(
              component.status
            )

          const priority =
            normalizeFilterValue(
              component.priority
            )

          const typeValue =
            normalizeFilterValue(
              component.type
            )

          const algorithmValue =
            normalizeFilterValue(
              component.algorithm
            )


          /* SEARCH */

          const matchesSearch =
            !search ||
            name.includes(search) ||
            algorithm.includes(search) ||
            type.includes(search) ||
            artifactType.includes(search)


          /* STATUS */

          const matchesStatus =
            statusFilter === "all" ||
            status ===
              normalizeFilterValue(
                statusFilter
              )


          /* PRIORITY */

          const matchesPriority =
            priorityFilter === "all" ||
            priority ===
              normalizeFilterValue(
                priorityFilter
              )


          /* TYPE */

          const matchesType =
            typeFilter === "all" ||
            typeValue.includes(
              normalizeFilterValue(
                typeFilter
              )
            )


          /* ALGORITHM */

          const matchesAlgorithm =
            algorithmFilter === "all" ||
            algorithmValue.includes(
              normalizeFilterValue(
                algorithmFilter
              )
            )


          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesType &&
            matchesAlgorithm
          )

        }
      )

    }, [
      inventoryComponents,
      searchQuery,
      statusFilter,
      priorityFilter,
      typeFilter,
      algorithmFilter,
    ])


  /* ============================================================
     RESET PAGE WHEN FILTERS CHANGE
  ============================================================ */

  React.useEffect(() => {

    setCurrentPage(1)

  }, [
    searchQuery,
    statusFilter,
    priorityFilter,
    typeFilter,
    algorithmFilter,
  ])


  /* ============================================================
     PAGINATION CALCULATIONS
  ============================================================ */

  const totalFiltered =
    filteredInventoryComponents.length


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalFiltered /
          PAGE_SIZE
      )
    )


  /*
   * Keep current page valid if a filter
   * reduces the number of pages.
   */
  React.useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      )

    }

  }, [
    currentPage,
    totalPages,
  ])


  const pageStart =
    (currentPage - 1) *
    PAGE_SIZE


  const pageEnd =
    Math.min(
      pageStart +
        PAGE_SIZE,
      totalFiltered
    )


  const paginatedInventory =
    filteredInventoryComponents.slice(
      pageStart,
      pageEnd
    )


  /* ============================================================
     PAGE RANGE
  ============================================================ */

  const pageNumbers =
    React.useMemo(() => {

      const pages: number[] = []

      const start =
        Math.max(
          1,
          currentPage - 2
        )

      const end =
        Math.min(
          totalPages,
          currentPage + 2
        )

      for (
        let i = start;
        i <= end;
        i++
      ) {

        pages.push(i)

      }

      return pages

    }, [
      currentPage,
      totalPages,
    ])


  /* ============================================================
     CURRENT PAGE GRAPH
  ============================================================ */

  const graphNodes =
    React.useMemo(() => {

      const assets =
        paginatedInventory


      const centerX = 500
      const centerY = 330

      const count =
        assets.length


      return assets.map(
        (
          component,
          index
        ) => {

          const angle =
            count === 1
              ? 0
              : (
                  index /
                  count
                ) *
                  Math.PI *
                  2


          const radius =
            count <= 8
              ? 190
              : 270


          const color =
            getGraphColor(
              component.status
            )


          return {

            id:
              String(
                component.id
              ),

            position: {

              x:
                centerX +
                Math.cos(angle) *
                  radius,

              y:
                centerY +
                Math.sin(angle) *
                  radius,

            },

            data: {

              label: (

                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() =>
                    setSelectedAsset(
                      component
                    )
                  }
                >

                  <div className="flex items-center gap-2">

                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          color,

                        boxShadow:
                          `0 0 10px ${color}`,
                      }}
                    />

                    <span className="max-w-[150px] truncate text-[11px] font-semibold text-foreground">
                      {component.name}
                    </span>

                  </div>

                  <div className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
                    {component.algorithm}
                  </div>

                  <div
                    className="mt-1 text-[9px] font-medium"
                    style={{
                      color,
                    }}
                  >
                    {component.status}
                  </div>

                </button>

              ),

            },

            style: {

              width:
                190,

              padding:
                "11px 13px",

              borderRadius:
                12,

              border:
                `1px solid ${color}70`,

              background:
                "rgba(12,12,14,0.96)",

              boxShadow:
                `0 0 22px ${color}20`,

            },

          }

        }
      )

    }, [
      paginatedInventory,
    ])


  /*
   * IMPORTANT:
   *
   * These are inventory assets, not actual
   * dependency relationships.
   *
   * Therefore do not fabricate edges.
   */
  const graphEdges =
    React.useMemo(
      () => [],
      []
    )

  /* ============================================================
     FILTERED CBOM
     
     Raw CBOM follows ALL FILTERED ASSETS.
     
     Pagination does NOT affect the raw JSON.
     
     Example:
       Filter = Quantum Ready
       Raw JSON = all Quantum Ready assets
       
     Page 1 / Page 2 only controls the table/graph.
  ============================================================ */

  const filteredCbomComponents =
    React.useMemo(() => {

      return filteredInventoryComponents.map(
        (asset) => {

          const family =
            getAlgorithmFamily(
              asset.algorithm
            )

          const primitive =
            getAlgorithmPrimitive(
              asset.algorithm
            )


          const properties = [

            {
              name:
                "artifact-type",

              value:
                asset.artifactType,
            },

            {
              name:
                "algorithm-family",

              value:
                family,
            },

            {
              name:
                "cryptographic-primitive",

              value:
                primitive,
            },

            {
              name:
                "quantum-status",

              value:
                asset.status,
            },

            {
              name:
                "migration-priority",

              value:
                asset.priority,
            },

            {
              name:
                "risk-category",

              value:
                asset.riskCategory,
            },

            {
              name:
                "migration-window",

              value:
                asset.migrationWindow,
            },

            {
              name:
                "business-criticality",

              value:
                asset.businessCriticality,
            },

            {
              name:
                "owner-team",

              value:
                asset.ownerTeam,
            },

            {
              name:
                "cloud-provider",

              value:
                asset.cloudProvider,
            },

          ]


          if (
            asset.qars !== null
          ) {

            properties.push({
              name:
                "qars",

              value:
                String(
                  asset.qars
                ),
            })

          }


          return {

            "bom-ref":
              `qshieldx:asset:${asset.id}`,

            "type":
              "cryptographic-asset",

            "name":
              asset.name,

            "version":
              asset.algorithm,

            "properties":
              properties,

            "cryptoProperties": {

              "assetType":
                asset.type,

              "algorithmProperties": {

                "primitive":
                  primitive,

                "parameterSetIdentifier":
                  asset.algorithm,

              },

            },

            "evidence": {

              "source":
                "QShieldX Inventory Discovery",

              "assetId":
                asset.id,

            },

          }

        }
      )

    }, [
      filteredInventoryComponents,
    ])


  /* ============================================================
     RAW CBOM
  ============================================================ */

  const filteredCbom =
    React.useMemo(() => {

      const original =
        selectedReport?.report_json ??
        seedCBOM ??
        {}


      return {

        bomFormat:
          "CycloneDX",

        specVersion:
          "1.7",

        serialNumber:
          original.serialNumber ??
          "urn:uuid:qsx-demo-2026-0001",

        version:
          1,

        metadata: {

          ...(original.metadata ??
            {}),

          timestamp:
            original.metadata?.timestamp ??
            new Date().toISOString(),

          tools:
            original.metadata?.tools ??
            [
              {
                vendor:
                  "QShieldX",

                name:
                  "CBOM Agent",

                version:
                  "2.5.0",
              },
            ],

          /*
           * This is the number of assets
           * currently matching filters.
           */
          componentCount:
            filteredCbomComponents.length,

          inventoryAssetCount:
            filteredInventoryComponents.length,

          filterContext: {

            search:
              searchQuery ||
              null,

            status:
              statusFilter,

            priority:
              priorityFilter,

            type:
              typeFilter,

            algorithm:
              algorithmFilter,

          },

        },

        components:
          filteredCbomComponents,

      }

    }, [
      selectedReport,
      filteredCbomComponents,
      filteredInventoryComponents.length,
      searchQuery,
      statusFilter,
      priorityFilter,
      typeFilter,
      algorithmFilter,
    ])


  /* ============================================================
     EXPORT
  ============================================================ */

  const handleDownload =
    (
      format: string
    ) => {

      let content =
        ""

      let mime =
        "text/plain"

      let extension =
        "txt"


      if (
        format === "JSON"
      ) {

        content =
          JSON.stringify(
            filteredCbom,
            null,
            2
          )

        mime =
          "application/json"

        extension =
          "json"

      }

      else if (
        format === "CSV"
      ) {

        const headers = [

          "Asset",
          "Type",
          "Artifact Type",
          "Algorithm",
          "Quantum Status",
          "Priority",
          "QARS",
          "Risk Category",
          "Migration Window",
          "Business Criticality",
          "Owner Team",
          "Cloud Provider",

        ]


        const escapeCsv =
          (value: unknown) => {

            return `"${String(
              value ?? ""
            ).replace(
              /"/g,
              '""'
            )}"`

          }


        const rows =
          filteredInventoryComponents.map(
            (asset) => [

              asset.name,

              asset.type,

              asset.artifactType,

              asset.algorithm,

              asset.status,

              asset.priority,

              asset.qars ??
                "",

              asset.riskCategory,

              asset.migrationWindow,

              asset.businessCriticality,

              asset.ownerTeam,

              asset.cloudProvider,

            ]
          )


        content = [

          headers
            .map(
              escapeCsv
            )
            .join(","),

          ...rows.map(
            (row) =>
              row
                .map(
                  escapeCsv
                )
                .join(",")
          ),

        ].join("\n")


        mime =
          "text/csv"

        extension =
          "csv"

      }

      else if (
        format === "MD"
      ) {

        content = `# QShieldX CBOM Report

## Cryptographic Inventory

Target: ${getReportDomain(
          selectedReport,
          data?.scan?.primaryDomain ??
            "Unknown"
        )}

Filtered assets: ${
          filteredInventoryComponents.length
        }

Search: ${
          searchQuery ||
          "None"
        }

Status filter: ${
          statusFilter
        }

Priority filter: ${
          priorityFilter
        }

Type filter: ${
          typeFilter
        }

Algorithm filter: ${
          algorithmFilter
        }

## Assets

${filteredInventoryComponents
  .map(
    (asset) =>
      `- ${asset.name} — ${asset.algorithm} — ${asset.status} — ${asset.priority}`
  )
  .join("\n")}
`

        mime =
          "text/markdown"

        extension =
          "md"

      }


      const blob =
        new Blob(
          [content],
          {
            type: mime,
          }
        )


      const url =
        URL.createObjectURL(
          blob
        )


      const anchor =
        document.createElement(
          "a"
        )

      anchor.href =
        url

      anchor.download =
        `qshieldx-cbom-${extension}`

      document.body.appendChild(
        anchor
      )

      anchor.click()

      document.body.removeChild(
        anchor
      )

      URL.revokeObjectURL(
        url
      )

    }


  /* ============================================================
     COPY JSON
  ============================================================ */

  const copyToClipboard =
    async () => {

      await navigator.clipboard.writeText(
        JSON.stringify(
          filteredCbom,
          null,
          2
        )
      )

      setCopied(true)

      setTimeout(
        () => {
          setCopied(false)
        },
        2000
      )

    }


  /* ============================================================
     RESET FILTERS
  ============================================================ */

  const clearFilters =
    () => {

      setSearchQuery("")
      setStatusFilter("all")
      setPriorityFilter("all")
      setTypeFilter("all")
      setAlgorithmFilter("all")
      setCurrentPage(1)

    }


  /* ============================================================
     ACTIVE FILTERS
  ============================================================ */

  const activeFilterCount =
    Number(
      searchQuery.trim() !== ""
    ) +
    Number(
      statusFilter !== "all"
    ) +
    Number(
      priorityFilter !== "all"
    ) +
    Number(
      typeFilter !== "all"
    ) +
    Number(
      algorithmFilter !== "all"
    )


  /* ============================================================
     FILTERED STATS
  ============================================================ */

  const filteredVulnerable =
    filteredInventoryComponents.filter(
      (asset) =>
        normalizeFilterValue(
          asset.status
        ).includes(
          "vulnerable"
        )
    ).length


  const filteredQuantumReady =
    filteredInventoryComponents.filter(
      (asset) =>
        normalizeFilterValue(
          asset.status
        ).includes(
          "quantum ready"
        )
    ).length


  const filteredAtRisk =
    filteredInventoryComponents.filter(
      (asset) =>
        normalizeFilterValue(
          asset.status
        ).includes(
          "at risk"
        )
    ).length


  const filteredImmediate =
    filteredInventoryComponents.filter(
      (asset) =>
        normalizeFilterValue(
          asset.priority
        ).includes(
          "immediate"
        )
    ).length


  /* ============================================================
     SELECTED ASSET INFORMATION
  ============================================================ */

  const selectedFamily =
    selectedAsset
      ? getAlgorithmFamily(
          selectedAsset.algorithm
        )
      : ""


  const selectedPrimitive =
    selectedAsset
      ? getAlgorithmPrimitive(
          selectedAsset.algorithm
        )
      : ""


  const recommendation =
    selectedAsset
      ? getMigrationRecommendation(
          selectedAsset.algorithm
        )
      : null


  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {

    return (

      <div className="flex h-full items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-muted-foreground">

          <Activity className="size-4 animate-pulse" />

          Loading CBOM inventory...

        </div>

      </div>

    )

  }


  /* ============================================================
     PAGE
  ============================================================ */

  return (

    <div className="flex h-full flex-col gap-6 overflow-auto p-4 md:p-8">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <FileJson className="size-6 text-primary" />

            <h1 className="text-2xl font-semibold tracking-tight">
              CBOM Explorer
            </h1>

          </div>

          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Enterprise Cryptographic Bill of Materials, algorithm intelligence, evidence, quantum risk, and migration analysis.
          </p>

        </div>


        {/* REPORT SELECTOR */}

        <div className="flex items-center gap-2 rounded-xl border bg-background/80 p-2">

          <select
            className="h-9 min-w-[260px] rounded-md border bg-background px-3 text-sm outline-none"
            value={
              selectedReport?.id ??
              ""
            }
            onChange={(event) => {

              const report =
                reports.find(
                  (item) =>
                    String(
                      item.id
                    ) ===
                    event.target.value
                )

              if (report) {

                setSelectedReport(
                  report
                )

              }

            }}
          >

            {reports.map(
              (report) => (

                <option
                  key={
                    report.id
                  }
                  value={
                    report.id
                  }
                >

                  {
                    getReportDomain(
                      report,
                      data?.scan?.primaryDomain ??
                        "CBOM Report"
                    )
                  }

                  {" · "}

                  {
                    formatReportDate(
                      report.created_at ??
                      data?.scan?.completed
                    )
                  }

                </option>

              )
            )}

            {reports.length === 0 && (
              <option>
                No reports available
              </option>
            )}

          </select>


          <DropdownMenu>

            <DropdownMenuTrigger
              asChild
            >

              <Button className="gap-2">

                <Download className="size-4" />

                Export

              </Button>

            </DropdownMenuTrigger>


            <DropdownMenuContent align="end">

              <DropdownMenuItem
                onClick={() =>
                  handleDownload(
                    "JSON"
                  )
                }
              >
                Filtered CBOM JSON
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  handleDownload(
                    "CSV"
                  )
                }
              >
                Filtered Inventory CSV
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  handleDownload(
                    "MD"
                  )
                }
              >
                Markdown Summary
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </div>


      {/* ======================================================
          MAIN TABS
      ====================================================== */}

      <Tabs
        defaultValue="explorer"
        className="flex min-h-0 flex-1 flex-col"
      >

        <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">

          <TabsTrigger
            value="explorer"
            className="gap-2 rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Layers className="size-4" />
            CBOM Explorer
          </TabsTrigger>

          <TabsTrigger
            value="graph"
            className="gap-2 rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <GitBranch className="size-4" />
            Dependency Graph
          </TabsTrigger>

          <TabsTrigger
            value="summary"
            className="gap-2 rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <FileText className="size-4" />
            Executive Summary
          </TabsTrigger>

          <TabsTrigger
            value="raw"
            className="gap-2 rounded-none px-5 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <FileJson className="size-4" />
            Raw CBOM JSON
          </TabsTrigger>

        </TabsList>


        {/* ====================================================
            EXPLORER
        ==================================================== */}

        <TabsContent
          value="explorer"
          className="mt-0 flex-1 outline-none"
        >

          <Card className="overflow-hidden border-primary/20 bg-background/60">


            {/* HEADER */}

            <CardHeader className="border-b">

              <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                  <div>

                    <CardTitle className="flex items-center gap-2 text-sm">

                      <Binary className="size-4 text-primary" />

                      Cryptographic Asset Inventory

                    </CardTitle>

                    <CardDescription className="mt-1">
                      Inspect every discovered cryptographic asset and drill into algorithm evidence, risk, assumptions, and migration guidance.
                    </CardDescription>

                  </div>


                  <div className="flex flex-wrap items-center gap-2">

                    <Badge
                      variant="secondary"
                      className="gap-1.5"
                    >
                      <ScanSearch className="size-3" />

                      {inventoryComponents.length}

                      {" "}
                      discovered assets
                    </Badge>


                    <Badge
                      variant="outline"
                      className="gap-1.5"
                    >

                      <FileJson className="size-3" />

                      {cbomComponents.length}

                      {" "}
                      source CBOM components

                    </Badge>


                    <Button
                      size="sm"
                      variant={
                        explorerView ===
                        "table"
                          ? "default"
                          : "outline"
                      }
                      className="gap-2"
                      onClick={() =>
                        setExplorerView(
                          "table"
                        )
                      }
                    >
                      <Database className="size-3.5" />
                      Table
                    </Button>


                    <Button
                      size="sm"
                      variant={
                        explorerView ===
                        "graph"
                          ? "default"
                          : "outline"
                      }
                      className="gap-2"
                      onClick={() =>
                        setExplorerView(
                          "graph"
                        )
                      }
                    >
                      <Network className="size-3.5" />
                      Graph
                    </Button>

                  </div>

                </div>


                {/* FILTER BAR */}

                <div className="flex flex-wrap items-center gap-2">

                  <div className="relative min-w-[260px] flex-1">

                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />

                    <Input
                      value={
                        searchQuery
                      }
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search asset, algorithm, type..."
                      className="h-9 pl-9"
                    />

                  </div>


                  {/* STATUS */}

                  <Select
                    value={
                      statusFilter
                    }
                    onValueChange={
                      setStatusFilter
                    }
                  >

                    <SelectTrigger className="h-9 w-[155px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="all">
                        All Status
                      </SelectItem>

                      <SelectItem value="Quantum Ready">
                        Quantum Ready
                      </SelectItem>

                      <SelectItem value="Vulnerable">
                        Vulnerable
                      </SelectItem>

                      <SelectItem value="At Risk">
                        At Risk
                      </SelectItem>

                      <SelectItem value="Legacy">
                        Legacy
                      </SelectItem>

                      <SelectItem value="Acceptable">
                        Acceptable
                      </SelectItem>

                      <SelectItem value="Quantum Resistant">
                        Quantum Resistant
                      </SelectItem>

                      <SelectItem value="Unknown">
                        Unknown
                      </SelectItem>

                    </SelectContent>

                  </Select>


                  {/* PRIORITY */}

                  <Select
                    value={
                      priorityFilter
                    }
                    onValueChange={
                      setPriorityFilter
                    }
                  >

                    <SelectTrigger className="h-9 w-[145px]">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="all">
                        All Priority
                      </SelectItem>

                      <SelectItem value="Immediate">
                        Immediate
                      </SelectItem>

                      <SelectItem value="Wave 1">
                        Wave 1
                      </SelectItem>

                      <SelectItem value="High">
                        High
                      </SelectItem>

                      <SelectItem value="Medium">
                        Medium
                      </SelectItem>

                      <SelectItem value="Low">
                        Low
                      </SelectItem>

                      <SelectItem value="Critical">
                        Critical
                      </SelectItem>

                    </SelectContent>

                  </Select>


                  {/* TYPE */}

                  <Select
                    value={
                      typeFilter
                    }
                    onValueChange={
                      setTypeFilter
                    }
                  >

                    <SelectTrigger className="h-9 w-[140px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="all">
                        All Types
                      </SelectItem>

                      <SelectItem value="algorithm">
                        Algorithm
                      </SelectItem>

                      <SelectItem value="protocol">
                        Protocol
                      </SelectItem>

                      <SelectItem value="certificate">
                        Certificate
                      </SelectItem>

                      <SelectItem value="key">
                        Key
                      </SelectItem>

                      <SelectItem value="service">
                        Service
                      </SelectItem>

                      <SelectItem value="cryptographic asset">
                        Cryptographic Asset
                      </SelectItem>

                      <SelectItem value="domain">
                        Domain
                      </SelectItem>

                    </SelectContent>

                  </Select>


                  {/* ALGORITHM */}

                  <Select
                    value={
                      algorithmFilter
                    }
                    onValueChange={
                      setAlgorithmFilter
                    }
                  >

                    <SelectTrigger className="h-9 w-[150px]">
                      <SelectValue placeholder="All Algorithms" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="all">
                        All Algorithms
                      </SelectItem>

                      <SelectItem value="RSA">
                        RSA
                      </SelectItem>

                      <SelectItem value="ECDSA">
                        ECDSA
                      </SelectItem>

                      <SelectItem value="Ed25519">
                        Ed25519
                      </SelectItem>

                      <SelectItem value="AES">
                        AES
                      </SelectItem>

                      <SelectItem value="SHA">
                        SHA
                      </SelectItem>

                      <SelectItem value="ML-KEM">
                        ML-KEM
                      </SelectItem>

                      <SelectItem value="ML-DSA">
                        ML-DSA
                      </SelectItem>

                      <SelectItem value="SLH-DSA">
                        SLH-DSA
                      </SelectItem>

                    </SelectContent>

                  </Select>


                  {activeFilterCount > 0 && (

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 gap-2"
                      onClick={
                        clearFilters
                      }
                    >

                      <X className="size-3.5" />

                      Clear

                    </Button>

                  )}

                </div>


                {/* FILTER SUMMARY */}

                <div className="flex flex-col gap-3">

                  <div className="flex flex-wrap items-center gap-2">

                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/5 text-primary"
                    >

                      {totalFiltered}

                      {" "}
                      matching assets

                    </Badge>


                    <Badge
                      variant="outline"
                      className="border-red-500/30 bg-red-500/10 text-red-400"
                    >

                      {filteredVulnerable}

                      {" "}
                      vulnerable

                    </Badge>


                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    >

                      {filteredQuantumReady}

                      {" "}
                      quantum ready

                    </Badge>


                    <Badge
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 text-amber-400"
                    >

                      {filteredAtRisk}

                      {" "}
                      at risk

                    </Badge>


                    <Badge
                      variant="outline"
                      className="border-red-500/30 bg-red-500/10 text-red-400"
                    >

                      {filteredImmediate}

                      {" "}
                      immediate

                    </Badge>

                  </div>


                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">

                    <span>

                      {activeFilterCount > 0
                        ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} active`
                        : "No filters active"}

                    </span>


                    <span>

                      {totalFiltered === 0
                        ? "0 of 0"
                        : `${pageStart + 1}–${pageEnd} of ${totalFiltered}`}

                    </span>

                  </div>

                </div>

              </div>

            </CardHeader>


            {/* ==================================================
                TABLE
            ================================================== */}

            {explorerView === "table" && (

              <div>

                <div className="overflow-x-auto">

                  <Table>

                    <TableHeader>

                      <TableRow>

                        <TableHead className="pl-6">
                          Asset
                        </TableHead>

                        <TableHead>
                          Algorithm
                        </TableHead>

                        <TableHead>
                          Type
                        </TableHead>

                        <TableHead>
                          Status
                        </TableHead>

                        <TableHead>
                          QARS
                        </TableHead>

                        <TableHead>
                          Priority
                        </TableHead>

                      </TableRow>

                    </TableHeader>


                    <TableBody>

                      {paginatedInventory.length ===
                      0 ? (

                        <TableRow>

                          <TableCell
                            colSpan={6}
                            className="h-72"
                          >

                            <div className="flex flex-col items-center justify-center gap-3">

                              <div className="rounded-full border border-border bg-muted/20 p-4">

                                <Search className="size-7 text-muted-foreground" />

                              </div>

                              <div className="text-center">

                                <p className="text-sm font-semibold">
                                  No assets found
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  This filter currently matches 0 assets.
                                </p>

                              </div>


                              {activeFilterCount > 0 && (

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={
                                    clearFilters
                                  }
                                >
                                  Clear filters
                                </Button>

                              )}

                            </div>

                          </TableCell>

                        </TableRow>

                      ) : (

                        paginatedInventory.map(
                          (component) => {

                            const family =
                              getAlgorithmFamily(
                                component.algorithm
                              )

                            const primitive =
                              getAlgorithmPrimitive(
                                component.algorithm
                              )


                            return (

                              <TableRow
                                key={
                                  component.id
                                }
                                onClick={() =>
                                  setSelectedAsset(
                                    component
                                  )
                                }
                                className={`cursor-pointer transition-colors ${
                                  selectedAsset?.id ===
                                  component.id
                                    ? "bg-primary/10"
                                    : "hover:bg-muted/40"
                                }`}
                              >

                                {/* ASSET */}

                                <TableCell className="pl-6">

                                  <div className="flex items-center gap-3">

                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">

                                      <Binary className="size-4 text-primary" />

                                    </div>


                                    <div className="min-w-0">

                                      <p className="max-w-[300px] truncate text-sm font-semibold">
                                        {
                                          component.name
                                        }
                                      </p>

                                      <div className="mt-1 flex items-center gap-2">

                                        <span className="text-[10px] text-muted-foreground">
                                          {
                                            component.artifactType
                                          }
                                        </span>

                                        <span className="text-muted-foreground">
                                          •
                                        </span>

                                        <span className="text-[10px] text-muted-foreground">
                                          {
                                            component.businessCriticality
                                          }
                                        </span>

                                      </div>

                                    </div>

                                  </div>

                                </TableCell>


                                {/* ALGORITHM */}

                                <TableCell>

                                  <div>

                                    <p className="font-mono text-xs font-semibold">
                                      {
                                        component.algorithm
                                      }
                                    </p>

                                    <p className="mt-1 text-[10px] text-muted-foreground">
                                      {family}
                                      {" · "}
                                      {primitive}
                                    </p>

                                  </div>

                                </TableCell>


                                {/* TYPE */}

                                <TableCell>

                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    {
                                      component.type
                                    }
                                  </Badge>

                                </TableCell>


                                {/* STATUS */}

                                <TableCell>

                                  <Badge
                                    variant="outline"
                                    className={
                                      getStatusClass(
                                        component.status
                                      )
                                    }
                                  >

                                    {
                                      component.status
                                    }

                                  </Badge>

                                </TableCell>


                                {/* QARS */}

                                <TableCell>

                                  {component.qars !==
                                  null ? (

                                    <div className="flex items-center gap-2">

                                      <Gauge className="size-3.5 text-muted-foreground" />

                                      <span className="font-mono text-xs font-semibold">
                                        {
                                          component.qars
                                        }
                                      </span>

                                    </div>

                                  ) : (

                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>

                                  )}

                                </TableCell>


                                {/* PRIORITY */}

                                <TableCell>

                                  <Badge
                                    variant="outline"
                                    className={
                                      normalizeFilterValue(
                                        component.priority
                                      ).includes(
                                        "immediate"
                                      ) ||
                                      normalizeFilterValue(
                                        component.priority
                                      ).includes(
                                        "critical"
                                      )
                                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                                        : normalizeFilterValue(
                                              component.priority
                                            ).includes(
                                              "wave 1"
                                            ) ||
                                            normalizeFilterValue(
                                              component.priority
                                            ).includes(
                                              "high"
                                            )
                                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                          : ""
                                    }
                                  >
                                    {
                                      component.priority
                                    }
                                  </Badge>

                                </TableCell>

                              </TableRow>

                            )

                          }
                        )

                      )}

                    </TableBody>

                  </Table>

                </div>


                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {totalFiltered > 0 && (

                  <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="text-xs text-muted-foreground">

                      Showing{" "}

                      <span className="font-medium text-foreground">
                        {pageStart + 1}
                      </span>

                      {"–"}

                      <span className="font-medium text-foreground">
                        {pageEnd}
                      </span>

                      {" "}
                      of{" "}

                      <span className="font-medium text-foreground">
                        {totalFiltered}
                      </span>

                      {" "}
                      assets

                    </div>


                    <div className="flex items-center gap-1">

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          currentPage === 1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.max(
                                1,
                                page - 1
                              )
                          )
                        }
                        className="gap-1"
                      >

                        <ArrowLeft className="size-3.5" />

                        Previous

                      </Button>


                      {pageNumbers.map(
                        (page) => (

                          <Button
                            key={page}
                            size="sm"
                            variant={
                              currentPage ===
                              page
                                ? "default"
                                : "outline"
                            }
                            className="size-8 p-0"
                            onClick={() =>
                              setCurrentPage(
                                page
                              )
                            }
                          >
                            {page}
                          </Button>

                        )
                      )}


                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          currentPage >=
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.min(
                                totalPages,
                                page + 1
                              )
                          )
                        }
                        className="gap-1"
                      >

                        Next

                        <ArrowRight className="size-3.5" />

                      </Button>

                    </div>

                  </div>

                )}


                {/* ==================================================
                    ASSET INSPECTOR
                ================================================== */}

                {selectedAsset && (

                  <div className="border-t bg-background">

                    {/* HEADER */}

                    <div className="flex items-start justify-between gap-4 border-b p-6">

                      <div className="flex items-center gap-4">

                        <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">

                          <KeyRound className="size-5 text-primary" />

                        </div>


                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="text-xl font-semibold">
                              {
                                selectedAsset.algorithm
                              }
                            </h2>

                            <Badge
                              variant="outline"
                              className={
                                getStatusClass(
                                  selectedAsset.status
                                )
                              }
                            >
                              {
                                selectedAsset.status
                              }
                            </Badge>

                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              selectedAsset.name
                            }
                          </p>

                        </div>

                      </div>


                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setSelectedAsset(
                            null
                          )
                        }
                      >
                        <X className="size-4" />
                      </Button>

                    </div>


                    {/* DETAILS */}

                    <div className="grid grid-cols-1 xl:grid-cols-2">


                      {/* OBSERVED */}

                      <div className="border-b p-6 xl:border-r">

                        <SectionHeader
                          icon={
                            <Eye className="size-4" />
                          }
                          title="Observed — evidence-backed"
                          description="Values associated with the discovered asset."
                        />


                        <div className="space-y-3">

                          <DetailRow
                            label="Algorithm"
                            value={
                              selectedAsset.algorithm
                            }
                          />

                          <DetailRow
                            label="Algorithm family"
                            value={
                              selectedFamily
                            }
                          />

                          <DetailRow
                            label="Primitive"
                            value={
                              selectedPrimitive
                            }
                          />

                          <DetailRow
                            label="Asset type"
                            value={
                              selectedAsset.type
                            }
                          />

                          <DetailRow
                            label="Artifact"
                            value={
                              selectedAsset.artifactType
                            }
                          />

                          <DetailRow
                            label="Quantum status"
                            value={
                              selectedAsset.status
                            }
                          />

                          <DetailRow
                            label="Business criticality"
                            value={
                              selectedAsset.businessCriticality
                            }
                          />

                          <DetailRow
                            label="Cloud"
                            value={
                              selectedAsset.cloudProvider
                            }
                          />

                          <DetailRow
                            label="Owner"
                            value={
                              selectedAsset.ownerTeam
                            }
                          />

                        </div>

                      </div>


                      {/* INFERRED */}

                      <div className="border-b p-6">

                        <SectionHeader
                          icon={
                            <BrainCircuit className="size-4" />
                          }
                          title="Inferred — heuristic"
                          description="Derived from inventory and quantum-risk metadata."
                        />


                        <div className="space-y-3">

                          <DetailRow
                            label="Risk category"
                            value={
                              selectedAsset.riskCategory
                            }
                          />

                          <DetailRow
                            label="Migration priority"
                            value={
                              selectedAsset.priority
                            }
                          />

                          <DetailRow
                            label="Migration window"
                            value={
                              selectedAsset.migrationWindow
                            }
                          />

                          <DetailRow
                            label="QARS"
                            value={
                              selectedAsset.qars !==
                              null
                                ? `${selectedAsset.qars}/100`
                                : "Not available"
                            }
                          />

                          <DetailRow
                            label="Lifetime"
                            value={
                              selectedAsset.lifetimeYears !==
                              null
                                ? `${selectedAsset.lifetimeYears} years`
                                : "Not available"
                            }
                          />

                        </div>

                      </div>


                      {/* ASSUMED */}

                      <div className="border-b p-6 xl:border-r">

                        <SectionHeader
                          icon={
                            <Terminal className="size-4" />
                          }
                          title="Assumed — operator-set"
                          description="Planning assumptions rather than directly measured properties."
                        />


                        <div className="space-y-3">

                          <DetailRow
                            label="Data lifetime"
                            value={
                              selectedAsset.lifetimeYears !==
                              null
                                ? `${selectedAsset.lifetimeYears} years`
                                : "Default planning horizon"
                            }
                          />

                          <DetailRow
                            label="Business criticality"
                            value={
                              selectedAsset.businessCriticality
                            }
                          />

                          <DetailRow
                            label="Migration window"
                            value={
                              selectedAsset.migrationWindow
                            }
                          />


                          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">

                            <div className="flex gap-2">

                              <Info className="mt-0.5 size-4 shrink-0 text-amber-400" />

                              <p className="text-[10px] leading-5 text-muted-foreground">
                                These values are planning assumptions and should not be interpreted as direct measurements.
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* KNOWLEDGE BASE */}

                      <div className="border-b p-6">

                        <SectionHeader
                          icon={
                            <ShieldCheck className="size-4" />
                          }
                          title="Knowledge base — deterministic"
                          description="Algorithm classification and migration guidance."
                        />


                        <div className="space-y-3">

                          <DetailRow
                            label="Family"
                            value={
                              selectedFamily
                            }
                          />

                          <DetailRow
                            label="Primitive"
                            value={
                              selectedPrimitive
                            }
                          />

                          <DetailRow
                            label="Current status"
                            value={
                              selectedAsset.status
                            }
                          />

                          <DetailRow
                            label="Recommended"
                            value={
                              recommendation?.title
                            }
                          />

                        </div>

                      </div>


                      {/* QUANTUM RISK */}

                      <div className="border-b p-6 xl:border-r">

                        <SectionHeader
                          icon={
                            <Gauge className="size-4" />
                          }
                          title="Quantum risk assessment"
                          description="Current risk indicators for this asset."
                        />


                        <div className="grid grid-cols-2 gap-3">

                          <div className="rounded-xl border bg-muted/10 p-4">

                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              QARS
                            </p>

                            <p className="mt-2 text-2xl font-semibold">
                              {
                                selectedAsset.qars ??
                                "—"
                              }
                            </p>

                          </div>


                          <div className="rounded-xl border bg-muted/10 p-4">

                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Category
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                              {
                                selectedAsset.riskCategory
                              }
                            </p>

                          </div>


                          <div className="rounded-xl border bg-muted/10 p-4">

                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Priority
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                              {
                                selectedAsset.priority
                              }
                            </p>

                          </div>


                          <div className="rounded-xl border bg-muted/10 p-4">

                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Window
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                              {
                                selectedAsset.migrationWindow
                              }
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* RECOMMENDATION */}

                      <div className="border-b p-6">

                        <SectionHeader
                          icon={
                            <Sparkles className="size-4" />
                          }
                          title="Recommended migration"
                          description="Algorithm-family-specific migration guidance."
                        />


                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">

                          <div className="flex items-start gap-3">

                            <div className="rounded-lg bg-primary/10 p-2">

                              <TrendingUp className="size-4 text-primary" />

                            </div>


                            <div>

                              <h4 className="text-sm font-semibold">
                                {
                                  recommendation?.title
                                }
                              </h4>

                              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                {
                                  recommendation?.description
                                }
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            )}


            {/* ==================================================
                GRAPH
            ================================================== */}

            {explorerView === "graph" && (

              <div className="relative h-[720px]">

                {/* GRAPH LEGEND */}

                <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2 rounded-xl border bg-background/90 p-3 backdrop-blur">

                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  >
                    <span className="size-2 rounded-full bg-emerald-400" />
                    Quantum Ready
                  </Badge>

                  <Badge
                    variant="outline"
                    className="gap-1.5 border-red-500/30 bg-red-500/10 text-red-400"
                  >
                    <span className="size-2 rounded-full bg-red-400" />
                    Vulnerable
                  </Badge>

                  <Badge
                    variant="outline"
                    className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400"
                  >
                    <span className="size-2 rounded-full bg-amber-400" />
                    At Risk
                  </Badge>

                  <Badge
                    variant="outline"
                  >
                    Page{" "}
                    {currentPage}
                    {" "}
                    ·{" "}
                    {paginatedInventory.length}
                    {" "}
                    assets
                  </Badge>

                </div>


                {paginatedInventory.length ===
                0 ? (

                  <div className="flex h-full flex-col items-center justify-center">

                    <Network className="size-12 text-muted-foreground/30" />

                    <p className="mt-3 text-sm font-semibold">
                      No assets match the current filters
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Clear the filters to populate the graph.
                    </p>

                  </div>

                ) : (

                  <ReactFlow
                    nodes={
                      graphNodes
                    }
                    edges={
                      graphEdges
                    }
                    fitView
                    fitViewOptions={{
                      padding:
                        0.2,
                    }}
                    nodesDraggable
                    nodesConnectable={false}
                    zoomOnScroll
                    panOnScroll
                  >

                    <Background
                      gap={22}
                      size={1}
                      color="#27272a"
                    />

                    <Controls />

                    <MiniMap
                      nodeColor={(
                        node
                      ) => {

                        const asset =
                          paginatedInventory.find(
                            (item) =>
                              String(
                                item.id
                              ) ===
                              String(
                                node.id
                              )
                          )

                        return asset
                          ? getGraphColor(
                              asset.status
                            )
                          : "#71717a"

                      }}
                      maskColor="rgba(0,0,0,0.75)"
                    />

                  </ReactFlow>

                )}

              </div>

            )}

          </Card>

        </TabsContent>


        {/* ======================================================
            DEPENDENCY GRAPH
        ====================================================== */}

        <TabsContent value="graph" className="mt-0">
        <Card className="overflow-hidden border-white/10 bg-[#0b0b0b]">
          <CardHeader className="border-b border-white/10 bg-[#111111]">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <GitBranch className="h-4 w-4 text-cyan-400" />
              CBOM Dependency Graph
            </CardTitle>

            <CardDescription className="text-zinc-400">
              Actual CBOM relationships between cryptographic components.
            </CardDescription>
          </CardHeader>

          <div className="relative h-[680px] w-full bg-[#070707]">
            <ReactFlow
              nodes={(initialNodes ?? []) as Node[]}
              edges={(initialEdges ?? []) as Edge[]}
              fitView
              fitViewOptions={{
                padding: 0.12,
                minZoom: 0.45,
                maxZoom: 1.35,
              }}
              minZoom={0.25}
              maxZoom={1.5}
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable
              panOnDrag
              zoomOnScroll
              zoomOnPinch
              zoomOnDoubleClick
              proOptions={{ hideAttribution: true }}
            >
              <Background
                gap={20}
                size={1}
                color="#27272a"
              />

              <Controls
                showInteractive={false}
                className="!border-white/10 !bg-[#111111]"
              />

              <MiniMap
                pannable
                zoomable
                nodeColor={(node) => {
                  const label = String(node.data?.label ?? "").toLowerCase();

                  if (
                    label.includes("vulnerable") ||
                    label.includes("critical") ||
                    label.includes("rsa")
                  ) {
                    return "#ef4444";
                  }

                  if (
                    label.includes("ready") ||
                    label.includes("ml-kem") ||
                    label.includes("ml-dsa")
                  ) {
                    return "#10b981";
                  }

                  return "#38bdf8";
                }}
                maskColor="rgba(0,0,0,0.65)"
                className="!border-white/10 !bg-[#111111]"
              />
            </ReactFlow>
          </div>
        </Card>
      </TabsContent>
        {/* ======================================================
            EXECUTIVE SUMMARY
        ====================================================== */}

        <TabsContent
          value="summary"
          className="mt-0 flex-1 overflow-auto outline-none"
        >

          <ExecutiveSummary
            selectedReport={
              selectedReport
            }
            seedCBOM={
              seedCBOM
            }
          />

        </TabsContent>


        {/* ======================================================
            RAW CBOM
        ====================================================== */}

        <TabsContent
          value="raw"
          className="mt-0 flex-1 outline-none"
        >

          <Card className="min-h-[700px] overflow-hidden">

            <CardHeader className="border-b">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <CardTitle className="flex items-center gap-2 text-sm">

                    <FileJson className="size-4 text-primary" />

                    Raw CBOM JSON

                  </CardTitle>

                  <CardDescription className="mt-1">
                    Filter-aware CycloneDX 1.7 representation of the current cryptographic inventory.
                  </CardDescription>

                </div>


                <div className="flex items-center gap-2">

                  <Badge
                    variant="outline"
                  >

                    {
                      filteredCbomComponents.length
                    }

                    {" "}
                    components

                  </Badge>


                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={
                      copyToClipboard
                    }
                  >

                    {copied ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <FileJson className="size-3.5" />
                    )}

                    {copied
                      ? "Copied"
                      : "Copy JSON"}

                  </Button>

                </div>

              </div>


              {/* FILTER CONTEXT */}

              {activeFilterCount >
                0 && (

                <div className="mt-4 flex flex-wrap gap-2">

                  <Badge
                    variant="secondary"
                  >
                    Filtered CBOM
                  </Badge>


                  {searchQuery && (
                    <Badge variant="outline">
                      Search: {searchQuery}
                    </Badge>
                  )}


                  {statusFilter !==
                    "all" && (
                    <Badge variant="outline">
                      Status: {statusFilter}
                    </Badge>
                  )}


                  {priorityFilter !==
                    "all" && (
                    <Badge variant="outline">
                      Priority: {priorityFilter}
                    </Badge>
                  )}


                  {typeFilter !==
                    "all" && (
                    <Badge variant="outline">
                      Type: {typeFilter}
                    </Badge>
                  )}


                  {algorithmFilter !==
                    "all" && (
                    <Badge variant="outline">
                      Algorithm: {algorithmFilter}
                    </Badge>
                  )}

                </div>

              )}

            </CardHeader>


            <CardContent className="p-0">

              <pre className="max-h-[700px] overflow-auto bg-[#08090a] p-6 font-mono text-[11px] leading-6 text-emerald-400">

                {JSON.stringify(
                  filteredCbom,
                  null,
                  2
                )}

              </pre>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>

    </div>

  )
}