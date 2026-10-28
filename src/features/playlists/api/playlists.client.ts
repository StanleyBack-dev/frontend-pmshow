import { apiRequest } from "@/shared/lib/api-client";
import type {
  Playlist,
  PlaylistInput,
  PlaylistWithSongs,
} from "@/shared/contracts/playlists";

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const playlistsClient = {
  get: (id: string) => apiRequest<PlaylistWithSongs>(`/playlists/${id}`),

  create: (input: PlaylistInput) =>
    apiRequest<Playlist>("/playlists", json("POST", input)),

  update: (id: string, input: PlaylistInput) =>
    apiRequest<Playlist>(`/playlists/${id}`, json("PUT", input)),

  remove: (id: string) =>
    apiRequest<{ ok: true }>(`/playlists/${id}`, json("DELETE")),
};
