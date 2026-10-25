import type { Metadata } from "next";
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
import { UsersTable } from "@/features/admin/components/UsersTable";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { adminService } from "@/server/services/admin.service";
import { assignableGroups, can } from "@/shared/lib/access";
import {
  buildHref,
  firstParam,
  oneOf,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
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
  const pageSize = pageSizeParam(params);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/admin/usuarios", {
      busca: search,
      grupo: group,
      status,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  const users = await authed((token) =>
    adminService.listUsers(token, {
      search,
      group,
      active: status === undefined ? undefined : status === "ativos",
      page,
      limit: pageSize,
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
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
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
          <UsersTable users={users.items} canAudit={can(user, "AUDIT_READ")} />
        )}

        <Pagination
          page={users.page}
          totalPages={users.totalPages}
          total={users.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
