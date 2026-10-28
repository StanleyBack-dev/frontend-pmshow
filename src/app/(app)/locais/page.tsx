import type { Metadata } from "next";
import { MapPin } from "lucide-react";
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
import { NewVenueButton } from "@/features/events/components/VenueFormDrawer";
import { VenuesTable } from "@/features/events/components/VenuesTable";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { eventsService } from "@/server/services/events.service";
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

export const metadata: Metadata = { title: "Locais" };

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "EVENTS_MANAGE")) return <AccessDenied />;

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 120) ?? "";
  const archived = firstParam(params, "arquivados") === "1";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const venues = await authed((token) =>
    eventsService.venuesPage(token, {
      search,
      archived,
      page,
      limit: pageSize,
    }),
  );
  const filtered = Boolean(search || archived);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/locais", {
      busca: search,
      arquivados: archived ? "1" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Locais"
        description="Onde a banda se apresenta: endereço completo e mapa, reaproveitados nos eventos."
        actions={<NewVenueButton />}
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
            placeholder="Nome, rua, bairro ou cidade"
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
              arquivados: undefined,
              page: undefined,
            })}
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {venues.items.length === 0 ? (
          <EmptyState
            icon={<MapPin className="size-5" />}
            title={
              filtered ? "Nenhum local encontrado" : "Nenhum local cadastrado"
            }
            description={
              filtered
                ? "Tente outros filtros."
                : "Cadastre em “Novo local” ou direto no formulário do evento."
            }
          />
        ) : (
          <VenuesTable venues={venues.items} canManage />
        )}
        <Pagination
          page={venues.page}
          totalPages={venues.totalPages}
          total={venues.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
