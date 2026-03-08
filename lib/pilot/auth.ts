import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { env } from "@/lib/env"
import { createApiError } from "@/lib/api-utils"

export async function getPilotSupabaseAuthClient() {
  const cookieStore = await cookies()
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL || "", env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "", {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  })
}

export async function requireAuthenticatedUser() {
  const supabaseAuth = await getPilotSupabaseAuthClient()
  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.getUser()

  if (error || !user) {
    return { error: createApiError("Unauthorized", 401), supabaseAuth: null, user: null }
  }

  return { error: null, supabaseAuth, user }
}
