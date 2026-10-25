import type { Metadata } from "next";
import Link from "next/link";
import { Guitar, Users } from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  PageHeader,
  Pagination,
  Select,
  buttonClasses,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { MembersTable } from "@/features/members/components/MembersTable";
import {
  SECTIONS,
  SECTION_LABELS,
  STATUSES,
  STATUS_LABELS,
} from "@/features/members/model/member-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";
import { can } from "@/shared/lib/access";
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

export const metadata: Metadata = { title: "Músicos" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "MEMBERS_READ")) return <AccessDenied />;
  const canManage = can(user, "MEMBERS_MANAGE");

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 100) ?? "";
  const section = oneOf(firstParam(params, "naipe"), SECTIONS);
  const status = oneOf(firstParam(params, "situacao"), STATUSES);
  const instrumentParam = firstParam(params, "instrumento");
  const instrumentId =
    instrumentParam && UUID.test(instrumentParam) ? instrumentParam : undefined;
  const pending = firstParam(params, "sem-cadastro") === "1";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/musicos", {
      busca: search,
      naipe: section,
      situacao: status,
      instrumento: instrumentId,
      "sem-cadastro": pending ? "1" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  const [roster, instruments] = await authed((token) =>
    Promise.all([
      membersService.roster(token, {
        search,
        section,
        status,
        instrumentId,
        withProfile: pending ? false : undefined,
        page,
        limit: pageSize,
      }),
      membersService.instruments(token),
    ]),
  );
  const filtered = Boolean(
    search || section || status || instrumentId || pending,
  );

  return (
    <>
      <PageHeader
        title="Músicos"
        description="Integrantes da banda: posto, naipe, instrumentos e situação."
        actions={
          canManage ? (
            <Link
              href="/musicos/instrumentos"
              className={buttonClasses("secondary")}
            >
              <Guitar className="size-4" /> Instrumentos
            </Link>
          ) : undefined
        }
      />
      <FilterPanel hasActiveFilters={filtered}>
        <form
          role="search"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
          <Field
            label="Buscar"
            name="busca"
            defaultValue={search}
            placeholder="Nome, nome de guerra ou matrícula"
            className="sm:col-span-2"
          />
          <Select
            label="Naipe"
            name="naipe"
            defaultValue={section ?? ""}
            placeholder="Todos"
            options={SECTIONS.map((value) => ({
              value,
              label: SECTION_LABELS[value],
            }))}
          />
          <Select
            label="Instrumento"
            name="instrumento"
            defaultValue={instrumentId ?? ""}
            placeholder="Todos"
            options={instruments.map((instrument) => ({
              value: instrument.id,
              label: instrument.name,
            }))}
          />
          <Select
            label="Situação"
            name="situacao"
            defaultValue={status ?? ""}
            placeholder="Todas"
            options={STATUSES.map((value) => ({
              value,
              label: STATUS_LABELS[value],
            }))}
          />
          <label className="flex items-end gap-2 pb-2 text-[13px] text-chrome-muted">
            <input
              type="checkbox"
              name="sem-cadastro"
              value="1"
              defaultChecked={pending}
              className="size-4 accent-[var(--brand-gold)]"
            />
            Só sem cadastro
          </label>
          <FilterActions
            clearHref="/musicos"
            hasActiveFilters={filtered}
            className="sm:col-span-2 lg:col-span-3 xl:col-span-6 xl:justify-end"
          />
        </form>
      </FilterPanel>

      <Card>
        {roster.items.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title={filtered ? "Ninguém encontrado" : "Nenhum integrante ainda"}
            description={
              filtered
                ? "Tente outros filtros."
                : "Crie o acesso dos integrantes em Administração › Usuários."
            }
          />
        ) : (
          <MembersTable
            roster={roster.items}
            instruments={instruments}
            canManage={canManage}
            canAudit={can(user, "AUDIT_READ")}
          />
        )}

        <Pagination
          page={roster.page}
          totalPages={roster.totalPages}
          total={roster.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
