"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ListMusic,
  Pencil,
  PlayCircle,
  Plus,
  Save,
  X,
} from "lucide-react";
import { Alert, Button, inputClasses } from "@/design-system";
import {
  eventsClient,
  type SongOption,
} from "@/features/events/api/events.client";
import {
  usePlayer,
  type Track,
} from "@/features/player/components/PlayerProvider";
import { formatDuration } from "@/features/repertoire/model/repertoire-labels";
import type { SetlistEntry } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";

type Row = { songId: string; title: string; detail: string | null };

const toRows = (setlist: SetlistEntry[]): Row[] =>
  setlist.map((entry) => ({
    songId: entry.songId,
    title: entry.song?.title ?? "Música removida",
    detail: entry.song?.musicalKey ?? null,
  }));

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
        initial={toRows(setlist)}
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
  // The first audio of each song, in setlist order.
  const queue: Track[] = setlist.flatMap((entry) => {
    const audio = entry.song?.media.find((item) => item.kind === "AUDIO");
    return audio && entry.song
      ? [{ assetId: audio.id, title: entry.song.title, songTitle: eventTitle }]
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
            Tocar setlist ({queue.length})
          </Button>
        )}
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Pencil className="size-4" />}
            onClick={onEdit}
          >
            Editar setlist
          </Button>
        )}
      </div>
      {setlist.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma música no setlist ainda.</p>
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
  initial: Row[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SongOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Debounced search in the repertoire.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const timer = setTimeout(() => {
      eventsClient
        .searchSongs(term)
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const inSetlist = new Set(rows.map((row) => row.songId));
  const visibleResults = query.trim().length < 2 ? [] : results;

  function move(index: number, delta: number) {
    setRows((current) => {
      const next = [...current];
      const [row] = next.splice(index, 1);
      next.splice(index + delta, 0, row);
      return next;
    });
  }

  async function save() {
    setPending(true);
    setError(null);
    try {
      await eventsClient.setSetlist(
        eventId,
        rows.map((row) => ({ songId: row.songId, notes: null })),
      );
      router.refresh();
      onDone();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar o setlist.",
      );
    }
    setPending(false);
  }

  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}

      <div>
        <label
          className="mb-1.5 block text-sm font-medium text-fg"
          htmlFor="busca-musica"
        >
          Adicionar música
        </label>
        <input
          id="busca-musica"
          className={inputClasses}
          placeholder="Digite parte do título"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {visibleResults.length > 0 && (
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
            {visibleResults.map((song) => (
              <li
                key={song.id}
                className="flex items-center gap-2 px-3 py-2 text-sm"
              >
                <span className="flex-1 text-fg">
                  {song.title}
                  {song.artist && (
                    <span className="text-soft"> · {song.artist}</span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={inSetlist.has(song.id)}
                  icon={<Plus className="size-4" />}
                  onClick={() =>
                    setRows((current) => [
                      ...current,
                      {
                        songId: song.id,
                        title: song.title,
                        detail: song.musicalKey,
                      },
                    ])
                  }
                >
                  {inSetlist.has(song.id) ? "Já está" : "Adicionar"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted">
          <ListMusic className="size-4" /> Setlist vazio.
        </p>
      ) : (
        <ol className="divide-y divide-border rounded-lg border border-border">
          {rows.map((row, index) => (
            <li
              key={row.songId}
              className="flex items-center gap-2 px-3 py-2 text-sm"
            >
              <span className="w-6 text-right text-soft tabular-nums">
                {index + 1}
              </span>
              <span className="flex-1 text-fg">
                {row.title}
                {row.detail && (
                  <span className="text-soft"> · {row.detail}</span>
                )}
              </span>
              <button
                type="button"
                aria-label={`Subir ${row.title}`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="grid size-8 place-items-center rounded-md text-soft hover:bg-surface-muted hover:text-fg disabled:opacity-30"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Descer ${row.title}`}
                disabled={index === rows.length - 1}
                onClick={() => move(index, 1)}
                className="grid size-8 place-items-center rounded-md text-soft hover:bg-surface-muted hover:text-fg disabled:opacity-30"
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Tirar ${row.title}`}
                onClick={() =>
                  setRows((current) =>
                    current.filter((item) => item.songId !== row.songId),
                  )
                }
                className="grid size-8 place-items-center rounded-md text-soft hover:bg-danger-soft hover:text-danger"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="flex gap-2">
        <Button
          onClick={save}
          loading={pending}
          icon={<Save className="size-4" />}
        >
          Salvar setlist
        </Button>
        <Button variant="secondary" onClick={onDone} disabled={pending}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
