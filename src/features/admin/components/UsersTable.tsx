"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/design-system";
import { GROUP_LABELS } from "@/features/access/model/access-labels";
import { UserStatusBadges } from "@/features/admin/components/UserStatusBadges";
import { auditColumn } from "@/features/audit/components/RecordAudit";
import type { UserAccount } from "@/shared/contracts/api";
import { formatDateTime } from "@/shared/lib/format";

// Accounts of the admin area (amoremio table, with the audit column).
export function UsersTable({
  users,
  canAudit,
}: {
  users: UserAccount[];
  canAudit: boolean;
}) {
  const audit = auditColumn((user: UserAccount) => ({
    entity: "user" as const,
    id: user.id,
    label: user.name,
    createdAt: user.createdAt,
  }));
  const columns: DataTableColumn<UserAccount>[] = [
    {
      key: "name",
      label: "Nome",
      mobile: "title",
      render: (user) => (
        <Link
          href={`/admin/usuarios/${user.id}`}
          className="font-medium text-fg hover:text-accent hover:underline"
        >
          {user.name}
        </Link>
      ),
    },
    {
      key: "login",
      label: "Usuário / e-mail",
      mobile: "subtitle",
      render: (user) => (
        <span className="text-muted">
          {user.username} · {user.email}
        </span>
      ),
    },
    {
      key: "group",
      label: "Grupo",
      render: (user) => GROUP_LABELS[user.group],
    },
    {
      key: "status",
      label: "Situação",
      render: (user) => <UserStatusBadges user={user} />,
    },
    {
      key: "lastLogin",
      label: "Último acesso",
      className: "whitespace-nowrap",
      render: (user) =>
        user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Nunca",
    },
  ];

  return (
    <DataTable
      rows={users}
      columns={canAudit ? [...columns, audit.column] : columns}
      getId={(user) => user.id}
      renderExpanded={canAudit ? audit.renderExpanded : undefined}
    />
  );
}
