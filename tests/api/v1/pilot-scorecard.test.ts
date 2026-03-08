import "../../setup/next-mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockRequest } from "@/tests/utils/api-test-utils"
import { GET } from "@/app/api/v1/pilot/metrics/scorecard/route"
import { PilotScorecard } from "@/types/pilot-metrics"

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, reset: 0 }),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}))

vi.mock("@/lib/pilot/auth", () => ({
  requireAuthenticatedUser: vi.fn(),
}))

vi.mock("@/lib/auth/authorization", () => ({
  assertPermission: vi.fn(),
}))

vi.mock("@/lib/pilot/storage", () => ({
  getScorecardByCycle: vi.fn(),
}))

const mockScorecard: PilotScorecard = {
  pilot_cycle_id: "v22-cycle-1",
  generated_at: "2026-03-08T16:00:00.000Z",
  m1_failed_contact_rate: 0.35,
  m2_p50_seconds_to_connection: 7000,
  m2_p75_seconds_to_connection: 8500,
  m2_p90_seconds_to_connection: 10000,
  m3_referral_completion_capture_rate: 0.58,
  m4_freshness_sla_compliance: 0.72,
  m5_repeat_failure_rate: 0.2,
  m6_data_decay_fatal_error_rate: 0.08,
  m7_preference_fit_indicator: 0.62,
}

describe("GET /api/v1/pilot/metrics/scorecard", () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { requireAuthenticatedUser } = await import("@/lib/pilot/auth")
    const { getScorecardByCycle } = await import("@/lib/pilot/storage")
    vi.mocked(requireAuthenticatedUser).mockResolvedValue({
      error: null,
      supabaseAuth: {} as any,
      user: { id: "user-1" } as any,
    })
    vi.mocked(getScorecardByCycle).mockResolvedValue({
      data: mockScorecard,
      error: null,
      missingTable: false,
    })
  })

  it("returns 400 for missing required query parameters", async () => {
    const req = createMockRequest("http://localhost/api/v1/pilot/metrics/scorecard")
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it("returns scorecard and gate evaluation when baseline params are provided", async () => {
    const req = createMockRequest(
      "http://localhost/api/v1/pilot/metrics/scorecard?pilot_cycle_id=v22-cycle-1&org_id=3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e&baseline_failed_contact_rate=0.55&baseline_p50_seconds_to_connection=10000"
    )

    const res = await GET(req)
    expect(res.status).toBe(200)
    const json = (await res.json()) as any
    expect(json.data.scorecard.pilot_cycle_id).toBe("v22-cycle-1")
    expect(json.data.gate1Evaluation).toBeTruthy()
  })

  it("returns 501 when pilot snapshots table is missing", async () => {
    const { getScorecardByCycle } = await import("@/lib/pilot/storage")
    vi.mocked(getScorecardByCycle).mockResolvedValue({
      data: null,
      error: { code: "42P01", message: "relation does not exist" },
      missingTable: true,
    })

    const req = createMockRequest(
      "http://localhost/api/v1/pilot/metrics/scorecard?pilot_cycle_id=v22-cycle-1&org_id=3e4f36f6-2b92-4fa8-af31-c7c5d75a3f5e"
    )
    const res = await GET(req)
    expect(res.status).toBe(501)
  })
})
