"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircuitBreakerStats } from "@/lib/resilience/supabase-breaker"
import { CircuitState } from "@/lib/resilience/circuit-breaker"
import { MetricsSummary } from "@/lib/performance/metrics"
import { useTranslations } from "next-intl"

interface HealthSummaryProps {
  circuitBreaker: CircuitBreakerStats
  metrics: MetricsSummary
}

export function HealthSummary({ circuitBreaker, metrics }: HealthSummaryProps) {
  const t = useTranslations("Admin.observability.healthSummary")
  const overallStatus = circuitBreaker.state === CircuitState.CLOSED ? "healthy" : "degraded"
  const statusColor = overallStatus === "healthy" ? "bg-green-500" : "bg-yellow-500"

  return (
    <Card className="border-neutral-200/75 bg-white/86 p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Badge className={`${statusColor} px-4 py-2 text-lg text-white`}>
          {overallStatus === "healthy" ? t("status.operational") : t("status.degraded")}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-1 text-sm">{t("fields.circuitBreaker")}</p>
          <p className="text-lg font-bold">{circuitBreaker.state}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground mb-1 text-sm">{t("fields.failureRate")}</p>
          <p className="text-lg font-bold">{(circuitBreaker.failureRate * 100).toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground mb-1 text-sm">{t("fields.operationsTracked")}</p>
          <p className="text-lg font-bold">{metrics.totalOperations}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground mb-1 text-sm">{t("fields.uptime")}</p>
          <p className="text-lg font-bold">{Math.floor((Date.now() - metrics.trackingSince) / 1000 / 60)}m</p>
        </div>
      </div>
    </Card>
  )
}
