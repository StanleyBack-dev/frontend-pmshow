import { apiRequest } from "@/shared/lib/api-client";
import type {
  BandEvent,
  EventInput,
  EventStatus,
  SetlistEntry,
  Venue,
  VenueInput,
  ZipCodeAddress,
} from "@/shared/contracts/events";

const json = (method: string, body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export type SongOption = {
  id: string;
  title: string;
  artist: string | null;
  musicalKey: string | null;
};

export const eventsClient = {
  create: (input: EventInput) =>
    apiRequest<BandEvent>("/events", json("POST", input)),

  update: (id: string, input: EventInput) =>
    apiRequest<BandEvent>(`/events/${id}`, json("PUT", input)),

  changeStatus: (id: string, status: EventStatus, reason: string | null) =>
    apiRequest<BandEvent>(
      `/events/${id}/status`,
      json("POST", { status, reason }),
    ),

  /** The event's list of songs (setlist), in order. */
  setlist: (id: string) => apiRequest<SetlistEntry[]>(`/events/${id}/setlist`),

  setSetlist: (id: string, items: { songId: string; notes: string | null }[]) =>
    apiRequest<{ ok: true }>(`/events/${id}/setlist`, json("PUT", { items })),

  searchSongs: (query: string) =>
    apiRequest<SongOption[]>(`/songs?q=${encodeURIComponent(query)}`),

  /** Street, district, city and UF of a CEP (8 digits). */
  zipCode: (cep: string) =>
    apiRequest<ZipCodeAddress | null>(`/zip-codes/${cep}`),

  createVenue: (input: VenueInput) =>
    apiRequest<Venue>("/venues", json("POST", input)),

  updateVenue: (id: string, input: VenueInput) =>
    apiRequest<Venue>(`/venues/${id}`, json("PUT", input)),
};
