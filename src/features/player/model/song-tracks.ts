import type { Track } from "@/features/player/components/PlayerProvider";
import type { PlaylistItem } from "@/shared/contracts/playlists";

type PlayableSong = {
  id: string;
  title: string;
  lyrics?: string | null;
  archivedAt?: string | null;
  artist?: { name: string } | null;
  media: {
    id: string;
    kind: "AUDIO" | "VIDEO";
    title: string;
    youtubeVideoId: string | null;
  }[];
};

/** The song's first audio or, without audio, its first video. */
function songTrack(song: PlayableSong | null | undefined): Track | null {
  if (!song || song.archivedAt) return null;
  const media =
    song.media.find((item) => item.kind === "AUDIO") ??
    song.media.find((item) => item.kind === "VIDEO" && item.youtubeVideoId);
  if (!media) return null;
  return {
    assetId: media.id,
    title: song.title,
    songTitle: media.title,
    artist: song.artist?.name ?? null,
    youtubeVideoId: media.kind === "VIDEO" ? media.youtubeVideoId : null,
    lyrics: { title: song.title, text: song.lyrics ?? null },
  };
}

/**
 * The player's queue for a list of songs (an event's songs): one track per
 * song. Songs with nothing to play (or archived) are left out.
 */
export function songTracks(
  songs: readonly (PlayableSong | null | undefined)[],
): Track[] {
  return songs.flatMap((song) => songTrack(song) ?? []);
}

/**
 * The queue of a playlist: its songs (as above) and its own YouTube videos,
 * in the playlist's order.
 */
export function playlistTracks(items: readonly PlaylistItem[]): Track[] {
  return items.flatMap((item): Track[] => {
    if (!item.video) {
      const track = songTrack(item.song);
      return track ? [track] : [];
    }
    const { videoId, title, channelTitle } = item.video;
    return [
      {
        // Not a media asset of the repertoire: unique within the queue.
        assetId: `playlist-video:${videoId}`,
        title,
        songTitle: channelTitle ?? "YouTube",
        artist: channelTitle,
        youtubeVideoId: videoId,
      },
    ];
  });
}
