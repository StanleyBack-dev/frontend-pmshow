"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Pencil, Plus } from "lucide-react";
import { Alert, Button, Modal } from "@/design-system";
import { repertoireClient } from "@/features/repertoire/api/repertoire.client";
import { SongFormDrawer } from "@/features/repertoire/components/SongFormDrawer";
import type { Artist, Song } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";

export function NewSongButton({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
        Nova música
      </Button>
      {/* Remounted on each open, so the form starts empty. */}
      {open && (
        <SongFormDrawer open artists={artists} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

export function EditSongButton({
  song,
  artists,
}: {
  song: Song;
  artists: Artist[];
}) {
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
        <SongFormDrawer
          open
          song={song}
          artists={artists}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// Pencil at the start of a repertoire row: the only way to open the form
// from the list (the row itself is not clickable).
export function EditSongIconButton({
  song,
  artists,
}: {
  song: Song;
  artists: Artist[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Editar ${song.title}`}
        title="Editar música"
        className="grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
      >
        <Pencil aria-hidden className="size-4" />
      </button>
      {open && (
        <SongFormDrawer
          open
          song={song}
          artists={artists}
          onClose={() => setOpen(false)}
        />
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
