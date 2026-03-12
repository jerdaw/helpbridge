import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import { renderWithProviders, screen, waitFor } from "@/tests/utils/test-wrapper"
import { ProfileSettings } from "@/components/settings/ProfileSettings"

const updateAgeGroup = vi.fn()
const toggleIdentity = vi.fn()
const optIn = vi.fn()
const optOut = vi.fn()
const subscribe = vi.fn()
const unsubscribe = vi.fn()
const toggleHighContrast = vi.fn()
const loggerError = vi.fn()

vi.mock("@/hooks/useUserContext", () => ({
  useUserContext: vi.fn(),
}))

vi.mock("@/hooks/usePushNotifications", () => ({
  usePushNotifications: vi.fn(),
}))

vi.mock("@/hooks/useHighContrast", () => ({
  useHighContrast: vi.fn(),
}))

vi.mock("@/lib/logger", () => ({
  logger: {
    error: (...args: unknown[]) => loggerError(...args),
  },
}))

import { useUserContext } from "@/hooks/useUserContext"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { useHighContrast } from "@/hooks/useHighContrast"

const messages = {
  Settings: {
    personalizePrompt: "Personalize my results",
    enablePersonalization: "Enable personalization",
    personalizeDescription: "Add personal filters to search.",
    ageGroup: "Age group",
    ageGroups: {
      youth: "Youth (13-24)",
      adult: "Adult (25-64)",
      senior: "Senior (65+)",
    },
    identities: "I identify as...",
    identityTags: {
      indigenous: "Indigenous",
      newcomer: "Newcomer to Canada",
      "2slgbtqi+": "2SLGBTQI+",
      veteran: "Veteran",
      disability: "Person with disability",
    },
    clearProfile: "Clear My Profile",
    Notifications: {
      title: "Notifications",
      enable: "Enable",
    },
  },
  Accessibility: {
    title: "Accessibility",
    highContrast: "High contrast",
  },
} as const

describe("ProfileSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUserContext).mockReturnValue({
      context: {
        ageGroup: null,
        identities: [],
        hasOptedIn: true,
      },
      updateAgeGroup,
      toggleIdentity,
      optIn,
      optOut,
    } as any)
    vi.mocked(usePushNotifications).mockReturnValue({
      isConfigured: true,
      isSupported: true,
      isSubscribed: false,
      subscribe,
      unsubscribe,
    } as any)
    vi.mocked(useHighContrast).mockReturnValue({
      isHighContrast: false,
      toggleHighContrast,
    } as any)
  })

  it("opens the personalization panel and updates settings", async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileSettings />, { messages })

    await user.click(screen.getByRole("button", { name: "Personalize my results" }))
    await user.click(screen.getByRole("button", { name: "Youth" }))
    await user.click(screen.getByRole("button", { name: "Indigenous" }))
    const offButtons = screen.getAllByRole("button", { name: "Off" })
    await user.click(offButtons[0]!)
    await user.click(offButtons[1]!)
    await user.click(screen.getByRole("button", { name: "Clear My Profile" }))

    expect(updateAgeGroup).toHaveBeenCalledWith("youth")
    expect(toggleIdentity).toHaveBeenCalledWith("indigenous")
    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(toggleHighContrast).toHaveBeenCalledTimes(1)
    expect(optOut).toHaveBeenCalledTimes(1)
  })

  it("resets loading when notification subscribe fails", async () => {
    const user = userEvent.setup()
    subscribe.mockRejectedValueOnce(new Error("push failure"))

    renderWithProviders(<ProfileSettings />, { messages })

    await user.click(screen.getByRole("button", { name: "Personalize my results" }))
    const offButtons = screen.getAllByRole("button", { name: "Off" })
    await user.click(offButtons[0]!)

    await waitFor(() => {
      expect(offButtons[0]).not.toBeDisabled()
    })

    expect(loggerError).toHaveBeenCalledWith(
      "Profile settings notification toggle failed",
      expect.any(Error),
      expect.objectContaining({
        component: "ProfileSettings",
        action: "subscribe",
      })
    )
  })
})
