import { test, expect } from "@playwright/test"

test.describe("About & Partners Pages", () => {
  test.setTimeout(60000) // Increase timeout for initial compilation

  test("About page loads and displays key sections", async ({ page }) => {
    await page.goto("/about")
    await page.waitForLoadState("domcontentloaded") // Wait for DOM readiness instead of network idle

    // Check Hero
    await expect(
      page.getByRole("heading", { name: "A private directory for finding verified support in Kingston" })
    ).toBeVisible()

    // Check Sections
    await expect(page.getByRole("heading", { name: "Built for verified, private discovery" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "What CareConnect does and doesn't do" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "How the directory is maintained" })).toBeVisible()

    // Check CTA
    await expect(page.getByRole("heading", { name: "Start with the directory" })).toBeVisible()
  })

  test("Reference sources page loads and displays source cards", async ({ page }) => {
    await page.goto("/about/partners")

    // Check Hero
    await expect(page.getByRole("heading", { name: "How CareConnect reviews source information" })).toBeVisible()

    // Check Reference Source Cards
    await expect(page.getByText("211 Ontario")).toBeVisible()
    await expect(page.getByText("City of Kingston")).toBeVisible()
    await expect(page.getByText("United Way KFL&A")).toBeVisible()

    // Check Verification Process
    await expect(page.getByRole("heading", { name: "How references become verified listings" })).toBeVisible()
    await expect(page.getByText("Revisit active listings")).toBeVisible()
  })

  test("Navigation links work", async ({ page, isMobile }) => {
    await page.goto("/")
    await page.waitForURL(/\/en/)

    if (isMobile) {
      await page.getByRole("button", { name: "Open menu" }).click()
    }
    await page.locator('a[href$="/about"]').first().click()
    await expect(page).toHaveURL(/\/about$/)

    await page.getByRole("link", { name: "View Reference Sources" }).click()
    await expect(page.getByRole("heading", { name: "How CareConnect reviews source information" })).toBeVisible()
    await expect(page).toHaveURL(/\/about\/partners$/)

    await page.getByRole("contentinfo").getByRole("link", { name: "About Us" }).click()
    await expect(page).toHaveURL(/\/about$/)
  })
})
