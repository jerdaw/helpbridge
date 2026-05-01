"use client"

import { useTranslations } from "next-intl"
import { PushOptIn } from "@/components/push/PushOptIn"
import { isPushNotificationsConfigured } from "@/hooks/usePushNotifications"
import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { useUserContext } from "@/hooks/useUserContext"
import { useHighContrast } from "@/hooks/useHighContrast"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Section } from "@/components/ui/section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Bell,
  CheckCircle2,
  Eye,
  LockKeyhole,
  MonitorSmartphone,
  SlidersHorizontal,
  User,
  Wifi,
  WifiOff,
} from "lucide-react"

const AGE_GROUPS = ["youth", "adult", "senior"] as const
const IDENTITY_OPTIONS = ["indigenous", "newcomer", "2slgbtqi+", "veteran", "disability"] as const

const PRIVACY_POINTS = [
  { key: "device", Icon: MonitorSmartphone },
  { key: "privacy", Icon: LockKeyhole },
  { key: "offline", Icon: CheckCircle2 },
] as const

export default function SettingsPage() {
  const t = useTranslations("Settings")
  const tAccess = useTranslations("Accessibility")
  const { isOnline, connectionType } = useNetworkStatus()
  const { context, updateAgeGroup, toggleIdentity, optIn, optOut } = useUserContext()
  const { isHighContrast, toggleHighContrast } = useHighContrast()
  const pushNotificationsConfigured = isPushNotificationsConfigured()
  const activePreferenceCount = (context.ageGroup ? 1 : 0) + context.identities.length

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_14%_6%,rgba(34,211,238,0.22),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(99,102,241,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(34,211,238,0.06),transparent_30rem),linear-gradient(180deg,rgba(239,253,255,0.98)_0%,rgba(248,250,252,0.96)_18%,rgba(255,255,255,0.98)_34%,rgba(255,255,255,0.98)_72%,rgba(248,250,252,0.96)_88%,rgba(241,245,249,0.98)_100%)] font-sans dark:bg-[radial-gradient(circle_at_14%_6%,rgba(8,145,178,0.18),transparent_24rem),radial-gradient(circle_at_82%_7%,rgba(79,70,229,0.16),transparent_26rem),radial-gradient(circle_at_50%_84%,rgba(8,145,178,0.08),transparent_30rem),linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.96)_28%,rgba(15,23,42,0.94)_72%,rgba(2,6,23,0.98)_100%)]">
      <div className="bg-noise" />
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Section animate={false} className="relative pt-40 pb-12 md:pt-44 md:pb-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
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

              <Card
                padding="none"
                className="mt-7 border-neutral-200/75 bg-white/82 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
              >
                <div className="p-5 md:p-6">
                  <h2 className="text-base font-semibold text-neutral-950 dark:text-white">{t("privacyTitle")}</h2>
                  <div className="mt-5 space-y-4">
                    {PRIVACY_POINTS.map(({ key, Icon }) => (
                      <div key={key} className="flex items-start gap-3">
                        <span className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {t(`privacyItems.${key}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card
                padding="none"
                className="border-neutral-200/75 bg-white/88 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
              >
                <section aria-labelledby="personalization-heading" className="p-5 md:p-6">
                  <div className="space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-black/5 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-white/10">
                          <User className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h2
                            id="personalization-heading"
                            className="text-lg font-semibold text-neutral-950 dark:text-white"
                          >
                            {t("personalization.title")}
                          </h2>
                          <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {t("personalization.description")}
                          </p>
                        </div>
                      </div>
                      {context.hasOptedIn ? (
                        <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                          {t("personalization.activeCount", { count: activePreferenceCount })}
                        </span>
                      ) : (
                        <Button onClick={optIn} className="w-full shrink-0 sm:w-auto sm:min-w-[190px]">
                          {t("enablePersonalization")}
                        </Button>
                      )}
                    </div>

                    {context.hasOptedIn && (
                      <div className="space-y-6 border-t border-neutral-200/70 pt-5 dark:border-white/10">
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{t("ageGroup")}</h3>
                          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {AGE_GROUPS.map((group) => {
                              const selected = context.ageGroup === group

                              return (
                                <Button
                                  key={group}
                                  type="button"
                                  variant={selected ? "default" : "outline"}
                                  aria-pressed={selected}
                                  onClick={() => updateAgeGroup(selected ? null : group)}
                                  className={cn(
                                    "min-h-11",
                                    selected
                                      ? "bg-primary-600 hover:bg-primary-500 text-white"
                                      : "border-neutral-200/80 bg-white/65 dark:border-white/10 dark:bg-white/[0.04]"
                                  )}
                                >
                                  {t(`ageGroups.${group}`)}
                                </Button>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{t("identities")}</h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {IDENTITY_OPTIONS.map((id) => {
                              const selected = context.identities.includes(id)

                              return (
                                <Button
                                  key={id}
                                  type="button"
                                  variant={selected ? "default" : "outline"}
                                  size="sm"
                                  aria-pressed={selected}
                                  onClick={() => toggleIdentity(id)}
                                  className={cn(
                                    "min-h-9 rounded-full",
                                    selected
                                      ? "bg-primary-600 hover:bg-primary-500 text-white"
                                      : "border-neutral-200/80 bg-white/65 dark:border-white/10 dark:bg-white/[0.04]"
                                  )}
                                >
                                  {t(`identityTags.${id}`)}
                                </Button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {t("personalization.localOnly")}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={optOut}
                            className="self-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200"
                          >
                            {t("clearProfile")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </Card>

              <div className="space-y-4">
                <Card
                  padding="none"
                  className="border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
                >
                  <section aria-labelledby="accessibility-heading" className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h2
                            id="accessibility-heading"
                            className="text-lg font-semibold text-neutral-950 dark:text-white"
                          >
                            {t("accessibility.title")}
                          </h2>
                          <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {t("accessibility.description")}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isHighContrast}
                        aria-label={tAccess("highContrast")}
                        onClick={toggleHighContrast}
                        className={cn(
                          "focus-visible:ring-primary-500 mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                          isHighContrast ? "bg-primary-600 dark:bg-primary-500" : "bg-neutral-200 dark:bg-neutral-700"
                        )}
                      >
                        <span
                          className={cn(
                            "block h-5 w-5 rounded-full bg-white shadow-lg transition-transform dark:bg-neutral-100",
                            isHighContrast ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </section>
                </Card>

                <Card
                  padding="none"
                  className="border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
                >
                  <section aria-labelledby="connection-heading" className="p-5 md:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10",
                            isOnline
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"
                          )}
                        >
                          {isOnline ? (
                            <Wifi className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <WifiOff className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                        <div>
                          <h2
                            id="connection-heading"
                            className="text-lg font-semibold text-neutral-950 dark:text-white"
                          >
                            {t("connectionStatus")}
                          </h2>
                          <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {isOnline ? t("onlineMessage") : t("offlineMessage")}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-xs font-medium whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                        <span
                          className={cn("h-2 w-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-amber-500")}
                          aria-hidden="true"
                        />
                        <span>{t(`connectionTypes.${connectionType}`)}</span>
                      </div>
                    </div>
                  </section>
                </Card>
              </div>

              <Card
                padding="none"
                className="border-neutral-200/75 bg-white/86 shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10"
              >
                <section aria-labelledby="notifications-heading" className="p-5 md:p-6">
                  <div className="mb-5 flex items-start gap-3">
                    <span className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-200 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                      <Bell className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 id="notifications-heading" className="text-lg font-semibold text-neutral-950 dark:text-white">
                        {t("Notifications.title")}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {t("Notifications.description")}
                      </p>
                    </div>
                  </div>

                  {pushNotificationsConfigured ? (
                    <PushOptIn />
                  ) : (
                    <div className="rounded-xl border border-neutral-200/75 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="flex items-start gap-3">
                        <SlidersHorizontal
                          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                          aria-hidden="true"
                        />
                        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {t("Notifications.notConfiguredDesc")}
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </Card>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
