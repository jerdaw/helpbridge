import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import { renderWithProviders, screen, waitFor } from "@/tests/utils/test-wrapper"
import { PushOptIn } from "@/components/push/PushOptIn"

const subscribeMock = vi.fn()
const unsubscribeMock = vi.fn()
const loggerErrorMock = vi.fn()

vi.mock("@/hooks/usePushNotifications", () => ({
  usePushNotifications: vi.fn(),
}))

vi.mock("@/lib/logger", () => ({
  logger: {
    error: (...args: unknown[]) => loggerErrorMock(...args),
  },
}))

import { usePushNotifications } from "@/hooks/usePushNotifications"

const messages = {
  Settings: {
    Notifications: {
      keepMeUpdated: "Keep me updated",
      keepMeUpdatedDesc: "Receive alerts about service changes.",
      notSupportedTitle: "Not Supported",
      notSupportedDesc: "Push notifications are not supported on this device or browser.",
      blockedTitle: "Notifications Blocked",
      blockedDesc: "You have blocked notifications for this site.",
      enable: "Enable",
      disable: "Disable",
    },
  },
} as const

describe("PushOptIn", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePushNotifications).mockReturnValue({
      isConfigured: true,
      isSupported: true,
      isSubscribed: false,
      permission: "default",
      subscribe: subscribeMock,
      unsubscribe: unsubscribeMock,
    } as any)
  })

  it("renders the blocked state when browser permission is denied", () => {
    vi.mocked(usePushNotifications).mockReturnValue({
      isConfigured: true,
      isSupported: true,
      isSubscribed: false,
      permission: "denied",
      subscribe: subscribeMock,
      unsubscribe: unsubscribeMock,
    } as any)

    renderWithProviders(<PushOptIn />, { messages })

    expect(screen.getByText("Notifications Blocked")).toBeInTheDocument()
    expect(screen.getByText("You have blocked notifications for this site.")).toBeInTheDocument()
  })

  it("resets loading state when subscribe fails", async () => {
    const user = userEvent.setup()
    subscribeMock.mockRejectedValueOnce(new Error("subscription failed"))

    renderWithProviders(<PushOptIn />, { messages })

    await user.click(screen.getByRole("button", { name: "Enable" }))

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Enable" })).not.toBeDisabled()
    })

    expect(loggerErrorMock).toHaveBeenCalledWith(
      "Push notification subscription toggle failed",
      expect.any(Error),
      expect.objectContaining({
        component: "PushOptIn",
        action: "subscribe",
      })
    )
  })
})
