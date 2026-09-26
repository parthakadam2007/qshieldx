"use client"

import * as React from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { motion } from "framer-motion"
import { Hash, Shield, AlertTriangle, CheckCircle2, FileCode, ExternalLink } from "lucide-react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MerkleNodeData {
  label: string
  hash: string
  type: "root" | "branch" | "leaf"
  level: number
  details?: {
    algorithm: string
    severity: "Critical" | "High" | "Medium" | "Low"
    file: string
    description: string
  }
}

export function CustomMerkleNode({ data }: NodeProps<MerkleNodeData>) {
  const { label, hash, type, level, details } = data
  const isRoot = type === "root"
  const isBranch = type === "branch"
  const isLeaf = type === "leaf"

  const truncatedHash = `${hash.substring(0, 16)}...${hash.substring(hash.length - 12)}`

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500/20 text-red-400 border-red-500 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/50"
      case "High": return "bg-orange-500/20 text-orange-400 border-orange-500 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/50"
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/50"
      case "Low": return "bg-green-500/20 text-green-400 border-green-500 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/50"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/50"
    }
  }

  const severityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500 text-white"
      case "High": return "bg-orange-500 text-white"
      case "Medium": return "bg-yellow-500 text-black"
      case "Low": return "bg-green-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const nodeContent = (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 text-center transition-all duration-300",
      "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2",
      isRoot ? "border-indigo-500/50" : isBranch ? "border-blue-500/50" : "border-gray-300 dark:border-gray-600",
      "rounded-xl shadow-lg min-w-[220px] max-w-[280px]"
    )}>
      {/* Top Handle */}
      <Handle position={Position.Top} type="target" className="w-3 h-3 bg-indigo-500 border-2 border-white dark:border-slate-900" />
      
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="flex items-center gap-2">
          {isRoot && <Hash className="w-5 h-5 text-indigo-500" />}
          {isBranch && <Shield className="w-5 h-5 text-blue-500" />}
          {isLeaf && details && (
            <AlertTriangle className={cn("w-5 h-5", getSeverityColor(details.severity).split(" ")[0].replace("bg-", "text-"))} />
          )}
          <span className={cn(
            "font-semibold text-sm whitespace-nowrap",
            isRoot ? "text-indigo-600 dark:text-indigo-400" : 
            isBranch ? "text-blue-600 dark:text-blue-400" :
            "text-gray-600 dark:text-gray-300"
          )}>
            {label}
          </span>
        </div>
        
        <code className="font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate w-full px-1 break-all bg-gray-100 dark:bg-slate-800 rounded px-2 py-1">
          {truncatedHash}
        </code>
        
        {isLeaf && details && (
          <Badge 
            variant="outline" 
            className={cn("mt-2 text-[10px] px-2 py-0.5", severityBadgeColor(details.severity))}
          >
            {details.severity}
          </Badge>
        )}
      </div>

      {/* Bottom Handle */}
      <Handle position={Position.Bottom} type="source" className="w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900" />
    </div>
  )

  // For leaf nodes with details, wrap in HoverCard
  if (isLeaf && details) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: level * 0.1 }}
            whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
            className="cursor-pointer"
          >
            {nodeContent}
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent 
          side="top" 
          align="center" 
          className={cn(
            "z-50 w-80 p-4",
            "bg-slate-900 border border-slate-700 text-white rounded-md shadow-2xl",
            "dark:bg-slate-900 dark:border-slate-700"
          )}
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                getSeverityColor(details.severity).replace("text-", "bg-").replace("border-", "bg-")
              )}>
                <AlertTriangle className={cn("w-5 h-5", getSeverityColor(details.severity).split(" ")[0].replace("bg-", "text-"))} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">
                  Vulnerability: {details.algorithm}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {details.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                <FileCode className="w-3 h-3 text-slate-400" />
                <span className="text-slate-300 truncate">
                  {details.file}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                <Shield className="w-3 h-3 text-slate-400" />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-medium text-red-400">Critical</span>
                  <Badge variant="outline" className={severityBadgeColor(details.severity)}>
                    {details.severity}
                  </Badge>
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-slate-300 font-medium">
                  Status: Mathematically Verified
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span className="text-slate-300 font-medium">
                  Anchored on Sepolia Testnet
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: level * 0.1 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="cursor-pointer"
    >
      {nodeContent}
    </motion.div>
  )
}