"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Modal, Spinner } from "@/design-system";
import { auditClient } from "@/features/audit/api/audit.client";
import type { AuditedEntity, RecordStamp } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/format";
import { useToast } from "@/shared/toast/useToast";

type RecordRef = {
  entity: AuditedEntity;
  id: string;
  /** Shown in the dialog title, e.g. the song title. */
  label: string;
  /** Record creation date, shown while the details load. */
  createdAt?: string | null;
};

// Who created and who last changed a record, from the record's own columns.
// Loaded when shown.
export function RecordAuditDetails({ entity, id, createdAt }: RecordRef) {
  const [stamp, setStamp] = useState<RecordStamp | null | undefined>();
  const [failed, setFailed] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    let active = true;
    auditClient.record(entity, id).then(
      (result) => {
        if (active) setStamp(result);
      },
      (cause: unknown) => {
        if (!active) return;
        setFailed(true);
        showError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar as informações.",
        );
      },
    );
    return () => {
      active = false;
    };
  }, [entity, id, showError]);

  if (failed) return null;
  if (stamp === undefined) {
    return (
      <div className="grid place-items-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  // Equal (or within a second of) the creation: never changed since.
  const changed =
    stamp &&
    new Date(stamp.updatedAt).getTime() - new Date(stamp.createdAt).getTime() >
      1000;
  const summary: [string, string][] = [
    ["Cadastrado por", stamp?.createdByName ?? "Não registrado"],
    ["Cadastrado em", formatDateTime(stamp?.createdAt ?? createdAt)],
    [
      "Última alteração por",
      changed ? (stamp.updatedByName ?? "Sistema") : "Sem alterações",
    ],
    ["Última alteração em", changed ? formatDateTime(stamp.updatedAt) : "—"],
  ];

  return (
    <dl className="grid gap-x-4 gap-y-3 text-left sm:grid-cols-2">
      {summary.map(([label, value]) => (
        <div key={label}>
          <dt className="text-[10px] font-semibold tracking-[0.08em] text-soft uppercase">
            {label}
          </dt>
          <dd className="text-[13px] text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Opens the record's audit in a dialog: an icon in the last table column
// (larger screens) or a labeled button in the expanded phone card.
export function RecordAuditButton({
  labeled = false,
  ...props
}: RecordRef & { labeled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labeled ? undefined : `Auditoria de ${props.label}`}
        title="Criação e última alteração"
        className={
          labeled
            ? "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-muted hover:text-fg"
            : "grid size-8 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
        }
      >
        <Info aria-hidden className="size-4" />
        {labeled && "Auditoria do registro"}
      </button>
      {open && (
        <Modal
          open
          onClose={() => setOpen(false)}
          title={`Auditoria · ${props.label}`}
        >
          <RecordAuditDetails {...props} />
        </Modal>
      )}
    </>
  );
}

/**
 * The audit column for DataTable (desktop only) and, for phones, a button
 * at the end of the expanded card: both open the same dialog.
 */
export function auditColumn<T>(toRecord: (row: T) => RecordRef) {
  return {
    column: {
      key: "audit",
      label: "",
      className: "w-12 pl-0",
      mobile: "hidden" as const,
      render: (row: T) => <RecordAuditButton {...toRecord(row)} />,
    },
    renderExpanded: (row: T) => (
      <div className="flex justify-center border-t border-border px-2 py-1.5">
        <RecordAuditButton labeled {...toRecord(row)} />
      </div>
    ),
  };
}
