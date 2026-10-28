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
  songCount: number;
  updatedAt: string;
};

/** The playlist with its songs, in play order. */
export type PlaylistWithSongs = Playlist & {
  songs: {
    position: number;
    songId: string;
    song: SetlistEntry["song"];
  }[];
};

export type PlaylistInput = {
  name: string;
  description: string | null;
  shared: boolean;
  songIds: string[];
};
