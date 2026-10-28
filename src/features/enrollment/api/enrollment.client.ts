import type { UserGroup } from "@/shared/contracts/api";
import type {
  EnrollmentApproval,
  EnrollmentData,
  EnrollmentInstrument,
  EnrollmentInvite,
  EnrollmentRequest,
} from "@/shared/contracts/enrollment";
import { apiRequest } from "@/shared/lib/api-client";

export const enrollmentClient = {
  // === public sign-up ===

  verifyCode: (code: string) =>
    apiRequest<{ ok: true }>("/public/cadastro/codigo", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  instruments: () =>
    apiRequest<EnrollmentInstrument[]>("/public/cadastro/instrumentos"),

  submit: (data: EnrollmentData, consent: boolean, photo: string | null) =>
    apiRequest<{ ok: true }>("/public/cadastro", {
      method: "POST",
      body: JSON.stringify({ data, consent, photo }),
    }),

  // === manager ===

  createInvite: (input: { label: string; validDays: number }) =>
    apiRequest<EnrollmentInvite>("/admin/enrollment/invites", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  revokeInvite: (id: string) =>
    apiRequest<EnrollmentInvite>(`/admin/enrollment/invites/${id}`, {
      method: "DELETE",
    }),

  approve: (id: string, data: EnrollmentData, group: UserGroup) =>
    apiRequest<EnrollmentApproval>(`/admin/enrollment/requests/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "approve", data, group }),
    }),

  reject: (id: string, reason: string) =>
    apiRequest<EnrollmentRequest>(`/admin/enrollment/requests/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "reject", reason }),
    }),
};
