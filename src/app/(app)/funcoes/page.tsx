import type { Metadata } from "next";
import { BriefcaseBusiness } from "lucide-react";
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
import { NewBandFunctionButton } from "@/features/members/components/BandFunctionFormDrawer";
import { BandFunctionsTable } from "@/features/members/components/BandFunctionsTable";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { bandFunctionsService } from "@/server/services/band-functions.service";
import { can } from "@/shared/lib/access";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  buildHref,
  firstParam,
  pageParam,
  pageSizeParam,
  pageSizeQuery,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Funções" };

// Only who manages the band (Gestor, Administrador geral): the functions
// feed the member profiles and the rosters.
export default async function BandFunctionsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "MEMBERS_MANAGE")) return <AccessDenied />;

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 120) ?? "";
  const archived = firstParam(params, "arquivadas") === "1";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const functions = await authed((token) =>
    bandFunctionsService.page(token, {
      search,
      archived,
      page,
      limit: pageSize,
    }),
  );
  const filtered = Boolean(search || archived);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/funcoes", {
      busca: search,
      arquivadas: archived ? "1" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Funções"
        description="O que cada um faz na banda além do instrumento (regente, motorista, técnico…): usado no cadastro dos músicos e nas escalas."
        actions={<NewBandFunctionButton />}
      />

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
            placeholder="Nome da função"
          />
          <Select
            label="Exibir"
            name="arquivadas"
            defaultValue={archived ? "1" : ""}
            placeholder="Ativas"
            options={[{ value: "1", label: "Arquivadas" }]}
          />
          <FilterActions
            clearHref={hrefWith({
              busca: undefined,
              arquivadas: undefined,
              page: undefined,
            })}
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {functions.items.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness className="size-5" />}
            title={
              filtered
                ? "Nenhuma função encontrada"
                : "Nenhuma função cadastrada"
            }
            description={
              filtered ? "Tente outros filtros." : "Cadastre em “Nova função”."
            }
          />
        ) : (
          <BandFunctionsTable functions={functions.items} />
        )}
        <Pagination
          page={functions.page}
          totalPages={functions.totalPages}
          total={functions.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
