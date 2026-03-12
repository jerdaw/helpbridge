import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget"
import { TestWrapper } from "@/tests/utils/test-wrapper"
import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { queueFeedback } from "@/lib/offline/feedback"

const mockToast = vi.fn()
const mockLoggerError = vi.fn()
const fetchMock = vi.fn()

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

vi.mock("@/hooks/useNetworkStatus", () => ({
  useNetworkStatus: vi.fn(),
}))

vi.mock("@/lib/offline/feedback", () => ({
  queueFeedback: vi.fn(),
}))

vi.mock("@/lib/logger", () => ({
  logger: {
    error: (...args: unknown[]) => mockLoggerError(...args),
  },
}))

global.fetch = fetchMock as typeof fetch

const messages = {
  Feedback: {
    widgetTitle: "Was this helpful?",
    widgetSubtitle: "Help us improve",
    yes: "Yes",
    no: "No",
    reportIssue: "Report Problem",
    alreadyVotedMessage: "Thanks for voting!",
    voteSuccessTitle: "Vote saved",
    voteSuccessMessage: "Your vote was recorded",
    errorTitle: "Error",
    errorMessage: "Something went wrong",
    reportIssueTitle: "Report Issue",
    reportIssueDescription: "Help us improve {service}",
    issueTypeLabel: "Issue Type",
    issueTypes: {
      wrong_contact_info: "Wrong contact info",
      service_closed: "Service closed",
      eligibility_incorrect: "Eligibility incorrect",
      other: "Other",
    },
    detailsLabel: "Details",
    detailsPlaceholder: "Tell us what needs fixing",
    cancel: "Cancel",
    submitReport: "Submit report",
    issueReportedTitle: "Issue reported",
    issueReportedMessage: "Thanks for flagging this",
  },
  Offline: {
    savedForLater: "Saved for later",
    savedMessage: "We will sync this when you are back online",
  },
} as const

describe("FeedbackWidget Component", () => {
  const serviceId = "svc-123"
  const serviceName = "Test Service"
  const mockUseNetworkStatus = vi.mocked(useNetworkStatus)
  const mockQueueFeedback = vi.mocked(queueFeedback)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseNetworkStatus.mockReturnValue({
      isOnline: true,
      isOffline: false,
      connectionType: "unknown",
    })
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })
  })

  it("renders with vote buttons", () => {
    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    expect(screen.getByText("Was this helpful?")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument()
  })

  it("submits helpful vote", async () => {
    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("button", { name: "Yes" }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/feedback",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            service_id: serviceId,
            feedback_type: "helpful_yes",
          }),
        })
      )
    })

    expect(await screen.findByText("Thanks for voting!")).toBeInTheDocument()
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Vote saved",
        description: "Your vote was recorded",
      })
    )
  })

  it("handles vote fetch error", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ success: false }),
    })

    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("button", { name: "Yes" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" }))
    })
  })

  it("opens the canonical issue dialog from the widget", () => {
    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("button", { name: /Report Problem/i }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Report Issue")).toBeInTheDocument()
  })

  it("submits an issue report through /api/v1/feedback", async () => {
    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("button", { name: /Report Problem/i }))
    fireEvent.click(screen.getByLabelText("Wrong contact info"))
    fireEvent.change(screen.getByLabelText("Details"), { target: { value: "Phone number is outdated" } })
    fireEvent.click(screen.getByRole("button", { name: "Submit report" }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/feedback",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            service_id: serviceId,
            feedback_type: "issue",
            message: "[Type: wrong_contact_info] Phone number is outdated",
          }),
        })
      )
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Issue reported",
        description: "Thanks for flagging this",
      })
    )
  })

  it("shows an error toast when issue submission fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ success: false, message: "Failed" }),
    })

    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("button", { name: /Report Problem/i }))
    fireEvent.change(screen.getByLabelText("Details"), { target: { value: "This service is closed" } })
    fireEvent.click(screen.getByRole("button", { name: "Submit report" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" }))
    })

    expect(mockLoggerError).toHaveBeenCalledWith(
      "Issue report submission failed",
      expect.any(Error),
      expect.objectContaining({
        component: "ReportIssueModal",
        serviceId,
      })
    )
  })

  it("queues issue reports while offline", async () => {
    mockUseNetworkStatus.mockReturnValue({
      isOnline: false,
      isOffline: true,
      connectionType: "none",
    })

    render(
      <TestWrapper messages={messages as any}>
        <FeedbackWidget serviceId={serviceId} serviceName={serviceName} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("button", { name: /Report Problem/i }))
    fireEvent.change(screen.getByLabelText("Details"), { target: { value: "Eligibility info is missing" } })
    fireEvent.click(screen.getByRole("button", { name: "Submit report" }))

    await waitFor(() => {
      expect(mockQueueFeedback).toHaveBeenCalledWith({
        feedback_type: "issue",
        service_id: serviceId,
        message: "[Type: other] Eligibility info is missing",
        category_searched: "",
      })
    })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Saved for later",
        description: "We will sync this when you are back online",
      })
    )
  })
})
