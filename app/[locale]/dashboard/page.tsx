import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Eye, MousePointerClick, TrendingUp, FileText } from "lucide-react"
import { Link } from "@/i18n/routing"
import { createClient } from "@/utils/supabase/server"
import { getTranslations } from "next-intl/server"
import { DashboardShell, DashboardSurface } from "@/components/dashboard/DashboardShell"
import { redirect } from "@/i18n/routing"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loadDashboardOverviewMetrics } from "@/lib/dashboard/overview-metrics"

type TranslationFn = Awaited<ReturnType<typeof getTranslations>>

function formatChange(change: number, t: TranslationFn) {
  if (change === 0) {
    return {
      className: "text-neutral-500",
      label: `0% ${t("vsPrevious30Days")}`,
    }
  }

  const sign = change > 0 ? "+" : "-"
  return {
    className: change > 0 ? "text-emerald-600" : "text-red-600",
    label: `${sign}${Math.abs(change)}% ${t("vsPrevious30Days")}`,
  }
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const t = await getTranslations("Dashboard.overview")
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUser = user

  if (!currentUser) {
    return redirect({
      href: "/login",
      locale,
    })
  }

  const { metrics, degraded } = await loadDashboardOverviewMetrics(supabase, {
    id: currentUser.id,
    email: currentUser.email,
  })

  const viewsChange = formatChange(metrics.totalViews.change, t)
  const referralsChange = formatChange(metrics.referrals.change, t)
  const hasVerificationWork = metrics.servicesNeedingVerification > 0
  const metricCardClass =
    "border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"

  return (
    <DashboardShell title={t("welcomeTitle")} subtitle={t("welcomeSubtitle")} maxWidth="wide">
      {degraded && (
        <Alert>
          <AlertDescription>{t("temporarilyUnavailable")}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card variant="interactive" className={metricCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">{t("totalViews")}</CardTitle>
            <Eye className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews.current}</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className={`font-medium ${viewsChange.className}`}>{viewsChange.label}</span>
            </p>
          </CardContent>
        </Card>

        <Card variant="interactive" className={metricCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">{t("referrals")}</CardTitle>
            <MousePointerClick className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.referrals.current}</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className={`font-medium ${referralsChange.className}`}>{referralsChange.label}</span>
            </p>
          </CardContent>
        </Card>

        <Card variant="interactive" className={metricCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">{t("verifiedServices")}</CardTitle>
            <ShieldCheck className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.servicesUpToDate.current}</div>
            <p className="mt-1 text-xs text-neutral-500">
              {t("upToDateCount", { current: metrics.servicesUpToDate.current, total: metrics.servicesUpToDate.total })}
            </p>
          </CardContent>
        </Card>

        <Card variant="interactive" className={metricCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">{t("updateRequests")}</CardTitle>
            <FileText className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingUpdates}</div>
            <p className="mt-1 text-xs text-neutral-500">{t("pendingReview")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Prompt */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardSurface title={t("dataQualityScore")} description={t("dataQualityDesc")}>
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-neutral-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="text-3xl font-bold text-neutral-500">--</span>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-neutral-950 dark:text-white">{t("definitionPendingTitle")}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{t("definitionPendingDescription")}</p>
            </div>
          </div>
        </DashboardSurface>

        <DashboardSurface
          title={t("verifyListingsTitle")}
          description={
            hasVerificationWork
              ? t("verifyListingsNeedsAttention", { count: metrics.servicesNeedingVerification })
              : t("verifyListingsAllCaughtUp")
          }
        >
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/services">{hasVerificationWork ? t("startVerification") : t("manageServices")}</Link>
          </Button>
        </DashboardSurface>
      </div>

      {/* Quick Link - Manage Services */}
      <div className="flex justify-end">
        <Button asChild className="gap-2">
          <Link href="/dashboard/services">{t("manageServices")} &rarr;</Link>
        </Button>
      </div>
    </DashboardShell>
  )
}
