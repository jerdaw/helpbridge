import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, beforeEach } from "vitest"
import { useUserContext } from "@/hooks/useUserContext"

describe("useUserContext localStorage integration", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("persists opt-in and profile choices without rerender loops", async () => {
    const { result } = renderHook(() => useUserContext())

    act(() => {
      result.current.optIn()
    })

    await waitFor(() => {
      expect(result.current.context.hasOptedIn).toBe(true)
    })

    act(() => {
      result.current.updateAgeGroup("adult")
      result.current.toggleIdentity("indigenous")
    })

    await waitFor(() => {
      expect(result.current.context.ageGroup).toBe("adult")
      expect(result.current.context.identities).toContain("indigenous")
    })

    expect(JSON.parse(window.localStorage.getItem("careconnect_user_context")!)).toEqual({
      ageGroup: "adult",
      identities: ["indigenous"],
      hasOptedIn: true,
    })
  })
})
