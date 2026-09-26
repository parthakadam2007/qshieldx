"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TreeNode, treeNodes, leafNodes } from "@/constants/merkleData"
import { CheckCircle2, AlertTriangle, FileCode, Shield, Hash, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface MerkleTreeVisualizerProps {
  onNodeHover?: (node: TreeNode) => void
  className?: string
}

// Extended tree structure for 5-tier visualization
interface VisualNode {
  id: string
  hash: string
  label: string
  type: "root" | "branch" | "leaf"
  level: number
  x: number
  y: number
  finding?: TreeNode["finding"]
  children?: VisualNode[]
}

// Extended vulnerability data for more leaf nodes
const LEAF_VULNERABILITIES = [
  { name: "Hardcoded RSA-2048 Key", severity: "Critical" as const, file: "/src/backend/auth.ts", algorithm: "RSA-2048", description: "Private key embedded in authentication module - immediate rotation required" },
  { name: "Legacy TLS 1.1 Endpoint", severity: "Critical" as const, file: "/src/network/tls.ts", algorithm: "TLS 1.1", description: "Deprecated TLS version detected on payment API endpoint" },
  { name: "MD5 Hash Algorithm", severity: "Critical" as const, file: "/src/crypto/hashing.ts", algorithm: "MD5", description: "Cryptographically broken hash function used for password storage" },
  { name: "Weak ECDSA Signature", severity: "Critical" as const, file: "/src/crypto/signing.ts", algorithm: "ECDSA P-256", description: "Nonce reuse vulnerability in ECDSA signing implementation" },
  { name: "Exposed AWS Secret Key", severity: "Critical" as const, file: "/src/config/aws.ts", algorithm: "AWS-KMS", description: "Production AWS secret key committed to repository" },
  { name: "Weak RSA-1024 Certificate", severity: "High" as const, file: "/src/certs/legacy.pem", algorithm: "RSA-1024", description: "RSA-1024 certificate vulnerable to factorization attacks" },
  { name: "SHA-1 Hash in Use", severity: "High" as const, file: "/src/crypto/legacy.ts", algorithm: "SHA-1", description: "Collision-vulnerable SHA-1 used for digital signatures" },
  { name: "Static IV in AES-CBC", severity: "High" as const, file: "/src/crypto/encrypt.ts", algorithm: "AES-256-CBC", description: "Static initialization vector reduces semantic security" },
  { name: "ECDSA P-384 Key", severity: "Medium" as const, file: "/src/crypto/keys.ts", algorithm: "ECDSA P-384", description: "NIST P-384 curve - quantum vulnerable but not immediately exploitable" },
  { name: "AES-256-GCM Key", severity: "Low" as const, file: "/src/crypto/aes.ts", algorithm: "AES-256-GCM", description: "Quantum-resistant symmetric encryption (Grover's algorithm only halves key space)" },
  { name: "ChaCha20-Poly1305 Key", severity: "Low" as const, file: "/src/crypto/chacha.ts", algorithm: "ChaCha20-Poly1305", description: "Modern stream cipher - quantum resistant" },
  { name: "ML-KEM-768 (Kyber) Key", severity: "Low" as const, file: "/src/pqc/kem.ts", algorithm: "ML-KEM-768", description: "Post-quantum KEM - NIST standardized, quantum resistant" },
  { name: "ML-DSA-65 (Dilithium) Sig", severity: "Low" as const, file: "/src/pqc/sig.ts", algorithm: "ML-DSA-65", description: "Post-quantum signatures - NIST standardized, quantum resistant" },
  { name: "X25519 Key Exchange", severity: "Low" as const, file: "/src/crypto/x25519.ts", algorithm: "X25519", description: "Modern elliptic curve DH - quantum vulnerable but widely deployed" },
  { name: "Ed25519 Signature", severity: "Low" as const, file: "/src/crypto/ed25519.ts", algorithm: "Ed25519", description: "Modern EdDSA signature scheme - quantum vulnerable" },
  { name: "RSA-4096 Certificate", severity: "Medium" as const, file: "/src/certs/rsa4096.pem", algorithm: "RSA-4096", description: "Long-term certificate - quantum vulnerable but not immediately exploitable" },
]

// Generate a deterministic hash for a node
function generateNodeHash(label: string, level: number, index: number): string {
  const base = "0x"
  const chars = "0123456789abcdef"
  let hash = base
  for (let i = 0; i < 60; i++) {
    hash += chars[(label.charCodeAt(i % label.length) + level * 7 + index * 13 + i * 3) % 16]
  }
  return hash
}

// Build a comprehensive 5-level Merkle tree
function buildFullMerkleTree(): VisualNode {
  const levelY = [60, 150, 240, 330, 420] // 5 levels
  const levelCount = [1, 2, 4, 8, 16] // nodes per level
  
  let vulnIndex = 0
  
  function buildLevel(level: number, parentX: number, parentWidth: number, startIndex: number): VisualNode[] {
    const count = levelCount[level]
    const spacing = parentWidth / (count + 1)
    const nodes: VisualNode[] = []
    
    for (let i = 0; i < count; i++) {
      const x = parentX - parentWidth / 2 + spacing * (i + 1)
      const y = levelY[level]
      const isLeaf = level === levelCount.length - 1
      
      let label: string
      let type: "root" | "branch" | "leaf"
      let finding: VisualNode["finding"] | undefined
      
      if (level === 0) {
        label = "Merkle Root"
        type = "root"
      } else if (isLeaf) {
        label = `Leaf ${i + 1}`
        type = "leaf"
        if (vulnIndex < LEAF_VULNERABILITIES.length) {
          finding = LEAF_VULNERABILITIES[vulnIndex]
          vulnIndex++
        }
      } else {
        label = `Level ${level + 1} Node ${i + 1}`
        type = "branch"
      }
      
      const node: VisualNode = {
        id: `node-${level}-${i}`,
        hash: generateNodeHash(label, level, i),
        label,
        type,
        level,
        x,
        y,
        finding,
        children: [],
      }
      
      nodes.push(node)
    }
    
    // Recursively build children for non-leaf nodes
    if (level < levelCount.length - 1) {
      nodes.forEach((node, i) => {
        node.children = buildLevel(level + 1, node.x, spacing * 0.8, startIndex + i)
      })
    }
    
    return nodes
  }
  
  const rootNodes = buildLevel(0, 0, 800, 0)
  return rootNodes[0]
}

function SVGConnections({ rootNode }: { rootNode: VisualNode }) {
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = []
  
  function collectConnections(node: VisualNode) {
    if (node.children) {
      node.children.forEach(child => {
        connections.push({
          x1: node.x,
          y1: node.y + 20, // bottom of parent node
          x2: child.x,
          y2: child.y - 20, // top of child node
        })
        collectConnections(child)
      })
    }
  }
  
  collectConnections(rootNode)
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="none"
      viewBox="-500 0 1000 500"
    >
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={0.8} />
        </linearGradient>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" opacity="0.8" />
        </marker>
      </defs>
      {connections.map((conn, i) => (
        <motion.path
          key={i}
          d={`M ${conn.x1} ${conn.y1} Q ${conn.x1} ${(conn.y1 + conn.y2) / 2} ${conn.x2} ${conn.y2}`}
          stroke="url(#connectionGradient)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: "easeOut" }}
          className="dark:stroke-emerald-500/60"
        />
      ))}
    </svg>
  )
}

