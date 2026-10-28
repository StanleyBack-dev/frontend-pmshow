"use client";

import {
  Avatar,
  Badge,
  DataTable,
  type DataTableColumn,
} from "@/design-system";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import { MemberProfileButton } from "@/features/members/components/MemberProfileButton";
import { RankBadge } from "@/features/members/components/RankBadge";
import {
  SECTION_LABELS,
  STATUS_LABELS,
  bandTime,
  formatDayMonth,
  formatLocalDay,
  formatPhone,
} from "@/features/members/model/member-labels";
import type {
  BandFunction,
  Instrument,
  RosterEntry,
} from "@/shared/contracts/members";

// The band's people (amoremio table): full name, war name, rank, section,
// instruments, functions, phone and status; managers edit the band profile at the end
// of the row. Phones: war name over the full name, the rest in the collapse.
export function MembersTable({
  roster,
  instruments,
  functions,
  canManage,
}: {
  roster: RosterEntry[];
  instruments: Instrument[];
  functions: BandFunction[];
  canManage: boolean;
}) {
  const audit = auditColumn((entry: RosterEntry) => ({
    entity: "member" as const,
    id: entry.userId,
    label: entry.profile?.warName ?? entry.name,
  }));
  const columns: DataTableColumn<RosterEntry>[] = [
    {
      key: "name",
      label: "Nome completo",
      mobile: "subtitle",
      render: ({ profile, name, active }) => (
        <span className="text-muted">
          {profile ? name : "Sem cadastro na banda"}
          {!active && " · acesso desativado"}
        </span>
      ),
    },
    {
      key: "warName",
      label: "Nome de guerra",
      mobile: "title",
      render: ({ profile, name, photoUrl }) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={profile?.warName ?? name} src={photoUrl} size="sm" />
          <span className="font-medium text-fg">
            {profile?.warName ?? name}
          </span>
        </span>
      ),
    },
    {
      key: "birthday",
      label: "Aniversário",
      desktop: "detail",
      render: ({ profile }) => formatDayMonth(profile?.birthDate ?? null),
    },
    {
      key: "bandTime",
      label: "Tempo de banda",
      desktop: "detail",
      render: ({ profile }) =>
        profile?.joinedOn
          ? `${bandTime(profile.joinedOn, new Date())} (desde ${formatLocalDay(profile.joinedOn)})`
          : "—",
    },
    {
      key: "rank",
      label: "Posto/Graduação",
      className: "whitespace-nowrap",
      render: ({ profile }) =>
        profile ? <RankBadge rank={profile.rank} /> : "—",
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
      key: "functions",
      label: "Funções",
      render: ({ profile }) =>
        profile?.functions.length
          ? profile.functions.map((item) => item.name).join(", ")
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
                functions={functions}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <DataTable
      rows={roster}
      columns={[...columns, audit.column]}
      getId={(entry) => entry.userId}
      renderExpanded={audit.renderExpanded}
    />
  );
}
