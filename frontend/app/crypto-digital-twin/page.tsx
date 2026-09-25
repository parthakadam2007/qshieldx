"use client"

import * as React from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  ChevronDown,
  CircleDot,
  Database,
  FileKey2,
  Filter,
  GitBranch,
  KeyRound,
  Library,
  Maximize2,
  Network,
  PanelRight,
  RefreshCw,
  Search,
  ShieldCheck,
  TerminalSquare,
  Waypoints,
  X,
  Zap,
} from "lucide-react"
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type TwinNodeData = {
  label: string
  type: string
  technology: string
  version: string
  algorithm: string
  quantumStatus: "Quantum Safe" | "Partially Vulnerable" | "Vulnerable"
  risk: "Low" | "Medium" | "High" | "Critical"
  application: string
  sensitivity: "Public" | "Internal" | "Confidential" | "Restricted"
  discovery: "Static Analysis" | "Runtime Trace" | "Static + Runtime"
  dependencies: string[]
  usedBy: string[]
  dataProtected: string[]
  source: string
  icon: "app" | "service" | "library" | "algorithm" | "api" | "key" | "data" | "external"
}

type TwinNode = Node<TwinNodeData>

const graphNodes: TwinNode[] = [
  {
    id: "app-mypay",
    type: "twin",
    position: { x: 390, y: 20 },
    data: {
      label: "MyPay Platform",
      type: "Application",
      technology: "Node.js / Next.js",
      version: "2026.09",
      algorithm: "TLS 1.3, AES-256",
      quantumStatus: "Partially Vulnerable",
      risk: "High",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Static + Runtime",
      dependencies: ["auth-service", "api-gateway", "payment-db"],
      usedBy: ["Customer Portal", "Merchant Console"],
      dataProtected: ["Payment records", "Customer PII"],
      source: "Neo4j application inventory",
      icon: "app",
    },
  },
  {
    id: "api-gateway",
    type: "twin",
    position: { x: 80, y: 190 },
    data: {
      label: "API Gateway",
      type: "Service",
      technology: "Envoy Proxy",
      version: "1.31.x",
      algorithm: "ECDHE, AES-GCM",
      quantumStatus: "Partially Vulnerable",
      risk: "High",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Runtime Trace",
      dependencies: ["openssl", "tls-api"],
      usedBy: ["MyPay Platform", "Checkout Service"],
      dataProtected: ["API traffic", "Payment tokens"],
      source: "Runtime trace + service manifest",
      icon: "service",
    },
  },
  {
    id: "auth-service",
    type: "twin",
    position: { x: 380, y: 190 },
    data: {
      label: "Auth Service",
      type: "Service",
      technology: "Spring Boot",
      version: "3.4.x",
      algorithm: "RSA-2048, Argon2id",
      quantumStatus: "Vulnerable",
      risk: "Critical",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Static + Runtime",
      dependencies: ["openssl", "jwt-api", "identity-db"],
      usedBy: ["API Gateway", "Customer Portal"],
      dataProtected: ["Identity records", "Session tokens"],
      source: "Static analysis + runtime trace",
      icon: "service",
    },
  },
  {
    id: "checkout-service",
    type: "twin",
    position: { x: 680, y: 190 },
    data: {
      label: "Checkout Service",
      type: "Service",
      technology: "Go",
      version: "1.23.x",
      algorithm: "ML-KEM-768, AES-256",
      quantumStatus: "Quantum Safe",
      risk: "Low",
      application: "MyPay Platform",
      sensitivity: "Confidential",
      discovery: "Static Analysis",
      dependencies: ["pqc-library", "payment-api"],
      usedBy: ["MyPay Platform"],
      dataProtected: ["Checkout payloads", "Order details"],
      source: "Repository dependency scan",
      icon: "service",
    },
  },
  {
    id: "openssl",
    type: "twin",
    position: { x: 20, y: 380 },
    data: {
      label: "OpenSSL",
      type: "Cryptographic Library",
      technology: "OpenSSL",
      version: "3.0.x",
      algorithm: "RSA, AES, ECDSA",
      quantumStatus: "Partially Vulnerable",
      risk: "High",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Static + Runtime",
      dependencies: ["rsa-api", "tls-api"],
      usedBy: ["Auth Service", "API Gateway"],
      dataProtected: ["Identity records", "API traffic"],
      source: "Static analysis + runtime trace",
      icon: "library",
    },
  },
  {
    id: "jwt-api",
    type: "twin",
    position: { x: 295, y: 380 },
    data: {
      label: "JWT Crypto API",
      type: "Crypto API",
      technology: "jose",
      version: "5.9.x",
      algorithm: "RS256, HS256",
      quantumStatus: "Vulnerable",
      risk: "High",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Static Analysis",
      dependencies: ["openssl", "auth-service"],
      usedBy: ["Auth Service", "Customer Portal"],
      dataProtected: ["Session tokens", "Access claims"],
      source: "Source code call graph",
      icon: "api",
    },
  },
  {
    id: "pqc-library",
    type: "twin",
    position: { x: 600, y: 380 },
    data: {
      label: "PQC Toolkit",
      type: "Cryptographic Library",
      technology: "liboqs",
      version: "0.12.x",
      algorithm: "ML-KEM-768, ML-DSA-65",
      quantumStatus: "Quantum Safe",
      risk: "Low",
      application: "MyPay Platform",
      sensitivity: "Confidential",
      discovery: "Static Analysis",
      dependencies: ["pqc-api"],
      usedBy: ["Checkout Service", "API Gateway"],
      dataProtected: ["Payment payloads", "Service secrets"],
      source: "SBOM + source code analysis",
      icon: "library",
    },
  },
  {
    id: "payment-db",
    type: "twin",
    position: { x: 900, y: 380 },
    data: {
      label: "Payment Database",
      type: "Data Asset",
      technology: "PostgreSQL",
      version: "16.x",
      algorithm: "AES-256-GCM",
      quantumStatus: "Quantum Safe",
      risk: "Medium",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Runtime Trace",
      dependencies: ["tls-api", "aes-api"],
      usedBy: ["Checkout Service", "API Gateway"],
      dataProtected: ["Card tokens", "Settlement records"],
      source: "Database connection trace",
      icon: "data",
    },
  },
  {
    id: "rsa-cert",
    type: "twin",
    position: { x: 90, y: 565 },
    data: {
      label: "api.mypay.com Cert",
      type: "Certificate / Key",
      technology: "X.509",
      version: "RSA-2048",
      algorithm: "RSA-2048",
      quantumStatus: "Vulnerable",
      risk: "Critical",
      application: "MyPay Platform",
      sensitivity: "Restricted",
      discovery: "Runtime Trace",
      dependencies: ["openssl"],
      usedBy: ["API Gateway"],
      dataProtected: ["Public API traffic"],
      source: "Certificate transparency + TLS scan",
      icon: "key",
    },
  },
  {
    id: "tls-api",
    type: "twin",
    position: { x: 420, y: 565 },
    data: {
      label: "TLS Crypto API",
      type: "Crypto API",
      technology: "BoringSSL API",
      version: "1.1.x",
      algorithm: "TLS 1.3, ECDHE",
      quantumStatus: "Partially Vulnerable",
      risk: "Medium",
      application: "MyPay Platform",
      sensitivity: "Internal",
      discovery: "Runtime Trace",
      dependencies: ["openssl", "rsa-cert"],
      usedBy: ["API Gateway", "Payment Database"],
      dataProtected: ["Encrypted transport"],
      source: "Runtime trace",
      icon: "api",
    },
  },
  {
    id: "stripe-external",
    type: "twin",
    position: { x: 760, y: 565 },
    data: {
      label: "Stripe API",
      type: "External Dependency",
      technology: "HTTPS API",
      version: "v2025-12",
      algorithm: "TLS 1.3, ECDSA",
      quantumStatus: "Partially Vulnerable",
      risk: "Medium",
      application: "MyPay Platform",
      sensitivity: "Confidential",
      discovery: "Runtime Trace",
      dependencies: ["tls-api"],
      usedBy: ["Checkout Service"],
      dataProtected: ["Payment intents"],
      source: "Runtime egress trace",
      icon: "external",
    },
  },
]

