// OOP: Encapsulation — This page encapsulates service listing and dynamic risk display logic.
// OOP: Composition — Composes badges, sparklines, and table rows into a service risk dashboard.

"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Server, Search, Activity, Clock, Loader2, ChevronLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

import { useGlobalData } from "@/app/context/GlobalDataContext"

function getRiskColor(score: number) {
  if (score >= 75) return "text-destructive"
  if (score >= 40) return "text-amber-500"
  return "text-emerald-500"
}

function getRiskBg(score: number) {
  if (score >= 75) return "bg-destructive/20"
  if (score >= 40) return "bg-amber-500/20"
  return "bg-emerald-500/20"
}

function Sparkline({ data, score }: { data: number[], score: number }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 100);
  const min = 0;
  const range = max - min;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 100}`).join(" ");

  const strokeColor = score >= 75 ? "stroke-destructive" : score >= 40 ? "stroke-amber-500" : "stroke-emerald-500";

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-8 overflow-visible" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        strokeWidth="12"
        className={`${strokeColor} transition-all duration-500`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ServicesPage() {
  const { data: globalData } = useGlobalData()
  const [pagedServices, setPagedServices] = React.useState<any[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTarget, setSelectedTarget] = React.useState("all")

  const fetchServices = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const resp = await fetch(`/api/global-data?type=services&page=${currentPage}&limit=10&targetId=${selectedTarget}`)
      if (resp.ok) {
        const result = await resp.json()
        setPagedServices(result.data)
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
    fetchServices()
  }, [fetchServices])

  // Reset to page 1 when target changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedTarget])

  const selectedTargetName = React.useMemo(() => {
    if (selectedTarget === "all") return "Global Inventory";
    const target = globalData.targets.find(t => String(t._id || t.id) === selectedTarget);
    return target ? (target.organizationName || target.name) : "Target";
  }, [selectedTarget, globalData.targets]);

  React.useEffect(() => {
    document.title = `Services - ${selectedTargetName} | Qshield Dashboard`;
  }, [selectedTargetName]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Gracefully map the MongoDB data schema back into the robust UI mock schema
  const processedServices = React.useMemo(() => {
    return pagedServices.map(s => ({
      ...s,
      id: s._id || s.id || Math.random().toString(),
      name: s.name || 'Unknown',
      type: s.type || 'Service',
      version: s.version || 'unknown',
      riskScore: s.riskScore || 20,
      trendData: s.trendData || [20, 20, 20, 20, 20],
      lastSeen: s.lastSeen || 'Recently',
      assets: s.assets || []
    }))
  }, [pagedServices])

  const filteredServices = React.useMemo(() => {
    return processedServices.filter(
      (s) => {
        const matchesTarget = selectedTarget === "all" || s.targetId === selectedTarget
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.version.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTarget && matchesSearch
      }
    )
  }, [processedServices, searchQuery, selectedTarget])

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Services Inventory {selectedTarget !== "all" && <span className="text-primary/60">— {selectedTargetName}</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-balance">
            {selectedTarget === "all"
              ? "Analyze risk scores, active trends, and discover dependencies per service."
              : `Service risk and trend analysis for ${selectedTargetName}.`}
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
              placeholder="Search services..."
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
              <TableHead>Service Name</TableHead>
              <TableHead>Aggregate Risk</TableHead>
              <TableHead>Risk Trend</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="text-right">Assets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing service exposure risk...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No services found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <React.Fragment key={service.id}>
                  {/* Main Row */}
                  <TableRow
                    className="cursor-pointer group hover:bg-muted/50 transition-colors"
                    onClick={() => toggleRow(service.id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-6 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        {expandedRows[service.id] ? (
                          <ChevronDown className="size-4 transition-transform" />
                        ) : (
                          <ChevronRight className="size-4 transition-transform" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{service.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{service.type} • {service.version}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold tabular-nums ${getRiskColor(service.riskScore)}`}>
                          {service.riskScore}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${getRiskBg(service.riskScore).replace('/20', '')}`}
                            style={{ width: `${service.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Sparkline data={service.trendData} score={service.riskScore} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="size-3" />
                        {service.lastSeen}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="px-2 py-0.5 pointer-events-none bg-background">
                        {service.assets.length} Assets
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Content Row */}
                  {expandedRows[service.id] && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20 border-b-0">
                      <TableCell colSpan={6} className="p-0 border-b-0">
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200 p-4 pl-[74px]">
                          <div className="rounded-lg border bg-background overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/30 text-muted-foreground text-xs uppercase">
                                <tr>
                                  <th className="px-4 py-3 font-medium text-left w-1/4">Asset ID</th>
                                  <th className="px-4 py-3 font-medium text-left w-1/4">Network IP</th>
                                  <th className="px-4 py-3 font-medium text-left w-1/4">Asset Hostname</th>
                                  <th className="px-4 py-3 font-medium text-right w-1/4">Individual Risk</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {service.assets.map((asset: any) => (
                                  <tr key={asset.id} className="hover:bg-muted/60 transition-colors">
                                    <td className="px-4 py-3">
                                      <Link href={`/assets/${asset.id}`} className="font-mono text-xs text-primary hover:underline font-medium flex items-center gap-2">
                                        <Server className="size-3 text-muted-foreground" />
                                        {asset.id}
                                      </Link>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">{asset.ip}</td>
                                    <td className="px-4 py-3 font-medium text-foreground/80">{asset.name}</td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <div className={`h-1.5 w-8 overflow-hidden rounded-full bg-secondary hidden sm:flex`}>
                                          <div
                                            className={`h-full rounded-full ${getRiskBg(asset.assetRisk).replace('/20', '')}`}
                                            style={{ width: `${asset.assetRisk}%` }}
                                          />
                                        </div>
                                        <span className={`font-bold tabular-nums text-xs ${getRiskColor(asset.assetRisk)}`}>
                                          {asset.assetRisk}
                                        </span>
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
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-bold text-foreground">{totalCount}</span> services
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
