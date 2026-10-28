import type { Track } from "@/features/player/components/PlayerProvider";

type PlayableSong = {
  id: string;
  title: string;
  lyrics?: string | null;
  archivedAt?: string | null;
  media: {
    id: string;
    kind: "AUDIO" | "VIDEO";
    title: string;
    youtubeVideoId: string | null;
  }[];
};

/**
 * The player's queue for a list of songs (playlist, an event's songs): one
 * track per song, its first audio or, without audio, its first video. Songs
 * with nothing to play (or archived) are left out.
 */
export function songTracks(
  songs: readonly (PlayableSong | null | undefined)[],
): Track[] {
  return songs.flatMap((song) => {
    if (!song || song.archivedAt) return [];
    const media =
      song.media.find((item) => item.kind === "AUDIO") ??
      song.media.find((item) => item.kind === "VIDEO" && item.youtubeVideoId);
    if (!media) return [];
    return [
      {
        assetId: media.id,
        title: song.title,
        songTitle: media.title,
        youtubeVideoId: media.kind === "VIDEO" ? media.youtubeVideoId : null,
        lyrics: { title: song.title, text: song.lyrics ?? null },
      },
    ];
  });
}
