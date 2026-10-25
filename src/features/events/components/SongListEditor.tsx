"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ListMusic, Plus, Save, X } from "lucide-react";
import { Alert, Button, Field, Modal, Spinner } from "@/design-system";
import {
  eventsClient,
  type SongOption,
} from "@/features/events/api/events.client";
import type { SetlistEntry } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";

/** A song in an event's list of songs (as edited, before saving). */
export type SongListRow = {
  songId: string;
  title: string;
  detail: string | null;
};

export const toSongListRows = (setlist: SetlistEntry[]): SongListRow[] =>
  setlist.map((entry) => ({
    songId: entry.songId,
    title: entry.song?.title ?? "Música removida",
    detail: entry.song?.musicalKey ?? null,
  }));

export const toSongListItems = (rows: SongListRow[]) =>
  rows.map((row) => ({ songId: row.songId, notes: null }));

const rowButton =
  "grid size-8 shrink-0 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg disabled:opacity-30";

// The list of songs of an event: search the repertoire to add, move up /
// down, remove. Controlled: the caller decides when to save (event drawer,
// the list dialog, the event page).
export function SongListEditor({
  rows,
  onChange,
}: {
  rows: SongListRow[];
  onChange: (rows: SongListRow[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SongOption[]>([]);

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

  const inList = new Set(rows.map((row) => row.songId));
  const visibleResults = query.trim().length < 2 ? [] : results;

  function move(index: number, delta: number) {
    const next = [...rows];
    const [row] = next.splice(index, 1);
    next.splice(index + delta, 0, row);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div>
        <Field
          label="Adicionar música"
          placeholder="Digite parte do título ou do cantor"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {visibleResults.length > 0 && (
          <ul className="mt-2 max-h-56 divide-y divide-border overflow-y-auto rounded-md border border-border">
            {visibleResults.map((song) => (
              <li
                key={song.id}
                className="flex items-center gap-2 px-3 py-1.5 text-[13px]"
              >
                <span className="min-w-0 flex-1 truncate text-fg">
                  {song.title}
                  {song.artist && (
                    <span className="text-soft"> · {song.artist}</span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={inList.has(song.id)}
                  icon={<Plus className="size-4" />}
                  onClick={() =>
                    onChange([
                      ...rows,
                      {
                        songId: song.id,
                        title: song.title,
                        detail: song.musicalKey,
                      },
                    ])
                  }
                >
                  {inList.has(song.id) ? "Já está" : "Adicionar"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-[13px] text-soft">
          <ListMusic aria-hidden className="size-4" />
          Nenhuma música na lista. Busque acima para adicionar.
        </p>
      ) : (
        <ol className="divide-y divide-border rounded-md border border-border">
          {rows.map((row, index) => (
            <li
              key={row.songId}
              className="flex items-center gap-1 px-2 py-1.5 text-[13px]"
            >
              <span className="w-6 shrink-0 text-right text-soft tabular-nums">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate pl-1 text-fg">
                {row.title}
                {row.detail && (
                  <span className="text-soft"> · {row.detail}</span>
                )}
              </span>
              <button
                type="button"
                aria-label={`Subir ${row.title}`}
                title="Subir"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className={rowButton}
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Descer ${row.title}`}
                title="Descer"
                disabled={index === rows.length - 1}
                onClick={() => move(index, 1)}
                className={rowButton}
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Retirar ${row.title}`}
                title="Retirar da lista"
                onClick={() =>
                  onChange(rows.filter((item) => item.songId !== row.songId))
                }
                className={`${rowButton} hover:bg-danger-soft hover:text-danger`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** Loads an event's list of songs (rows) on the client. */
export function useEventSongList(eventId: string | undefined) {
  const [rows, setRows] = useState<SongListRow[] | null>(eventId ? null : []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let active = true;
    eventsClient.setlist(eventId).then(
      (setlist) => {
        if (active) setRows(toSongListRows(setlist));
      },
      (cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar a lista de músicas.",
        );
      },
    );
    return () => {
      active = false;
    };
  }, [eventId]);

  return { rows, setRows, error };
}

// Opened from the events table: only the event's list of songs, saved here.
export function SongListModal({
  eventId,
  eventTitle,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const { rows, setRows, error: loadError } = useEventSongList(eventId);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save() {
    if (!rows) return;
    setPending(true);
    setError(null);
    try {
      await eventsClient.setSetlist(eventId, toSongListItems(rows));
      router.refresh();
      onClose();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a lista de músicas.",
      );
      setPending(false);
    }
  }

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={`Lista de músicas · ${eventTitle}`}
      busy={pending}
      footer={
        <Button
          onClick={save}
          loading={pending}
          disabled={!rows}
          icon={<Save className="size-4" />}
        >
          Salvar lista
        </Button>
      }
    >
      <div className="space-y-3">
        {(loadError || error) && (
          <Alert tone="danger">{loadError ?? error}</Alert>
        )}
        {rows ? (
          <SongListEditor rows={rows} onChange={setRows} />
        ) : (
          !loadError && (
            <div className="grid place-items-center py-6">
              <Spinner />
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
