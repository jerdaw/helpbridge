"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type ScopeFilter = 'all' | 'kingston' | 'provincial'

interface ScopeFilterBarProps {
  counts: { all: number; local: number; provincial: number }
  activeScope: ScopeFilter
  onScopeChange: (scope: ScopeFilter) => void
}

/**
 * Contextual filter bar that only appears when search results span multiple scopes.
 * Shows counts for All, Local (Kingston), and Provincial (Ontario/Canada) services.
 */
export default function ScopeFilterBar({
  counts,
  activeScope,
  onScopeChange,
}: ScopeFilterBarProps) {
  const t = useTranslations("Search")

  // Don't render if results are homogeneous (all local or all provincial)
  if (counts.local === 0 || counts.provincial === 0) {
    return null
  }

  const scopes: { id: ScopeFilter; label: string; count: number }[] = [
    { id: 'all', label: t('scope.all'), count: counts.all },
    { id: 'kingston', label: t('scope.local'), count: counts.local },
    { id: 'provincial', label: t('scope.provincial'), count: counts.provincial },
  ]

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-neutral-100/60 p-0.5 dark:bg-neutral-800/60">
      {scopes.map((scope) => {
        const isActive = activeScope === scope.id
        return (
          <button
            key={scope.id}
            onClick={() => onScopeChange(scope.id)}
            className={cn(
              "relative flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-all outline-none",
              isActive
                ? "text-primary-700 dark:text-primary-300"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeScope"
                className="absolute inset-0 rounded-md bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-700 dark:ring-white/10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{scope.label}</span>
            <span className="relative z-10 opacity-60">{scope.count}</span>
          </button>
        )
      })}
    </div>
  )
}
