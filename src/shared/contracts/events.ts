import type { EventStatus, EventType } from "@/shared/graphql/schema-enums";

export type { EventStatus, EventType };

export type Venue = {
  id: string;
  name: string;
  /** CEP, 8 digits. */
  zipCode: string | null;
  street: string | null;
  /** "123", "12A" or "S/N". */
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string;
  /** UF, e.g. "GO". */
  state: string;
  /** "Rua 10, 123 – Setor Oeste, Goiânia/GO, CEP 74000-000". */
  fullAddress: string;
  mapsUrl: string | null;
  notes: string | null;
  archived: boolean;
};

/** Address of a CEP (to fill the venue form). */
export type ZipCodeAddress = {
  zipCode: string;
  street: string | null;
  district: string | null;
  city: string;
  state: string;
};

export type BandEvent = {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  callTime: string | null;
  startsAt: string;
  endsAt: string | null;
  venueId: string | null;
  uniform: string | null;
  requester: string | null;
  documentRef: string | null;
  notes: string | null;
  cancellationReason: string | null;
  venue: Venue | null;
};

/** Upcoming (from now on) or past events. */
export type EventPeriod = "UPCOMING" | "PAST";

/** A row of the events page. */
export type EventListItem = BandEvent & {
  setlistCount: number;
  /** null: no roster yet, or not allowed to see drafts. */
  rosterSummary: {
    status: "RASCUNHO" | "PUBLICADA";
    assignments: number;
  } | null;
};

export type SetlistEntry = {
  position: number;
  songId: string;
  notes: string | null;
  song: {
    id: string;
    title: string;
    musicalKey: string | null;
    durationSeconds: number | null;
    lyrics: string | null;
    archivedAt: string | null;
    media: { id: string; kind: "AUDIO" | "VIDEO"; title: string }[];
  } | null;
};

export type EventWithSetlist = BandEvent & { setlist: SetlistEntry[] };

/** Dates as ISO strings with offset (built from the local form inputs). */
export type EventInput = {
  title: string;
  type: EventType;
  callTime: string | null;
  startsAt: string;
  endsAt: string | null;
  venueId: string | null;
  uniform: string | null;
  requester: string | null;
  documentRef: string | null;
  notes: string | null;
};

export type VenueInput = {
  name: string;
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  mapsUrl: string | null;
  notes: string | null;
  archived?: boolean;
};
