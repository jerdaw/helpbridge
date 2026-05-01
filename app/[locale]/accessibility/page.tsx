"use client"

import { useTranslations } from "next-intl"
import { Accessibility } from "lucide-react"
import { StaticPageShell } from "@/components/layout/StaticPageShell"

export default function AccessibilityPage() {
  const t = useTranslations("AccessibilityPolicy")

  return (
    <StaticPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("commitment")}
      meta={t("lastUpdated")}
      icon={<Accessibility className="h-5 w-5" aria-hidden="true" />}
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
        <p>{t("standards")}</p>

        <h2>{t("headings.features")}</h2>
        <ul>
          <li>{t("features.contrast")}</li>
          <li>{t("features.keyboard")}</li>
          <li>{t("features.skip")}</li>
          <li>{t("features.alt")}</li>
          <li>{t("features.semantic")}</li>
          <li>{t("features.responsive")}</li>
        </ul>

        <h2>{t("headings.multiYearPlan")}</h2>
        <div className="not-prose grid gap-4 sm:grid-cols-3">
          {(["2026", "2027", "2028"] as const).map((year) => (
            <div
              key={year}
              className="rounded-xl border border-neutral-200/70 bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <span className="text-accent-700 dark:text-accent-300 mb-2 block font-bold">{year}</span>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{t(`plan.y${year}`)}</p>
            </div>
          ))}
        </div>

        <h2>{t("headings.feedback")}</h2>
        <p>{t("feedback.intro")}</p>
        <p className="font-medium text-neutral-950 dark:text-white">{t("feedback.email")}</p>
        <p className="text-sm text-neutral-500 italic dark:text-neutral-400">{t("feedback.formats")}</p>
      </div>
    </StaticPageShell>
  )
}
