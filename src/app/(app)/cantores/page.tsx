import type { Metadata } from "next";
import { MicVocal } from "lucide-react";
import {
  Card,
  EmptyState,
  Field,
  FilterActions,
  FilterPanel,
  PageHeader,
  Pagination,
  SegmentedNav,
  Select,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { NewArtistButton } from "@/features/artists/components/ArtistFormDrawer";
import { ArtistsTable } from "@/features/artists/components/ArtistsTable";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { artistsService } from "@/server/services/artists.service";
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

export const metadata: Metadata = { title: "Cantores e bandas" };

const SONGS_FILTER = {
  com: { label: "Com músicas", withSongs: true },
  sem: { label: "Sem músicas", withSongs: false },
} as const;
const SONGS_OPTIONS = Object.keys(
  SONGS_FILTER,
) as (keyof typeof SONGS_FILTER)[];

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "REPERTOIRE_READ")) return <AccessDenied />;
  const canManage = can(user, "REPERTOIRE_MANAGE");

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 120) ?? "";
  const songs = oneOf(firstParam(params, "musicas"), SONGS_OPTIONS);
  const archived = canManage && firstParam(params, "arquivados") === "1";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const artists = await authed((token) =>
    artistsService.page(token, {
      search,
      archived,
      withSongs: songs ? SONGS_FILTER[songs].withSongs : undefined,
      page,
      limit: pageSize,
    }),
  );
  const filtered = Boolean(search || songs);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/cantores", {
      busca: search,
      musicas: songs,
      arquivados: archived ? "1" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Cantores e bandas"
        description="Intérpretes das músicas do repertório, usados no cadastro e nos filtros."
        actions={canManage ? <NewArtistButton /> : undefined}
      />

      {canManage && (
        <div className="mb-4">
          <SegmentedNav
            label="Cantores ativos ou arquivados"
            items={[
              {
                label: "Ativos",
                href: hrefWith({ arquivados: undefined, page: 1 }),
                active: !archived,
              },
              {
                label: "Arquivados",
                href: hrefWith({ arquivados: "1", page: 1 }),
                active: archived,
              },
            ]}
          />
        </div>
      )}

      <FilterPanel hasActiveFilters={filtered}>
        <form
          role="search"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
          {archived && <input type="hidden" name="arquivados" value="1" />}
          <Field
            label="Nome"
            name="busca"
            defaultValue={search}
            placeholder="Cantor ou banda"
          />
          <Select
            label="Músicas"
            name="musicas"
            defaultValue={songs ?? ""}
            placeholder="Todos"
            options={SONGS_OPTIONS.map((value) => ({
              value,
              label: SONGS_FILTER[value].label,
            }))}
          />
          <FilterActions
            clearHref={hrefWith({
              busca: undefined,
              musicas: undefined,
              page: undefined,
            })}
            hasActiveFilters={filtered}
          />
        </form>
      </FilterPanel>

      <Card>
        {artists.items.length === 0 ? (
          <EmptyState
            icon={<MicVocal className="size-5" />}
            title={
              filtered
                ? "Nenhum cantor ou banda encontrado"
                : archived
                  ? "Nenhum cantor ou banda arquivado"
                  : "Nenhum cantor ou banda cadastrado"
            }
            description={
              filtered
                ? "Tente outros filtros."
                : canManage && !archived
                  ? "Cadastre em “Novo cantor / banda” ou direto no formulário da música."
                  : undefined
            }
          />
        ) : (
          <ArtistsTable artists={artists.items} canManage={canManage} />
        )}

        <Pagination
          page={artists.page}
          totalPages={artists.totalPages}
          total={artists.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
