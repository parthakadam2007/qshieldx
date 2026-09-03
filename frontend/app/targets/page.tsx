"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, Search, Plus, Activity, Play, Pause, Server, Globe, Trash2, ChevronDown, ChevronUp, ChevronsUpDown, Eye, FileJson } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useGlobalData } from "@/app/context/GlobalDataContext"

export default function TargetsPage() {
  const router = useRouter()
  const { data, refreshData } = useGlobalData()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    document.title = "Monitored Targets | QShieldX Dashboard";
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this target? All associated scan data will be permanently deleted.")) {
      return;
    }

    setIsDeleting(id);
    try {
      const resp = await fetch(`/api/targets/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        await refreshData();
      } else {
        alert("Failed to delete target.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(null);
    }
  };

  type TargetRow = {
    id?: string;
    _id?: string;
    name?: string;
    organizationName?: string;
    primaryDomain?: string;
    domain?: string;
    ipRange?: string;
    repositoryUrl?: string;
    status?: string;
    assets?: number;
    vulnerabilities?: any[];
    lastCompleted?: string;
    scanMode?: string;
    qars?: number;
    quantumStatus?: string;
  };

  const columns: ColumnDef<TargetRow>[] = [
    {
      accessorKey: "organization",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-8"
          >
            Organization Details
            {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 size-4" /> : <ChevronsUpDown className="ml-2 size-4" />}
          </Button>
        )
      },
      cell: ({ row }) => {
        const target = row.original
        return (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-md shrink-0">
              <Building2 className="size-4 text-primary" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold truncate max-w-[200px]" title={target.organizationName || target.name}>{target.organizationName || target.name || "Unknown"}</span>
              <span className="text-xs text-muted-foreground font-mono flex items-center gap-1 truncate max-w-[200px]" title={target.primaryDomain || target.domain || target.ipRange}>
                <Globe className="size-3 shrink-0" /> {target.primaryDomain || target.domain || target.ipRange || "No Domain"}
              </span>
            </div>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const target = row.original;
        const searchStr = value.toLowerCase();
        const orgName = (target.organizationName || target.name || "").toLowerCase();
        const domain = (target.primaryDomain || target.domain || target.ipRange || "").toLowerCase();
        return orgName.includes(searchStr) || domain.includes(searchStr);
      },
    },
    {
      accessorKey: "repository",
      header: "Repository",
      cell: ({ row }) => {
        const url = row.original.repositoryUrl || "N/A"
        return <div className="text-xs font-mono text-muted-foreground max-w-[150px] truncate" title={url}>{url}</div>
      },
    },
    {
      accessorKey: "scanMode",
      header: "Scan Mode",
      cell: ({ row }) => {
        const target = row.original
        const isScanning = target.status === "Scanning"
        const isPaused = target.status === "Paused"
        
        return (
          <div className="flex items-center gap-2">
            {isScanning && <Activity className="size-4 text-amber-500 animate-pulse" />}
            {(!isScanning && !isPaused) && <Server className="size-4 text-emerald-500" />}
            {isPaused && <Pause className="size-4 text-muted-foreground" />}
            
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${isScanning ? 'text-amber-500' : (!isScanning && !isPaused) ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {target.scanMode || target.status || 'Active'}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "assetsMapped",
      header: () => <div className="text-center">Assets Mapped</div>,
      cell: ({ row }) => {
        const target = row.original
        const targetId = String(target._id || target.id)
        const realAssetsCount = data.assets.filter(a => String(a.targetId) === targetId).length
        const count = realAssetsCount > 0 ? realAssetsCount : (target.assets || 0)
        
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-muted px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
              {count}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "quantumStatus",
      header: "Quantum Status",
      cell: ({ row }) => {
        const target = row.original
        const hasCritical = target.quantumStatus === "Immediate Migration Required" || (target.vulnerabilities || []).some((v: any) => v.severity === 'critical')
        return (
          <Badge variant={hasCritical ? "destructive" : "outline"} className="text-[10px]">
            {target.quantumStatus || (hasCritical ? "Vulnerable" : "Ready")}
          </Badge>
        )
      }
    },
    {
      accessorKey: "lastScan",
      header: "Last Scan",
      cell: ({ row }) => {
        return <div className="text-[10px] text-muted-foreground">{row.original.lastCompleted || 'Recently'}</div>
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const target = row.original
        const targetId = String(target._id || target.id)
        const isPaused = target.status === "Paused"
        
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="View Target"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/targets/${targetId}`);
              }}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              title={isPaused ? "Resume Scan" : "Pause Scan"}
              onClick={(e) => e.stopPropagation()}
            >
              {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting === targetId}
              title="Delete Target"
              onClick={(e) => handleDelete(e, targetId)}
            >
              <Trash2 className={`size-4 ${isDeleting === targetId ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: data.targets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monitored Targets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your initial target scopes, configure scanning automation, and track onboarding status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search targets..."
              className="w-full bg-background pl-8"
              value={(table.getColumn("organization")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("organization")?.setFilterValue(event.target.value)}
            />
          </div>
          <Button className="gap-2 shrink-0" asChild>
            <Link href="/targets/new">
              <Plus className="size-4" /> Onboard Target
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-background overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/targets/${row.original._id || row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Server className="size-8 text-muted-foreground/30" />
                    <span>No targets found. Add a new target to begin cryptographic discovery.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} targets
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
