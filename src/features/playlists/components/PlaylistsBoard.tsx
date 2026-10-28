"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ListMusic, Pencil, Play, Plus, Trash2, Users } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  Spinner,
} from "@/design-system";
import { RecordAuditButton } from "@/features/audit/components/RecordAudit";
import { playlistsClient } from "@/features/playlists/api/playlists.client";
import { PlaylistFormDrawer } from "@/features/playlists/components/PlaylistFormDrawer";
import { usePlaySongs } from "@/features/playlists/components/usePlaySongs";
import type { Playlist } from "@/shared/contracts/playlists";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/datetime";
import { useToast } from "@/shared/toast/useToast";

// The repertoire's playlists (rehearsal mode): yours and the ones shared with
// the band. "Tocar" plays every song in order in the app's player, where the
// speed and repeat can be set.
export function PlaylistsBoard({
  playlists,
  viewerId,
  tab,
}: {
  playlists: Playlist[];
  viewerId: string;
  /** "Minhas" or "Da banda" (shared with everyone). */
  tab: "mine" | "band";
}) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { play, pending } = usePlaySongs();
  const [editing, setEditing] = useState<Playlist | "new" | null>(null);
  const [removing, setRemoving] = useState<Playlist | null>(null);
  const [deleting, setDeleting] = useState(false);
  const close = useCallback(() => setEditing(null), []);

  const playPlaylist = (playlist: Playlist) =>
    play(playlist.id, async () =>
      (await playlistsClient.get(playlist.id)).songs.map((item) => item.song),
    );

  async function remove() {
    if (!removing) return;
    setDeleting(true);
    try {
      await playlistsClient.remove(removing.id);
      showSuccess("Playlist excluída.");
      setRemoving(null);
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível excluir.",
      );
    }
    setDeleting(false);
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          icon={<Plus className="size-4" />}
          onClick={() => setEditing("new")}
          className="max-sm:w-full max-sm:justify-center"
        >
          Nova playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ListMusic className="size-5" />}
            title={
              tab === "band"
                ? "Nenhuma playlist compartilhada com a banda"
                : "Nenhuma playlist ainda"
            }
            description={
              tab === "band"
                ? "Ao criar ou editar uma playlist, marque “Compartilhar com a banda” para ela aparecer aqui para todos."
                : "Monte uma lista de músicas para ensaiar: elas tocam em sequência, com repetição e controle de velocidade."
            }
          />
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => {
            const mine = playlist.ownerId === viewerId;
            return (
              <li key={playlist.id}>
                <Card className="flex h-full flex-col p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                      <ListMusic aria-hidden className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold break-words text-fg">
                        {playlist.name}
                      </p>
                      <p className="text-xs text-soft">
                        {playlist.songCount}{" "}
                        {playlist.songCount === 1 ? "música" : "músicas"}
                        {mine ? "" : ` · de ${playlist.ownerName}`}
                      </p>
                    </div>
                    {playlist.shared && (
                      <Badge tone="info">
                        <Users aria-hidden className="mr-1 inline size-3" />
                        Banda
                      </Badge>
                    )}
                    {/* Who created it and who changed it last, and when. */}
                    <RecordAuditButton
                      entity="playlist"
                      id={playlist.id}
                      label={playlist.name}
                    />
                  </div>
                  {playlist.description && (
                    <p className="mt-2 line-clamp-3 text-[13px] text-muted">
                      {playlist.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-soft">
                    Atualizada em {formatDateTime(playlist.updatedAt)}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                    <Button
                      size="sm"
                      icon={
                        pending === playlist.id ? (
                          <Spinner size="sm" label="Carregando" />
                        ) : (
                          <Play className="size-4" />
                        )
                      }
                      disabled={pending !== null || playlist.songCount === 0}
                      onClick={() => void playPlaylist(playlist)}
                    >
                      Tocar
                    </Button>
                    {mine && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<Pencil className="size-4" />}
                          onClick={() => setEditing(playlist)}
                        >
                          Editar
                        </Button>
                        <button
                          type="button"
                          onClick={() => setRemoving(playlist)}
                          aria-label={`Excluir ${playlist.name}`}
                          title="Excluir"
                          className="ml-auto grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <PlaylistFormDrawer
          playlist={editing === "new" ? undefined : editing}
          onClose={close}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
      <Modal
        open={removing !== null}
        onClose={() => setRemoving(null)}
        tone="danger"
        busy={deleting}
        icon={<Trash2 className="size-5" />}
        title="Excluir playlist"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRemoving(null)}
              disabled={deleting}
            >
              Voltar
            </Button>
            <Button variant="danger" onClick={remove} loading={deleting}>
              Excluir
            </Button>
          </>
        }
      >
        A playlist “{removing?.name}” será excluída. As músicas continuam no
        repertório.
      </Modal>
    </>
  );
}
