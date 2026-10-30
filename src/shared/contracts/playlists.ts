import type { SetlistEntry } from "@/shared/contracts/events";

/** A playlist of the repertoire (rehearsal mode). */
export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  /** Visible (to play) to the whole band; only the owner changes it. */
  shared: boolean;
  ownerId: string;
  ownerName: string;
  /** Songs and videos. */
  itemCount: number;
  updatedAt: string;
};

/**
 * A YouTube video kept in the playlist only: not a song of the repertoire,
 * so events and the repertoire never show it.
 */
export type PlaylistVideo = {
  videoId: string;
  title: string;
  channelTitle: string | null;
};

/** A song of the repertoire as a playlist plays it. */
export type PlaylistSong = NonNullable<SetlistEntry["song"]> & {
  artist: { name: string } | null;
};

/** One line, in play order: a song of the repertoire or a video. */
export type PlaylistItem = {
  position: number;
  songId: string | null;
  song: PlaylistSong | null;
  video: PlaylistVideo | null;
};

/** The playlist with its items, in play order. */
export type PlaylistWithItems = Playlist & { items: PlaylistItem[] };

export type PlaylistItemInput = { songId: string } | { video: PlaylistVideo };

export type PlaylistInput = {
  name: string;
  description: string | null;
  shared: boolean;
  items: PlaylistItemInput[];
};
