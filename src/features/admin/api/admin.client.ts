import { apiRequest } from "@/shared/lib/api-client";
import type {
  Permission,
  PermissionMatrix,
  TemporaryAccess,
  UserAccount,
  UserInput,
} from "@/shared/contracts/api";

export type AccountAction =
  "activate" | "deactivate" | "unlock" | "revoke-sessions";

export const adminClient = {
  createUser: (input: UserInput) =>
    apiRequest<TemporaryAccess>("/admin/users", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateUser: (id: string, input: Partial<UserInput>) =>
    apiRequest<UserAccount>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  runAction: (id: string, action: AccountAction) =>
    apiRequest<UserAccount>(`/admin/users/${id}/actions`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  resetPassword: (id: string) =>
    apiRequest<TemporaryAccess>(`/admin/users/${id}/actions`, {
      method: "POST",
      body: JSON.stringify({ action: "reset-password" }),
    }),

  /** `null` restores the group defaults. */
  setPermissions: (id: string, permissions: Permission[] | null) =>
    apiRequest<PermissionMatrix>(`/admin/users/${id}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    }),
};
