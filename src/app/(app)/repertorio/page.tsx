import type { Metadata } from "next";
import { ListMusic } from "lucide-react";
import {
  Card,
  cn,
  EmptyState,
  FilterActions,
  FilterPanel,
  PageHeader,
  Pagination,
  Select,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { RepertoireTabs } from "@/features/repertoire/components/RepertoireTabs";
import { NewSongButton } from "@/features/repertoire/components/SongButtons";
import { SongsTable } from "@/features/repertoire/components/SongsTable";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STAGE_LABELS,
  STAGES,
} from "@/features/repertoire/model/repertoire-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { repertoireService } from "@/server/services/repertoire.service";
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

export const metadata: Metadata = { title: "Repertório" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function RepertoirePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "REPERTOIRE_READ")) return <AccessDenied />;
  const canManage = can(user, "REPERTOIRE_MANAGE");

  const params = await searchParams;
  const title = firstParam(params, "titulo")?.slice(0, 200) || undefined;
  const artistParam = firstParam(params, "artista");
  const artistId =
    artistParam && UUID.test(artistParam) ? artistParam : undefined;
  const stage = oneOf(firstParam(params, "situacao"), STAGES);
  const category = oneOf(firstParam(params, "categoria"), CATEGORIES);
  const tag = firstParam(params, "tag")?.slice(0, 30) || undefined;
  const archived = canManage && firstParam(params, "arquivadas") === "1";
  const page = pageParam(params);
  const pageSize = pageSizeParam(params);

  const { songs, tags, titles, artists } = await authed((token) =>
    repertoireService.songs(token, {
      title,
      artistId,
      stage,
      category,
      tag,
      archived,
      page,
      limit: pageSize,
    }),
  );
  const filtered = Boolean(title || artistId || stage || category || tag);
  // The archive is one more filter (managers only).
  const filtersActive = filtered || archived;
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/repertorio", {
      titulo: title,
      artista: artistId,
      situacao: stage,
      categoria: category,
      tag,
      arquivadas: archived ? "1" : undefined,
      "por-pagina": pageSizeQuery(pageSize),
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Repertório"
        description="Músicas da banda com áudios para ouvir e vídeos para assistir."
        actions={canManage ? <NewSongButton artists={artists} /> : undefined}
      />
      <RepertoireTabs active="songs" />

      <FilterPanel hasActiveFilters={filtersActive}>
        <form
          role="search"
          className={cn(
            "grid gap-3 sm:grid-cols-2",
            canManage ? "lg:grid-cols-6" : "lg:grid-cols-5",
          )}
        >
          {pageSize !== DEFAULT_PAGE_SIZE && (
            <input type="hidden" name="por-pagina" value={pageSize} />
          )}
          {canManage && (
            <Select
              label="Exibir"
              name="arquivadas"
              defaultValue={archived ? "1" : ""}
              placeholder="No repertório"
              options={[{ value: "1", label: "Arquivadas" }]}
            />
          )}
          <Select
            label="Título"
            name="titulo"
            defaultValue={title ?? ""}
            placeholder="Todos"
            options={titles.map((value) => ({ value, label: value }))}
            disabled={titles.length === 0}
          />
          <Select
            label="Cantor / banda"
            name="artista"
            defaultValue={artistId ?? ""}
            placeholder="Todos"
            options={artists.map((artist) => ({
              value: artist.id,
              label: artist.name,
            }))}
            disabled={artists.length === 0}
          />
          <Select
            label="Situação"
            name="situacao"
            defaultValue={stage ?? ""}
            placeholder="Todas"
            options={STAGES.map((value) => ({
              value,
              label: STAGE_LABELS[value].label,
            }))}
          />
          <Select
            label="Categoria"
            name="categoria"
            defaultValue={category ?? ""}
            placeholder="Todas"
            options={CATEGORIES.map((value) => ({
              value,
              label: CATEGORY_LABELS[value],
            }))}
          />
          <Select
            label="Tag"
            name="tag"
            defaultValue={tag ?? ""}
            placeholder="Todas"
            options={tags.map((value) => ({ value, label: value }))}
            disabled={tags.length === 0}
          />
          <FilterActions
            clearHref={hrefWith({
              titulo: undefined,
              artista: undefined,
              situacao: undefined,
              categoria: undefined,
              tag: undefined,
              arquivadas: undefined,
              page: undefined,
            })}
            hasActiveFilters={filtersActive}
          />
        </form>
      </FilterPanel>

      <Card>
        {songs.items.length === 0 ? (
          <EmptyState
            icon={<ListMusic className="size-5" />}
            title={
              filtered
                ? "Nenhuma música encontrada"
                : archived
                  ? "Nenhuma música arquivada"
                  : "O repertório ainda está vazio"
            }
            description={
              filtered
                ? "Tente outros filtros."
                : canManage && !archived
                  ? "Cadastre a primeira música em “Nova música”."
                  : undefined
            }
          />
        ) : (
          <SongsTable
            songs={songs.items}
            artists={artists}
            canEdit={canManage && !archived}
          />
        )}

        <Pagination
          page={songs.page}
          totalPages={songs.totalPages}
          total={songs.total}
          pageSize={pageSize}
          hrefFor={(target) => hrefWith({ page: target })}
          pageSizes={PAGE_SIZES}
          pageSizeHref={(size) => hrefWith({ "por-pagina": size, page: 1 })}
        />
      </Card>
    </>
  );
}
