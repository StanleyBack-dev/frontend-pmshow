import { apiRequest } from "@/shared/lib/api-client";
import type {
  BandFunction,
  Instrument,
  MemberProfile,
  MemberProfileInput,
  RosterEntry,
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

  /** Members whose band profile lists the instrument. */
  instrumentMembers: (id: string) =>
    apiRequest<RosterEntry[]>(`/instruments/${id}/members`),

  updateInstrument: (
    id: string,
    input: { name?: string; section?: Section; archived?: boolean },
  ) =>
    apiRequest<Instrument>(`/instruments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
};

// The band's functions (regente, motorista…): Gestor and Administrador geral.
export const bandFunctionsClient = {
  create: (name: string) =>
    apiRequest<BandFunction>("/band-functions", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  update: (id: string, input: { name?: string; archived?: boolean }) =>
    apiRequest<BandFunction>(`/band-functions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  /** Members whose band profile lists the function. */
  members: (id: string) =>
    apiRequest<RosterEntry[]>(`/band-functions/${id}/members`),
};
