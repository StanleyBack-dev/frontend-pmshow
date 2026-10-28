"use client";

import { auditColumn } from "@/features/audit/components/RecordAudit";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Repeat } from "lucide-react";
import { Button, DataTable, type DataTableColumn } from "@/design-system";
import { RankBadge } from "@/features/members/components/RankBadge";
import { SECTION_LABELS } from "@/features/members/model/member-labels";
import { KeepOnRosterButton } from "@/features/rosters/components/KeepOnRosterButton";
import { personTitle } from "@/features/rosters/components/MemberDetails";
import { RosterModal } from "@/features/rosters/components/RosterModal";
import { lineRole } from "@/features/rosters/model/roster-labels";
import type { SwapRequest } from "@/shared/contracts/rosters";
import {
  formatDateTime,
  formatLongDay,
  formatTime,
} from "@/shared/lib/datetime";

type Row = SwapRequest & { event: NonNullable<SwapRequest["event"]> };

const nameOf = (row: Row) =>
  row.person
    ? personTitle(row.person.rank, row.person.name)
    : "Conta desativada";

// Open swap requests (managers): who asked, on which event and why.
// "Substituir" opens the roster with the request on top (pick who goes
// instead); "Manter na escala" turns it down and tells the person.
export function SwapRequestsTable({
  requests,
  canPublish,
}: {
  requests: SwapRequest[];
  canPublish: boolean;
}) {
  const router = useRouter();
  const [roster, setRoster] = useState<Row | null>(null);
  const closeRoster = useCallback(() => {
    setRoster(null);
    router.refresh();
  }, [router]);
  const rows = requests.filter((item): item is Row => item.event !== null);
  const audit = auditColumn((row: Row) => ({
    entity: "roster" as const,
    id: row.eventId,
    label: `Escala · ${row.event.title}`,
  }));

  const actions = (row: Row, fill = false) => (
    <div
      className={
        fill
          ? "grid grid-cols-2 gap-2 [&>button]:justify-center"
          : "flex flex-wrap justify-end gap-2"
      }
    >
      <Button
        size="sm"
        icon={<Repeat className="size-4" />}
        onClick={() => setRoster(row)}
      >
        Substituir
      </Button>
      <KeepOnRosterButton
        eventId={row.eventId}
        userId={row.userId}
        personName={nameOf(row)}
        onKept={() => router.refresh()}
      />
    </div>
  );

  const columns: DataTableColumn<Row>[] = [
    {
      key: "person",
      label: "Integrante",
      mobile: "title",
      render: (row) => (
        <span className="font-medium text-fg">{nameOf(row)}</span>
      ),
    },
    {
      key: "event",
      label: "Evento",
      mobile: "subtitle",
      render: (row) => (
        <Link
          href={`/eventos/${row.event.id}`}
          className="font-medium text-fg hover:text-accent hover:underline"
        >
          {row.event.title}
        </Link>
      ),
    },
    {
      key: "when",
      label: "Data",
      className: "whitespace-nowrap",
      render: (row) => (
        <span className="inline-block first-letter:uppercase">
          {formatLongDay(row.event.startsAt)} · {formatTime(row.event.startsAt)}
        </span>
      ),
    },
    {
      key: "role",
      label: "Função",
      render: (row) => lineRole(row.functionName, row.instrumentName),
    },
    {
      key: "reason",
      label: "Motivo",
      render: (row) => (
        <span className="whitespace-pre-line">{row.ackNote ?? "—"}</span>
      ),
    },
    {
      key: "rank",
      label: "Posto/graduação",
      desktop: "detail",
      render: (row) =>
        row.person ? <RankBadge rank={row.person.rank} /> : "—",
    },
    {
      key: "warName",
      label: "Nome de guerra",
      desktop: "detail",
      render: (row) => row.person?.warName ?? "—",
    },
    {
      key: "section",
      label: "Naipe",
      desktop: "detail",
      render: (row) => (row.person ? SECTION_LABELS[row.person.section] : "—"),
    },
    {
      key: "askedAt",
      label: "Pedido em",
      desktop: "detail",
      render: (row) => (row.ackAt ? formatDateTime(row.ackAt) : "—"),
    },
    {
      key: "actions",
      label: "",
      className: "whitespace-nowrap text-right",
      // Phones: at the end of the collapse (renderExpanded).
      mobile: "hidden",
      render: (row) => actions(row),
    },
  ];

  return (
    <>
      <DataTable
        rows={rows}
        columns={[...columns, audit.column]}
        getId={(row) => `${row.eventId}:${row.userId}`}
        renderExpanded={(row) => (
          <>
            <div className="border-t border-border px-3 py-3">
              {actions(row, true)}
            </div>
            {audit.renderExpanded(row)}
          </>
        )}
      />
      {roster && (
        <RosterModal
          eventId={roster.eventId}
          eventTitle={roster.event.title}
          canPublish={canPublish}
          onClose={closeRoster}
        />
      )}
    </>
  );
}
