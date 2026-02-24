"use client"

import { useTranslations } from "next-intl"
import { Section } from "@/components/ui/section"

export default function HowItWorks() {
  const t = useTranslations("About.howItWorks")

  const steps = [
    { number: 1, title: t("step1.title"), description: t("step1.description") },
    { number: 2, title: t("step2.title"), description: t("step2.description") },
    { number: 3, title: t("step3.title"), description: t("step3.description") },
  ]

  return (
    <Section className="py-12 md:py-16">
      <div className="mb-10 text-center">
        <h2 className="heading-2 text-neutral-900 dark:text-white">{t("title")}</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{t("subtitle")}</p>
      </div>
      <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3 md:gap-0">
        {steps.map(({ number, title, description }) => (
          <li
            key={number}
            className="how-it-works-step relative flex flex-col items-center text-center md:px-8"
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white dark:bg-primary-500"
              aria-hidden="true"
            >
              {number}
            </div>
            <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
