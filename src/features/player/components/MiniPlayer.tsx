"use client";

import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { Spinner, cn } from "@/design-system";
import { usePlayer } from "@/features/player/components/PlayerProvider";
import { formatDuration } from "@/features/repertoire/model/repertoire-labels";

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-surface-muted disabled:opacity-40";

export function MiniPlayer() {
  const player = usePlayer();
  const { current } = player;
  if (!current) return null;

  const hasNext = player.index < player.queue.length - 1;

  return (
    <>
      {/* Keeps page content clear of the fixed player bar. */}
      <div aria-hidden className="h-24" />
      <div
        role="region"
        aria-label="Player"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 shadow-card backdrop-blur"
      >
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
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg">
              {current.title}
            </p>
            <p className="truncate text-xs text-muted">
              {player.error ?? current.songTitle}
            </p>
          </div>
          <span className="hidden text-xs text-soft tabular-nums sm:inline">
            {formatDuration(player.position)} /{" "}
            {formatDuration(player.duration)}
          </span>
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
      </div>
    </>
  );
}
