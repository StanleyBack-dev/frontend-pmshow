"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ClipboardList, Eye, ListMusic, Pencil } from "lucide-react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import {
  EventDetailsPanel,
  type RosterViewer,
} from "@/features/events/components/EventDetailsPanel";
import { EventQuickActions } from "@/features/events/components/EventQuickActions";
import { EventFormDrawer } from "@/features/events/components/EventFormDrawer";
import {
  EventStatusActions,
  EventStatusSelect,
} from "@/features/events/components/EventStatusActions";
import { EventViewDrawer } from "@/features/events/components/EventViewDrawer";
import { SongListModal } from "@/features/events/components/SongListEditor";
import { RosterModal } from "@/features/rosters/components/RosterModal";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
} from "@/features/events/model/event-labels";
import type { EventListItem, Venue } from "@/shared/contracts/events";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

const iconLink =
  "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[13px] tabular-nums transition-colors hover:bg-surface-muted";

// Events list (amoremio table): at the start of the row, the pencil opens the
// form and the eye the event page (who manages, open events); otherwise an
// eye opens the read-only drawer (with "Reabrir" for a cancelled event). The list of songs and the roster open in dialogs
// over the table.
export function EventsTable({
  events,
  venues,
  canManage,
  canBuildRoster,
  canPublishRoster = false,
  rosterViewer,
}: {
  events: EventListItem[];
  venues: Venue[];
  canManage: boolean;
  canBuildRoster: boolean;
  canPublishRoster?: boolean;
  /** Who is looking, to show the roster in the details (if allowed). */
  rosterViewer?: RosterViewer;
}) {
  const audit = auditColumn((event: EventListItem) => ({
    entity: "event" as const,
    id: event.id,
    label: event.title,
  }));
  const [opened, setOpened] = useState<EventListItem | null>(null);
  const [songList, setSongList] = useState<EventListItem | null>(null);
  const [roster, setRoster] = useState<EventListItem | null>(null);
  const closeRoster = useCallback(() => setRoster(null), []);
  const isOpen = (event: EventListItem) =>
    event.status === "PLANEJADO" || event.status === "CONFIRMADO";
  // Finished events are read-only even for who manages.
  // Done and cancelled events are read-only (a cancelled one until reopened).
  const editable = (event: EventListItem) => canManage && isOpen(event);
  // Right of the pencil: the event page, with everything about the event.
  const pageLink = (event: EventListItem, labeled: boolean) => (
    <Link
      href={`/eventos/${event.id}`}
      aria-label={`Ver ${event.title}`}
      title="Ver evento"
      className={
        labeled
          ? "grid size-8 place-items-center rounded-md border border-border-strong text-accent transition-colors hover:bg-surface-muted"
          : "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
      }
    >
      <Eye aria-hidden className={labeled ? "size-3.5" : "size-4"} />
    </Link>
  );
  const openButton = (event: EventListItem, labeled: boolean) => {
    const edit = editable(event);
    const Icon = edit ? Pencil : Eye;
    return (
      <button
        type="button"
        onClick={() => setOpened(event)}
        aria-label={`${edit ? "Editar" : "Ver"} ${event.title}`}
        title={edit ? "Editar evento" : "Ver evento"}
        className={
          labeled
            ? "inline-flex h-8 items-center gap-1.5 rounded-md border border-border-strong px-2.5 text-xs font-medium text-accent transition-colors hover:bg-surface-muted"
            : "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
        }
      >
        <Icon aria-hidden className={labeled ? "size-3.5" : "size-4"} />
        {labeled && (edit ? "Editar" : "Ver")}
      </button>
    );
  };

  const columns: DataTableColumn<EventListItem>[] = [
    {
      key: "open",
      label: "",
      className: "w-20 pr-0",
      mobile: "control",
      render: (event) => (
        <span className="flex items-center gap-1">
          {openButton(event, false)}
          {editable(event) && pageLink(event, false)}
        </span>
      ),
      renderMobile: (event) => (
        <span className="flex items-center gap-1">
          {openButton(event, true)}
          {editable(event) && pageLink(event, true)}
        </span>
      ),
    },
    {
      key: "title",
      label: "Evento",
      mobile: "title",
      render: (event) => (
        <span className="font-medium text-fg">{event.title}</span>
      ),
    },
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
      key: "address",
      label: "Endereço",
      // Larger screens: in the details panel.
      desktop: "hidden",
      render: (event) => event.venue?.fullAddress || "—",
    },
    {
      key: "status",
      label: "Situação",
      render: (event) =>
        canManage ? (
          <EventStatusSelect event={event} />
        ) : (
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
        editable(event) ? (
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
        const tone =
          summary?.status === "PUBLICADA"
            ? "text-success"
            : summary
              ? "text-warning"
              : "text-soft";
        // Built in a dialog over the table, so closing it stays here.
        return canEdit ? (
          <button
            type="button"
            onClick={() => setRoster(event)}
            title={summary ? "Ver / editar a escala" : "Montar a escala"}
            className={`${iconLink} ${tone}`}
          >
            <ClipboardList aria-hidden className="size-4" />
            {label}
          </button>
        ) : (
          <Link
            href={`/eventos/${event.id}`}
            title="Ver a escala"
            className={`${iconLink} ${tone}`}
          >
            <ClipboardList aria-hidden className="size-4" />
            {summary ? label : "—"}
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        rows={events}
        columns={[...columns, audit.column]}
        getId={(event) => event.id}
        // Phones: the PDF and map buttons on the last line, then the audit.
        renderExpanded={(event) => (
          <>
            <div className="border-t border-border px-3 py-3 empty:hidden">
              <EventQuickActions
                event={event}
                fill
                onEditSongs={
                  editable(event) ? () => setSongList(event) : undefined
                }
                rosterViewer={rosterViewer}
              />
            </div>
            {audit.renderExpanded(event)}
          </>
        )}
        renderDesktopExpanded={(event) => (
          <EventDetailsPanel
            event={event}
            rosterViewer={rosterViewer}
            actions={
              <EventQuickActions
                event={event}
                onEditSongs={
                  editable(event) ? () => setSongList(event) : undefined
                }
              />
            }
          />
        )}
      />
      {opened &&
        (editable(opened) ? (
          <EventFormDrawer
            event={opened}
            venues={venues}
            canBuildRoster={canBuildRoster}
            canPublishRoster={canPublishRoster}
            onClose={() => setOpened(null)}
          />
        ) : (
          <EventViewDrawer
            event={opened}
            onClose={() => setOpened(null)}
            actions={
              canManage ? (
                <EventStatusActions
                  event={opened}
                  onChanged={() => setOpened(null)}
                />
              ) : undefined
            }
          />
        ))}
      {/* Remounted on each open, so it loads the event's current list. */}
      {songList && (
        <SongListModal
          eventId={songList.id}
          eventTitle={songList.title}
          onClose={() => setSongList(null)}
        />
      )}
      {roster && (
        <RosterModal
          eventId={roster.id}
          eventTitle={roster.title}
          canPublish={canPublishRoster}
          onClose={closeRoster}
        />
      )}
    </>
  );
}
