import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderWithProviders, screen, waitFor } from "@/tests/utils/test-wrapper"
import { ReindexProgress } from "@/components/admin/ReindexProgress"

const fetchMock = vi.fn()

const messages = {
  Admin: {
    reindex: {
      title: "Reindex in progress",
      description: "{totalServices} services queued",
      status: {
        running: "Running",
        complete: "Complete",
        error: "Error",
        cancelled: "Cancelled",
        unknown: "Unknown",
      },
      labels: {
        processedServices: "{processed} of {total}",
        elapsed: "Elapsed {duration}",
        completedIn: "Completed in {duration}",
        error: "Error:",
        success: "Done:",
      },
      errors: {
        fetchProgress: "Failed to fetch progress",
        loadProgress: "Failed to load progress: {error}",
        unknown: "Unknown error",
        fetchHistory: "Failed to fetch history",
      },
      success: {
        allEmbeddingsGenerated: "All embeddings generated",
      },
      duration: {
        seconds: "{seconds}s",
        minutesSeconds: "{minutes}m {seconds}s",
      },
    },
  },
} as const

describe("ReindexProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", fetchMock)
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    })
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders a terminal progress state and calls onComplete", async () => {
    const onComplete = vi.fn()
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: "progress-1",
        status: "complete",
        totalServices: 10,
        processedCount: 10,
        progressPercentage: 100,
        startedAt: "2026-03-12T10:00:00Z",
        elapsedSeconds: 12,
        durationSeconds: 12,
      }),
    })

    renderWithProviders(<ReindexProgress progressId="progress-1" onComplete={onComplete} />, { messages })

    await waitFor(() => {
      expect(screen.getByText("Complete")).toBeInTheDocument()
      expect(screen.getByText("All embeddings generated")).toBeInTheDocument()
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("renders an error state when polling fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    })

    renderWithProviders(<ReindexProgress progressId="progress-1" />, { messages })

    await waitFor(() => {
      expect(screen.getByText("Failed to load progress: Failed to fetch progress")).toBeInTheDocument()
    })
  })
})
