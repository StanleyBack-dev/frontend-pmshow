"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Badge, Drawer, Spinner } from "@/design-system";
import { artistsClient } from "@/features/artists/api/artists.client";
import { PlayerPanel } from "@/features/player/components/MiniPlayer";
import { usePlayer } from "@/features/player/components/PlayerProvider";
import { LyricsButton } from "@/features/repertoire/components/LyricsViewer";
import { SongPlayButton } from "@/features/repertoire/components/SongPlayButton";
import {
  CATEGORY_LABELS,
  STAGE_LABELS,
} from "@/features/repertoire/model/repertoire-labels";
import type {
  ArtistListItem,
  SongListItem,
} from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";

// The artist's songs without leaving the artists page: lyrics (full
// screen) and play / pause, as in the repertoire list, with the player
// inside the drawer. What plays here stops when the drawer closes (it
// doesn't move on to the page's player bar). Editing stays in the
// repertoire.
export function ArtistSongsDrawer({
  artist,
  onClose,
}: {
  artist: ArtistListItem;
  onClose: () => void;
}) {
  const player = usePlayer();
  const [songs, setSongs] = useState<SongListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function close() {
    const playingHere = songs?.some((song) =>
      song.media.some((media) => media.id === player.current?.assetId),
    );
    if (playingHere) player.close();
    onClose();
  }

  useEffect(() => {
    let active = true;
    artistsClient.songs(artist.id).then(
      (result) => {
        if (!active) return;
        setSongs(result);
      },
      (cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar as músicas.",
        );
      },
    );
    return () => {
      active = false;
    };
  }, [artist.id]);

  return (
    <Drawer
      open
      onClose={close}
      title={artist.name}
      subtitle="Músicas no repertório"
    >
      {/* The page's player bar and video sit behind the drawer: here the
          player shows inside it, pinned while the list scrolls. */}
      <PlayerPanel className="sticky -top-5 z-10 -mx-5 -mt-5 mb-3 border-b border-border bg-surface px-5 py-3" />
      {error && <Alert tone="danger">{error}</Alert>}
      {!songs && !error && (
        <div className="grid place-items-center py-10">
          <Spinner />
        </div>
      )}
      {songs && songs.length === 0 && (
        <p className="py-10 text-center text-sm text-soft">
          Nenhuma música deste cantor no repertório.
        </p>
      )}
      {songs && songs.length > 0 && (
        <ul className="-mx-1 divide-y divide-border">
          {songs.map((song) => (
            <li key={song.id} className="flex items-center gap-1 px-1 py-2.5">
              <LyricsButton title={song.title} lyrics={song.lyrics} />
              <SongPlayButton song={song} />
              <div className="ml-2 min-w-0 flex-1">
                <Link
                  href={`/repertorio/${song.id}`}
                  className="block truncate text-[13px] font-medium text-fg hover:text-accent hover:underline"
                >
                  {song.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge tone="neutral">{CATEGORY_LABELS[song.category]}</Badge>
                  <Badge tone={STAGE_LABELS[song.stage].tone}>
                    {STAGE_LABELS[song.stage].short}
                  </Badge>
                  {song.musicalKey && (
                    <span className="text-xs text-soft">
                      Tom: {song.musicalKey}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