const graphEdges: Edge[] = [
  ["app-mypay", "api-gateway", "USES"],
  ["app-mypay", "auth-service", "USES"],
  ["app-mypay", "checkout-service", "USES"],
  ["api-gateway", "openssl", "DEPENDS_ON"],
  ["api-gateway", "tls-api", "IMPLEMENTS"],
  ["auth-service", "openssl", "DEPENDS_ON"],
  ["auth-service", "jwt-api", "USES"],
  ["checkout-service", "pqc-library", "DEPENDS_ON"],
  ["checkout-service", "payment-db", "PROTECTS"],
  ["payment-db", "tls-api", "PROTECTS"],
  ["openssl", "rsa-cert", "IMPLEMENTS"],
  ["openssl", "tls-api", "IMPLEMENTS"],
  ["api-gateway", "rsa-cert", "PROTECTS"],
  ["tls-api", "stripe-external", "COMMUNICATES_WITH"],
].map(([source, target, label]) => ({
  id: `${source}-${target}`,
  source,
  target,
  label,
  animated: label === "COMMUNICATES_WITH",
  style: { stroke: "#31506a", strokeWidth: 1.5 },
  labelStyle: { fill: "#7c9ab2", fontSize: 9, fontWeight: 600 },
  labelBgStyle: { fill: "#08131d", fillOpacity: 0.9 },
  markerEnd: { type: "arrowclosed", color: "#5b7f99" },
}))

