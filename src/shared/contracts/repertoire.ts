import type {
  MediaKind,
  MediaStatus,
  SongCategory,
  SongStage,
} from "@/shared/graphql/schema-enums";

export type { MediaKind, MediaStatus, SongCategory, SongStage };

export type Artist = {
  id: string;
  name: string;
  archived: boolean;
};

/** A row of the artists page. */
export type ArtistListItem = Artist & {
  /** Songs in the repertoire (not archived). */
  songCount: number;
  createdAt: string;
};

export type Song = {
  id: string;
  title: string;
  artistId: string | null;
  /** Singer / band. */
  artist: { id: string; name: string } | null;
  stage: SongStage;
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

/** A row of the repertoire list: enough media to play or flag it. */
export type SongListItem = Song & {
  media: {
    id: string;
    kind: MediaKind;
    title: string;
    youtubeVideoId: string | null;
  }[];
};

export type SongInput = {
  title: string;
  artistId: string | null;
  stage: SongStage;
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

/** A YouTube search result in the song form. */
export type YoutubeVideoResult = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string | null;
  durationSeconds: number | null;
};

/** Lyrics found for a song (with the catalog's spelling of names). */
export type LyricsResult = {
  artist: string;
  title: string;
  lyrics: string;
  sourceUrl: string | null;
};
