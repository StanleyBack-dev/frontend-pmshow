"use client";

import { auditColumn } from "@/features/audit/components/RecordAudit";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { Badge, DataTable, cn, type DataTableColumn } from "@/design-system";
import {
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
  UNIFORM_LABELS,
} from "@/features/events/model/event-labels";
import { lineRole } from "@/features/rosters/model/roster-labels";
import type { AgendaEvent } from "@/shared/contracts/events";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

// The month's events under the calendar (amoremio table). On phones the card
// shows the title, the date under it and the status; the rest goes to the
// collapse.
export function AgendaEventsTable({ events }: { events: AgendaEvent[] }) {
  const audit = auditColumn((event: AgendaEvent) => ({
    entity: "event" as const,
    id: event.id,
    label: event.title,
  }));
  const columns: DataTableColumn<AgendaEvent>[] = [
    {
      key: "open",
      label: "",
      className: "w-12 pr-0",
      // Phones: "Abrir evento" at the end of the collapse.
      mobile: "hidden",
      render: (event) => (
        <Link
          href={`/eventos/${event.id}`}
          aria-label={`Ver ${event.title}`}
          title="Ver evento"
          className="grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
        >
          <Eye aria-hidden className="size-4" />
        </Link>
      ),
    },
    {
      key: "day",
      label: "Data",
      className: "whitespace-nowrap",
      mobile: "subtitle",
      render: (event) => (
        <span className="inline-block first-letter:uppercase">
          {formatLongDay(event.startsAt)}
        </span>
      ),
    },
    {
      key: "title",
      label: "Evento",
      mobile: "title",
      render: (event) => (
        <span
          className={cn(
            "font-medium",
            event.status === "CANCELADO" && "text-soft line-through",
          )}
        >
          {event.title}
        </span>
      ),
    },
    {
      key: "callTime",
      label: "Concentração",
      className: "whitespace-nowrap",
      render: (event) => (event.callTime ? formatTime(event.callTime) : "—"),
    },
    {
      key: "start",
      label: "Início",
      className: "whitespace-nowrap",
      render: (event) => formatTime(event.startsAt),
    },
    {
      key: "end",
      label: "Término",
      className: "whitespace-nowrap",
      render: (event) => (event.endsAt ? formatTime(event.endsAt) : "—"),
    },
    {
      key: "mine",
      label: "Minha escala",
      render: (event) =>
        event.myAssignment ? (
          <span className="font-medium text-brand-gold-ink">
            {lineRole(
              event.myAssignment.functionName,
              event.myAssignment.instrumentName,
            )}
          </span>
        ) : (
          <span className="text-soft">—</span>
        ),
    },
    {
      key: "type",
      label: "Tipo",
      render: (event) => EVENT_TYPE_LABELS[event.type],
    },
    {
      key: "venue",
      label: "Local",
      render: (event) => event.venue?.name ?? "A definir",
    },
    {
      key: "uniform",
      label: "Uniforme",
      render: (event) => (event.uniform ? UNIFORM_LABELS[event.uniform] : "—"),
    },
    {
      key: "status",
      label: "Situação",
      mobile: "control",
      render: (event) => (
        <Badge tone={EVENT_STATUS[event.status].tone}>
          {EVENT_STATUS[event.status].label}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      rows={events}
      columns={[...columns, audit.column]}
      getId={(event) => event.id}
      renderExpanded={(event) => (
        <>
          <div className="border-t border-border px-3 py-2.5">
            <Link
              href={`/eventos/${event.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Abrir evento <ArrowUpRight className="size-4" />
            </Link>
          </div>
          {audit.renderExpanded(event)}
        </>
      )}
    />
  );
}
