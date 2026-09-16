"use client"

import * as React from "react"
import { 
  Shield, Download, FileJson, GitCommit, SearchCheck, 
  Layers, ExternalLink, Search, Network, FileText, ChevronRight, Check
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
import { ReactFlow, Background, Controls } from "@xyflow/react"
import { useGlobalData } from "@/app/context/GlobalDataContext"
import {seedCBOM} from "../seedData/cbom"
import {initialNodes , initialEdges,baseNodeStyle} from "../seedData/node"
import {ExecutiveSummary} from "../cbom/ExecutiveSummary"
import {Property, AlgorithmProperties , CryptoProperties,CBOMComponent} from "./CbomInterfaces"

// @ts-expect-error
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
        <TabsContent value="explorer" className="flex-1 mt-0 outline-none">
          <Card className="border-primary/20 bg-background/50 backdrop-blur h-full flex flex-col min-h-[500px]">
            <CardHeader className="pb-3 border-b shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm font-semibold">Cryptographic Asset Inventory</CardTitle>
                  <CardDescription className="text-xs">Tree viewer of discovered protocols, keys, and certificates.</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search CBOM..." className="pl-9 w-64 h-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex overflow-hidden">
            <div className="flex-1 p-4 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Algorithm</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {components.map((component: CBOMComponent) => {
                    const properties = Object.fromEntries(
                      (component.properties ?? []).map(
                        ({ name, value }) => [name, value]
                      )
                    );

                    const algorithm =
                      component.cryptoProperties
                        ?.algorithmProperties
                        ?.parameterSetIdentifier ??
                      component.name;

                    const type =
                      component.cryptoProperties
                        ?.algorithmProperties
                        ?.primitive ??
                      component.cryptoProperties?.assetType ??
                      component.type;

                    const status =
                      properties["quantum.status"] ??
                      properties["security.status"] ??
                      "unknown";

                    const priority =
                      properties["migration.priority"] ??
                      "—";

                    return (
                      <TableRow key={component["bom-ref"]}>

                        <TableCell className="font-medium">
                          {component.name}

                          {component.version && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              v{component.version}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {type}
                        </TableCell>

                        <TableCell className="font-mono text-xs">
                          {algorithm}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              status === "vulnerable" ||
                              status === "legacy"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              priority === "critical"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {priority}
                          </Badge>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
