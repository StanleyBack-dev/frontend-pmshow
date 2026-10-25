"use client";

import { Badge, DataTable, type DataTableColumn } from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { MemberProfileButton } from "@/features/members/components/MemberProfileButton";
import {
  RANK_LABELS,
  SECTION_LABELS,
  STATUS_LABELS,
  formatPhone,
} from "@/features/members/model/member-labels";
import type { Instrument, RosterEntry } from "@/shared/contracts/members";

// The band's people (amoremio table): war name, section, instruments,
// phone and status; managers edit the band profile at the end of the row.
export function MembersTable({
  roster,
  instruments,
  canManage,
  canAudit,
}: {
  roster: RosterEntry[];
  instruments: Instrument[];
  canManage: boolean;
  canAudit: boolean;
}) {
  const audit = auditColumn((entry: RosterEntry) => ({
    entity: "member" as const,
    id: entry.userId,
    label: entry.profile?.warName ?? entry.name,
  }));
  const columns: DataTableColumn<RosterEntry>[] = [
    {
      key: "member",
      label: "Integrante",
      mobile: "title",
      render: ({ profile, name }) => (
        <span className="font-medium text-fg">
          {profile
            ? `${RANK_LABELS[profile.rank].short} ${profile.warName}`
            : name}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nome",
      mobile: "subtitle",
      render: ({ profile, name, active }) => (
        <span className="text-muted">
          {profile ? name : "Sem cadastro na banda"}
          {!active && " · acesso desativado"}
        </span>
      ),
    },
    {
      key: "section",
      label: "Naipe",
      render: ({ profile }) =>
        profile ? SECTION_LABELS[profile.section] : "—",
    },
    {
      key: "instruments",
      label: "Instrumentos",
      render: ({ profile }) =>
        profile?.instruments.length
          ? profile.instruments
              .map((item) => (item.primary ? `${item.name} ★` : item.name))
              .join(", ")
          : "—",
    },
    {
      key: "phone",
      label: "Telefone",
      className: "whitespace-nowrap",
      render: ({ profile }) => formatPhone(profile?.phone ?? null),
    },
    {
      key: "status",
      label: "Situação",
      render: ({ profile }) =>
        profile ? (
          <Badge
            tone={
              profile.status === "ATIVO"
                ? "success"
                : profile.status === "AFASTADO"
                  ? "warning"
                  : "neutral"
            }
          >
            {STATUS_LABELS[profile.status]}
          </Badge>
        ) : (
          <Badge tone="warning">Pendente</Badge>
        ),
    },
    ...(canManage
      ? [
          {
            key: "edit",
            label: "",
            className: "w-24 text-right",
            mobile: "control" as const,
            render: (entry: RosterEntry) => (
              <MemberProfileButton
                userId={entry.userId}
                name={entry.name}
                profile={entry.profile}
                instruments={instruments}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <DataTable
      rows={roster}
      columns={canAudit ? [...columns, audit.column] : columns}
      getId={(entry) => entry.userId}
      renderExpanded={canAudit ? audit.renderExpanded : undefined}
    />
  );
}
