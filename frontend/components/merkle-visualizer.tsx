"use client"

import * as React from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TreeNode, treeNodes, leafNodes, merkleMetadata, blockchainProof, verificationSteps, computedRootHash, onChainRootHash } from "@/constants/merkleData"
import { motion, AnimatePresence } from "framer-motion"
import { CopyIcon, SearchIcon, ShieldCheck, Info } from "lucide-react"

interface MerkleNodeProps {
  node: TreeNode
  depth: number
  isHovered: boolean
  onHoverChange: (hovered: boolean) => void
}

const LEAF_COLORS = {
  "RSA-2048": "bg-red-500/20 text-red-400 border-red-500",
  "RSA-4096": "bg-orange-500/20 text-orange-400 border-orange-500",
  "ECDSA P-256": "bg-purple-500/20 text-purple-400 border-purple-500",
  "ECDSA P-384": "bg-purple-600/20 text-purple-400 border-purple-600",
  "AES-256-GCM": "bg-green-500/20 text-green-400 border-green-500",
  "ChaCha20-Poly1305": "bg-emerald-500/20 text-emerald-400 border-emerald-500",
  "ML-KEM-768": "bg-blue-500/20 text-blue-400 border-blue-500",
  "ML-DSA-65": "bg-indigo-500/20 text-indigo-400 border-indigo-500",
}

const ALGORITHM_COLORS: Record<string, string> = {
  "RSA-2048": "bg-red-500",
  "RSA-4096": "bg-orange-500",
  "ECDSA P-256": "bg-purple-500",
  "ECDSA P-384": "bg-purple-600",
  "AES-256-GCM": "bg-green-500",
  "ChaCha20-Poly1305": "bg-emerald-500",
  "ML-KEM-768": "bg-blue-500",
  "ML-DSA-65": "bg-indigo-500",
}

export function MerkleVisualizer({ onNodeHover }: { onNodeHover: (node: TreeNode) => void }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Merkle Tree Visualizer</h3>
        <Tabs defaultValue="tree" className="h-10">
          <TabsList className="h-full">
            <TabsTrigger value="tree" className="h-full px-4">Tree View</TabsTrigger>
            <TabsTrigger value="list" className="h-full px-4">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="tree" className="pt-2">
            <MerkleTreeDiagram nodes={[treeNodes]} onNodeHover={onNodeHover} />
          </TabsContent>
          <TabsContent value="list" className="pt-2">
            <MerkleListView nodes={leafNodes} onNodeHover={onNodeHover} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}

function MerkleTreeDiagram({ nodes, onNodeHover }: { nodes: TreeNode[]; onNodeHover: (node: TreeNode) => void }) {
  const root = nodes[0]

  return (
    <div className="space-y-6" style={{ opacity: 0, transition: "opacity 0.5s ease" }}>
      {nodes.map((node) => renderNode(node, onNodeHover))}
    </div>
  )
}

function renderNode(node: TreeNode, onNodeHover: (node: TreeNode) => void, depth: number = 0) {
  const isLeaf = node.type === "leaf"
  const algorithm = node.finding?.algorithm || ""
  const leafClass = (LEAF_COLORS as Record<string, string>)[algorithm] || "bg-gray-600/20 text-gray-400 border-gray-500"

  // Calculate vertical position based on depth
  const verticalOffset = depth * 40

  // Calculate horizontal position based on position in tree
  const positionFactor = isLeaf ? 0 : -0.3

  return (
    <div
      key={node.id}
      style={{
        position: "relative",
        marginBottom: depth > 0 ? "20px" : "0",
        opacity: isLeaf && depth === 0 ? 0 : 1,
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Connection lines */}
      {depth > 0 && (
        <div
          style={{
            position: "absolute",
            left: isLeaf ? "50%" : "0",
            top: -8,
            width: isLeaf ? "2px" : "50%",
            height: "8px",
            background: "border-border",
            transform: `translateX(${isLeaf ? "-50%" : "0"})`,
          }}
        />
      )}

      {/* Node box */}
      <div
        style={{
          width: isLeaf ? "80px" : "120px",
          height: isLeaf ? "32px" : "40px",
          borderRadius: isLeaf ? "6px" : "8px",
          background: isLeaf
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.03)",
          border: isLeaf ? "1px solid" : "1px solid",
          borderColor: isLeaf ? "border-border" : "border-border",
          color: isLeaf ? "text-gray-300" : "text-gray-400",
          backdropFilter: "blur(10px)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          ...(isLeaf
            ? {
                margin: `0 auto ${depth > 0 ? "20px" : "0"}`,
              }
            : {
                margin: "0 auto",
              }),
          display: "flex",
          alignItems: "center",
          justifyContent: isLeaf ? "center" : "space-between",
        }}
      >
        <span className={leafClass} font-medium>
          {node.label}
        </span>
        {!isLeaf && (
          <span className="text-xs text-gray-500">
            {node.hash.substring(0, 16)}...
          </span>
        )}
      </div>

      {/* Finding tooltip for leaf nodes */}
      {isLeaf && node.finding && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 rounded-md hover:bg-border focus:outline-none focus:ring-2 focus:ring-border"
              onClick={(e) => {
                e.stopPropagation()
                onNodeHover(node)
              }}
            >
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs px-3 py-2 text-sm text-gray-800 bg-white border border-border rounded-md shadow-sm"
          >
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "rgba(239, 68, 68, 0.8)" }} />
              <span className="font-medium">Finding: {node.finding?.name}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Severity: {node.finding?.severity}
              </span>
              <span className="text-xs text-gray-500">
                File: {node.finding?.file}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Recursively render children */}
      {node.children && node.children.length > 0 && (
        <div
          style={{
            paddingLeft: "20px",
            marginTop: "12px",
            borderLeft: "1px solid border-border",
          }}
        >
          {node.children.map((child) => renderNode(child, onNodeHover, depth + 1))}
        </div>
      )}
    </div>
  )
}

function MerkleListView({ nodes, onNodeHover }: { nodes: TreeNode[]; onNodeHover: (node: TreeNode) => void }) {
  return (
    <div className="space-y-4">
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            border: "1px solid border-border",
            transition: "all 0.2s ease",
          }}
        >
          <span className="font-medium text-sm">
            {node.label}: {node.hash.substring(0, 12)}...
          </span>
          <span className="text-xs text-gray-500">
            {node.finding?.severity}
          </span>
        </div>
      ))}
    </div>
  )
}