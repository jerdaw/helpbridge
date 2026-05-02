import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/utils/supabase/server"
import { getServiceById } from "@/lib/services"
import { Link, redirect } from "@/i18n/routing"
import { DashboardShell, DashboardSurface } from "@/components/dashboard/DashboardShell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("Dashboard")
  return { title: `${t("editService")}: ${id}` }
}

export default async function EditServicePage({ params }: Props) {
  const { id, locale } = await params
  const t = await getTranslations("Dashboard")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: "/login", locale })
  }

  const service = await getServiceById(id)

  if (!service) {
    notFound()
  }

  return (
    <DashboardShell
      title={t("editService")}
      subtitle={service.name}
      maxWidth="narrow"
      actions={
        <Button variant="outline" asChild>
          <Link href="/dashboard/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("services.viewPage.backToServices")}
          </Link>
        </Button>
      }
    >
      <DashboardSurface>
        {/* We need a client component to wrap the action for the form if we want to pass it as a prop */}
        <EditServiceClientWrapper service={service} id={id} locale={locale} />
      </DashboardSurface>
    </DashboardShell>
  )
}

// Client wrapper to handle the transition from server to client form
import EditServiceClientWrapper from "./EditServiceClientWrapper"
