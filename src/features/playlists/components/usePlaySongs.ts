"use client";

import { useState } from "react";
import { usePlayer } from "@/features/player/components/PlayerProvider";
import { songTracks } from "@/features/player/model/song-tracks";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

type Song = Parameters<typeof songTracks>[0][number];

/**
 * Loads a list of songs (a playlist, an event's songs) and plays it in order
 * in the app's player, with a pending state for the button.
 */
export function usePlaySongs() {
  const player = usePlayer();
  const { showError } = useToast();
  const [pending, setPending] = useState<string | null>(null);

  async function play(key: string, load: () => Promise<Song[]>) {
    setPending(key);
    try {
      const tracks = songTracks(await load());
      if (tracks.length === 0) {
        showError(
          "Nenhuma música desta lista tem áudio ou vídeo para tocar ainda.",
        );
      } else {
        player.play(tracks[0]!, tracks);
      }
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível carregar as músicas.",
      );
    }
    setPending(null);
  }

  return { play, pending };
}
