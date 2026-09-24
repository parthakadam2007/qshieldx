// OOP: Encapsulation — This page encapsulates asset list rendering and search/filter logic.
// OOP: Composition — Composes table components, badges, and buttons into a cohesive asset management UI.

"use client"

import * as React from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useGlobalData } from "@/app/context/GlobalDataContext"
import { DEMO_CRYPTO_ASSET_COUNT } from "@/lib/demo-metrics"

export default function AssetsPage() {
  const { data: globalData, isDemoMode } = useGlobalData();
  const [pagedAssets, setPagedAssets] = React.useState<any[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedTarget, setSelectedTarget] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchAssets = React.useCallback(async () => {
    setIsLoading(true)
    if (isDemoMode) {
      const source = selectedTarget === "all"
        ? globalData.assets
        : globalData.assets.filter((asset) => String(asset.targetId || globalData.targets[0]?.id) === selectedTarget)
      const start = (currentPage - 1) * 10
      setPagedAssets(source.slice(start, start + 10))
      setTotalCount(selectedTarget === "all" ? globalData.scan?.assetCount || DEMO_CRYPTO_ASSET_COUNT : source.length)
      setTotalPages(Math.ceil((selectedTarget === "all" ? globalData.scan?.assetCount || DEMO_CRYPTO_ASSET_COUNT : source.length) / 10))
      setIsLoading(false)
      return
    }
    try {
      const resp = await fetch(`/api/global-data?type=assets&page=${currentPage}&limit=10&targetId=${selectedTarget}`)
      if (resp.ok) {
        const result = await resp.json()
        setPagedAssets(result.data)
        setTotalPages(result.totalPages)
        setTotalCount(result.total)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, selectedTarget, isDemoMode, globalData])

  React.useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  // Reset to page 1 when target changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedTarget])

  const selectedTargetName = React.useMemo(() => {
    if (selectedTarget === "all") return "Global View";
    const target = globalData.targets.find(t => String(t._id || t.id) === selectedTarget);
    return target ? (target.organizationName || target.name) : "Target";
  }, [selectedTarget, globalData.targets]);

  React.useEffect(() => {
    document.title = `Assets - ${selectedTargetName} | Qshield Dashboard`;
  }, [selectedTargetName]);

  const filteredAssets = React.useMemo(() => {
    if (!searchQuery) return pagedAssets;
    return pagedAssets.filter((a) => {
      return (a.name || a.deviceName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.type || "").toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [pagedAssets, searchQuery])

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Assets Inventory {selectedTarget !== "all" && <span className="text-primary/60">— {selectedTargetName}</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-balance">
            {selectedTarget === "all"
              ? "A comprehensive list of all discovered external and internal assets."
              : `Discovered attack surface for ${selectedTargetName}.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
              placeholder="Search assets..."
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
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Scanned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading assets...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No assets found matching the current filtering bounds.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset._id || asset.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{asset.name || asset.deviceName || asset.subdomain}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase bg-muted/50">
                      {asset.type || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {asset.lastScanned ? new Date(asset.lastScanned).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[10px] h-5"
                      variant={
                        (asset.status || 'Active') === "Active"
                          ? "default"
                          : asset.status === "Inactive"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {asset.status || 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/assets/${asset._id || asset.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2 border border-muted shadow-sm"
                    >
                      View Details
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4 border-t bg-card/50 rounded-b-md">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-bold text-foreground">{totalCount}</span> assets
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
            <div className="flex items-center gap-1 mx-2 overflow-x-auto max-w-[200px] sm:max-w-[400px] py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 text-xs font-bold p-0 shrink-0"
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
