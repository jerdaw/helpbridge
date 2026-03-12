import { NextRequest } from "next/server"
import { createApiError, createApiResponse, handleApiError, validateContentType } from "@/lib/api-utils"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"
import { requireAuthenticatedUser } from "@/lib/pilot/auth"
import { IntegrationFeasibilityDecisionSchema } from "@/lib/schemas/integration-feasibility"
import { isUserAdmin } from "@/lib/auth/authorization"
import { insertIntegrationDecision } from "@/lib/pilot/storage"

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(getClientIp(request), 10, 60 * 1000, "api:v1:pilot:integration-feasibility")
    if (!rateLimit.success) {
      return createApiError("Rate limit exceeded", 429)
    }

    const auth = await requireAuthenticatedUser()
    if (auth.error || !auth.supabaseAuth || !auth.user) {
      return auth.error ?? createApiError("Unauthorized", 401)
    }

    const isAdmin = await isUserAdmin(auth.supabaseAuth, auth.user.id)
    if (!isAdmin) {
      return createApiError("Forbidden: Admin access required", 403)
    }

    validateContentType(request)
    const body = await request.json()
    const validation = IntegrationFeasibilityDecisionSchema.safeParse(body)

    if (!validation.success) {
      return createApiError("Invalid integration feasibility payload", 400, validation.error.flatten())
    }

    const storage = await insertIntegrationDecision(auth.supabaseAuth, validation.data)

    if (storage.missingTable) {
      return createApiError("Pilot storage not ready: missing pilot_integration_feasibility_decisions table", 501)
    }

    if (storage.error) {
      return createApiError("Failed to store integration feasibility decision", 500, storage.error.message)
    }

    return createApiResponse({ success: true }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return handleApiError(error)
  }
}
