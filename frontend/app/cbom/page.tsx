"use client"

import * as React from "react"
import {
  Activity,
  AlertCircle,
  Binary,
  BrainCircuit,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDot,
  Check,
  Clock,
  Cpu,
  Database,
  Download,
  Eye,
  FileJson,
  FileText,
  Gauge,
  GitBranch,
  GitCommit,
  KeyRound,
  Layers,
  LockKeyhole,
  Network,
  Radio,
  Radar,
  ScanSearch,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Timer,
  TrendingUp,
  Workflow,
  X,
  Zap,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReactFlow, Background, Controls ,MiniMap } from "@xyflow/react"
import { useGlobalData } from "@/app/context/GlobalDataContext"
import {seedCBOM} from "../seedData/cbom"
import {initialNodes , initialEdges,baseNodeStyle} from "../seedData/node"
import {ExecutiveSummary} from "../cbom/ExecutiveSummary"
import {Property, AlgorithmProperties , CryptoProperties,CBOMComponent} from "./CbomInterfaces"

import "@xyflow/react/dist/style.css"






export default function CBOMPage() {
  const [reports, setReports] = React.useState<any[]>([])
  const [selectedReport, setSelectedReport] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const { isDemoMode, data } = useGlobalData()
  const supabase = createClient();
  const components: CBOMComponent[] =
  selectedReport?.report_json?.components ??
  seedCBOM?.components ??
  [];

  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [priorityFilter, setPriorityFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [algorithmFilter, setAlgorithmFilter] = React.useState("all")

  const [explorerView, setExplorerView] =
    React.useState<"table" | "graph">("table")

    
 

  React.useEffect(() => {
    document.title = "Reports Center | QShieldX"
    
    async function fetchReports() {
      if (isDemoMode && data.cbom) {
        const demoReport = { id: data.scan.id, created_at: data.scan.completed, scan_jobs: { target_domain: data.scan.primaryDomain }, report_json: data.cbom, executive_summary: "mypay Software Pvt. Ltd. has 148 cryptographic assets across its enterprise payment platform. The scan identified 61 quantum-vulnerable components, 36 certificates, and 9 exposed secrets. Wave 1 should prioritize public payment and identity endpoints with hybrid ML-KEM and ML-DSA transitions." }
        setReports([demoReport])
        setSelectedReport(demoReport)
        setIsLoading(false)
        return
      }
      const { data: reportsData, error } = await supabase
        .from('cbom_reports')
        .select(`*, scan_jobs ( target_domain )`)
        .order('created_at', { ascending: false })
      
      if (!error && reportsData) {
        setReports(reportsData)
        if (reportsData.length > 0) {
          setSelectedReport(reportsData[0]) 
        }
      }
      setIsLoading(false)
    }

    fetchReports()
  }, [isDemoMode, data])

  const handleDownload = (format: string) => {
    if (!selectedReport?.report_json) return;
    let content = "";
    let mime = "";
    let ext = format.toLowerCase();
    
    if (format === 'JSON') {
      content = JSON.stringify(selectedReport.report_json, null, 2);
      mime = "application/json";
    } else if (format === 'CSV') {
      content = "Asset,Type,Algorithm,Vulnerability\napi.mypay.com,Certificate,RSA-2048,Critical";
      mime = "text/csv";
    } else {
      content = `# CBOM Report\n\nGenerated for ${selectedReport.scan_jobs?.target_domain}\n`;
      mime = "text/plain";
    }
    
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cbom-${selectedReport.scan_jobs?.target_domain || selectedReport.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (selectedReport?.report_json) {
      navigator.clipboard.writeText(JSON.stringify(selectedReport.report_json, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

const filteredComponents = React.useMemo(() => {
  return components.filter((component: CBOMComponent) => {

    const properties = Object.fromEntries(
      (component.properties ?? []).map(
        ({ name, value }) => [name, value]
      )
    )

    const algorithm =
      component.cryptoProperties
        ?.algorithmProperties
        ?.parameterSetIdentifier ??
      component.name

    const type =
      component.cryptoProperties
        ?.algorithmProperties
        ?.primitive ??
      component.cryptoProperties?.assetType ??
      component.type

    const status =
      properties["quantum.status"] ??
      properties["security.status"] ??
      "unknown"

    const priority =
      properties["migration.priority"] ??
      "—"


    /* Search */

    const search = searchQuery.toLowerCase()

    const matchesSearch =
      !search ||
      component.name
        ?.toLowerCase()
        .includes(search) ||
      algorithm
        ?.toLowerCase()
        .includes(search) ||
      type
        ?.toLowerCase()
        .includes(search)


    /* Status */

    const matchesStatus =
      statusFilter === "all" ||
      status.toLowerCase() ===
        statusFilter.toLowerCase()


    /* Priority */

    const matchesPriority =
      priorityFilter === "all" ||
      priority.toLowerCase() ===
        priorityFilter.toLowerCase()


    /* Type */

    const normalizedType =
      type.toLowerCase()

    const matchesType =
      typeFilter === "all" ||
      normalizedType.includes(
        typeFilter.toLowerCase()
      )


    /* Algorithm */

    const matchesAlgorithm =
      algorithmFilter === "all" ||
      algorithm
        .toLowerCase()
        .includes(
          algorithmFilter.toLowerCase()
        )


    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesType &&
      matchesAlgorithm
    )
  })
}, [
  components,
  searchQuery,
  statusFilter,
  priorityFilter,
  typeFilter,
  algorithmFilter,
])


const activeFilterCount =
  Number(statusFilter !== "all") +
  Number(priorityFilter !== "all") +
  Number(typeFilter !== "all") +
  Number(algorithmFilter !== "all") +
  Number(searchQuery.trim() !== "")

  const graphNodes = React.useMemo(() => {

  const centerX = 500
  const centerY = 300

  return filteredComponents.map(
    (component: CBOMComponent, index: number) => {

      const properties = Object.fromEntries(
        (component.properties ?? []).map(
          ({ name, value }) => [name, value]
        )
      )

      const status =
        properties["quantum.status"] ??
        properties["security.status"] ??
        "unknown"

      const algorithm =
        component.cryptoProperties
          ?.algorithmProperties
          ?.parameterSetIdentifier ??
        component.name

      const statusColor =
        status === "vulnerable"
          ? "#ef4444"
          : status === "legacy"
            ? "#f59e0b"
            : status === "quantum-resistant"
              ? "#22c55e"
              : "#8b5cf6"


      const angle =
        (index / Math.max(filteredComponents.length, 1)) *
        Math.PI *
        2

      const radius =
        filteredComponents.length > 8
          ? 260
          : 190


      return {
        id: component["bom-ref"],

        position: {
          x:
            centerX +
            Math.cos(angle) * radius,
          y:
            centerY +
            Math.sin(angle) * radius,
        },

        data: {
          label: (
            <div className="min-w-[150px]">

              <div className="flex items-center gap-2">

                <div
                  className="size-2.5 rounded-full"
                  style={{
                    background: statusColor,
                  }}
                />

                <span className="truncate text-xs font-semibold">
                  {component.name}
                </span>

              </div>

              <div className="mt-1 text-[10px] text-muted-foreground">
                {algorithm}
              </div>

            </div>
          ),
        },

        style: {
          width: 190,
          padding: "10px 12px",
          borderRadius: 12,
          border: `1px solid ${statusColor}55`,
          background: "hsl(var(--card))",
          boxShadow: `0 0 20px ${statusColor}18`,
        },
      }
    }
  )

}, [filteredComponents])

const graphEdges = React.useMemo(() => {

  const edges = []

  for (let i = 1; i < filteredComponents.length; i++) {

    edges.push({
      id: `edge-${i}`,
      source: filteredComponents[0]["bom-ref"],
      target: filteredComponents[i]["bom-ref"],
      animated: true,
      style: {
        strokeWidth: 1.5,
        opacity: 0.45,
      },
    })

  }

  return edges

}, [filteredComponents])

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <FileJson className="size-6 text-primary" />
            Reports Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise Cryptographic Bill of Materials (CBOM) Explorer and Dependency Analysis.
          </p>
        </div>
        
        {/* Report Selector & Downloads */}
        <div className="flex items-center gap-3 bg-background/50 p-2 rounded-lg border backdrop-blur">
          <select 
            className="h-9 px-3 py-1 text-sm bg-background border rounded-md min-w-[200px]"
            onChange={(e) => {
              const r = reports.find(x => x.id === e.target.value)
              if (r) setSelectedReport(r)
            }}
            value={selectedReport?.id || ""}
          >
            {reports.map(r => (
              <option key={r.id} value={r.id}>
                {r.scan_jobs?.target_domain} ({new Date(r.created_at).toLocaleDateString()})
              </option>
            ))}
            {reports.length === 0 && <option>No reports available</option>}
          </select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={!selectedReport} className="gap-2">
                <Download className="size-4" /> Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload('JSON')}>CBOM JSON (CycloneDX)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('CSV')}>Inventory CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('PDF')}>Executive PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('MD')}>Markdown Summary</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="explorer" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
          <TabsTrigger value="explorer" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 gap-2">
            <Layers className="size-4" /> CBOM Explorer
          </TabsTrigger>
          <TabsTrigger value="graph" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 gap-2">
            <Network className="size-4" /> Dependency Graph
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 gap-2">
            <FileText className="size-4" /> Executive Summary
          </TabsTrigger>
          <TabsTrigger value="raw" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 gap-2">
            <GitCommit className="size-4" /> Raw CBOM JSON
          </TabsTrigger>
        </TabsList>
        
        {/* TAB 1: CBOM Explorer */}
    <TabsContent
  value="explorer"
  className="flex-1 mt-0 outline-none min-h-0"
>
  <Card className="border-primary/20 bg-background/50 backdrop-blur h-full flex flex-col min-h-[500px] overflow-hidden">

    {/* =====================================================
        HEADER
    ===================================================== */}

    <CardHeader className="pb-3 border-b shrink-0">

      <div className="flex flex-col gap-4">

        {/* Title */}

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Binary className="size-4 text-primary" />
              Cryptographic Asset Inventory
            </CardTitle>

            <CardDescription className="text-xs">
              Explore discovered protocols, keys, certificates, and
              cryptographic dependencies.
            </CardDescription>
          </div>

          {/* View Toggle */}

          <div className="flex items-center gap-2">

            <Button
              size="sm"
              variant={explorerView === "table" ? "default" : "outline"}
              className="h-8 gap-2"
              onClick={() => setExplorerView("table")}
            >
              <Database className="size-3.5" />
              Table
            </Button>

            <Button
              size="sm"
              variant={explorerView === "graph" ? "default" : "outline"}
              className="h-8 gap-2"
              onClick={() => setExplorerView("graph")}
            >
              <Network className="size-3.5" />
              Graph
            </Button>

          </div>

        </div>


        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="flex flex-wrap items-center gap-2">

          {/* Search */}

          <div className="relative min-w-[220px] flex-1">

            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search component, algorithm..."
              className="h-9 pl-9"
            />

          </div>


          {/* Status */}

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="h-9 w-[145px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All Status
              </SelectItem>

              <SelectItem value="vulnerable">
                Vulnerable
              </SelectItem>

              <SelectItem value="legacy">
                Legacy
              </SelectItem>

              <SelectItem value="quantum-resistant">
                Quantum Resistant
              </SelectItem>

              <SelectItem value="acceptable">
                Acceptable
              </SelectItem>

              <SelectItem value="unknown">
                Unknown
              </SelectItem>

            </SelectContent>
          </Select>


          {/* Priority */}

          <Select
            value={priorityFilter}
            onValueChange={setPriorityFilter}
          >
            <SelectTrigger className="h-9 w-[135px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All Priority
              </SelectItem>

              <SelectItem value="critical">
                Critical
              </SelectItem>

              <SelectItem value="high">
                High
              </SelectItem>

              <SelectItem value="medium">
                Medium
              </SelectItem>

              <SelectItem value="low">
                Low
              </SelectItem>

            </SelectContent>
          </Select>


          {/* Asset Type */}

          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="h-9 w-[135px]">
              <SelectValue placeholder="Asset Type" />
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

              <SelectItem value="other">
                Other
              </SelectItem>

            </SelectContent>
          </Select>


          {/* Algorithm */}

          <Select
            value={algorithmFilter}
            onValueChange={setAlgorithmFilter}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Algorithm" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All Algorithms
              </SelectItem>

              <SelectItem value="RSA">
                RSA
              </SelectItem>

              <SelectItem value="ECC">
                ECC
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

            </SelectContent>
          </Select>


          {/* Clear */}

          {(searchQuery ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            typeFilter !== "all" ||
            algorithmFilter !== "all") && (

            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 text-muted-foreground"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setPriorityFilter("all")
                setTypeFilter("all")
                setAlgorithmFilter("all")
              }}
            >
              <X className="size-3.5" />
              Clear
            </Button>

          )}

        </div>


        {/* =================================================
            FILTER SUMMARY
        ================================================= */}

        <div className="flex flex-wrap items-center justify-between gap-2">

          <div className="flex items-center gap-2">

            <Badge
              variant="secondary"
              className="gap-1.5"
            >
              <ScanSearch className="size-3" />
              {filteredComponents.length} assets
            </Badge>

            {activeFilterCount > 0 && (

              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary"
              >
                {activeFilterCount} filters active
              </Badge>

            )}

          </div>


          <span className="text-[10px] text-muted-foreground">
            Showing {filteredComponents.length} of {components.length} assets
          </span>

        </div>

      </div>

    </CardHeader>


    {/* =====================================================
        CONTENT
    ===================================================== */}

    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">


      {/* ===================================================
          TABLE VIEW
      =================================================== */}

      {explorerView === "table" && (

        <div className="h-full overflow-auto">

          <Table>

            <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">

              <TableRow>

                <TableHead className="pl-5">
                  Component
                </TableHead>

                <TableHead>
                  Type
                </TableHead>

                <TableHead>
                  Algorithm
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Priority
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {filteredComponents.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    className="h-40 text-center"
                  >

                    <div className="flex flex-col items-center justify-center gap-2">

                      <Search className="size-8 text-muted-foreground/40" />

                      <p className="text-sm font-medium">
                        No assets found
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Try changing your filters or search query.
                      </p>

                    </div>

                  </TableCell>

                </TableRow>

              ) : (

                filteredComponents.map(
                  (component: CBOMComponent) => {

                    const properties = Object.fromEntries(
                      (component.properties ?? []).map(
                        ({ name, value }) => [
                          name,
                          value,
                        ]
                      )
                    )

                    const algorithm =
                      component.cryptoProperties
                        ?.algorithmProperties
                        ?.parameterSetIdentifier ??
                      component.name

                    const primitive =
                      component.cryptoProperties
                        ?.algorithmProperties
                        ?.primitive

                    const type =
                      primitive ??
                      component.cryptoProperties?.assetType ??
                      component.type

                    const status =
                      properties["quantum.status"] ??
                      properties["security.status"] ??
                      "unknown"

                    const priority =
                      properties["migration.priority"] ??
                      "—"


                    return (

                      <TableRow
                        key={component["bom-ref"]}
                        className="group transition-colors hover:bg-primary/5"
                      >

                        {/* Component */}

                        <TableCell className="pl-5">

                          <div className="flex items-center gap-2">

                            <div className="rounded-md bg-primary/10 p-1.5">

                              <Binary className="size-3.5 text-primary" />

                            </div>

                            <div>

                              <p className="font-medium">
                                {component.name}
                              </p>

                              {component.version && (
                                <span className="text-xs text-muted-foreground">
                                  v{component.version}
                                </span>
                              )}

                            </div>

                          </div>

                        </TableCell>


                        {/* Type */}

                        <TableCell>

                          <Badge
                            variant="outline"
                            className="text-[10px]"
                          >
                            {type}
                          </Badge>

                        </TableCell>


                        {/* Algorithm */}

                        <TableCell className="font-mono text-xs">

                          {algorithm}

                        </TableCell>


                        {/* Status */}

                        <TableCell>

                          <Badge
                            variant={
                              status === "vulnerable" ||
                              status === "legacy"
                                ? "destructive"
                                : status === "quantum-resistant"
                                  ? "default"
                                  : "outline"
                            }
                            className={
                              status === "quantum-resistant"
                                ? "bg-emerald-500 hover:bg-emerald-500"
                                : ""
                            }
                          >
                            {status}
                          </Badge>

                        </TableCell>


                        {/* Priority */}

                        <TableCell>

                          <Badge
                            variant={
                              priority === "critical"
                                ? "destructive"
                                : priority === "high"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {priority}
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

      )}


      {/* ===================================================
          GRAPH VIEW
      =================================================== */}

      {explorerView === "graph" && (

        <div className="relative h-full w-full bg-muted/5">

          <div className="absolute left-4 top-4 z-10">

            <Badge
              variant="outline"
              className="gap-2 bg-background/90 backdrop-blur"
            >
              <Network className="size-3.5 text-primary" />

              {filteredComponents.length} nodes

            </Badge>

          </div>


          <ReactFlow
            nodes={graphNodes}
            edges={graphEdges}
            fitView
            fitViewOptions={{
              padding: 0.2,
            }}
            className="bg-background/20"
          >

            <Background
              gap={18}
              size={1}
            />

            <Controls />

            <MiniMap />

          </ReactFlow>

        </div>

      )}

    </CardContent>

  </Card>
</TabsContent>

        {/* TAB 2: Dependency Graph */}
        <TabsContent
          value="graph"
          className="flex-1 mt-0 outline-none h-[500px]"
        >
          <div className="h-full rounded-md border bg-black/5 dark:bg-black/20">
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              fitView
              fitViewOptions={{
                padding: 0.2,
              }}
            >
              <Background gap={12} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        </TabsContent>

        {/* TAB 3: Executive Summary */}
          <TabsContent
        value="summary"
        className="flex-1 mt-0 outline-none overflow-auto"
      >
        <ExecutiveSummary
          selectedReport={selectedReport}
          seedCBOM={seedCBOM}
        />
      </TabsContent>

        {/* TAB 4: Raw CBOM JSON */}
        <TabsContent value="raw" className="flex-1 mt-0 outline-none">
          <div className="border rounded-md bg-black/90 dark:bg-black/50 relative overflow-hidden flex flex-col h-[500px]">
             <div className="flex justify-between items-center p-2 bg-black/40 border-b border-white/10 shrink-0">
               <span className="text-xs font-mono text-muted-foreground ml-2">CycloneDX 1.7 JSON Output</span>
               <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs text-muted-foreground hover:text-white">
                 {copied ? <Check className="size-3 mr-1 text-emerald-500" /> : <FileJson className="size-3 mr-1" />} 
                 {copied ? 'Copied' : 'Copy JSON'}
               </Button>
             </div>
            <pre className="p-4 overflow-auto text-xs font-mono text-green-400 flex-1 custom-scrollbar">
              {selectedReport?.report_json
                ? JSON.stringify(selectedReport.report_json, null, 2)
                : JSON.stringify(seedCBOM, null, 2)}
            </pre>
          </div>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}
