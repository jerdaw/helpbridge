import { NextRequest } from "next/server"
import { z } from "zod"
import { createApiError, createApiResponse, handleApiError } from "@/lib/api-utils"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"
import { requireAuthenticatedUser } from "@/lib/pilot/auth"
import { assertPermission } from "@/lib/auth/authorization"
import { getScorecardByCycle } from "@/lib/pilot/storage"
import { evaluateGate1Thresholds } from "@/lib/observability/pilot-metrics"

const QuerySchema = z.object({
  pilot_cycle_id: z.string().min(1),
  org_id: z.string().uuid(),
  baseline_failed_contact_rate: z.coerce.number().min(0).max(1).optional(),
  baseline_p50_seconds_to_connection: z.coerce.number().positive().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(getClientIp(request), 30, 60 * 1000)
    if (!rateLimit.success) {
      return createApiError("Rate limit exceeded", 429)
    }

    const auth = await requireAuthenticatedUser()
    if (auth.error || !auth.supabaseAuth || !auth.user) {
      return auth.error ?? createApiError("Unauthorized", 401)
    }

    const url = new URL(request.url)
    const validation = QuerySchema.safeParse({
      pilot_cycle_id: url.searchParams.get("pilot_cycle_id"),
      org_id: url.searchParams.get("org_id"),
      baseline_failed_contact_rate: url.searchParams.get("baseline_failed_contact_rate") ?? undefined,
      baseline_p50_seconds_to_connection: url.searchParams.get("baseline_p50_seconds_to_connection") ?? undefined,
    })

    if (!validation.success) {
      return createApiError("Invalid scorecard query parameters", 400, validation.error.flatten())
    }

    const query = validation.data
    await assertPermission(auth.supabaseAuth, auth.user.id, query.org_id, "canViewAnalytics")

    const storage = await getScorecardByCycle(auth.supabaseAuth, query.pilot_cycle_id, query.org_id)

    if (storage.missingTable) {
      return createApiError("Pilot storage not ready: missing pilot_metric_snapshots table", 501)
    }

    if (storage.error) {
      return createApiError("Failed to retrieve pilot scorecard", 500, storage.error.message)
    }

    if (!storage.data) {
      return createApiError("Pilot scorecard not found", 404)
    }

    const responseData: Record<string, unknown> = {
      scorecard: storage.data,
    }

    if (query.baseline_failed_contact_rate !== undefined && query.baseline_p50_seconds_to_connection !== undefined) {
      responseData.gate1Evaluation = evaluateGate1Thresholds(
        storage.data,
        query.baseline_failed_contact_rate,
        query.baseline_p50_seconds_to_connection
      )
    }

    return createApiResponse(responseData, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return handleApiError(error)
  }
}
