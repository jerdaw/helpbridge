import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnalyticsCardProps {
  title: string
  value: string | number
  description?: string
  change?: number
  loading?: boolean
}

export function AnalyticsCard({ title, value, description, change, loading }: AnalyticsCardProps) {
  if (loading) {
    return (
      <Card className="border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change !== undefined || description) && (
          <p className="text-muted-foreground text-xs">
            {change !== undefined && (
              <span className={cn("mr-1 font-medium", change > 0 ? "text-green-600" : "text-red-600")}>
                {Math.abs(change)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
