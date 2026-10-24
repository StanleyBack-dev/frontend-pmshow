"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Pencil, Plus } from "lucide-react";
import { Alert, Button, Modal } from "@/design-system";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import { SongFormDrawer } from "@/features/repertoire/components/SongFormDrawer";
import type { Song } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";

export function NewSongButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Nova música
      </Button>
      {/* Remounted on each open, so the form starts empty. */}
      {open && <SongFormDrawer open onClose={() => setOpen(false)} />}
    </>
  );
}

export function EditSongButton({ song }: { song: Song }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        icon={<Pencil className="size-4" />}
      >
        Editar
      </Button>
      {open && (
        <SongFormDrawer open song={song} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

export function ArchiveSongButton({ song }: { song: Song }) {
  const router = useRouter();
  const archived = Boolean(song.archivedAt);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run() {
    setPending(true);
    setError(null);
    try {
      await repertoireClient.setArchived(song.id, !archived);
      setOpen(false);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        icon={
          archived ? (
            <ArchiveRestore className="size-4" />
          ) : (
            <Archive className="size-4" />
          )
        }
      >
        {archived ? "Restaurar" : "Arquivar"}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={archived ? "Restaurar música" : "Arquivar música"}
        busy={pending}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button onClick={run} loading={pending}>
              {archived ? "Restaurar" : "Arquivar"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {error && <Alert tone="danger">{error}</Alert>}
          <p>
            {archived
              ? "A música volta a aparecer no repertório."
              : "A música sai do repertório, mas os áudios e vídeos continuam guardados e ela pode ser restaurada."}
          </p>
        </div>
      </Modal>
    </>
  );
}
