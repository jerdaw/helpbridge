import { describe, it, expect } from "vitest"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { renderWithProviders, screen } from "@/tests/utils/test-wrapper"
import AboutTrustOverview from "@/components/about/AboutTrustOverview"
import enMessages from "@/messages/en.json"

function AboutCopyProbe() {
  const t = useTranslations("About")

  return (
    <section>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
      <Link href="/">{t("hero.primaryCta")}</Link>
      <Link href="/about/partners">{t("hero.secondaryCta")}</Link>
    </section>
  )
}

describe("About page surfaces", () => {
  it("renders current About hero copy without stale milestone language", () => {
    renderWithProviders(<AboutCopyProbe />, { messages: enMessages })

    expect(screen.getByRole("heading", { name: /private directory/i })).toBeInTheDocument()
    expect(screen.getByText(/without accounts, tracking, or extra steps/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Search services" })).toHaveAttribute("href", "/")
    expect(screen.queryByText(/Kingston 150/i)).not.toBeInTheDocument()
  })

  it("renders trust and boundary content as one cohesive About surface", () => {
    renderWithProviders(<AboutTrustOverview />, { messages: enMessages })

    expect(screen.getByRole("heading", { name: "Built for verified, private discovery" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Reference sources/i })).toHaveAttribute("href", "/en/about/partners")
    expect(screen.getByRole("heading", { name: "What CareConnect does and doesn't do" })).toBeInTheDocument()
    expect(screen.getByText("Search verified social-service listings")).toBeInTheDocument()
    expect(screen.getByText("Guarantee hours, eligibility, or real-time availability")).toBeInTheDocument()
  })
})
