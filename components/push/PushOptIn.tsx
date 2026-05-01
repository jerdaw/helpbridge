"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { logger } from "@/lib/logger"

export function PushOptIn() {
  const { isConfigured, isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications({
    enabled: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("Settings.Notifications")

  if (!isConfigured) {
    return null
  }

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      if (isSubscribed) {
        await unsubscribe()
      } else {
        await subscribe()
      }
    } catch (error) {
      logger.error("Push notification subscription toggle failed", error, {
        component: "PushOptIn",
        action: isSubscribed ? "unsubscribe" : "subscribe",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Alert className="border-neutral-200 bg-neutral-50 dark:bg-neutral-900">
        <AlertCircle className="h-4 w-4 text-neutral-500" />
        <AlertTitle>{t("notSupportedTitle")}</AlertTitle>
        <AlertDescription>{t("notSupportedDesc")}</AlertDescription>
      </Alert>
    )
  }

  // If blocked, guide them
  if (permission === "denied") {
    return (
      <Alert
        variant="destructive"
        className="border-red-200/80 bg-red-50/80 shadow-none dark:border-red-500/20 dark:bg-red-500/10"
      >
        <BellOff className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>{t("blockedTitle")}</AlertTitle>
        <AlertDescription>{t("blockedDesc")}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/75 bg-white/55 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.04]">
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-base font-semibold text-neutral-950 dark:text-white">
          <Bell className="text-primary-500 h-4 w-4" aria-hidden="true" />
          {t("keepMeUpdated")}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{t("keepMeUpdatedDesc")}</p>
      </div>
      <div className="shrink-0">
        <Button
          variant={isSubscribed ? "outline" : "default"}
          onClick={handleToggle}
          disabled={isLoading}
          className="min-w-[110px]"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubscribed ? t("disable") : t("enable")}
        </Button>
      </div>
    </div>
  )
}
