import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import { renderWithProviders, screen, waitFor } from "@/tests/utils/test-wrapper"
import { FeedbackDetail } from "@/components/dashboard/FeedbackDetail"

const mockToast = vi.fn()
const refreshMock = vi.fn()
const fetchMock = vi.fn()

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}))

const messages = {
  Feedback: {
    feedbackDetail: "Feedback detail",
    receivedOn: "Received on {date}",
    service: "Service",
    general: "General",
    unknown: "Unknown",
    issueType: "Issue type",
    issueTypes: {
      wrong_contact_info: "Wrong contact info",
      not_found: "Not found",
    },
    message: "Message",
    noMessage: "No message",
    status: "Status",
    statusPending: "Pending",
    statusReviewed: "Reviewed",
    statusResolved: "Resolved",
    statusDismissed: "Dismissed",
    close: "Close",
    markResolved: "Mark resolved",
    statusUpdated: "Status updated",
    statusUpdatedMessage: "Feedback moved to {status}",
    errorTitle: "Error",
    errorMessage: "Something went wrong",
  },
} as const

describe("FeedbackDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", fetchMock)
  })

  it("shows a destructive toast when the status update fails", async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce({ ok: false })

    renderWithProviders(
      <FeedbackDetail
        open={true}
        onClose={vi.fn()}
        feedback={{
          id: "fb-1",
          service_id: "svc-123",
          feedback_type: "wrong_contact_info",
          message: "Phone number is outdated",
          status: "pending",
          created_at: "2026-03-12T10:00:00Z",
          services: { name: "Test Service" },
        }}
      />,
      { messages }
    )

    await user.selectOptions(screen.getByRole("combobox"), "resolved")

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
      )
    })
  })
})
