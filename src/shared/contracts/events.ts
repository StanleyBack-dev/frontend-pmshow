import type { EventStatus, EventType } from "@/shared/graphql/schema-enums";

export type { EventStatus, EventType };

export type Venue = {
  id: string;
  name: string;
  address: string | null;
  city: string;
  mapsUrl: string | null;
  notes: string | null;
  archived: boolean;
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

export type SetlistEntry = {
  position: number;
  songId: string;
  notes: string | null;
  song: {
    id: string;
    title: string;
    musicalKey: string | null;
    durationSeconds: number | null;
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
  address: string | null;
  city: string | null;
  mapsUrl: string | null;
  notes: string | null;
  archived?: boolean;
};
