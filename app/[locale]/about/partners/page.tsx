"use client"

import { ArrowRight, BookOpenCheck, Building2, ClipboardCheck, ExternalLink, RefreshCw, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const REFERENCE_ORGANIZATIONS = [
  {
    key: "twoOneOne",
    name: "211 Ontario",
    url: "https://211ontario.ca",
    logo: "/partners/211-ontario.svg",
  },
  {
    key: "city",
    name: "City of Kingston",
    url: "https://www.cityofkingston.ca",
    logo: "/partners/city-of-kingston.svg",
  },
  {
    key: "unitedWay",
    name: "United Way KFL&A",
    url: "https://www.unitedwaykfla.ca",
    logo: "/partners/united-way-kfla.svg",
  },
  {
    key: "kchc",
    name: "Kingston Community Health Centres",
    url: "https://kchc.ca",
    logo: "/partners/kchc.svg",
  },
] as const

const REVIEW_STEPS = [
  {
    key: "source",
    Icon: BookOpenCheck,
  },
  {
    key: "curation",
    Icon: ClipboardCheck,
  },
  {
    key: "maintenance",
    Icon: RefreshCw,
  },
] as const

const HERO_NOTES = [
  {
    key: "public",
    Icon: Building2,
    className: "bg-accent-50 text-accent-700 ring-accent-200/70 dark:bg-accent-500/10 dark:text-accent-200",
  },
  {
    key: "reviewed",
    Icon: ClipboardCheck,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-200",
  },
  {
    key: "separate",
    Icon: BookOpenCheck,
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200/70 dark:bg-indigo-500/10 dark:text-indigo-200",
  },
] as const

export default function PartnersPage() {
  const t = useTranslations("PartnersPage")

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_14%_6%,rgba(34,211,238,0.22),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(99,102,241,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(34,211,238,0.06),transparent_30rem),linear-gradient(180deg,rgba(239,253,255,0.98)_0%,rgba(248,250,252,0.96)_18%,rgba(255,255,255,0.98)_34%,rgba(255,255,255,0.98)_72%,rgba(248,250,252,0.96)_88%,rgba(241,245,249,0.98)_100%)] font-sans dark:bg-[radial-gradient(circle_at_14%_6%,rgba(8,145,178,0.18),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(79,70,229,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(8,145,178,0.08),transparent_30rem),linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_28%,rgba(15,23,42,0.94)_72%,rgba(2,6,23,0.98)_100%)]">
      <div className="bg-noise" />
      <Header />

      <main id="main-content" className="flex-1">
        <Section animate={false} className="relative pt-40 pb-10 md:pt-44 md:pb-12">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-accent-700 dark:text-accent-300 text-xs font-semibold tracking-[0.16em] uppercase">
                {t("hero.eyebrow")}
              </p>
              <h1 className="heading-display mt-3 max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                {t("hero.subtitle")}
              </p>
            </div>

            <Card
              padding="none"
              className="border-neutral-200/75 bg-white/82 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
            >
              <div className="p-5 md:p-6">
                <h2 className="text-base font-semibold text-neutral-950 dark:text-white">{t("heroCard.title")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {t("heroCard.description")}
                </p>
                <div className="mt-5 space-y-4">
                  {HERO_NOTES.map(({ key, Icon, className }) => (
                    <div key={key} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
                          className
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {t(`heroCard.items.${key}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section animate={false} className="relative py-10 md:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 max-w-2xl">
              <p className="text-accent-700 dark:text-accent-300 text-xs font-semibold tracking-[0.16em] uppercase">
                {t("sources.eyebrow")}
              </p>
              <h2 className="mt-2 text-2xl leading-tight font-bold text-neutral-950 md:text-3xl dark:text-white">
                {t("sources.title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {t("sources.description")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {REFERENCE_ORGANIZATIONS.map((source) => (
                <a
                  key={source.key}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:border-accent-300/80 focus-visible:ring-primary-500 dark:hover:border-accent-300/30 relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/82 p-5 shadow-sm shadow-neutral-900/5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md hover:shadow-neutral-900/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:p-6 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none dark:hover:bg-white/[0.08] dark:focus-visible:ring-offset-neutral-950"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/90 p-1.5 shadow-sm ring-1 ring-neutral-200/80 dark:bg-white/10 dark:ring-white/10">
                        <Image
                          src={source.logo}
                          alt={t("logoAlt", { name: source.name })}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="group-hover:text-accent-700 dark:group-hover:text-accent-300 text-base font-semibold text-neutral-950 transition-colors dark:text-white">
                          {source.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase dark:text-neutral-400">
                          {t(`sources.items.${source.key}.label`)}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="text-accent-700 dark:text-accent-300 h-4 w-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {t(`sources.items.${source.key}.description`)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </Section>

        <Section animate={false} className="relative py-12 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-accent-700 dark:text-accent-300 text-xs font-semibold tracking-[0.16em] uppercase">
                {t("review.eyebrow")}
              </p>
              <h2 className="heading-2 mt-2 text-neutral-950 dark:text-white">{t("review.title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {t("review.description")}
              </p>
            </div>

            <Card
              padding="none"
              className="border-neutral-200/80 bg-white/78 p-5 shadow-sm shadow-neutral-900/5 backdrop-blur-md md:p-6 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none"
            >
              <div className="space-y-5">
                {REVIEW_STEPS.map(({ key, Icon }, index) => (
                  <div key={key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="bg-accent-50 text-accent-700 ring-accent-200/70 dark:bg-accent-500/10 dark:text-accent-200 flex h-10 w-10 items-center justify-center rounded-xl ring-1">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      {index < REVIEW_STEPS.length - 1 ? (
                        <span
                          className="mt-3 h-full min-h-8 w-px bg-neutral-200/80 dark:bg-white/10"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                    <div className="pb-1">
                      <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                        {t(`review.steps.${key}.title`)}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {t(`review.steps.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        <Section animate={false} className="relative pt-10 pb-12 md:pt-12 md:pb-16">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-neutral-200/75 bg-white/88 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md md:flex md:items-center md:justify-between md:gap-8 md:p-6 dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">{t("cta.title")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {t("cta.subtitle")}
              </p>
            </div>
            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row md:mt-0">
              <Button asChild className="min-w-[170px]">
                <Link href="/submit-service">
                  {t("cta.button")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="min-w-[170px]">
                <Link href="/">
                  {t("cta.search")}
                  <Search className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
