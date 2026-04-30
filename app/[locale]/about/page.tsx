"use client"

import { ArrowRight, MapPinned, Search, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section } from "@/components/ui/section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AboutTrustOverview from "@/components/about/AboutTrustOverview"
import { Link } from "@/i18n/routing"

export default function AboutPage() {
  const t = useTranslations("About")
  const accentCtaClassName =
    "border border-accent-700 bg-accent-700 text-white shadow-md shadow-accent-900/10 hover:translate-y-0 hover:border-accent-600 hover:bg-accent-600 hover:text-white hover:shadow-lg hover:shadow-accent-900/15 dark:border-accent-500 dark:bg-accent-600 dark:hover:bg-accent-500"

  const contextCards = [
    {
      key: "governance",
      title: t("governance.title"),
      description: t("governance.description"),
      Icon: ShieldCheck,
    },
    {
      key: "land",
      title: t("landAcknowledgment.title"),
      description: t("landAcknowledgment.text"),
      Icon: MapPinned,
    },
  ] as const

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 font-sans dark:bg-slate-950">
      <div className="bg-noise" />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-primary-400/35 animate-float absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full mix-blend-multiply blur-[150px] dark:bg-indigo-600/25 dark:mix-blend-screen" />
        <div className="bg-accent-400/35 animate-float-delayed absolute top-[10%] left-[-10%] h-[50%] w-[50%] rounded-full mix-blend-multiply blur-[150px] dark:bg-cyan-600/20 dark:mix-blend-screen" />
        <div className="animate-pulse-glow absolute right-[18%] bottom-[-12%] h-[58%] w-[58%] rounded-full bg-indigo-300/30 mix-blend-multiply blur-[150px] dark:bg-blue-700/20 dark:mix-blend-screen" />
      </div>
      <Header />

      <main id="main-content" className="relative z-10 flex-1">
        <Section
          animate={false}
          className="relative pt-40 pb-10 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-20 before:bg-gradient-to-b before:from-transparent before:to-white/40 before:content-[''] md:pt-44 md:pb-20 dark:before:to-slate-900/30"
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-accent-700 dark:text-accent-300 text-xs font-semibold tracking-[0.16em] uppercase">
              {t("hero.eyebrow")}
            </p>
            <h1 className="heading-display mt-3 max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
              {t("hero.subtitle")}
            </p>

            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row">
              <Button asChild variant="outline" size="lg" className={`${accentCtaClassName} min-w-[190px]`}>
                <Link href="/">
                  {t("hero.primaryCta")}
                  <Search className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[190px]">
                <Link href="/about/partners">
                  {t("hero.secondaryCta")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <AboutTrustOverview />

        <Section
          animate={false}
          className="relative -mt-px bg-white/55 py-12 backdrop-blur-md md:py-14 dark:bg-slate-900/45"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {contextCards.map(({ key, title, description, Icon }) => (
              <Card
                key={key}
                padding="none"
                className="h-full border-neutral-200/75 bg-white/90 shadow-lg ring-1 shadow-slate-900/5 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 dark:ring-white/10"
              >
                <div className="flex h-full flex-col gap-4 p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">{title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section animate={false} className="relative bg-slate-50/80 py-12 md:py-16 dark:bg-slate-950/80">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200/75 bg-white/90 p-5 shadow-lg ring-1 shadow-slate-900/5 ring-white/70 backdrop-blur-md md:flex md:items-center md:justify-between md:gap-8 md:p-6 dark:border-white/10 dark:bg-slate-900/70 dark:ring-white/10">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">{t("cta.title")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {t("cta.description")}
              </p>
            </div>
            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row md:mt-0">
              <Button asChild variant="outline" className={`${accentCtaClassName} min-w-[170px]`}>
                <Link href="/">{t("cta.search")}</Link>
              </Button>
              <Button asChild variant="outline" className="min-w-[170px]">
                <Link href="/about/partners">{t("cta.partners")}</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
