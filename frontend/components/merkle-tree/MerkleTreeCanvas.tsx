"use client"

import * as React from "react"
import { ReactFlow, Background, Controls, MiniMap, NodeTypes, EdgeTypes, SmoothStepEdge } from "reactflow"
import "./reactflow-custom.css"
import { CustomMerkleNode } from "./CustomMerkleNode"
import { initialNodes, initialEdges } from "./merkleGraphData"
import { getLayoutedElements } from "./dagreLayout"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const nodeTypes: NodeTypes = {
  merkleNode: CustomMerkleNode,
}

const edgeTypes: EdgeTypes = {
  smoothstep: SmoothStepEdge,
}

export function MerkleTreeCanvas({ className }: { className?: string }) {
  const [nodes, setNodes] = React.useState(initialNodes)
  const [edges, setEdges] = React.useState(initialEdges)
  const [isLayouted, setIsLayouted] = React.useState(false)

  // Apply Dagre layout on mount
  React.useEffect(() => {
    if (!isLayouted) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, "TB")
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
      setIsLayouted(true)
    }
  }, [isLayouted])

  const onNodesChange = React.useCallback((changes: any[]) => {
    setNodes((nds) => {
      // We don't want to allow dragging to change positions permanently in this case
      // but we'll still allow selection
      return nds
    })
  }, [])

  const onEdgesChange = React.useCallback((changes: any[]) => {
    setEdges((eds) => eds)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full h-[600px] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-slate-950", className)}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={true}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          gap={16} 
          size={1} 
          className="dark:opacity-20"
        />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data.type === "root") return "#6366f1"
            if (node.data.type === "branch") return "#3b82f6"
            if (node.data.type === "leaf") return "#22c55e"
            return "#64748b"
          }}
          maskColor="rgba(0,0,0,0.1)"
        />
      </ReactFlow>
    </motion.div>
  )
}