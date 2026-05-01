import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import { renderWithProviders, screen } from "@/tests/utils/test-wrapper"
import SettingsPage from "@/app/[locale]/settings/page"

const updateAgeGroup = vi.fn()
const toggleIdentity = vi.fn()
const optIn = vi.fn()
const optOut = vi.fn()
const toggleHighContrast = vi.fn()
const subscribe = vi.fn()
const unsubscribe = vi.fn()
const loggerError = vi.fn()
const isPushNotificationsConfigured = vi.fn()

vi.mock("@/components/layout/Header", () => ({
  Header: () => <header data-testid="settings-header" />,
}))

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="settings-footer" />,
}))

vi.mock("@/hooks/useNetworkStatus", () => ({
  useNetworkStatus: vi.fn(),
}))

vi.mock("@/hooks/useUserContext", () => ({
  useUserContext: vi.fn(),
}))

vi.mock("@/hooks/useHighContrast", () => ({
  useHighContrast: vi.fn(),
}))

vi.mock("@/hooks/usePushNotifications", () => ({
  isPushNotificationsConfigured: () => isPushNotificationsConfigured(),
  usePushNotifications: vi.fn(),
}))

vi.mock("@/lib/logger", () => ({
  logger: {
    error: (...args: unknown[]) => loggerError(...args),
  },
}))

import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { useUserContext } from "@/hooks/useUserContext"
import { useHighContrast } from "@/hooks/useHighContrast"
import { usePushNotifications } from "@/hooks/usePushNotifications"

const messages = {
  Settings: {
    title: "Settings",
    description: "Manage preferences that stay on this device.",
    heroEyebrow: "Device settings",
    connectionStatus: "Connection Status",
    onlineMessage: "You are currently online.",
    offlineMessage: "You are currently offline. Using cached data.",
    connectionType: "Connection: {type}",
    connectionTypes: {
      wifi: "Wi-Fi",
      cellular: "Cellular",
      none: "No connection",
      unknown: "Browser managed",
    },
    privacyTitle: "Private by default",
    privacyItems: {
      device: "Preferences are saved on this device.",
      privacy: "Personalization choices are local.",
      offline: "Connection status explains cached service information.",
    },
    personalization: {
      title: "Personalization",
      description: "Choose optional context.",
      activeCount: "{count, plural, =0 {No active choices} one {# active choice} other {# active choices}}",
      localOnly: "These choices stay in your browser.",
    },
    personalizePrompt: "Personalize your results",
    personalizeDescription: "Share your situation to see services you might qualify for.",
    enablePersonalization: "Enable Personalization",
    ageGroup: "Age Group",
    ageGroups: {
      youth: "Youth",
      adult: "Adult",
      senior: "Senior",
    },
    identities: "Identity",
    identityTags: {
      indigenous: "Indigenous",
      newcomer: "Newcomer",
      "2slgbtqi+": "2SLGBTQI+",
      veteran: "Veteran",
      disability: "Disability",
    },
    clearProfile: "Clear My Profile",
    accessibility: {
      title: "Accessibility",
      description: "Increase contrast.",
    },
    Notifications: {
      title: "Notifications",
      description: "Optional browser notifications.",
      keepMeUpdated: "Keep me updated",
      keepMeUpdatedDesc: "Receive alerts about service changes.",
      notSupportedTitle: "Not Supported",
      notSupportedDesc: "Push notifications are not supported on this browser.",
      blockedTitle: "Notifications Blocked",
      blockedDesc: "You have blocked notifications for this site.",
      enable: "Enable",
      disable: "Disable",
      notConfiguredDesc: "Notifications are not configured for this environment.",
    },
  },
  Accessibility: {
    title: "Accessibility",
    highContrast: "High Contrast Mode",
  },
} as const

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isPushNotificationsConfigured.mockReturnValue(false)
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: true,
      isOffline: false,
      connectionType: "unknown",
    })
    vi.mocked(useUserContext).mockReturnValue({
      context: {
        ageGroup: null,
        identities: [],
        hasOptedIn: false,
      },
      updateAgeGroup,
      toggleIdentity,
      optIn,
      optOut,
    } as never)
    vi.mocked(useHighContrast).mockReturnValue({
      isHighContrast: false,
      toggleHighContrast,
    })
    vi.mocked(usePushNotifications).mockReturnValue({
      isConfigured: false,
      isSupported: false,
      isSubscribed: false,
      permission: "default",
      subscribe,
      unsubscribe,
    } as never)
  })

  it("renders the public settings hub", () => {
    renderWithProviders(<SettingsPage />, { messages })

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument()
    expect(screen.getByText("Private by default")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Personalization" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Accessibility" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Connection Status" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument()
    expect(screen.getByText("Notifications are not configured for this environment.")).toBeInTheDocument()
  })

  it("enables personalization and updates local profile choices", async () => {
    const user = userEvent.setup()

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
    } as never)

    renderWithProviders(<SettingsPage />, { messages })

    await user.click(screen.getByRole("button", { name: "Adult" }))
    await user.click(screen.getByRole("button", { name: "Indigenous" }))
    await user.click(screen.getByRole("button", { name: "Clear My Profile" }))

    expect(updateAgeGroup).toHaveBeenCalledWith("adult")
    expect(toggleIdentity).toHaveBeenCalledWith("indigenous")
    expect(optOut).toHaveBeenCalledTimes(1)
  })

  it("offers personalization opt-in before local choices are shown", async () => {
    const user = userEvent.setup()

    renderWithProviders(<SettingsPage />, { messages })

    await user.click(screen.getByRole("button", { name: "Enable Personalization" }))

    expect(optIn).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("button", { name: "Adult" })).not.toBeInTheDocument()
  })

  it("toggles high contrast mode", async () => {
    const user = userEvent.setup()

    renderWithProviders(<SettingsPage />, { messages })

    await user.click(screen.getByRole("switch", { name: "High Contrast Mode" }))

    expect(toggleHighContrast).toHaveBeenCalledTimes(1)
  })

  it("renders offline connection state", () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      isOnline: false,
      isOffline: true,
      connectionType: "none",
    })

    renderWithProviders(<SettingsPage />, { messages })

    expect(screen.getByText("You are currently offline. Using cached data.")).toBeInTheDocument()
    expect(screen.getByText("No connection")).toBeInTheDocument()
  })

  it("renders configured notification blocked state", () => {
    isPushNotificationsConfigured.mockReturnValue(true)
    vi.mocked(usePushNotifications).mockReturnValue({
      isConfigured: true,
      isSupported: true,
      isSubscribed: false,
      permission: "denied",
      subscribe,
      unsubscribe,
    } as never)

    renderWithProviders(<SettingsPage />, { messages })

    expect(screen.getByText("Notifications Blocked")).toBeInTheDocument()
    expect(screen.getByText("You have blocked notifications for this site.")).toBeInTheDocument()
  })
})
