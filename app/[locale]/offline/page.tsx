"use client"

import { RefreshCw, ShieldAlert, WifiOff, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useEffect, useState } from "react"
import { getCachedServices } from "@/lib/offline/cache"
import ServiceCard from "@/components/services/ServiceCard"
import { SearchResult } from "@/lib/search/types"
import { OfflineSnapshotStatus } from "@/components/offline/OfflineSnapshotStatus"

export default function OfflinePage() {
  const t = useTranslations("Offline")
  const [cachedServices, setCached] = useState<SearchResult[]>([])

  useEffect(() => {
    const cached = getCachedServices<SearchResult[]>()
    if (cached) setCached(cached)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_14%_6%,rgba(34,211,238,0.22),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(99,102,241,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(34,211,238,0.06),transparent_30rem),linear-gradient(180deg,rgba(239,253,255,0.98)_0%,rgba(248,250,252,0.96)_18%,rgba(255,255,255,0.98)_34%,rgba(255,255,255,0.98)_72%,rgba(248,250,252,0.96)_88%,rgba(241,245,249,0.98)_100%)] font-sans dark:bg-[radial-gradient(circle_at_14%_6%,rgba(8,145,178,0.18),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(79,70,229,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(8,145,178,0.08),transparent_30rem),linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_28%,rgba(15,23,42,0.94)_72%,rgba(2,6,23,0.98)_100%)]">
      <div className="bg-noise" />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="relative px-4 pt-40 pb-12 sm:px-6 md:pt-44 md:pb-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-accent-700 dark:text-accent-300 text-xs font-semibold tracking-[0.16em] uppercase">
                  {t("heroEyebrow")}
                </p>
                <h1 className="heading-display mt-3 max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
                  {t("title")}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {t("description")}
                </p>

                <div className="mt-7 rounded-2xl border border-neutral-200/75 bg-white/82 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md md:p-6 dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-black/5 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-white/10">
                      <WifiOff className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-neutral-950 dark:text-white">{t("statusTitle")}</h2>
                      <div className="mt-3">
                        <OfflineSnapshotStatus />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-5 gap-2" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    {t("retryButton")}
                  </Button>
                </div>
              </div>

              <Card
                padding="none"
                className="border-neutral-200/75 bg-white/88 shadow-[0_18px_42px_rgba(15,23,42,0.07)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700 shadow-sm ring-1 ring-black/5 dark:bg-red-500/10 dark:text-red-200 dark:ring-white/10">
                      <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">
                        {t("emergencyContacts")}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {t("emergencyNote")}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200/70 bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="text-left">
                        <p className="font-medium text-neutral-950 dark:text-white">{t("crisisLine")}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("crisisLineDesc")}</p>
                      </div>
                      <a
                        href="tel:6135444229"
                        className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/15"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {t("callButton")}
                      </a>
                    </li>
                    <li className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200/70 bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="text-left">
                        <p className="font-medium text-neutral-950 dark:text-white">{t("emergency")}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("emergencyDesc")}</p>
                      </div>
                      <a
                        href="tel:911"
                        className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/15"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        911
                      </a>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            {cachedServices.length > 0 && (
              <section className="mt-8 text-left" aria-labelledby="cached-services-heading">
                <div className="mb-4">
                  <h2 id="cached-services-heading" className="text-lg font-semibold text-neutral-950 dark:text-white">
                    {t("recentlyViewed")}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {t("cachedServicesDescription")}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {cachedServices.slice(0, 3).map((r) => (
                    <ServiceCard key={r.service.id} service={r.service} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