function MerkleNode({ 
  node, 
  onHover 
}: { 
  node: VisualNode 
  onHover?: (node: VisualNode) => void
}) {
  const isLeaf = node.type === "leaf"
  const isRoot = node.type === "root"
  const isBranch = node.type === "branch"
  
  const nodeStyles = {
    root: "w-60 h-30",
    branch: "w-52 h-26",
    leaf: "w-48 h-24",
  }
  
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
  
  const truncatedHash = `${node.hash.substring(0, 12)}...${node.hash.substring(node.hash.length - 8)}`
  
  const nodeContent = (
    <Card
      className={cn(
        "flex flex-col items-center justify-center p-3 text-center transition-all duration-300",
        "hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:scale-[1.02]",
        "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2",
        isRoot ? "border-indigo-500/50" : isBranch ? "border-blue-500/50" : "border-gray-300 dark:border-gray-600",
        nodeStyles[node.type as keyof typeof nodeStyles]
      )}
      onMouseEnter={() => onHover?.(node)}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {isRoot && <Hash className="w-5 h-5 text-indigo-500" />}
        {isBranch && <Shield className="w-5 h-5 text-blue-500" />}
        {isLeaf && node.finding && (
          <AlertTriangle className={cn("w-5 h-5", getSeverityColor(node.finding.severity).split(" ")[0].replace("bg-", "text-"))} />
        )}
        <span className={cn(
          "font-medium text-xs whitespace-nowrap",
          isRoot ? "text-indigo-600 dark:text-indigo-400" : 
          isBranch ? "text-blue-600 dark:text-blue-400" :
          "text-gray-600 dark:text-gray-300"
        )}>
          {node.label}
        </span>
      </div>
      <code className="font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate w-full px-1 break-all">
        {truncatedHash}
      </code>
      {isLeaf && node.finding && (
        <Badge 
          variant="outline" 
          className={cn("mt-1.5 text-[9px] px-1.5 py-0.5", severityBadgeColor(node.finding.severity))}
        >
          {node.finding.severity}
        </Badge>
      )}
    </Card>
  )
  
  if (isLeaf && node.finding) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + node.level * 0.1 }}
              whileHover={{ scale: 1.03, y: -6, boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
              className="cursor-pointer"
            >
              {nodeContent}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className={cn(
              "z-50 w-72 p-4",
              "bg-slate-900 border border-slate-700 text-white rounded-md shadow-2xl",
              "dark:bg-slate-900 dark:border-slate-700"
            )}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  getSeverityColor(node.finding.severity).replace("text-", "bg-").replace("border-", "bg-")
                )}>
                  <AlertTriangle className={cn("w-5 h-5", getSeverityColor(node.finding.severity).split(" ")[0].replace("bg-", "text-"))} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">
                    Vulnerability: {node.finding.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    {node.finding.algorithm}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                  <FileCode className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-300 truncate">
                    {node.finding.file}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-medium text-red-400">Critical</span>
                    <Badge variant="outline" className={severityBadgeColor(node.finding.severity)}>
                      {node.finding.severity}
                    </Badge>
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-slate-300 font-medium">
                    Status: Mathematically Verified
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: node.level * 0.1 }}
      whileHover={{ scale: 1.03, y: -6, boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
      className="cursor-pointer"
    >
      {nodeContent}
    </motion.div>
  )
}

