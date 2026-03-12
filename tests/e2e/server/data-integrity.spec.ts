import { test, expect } from "@playwright/test"

test.describe("Data Integrity & API Verification", () => {
  test("Critical services have correct scope configuration", async ({ request }) => {
    const response = await request.post("/api/v1/search/services", {
      data: {
        query: "9-8-8",
        locale: "en",
        filters: {},
        options: { limit: 10, offset: 0 },
      },
    })

    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    const service988 = json.data.find((service: { id: string }) => service.id === "crisis-988")

    expect(service988).toBeDefined()
    expect(service988.scope).toBe("canada")
  })

  test("Search API returns valid structure for all locales", async ({ request }) => {
    const locales = ["en", "fr", "ar", "zh-Hans", "es", "pa", "pt"]

    for (const locale of locales) {
      const response = await request.post("/api/v1/search/services", {
        data: {
          query: "food",
          locale,
          filters: {},
          options: { limit: 1, offset: 0 },
        },
      })

      expect(response.ok(), `API failed for locale: ${locale}`).toBeTruthy()
      const json = await response.json()
      expect(Array.isArray(json.data)).toBeTruthy()
      expect(typeof json.meta.total).toBe("number")
    }
  })
})
