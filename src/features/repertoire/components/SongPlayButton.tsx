"use client";

import { Lock, Pause, Play } from "lucide-react";
import { Hint, Spinner } from "@/design-system";
import { usePlayer } from "@/features/player/components/PlayerProvider";
import type { SongListItem } from "@/shared/contracts/repertoire";

const buttonClass =
  "grid size-8 place-items-center rounded-full border transition-colors";

// Row control of the repertoire list: plays / pauses the song in the global
// player — its first audio file or, without one, its first YouTube video.
// With neither it shows a lock that explains why there is nothing to play.
export function SongPlayButton({ song }: { song: SongListItem }) {
  const player = usePlayer();
  const media =
    song.media.find((item) => item.kind === "AUDIO") ??
    song.media.find((item) => item.kind === "VIDEO" && item.youtubeVideoId);

  if (!media) {
    return (
      <Hint
        icon={<Lock aria-hidden className="size-4" />}
        label={`${song.title}: sem áudio nem vídeo`}
      >
        Esta música ainda não tem áudio enviado nem vídeo do YouTube cadastrado.
      </Hint>
    );
  }

  const isCurrent = player.current?.assetId === media.id;
  const isPlaying = isCurrent && player.playing;
  const label = isPlaying ? `Pausar ${song.title}` : `Tocar ${song.title}`;

  return (
    <button
      type="button"
      aria-label={label}
      title={
        media.kind === "VIDEO" ? `${label} (áudio do vídeo do YouTube)` : label
      }
      aria-pressed={isPlaying}
      onClick={() =>
        isCurrent
          ? player.toggle()
          : player.play({
              assetId: media.id,
              title: media.title,
              songTitle: song.title,
              youtubeVideoId: media.youtubeVideoId,
              lyrics: { title: song.title, text: song.lyrics },
            })
      }
      className={
        isCurrent
          ? `${buttonClass} border-accent bg-accent text-accent-fg hover:bg-accent-hover`
          : `${buttonClass} border-accent-border bg-accent-soft text-accent hover:bg-accent hover:text-accent-fg`
      }
    >
      {isCurrent && player.loading ? (
        <Spinner size="sm" />
      ) : isPlaying ? (
        <Pause aria-hidden className="size-4" />
      ) : (
        <Play aria-hidden className="ml-0.5 size-4" />
      )}
    </button>
  );
}
