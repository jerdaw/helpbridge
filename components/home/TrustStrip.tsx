"use client"

import { ShieldCheck, WifiOff, Globe } from "lucide-react"
import { useTranslations } from "next-intl"
import { Section } from "@/components/ui/section"
import { Card } from "@/components/ui/card"

export default function TrustStrip() {
  const t = useTranslations("Home.trustStrip")

  const features = [
    {
      icon: ShieldCheck,
      title: t("privacy.title"),
      description: t("privacy.description"),
    },
    {
      icon: WifiOff,
      title: t("offline.title"),
      description: t("offline.description"),
    },
    {
      icon: Globe,
      title: t("bilingual.title"),
      description: t("bilingual.description"),
    },
  ]

  return (
    <Section className="py-12 md:py-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} variant="glass" padding="default">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-100/80 p-2.5 dark:bg-primary-900/40">
                <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
