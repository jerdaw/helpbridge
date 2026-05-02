"use client"

import { useEffect, useState } from "react"
import { useRouter, Link } from "@/i18n/routing"
import { Service } from "@/types/service"
import { Database } from "@/types/supabase"
import EditServiceForm from "@/components/edit-service/EditServiceForm"
import { ServiceFormData } from "@/lib/schemas/form"
import { useAuth } from "@/components/layout/AuthProvider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Loader2, ThumbsUp, AlertTriangle } from "lucide-react"
import { useServiceFeedback } from "@/hooks/useServiceFeedback"
import { useTranslations } from "next-intl"
import { createClient } from "@/utils/supabase/client"
import { logger } from "@/lib/logger"
import { mapServiceRowToService } from "@/lib/service-db"
import { DashboardEmptyState, DashboardShell, DashboardSurface } from "@/components/dashboard/DashboardShell"

function FeedbackStats({ serviceId }: { serviceId: string }) {
  const { stats, helpfulPercentage, totalVotes, loading } = useServiceFeedback(serviceId)

  if (loading || !stats) return null

  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      {totalVotes > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <ThumbsUp className="h-3 w-3" />
          {helpfulPercentage}% ({totalVotes} votes)
        </span>
      )}
      {stats.open_issues_count > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3" />
          {stats.open_issues_count} open issues
        </span>
      )}
    </div>
  )
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("Dashboard.services.viewPage")
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function loadService() {
      const { id: pageId } = await params
      setId(pageId)

      if (!user) return // Auth provider handles redirect, but safe guard

      const supabase = createClient()
      const { data, error } = await supabase.from("services").select("*").eq("id", pageId).single()

      if (data) {
        setService(mapServiceRowToService(data))
      } else if (error) {
        logger.error("Error fetching service", { error })
        // Handle 404 or permission error
      }
      setLoading(false)
    }
    loadService()
  }, [params, user])

  const handleUpdate = async (formData: ServiceFormData) => {
    if (!user || !id) return

    const supabase = createClient()

    // Prepare for DB update
    const updates: Database["public"]["Tables"]["services"]["Update"] = {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      phone: formData.phone,
      url: formData.url,
      email: formData.email,
      hours: formData.hours,
      fees: formData.fees,
      eligibility: formData.eligibility,
      application_process: formData.application_process,
      category: formData.category,
      // tags: ... logic to save tags
      bus_routes: formData.bus_routes ? formData.bus_routes.split(",").map((s) => s.trim()) : [],
    }

    const { error } = await supabase.from("services").update(updates).eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    // Redirect back to list
    router.push("/dashboard/services")
    router.refresh()
  }

  if (loading) {
    return (
      <DashboardShell title={t("editService")} maxWidth="narrow">
        <DashboardSurface>
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="text-primary-500 h-8 w-8 animate-spin" />
          </div>
        </DashboardSurface>
      </DashboardShell>
    )
  }

  if (!service) {
    return (
      <DashboardShell title={t("editService")} maxWidth="narrow">
        <DashboardEmptyState
          icon={AlertTriangle}
          title={t("serviceNotFound")}
          description={t("backToServices")}
          action={
            <Button asChild variant="outline">
              <Link href="/dashboard/services">&larr; {t("backToServices")}</Link>
            </Button>
          }
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title={t("editService")}
      subtitle={service.name}
      maxWidth="narrow"
      actions={
        <Link
          href={`/service/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        >
          <Eye className="h-4 w-4" />
          {t("preview")}
        </Link>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToServices")}
          </Link>
        </Button>
        <FeedbackStats serviceId={id} />
      </div>

      <DashboardSurface>
        <EditServiceForm service={service} onSubmit={handleUpdate} />
      </DashboardSurface>
    </DashboardShell>
  )
}
