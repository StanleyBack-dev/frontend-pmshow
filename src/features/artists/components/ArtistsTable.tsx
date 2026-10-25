"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Music, Pencil } from "lucide-react";
import { Alert, Badge, DataTable, type DataTableColumn } from "@/design-system";
import { artistsClient } from "@/features/artists/api/artists.client";
import { ArtistFormDrawer } from "@/features/artists/components/ArtistFormDrawer";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { ArtistSongsDrawer } from "@/features/artists/components/ArtistSongsDrawer";
import type { ArtistListItem } from "@/shared/contracts/repertoire";
import { ApiClientError } from "@/shared/lib/api-client";

const iconButton =
  "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg disabled:opacity-40";

// Singers / bands list (amoremio table). Managers edit with the pencil at
// the start of the row and archive / restore at the end; the song count
// opens a drawer with the artist's songs (lyrics and play).
export function ArtistsTable({
  artists,
  canManage,
  canAudit,
}: {
  artists: ArtistListItem[];
  canManage: boolean;
  /** Shows the audit column (desktop) / section (phones). */
  canAudit: boolean;
}) {
  const audit = auditColumn((artist: ArtistListItem) => ({
    entity: "artist" as const,
    id: artist.id,
    label: artist.name,
    createdAt: artist.createdAt,
  }));
  const router = useRouter();
  const [editing, setEditing] = useState<ArtistListItem | null>(null);
  const [listing, setListing] = useState<ArtistListItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleArchived(artist: ArtistListItem) {
    setBusyId(artist.id);
    setError(null);
    try {
      await artistsClient.update(artist.id, {
        name: artist.name,
        archived: !artist.archived,
      });
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível alterar.",
      );
    }
    setBusyId(null);
  }

  const columns: DataTableColumn<ArtistListItem>[] = [
    ...(canManage
      ? [
          {
            key: "edit",
            label: "",
            className: "w-12 pr-0",
            mobile: "control" as const,
            render: (artist: ArtistListItem) => (
              <button
                type="button"
                onClick={() => setEditing(artist)}
                aria-label={`Editar ${artist.name}`}
                title="Editar"
                className={iconButton}
              >
                <Pencil aria-hidden className="size-4" />
              </button>
            ),
          },
        ]
      : []),
    {
      key: "name",
      label: "Cantor / banda",
      mobile: "title",
      render: (artist) => (
        <span className="font-medium text-fg">{artist.name}</span>
      ),
    },
    {
      key: "songs",
      label: "Músicas",
      className: "w-32",
      // Phones: next to the pencil (controls keep the column order).
      mobile: "control",
      render: (artist) => {
        const label =
          artist.songCount === 1 ? "1 música" : `${artist.songCount} músicas`;
        return artist.songCount > 0 ? (
          <button
            type="button"
            onClick={() => setListing(artist)}
            aria-label={`Ver ${label} de ${artist.name}`}
            title={`Ver ${label}`}
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-medium text-accent tabular-nums hover:bg-accent-soft"
          >
            <Music aria-hidden className="size-4" />
            {artist.songCount}
          </button>
        ) : (
          <span
            title="Nenhuma música"
            className="inline-flex items-center gap-1.5 px-1.5 text-soft tabular-nums"
          >
            <Music aria-hidden className="size-4" />0
            <span className="sr-only">músicas</span>
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Situação",
      className: "w-32",
      render: (artist) =>
        artist.archived ? (
          <Badge tone="neutral">Arquivado</Badge>
        ) : (
          <Badge tone="success">Ativo</Badge>
        ),
    },
    ...(canManage
      ? [
          {
            key: "archive",
            label: "",
            className: "w-12 pl-0",
            mobile: "control" as const,
            render: (artist: ArtistListItem) => (
              <button
                type="button"
                onClick={() => toggleArchived(artist)}
                disabled={busyId === artist.id}
                aria-label={
                  artist.archived
                    ? `Restaurar ${artist.name}`
                    : `Arquivar ${artist.name}`
                }
                title={artist.archived ? "Restaurar" : "Arquivar"}
                className={iconButton}
              >
                {artist.archived ? (
                  <ArchiveRestore aria-hidden className="size-4" />
                ) : (
                  <Archive aria-hidden className="size-4" />
                )}
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {error && (
        <div className="p-3">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}
      <DataTable
        rows={artists}
        columns={canAudit ? [...columns, audit.column] : columns}
        getId={(item) => item.id}
        renderExpanded={canAudit ? audit.renderExpanded : undefined}
      />
      {/* Remounted on each open, so the form starts from the row. */}
      {listing && (
        <ArtistSongsDrawer artist={listing} onClose={() => setListing(null)} />
      )}
      {editing && (
        <ArtistFormDrawer
          artist={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
