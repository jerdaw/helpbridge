import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import OfflinePage from "@/app/[locale]/offline/page"

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(),
}))

vi.mock("@/lib/offline/cache", () => ({
  getCachedServices: vi.fn(),
}))

vi.mock("@/components/layout/Header", () => ({
  Header: () => <div data-testid="header" />,
}))

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <div data-testid="footer" />,
}))

vi.mock("@/components/services/ServiceCard", () => ({
  __esModule: true,
  default: ({ service }: { service: { name: string } }) => <div data-testid="service-card">{service.name}</div>,
}))

vi.mock("@/components/offline/OfflineSnapshotStatus", () => ({
  OfflineSnapshotStatus: () => <div data-testid="offline-snapshot-status" />,
}))

import { useTranslations } from "next-intl"
import { getCachedServices } from "@/lib/offline/cache"

describe("OfflinePage", () => {
  const mockUseTranslations = vi.mocked(useTranslations)
  const mockGetCachedServices = vi.mocked(getCachedServices)

  const mockT = vi.fn((key: string) => {
    const translations: Record<string, string> = {
      title: "You are offline",
      description: "Please reconnect to the internet to search for services.",
      heroEyebrow: "Offline mode",
      statusTitle: "Connection status",
      recentlyViewed: "Recently Viewed Services",
      cachedServicesDescription: "Recently viewed services may be available from this device.",
      emergencyContacts: "Emergency Contacts Always Available",
      emergencyNote: "Emergency phone numbers remain available without internet.",
      crisisLine: "Crisis Line",
      crisisLineDesc: "24/7 Mental Health",
      emergency: "Emergency",
      emergencyDesc: "Police / Fire / Ambulance",
      callButton: "Call",
      retryButton: "Retry Connection",
    }

    return translations[key] || key
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTranslations.mockReturnValue(mockT as any)
  })

  it("renders snapshot status and cached services when offline data exists", () => {
    mockGetCachedServices.mockReturnValue([
      {
        service: {
          id: "svc-1",
          name: "Cached Service",
        },
        score: 1,
        matchReasons: [],
      } as any,
    ])

    render(<OfflinePage />)

    expect(screen.getByText("Offline mode")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Connection status" })).toBeInTheDocument()
    expect(screen.getByTestId("offline-snapshot-status")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Emergency Contacts Always Available" })).toBeInTheDocument()
    expect(screen.getByText("Emergency phone numbers remain available without internet.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Call/ })).toHaveAttribute("href", "tel:6135444229")
    expect(screen.getByRole("link", { name: /911/ })).toHaveAttribute("href", "tel:911")
    expect(screen.getByRole("button", { name: "Retry Connection" })).toBeInTheDocument()
    expect(screen.getByText("Recently Viewed Services")).toBeInTheDocument()
    expect(screen.getByText("Recently viewed services may be available from this device.")).toBeInTheDocument()
    expect(screen.getByTestId("service-card")).toHaveTextContent("Cached Service")
  })
})
