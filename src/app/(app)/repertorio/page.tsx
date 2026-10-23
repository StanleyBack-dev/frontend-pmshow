import type { Metadata } from "next";
import Link from "next/link";
import { ListMusic, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
  inputClasses,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { NewSongButton } from "@/features/repertoire/components/SongButtons";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  formatDuration,
} from "@/features/repertoire/model/repertoire-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { repertoireService } from "@/server/services/repertoire.service";
import { can } from "@/shared/lib/access";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Repertório" };

export default async function RepertoirePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const user = await getSessionUser();
  if (!can(user, "REPERTOIRE_READ")) return <AccessDenied />;
  const canManage = can(user, "REPERTOIRE_MANAGE");

  const params = await searchParams;
  const search = firstParam(params, "busca")?.slice(0, 100) ?? "";
  const category = oneOf(firstParam(params, "categoria"), CATEGORIES);
  const tag = firstParam(params, "tag")?.slice(0, 30) || undefined;
  const archived = canManage && firstParam(params, "arquivadas") === "1";
  const page = pageParam(params);

  const { songs, tags } = await authed((token) =>
    repertoireService.songs(token, { search, category, tag, archived, page }),
  );
  const filtered = Boolean(search || category || tag);
  const hrefWith = (overrides: Record<string, string | number | undefined>) =>
    buildHref("/repertorio", {
      busca: search,
      categoria: category,
      tag,
      arquivadas: archived ? "1" : undefined,
      ...overrides,
    });

  return (
    <>
      <PageHeader
        title="Repertório"
        description="Músicas da banda com áudios para ouvir e vídeos para assistir."
        actions={canManage ? <NewSongButton /> : undefined}
      />

      {canManage && (
        <div className="mb-4">
          <SegmentedNav
            label="Situação das músicas"
            items={[
              {
                label: "No repertório",
                href: hrefWith({ arquivadas: undefined, page: 1 }),
                active: !archived,
              },
              {
                label: "Arquivadas",
                href: hrefWith({ arquivadas: "1", page: 1 }),
                active: archived,
              },
            ]}
          />
        </div>
      )}

      <Card>
        <form
          className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row"
          role="search"
        >
          {archived && <input type="hidden" name="arquivadas" value="1" />}
          <label className="sr-only" htmlFor="busca">
            Buscar
          </label>
          <input
            id="busca"
            name="busca"
            defaultValue={search}
            placeholder="Título ou compositor"
            className={`${inputClasses} sm:max-w-xs`}
          />
          <select
            name="categoria"
            defaultValue={category ?? ""}
            className={`${inputClasses} sm:w-48`}
            aria-label="Categoria"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
          {tags.length > 0 && (
            <select
              name="tag"
              defaultValue={tag ?? ""}
              className={`${inputClasses} sm:w-44`}
              aria-label="Tag"
            >
              <option value="">Todas as tags</option>
              {tags.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )}
          <Button
            type="submit"
            variant="secondary"
            icon={<Search className="size-4" />}
          >
            Filtrar
          </Button>
        </form>

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
          <ul className="divide-y divide-border">
            {songs.items.map((song) => (
              <li key={song.id}>
                <Link
                  href={`/repertorio/${song.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-fg">{song.title}</p>
                    <p className="truncate text-sm text-muted">
                      {[
                        song.artist,
                        song.musicalKey && `Tom: ${song.musicalKey}`,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                  <Badge tone="neutral">{CATEGORY_LABELS[song.category]}</Badge>
                  <span className="hidden w-12 text-right text-sm text-soft tabular-nums sm:inline">
                    {formatDuration(song.durationSeconds)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {songs.totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination
              page={songs.page}
              totalPages={songs.totalPages}
              total={songs.total}
              hrefFor={(target) => hrefWith({ page: target })}
            />
          </div>
        )}
      </Card>
    </>
  );
}
