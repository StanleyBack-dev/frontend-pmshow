"use client";

import { useState } from "react";
import {
  usePlayer,
  type Track,
} from "@/features/player/components/PlayerProvider";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

/**
 * Loads a list to play (a playlist, an event's songs) and plays it in order
 * in the app's player, with a pending state for the button. `repeatList`
 * starts over at the end (a playlist), unless repeat was already set.
 */
export function usePlaySongs() {
  const player = usePlayer();
  const { showError } = useToast();
  const [pending, setPending] = useState<string | null>(null);

  async function play(
    key: string,
    load: () => Promise<Track[]>,
    { repeatList = false }: { repeatList?: boolean } = {},
  ) {
    setPending(key);
    try {
      const tracks = await load();
      if (tracks.length === 0) {
        showError(
          "Nenhuma música desta lista tem áudio ou vídeo para tocar ainda.",
        );
      } else {
        if (repeatList && player.repeat === "off") player.setRepeat("all");
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
