// OOP: Composition — This page composes graph nodes, edges, and controls to visualize network topology as a reusable component graph.
// OOP: Abstraction — The topology view abstracts the complexity of graph state and rendering behind a single page component.

"use client"

import React, { useCallback, useEffect } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Connection,
  Edge,
  Node,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import Link from "next/link"
import { Server, Globe, Lock, Unlock, Database, Activity, ScanLine, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useGlobalData } from "@/app/context/GlobalDataContext"

/* --- Custom Node Types --- */

const AssetNode = ({ data }: { data: any }) => {
  return (
    <div className="relative rounded-lg border-2 border-primary/50 bg-card p-3 w-48 shadow-lg shadow-primary/5">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-primary/10 text-primary">
          <Server className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold font-mono truncate max-w-[120px]">{data.id}</h3>
          <p className="text-[10px] text-muted-foreground truncate">{data.ip}</p>
        </div>
      </div>
      
      <div className="text-xs font-medium text-foreground">{data.name}</div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <Button variant="secondary" size="sm" className="h-6 text-[10px]" asChild>
          <Link href={`/assets/${data.realId}`}>View</Link>
        </Button>
        <Button variant="destructive" size="sm" className="h-6 text-[10px]">Isolate</Button>
      </div>
    </div>
  )
}

const ServiceNode = ({ data }: { data: any }) => {
  const isCritical = data.risk >= 75
  const isWarning = data.risk >= 40 && data.risk < 75

  const ringColor = isCritical ? "ring-destructive/50" : isWarning ? "ring-amber-500/50" : "ring-emerald-500/50"
  const bgColor = isCritical ? "bg-destructive/10 border-destructive/30" : isWarning ? "bg-amber-500/10 border-amber-500/30" : "bg-emerald-500/10 border-emerald-500/30"
  const textColor = isCritical ? "text-destructive" : isWarning ? "text-amber-500" : "text-emerald-500"

  const IconMap: Record<string, any> = {
    HTTP: Globe,
    SSH: Lock,
    Database: Database,
    Unencrypted: Unlock
  }
  const Icon = IconMap[data.type] || Activity

  return (
    <div className={`relative rounded-full border-2 p-2 px-4 shadow-sm backdrop-blur flex items-center gap-2 ring-4 ${ringColor} ${bgColor}`}>
      <Handle type="target" position={Position.Top} className={`!w-2 !h-2 !bg-foreground`} />
      <Handle type="source" position={Position.Bottom} className={`!w-2 !h-2 !bg-foreground`} />
      
      <Icon className={`size-4 ${textColor}`} />
      <div className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>{data.label}</span>
        <span className="text-[9px] text-muted-foreground font-mono">PORT {data.port} / {data.risk} RSK</span>
      </div>
    </div>
  )
}

const nodeTypes = {
  asset: AssetNode,
  service: ServiceNode,
}

// Auto-Position Tree Algorithm
function getAutoLayout(nodes: Node[], edges: Edge[]) {
  const layer0 = nodes.filter(n => n.type === 'asset');
  const layer1 = nodes.filter(n => n.type === 'service');

  let xOffset = 0;
  
  layer0.forEach((asset) => {
    // find children attached to this asset directly
    const childEdges = edges.filter(e => e.source === asset.id);
    const children = layer1.filter(l => childEdges.some(ce => ce.target === l.id));
    
    // Subtree layout width determination
    const subtreeWidth = Math.max(250, children.length * 150);
    const centerX = xOffset + subtreeWidth / 2;

    asset.position = { x: centerX - 100, y: 50 }; // asset node width is ~200px (100 is half)

    children.forEach((child, idx) => {
      // Spread children out symmetrically to their parent
      const startX = centerX - ((children.length - 1) * 150) / 2;
      child.position = { x: startX + idx * 150 - 60, y: 200 }; // 60 is roughly half service node width
    });

    xOffset += subtreeWidth + 80; // Add padding between totally separate subtrees
  });

  return { layoutedNodes: nodes, layoutedEdges: edges };
}

