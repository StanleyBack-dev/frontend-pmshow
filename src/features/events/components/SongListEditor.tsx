"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ListMusic, Save, X } from "lucide-react";
import { Button, Combobox, Modal, Select, Spinner } from "@/design-system";
import { artistsClient } from "@/features/artists/api/artists.client";
import {
  eventsClient,
  type SongOption,
} from "@/features/events/api/events.client";
import {
  CATEGORIES,
  CATEGORY_LABELS,
} from "@/features/repertoire/model/repertoire-labels";
import type { SetlistEntry } from "@/shared/contracts/events";
import type { Artist, SongCategory } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

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

type PickerFilter = "title" | "category" | "artist";

const FILTERS: { value: PickerFilter; label: string }[] = [
  { value: "title", label: "Título" },
  { value: "category", label: "Categoria" },
  { value: "artist", label: "Cantor / banda" },
];

// The list of songs of an event: a searchable select of the repertoire
// (narrowed by title, category or singer / band) adds songs; move up /
// down and remove. Controlled: the caller decides when to save (event
// drawer, the list dialog, the event page).
export function SongListEditor({
  rows,
  onChange,
}: {
  rows: SongListRow[];
  onChange: (rows: SongListRow[]) => void;
}) {
  const [filter, setFilter] = useState<PickerFilter>("title");
  const [filterValue, setFilterValue] = useState("");
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<SongOption[]>([]);
  const [loading, setLoading] = useState(false);
  // The filter whose songs are on screen: until the songs of the chosen
  // filter arrive, the select is locked (typing a title doesn't lock it).
  const [loadedFilter, setLoadedFilter] = useState<string | null>(null);
  const filterKey = `${filter}|${filterValue}`;
  const blocked = loadedFilter !== filterKey;
  const [artists, setArtists] = useState<Artist[]>([]);

  // Singers / bands for the filter, once.
  useEffect(() => {
    let active = true;
    artistsClient.list().then(
      (result) => {
        if (active) setArtists(result);
      },
      () => undefined,
    );
    return () => {
      active = false;
    };
  }, []);

  // The songs matching the filter and the typed text (debounced).
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      eventsClient
        .searchSongs({
          q: query.trim() || undefined,
          category:
            filter === "category" && filterValue
              ? (filterValue as SongCategory)
              : undefined,
          artistId:
            filter === "artist" && filterValue ? filterValue : undefined,
        })
        .then(
          (result) => {
            if (!active) return;
            setSongs(result);
            setLoadedFilter(filterKey);
          },
          () => {
            if (!active) return;
            setSongs([]);
            setLoadedFilter(filterKey);
          },
        )
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filter, filterValue, filterKey, query]);

  const inList = new Set(rows.map((row) => row.songId));
  // Songs already in the list are not offered again.
  const available = songs.filter((song) => !inList.has(song.id));
  const options = available.map((song) => ({
    value: song.id,
    label: song.title,
    description: [song.artist, CATEGORY_LABELS[song.category], song.musicalKey]
      .filter(Boolean)
      .join(" · "),
  }));

  function add(songId: string | null) {
    const song = songs.find((item) => item.id === songId);
    if (!song || inList.has(song.id)) return;
    onChange([
      ...rows,
      { songId: song.id, title: song.title, detail: song.musicalKey },
    ]);
  }

  function move(index: number, delta: number) {
    const next = [...rows];
    const [row] = next.splice(index, 1);
    next.splice(index + delta, 0, row);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
        <Select
          label="Filtrar por"
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value as PickerFilter);
            setFilterValue("");
          }}
          options={FILTERS}
        />
        {filter === "category" ? (
          <Select
            label="Categoria"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            placeholder="Todas"
            options={CATEGORIES.map((value) => ({
              value,
              label: CATEGORY_LABELS[value],
            }))}
          />
        ) : filter === "artist" ? (
          <Select
            label="Cantor / banda"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            placeholder="Todos"
            options={artists.map((artist) => ({
              value: artist.id,
              label: artist.name,
            }))}
          />
        ) : (
          <p className="self-end pb-2 text-xs text-soft">
            Digite o título (ou o cantor) no campo abaixo.
          </p>
        )}
      </div>

      <Combobox
        label="Adicionar música"
        placeholder={
          blocked
            ? "Carregando músicas…"
            : filter === "title"
              ? "Busque pelo título"
              : "Escolha na lista ou digite para filtrar"
        }
        disabled={blocked}
        options={options}
        value={null}
        onSelect={add}
        onInputChange={setQuery}
        loading={loading}
        emptyText={
          songs.length > 0
            ? "Todas as músicas encontradas já estão na lista"
            : "Nenhuma música encontrada"
        }
        footer={
          songs.length >= 100
            ? "Mostrando as 100 primeiras: refine a busca."
            : undefined
        }
      />

      {rows.length === 0 ? (
        <p className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-[13px] text-soft">
          <ListMusic aria-hidden className="size-4" />
          Nenhuma música na lista. Escolha acima para adicionar.
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
  const [failed, setFailed] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    if (!eventId) return;
    let active = true;
    eventsClient.setlist(eventId).then(
      (setlist) => {
        if (active) setRows(toSongListRows(setlist));
      },
      (cause: unknown) => {
        if (!active) return;
        setFailed(true);
        showError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar a lista de músicas.",
        );
      },
    );
    return () => {
      active = false;
    };
  }, [eventId, showError]);

  return { rows, setRows, failed };
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
  const { rows, setRows, failed } = useEventSongList(eventId);
  const { showError } = useToast();
  const [pending, setPending] = useState(false);

  async function save() {
    if (!rows) return;
    setPending(true);
    try {
      await eventsClient.setSetlist(eventId, toSongListItems(rows));
      router.refresh();
      onClose();
    } catch (cause) {
      showError(
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
        {rows ? (
          <SongListEditor rows={rows} onChange={setRows} />
        ) : (
          !failed && (
            <div className="grid place-items-center py-6">
              <Spinner />
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
