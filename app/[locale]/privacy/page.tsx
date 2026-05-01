"use client"

import { useTranslations } from "next-intl"
import { ShieldCheck } from "lucide-react"
import { StaticPageShell } from "@/components/layout/StaticPageShell"
import { StaticMarkdown } from "@/components/layout/StaticMarkdown"

export default function PrivacyPage() {
  const t = useTranslations("Privacy")

  const sections = [
    "overview",
    "dataCollection",
    "aiPrivacy",
    "useOfInfo",
    "sharing",
    "retention",
    "rights",
    "security",
    "children",
    "cookies",
    "contact",
  ]

  return (
    <StaticPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("intro")}
      meta={t("lastUpdated")}
      icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
    >
      <div className="space-y-10">
        {sections.map((sectionId) => (
          <section key={sectionId} id={sectionId} className="scroll-mt-32">
            <h2 className="mb-4 text-xl font-bold text-neutral-950 dark:text-white">
              {t(`sections.${sectionId}.title`)}
            </h2>
            <StaticMarkdown>{t(`sections.${sectionId}.content`)}</StaticMarkdown>
          </section>
        ))}
      </div>
    </StaticPageShell>
  )
}
