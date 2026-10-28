import type { Metadata } from "next";
import { Guitar } from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  PageHeader,
  Pagination,
  Select,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { NewInstrumentButton } from "@/features/members/components/InstrumentFormDrawer";
import { InstrumentsTable } from "@/features/members/components/InstrumentsTable";
import {
  SECTIONS,
  SECTION_LABELS,
} from "@/features/members/model/member-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";
import { can } from "@/shared/lib/access";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Instrumentos" };

// Only who manages the band (Gestor, Administrador geral): the catalog
// feeds the member profiles, the rosters and the PDF.
export default async function InstrumentsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "MEMBERS_MANAGE")) return <AccessDenied />;

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 120) ?? "";
  const section = oneOf(firstParam(params, "naipe"), SECTIONS);
  const archived = firstParam(params, "arquivados") === "1";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const instruments = await authed((token) =>
    membersService.instrumentsPage(token, {
      search,
      section,
      archived,
      page,
      limit: pageSize,
    }),
  );
  const filtered = Boolean(search || section || archived);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/instrumentos", {
      busca: search,
      naipe: section,
      arquivados: archived ? "1" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Instrumentos"
        description="Instrumentos e funções da banda, por naipe: usados no cadastro dos músicos, nas escalas e no PDF."
        actions={<NewInstrumentButton />}
      />

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
            placeholder="Nome do instrumento"
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
            label="Exibir"
            name="arquivados"
            defaultValue={archived ? "1" : ""}
            placeholder="Ativos"
            options={[{ value: "1", label: "Arquivados" }]}
          />
          <FilterActions
            clearHref={hrefWith({
              busca: undefined,
              naipe: undefined,
              arquivados: undefined,
              page: undefined,
            })}
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {instruments.items.length === 0 ? (
          <EmptyState
            icon={<Guitar className="size-5" />}
            title={
              filtered
                ? "Nenhum instrumento encontrado"
                : "Nenhum instrumento cadastrado"
            }
            description={
              filtered
                ? "Tente outros filtros."
                : "Cadastre em “Novo instrumento”."
            }
          />
        ) : (
          <InstrumentsTable instruments={instruments.items} />
        )}
        <Pagination
          page={instruments.page}
          totalPages={instruments.totalPages}
          total={instruments.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
