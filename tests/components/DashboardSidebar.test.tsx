import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react"
import { createElement } from "react"
import { screen, fireEvent } from "@testing-library/react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderWithProviders } from "@/tests/utils/test-wrapper"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/dashboard"),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock useAuth
const mockSignOut = vi.fn()
vi.mock("@/components/layout/AuthProvider", () => ({
  useAuth: () => ({
    user: { email: "test@example.com" },
    signOut: mockSignOut,
  }),
}))

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: { children: ReactNode; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => createElement("img", { alt, ...props }),
}))

import { usePathname } from "next/navigation"

const messages = {
  Navigation: {
    skipToMain: "Skip to main content",
  },
  Dashboard: {
    partner: "Partner Dashboard",
    navigation: {
      overview: "Overview",
      services: "My Services",
      notifications: "Notifications",
      feedback: "Feedback",
      analytics: "Analytics",
      settings: "Settings",
      publicSite: "View Public Site",
      signOut: "Sign Out",
      roleLabel: "Organization Admin",
      openMenu: "Open workspace menu",
      closeMenu: "Close workspace menu",
    },
  },
}

describe("DashboardSidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(usePathname as import("vitest").Mock).mockReturnValue("/dashboard")
  })

  it("renders navigation links", () => {
    renderWithProviders(<DashboardSidebar />, { messages })
    expect(screen.getByText("Overview")).toBeInTheDocument()
    expect(screen.getByText("My Services")).toBeInTheDocument()
    expect(screen.getByText("Notifications")).toBeInTheDocument()
    expect(screen.getByText("Feedback")).toBeInTheDocument()
    expect(screen.getByText("Analytics")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("highlights active link", () => {
    ;(usePathname as import("vitest").Mock).mockReturnValue("/dashboard/services")
    renderWithProviders(<DashboardSidebar />, { messages })

    expect(screen.getByRole("link", { name: /My Services/ })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: /Overview/ })).not.toHaveAttribute("aria-current")
  })

  it("displays user email", () => {
    renderWithProviders(<DashboardSidebar />, { messages })
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
    expect(screen.getByText("Organization Admin")).toBeInTheDocument()
  })

  it("calls sign out", async () => {
    renderWithProviders(<DashboardSidebar />, { messages })
    const signOutButton = screen.getByText("Sign Out")
    fireEvent.click(signOutButton)
    expect(mockSignOut).toHaveBeenCalled()
  })
})
