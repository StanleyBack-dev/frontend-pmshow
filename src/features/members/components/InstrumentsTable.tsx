"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Pencil, Users } from "lucide-react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { membersClient } from "@/features/members/api/members.client";
import { InstrumentFormDrawer } from "@/features/members/components/InstrumentFormDrawer";
import { MembersModal } from "@/features/members/components/MembersModal";
import { SECTION_LABELS } from "@/features/members/model/member-labels";
import type { InstrumentListItem } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

const iconButton =
  "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg disabled:opacity-40";

// Instruments catalog (amoremio table): edit at the start of the row,
// archive / restore at the end. Archived instruments stay on the profiles
// and rosters that already use them.
export function InstrumentsTable({
  instruments,
}: {
  instruments: InstrumentListItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<InstrumentListItem | null>(null);
  const [viewing, setViewing] = useState<InstrumentListItem | null>(null);
  const closeViewing = useCallback(() => setViewing(null), []);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();
  const audit = auditColumn((instrument: InstrumentListItem) => ({
    entity: "instrument" as const,
    id: instrument.id,
    label: instrument.name,
  }));

  async function toggleArchived(instrument: InstrumentListItem) {
    setBusyId(instrument.id);
    try {
      await membersClient.updateInstrument(instrument.id, {
        archived: !instrument.archived,
      });
      showSuccess(
        instrument.archived
          ? "Instrumento restaurado."
          : "Instrumento arquivado.",
      );
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

  const columns: DataTableColumn<InstrumentListItem>[] = [
    {
      key: "edit",
      label: "",
      className: "w-12 pr-0",
      mobile: "control",
      render: (instrument) => (
        <button
          type="button"
          onClick={() => setEditing(instrument)}
          aria-label={`Editar ${instrument.name}`}
          title="Editar"
          className={iconButton}
        >
          <Pencil aria-hidden className="size-4" />
        </button>
      ),
    },
    {
      key: "name",
      label: "Instrumento",
      mobile: "title",
      render: (instrument) => (
        <span className="font-medium text-fg">{instrument.name}</span>
      ),
    },
    {
      key: "section",
      label: "Naipe",
      mobile: "subtitle",
      render: (instrument) => SECTION_LABELS[instrument.section],
    },
    {
      key: "members",
      label: "Integrantes",
      className: "whitespace-nowrap",
      render: (instrument) =>
        instrument.memberCount > 0 ? (
          <button
            type="button"
            onClick={() => setViewing(instrument)}
            aria-label={`Ver os músicos de ${instrument.name}`}
            title="Ver os músicos com este instrumento"
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-accent tabular-nums transition-colors hover:bg-surface-muted"
          >
            <Users aria-hidden className="size-4" />
            {instrument.memberCount}
          </button>
        ) : (
          <span className="text-soft">0</span>
        ),
    },
    {
      key: "status",
      label: "Situação",
      className: "w-28",
      render: (instrument) =>
        instrument.archived ? (
          <Badge tone="neutral">Arquivado</Badge>
        ) : (
          <Badge tone="success">Ativo</Badge>
        ),
    },
    {
      key: "archive",
      label: "",
      className: "w-12 pl-0",
      mobile: "control",
      render: (instrument) => (
        <button
          type="button"
          onClick={() => toggleArchived(instrument)}
          disabled={busyId === instrument.id}
          aria-label={
            instrument.archived
              ? `Restaurar ${instrument.name}`
              : `Arquivar ${instrument.name}`
          }
          title={instrument.archived ? "Restaurar" : "Arquivar"}
          className={iconButton}
        >
          {instrument.archived ? (
            <ArchiveRestore aria-hidden className="size-4" />
          ) : (
            <Archive aria-hidden className="size-4" />
          )}
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        rows={instruments}
        columns={[...columns, audit.column]}
        getId={(instrument) => instrument.id}
        renderExpanded={audit.renderExpanded}
      />
      {viewing && (
        <MembersModal
          title={`Músicos · ${viewing.name}`}
          empty="Nenhum músico com este instrumento no cadastro."
          load={() => membersClient.instrumentMembers(viewing.id)}
          instrumentId={viewing.id}
          onClose={closeViewing}
        />
      )}
      {editing && (
        <InstrumentFormDrawer
          instrument={editing}
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
