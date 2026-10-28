"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Pencil, Users } from "lucide-react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { bandFunctionsClient } from "@/features/members/api/members.client";
import { BandFunctionFormDrawer } from "@/features/members/components/BandFunctionFormDrawer";
import { MembersModal } from "@/features/members/components/MembersModal";
import type { BandFunctionListItem } from "@/shared/contracts/members";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

const iconButton =
  "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg disabled:opacity-40";

// Functions catalog (amoremio table): edit at the start of the row, archive
// / restore at the end. Archived functions stay on the profiles and rosters
// that already use them.
export function BandFunctionsTable({
  functions,
}: {
  functions: BandFunctionListItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<BandFunctionListItem | null>(null);
  const [viewing, setViewing] = useState<BandFunctionListItem | null>(null);
  const closeViewing = useCallback(() => setViewing(null), []);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();
  const audit = auditColumn((item: BandFunctionListItem) => ({
    entity: "band_function" as const,
    id: item.id,
    label: item.name,
  }));

  async function toggleArchived(item: BandFunctionListItem) {
    setBusyId(item.id);
    try {
      await bandFunctionsClient.update(item.id, { archived: !item.archived });
      showSuccess(item.archived ? "Função restaurada." : "Função arquivada.");
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

  const columns: DataTableColumn<BandFunctionListItem>[] = [
    {
      key: "edit",
      label: "",
      className: "w-12 pr-0",
      mobile: "control",
      render: (item) => (
        <button
          type="button"
          onClick={() => setEditing(item)}
          aria-label={`Editar ${item.name}`}
          title="Editar"
          className={iconButton}
        >
          <Pencil aria-hidden className="size-4" />
        </button>
      ),
    },
    {
      key: "name",
      label: "Função",
      mobile: "title",
      render: (item) => (
        <span className="font-medium text-fg">{item.name}</span>
      ),
    },
    {
      key: "members",
      label: "Integrantes",
      className: "whitespace-nowrap",
      render: (item) =>
        item.memberCount > 0 ? (
          <button
            type="button"
            onClick={() => setViewing(item)}
            aria-label={`Ver os músicos com a função ${item.name}`}
            title="Ver os músicos com esta função"
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-accent tabular-nums transition-colors hover:bg-surface-muted"
          >
            <Users aria-hidden className="size-4" />
            {item.memberCount}
          </button>
        ) : (
          <span className="text-soft">0</span>
        ),
    },
    {
      key: "status",
      label: "Situação",
      className: "w-28",
      render: (item) =>
        item.archived ? (
          <Badge tone="neutral">Arquivada</Badge>
        ) : (
          <Badge tone="success">Ativa</Badge>
        ),
    },
    {
      key: "archive",
      label: "",
      className: "w-12 pl-0",
      mobile: "control",
      render: (item) => (
        <button
          type="button"
          onClick={() => toggleArchived(item)}
          disabled={busyId === item.id}
          aria-label={
            item.archived ? `Restaurar ${item.name}` : `Arquivar ${item.name}`
          }
          title={item.archived ? "Restaurar" : "Arquivar"}
          className={iconButton}
        >
          {item.archived ? (
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
        rows={functions}
        columns={[...columns, audit.column]}
        getId={(item) => item.id}
        renderExpanded={audit.renderExpanded}
      />
      {viewing && (
        <MembersModal
          title={`Músicos · ${viewing.name}`}
          empty="Nenhum músico com esta função no cadastro."
          load={() => bandFunctionsClient.members(viewing.id)}
          onClose={closeViewing}
        />
      )}
      {editing && (
        <BandFunctionFormDrawer
          bandFunction={editing}
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
