"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, PlayCircle, Save } from "lucide-react";
import { Alert, Button } from "@/design-system";
import { eventsClient } from "@/features/events/api/events.client";
import {
  SongListEditor,
  toSongListItems,
  toSongListRows,
  type SongListRow,
} from "@/features/events/components/SongListEditor";
import {
  usePlayer,
  type Track,
} from "@/features/player/components/PlayerProvider";
import { formatDuration } from "@/features/repertoire/model/repertoire-labels";
import type { SetlistEntry } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";

export function Setlist({
  eventId,
  eventTitle,
  setlist,
  canEdit,
}: {
  eventId: string;
  eventTitle: string;
  setlist: SetlistEntry[];
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <SetlistEditor
        eventId={eventId}
        initial={toSongListRows(setlist)}
        onDone={() => setEditing(false)}
      />
    );
  }
  return (
    <SetlistView
      eventTitle={eventTitle}
      setlist={setlist}
      onEdit={canEdit ? () => setEditing(true) : undefined}
    />
  );
}

function SetlistView({
  eventTitle,
  setlist,
  onEdit,
}: {
  eventTitle: string;
  setlist: SetlistEntry[];
  onEdit?: () => void;
}) {
  const player = usePlayer();
  // The first audio of each song, in the list's order.
  const queue: Track[] = setlist.flatMap((entry) => {
    const audio = entry.song?.media.find((item) => item.kind === "AUDIO");
    return audio && entry.song
      ? [
          {
            assetId: audio.id,
            title: entry.song.title,
            songTitle: eventTitle,
            lyrics: { title: entry.song.title, text: entry.song.lyrics },
          },
        ]
      : [];
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {queue.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<PlayCircle className="size-4" />}
            onClick={() => player.play(queue[0], queue)}
          >
            Tocar lista ({queue.length})
          </Button>
        )}
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Pencil className="size-4" />}
            onClick={onEdit}
          >
            Editar lista
          </Button>
        )}
      </div>
      {setlist.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma música na lista ainda.</p>
      ) : (
        <ol className="divide-y divide-border rounded-lg border border-border">
          {setlist.map((entry) => (
            <li
              key={entry.songId}
              className="flex items-center gap-3 px-3 py-2.5 text-sm"
            >
              <span className="w-6 text-right text-soft tabular-nums">
                {entry.position}
              </span>
              <span className="min-w-0 flex-1">
                {entry.song ? (
                  <Link
                    href={`/repertorio/${entry.song.id}`}
                    className="font-medium text-fg hover:text-accent"
                  >
                    {entry.song.title}
                  </Link>
                ) : (
                  <span className="text-soft">Música removida</span>
                )}
                {entry.notes && (
                  <span className="block text-xs text-soft">{entry.notes}</span>
                )}
              </span>
              {entry.song?.musicalKey && (
                <span className="text-muted">{entry.song.musicalKey}</span>
              )}
              <span className="w-10 text-right text-soft tabular-nums">
                {formatDuration(entry.song?.durationSeconds)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function SetlistEditor({
  eventId,
  initial,
  onDone,
}: {
  eventId: string;
  initial: SongListRow[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<SongListRow[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    setError(null);
    try {
      await eventsClient.setSetlist(eventId, toSongListItems(rows));
      router.refresh();
      onDone();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a lista de músicas.",
      );
    }
    setPending(false);
  }

  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <SongListEditor rows={rows} onChange={setRows} />
      <div className="flex gap-2">
        <Button
          onClick={save}
          loading={pending}
          icon={<Save className="size-4" />}
        >
          Salvar lista
        </Button>
        <Button variant="secondary" onClick={onDone} disabled={pending}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
