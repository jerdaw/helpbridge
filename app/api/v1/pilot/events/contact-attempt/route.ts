import { NextRequest } from "next/server"
import { createApiError, createApiResponse, handleApiError, validateContentType } from "@/lib/api-utils"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"
import { requireAuthenticatedUser } from "@/lib/pilot/auth"
import { PilotContactAttemptCreateSchema } from "@/lib/schemas/pilot-events"
import { assertPermission } from "@/lib/auth/authorization"
import { insertContactAttempt } from "@/lib/pilot/storage"

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(getClientIp(request), 60, 60 * 1000)
    if (!rateLimit.success) {
      return createApiError("Rate limit exceeded", 429)
    }

    const auth = await requireAuthenticatedUser()
    if (auth.error || !auth.supabaseAuth || !auth.user) {
      return auth.error ?? createApiError("Unauthorized", 401)
    }

    validateContentType(request)
    const body = await request.json()
    const validation = PilotContactAttemptCreateSchema.safeParse(body)

    if (!validation.success) {
      return createApiError("Invalid contact attempt payload", 400, validation.error.flatten())
    }

    const payload = validation.data

    await assertPermission(auth.supabaseAuth, auth.user.id, payload.recorded_by_org_id, "canCreateServices")

    const storage = await insertContactAttempt(auth.supabaseAuth, payload)

    if (storage.missingTable) {
      return createApiError("Pilot storage not ready: missing pilot_contact_attempt_events table", 501)
    }

    if (storage.error) {
      return createApiError("Failed to store contact attempt", 500, storage.error.message)
    }

    return createApiResponse({ success: true }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return handleApiError(error)
  }
}
