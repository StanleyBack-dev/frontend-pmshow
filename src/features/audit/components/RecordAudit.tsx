"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Alert, Modal, Spinner } from "@/design-system";
import { AUDIT_ACTION_LABELS } from "@/features/access/model/access-labels";
import { auditClient } from "@/features/audit/api/audit.client";
import type { AuditEntry, AuditedEntity } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/format";

type RecordRef = {
  entity: AuditedEntity;
  id: string;
  /** Shown in the dialog title, e.g. the song title. */
  label: string;
  /** Record creation date, for records older than the audit trail. */
  createdAt?: string | null;
};

const CREATION = /\.(created|registered|requested)$/;

// Who created and last changed a record, and its full trail (newest first),
// from the audit log. Loaded when shown.
export function RecordAuditDetails({ entity, id, createdAt }: RecordRef) {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    auditClient.record(entity, id).then(
      (result) => {
        if (active) setEntries(result);
      },
      (cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof ApiClientError
            ? cause.message
            : "Não foi possível carregar a auditoria.",
        );
      },
    );
    return () => {
      active = false;
    };
  }, [entity, id]);

  if (error) return <Alert tone="danger">{error}</Alert>;
  if (!entries) {
    return (
      <div className="grid place-items-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  const oldest = entries.at(-1);
  const creation = oldest && CREATION.test(oldest.action) ? oldest : null;
  const latest = entries[0];
  const changed = latest && latest !== creation ? latest : null;
  const who = (entry: AuditEntry) => entry.actorName ?? "Sistema";

  const summary: [string, string][] = [
    ["Cadastrado por", creation ? who(creation) : "Não registrado"],
    [
      "Cadastrado em",
      creation
        ? formatDateTime(creation.createdAt)
        : createdAt
          ? formatDateTime(createdAt)
          : "—",
    ],
    ["Última alteração por", changed ? who(changed) : "Sem alterações"],
    ["Última alteração em", changed ? formatDateTime(changed.createdAt) : "—"],
  ];

  return (
    <div className="space-y-4 text-left">
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {summary.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-semibold tracking-[0.08em] text-soft uppercase">
              {label}
            </dt>
            <dd className="text-[13px] text-fg">{value}</dd>
          </div>
        ))}
      </dl>
      {entries.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] font-semibold tracking-[0.08em] text-soft uppercase">
            Histórico ({entries.length})
          </p>
          <ol className="max-h-64 divide-y divide-border overflow-y-auto rounded-md border border-border">
            {entries.map((entry) => (
              <li key={entry.id} className="px-3 py-2 text-[13px]">
                <p className="font-medium text-fg">
                  {AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                </p>
                <p className="text-xs text-soft">
                  {who(entry)} · {formatDateTime(entry.createdAt)}
                  {entry.ip && ` · IP ${entry.ip.replace(/^::ffff:/, "")}`}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
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
        title="Auditoria do registro"
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
          size="lg"
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
