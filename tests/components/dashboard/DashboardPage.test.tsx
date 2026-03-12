import type { ReactNode } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import DashboardPage from "@/app/[locale]/dashboard/page"

const redirectMock = vi.fn()
const getUserMock = vi.fn()

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    redirectMock(...args)
    throw new Error("NEXT_REDIRECT")
  },
}))

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: getUserMock,
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ count: 2 }),
        })),
      })),
    })),
  })),
}))

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}))

vi.mock("@/components/dashboard/DashboardPageHeader", () => ({
  DashboardPageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="dashboard-header">
      {title}:{subtitle}
    </div>
  ),
}))

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}))

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects unauthenticated users to /login", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } })

    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT")

    expect(redirectMock).toHaveBeenCalledWith("/login")
  })

  it("renders the dashboard summary for authenticated users", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1", email: "user@example.com" } } })

    const page = await DashboardPage()
    render(page)

    expect(screen.getByTestId("dashboard-header")).toHaveTextContent("welcomeTitle:welcomeSubtitle")
    expect(screen.getByText("2")).toBeInTheDocument()
  })
})