const nodeIcons = {
  app: Boxes,
  service: Network,
  library: Library,
  algorithm: KeyRound,
  api: TerminalSquare,
  key: FileKey2,
  data: Database,
  external: ArrowUpRight,
}

const nodeColors: Record<TwinNodeData["icon"], string> = {
  app: "text-cyan-300 bg-cyan-400/10 border-cyan-300/30",
  service: "text-sky-300 bg-sky-400/10 border-sky-300/30",
  library: "text-violet-300 bg-violet-400/10 border-violet-300/30",
  algorithm: "text-amber-300 bg-amber-400/10 border-amber-300/30",
  api: "text-teal-300 bg-teal-400/10 border-teal-300/30",
  key: "text-rose-300 bg-rose-400/10 border-rose-300/30",
  data: "text-orange-300 bg-orange-400/10 border-orange-300/30",
  external: "text-muted-foreground bg-muted border-border",
}

function TwinNode({ data, selected }: NodeProps<TwinNode>) {
  const Icon = nodeIcons[data.icon]

  return (
    <div
      className={cn(
        "w-[178px] rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-xl transition-all",
        selected ? "border-cyan-500 shadow-cyan-400/20" : "hover:border-cyan-500/50",
      )}
    >
      <Handle type="target" position={Position.Top} className="!size-1.5 !border-0 !bg-cyan-300" />
      <Handle type="source" position={Position.Bottom} className="!size-1.5 !border-0 !bg-cyan-300" />
      <div className="flex items-center gap-2">
        <div className={cn("rounded-lg border p-1.5", nodeColors[data.icon])}>
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-foreground">{data.label}</p>
          <p className="truncate text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{data.type}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
        <span className="truncate font-mono text-[9px] text-muted-foreground">{data.algorithm}</span>
        <span className={cn(
          "size-1.5 shrink-0 rounded-full",
          data.risk === "Critical" || data.risk === "High" ? "bg-rose-400" : data.risk === "Medium" ? "bg-amber-300" : "bg-emerald-300",
        )} />
      </div>
    </div>
  )
}

const nodeTypes = { twin: TwinNode }

const statCards = [
  { label: "Crypto Assets", value: "26", delta: "+4.8%", icon: KeyRound, color: "text-cyan-300" },
  { label: "Dependencies", value: "64", delta: "Across 8 apps", icon: GitBranch, color: "text-violet-300" },
  { label: "Quantum-Vulnerable", value: "08", delta: "30.7% of assets", icon: AlertTriangle, color: "text-rose-300" },
  { label: "High-Risk Paths", value: "12", delta: "3 critical", icon: Zap, color: "text-amber-300" },
  { label: "Applications Mapped", value: "08", delta: "Live inventory", icon: Boxes, color: "text-emerald-300" },
]

