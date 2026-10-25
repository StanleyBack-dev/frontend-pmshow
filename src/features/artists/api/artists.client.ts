import { apiRequest } from "@/shared/lib/api-client";
import type { Artist, SongListItem } from "@/shared/contracts/repertoire";

const json = (method: string, body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const artistsClient = {
  /** Active singers / bands, by name. */
  list: () => apiRequest<Artist[]>("/artists"),

  create: (name: string) =>
    apiRequest<Artist>("/artists", json("POST", { name })),

  update: (id: string, input: { name: string; archived?: boolean }) =>
    apiRequest<Artist>(`/artists/${id}`, json("PUT", input)),

  songs: (id: string) => apiRequest<SongListItem[]>(`/artists/${id}/songs`),
};
