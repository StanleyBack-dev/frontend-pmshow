import type { Metadata } from "next";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  Pagination,
  inputClasses,
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
  const selectClasses = `${inputClasses} sm:w-44`;

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-end lg:justify-between">
        <form className="flex flex-1 flex-col gap-2 sm:flex-row" role="search">
          <label className="sr-only" htmlFor="busca">
            Buscar
          </label>
          <input
            id="busca"
            name="busca"
            defaultValue={search}
            placeholder="Nome, usuário ou e-mail"
            className={`${inputClasses} sm:max-w-xs`}
          />
          <select
            name="grupo"
            defaultValue={group ?? ""}
            className={selectClasses}
            aria-label="Grupo"
          >
            <option value="">Todos os grupos</option>
            {GROUPS.map((value) => (
              <option key={value} value={value}>
                {GROUP_LABELS[value]}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={status ?? ""}
            className={selectClasses}
            aria-label="Situação"
          >
            <option value="">Todas as situações</option>
            <option value="ativos">Ativos</option>
            <option value="desativados">Desativados</option>
          </select>
          <Button
            type="submit"
            variant="secondary"
            icon={<Search className="size-4" />}
          >
            Filtrar
          </Button>
        </form>
        <CreateUserButton assignableGroups={assignableGroups(user.group)} />
      </div>

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
  );
}
