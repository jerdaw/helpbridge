import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react"
import { createElement } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { renderWithProviders, screen } from "@/tests/utils/test-wrapper"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"

let pathname = "/dashboard"
const pushMock = vi.fn()
const signOutMock = vi.fn()

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: pushMock }),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => createElement("img", { alt, ...props }),
}))

vi.mock("@/components/layout/AuthProvider", () => ({
  useAuth: () => ({
    user: { email: "partner@example.com" },
    signOut: signOutMock,
  }),
}))

const messages = {
  Navigation: {
    skipToMain: "Jump to work area",
  },
  Dashboard: {
    partner: "Partner workspace",
    navigation: {
      overview: "Workspace overview",
      services: "Service records",
      notifications: "Partner alerts",
      feedback: "Review queue",
      analytics: "Performance",
      settings: "Organization setup",
      publicSite: "Open public directory",
      signOut: "Leave workspace",
      roleLabel: "Verified partner",
      openMenu: "Open workspace menu",
      closeMenu: "Close workspace menu",
    },
  },
}

describe("DashboardSidebar", () => {
  beforeEach(() => {
    pathname = "/dashboard/services"
    vi.clearAllMocks()
  })

  it("renders localized navigation labels and user actions", () => {
    renderWithProviders(<DashboardSidebar />, { messages })

    expect(screen.getByText("Partner workspace")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Workspace overview/ })).toHaveAttribute("href", "/dashboard")
    expect(screen.getByRole("link", { name: /Service records/ })).toHaveAttribute("href", "/dashboard/services")
    expect(screen.getByRole("link", { name: /Review queue/ })).toHaveAttribute("href", "/dashboard/feedback")
    expect(screen.getByText("Verified partner")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Leave workspace/ })).toBeInTheDocument()
  })

  it("marks the deepest matching dashboard route as current", () => {
    renderWithProviders(<DashboardSidebar />, { messages })

    expect(screen.getByRole("link", { name: /Service records/ })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: /Workspace overview/ })).not.toHaveAttribute("aria-current")
  })
})
