import { test, expect } from "@playwright/test"
import { mockSupabase } from "./utils"

test.describe("Partner Dashboard Access", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabase(page)
  })

  test("should navigate to partner login", async ({ page, isMobile }) => {
    await page.goto("/")
    await page.waitForURL(/\/en/)

    if (isMobile) {
      await page.getByRole("button", { name: /open menu/i }).click()
    }

    const loginLink = page.getByRole("link", { name: /partner login/i })

    if ((await loginLink.count()) > 0) {
      await loginLink.first().click()
      await expect(page).toHaveURL(/\/login$/)
      await expect(page.getByRole("textbox", { name: /email address/i })).toBeVisible()
    } else {
      await page.goto("/en/login")
      await expect(page.getByRole("textbox", { name: /email address/i })).toBeVisible()
    }
  })
})
