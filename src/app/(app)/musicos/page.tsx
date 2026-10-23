import type { Metadata } from "next";
import Link from "next/link";
import { Guitar, Search, Users } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  buttonClasses,
  inputClasses,
} from "@/design-system";
import { AccessDenied } from "@/features/access/components/AccessDenied";
import { MemberProfileButton } from "@/features/members/components/MemberProfileButton";
import {
  RANK_LABELS,
  SECTIONS,
  SECTION_LABELS,
  STATUSES,
  STATUS_LABELS,
  formatPhone,
} from "@/features/members/model/member-labels";
import { authed, getSessionUser } from "@/server/auth/current-user";
import { membersService } from "@/server/services/members.service";
import { can } from "@/shared/lib/access";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
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

  const [roster, instruments] = await authed((token) =>
    Promise.all([
      membersService.roster(token, {
        search,
        section,
        status,
        instrumentId,
        withProfile: pending ? false : undefined,
        page,
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
      <Card>
        <form
          className="flex flex-col flex-wrap gap-2 border-b border-border p-4 lg:flex-row"
          role="search"
        >
          <label className="sr-only" htmlFor="busca">
            Buscar
          </label>
          <input
            id="busca"
            name="busca"
            defaultValue={search}
            placeholder="Nome, nome de guerra ou matrícula"
            className={`${inputClasses} lg:max-w-xs`}
          />
          <select
            name="naipe"
            defaultValue={section ?? ""}
            className={`${inputClasses} lg:w-40`}
            aria-label="Naipe"
          >
            <option value="">Todos os naipes</option>
            {SECTIONS.map((value) => (
              <option key={value} value={value}>
                {SECTION_LABELS[value]}
              </option>
            ))}
          </select>
          <select
            name="instrumento"
            defaultValue={instrumentId ?? ""}
            className={`${inputClasses} lg:w-44`}
            aria-label="Instrumento"
          >
            <option value="">Todos os instrumentos</option>
            {instruments.map((instrument) => (
              <option key={instrument.id} value={instrument.id}>
                {instrument.name}
              </option>
            ))}
          </select>
          <select
            name="situacao"
            defaultValue={status ?? ""}
            className={`${inputClasses} lg:w-36`}
            aria-label="Situação"
          >
            <option value="">Todas as situações</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-1 text-sm text-muted">
            <input
              type="checkbox"
              name="sem-cadastro"
              value="1"
              defaultChecked={pending}
              className="size-4 accent-[var(--accent)]"
            />
            Só sem cadastro
          </label>
          <Button
            type="submit"
            variant="secondary"
            icon={<Search className="size-4" />}
          >
            Filtrar
          </Button>
        </form>

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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-soft uppercase">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-medium">Integrante</th>
                  <th className="px-4 py-3 font-medium">Naipe</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Instrumentos
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Telefone
                  </th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                  {canManage && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {roster.items.map((entry) => {
                  const profile = entry.profile;
                  return (
                    <tr
                      key={entry.userId}
                      className="border-b border-border align-top last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-fg">
                          {profile
                            ? `${RANK_LABELS[profile.rank].short} ${profile.warName}`
                            : entry.name}
                        </p>
                        <p className="text-xs text-soft">
                          {profile ? entry.name : "Sem cadastro na banda"}
                          {!entry.active && " · acesso desativado"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {profile ? SECTION_LABELS[profile.section] : "—"}
                      </td>
                      <td className="hidden px-4 py-3 text-muted md:table-cell">
                        {profile?.instruments.length
                          ? profile.instruments
                              .map((item) =>
                                item.primary ? `${item.name} ★` : item.name,
                              )
                              .join(", ")
                          : "—"}
                      </td>
                      <td className="hidden px-4 py-3 whitespace-nowrap text-muted lg:table-cell">
                        {formatPhone(profile?.phone ?? null)}
                      </td>
                      <td className="px-4 py-3">
                        {profile ? (
                          <Badge
                            tone={
                              profile.status === "ATIVO"
                                ? "success"
                                : profile.status === "AFASTADO"
                                  ? "warning"
                                  : "neutral"
                            }
                          >
                            {STATUS_LABELS[profile.status]}
                          </Badge>
                        ) : (
                          <Badge tone="warning">Pendente</Badge>
                        )}
                      </td>
                      {canManage && (
                        <td className="px-4 py-3 text-right">
                          <MemberProfileButton
                            userId={entry.userId}
                            name={entry.name}
                            profile={profile}
                            instruments={instruments}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {roster.totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination
              page={roster.page}
              totalPages={roster.totalPages}
              total={roster.total}
              hrefFor={(target) =>
                buildHref("/musicos", {
                  busca: search,
                  naipe: section,
                  situacao: status,
                  instrumento: instrumentId,
                  "sem-cadastro": pending ? "1" : undefined,
                  page: target,
                })
              }
            />
          </div>
        )}
      </Card>
    </>
  );
}
