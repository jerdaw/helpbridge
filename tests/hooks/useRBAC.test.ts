import { renderHook } from "@testing-library/react"
import { useRBAC } from "@/hooks/useRBAC"
import { describe, it, expect } from "vitest"
import type { OrganizationRole } from "@/lib/rbac"

describe("useRBAC Hook", () => {
  describe("Null/Undefined Role Handling", () => {
    it("should handle null role gracefully", () => {
      const { result } = renderHook(() => useRBAC(null))

      expect(result.current.role).toBeNull()
      expect(result.current.permissions).toBeNull()
      expect(result.current.checkPermission("canViewServices")).toBe(false)
      expect(result.current.meetsRole("viewer")).toBe(false)
      expect(result.current.assignableRoles).toEqual([])
      expect(result.current.roleLabelKey).toBe("")
      expect(result.current.roleDescriptionKey).toBe("")
    })

    it("should handle undefined role gracefully", () => {
      const { result } = renderHook(() => useRBAC(undefined))

      expect(result.current.role).toBeUndefined()
      expect(result.current.permissions).toBeNull()
      expect(result.current.checkPermission("canEditAllServices")).toBe(false)
    })
  })

  describe("Owner Role", () => {
    const role: OrganizationRole = "owner"

    it("should return correct permissions object", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.permissions).toEqual({
        canViewServices: true,
        canCreateServices: true,
        canEditOwnServices: true,
        canEditAllServices: true,
        canDeleteServices: true,
        canPublishServices: true,
        canViewMembers: true,
        canInviteMembers: true,
        canRemoveMembers: true,
        canChangeRoles: true,
        canTransferOwnership: true,
        canEditOrganization: true,
        canDeleteOrganization: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canViewFeedback: true,
        canRespondToFeedback: true,
        canViewNotifications: true,
        canManageNotifications: true,
      })
    })

    it("should return all permissions as true via checkPermission", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.checkPermission("canTransferOwnership")).toBe(true)
      expect(result.current.checkPermission("canDeleteOrganization")).toBe(true)
      expect(result.current.checkPermission("canEditAllServices")).toBe(true)
    })

    it("should meet all role requirements", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.meetsRole("owner")).toBe(true)
      expect(result.current.meetsRole("admin")).toBe(true)
      expect(result.current.meetsRole("editor")).toBe(true)
      expect(result.current.meetsRole("viewer")).toBe(true)
    })

    it("should be able to modify non-owner roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canModifyRole("admin", false)).toBe(true)
      expect(result.current.canModifyRole("editor", false)).toBe(true)
      expect(result.current.canModifyRole("viewer", false)).toBe(true)
      expect(result.current.canModifyRole("owner", false)).toBe(false) // Cannot modify owner
      expect(result.current.canModifyRole("admin", true)).toBe(false) // Cannot modify self
    })

    it("should be able to remove non-owner members", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canRemoveMember("admin", false)).toBe(true)
      expect(result.current.canRemoveMember("editor", false)).toBe(true)
      expect(result.current.canRemoveMember("viewer", false)).toBe(true)
      expect(result.current.canRemoveMember("owner", false)).toBe(false) // Cannot remove owner
      expect(result.current.canRemoveMember("admin", true)).toBe(false) // Cannot remove self
    })

    it("should have correct assignable roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.assignableRoles).toEqual(["admin", "editor", "viewer"])
    })

    it("should have correct convenience flags", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.isOwner).toBe(true)
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isEditor).toBe(false)
      expect(result.current.isViewer).toBe(false)
      expect(result.current.isManagerRole).toBe(true)
    })

    it("should return correct i18n keys", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.roleLabelKey).toBe("roles.owner.label")
      expect(result.current.roleDescriptionKey).toBe("roles.owner.description")
    })
  })

  describe("Admin Role", () => {
    const role: OrganizationRole = "admin"

    it("should have most permissions except ownership transfer and org deletion", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.permissions?.canEditAllServices).toBe(true)
      expect(result.current.permissions?.canInviteMembers).toBe(true)
      expect(result.current.permissions?.canChangeRoles).toBe(true)
      expect(result.current.permissions?.canTransferOwnership).toBe(false)
      expect(result.current.permissions?.canDeleteOrganization).toBe(false)
    })

    it("should meet admin and lower role requirements", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.meetsRole("owner")).toBe(false)
      expect(result.current.meetsRole("admin")).toBe(true)
      expect(result.current.meetsRole("editor")).toBe(true)
      expect(result.current.meetsRole("viewer")).toBe(true)
    })

    it("should be able to modify editor and viewer roles only", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canModifyRole("owner", false)).toBe(false)
      expect(result.current.canModifyRole("admin", false)).toBe(false)
      expect(result.current.canModifyRole("editor", false)).toBe(true)
      expect(result.current.canModifyRole("viewer", false)).toBe(true)
      expect(result.current.canModifyRole("editor", true)).toBe(false) // Cannot modify self
    })

    it("should be able to remove editor and viewer members only", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canRemoveMember("owner", false)).toBe(false)
      expect(result.current.canRemoveMember("admin", false)).toBe(false)
      expect(result.current.canRemoveMember("editor", false)).toBe(true)
      expect(result.current.canRemoveMember("viewer", false)).toBe(true)
    })

    it("should have correct assignable roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.assignableRoles).toEqual(["editor", "viewer"])
    })

    it("should have correct convenience flags", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.isOwner).toBe(false)
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.isEditor).toBe(false)
      expect(result.current.isViewer).toBe(false)
      expect(result.current.isManagerRole).toBe(true)
    })

    it("should return correct i18n keys", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.roleLabelKey).toBe("roles.admin.label")
      expect(result.current.roleDescriptionKey).toBe("roles.admin.description")
    })
  })

  describe("Editor Role", () => {
    const role: OrganizationRole = "editor"

    it("should have limited permissions - can create and edit own services", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.permissions?.canViewServices).toBe(true)
      expect(result.current.permissions?.canCreateServices).toBe(true)
      expect(result.current.permissions?.canEditOwnServices).toBe(true)
      expect(result.current.permissions?.canEditAllServices).toBe(false)
      expect(result.current.permissions?.canDeleteServices).toBe(false)
      expect(result.current.permissions?.canPublishServices).toBe(false)
      expect(result.current.permissions?.canInviteMembers).toBe(false)
      expect(result.current.permissions?.canRemoveMembers).toBe(false)
      expect(result.current.permissions?.canChangeRoles).toBe(false)
      expect(result.current.permissions?.canRespondToFeedback).toBe(true)
    })

    it("should meet editor and viewer role requirements only", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.meetsRole("owner")).toBe(false)
      expect(result.current.meetsRole("admin")).toBe(false)
      expect(result.current.meetsRole("editor")).toBe(true)
      expect(result.current.meetsRole("viewer")).toBe(true)
    })

    it("should not be able to modify any roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canModifyRole("owner", false)).toBe(false)
      expect(result.current.canModifyRole("admin", false)).toBe(false)
      expect(result.current.canModifyRole("editor", false)).toBe(false)
      expect(result.current.canModifyRole("viewer", false)).toBe(false)
    })

    it("should not be able to remove any members", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canRemoveMember("owner", false)).toBe(false)
      expect(result.current.canRemoveMember("admin", false)).toBe(false)
      expect(result.current.canRemoveMember("editor", false)).toBe(false)
      expect(result.current.canRemoveMember("viewer", false)).toBe(false)
    })

    it("should have no assignable roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.assignableRoles).toEqual([])
    })

    it("should have correct convenience flags", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.isOwner).toBe(false)
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isEditor).toBe(true)
      expect(result.current.isViewer).toBe(false)
      expect(result.current.isManagerRole).toBe(false)
    })

    it("should return correct i18n keys", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.roleLabelKey).toBe("roles.editor.label")
      expect(result.current.roleDescriptionKey).toBe("roles.editor.description")
    })
  })

  describe("Viewer Role", () => {
    const role: OrganizationRole = "viewer"

    it("should have minimal read-only permissions", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.permissions?.canViewServices).toBe(true)
      expect(result.current.permissions?.canCreateServices).toBe(false)
      expect(result.current.permissions?.canEditOwnServices).toBe(false)
      expect(result.current.permissions?.canEditAllServices).toBe(false)
      expect(result.current.permissions?.canDeleteServices).toBe(false)
      expect(result.current.permissions?.canViewMembers).toBe(true)
      expect(result.current.permissions?.canInviteMembers).toBe(false)
      expect(result.current.permissions?.canViewAnalytics).toBe(true)
      expect(result.current.permissions?.canViewFeedback).toBe(true)
      expect(result.current.permissions?.canRespondToFeedback).toBe(false)
      expect(result.current.permissions?.canManageNotifications).toBe(false)
    })

    it("should only meet viewer role requirement", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.meetsRole("owner")).toBe(false)
      expect(result.current.meetsRole("admin")).toBe(false)
      expect(result.current.meetsRole("editor")).toBe(false)
      expect(result.current.meetsRole("viewer")).toBe(true)
    })

    it("should not be able to modify any roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canModifyRole("owner", false)).toBe(false)
      expect(result.current.canModifyRole("admin", false)).toBe(false)
      expect(result.current.canModifyRole("editor", false)).toBe(false)
      expect(result.current.canModifyRole("viewer", false)).toBe(false)
    })

    it("should not be able to remove any members", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.canRemoveMember("owner", false)).toBe(false)
      expect(result.current.canRemoveMember("admin", false)).toBe(false)
      expect(result.current.canRemoveMember("editor", false)).toBe(false)
      expect(result.current.canRemoveMember("viewer", false)).toBe(false)
    })

    it("should have no assignable roles", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.assignableRoles).toEqual([])
    })

    it("should have correct convenience flags", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.isOwner).toBe(false)
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isEditor).toBe(false)
      expect(result.current.isViewer).toBe(true)
      expect(result.current.isManagerRole).toBe(false)
    })

    it("should return correct i18n keys", () => {
      const { result } = renderHook(() => useRBAC(role))

      expect(result.current.roleLabelKey).toBe("roles.viewer.label")
      expect(result.current.roleDescriptionKey).toBe("roles.viewer.description")
    })
  })

  describe("Self-Modification Restrictions", () => {
    it("owner cannot modify or remove themselves", () => {
      const { result } = renderHook(() => useRBAC("owner"))

      expect(result.current.canModifyRole("owner", true)).toBe(false)
      expect(result.current.canRemoveMember("owner", true)).toBe(false)
    })

    it("admin cannot modify or remove themselves", () => {
      const { result } = renderHook(() => useRBAC("admin"))

      expect(result.current.canModifyRole("admin", true)).toBe(false)
      expect(result.current.canRemoveMember("admin", true)).toBe(false)
    })

    it("editor cannot modify or remove themselves", () => {
      const { result } = renderHook(() => useRBAC("editor"))

      expect(result.current.canModifyRole("editor", true)).toBe(false)
      expect(result.current.canRemoveMember("editor", true)).toBe(false)
    })

    it("viewer cannot modify or remove themselves", () => {
      const { result } = renderHook(() => useRBAC("viewer"))

      expect(result.current.canModifyRole("viewer", true)).toBe(false)
      expect(result.current.canRemoveMember("viewer", true)).toBe(false)
    })
  })

  describe("Memoization", () => {
    it("should return stable references when role does not change", () => {
      const { result, rerender } = renderHook(({ role }: { role: OrganizationRole }) => useRBAC(role), {
        initialProps: { role: "admin" as OrganizationRole },
      })

      const firstCheckPermission = result.current.checkPermission
      const firstMeetsRole = result.current.meetsRole
      const firstCanModifyRole = result.current.canModifyRole
      const firstAssignableRoles = result.current.assignableRoles

      rerender({ role: "admin" })

      expect(result.current.checkPermission).toBe(firstCheckPermission)
      expect(result.current.meetsRole).toBe(firstMeetsRole)
      expect(result.current.canModifyRole).toBe(firstCanModifyRole)
      expect(result.current.assignableRoles).toBe(firstAssignableRoles)
    })

    it("should return new references when role changes", () => {
      const { result, rerender } = renderHook(({ role }: { role: OrganizationRole }) => useRBAC(role), {
        initialProps: { role: "admin" as OrganizationRole },
      })

      const firstCheckPermission = result.current.checkPermission
      const firstMeetsRole = result.current.meetsRole

      rerender({ role: "editor" })

      expect(result.current.checkPermission).not.toBe(firstCheckPermission)
      expect(result.current.meetsRole).not.toBe(firstMeetsRole)
    })
  })
})
