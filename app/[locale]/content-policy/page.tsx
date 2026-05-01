"use client"

import { useTranslations } from "next-intl"
import type { ReactNode } from "react"
import { ListChecks } from "lucide-react"
import { StaticPageShell } from "@/components/layout/StaticPageShell"

export default function ContentPolicyPage() {
  const t = useTranslations("ContentPolicy")

  const rich = {
    p: (chunks: ReactNode) => <p className="mb-4">{chunks}</p>,
    ul: (chunks: ReactNode) => <ul className="mb-4 list-disc space-y-2 pl-6">{chunks}</ul>,
    li: (chunks: ReactNode) => <li>{chunks}</li>,
    strong: (chunks: ReactNode) => <strong className="font-semibold">{chunks}</strong>,
  }

  const policySections = [
    {
      id: "prohibited",
      title: t("sections.prohibited.title"),
      content: t.rich("sections.prohibited.content", rich),
    },
    {
      id: "submissions",
      title: t("sections.submissions.title"),
      content: t.rich("sections.submissions.content", rich),
    },
    {
      id: "reporting",
      title: t("sections.reporting.title"),
      content: t.rich("sections.reporting.content", rich),
    },
    {
      id: "appeals",
      title: t("sections.appeals.title"),
      content: t.rich("sections.appeals.content", rich),
    },
  ]

  return (
    <StaticPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      meta={t("lastUpdated")}
      icon={<ListChecks className="h-5 w-5" aria-hidden="true" />}
    >
      <div className="space-y-10">
        {policySections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-950 dark:text-white">{section.title}</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </StaticPageShell>
  )
}
