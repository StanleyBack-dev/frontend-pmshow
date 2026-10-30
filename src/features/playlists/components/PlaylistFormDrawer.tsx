"use client";

import { useEffect, useState } from "react";
import { ListMusic, MonitorPlay, Search } from "lucide-react";
import {
  Button,
  Drawer,
  Field,
  FormSection,
  Spinner,
  TextArea,
} from "@/design-system";
import {
  OrderedList,
  SongPicker,
  moveRow,
} from "@/features/events/components/SongListEditor";
import { playlistsClient } from "@/features/playlists/api/playlists.client";
import { YoutubeSearchModal } from "@/features/repertoire/components/YoutubeSearchModal";
import type {
  Playlist,
  PlaylistItemInput,
  PlaylistVideo,
} from "@/shared/contracts/playlists";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

/** A line being edited: a song of the repertoire or a YouTube video. */
type Row =
  | { songId: string; title: string; detail: string | null }
  | { video: PlaylistVideo; title: string; detail: string | null };

const rowKey = (row: Row) =>
  "video" in row ? `video:${row.video.videoId}` : row.songId;

const toInput = (row: Row): PlaylistItemInput =>
  "video" in row ? { video: row.video } : { songId: row.songId };

// Creates (no `playlist`) or edits a playlist: name, description, whether the
// band sees it, and what it plays in order: songs of the repertoire (the
// same picker as an event's list of songs) and, for who can search YouTube,
// videos found there. The videos stay in the playlist only: they are not
// added to the repertoire.
export function PlaylistFormDrawer({
  playlist,
  canSearchYoutube,
  onClose,
  onSaved,
}: {
  playlist?: Playlist;
  canSearchYoutube: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showError, showSuccess } = useToast();
  const [name, setName] = useState(playlist?.name ?? "");
  const [description, setDescription] = useState(playlist?.description ?? "");
  const [shared, setShared] = useState(playlist?.shared ?? false);
  const [rows, setRows] = useState<Row[] | null>(playlist ? null : []);
  const [searching, setSearching] = useState(false);
  const [pending, setPending] = useState(false);

  // Editing: its items, in order.
  useEffect(() => {
    if (!playlist) return;
    let active = true;
    playlistsClient.get(playlist.id).then(
      (detail) => {
        if (!active) return;
        setRows(
          detail.items.flatMap((item): Row[] => {
            if (item.video) {
              return [
                {
                  video: item.video,
                  title: item.video.title,
                  detail: item.video.channelTitle,
                },
              ];
            }
            if (!item.songId) return [];
            return [
              {
                songId: item.songId,
                title: item.song?.title ?? "Música removida",
                detail: item.song?.musicalKey ?? null,
              },
            ];
          }),
        );
      },
      (cause: unknown) => {
        if (!active) return;
        showError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar a playlist.",
        );
        onClose();
      },
    );
    return () => {
      active = false;
    };
  }, [playlist, onClose, showError]);

  function add(row: Row) {
    if (!rows || rows.some((item) => rowKey(item) === rowKey(row))) return;
    setRows([...rows, row]);
  }

  async function save() {
    if (!rows) return;
    setPending(true);
    try {
      const input = {
        name,
        description: description.trim() || null,
        shared,
        items: rows.map(toInput),
      };
      if (playlist) await playlistsClient.update(playlist.id, input);
      else await playlistsClient.create(input);
      showSuccess(playlist ? "Playlist salva." : "Playlist criada.");
      onSaved();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a playlist.",
      );
      setPending(false);
    }
  }

  return (
    <Drawer
      open
      width="lg"
      onClose={onClose}
      busy={pending}
      title={playlist ? "Editar playlist" : "Nova playlist"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={save}
            loading={pending}
            disabled={name.trim().length < 2 || !rows}
          >
            {playlist ? "Salvar" : "Criar playlist"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <FormSection
          icon={<ListMusic />}
          title="A playlist"
          description="Ex.: Ensaio de quinta, Desfile 7 de setembro, Repertório do baile."
        >
          <Field
            label="Nome"
            required
            data-autofocus
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextArea
            label="Descrição (opcional)"
            rows={2}
            maxLength={300}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <label className="flex cursor-pointer items-start gap-2 text-[13px] text-fg">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-[var(--accent)]"
              checked={shared}
              onChange={(event) => setShared(event.target.checked)}
            />
            <span>
              Compartilhar com a banda
              <span className="block text-xs text-soft">
                Todos podem ver e tocar; só você altera.
              </span>
            </span>
          </label>
        </FormSection>

        <FormSection
          icon={<ListMusic />}
          title="Músicas"
          description={
            canSearchYoutube
              ? "Adicione vídeos do YouTube ou músicas do repertório. Tocam na ordem da lista; as do repertório tocam o áudio já cadastrado nelas (ou o vídeo, se não tiverem áudio)."
              : "Adicione músicas do repertório. Tocam na ordem da lista, com o áudio já cadastrado em cada uma (ou o vídeo, se não tiver áudio)."
          }
        >
          {rows ? (
            <div className="space-y-3">
              {/* First in the section, so songs outside the repertoire are
                  easy to find. */}
              {canSearchYoutube && (
                <button
                  type="button"
                  onClick={() => setSearching(true)}
                  className="flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-danger/40 bg-danger-soft px-4 py-3 text-left transition-colors hover:border-danger"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger text-white">
                    <MonitorPlay aria-hidden className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-fg">
                      Buscar no YouTube
                    </span>
                    <span className="block text-xs text-muted">
                      Músicas que não estão no repertório: ficam só nesta
                      playlist.
                    </span>
                  </span>
                  <Search aria-hidden className="size-4 shrink-0 text-danger" />
                </button>
              )}
              <SongPicker
                exclude={
                  new Set(
                    rows.flatMap((row) =>
                      "songId" in row ? [row.songId] : [],
                    ),
                  )
                }
                onPick={(song) =>
                  add({
                    songId: song.id,
                    title: song.title,
                    detail: song.musicalKey,
                  })
                }
              />
              <OrderedList
                items={rows.map((row) => ({
                  key: rowKey(row),
                  title: row.title,
                  detail: row.detail,
                  icon:
                    "video" in row ? (
                      <MonitorPlay
                        aria-label="Vídeo do YouTube"
                        className="size-4 shrink-0 text-danger"
                      />
                    ) : undefined,
                }))}
                emptyText={
                  canSearchYoutube
                    ? "Nenhuma música na lista. Escolha do repertório ou busque no YouTube."
                    : "Nenhuma música na lista. Escolha acima para adicionar."
                }
                onMove={(index, delta) => setRows(moveRow(rows, index, delta))}
                onRemove={(index) =>
                  setRows(rows.filter((_, i) => i !== index))
                }
              />
            </div>
          ) : (
            <div className="grid place-items-center py-6">
              <Spinner size="sm" />
            </div>
          )}
        </FormSection>
      </div>
      {searching && (
        <YoutubeSearchModal
          open
          initialQuery=""
          onClose={() => setSearching(false)}
          onPick={(video) => {
            add({
              video: {
                videoId: video.videoId,
                title: video.title,
                channelTitle: video.channelTitle || null,
              },
              title: video.title,
              detail: video.channelTitle || null,
            });
            setSearching(false);
          }}
        />
      )}
    </Drawer>
  );
}