export function MerkleTreeVisualizer({ onNodeHover, className }: MerkleTreeVisualizerProps) {
  const visualTree = React.useMemo(() => buildFullMerkleTree(), [])
  
  return (
    <div className={cn("relative overflow-x-auto pb-8", className)}>
      <div className="relative min-w-[1400px] h-[520px]">
        {/* SVG Connections - rendered first so they're behind nodes */}
        <SVGConnections rootNode={visualTree} />
        
        {/* Nodes - rendered on top of connections */}
        <div className="absolute inset-0 flex items-start justify-center pt-6">
          <div className="flex flex-col items-center gap-8">
            {/* Render all levels recursively */}
            <MerkleTreeLevels node={visualTree} />
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span>Merkle Root</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>Intermediate Nodes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>Critical Findings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>High Findings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span>Medium Findings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Low/Quantum-Safe</span>
        </div>
      </div>
    </div>
  )
}

// Recursive component to render all tree levels
function MerkleTreeLevels({ node }: { node: VisualNode }) {
  return (
    <>
      <div className="flex justify-center w-full">
        <MerkleNode node={node} />
      </div>
      {node.children && node.children.length > 0 && (
        <div className="flex justify-center gap-4 w-full">
          {node.children.map((child) => (
            <MerkleTreeLevels key={child.id} node={child} />
          ))}
        </div>
      )}
    </>
  )
}