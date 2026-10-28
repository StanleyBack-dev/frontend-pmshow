import type { BandFunction } from "@/shared/contracts/members";
import { apiRequest } from "@/shared/lib/api-client";
import type {
  AckAnswer,
  AckStatus,
  AssignmentInput,
  Roster,
  RosterCandidate,
} from "@/shared/contracts/rosters";

const json = (method: string, body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const rostersClient = {
  load: (eventId: string) =>
    apiRequest<{
      roster: Roster | null;
      candidates: RosterCandidate[];
      functions: BandFunction[];
    }>(`/events/${eventId}/roster`),

  /** Only the roster, to read (who goes and their answers). */
  view: (eventId: string) =>
    apiRequest<{ roster: Roster | null }>(
      `/events/${eventId}/roster/view`,
    ).then((result) => result.roster),

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

  /** Doesn't accept a swap request: the person stays on the roster. */
  keepOnRoster: (eventId: string, userId: string, note: string | null) =>
    apiRequest<{ ok: true }>(
      `/events/${eventId}/roster/keep`,
      json("POST", { userId, note }),
    ),
};
