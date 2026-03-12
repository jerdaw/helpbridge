import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SimplifiedServiceView } from "@/components/services/SimplifiedServiceView"
import { mockService } from "@/tests/utils/mocks"

const pushMock = vi.fn()
const fetchMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/en/service/test-service-id",
  useSearchParams: () => new URLSearchParams("view=simple"),
}))

describe("SimplifiedServiceView", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", fetchMock)
  })

  it("renders the summary response and returns to the standard view", async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        success: true,
        data: {
          summary_en: "Short summary",
          how_to_use_en: "Call first",
          reviewed_at: "2026-03-12T10:00:00Z",
        },
      }),
    })

    render(
      <SimplifiedServiceView
        service={mockService}
        locale="en"
        translations={{
          standardView: "Standard view",
          whatIsIt: "What is it?",
          howToGetHelp: "How to get help",
          callUs: "Call us",
          visitUs: "Visit us",
          openHours: "Open hours",
          summaryComingSoon: "Summary coming soon",
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("Short summary")).toBeInTheDocument()
      expect(screen.getByText("Call first")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /Standard view/i }))
    expect(pushMock).toHaveBeenCalledWith("/en/service/test-service-id?")
  })
})
