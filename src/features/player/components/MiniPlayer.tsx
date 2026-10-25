"use client";

import {
  ExternalLink,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { buttonClasses, Spinner, cn } from "@/design-system";
import {
  PlayerVideoSlot,
  usePlayer,
} from "@/features/player/components/PlayerProvider";
import { LyricsButton } from "@/features/repertoire/components/LyricsViewer";
import { formatDuration } from "@/features/repertoire/model/repertoire-labels";
import { youtubeWatchUrl } from "@/features/repertoire/model/video-guess";

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-surface-muted disabled:opacity-40";

// Position slider, current track and the transport buttons. Used by the
// bar at the bottom of the page and by PlayerPanel inside drawers.
export function PlayerControls({ inline = false }: { inline?: boolean }) {
  const player = usePlayer();
  const { current } = player;
  if (!current) return null;

  const hasNext = player.index < player.queue.length - 1;
  // YouTube refused to play it here: still let the musician listen there.
  const openOnYoutube =
    player.error && current.youtubeVideoId
      ? youtubeWatchUrl(current.youtubeVideoId)
      : null;

  return (
    <>
      <input
        type="range"
        aria-label="Posição"
        min={0}
        max={player.duration || 0}
        step={1}
        value={Math.min(player.position, player.duration || 0)}
        onChange={(event) => player.seek(Number(event.target.value))}
        disabled={!player.duration}
        className="block h-1.5 w-full cursor-pointer accent-[var(--brand-gold)]"
      />
      <div
        className={cn(
          "flex items-center gap-2",
          inline ? "pt-2" : "mx-auto max-w-6xl px-3 py-2 sm:gap-3 sm:px-6",
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">
            {current.title}
          </p>
          <p
            className={cn(
              "truncate text-xs",
              player.error ? "text-danger" : "text-muted",
            )}
          >
            {player.error ?? current.songTitle}
          </p>
        </div>
        {openOnYoutube && (
          <a
            href={openOnYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonClasses("secondary", "sm"),
              "shrink-0 max-sm:w-8 max-sm:px-0",
            )}
          >
            <ExternalLink aria-hidden className="size-4" />
            <span className="max-sm:sr-only">Abrir no YouTube</span>
          </a>
        )}
        <span className="hidden text-xs text-soft tabular-nums sm:inline">
          {formatDuration(player.position)} / {formatDuration(player.duration)}
        </span>
        {current.lyrics && (
          <LyricsButton
            title={current.lyrics.title}
            lyrics={current.lyrics.text}
          />
        )}
        <button
          type="button"
          className={iconButton}
          onClick={player.previous}
          aria-label="Anterior"
        >
          <SkipBack className="size-5" />
        </button>
        <button
          type="button"
          onClick={player.toggle}
          aria-label={player.playing ? "Pausar" : "Tocar"}
          className={cn(
            iconButton,
            "size-11 bg-accent text-accent-fg hover:bg-accent-hover",
          )}
        >
          {player.loading ? (
            <Spinner size="sm" label="Carregando" />
          ) : player.playing ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5" />
          )}
        </button>
        <button
          type="button"
          className={iconButton}
          onClick={player.next}
          disabled={!hasNext}
          aria-label="Próxima"
        >
          <SkipForward className="size-5" />
        </button>
        <button
          type="button"
          className={cn(iconButton, "text-soft")}
          onClick={player.close}
          aria-label="Fechar player"
        >
          <X className="size-5" />
        </button>
      </div>
    </>
  );
}

export function MiniPlayer() {
  const { current, embedded } = usePlayer();
  // While a drawer shows the player, it lives only there.
  if (!current || embedded) return null;
  return (
    // Rendered at the end of the content column (AppShell `bottomBar`):
    // sticky, so it spans the column and never sits under the side menu.
    <div
      role="region"
      aria-label="Player"
      className="sticky bottom-0 z-30 border-t border-border bg-surface/95 shadow-card backdrop-blur"
    >
      <PlayerControls />
    </div>
  );
}

/**
 * The player inside a drawer, which covers the page bar and the floating
 * video: the YouTube video (when one plays) above the controls.
 */
export function PlayerPanel({ className }: { className?: string }) {
  const { current, error } = usePlayer();
  const showVideo = Boolean(current?.youtubeVideoId) && !error;
  return (
    <div
      role="region"
      aria-label="Player"
      className={cn(!current && "hidden", className)}
    >
      {/* Mounted while the panel is, so the video moves here at once. */}
      <PlayerVideoSlot
        className={cn(
          "mb-2 aspect-video w-full overflow-hidden rounded-md bg-black",
          !showVideo && "hidden",
        )}
      />
      {current && <PlayerControls inline />}
    </div>
  );
}
