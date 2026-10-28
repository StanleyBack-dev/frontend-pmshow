"use client";

import { auditColumn } from "@/features/audit/components/RecordAudit";
import { Fragment } from "react";
import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { CopyShareValue } from "@/features/admin/components/CopyShareValue";
import { AbsenceActions } from "@/features/availability/components/AbsenceActions";
import {
  AttachmentList,
  AttachmentsButton,
} from "@/features/availability/components/AbsenceAttachments";
import {
  ABSENCE_STATUS,
  ABSENCE_TYPE_LABELS,
  formatPeriod,
} from "@/features/availability/model/absence-labels";
import { RankBadge } from "@/features/members/components/RankBadge";
import {
  SECTION_LABELS,
  formatPhone,
} from "@/features/members/model/member-labels";
import type { Absence } from "@/shared/contracts/absences";
import type { Rank, Section } from "@/shared/contracts/members";
import { formatDateTime } from "@/shared/lib/datetime";

/** What the table shows about who asked (from the band profile). */
export type AbsencePerson = {
  name: string;
  warName: string;
  rank: Rank;
  section: Section;
  phone: string | null;
  registration: string | null;
};

export type AbsenceViewer = { id: string; isManager: boolean; today: string };

// Mirrors the API's cancel rule so the button only shows when it works.
function cancellable(absence: Absence, viewer: AbsenceViewer): boolean {
  if (absence.status !== "PENDENTE" && absence.status !== "APROVADA") {
    return false;
  }
  if (viewer.isManager) return true;
  return (
    absence.userId === viewer.id &&
    (absence.status === "PENDENTE" || absence.endsOn >= viewer.today)
  );
}

/**
 * Who decided what and when, by the final status: "Aprovado por / em",
 * "Recusado por / em", "Lançado por / em" (registered by a manager) and,
 * when cancelled, also "Cancelado por / em".
 */
function decisionsOf(absence: Absence): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [];
  const add = (verb: string, by: string | null, at: string | null) => {
    if (by) lines.push({ label: `${verb} por`, value: by });
    if (at) lines.push({ label: `${verb} em`, value: formatDateTime(at) });
  };
  // A cancelled request may have been approved before.
  if (absence.status !== "PENDENTE" && absence.reviewedAt) {
    const verb = absence.registered
      ? "Lançado"
      : absence.status === "RECUSADA"
        ? "Recusado"
        : "Aprovado";
    add(verb, absence.reviewedByName, absence.reviewedAt);
  }
  if (absence.status === "CANCELADA") {
    add("Cancelado", absence.cancelledByName, absence.cancelledAt);
  }
  return lines;
}

/** Calendar days of the period, both ends included. */
const daysOf = (absence: Absence) =>
  Math.round(
    (Date.parse(`${absence.endsOn}T00:00:00Z`) -
      Date.parse(`${absence.startsOn}T00:00:00Z`)) /
      86_400_000,
  ) + 1;

