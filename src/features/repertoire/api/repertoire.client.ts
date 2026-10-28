import { apiRequest } from "@/shared/lib/api-client";

// Sends a file straight to storage with a signed form (shared helper).
export { uploadToStorage } from "@/shared/lib/storage-upload";
import type {
  AudioUploadTicket,
  LyricsResult,
  MediaAsset,
  Song,
  SongInput,
  YoutubeVideoResult,
} from "@/shared/contracts/repertoire";

const json = (method: string, body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const repertoireClient = {
  createSong: (input: SongInput) =>
    apiRequest<Song>("/songs", json("POST", input)),

  updateSong: (id: string, input: SongInput) =>
    apiRequest<Song>(`/songs/${id}`, json("PUT", input)),

  setArchived: (id: string, archived: boolean) =>
    apiRequest<Song>(`/songs/${id}/archive`, json("POST", { archived })),

  addVideo: (songId: string, link: string, title: string | null) =>
    apiRequest<MediaAsset>(
      `/songs/${songId}/videos`,
      json("POST", { link, title }),
    ),

  searchYoutube: (query: string) =>
    apiRequest<YoutubeVideoResult[]>(
      `/youtube/search?q=${encodeURIComponent(query)}`,
    ),

  findLyrics: (artist: string, title: string) =>
    apiRequest<LyricsResult | null>(
      `/lyrics?${new URLSearchParams({ artista: artist, titulo: title })}`,
    ),

  renameMedia: (id: string, title: string) =>
    apiRequest<MediaAsset>(`/media/${id}`, json("PATCH", { title })),

  removeMedia: (id: string) =>
    apiRequest<{ ok: true }>(`/media/${id}`, { method: "DELETE" }),

  requestAudioUpload: (input: {
    songId: string;
    title: string;
    mimeType: string;
    sizeBytes: number;
  }) => apiRequest<AudioUploadTicket>("/media/uploads", json("POST", input)),

  confirmAudioUpload: (assetId: string, durationSeconds: number | null) =>
    apiRequest<MediaAsset>(
      `/media/uploads/${assetId}/confirm`,
      json("POST", { durationSeconds }),
    ),
};

/** Duration read by the browser from the local file (null if unknown). */
export function readAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const done = (value: number | null) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () =>
      done(Number.isFinite(audio.duration) ? audio.duration : null);
    audio.onerror = () => done(null);
    audio.src = url;
  });
}
