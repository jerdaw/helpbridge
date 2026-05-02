import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  maxWidth?: "default" | "wide" | "narrow"
  className?: string
}

const maxWidthClasses = {
  default: "max-w-6xl",
  wide: "max-w-7xl",
  narrow: "max-w-4xl",
} as const

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
  maxWidth = "default",
  className,
}: DashboardShellProps) {
  return (
    <section
      data-testid="dashboard-shell"
      className={cn(
        "relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.16),transparent_24rem),radial-gradient(circle_at_88%_4%,rgba(99,102,241,0.12),transparent_26rem),linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_38%,rgba(248,250,252,0.96)_100%)] px-4 py-6 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_12%_0%,rgba(8,145,178,0.14),transparent_24rem),radial-gradient(circle_at_88%_4%,rgba(79,70,229,0.14),transparent_26rem),linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.98)_42%,rgba(2,6,23,0.98)_100%)]",
        className
      )}
    >
      <div className="bg-noise" />
      <div className={cn("relative mx-auto space-y-6", maxWidthClasses[maxWidth])}>
        {title && <DashboardPageHeader title={title} subtitle={subtitle} actions={actions} />}
        {children}
      </div>
    </section>
  )
}

interface DashboardSurfaceProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function DashboardSurface({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: DashboardSurfaceProps) {
  const hasHeader = title || description || actions

  return (
    <section
      data-testid="dashboard-surface"
      className={cn(
        "overflow-hidden rounded-2xl border border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10",
        className
      )}
    >
      {hasHeader && (
        <div className="flex flex-col gap-3 border-b border-neutral-200/70 px-5 py-4 sm:flex-row sm:items-start sm:justify-between dark:border-white/10">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-neutral-950 dark:text-white">{title}</h2>}
            {description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(hasHeader ? "p-5" : "p-5 sm:p-6", contentClassName)}>{children}</div>
    </section>
  )
}

interface DashboardEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function DashboardEmptyState({ icon: Icon, title, description, action, className }: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300/80 bg-white/54 p-8 text-center dark:border-white/15 dark:bg-white/[0.03]",
        className
      )}
    >
      <div className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200 mb-4 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-neutral-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
