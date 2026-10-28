"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, ExternalLink, Pencil } from "lucide-react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { eventsClient } from "@/features/events/api/events.client";
import { VenueFormDrawer } from "@/features/events/components/VenueFormDrawer";
import type { Venue } from "@/shared/contracts/events";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

const iconButton =
  "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg disabled:opacity-40";

// Venues list (amoremio table): edit at the start of the row, archive /
// restore at the end; archived venues stay on the events that used them.
export function VenuesTable({
  venues,
  canManage,
}: {
  venues: Venue[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Venue | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showError } = useToast();
  const audit = auditColumn((venue: Venue) => ({
    entity: "venue" as const,
    id: venue.id,
    label: venue.name,
  }));

  async function toggleArchived(venue: Venue) {
    setBusyId(venue.id);
    try {
      await eventsClient.updateVenue(venue.id, {
        name: venue.name,
        zipCode: venue.zipCode,
        street: venue.street,
        number: venue.number,
        complement: venue.complement,
        district: venue.district,
        city: venue.city,
        state: venue.state,
        mapsUrl: venue.mapsUrl,
        notes: venue.notes,
        archived: !venue.archived,
      });
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível alterar.",
      );
    }
    setBusyId(null);
  }

  const columns: DataTableColumn<Venue>[] = [
    ...(canManage
      ? [
          {
            key: "edit",
            label: "",
            className: "w-12 pr-0",
            mobile: "control" as const,
            render: (venue: Venue) => (
              <button
                type="button"
                onClick={() => setEditing(venue)}
                aria-label={`Editar ${venue.name}`}
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
      label: "Local",
      mobile: "title",
      render: (venue) => (
        <span className="font-medium text-fg">{venue.name}</span>
      ),
    },
    {
      key: "address",
      label: "Endereço",
      mobile: "subtitle",
      render: (venue) => (
        <span className="text-muted">{venue.fullAddress}</span>
      ),
    },
    {
      key: "map",
      label: "Mapa",
      className: "w-20",
      render: (venue) =>
        venue.mapsUrl ? (
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            Abrir <ExternalLink aria-hidden className="size-3.5" />
          </a>
        ) : (
          <span className="text-soft">—</span>
        ),
    },
    {
      key: "status",
      label: "Situação",
      className: "w-28",
      render: (venue) =>
        venue.archived ? (
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
            render: (venue: Venue) => (
              <button
                type="button"
                onClick={() => toggleArchived(venue)}
                disabled={busyId === venue.id}
                aria-label={
                  venue.archived
                    ? `Restaurar ${venue.name}`
                    : `Arquivar ${venue.name}`
                }
                title={venue.archived ? "Restaurar" : "Arquivar"}
                className={iconButton}
              >
                {venue.archived ? (
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
      <DataTable
        rows={venues}
        columns={[...columns, audit.column]}
        getId={(venue) => venue.id}
        renderExpanded={audit.renderExpanded}
      />
      {editing && (
        <VenueFormDrawer
          venue={editing}
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
