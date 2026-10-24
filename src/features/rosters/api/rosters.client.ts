import { apiRequest } from "@/shared/lib/api-client";
import type {
  AckAnswer,
  AckStatus,
  AssignmentInput,
  Roster,
} from "@/shared/contracts/rosters";

const json = (method: string, body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const rostersClient = {
  save: (eventId: string, assignments: AssignmentInput[]) =>
    apiRequest<Roster>(
      `/events/${eventId}/roster`,
      json("PUT", { assignments }),
    ),

  publish: (eventId: string) =>
    apiRequest<Roster>(`/events/${eventId}/roster/publish`, { method: "POST" }),

  acknowledge: (eventId: string, answer: AckAnswer, note: string | null) =>
    apiRequest<{ ackStatus: AckStatus; ackNote: string | null }>(
      `/events/${eventId}/roster/ack`,
      json("POST", { answer, note }),
    ),
};
