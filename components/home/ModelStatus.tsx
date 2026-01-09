"use client"

import { useState, useEffect } from "react"
import { Zap, ShieldCheck } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface ModelStatusProps {
  isReady: boolean
  progress: number | null
}

const messages = [
  { iconComponent: ShieldCheck, text: "Privacy First • No Tracking • Open Source", color: "text-green-600 dark:text-green-500" },
  { iconComponent: Zap, text: "Private Neural Search Active", color: "text-green-600 dark:text-green-500" },
]

export default function ModelStatus({ isReady }: ModelStatusProps) {
  const [messageIndex, setMessageIndex] = useState(0) // Start with Privacy First
  const [minDisplayTimeElapsed, setMinDisplayTimeElapsed] = useState(false)
  const [shouldCycle, setShouldCycle] = useState(false)

  // Initial 4-second timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDisplayTimeElapsed(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Check for readiness after min time elapsed
  useEffect(() => {
    if (minDisplayTimeElapsed && isReady) {
      // Move to the next message (Neural Search Active) and enable cycling
      setMessageIndex(1)
      setShouldCycle(true)
    }
  }, [minDisplayTimeElapsed, isReady])

  // Cycling logic
  useEffect(() => {
    if (!shouldCycle) return

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [shouldCycle])

  // Always show a message if possible, falling back to just rendering nothing if something is really wrong
  // but conceptually we always start with message 0 now.
  const currentMessage = messages[messageIndex % messages.length]

  if (!currentMessage) return null

  return (
    <div className="mt-2 h-5 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-center gap-1 text-xs ${currentMessage.color}`}
        >
          <currentMessage.iconComponent className="h-3 w-3" />
          <span>{currentMessage.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
