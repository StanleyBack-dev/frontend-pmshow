"use client";

import { Download, Pause, Play, PlayCircle } from "lucide-react";
import { Button, cn } from "@/design-system";
import {
  usePlayer,
  type Track,
} from "@/features/player/components/PlayerProvider";
import { MediaItemActions } from "@/features/repertoire/components/MediaItemActions";
import {
  formatBytes,
  formatDuration,
} from "@/features/repertoire/model/repertoire-labels";
import type { MediaAsset } from "@/shared/contracts/repertoire";

export function AudioList({
  songTitle,
  audios,
  canDownload,
  canManage,
}: {
  songTitle: string;
  audios: MediaAsset[];
  canDownload: boolean;
  canManage: boolean;
}) {
  const player = usePlayer();
  const queue: Track[] = audios.map((audio) => ({
    assetId: audio.id,
    title: audio.title,
    songTitle,
  }));

  if (audios.length === 0) {
    return <p className="text-sm text-muted">Nenhum áudio ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {audios.length > 1 && (
        <Button
          variant="secondary"
          size="sm"
          icon={<PlayCircle className="size-4" />}
          onClick={() => player.play(queue[0], queue)}
        >
          Tocar todos
        </Button>
      )}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {audios.map((audio, index) => {
          const isCurrent = player.current?.assetId === audio.id;
          const isPlaying = isCurrent && player.playing;
          return (
            <li
              key={audio.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5",
                isCurrent && "bg-accent-soft",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  isCurrent ? player.toggle() : player.play(queue[index], queue)
                }
                aria-label={
                  isPlaying ? `Pausar ${audio.title}` : `Tocar ${audio.title}`
                }
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-fg hover:bg-accent-hover"
              >
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">
                  {audio.title}
                </p>
                <p className="text-xs text-soft">
                  {formatDuration(audio.durationSeconds)} ·{" "}
                  {formatBytes(audio.sizeBytes)}
                </p>
              </div>
              {canDownload && (
                <a
                  href={`/api/media/${audio.id}/download`}
                  aria-label={`Baixar ${audio.title}`}
                  title="Baixar"
                  className="grid size-8 place-items-center rounded-md text-soft hover:bg-surface-muted hover:text-fg"
                >
                  <Download className="size-4" />
                </a>
              )}
              {canManage && <MediaItemActions asset={audio} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
