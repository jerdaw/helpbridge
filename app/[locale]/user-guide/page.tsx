import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { StaticPageShell } from "@/components/layout/StaticPageShell"
import { StaticMarkdown, stripMarkdownDocumentHeader } from "@/components/layout/StaticMarkdown"
import { logger } from "@/lib/logger"
import { BookOpen } from "lucide-react"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "UserGuide" })

  return {
    title: t("title") || "User Guide - CareConnect",
    description: t("description") || "Learn how to use CareConnect to find local services and support.",
  }
}

export default async function UserGuidePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "UserGuide" })

  // Read the appropriate markdown file based on locale
  const filename = locale === "fr" ? "user-guide.fr.md" : "user-guide.md"
  const filePath = path.join(process.cwd(), "docs", filename)

  let content = ""
  try {
    content = await fs.readFile(filePath, "utf8")
  } catch (error) {
    logger.error(`Error reading ${filename}`, error, {
      component: "user-guide-page",
      action: "readMarkdown",
    })
    content = "# User Guide\n\nContent not available."
  }

  return (
    <StaticPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      meta={t("lastUpdated")}
      icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
    >
      <article>
        <StaticMarkdown>{stripMarkdownDocumentHeader(content)}</StaticMarkdown>
      </article>
    </StaticPageShell>
  )
}
