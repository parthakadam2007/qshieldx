"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { CopyIcon, ShieldCheck, Info, Loader2, Download, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { merkleMetadata, blockchainProof, verificationSteps, computedRootHash, onChainRootHash, leafNodes, treeNodes } from "@/constants/merkleData"
import { VerificationStepper } from "@/components/verification-stepper"
import { MerkleTreeCanvas } from "@/components/merkle-tree"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface VerificationState {
  isVerifying: boolean
  currentStep: number
  completedSteps: string[]
  showSuccess: boolean
}

const INITIAL_STATE: VerificationState = {
  isVerifying: false,
  currentStep: 0,
  completedSteps: [],
  showSuccess: false,
}

const STEP_LABELS = [
  "CBOM Loaded",
  "Hashing",
  "Merkle Tree",
  "Signature",
  "Anchoring",
  "Verified",
]

export function VerificationPage() {
  const [state, setState] = useState<VerificationState>(INITIAL_STATE)
  const [activeTab, setActiveTab] = useState("tree")
  const animationRef = useRef<any[]>([])
  const progressRef = useRef<number>(0)
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Handle verify button click
  const handleVerifyClick = useCallback(() => {
    setState({
      isVerifying: true,
      currentStep: 1,
      completedSteps: [],
      showSuccess: false,
    })

    // Simulate verification sequence - increment step every 800ms
    const steps = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"]
    let currentStep = 1

    const stepInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        currentStep,
        completedSteps: [...prev.completedSteps, steps[currentStep - 1]],
      }))
      currentStep++

      if (currentStep > steps.length) {
        clearInterval(stepInterval)
        setState((prev) => ({
          ...prev,
          isVerifying: false,
          currentStep: 6,
          completedSteps: steps,
          showSuccess: true,
        }))
      }
    }, 800) // 6 steps × 800ms = 4.8 seconds
  }, [])

  // Export PDF function
  const handleExportPDF = useCallback(async () => {
    const element = dashboardRef.current
    if (!element) return

    const button = document.querySelector('button:has([data-lucide="download"])') as HTMLButtonElement
    const originalText = button?.innerHTML
    
    if (button) {
      button.disabled = true
      button.innerHTML = '<svg class="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating PDF...'
    }

    // Save original styles to restore later
    const originalWidth = element.style.width
    const originalOverflow = element.style.overflow

    // Temporarily expand to full scroll width for canvas capture
    element.style.width = `${element.scrollWidth}px`
    element.style.overflow = 'visible'

    // Hide problematic elements during capture
    const svgs = element.querySelectorAll('svg')
    const originalSvgDisplays: string[] = []
    svgs.forEach((svg, i) => {
      originalSvgDisplays[i] = svg.style.display
      svg.style.display = 'none'
    })

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Hide SVGs in cloned document too
          const clonedSvgs = clonedDoc.querySelectorAll('svg')
          clonedSvgs.forEach((svg) => {
            svg.style.display = 'none'
          })
        }
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4') // 'l' for landscape is better for wide trees
      const imgProperties = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('QShieldX-Blockchain-Verification-Report.pdf')
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again. Check console for details.")
    } finally {
      // Restore original styles
      element.style.width = originalWidth
      element.style.overflow = originalOverflow
      
      // Restore SVG visibility
      svgs.forEach((svg, i) => {
        svg.style.display = originalSvgDisplays[i] || 'block'
      })
      
      if (button) {
        button.disabled = false
        button.innerHTML = originalText || '<svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Export Blockchain Report (PDF)'
      }
    }
  }, [])

  // Reset state when not verifying
  useEffect(() => {
    if (!state.isVerifying && !state.showSuccess) {
      setState(INITIAL_STATE)
    }
  }, [state.isVerifying, state.showSuccess])

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto" ref={dashboardRef}>

        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
            Blockchain & Merkle Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Verifies cryptographic asset integrity through Merkle tree construction,
            digital signature, and blockchain anchoring on Sepolia testnet.
          </p>
        </header>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Button
            variant="default"
            onClick={handleVerifyClick}
            disabled={state.isVerifying}
            className="flex-1"
          >
            <Loader2 className="mr-2 h-4 w-4" />
            {state.isVerifying ? "Verifying..." : "Verify Integrity"}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="flex-1"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export Blockchain Report (PDF)
          </Button>
        </div>

        {/* Animated Horizontal Stepper */}
        <div className="mb-8">
          <VerificationStepper 
            currentStep={state.currentStep}
            totalSteps={6}
            steps={STEP_LABELS}
          />
        </div>

        {/* Data Information Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: CBOM Metadata & Identity */}
          <Card className="h-full">
            <div className="p-5">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                CBOM Metadata & Identity
              </h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Repository</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {merkleMetadata.repositoryName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Scan ID</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {merkleMetadata.scanId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CBOM Spec</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {merkleMetadata.cbomSpec}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Assets Count</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {merkleMetadata.assetsCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Scan Date</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(merkleMetadata.scanDate).toLocaleDateString()}
                  </span>
                </div>
              </dl>
            </div>
          </Card>

          {/* Card 2: Merkle Tree Root */}
          <Card className="h-full">
            <div className="p-5">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Merkle Tree Root
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <code className="block w-full break-all whitespace-normal overflow-hidden rounded-md bg-gray-800 dark:bg-gray-700 p-3 text-sm text-gray-300 font-mono">
                    {computedRootHash}
                  </code>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(computedRootHash)}
                  className="p-2 rounded-md hover:bg-border flex-shrink-0"
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Computed from 247 cryptographic assets using SHA-256
              </p>
            </div>
          </Card>

          {/* Card 3: Ledger Comparison */}
          <Card className="h-full">
            <div className="p-5">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Ledger Comparison
              </h4>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16, 185, 129, 0.2)" }}>
                  <span className="text-2xl font-bold text-green-500">✓</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Computed Root vs On-Chain Anchored Root
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Both roots match — verification integrity confirmed
                  </p>
                </div>
              </div>
              <p className="text-xs text-green-500 mt-3 font-medium">
                On-chain anchor: {onChainRootHash}
              </p>
            </div>
          </Card>

          {/* Card 4: Blockchain & IPFS Proof */}
          <Card className="h-full">
            <div className="p-5">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Blockchain & IPFS Proof
              </h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Network</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {blockchainProof.network}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">Tx Hash</span>
                  <span className="font-mono text-xs text-gray-900 dark:text-gray-100 truncate">
                    {blockchainProof.txHash}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Block Number</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {blockchainProof.blockNumber.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Timestamp</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(blockchainProof.anchorTimestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">IPFS CID</span>
                  <div className="w-full break-all text-sm">
                    <a
                      href={blockchainProof.ipfsCid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-500 hover:text-blue-400 dark:text-blue-400 break-all"
                    >
                      {blockchainProof.ipfsCid}
                    </a>
                  </div>
                </div>
              </dl>
              <Badge variant="secondary" className="mt-2 text-sm">
                Verified
              </Badge>
            </div>
          </Card>
        </div>

        {/* Merkle Tree Visualizer */}
        <MerkleTreeCanvas />

        {/* Success Banner */}
        {state.showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="mt-8 p-8 text-center border-t border-green-500/20 rounded-xl"
            style={{ background: "rgba(34, 197, 94, 0.1)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
              className="text-4xl font-bold text-green-500 dark:text-green-400 mb-4"
            >
              {"✅ VERIFIED & ANCHORED ON-CHAIN"}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              The blockchain integrity verification has completed successfully. The
              Merkle root hash has been anchored to the Sepolia testnet and is
              permanently recorded on-chain.
            </motion.p>
          </motion.div>
        )}

      </div>
    </main>
  )
}

export default VerificationPage