import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { StaticPageShell } from "@/components/layout/StaticPageShell"
import { StaticMarkdown, stripMarkdownDocumentHeader } from "@/components/layout/StaticMarkdown"
import { logger } from "@/lib/logger"
import { HelpCircle } from "lucide-react"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "FAQ" })

  return {
    title: t("title") || "FAQ - CareConnect",
    description: t("description") || "Frequently asked questions about CareConnect, data verification, and privacy.",
  }
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "FAQ" })

  // Read the appropriate markdown file based on locale
  const filename = locale === "fr" ? "faq.fr.md" : "faq.md"
  const filePath = path.join(process.cwd(), "docs", filename)

  let content = ""
  try {
    content = await fs.readFile(filePath, "utf8")
  } catch (error) {
    logger.error(`Error reading ${filename}`, error, {
      component: "faq-page",
      action: "readMarkdown",
    })
    content = "# FAQ\n\nContent not available."
  }

  return (
    <StaticPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      meta={t("lastUpdated")}
      icon={<HelpCircle className="h-5 w-5" aria-hidden="true" />}
    >
      <article>
        <StaticMarkdown>{stripMarkdownDocumentHeader(content)}</StaticMarkdown>
      </article>
    </StaticPageShell>
  )
}