// Absences (amoremio table). With `people` (managers' tabs) the row is the
// person, and the collapse — on phones and on larger screens — has their
// full data; without it (my own) the row is the request itself.
export function AbsencesTable({
  absences,
  viewer,
  people,
}: {
  absences: Absence[];
  viewer: AbsenceViewer;
  /** Band profiles by user id; omitted for "my" list. */
  people?: Record<string, AbsencePerson>;
}) {
  const withPerson = people !== undefined;
  const audit = auditColumn((absence: Absence) => ({
    entity: "absence" as const,
    id: absence.id,
    label: `${absence.warName ?? absence.userName} · ${formatPeriod(absence.startsOn, absence.endsOn)}`,
  }));
  const actions = (absence: Absence, fill = false) => (
    <AbsenceActions
      absence={absence}
      canReview={viewer.isManager && absence.userId !== viewer.id}
      canCancel={cancellable(absence, viewer)}
      fill={fill}
    />
  );
  const hasActions = (absence: Absence) =>
    (viewer.isManager &&
      absence.userId !== viewer.id &&
      absence.status === "PENDENTE") ||
    cancellable(absence, viewer);

  const personColumns: DataTableColumn<Absence>[] = withPerson
    ? [
        {
          key: "person",
          label: "Integrante",
          mobile: "title",
          render: (absence) => (
            <span className="font-medium text-fg">{absence.userName}</span>
          ),
        },
        {
          key: "warName",
          label: "Nome de guerra",
          desktop: "detail",
          render: (absence) => absence.warName ?? "—",
        },
        {
          key: "rank",
          label: "Posto/graduação",
          desktop: "detail",
          render: (absence) => {
            const person = people[absence.userId];
            return person ? <RankBadge rank={person.rank} /> : "—";
          },
        },
        {
          key: "section",
          label: "Naipe",
          desktop: "detail",
          render: (absence) => {
            const person = people[absence.userId];
            return person ? SECTION_LABELS[person.section] : "—";
          },
        },
        {
          key: "phone",
          label: "Telefone",
          desktop: "detail",
          render: (absence) => {
            const phone = people[absence.userId]?.phone;
            return phone ? (
              <CopyShareValue
                value={formatPhone(phone)}
                label="Telefone"
                share={false}
                valueClassName="text-fg"
              />
            ) : (
              "—"
            );
          },
        },
        {
          key: "registration",
          label: "Matrícula",
          desktop: "detail",
          render: (absence) => {
            const registration = people[absence.userId]?.registration;
            return registration ? (
              <CopyShareValue
                value={registration}
                label="Matrícula"
                share={false}
                valueClassName="text-fg"
              />
            ) : (
              "—"
            );
          },
        },
      ]
    : [];

  const columns: DataTableColumn<Absence>[] = [
    ...personColumns,
    {
      key: "type",
      label: "Tipo",
      mobile: withPerson ? "detail" : "title",
      render: (absence) => (
        <span className={withPerson ? undefined : "font-medium text-fg"}>
          {ABSENCE_TYPE_LABELS[absence.type]}
        </span>
      ),
    },
    {
      key: "period",
      label: "Período",
      className: "whitespace-nowrap",
      mobile: "subtitle",
      render: (absence) => formatPeriod(absence.startsOn, absence.endsOn),
    },
    {
      key: "days",
      label: "Dias",
      className: "tabular-nums whitespace-nowrap",
      render: (absence) => daysOf(absence),
    },
    {
      key: "files",
      label: "Arquivos",
      className: "whitespace-nowrap",
      // Phones: the files are listed in the collapse.
      mobile: "hidden",
      render: (absence) => (
        <AttachmentsButton
          files={absence.attachments}
          owner={absence.userName}
        />
      ),
    },
    {
      key: "reason",
      label: "Motivo",
      desktop: "detail",
      render: (absence) => (
        <span className="whitespace-pre-line">{absence.reason ?? "—"}</span>
      ),
    },
    {
      key: "attachments",
      label: "Anexos",
      desktop: "detail",
      // Phones: a full-width block at the end of the collapse.
      mobile: "hidden",
      render: (absence) =>
        absence.attachments.length === 0 ? (
          "—"
        ) : (
          <AttachmentList files={absence.attachments} />
        ),
    },
    {
      key: "decision",
      label: "Andamento",
      desktop: "detail",
      render: (absence) => {
        const lines = decisionsOf(absence);
        if (lines.length === 0) {
          return absence.status === "PENDENTE" ? "Aguardando análise" : "—";
        }
        return (
          <dl className="inline-grid grid-cols-[auto_auto] gap-x-3 gap-y-1 text-left">
            {lines.map((line) => (
              <Fragment key={line.label}>
                <dt className="text-soft">{line.label}</dt>
                <dd className="break-words">{line.value}</dd>
              </Fragment>
            ))}
          </dl>
        );
      },
    },
    {
      key: "reviewNote",
      label: "Observação do gestor",
      desktop: "detail",
      render: (absence) => absence.reviewNote ?? "—",
    },
    {
      key: "createdAt",
      label: "Pedido em",
      desktop: "detail",
      render: (absence) => formatDateTime(absence.createdAt),
    },
    {
      key: "status",
      label: "Situação",
      className: "w-36",
      mobile: "control",
      render: (absence) => (
        <Badge tone={ABSENCE_STATUS[absence.status].tone}>
          {ABSENCE_STATUS[absence.status].label}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "whitespace-nowrap text-right",
      // Phones: at the end of the collapse (renderExpanded).
      mobile: "hidden",
      render: (absence) => (hasActions(absence) ? actions(absence) : null),
    },
  ];

  return (
    <DataTable
      rows={absences}
      columns={[...columns, audit.column]}
      getId={(absence) => absence.id}
      renderExpanded={(absence) => (
        <>
          {absence.attachments.length > 0 && (
            <div className="space-y-2 border-t border-border px-3 py-3">
              <p className="text-[10px] font-medium tracking-wide text-soft uppercase">
                Anexos ({absence.attachments.length})
              </p>
              <AttachmentList files={absence.attachments} />
            </div>
          )}
          {hasActions(absence) && (
            <div className="border-t border-border px-3 py-3">
              {actions(absence, true)}
            </div>
          )}
          {audit.renderExpanded(absence)}
        </>
      )}
    />
  );
}
