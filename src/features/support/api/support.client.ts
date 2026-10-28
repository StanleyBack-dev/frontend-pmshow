import { apiRequest } from "@/shared/lib/api-client";
import type {
  SupportRequest,
  SupportRequestInput,
} from "@/shared/contracts/support";

const post = (body?: unknown): RequestInit => ({
  method: "POST",
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const supportClient = {
  send: (input: SupportRequestInput) =>
    apiRequest<SupportRequest>("/support", post(input)),

  reply: (id: string, reply: string) =>
    apiRequest<SupportRequest>(`/support/${id}/reply`, post({ reply })),

  finalize: (id: string) =>
    apiRequest<SupportRequest>(`/support/${id}/finalize`, post()),
};
