import { apiRequest } from "@/shared/lib/api-client";
import type { Absence, AbsenceInput } from "@/shared/contracts/absences";

const post = (body?: unknown): RequestInit => ({
  method: "POST",
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const absencesClient = {
  request: (input: AbsenceInput) =>
    apiRequest<Absence>("/absences", post(input)),

  register: (userId: string, input: AbsenceInput) =>
    apiRequest<Absence>("/absences/register", post({ userId, ...input })),

  review: (id: string, approve: boolean, note: string | null) =>
    apiRequest<Absence>(`/absences/${id}/review`, post({ approve, note })),

  cancel: (id: string) => apiRequest<Absence>(`/absences/${id}/cancel`, post()),
};
