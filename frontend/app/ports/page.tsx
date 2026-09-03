// OOP: Encapsulation — This component encapsulates port scanning results, sorting, and filtering.
// OOP: Composition — Composes dropdowns, badges, and tables for port exposure analysis.

"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Server, Search, Activity, ShieldBan, ShieldAlert, LayoutList } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, ChevronLeft } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useGlobalData } from "@/app/context/GlobalDataContext"

function getSeverityBg(score: number) {
  if (score >= 75) return "bg-destructive/20 text-destructive border-destructive/20"
  if (score >= 40) return "bg-amber-500/20 text-amber-500 border-amber-500/20"
  return "bg-emerald-500/20 text-emerald-500 border-emerald-500/20"
}

function getSeverityLabel(score: number) {
  if (score >= 75) return "Critical"
  if (score >= 40) return "Elevated"
  return "Routine"
}

export default function PortsPage() {
  const { data: globalData } = useGlobalData()
  const [pagedPorts, setPagedPorts] = React.useState<any[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTarget, setSelectedTarget] = React.useState("all")

  const fetchPorts = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const resp = await fetch(`/api/global-data?type=ports&page=${currentPage}&limit=10&targetId=${selectedTarget}`)
      if (resp.ok) {
        const result = await resp.json()
        setPagedPorts(result.data)
        setTotalPages(result.totalPages)
        setTotalCount(result.total)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, selectedTarget])

  React.useEffect(() => {
    fetchPorts()
  }, [fetchPorts])

  // Reset to page 1 when target changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedTarget])

  const selectedTargetName = React.useMemo(() => {
    if (selectedTarget === "all") return "Global Infrastructure";
    const target = globalData.targets.find(t => String(t._id || t.id) === selectedTarget);
    return target ? (target.organizationName || target.name) : "Target";
  }, [selectedTarget, globalData.targets]);

  React.useEffect(() => {
    document.title = `Network Ports - ${selectedTargetName} | Qshield Dashboard`;
  }, [selectedTargetName]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const processedPorts = React.useMemo(() => {
    return pagedPorts.map(p => ({
      ...p,
      id: p.id || p._id?.toString() || Math.random().toString(),
      portNumber: p.port || p.portNumber || 0,
      protocol: p.protocol || 'tcp',
      description: p.description || p.service || 'Unknown Protocol',
      severity: p.severity || (p.state === 'open' ? 45 : 10),
      assets: p.assets || []
    }))
  }, [pagedPorts])

  const filteredPorts = React.useMemo(() => {
    return processedPorts.filter(
      (p) => {
        const matchesTarget = selectedTarget === "all" || p.targetId === selectedTarget
        const matchesSearch = p.portNumber.toString().includes(searchQuery) ||
          p.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTarget && matchesSearch
      }
    )
  }, [processedPorts, searchQuery, selectedTarget])

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Network Ports {selectedTarget !== "all" && <span className="text-primary/60">— {selectedTargetName}</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-balance">
            {selectedTarget === "all"
              ? "Analyze global port exposures, service status, and vulnerability vectors."
              : `Port exposure analysis for ${selectedTargetName}.`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none"
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
          >
            <option value="all">Global View (All Targets)</option>
            {globalData.targets.map(t => (
              <option key={t._id || t.id} value={String(t._id || t.id)}>{t.organizationName || t.name}</option>
            ))}
          </select>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ports or descriptions..."
              className="w-full bg-background pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[100px]">Port</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Exposure Risk</TableHead>
              <TableHead className="text-center">Affected Assets</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing port exposures...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPorts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No ports found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPorts.map((portInfo) => (
                <React.Fragment key={portInfo.id}>
                  {/* Main Row */}
                  <TableRow
                    className="cursor-pointer group border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <TableCell onClick={() => toggleRow(portInfo.id)}>
                      <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        {expandedRows[portInfo.id] ? (
                          <ChevronDown className="size-4 transition-transform" />
                        ) : (
                          <ChevronRight className="size-4 transition-transform" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell onClick={() => toggleRow(portInfo.id)}>
                      <span className="font-mono font-bold text-base">{portInfo.portNumber}</span>
                    </TableCell>
                    <TableCell onClick={() => toggleRow(portInfo.id)}>
                      <Badge variant="outline" className="font-mono text-[10px] uppercase">{portInfo.protocol}</Badge>
                    </TableCell>
                    <TableCell onClick={() => toggleRow(portInfo.id)}>
                      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]" title={portInfo.description}>
                        {portInfo.description}
                      </span>
                    </TableCell>
                    <TableCell onClick={() => toggleRow(portInfo.id)}>
                      <Badge variant="outline" className={`font-semibold ${getSeverityBg(portInfo.severity)}`}>
                        {getSeverityLabel(portInfo.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center" onClick={() => toggleRow(portInfo.id)}>
                      <Badge variant="secondary" className="px-2 py-0.5 pointer-events-none font-bold">
                        {portInfo.assets?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            Batch Actions <ChevronDown className="ml-2 size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel className="text-xs">Port {portInfo.portNumber} Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive gap-2 cursor-pointer focus:text-destructive focus:bg-destructive/10">
                            <ShieldBan className="size-4" /> Wait & Block Traffic
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <ShieldAlert className="size-4" /> Alert SOC Team
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <LayoutList className="size-4" /> Export Assets List
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Content Row */}
                  {expandedRows[portInfo.id] && (
                    <TableRow className="bg-muted/10 border-b">
                      <TableCell colSpan={7} className="p-0 border-b-0">
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200 p-4 pl-[74px]">
                          <div className="rounded-lg border bg-background overflow-hidden shadow-sm">
                            <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center text-xs text-muted-foreground font-medium uppercase tracking-wider">
                              <span>Asset Details</span>
                              <span>Total: {(portInfo.assets || []).length}</span>
                            </div>
                            <table className="w-full text-sm">
                              <thead className="bg-muted/20 text-muted-foreground text-xs uppercase">
                                <tr>
                                  <th className="px-4 py-3 font-medium text-left w-1/4">Asset ID</th>
                                  <th className="px-4 py-3 font-medium text-left w-1/4">Network IP</th>
                                  <th className="px-4 py-3 font-medium text-left w-1/4">Hostname</th>
                                  <th className="px-4 py-3 font-medium text-right w-1/4">Last Detected</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y border-t-0">
                                {portInfo.assets?.map((asset: any) => (
                                  <tr key={asset.id} className="hover:bg-muted/40 transition-colors">
                                    <td className="px-4 py-3">
                                      <Link href={`/assets/${asset.id}`} className="font-mono text-xs text-primary hover:underline font-medium flex items-center gap-2">
                                        <Server className="size-3 text-muted-foreground" />
                                        {asset.id}
                                      </Link>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">{asset.ip}</td>
                                    <td className="px-4 py-3 font-medium text-foreground/80">{asset.name}</td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-1.5 text-muted-foreground text-xs">
                                        <Activity className="size-3 text-emerald-500" />
                                        {asset.lastDetected}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4 border-t bg-card/50 rounded-b-md">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-bold text-foreground">{totalCount}</span> ports
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 gap-1.5 text-xs font-bold"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 text-xs font-bold p-0"
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8 gap-1.5 text-xs font-bold"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
