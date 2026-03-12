import { test, expect } from "@playwright/test"
import { mockSupabase } from "./utils"

/**
 * Multi-lingual Expansion & Provincial Services E2E Tests
 *
 * These tests validate comprehensive locale switching and provincial service badges.
 * Basic language switching is covered by language.spec.ts.
 * See: docs/development/testing-guidelines.md#tiered-testing
 */
test.describe("Multi-lingual Expansion & Provincial Services", () => {
  const locales = [
    { code: "en", label: "English", searchLabel: "Search for services", hasDisclaimer: false },
    { code: "fr", label: "Français (CA)", searchLabel: "Rechercher des services", hasDisclaimer: false },
    { code: "ar", label: "العربية", searchLabel: "البحث عن الخدمات", hasDisclaimer: true },
    { code: "zh-Hans", label: "中文", searchLabel: "搜索服务", hasDisclaimer: true },
    { code: "es", label: "Español", searchLabel: "Buscar servicios", hasDisclaimer: true },
    { code: "pa", label: "ਪੰਜਾਬੀ", searchLabel: "ਸੇਵਾਵਾਂ ਦੀ ਖੋਜ ਕਰੋ", hasDisclaimer: true },
    { code: "pt", label: "Português", searchLabel: "Pesquisar serviços", hasDisclaimer: true },
  ]

  test.beforeEach(async ({ page }) => {
    await mockSupabase(page)
  })

  test("Language selector switches locales and updates UI labels", async ({ page }) => {
    for (const locale of locales.filter((entry) => entry.code !== "en")) {
      await page.goto("/en")
      await page.waitForURL(/\/en/)
      await page.getByRole("button", { name: "Select Language" }).click()
      await page.getByRole("button", { name: locale.label }).click()
      await expect(page).toHaveURL(new RegExp(`/${locale.code}`))
      await expect(page.getByRole("textbox", { name: locale.searchLabel })).toBeVisible()

      if (locale.hasDisclaimer) {
        await expect(page.getByRole("status")).toBeVisible()
      } else {
        await expect(page.getByRole("status")).not.toBeVisible()
      }

      if (locale.code === "ar") {
        const html = page.locator("html")
        await expect(html).toHaveAttribute("dir", "rtl")
      }
    }
  })

  test("Provincial crisis lines are visible and labeled", async ({ page }) => {
    await page.goto("/en")
    await page.waitForURL(/\/en/)
    const searchInput = page.getByRole("textbox", { name: /search for services/i })
    await searchInput.fill("Kids Help Phone")
    await searchInput.press("Enter")
    const card = page.locator(".service-card-print").filter({ hasText: "Kids Help Phone" }).first()
    await expect(card).toBeVisible({ timeout: 15000 })
    await expect(card.getByText("Canada-wide")).toBeVisible()
  })
})
