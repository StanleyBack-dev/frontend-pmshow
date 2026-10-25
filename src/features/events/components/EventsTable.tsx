"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, ListMusic } from "lucide-react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { EditEventIconButton } from "@/features/events/components/EventFormDrawer";
import { SongListModal } from "@/features/events/components/SongListEditor";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import type { EventListItem, Venue } from "@/shared/contracts/events";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

const iconLink =
  "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[13px] tabular-nums transition-colors hover:bg-surface-muted";

// Events list (amoremio table): edit at the start of the row, the title
// opens the event; the list of songs opens in a dialog and the roster
// column goes to where it is built.
export function EventsTable({
  events,
  venues,
  canManage,
  canBuildRoster,
  canAudit,
}: {
  events: EventListItem[];
  venues: Venue[];
  canManage: boolean;
  canBuildRoster: boolean;
  canAudit: boolean;
}) {
  const audit = auditColumn((event: EventListItem) => ({
    entity: "event" as const,
    id: event.id,
    label: event.title,
  }));
  const [songList, setSongList] = useState<EventListItem | null>(null);
  const isOpen = (event: EventListItem) =>
    event.status === "PLANEJADO" || event.status === "CONFIRMADO";

  const columns: DataTableColumn<EventListItem>[] = [
    ...(canManage
      ? [
          {
            key: "edit",
            label: "",
            className: "w-12 pr-0",
            mobile: "control" as const,
            render: (event: EventListItem) =>
              event.status === "REALIZADO" ? null : (
                <EditEventIconButton event={event} venues={venues} />
              ),
          },
        ]
      : []),
    {
      key: "when",
      label: "Data",
      className: "whitespace-nowrap",
      mobile: "subtitle",
      render: (event) => (
        <span className="first-letter:uppercase">
          {formatLongDay(event.startsAt)} · {formatTime(event.startsAt)}
        </span>
      ),
    },
    {
      key: "title",
      label: "Evento",
      mobile: "title",
      render: (event) => (
        <Link
          href={`/eventos/${event.id}`}
          className="font-medium text-fg hover:text-accent hover:underline"
        >
          {event.title}
        </Link>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      render: (event) => (
        <Badge tone="neutral">{EVENT_TYPE_LABELS[event.type]}</Badge>
      ),
    },
    {
      key: "venue",
      label: "Local",
      render: (event) => event.venue?.name ?? "A definir",
    },
    {
      key: "status",
      label: "Situação",
      render: (event) => (
        <Badge tone={EVENT_STATUS[event.status].tone}>
          {EVENT_STATUS[event.status].label}
        </Badge>
      ),
    },
    {
      key: "songs",
      label: "Lista de músicas",
      className: "whitespace-nowrap",
      render: (event) =>
        canManage && event.status !== "REALIZADO" ? (
          <button
            type="button"
            onClick={() => setSongList(event)}
            title={
              event.setlistCount
                ? "Ver / editar a lista de músicas"
                : "Montar a lista de músicas"
            }
            className={`${iconLink} ${event.setlistCount ? "text-accent" : "text-soft"}`}
          >
            <ListMusic aria-hidden className="size-4" />
            {event.setlistCount || "Montar"}
          </button>
        ) : (
          <Link
            href={`/eventos/${event.id}#musicas`}
            title="Ver a lista de músicas"
            className={`${iconLink} ${event.setlistCount ? "text-accent" : "text-soft"}`}
          >
            <ListMusic aria-hidden className="size-4" />
            {event.setlistCount || "—"}
          </Link>
        ),
    },
    {
      key: "roster",
      label: "Escala",
      render: (event) => {
        const summary = event.rosterSummary;
        const label = summary
          ? `${summary.status === "PUBLICADA" ? "Publicada" : "Rascunho"} · ${summary.assignments}`
          : "Montar";
        const canEdit = canBuildRoster && isOpen(event);
        return (
          <Link
            href={
              canEdit ? `/eventos/${event.id}/escala` : `/eventos/${event.id}`
            }
            title={summary ? "Ver / editar a escala" : "Montar a escala"}
            className={`${iconLink} ${
              summary?.status === "PUBLICADA"
                ? "text-success"
                : summary
                  ? "text-warning"
                  : "text-soft"
            }`}
          >
            <ClipboardList aria-hidden className="size-4" />
            {summary || canEdit ? label : "—"}
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        rows={events}
        columns={canAudit ? [...columns, audit.column] : columns}
        getId={(event) => event.id}
        renderExpanded={canAudit ? audit.renderExpanded : undefined}
      />
      {/* Remounted on each open, so it loads the event's current list. */}
      {songList && (
        <SongListModal
          eventId={songList.id}
          eventTitle={songList.title}
          onClose={() => setSongList(null)}
        />
      )}
    </>
  );
}
