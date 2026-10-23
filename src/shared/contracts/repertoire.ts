import type {
  MediaKind,
  MediaStatus,
  SongCategory,
} from "@/shared/graphql/schema-enums";

export type { MediaKind, MediaStatus, SongCategory };

export type Song = {
  id: string;
  title: string;
  artist: string | null;
  arranger: string | null;
  category: SongCategory;
  musicalKey: string | null;
  bpm: number | null;
  durationSeconds: number | null;
  lyrics: string | null;
  notes: string | null;
  tags: string[];
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaAsset = {
  id: string;
  songId: string;
  kind: MediaKind;
  status: MediaStatus;
  title: string;
  mimeType: string | null;
  sizeBytes: number | null;
  durationSeconds: number | null;
  youtubeVideoId: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
};

export type SongWithMedia = Song & { media: MediaAsset[] };

export type SongInput = {
  title: string;
  artist: string | null;
  arranger: string | null;
  category: SongCategory;
  musicalKey: string | null;
  bpm: number | null;
  durationSeconds: number | null;
  lyrics: string | null;
  notes: string | null;
  tags: string[];
};

/** Signed form: the browser POSTs `fields` + the file straight to `url`. */
export type AudioUploadTicket = {
  asset: MediaAsset;
  upload: { url: string; fields: Record<string, string>; expiresAt: string };
};
