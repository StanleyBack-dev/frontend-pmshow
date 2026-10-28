import { apiRequest } from "@/shared/lib/api-client";
import type { SessionUser } from "@/shared/contracts/api";

const post = (body: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

export const authClient = {
  login: (login: string, password: string) =>
    apiRequest<{ mustChangePassword: boolean }>(
      "/auth/login",
      post({ login, password }),
    ),

  logout: () => apiRequest<{ ok: true }>("/auth/logout", { method: "POST" }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ ok: true }>(
      "/me/password",
      post({ currentPassword, newPassword }),
    ),

  updateProfile: (name: string, email: string) =>
    apiRequest<SessionUser>("/me", {
      method: "PATCH",
      body: JSON.stringify({ name, email }),
    }),

  setPhoto: (photo: string) =>
    apiRequest<{ photoUrl: string }>("/me/photo", {
      method: "PUT",
      body: JSON.stringify({ photo }),
    }),

  removePhoto: () =>
    apiRequest<{ ok: true }>("/me/photo", { method: "DELETE" }),

  requestRecovery: (login: string) =>
    apiRequest<{ ok: true }>("/auth/recovery/request", post({ login })),

  verifyRecoveryCode: (login: string, code: string) =>
    apiRequest<{ ok: true }>("/auth/recovery/verify", post({ login, code })),

  resetPassword: (newPassword: string) =>
    apiRequest<{ ok: true }>("/auth/recovery/reset", post({ newPassword })),
};
