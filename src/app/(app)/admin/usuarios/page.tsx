import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  Pagination,
  Select,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { GROUP_LABELS, GROUPS } from "@/features/access/model/access-labels";
import { CreateUserButton } from "@/features/admin/components/CreateUserButton";
import { UserStatusBadges } from "@/features/admin/components/UserStatusBadges";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { adminService } from "@/server/services/admin.service";
import { assignableGroups, can } from "@/shared/lib/access";
import { formatDateTime } from "@/shared/lib/format";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Usuários" };

const STATUSES = ["ativos", "desativados"] as const;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "USERS_MANAGE")) return <AccessDenied />;

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 100) ?? "";
  const group = oneOf(firstParam(params, "grupo"), GROUPS);
  const status = oneOf(firstParam(params, "status"), STATUSES);
  const page = pageParam(params);

  const users = await authed((token) =>
    adminService.listUsers(token, {
      search,
      group,
      active: status === undefined ? undefined : status === "ativos",
      page,
    }),
  );
  const filtered = Boolean(search || group || status);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <CreateUserButton assignableGroups={assignableGroups(user.group)} />
      </div>
      <FilterPanel hasActiveFilters={filtered}>
        <form
          role="search"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Field
            label="Buscar"
            name="busca"
            defaultValue={search}
            placeholder="Nome, usuário ou e-mail"
          />
          <Select
            label="Grupo"
            name="grupo"
            defaultValue={group ?? ""}
            placeholder="Todos"
            options={GROUPS.map((value) => ({
              value,
              label: GROUP_LABELS[value],
            }))}
          />
          <Select
            label="Situação"
            name="status"
            defaultValue={status ?? ""}
            placeholder="Todas"
            options={[
              { value: "ativos", label: "Ativos" },
              { value: "desativados", label: "Desativados" },
            ]}
          />
          <FilterActions
            clearHref="/admin/usuarios"
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {users.items.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title={
              filtered ? "Nenhum usuário encontrado" : "Nenhum usuário ainda"
            }
            description={
              filtered
                ? "Tente outros filtros."
                : "Crie o acesso dos integrantes da banda."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-soft uppercase">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Grupo</th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Último acesso
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-surface-muted"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/usuarios/${item.id}`}
                        className="font-medium text-fg hover:text-accent"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-soft">
                        {item.username} · {item.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {GROUP_LABELS[item.group]}
                    </td>
                    <td className="px-4 py-3">
                      <UserStatusBadges user={item} />
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">
                      {item.lastLoginAt
                        ? formatDateTime(item.lastLoginAt)
                        : "Nunca"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination
              page={users.page}
              totalPages={users.totalPages}
              total={users.total}
              hrefFor={(target) =>
                buildHref("/admin/usuarios", {
                  busca: search,
                  grupo: group,
                  status,
                  page: target,
                })
              }
            />
          </div>
        )}
      </Card>
    </>
  );
}
