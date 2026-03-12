import { NextRequest } from "next/server"
import { createApiError, createApiResponse, handleApiError, validateContentType } from "@/lib/api-utils"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"
import { requireAuthenticatedUser } from "@/lib/pilot/auth"
import { PilotReferralUpdateSchema } from "@/lib/schemas/pilot-events"
import { assertPermission } from "@/lib/auth/authorization"
import { updateReferralEvent } from "@/lib/pilot/storage"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimit = await checkRateLimit(getClientIp(request), 60, 60 * 1000, "api:v1:pilot:events:referral:update")
    if (!rateLimit.success) {
      return createApiError("Rate limit exceeded", 429)
    }

    const auth = await requireAuthenticatedUser()
    if (auth.error || !auth.supabaseAuth || !auth.user) {
      return auth.error ?? createApiError("Unauthorized", 401)
    }

    const { id } = await params

    validateContentType(request)
    const body = await request.json()
    const validation = PilotReferralUpdateSchema.safeParse(body)

    if (!validation.success) {
      return createApiError("Invalid referral update payload", 400, validation.error.flatten())
    }

    const payload = validation.data
    await assertPermission(auth.supabaseAuth, auth.user.id, payload.source_org_id, "canCreateServices")

    const { source_org_id, ...updateData } = payload
    void source_org_id

    const storage = await updateReferralEvent(auth.supabaseAuth, id, updateData)

    if (storage.missingTable) {
      return createApiError("Pilot storage not ready: missing pilot_referral_events table", 501)
    }

    if (storage.error) {
      return createApiError("Failed to update referral event", 500, storage.error.message)
    }

    return createApiResponse({ success: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return handleApiError(error)
  }
}
