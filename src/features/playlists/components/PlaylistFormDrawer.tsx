"use client";

import { useEffect, useState } from "react";
import { ListMusic } from "lucide-react";
import {
  Button,
  Drawer,
  Field,
  FormSection,
  Spinner,
  TextArea,
} from "@/design-system";
import {
  SongListEditor,
  type SongListRow,
} from "@/features/events/components/SongListEditor";
import { playlistsClient } from "@/features/playlists/api/playlists.client";
import type { Playlist } from "@/shared/contracts/playlists";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Creates (no `playlist`) or edits a playlist: name, description, whether the
// band sees it, and its songs in order (the same picker as an event's list
// of songs).
export function PlaylistFormDrawer({
  playlist,
  onClose,
  onSaved,
}: {
  playlist?: Playlist;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showError, showSuccess } = useToast();
  const [name, setName] = useState(playlist?.name ?? "");
  const [description, setDescription] = useState(playlist?.description ?? "");
  const [shared, setShared] = useState(playlist?.shared ?? false);
  const [rows, setRows] = useState<SongListRow[] | null>(playlist ? null : []);
  const [pending, setPending] = useState(false);

  // Editing: its songs, in order.
  useEffect(() => {
    if (!playlist) return;
    let active = true;
    playlistsClient.get(playlist.id).then(
      (detail) => {
        if (!active) return;
        setRows(
          detail.songs.map((item) => ({
            songId: item.songId,
            title: item.song?.title ?? "Música removida",
            detail: item.song?.musicalKey ?? null,
          })),
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

  async function save() {
    if (!rows) return;
    setPending(true);
    try {
      const input = {
        name,
        description: description.trim() || null,
        shared,
        songIds: rows.map((row) => row.songId),
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
          description="Na ordem em que vão tocar. Cada música toca o primeiro áudio (ou o vídeo, quando não há áudio)."
        >
          {rows ? (
            <SongListEditor rows={rows} onChange={setRows} />
          ) : (
            <div className="grid place-items-center py-6">
              <Spinner size="sm" />
            </div>
          )}
        </FormSection>
      </div>
    </Drawer>
  );
}
