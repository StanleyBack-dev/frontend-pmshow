import { apiRequest } from "@/shared/lib/api-client";
import type {
  Instrument,
  MemberProfile,
  MemberProfileInput,
  Section,
} from "@/shared/contracts/members";

export const membersClient = {
  saveProfile: (userId: string, input: MemberProfileInput) =>
    apiRequest<MemberProfile>(`/members/${userId}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  createInstrument: (name: string, section: Section) =>
    apiRequest<Instrument>("/instruments", {
      method: "POST",
      body: JSON.stringify({ name, section }),
    }),

  updateInstrument: (
    id: string,
    input: { name?: string; section?: Section; archived?: boolean },
  ) =>
    apiRequest<Instrument>(`/instruments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
};
