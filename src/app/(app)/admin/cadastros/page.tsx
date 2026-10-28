import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
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
import { EnrollmentRequestsTable } from "@/features/enrollment/components/EnrollmentRequestsTable";
import {
  ENROLLMENT_STATUS,
  ENROLLMENT_STATUSES,
} from "@/features/enrollment/model/enrollment-form";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { enrollmentService } from "@/server/services/enrollment.service";
import { membersService } from "@/server/services/members.service";
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

export const metadata: Metadata = { title: "Cadastros" };

// "todas" shows every status; without the parameter, only pending ones.
const STATUS_OPTIONS = [...ENROLLMENT_STATUSES, "TODAS"] as const;

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "USERS_MANAGE")) return <AccessDenied />;

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 80) ?? "";
  const situation =
    oneOf(firstParam(params, "situacao"), STATUS_OPTIONS) ?? "PENDENTE";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/admin/cadastros", {
      busca: search,
      situacao: situation === "PENDENTE" ? undefined : situation,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  const [requests, instruments] = await Promise.all([
    authed((token) =>
      enrollmentService.requests(token, {
        status: situation === "TODAS" ? undefined : situation,
        search,
        page,
        limit: pageSize,
      }),
    ),
    authed((token) => membersService.instruments(token)),
  ]);
  const filtered = Boolean(search) || situation !== "PENDENTE";

  return (
    <>
      <FilterPanel hasActiveFilters={filtered}>
        <form
          role="search"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
          <Field
            label="Buscar"
            name="busca"
            defaultValue={search}
            placeholder="Nome, nome de guerra, RG ou e-mail"
          />
          <Select
            label="Situação"
            name="situacao"
            defaultValue={situation}
            options={[
              ...ENROLLMENT_STATUSES.map((value) => ({
                value,
                label: `${ENROLLMENT_STATUS[value].label}s`,
              })),
              { value: "TODAS", label: "Todas" },
            ]}
          />
          <FilterActions
            clearHref="/admin/cadastros"
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {requests.page.items.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="size-5" />}
            title={
              situation === "PENDENTE" && !search
                ? "Nenhum cadastro aguardando"
                : "Nenhum cadastro encontrado"
            }
            description={
              situation === "PENDENTE" && !search
                ? "Gere o código da turma na aba Links de cadastro e envie para os músicos."
                : "Tente outros filtros."
            }
          />
        ) : (
          <EnrollmentRequestsTable
            requests={requests.page.items}
            instruments={instruments}
            assignableGroups={assignableGroups(user.group)}
          />
        )}

        <Pagination
          page={requests.page.page}
          totalPages={requests.page.totalPages}
          total={requests.page.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
