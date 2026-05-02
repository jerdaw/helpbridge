/**
 * Observability Dashboard
 *
 * Real-time system health monitoring for platform admins.
 *
 * Features:
 * - Circuit breaker status (CLOSED/OPEN/HALF_OPEN)
 * - Performance metrics (p50/p95/p99 latency)
 * - Recent incidents (last 24h)
 * - System health summary
 *
 * Access: Admin-only (enforced in-page)
 */

import { Metadata } from "next"
import { getSupabaseBreakerStats } from "@/lib/resilience/supabase-breaker"
import { getMetrics } from "@/lib/performance/metrics"
import { createClient } from "@/utils/supabase/server"
import { isUserAdmin } from "@/lib/auth/authorization"
import { CircuitBreakerCard } from "@/components/observability/CircuitBreakerCard"
import { PerformanceCharts } from "@/components/observability/PerformanceCharts"
import { HealthSummary } from "@/components/observability/HealthSummary"
import { RefreshButton } from "@/components/observability/RefreshButton"
import { AutoRefresh } from "@/components/observability/AutoRefresh"
import { SLOComplianceCard } from "@/components/observability/SLOComplianceCard"
import { SLODisclaimerBanner } from "@/components/observability/SLODisclaimerBanner"
import { getSLOComplianceSummary } from "@/lib/observability/slo-tracker"
import { getTranslations } from "next-intl/server"
import { redirect } from "@/i18n/routing"
import { DashboardShell } from "@/components/dashboard/DashboardShell"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Admin.observability.meta" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ObservabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("Admin.observability")
  // Admin-only access
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUser = user

  if (!currentUser) {
    return redirect({
      href: {
        pathname: "/login",
        query: {
          next: "/admin/observability",
        },
      },
      locale,
    })
  }

  // Check admin status
  const isAdmin = await isUserAdmin(supabase, currentUser.id)
  if (!isAdmin) {
    return redirect({ href: "/dashboard", locale })
  }

  // Fetch current system state
  const circuitBreakerStats = getSupabaseBreakerStats()
  const performanceMetrics = getMetrics()
  const sloCompliance = getSLOComplianceSummary()

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen focus:outline-none">
      <DashboardShell title={t("title")} subtitle={t("description")} actions={<RefreshButton />} maxWidth="wide">
        {/* SLO Provisional Disclaimer */}
        <SLODisclaimerBanner />

        {/* SLO Compliance */}
        <SLOComplianceCard compliance={sloCompliance} />

        {/* System Health Summary */}
        <HealthSummary circuitBreaker={circuitBreakerStats} metrics={performanceMetrics} />

        {/* Circuit Breaker Status */}
        <CircuitBreakerCard stats={circuitBreakerStats} />

        {/* Performance Metrics */}
        <PerformanceCharts metrics={performanceMetrics} />

        {/* Auto-refresh every 60 seconds */}
        <AutoRefresh />
      </DashboardShell>
    </main>
  )
}
