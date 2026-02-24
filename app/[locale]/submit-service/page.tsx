import SubmitServiceForm from "@/components/forms/SubmitServiceForm"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getTranslations } from "next-intl/server"
import { PageHeader } from "@/components/ui/page-header"
import { Send } from "lucide-react"

export default async function SubmitServicePage() {
  const t = await getTranslations("SubmitService")

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 dark:bg-neutral-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-32 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PageHeader icon={Send} title={t("title")} subtitle={t("description")} className="mb-12" />
        </div>
        <SubmitServiceForm />
      </main>
      <Footer />
    </div>
  )
}
