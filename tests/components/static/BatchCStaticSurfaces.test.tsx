import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import enMessages from "@/messages/en.json"
import PrivacyPage from "@/app/[locale]/privacy/page"
import TermsPage from "@/app/[locale]/terms/page"
import ContentPolicyPage from "@/app/[locale]/content-policy/page"
import PartnerTermsPage from "@/app/[locale]/partner-terms/page"
import AccessibilityPage from "@/app/[locale]/accessibility/page"
import { StaticPageShell } from "@/components/layout/StaticPageShell"
import { renderWithProviders } from "@/tests/utils/test-wrapper"

vi.mock("@/components/layout/Header", () => ({
  Header: () => <header data-testid="static-header" />,
}))

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="static-footer" />,
}))

vi.mock("@/components/ui/section", () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
}))

describe("Batch C static surfaces", () => {
  it("renders the shared shell with polished page structure", () => {
    render(
      <StaticPageShell eyebrow="Policy" title="Static Page" description="A polished description." meta="Last reviewed">
        <p>Article body</p>
      </StaticPageShell>
    )

    expect(screen.getByTestId("static-header")).toBeInTheDocument()
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
    expect(screen.getByText("Policy")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Static Page" })).toBeInTheDocument()
    expect(screen.getByText("A polished description.")).toBeInTheDocument()
    expect(screen.getByText("Last reviewed")).toBeInTheDocument()
    expect(screen.getByText("Article body")).toBeInTheDocument()
    expect(screen.getByTestId("static-footer")).toBeInTheDocument()
  })

  it("renders privacy policy copy with stable review date and contact address", () => {
    renderWithProviders(<PrivacyPage />, { messages: enMessages })

    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument()
    expect(screen.getByText("Last reviewed: May 1, 2026")).toBeInTheDocument()
    expect(screen.getByText("AI Assistant Privacy")).toBeInTheDocument()
    expect(screen.getByText("Information You Provide")).toBeInTheDocument()
    expect(screen.queryByText(/\*\*Information You Provide\*\*/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/privacy@careconnect\.ing/)[0]).toBeInTheDocument()
  })

  it("renders terms and emergency boundary copy without a dynamic date", () => {
    renderWithProviders(<TermsPage />, { messages: enMessages })

    expect(screen.getByRole("heading", { name: "Terms of Service" })).toBeInTheDocument()
    expect(screen.getByText("Last reviewed: May 1, 2026")).toBeInTheDocument()
    expect(screen.getByText("Emergency Services Disclaimer")).toBeInTheDocument()
    expect(screen.getByText(/THIS IS NOT AN EMERGENCY SERVICE/)).toBeInTheDocument()
  })

  it("renders content and partner policy surfaces", () => {
    renderWithProviders(
      <>
        <ContentPolicyPage />
        <PartnerTermsPage />
      </>,
      { messages: enMessages }
    )

    expect(screen.getByRole("heading", { name: "Content Moderation Policy" })).toBeInTheDocument()
    expect(screen.getByText("Prohibited Content")).toBeInTheDocument()
    expect(screen.getByText("Reporting Process")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Partner Terms of Service" })).toBeInTheDocument()
    expect(screen.getByText("Identity Verification")).toBeInTheDocument()
  })

  it("renders accessibility commitments in the shared shell", () => {
    renderWithProviders(<AccessibilityPage />, { messages: enMessages })

    expect(screen.getByRole("heading", { name: "Accessibility Policy" })).toBeInTheDocument()
    expect(screen.getByText("Last reviewed: May 1, 2026")).toBeInTheDocument()
    expect(screen.getAllByText(/WCAG/).length).toBeGreaterThan(0)
    expect(screen.getByText("Multi-Year Accessibility Plan")).toBeInTheDocument()
  })
})
