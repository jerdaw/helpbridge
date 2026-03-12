import { test, expect } from "@playwright/test"

test("service worker is registered in the production browser flow", async ({ page }) => {
  await page.goto("/en")
  await page.waitForLoadState("domcontentloaded")

  await page.waitForFunction(async () => {
    if (!("serviceWorker" in navigator)) {
      return false
    }

    const registrations = await navigator.serviceWorker.getRegistrations()
    return registrations.length > 0
  })

  const registrationCount = await page.evaluate(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations()
    return registrations.length
  })

  expect(registrationCount).toBeGreaterThan(0)
})
