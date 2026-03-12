"use client"

import { useEffect, useState, useRef } from "react"
import { env } from "@/lib/env"
import { logger } from "@/lib/logger"

type OneSignalClient = (typeof import("react-onesignal"))["default"]

interface UsePushNotificationsOptions {
  enabled?: boolean
}

export function usePushNotifications({ enabled = true }: UsePushNotificationsOptions = {}) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const initRef = useRef(false)
  const initPromiseRef = useRef<Promise<void> | null>(null)
  const oneSignalRef = useRef<OneSignalClient | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const hasBrowserSupport = "serviceWorker" in navigator && "PushManager" in window
    const hasAppId = Boolean(env.NEXT_PUBLIC_ONESIGNAL_APP_ID)

    setIsSupported(hasBrowserSupport && hasAppId)
    setPermission(Notification.permission)
  }, [])

  const initializeOneSignal = async () => {
    if (typeof window === "undefined" || initRef.current) {
      return
    }

    if (initPromiseRef.current) {
      await initPromiseRef.current
      return
    }

    initPromiseRef.current = (async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          setIsSupported(false)
          return
        }

        if (!env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
          setIsSupported(false)
          logger.warn("[OneSignal] App ID not found")
          return
        }

        const { default: OneSignal } = await import("react-onesignal")
        await OneSignal.init({
          appId: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true, // For dev
        })

        oneSignalRef.current = OneSignal
        initRef.current = true

        // Initial state check
        const permissionState = Notification.permission
        setPermission(permissionState)

        if (permissionState === "granted") {
          // Check if we have a subscription ID
          const id = await OneSignal.User.PushSubscription.id
          setIsSubscribed(!!id)
        }

        // Listeners for changes
        OneSignal.User.PushSubscription.addEventListener("change", (e) => {
          setIsSubscribed(!!e.current.id)
        })
      } catch (err) {
        logger.error("[OneSignal] Init failed", err)
        setIsSupported(false)
      } finally {
        initPromiseRef.current = null
      }
    })()

    await initPromiseRef.current
  }

  useEffect(() => {
    if (!enabled || !isSupported || initRef.current) return

    void initializeOneSignal()
  }, [enabled, isSupported])

  /**
   * Request permission and subscribe
   */
  const subscribe = async () => {
    await initializeOneSignal()

    const oneSignal = oneSignalRef.current
    if (!oneSignal) return

    try {
      // 1. Request Browser Permission
      await oneSignal.Notifications.requestPermission()

      // 2. Opt In (if not auto-subscribed)
      const pushSubscription = oneSignal.User?.PushSubscription
      if (pushSubscription) {
        await pushSubscription.optIn()
      }

      setPermission(Notification.permission)
    } catch (err) {
      logger.error("[OneSignal] Subscription failed", err)
    }
  }

  /**
   * Unsubscribe (Opt Out)
   */
  const unsubscribe = async () => {
    await initializeOneSignal()

    const oneSignal = oneSignalRef.current
    if (!oneSignal) return

    try {
      const pushSubscription = oneSignal.User?.PushSubscription
      if (pushSubscription) {
        await pushSubscription.optOut()
        setIsSubscribed(false)
      }
    } catch (err) {
      logger.error("[OneSignal] Unsubscribe failed", err)
    }
  }

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    OneSignal: oneSignalRef.current, // Export instance if needed elsewhere
  }
}
