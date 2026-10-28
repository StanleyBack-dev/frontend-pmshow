"use client";

import { auditColumn } from "@/features/audit/components/RecordAudit";
import Link from "next/link";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { EVENT_STATUS } from "@/features/events/model/event-labels";
import { AckActions } from "@/features/rosters/components/AckActions";
import { ACK_STATUS, lineRole } from "@/features/rosters/model/roster-labels";
import type { MyAssignment } from "@/shared/contracts/rosters";
import { formatLongDay, formatTime } from "@/shared/lib/datetime";

type Row = MyAssignment & { event: NonNullable<MyAssignment["event"]> };

const isOpen = (row: Row) =>
  row.event.status === "PLANEJADO" || row.event.status === "CONFIRMADO";

// The member's own rosters (amoremio table). On phones the card shows the
// event and the answer; the chevron reveals date, times, role and place,
// then the "ciente" / "pedir troca" buttons.
export function MyRostersTable({
  assignments,
  duty = false,
}: {
  assignments: MyAssignment[];
  /** Working days: entrada/saída, no acknowledgement. */
  duty?: boolean;
}) {
  const rows = assignments.filter((item): item is Row => item.event !== null);
  const audit = auditColumn((row: Row) => ({
    entity: "roster" as const,
    id: row.eventId,
    label: `Escala · ${row.event.title}`,
  }));

  const columns: DataTableColumn<Row>[] = [
    {
      key: "when",
      label: "Data",
      className: "whitespace-nowrap",
      // Working days: the date under the title on phones.
      mobile: duty ? "subtitle" : "detail",
      render: (row) => (
        <span className="inline-block first-letter:uppercase">
          {formatLongDay(row.event.startsAt)}
        </span>
      ),
    },
    {
      key: "title",
      label: "Evento",
      mobile: "title",
      render: (row) => (
        <Link
          href={`/eventos/${row.event.id}`}
          className="font-medium text-fg hover:text-accent hover:underline"
        >
          {row.event.title}
        </Link>
      ),
    },
    ...(duty
      ? []
      : [
          {
            key: "callTime",
            label: "Concentração",
            className: "whitespace-nowrap",
            render: (row: Row) =>
              row.event.callTime ? formatTime(row.event.callTime) : "—",
          },
        ]),
    {
      key: "start",
      label: duty ? "Entrada" : "Início",
      className: "whitespace-nowrap",
      render: (row) => formatTime(row.event.startsAt),
    },
    {
      key: "end",
      label: duty ? "Saída" : "Término",
      className: "whitespace-nowrap",
      render: (row) => (row.event.endsAt ? formatTime(row.event.endsAt) : "—"),
    },
    {
      key: "role",
      label: "Função",
      render: (row) => lineRole(row.functionName, row.instrumentName),
    },
    {
      key: "venue",
      label: "Local",
      render: (row) => row.event.venue?.name ?? "A definir",
    },
    {
      key: "status",
      label: "Situação",
      mobile: "control",
      render: (row) =>
        isOpen(row) && !duty ? (
          <Badge tone={ACK_STATUS[row.ackStatus].tone}>
            {ACK_STATUS[row.ackStatus].label}
          </Badge>
        ) : (
          <Badge tone={EVENT_STATUS[row.event.status].tone}>
            {EVENT_STATUS[row.event.status].label}
          </Badge>
        ),
    },
    ...(duty
      ? []
      : [
          {
            key: "ack",
            label: "Ciência",
            // Phones: below the details, full width (renderExpanded).
            mobile: "hidden" as const,
            render: (row: Row) =>
              isOpen(row) ? (
                <AckActions
                  eventId={row.event.id}
                  status={row.ackStatus}
                  stacked
                />
              ) : (
                "—"
              ),
          },
        ]),
  ];

  return (
    <DataTable
      rows={rows}
      columns={[...columns, audit.column]}
      getId={(row) => row.eventId}
      renderExpanded={(row) => (
        <>
          {isOpen(row) && !duty && (
            <div className="border-t border-border px-3 py-3">
              <AckActions eventId={row.event.id} status={row.ackStatus} />
            </div>
          )}
          {audit.renderExpanded(row)}
        </>
      )}
    />
  );
}