const filterOptions = {
  quantum: ["all", "Quantum Safe", "Partially Vulnerable", "Vulnerable"],
  risk: ["all", "Low", "Medium", "High", "Critical"],
  algorithm: ["all", "RSA-2048", "AES-256-GCM", "ML-KEM-768", "TLS 1.3"],
  type: ["all", "Application", "Service", "Cryptographic Library", "Crypto API", "Certificate / Key", "Data Asset", "External Dependency"],
  application: ["all", "MyPay Platform"],
  sensitivity: ["all", "Public", "Internal", "Confidential", "Restricted"],
  discovery: ["all", "Static Analysis", "Runtime Trace", "Static + Runtime"],
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 border-border bg-muted/30 text-[11px] text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover text-popover-foreground">
          {options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option === "all" ? "All" : option}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function CryptoDigitalTwinPage() {
  const [nodes, , onNodesChange] = useNodesState(graphNodes)
  const [edges, , onEdgesChange] = useEdgesState(graphEdges)
  const [selectedId, setSelectedId] = React.useState("openssl")
  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState({ quantum: "all", risk: "all", algorithm: "all", type: "all", application: "all", sensitivity: "all", discovery: "all" })
  const [relationshipsExpanded, setRelationshipsExpanded] = React.useState(true)

  const selectedNode = graphNodes.find((node) => node.id === selectedId) ?? graphNodes[0]
  const visibleNodeIds = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return new Set(
      graphNodes
        .filter(({ data }) => {
          const matchesSearch = !query || [data.label, data.type, data.technology, data.algorithm].some((value) => value.toLowerCase().includes(query))
          const matches = (key: keyof typeof filters, value: string) => filters[key] === "all" || filters[key] === value
          return matchesSearch && matches("quantum", data.quantumStatus) && matches("risk", data.risk) && matches("type", data.type) && matches("application", data.application) && matches("sensitivity", data.sensitivity) && matches("discovery", data.discovery) && (filters.algorithm === "all" || data.algorithm.includes(filters.algorithm))
        })
        .map((node) => node.id),
    )
  }, [filters, search])

  const visibleNodes = nodes.filter((node) => visibleNodeIds.has(node.id))
  const visibleEdges = relationshipsExpanded ? edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) : []

  const updateFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const clearFilters = () => {
    setSearch("")
    setFilters({ quantum: "all", risk: "all", algorithm: "all", type: "all", application: "all", sensitivity: "all", discovery: "all" })
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <header className="flex flex-col gap-4 border-b border-border pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2.5 text-cyan-300"><Waypoints className="size-5" /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight">Neo4j Crypto Digital Twin</h1>
                <Badge className="gap-1.5 border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-300" /> Live</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Cryptographic dependency graph for the MyPay application ecosystem</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 sm:w-64"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search nodes, algorithms..." className="h-9 border-border bg-muted/30 pl-9 text-xs text-foreground placeholder:text-muted-foreground" /></div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground"><RefreshCw className="size-3.5 text-cyan-600" /> Last sync <span className="font-mono text-foreground">just now</span></div>
            <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-muted/30 text-xs text-foreground"><RefreshCw className="size-3.5" /> Sync Neo4j</Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-border bg-card shadow-none">
              <CardContent className="flex items-start justify-between p-4"><div><p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p><p className={cn("mt-2 text-2xl font-semibold", stat.color)}>{stat.value}</p><p className="mt-1 text-[10px] text-muted-foreground">{stat.delta}</p></div><stat.icon className={cn("size-4", stat.color)} /></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid min-h-[680px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="flex min-h-[680px] flex-col overflow-hidden border-border bg-card shadow-none">
            <CardHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
              <div><CardTitle className="flex items-center gap-2 text-sm"><Network className="size-4 text-cyan-600" /> Crypto Dependency Graph</CardTitle><p className="mt-1 text-[10px] text-muted-foreground">Neo4j knowledge graph · {visibleNodes.length} nodes · {visibleEdges.length} relationships</p></div>
              <div className="flex items-center gap-2"><Badge variant="outline" className="hidden border-border text-[10px] text-muted-foreground sm:flex"><CircleDot className="mr-1.5 size-3 text-cyan-600" /> Cypher stream active</Badge><Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setRelationshipsExpanded((value) => !value)} title="Expand or collapse relationships">{relationshipsExpanded ? <ChevronDown className="size-4" /> : <Maximize2 className="size-4" />}</Button></div>
            </CardHeader>
            <div className="relative min-h-0 flex-1">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5 rounded-lg border border-border bg-background/90 p-1.5 backdrop-blur"><span className="px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Legend</span>{[["bg-cyan-500", "Application"], ["bg-sky-500", "Service"], ["bg-violet-500", "Library"], ["bg-rose-500", "Vulnerable"]].map(([color, label]) => <span key={label} className="flex items-center gap-1.5 px-1.5 py-1 text-[9px] text-muted-foreground"><span className={cn("size-1.5 rounded-full", color)} />{label}</span>)}</div>
              <ReactFlow nodes={visibleNodes} edges={visibleEdges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={(_, node) => setSelectedId(node.id)} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.35} maxZoom={1.8} className="bg-card" proOptions={{ hideAttribution: true }}>
                <Background color="hsl(var(--border))" gap={28} size={1} />
                <Controls className="!border-border !bg-background [&>button]:!border-border [&>button]:!bg-background [&>button]:!fill-muted-foreground" />
                <MiniMap className="!border-border !bg-background" nodeColor="#06b6d4" maskColor="rgba(255, 255, 255, 0.7)" />
              </ReactFlow>
            </div>
          </Card>

          <Card className="flex min-h-[680px] flex-col border-border bg-card shadow-none">
            <CardHeader className="border-b border-border px-4 py-3"><CardTitle className="flex items-center gap-2 text-sm"><PanelRight className="size-4 text-cyan-600" /> Selected Node Details</CardTitle></CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              <div className="flex items-start justify-between gap-3"><div><p className="text-lg font-semibold text-foreground">{selectedNode.data.label}</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{selectedNode.data.type}</p></div><Badge className={cn("border", selectedNode.data.risk === "Critical" || selectedNode.data.risk === "High" ? "border-rose-300/20 bg-rose-300/10 text-rose-700" : selectedNode.data.risk === "Medium" ? "border-amber-300/20 bg-amber-300/10 text-amber-700" : "border-emerald-300/20 bg-emerald-300/10 text-emerald-700")}>{selectedNode.data.risk} risk</Badge></div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Quantum status</span><ShieldCheck className={cn("size-4", selectedNode.data.quantumStatus === "Quantum Safe" ? "text-emerald-600" : "text-amber-600")} /></div><p className="text-sm font-medium text-foreground">{selectedNode.data.quantumStatus}</p></div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs"><Detail label="Technology" value={selectedNode.data.technology} /><Detail label="Version" value={selectedNode.data.version} /><Detail label="Algorithm" value={selectedNode.data.algorithm} /><Detail label="Discovery" value={selectedNode.data.discovery} /><Detail label="Application" value={selectedNode.data.application} /><Detail label="Sensitivity" value={selectedNode.data.sensitivity} /></div>
              <Separator className="bg-border" />
              <DetailList icon={GitBranch} label="Dependencies" values={selectedNode.data.dependencies} />
              <DetailList icon={ArrowUpRight} label="Used By" values={selectedNode.data.usedBy} />
              <DetailList icon={Database} label="Data Protected" values={selectedNode.data.dataProtected} />
              <div className="mt-auto rounded-lg border border-border bg-muted/30 p-3"><p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Source / Provenance</p><p className="mt-2 text-[11px] leading-5 text-foreground">{selectedNode.data.source}</p></div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex-row items-center justify-between border-b border-border px-4 py-3"><CardTitle className="flex items-center gap-2 text-sm"><Filter className="size-4 text-cyan-600" /> Graph Filters</CardTitle><Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[10px] text-muted-foreground hover:text-foreground" onClick={clearFilters}><X className="size-3" /> Clear filters</Button></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7"><FilterSelect label="Quantum posture" value={filters.quantum} options={filterOptions.quantum} onChange={(value) => updateFilter("quantum", value)} /><FilterSelect label="Risk level" value={filters.risk} options={filterOptions.risk} onChange={(value) => updateFilter("risk", value)} /><FilterSelect label="Algorithm" value={filters.algorithm} options={filterOptions.algorithm} onChange={(value) => updateFilter("algorithm", value)} /><FilterSelect label="Component type" value={filters.type} options={filterOptions.type} onChange={(value) => updateFilter("type", value)} /><FilterSelect label="Application" value={filters.application} options={filterOptions.application} onChange={(value) => updateFilter("application", value)} /><FilterSelect label="Data sensitivity" value={filters.sensitivity} options={filterOptions.sensitivity} onChange={(value) => updateFilter("sensitivity", value)} /><FilterSelect label="Discovery source" value={filters.discovery} options={filterOptions.discovery} onChange={(value) => updateFilter("discovery", value)} /></CardContent>
        </Card>
      </div>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-1 leading-4 text-foreground">{value}</p></div>
}

function DetailList({ icon: Icon, label, values }: { icon: React.ElementType; label: string; values: string[] }) {
  return <div><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><Icon className="size-3.5 text-cyan-600" />{label}</div><div className="flex flex-wrap gap-1.5">{values.map((value) => <Badge key={value} variant="outline" className="border-border bg-muted/30 text-[10px] font-normal text-foreground">{value}</Badge>)}</div></div>
}