export default function TopologyPage() {
  const { data: dbData } = useGlobalData()
  const [selectedTarget, setSelectedTarget] = React.useState("all")

  // Generate dynamic topology mapping
  const { globalNodes, globalEdges } = React.useMemo(() => {
    // Check if we have a pre-computed topology for the selected target
    // If selectedTarget is 'all', we might want to merge them, but for now let's just use the first one or fall back
    const targetTopology = selectedTarget !== "all" 
      ? dbData.topology.find(t => t.targetId === selectedTarget)
      : dbData.topology[0]; // Just a heuristic for "default" topology

    if (targetTopology && targetTopology.nodes && targetTopology.edges) {
      console.log("Using pre-computed topology for target:", selectedTarget);
      
      const mappedNodes = targetTopology.nodes.map((node: any) => ({
        id: node.id,
        type: node.type || "asset", 
        position: node.position || { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          id: node.id,
          realId: node.id,
          name: node.name || node.label || node.id,
          ip: node.ip || "Unknown IP",
          targetId: String(targetTopology.targetId)
        }
      }));

      const mappedEdges = targetTopology.edges.map((edge: any) => ({
        id: `edge-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        style: { stroke: '#4b5563', strokeWidth: 2 }
      }));

      return { globalNodes: mappedNodes, globalEdges: mappedEdges };
    }

    const rawNodes: Node[] = [];
    const newEdges: Edge[] = [];

    dbData.assets.forEach((asset, index) => {
      const assetId = asset.subdomain || asset.deviceName || asset.name || String(asset._id || asset.id) || `asset-${index}`;
      
      rawNodes.push({
        id: assetId,
        type: "asset",
        position: { x: 0, y: 0 },
        data: {
          id: assetId,
          realId: asset._id || asset.id || assetId,
          name: asset.subdomain || asset.name || "Unknown Asset",
          ip: asset.ip || "Pending...",
          targetId: String(asset.targetId || "all")
        }
      });
    });

    // Map Services -> attach to assets
    dbData.services.forEach((service, index) => {
      const serviceId = `svc-${service.name}-${index}`;
      
      // Try to find if this service is linked to any asset
      let parentId = service.runningOn;
      if (!parentId && service.assets && service.assets.length > 0) {
        parentId = service.assets[0].name || service.assets[0].id;
      }
      
      if (!parentId || !rawNodes.find(n => n.id === parentId)) {
         // If still no parent, we filter by targetId to at least put it near something relevant
         const targetAsset = dbData.assets.find(a => String(a.targetId) === String(service.targetId));
         parentId = targetAsset?.subdomain || targetAsset?.name || rawNodes[0]?.id;
      }

      if (!parentId) return;

      rawNodes.push({
        id: serviceId,
        type: "service",
        position: { x: 0, y: 0 },
        data: {
          label: service.name,
          type: service.name.toUpperCase().includes("HTTP") ? "HTTP" : service.name.toUpperCase().includes("SSH") ? "SSH" : "Database",
          port: service.port || 80,
          risk: service.riskScore || (service.name.toUpperCase().includes("SSH") ? 85 : 25),
          targetId: String(service.targetId || "all")
        }
      });

      newEdges.push({
        id: `edge-${parentId}-${serviceId}`,
        source: parentId,
        target: serviceId,
        type: "smoothstep",
        animated: service.name.toUpperCase().includes("DB"),
        style: { stroke: '#4b5563', strokeWidth: 2 }
      });
    });

    // Map Ports -> attach to assets
    dbData.ports.forEach((port, index) => {
      const portId = `port-${port.port}-${index}`;
      const parentId = dbData.assets[index % (dbData.assets.length || 1)]?.deviceName || `asset-0`;
      
      const parentNode = rawNodes.find(n => n.id === parentId);
      if (!parentNode) return;

      rawNodes.push({
        id: portId,
        type: "service",
        position: { x: 0, y: 0 }, // overwritten
        data: {
          label: port.service || `Port ${port.port}`,
          type: port.service === "https" ? "HTTP" : "Unencrypted",
          port: port.port,
          risk: port.state === "open" ? 50 : 10,
          targetId: parentNode.data.targetId
        }
      });

      newEdges.push({
        id: `edge-${parentId}-${portId}`,
        source: parentId,
        target: portId,
        type: "straight",
        style: { strokeDasharray: '4', stroke: '#9ca3af' }
      });
    });

    // Apply strict Auto tree layout here
    const { layoutedNodes, layoutedEdges } = getAutoLayout(rawNodes, newEdges);
    
    return { globalNodes: layoutedNodes, globalEdges: layoutedEdges };
  }, [dbData.assets, dbData.services, dbData.ports, dbData.topology, selectedTarget]);


  const targetNodes = React.useMemo(() => {
    return globalNodes.filter((n: Node<any>) => selectedTarget === "all" || n.data?.targetId === selectedTarget)
  }, [selectedTarget, globalNodes])

  const targetEdges = React.useMemo(() => {
    const nodeIds = new Set(targetNodes.map((n: Node<any>) => n.id))
    return globalEdges.filter((e: Edge) => nodeIds.has(e.source) && nodeIds.has(e.target))
  }, [targetNodes, selectedTarget, globalEdges])

  const [nodes, setNodes, onNodesChange] = useNodesState(targetNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(targetEdges)

  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  React.useEffect(() => {
    setNodes(targetNodes)
    setEdges(targetEdges)
  }, [targetNodes, targetEdges, setNodes, setEdges])

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 shrink-0 z-10 relative px-4 md:px-8 top-4 md:top-8 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-semibold tracking-tight">Network Topology</h1>
          <p className="text-sm text-muted-foreground mt-1 bg-background/80 backdrop-blur rounded px-1 py-0.5 inline-block">
            Live mapped infrastructure dependencies auto-organized as a tree.
          </p>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <select 
            className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none"
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
          >
            <option value="all">Global View (All Targets)</option>
            {dbData.targets.map((t: any) => (
              <option key={t._id || t.id} value={t._id || t.id}>{t.organizationName || t.name}</option>
            ))}
          </select>
          <Button variant="outline" className="gap-2 h-9">
            <ScanLine className="size-4" /> Rescan Network
          </Button>
          <Button className="gap-2 h-9" asChild>
            <Link href="/assets">
              List View <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full border rounded-xl overflow-hidden bg-dot-black/[0.2] dark:bg-dot-white/[0.2] relative">
        <div className="absolute top-4 left-4 z-10 flex gap-4 bg-background/80 backdrop-blur border rounded-md p-2 px-4 shadow-sm text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-destructive/80 ring-2 ring-destructive/30" /> High Risk
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-amber-500/80 ring-2 ring-amber-500/30" /> Elevated
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-emerald-500/80 ring-2 ring-emerald-500/30" /> Secure
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          className="bg-muted/10"
        >
          <Controls />
          <MiniMap 
            zoomable 
            pannable 
            nodeColor={(node) => {
              if (node.type === 'asset') return 'hsl(var(--primary))'
              if (node.type === 'service') {
                const risk = Number((node.data as { risk?: number } | undefined)?.risk ?? 0)
                if (risk >= 75) return '#ef4444'
                if (risk >= 40) return '#f59e0b'
                return '#10b981'
              }
              return 'hsl(var(--muted))'
            }} 
            className="rounded-lg shadow-sm border bg-background"
          />
          <Background gap={24} size={2} color="#888" className="opacity-20" />
        </ReactFlow>
      </div>
    </div>
  )
}
