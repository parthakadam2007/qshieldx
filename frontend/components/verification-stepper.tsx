"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerificationStepperProps {
  currentStep: number // 0-6, where 0 = none started, 6 = all complete
  totalSteps?: number
  steps?: string[]
  className?: string
}

const DEFAULT_STEPS = [
  "CBOM Loaded",
  "Hashing",
  "Merkle Tree",
  "Signature",
  "Anchoring",
  "Verified",
]

export function VerificationStepper({
  currentStep,
  totalSteps = 6,
  steps = DEFAULT_STEPS,
  className,
}: VerificationStepperProps) {
  const completedSteps = Math.min(currentStep, totalSteps)
  const isComplete = currentStep >= totalSteps
  // Progress percentage: when currentStep=0 -> 0%, currentStep=6 -> 100%
  // The line connects centers of circles, so we use (totalSteps - 1) segments
  const progressPercent = currentStep === 0 ? 0 : ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background connecting line - centered on circles (top-1/2 of w-8 = top-4) */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
        
        {/* Animated progress fill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-4 left-0 h-1 bg-green-500 dark:bg-green-400 rounded-full origin-left"
            style={{ transformOrigin: "left center" }}
          />
        </AnimatePresence>

        {/* Step Circles */}
        <div className="relative flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber <= completedSteps
            const isActive = stepNumber === currentStep && !isComplete
            const isPending = stepNumber > currentStep

            return (
              <motion.div
                key={step}
                className="relative flex flex-col items-center z-10 w-20"
              >
                {/* Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                  className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-green-500 border-green-500 dark:bg-green-400 dark:border-green-400"
                      : isActive
                      ? "bg-transparent border-indigo-500 dark:border-indigo-400 animate-pulse ring-4 ring-indigo-500/20 dark:ring-indigo-400/20"
                      : "bg-background border-gray-300 dark:border-gray-600"
                  )}
                >
                  <AnimatePresence>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    {!isCompleted && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isActive ? 1 : 1 }}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          isActive
                            ? "bg-indigo-500 animate-pulse"
                            : "bg-transparent"
                        )}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Step Label - no truncate, full width */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={cn(
                    "mt-2 text-xs font-medium text-center whitespace-nowrap",
                    isCompleted
                      ? "text-green-600 dark:text-green-400"
                      : isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step}
                </motion.p>

                {/* Step Number Indicator */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={cn(
                    "absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold",
                    isCompleted
                      ? "text-green-500"
                      : isActive
                      ? "text-indigo-500"
                      : "text-gray-400"
                  )}
                >
                  {stepNumber}
                </motion.span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Step Description */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300"
      >
        {currentStep === 0
          ? "Click 'Verify Integrity' to start the verification process"
          : currentStep <= totalSteps
          ? `Step ${currentStep} of ${totalSteps}: ${steps[currentStep - 1]}`
          : "All verification steps completed successfully"}
      </motion.p>
    </div>
  )
}